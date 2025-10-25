// db-sync.ts
import Dexie from "dexie";
//import { supabase } from "./supaBase";

/* -------------------------
   Interfaces (esquema final)
   ------------------------- */
export interface Movimiento {
  id?: number;
  categoria: string;
  monto: number;
  metodo: string;
  fecha: string;
  moneda: string;
  tipo: "Ingreso" | "Gasto";
}

export interface BPropietario {
  id_negocio?: number;
  nombre_negocio: string;
  tipo_negocio: string;
  propietario: string;
  direccion: string;
  correo_electronico: string;
  fecha_creacion: number;
  descripcion: string;
  horario_apertura: number;
  horario_cierre: number;
  sitio_web: string;
  trabajadores: string;
  movil: number;
  productos: string;
  money: number;
  cuenta: number;
  metodo_pago: string;
  tbussines: "Perdidas" | "Ganancias";
  tipos: "Compra" | "Venta";
  campos?: any;
}

export interface Clientes {
  id_usuario?: number;
  cedula_ci_cliente: number;
  tipo_cliente: string;
  historial_compras_cliente: string;
  deuda_cliente: string;
  nombre: string;
  apellidos: string;
  cargo_usuario: string;
  salario_usuario: number;
  fecha_ingreso_usuario: number;
  rol_usuario: string;
}

export interface ProductosServicios {
  id_producto?: number;
  nombre_producto: string;
  categoria_producto: string;
  precio_venta_producto: number;
  unidad_producto: string;
  stock_actual_producto: number;
  stock_mínimo_producto: number;
  fecha_ingreso_producto: number;
  fecha_actualizacion_producto: number;
  productos_suministrados_proveedor: string;
}

export interface ReportesFinanzas {
  id_reportes_finanzas?: number;
  total_ingresos: number;
  total_gastos: number;
  balance_general: number;
  ventas_mensuales: number;
  margen_de_ganancia: number;
  historial_caja_diaria: string;
}

export interface Tasa {
  id_tasa?:number;
  codigo: string;
  nombre_tasa: string;
  compras_tasa: number;
  ventas_tasa: number;
  tasa: number;
}

/* -------------------------
   Clase Dexie con versiones
   ------------------------- */
class MiDB extends Dexie {
  movimientos!: Dexie.Table<Movimiento, number>;
  bpropietario!: Dexie.Table<BPropietario, number>;
  cliente!: Dexie.Table<Clientes, number>;
  productosservicios!: Dexie.Table<ProductosServicios, number>;
  reportesfinanzas!: Dexie.Table<ReportesFinanzas, number>;
  tasa!:Dexie.Table<Tasa, number>;

