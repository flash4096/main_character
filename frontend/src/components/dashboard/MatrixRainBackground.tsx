"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

const GLYPHS = "0123456789ABCDEF01010110ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ";

export default function MatrixRainBackground() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (theme !== "matrix") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const fontSize = 16;
    let columns = Math.floor(width / fontSize);
    let drops: number[] = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));
    let speeds: number[] = Array.from({ length: columns }, () => 1 + Math.random() * 0.8);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));
      speeds = Array.from({ length: columns }, () => 1 + Math.random() * 0.8);
    };

    window.addEventListener("resize", handleResize);

    let lastTime = 0;
    const interval = 1000 / 30; // 30 FPS for silky performance & authentic 90s terminal feel

    const render = (currentTime: number) => {
      animFrameId = requestAnimationFrame(render);

      const delta = currentTime - lastTime;
      if (delta < interval) return;
      lastTime = currentTime - (delta % interval);

      // Semi-transparent fade to create fading phosphor trail
      ctx.fillStyle = "rgba(2, 8, 4, 0.09)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Head of the stream is bright neon white/green
        if (Math.random() > 0.88) {
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#00ff41";
          ctx.shadowBlur = 12;
        } else {
          ctx.fillStyle = "#00ff41";
          ctx.shadowColor = "#00ff41";
          ctx.shadowBlur = 6;
        }

        ctx.fillText(char, x, y);

        // Reset shadow
        ctx.shadowBlur = 0;

        // If off screen, reset drop to top randomly
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i] += speeds[i];
      }
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrameId);
    };
  }, [theme]);

  if (theme !== "matrix") return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background Matrix Rain Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-45 mix-blend-screen"
      />
      {/* Radial vignette mask to keep center dashboard readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(2,8,4,0.35)_0%,rgba(2,8,4,0.92)_85%)]" />
      {/* Subtle CRT Scanline overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,255,65,0.03)_50%)] bg-[length:100%_4px] opacity-60" />
    </div>
  );
}
