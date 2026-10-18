/* editorial-ui · Cristian Pérez · cristianperez.me
 * Los jugadores: doce animales chibi, una raza por persona en la sala. Dibujados a mano en SVG.
 */
import { memo, type ReactNode } from "react";

const INK = "#161412";
const SW = 3.2;
const BLUSH = "#FF8FA0";

export interface Animal {
  name: string;
  /** fondo del medallón */
  tint: string;
  draw: () => ReactNode;
}

function Eye({ x, y, r = 4.6, iris }: { x: number; y: number; r?: number; iris?: string }) {
  return (
    <g>
      {iris ? (
        <>
          <circle cx={x} cy={y} r={r} fill={iris} stroke={INK} strokeWidth={1.6} />
          <circle cx={x} cy={y + 0.4} r={r * 0.55} fill={INK} />
        </>
      ) : (
        <circle cx={x} cy={y} r={r} fill={INK} />
      )}
      <circle cx={x - r * 0.32} cy={y - r * 0.38} r={r * 0.36} fill="#fff" />
      <circle cx={x + r * 0.36} cy={y + r * 0.34} r={r * 0.15} fill="#fff" />
    </g>
  );
}

function Blush({ y = 60, dx = 21 }: { y?: number; dx?: number }) {
  return (
    <g fill={BLUSH} opacity={0.75}>
      <ellipse cx={50 - dx} cy={y} rx={5.2} ry={3} />
      <ellipse cx={50 + dx} cy={y} rx={5.2} ry={3} />
    </g>
  );
}

/** boca "ω" de gato y perro */
function Mouth({ y = 62, w = 5 }: { y?: number; w?: number }) {
  return <path d={`M${50 - w * 1.6} ${y} q${w * 0.8} ${w} ${w * 1.6} 0 q${w * 0.8} ${w} ${w * 1.6} 0`} fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />;
}

function Whiskers({ y = 60, color = INK }: { y?: number; color?: string }) {
  return (
    <g stroke={color} strokeWidth={1.6} strokeLinecap="round" opacity={0.8}>
      <path d={`M24 ${y - 3} L12 ${y - 6}`} />
      <path d={`M24 ${y + 1} L11 ${y + 2}`} />
      <path d={`M76 ${y - 3} L88 ${y - 6}`} />
      <path d={`M76 ${y + 1} L89 ${y + 2}`} />
    </g>
  );
}

