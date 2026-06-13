'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { buildAllTargets } from './targets';
import { scrollProgress } from '@/store/useAppStore';

/**
 * PhylloField — la firma del sito.
 *
 * Un unico THREE.Points (1 draw call) con N particelle che morphano tra
 * 5 stati matematici nel vertex shader. I target sono attributi del
 * buffer: la CPU non tocca mai le posizioni dopo il mount, la GPU fa
 * tutto. Nessuna allocazione nel loop, nessuna texture, nessuna luce.
 *
 * Tuning rapido: COUNT / COUNT_MOBILE / uSize qui sotto.
 */
const COUNT = 14000;
const COUNT_MOBILE = 6500;

const VERTEX = /* glsl */ `
  attribute vec3 aT1;
  attribute vec3 aT2;
  attribute vec3 aT3;
  attribute vec3 aT4;
  attribute vec4 aSeed; // x: fase drift · y: tinta · z: taglia · w: stagger

  uniform float uTime;
  uniform float uProgress;   // 0 → 4, continuo
  uniform float uSize;       // px, già moltiplicato per il dpr
  uniform float uDrift;      // 0 con prefers-reduced-motion

  varying float vTint;
  varying float vAlpha;

  void main() {
    float p = clamp(uProgress, 0.0, 3.999);
    float seg = floor(p);
    float f = p - seg;

    // Stagger per-particella: il morphing è una cascata organica,
    // non una transizione monolitica.
    float local = smoothstep(0.0, 1.0, clamp((f - aSeed.w * 0.18) / 0.82, 0.0, 1.0));

    // Selezione branch-free dei target (niente indexing dinamico in GLSL).
    vec3 a = position;                 // target 0 vive in 'position'
    a = mix(a, aT1, step(0.5, seg));
    a = mix(a, aT2, step(1.5, seg));
    a = mix(a, aT3, step(2.5, seg));

    vec3 b = aT1;
    b = mix(b, aT2, step(0.5, seg));
    b = mix(b, aT3, step(1.5, seg));
    b = mix(b, aT4, step(2.5, seg));

    vec3 pos = mix(a, b, local);

    // Respiro: deriva trigonometrica minima, fase per-particella.
    float t = uTime * 0.6;
    pos += uDrift * 0.07 * vec3(
      sin(t + aSeed.x * 6.2831),
      cos(t * 0.8 + aSeed.x * 12.566),
      sin(t * 0.9 + aSeed.x * 9.42)
    );

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float dist = -mv.z;
    gl_PointSize = clamp(uSize * mix(0.55, 1.5, aSeed.z) * (13.0 / dist), 1.0, 22.0);

    vTint = aSeed.y;
    // Fade atmosferico in profondità + variazione per-particella.
    vAlpha = smoothstep(30.0, 9.0, dist) * mix(0.35, 1.0, aSeed.y);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uColorA; // blu sistema
  uniform vec3 uColorB; // blu chiaro

  varying float vTint;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float disc = smoothstep(0.5, 0.06, d);
    float alpha = disc * vAlpha;
    if (alpha < 0.004) discard;
    vec3 color = mix(uColorA, uColorB, vTint);
    gl_FragColor = vec4(color * alpha, alpha); // premoltiplicato per l'additive
  }
`;

export default function PhylloField({
  reducedMotion = false,
  isCoarsePointer = false,
}: {
  reducedMotion?: boolean;
  isCoarsePointer?: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const count = isCoarsePointer ? COUNT_MOBILE : COUNT;

  const geometry = useMemo(() => {
    const [t0, t1, t2, t3, t4] = buildAllTargets(count);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(t0, 3));
    geo.setAttribute('aT1', new THREE.BufferAttribute(t1, 3));
    geo.setAttribute('aT2', new THREE.BufferAttribute(t2, 3));
    geo.setAttribute('aT3', new THREE.BufferAttribute(t3, 3));
    geo.setAttribute('aT4', new THREE.BufferAttribute(t4, 3));

    const seed = new Float32Array(count * 4);
    // PRNG locale per i seed (deterministico).
    let s = 7;
    const rnd = () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
    for (let i = 0; i < count; i++) {
      seed[i * 4 + 0] = rnd();
      seed[i * 4 + 1] = rnd();
      seed[i * 4 + 2] = rnd();
      seed[i * 4 + 3] = rnd();
    }
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4));
    // Il campo riempie sempre il frustum: bounding sphere statica,
    // evita il ricalcolo e il culling accidentale durante il morph.
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 12);
    return geo;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uSize: { value: 3.0 },
      uDrift: { value: reducedMotion ? 0 : 1 },
      uColorA: { value: new THREE.Color('#0a84ff') },
      uColorB: { value: new THREE.Color('#9ecbff') },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    uniforms.uDrift.value = reducedMotion ? 0 : 1;
  }, [reducedMotion, uniforms]);

  // Cleanup esplicito: niente leak GPU all'unmount.
  useEffect(() => {
    const mat = materialRef.current;
    return () => {
      geometry.dispose();
      mat?.dispose();
    };
  }, [geometry]);

  useFrame((state, delta) => {
    const mat = materialRef.current;
    const pts = pointsRef.current;
    if (!mat || !pts) return;

    mat.uniforms.uTime.value = state.clock.elapsedTime;
    // dpr incluso nella size: i point sprite sono in pixel device.
    mat.uniforms.uSize.value = 3.0 * state.gl.getPixelRatio();

    const target = scrollProgress.stage;
    if (reducedMotion) {
      mat.uniforms.uProgress.value = target;
    } else {
      // damp framerate-independent: lo scrub resta burroso a 60 e a 120 Hz.
      mat.uniforms.uProgress.value = THREE.MathUtils.damp(
        mat.uniforms.uProgress.value,
        target,
        3.2,
        delta,
      );
      // Rotazione lenta + offset legato allo stage: lo scroll "gira" il campo.
      pts.rotation.y = state.clock.elapsedTime * 0.035 + target * 0.45;
      pts.rotation.x = Math.sin(target * 0.8) * 0.08;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
