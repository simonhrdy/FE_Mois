'use client';

import { useEffect, useState } from 'react';

const CHARS_PER_FRAME = 3;

export function useTypewriter(text: string, enabled: boolean): string {
  const [length, setLength] = useState(enabled ? 0 : text.length);

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!enabled || reduced) {
      const frame = requestAnimationFrame(() => setLength(text.length));
      return () => cancelAnimationFrame(frame);
    }
    let frame = 0;
    const tick = () => {
      setLength((current) => {
        const next = Math.min(text.length, current + CHARS_PER_FRAME);
        if (next < text.length) frame = requestAnimationFrame(tick);
        return next;
      });
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [enabled, text]);

  return text.slice(0, length);
}
