import { IGenericControls } from "../../components/controls.types";

export const ingresosGastos: IGenericControls[] = [
     {
      type: "select",
      label: "Categoría",
      name: "categoria",
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