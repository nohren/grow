import React, { useEffect, useRef, useState, forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useLoader, useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Palm from './Palm'
import Spruce from './Spruce'
import Dec from './Dec'
import FallingLeaves from './FallingLeaves'
import Bush from './Bush'
import Cactus from './Cactus'
import ajax from './ajax'



export default function Tree({getHabitsAndSet, position, scale, habit}) {
  //work around for event listener function.  Only subscribes at app start and function state is captured for reference but turns stale.
  //in order to have an up to date prop, we need to store the prop and its changing value in a ref where the function scope can capture it.
  //curious why the initial scope can refer to an updated ref, but not a prop?  I believe its because a prop is a value type and a 
  //ref is an object, so we are copying the reference, ahhh that's why they call it a ref.  We got the address, not the value. which changes.
  //const gltf = useLoader(GLTFLoader, treePath)
  //console.log(gltf)
  const growthFactor = 1.3;
  
  const dailyCompleteRef = useRef(0);
  const tree = useRef();
  const grow = useRef();
  const growthTarget = useRef();
  //const [scale, setScale] = useState(0.2);
  //const [grow, setGrow] = useState(false);
  const [shrink, setShrink] = useState(false);
  const [rate, setRate] = useState(0.01);
  
  //scale => tree ref DOM, only working with tree ref DOM
  useEffect(() => {
    //check the db when we want to shrink.  can delete all this.
    dailyCompleteRef.current = habit.dailyComplete;
  },[habit.dailyComplete])
  
    useEffect(() => {
      //tree state adjusted for GLTF object units eccentricityy
      // setScale(dbScale);
      // setRate(dbRate);
     
      const cleanup = () => {
        // todo post scale to the db
      }
      window.addEventListener('dayClosed', handleDayClosed)
      window.addEventListener('beforeunload', cleanup);
      window.addEventListener("checkBoxClicked", handleClickedCheck)
    
      return () => {
        window.removeEventListener('beforeunload', cleanup);
        window.removeEventListener('dayClosed', handleDayClosed)
        window.removeEventListener('checkBoxClicked', handleClickedCheck);
      }
    },[])

    const handleClickedCheck = (e) => {
      if (e.detail.current === habit.id && habit.dailyComplete === false) {
        setTimeout(() => {handleGrowth();}, 500);
      }
    };

    let handleDayClosed = () => {
        //console.log(treemoji + ' ' + dailyCompleteRef.current)
       if (!dailyCompleteRef.current) handleShrink();
    };


    useFrame(() => {
        if (grow.current) growInFrames();
        else if (shrink) shrinkInFrames();
    })
    
    //always mutate component props in animation frames, don't use react set state
    //its almost like this way interupts the animation, when it has to 
    let growInFrames = () => {
      tree.current.scale.x += habit.rate;
      tree.current.scale.y += habit.rate;
      tree.current.scale.z += habit.rate; 
      console.log(tree.current.scale.x + " " + growthTarget.current)
      //the rerender here fucks with the animation
      if (tree.current.scale.x >= growthTarget.current) {
        console.log('stopping growth at: ' + tree.current.scale.x)
        grow.current = false; //setstate triggers a render, which passes the wrong value.  
        setTimeout(() => {
          console.log("setting scale in set timeout to: " + tree.current.scale.x)
          ajax.updateHabit({...habit, scale: tree.current.scale.x}, (result) => {
             if (result) getHabitsAndSet();
          })
        }, 3000)
      } 
    };
    let shrinkInFrames = () => {
      tree.current.scale.x -= habit.rate;
      tree.current.scale.y -= habit.rate;
      tree.current.scale.z -= habit.rate;  
    };

    const handleGrowth = () => {
      growthTarget.current = habit.scale * growthFactor;
      grow.current = true;
    };

    let handleShrink = () => {
        setShrink(true);
        setTimeout(() => {
            setShrink(false)
            //setScale(tree.current.scale.x)
            //todo post new scale in dbh
        }, 1000);
    }

    const Model = forwardRef((props, ref) => {
      //based on tree path return the correct model
      if (props.path === 'Palm.glb') {
        return (
          <Palm 
           ref={ref} 
           {...props}
         />
        )
      } 
      if (props.path === 'Spruce.glb') {
        return (
          <Spruce 
           ref={ref} 
           {...props}
         />
        )
      }
      if (props.path === 'Bush.glb') {
        return (
          <Bush 
           ref={ref} 
           {...props}
         />
        )
      } 
      if (props.path === 'Cactus.glb') {
        return (
          <Cactus 
           ref={ref} 
           {...props}
         />
        )
      }
      if (props.path === 'fallingLeaves.glb') {
        return (
          <FallingLeaves
           ref={ref} 
           {...props}
         />
        )
      }
      if (props.path === 'dec.glb') {
        return (
          <Dec
           ref={ref} 
           {...props}
         />
        )
      }
    });

    return (
         <Model 
           path={habit.path}
           ref={tree} 
           scale={scale} 
           position={position} 
           //onPointerOver={(e) => console.log(habit + " " + treePath + " " + dbScale)}
         />
    )
}


