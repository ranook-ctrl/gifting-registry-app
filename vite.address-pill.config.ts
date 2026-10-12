import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// Serves the Gifting Registry "Address Pill" atom demo from ./address-pill on
// port 3688, sharing node_modules and importing components from ../src.
export default defineConfig({
  root: resolve(__dirname, "address-pill"),
  // Serve the shared repo-root public/ (Noontree fonts live in public/fonts).
  publicDir: resolve(__dirname, "public"),
  plugins: [react()],
  // retune bundles its own React internally; dedupe so hooks share the app's
  // single React instance (avoids "Invalid hook call").
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 3688,
    strictPort: true,
    fs: {
      allow: [resolve(__dirname)],
    },
  },
});
