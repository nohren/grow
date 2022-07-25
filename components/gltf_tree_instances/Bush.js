import React, { forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';

const Bush = forwardRef(function Bush(props, ref) {
  const { nodes, materials } = useGLTF('/Bush.glb');

  return (
    <group ref={ref} {...props}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Bush.geometry}
        material={materials.Material}
        scale={[0.33, 0.33, 0.33]}
      />
    </group>
  );
});

useGLTF.preload('/Bush.glb');
export default Bush;
