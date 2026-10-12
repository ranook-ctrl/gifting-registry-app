import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// Serves the Creator Cards gallery from ./cards on port 3640,
// while sharing node_modules and importing components from ../src.
export default defineConfig({
  root: resolve(__dirname, "cards"),
  // Serve the shared repo-root public/ (Noontree fonts live in public/fonts).
  publicDir: resolve(__dirname, "public"),
  plugins: [react()],
  // retune ships its own React in peerDeps; dedupe so the overlay shares the
  // app's single React instance (otherwise: "Invalid hook call").
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-runtime"],
  },
  server: {
    port: 3640,
    strictPort: true,
    fs: {
      allow: [resolve(__dirname)],
    },
  },
});
