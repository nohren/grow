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
import { updateHabit } from '../utils/network';
import { deepCopy } from '../utils/deepCopy';

export default function Tree({
  getHabitsAndSet,
  position,
  scale,
  habit,
  compoundFactor,
}) {
  //work around for event listener function.  Only subscribes at app start and function state is captured for reference but turns stale.
  //in order to have an up to date prop, we need to store the prop and its changing value in a ref where the function scope can capture it.
  //curious why the initial scope can refer to an updated ref, but not a prop?  I believe its because a prop is a value type and a
  //ref is an object, so we are copying the reference, ahhh that's why they call it a ref.  We got the address, not the value. which changes.
  const isMounted = useRef(false);
  const tree = useRef();
  const grow = useRef(false);
  const shrink = useRef(false);
  const growthTarget = useRef();
  const shrinkTarget = useRef();
  const passScalePropsFromDOM = useRef(false);

  useEffect(() => {
    //any state or props accessed from a function attached to a listener, will be stale.  Need to use a ref. This is because the listener belongs ot the initial render.
    window.addEventListener('shrink', handleShrink);

    return () => {
      window.removeEventListener('shrink', handleShrink);
    };
  }, []);

  useFrame(() => {
    if (grow.current) growInFrames();
    else if (shrink.current) shrinkInFrames();
  });

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
    console.log('from shrink event listener: ', event.detail);
    if (habit.id === event.detail.id) {
      shrinkTarget.current = event.detail.newScale;
      mutateDOMStateMachine('shrink');
    }
  };

  const handleGrowth = () => {
    growthTarget.current = habit.scale * (1 + compoundFactor);
    mutateDOMStateMachine('grow');
  };

  //console.log('rendering: ', habit);

  //once tree is first rendered, we will go into this useEffect and grow the tree if the box is checked
  //This is undesirable.  Instead we wait until after the first render.  This gives us a change to uncheck the box if it is checked and use it as designed.
  useEffect(() => {
    if (habit.dailyComplete && isMounted.current) {
      handleGrowth();
    } else {
      isMounted.current = true;
    }
  }, [habit.dailyComplete]);

  //always mutate the instance DOM in animation frames, don't use react set state functionality.
  //when finished return promise to signify proccess is complete
  const growInFrames = async () => {
    tree.current.scale.x += habit.rate;
    tree.current.scale.y += habit.rate;
    tree.current.scale.z += habit.rate;

    if (tree.current.scale.x >= growthTarget.current) {
      mutateDOMStateMachine('static-pre-db-update');
      await updateHabit({
        ...habit,
        scale: tree.current.scale.x,
        dateLastCompleted: new Date(),
        reps: habit.reps + 1,
      });
      await getHabitsAndSet();
      mutateDOMStateMachine('static-post-db-update');
    }
  };

  const shrinkInFrames = async () => {
    tree.current.scale.x -= habit.rate;
    tree.current.scale.y -= habit.rate;
    tree.current.scale.z -= habit.rate;

    if (tree.current.scale.x <= shrinkTarget.current) {
      mutateDOMStateMachine('static-pre-db-update');
      await updateHabit({
        ...habit,
        scale: tree.current.scale.x,
        dateLastCompleted: new Date(),
        dailyComplete: false,
      });
      await getHabitsAndSet();
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
      path={habit.path}
      info={habit}
      ref={tree}
      scale={
        passScalePropsFromDOM.current
          ? [tree.current.scale.x, tree.current.scale.y, tree.current.scale.z]
          : scale
      }
      position={position}
      onPointerOver={() => console.log(habit.habit)}
      // onPointerLeave={}
    />
  );
}
