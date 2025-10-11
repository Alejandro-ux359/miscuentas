import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";



if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(reg => console.log('Service Worker registrado con éxito:', reg))
      .catch(err => console.error('Error registrando Service Worker:', err));
  });
} else {
  console.warn('Service Worker no soportado en este navegador');
}


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
