'use client';

import dynamic from 'next/dynamic';
import { ReactLenis, useLenis } from 'lenis/react';
import HtmlOverlay from '@/components/overlay/HtmlOverlay';
import NavigationOverlay from '@/components/overlay/NavigationOverlay';
import CopilotOverlay from '@/components/overlay/CopilotOverlay';
import { scrollProgress, SECTIONS } from '@/store/useAppStore';

// Il canvas è client-only e fuori dal critical path: la pagina (testo,
// SEO, a11y) è servita subito, il WebGL arriva un istante dopo.
const Experience = dynamic(() => import('@/components/canvas/Experience'), {
  ssr: false,
});

/**
 * Unica fonte di verità dello scroll: il callback di Lenis scrive nel
 * canale transiente dello store. Il loop WebGL legge `scrollProgress`
 * via ref — nessuna lettura di layout dentro requestAnimationFrame,
 * nessun re-render React per frame.
 */
import { useEffect, useRef } from 'react';

function ScrollBridge() {
  const offsetsRef = useRef<number[]>([]);

  useEffect(() => {
    function computeOffsets() {
      const offsets = SECTIONS.map(id => {
        const el = document.getElementById(id);
        return el ? el.offsetTop : 0;
      });
      offsetsRef.current = offsets;
    }
    
    computeOffsets();
    
    // Ricalcola solo quando la finestra cambia dimensioni
    window.addEventListener('resize', computeOffsets);
    return () => window.removeEventListener('resize', computeOffsets);
  }, []);

  useLenis((lenis) => {
    const p = lenis.limit > 0 ? lenis.scroll / lenis.limit : 0;
    scrollProgress.value = p;
    
    const offsets = offsetsRef.current;
    if (offsets.length === SECTIONS.length) {
      let currentStage = 0;
      for (let i = 0; i < SECTIONS.length - 1; i++) {
        const currentTop = offsets[i];
        const nextTop = offsets[i + 1];
        
        if (lenis.scroll >= currentTop && lenis.scroll < nextTop) {
          const sectionProgress = (lenis.scroll - currentTop) / (nextTop - currentTop);
          currentStage = i + sectionProgress;
          break;
        } else if (lenis.scroll >= nextTop && i === SECTIONS.length - 2) {
           currentStage = SECTIONS.length - 1;
        }
      }
      scrollProgress.stage = currentStage;
    } else {
      scrollProgress.stage = p * (SECTIONS.length - 1);
    }
  });
  return null;
}

export default function Home() {
  return (
    <ReactLenis root options={{ lerp: 0.08, wheelMultiplier: 1 }}>
      <ScrollBridge />
      <div className="relative w-full">
        {/* Sfondo 3D fisso */}
        <div className="fixed inset-0 z-0 h-dvh w-screen" aria-hidden="true">
          <Experience />
          {/* Vignettatura: lega i punti al fondale e protegge la leggibilità */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 50% 45%, transparent 35%, rgba(4,6,12,0.55) 100%)',
            }}
          />
        </div>

        {/* Contenuto DOM scrollabile */}
        <div className="relative z-10 w-full">
          <HtmlOverlay />
        </div>

        {/* Layer fissi */}
        <NavigationOverlay />
        <CopilotOverlay />
      </div>
    </ReactLenis>
  );
}
