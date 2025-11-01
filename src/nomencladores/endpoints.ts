export const NOMENCLADORES_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/nomencladores"
    : "https://api-miscuentas.onrender.com/nomencladores";

export const endpoints = {
  moneda: `${NOMENCLADORES_URL}/nomenclador_moneda`,
  categoria: `${NOMENCLADORES_URL}/nomenclador_categoria`,
  metodoPago: `${NOMENCLADORES_URL}/nomenclador_metodo_de_pago`,
  compraventa: `${NOMENCLADORES_URL}/nomenclador_compraventa`,
  tcliente: `${NOMENCLADORES_URL}/nomenclador_tcliente`,
};