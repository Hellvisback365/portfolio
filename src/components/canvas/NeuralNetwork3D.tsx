'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';
import useResponsive from '@/hooks/useResponsive';

interface NeuralNetwork3DProps {
  zCenter?: number;
}

export default function NeuralNetwork3D({ zCenter = 15 }: NeuralNetwork3DProps) {
  const { isMobile } = useResponsive();
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const scroll = useScroll();

  const nodeCount = isMobile ? 80 : 200;
  const connectionDistance = isMobile ? 3.5 : 2.8;
  const spread = 18;

  // Generate node positions
  const { basePositions } = useMemo(() => {
    const base = new Float32Array(nodeCount * 3);
    for (let i = 0; i < nodeCount; i++) {
      const i3 = i * 3;
      base[i3] = (Math.random() - 0.5) * spread;
      base[i3 + 1] = (Math.random() - 0.5) * spread;
      base[i3 + 2] = (Math.random() - 0.5) * spread * 0.6;
    }
    return { basePositions: base };
  }, [nodeCount, spread]);

  // Create BufferAttributes imperatively
  const positionAttr = useMemo(
    () => new THREE.BufferAttribute(new Float32Array(nodeCount * 3), 3),
    [nodeCount]
  );

  const sizeAttr = useMemo(() => {
    const s = new Float32Array(nodeCount);
    for (let i = 0; i < nodeCount; i++) {
      s[i] = Math.random() * 2.5 + 1.0;
    }
    return new THREE.BufferAttribute(s, 1);
  }, [nodeCount]);

  // Pre-allocate line geometry
  const maxConnections = nodeCount * 6;
  const linePositionAttr = useMemo(
    () => new THREE.BufferAttribute(new Float32Array(maxConnections * 6), 3),
    [maxConnections]
  );
  const lineColorAttr = useMemo(
    () => new THREE.BufferAttribute(new Float32Array(maxConnections * 6), 3),
    [maxConnections]
  );

  useFrame((state) => {
    if (!pointsRef.current || !linesRef.current) return;

    const time = state.clock.elapsedTime;
    const posArray = positionAttr.array as Float32Array;

    // Animate nodes with organic floating motion
    for (let i = 0; i < nodeCount; i++) {
      const i3 = i * 3;
      posArray[i3] = basePositions[i3] + Math.sin(time * 0.3 + i * 0.5) * 0.5;
      posArray[i3 + 1] = basePositions[i3 + 1] + Math.cos(time * 0.25 + i * 0.7) * 0.4;
      posArray[i3 + 2] = basePositions[i3 + 2] + Math.sin(time * 0.2 + i * 0.3) * 0.3;
    }
    positionAttr.needsUpdate = true;

    // Rebuild connections
    const linePositions = linePositionAttr.array as Float32Array;
    const lineColors = lineColorAttr.array as Float32Array;
    let lineIndex = 0;
    const cyanR = 93 / 255, cyanG = 224 / 255, cyanB = 230 / 255;

    for (let a = 0; a < nodeCount; a++) {
      for (let b = a + 1; b < nodeCount; b++) {
        if (lineIndex >= maxConnections) break;
        const a3 = a * 3, b3 = b * 3;
        const dx = posArray[a3] - posArray[b3];
        const dy = posArray[a3 + 1] - posArray[b3 + 1];
        const dz = posArray[a3 + 2] - posArray[b3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < connectionDistance) {
          const opacity = (1 - dist / connectionDistance) * 0.35;
          const li = lineIndex * 6;

          linePositions[li] = posArray[a3];
          linePositions[li + 1] = posArray[a3 + 1];
          linePositions[li + 2] = posArray[a3 + 2];
          linePositions[li + 3] = posArray[b3];
          linePositions[li + 4] = posArray[b3 + 1];
          linePositions[li + 5] = posArray[b3 + 2];

          lineColors[li] = cyanR * opacity;
          lineColors[li + 1] = cyanG * opacity;
          lineColors[li + 2] = cyanB * opacity;
          lineColors[li + 3] = cyanR * opacity;
          lineColors[li + 4] = cyanG * opacity;
          lineColors[li + 5] = cyanB * opacity;

          lineIndex++;
        }
      }
    }

    // Zero out remaining line positions
    for (let i = lineIndex * 6; i < maxConnections * 6; i++) {
      linePositions[i] = 0;
      lineColors[i] = 0;
    }

    linePositionAttr.needsUpdate = true;
    lineColorAttr.needsUpdate = true;
    linesRef.current.geometry.setDrawRange(0, lineIndex * 2);

    // Fade based on scroll
    const scrollOffset = scroll.offset;
    const fade = Math.max(0, 1 - scrollOffset * 5);
    if (pointsRef.current.material instanceof THREE.PointsMaterial) {
      pointsRef.current.material.opacity = fade * 0.8;
    }
    if (linesRef.current.material instanceof THREE.LineBasicMaterial) {
      linesRef.current.material.opacity = fade * 0.5;
    }
  });

  return (
    <group position={[0, 0, zCenter]}>
      {/* Neural nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <primitive attach="attributes-position" object={positionAttr} />
          <primitive attach="attributes-size" object={sizeAttr} />
        </bufferGeometry>
        <pointsMaterial
          color="#5DE0E6"
          size={isMobile ? 0.12 : 0.08}
          sizeAttenuation
          transparent
          opacity={0.8}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Neural connections */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <primitive attach="attributes-position" object={linePositionAttr} />
          <primitive attach="attributes-color" object={lineColorAttr} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}
