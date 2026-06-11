'use client';

import CameraRig from './CameraRig';
import AbstractCore from './AbstractCore';
import FloatingParticles from './FloatingParticles';
import SkillLenses from './SkillLenses';
import ProjectCards3D from './ProjectCards3D';
import { Environment } from '@react-three/drei';

export default function Scene() {
  return (
    <>
      {/* Camera controller */}
      <CameraRig />

      {/* Global studio lighting - Apple Vision Pro style (High contrast, soft shadows) */}
      <ambientLight intensity={0.5} color="#ffffff" />
      <Environment preset="studio" environmentIntensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#ffffff" />

      {/* Volumetric fog */}
      <fog attach="fog" args={['#030303', 10, 60]} />

      {/* Ambient particles */}
      <FloatingParticles />

      {/* ── Section 1: Hero (z ~15) ── */}
      <AbstractCore zCenter={15} />

      {/* ── Section 3: Skills (z ~-10) ── */}
      <SkillLenses />

      {/* ── Section 4: Projects (z ~-35) ── */}
      <ProjectCards3D />
    </>
  );
}
