import { db, Nomencladores } from "../bdDexie";
import { endpoints } from "./endpoints";

interface RawNomenclador {
  [key: string]: any;
}

/**
 * Devuelve los campos `value` y `label` según el objeto recibido.
 * Se busca de forma flexible para no depender de nombres exactos.
 */
function mapNomenclador(item: RawNomenclador) {
  // Buscamos posibles campos para value
  const value = item.id ?? item.id_concepto ?? item.value ?? 0;

  // Buscamos posibles campos para label
  const label =
    item.nombre ?? item.denominacion ?? item.label ?? "N/A";

  return { value, label };
}

/**
 * 🔁 Sincroniza todos los nomencladores con IndexedDB.
 */
export async function syncNomencladores() {
  try {
    console.log("🌀 Sincronizando nomencladores...");

    const localData = await db.nomencladores.get("default");

    // Descargamos todos los nomencladores
    const responses = await Promise.all([
      fetch(endpoints.moneda).then((r) => r.json()),
      fetch(endpoints.categoria).then((r) => r.json()),
      fetch(endpoints.metodoPago).then((r) => r.json()),
      fetch(endpoints.compraventa).then((r) => r.json()),
      fetch(endpoints.tcliente).then((r) => r.json()),
    ]);

    const [moneda, categoria, metodoPago, compraventa, tcliente] = responses;

    const newData: Nomencladores = {
      id: "default",
      moneda: Array.isArray(moneda) ? moneda.map(mapNomenclador) : [],
      categoria: Array.isArray(categoria) ? categoria.map(mapNomenclador) : [],
      metodoPago: Array.isArray(metodoPago) ? metodoPago.map(mapNomenclador) : [],
      compraventa: Array.isArray(compraventa) ? compraventa.map(mapNomenclador) : [],
      tcliente: Array.isArray(tcliente) ? tcliente.map(mapNomenclador) : [],
    };

    // Comparamos para evitar reescrituras innecesarias
    const hasChanges =
      !localData ||
      JSON.stringify(localData.moneda) !== JSON.stringify(newData.moneda) ||
      JSON.stringify(localData.categoria) !== JSON.stringify(newData.categoria) ||
      JSON.stringify(localData.metodoPago) !== JSON.stringify(newData.metodoPago) ||
      JSON.stringify(localData.compraventa) !== JSON.stringify(newData.compraventa) ||
      JSON.stringify(localData.tcliente) !== JSON.stringify(newData.tcliente);

    if (hasChanges) {
      await db.nomencladores.put(newData);
      console.log("✅ Nomencladores actualizados correctamente.");
    } else {
      console.log("⚙️ Nomencladores ya estaban actualizados.");
    }

    localStorage.setItem("lastSyncNomencladores", new Date().toISOString());
  } catch (error) {
    console.error("❌ Error sincronizando nomencladores:", error);
  }
}
