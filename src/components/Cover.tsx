/* editorial-ui · Cristian Pérez · cristianperez.me
 * Portada de una categoría: una miniatura oficial, o un mosaico de cuatro en "Al oído".
 */
import { memo, useState } from "react";
import type { Category } from "../data/types";
import { coversOf } from "../lib/covers";

interface Props {
  cat: Category;
  /** usa la miniatura grande (1280 px) cuando la portada ocupa media pantalla */
  big?: boolean;
  /** 640 px: fichas medianas */
  mid?: boolean;
  eager?: boolean;
  className?: string;
}

function CoverBase({ cat, big, mid, eager, className = "" }: Props) {
  const imgs = coversOf(cat);
  const mosaic = imgs.length > 1;
  return (
    <span className={`cover ${mosaic ? "cover--mosaic" : ""} ${className}`} aria-hidden>
      {imgs.slice(0, 4).map((im) => (
        <Cell key={im.key} src={big && !mosaic ? im.big : mid && !mosaic ? im.sd : im.hq} fallback={im.hq} wide={im.wide} sdBars={mid && !mosaic && !big && im.wide} focus={mosaic ? 50 : (cat.focus ?? 50)} eager={eager} />
      ))}
      <span className="cover__tone" />
    </span>
  );
}

function Cell({ src, fallback, wide, sdBars, focus, eager }: { src: string; fallback: string; wide: boolean; sdBars?: boolean; focus: number; eager?: boolean }) {
  const [url, setUrl] = useState(src);
  const [failed, setFailed] = useState(false);
  // la hqdefault de un video 16:9 trae franjas negras arriba y abajo
  const bars = wide && (url === fallback || (sdBars && url === src));
  return (
    <span className="cover__cell">
      {!failed && (
        <img
          src={url}
          alt=""
          className={bars ? "has-bars" : undefined}
          style={{ objectPosition: `${focus}% 50%` }}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          onLoad={(e) => {
            // maxresdefault que no existe llega como una imagen gris de 120 px
            if (url !== fallback && e.currentTarget.naturalWidth < 200) setUrl(fallback);
          }}
          onError={() => (url !== fallback ? setUrl(fallback) : setFailed(true))}
        />
      )}
    </span>
  );
}

export const Cover = memo(CoverBase);
