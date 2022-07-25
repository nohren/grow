/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';

const Spruce = forwardRef(function Spruce(props, ref) {
  const { nodes, materials } = useGLTF('/Spruce.glb');

  return (
    <>
      <group ref={ref} {...props}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Spruce.geometry}
          material={materials.Material}
          scale={[0.15, 0.15, 0.15]}
        />
      </group>
    </>
  );
});

useGLTF.preload('/Spruce.glb');
export default Spruce;
