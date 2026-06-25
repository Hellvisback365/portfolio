'use client';

import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { pointerState } from '@/store/useAppStore';

/**
 * Stile Apple: la camera è quasi ferma, è l'oggetto a trasformarsi.
 * Qui solo una parallasse sottile dal puntatore, con damping
 * framerate-independent e vettori preallocati (zero GC nel loop).
 */
export default function CameraRig({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const target = useMemo(() => new THREE.Vector3(0, 0.15, 0), []);
  const basePos = useMemo(() => new THREE.Vector3(0, 0.3, 14), []);

  useFrame((state, delta) => {
    if (reducedMotion) {
      state.camera.position.copy(basePos);
      state.camera.lookAt(target);
      return;
    }
    const px = pointerState.x * 0.85;
    const py = pointerState.y * 0.5;
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, basePos.x + px, 2.4, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, basePos.y + py, 2.4, delta);
    state.camera.position.z = basePos.z;
    state.camera.lookAt(target);
  });

  return null;
}
