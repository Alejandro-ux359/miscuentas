// src/_pwa-framework/config/endpoints.ts
export const NOMENCLADORES_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/nomencladores"
    : "https://mi-backend.com/nomencladores";

export const endpoints = {
  moneda: `${NOMENCLADORES_URL}/nomenclador_moneda`,
  categoria: `${NOMENCLADORES_URL}/nomenclador_categoria`,
  metodoPago: `${NOMENCLADORES_URL}/nomenclador_metodo_de_pago`,
};
