'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useResponsive from '@/hooks/useResponsive';

interface FloatingParticlesProps {
  /** Z-range for particle distribution */
  zRange?: [number, number];
}

export default function FloatingParticles({ zRange = [30, -70] }: FloatingParticlesProps) {
  const { isMobile } = useResponsive();
  const pointsRef = useRef<THREE.Points>(null);

  const count = isMobile ? 400 : 1200;
  const zMin = Math.min(zRange[0], zRange[1]);
  const zMax = Math.max(zRange[0], zRange[1]);
  const zSpread = zMax - zMin;

  const { positions, basePositions, speeds, offsets } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const off = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 40;
      const z = zMin + Math.random() * zSpread;
      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = z;
      base[i3] = x;
      base[i3 + 1] = y;
      base[i3 + 2] = z;
      spd[i] = Math.random() * 0.3 + 0.1;
      off[i] = Math.random() * Math.PI * 2;
    }

    return { positions: pos, basePositions: base, speeds: spd, offsets: off };
  }, [count, zMin, zSpread]);

  // Create a BufferAttribute imperatively to avoid R3F typing issues
  const positionAttribute = useMemo(
    () => new THREE.BufferAttribute(positions, 3),
    [positions]
  );

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posArray[i3] = basePositions[i3] + Math.sin(time * speeds[i] * 0.4 + offsets[i]) * 0.8;
      posArray[i3 + 1] = basePositions[i3 + 1] + Math.cos(time * speeds[i] * 0.3 + offsets[i] * 1.3) * 0.6;
      posArray[i3 + 2] = basePositions[i3 + 2] + Math.sin(time * speeds[i] * 0.2 + offsets[i] * 0.7) * 0.4;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <primitive attach="attributes-position" object={positionAttribute} />
      </bufferGeometry>
      <pointsMaterial
        color="#5DE0E6"
        size={isMobile ? 0.04 : 0.025}
        sizeAttenuation
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
