import {IGenericControls} from "../../components/controls.types";
import { endpoints } from "../../components/endpoints";


export const formulariosDisponibles: IGenericControls[] = [
  {
    type: "text",
    name: "nombre_negocio",
    id: "Nombre del negocio",
    label: "Nombre del negocio",
  },

  {
    type: "text",
    name: "tipo_negocio",
    label: "Tipo de negocio",
    id: "Tipo de negocio",
  },

  {
    type: "text",
    name: "propietario",
    id: "Propietario",
    label: "Propietario",
  },

  {
    type: "text",
    label: "Dirección",
    name: "direccion",
    id: "Dirección",
  },
  {
    type: "text",
    name: "correo_electronico",
    label: "Email",
    id: "Email",
  },

  {
    type: "date",
    name: "fecha_creacion",
    label: "Fecha de creación",
    id: "Fecha de creación",
  },

  {
    type: "text",
    name: "descripcion",
    label: "Descripción",
    id: "Descripción",
  },

  {
    type: "time",
    label: "Hora de apertura",
    name: "horario_apertura",
    id: "Hora de apertura",
  },

  {
    type: "time",
    label: "Horario de cierre",
    name: "horario_cierre",
    id: "Horario de cierre",
  },

  {
    type: "text",
    label: "Sitio Web",
    name: "sitio_web",
    id: "Sitio Web",
  },

  {
    type: "text",
    label: "Trabajadores",
    name: "trabajadores",
    id: "Trabajadores",
  },

  {
    type: "number",
    label: "Móvil ",
    name: "movil",
    format: "other",
    id: "Móvil",
  },
  {
    type: "text",
    label: "Productos",
    name: "productos",
    id: "Productos",
  },

  {
    type: "number",
    label: "Dinero",
    name: "money",
    id: "Dinero",
    format: "finance",
  },

  {
    type: "number",
    label: "Cuenta",
    name: "cuenta",
    format: "other",
    id: "Cuenta",
  },

  {
    type: "select",
    label: "Metodo de pago",
    name: "metodo_pago",
    id: "Metodo de pago",
    url: endpoints.metodoPago,
  },

  {
    type: "text",
    label: "Registro de Ganancias",
    name: "tbussines",
    id: "Registro de Ganancias",
  },

  {
    type: "select",
    label: "Compra y Venta",
    name: "tipos",
    url: endpoints.compraventa,
    id: "Compra y Venta",
  },

  //#region Clientes

  {
    type: "text",
    label: "Apellidos",
    name: "apellidos",
    id: "Apellidos",
  },

  {
    type: "number",
    label: "Carnet de identidad",
    name: "cedula_ci_cliente",
    format: "other",
    id: "Carnet de identidad",
  },

  {
    type: "select",
    name: "tipo_cliente",
    label: "Frecuencia con la que visita el cliente",
    id: "Frecuencia con la que visita el cliente",
    url: endpoints.tcliente,
  },

  {
    type: "text",
    label: "Historial de compra del cliente",
    name: "historial_compras_cliente",
    id: "Historial de compra del cliente",
  },

  {
    type: "text",
    label: "Deuda del cliente",
    name: "deuda_cliente",
    id: "Deuda del cliente",
  },

  //#region Productos y Servicios
  {
    type: "text",
    label: "Nombre del producto o servicio",
    name: "nombre_producto",
    id: "Nombre del producto o servicio",
  },
  {
    type: "text",
    label: "Descripción del producto",
    name: "descripcion_producto",
    id: "Descripción del producto",
  },
  {
    type: "text",
    label: "Categoria del producto",
    name: "categoria_producto",
    id: "Categoria del producto",
  },
  {
    type: "number",
    label: "Precios",
    name: "precio_venta_producto",
    format: "finance",
    id: "Precios",
  },
  {
    type: "text",
    label: "Unidad",
    name: "unidad_producto",
    id: "Unidad",
  },
  {
    type: "number",
    label: "Stock actual",
    name: "stock_actual_producto",
    format: "other",
    id: "Stock actual",
  },
  {
    type: "number",
    label: "Stock minimo",
    name: "stock_mínimo_producto",
    format: "other",
    id: "Stock minimo",
  },
  {
    type: "date",
    label: "Fecha de ingreso del producto",
    name: "fecha_ingreso_producto",
    id: "Fecha de ingreso del producto",
  },

  {
    type: "date",
    label: "Fecha de actualización del producto",
    name: "fecha_actualizacion_producto",
    id: "Fecha de actualización del producto",
  },

  //#region Empleados y Usuarios

  {
    type: "text",
    label: "Nombre",
    name: "nombre_usuario",
    id: "Nombre",
  },

  {
    type: "text",
    label: "Cargo del empleado",
    name: "cargo_usuario",
    id: "Cargo del empleado",
  },

  {
    type: "number",
    label: "Salario",
    name: "salario_usuario",
    format: "finance",
    id: "Salario",
  },

  {
    type: "date",
    label: "Fecha de ingreso",
    name: "fecha_ingreso_usuario",
    id: "Fecha de ingreso",
  },

  {
    type: "text",
    label: "Rol del empleado",
    name: "rol_usuario",
    id: "Rol del empleado",
  },

  //#region Proveedores

  {
    type: "text",
    label: "Productos suministrados",
    name: "productos_suministrados_proveedor",
    id: "Productos suministrados",
  },

  //#region ReportesFinanzas

  {
    type: "number",
    label: "Total de ingresos",
    name: "total_ingresos",
    format: "finance",
    id: "Total de ingresos",
  },

  {
    type: "number",
    label: "Total de gastos",
    name: "total_gastos",
    id: "Total de gastos",
    format: "finance",
  },

  {
    type: "number",
    label: "Balance general",
    name: "balance_general",
    format: "finance",
    id: "Balance general",
  },

  {
    type: "number",
    label: "Ventas mensuales",
    name: "ventas_mensuales",
    format: "finance",
    id: "Ventas mensuales",
  },

  {
    type: "number",
    label: "Margen de ganancias",
    name: "margen_de_ganancia",
    format: "finance",
    id: "Margen de ganancias",
  },

  {
    type: "number",
    label: "Historial de caja diaria",
    name: "historial_caja_diaria",
    format: "finance",
    id: "Historial de caja diaria",
  },
];
