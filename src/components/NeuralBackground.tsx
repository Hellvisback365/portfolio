'use client';
import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

interface Particle {
  x: number;
  y: number;
  size: number;
  density: number;
  color: string;
  alpha: number;
  angle: number;
  speed: number;
}

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Premium colors configuration
    const isDark = theme === 'dark';
    // Brighter, more visible elegant colors
    const particleColor = isDark ? '224, 231, 255' : '79, 70, 229'; // Indigo-100 : Indigo-600
    const lineColor = isDark ? '199, 210, 254' : '99, 102, 241'; // Indigo-200 : Indigo-500

    let animationFrameId: number;
    let particlesArray: Particle[] = [];
    const mouse = { x: -1000, y: -1000, radius: 200 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', resizeCanvas);
    
    // Initial setup
    resizeCanvas();

    function initParticles() {
      particlesArray = [];
      // Balanced density for elegance
      const numberOfParticles = Math.floor((canvas!.width * canvas!.height) / 16000);
      
      for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 2.0 + 1.0; // Visible but elegant size
        const x = Math.random() * canvas!.width;
        const y = Math.random() * canvas!.height;
        
        particlesArray.push({
          x,
          y,
          size,
          density: (Math.random() * 20) + 1,
          color: particleColor,
          alpha: Math.random() * 0.5 + 0.2, // Better visibility
          angle: Math.random() * 360,
          speed: Math.random() * 0.15 + 0.05 // Slower, graceful movement
        });
      }
    }

    function updateParticles() {
      for (let i = 0; i < particlesArray.length; i++) {
        const p = particlesArray[i];
        
        // Organic floating movement
        p.angle += 0.005; // Slowly change direction
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;

        // Mouse interaction: Gentle repulsion
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.hypot(dx, dy);
        
        if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            const directionX = forceDirectionX * force * p.density * 0.5;
            const directionY = forceDirectionY * force * p.density * 0.5;
            
            p.x -= directionX;
            p.y -= directionY;
        }

        // Wrap around screen
        if (p.x > canvas!.width + 20) p.x = -20;
        else if (p.x < -20) p.x = canvas!.width + 20;
        
        if (p.y > canvas!.height + 20) p.y = -20;
        else if (p.y < -20) p.y = canvas!.height + 20;
      }
    }

    function drawParticles() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      
      connectParticles();

      for (let i = 0; i < particlesArray.length; i++) {
        const p = particlesArray[i];
        ctx!.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function connectParticles() {
      const maxDistance = 150;
      
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.hypot(dx, dy);

          if (distance < maxDistance) {
            const opacity = 1 - (distance / maxDistance);
            ctx!.strokeStyle = `rgba(${lineColor}, ${opacity * 0.3})`;
            ctx!.lineWidth = 1.0;
            ctx!.beginPath();
            ctx!.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx!.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx!.stroke();
          }
        }
      }
    }

    const animate = () => {
      updateParticles();
      drawParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, mounted]);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        aria-hidden="true"
      />
    </div>
  );
}
