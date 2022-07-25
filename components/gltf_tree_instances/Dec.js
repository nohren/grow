import React, { forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';

const Dec = forwardRef(function Dec(props, ref) {
  const { nodes, materials } = useGLTF('/Tree.glb');
  return (
    <group ref={ref} {...props}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tree.geometry}
        material={materials.Material}
        scale={[0.032, 0.13, 0.032]}
      />
    </group>
  );
});

useGLTF.preload('/Tree.glb');
export default Dec;
