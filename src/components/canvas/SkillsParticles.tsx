'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';

const PARTICLE_COUNT = 12000;

export default function SkillsParticles({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors, randoms] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);
    const rnd = new Float32Array(PARTICLE_COUNT);

    const colorPrimary = new THREE.Color('#22c55e'); // Green (Helios style)
    const colorSecondary = new THREE.Color('#ffffff'); // White

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      
      // We create a sort of spherical galaxy with spiral arms
      const radius = Math.random() * 20;
      const branchAngle = (i % 5) * ((Math.PI * 2) / 5);
      const spinAngle = radius * 0.4;
      
      // Random displacement for volume
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 3;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 3;
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 3;

      pos[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      pos[i3 + 1] = (Math.random() - 0.5) * 4 + randomY; // Flattened Y
      pos[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Mix colors based on radius and randomness
      const mixedColor = colorPrimary.clone().lerp(colorSecondary, Math.random() * 0.6 + (radius/20) * 0.4);
      col[i3] = mixedColor.r;
      col[i3 + 1] = mixedColor.g;
      col[i3 + 2] = mixedColor.b;

      rnd[i] = Math.random();
    }
    return [pos, col, rnd];
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    // Read the scroll progress from the motion value (0 to 1)
    const p = scrollProgress.get();
    
    // Time-based slow rotation + Scroll-based rotation
    const time = state.clock.elapsedTime;
    pointsRef.current.rotation.y = time * 0.05 + p * Math.PI * 1.5;
    
    // Tilt the galaxy slightly
    pointsRef.current.rotation.x = Math.PI * 0.15 + p * 0.2;
    pointsRef.current.rotation.z = p * 0.1;

    // Move the camera/points closer as we scroll
    // Start at z = -5, end at z = 15 (flying through)
    pointsRef.current.position.z = p * 20 - 5;
    
    // Slightly move down
    pointsRef.current.position.y = -p * 2;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          args={[randoms, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation={true}
      />
    </points>
  );
}
