'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

const TOTAL_PAGES = 5;

// Camera positions for each section (z-axis based journey)
const CAMERA_PATH = [
  { pos: new THREE.Vector3(0, 0, 20), lookAt: new THREE.Vector3(0, 0, 0) },     // Hero
  { pos: new THREE.Vector3(0, 0, 5), lookAt: new THREE.Vector3(0, 0, -5) },      // About
  { pos: new THREE.Vector3(0, 0, -15), lookAt: new THREE.Vector3(0, 0, -25) },   // Skills
  { pos: new THREE.Vector3(0, 0, -35), lookAt: new THREE.Vector3(0, 0, -45) },   // Projects
  { pos: new THREE.Vector3(0, 0, -55), lookAt: new THREE.Vector3(0, 0, -65) },   // Contact
];

export default function CameraRig() {
  const scroll = useScroll();
  const currentPos = useRef(new THREE.Vector3(0, 0, 20));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state) => {
    const offset = scroll.offset;

    // Map scroll offset (0→1) to camera path segments
    const totalSegments = CAMERA_PATH.length - 1;
    const progress = offset * totalSegments;
    const segmentIndex = Math.min(Math.floor(progress), totalSegments - 1);
    const segmentProgress = progress - segmentIndex;

    // Smooth interpolation within current segment
    const from = CAMERA_PATH[segmentIndex];
    const to = CAMERA_PATH[Math.min(segmentIndex + 1, CAMERA_PATH.length - 1)];

    // Smooth easing
    const eased = smootherstep(segmentProgress);

    // Target position
    const targetPos = new THREE.Vector3().lerpVectors(from.pos, to.pos, eased);
    const targetLookAt = new THREE.Vector3().lerpVectors(from.lookAt, to.lookAt, eased);

    // Add subtle floating motion
    const time = state.clock.elapsedTime;
    targetPos.x += Math.sin(time * 0.15) * 0.3;
    targetPos.y += Math.cos(time * 0.12) * 0.2;

    // Lerp for damping
    currentPos.current.lerp(targetPos, 0.08);
    currentLookAt.current.lerp(targetLookAt, 0.08);

    state.camera.position.copy(currentPos.current);
    state.camera.lookAt(currentLookAt.current);
  });

  return null;
}

// Ken Perlin's smootherstep: smoother than smoothstep
function smootherstep(t: number): number {
  t = Math.max(0, Math.min(1, t));
  return t * t * t * (t * (t * 6 - 15) + 10);
}
