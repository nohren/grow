import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Palm from './gltf_tree_instances/Palm';
import Spruce from './gltf_tree_instances/Spruce';
import Dec from './gltf_tree_instances/Dec';
import FallingLeaves from './gltf_tree_instances/FallingLeaves';
import Bush from './gltf_tree_instances/Bush';
import Cactus from './gltf_tree_instances/Cactus';
import { updateHabit } from '../helpers/ajax';
import { deepCopy } from '../helpers/deepCopy';

export default function Tree({ getHabitsAndSet, position, scale, habit }) {
  //work around for event listener function.  Only subscribes at app start and function state is captured for reference but turns stale.
  //in order to have an up to date prop, we need to store the prop and its changing value in a ref where the function scope can capture it.
  //curious why the initial scope can refer to an updated ref, but not a prop?  I believe its because a prop is a value type and a
  //ref is an object, so we are copying the reference, ahhh that's why they call it a ref.  We got the address, not the value. which changes.

  const growthFactor = 1.3;

  const dailyCompleteRef = useRef(0);
  const tree = useRef();
  const grow = useRef();
  const growthTarget = useRef();
  //for the function encapsulated in the listener
  const scaleRef = useRef(habit.scale);
  const habitRef = useRef({});

  //const [scale, setScale] = useState(0.2);
  //const [grow, setGrow] = useState(false);
  const [shrink, setShrink] = useState(false);
  const [rate, setRate] = useState(0.01);

  useEffect(() => {
    //tree state adjusted for GLTF object units eccentricityy
    // setScale(dbScale);
    // setRate(dbRate);

    const cleanup = () => {
      // todo post scale to the db
    };
    //any state or props accessed from a function attached to a listener, will be stale.  Need to use a ref. This is because the listener belongs ot the initial render.
    window.addEventListener('dayClosed', handleDayClosed);
    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('checkBoxClicked', handleClickedCheck);
    window.addEventListener('shrink', handleShrink);

    return () => {
      window.removeEventListener('beforeunload', cleanup);
      window.removeEventListener('dayClosed', handleDayClosed);
      window.removeEventListener('checkBoxClicked', handleClickedCheck);
      window.removeEventListener('shrink', handleShrink);
    };
  }, []);

  useEffect(() => {
    console.log('habits changed in tree', habit);
    habitRef.current = habit;
    scaleRef.current = habit.scale;
    dailyCompleteRef.current = habit.dailyComplete;
  }, [habit]);

  const handleClickedCheck = (e) => {
    // check that id matches and if we are checked
    const id = e.detail.id.current;
    const checked = e.detail.checked.current;
    if (id === habitRef.current.id && checked === false) {
      handleGrowth();
    } else if (id === habitRef.current.id && checked === true) {
      //again its a nasty event issue, with stale props and state
      //when you deal in events in react you deal with nasty stale props and state
      updateHabit(
        {
          ...deepCopy(habitRef.current),
          dailyComplete: false,
        },
        (err, response) => {
          if (response) getHabitsAndSet();
        }
      );
    }
  };

  let handleDayClosed = () => {
    //console.log(treemoji + ' ' + dailyCompleteRef.current)
    if (!dailyCompleteRef.current) handleShrink();
  };

  useFrame(() => {
    if (grow.current) growInFrames();
    else if (shrink) shrinkInFrames();
  });

  //always mutate component props in animation frames, don't use react set state
  //its almost like this way interupts the animation, when it has to
  let growInFrames = () => {
    tree.current.scale.x += habit.rate;
    tree.current.scale.y += habit.rate;
    tree.current.scale.z += habit.rate;

    if (tree.current.scale.x >= growthTarget.current) {
      grow.current = false;
      updateHabit(
        {
          ...habit,
          scale: tree.current.scale.x,
          dateLastCompleted: new Date(),
          dailyComplete: true,
          reps: habit.reps + 1,
        },
        (err, response) => {
          if (response) getHabitsAndSet();
        }
      );
    }
  };
  let shrinkInFrames = () => {
    tree.current.scale.x -= habit.rate;
    tree.current.scale.y -= habit.rate;
    tree.current.scale.z -= habit.rate;
  };

  const handleGrowth = () => {
    growthTarget.current = scaleRef.current * growthFactor;
    grow.current = true;
  };

  let handleShrink = (event) => {
    console.log('from shrink event listener: ', event.detail);
    // setShrink(true);
    // setTimeout(() => {
    //   setShrink(false)
    //   //setScale(tree.current.scale.x)
    //   //todo post new scale in dbh
    // }, 1000);
  };

  // passing the ref for this component instance down to the respective model that gets rendered
  const Model = forwardRef((props, ref) => {
    switch (props.path) {
      case 'Palm.glb':
        return <Palm ref={ref} {...props} />;

      case 'Spruce.glb':
        return <Spruce ref={ref} {...props} />;

      case 'Bush.glb':
        return <Bush ref={ref} {...props} />;

      case 'Cactus.glb':
        return <Cactus ref={ref} {...props} />;

      case 'dec.glb':
        return <Dec ref={ref} {...props} />;

      case 'fallingLeaves.glb':
        return <FallingLeaves ref={ref} {...props} />;

      default:
        console.error('no glb model for: ', props.path);
    }
  });

  return (
    <Model
      path={habit.path}
      info={habit}
      ref={tree}
      scale={scale}
      position={position}
      // onPointerDown={highlightHabit}
    />
  );
}
