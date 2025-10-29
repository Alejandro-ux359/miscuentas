import { IGenericControls } from "../../components/controls.types";
import { endpoints } from "../../components/endpoints";

export const formulariosDisponibles: IGenericControls[] = [
  {
    type: "text",
    name: "propietario",
    label: "Propietario",
  },

  {
    type: "text",
    label: "Dirección",
    name: "direccion",
  },
  {
    type: "text",
    name: "correo_electronico",
    label: "Email",
  },

  {
    type: "date",
    name: "fecha_creacion",
    label: "Fecha de creación",
  },

  {
    type: "text",
    name: "descripcion",
    label: "Descripción",
  },

  {
    type: "time",
    label: "Hora de apertura",
    name: "horario_apertura",
  },

  {
    type: "time",
    label: "Horario de cierre",
    name: "horario_cierre",
  },

  {
    type: "text",
    label: "Sitio Web",
    name: "sitio_web",
  },

  {
    type: "text",
    label: "Trabajadores",
    name: "trabajadores",
  },

  {
    type: "number",
    label: "Móvil ",
    name: "movil",
    format: "other",
  },
  {
    type: "text",
    label: "Productos",
    name: "productos",
  },

  {
    type: "number",
    label: "Dinero",
    name: "money",
    format: "finance",
  },

  {
    type: "number",
    label: "Cuenta",
    name: "cuenta",
    format: "other",
  },

  {
    type: "select",
    label: "Metodo de pago",
    name: "metodo_pago",
    url: endpoints.metodoPago,
  },

  {
    type: "text",
    label: "Registro de Ganancias",
    name: "tbussines",
  },

  {
    type: "select",
    label: "Compra y Venta",
    name: "tipos",
    url: endpoints.compraventa,
  },

  //#region Clientes

  {
    type: "text",
    label: "Apellidos",
    name: "apellidos",
  },

  {
    type: "number",
    label: "Carnet de identidad",
    name: "cedula_ci_cliente",
    format: "other",
  },

  {
    type: "select",
    name: "tipo_cliente",
    label: "Frecuencia con la que visita el cliente",
    url: endpoints.tcliente,
  },

  {
    type: "text",
    label: "Historial de compra del cliente",
    name: "historial_compras_cliente",
  },

  {
    type: "text",
    label: "Deuda del cliente",
    name: "deuda_cliente",
  },

  //#region Productos y Servicios
  {
    type: "text",
    label: "Nombre del producto o servicio",
    name: "nombre_producto",
  },
  {
    type: "text",
    label: "Descripción del producto",
    name: "descripcion_producto",
  },
  {
    type: "text",
    label: "Categoria del producto",
    name: "categoria_producto",
  },
  {
    type: "number",
    label: "Precios",
    name: "precio_venta_producto",
    format: "finance",
  },
  {
    type: "text",
    label: "Unidad",
    name: "unidad_producto",
  },
  {
    type: "number",
    label: "Stock actual",
    name: "stock_actual_producto",
    format: "other",
  },
  {
    type: "number",
    label: "Stock minimo",
    name: "stock_mínimo_producto",
    format: "other",
  },
  {
    type: "date",
    label: "Fecha de ingreso del producto",
    name: "fecha_ingreso_producto",
  },

  {
    type: "date",
    label: "Fecha de actualización del producto",
    name: "fecha_actualizacion_producto",
  },

  //#region Empleados y Usuarios

  {
    type: "text",
    label: "Nombre",
    name: "nombre_usuario",
  },

  {
    type: "text",
    label: "Cargo del empleado",
    name: "cargo_usuario",
  },

  {
    type: "number",
    label: "Salario",
    name: "salario_usuario",
    format: "finance",
  },

  {
    type: "date",
    label: "Fecha de ingreso",
    name: "fecha_ingreso_usuario",
  },

  {
    type: "text",
    label: "Rol del empleado",
    name: "rol_usuario",
  },

  //#region Proveedores

  {
    type: "text",
    label: "Productos suministrados",
    name: "productos_suministrados_proveedor",
  },

  //#region ReportesFinanzas

  {
    type: "number",
    label: "Total de ingresos",
    name: "total_ingresos",
    format: "finance",
  },

  {
    type: "number",
    label: "Total de gastos",
    name: "total_gastos",
    format: "finance",
  },

  {
    type: "number",
    label: "Balance general",
    name: "balance_general",
    format: "finance",
  },

  {
    type: "number",
    label: "Ventas mensuales",
    name: "ventas_mensuales",
    format: "finance",
  },

  {
    type: "number",
    label: "Margen de ganancias",
    name: "margen_de_ganancia",
    format: "finance",
  },

  {
    type: "number",
    label: "Historial de caja diaria",
    name: "historial_caja_diaria",
    format: "finance",
  },
];
