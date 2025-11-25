import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SacredHalo = () => {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(256, 256, 100, 256, 256, 256);
      gradient.addColorStop(0, "rgba(255, 215, 0, 0)");
      gradient.addColorStop(0.2, "rgba(255, 180, 0, 0.1)");
      gradient.addColorStop(0.5, "rgba(255, 140, 0, 0.4)");
      gradient.addColorStop(0.8, "rgba(100, 50, 0, 0.1)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);

      ctx.translate(256, 256);
      ctx.fillStyle = "rgba(255, 200, 50, 0.1)";
      for (let i = 0; i < 36; i++) {
        ctx.rotate(Math.PI / 18);
        ctx.fillRect(0, -10, 256, 20);
      }
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <mesh ref={mesh} position={[0, 0.5, -5]} scale={[20, 20, 1]}>
      <planeGeometry />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
};

export default SacredHalo;
