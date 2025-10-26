import { useEffect, useState } from "react";
import axios from "axios";
import { endpoints } from "../components/endpoints";

export interface INomencladores {
  moneda: { value: number; label: string }[];
  categoria: { value: number; label: string }[];
  metodoPago: { value: number; label: string }[];
  compraventa: { value: number; label: string }[];
  tcliente: { value: number; label: string }[];
}

export function useNomencladores() {
  const [data, setData] = useState<INomencladores>({
    moneda: [],
    categoria: [],
    metodoPago: [],
    tcliente: [],
    compraventa: [],
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [resMoneda, resCategoria, resMetodo, resTcliente, resCompraventa] = await Promise.all([
          axios.get(endpoints.moneda),
          axios.get(endpoints.categoria),
          axios.get(endpoints.metodoPago),
          axios.get(endpoints.tcliente),
          axios.get(endpoints.compraventa),
        ]);

        setData({
          moneda: resMoneda.data.map((m: any) => ({
            value: m.id_concepto,
            label: m.denominacion,
          })),
          categoria: resCategoria.data.map((c: any) => ({
            value: c.id,
            label: c.nombre,
          })),
          metodoPago: resMetodo.data.map((p: any) => ({
            value: p.id,
            label: p.nombre,
          })),
           tcliente: resTcliente.data.map((p: any) => ({
            value: p.id,
            label: p.nombre,
          })),
           compraventa: resCompraventa.data.map((p: any) => ({
            value: p.id,
            label: p.nombre,
          })),
        });
      } catch (error) {
        console.error("Error cargando nomencladores:", error);
      }
    };

    fetchAll();
  }, []);

  return data;
}
export { endpoints };
