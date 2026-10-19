/* editorial-ui · Cristian Pérez · cristianperez.me
 * Elegir varias categorías para una misma partida: se marcan como fichas y salen preguntas de todas.
 */
import { useEffect, useRef, useState } from "react";
import { FAMILIES, GROUPS, categoriesOf } from "../data/categories";
import { partsOf, playable } from "../game/mix";

interface Props {
  open: boolean;
  /** la categoría actual: si es una mezcla, arranca con lo que ya tenía */
  current: string | null;
  onClose: () => void;
  onPick: (cats: string[]) => void;
}

export default function MixPicker({ open, current, onClose, onPick }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [sel, setSel] = useState<string[]>([]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      setSel(current?.startsWith("mix-") ? partsOf(current) : []);
      d.showModal();
    } else if (!open && d.open) d.close();
  }, [open, current]);

  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <dialog ref={ref} className="mixpick" aria-labelledby="mixpick-t" onClose={onClose} onCancel={onClose}>
      <div className="mixpick__head">
        <h2 id="mixpick-t">Elige varias categorías</h2>
        <p>Salen preguntas de todas, mezcladas.</p>
      </div>
      <div className="mixpick__body">
        {GROUPS.map((g) => (
          <section key={g.id} className="mixpick__group">
            <h3>{g.name}</h3>
            {FAMILIES.filter((f) => f.group === g.id).map((f) => {
              const list = categoriesOf(f.id).filter((c) => playable(c.id));
              if (!list.length) return null;
              return (
                <div key={f.id} className="mixpick__fam" role="group" aria-label={f.name}>
                  {list.map((c) => {
                    const on = sel.includes(c.id);
                    return (
                      <button key={c.id} type="button" className={`chip ${on ? "is-on" : ""}`} aria-pressed={on} onClick={() => toggle(c.id)}>
                        {c.short}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </section>
        ))}
      </div>
      <div className="mixpick__foot">
        <button type="button" className="btn btn--ghost btn--small" onClick={onClose}>
          Cancelar
        </button>
        <button type="button" className="btn btn--hanko btn--small" disabled={sel.length < 2} onClick={() => onPick(sel)}>
          {sel.length < 2 ? "Elige al menos 2" : `Usar ${sel.length} categorías`}
        </button>
      </div>
    </dialog>
  );
}
