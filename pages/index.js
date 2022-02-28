import { Button, Table } from 'react-bootstrap';
import Head from 'next/head';
import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import SkyComponent from '../components/utility_components/SkyComponent';
import CameraControls from '../components/utility_components/CameraControls';
import HabitModal from '../components/HabitModal.jsx';
import CreateModal from '../components/create-modal.jsx';
import { timeKeeper } from '../components/utility_components/Time';
import Tree from '../components/Tree.jsx';
import { getHabits, updateHabit } from '../helpers/ajax';
import { deepCopy } from '../helpers/deepCopy';
import { shrinkTrees } from '../helpers/dateFunctions';
extend({ OrbitControls });

export default function App() {
  //When mutating state - dirtying state, the DOM will not do anything, react will appear as if its not working until you call setState. You will get weird console.logs that do not reflect in react. Always always create a fresh copy of state before mutating and setting.  This is good practice.

  ////Using events in react.  Values passed into an event invocation must be of type React.MututableRefObject<T>, a ref object, to defeat the stale state problem.  On the listening side function, refs must be used to defeat the stale state problem as well.

  const [habits, setHabits] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [modalHabitKey, setModalHabitKey] = useState('default');
  const [createModalShow, setCreateModalShow] = useState(false);
  const [spacing, setSpacing] = useState(1);
  const [compoundFactor, setGrowthFactor] = useState(10 * (1 / 100)); //10% for dev, make 1% later
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
  const checkBoxClicked = useRef();
  const firstDataRender = useRef(false);
  const habitsRef = useRef({});

  //*** Testing */
  //console.log('rendering index');

  //takes place after first render **only**
  useEffect(() => {
    //console.log('initial mount'); //after first render and mount
    getHabitsAndSet(); //causes the second render
    console.log('Start of browser session: ', new Date());
    const intervalTimer = timeKeeper(
      compoundFactor,
      habitsRef,
      getHabitsAndSet
    );

    return () => clearInterval(intervalTimer);
  }, []);

  const getHabitsAndSet = async () => {
    const results = await getHabits();
    console.log('data from db pull', results.data);
    setHabits(results.data);
  };

  useEffect(() => {
    //effect triggers after each change of habits state
    habitsRef.current = habits;
    const trees = Object.values(habits);
    if (trees.length > 0 && !firstDataRender.current) {
      //takes place after second render **only**, our first look at data
      shrinkTrees(trees, compoundFactor);
      firstDataRender.current = true;
    }
    for (let ref of inputs.current) {
      if (habits[ref.name]?.dailyComplete) {
        ref.checked = habits[ref.name].dailyComplete;
      }
    }
  }, [habits]);

  const handleOnCheck = async (e) => {
    const habit = { ...habits[e.target.name] };
    habit.dailyComplete = e.target.checked;
    await updateHabit(habit);
    getHabitsAndSet();
  };

  const openModal = (e) => {
    setModalHabitKey(e.target.title);
    setModalShow(true);
    //this also needs to change color of specific tree by id
  };
  const closeModal = () => {
    setModalShow(false);
  };

  const openCreateModal = () => {
    setCreateModalShow(true);
  };
  const closeCreateModal = () => {
    setCreateModalShow(false);
  };

  const handleSpacing = (e) => {
    if (e.target.name === 'plus') {
      setSpacing(spacing + 1);
    } else if (e.target.name === 'minus') {
      setSpacing(spacing - 1);
    }
  };

  //modulo and division is better thoguht of as how do we get from bottom number to top number using multiples of bottom number.  i.e 6/4 = 1.5 or one 4 + 2
  // 6%4 = 2 or 4*1 + 2.
  // 2/4 = 0.5 or 2%4 = 2 or 4 * 0 + 2
  //commonality is multiple of 4,i.e 4 is remainder 0 so +, 5 is remainder 1 so +, 6 remainder 2 -, 7 remainder 3 -
  //i % 4, 0 && 1 +, 2 && 3 -
  //how do we know to double the factor, this is acheived by math.ceiling, if i is a factor of 4, then increment i to use
  const setXpos = (i, factor = 1) => {
    factor *= Math.ceil((i % 4 === 0 ? i + 1 : i) / 4);
    return i % 4 === 0 || i % 4 === 1 ? factor : -1 * factor;
  };
  const setZpos = (i, factor = 1) => {
    factor *= Math.ceil((i % 4 === 0 ? i + 1 : i) / 4);
    return i % 4 === 1 || i % 4 === 2 ? factor : -1 * factor;
  };

  const calculateScore = (current, initial) => {
    return ((current / initial - 1) * 10).toFixed(2) + '%';
  };

  const generateHabitrows = () => {
    const rowHTML = [];
    Object.values(habits).map((habit) => {
      rowHTML.push(
        <tr key={habit.id}>
          <td>{habit.treemoji}</td>
          <td>{habit.habit}</td>
          <td>{calculateScore(habit.scale, habit.initialScale)}</td>
          <td className="tdCheckBox">
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
              name={habit.id}
            />
          </td>
          <td>
            <Button title={habit.id} onClick={openModal} variant="primary">
              edit
            </Button>
          </td>
        </tr>
      );
    });

    return rowHTML;
  };

  return (
    <>
      <Head>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        </style>
      </Head>
      <div className="title">Habitat</div>
      <CreateModal
        show={createModalShow}
        handleClose={closeCreateModal}
        addHabit={getHabitsAndSet}
      />
      <div className="habitsContainer">
        <Button onClick={openCreateModal} variant="primary">
          Create
        </Button>{' '}
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Icon</th>
              <th>Habit</th>
              <th>Growth</th>
              <th>Complete</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>{generateHabitrows()}</tbody>
        </Table>
      </div>
      <div className="spacing-container">
        <Button
          name="plus"
          onClick={handleSpacing}
          className="spacing-button"
          variant="primary"
        >
          Size +
        </Button>
        <Button name="minus" onClick={handleSpacing} className="spacing-button">
          Size -
        </Button>
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
          {Object.values(habits).length === 0
            ? null
            : Object.values(habits).map((e, i) => (
                <Tree
                  key={e.id}
                  scale={[e.scale, e.scale, e.scale]}
                  position={[setXpos(i, spacing), -1, setZpos(i, spacing)]}
                  habit={e}
                  getHabitsAndSet={getHabitsAndSet}
                  compoundFactor={compoundFactor}
                />
              ))}
        </Suspense>
      </Canvas>
    </>
  );
}
