'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';
import Scene from '@/components/canvas/Scene';
import HtmlOverlay from '@/components/overlay/HtmlOverlay';
import RagChatOverlay from '@/components/overlay/RagChatOverlay';
import NavigationOverlay from '@/components/overlay/NavigationOverlay';
import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Main page — 3D immersive portfolio.
 *
 * Architecture Refactored:
 * - ReactLenis for native smooth scrolling
 * - Full-screen fixed <Canvas> as background
 * - Normal HTML flow for overlays (no longer inside <ScrollControls>)
 */
export default function Home() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.05, wheelMultiplier: 1 }}>
      <div className="relative w-full">
        
        {/* Fixed 3D Canvas Background */}
        <div className="fixed inset-0 z-0 h-screen w-screen">
          <Canvas
            camera={{ fov: 50, position: [0, 0, 20], near: 0.1, far: 150 }}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: 'high-performance',
            }}
            dpr={[1, 1.5]}
            style={{ background: '#030303' }}
          >
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </Canvas>
        </div>

        {/* Scrollable DOM Overlay */}
        <div className="relative z-10 w-full pointer-events-none">
          <div className="pointer-events-auto">
            <HtmlOverlay />
          </div>
        </div>

        {/* Overlays (fixed position, above everything) */}
        <div className="pointer-events-auto">
          <NavigationOverlay />
          <RagChatOverlay />
        </div>
      </div>
    </ReactLenis>
  );
}
