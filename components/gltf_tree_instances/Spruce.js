/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { forwardRef, useRef } from 'react';
import { useGLTF, Html } from '@react-three/drei';

const Spruce = forwardRef((props, ref) => {
  const group = useRef();
  const { nodes, materials } = useGLTF('/Spruce.glb');
  //we are growing the tree manually from direct DOM manipulation using the passed down ref

  return (
    <>
      <group ref={ref} {...props} dispose={null}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Spruce.geometry}
          material={materials.Material}
        />
      </group>
    </>
  );
});

useGLTF.preload('/Spruce.glb');
export default Spruce;
