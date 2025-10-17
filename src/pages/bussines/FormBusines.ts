//#region BPropietario
export const NombreNegocio = {
  type: "text",
  name: "nombre_negocio",
  gridValues: { xs: 12, lg: 12, md: 12, sm: 12, xl: 12 },
  label: "Nombre del negocio",
};

export const TipoNegocio = {
  type: "text",
  name: "tipo_negocio",
  label: "Tipo de negocio",
};

export const Propietario = {
  type: "text",
  name: "propietario",
  gridValues: { xs: 12, lg: 12, md: 12, sm: 12, xl: 12 },
  label: "Propietario",
};

export const Direccion = {
  type: "text",
  label: "Dirección",
  name: "direccion",
};
export const Email = {
  type: "text",
  name: "correo_electronico",
  label: "Email",
};

export const FechaCreacion = {
  type: "date",
  name: "fecha_creacion",
  label: "Fecha de creación",
};

export const Descripcion = {
  type: "text",
  name: "descripcion",
  label: "Descripción",
};

export const HorarioApertura = {
  type: "time",
  label: "Hora de apertura",
  name: "horario_apertura",
};

export const HorarioCierre = {
  type: "time",
  label: "Horario de cierre",
  name: "horario_cierre",
  
};

export const SitioWeb = {
  type: "text",
  label: "Sitio Web",
  name: "sitio_web",
};

export const Trabajadores = {
  type: "text",
  label: "Trabajadores",
  name: "trabajadores",
};

export const Movil = {
  type: "number",
  label: "Móvil ",
  name: "movil",
  format: "other",
};
export const Producto = {
  type: "text",
  label: "Productos",
  name: "productos",
};

export const Dinero = {
  type: "number",
  label: "Dinero",
  name: "money",
  format: "finance",
};

export const Cuenta = {
  type: "number",
  label: "Cuenta",
  name: "cuenta",
  format: "other",
};

export const MetodosPago = {
  type: "select",
  label: "Registro de Ganancias",
  name: "metodo_pago",
};

export const TBussines = {
  type: "select",
  label: "Registro de Ganancias",
  name: "tbussines",
};

export const Tipos = {
  type: "select",
  label: "Compra y Venta",
  name: "tipos",
};

//#region Clientes

export const Apellido = {
  type: "text",
  label: "Apellidos del cliente",
  name: "apellidos",
};

export const Cedula = {
  type: "number",
  label: "Carnet de identidad",
  name: "cedula_ci_cliente",
  format: "other",
};

export const TipoCliente = {
  type: "select",
  name: "tipo_cliente",
  label: "Frecuencia con la que visita el cliente",
};

export const HistorialCompraCliente = {
  type: "text",
  label: "Historial de compra del cliente",
  name: "historial_compras_cliente",
};

export const DeudaCliente = {
  type: "text",
  label: "Deuda del cliente",
  name: "deuda_cliente",
};

//#region Productos y Servicios

export const NombreProducto = {
  type: "text",
  label: "Nombre del producto o servicio",
  name: "nombre_producto",
};

export const DescripcionProducto = {
  type: "text",
  label: "Descripción del producto",
  name: "descripcion_producto",
};

export const CategoriaProducto = {
  type: "text",
  label: "Categoria del producto",
  name: "categoria_producto",
};

export const PrecioProducto = {
  type: "number",
  label: "Precios",
  name: "precio_venta_producto",
  format: "finance",
};

export const Unidad = {
  type: "select",
  label: "Unidad",
  name: "unidad_producto",
};

export const StockMaximo = {
  type: "number",
  label: "Stock actual",
  name: "stock_actual_producto",
  format: "other",
};

export const StockMinimo = {
  type: "number",
  label: "Stock minimo",
  name: "stock_mínimo_producto",
  format: "other",
};

export const FechaIngresos = {
  type: "date",
  label: "Fecha de ingreso del producto",
  name: "fecha_ingreso_producto",
};

export const FechaActualizacion = {
  type: "date",
  label: "Fecha de actualización del producto",
  name: "fecha_actualizacion_producto",
};

//#region Empleados y Usuarios

export const Nombre = {
  type: "text",
  label: "Nombre",
  name: "nombre_usuario",
};

export const CargoEmpleado = {
  type: "select",
  label: "Cargo del empleado",
  name: "cargo_usuario",
};

export const SalarioEmpleado = {
  type: "number",
  label: "Salario",
  name: "salario_usuario",
  format: "finance",
};

export const FechaIngresosEmpleado = {
  type: "date",
  label: "Fecha de ingreso",
  name: "fecha_ingreso_usuario",
};

export const RolUsuario = {
  type: "text",
  label: "Rol del empleado",
  name: "rol_usuario",
};

//#region Proveedores

export const ProductosSuministrado = {
  type: "text",
  label: "Productos suministrados",
  name: "productos_suministrados_proveedor",
};

//#region ReportesFinanzas

export const TotalIngresos = {
  type: "number",
  label: "Total de ingresos",
  name: "total_ingresos",
  format: "finance",
};

export const TotalGastos = {
  type: "number",
  label: "Total de gastos",
  name: "total_gastos",
  format: "finance",
};

export const BalanceGeneral = {
  type: "number",
  label: "Balance general",
  name: "balance_general",
  format: "finance",
};

export const VentasMensuales = {
  type: "number",
  label: "Ventas mensuales",
  name: "ventas_mensuales",
  format: "finance",
};

export const MargenGanancias = {
  type: "number",
  label: "Margen de ganancias",
  name: "margen_de_ganancia",
  format: "finance",
};

export const HistorialDeCaja = {
  type: "number",
  label: "Historial de caja diaria",
  name: "historial_caja_diaria",
  format: "finance",
};
