// db-sync.ts
import Dexie, {Table} from "dexie";
//import { supabase } from "./supaBase";

/* -------------------------
   Interfaces (esquema final)
   ------------------------- */
export interface Movimiento {
  id_usuario: number;
  id?:number;
  categoria: string;
  monto: number;
  metodo: string;
  fecha: string;
  moneda: string;
  tipo: "Ingreso" | "Gasto";
}

export interface BNegocios {
  id_usuario: number;
  id_negocio: number;
  nombre_negocio: string;
  tipo_negocio: string;
  propietario?: string;
  direccion?: string;
  correo_electronico?: string;
  fecha_creacion?: number;
  descripcion?: string;
  horario_apertura?: number;
  horario_cierre?: number;
  sitio_web?: string;
  trabajadores?: string;
  movil?: number;
  productos?: string;
  money?: number;
  cuenta?: number;
  metodo_pago?: string;
  tbussines?: "Perdidas" | "Ganancias";
  tipos?: "Compra" | "Venta";
  campos?: any;
  cedula_ci_cliente?: number;
  tipo_cliente?: string;
  historial_compras_cliente?: string;
  deuda_cliente?: string;
  nombre?: string;
  apellidos?: string;
  cargo_usuario?: string;
  salario_usuario?: number;
  fecha_ingreso_usuario?: number;
  rol_usuario?: string;
  id_producto?: number;
  nombre_producto?: string;
  categoria_producto?: string;
  precio_venta_producto?: number;
  unidad_producto?: string;
  stock_actual_producto?: number;
  stock_mínimo_producto?: number;
  fecha_ingreso_producto?: number;
  fecha_actualizacion_producto?: number;
  productos_suministrados_proveedor?: string;
  id_reportes_finanzas?: number;
  total_ingresos?: number;
  total_gastos?: number;
  balance_general?: number;
  ventas_mensuales?: number;
  margen_de_ganancia?: number;
  historial_caja_diaria?: string;
  logo_imagen?:string;
}

export interface Tasa {
  id_tasa?: number;
  codigo: string;
  nombre_tasa: string;
  compras_tasa: number;
  ventas_tasa: number;
  tasa: number;
}

export interface LoginRegistre {
  id_usuario?: number; 
  id_codigounico: number;
  avatar: string;
  nombre: string;
  cel_usuario: number;
  correo_usuario: string;
  password: string;
}

export interface Nomencladores {
  id?: string;
  moneda: { value: number; label: string }[];
  categoria: { value: number; label: string }[];
  metodoPago: { value: number; label: string }[];
  compraventa: { value: number; label: string }[];
  tcliente: { value: number; label: string }[];
}

/* -------------------------
   Clase Dexie con versiones
   ------------------------- */
class MiDB extends Dexie {
  movimientos!: Dexie.Table<Movimiento, number>;
  bnegocios!: Dexie.Table<BNegocios, number>;
  tasa!: Dexie.Table<Tasa, number>;
  nomencladores!: Table<Nomencladores, string>;
  loginregistre!: Table<LoginRegistre, number>;

  constructor() {
    super("MiDB");

    this.version(1).stores({
      movimientos: "++id, id_usuario, categoria, monto, metodo, fecha, moneda, tipo",
      bnegocios:
        "++id_negocio,  nombre_negocio, logo_imagen,  tipo_negocio,  propietario,  direccion,  correo_electronico,  fecha_creacion,  descripcion,  horario_apertura,  horario_cierre,  sitio_web,  trabajadores,  movil,  productos,  money,  cuenta,  metodo_pago,  tbussines,  tipos, id_reportes_finanzas,  total_ingresos,  total_gastos,  balance_general,  ventas_mensuales,  margen_de_ganancia,  historial_caja_diaria, id_usuario,  cedula_ci_cliente,  tipo_cliente,  historial_compras_cliente,  deuda_cliente,  nombre,  apellidos,  cargo_usuario,  salario_usuario,  fecha_ingreso_usuario,  rol_usuario, id_producto,  nombre_producto,  categoria_producto,  precio_venta_producto,  unidad_producto,  stock_actual_producto,  stock_mínimo_producto,  fecha_ingreso_producto,  fecha_actualizacion_producto,  productos_suministrados_proveedor",
      tasa: "++id_tasa, codigo, nombre_tasa, compras_tasa, ventas_tasa, tasa",
      nomencladores: "++id",
       loginregistre: "++id_usuario, &correo_usuario, id_codigounico, avatar, password, cel_usuario, nombre",
    });

    // ===== Versiones históricas (migraciones)
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

    this.version(3)
      .stores({
        bnegocios:
          "++id_negocio,  nombre_negocio,  tipo_negocio,  propietario,  direccion,  correo_electronico,  fecha_creacion,  descripcion,  horario_apertura,  horario_cierre,  sitio_web,  trabajadores,  movil,  productos,  money,  cuenta,  metodo_pago,  tbussines,  tipos, id_reportes_finanzas,  total_ingresos,  total_gastos,  balance_general,  ventas_mensuales,  margen_de_ganancia,  historial_caja_diaria, id_usuario,  cedula_ci_cliente,  tipo_cliente,  historial_compras_cliente,  deuda_cliente,  nombre,  apellidos,  cargo_usuario,  salario_usuario,  fecha_ingreso_usuario,  rol_usuario, id_producto,  nombre_producto,  categoria_producto,  precio_venta_producto,  unidad_producto,  stock_actual_producto,  stock_mínimo_producto,  fecha_ingreso_producto,  fecha_actualizacion_producto,  productos_suministrados_proveedor",
      })
      .upgrade(async (tx) => {
        await tx
          .table("bnegocios")
          .toCollection()
          .modify((b: any) => {
            if (b.logo_imagen === undefined) b.logo_imagen = "";
            if (b.fecha_creacion === undefined) b.fecha_creacion = Date.now();
          });
      });
    this.version(4).stores({
      nomencladores: "&id",
    });
  }
}

