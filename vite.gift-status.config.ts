import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Serves the Gifting Registry order-status screens on port 3620.
// Rewrites "/" to gift-registry.html so the demo is the root page.
export default defineConfig({
  plugins: [
    react(),
    {
      name: "gift-registry-index",
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url === "/" || req.url === "/index.html") {
            req.url = "/gift-registry.html";
          }
          next();
        });
      },
    },
  ],
  resolve: {
    // retune declares react/react-dom as peer deps; ensure a single React
    // instance so its hooks run against the app's copy (avoids "Invalid hook call").
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 3620,
    strictPort: true,
  },
});
