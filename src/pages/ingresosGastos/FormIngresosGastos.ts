import { IGenericControls } from "../../components/controls.types";
import { endpoints } from "../../components/endpoints";

export const ingresosGastos: IGenericControls[] = [
  {
    type: "select",
    label: "Categoría",
    name: "categoria",
    url: endpoints.categoria,

  },
  {
    type: "number",
    label: "Monto",
    name: "monto",
    format: "finance",
    finanza: true,
  },
  {
    type: "select",
    label: "Método de pago",
    name: "metodo",
    url: endpoints.metodoPago,

  },
  {
    type: "date",
    label: "Fecha",
    name: "fecha",
  },
  {
    type: "select",
    label: "Moneda",
    name: "moneda",
    url: endpoints.moneda,
  },
];
