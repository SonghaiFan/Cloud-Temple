
import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useCursor, Html } from '@react-three/drei';
import * as THREE from 'three';

interface BellProps {
  onClick: (e: any) => void;
}

const Bell: React.FC<BellProps> = ({ onClick }) => {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [swinging, setSwinging] = useState(false);
  
  useCursor(hovered);

  const handleClick = (e: any) => {
    e.stopPropagation();
    onClick(e);
    setSwinging(true);
    setTimeout(() => setSwinging(false), 2000);
  }

  useFrame((state) => {
    if (ref.current) {
      const targetRot = swinging ? Math.sin(state.clock.elapsedTime * 15) * 0.05 : 0;
      ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, targetRot, 0.05);
    }
  });

  return (
    <group position={[-1.2, -0.2, 1.2]}>
       {/* Rope */}
       <mesh position={[0, 0.4, 0]}>
         <cylinderGeometry args={[0.01, 0.01, 0.8]} />
         <meshStandardMaterial color="#111" />
       </mesh>
      {/* Bell Body */}
      <group 
        ref={ref} 
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.25, 0.5, 32]} />
          <meshPhysicalMaterial 
            color="#B8860B" 
            metalness={0.7} 
            roughness={0.3}
            clearcoat={0.5}
          />
        </mesh>
      </group>
      <Html position={[0, -0.4, 0]} center style={{pointerEvents: 'none', opacity: hovered ? 1 : 0.5}} className="transition-opacity">
        <div className="text-stone-400 text-[10px] font-serif tracking-widest">铜钟</div>
      </Html>
    </group>
  );
};

export default Bell;
