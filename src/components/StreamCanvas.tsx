"use client";

import { useEffect, useRef } from "react";

type Particle = {
  lane: number;
  x: number;
  speed: number;
  len: number;
  flagged: boolean;
  screened: boolean;
  flash: number;
  drop: number;
};

/**
 * A stylised real-time event stream: transactions flow along lanes, pass a
 * scanner, and a small fraction get flagged and diverted — a nod to the
 * real-time scam intervention engine.
 */
export default function StreamCanvas({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let lanes = 0;
    let laneGap = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let visible = true;
    let last = performance.now();

    const ACCENT = "212, 255, 58";
    const SIGNAL = "255, 90, 54";

    const spawn = (initial = false): Particle => ({
      lane: Math.floor(Math.random() * lanes),
      x: initial ? Math.random() * w : -40 - Math.random() * w * 0.3,
      speed: 60 + Math.random() * 160,
      len: 6 + Math.random() * 26,
      flagged: Math.random() < 0.022,
      screened: false,
      flash: 0,
      drop: 0,
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      laneGap = w < 640 ? 26 : 30;
      lanes = Math.max(6, Math.floor(h / laneGap));
      const count = Math.round((w * lanes) / 90);
      particles = Array.from({ length: count }, () => spawn(true));
    };

    const scanX = () => w * (w < 768 ? 0.72 : 0.64);
    const laneY = (lane: number) => (h - (lanes - 1) * laneGap) / 2 + lane * laneGap;

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);
      const sx = scanX();

      // lanes
      ctx.lineWidth = 1;
      for (let i = 0; i < lanes; i++) {
        const y = Math.round(laneY(i)) + 0.5;
        ctx.strokeStyle = "rgba(255,255,255,0.045)";
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // scanner beam
      const grad = ctx.createLinearGradient(sx - 60, 0, sx + 2, 0);
      grad.addColorStop(0, `rgba(${ACCENT},0)`);
      grad.addColorStop(1, `rgba(${ACCENT},0.07)`);
      ctx.fillStyle = grad;
      ctx.fillRect(sx - 60, 0, 62, h);
      ctx.fillStyle = `rgba(${ACCENT},0.5)`;
      ctx.fillRect(sx, 0, 1, h);

      for (const p of particles) {
        p.x += p.speed * dt;
        let y = laneY(p.lane);

        if (!p.screened && p.x >= sx) {
          p.screened = true;
          p.flash = 1;
        }
        if (p.flash > 0) p.flash = Math.max(0, p.flash - dt * 1.6);
        if (p.flagged && p.screened) {
          p.drop += dt * 1.2;
          p.speed *= 1 - dt * 1.8;
          y += Math.sin(Math.min(p.drop, 1) * Math.PI * 0.5) * laneGap * 0.5;
        }

        let color: string;
        if (!p.screened) {
          color = `rgba(236,236,232,${0.18 + (p.len / 32) * 0.25})`;
        } else if (p.flagged) {
          color = `rgba(${SIGNAL},${Math.max(0, 1 - p.drop * 0.55)})`;
        } else {
          color = `rgba(${ACCENT},${0.25 + p.flash * 0.75})`;
        }

        ctx.fillStyle = color;
        ctx.fillRect(p.x - p.len, y - 1, p.len, 2);

        if (p.flagged && p.screened && p.drop < 1.8) {
          const a = Math.max(0, 1 - p.drop / 1.8);
          ctx.strokeStyle = `rgba(${SIGNAL},${a})`;
          ctx.lineWidth = 1;
          const r = 6 + p.drop * 14;
          ctx.beginPath();
          ctx.arc(p.x, y, r, 0, Math.PI * 2);
          ctx.stroke();
          ctx.font = "500 9px ui-monospace, SFMono-Regular, Menlo, monospace";
          ctx.fillStyle = `rgba(${SIGNAL},${a})`;
          ctx.fillText("FLAGGED", p.x + r + 4, y + 3);
        }

        if (p.x - p.len > w + 20 || p.drop > 2.2) {
          Object.assign(p, spawn());
        }
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (visible) draw(dt);
      raf = requestAnimationFrame(loop);
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(0);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      last = performance.now();
    });
    io.observe(canvas);

    if (reduce) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
