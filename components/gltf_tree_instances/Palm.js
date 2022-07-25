import React, { forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';

/*
  Palm gltf class.  This is a template for palm gltf's
*/
const Palm = forwardRef(function Palm(props, ref) {
  const { nodes, materials } = useGLTF('/Palm.glb');

  return (
    <group ref={ref} {...props}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Palm.geometry}
        material={materials.Material}
        rotation={[2.37, 1.5, -2.52]}
        scale={[0.1, 0.1, 0.1]}
      />
    </group>
  );
});

useGLTF.preload('/Palm.glb');
export default Palm;
