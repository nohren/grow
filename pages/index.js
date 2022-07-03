import { Button, Table } from 'react-bootstrap';
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
import { getHabits, updateHabit } from '../utils/network';
import { shrinkTrees } from '../utils/dateFunctions';
extend({ OrbitControls });
import axios from 'axios';
import { calculateScore, isNil, setXpos, setZpos } from '../utils/utils';

/**
 * TODO
 * Add eslinting, right now no errors show.  Even when we remove function definitions.  It's a problem.
 *
 */

export default function App() {
  //When mutating state - dirtying state, the DOM will not do anything, react will appear as if its not working until you call setState. You will get weird console.logs that do not reflect in react. Always always create a fresh copy of state before mutating and setting.  This is good practice.

  ////Using events in react.  Values passed into an event invocation must be of type React.MututableRefObject<T>, a ref object, to defeat the stale state problem.  On the listening side function, refs must be used to defeat the stale state problem as well.
  const [joke, setJoke] = useState({});
  const [habits, setHabits] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [modalHabitKey, setModalHabitKey] = useState('default');
  const [createModalShow, setCreateModalShow] = useState(false);
  const [spacing, setSpacing] = useState(1);
  const compoundFactor = 1 * (1 / 100); //10% for dev, make 1% later
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
  console.log(habits);
  console.log(joke);
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
    getAndSetJoke();
    console.log('Start of browser session: ', new Date());
    const intervalTimer = timeKeeper(
      compoundFactor,
      habitsRef,
      getHabitsAndSet
    );
    //new joke every 30 min
    const jokeTimer = setInterval(() => getAndSetJoke(), 1000 * 60 * 30);

    return () => {
      clearInterval(intervalTimer);
      clearInterval(jokeTimer);
    };
  }, []);

  const getHabitsAndSet = async () => {
    const promises = [];
    promises.push(getHabits());
    Promise.all(promises)
      .then((res) => {
        console.log('data from db pull', res[0].data);

        setHabits(res[0].data);
      })
      .catch((err) => console.log(err));
  };

  const getAndSetJoke = async () => {
    const options = {
      method: 'GET',
      url: '/api/jokes',
    };

    try {
      const res = await axios.request(options);
      setJoke(res.data);
    } catch (err) {
      console.log(err);
    }
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

  const createButton = (
    <Button onClick={openCreateModal} variant="primary">
      Create
    </Button>
  );

  const generateHabitrows = (habits) => {
    if (isNil(habits)) {
      return null;
    }
    const rowHTML = [];
    Object.values(habits).map((habit) => {
      rowHTML.push(
        <tr key={habit.id}>
          <td></td>
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
      <span className="positionJoke">
        Daily jokes:
        <div>{joke?.setup ?? joke?.value}</div>
        <div>{joke?.punchline && `...${joke?.punchline}.`}</div>
      </span>
      <div className="title">
        <span className="gameFont">Habitat</span>
      </div>
      <CreateModal
        show={createModalShow}
        handleClose={closeCreateModal}
        addHabit={getHabitsAndSet}
      />
      <div className="habitsContainer">
        <Table striped bordered hover variant="dark">
          <thead>
            <tr className={'headers'}>
              <th>{createButton}</th>
              <th>Icon</th>
              <th>Habit</th>
              <th>Growth</th>
              <th>Complete</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>{generateHabitrows(habits)}</tbody>
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
