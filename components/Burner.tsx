import React, { useState } from "react";
import { type ThreeElements } from "@react-three/fiber";

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}
import { useCursor, Html } from "@react-three/drei";
import ProceduralSmoke from "./ProceduralSmoke";

interface BurnerProps {
  lit: boolean;
  onClick: () => void;
  tipLength?: number; // 燃烧部分长度
}

const Burner: React.FC<BurnerProps> = ({ lit, onClick, tipLength = 0.02 }) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered && !lit);

  // 总长度
  const stickTotalLength = 0.5;
  // 未燃烧部分自动补足
  const bodyLength = Math.max(0, stickTotalLength - tipLength);

  return (
    <group position={[0, -2.5, 1.5]}>
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

      {/* Stick body (unburnt) */}
      {bodyLength > 0 && (
        <mesh position={[0, bodyLength / 2, 0]}>
          {/* 下半段未燃烧部分，自动补足，中心在bodyLength/2 */}
          <cylinderGeometry args={[0.005, 0.005, bodyLength]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      )}

      {/* Stick tip (burning head) */}
      <mesh position={[0, bodyLength + tipLength / 2, 0]}>
        {/* 上半段烟头，长度tipLength，中心在bodyLength+tipLength/2 */}
        <cylinderGeometry args={[0.005, 0.005, tipLength]} />
        <meshStandardMaterial
          color={lit ? "#ff8800" : "#bbb"}
          emissive={lit ? "#ff4400" : "#000"}
          emissiveIntensity={lit ? 2 : 0}
        />
      </mesh>

      {lit && (
        <>
          <pointLight
            position={[0, bodyLength + tipLength, 0]}
            distance={1.5}
            intensity={2}
            color="#ff5500"
            decay={2}
          />
          <ProceduralSmoke
            lit={lit}
            position={[0, 0.8 + stickTotalLength, 0]}
          />
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
