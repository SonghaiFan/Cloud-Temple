import React, { useState, useRef, useMemo } from "react";
import { useCursor, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface WoodfishProps {
  onClick: (e: any) => void;
}

const Woodfish: React.FC<WoodfishProps> = ({ onClick }) => {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const woodfishUrl = `${import.meta.env.BASE_URL}woodfish.glb`;
  const { scene } = useGLTF(woodfishUrl);

  const woodfishModel = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // Center and scale to target height
    clone.position.sub(center);
    const targetHeight = 0.2;
    const safeHeight = size.y || 1;
    const uniformScale = targetHeight / safeHeight;
    clone.scale.setScalar(uniformScale);
    clone.position.y -= (safeHeight * uniformScale) / 2 - 0.05;

    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const baseMaterial = Array.isArray(child.material)
          ? child.material[0]
          : child.material;
        if (baseMaterial) {
          const mat = baseMaterial.clone();
          mat.color = new THREE.Color("#7a3b13");
          mat.metalness = 0.2;
          mat.roughness = 0.5;
          mat.emissive = new THREE.Color("#2c1408");
          mat.emissiveIntensity = 0.08;
          child.material = mat;
        }
      }
    });

    return clone;
  }, [scene]);

  useCursor(hovered);

  const handleClick = (e: any) => {
    e.stopPropagation();
    onClick(e);
    if (ref.current) {
      ref.current.scale.setScalar(1.1);
      setTimeout(() => ref.current?.scale.setScalar(1), 100);
    }
  };

  return (
    <group
      ref={ref}
      position={[0.4, -2.4, 1.4]}
      rotation={[0, -0.4, 0]}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={woodfishModel} />
      <Html
        position={[0, -0.2, 0]}
        center
        style={{ pointerEvents: "none", opacity: hovered ? 1 : 0.5 }}
        className="transition-opacity"
      >
        <div className="text-stone-400 text-[10px] font-serif tracking-widest">
          木鱼
        </div>
      </Html>
    </group>
  );
};

useGLTF.preload(`${import.meta.env.BASE_URL}woodfish.glb`);

export default Woodfish;
