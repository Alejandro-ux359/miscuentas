import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Esto permite que otros dispositivos en la misma red vean la app
    port: 5173, // Puedes dejar el puerto que quieras
  },
})