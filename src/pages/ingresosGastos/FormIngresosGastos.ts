import { IGenericControls } from "../../components/controls.types";

export const ingresosGastos: IGenericControls[] = [
     {
      type: "select",
      label: "Categoría",
      name: "categoria",
      checkValues: [
        { label: "Salario", value: "salario" },
        { label: "Ventas", value: "ventas" },
        { label: "Regalía", value: "regalia" },
        { label: "Inversión", value: "inversion" },
        { label: "Reembolso", value: "reembolso" },
        { label: "Otro", value: "otro" },
      ],
      
    },
    {
      type: "number",
      label: "Monto",
      name: "monto",
      format:"finance"
     
    },
    {
      type: "select",
      label: "Método de pago",
      name: "metodo",
      checkValues: [
        { label: "Efectivo", value: "efectivo" },
        { label: "Transfermóvil", value: "transfermovil" },
        { label: "EnZona", value: "enzona" },
        { label: "QvaPay", value: "qvapay" },
        { label: "TropiPay", value: "tropipay" },
      ],
     
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
      checkValues: [
        { label: "CUP", value: "CUP" },
        { label: "USD", value: "USD" },
        { label: "EUR", value: "EUR" },
        { label: "CAD", value: "CAD" },
        { label: "MXN", value: "MXN" },
      ],
      
    },
]


/*
import {
  ITextField,
  INumberField,
  IDatePicker,
  ITimePicker,
  ISelect,
} from "../../components/controls.types";


export const Categoria: ISelect =  {
      type: "select",
      label: "Categoría",
      name: "categoria",      
    }


   export const Montos: INumberField = {
      type: "number",
      label: "Monto",
      name: "monto",
      format:"finance"
     
    }
    export const MetododePagos: ISelect = {
      type: "select",
      label: "Método de pago",
      name: "metodo",
    }

   export const Fecha: IDatePicker =  {
      type: "date",
      label: "Fecha",
      name: "fecha",
      
    }

    export const Monedass: ISelect ={
      type: "select",
      label: "Moneda",
      name: "moneda",
      
    }
*/