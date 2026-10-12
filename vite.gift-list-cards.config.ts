import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// Serves the Gifting Registry "Gift List cards" demo from ./gift-list-cards on
// port 3840, sharing node_modules and importing components from ../src.
export default defineConfig({
  root: resolve(__dirname, "gift-list-cards"),
  // Serve the shared repo-root public/ (Noontree fonts live in public/fonts).
  publicDir: resolve(__dirname, "public"),
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-runtime", "retune"],
  },
  server: {
    port: 3840,
    strictPort: true,
    fs: {
      allow: [resolve(__dirname)],
    },
  },
});
