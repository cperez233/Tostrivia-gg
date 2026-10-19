/* editorial-ui · Cristian Pérez · cristianperez.me */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2020",
    // nada de data: URIs: la CSP de vercel.json solo permite fuentes de self
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/framer-motion")) return "motion";
          if (id.includes("node_modules/peerjs")) return "peer";
          // el banco cambia seguido: en su propio archivo, el resto del código sigue en caché
          if (id.includes("/src/data/bank/") || id.endsWith("/src/data/videos.json")) return "bank";
        },
      },
    },
  },
});
