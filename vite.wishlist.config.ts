import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import { resolve } from "node:path";

// Serves the Wishlist page (ported from the noon-wishlist repo — the gifting
// entry point) from ./wishlist on port 3750, sharing node_modules and the
// repo-root public/ (Noontree fonts).
export default defineConfig({
  root: resolve(__dirname, "wishlist"),
  publicDir: resolve(__dirname, "public"),
  plugins: [react()],
  // Tailwind is scoped to this page via an inline PostCSS config; content
  // globs live in tailwind.wishlist.config.js. Other pages stay untouched.
  css: {
    postcss: {
      plugins: [
        tailwindcss({ config: resolve(__dirname, "tailwind.wishlist.config.js") }),
        autoprefixer(),
      ],
    },
  },
  // retune bundles its own React internally; dedupe so hooks share the app's
  // single React instance (avoids "Invalid hook call").
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 3750,
    strictPort: true,
    fs: {
      allow: [resolve(__dirname)],
    },
  },
});