const line = { stroke: INK, strokeWidth: SW, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

/** orejas de gato o perro puntiagudo, en espejo */
function PointyEars({ fill, inner, spread = 0, tall = 0 }: { fill: string; inner?: string; spread?: number; tall?: number }) {
  const L = `M${21 - spread} ${46} L${25 - spread} ${15 - tall} L${45} ${33} Z`;
  const R = `M${79 + spread} ${46} L${75 + spread} ${15 - tall} L${55} ${33} Z`;
  const Li = `M${26 - spread} ${40} L${28 - spread} ${22 - tall} L${39} ${33} Z`;
  const Ri = `M${74 + spread} ${40} L${72 + spread} ${22 - tall} L${61} ${33} Z`;
  return (
    <g>
      <path d={L} fill={fill} {...line} />
      <path d={R} fill={fill} {...line} />
      {inner && (
        <>
          <path d={Li} fill={inner} />
          <path d={Ri} fill={inner} />
        </>
      )}
    </g>
  );
}

export const ANIMALS: Animal[] = [
  {
    name: "Capibara",
    tint: "#FFE7BF",
    draw: () => (
      <g>
        <circle cx="29" cy="34" r="6.5" fill="#86552F" {...line} />
        <circle cx="71" cy="34" r="6.5" fill="#86552F" {...line} />
        <rect x="18" y="30" width="64" height="56" rx="27" fill="#AD7748" {...line} />
        <ellipse cx="50" cy="69" rx="19" ry="12" fill="#93613B" {...line} />
        <path d="M44 63 q2 3 0 5 M56 63 q-2 3 0 5" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M46 75 q4 2.6 8 0" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
        {/* ojos tranquilos, medio cerrados */}
        <path d="M30 50 q5 4 10 0" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <path d="M60 50 q5 4 10 0" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <Blush y={57} dx={24} />
        {/* la mandarina en la cabeza */}
        <circle cx="50" cy="24" r="10.5" fill="#FF9B21" {...line} />
        <path d="M50 14 q7 -7 13 -3 q-6 6 -13 3 Z" fill="#59A83B" {...line} strokeWidth={2.4} />
        <circle cx="46" cy="21" r="2" fill="#FFD08A" />
      </g>
    ),
  },
  {
    name: "Shiba",
    tint: "#FFDCC2",
    draw: () => (
      <g>
        <PointyEars fill="#E8913A" inner="#FFF3E2" />
        <ellipse cx="50" cy="58" rx="34" ry="28" fill="#E8913A" {...line} />
        <path d="M22 66 q6 -16 28 -12 q22 -4 28 12 q-6 18 -28 18 q-22 0 -28 -18 Z" fill="#FFF3E2" />
        <ellipse cx="37" cy="41" rx="4" ry="2.6" fill="#FFF3E2" />
        <ellipse cx="63" cy="41" rx="4" ry="2.6" fill="#FFF3E2" />
        <Eye x={38} y={52} />
        <Eye x={62} y={52} />
        <path d="M46 59 h8 l-4 4.5 Z" fill={INK} {...line} strokeWidth={1.8} />
        <Mouth y={64} w={3.6} />
        <Blush y={63} dx={23} />
        <ellipse cx="50" cy="58" rx="34" ry="28" fill="none" {...line} />
      </g>
    ),
  },
  {
    name: "Corgi",
    tint: "#FFF0C4",
    draw: () => (
      <g>
        <PointyEars fill="#E0923F" inner="#F9B9A5" spread={5} tall={9} />
        <ellipse cx="50" cy="59" rx="32" ry="27" fill="#E0923F" {...line} />
        <path d="M45 33 q5 -3 10 0 l3 25 h-16 Z" fill="#FFFDF6" />
        <ellipse cx="50" cy="69" rx="19" ry="13" fill="#FFFDF6" />
        <Eye x={37} y={53} />
        <Eye x={63} y={53} />
        <ellipse cx="50" cy="62" rx="4.4" ry="3.2" fill={INK} />
        <path d="M44 67 q3 3 6 0 q3 3 6 0" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M47 69 q3 9 6 0 Z" fill="#FF6B7D" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
        <Blush y={64} dx={23} />
        <ellipse cx="50" cy="59" rx="32" ry="27" fill="none" {...line} />
      </g>
    ),
  },
  {
    name: "Pug",
    tint: "#F2E3CF",
    draw: () => (
      <g>
        <path d="M17 42 q2 -14 16 -12 l-2 14 Z" fill="#3A302A" {...line} />
        <path d="M83 42 q-2 -14 -16 -12 l2 14 Z" fill="#3A302A" {...line} />
        <ellipse cx="50" cy="57" rx="34" ry="29" fill="#D9B487" {...line} />
        <path d="M41 36 q9 -4 18 0 M43 41 q7 -3 14 0" fill="none" stroke="#9C7A52" strokeWidth="2.2" strokeLinecap="round" />
        <ellipse cx="50" cy="66" rx="20" ry="15" fill="#3A302A" />
        <Eye x={35} y={51} r={6.4} />
        <Eye x={65} y={51} r={6.4} />
        <ellipse cx="50" cy="61" rx="5" ry="3.4" fill="#120F0D" />
        <path d="M44 67 q3 3 6 0 q3 3 6 0" fill="none" stroke="#C9A77C" strokeWidth="2" strokeLinecap="round" />
        <path d="M47 70 q3 7 6 0 Z" fill="#FF6B7D" />
        <Blush y={63} dx={25} />
        <ellipse cx="50" cy="57" rx="34" ry="29" fill="none" {...line} />
      </g>
    ),
  },
  {
    name: "Husky",
    tint: "#DCE8F4",
    draw: () => (
      <g>
        <PointyEars fill="#5E6B7C" inner="#F4F6F9" spread={2} tall={5} />
        <ellipse cx="50" cy="58" rx="33" ry="28" fill="#5E6B7C" {...line} />
        <path d="M50 40 q-8 10 -24 10 q-6 8 -2 16 q8 18 26 18 q18 0 26 -18 q4 -8 -2 -16 q-16 0 -24 -10 Z" fill="#F4F6F9" />
        <ellipse cx="37" cy="41" rx="4.5" ry="2.8" fill="#F4F6F9" />
        <ellipse cx="63" cy="41" rx="4.5" ry="2.8" fill="#F4F6F9" />
        <Eye x={38} y={53} r={5} iris="#7CC8F4" />
        <Eye x={62} y={53} r={5} iris="#7CC8F4" />
        <ellipse cx="50" cy="63" rx="4.6" ry="3.2" fill={INK} />
        <Mouth y={67} w={3.4} />
        <Blush y={64} dx={22} />
        <ellipse cx="50" cy="58" rx="33" ry="28" fill="none" {...line} />
      </g>
    ),
  },
  {
    name: "Salchicha",
    tint: "#FBDCC8",
    draw: () => (
      <g>
        <ellipse cx="50" cy="52" rx="28" ry="28" fill="#9E512B" {...line} />
        <ellipse cx="21" cy="62" rx="10" ry="21" transform="rotate(14 21 62)" fill="#723819" {...line} />
        <ellipse cx="79" cy="62" rx="10" ry="21" transform="rotate(-14 79 62)" fill="#723819" {...line} />
        <ellipse cx="50" cy="70" rx="15" ry="13" fill="#B9673A" {...line} />
        <ellipse cx="50" cy="64" rx="6" ry="4.2" fill={INK} />
        <circle cx="48" cy="62.6" r="1.4" fill="#fff" opacity=".7" />
        <path d="M44 74 q6 4 12 0" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
        <Eye x={39} y={48} r={4.4} />
        <Eye x={61} y={48} r={4.4} />
        <path d="M34 39 l8 2 M66 39 l-8 2" stroke="#5A2A12" strokeWidth="2.4" strokeLinecap="round" />
        <Blush y={58} dx={17} />
      </g>
    ),
  },
  {
    name: "Gato naranja",
    tint: "#FFE3BE",
    draw: () => (
      <g>
        <PointyEars fill="#F29B36" inner="#FFB6B0" />
        <ellipse cx="50" cy="59" rx="34" ry="27" fill="#F29B36" {...line} />
        <path d="M44 33 v8 M50 32 v10 M56 33 v8" stroke="#C26A17" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M17 58 h7 M16 64 h7 M83 58 h-7 M84 64 h-7" stroke="#C26A17" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="44" cy="66" rx="7" ry="5.6" fill="#FFF6EA" />
        <ellipse cx="56" cy="66" rx="7" ry="5.6" fill="#FFF6EA" />
        <Eye x={37} y={53} />
        <Eye x={63} y={53} />
        <path d="M47 61 h6 l-3 3.4 Z" fill="#FF7E8A" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
        <Mouth y={65} w={3} />
        <Whiskers y={64} />
        <Blush y={62} dx={23} />
        <ellipse cx="50" cy="59" rx="34" ry="27" fill="none" {...line} />
      </g>
    ),
  },
  {
    name: "Gato negro",
    tint: "#FFEFAE",
    draw: () => (
      <g>
        <PointyEars fill="#2A2930" inner="#FF9DB0" />
        <ellipse cx="50" cy="59" rx="34" ry="27" fill="#2A2930" {...line} />
        <g>
          <ellipse cx="37" cy="54" rx="7" ry="7.4" fill="#DDEB5A" stroke={INK} strokeWidth="1.6" />
          <ellipse cx="63" cy="54" rx="7" ry="7.4" fill="#DDEB5A" stroke={INK} strokeWidth="1.6" />
          <ellipse cx="37" cy="54.5" rx="2.2" ry="5.6" fill={INK} />
          <ellipse cx="63" cy="54.5" rx="2.2" ry="5.6" fill={INK} />
          <circle cx="34.6" cy="50.6" r="2.2" fill="#fff" />
          <circle cx="60.6" cy="50.6" r="2.2" fill="#fff" />
        </g>
        <path d="M47 63 h6 l-3 3.4 Z" fill="#FF8FA3" />
        <path d="M45.2 68 q2.4 2.6 4.8 0 q2.4 2.6 4.8 0" fill="none" stroke="#BDB7C9" strokeWidth="2" strokeLinecap="round" />
        <Whiskers y={65} color="#C9C3D6" />
        <Blush y={64} dx={23} />
      </g>
    ),
  },
  {
    name: "Siamés",
    tint: "#DDEBF6",
    draw: () => (
      <g>
        <PointyEars fill="#4E3A2D" inner="#7A5B48" />
        <ellipse cx="50" cy="59" rx="34" ry="27" fill="#F3E6CD" {...line} />
        <path d="M33 56 q17 -6 34 0 q4 12 -4 20 q-13 8 -26 0 q-8 -8 -4 -20 Z" fill="#5A4434" />
        <Eye x={37} y={52} r={5.2} iris="#5FAEF0" />
        <Eye x={63} y={52} r={5.2} iris="#5FAEF0" />
        <path d="M47 62 h6 l-3 3.4 Z" fill="#2A1E17" />
        <path d="M45.2 67 q2.4 2.6 4.8 0 q2.4 2.6 4.8 0" fill="none" stroke="#CDB9A6" strokeWidth="2" strokeLinecap="round" />
        <Whiskers y={64} />
        <Blush y={63} dx={25} />
        <ellipse cx="50" cy="59" rx="34" ry="27" fill="none" {...line} />
      </g>
    ),
  },
  {
    name: "Calicó",
    tint: "#FFE1E1",
    draw: () => (
      <g>
        <path d="M21 46 L25 15 L45 33 Z" fill="#F0943A" {...line} />
        <path d="M79 46 L75 15 L55 33 Z" fill="#26242A" {...line} />
        <path d="M26 40 L28 22 L39 33 Z" fill="#FFB6B0" />
        <ellipse cx="50" cy="59" rx="34" ry="27" fill="#FFFDF8" {...line} />
        <path d="M17 54 q2 -20 27 -22 q-4 8 -6 20 q-10 4 -21 2 Z" fill="#F0943A" />
        <path d="M83 52 q-4 -16 -22 -19 q4 7 4 14 q8 4 18 5 Z" fill="#26242A" />
        <Eye x={37} y={53} />
        <Eye x={63} y={53} />
        <path d="M47 61 h6 l-3 3.4 Z" fill="#FF7E8A" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
        <Mouth y={65} w={3} />
        <Whiskers y={64} />
        <Blush y={62} dx={23} />
        <ellipse cx="50" cy="59" rx="34" ry="27" fill="none" {...line} />
      </g>
    ),
  },
  {
    name: "Panda rojo",
    tint: "#FFD9C6",
    draw: () => (
      <g>
        <path d="M17 44 q-2 -22 16 -24 q6 8 4 16 Z" fill="#C4502A" {...line} />
        <path d="M83 44 q2 -22 -16 -24 q-6 8 -4 16 Z" fill="#C4502A" {...line} />
        <path d="M22 38 q0 -11 9 -13 q3 5 2 10 Z" fill="#FFF7EE" />
        <path d="M78 38 q0 -11 -9 -13 q-3 5 -2 10 Z" fill="#FFF7EE" />
        <ellipse cx="50" cy="58" rx="34" ry="28" fill="#C4502A" {...line} />
        <ellipse cx="36" cy="43" rx="6" ry="4" fill="#FFF7EE" />
        <ellipse cx="64" cy="43" rx="6" ry="4" fill="#FFF7EE" />
        <path d="M27 60 q10 -6 23 -2 q13 -4 23 2 q-2 16 -23 18 q-21 -2 -23 -18 Z" fill="#FFF7EE" />
        <path d="M36 56 q-2 8 -8 12 M64 56 q2 8 8 12" stroke="#6E2814" strokeWidth="4" strokeLinecap="round" fill="none" />
        <Eye x={37} y={52} />
        <Eye x={63} y={52} />
        <ellipse cx="50" cy="62" rx="4.6" ry="3.2" fill={INK} />
        <Mouth y={66} w={3.2} />
        <ellipse cx="50" cy="58" rx="34" ry="28" fill="none" {...line} />
      </g>
    ),
  },
  {
    name: "Ajolote",
    tint: "#FFE0EC",
    draw: () => (
      <g>
        {[-1, 1].map((side) => (
          <g key={side} transform={side === 1 ? "translate(100 0) scale(-1 1)" : undefined}>
            <ellipse cx="14" cy="38" rx="9" ry="4.6" transform="rotate(-35 14 38)" fill="#E9659B" {...line} strokeWidth={2.6} />
            <ellipse cx="10" cy="51" rx="9.5" ry="4.6" transform="rotate(-8 10 51)" fill="#E9659B" {...line} strokeWidth={2.6} />
            <ellipse cx="13" cy="64" rx="9" ry="4.6" transform="rotate(22 13 64)" fill="#E9659B" {...line} strokeWidth={2.6} />
          </g>
        ))}
        <ellipse cx="50" cy="55" rx="34" ry="27" fill="#F8B0CA" {...line} />
        <Eye x={33} y={52} r={4.2} />
        <Eye x={67} y={52} r={4.2} />
        <path d="M36 63 q14 10 28 0" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
        <Blush y={60} dx={24} />
        <circle cx="45" cy="38" r="1.6" fill="#E9659B" />
        <circle cx="55" cy="36" r="1.6" fill="#E9659B" />
      </g>
    ),
  },
];

export const ANIMAL_COUNT = ANIMALS.length;
export const animalName = (i: number) => ANIMALS[((i % ANIMAL_COUNT) + ANIMAL_COUNT) % ANIMAL_COUNT].name;

interface Props {
  animal: number;
  size?: number;
  className?: string;
  /** texto accesible; sin él es decorativo */
  title?: string;
  /** sin medallón: solo la cabeza */
  bare?: boolean;
}

function AvatarBase({ animal, size = 44, className, title, bare }: Props) {
  const a = ANIMALS[((animal % ANIMAL_COUNT) + ANIMAL_COUNT) % ANIMAL_COUNT];
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={{ flexShrink: 0, overflow: "visible" }}
    >
      {!bare && <circle cx="50" cy="52" r="47" fill={a.tint} stroke={INK} strokeWidth={3.4} />}
      <g transform={bare ? undefined : "translate(50 52) scale(.86) translate(-50 -50)"}>{a.draw()}</g>
    </svg>
  );
}

export const Avatar = memo(AvatarBase);