export const db = new MiDB();

/* -------------------------
   Función para borrar la DB (para depuración)
------------------------- */
export const resetDB = async () => {
  await db.delete();
  console.log("🗑️ Base de datos borrada");
  window.location.reload();
};

// /* -------------------------
//    Función genérica para limpiar payload
//    ------------------------- */
export const cleanPayload = (payload: any, allowedFields: string[]) => {
  const clean: any = {};
  for (const key of allowedFields) {
    if (key in payload) clean[key] = payload[key];
  }
  return clean;
};

// /* -------------------------
//    Campos permitidos por tabla
//    ------------------------- */
export const allowedFields = {
  movimientos: [
    "id",
    "categoria",
    "monto",
    "metodo",
    "fecha",
    "moneda",
    "tipo",
  ],
  bnegocios: [
    "id_negocio",
    "nombre_negocio",
    "tipo_negocio",
    "propietario",
    "direccion",
    "correo_electronico",
    "fecha_creacion",
    "descripcion",
    "horario_apertura",
    "horario_cierre",
    "sitio_web",
    "trabajadores",
    "movil",
    "productos",
    "money",
    "cuenta",
    "metodo_pago",
    "tbussines",
    "tipos",
    "id_usuario",
    "cedula_ci_cliente",
    "tipo_cliente",
    "historial_compras_cliente",
    "deuda_cliente",
    "nombre",
    "apellidos",
    "cargo_usuario",
    "salario_usuario",
    "fecha_ingreso_usuario",
    "rol_usuario",
    "id_producto",
    "nombre_producto",
    "categoria_producto",
    "precio_venta_producto",
    "unidad_producto",
    "stock_actual_producto",
    "stock_mínimo_producto",
    "fecha_ingreso_producto",
    "fecha_actualizacion_producto",
    "productos_suministrados_proveedor",
    "id_reportes_finanzas",
    "total_ingresos",
    "total_gastos",
    "balance_general",
    "ventas_mensuales",
    "margen_de_ganancia",
    "historial_caja_diaria",
  ],
    loginregistre: [
    "id_usuario",
    "id_codigounico",
    "avatar",
    "nombre",
    "cel_usuario",
    "correo_usuario",
    "password",
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
export const syncInsertMovimiento = async (
  mov: Movimiento,
  idDexie?: number
) => {
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
   bnegocios
   ------------------------- */
export const syncInsertNegocio = async (neg: BNegocios, idDexie?: number) => {
  const payload = idDexie ? { ...neg, id_negocio: idDexie } : { ...neg };
  try {
    const res = await fetch(`${API_URL}/sync/bnegocios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([payload]),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Error syncInsertNegocio:", res.status, text);
      throw new Error(`Sync failed: ${res.status}`);
    } else {
      console.log("Negocio sincronizado:", payload);
    }
  } catch (err) {
    console.error("Fallo al sincronizar negocio:", err);
  }
};


export const syncUpdateNegocio = async (neg: BNegocios) => {
  await fetch(`${API_URL}/sync/bnegocios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([neg]),
  });
};

export const syncDeleteNegocio = async (neg: BNegocios) => {
  if (!neg.id_negocio) throw new Error("El negocio no tiene id_negocio");

  try {
    const res = await fetch(`${API_URL}/sync/bnegocios/${neg.id_negocio}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Delete failed: ${res.status} ${text}`);
    }

    const data = await res.json();
    console.log("Negocio eliminado en Supabase:", data);
    return data;
  } catch (err) {
    console.error("Error eliminando negocio en backend:", err);
    throw err;
  }
};


/* -------------------------
   LOGIN Y REGISTRO LOCAL
------------------------- */
export const registrarUsuario = async (usuario: Omit<LoginRegistre, "id_usuario">) => {
  const existente = await db.loginregistre
    .where("correo_usuario")
    .equals(usuario.correo_usuario)
    .first();

  if (existente) throw new Error("Ya existe una cuenta con este correo.");

  const id = await db.loginregistre.add(usuario);
  return { ...usuario, id_usuario: id };
};


export const iniciarSesion = async (correo: string, password: string) => {
  const usuario = await db.loginregistre.where("correo_usuario").equals(correo).first();
  if (!usuario) throw new Error("Usuario no encontrado.");
  if (usuario.password !== password) throw new Error("Contraseña incorrecta.");
  return usuario;
};

