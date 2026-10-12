import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// Serves the dark-mode prototype from ./dark on port 7775,
// while sharing node_modules with the parent project.
export default defineConfig({
  root: resolve(__dirname, "dark"),
  // Serve the shared repo-root public/ (Noontree fonts live in public/fonts).
  publicDir: resolve(__dirname, "public"),
  plugins: [react()],
  server: {
    port: 7775,
    strictPort: true,
    fs: {
      // Allow imports from ../src/data/countries.ts
      allow: [resolve(__dirname)],
    },
  },
});
