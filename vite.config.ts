import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // Actualiza el SW automáticamente
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
          {
            src: "favicon.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "favicon.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      
    }),
  ],
  server: {
    host: true,
    port: 5173,
  },
});
