import { useState, useEffect } from "react";
import { db, Nomencladores } from "../bdDexie";

export function useNomencladoresLocal() {
  const [data, setData] = useState<Nomencladores>({
    moneda: [],
    categoria: [],
    metodoPago: [],
    compraventa: [],
    tcliente: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLocal = async () => {
      setLoading(true);
      try {
        const localData = await db.nomencladores.get("default");
        if (localData) {
          const { id, ...rest } = localData;
          setData(rest);
        }
      } catch (err) {
        console.error("❌ Error cargando nomencladores locales:", err);
      } finally {
        setLoading(false);
      }
    };

    loadLocal();
  }, []);

  return { data, loading };
}
