import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import { resolve } from "node:path";

// Serves / builds the Gifting Registry landing (tabbed shell hosting the Gifter,
// Creator and Create-list flows) from ./landing. Dev runs on port 3750; the
// production build emits to ./dist for Vercel.
export default defineConfig({
  root: resolve(__dirname, "landing"),
  // Shared repo-root public/ (Noontree fonts + /gift-registry assets).
  publicDir: resolve(__dirname, "public"),
  plugins: [react()],
  // The Create-list tab hosts the ported Wishlist page, which is Tailwind-based.
  // Scope Tailwind to the wishlist content globs (other tabs stay Field DS).
  css: {
    postcss: {
      plugins: [
        tailwindcss({ config: resolve(__dirname, "tailwind.wishlist.config.js") }),
        autoprefixer(),
      ],
    },
  },
  // retune bundles its own React; dedupe so hooks share the single instance.
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    port: 3750,
    strictPort: true,
    fs: {
      allow: [resolve(__dirname)],
    },
  },
});
