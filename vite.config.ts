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
        manualChunks: { motion: ["framer-motion"], peer: ["peerjs"] },
      },
    },
  },
});
