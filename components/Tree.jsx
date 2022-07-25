import React, { useEffect, useRef, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import Palm from './gltf_tree_instances/Palm';
import Spruce from './gltf_tree_instances/Spruce';
import Dec from './gltf_tree_instances/Dec';
import FallingLeaves from './gltf_tree_instances/FallingLeaves';
import Bush from './gltf_tree_instances/Bush';
import Cactus from './gltf_tree_instances/Cactus';
import { updateHabit } from '../utils/network';
import { isNil } from '../utils/utils';
import { getCurrentTimeStamp } from '../utils/dateFunctions';
import { setXpos, setZpos } from '../utils/utils';
import habitConfig from '../utils/habitConfig';
const { animationRate } = habitConfig;
export default function Tree(props) {
  const { updateView, habit, growCallBack, spacing, index } = props;
  const { id, repsAdjusted, path, reps, repsSinceDecay } = habit;

  const scaleArray = [
    habitConfig.getY(repsAdjusted),
    habitConfig.getY(repsAdjusted),
    habitConfig.getY(repsAdjusted),
  ];

  const position = [setXpos(index, spacing), -1, setZpos(index, spacing)];

  const tree = useRef();
  const grow = useRef(false);
  const shrink = useRef(false);
  const growthTarget = useRef();
  const shrinkTarget = useRef();
  const passScalePropsFromDOM = useRef(false);

  //REFS: animating directly on the DOM and using listeners.
  //While we are animating, we don't care to have multiple renders going on.  No useState then.

  useEffect(() => {
    //any state or props accessed from a function attached to a listener, will be stale.  Need to use a ref. This is because the listener belongs only to the initial render.
    window.addEventListener('shrink', handleShrink);

    return () => window.removeEventListener('shrink', handleShrink);
  }, []);

  useFrame(() => {
    if (grow.current) growInFrames();
    else if (shrink.current) shrinkInFrames();
  });

  if (isNil(path)) {
    return null;
  }
  // an abstract machine that can be in exactly one of a finite number of states at any given time. The FSM can change from one state to another in response to some inputs; the change from one state to another is called a transition. An FSM is defined by a list of its states, its initial state, and the inputs that trigger each transition

  //creating my own custom state machine for 2 reasons.
  //1. I want to avoid both growing and shrinking at the same time
  //2. I want the tree to pass props as DOM scale until the db is updated. Then revert to state scale.This avoids the problem of another tree initiating a setstate with old db info, and resetting the scale of this tree for a moment of time before this tree can update the db and call setstate.

  const mutateDOMStateMachine = (stateType) => {
    switch (stateType) {
      case 'grow':
        //check to see if growing or shrinking, prevent state transition if so.
        if (grow.current || shrink.current) return;

        //grow
        grow.current = true;
        shrink.current = false;
        passScalePropsFromDOM.current = true;
        return;

      case 'shrink':
        //check to see if growing or shrinking, prevent state transition if so.
        if (grow.current || shrink.current) return;
        shrink.current = true;
        grow.current = false;
        passScalePropsFromDOM.current = true;
        return;

      case 'static-post-db-update':
        grow.current = false;
        shrink.current = false;
        passScalePropsFromDOM.current = false;
        return;

      case 'static-pre-db-update':
        grow.current = false;
        shrink.current = false;
        passScalePropsFromDOM.current = true;
        return;
    }
  };

  const handleShrink = (event) => {
    console.log('from tree component shrink event listener: ', event.detail);
    if (id === event.detail.id) {
      const { daysDecayed, daysGrown } = event.detail ?? {};
      const target = habitConfig.getY(
        habitConfig.decayX(repsAdjusted, daysDecayed, daysGrown)
      );
      shrinkTarget.current = target > 0 ? target : 0;
      mutateDOMStateMachine('shrink');
    }
  };

  const handleGrowth = (_id) => {
    if (_id === id) {
      growthTarget.current = habitConfig.getY(habitConfig.growX(repsAdjusted));
      mutateDOMStateMachine('grow');
    }
  };

  growCallBack.current.push(handleGrowth);

  //always mutate the instance DOM in animation frames, don't use react set state functionality.
  //when finished return promise to signify proccess is complete
  const growInFrames = async () => {
    tree.current.scale.x += animationRate;
    tree.current.scale.y += animationRate;
    tree.current.scale.z += animationRate;

    if (tree.current.scale.x >= growthTarget.current) {
      mutateDOMStateMachine('static-pre-db-update');
      const now = getCurrentTimeStamp();
      const shallowCopyRSD = [...repsSinceDecay];
      shallowCopyRSD.push(now);
      await updateHabit({
        ...habit,
        repsAdjusted: habitConfig.getX(growthTarget.current),
        lastCompleted: now,
        repsSinceDecay: shallowCopyRSD,
        reps: reps + 1,
      });
      await updateView();
      mutateDOMStateMachine('static-post-db-update');
    }
  };

  const shrinkInFrames = async () => {
    tree.current.scale.x -= animationRate;
    tree.current.scale.y -= animationRate;
    tree.current.scale.z -= animationRate;

    if (tree.current.scale.x <= shrinkTarget.current) {
      mutateDOMStateMachine('static-pre-db-update');
      await updateHabit({
        ...habit,
        repsAdjusted: habitConfig.getX(shrinkTarget.current),
        lastDecayed: getCurrentTimeStamp(),
        repsSinceDecay: [],
      });
      await updateView();
      mutateDOMStateMachine('static-post-db-update');
    }
  };

  const Model = forwardRef(function modelState(props, ref) {
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

  //passing props on each render, if another tree gets checked, props will be passed down, while we are growing we don't want to a accept a stale tree prop from state, so instead we pass in the current ref scale value that is the current value while it is growing.
  return (
    <Model
      path={path}
      data={habit}
      ref={tree}
      scale={
        passScalePropsFromDOM.current
          ? [tree.current.scale.x, tree.current.scale.y, tree.current.scale.z]
          : scaleArray
      }
      position={position}
      // onPointerOver={() => console.log(habit.habit)}
      // onPointerLeave={}
    />
  );
}
