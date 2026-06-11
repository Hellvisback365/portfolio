'use client';

import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CAMERA_PATH = [
  { pos: new THREE.Vector3(0, 0, 25), lookAt: new THREE.Vector3(0, 0, 15) },     // Hero
  { pos: new THREE.Vector3(-10, 2, 5), lookAt: new THREE.Vector3(0, 0, 0) },      // About
  { pos: new THREE.Vector3(10, -2, -5), lookAt: new THREE.Vector3(0, 0, -10) },   // Skills (stay in front of portals)
  { pos: new THREE.Vector3(0, 2, -28), lookAt: new THREE.Vector3(0, 0, -35) },   // Projects
  { pos: new THREE.Vector3(-5, 0, -50), lookAt: new THREE.Vector3(0, 0, -60) },   // Contact
];

export default function CameraRig() {
  useFrame((state) => {
    // Read global scroll progress directly for zero latency
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const offset = h > 0 ? window.scrollY / h : 0;

    // Map scroll offset (0→1) to camera path segments
    const totalSegments = CAMERA_PATH.length - 1;
    const progress = offset * totalSegments;
    const segmentIndex = Math.min(Math.floor(progress), totalSegments - 1);
    const segmentProgress = progress - segmentIndex;

    const from = CAMERA_PATH[segmentIndex];
    const to = CAMERA_PATH[Math.min(segmentIndex + 1, CAMERA_PATH.length - 1)];

    // Extremely smooth easing for the camera path (ease-in-out)
    const eased = smootherstep(segmentProgress);

    // Target position
    const targetPos = new THREE.Vector3().lerpVectors(from.pos, to.pos, eased);
    const targetLookAt = new THREE.Vector3().lerpVectors(from.lookAt, to.lookAt, eased);

    // Subtle, elegant floating motion (like a drone)
    const time = state.clock.elapsedTime;
    targetPos.x += Math.sin(time * 0.2) * 0.2;
    targetPos.y += Math.cos(time * 0.15) * 0.2;

    state.camera.position.copy(targetPos);
    state.camera.lookAt(targetLookAt);
  });

  return null;
}

// Ken Perlin's smootherstep for butter-smooth transitions
function smootherstep(t: number): number {
  t = Math.max(0, Math.min(1, t));
  return t * t * t * (t * (t * 6 - 15) + 10);
}
