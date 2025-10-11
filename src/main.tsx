import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { registerSW } from "virtual:pwa-register";


registerSW({
  onNeedRefresh() {
    console.log("Nuevo contenido disponible. Recarga la app para actualizar.");
  },
  onOfflineReady() {
    console.log("La app está lista para usarse sin conexión 🚀");
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
