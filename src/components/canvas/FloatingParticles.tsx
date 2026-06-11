'use client';

import { Sparkles } from '@react-three/drei';

export default function FloatingParticles({ zRange }: { zRange?: [number, number] }) {
  // Place sparkles across the entire camera path
  return (
    <group position={[0, 0, -20]}>
      {/* Dense core of tiny particles */}
      <Sparkles 
        count={800} 
        scale={[40, 30, 150]} 
        size={1.5} 
        speed={0.2} 
        opacity={0.3} 
        color="#ffffff" 
        noise={1}
      />
      
      {/* Sparser, larger bokeh particles */}
      <Sparkles 
        count={200} 
        scale={[30, 20, 120]} 
        size={4} 
        speed={0.4} 
        opacity={0.1} 
        color="#ffffff" 
        noise={2}
      />
    </group>
  );
}
