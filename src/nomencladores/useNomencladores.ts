import { useEffect, useState } from "react";
import { db, Nomencladores } from "../bdDexie";

/**
 * 🔹 Hook para leer nomencladores desde IndexedDB
 */
export function useNomencladores() {
  const [data, setData] = useState<Nomencladores>({
    id: "default",
    moneda: [],
    categoria: [],
    metodoPago: [],
    compraventa: [],
    tcliente: [],
  });

  useEffect(() => {
    async function load() {
      const cached = await db.nomencladores.get("default");
      if (cached) {
        setData(cached);
        console.log("🗂️ Nomencladores cargados desde IndexedDB");
      }
    }
    load();
  }, []);

  return data;
}
