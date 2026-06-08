'use client';

import CameraRig from './CameraRig';
import NeuralNetwork3D from './NeuralNetwork3D';
import FloatingParticles from './FloatingParticles';
import SkillConstellation from './SkillConstellation';
import ProjectCarousel3D from './ProjectCarousel3D';
import CustomModel from './CustomModel';

/**
 * Main 3D scene orchestrator.
 * Contains all 3D elements positioned along the camera's Z-axis journey.
 *
 * Camera path (z-axis):
 *   z=20  → Hero (NeuralNetwork + CustomModel)
 *   z=5   → About
 *   z=-15 → Skills (SkillConstellation)
 *   z=-35 → Projects (ProjectCarousel3D)
 *   z=-55 → Contact
 */
export default function Scene() {
  return (
    <>
      {/* Camera controller (reads scroll, moves camera) */}
      <CameraRig />

      {/* Global lighting */}
      <ambientLight intensity={0.15} color="#5DE0E6" />
      <pointLight position={[10, 10, 20]} intensity={0.3} color="#5DE0E6" />
      <pointLight position={[-10, -5, -30]} intensity={0.2} color="#C084FC" />
      <pointLight position={[0, 5, -50]} intensity={0.2} color="#3B82F6" />

      {/* Volumetric fog */}
      <fog attach="fog" args={['#050505', 15, 70]} />

      {/* ── Ambient particles across entire scene ── */}
      <FloatingParticles zRange={[30, -70]} />

      {/* ── Section 1: Hero (z ~20) ── */}
      <NeuralNetwork3D zCenter={15} />
      <CustomModel
        position={[8, -2, 12]}
        scale={1.2}
        rotationSpeed={0.004}
      />

      {/* ── Section 2: About (z ~5) ── */}
      {/* About section is primarily HTML overlay, with ambient particles providing depth */}

      {/* ── Section 3: Skills (z ~-15 to -20) ── */}
      <SkillConstellation />

      {/* ── Section 4: Projects (z ~-35 to -40) ── */}
      <ProjectCarousel3D />

      {/* ── Section 5: Contact (z ~-55) ── */}
      {/* Contact is primarily HTML overlay with ambient particles */}
    </>
  );
}