  constructor() {
    super("MiDB");

    this.version(1).stores({
      movimientos: "++id, categoria, monto, metodo, fecha, moneda, tipo",
      bpropietario:
        "++id_negocio,  nombre_negocio,  tipo_negocio,  propietario,  direccion,  correo_electronico,  fecha_creacion,  descripcion,  horario_apertura,  horario_cierre,  sitio_web,  trabajadores,  movil,  productos,  money,  cuenta,  metodo_pago,  tbussines,  tipos",
      cliente:
        "++id_usuario,  cedula_ci_cliente,  tipo_cliente,  historial_compras_cliente,  deuda_cliente,  nombre,  apellidos,  cargo_usuario,  salario_usuario,  fecha_ingreso_usuario,  rol_usuario",
      productosservicios:
        "++id_producto,  nombre_producto,  categoria_producto,  precio_venta_producto,  unidad_producto,  stock_actual_producto,  stock_mínimo_producto,  fecha_ingreso_producto,  fecha_actualizacion_producto,  productos_suministrados_proveedor",
      reportesfinanzas:
      "++id_reportes_finanzas,  total_ingresos,  total_gastos,  balance_general,  ventas_mensuales,  margen_de_ganancia,  historial_caja_diaria",
      tasa: "++id_tasa, codigo, nombre_tasa, compras_tasa, ventas_tasa, tasa",
    });

    // ===== Versiones históricas (migraciones)
    this.version(2).stores({
      movimientos: "++id, categoria, monto, metodo, fecha, moneda, tipo",
    }).upgrade(async (tx) => {
      await tx.table("movimientos").toCollection().modify((m: any) => {
        if (!m.moneda) m.moneda = "CUP";
      });
    });

    this.version(3).stores({
      bpropietario:
        "++id_negocio,  nombre_negocio,  tipo_negocio,  propietario,  direccion,  correo_electronico,  fecha_creacion,  descripcion,  horario_apertura,  horario_cierre,  sitio_web,  trabajadores,  movil,  productos,  money,  cuenta,  metodo_pago,  tbussines,  tipos",
    }).upgrade(async (tx) => {
      await tx.table("bpropietario").toCollection().modify((b: any) => {
        if (b.logo_imagen === undefined) b.logo_imagen = "";
        if (b.fecha_creacion === undefined) b.fecha_creacion = Date.now();
      });
    });

    this.version(4).stores({
      cliente:
        "++id_usuario,  cedula_ci_cliente,  tipo_cliente,  historial_compras_cliente,  deuda_cliente,  nombre,  apellidos,  cargo_usuario,  salario_usuario,  fecha_ingreso_usuario,  rol_usuario",
    }).upgrade(async (tx) => {
      await tx.table("cliente").toCollection().modify((c: any) => {
        if (c.cedula_ci_cliente === undefined) c.cedula_ci_cliente = 0;
      });
    });

    this.version(5).stores({
      productosservicios:
        "++id_producto,  nombre_producto,  categoria_producto,  precio_venta_producto,  unidad_producto,  stock_actual_producto,  stock_mínimo_producto,  fecha_ingreso_producto,  fecha_actualizacion_producto,  productos_suministrados_proveedor",
    }).upgrade(async (tx) => {
      await tx.table("productosservicios").toCollection().modify((p: any) => {
        if (p.stock_actual_producto === undefined) p.stock_actual_producto = 0;
        if (p.stock_mínimo_producto === undefined) p.stock_mínimo_producto = 0;
      });
    });

    this.version(6).stores({
      reportesfinanzas:
        "++id_reportes_finanzas,  total_ingresos,  total_gastos,  balance_general,  ventas_mensuales,  margen_de_ganancia,  historial_caja_diaria",
    }).upgrade(async (tx) => {
      await tx.table("reportesfinanzas").toCollection().modify((r: any) => {
        if (r.total_ingresos === undefined) r.total_ingresos = 0;
        if (r.total_gastos === undefined) r.total_gastos = 0;
        if (r.balance_general === undefined) r.balance_general = 0;
        if (r.ventas_mensuales === undefined) r.ventas_mensuales = 0;
        if (!r.historial_caja_diaria) r.historial_caja_diaria = "";
      });
    });
  }
}

export const db = new MiDB();




// /* -------------------------
//    Función genérica para limpiar payload
//    ------------------------- */
const cleanPayload = (payload: any, allowedFields: string[]) => {
  const clean: any = {};
  for (const key of allowedFields) {
    if (key in payload) clean[key] = payload[key];
  }
  return clean;
};

// /* -------------------------
//    Campos permitidos por tabla
//    ------------------------- */
const allowedFields = {
  movimientos: ["id","categoria","monto","metodo","fecha","moneda","tipo"],
  bpropietario: [
    "id_negocio","nombre_negocio","tipo_negocio","propietario",
    "direccion","correo_electronico","fecha_creacion","descripcion",
    "horario_apertura","horario_cierre","sitio_web","trabajadores",
    "movil","productos","money","cuenta","metodo_pago","tbussines","tipos"
  ],
  cliente: [
    "id_usuario","cedula_ci_cliente","tipo_cliente","historial_compras_cliente",
    "deuda_cliente","nombre","apellidos","cargo_usuario","salario_usuario",
    "fecha_ingreso_usuario","rol_usuario"
  ],
  productosservicios: [
    "id_producto","nombre_producto","categoria_producto","precio_venta_producto",
    "unidad_producto","stock_actual_producto","stock_mínimo_producto",
    "fecha_ingreso_producto","fecha_actualizacion_producto","productos_suministrados_proveedor"
  ],
  reportesfinanzas: [
    "id_reportes_finanzas","total_ingresos","total_gastos","balance_general",
    "ventas_mensuales","margen_de_ganancia","historial_caja_diaria"
  ],
};



/* -------------------------
   Funciones de sincronización al backend
   ------------------------- */

const API_URL = 
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://api-miscuentas.onrender.com";


/* -------------------------
   MOVIMIENTOS
   ------------------------- */
export const syncInsertMovimiento = async (mov: Movimiento, idDexie?: number) => {
  const payload = idDexie ? { ...mov, id: idDexie } : { ...mov };
  await fetch(`${API_URL}/sync/movimientos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([payload]),
  });
};

export const syncUpdateMovimiento = async (mov: Movimiento) => {
  await fetch(`${API_URL}/sync/movimientos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([mov]),
  });
};

export const syncDeleteMovimiento = async (mov: Movimiento) => {
  await fetch(`${API_URL}/sync/movimientos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([mov]),
  });
};

/* -------------------------
   BPROPIETARIO
   ------------------------- */
export const syncInsertNegocio = async (neg: BPropietario, idDexie?: number) => {
  const payload = idDexie ? { ...neg, id_negocio: idDexie } : { ...neg };
  await fetch(`${API_URL}/sync/bpropietario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([payload]),
  });
};

