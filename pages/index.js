import { Button, Table, Accordion } from 'react-bootstrap';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Canvas, extend } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import SkyComponent from '../components/utility_components/SkyComponent';
import CameraControls from '../components/utility_components/CameraControls';
import Modal from '../components/Modal';
import { poll } from '../utils/dateFunctions';
import Tree from '../components/Tree';
import { getHabits } from '../utils/network';
import { isToday } from '../utils/dateFunctions';
extend({ OrbitControls });
import axios from 'axios';
import { isNil } from '../utils/utils';
import { Button as MUIbutton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import InfoIcon from '../components/icons/InfoIcon';
import Tooltip from '../components/Tooltip';
import LogarithmicLine from '../components/charts/LogarithmicLine';
//import Congrats from '../components/Congrats';
//import habitConfig from '../utils/habitConfig';
//import { TestButtons } from '../testing/test';

const theme = createTheme({
  palette: {
    success: {
      main: '#39FF14',
      contrastText: '#fff',
    },
  },
});

/**
 * See habit config for app premise.
 *
 * TODO
 *
 * Bugfix/
 * pub sub for multi device push
 * apple watch app connect
 * generic habit modal component
 */

export default function App() {
  //state

  //React State
  //persists between renders and triggers a view update.
  const [joke, setJoke] = useState({});
  const [habits, setHabits] = useState(null);
  const [spacing, setSpacing] = useState(1);

  console.log(`Habit data from Index.js`, habits);

  //React Ref
  //persists between renders and does not trigger a view update.
  const growCallBack = useRef({});
  const openModalCallBack = useRef(null);
  const habitRef = useRef(null);
  const onRender = useRef(true);

  useEffect(() => {
    updateView();
    getAndSetJoke();
    const jokeTimer = setInterval(() => getAndSetJoke(), 1000 * 60 * 30);

    const isDecayTimePoll = setInterval(() => poll(habitRef), 1000 * 60 * 30);

    return () => {
      clearInterval(jokeTimer);
      clearInterval(isDecayTimePoll);
    };
  }, []);

  //update habit ref.  Run on check on componentDidMount
  useEffect(() => {
    habitRef.current = habits;
    if (!isNil(habits) && onRender.current) {
      poll(habitRef);
      onRender.current = false;
    }
    console.log('growcallback ref', growCallBack);
    console.log('open modal callback ref', openModalCallBack);
  }, [habits]);

  const updateView = () => {
    getHabits()
      .then((res) => {
        setHabits(res.data);
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
          <td className="chartWidth">
            <LogarithmicLine {...habit} />
          </td>
          <td>
            <ThemeProvider theme={theme}>
              <MUIbutton
                className="growButton"
                variant={
                  isToday(habit.lastCompleted) ? 'contained' : 'outlined'
                }
                color={isToday(habit.lastCompleted) ? 'success' : 'primary'}
                name={habit.id}
                onClick={growCallBack.current[habit.id]}
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

  const TooltipTitleFormatter = (props) => {
    const { value, addClassName } = props;
    return (
      <>
        {value.map((text, idx) => (
          <div className={addClassName} key={idx}>
            {text}
          </div>
        ))}
      </>
    );
  };

  const isCongrats = (habits, repsGoal) => {
    const arr = Object.values(habits ?? {});
    for (const item of arr) {
      if (item.repsAdjusted > repsGoal) {
        return true;
      }
    }
    return false;
  };

  return (
    <>
      {/* {isCongrats(habits, repsGoal) && <Congrats />} */}
      {/* <TestButtons habits={habits} /> */}
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
            <Accordion.Header>
              <div>
                Advance 1% each day, 37x each year towards your goal using
                habits.
              </div>
              <div>
                <Tooltip
                  arrow
                  title={
                    <TooltipTitleFormatter
                      addClassName="lineSpacing"
                      value={[
                        'The outcome of your goals are a lagging measure of your habits.',
                        '...Your net worth is a lagging measure of your financial habits.',
                        '...Your knowledge is a lagging measure of your learning habits.',
                        '...Your dental health is a lagging measure of your brushing and flossing.',
                      ]}
                    />
                  }
                >
                  <span>
                    <InfoIcon addClassName="infoIcon" />
                  </span>
                </Tooltip>
              </div>
            </Accordion.Header>
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
              spacing={spacing}
              index={index}
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
