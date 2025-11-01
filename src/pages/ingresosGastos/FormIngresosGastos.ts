import { IGenericControls } from "../../components/controls.types";
import { endpoints } from "../../nomencladores/endpoints";


export const ingresosGastos: IGenericControls[] = [
  {
    type: "select",
    label: "Categoría",
    name: "categoria",
    key: "categoria",
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
    key: "metodoPago",
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
    key: "moneda",
    url: endpoints.moneda,
  },
];
