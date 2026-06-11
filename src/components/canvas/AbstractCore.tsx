'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface AbstractCoreProps {
  zCenter?: number;
}

export default function AbstractCore({ zCenter = 15 }: AbstractCoreProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!groupRef.current || !ring1Ref.current || !ring2Ref.current || !ring3Ref.current || !coreRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Smooth, cinematic rotation of the rings (like a high-tech gyroscope)
    ring1Ref.current.rotation.x = t * 0.2;
    ring1Ref.current.rotation.y = t * 0.1;
    
    ring2Ref.current.rotation.y = t * 0.15;
    ring2Ref.current.rotation.z = t * 0.25;
    
    ring3Ref.current.rotation.x = t * 0.3;
    ring3Ref.current.rotation.z = t * 0.1;

    // Core pulsing effect
    const pulse = 1 + Math.sin(t * 2) * 0.05;
    coreRef.current.scale.setScalar(pulse);
    
    // Entire group subtle interaction with pointer
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      state.pointer.y * 0.2,
      0.05
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      state.pointer.x * 0.2,
      0.05
    );
  });

  return (
    <group position={[0, 0, zCenter]} ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        
        {/* Core Glowing Orb */}
        <mesh ref={coreRef} scale={0.8}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshPhysicalMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.8}
            clearcoat={1}
          />
        </mesh>

        {/* Ring 1 - Deep Titanium */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[2.5, 0.05, 32, 100]} />
          <meshPhysicalMaterial
            color="#111111"
            metalness={1}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Ring 2 - Frosted Glass */}
        <mesh ref={ring2Ref}>
          <torusGeometry args={[3.2, 0.08, 32, 100]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.9}
            opacity={1}
            metalness={0.1}
            roughness={0.2}
            ior={1.5}
            thickness={0.5}
            clearcoat={1}
          />
        </mesh>

        {/* Ring 3 - Outer Thin Titanium */}
        <mesh ref={ring3Ref}>
          <torusGeometry args={[4, 0.02, 16, 100]} />
          <meshPhysicalMaterial
            color="#333333"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>

      </Float>
      
      {/* Dynamic light casting from the core onto the rings */}
      <pointLight intensity={2} color="#ffffff" distance={10} position={[0, 0, 0]} />
    </group>
  );
}
