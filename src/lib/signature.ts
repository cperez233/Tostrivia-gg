/* editorial-ui · Cristian Pérez · cristianperez.me */
const zw = (t: string) =>
  "⁠" +
  [...new TextEncoder().encode(t)]
    .map((b) => b.toString(2).padStart(8, "0"))
    .join("")
    .replace(/0/g, "​")
    .replace(/1/g, "‌") +
  "⁠";
export const firmaInvisible = zw("Cristian Pérez · https://cristianperez.me");
