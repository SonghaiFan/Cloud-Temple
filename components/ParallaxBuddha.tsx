import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const ParallaxBuddha: React.FC = () => {
  const group = useRef<THREE.Group>(null);
  const buddhaUrl = `${import.meta.env.BASE_URL}buddha.glb`;
  const { scene } = useGLTF(buddhaUrl);

  // Clone once so we can safely reuse the GLTF scene
  const model = useMemo(() => {
    const clone = scene.clone(true);
    // Normalize scale/position so it stays in frame regardless of source dimensions
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // Center model at origin then scale to target height
    clone.position.sub(center);
    const targetHeight = 3; // units tall in scene
    const safeHeight = size.y || 1;
    const uniformScale = targetHeight / safeHeight;
    clone.scale.setScalar(uniformScale);
    clone.position.y -= (safeHeight * uniformScale) / 2 - 0.2;

    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // Ensure materials are bright enough to be visible in the dark scene
        const baseMaterial = Array.isArray(child.material)
          ? child.material[0]
          : child.material;
        if (baseMaterial) {
          const mat = baseMaterial.clone();
          mat.color = new THREE.Color("#f6e8c9");
          mat.emissive = new THREE.Color("#ffe7a0"); // 更亮的金色
          mat.emissiveIntensity = 1.2; // 增强发光
          mat.metalness = 0.1;
          mat.roughness = 0.2;
          mat.transparent = false;
          mat.depthWrite = true;
          child.material = mat;
        }
      }
    });
    return clone;
  }, [scene]);

  useFrame((state) => {
    if (group.current) {
      const { x, y } = state.pointer;
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        x * 0.05,
        0.05
      );
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        -y * 0.03,
        0.05
      );
    }
  });

  return (
    <group ref={group} position={[0, 3.5, -5]}>
      {/* 佛像发光：聚光灯和点光源 */}
      <spotLight
        position={[0, 5.5, -5]}
        angle={0.6}
        penumbra={0.7}
        intensity={2.2}
        color="#ffe7a0"
        distance={10}
        castShadow
        target-position={[0, 3.5, -5]}
      />
      <pointLight
        position={[0, 4.5, -5]}
        intensity={1.2}
        color="#ffe7a0"
        distance={6}
      />
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
        <primitive object={model} scale={[4, 4, 4]} />
      </Float>
    </group>
  );
};

useGLTF.preload(`${import.meta.env.BASE_URL}sit_luminous_buddha.glb`);

export default ParallaxBuddha;
