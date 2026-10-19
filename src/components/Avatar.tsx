/* editorial-ui · Cristian Pérez · cristianperez.me
 * Los jugadores: doce calcomanías de animales chibi, una raza por persona en la sala.
 * En tamaños chicos se recorta la cara en un medallón para que se reconozca.
 */
import { memo } from "react";
import capibara from "../assets/animals/capibara.webp";
import shiba from "../assets/animals/shiba.webp";
import corgi from "../assets/animals/corgi.webp";
import pug from "../assets/animals/pug.webp";
import husky from "../assets/animals/husky.webp";
import salchicha from "../assets/animals/salchicha.webp";
import gatoNaranja from "../assets/animals/gato-naranja.webp";
import gatoNegro from "../assets/animals/gato-negro.webp";
import siames from "../assets/animals/siames.webp";
import bulldog from "../assets/animals/bulldog.webp";
import pandaRojo from "../assets/animals/panda-rojo.webp";
import ajolote from "../assets/animals/ajolote.webp";
import "./avatar.css";
import { translateFields } from "../i18n";

export interface Animal {
  name: string;
  src: string;
  /** fondo del medallón en tamaños chicos */
  tint: string;
}

export const ANIMALS: Animal[] = [
  { name: "Capibara", src: capibara, tint: "#FFE7BF" },
  { name: "Shiba", src: shiba, tint: "#FFDCC2" },
  { name: "Corgi", src: corgi, tint: "#FFF0C4" },
  { name: "Pug", src: pug, tint: "#F2E3CF" },
  { name: "Husky", src: husky, tint: "#DCE8F4" },
  { name: "Salchicha", src: salchicha, tint: "#FBDCC8" },
  { name: "Gato naranja", src: gatoNaranja, tint: "#FFE3BE" },
  { name: "Gato negro", src: gatoNegro, tint: "#FFEFAE" },
  { name: "Siamés", src: siames, tint: "#DDEBF6" },
  { name: "Bulldog", src: bulldog, tint: "#F3E6DA" },
  { name: "Panda rojo", src: pandaRojo, tint: "#FFD9C6" },
  { name: "Ajolote", src: ajolote, tint: "#FFE0EC" },
];

// el nombre de cada animal sale en el idioma de la interfaz
for (const a of ANIMALS) translateFields(a, ["name"]);

export const ANIMAL_COUNT = ANIMALS.length;
const pick = (i: number) => ANIMALS[((i % ANIMAL_COUNT) + ANIMAL_COUNT) % ANIMAL_COUNT];
export const animalName = (i: number) => pick(i).name;

interface Props {
  animal: number;
  size?: number;
  className?: string;
  /** texto accesible; sin él es decorativo */
  title?: string;
}

/** por debajo de este tamaño se muestra solo la cara */
const SMALL = 40;

function AvatarBase({ animal, size = 44, className = "", title }: Props) {
  const a = pick(animal);
  const small = size < SMALL;
  return (
    <span
      className={`avatar ${small ? "avatar--face" : ""} ${className}`}
      style={{ width: size, height: size, background: small ? a.tint : undefined }}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <img src={a.src} alt="" width={size} height={size} loading="lazy" decoding="async" draggable={false} />
    </span>
  );
}

export const Avatar = memo(AvatarBase);
