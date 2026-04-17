"use client";

import { useEffect, useRef } from "react";
import { SITE } from "../config/site";

const DOT_SPACING = 12; // px between dots
const DOT_RADIUS = 1.4;
const FLASHLIGHT_RADIUS = 220; // px — cursor proximity radius
const BASE_OPACITY = 0.06;
const TEXT_BASE_OPACITY = 0.1; // text dots always slightly visible
const TEXT_OPACITY_BOOST = 1.0; // text dots pop when cursor is near
const GLOW_OPACITY_BOOST = 0.1; // non-text dots glow slightly near cursor
const FONT_CSS = `700 min(22vw, 340px) "PP Mori", system-ui, sans-serif`;
const REVEAL_TEXT = "ASSEMBLY\nSTUDIO";

function InteractiveDotGrid() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let dots = []; // { x, y, isText }
    let cursor = { x: -9999, y: -9999, hasEntered: false };
    let raf = 0;

    // Build the "ASSEMBLY STUDIO" text mask from an off-screen canvas.
    const buildTextMask = () => {
      const mask = document.createElement("canvas");
      mask.width = width;
      mask.height = height;
      const mctx = mask.getContext("2d");
      if (!mctx) return null;

      mctx.fillStyle = "#fff";
      mctx.textAlign = "center";
      mctx.textBaseline = "middle";
      mctx.font = FONT_CSS;

      // Two-line text (ASSEMBLY over STUDIO).
      const lines = REVEAL_TEXT.split("\n");
      const lineHeight = Math.min(width * 0.22, height * 0.45);
      const totalHeight = lineHeight * lines.length;
      const startY = (height - totalHeight) / 2 + lineHeight / 2;
      lines.forEach((line, i) => {
        mctx.fillText(line, width / 2, startY + i * lineHeight);
      });

      return mctx.getImageData(0, 0, width, height);
    };

    const rebuild = () => {
      const rect = container.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const mask = buildTextMask();
      const cols = Math.floor(width / DOT_SPACING);
      const rows = Math.floor(height / DOT_SPACING);
      const offsetX = (width - cols * DOT_SPACING) / 2 + DOT_SPACING / 2;
      const offsetY = (height - rows * DOT_SPACING) / 2 + DOT_SPACING / 2;

      dots = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = offsetX + c * DOT_SPACING;
          const y = offsetY + r * DOT_SPACING;
          let isText = false;
          if (mask) {
            const px = Math.floor(x);
            const py = Math.floor(y);
            const idx = (py * width + px) * 4 + 3; // alpha channel
            isText = mask.data[idx] > 128;
          }
          dots.push({ x, y, isText });
        }
      }
    };

    const draw = () => {
      raf = 0;
      ctx.clearRect(0, 0, width, height);
      const rSq = FLASHLIGHT_RADIUS * FLASHLIGHT_RADIUS;

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        let opacity = d.isText ? TEXT_BASE_OPACITY : BASE_OPACITY;
        if (cursor.hasEntered) {
          const dx = d.x - cursor.x;
          const dy = d.y - cursor.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < rSq) {
            const proximity = 1 - Math.sqrt(distSq) / FLASHLIGHT_RADIUS;
            const eased = proximity * proximity; // soft falloff
            const boost = d.isText ? TEXT_OPACITY_BOOST : GLOW_OPACITY_BOOST;
            opacity += eased * boost;
          }
        }
        if (opacity < 0.02) continue;
        ctx.globalAlpha = Math.min(opacity, 1);
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(d.x, d.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(draw);
    };

    const onMove = (e) => {
      const rect = container.getBoundingClientRect();
      cursor.x = e.clientX - rect.left;
      cursor.y = e.clientY - rect.top;
      cursor.hasEntered = true;
      schedule();
    };

    const onLeave = () => {
      cursor.hasEntered = false;
      schedule();
    };

    const onResize = () => {
      rebuild();
      schedule();
    };

    rebuild();
    draw();
    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);

    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-auto absolute inset-0"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

export function Footer() {
  return (
    <footer>
      {/* Interactive dot grid — decorative texture, reveals on hover */}
      <section className="gradient-divider relative overflow-hidden">
        <div className="relative h-[48vh] min-h-[360px] w-full">
          <InteractiveDotGrid />
        </div>
      </section>
    </footer>
  );
}
