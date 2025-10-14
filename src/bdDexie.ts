import Dexie from "dexie";
import { supabase } from "./supaBase";

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
  logo_imagen: string;
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
  tbussines: "Perdidas" | "Ganancias";
  tipos: "Compra" | "Venta";
}

export interface Clientes {
  id_cliente?: number;
  nombre_cliente: string;
  apellidos_cliente: string;
  cedula_ci_cliente: number;
  movil_cliente: number;
  email_cliente: string;
  direccion_cliente: string;
  tipo_cliente: string;
  metodo_pago_cliente: string;
  historial_compras_cliente: string;
  deuda_cliente: string;
}

export interface ProductosServicios {
  id_producto?: number;
  nombre_producto: string;
  descripcion_producto: string;
  categoria_producto: string;
  precio_compra_producto: number; //quitar
  precio_venta_producto: number;
  unidad_producto: string;
  stock_actual_producto: number;
  stock_mínimo_producto: number;
  proveedor_id_producto: string; //quitar
  codigo_barras_producto: string; //quitar
  fecha_ingreso_producto: number;
  fecha_actualizacion_producto: number;
  imagen_producto_producto: string; //quitar
  impuesto_producto: number; //quitar
}

export interface EmpleadosUsuarios {
  id_usuario?: number;
  nombre_usuario: string;
  apellidos_usuario: string; //quitar
  cargo_usuario: string;
  salario_usuario: number;
  fecha_ingreso_usuario: number;
  movil_usuario: number;
  correo_usuario: string;
  direccion_usuario: string;
  rol_usuario: string;
}

export interface Proveedores {
  id_proveedor?: number;
  nombre_proveedor: string;
  contacto_proveedor: string;
  movil_proveedor: number;
  email_proveedor: string;
  direccion_proveedor: string;
  productos_suministrados_proveedor: string;
  condiciones_pago_proveedor: string;
}

export interface ReportesFinanzas {
  id_reportes_finanzas?: number;
  total_ingresos: number;
  total_gastos: number;
  balance_general: number;
  ventas_mensuales: number;
  producto_más_vendido: string; //quitar
  clientes_frecuentes: string; //quitar
  margen_de_ganancia: number; 
  historial_caja_diaria: string;
}

class MiDB extends Dexie {
  movimientos!: Dexie.Table<Movimiento, number>;
  bpropietario!: Dexie.Table<BPropietario, number>;
  cliente!: Dexie.Table<Clientes, number>;
  productosservicios!: Dexie.Table<ProductosServicios, number>;
  empleadosusuarios!: Dexie.Table<EmpleadosUsuarios, number>;
  proveedores!: Dexie.Table<Proveedores, number>;
  reportesfinanzas!: Dexie.Table<ReportesFinanzas, number>;

