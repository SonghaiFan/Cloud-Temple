
import React from 'react';

const Floor = () => {
  return (
    <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#050505" roughness={0.1} metalness={0.8} />
    </mesh>
  );
};

export default Floor;
