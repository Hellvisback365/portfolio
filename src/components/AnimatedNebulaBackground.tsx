import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Preload } from '@react-three/drei';
import * as THREE from 'three';

function NebulaParticles({ count = 15000, radius = 12 }) {
  const pointsRef = useRef<THREE.Points>(null!);

  // generate positions
  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const r = radius * Math.cbrt(Math.random());
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      pos.set([x, y, z], i * 3);
    }
    return pos;
  }, [count, radius]);

  // generate colors
  const colors = React.useMemo(() => {
    const cols = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = Math.random();
      let color;
      if (t < 0.33) color = new THREE.Color(0x0047ab);
      else if (t < 0.66) color = new THREE.Color(0xbf00ff);
      else color = new THREE.Color(0x00f5ff);
      color.lerp(new THREE.Color(0xff77ff), Math.random() * 0.5);
      cols.set(color.toArray(), i * 3);
    }
    return cols;
  }, [count]);

  // animate rotation
  useFrame((state: { clock: THREE.Clock }) => {
    const t = state.clock.getElapsedTime() * 0.1;
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t;
      pointsRef.current.rotation.x = t * 0.3;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors} stride={3}>
      <PointMaterial
        transparent
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function AnimatedNebulaBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          <NebulaParticles />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
} 