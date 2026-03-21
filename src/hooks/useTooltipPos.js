import { useState, useRef } from "react";

export function useTooltipPos(ref, tooltipWidth = 280) {
  const tooltipRef = useRef(null);
  const [style, setStyle] = useState({ position: "fixed", visibility: "hidden", top: 0, left: 0 });

  const calcPos = () => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setStyle({ position: "fixed", visibility: "hidden", top: 0, left: 0, width: tooltipWidth });
    requestAnimationFrame(() => {
      const ttEl = tooltipRef.current;
      const ttH = ttEl ? ttEl.offsetHeight : 200;
      const half = tooltipWidth / 2;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(vh, rect.bottom);
      const cx = rect.left + rect.width / 2;

      const spaceAbove = visibleTop - 8;
      const spaceBelow = vh - visibleBottom - 8;
      const fitsAbove = spaceAbove >= ttH;
      const fitsBelow = spaceBelow >= ttH;

      if (fitsAbove && (!fitsBelow || spaceAbove >= spaceBelow)) {
        setStyle({
          position: "fixed",
          top: visibleTop - 8 - ttH,
          left: Math.max(8, Math.min(cx - half, vw - tooltipWidth - 8)),
          width: tooltipWidth,
        });
      } else if (fitsBelow) {
        setStyle({
          position: "fixed",
          top: visibleBottom + 8,
          left: Math.max(8, Math.min(cx - half, vw - tooltipWidth - 8)),
          width: tooltipWidth,
        });
      } else if (rect.right + 8 + tooltipWidth < vw) {
        setStyle({
          position: "fixed",
          top: Math.max(8, Math.min(visibleTop, vh - ttH - 8)),
          left: rect.right + 8,
          width: tooltipWidth,
        });
      } else if (rect.left - 8 - tooltipWidth > 0) {
        setStyle({
          position: "fixed",
          top: Math.max(8, Math.min(visibleTop, vh - ttH - 8)),
          left: rect.left - 8 - tooltipWidth,
          width: tooltipWidth,
        });
      } else {
        setStyle({
          position: "fixed",
          top: 8,
          left: Math.max(8, Math.min(cx - half, vw - tooltipWidth - 8)),
          width: tooltipWidth,
        });
      }
    });
  };

  return { tooltipRef, style, calcPos };
}
