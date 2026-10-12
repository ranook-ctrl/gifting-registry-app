import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// Serves the Gifting Registry "Birthday Background" demo on port 3670,
// sharing node_modules and importing components from ../src.
export default defineConfig({
  root: resolve(__dirname, "birthday-bg"),
  publicDir: resolve(__dirname, "public"),
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 3670,
    strictPort: true,
    fs: {
      allow: [resolve(__dirname)],
    },
  },
});
