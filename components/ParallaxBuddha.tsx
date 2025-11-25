import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Float } from '@react-three/drei';
import * as THREE from 'three';

interface ParallaxBuddhaProps {
  imageUrl: string;
}

const ParallaxBuddha: React.FC<ParallaxBuddhaProps> = ({ imageUrl }) => {
  const group = useRef<THREE.Group>(null);
  const texture = useTexture(imageUrl);
  
  useFrame((state) => {
    if (group.current) {
      const { x, y } = state.pointer;
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.1, 0.05);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.05, 0.05);
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh position={[0, 0.2, -1.5]} scale={[3.5, 3.5, 1]}>
          <planeGeometry />
          <meshBasicMaterial 
            map={texture}
            transparent
            opacity={1}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            depthWrite={false}
            toneMapped={false} 
          />
        </mesh>
        
        <mesh position={[0, 0.2, -1.6]} scale={[3.6, 3.6, 1]}>
          <planeGeometry />
          <meshBasicMaterial 
            map={texture}
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            color="#ff5500"
            depthWrite={false}
          />
        </mesh>
      </Float>
    </group>
  );
};

export default ParallaxBuddha;