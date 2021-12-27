import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

export default function CameraControls() {
    const {camera, gl: {domElement}} = useThree();
    const controls = useRef();
    useFrame(() => controls.current.update());
    return (
    <orbitControls 
      ref={controls} 
      args={[camera, domElement]} 
    //   maxAzimuthAngle={Math.PI / 4}
    //   maxPolarAngle={Math.PI}
    //   minAzimuthAngle={-Math.PI / 4}
    //   minPolarAngle={0}
    />
    )
}