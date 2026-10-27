import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
  },
  // Prerender build (scripts/prerender.mjs): bundle the libraries whose
  // package entry points Node can't import directly.
  ssr: {
    noExternal: ["gsap", "framer-motion"],
  },
  build: {
    // three.js is lazy-loaded in its own chunk; it's large but off the critical path.
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: (id) => (id.includes("node_modules/three") ? "three" : undefined),
      },
    },
  },
});
