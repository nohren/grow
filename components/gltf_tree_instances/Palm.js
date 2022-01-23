import React, { useRef, forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'

/*
  Palm gltf class.  This is a template for palm gltf's
*/
const Palm = forwardRef((props, ref) => {
  const group = useRef()
  const { nodes, materials } = useGLTF('/Palm.glb')

  return (
    <group 
      ref={ref} 
      {...props} 
      dispose={null}
    >
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Palm.geometry}
        material={materials.Material}
        rotation={[2.37, 1.5, -2.52]}
      />
    </group>
  )
})

useGLTF.preload('/Palm.glb')
export default Palm;