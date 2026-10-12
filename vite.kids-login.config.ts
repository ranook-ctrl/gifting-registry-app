import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// Serves the noon Kids login screen from ./kids-login on port 3850,
// while sharing node_modules and importing tokens from ../src.
export default defineConfig({
  root: resolve(__dirname, "kids-login"),
  // Serve the shared repo-root public/ (Noontree fonts live in public/fonts).
  publicDir: resolve(__dirname, "public"),
  plugins: [react()],
  // retune bundles its own React internally; dedupe so hooks share the app's
  // single React instance (avoids "Invalid hook call").
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 3850,
    strictPort: true,
    fs: {
      allow: [resolve(__dirname)],
    },
  },
});
