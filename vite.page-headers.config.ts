import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// Serves the Page Header hero (receiver + gifter variants) from ./page-headers
// on port 3685, sharing node_modules and importing components from ../src.
export default defineConfig({
  root: resolve(__dirname, "page-headers"),
  // Serve the shared repo-root public/ (Noontree fonts + /gift-registry assets).
  publicDir: resolve(__dirname, "public"),
  plugins: [react()],
  // retune bundles its own React internally; dedupe so hooks share the app's
  // single React instance (avoids "Invalid hook call").
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 3685,
    strictPort: true,
    fs: {
      allow: [resolve(__dirname)],
    },
  },
});
