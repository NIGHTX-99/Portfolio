"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const CLEAR_THRESHOLD = 0.55;
const BRUSH_RADIUS = 48;

type RevealCanvasProps = {
  imageSrc: string;
  revealSeed: number;
};

export function RevealCanvas({ imageSrc, revealSeed }: RevealCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scratchingRef = useRef(false);
  const clearedRef = useRef(false);
  const [hintVisible, setHintVisible] = useState(true);
  const [fullyRevealed, setFullyRevealed] = useState(false);

  const paintCoat = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#f4f4f5");
    grad.addColorStop(0.5, "#e4e4e7");
    grad.addColorStop(1, "#d4d4d8");
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "rgba(24, 24, 27, 0.06)";
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = Math.random() * 2 + 0.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const resizeCanvas = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const { width, height } = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintCoat(ctx, width, height);
    clearedRef.current = false;
    setFullyRevealed(false);
    setHintVisible(true);
  }, [paintCoat]);

  useEffect(() => {
    resizeCanvas();
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => resizeCanvas());
    observer.observe(container);
    return () => observer.disconnect();
  }, [resizeCanvas, revealSeed, imageSrc]);

  const scratchAt = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || clearedRef.current) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const checkCleared = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || clearedRef.current) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const { width, height } = canvas;
    const data = ctx.getImageData(0, 0, width, height).data;
    let transparent = 0;
    let samples = 0;
    const step = 32;
    for (let i = 3; i < data.length; i += step) {
      samples++;
      if (data[i] < 128) transparent++;
    }
    if (samples > 0 && transparent / samples >= CLEAR_THRESHOLD) {
      clearedRef.current = true;
      setFullyRevealed(true);
      setHintVisible(false);
    }
  }, []);

  const revealAll = useCallback(() => {
    clearedRef.current = true;
    setFullyRevealed(true);
    setHintVisible(false);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (clearedRef.current) return;
    scratchingRef.current = true;
    setHintVisible(false);
    e.currentTarget.setPointerCapture(e.pointerId);
    scratchAt(e.clientX, e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!scratchingRef.current || clearedRef.current) return;
    scratchAt(e.clientX, e.clientY);
  };

  const onPointerUp = () => {
    if (scratchingRef.current) {
      scratchingRef.current = false;
      checkCleared();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      revealAll();
    }
  };

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <Image
        src={imageSrc}
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <canvas
        ref={canvasRef}
        role="button"
        tabIndex={0}
        aria-label="Scratch to reveal background artwork. Press Enter or Space to reveal all."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={revealAll}
        onKeyDown={onKeyDown}
        className={`absolute inset-0 touch-none cursor-crosshair transition-opacity duration-700 ${
          fullyRevealed ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      />
      {hintVisible && !fullyRevealed && (
        <p className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-sm tracking-wide text-zinc-600/80">
          Scratch to reveal
        </p>
      )}
    </div>
  );
}