  constructor() {
    super("MiDB");

    // Versión 1: definición inicial
    this.version(1).stores({
      movimientos: "++id, categoria, monto, metodo, fecha, moneda, tipo",
      bpropietario:
        "++id_negocio, nombre_negocio, tipo_negocio, propietario, direccion, correo_electronico, logo_imagen, fecha_creacion, descripcion, horario_apertura, horario_cierre, sitio_web, trabajadores, movil, productos, money, cuenta, tbussines, tipos",
      cliente:
        "++id_cliente, nombre_cliente, apellidos_cliente, cedula_ci_cliente, movil_cliente, email_cliente, direccion_cliente, tipo_cliente, metodo_pago_cliente, historial_compras_cliente, deuda_cliente",
      productosservicios:
        "++id_producto, nombre_producto, descripcion_producto, categoria_producto, precio_compra_producto, precio_venta_producto, unidad_producto, stock_actual_producto, stock_mínimo_producto, proveedor_id_producto, codigo_barras_producto, fecha_ingreso_producto, fecha_actualizacion_producto, imagen_producto_producto, impuesto_producto",
      empleadosusuarios:
        "++id_usuario, nombre_usuario, apellidos_usuario, cargo_usuario, salario_usuario, fecha_ingreso_usuario, movil_usuario, correo_usuario, direccion_usuario, rol_usuario",
      proveedores:
        "++id_proveedor, nombre_proveedor, contacto_proveedor, movil_proveedor, email_proveedor, direccion_proveedor, productos_suministrados_proveedor, condiciones_pago_proveedor",
      reportesfinanzas:
        "++id_reportes_finanzas, total_ingresos, total_gastos, balance_general, ventas_mensuales, producto_más_vendido, clientes_frecuentes, margen_de_ganancia, historial_caja_diaria",
    });

    // Versión 2: añadimos 'moneda' a movimientos
    this.version(2)
      .stores({
        movimientos: "++id, categoria, monto, metodo, fecha, moneda, tipo",
      })
      .upgrade(async (tx) => {
        await tx
          .table("movimientos")
          .toCollection()
          .modify((m) => {
            if (!m.moneda) m.moneda = "CUP";
          });
      });

    // Versión 3: añadimos campos nuevos a bpropietario
    this.version(3)
      .stores({
        bpropietario:
          "++id_negocio, nombre_negocio, tipo_negocio, propietario, direccion, correo_electronico, logo_imagen, fecha_creacion, descripcion, horario_apertura, horario_cierre, sitio_web, trabajadores, movil, productos, money, cuenta, tbussines, tipos, nuevoCampo1, nuevoCampo2",
      })
      .upgrade(async (tx) => {
        await tx
          .table("bpropietario")
          .toCollection()
          .modify((b) => {
            if (!b.nuevoCampo1) b.nuevoCampo1 = "";
            if (!b.nuevoCampo2) b.nuevoCampo2 = 0;
          });
      });

    // Versión 4: añadimos campos nuevos a cliente
    this.version(4)
      .stores({
        cliente:
          "++id_cliente, nombre_cliente, apellidos_cliente, cedula_ci_cliente, movil_cliente, email_cliente, direccion_cliente, tipo_cliente, metodo_pago_cliente, historial_compras_cliente, deuda_cliente, nuevoCampoCliente1, nuevoCampoCliente2",
      })
      .upgrade(async (tx) => {
        await tx
          .table("cliente")
          .toCollection()
          .modify((c) => {
            if (!c.nuevoCampoCliente1) c.nuevoCampoCliente1 = "";
            if (!c.nuevoCampoCliente2) c.nuevoCampoCliente2 = 0;
          });
      });

    // Versión 5: añadimos campos nuevos a productosservicios
    this.version(5)
      .stores({
        productosservicios:
          "++id_producto, nombre_producto, descripcion_producto, categoria_producto, precio_compra_producto, precio_venta_producto, unidad_producto, stock_actual_producto, stock_mínimo_producto, proveedor_id_producto, codigo_barras_producto, fecha_ingreso_producto, fecha_actualizacion_producto, imagen_producto_producto, impuesto_producto, nuevoCampoProducto1, nuevoCampoProducto2",
      })
      .upgrade(async (tx) => {
        await tx
          .table("productosservicios")
          .toCollection()
          .modify((p) => {
            if (!p.nuevoCampoProducto1) p.nuevoCampoProducto1 = "";
            if (!p.nuevoCampoProducto2) p.nuevoCampoProducto2 = 0;
          });
      });
    this.version(6)
      .stores({
        empleadosusuarios:
          "++id_usuario, nombre_usuario, apellidos_usuario, cargo_usuario, salario_usuario, fecha_ingreso_usuario, movil_usuario, correo_usuario, direccion_usuario, rol_usuario",
      })
      .upgrade(async (tx) => {
        await tx
          .table("empleadosusuarios")
          .toCollection()
          .modify((p) => {
            if (!p.nuevoCampoEmpleado1) p.nuevoCampoEmpleado1 = "";
            if (!p.nuevoCampoEmpleado2) p.nuevoCampoEmpleado2 = 0;
          });
      });
    this.version(7)
      .stores({
        proveedores:
          "++id_proveedor, nombre_proveedor, contacto_proveedor, movil_proveedor, email_proveedor, direccion_proveedor, productos_suministrados_proveedor, condiciones_pago_proveedor",
      })
      .upgrade(async (tx) => {
        await tx
          .table("proveedores")
          .toCollection()
          .modify((p) => {
            if (!p.nuevoCampoProveedores1) p.nuevoCampoProveedores1 = "";
            if (!p.nuevoCampoProveedores2) p.nuevoCampoProveedores2 = 0;
          });
      });
    this.version(8)
      .stores({
        reportesfinanzas:
          "++id_reportes_finanzas, total_ingresos, total_gastos, balance_general, ventas_mensuales, producto_más_vendido, clientes_frecuentes, margen_de_ganancia, historial_caja_diaria",
      })
      .upgrade(async (tx) => {
        await tx
          .table("reportesfinanzas")
          .toCollection()
          .modify((p) => {
            if (!p.nuevoCampoReportesFinanzas1) p.nuevoCampoReportesFinanzas1 = "";
            if (!p.nuevoCampoReportesFinanzas2) p.nuevoCampoReportesFinanzas2 = 0;
          });
      });
  }
}

export const db = new MiDB();

export const syncInsert = async (mov: Movimiento, idDexie: number) => {
  const { error } = await supabase
    .from("movimientos")
    .insert([{ ...mov, id: idDexie }]);
  if (error) console.error("Error insertando en Supabase:", error);
};

export const syncUpdate = async (id: number, mov: Movimiento) => {
  const { error } = await supabase.from("movimientos").update(mov).eq("id", id);
  if (error) console.error("Error actualizando en Supabase:", error);
};

export const syncDelete = async (id: number) => {
  const { error } = await supabase.from("movimientos").delete().eq("id", id);
  if (error) console.error("Error eliminando en Supabase:", error);
};
