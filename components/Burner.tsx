import React, { useState } from "react";
import { useCursor, Html } from "@react-three/drei";
import ProceduralSmoke from "./ProceduralSmoke";

interface BurnerProps {
  lit: boolean;
  onClick: () => void;
}

const Burner: React.FC<BurnerProps> = ({ lit, onClick }) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered && !lit);

  return (
    <group position={[0, -0.8, 1.5]}>
      <mesh
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          !lit && onClick();
        }}
        onPointerOver={() => !lit && setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[0.2, 0.15, 0.25, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Ash */}
      <mesh position={[0, 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.18]} />
        <meshStandardMaterial color="#333" roughness={1} />
      </mesh>

      {/* Stick */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.5]} />
        <meshStandardMaterial
          color={lit ? "#ff4400" : "#333"}
          emissive={lit ? "#ff2200" : "#000"}
          emissiveIntensity={3}
        />
      </mesh>

      {lit && (
        <>
          <pointLight
            position={[0, 0.55, 0]}
            distance={1.5}
            intensity={2}
            color="#ff5500"
            decay={2}
          />
          <ProceduralSmoke lit={lit} position={[0, 0.55, 0]} />
        </>
      )}

      {!lit && (
        <Html position={[0, 0.4, 0]} center style={{ pointerEvents: "none" }}>
          <div className="text-amber-500/80 text-[10px] font-serif border border-amber-500/30 px-2 py-0.5 rounded bg-black/50 backdrop-blur whitespace-nowrap animate-float">
            点击上香
          </div>
        </Html>
      )}
    </group>
  );
};

export default Burner;
