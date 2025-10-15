// db-sync.ts
import Dexie from "dexie";
import { supabase } from "./supaBase";

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

/* -------------------------
   Clase Dexie con versiones
   ------------------------- */
class MiDB extends Dexie {
  movimientos!: Dexie.Table<Movimiento, number>;
  bpropietario!: Dexie.Table<BPropietario, number>;
  cliente!: Dexie.Table<Clientes, number>;
  productosservicios!: Dexie.Table<ProductosServicios, number>;
  reportesfinanzas!: Dexie.Table<ReportesFinanzas, number>;

  constructor() {
    super("MiDB");

    // ===== Versión 1: esquema base (las 5 tablas)
    this.version(1).stores({
      movimientos: "++id, categoria, monto, metodo, fecha, moneda, tipo",
      bpropietario:
        "++id_negocio, nombre_negocio, tipo_negocio, propietario, direccion, correo_electronico, fecha_creacion, descripcion, horario_apertura, horario_cierre, sitio_web, trabajadores, movil, productos, money, cuenta, metodo_pago, tbussines, tipos",
      cliente:
        "++id_usuario, nombre, apellidos, cedula_ci_cliente, tipo_cliente, historial_compras_cliente, deuda_cliente, cargo_usuario, salario_usuario, fecha_ingreso_usuario, rol_usuario",
      productosservicios:
        "++id_producto, nombre_producto, categoria_producto, precio_venta_producto, unidad_producto, stock_actual_producto, stock_mínimo_producto, fecha_ingreso_producto, fecha_actualizacion_producto, productos_suministrados_proveedor",
      reportesfinanzas:
        "++id_reportes_finanzas, total_ingresos, total_gastos, balance_general, ventas_mensuales, margen_de_ganancia, historial_caja_diaria",
    });

    // ===== Versión 2: migración antigua donde se añadió 'moneda' a movimientos
    this.version(2)
      .stores({
        movimientos: "++id, categoria, monto, metodo, fecha, moneda, tipo",
      })
      .upgrade(async (tx) => {
        await tx
          .table("movimientos")
          .toCollection()
          .modify((m: any) => {
            if (!m.moneda) m.moneda = "CUP";
          });
      });

    // ===== Versión 3: migración histórica que añadió campos opcionales a bpropietario
    // (se preserva compatibilidad: añadimos defaults si faltan)
    this.version(3)
      .stores({
        bpropietario:
          "++id_negocio, nombre_negocio, tipo_negocio, propietario, direccion, correo_electronico, fecha_creacion, descripcion, horario_apertura, horario_cierre, sitio_web, trabajadores, movil, productos, money, cuenta, metodo_pago, tbussines, tipos",
      })
      .upgrade(async (tx) => {
        await tx.table("bpropietario").toCollection().modify((b: any) => {
          if (b.logo_imagen === undefined) b.logo_imagen = "";
          if (b.fecha_creacion === undefined) b.fecha_creacion = Date.now();
        });
      });

    // ===== Versión 4: migración histórica para cliente (normalizar nombres)
    this.version(4)
      .stores({
        cliente:
          "++id_usuario, nombre, apellidos, cedula_ci_cliente, tipo_cliente, historial_compras_cliente, deuda_cliente, cargo_usuario, salario_usuario, fecha_ingreso_usuario, rol_usuario",
      })
      .upgrade(async (tx) => {
        await tx.table("cliente").toCollection().modify((c: any) => {
          if (c.cedula_ci_cliente === undefined) c.cedula_ci_cliente = 0;
        });
      });

    // ===== Versión 5: migración histórica productos (añadir stock por defecto)
    this.version(5)
      .stores({
        productosservicios:
          "++id_producto, nombre_producto, categoria_producto, precio_venta_producto, unidad_producto, stock_actual_producto, stock_mínimo_producto, fecha_ingreso_producto, fecha_actualizacion_producto, productos_suministrados_proveedor",
      })
      .upgrade(async (tx) => {
        await tx.table("productosservicios").toCollection().modify((p: any) => {
          if (p.stock_actual_producto === undefined) p.stock_actual_producto = 0;
          if (p.stock_mínimo_producto === undefined) p.stock_mínimo_producto = 0;
        });
      });

    // ===== Versión 6: migración histórica reportes (garantizar defaults)
    this.version(6)
      .stores({
        reportesfinanzas:
          "++id_reportes_finanzas, total_ingresos, total_gastos, balance_general, ventas_mensuales, margen_de_ganancia, historial_caja_diaria",
      })
      .upgrade(async (tx) => {
        await tx
          .table("reportesfinanzas")
          .toCollection()
          .modify((r: any) => {
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

/* -------------------------
   Funciones de sincronización
   (para cada tabla: insert / update / delete)
   ------------------------- */

/* MOVIMIENTOS */
export const syncInsertMovimiento = async (mov: Movimiento, idDexie?: number) => {
  const payload = idDexie ? { ...mov, id: idDexie } : { ...mov };
  const { error } = await supabase.from("movimientos").upsert(payload, { onConflict: "id" });
  if (error) console.error("Error insert/upsert movimiento:", error);
};

export const syncUpdateMovimiento = async (id: number, mov: Partial<Movimiento>) => {
  const { error } = await supabase.from("movimientos").update(mov).eq("id", id);
  if (error) console.error("Error actualizando movimiento:", error);
};

export const syncDeleteMovimiento = async (id: number) => {
  const { error } = await supabase.from("movimientos").delete().eq("id", id);
  if (error) console.error("Error eliminando movimiento:", error);
};

/* BPROPIETARIO */
export const syncInsertNegocio = async (neg: BPropietario, idDexie?: number) => {
  const payload = idDexie ? { ...neg, id_negocio: idDexie } : { ...neg };
  const { error } = await supabase.from("bpropietario").upsert(payload, { onConflict: "id_negocio" });
  if (error) console.error("Error insert/upsert negocio:", error);
};

export const syncUpdateNegocio = async (id_negocio: number, neg: Partial<BPropietario>) => {
  const { error } = await supabase.from("bpropietario").update(neg).eq("id_negocio", id_negocio);
  if (error) console.error("Error actualizando negocio:", error);
};

export const syncDeleteNegocio = async (id_negocio: number) => {
  const { error } = await supabase.from("bpropietario").delete().eq("id_negocio", id_negocio);
  if (error) console.error("Error eliminando negocio:", error);
};

/* CLIENTE */
export const syncInsertCliente = async (cli: Clientes, idDexie?: number) => {
  const payload = idDexie ? { ...cli, id_usuario: idDexie } : { ...cli };
  const { error } = await supabase.from("cliente").upsert(payload, { onConflict: "id_usuario" });
  if (error) console.error("Error insert/upsert cliente:", error);
};

export const syncUpdateCliente = async (id_usuario: number, cli: Partial<Clientes>) => {
  const { error } = await supabase.from("cliente").update(cli).eq("id_usuario", id_usuario);
  if (error) console.error("Error actualizando cliente:", error);
};

export const syncDeleteCliente = async (id_usuario: number) => {
  const { error } = await supabase.from("cliente").delete().eq("id_usuario", id_usuario);
  if (error) console.error("Error eliminando cliente:", error);
};

/* PRODUCTOSSERVICIOS */
export const syncInsertProducto = async (prod: ProductosServicios, idDexie?: number) => {
  const payload = idDexie ? { ...prod, id_producto: idDexie } : { ...prod };
  const { error } = await supabase.from("productosservicios").upsert(payload, { onConflict: "id_producto" });
  if (error) console.error("Error insert/upsert producto:", error);
};

export const syncUpdateProducto = async (id_producto: number, prod: Partial<ProductosServicios>) => {
  const { error } = await supabase.from("productosservicios").update(prod).eq("id_producto", id_producto);
  if (error) console.error("Error actualizando producto:", error);
};

export const syncDeleteProducto = async (id_producto: number) => {
  const { error } = await supabase.from("productosservicios").delete().eq("id_producto", id_producto);
  if (error) console.error("Error eliminando producto:", error);
};

/* REPORTESFINANZAS */
export const syncInsertReporte = async (rep: ReportesFinanzas, idDexie?: number) => {
  const payload = idDexie ? { ...rep, id_reportes_finanzas: idDexie } : { ...rep };
  const { error } = await supabase.from("reportesfinanzas").upsert(payload, { onConflict: "id_reportes_finanzas" });
  if (error) console.error("Error insert/upsert reporte:", error);
};

export const syncUpdateReporte = async (id_reportes_finanzas: number, rep: Partial<ReportesFinanzas>) => {
  const { error } = await supabase.from("reportesfinanzas").update(rep).eq("id_reportes_finanzas", id_reportes_finanzas);
  if (error) console.error("Error actualizando reporte:", error);
};

export const syncDeleteReporte = async (id_reportes_finanzas: number) => {
  const { error } = await supabase.from("reportesfinanzas").delete().eq("id_reportes_finanzas", id_reportes_finanzas);
  if (error) console.error("Error eliminando reporte:", error);
};

/* -------------------------
   Bulk sync: subir todo desde Dexie → Supabase (upsert)
   ------------------------- */
export const bulkSyncAll = async () => {
  try {
    // MOVIMIENTOS
    const movs = await db.movimientos.toArray();
    if (movs.length) {
      const { error } = await supabase.from("movimientos").upsert(movs, { onConflict: "id" });
      if (error) console.error("bulkSync movimientos error:", error);
    }

    // NEGOCIOS
    const negocios = await db.bpropietario.toArray();
    if (negocios.length) {
      const { error } = await supabase.from("bpropietario").upsert(negocios, { onConflict: "id_negocio" });
      if (error) console.error("bulkSync negocios error:", error);
    }

    // CLIENTES
    const clientes = await db.cliente.toArray();
    if (clientes.length) {
      const { error } = await supabase.from("cliente").upsert(clientes, { onConflict: "id_usuario" });
      if (error) console.error("bulkSync clientes error:", error);
    }

    // PRODUCTOS
    const productos = await db.productosservicios.toArray();
    if (productos.length) {
      const { error } = await supabase.from("productosservicios").upsert(productos, { onConflict: "id_producto" });
      if (error) console.error("bulkSync productos error:", error);
    }

    // REPORTES
    const reportes = await db.reportesfinanzas.toArray();
    if (reportes.length) {
      const { error } = await supabase.from("reportesfinanzas").upsert(reportes, { onConflict: "id_reportes_finanzas" });
      if (error) console.error("bulkSync reportes error:", error);
    }

    console.log("bulkSyncAll: sincronización completa");
  } catch (err) {
    console.error("bulkSyncAll error:", err);
  }
};
