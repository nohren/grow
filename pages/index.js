//React is a declarative framework, we don't say how, we just say what we want.
//R3F - a declarative three.js framework with a library of JSX elements (looks like html) of three.js objects / classes. 
//import './App.css';
import { Canvas, useFrame, extend } from '@react-three/fiber'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import Tree from '../components/Tree';
import TimeKeeper from '../components/Time'
import SkyComponent from '../components/SkyComponent'
import HabitModal from '../components/HabitModal';
import ContextModal from '../components/ContextModal'
import CreateModal from '../components/CreateModal'
import { Button } from 'react-bootstrap'
import { Html } from "@react-three/drei";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import CameraControls from '../components/CameraControls'
import ajax from '../components/ajax'
extend({ OrbitControls });

export default function App() {
  //State - directly passed into components.  Want to change the components, change state.
  //dummy data for frontend dev 
  const [habits, setHabits] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [modalHabitKey, setModalHabitKey] = useState('default');
  const [contextMenuShow, setContextMenuShow] = useState(false);
  const [createModalShow, setCreateModalShow] = useState(false);
  const [habitDefault, setHabitDefault] = useState({'default': { id: '', habit: '', treemoji: '', path: '', dailyComplete: false, scale: 0.2, rate: 0.001, frequency: {}, reps: 0, startDate: new Date(), description: '' }})
 
  //refs - state that does not automatically trigger a re-render
  //array of references to input DOM nodes, so we can enable and disable them 
  const inputs = useRef([]);
  const clickedID = useRef('');
  const checkBoxClicked = useRef({});
  useEffect(() => {
    //events
   checkBoxClicked.current = new CustomEvent('checkBoxClicked', {detail: clickedID}); 
   console.log(checkBoxClicked)
   getHabitsAndSet();
 }, [])

  //methods
  const handleAddHabit = (habitObject) => setHabits(habitObject);
  
  const handleChangeHabit = (key, prop, value) => {
    let habitCopy = { ...habits };
    habitCopy[key][prop] = value;
    //setting habits in state prior to growing
    setHabits(habitCopy);
  };

  const handleDeleteHabit = (key) => {
    let habitCopy = { ...habits };
    delete habitCopy[key];
    setHabits(habitCopy);
    console.log(habitCopy)
  };

  const handleOnCheck = (e) => {
    clickedID.current = e.target.name;
    window.dispatchEvent(checkBoxClicked.current);
    let key = e.target.name;
    let prop1 = 'dailyComplete';
    let value1 = e.target.checked;
    let prop2 = 'reps';
    let value2 = habits[e.target.name][prop2] + 1;
    handleChangeHabit(key, prop1, value1);
    handleChangeHabit(key, prop2, value2);
    e.target.disabled = false; //make disabled in actual application

    //todo post to db
  };

  const uncheck = () => {
    let habitCopy = { ...habits };
    for (let key in habitCopy) {
      habitCopy[key].dailyComplete = false;
    }
    setHabits(habitCopy);
    for (let i = 0; i < inputs.current.length; i++) {
      inputs.current[i].disabled = false;
    }
    //todo post to db

  };


  const getHabitsAndSet = () => {
    ajax.getHabits((habits) => {
      console.log(habits.data)
      setHabits(habits.data);
    })
  };

 
  const openModal = (e) => {
    setModalHabitKey(e.target.title);
    setModalShow(true);
    //this also needs to change color of specific tree by id
    
  };
  const closeModal = () => {
    setModalShow(false);
  };

  const openDeleteModal = (e) => {
    setModalHabitKey(e.target.title);
    setContextMenuShow(true);
    e.preventDefault();
  };
  const closeDeleteModal = () => {
    //todo delete habit in db
    setContextMenuShow(false);
  };

  const openCreateModal = () => {
     setCreateModalShow(true);
  };
  const closeCreateModal = () => {
    setCreateModalShow(false);
  };

  //modulo and division is better thoguht of as how do we get from bottom number to top number using multiples of bottom number.  i.e 6/4 = 1.5 or one 4 + 2
  // 6%4 = 2 or 4*1 + 2.  
  // 2/4 = 0.5 or 2%4 = 2 or 4 * 0 + 2
  //commonality is multiple of 4,i.e 4 is remainder 0 so +, 5 is remainder 1 so +, 6 remainder 2 -, 7 remainder 3 -
  //i % 4, 0 && 1 +, 2 && 3 -
  //how do we know to double the factor, this is acheived by math.ceiling, if i is a factor of 4, then increment i to use 
  let setXpos = (i) => {
    let factor = 1;
    factor *= Math.ceil((i % 4 === 0 ? i + 1: i) / 4);
    return i % 4 === 0 || i % 4 === 1 ? factor: -1 * factor;
  }
  let setZpos = (i) => {
    let factor = 1;
    factor *= Math.ceil((i % 4 === 0 ? i + 1: i) / 4);
    return i % 4 === 1 || i % 4 === 2 ? factor: -1 * factor;
  }
  

  //rendering HTML with javascript embedded (JSX).  Biggest pitfall is trying to render some property of an undefined object. Have a fall back render in case the info isn't as expected.
  return (
    <>
       <TimeKeeper
        uncheck={uncheck}
      />
      <CreateModal show={createModalShow} handleClose={closeCreateModal} addHabit={handleAddHabit}/>
      <div className="habitsContainer">
        <Button onClick={openCreateModal} variant="primary">Create</Button>{' '}
        {Object.values(habits).map((e) => (
           Object.values(habits).length === 0 || e.path === '' ? null :
            <div className="habit" key={e.id} >
              <span title={e.id} onClick={openModal} style={{ marginRight: '15px' }}>
                {e.habit}{' '}
                {e.treemoji}
              </span>
              <input ref={(input) => {
                if (input !== null && inputs.current.length < Object.keys(habits).length) inputs.current.push(input)
              }
              } className="checkbox" type="checkbox" onChange={handleOnCheck} name={e.id} checked={e.dailyComplete} />
            </div>
        ))}
      </div>
      <HabitModal show={modalShow} onHide={closeModal} readrender={getHabitsAndSet} modalhabit={habits[modalHabitKey] ? habits[modalHabitKey] : habitDefault['default']} />
      <Canvas className="canvas-container">
        <CameraControls />
        <ambientLight intensity={0.1} />
        <directionalLight color="white" position={[1, 1, 10]} />
        <Suspense fallback={<Html center><h1>loading trees...</h1></Html>}>
          <SkyComponent />
          {Object.values(habits).map((e, i) => (
            Object.values(habits).length === 0 || e.path === '' ? null :
              <Tree
                key={e.id}
                scale={[e.scale, e.scale, e.scale]}
                position={[setXpos(i), -1, setZpos(i)]}
                habit={e}
                getHabitsAndSet={getHabitsAndSet}
              />
          ))}
        </Suspense>
      </Canvas>
    </>
  );
}



