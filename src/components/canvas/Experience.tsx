'use client';

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import PhylloField from './PhylloField';
import CameraRig from './CameraRig';

function useMediaQuery(query: string): boolean {
  const [matches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );
  return matches;
}

/**
 * Setup del renderer.
 * - antialias: false — i point sprite hanno bordi morbidi nello shader,
 *   il MSAA sarebbe solo costo.
 * - dpr adattivo [1 → 1.75]: PerformanceMonitor lo alza se il frame
 *   budget regge, lo abbassa se no. Mai sopra 1.75: oltre, su un campo
 *   di punti, è risoluzione sprecata.
 * - prefers-reduced-motion: scena statica, niente drift né scrub.
 */
export default function Experience() {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isCoarse = useMediaQuery('(pointer: coarse)');
  const [dpr, setDpr] = useState(1.25);

  return (
    <Canvas
      camera={{ fov: 42, position: [0, 0.3, 14], near: 0.1, far: 60 }}
      dpr={dpr}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: false, // un solo oggetto additive senza depth: il buffer non serve
      }}
      style={{ background: '#04060c' }}
    >
      <PerformanceMonitor
        onIncline={() => setDpr((d) => Math.min(1.75, d + 0.25))}
        onDecline={() => setDpr((d) => Math.max(1, d - 0.25))}
      >
        <CameraRig reducedMotion={reducedMotion} />
        <PhylloField reducedMotion={reducedMotion} isCoarsePointer={isCoarse} />
      </PerformanceMonitor>
    </Canvas>
  );
}
