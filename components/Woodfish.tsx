
import React, { useState, useRef } from 'react';
import { useCursor, Html } from '@react-three/drei';
import * as THREE from 'three';

interface WoodfishProps {
  onClick: (e: any) => void;
}

const Woodfish: React.FC<WoodfishProps> = ({ onClick }) => {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useCursor(hovered);

  const handleClick = (e: any) => {
    e.stopPropagation();
    onClick(e);
    if (ref.current) {
      ref.current.scale.setScalar(1.1);
      setTimeout(() => ref.current?.scale.setScalar(1), 100);
    }
  }

  return (
    <group 
      ref={ref}
      position={[1.2, -0.9, 1.2]} 
      rotation={[0, -0.5, 0]}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial 
          color="#3E2723" 
          roughness={0.1} 
          metalness={0.4} 
        />
      </mesh>
      {/* Slit */}
      <mesh position={[0.15, 0.15, 0.15]} rotation={[0, 0.8, 0]}>
         <boxGeometry args={[0.3, 0.04, 0.2]} />
         <meshStandardMaterial color="#000" />
      </mesh>
      <Html position={[0, -0.2, 0]} center style={{pointerEvents: 'none', opacity: hovered ? 1 : 0.5}} className="transition-opacity">
        <div className="text-stone-400 text-[10px] font-serif tracking-widest">木鱼</div>
      </Html>
    </group>
  );
};

export default Woodfish;
