"use client";

import { useEffect, useRef } from "react";

interface GhostClock {
  xRatio: number; // 0-1 position across viewport
  yRatio: number;
  radiusRatio: number; // relative to min(viewport dimension)
  speed: number; // rotation speed multiplier (counter-clockwise)
  color: string;
}

const CLOCKS: GhostClock[] = [
  { xRatio: 0.82, yRatio: 0.18, radiusRatio: 0.42, speed: 1, color: "245,158,11" }, // amber, large, top-right
  { xRatio: 0.12, yRatio: 0.82, radiusRatio: 0.26, speed: 1.7, color: "244,63,94" }, // rose, medium, bottom-left
  { xRatio: 0.5, yRatio: 0.5, radiusRatio: 0.15, speed: 2.4, color: "245,158,11" }, // amber, small, center
];

function drawClock(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  elapsedMs: number,
  clock: GhostClock
) {
  const alpha = 0.16;
  ctx.save();
  ctx.translate(cx, cy);

  // Rim
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(${clock.color},${alpha})`;
  ctx.lineWidth = Math.max(1, radius * 0.012);
  ctx.stroke();

  // Tick marks
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const inner = radius * 0.88;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    ctx.strokeStyle = `rgba(${clock.color},${alpha * 0.8})`;
    ctx.lineWidth = Math.max(1, radius * 0.008);
    ctx.stroke();
  }

  // Hands rotate counter-clockwise (negated angle), each clock at its own speed
  const t = elapsedMs * clock.speed;
  const secondAngle = -(t / 1000) * (Math.PI / 30) - Math.PI / 2;
  const minuteAngle = -(t / 60000) * (Math.PI / 30) - Math.PI / 2;
  const hourAngle = -(t / 3600000) * (Math.PI / 6) - Math.PI / 2;

  const drawHand = (angle: number, length: number, width: number, a: number) => {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
    ctx.strokeStyle = `rgba(${clock.color},${a})`;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  drawHand(hourAngle, radius * 0.5, Math.max(1.5, radius * 0.02), alpha * 1.3);
  drawHand(minuteAngle, radius * 0.72, Math.max(1, radius * 0.014), alpha * 1.1);
  drawHand(secondAngle, radius * 0.82, Math.max(0.75, radius * 0.008), alpha);

  ctx.restore();
}

export default function ReverseClockBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId: number;
    const startTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = (now: number) => {
      const elapsedMs = now - startTime;
      ctx.clearRect(0, 0, width, height);

      const minDim = Math.min(width, height);
      for (const clock of CLOCKS) {
        drawClock(
          ctx,
          clock.xRatio * width,
          clock.yRatio * height,
          clock.radiusRatio * minDim,
          elapsedMs,
          clock
        );
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full mix-blend-screen" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.85)_85%)]" />
    </div>
  );
}
