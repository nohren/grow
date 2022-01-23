import { Button } from 'react-bootstrap';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import SkyComponent from '../components/utility_components/SkyComponent';
import CameraControls from '../components/utility_components/CameraControls';
import HabitModal from '../components/HabitModal.jsx';
import CreateModal from '../components/create-modal.jsx';
import TimeKeeper from '../components/utility_components/Time';
import Tree from '../components/Tree.jsx';
import { getHabits } from '../helpers/ajax';
import { deepCopy } from '../helpers/deepCopy';
import { dateThreshold } from '../helpers/dateFunctions';
extend({ OrbitControls });

export default function App() {
  //Keep state pure - when mutating state, the DOM will not do anything, react will appear is if its not working until you call setState. You will get weird console.logs that do not reflect in react. Always always create a fresh copy of state before mutating and setting.  This is good practice.

  const [habits, setHabits] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [modalHabitKey, setModalHabitKey] = useState('default');
  const [contextMenuShow, setContextMenuShow] = useState(false);
  const [createModalShow, setCreateModalShow] = useState(false);
  const [habitDefault, setHabitDefault] = useState({
    default: {
      id: '',
      habit: '',
      treemoji: '',
      path: '',
      dailyComplete: false,
      scale: 0.2,
      rate: 0.001,
      frequency: {},
      reps: 0,
      startDate: new Date(),
      description: '',
      dateLastCompleted: new Date(),
    },
  });

  //refs - state that does not automatically trigger a re-render.  An array of references to input DOM nodes, so we can enable and disable them
  const inputs = useRef([]);
  const clickedID = useRef('');
  const checkedFlag = useRef(false);
  const violatorID = useRef({});
  const checkBoxClicked = useRef({});
  const shrinkTree = useRef({});

  useEffect(() => {
    //Using events in react.  Values passed into an event invocation must be of type React.MututableRefObject<T>, a ref object, to defeat the stale state problem.  On the listening side function, refs must be used to defeat the stale state problem as well.

    checkBoxClicked.current = new CustomEvent('checkBoxClicked', {
      detail: {
        id: clickedID,
        checked: checkedFlag,
      },
    });
    shrinkTree.current = new CustomEvent('shrink', {
      detail: {
        id: violatorID.current,
      },
    });

    getHabitsAndSet();
  }, []);

  //check to see if there are habits, dispatch to Tree component the offenders and id's of those not yet completed in required time.
  useEffect(() => {
    const trees = Object.values(habits);
    if (trees.length > 0) {
      const violators = trees.filter((tree) => {
        const threshold = dateThreshold(tree.dateLastCompleted, 1);
        return Date.now() > threshold;
      });
      violators.map((tree) => {
        violatorID.current = tree.id;
        window.dispatchEvent(shrinkTree.current);
      });
    }
  }, [habits]);

  //methods
  const handleAddHabit = (habitObject) => setHabits(habitObject);

  const handleChangeHabit = (key, prop, value) => {
    let habitCopy = { ...habits };
    habitCopy[key][prop] = value;
    //setting habits in state prior to growing
    console.log('from function: ', habitCopy);
    setHabits(habitCopy);
  };

  //when clicked, e.target.checked will give the value it is now supposed to be.
  // if it was checked, it will return false for unchecked
  // if unchecked, it will return false for checked.
  // this is a controlled state with habit.dailyComplete
  const handleOnCheck = (e) => {
    const habit = deepCopy(habits[e.target.name]);
    console.log(habit);

    // clickedID.current = e.target.name;
    // checkedFlag.current = !e.target.checked;
    // window.dispatchEvent(checkBoxClicked.current);
    // let key = e.target.name;
    // let prop1 = 'dailyComplete';
    // let value1 = e.target.checked;
    // let prop2 = 'reps';
    // let value2 = habits[e.target.name][prop2] + 1;
    // //console.log("checked value: ", value1)
    // handleChangeHabit(key, prop1, value1);
    // handleChangeHabit(key, prop2, value2);
    // e.target.disabled = false; //make disabled in actual application
  };

  const uncheck = () => {
    let habitCopy = { ...habits };
    for (let key in habitCopy) {
      habitCopy[key].dailyComplete = false;
    }
    setHabits(habitCopy);

    //uncheck all habits
    for (let i = 0; i < inputs.current.length; i++) {
      inputs.current[i].disabled = false;
    }
    //todo post to db
  };

  const getHabitsAndSet = () => {
    getHabits((results) => {
      console.log('data from db pull', results.data);
      setHabits(results.data);
    });
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
    factor *= Math.ceil((i % 4 === 0 ? i + 1 : i) / 4);
    return i % 4 === 0 || i % 4 === 1 ? factor : -1 * factor;
  };
  let setZpos = (i) => {
    let factor = 1;
    factor *= Math.ceil((i % 4 === 0 ? i + 1 : i) / 4);
    return i % 4 === 1 || i % 4 === 2 ? factor : -1 * factor;
  };

  //rendering HTML with javascript embedded (JSX).  Biggest pitfall is trying to render some property of an undefined object. Have a fall back render in case the info isn't as expected.  Actually better to handle this in the child component as a conditional render, than carrying a new piece of state just for this, also simplifies this greatly
  return (
    <>
      {/* <TimeKeeper uncheck={uncheck} /> */}
      <CreateModal
        show={createModalShow}
        handleClose={closeCreateModal}
        addHabit={handleAddHabit}
      />
      <div className="habitsContainer">
        <Button onClick={openCreateModal} variant="primary">
          Create
        </Button>{' '}
        {Object.values(habits).map((e) =>
          Object.values(habits).length === 0 || e.path === '' ? null : (
            <div className="habit" key={e.id}>
              <div title={e.id} onClick={openModal} className="labels">
                {e.habit} {e.treemoji}
              </div>
              <input
                ref={
                  //anonymous function pushing this input DOM node to the ref array for the purpose of disabling the checkbox
                  (input) => {
                    if (
                      input !== null &&
                      inputs.current.length < Object.keys(habits).length
                    )
                      inputs.current.push(input);
                  }
                }
                className="checkbox"
                type="checkbox"
                onChange={handleOnCheck}
                name={e.id}
                checked={e.dailyComplete}
              />
            </div>
          )
        )}
      </div>
      <HabitModal
        show={modalShow}
        onHide={closeModal}
        readrender={getHabitsAndSet}
        modalhabit={
          habits[modalHabitKey]
            ? habits[modalHabitKey]
            : habitDefault['default']
        }
      />
      <Canvas className="canvas-container">
        <CameraControls />
        <ambientLight intensity={0.1} />
        <directionalLight color="white" position={[1, 1, 10]} />
        <Suspense
          fallback={
            <Html center>
              <h1>loading trees...</h1>
            </Html>
          }
        >
          <SkyComponent />
          {Object.values(habits).map((e, i) =>
            Object.values(habits).length === 0 || e.path === '' ? null : (
              <Tree
                key={e.id}
                scale={[e.scale, e.scale, e.scale]}
                position={[setXpos(i), -1, setZpos(i)]}
                habit={e}
                getHabitsAndSet={getHabitsAndSet}
              />
            )
          )}
        </Suspense>
      </Canvas>
    </>
  );
}