export const syncUpdateNegocio = async (neg: BPropietario) => {
  await fetch(`${API_URL}/sync/bpropietario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([neg]),
  });
};

export const syncDeleteNegocio = async (neg: BPropietario) => {
  await fetch(`${API_URL}/sync/bpropietario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([neg]),
  });
};

/* -------------------------
   CLIENTES
   ------------------------- */
export const syncInsertCliente = async (cli: Clientes, idDexie?: number) => {
  const payload = idDexie ? { ...cli, id_usuario: idDexie } : { ...cli };
  await fetch(`${API_URL}/sync/clientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([payload]),
  });
};

export const syncUpdateCliente = async (cli: Clientes) => {
  await fetch(`${API_URL}/sync/clientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([cli]),
  });
};

export const syncDeleteCliente = async (cli: Clientes) => {
  await fetch(`${API_URL}/sync/clientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([cli]),
  });
};

/* -------------------------
   PRODUCTOS/SERVICIOS
   ------------------------- */
export const syncInsertProducto = async (prod: ProductosServicios, idDexie?: number) => {
  const payload = idDexie ? { ...prod, id_producto: idDexie } : { ...prod };
  await fetch(`${API_URL}/sync/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([payload]),
  });
};

export const syncUpdateProducto = async (prod: ProductosServicios) => {
  await fetch(`${API_URL}/sync/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([prod]),
  });
};

export const syncDeleteProducto = async (prod: ProductosServicios) => {
  await fetch(`${API_URL}/sync/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([prod]),
  });
};

/* -------------------------
   REPORTES FINANZAS
   ------------------------- */
export const syncInsertReporte = async (rep: ReportesFinanzas, idDexie?: number) => {
  const payload = idDexie ? { ...rep, id_reportes_finanzas: idDexie } : { ...rep };
  await fetch(`${API_URL}/sync/reportes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([payload]),
  });
};

export const syncUpdateReporte = async (rep: ReportesFinanzas) => {
  await fetch(`${API_URL}/sync/reportes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([rep]),
  });
};

export const syncDeleteReporte = async (rep: ReportesFinanzas) => {
  await fetch(`${API_URL}/sync/reportes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([rep]),
  });
};



// /* -------------------------
//    Bulk sync: subir todo desde Dexie → Supabase
//    ------------------------- */
// export const bulkSyncAll = async () => {
//   try {
//     // MOVIMIENTOS
//     const movs = await db.movimientos.toArray();
//     if (movs.length) {
//       const cleanMovs = movs.map((m) => cleanPayload(m, allowedFields.movimientos));
//       const { error } = await supabase.from("movimientos").upsert(cleanMovs, { onConflict: "id" });
//       if (error) console.error("bulkSync movimientos error:", error);
//     }

//     // BPROPIETARIO
//     const negocios = await db.bpropietario.toArray();
//     if (negocios.length) {
//       const cleanNegocios = negocios.map((n) => cleanPayload(n, allowedFields.bpropietario));
//       const { error } = await supabase.from("bpropietario").upsert(cleanNegocios, { onConflict: "id_negocio" });
//       if (error) console.error("bulkSync negocios error:", error);
//     }

//     // CLIENTES
//     const clientes = await db.cliente.toArray();
//     if (clientes.length) {
//       const cleanClientes = clientes.map((c) => cleanPayload(c, allowedFields.cliente));
//       const { error } = await supabase.from("cliente").upsert(cleanClientes, { onConflict: "id_usuario" });
//       if (error) console.error("bulkSync clientes error:", error);
//     }

//     // PRODUCTOS
//     const productos = await db.productosservicios.toArray();
//     if (productos.length) {
//       const cleanProductos = productos.map((p) => cleanPayload(p, allowedFields.productosservicios));
//       const { error } = await supabase.from("productosservicios").upsert(cleanProductos, { onConflict: "id_producto" });
//       if (error) console.error("bulkSync productos error:", error);
//     }

//     // REPORTES
//     const reportes = await db.reportesfinanzas.toArray();
//     if (reportes.length) {
//       const cleanReportes = reportes.map((r) => cleanPayload(r, allowedFields.reportesfinanzas));
//       const { error } = await supabase.from("reportesfinanzas").upsert(cleanReportes, { onConflict: "id_reportes_finanzas" });
//       if (error) console.error("bulkSync reportes error:", error);
//     }

//     console.log("bulkSyncAll: sincronización completa");
//   } catch (err) {
//     console.error("bulkSyncAll error:", err);
//   }
// };
