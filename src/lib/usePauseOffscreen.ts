/* editorial-ui · Cristian Pérez · cristianperez.me
 * Los bucles CSS (clases anim-*) se pausan cuando su contenedor sale de la pantalla (motion-patterns 50).
 */
import { useEffect, useRef } from "react";

export function usePauseOffscreen<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("is-paused", !e.isIntersecting), { rootMargin: "80px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
