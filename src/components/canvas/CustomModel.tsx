'use client';

import { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface CustomModelProps {
  /** Path to the .glb file (relative to /public) */
  path?: string;
  /** Scale multiplier */
  scale?: number;
  /** Position in the scene */
  position?: [number, number, number];
  /** Rotation speed (radians per frame) */
  rotationSpeed?: number;
}

/** Placeholder geometry shown when no .glb is provided */
function PlaceholderGeometry({ scale = 1, rotationSpeed = 0.003 }: { scale: number; rotationSpeed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += rotationSpeed;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
  });

  return (
    <mesh ref={meshRef} scale={scale}>
      <torusKnotGeometry args={[1, 0.35, 128, 16]} />
      <meshBasicMaterial
        color="#5DE0E6"
        wireframe
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </mesh>
  );
}

/** Loaded GLB model */
function GLBModel({ path, scale = 1, rotationSpeed = 0.003 }: { path: string; scale: number; rotationSpeed: number }) {
  const { scene } = useGLTF(path);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += rotationSpeed;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
  });

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

export default function CustomModel({
  path,
  scale = 1.5,
  position = [0, 0, 0],
  rotationSpeed = 0.003,
}: CustomModelProps) {
  return (
    <group position={position}>
      {/* Dedicated lighting for the model */}
      <spotLight
        position={[5, 5, 5]}
        angle={0.4}
        penumbra={0.8}
        intensity={1.5}
        color="#5DE0E6"
        castShadow={false}
      />
      <spotLight
        position={[-5, 3, -3]}
        angle={0.5}
        penumbra={1}
        intensity={0.8}
        color="#C084FC"
        castShadow={false}
      />
      <pointLight position={[0, -3, 2]} intensity={0.4} color="#3B82F6" />

      <Suspense fallback={null}>
        {path ? (
          <GLBModel path={path} scale={scale} rotationSpeed={rotationSpeed} />
        ) : (
          <PlaceholderGeometry scale={scale} rotationSpeed={rotationSpeed} />
        )}
      </Suspense>

      <Environment preset="night" />
    </group>
  );
}
