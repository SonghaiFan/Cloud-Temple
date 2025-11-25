import React, { useState, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useCursor, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface BellProps {
  onClick: (e: any) => void;
}

const Bell: React.FC<BellProps> = ({ onClick }) => {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [swinging, setSwinging] = useState(false);
  const bellUrl = `${import.meta.env.BASE_URL}bell.glb`;
  const { scene } = useGLTF(bellUrl);

  const bellModel = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // Center and scale to a target height
    clone.position.sub(center);
    const targetHeight = 3;
    const safeHeight = size.y || 1;
    const uniformScale = targetHeight / safeHeight;
    clone.scale.setScalar(uniformScale);
    clone.position.y -= (safeHeight * uniformScale) / 2 - 0.05;

    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return clone;
  }, [scene]);

  useCursor(hovered);

  const handleClick = (e: any) => {
    e.stopPropagation();
    onClick(e);
    setSwinging(true);
    setTimeout(() => setSwinging(false), 2000);
  };

  useFrame((state) => {
    if (ref.current) {
      const targetRot = swinging
        ? Math.sin(state.clock.elapsedTime * 15) * 0.05
        : 0;
      ref.current.rotation.z = THREE.MathUtils.lerp(
        ref.current.rotation.z,
        targetRot,
        0.05
      );
    }
  });

  return (
    <group position={[-2, 3, -1]}>
      <group
        ref={ref}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <primitive object={bellModel} />
      </group>
      <Html
        position={[0, -0.4, 0]}
        center
        style={{ pointerEvents: "none", opacity: hovered ? 1 : 0.5 }}
        className="transition-opacity"
      >
        <div className="text-stone-400 text-[10px] font-serif tracking-widest">
          铜钟
        </div>
      </Html>
    </group>
  );
};

useGLTF.preload(`${import.meta.env.BASE_URL}bell.glb`);

export default Bell;
