import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ParallaxCamera = () => {
  useFrame((state) => {
    const { x, y } = state.pointer;
    // Lower the camera and look slightly upward for a reverent, towering feel
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      x * 0.4,
      0.02
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      -3 + y * 0.15,
      0.02
    );
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      4,
      0.02
    );
    state.camera.lookAt(0, 0.1, -1.5);
  });
  return null;
};

export default ParallaxCamera;
