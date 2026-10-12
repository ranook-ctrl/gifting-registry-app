import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// Serves the Gifting Registry "Delivery Details" demo on port 3650,
// sharing node_modules and importing components from ../src.
export default defineConfig({
  root: resolve(__dirname, "delivery-details"),
  publicDir: resolve(__dirname, "public"),
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 3650,
    strictPort: true,
    fs: {
      allow: [resolve(__dirname)],
    },
  },
});
