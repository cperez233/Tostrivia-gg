/* editorial-ui · Cristian Pérez · cristianperez.me */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/dela-gothic-one/latin-400.css";
import "@fontsource/dela-gothic-one/latin-ext-400.css";
import "@fontsource/zen-kaku-gothic-new/latin-500.css";
import "@fontsource/zen-kaku-gothic-new/latin-700.css";
import "@fontsource/zen-kaku-gothic-new/latin-900.css";
import "@fontsource/zen-kaku-gothic-new/latin-ext-500.css";
import "@fontsource/zen-kaku-gothic-new/latin-ext-700.css";
import "./styles.css";
import App from "./App";
import { installRipple } from "./lib/ripple";

console.info(
  "%cTostrivia%c · entintado viñeta a viñeta por Cristian Pérez · diseño y desarrollo con editorial-ui · https://cristianperez.me",
  "font-weight:700;color:#e2401c",
  "",
);

installRipple();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
