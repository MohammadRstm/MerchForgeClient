import { useEffect, useRef, useState } from 'react';

/**
 * Returns a `translateY` offset (in px) driven by how far the element has
 * scrolled through the viewport, for a subtle parallax drift. `strength`
 * controls how many px of drift per 100px scrolled. No-op (returns 0) when
 * the user prefers reduced motion.
 */
export default function useParallax<T extends HTMLElement>(strength = 0.15) {
  const ref = useRef<T>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const node = ref.current;
    if (!node) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const viewportMid = window.innerHeight / 2;
      const distanceFromMid = rect.top + rect.height / 2 - viewportMid;
      setOffset(distanceFromMid * -strength);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [strength]);

  // A plain tuple, not { ref, offset } - a returned object bundling a ref together
  // with derived state gets the whole object treated as ref-shaped by the
  // react-hooks/refs rule, which then flags every property read on it (including
  // .offset, which is plain useState, not a ref) as an unsafe render-time ref
  // access. Destructured array bindings don't carry that taint.
  return [ref, offset] as const;
}
