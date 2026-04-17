"use client";

import { useEffect, useRef } from "react";

export function ScrollProgress() {
  const barRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
      frameRef.current = 0;
    };

    const onScroll = () => {
      if (frameRef.current) return;
      frameRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 h-px bg-white/5">
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-white/80 via-white/50 to-white/80"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
