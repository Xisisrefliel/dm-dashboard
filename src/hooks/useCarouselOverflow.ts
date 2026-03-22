import { useState, useEffect, type RefObject } from "react";

export function useCarouselOverflow(ref: RefObject<HTMLElement | null>): boolean {
  const [overflows, setOverflows] = useState(true);
  const [, bump] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) {
      const id = requestAnimationFrame(() => bump((n) => n + 1));
      return () => cancelAnimationFrame(id);
    }
    const check = () => setOverflows(el.scrollWidth > el.clientWidth + 2);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  });
  return overflows;
}
