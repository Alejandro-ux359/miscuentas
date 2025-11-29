import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // auto actualiza SW
      includeAssets: ["favicon.png", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "Mis Cuentas",
        short_name: "MisCuentas",
        description: "App para gestionar ingresos y gastos",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#00bcd4",
        icons: [
          { src: "favicon.png", sizes: "192x192", type: "image/png" },
          { src: "favicon.png", sizes: "512x512", type: "image/png" },
        ],
      },
      devOptions: {
        enabled: true,   // habilita PWA en dev
        type: "module",
      },
      workbox: {
        navigateFallback: null, // ⚠️ importante: no capturar rutas API
      },
    }),
  ],
 server: {
  host: true,
  port: 5173,
  proxy: {
    "/sync": {
      target: "http://localhost:3000",
      changeOrigin: true,
      rewrite: (path) => path, // deja la ruta igual
    },
  },
},
});
