import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  hue: number;
}

export const FireParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Particle[] = [];
    const particleCount = 80; // Más partículas

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    function createParticle(): Particle {
      return {
        x: Math.random() * canvas!.width,
        y: canvas!.height + 10,
        vx: (Math.random() - 0.5) * 0.8, // Más movimiento horizontal
        vy: -Math.random() * 2 - 0.8, // Más velocidad vertical
        size: Math.random() * 4 + 1, // Partículas más grandes
        life: 0,
        maxLife: Math.random() * 120 + 80, // Vida más variable
        hue: Math.random() * 40 + 15, // Rango más amplio de naranjas (15-55)
      };
    }

    function animate() {
      ctx!.fillStyle = 'rgba(0, 0, 0, 0.03)'; // Fade más suave
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      particles.forEach((particle, index) => {
        particle.life++;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy -= 0.01; // Slight upward acceleration

        const lifePercent = particle.life / particle.maxLife;
        const alpha = 1 - lifePercent;

        // Cosmic orange/gold glow
        const gradient = ctx!.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 2
        );
        gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 60%, ${alpha * 0.8})`);
        gradient.addColorStop(0.5, `hsla(${particle.hue}, 100%, 50%, ${alpha * 0.4})`);
        gradient.addColorStop(1, `hsla(${particle.hue}, 100%, 40%, 0)`);

        ctx!.fillStyle = gradient;
        ctx!.beginPath();
        ctx!.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx!.fill();

        // Reset particle if it's dead or out of bounds
        if (particle.life >= particle.maxLife || particle.y < -10) {
          particles[index] = createParticle();
        }
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
