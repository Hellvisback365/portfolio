'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

const SKILLS = [
  ['AI & Machine', 'Learning'],
  ['React &', 'Next.js'],
  ['3D Web', 'Experiences'],
  ['Cloud &', 'Architecture'],
];

function PortalRing({ position, scale, textLines, rotation }: any) {
  return (
    <Float floatIntensity={2} rotationIntensity={0.5} speed={2}>
      <group position={position} rotation={rotation} scale={scale}>
        <mesh>
          {/* A thin, elegant ring */}
          <torusGeometry args={[3, 0.05, 16, 100]} />
          <meshPhysicalMaterial 
            color="#ffffff" 
            metalness={0.9} 
            roughness={0.1} 
            envMapIntensity={2} 
            clearcoat={1}
          />
        </mesh>
        {/* Subtle glass pane inside the ring */}
        <mesh>
          <circleGeometry args={[2.95, 64]} />
          <meshPhysicalMaterial 
            color="#ffffff" 
            transmission={1} 
            transparent 
            opacity={1}
            roughness={0.05} 
            ior={1.2} 
            thickness={0.5} 
          />
        </mesh>
        
        <Text
          position={[0, 0.3, 0.1]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.1}
          fontWeight={300}
        >
          {textLines[0]}
        </Text>
        <Text
          position={[0, -0.3, 0.1]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.1}
          fontWeight={300}
        >
          {textLines[1]}
        </Text>
      </group>
    </Float>
  );
}

export default function SkillLenses() {
  const portals = useMemo(() => {
    return SKILLS.map((skill, i) => {
      // Position portals along the Z axis so we fly through them
      const z = - (i * 8); 
      // Slight offset in X and Y
      const x = Math.sin(i * Math.PI) * 2;
      const y = Math.cos(i * Math.PI) * 1;
      
      // Slight rotation to make it dynamic
      const rotation = [0, Math.sin(i) * 0.2, 0];
      
      return (
        <PortalRing 
          key={i} 
          position={[x, y, z]} 
          rotation={rotation}
          scale={1 + (i * 0.1)} 
          textLines={skill} 
        />
      );
    });
  }, []);

  return (
    <group position={[0, 0, -10]}>
      {portals}
    </group>
  );
}
