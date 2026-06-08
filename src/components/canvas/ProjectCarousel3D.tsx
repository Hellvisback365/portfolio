'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { projects } from '@/data/projects';

export default function ProjectCarousel3D() {
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();

  const panelCount = projects.length;
  const arcRadius = 12;
  const arcSpread = Math.PI * 0.6; // 108 degrees arc

  // Generate panel positions on an arc
  const panelTransforms = useMemo(() => {
    return projects.map((_, i) => {
      const angle = -arcSpread / 2 + (arcSpread / (panelCount - 1)) * i;
      const x = Math.sin(angle) * arcRadius;
      const z = Math.cos(angle) * arcRadius - arcRadius;
      const rotY = -angle;
      return { position: new THREE.Vector3(x, 0, z), rotationY: rotY };
    });
  }, [panelCount, arcRadius, arcSpread]);

  // Glass panel material
  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#0a0a0a',
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.85,
        thickness: 0.5,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    []
  );

  // Edge glow material
  const edgeMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#5DE0E6',
        transparent: true,
        opacity: 0.25,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    const scrollOffset = scroll.offset;

    // Fade in/out based on scroll position (visible in section 4)
    const sectionStart = 3 / 5;
    const sectionEnd = 4 / 5;
    const sectionMid = (sectionStart + sectionEnd) / 2;
    const fadeRange = (sectionEnd - sectionStart) / 2;
    const fade = Math.max(0, 1 - Math.abs(scrollOffset - sectionMid) / (fadeRange * 1.5));

    groupRef.current.visible = fade > 0.01;

    // Gentle sway
    groupRef.current.rotation.y = Math.sin(time * 0.08) * 0.05;

    // Animate individual panels
    groupRef.current.children.forEach((panel, i) => {
      if (panel instanceof THREE.Group) {
        panel.position.y = Math.sin(time * 0.3 + i * 0.8) * 0.3;
        // Pulse edge glow
        panel.children.forEach((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
            child.material.opacity = 0.15 + Math.sin(time * 0.5 + i * 1.2) * 0.1;
          }
        });
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, -40]}>
      {panelTransforms.map((transform, i) => (
        <group
          key={`panel-${i}`}
          position={transform.position}
          rotation={[0, transform.rotationY, 0]}
        >
          {/* Glass panel */}
          <mesh material={glassMaterial}>
            <planeGeometry args={[5, 6.5]} />
          </mesh>

          {/* Edge glow frame */}
          <mesh material={edgeMaterial} position={[0, 0, -0.01]}>
            <planeGeometry args={[5.1, 6.6]} />
          </mesh>

          {/* Thin accent line at top */}
          <mesh position={[0, 3.3, 0.01]}>
            <planeGeometry args={[4.8, 0.02]} />
            <meshBasicMaterial
              color="#5DE0E6"
              transparent
              opacity={0.5}
              depthWrite={false}
            />
          </mesh>

          {/* Corner accents */}
          {[[-2.4, 3.15], [2.4, 3.15], [-2.4, -3.15], [2.4, -3.15]].map(
            ([cx, cy], ci) => (
              <mesh key={`corner-${ci}`} position={[cx, cy, 0.01]}>
                <circleGeometry args={[0.06, 16]} />
                <meshBasicMaterial
                  color="#5DE0E6"
                  transparent
                  opacity={0.6}
                  depthWrite={false}
                />
              </mesh>
            )
          )}
        </group>
      ))}
    </group>
  );
}
