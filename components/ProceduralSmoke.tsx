
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { smokeVertexShader, smokeFragmentShader } from './shaders';

interface ProceduralSmokeProps {
  lit: boolean;
}

const ProceduralSmoke: React.FC<ProceduralSmokeProps> = ({ lit }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uOpacity: { value: 0 }
  }), []);

  useFrame((state) => {
    if (mesh.current) {
      const mat = mesh.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = state.clock.elapsedTime;
      mat.uniforms.uOpacity.value = THREE.MathUtils.lerp(
        mat.uniforms.uOpacity.value, 
        lit ? 0.8 : 0.0, 
        0.02
      );
    }
  });

  return (
    <mesh ref={mesh} position={[0, 1.2, 0.5]} rotation={[0, 0, 0]}>
      <planeGeometry args={[2, 4]} />
      <shaderMaterial
        vertexShader={smokeVertexShader}
        fragmentShader={smokeFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

export default ProceduralSmoke;
