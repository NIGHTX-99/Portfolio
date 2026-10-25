"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Scratch-to-reveal hero cover, ported from the mimo.xiaomi.com/mimocode
// landing page: a solid sheet the same colour as the page hides the artwork
// underneath. Every animation frame the sheet is repainted solid, then every
// living "ink dot" along the cursor path is carved back out of it. Each dot
// expands from R_START toward a random max near R_END while its alpha fades,
// over LIFETIME ms — so the artwork flashes open under the cursor and the
// cover heals itself about half a second after you stop moving. Nothing is
// ever permanently scratched off.
// Touch devices have no cursor hover scratch interaction, so (like the reference)
// the sheet is bypassed on non-hover devices and the artwork stays visible.
const MASK = "#ffffff"; // must match the page background
const R_START = 8; // each ink dot starts small…
const R_END = 128; // …and expands to a per-dot random max around this
const R_VARY = 0.45; // per-dot size randomness → lively brush-like variation
const LIFETIME = 1800; // ms — very slow, smooth fade so users can see the whole image clearly
const STAMP_STEP = 12; // distance between ink dots along the cursor path
const MAX_STAMPS = 160; // cap on simultaneously-living ink dots

type Stamp = {
  x: number;
  y: number;
  born: number;
  seed: number;
  rmax: number;
};

type RevealCanvasProps = {
  imageSrc: string;
  revealSeed: number;
};

export function RevealCanvas({ imageSrc, revealSeed }: RevealCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hintVisible, setHintVisible] = useState(true);
  const [artReady, setArtReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const surface = container?.closest("section") ?? container?.parentElement;
    if (!container || !canvas || !surface) return;

    if (!window.matchMedia("(hover: hover)").matches) {
      // Defer state updates to avoid set-state-in-effect warning
      queueMicrotask(() => {
        setArtReady(true);
        setHintVisible(false);
      });
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let running = false;
    let raf = 0;
    let lastX: number | null = null;
    let lastY: number | null = null;
    const stamps: Stamp[] = [];

    function paintCover() {
      // Full screen solid mask sheet covering the entire canvas.
      ctx!.globalCompositeOperation = "source-over";
      ctx!.fillStyle = MASK;
      ctx!.fillRect(0, 0, width, height);
    }

    function resize() {
      const rect = container!.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = width + "px";
      canvas!.style.height = height + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintCover();
    }

    function addStamp(x: number, y: number) {
      if (stamps.length >= MAX_STAMPS) stamps.shift();
      stamps.push({
        x,
        y,
        born: performance.now(),
        seed: revealSeed + Math.random() * Math.PI * 2,
        rmax: R_END * (1 - R_VARY + Math.random() * R_VARY),
      });
    }

    function stampAlong(x: number, y: number) {
      if (lastX === null || lastY === null) {
        addStamp(x, y);
      } else {
        const dx = x - lastX;
        const dy = y - lastY;
        const dist = Math.hypot(dx, dy);
        const steps = Math.max(1, Math.ceil(dist / STAMP_STEP));
        for (let i = 1; i <= steps; i++) {
          addStamp(lastX + (dx * i) / steps, lastY + (dy * i) / steps);
        }
      }
      lastX = x;
      lastY = y;
      if (hintVisible) setHintVisible(false);
    }

    function carveInk(x: number, y: number, r: number, alpha: number, seed: number) {
      const g = ctx!.createRadialGradient(x, y, r * 0.25, x, y, r);
      g.addColorStop(0, `rgba(0, 0, 0, ${0.95 * alpha})`);
      g.addColorStop(0.55, `rgba(0, 0, 0, ${0.88 * alpha})`);
      g.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx!.fillStyle = g;
      ctx!.beginPath();
      const segs = 32;
      for (let i = 0; i <= segs; i++) {
        const a = (i / segs) * Math.PI * 2;
        const wob =
          0.78 +
          0.14 * Math.sin(a * 3 + seed) +
          0.08 * Math.sin(a * 7 + seed * 2.1) +
          0.05 * Math.sin(a * 13 + seed * 0.7);
        const rr = r * wob;
        const px = x + Math.cos(a) * rr;
        const py = y + Math.sin(a) * rr;
        if (i === 0) ctx!.moveTo(px, py);
        else ctx!.lineTo(px, py);
      }
      ctx!.closePath();
      ctx!.fill();
    }

    function loop() {
      const now = performance.now();

      paintCover();

      ctx!.globalCompositeOperation = "destination-out";
      for (let i = stamps.length - 1; i >= 0; i--) {
        const t = (now - stamps[i].born) / LIFETIME;
        if (t >= 1) {
          stamps.splice(i, 1);
          continue;
        }
        const ease = 1 - Math.pow(1 - t, 3);
        const r = R_START + (stamps[i].rmax - R_START) * ease;
        const alpha = 1 - t * t;
        carveInk(stamps[i].x, stamps[i].y, r, alpha, stamps[i].seed);
      }

      if (stamps.length > 0) {
        raf = requestAnimationFrame(loop);
      } else {
        running = false;
      }
    }

    function start() {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    }

    function toLocal(e: MouseEvent) {
      const rect = container!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > width || y > height) return;
      stampAlong(x, y);
    }

    function handleEnter(e: MouseEvent) {
      toLocal(e);
      start();
    }

    function handleMove(e: MouseEvent) {
      toLocal(e);
      start();
    }

    function handleLeave() {
      lastX = null;
      lastY = null;
    }

    resize();
    queueMicrotask(() => setArtReady(true));
    const ro = new ResizeObserver(() => resize());
    ro.observe(container);
    surface.addEventListener("mouseenter", handleEnter);
    surface.addEventListener("mousemove", handleMove);
    surface.addEventListener("mouseleave", handleLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      surface.removeEventListener("mouseenter", handleEnter);
      surface.removeEventListener("mousemove", handleMove);
      surface.removeEventListener("mouseleave", handleLeave);
    };
  }, [imageSrc, revealSeed]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <Image
        src={imageSrc}
        alt=""
        fill
        priority
        className={`object-cover object-center transition-opacity duration-300 ${
          artReady ? "opacity-100" : "opacity-0"
        }`}
        sizes="100vw"
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 cursor-crosshair"
      />
      {hintVisible && (
        <p className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-sm tracking-wide text-zinc-500/80">
          Scratch to reveal
        </p>
      )}
    </div>
  );
}
