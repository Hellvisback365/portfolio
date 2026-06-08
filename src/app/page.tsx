'use client';

import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import { Suspense, useState } from 'react';
import Scene from '@/components/canvas/Scene';
import HtmlOverlay from '@/components/overlay/HtmlOverlay';
import RagChatOverlay from '@/components/overlay/RagChatOverlay';
import NavigationOverlay from '@/components/overlay/NavigationOverlay';

/**
 * Main page — 3D immersive portfolio.
 *
 * Architecture:
 * - Full-screen <Canvas> with ScrollControls (5 pages, damping 0.1)
 * - Inside Canvas: Scene (3D elements) + HtmlOverlay (HTML sections via <Scroll html>)
 * - Outside Canvas: RagChatOverlay (floating panel) + NavigationOverlay (dots + progress)
 */
export default function Home() {
  const [pages, setPages] = useState(5);

  return (
    <div className="canvas-container">
      <Canvas
        camera={{ fov: 50, position: [0, 0, 20], near: 0.1, far: 150 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
        style={{ background: '#050505' }}
      >
        <ScrollControls pages={pages} damping={0.1}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
          <HtmlOverlay setPages={setPages} />
        </ScrollControls>
      </Canvas>

      {/* Overlays outside Canvas (fixed position, above everything) */}
      <NavigationOverlay />
      <RagChatOverlay />
    </div>
  );
}
