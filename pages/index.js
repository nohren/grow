import { Button, Table, Accordion } from 'react-bootstrap';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Canvas, extend } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import SkyComponent from '../components/utility_components/SkyComponent';
import CameraControls from '../components/utility_components/CameraControls';
import Modal from '../components/Modal';
import { timeKeeper } from '../components/utility_components/Time';
import Tree from '../components/Tree';
import { getHabits, updateHabit } from '../utils/network';
import { decayHabits, isToday } from '../utils/dateFunctions';
extend({ OrbitControls });
import axios from 'axios';
import { calculateScore, isNil, setXpos, setZpos } from '../utils/utils';
import { Button as MUIbutton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          background: 'linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%)',
        },
      },
    },
  },
  palette: {
    success: {
      main: '#66FF00',
      contrastText: '#fff',
    },
  },
});

/**
 * TODO
 * Bugfix/
 *  Checked items are not getting checked off at midnight
 * Better sizing of table, allow adjustability
 * Tooltips for habit name and limit name length
 * enter button for form clicks
 * clean code
 * pub sub for multi device push
 * apple watch app connect
 * generic habit modal component
 */

/**
 * When we grow, as long as we score it as a 1% gain, then we are good.  The premise being, 1% an occurence. or 37x the principle per year if we occur each day.
 * 1 => 1.01... etc
 * To account for minimal growth in beginning, we up it by factor of 10
 *
 * Decay is represented as 1/7% decay per uncompleted day.  You lose once habit occurence's worth of neurons in one week of inactivity.
 *
 * Config below.
 */
export const factor = 10;
export const growthRate = factor * (1 / 100);
export const decayRate = factor * ((1 / 7) * (1 / 100));
//********************************* end config

export default function App() {
  const [joke, setJoke] = useState({});
  const [habits, setHabits] = useState({});
  const [spacing, setSpacing] = useState(1);

  console.log(habits);

  //refs - state that does not automatically trigger a re-render.
  const firstDataRender = useRef(false);
  const habitsRef = useRef({});
  const growCallBack = useRef([]);
  const openModalCallBack = useRef(null);

  useEffect(() => {
    //triggered once after first render and mount
    // below causes the second render, when useEffect is finished running.
    updateView();
    //getAndSetJoke();

    console.log('Start of browser session: ', new Date());
    //why the ref and not from state?
    const intervalTimer = timeKeeper(habitsRef);

    //const jokeTimer = setInterval(() => getAndSetJoke(), 1000 * 60 * 30);

    return () => {
      clearInterval(intervalTimer);
      //clearInterval(jokeTimer);
    };
  }, []);

  const updateView = async () => {
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
      decayHabits(trees, decayRate);
      firstDataRender.current = true;
    }
  }, [habits]);

  const handleSpacing = (e) => {
    if (e.target.name === 'plus') {
      setSpacing(spacing + 1);
    } else if (e.target.name === 'minus') {
      setSpacing(spacing - 1);
    }
  };

  const createButton = (
    <Button
      onClick={() => openModalCallBack.current?.('create')}
      variant="primary"
    >
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
          <td>{habit.name}</td>
          <td>{calculateScore(habit.scale, habit.initialScale)}</td>
          <td>
            <ThemeProvider theme={theme}>
              <MUIbutton
                className="growButton"
                variant={
                  isToday(habit.lastCompletedDate) ? 'contained' : 'outlined'
                }
                color={isToday(habit.lastCompletedDate) ? 'success' : 'primary'}
                name={habit.id}
                onClick={() => {
                  growCallBack.current?.map((func) => {
                    func?.(habit.id);
                  });
                }}
              >
                Grow
              </MUIbutton>
            </ThemeProvider>
          </td>
          <td>
            <Button
              onClick={() => openModalCallBack.current?.('edit', habit.id)}
              variant="primary"
              className={'samSkin'}
            >
              <div style={{ visibility: 'hidden' }}>GROW</div>
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
      <div className="habitsContainer">
        <div>
          <Button
            name="plus"
            onClick={handleSpacing}
            className="spacing-button"
            variant="light"
          >
            Size +
          </Button>
          <Button
            variant="light"
            name="minus"
            onClick={handleSpacing}
            className="spacing-button"
          >
            Size -
          </Button>
        </div>
        <Accordion>
          <Accordion.Item /*eventKey="0"*/>
            <Accordion.Header>Habits</Accordion.Header>
            <Accordion.Body>
              <Table
                className="tableWidth"
                striped
                bordered
                hover
                variant="dark"
              >
                <thead>
                  <tr>
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
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>

      <Modal
        updateView={updateView}
        data={habits}
        openModalCallBack={openModalCallBack}
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
          {Object.values(habits ?? {}).map((habit, index) => (
            <Tree
              key={habit.id}
              scale={[habit.scale, habit.scale, habit.scale]}
              position={[setXpos(index, spacing), -1, setZpos(index, spacing)]}
              habit={habit}
              updateView={updateView}
              growCallBack={growCallBack}
            />
          ))}
        </Suspense>
      </Canvas>
    </>
  );
}
