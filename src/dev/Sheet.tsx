/* editorial-ui · Cristian Pérez · cristianperez.me · hoja de prueba (solo en desarrollo) */
import { ANIMALS, Avatar } from "../components/Avatar";
export default function Sheet() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24, padding: 24, background: "#121110" }}>
      {ANIMALS.map((a, i) => (
        <figure key={a.name} style={{ margin: 0, textAlign: "center", color: "#fff", font: "14px sans-serif" }}>
          <Avatar animal={i} size={160} />
          <figcaption>{a.name}</figcaption>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center", marginTop: 6 }}>
            <Avatar animal={i} size={58} />
            <Avatar animal={i} size={34} />
            <Avatar animal={i} size={26} />
          </div>
        </figure>
      ))}
    </div>
  );
}
