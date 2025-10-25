import {
  ITextField,
  INumberField,
  IDatePicker,
  ITimePicker,
  ISelect,
} from "../../components/controls.types";
import { endpoints } from "../../components/endpoints";


//#region BPropietario
export const NombreNegocio: ITextField  = {
  type: "text",
  name: "nombre_negocio",
  gridValues: { xs: 12, lg: 12, md: 12, sm: 12, xl: 12 },
  label: "Nombre del negocio",
};

export const TipoNegocio: ITextField = {
  type: "text",
  name: "tipo_negocio",
  label: "Tipo de negocio",
};

export const Propietario: ITextField = {
  type: "text",
  name: "propietario",
  gridValues: { xs: 12, lg: 12, md: 12, sm: 12, xl: 12 },
  label: "Propietario",
};

export const Direccion: ITextField = {
  type: "text",
  label: "Dirección",
  name: "direccion",
};
export const Email: ITextField = {
  type: "text",
  name: "correo_electronico",
  label: "Email",
};

export const FechaCreacion: IDatePicker = {
  type: "date",
  name: "fecha_creacion",
  label: "Fecha de creación",
};

export const Descripcion: ITextField = {
  type: "text",
  name: "descripcion",
  label: "Descripción",
};

export const HorarioApertura: ITimePicker = {
  type: "time",
  label: "Hora de apertura",
  name: "horario_apertura",
};

export const HorarioCierre: ITimePicker = {
  type: "time",
  label: "Horario de cierre",
  name: "horario_cierre",
  
};

export const SitioWeb: ITextField = {
  type: "text",
  label: "Sitio Web",
  name: "sitio_web",
};

export const Trabajadores: ITextField = {
  type: "text",
  label: "Trabajadores",
  name: "trabajadores",
};

export const Movil: INumberField = {
  type: "number",
  label: "Móvil ",
  name: "movil",
  format: "other",
};
export const Producto: ITextField = {
  type: "text",
  label: "Productos",
  name: "productos",
};

export const Dinero: INumberField = {
  type: "number",
  label: "Dinero",
  name: "money",
  format: "finance",
};

export const Cuenta: INumberField = {
  type: "number",
  label: "Cuenta",
  name: "cuenta",
  format: "other",
};

export const MetodosPago: ISelect = {
  type: "select",
  label: "Metodo de pago",
  name: "metodo_pago",
  url: endpoints.metodoPago,
};

export const TBussines: ITextField = {
  type: "text",
  label: "Registro de Ganancias",
  name: "tbussines",
};

export const Tipos: ISelect = {
  type: "select",
  label: "Compra y Venta",
  name: "tipos",
};

//#region Clientes

export const Apellido: ITextField = {
  type: "text",
  label: "Apellidos del cliente",
  name: "apellidos",
};

export const Cedula: INumberField = {
  type: "number",
  label: "Carnet de identidad",
  name: "cedula_ci_cliente",
  format: "other",
};

export const TipoCliente: ISelect = {
  type: "select",
  name: "tipo_cliente",
  label: "Frecuencia con la que visita el cliente",
};

export const HistorialCompraCliente: ITextField = {
  type: "text",
  label: "Historial de compra del cliente",
  name: "historial_compras_cliente",
};

export const DeudaCliente: ITextField = {
  type: "text",
  label: "Deuda del cliente",
  name: "deuda_cliente",
};

//#region Productos y Servicios

export const NombreProducto: ITextField = {
  type: "text",
  label: "Nombre del producto o servicio",
  name: "nombre_producto",
};

export const DescripcionProducto: ITextField = {
  type: "text",
  label: "Descripción del producto",
  name: "descripcion_producto",
};

export const CategoriaProducto: ITextField = {
  type: "text",
  label: "Categoria del producto",
  name: "categoria_producto",
};

export const PrecioProducto: INumberField = {
  type: "number",
  label: "Precios",
  name: "precio_venta_producto",
  format: "finance",
};

export const Unidad: ITextField = {
  type: "text",
  label: "Unidad",
  name: "unidad_producto",
};

export const StockMaximo: INumberField = {
  type: "number",
  label: "Stock actual",
  name: "stock_actual_producto",
  format: "other",
};

export const StockMinimo: INumberField = {
  type: "number",
  label: "Stock minimo",
  name: "stock_mínimo_producto",
  format: "other",
};

export const FechaIngresos: IDatePicker = {
  type: "date",
  label: "Fecha de ingreso del producto",
  name: "fecha_ingreso_producto",
};

export const FechaActualizacion: IDatePicker = {
  type: "date",
  label: "Fecha de actualización del producto",
  name: "fecha_actualizacion_producto",
};

//#region Empleados y Usuarios

export const Nombre: ITextField = {
  type: "text",
  label: "Nombre",
  name: "nombre_usuario",
};

export const CargoEmpleado: ITextField = {
  type: "text",
  label: "Cargo del empleado",
  name: "cargo_usuario",
};

export const SalarioEmpleado: INumberField = {
  type: "number",
  label: "Salario",
  name: "salario_usuario",
  format: "finance",
};

export const FechaIngresosEmpleado: IDatePicker = {
  type: "date",
  label: "Fecha de ingreso",
  name: "fecha_ingreso_usuario",
};

export const RolUsuario: ITextField  = {
  type: "text",
  label: "Rol del empleado",
  name: "rol_usuario",
};

//#region Proveedores

export const ProductosSuministrado: ITextField = {
  type: "text",
  label: "Productos suministrados",
  name: "productos_suministrados_proveedor",
};

//#region ReportesFinanzas

export const TotalIngresos: INumberField = {
  type: "number",
  label: "Total de ingresos",
  name: "total_ingresos",
  format: "finance",
};

export const TotalGastos: INumberField = {
  type: "number",
  label: "Total de gastos",
  name: "total_gastos",
  format: "finance",
};

export const BalanceGeneral: INumberField = {
  type: "number",
  label: "Balance general",
  name: "balance_general",
  format: "finance",
};

export const VentasMensuales: INumberField = {
  type: "number",
  label: "Ventas mensuales",
  name: "ventas_mensuales",
  format: "finance",
};

export const MargenGanancias: INumberField = {
  type: "number",
  label: "Margen de ganancias",
  name: "margen_de_ganancia",
  format: "finance",
};

export const HistorialDeCaja: INumberField = {
  type: "number",
  label: "Historial de caja diaria",
  name: "historial_caja_diaria",
  format: "finance",
};
