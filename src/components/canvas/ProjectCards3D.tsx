'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

const PROJECTS = [
  { id: 1, title: 'B.Future Challenge', url: '/projects/bfuture.png' },
  { id: 2, title: 'LACAM Copilot', url: '/projects/lacam.png' },
  { id: 3, title: 'Marketing Automation', url: '/projects/n8n.png' },
  { id: 4, title: 'Explainable AI Dashboard', url: '/projects/dashboard.png' }
];

interface CardProps {
  position: [number, number, number];
  rotation: [number, number, number];
  title: string;
}

function CurvedGlassCard({ position, rotation, title }: CardProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    // Gentle breathing
    groupRef.current.position.y = position[1] + Math.sin(t + position[0]) * 0.1;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <Float floatIntensity={0.5} rotationIntensity={0.1}>
        <mesh>
          {/* Curved screen: radius=5, height=3, radialSegments=32, heightSegments=1, openEnded=true, thetaStart=0, thetaLength=PI/3 */}
          <cylinderGeometry args={[4, 4, 2.5, 32, 1, true, -Math.PI / 6, Math.PI / 3]} />
          <meshPhysicalMaterial 
            color="#ffffff"
            metalness={0.8}
            roughness={0.1}
            transmission={0.9}
            thickness={0.05}
            envMapIntensity={2}
            side={THREE.DoubleSide}
            clearcoat={1}
          />
        </mesh>
        
        {/* Placeholder for project image (dark glass) */}
        <mesh position={[0, 0, 0.02]}>
          <cylinderGeometry args={[3.95, 3.95, 2.3, 32, 1, true, -Math.PI / 6.2, Math.PI / 3.1]} />
          <meshPhysicalMaterial color="#050505" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
        
        {/* Curved Text? Text component doesn't curve natively, so we position it slightly in front */}
        <Text
          position={[0, -0.8, 3.8]} // Pushed out to roughly radius
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.05}
        >
          {title}
        </Text>
      </Float>
    </group>
  );
}

export default function ProjectCards3D() {
  const cards = useMemo(() => {
    return PROJECTS.map((proj, i) => {
      // Distribute them in a semicircle around the viewer at z=-35
      const angle = (i / PROJECTS.length) * Math.PI - Math.PI / 2; // -90 to +90 deg
      const radius = 6;
      
      const x = Math.sin(angle) * radius;
      const z = -Math.cos(angle) * radius; // Negative to push them further down the Z axis
      
      // Face the center (0,0,0 local)
      const rotationY = -angle; 
      
      return (
        <CurvedGlassCard 
          key={proj.id} 
          position={[x, 0, z]} 
          rotation={[0, rotationY, 0]} 
          title={proj.title} 
        />
      );
    });
  }, []);

  return (
    // We place the group at z=-35. Camera will arrive at z=-35 to see them.
    <group position={[0, 0, -35]}>
      {cards}
    </group>
  );
}
