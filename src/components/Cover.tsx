/* editorial-ui · Cristian Pérez · cristianperez.me
 * Portada de una categoría: su póster oficial, o un mosaico de cuatro en Openings y OST gaming.
 * La imagen entra con un fundido cuando termina de cargar; mientras tanto se ve el fondo de tinta.
 */
import { memo, useState } from "react";
import type { Category } from "../data/types";
import { coversOf } from "../lib/covers";

interface Props {
  cat: Category;
  /** ancho con que se pinta, para que el navegador elija 300 o 600 px */
  sizes?: string;
  eager?: boolean;
  /** la caja no es 2:3: el póster se ve entero sobre una copia difuminada de sí mismo */
  backdrop?: boolean;
  className?: string;
}

function CoverBase({ cat, sizes = "300px", eager, backdrop, className = "" }: Props) {
  const imgs = coversOf(cat);
  const mosaic = imgs.length > 1;
  return (
    <span className={`cover ${mosaic ? "cover--mosaic" : ""} ${backdrop && !mosaic ? "cover--backdrop" : ""} ${className}`} aria-hidden>
      {imgs.slice(0, 4).map((im) => (
        <Cell key={im.id} sm={im.sm} lg={im.lg} sizes={mosaic ? "160px" : sizes} eager={eager} backdrop={backdrop && !mosaic} />
      ))}
    </span>
  );
}

function Cell({ sm, lg, sizes, eager, backdrop }: { sm: string; lg: string; sizes: string; eager?: boolean; backdrop?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <span className={`cover__cell ${loaded ? "is-in" : ""}`}>
      {backdrop && !failed && <img src={sm} alt="" className="cover__back" decoding="async" draggable={false} />}
      {!failed && (
        <img
          // si ya estaba en caché, onLoad puede no llegar a tiempo: se revisa al montar
          ref={(el) => {
            if (el?.complete && el.naturalWidth > 0 && !loaded) setLoaded(true);
          }}
          src={sm}
          srcSet={`${sm} 300w, ${lg} 600w`}
          sizes={sizes}
          alt=""
          className="cover__img"
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}

export const Cover = memo(CoverBase);
