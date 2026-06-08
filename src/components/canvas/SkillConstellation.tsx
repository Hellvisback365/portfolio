'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';
import useResponsive from '@/hooks/useResponsive';
import { capabilityTracks, toolHighlights } from '@/data/skills';

// Build a flat list of skill labels for the constellation
const allSkills = [
  ...capabilityTracks.flatMap((t) => t.stack),
  ...toolHighlights.flatMap((t) => t.tools),
].filter((v, i, a) => a.indexOf(v) === i); // deduplicate

// Category colors
const CATEGORY_COLORS: Record<string, THREE.Color> = {
  'AI/ML': new THREE.Color('#5DE0E6'),
  'Web': new THREE.Color('#60A5FA'),
  'DevOps': new THREE.Color('#C084FC'),
  'default': new THREE.Color('#5DE0E6'),
};

function getSkillCategory(skill: string): string {
  const aiTerms = ['Python', 'LangGraph', 'LangChain', 'Gemini', 'Ollama', 'Transformer', 'LLMs'];
  const webTerms = ['React', 'Next.js', 'Node.js', 'Express', 'Vite', 'Tailwind CSS', 'HTML/CSS'];
  if (aiTerms.includes(skill)) return 'AI/ML';
  if (webTerms.includes(skill)) return 'Web';
  return 'DevOps';
}

export default function SkillConstellation() {
  const { isMobile } = useResponsive();
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();

  const skillCount = allSkills.length;

  // Position each skill on a sphere
  const { positions, colors, connections } = useMemo(() => {
    const pos: THREE.Vector3[] = [];
    const col: THREE.Color[] = [];
    const radius = isMobile ? 6 : 8;

    // Fibonacci sphere distribution
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < skillCount; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / skillCount);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      pos.push(new THREE.Vector3(x, y, z));
      col.push(CATEGORY_COLORS[getSkillCategory(allSkills[i])] || CATEGORY_COLORS['default']);
    }

    // Generate connections between nearby skills
    const conn: [number, number][] = [];
    for (let a = 0; a < skillCount; a++) {
      for (let b = a + 1; b < skillCount; b++) {
        if (pos[a].distanceTo(pos[b]) < radius * 0.7) {
          conn.push([a, b]);
        }
      }
    }

    return { positions: pos, colors: col, connections: conn };
  }, [skillCount, isMobile]);

  // Line geometry for connections - using imperative BufferAttribute
  const { linePositionAttr, lineColorAttr } = useMemo(() => {
    const linePositions = new Float32Array(connections.length * 6);
    const lineColors = new Float32Array(connections.length * 6);

    connections.forEach(([a, b], i) => {
      const i6 = i * 6;
      linePositions[i6] = positions[a].x;
      linePositions[i6 + 1] = positions[a].y;
      linePositions[i6 + 2] = positions[a].z;
      linePositions[i6 + 3] = positions[b].x;
      linePositions[i6 + 4] = positions[b].y;
      linePositions[i6 + 5] = positions[b].z;

      const colA = colors[a];
      const colB = colors[b];
      lineColors[i6] = colA.r * 0.3;
      lineColors[i6 + 1] = colA.g * 0.3;
      lineColors[i6 + 2] = colA.b * 0.3;
      lineColors[i6 + 3] = colB.r * 0.3;
      lineColors[i6 + 4] = colB.g * 0.3;
      lineColors[i6 + 5] = colB.b * 0.3;
    });

    return {
      linePositionAttr: new THREE.BufferAttribute(linePositions, 3),
      lineColorAttr: new THREE.BufferAttribute(lineColors, 3),
    };
  }, [connections, positions, colors]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    // Slow rotation
    groupRef.current.rotation.y = time * 0.05;
    groupRef.current.rotation.x = Math.sin(time * 0.03) * 0.1;

    // Fade in/out based on scroll (visible in section 3)
    const scrollOffset = scroll.offset;
    const sectionStart = 2 / 5;
    const sectionEnd = 3 / 5;
    const sectionMid = (sectionStart + sectionEnd) / 2;
    const fadeRange = (sectionEnd - sectionStart) / 2;
    const fade = Math.max(0, 1 - Math.abs(scrollOffset - sectionMid) / (fadeRange * 1.5));

    groupRef.current.visible = fade > 0.01;

    // Update node materials opacity
    groupRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
        child.material.opacity = fade * 0.9;
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, -20]}>
      {/* Skill nodes as icosahedrons */}
      {positions.map((pos, i) => (
        <mesh key={`skill-${i}`} position={pos}>
          <icosahedronGeometry args={[isMobile ? 0.15 : 0.2, 1]} />
          <meshBasicMaterial
            color={colors[i]}
            wireframe
            transparent
            opacity={0.9}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Core spheres inside each node */}
      {positions.map((pos, i) => (
        <mesh key={`core-${i}`} position={pos}>
          <sphereGeometry args={[isMobile ? 0.06 : 0.08, 8, 8]} />
          <meshBasicMaterial
            color={colors[i]}
            transparent
            opacity={0.7}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Connections */}
      <lineSegments>
        <bufferGeometry>
          <primitive attach="attributes-position" object={linePositionAttr} />
          <primitive attach="attributes-color" object={lineColorAttr} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}
