import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const ParallaxBuddha: React.FC = () => {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/sit_luminous_buddha.glb');

  // Clone once so we can safely reuse the GLTF scene
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material && !child.material.emissive) {
          child.material = child.material.clone();
        }
        if (child.material && child.material.emissive) {
          child.material.emissive = new THREE.Color('#e7b13a');
          child.material.emissiveIntensity = 0.3;
        }
      }
    });
    return clone;
  }, [scene]);
  
  useFrame((state) => {
    if (group.current) {
      const { x, y } = state.pointer;
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.1, 0.05);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.05, 0.05);
    }
  });

  return (
    <group ref={group} position={[0, -0.5, -1.5]}>
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
        <primitive object={model} scale={[1.6, 1.6, 1.6]} />
        {/* Subtle aura */}
        <mesh position={[0, 1.2, -0.2]} scale={[3.5, 3.5, 1]}>
          <planeGeometry />
          <meshBasicMaterial 
            color="#e6b35c"
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </Float>
    </group>
  );
};

useGLTF.preload('/sit_luminous_buddha.glb');

export default ParallaxBuddha;
