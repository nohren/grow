import { Sky } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { React, useRef } from 'react';

export default function SkyComponent() {
  const sky = useRef();

  return (
    <Sky
      ref={sky}
      distance={2000}
      sunPosition={[0, 0, 0]}
      inclination={0.5}
      azimuth={0.25}
      elevation={2}
    />
  );
}
