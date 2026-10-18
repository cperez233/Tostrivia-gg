/* editorial-ui · Cristian Pérez · cristianperez.me
 * Onda de tinta desde el punto exacto del toque, para todos los botones con un solo listener (motion-patterns 79).
 */
export function installRipple() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  window.addEventListener(
    "pointerdown",
    (e) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(".btn, .opt, .row, .tab, .seg");
      if (!el || (el as HTMLButtonElement).disabled) return;
      const r = el.getBoundingClientRect();
      const box = document.createElement("span");
      box.className = "ripple-box";
      const dot = document.createElement("span");
      const d = Math.hypot(r.width, r.height) * 2;
      dot.style.width = dot.style.height = `${d}px`;
      dot.style.left = `${e.clientX - r.left - d / 2}px`;
      dot.style.top = `${e.clientY - r.top - d / 2}px`;
      box.appendChild(dot);
      if (getComputedStyle(el).position === "static") el.style.position = "relative";
      el.appendChild(box);
      setTimeout(() => box.remove(), 700);
    },
    { passive: true },
  );
}
