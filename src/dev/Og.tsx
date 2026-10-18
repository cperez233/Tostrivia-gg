/* editorial-ui · Cristian Pérez · cristianperez.me · imagen para compartir (solo en desarrollo) */
import { ANIMALS, Avatar } from "../components/Avatar";
import { FocusLines } from "../components/Wipe";
import { Seal } from "../components/Seal";
export default function Og() {
  return (
    <div style={{ position: "relative", width: 1200, height: 630, overflow: "hidden", background: "var(--ink)", display: "grid", alignContent: "center", padding: "0 72px", gap: 18 }}>
      <FocusLines className="og-lines" />
      <div style={{ display: "flex", alignItems: "center", gap: 22, position: "relative" }}>
        <Seal text="T" size={96} />
        <span style={{ fontFamily: "var(--display)", fontSize: 118, lineHeight: 1, color: "var(--paper)" }}>Tostrivia</span>
      </div>
      <p style={{ position: "relative", fontFamily: "var(--display)", fontSize: 50, color: "var(--hanko)", lineHeight: 1.1 }}>Anime, videojuegos y cultura general.</p>
      <p style={{ position: "relative", fontSize: 28, color: "var(--on-ink-2)", fontWeight: 700 }}>Gira la ruleta, responde contra el reloj y juega con hasta 10 amigos.</p>
      <div style={{ position: "relative", display: "flex", gap: 4, marginTop: 14 }}>
        {ANIMALS.map((a, i) => (
          <span key={a.name} style={{ transform: `translateY(${i % 2 ? 10 : 0}px) rotate(${(i % 3) * 4 - 4}deg)` }}>
            <Avatar animal={i} size={86} />
          </span>
        ))}
      </div>
      <style>{`.og-lines{position:absolute;left:50%;top:50%;width:2400px;height:2400px;margin:-1200px 0 0 -1200px;color:var(--ink-3)}`}</style>
    </div>
  );
}
