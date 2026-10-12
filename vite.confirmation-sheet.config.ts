import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// Serves the Gifting Registry "Confirmation bottomsheet" demo from ./confirmation-sheet
// on port 3695, sharing node_modules and importing components from ../src.
export default defineConfig({
  root: resolve(__dirname, "confirmation-sheet"),
  // Serve the shared repo-root public/ (Noontree fonts live in public/fonts).
  publicDir: resolve(__dirname, "public"),
  plugins: [react()],
  // retune bundles its own React internally; dedupe so hooks share the app's
  // single React instance (avoids "Invalid hook call").
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 3695,
    strictPort: true,
    fs: {
      allow: [resolve(__dirname)],
    },
  },
});
