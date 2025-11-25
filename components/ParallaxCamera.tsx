
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParallaxCamera = () => {
  useFrame((state) => {
    const { x, y } = state.pointer;
    // Move camera slightly based on mouse to create global parallax
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, x * 0.5, 0.02);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 1.5 + y * 0.2, 0.02);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

export default ParallaxCamera;
