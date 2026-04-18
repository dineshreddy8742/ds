import React, { useEffect, useRef } from 'react';

export const StarField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    let animationFrameId;

    const stars = [];
    const numStars = 200;
    const speed = 0.5;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Star {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * canvas.width;
        this.prevZ = this.z;
      }

      update() {
        this.prevZ = this.z;
        this.z -= speed * 15;
        if (this.z <= 0) {
          this.reset();
          this.prevZ = this.z;
        }
      }

      draw() {
        const x = (this.x - canvas.width / 2) * (canvas.width / this.z);
        const y = (this.y - canvas.height / 2) * (canvas.width / this.z);
        const s = (canvas.width / this.z) * 1.5;

        const prevX = (this.x - canvas.width / 2) * (canvas.width / this.prevZ);
        const prevY = (this.y - canvas.height / 2) * (canvas.width / this.prevZ);

        ctx.beginPath();
        ctx.strokeStyle = `rgba(59, 130, 246, ${Math.min(1, 100 / this.z)})`;
        ctx.lineWidth = s;
        ctx.moveTo(x + canvas.width / 2, y + canvas.height / 2);
        ctx.lineTo(prevX + canvas.width / 2, prevY + canvas.height / 2);
        ctx.stroke();
      }
    }

    const init = () => {
      resize();
      for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
      }
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.15)'; // Trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        star.update();
        star.draw();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    init();
    draw();

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
};
