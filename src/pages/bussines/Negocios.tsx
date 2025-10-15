import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

// Importas los formularios
import {
  NombreNegocio,
  TipoNegocio,
  Propietario,
  Direccion,
  Email,
  FechaCreacion,
  Descripcion,
  HorarioApertura,
  HorarioCierre,
  SitioWeb,
  Trabajadores,
  Movil,
  Dinero,
  Cuenta,
  TBussines,
  Tipos,
  Cedula,
  TipoCliente,
  HistorialCompraCliente,
  DeudaCliente,
  NombreProducto,
  CategoriaProducto,
  PrecioProducto,
  Unidad,
  StockMaximo,
  StockMinimo,
  FechaIngresos,
  FechaActualizacion,
  CargoEmpleado,
  SalarioEmpleado,
  FechaIngresosEmpleado,
  RolUsuario,
  ProductosSuministrado,
  MetodosPago,
  TotalIngresos,
  TotalGastos,
  BalanceGeneral,
  VentasMensuales,
  MargenGanancias,
  HistorialDeCaja,
  Apellido,
  Nombre,
} from "./FormBusines";

export default function NegocioModal() {
  const [openMain, setOpenMain] = useState(false);
  const [openCampos, setOpenCampos] = useState(false);
  const [nombre, setNombre] = useState("");
  const [tipoNegocio, setTipoNegocio] = useState("");
  const [camposPersonalizados, setCamposPersonalizados] = useState<any[]>([]);
  const [valoresCampos, setValoresCampos] = useState<{ [key: string]: any }>(
    {}
  );
  const [formulariosSeleccionados, setFormulariosSeleccionados] = useState<
    string[]
  >([]);
  const formulariosDisponibles = [
    
    { id: "Propietario", nombre: "Propietario", campos: Propietario },
    { id: "Direccion", nombre: "Dirección", campos: Direccion },
    { id: "Email", nombre: "Correo Electrónico", campos: Email },
    { id: "FechaCreacion", nombre: "Fecha de Creación", campos: FechaCreacion },
    {
      id: "Descripcion",
      nombre: "Descripción",
      campos: Descripcion,
    },
    {
      id: "HorarioApertura",
      nombre: "Horario de Apertura",
      campos: HorarioApertura,
    },
    { id: "HorarioCierre", nombre: "Horario de Cierre", campos: HorarioCierre },
    { id: "SitioWeb", nombre: "Sitio Web", campos: SitioWeb },

    {
      id: "Trabajadores",
      nombre: "Cantidad de Trabajadores",
      campos: Trabajadores,
    },
  
    {
      id: "CargoEmpleado",
      nombre: "Cargo del Empleado",
      campos: CargoEmpleado,
    },
    {
      id: "SalarioEmpleado",
      nombre: "Salario",
      campos: SalarioEmpleado,
    },
    {
      id: "FechaIngresosEmpleado",
      nombre: "Fecha de Ingreso del Empleado",
      campos: FechaIngresosEmpleado,
    },
    {
      id: "MovilEmpleaado",
      nombre: "Móvil o Teléfono",
      campos: Movil,
    },
    {
      id: "RolUsuario",
      nombre: "Rol del Usuario / Empleado",
      campos: RolUsuario,
    },
      {
      id: "Nombre",
      nombre: "Nombre",
      campos: Nombre,
    },
    {
      id: "Apellido",
      nombre: "Apellido",
      campos: Apellido,
    },
    { id: "Cedula", nombre: "Cédula del Cliente", campos: Cedula },
   
    { id: "TipoCliente", nombre: "Tipo de Cliente", campos: TipoCliente },
    {
      id: "HistorialCompraCliente",
      nombre: "Historial de Compras",
      campos: HistorialCompraCliente,
    },
    { id: "DeudaCliente", nombre: "Deuda del Cliente", campos: DeudaCliente },

    {
      id: "NombreProducto",
      nombre: "Nombre del Producto",
      campos: NombreProducto,
    },
    {
      id: "CategoriaProducto",
      nombre: "Categoría del Producto",
      campos: CategoriaProducto,
    },
    {
      id: "PrecioProducto",
      nombre: "Precio del Producto",
      campos: PrecioProducto,
    },
    { id: "Unidad", nombre: "Unidad de Medida", campos: Unidad },
    { id: "StockMaximo", nombre: "Stock Máximo", campos: StockMaximo },
    { id: "StockMinimo", nombre: "Stock Mínimo", campos: StockMinimo },
    {
      id: "FechaIngresos",
      nombre: "Fecha de Ingreso del Producto",
      campos: FechaIngresos,
    },
    {
      id: "FechaActualizacion",
      nombre: "Fecha de Actualización",
      campos: FechaActualizacion,
    },
    {
      id: "ProductosSuministrado",
      nombre: "Productos Suministrados",
      campos: ProductosSuministrado,
    },
    { id: "MetodosPago", nombre: "Métodos de Pago", campos: MetodosPago },

    { id: "Dinero", nombre: "Dinero Disponible", campos: Dinero },
    { id: "Cuenta", nombre: "Cuenta Bancaria", campos: Cuenta },
    { id: "TBussines", nombre: "Tipo de Empresa", campos: TBussines },
    { id: "Tipos", nombre: "Tipos de Operaciones", campos: Tipos },
    { id: "TotalIngresos", nombre: "Total de Ingresos", campos: TotalIngresos },
    { id: "TotalGastos", nombre: "Total de Gastos", campos: TotalGastos },
    { id: "BalanceGeneral", nombre: "Balance General", campos: BalanceGeneral },
    {
      id: "VentasMensuales",
      nombre: "Ventas Mensuales",
      campos: VentasMensuales,
    },
    {
      id: "MargenGanancias",
      nombre: "Margen de Ganancias",
      campos: MargenGanancias,
    },
    {
      id: "HistorialDeCaja",
      nombre: "Historial de Caja",
      campos: HistorialDeCaja,
    },
  ];

  // abrir/cerrar modales
  const handleAbrirPrincipal = () => setOpenMain(true);
  const handleCerrarPrincipal = () => setOpenMain(false);
  const handleAbrirCampos = () => setOpenCampos(true);
  const handleCerrarCampos = () => setOpenCampos(false);

  // Toggle selección de formulario
  const toggleFormulario = (id: string) => {
    setFormulariosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // Agregar campos desde los formularios seleccionados
  const agregarCamposSeleccionados = () => {
    const nuevosCampos = formulariosSeleccionados.flatMap((id) => {
      const form = formulariosDisponibles.find((f) => f.id === id);

      if (!form || !form.campos) return [];

      const campo = form.campos;

      return [
        {
          id: `${id}_${campo.name}`,
          nombre: campo.label,
          tipo: campo.type,
        },
      ];
    });

    setCamposPersonalizados((prev) => [...prev, ...nuevosCampos]);
    setFormulariosSeleccionados([]);
    setOpenCampos(false);
  };

  const eliminarCampo = (id: string) => {
    setCamposPersonalizados(camposPersonalizados.filter((c) => c.id !== id));
    const newValores = { ...valoresCampos };
    delete newValores[id];
    setValoresCampos(newValores);
  };

  const handleValorCampo = (id: string, valor: any) => {
    setValoresCampos((prev) => ({ ...prev, [id]: valor }));
  };

  const handleGuardarNegocio = () => {
    const negocio = {
      nombre,
      tipoNegocio,
      campos: camposPersonalizados.map((c) => ({
        ...c,
        valor: valoresCampos[c.id] ?? "",
      })),
    };
    setOpenMain(false);
    setCamposPersonalizados([]);
    setValoresCampos({});
    setNombre("");
    setTipoNegocio("");
  };

  return (
    <div style={{ padding: 20 }}>
      <IconButton
        color="primary"
        onClick={() => setOpenMain(true)}
        style={{
          position: "fixed",
          bottom: 30,
          right: 30,
          width: 60,
          height: 60,
          borderRadius: "50%",
          backgroundColor: "#1976d2",
          color: "white",
          boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
          fontSize: 30,
        }}
      >
        <AddIcon style={{ fontSize: 30 }} />
      </IconButton>

      {/* MODAL PRINCIPAL */}
      <Dialog open={openMain} onClose={handleCerrarPrincipal} fullWidth>
        <DialogTitle
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Nuevo Negocio
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            size="small"
            onClick={handleAbrirCampos}
          >
            Agregar campos
          </Button>
        </DialogTitle>

        <DialogContent>
        <TextField
  id= "NombreNegocio"
  label="Nombre del negocio"
  fullWidth
  margin="dense"
  value={valoresCampos["NombreNegocio"] || nombre}
  onChange={(e) => {
    setNombre(e.target.value);
    setValoresCampos((prev) => ({
      ...prev,
      ["NombreNegocio"]: e.target.value,
    }));
  }}
/>

<TextField
  id="TipoNegocio" 
  label="Tipo de negocio"
  fullWidth
  margin="dense"
  value={valoresCampos["TipoNegocio"] || tipoNegocio}
  onChange={(e) => {
    setTipoNegocio(e.target.value);
    setValoresCampos((prev) => ({
      ...prev,
      ["TipoNegocio"]: e.target.value,
    }));
  }}
/>


          {camposPersonalizados.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <h4>Campos personalizados:</h4>
              {camposPersonalizados.map((campo) => (
                <div
                  key={campo.id}
                  style={{
                    marginBottom: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {/* Render dinámico según tipo */}
                  {["text", "time"].includes(campo.tipo) && (
                    <TextField
                      label={campo.nombre}
                      fullWidth
                      value={valoresCampos[campo.id] || ""}
                      onChange={(e) =>
                        handleValorCampo(campo.id, e.target.value)
                      }
                    />
                  )}
                  {campo.tipo === "number" && (
                    <TextField
                      type="number"
                      label={campo.nombre}
                      fullWidth
                      value={valoresCampos[campo.id] || ""}
                      onChange={(e) =>
                        handleValorCampo(campo.id, e.target.value)
                      }
                    />
                  )}
                  {campo.tipo === "date" && (
                    <TextField
                      type="date"
                      label={campo.nombre}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={valoresCampos[campo.id] || ""}
                      onChange={(e) =>
                        handleValorCampo(campo.id, e.target.value)
                      }
                    />
                  )}
                  {campo.tipo === "select" && (
                    <TextField
                      select
                      label={campo.nombre}
                      fullWidth
                      value={valoresCampos[campo.id] || ""}
                      onChange={(e) =>
                        handleValorCampo(campo.id, e.target.value)
                      }
                    >
                      <option value="">Seleccionar...</option>
                      <option value="op1">Opción 1</option>
                      <option value="op2">Opción 2</option>
                      <option value="op3">Opción 3</option>
                    </TextField>
                  )}
                  {campo.tipo === "checkbox" && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!!valoresCampos[campo.id]}
                          onChange={(e) =>
                            handleValorCampo(campo.id, e.target.checked)
                          }
                        />
                      }
                      label={campo.nombre}
                    />
                  )}

                  {/* Botón eliminar */}
                  <IconButton
                    color="error"
                    onClick={() => eliminarCampo(campo.id)}
                  >
                    <DeleteIcon />
                  </IconButton>

                  {/* Botón duplicar */}
                  <Button
                    variant="outlined"
                    style={{
                      borderRadius: 8,
                      minWidth: 40,
                      padding: "6px 8px",
                      textTransform: "none",
                    }}
                    onClick={() => {
                      const nuevoCampo = {
                        ...campo,
                        id: `${campo.id}_copy_${Date.now()}`, // ID único
                      };
                      setCamposPersonalizados((prev) => [...prev, nuevoCampo]);
                      setValoresCampos((prev) => ({
                        ...prev,
                        [nuevoCampo.id]: valoresCampos[campo.id] || "",
                      }));
                    }}
                  >
                    +
                  </Button>
                </div>
              ))}
            </div>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCerrarPrincipal}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardarNegocio}>
            Guardar negocio
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODAL SECUNDARIO (checkboxes con formularios) */}
      <Dialog open={openCampos} onClose={handleCerrarCampos} fullWidth>
        <DialogTitle>Seleccionar formularios</DialogTitle>
        <DialogContent>
          {formulariosDisponibles.map((form) => (
            <FormControlLabel
              key={form.id}
              control={
                <Checkbox
                  checked={formulariosSeleccionados.includes(form.id)}
                  onChange={() => toggleFormulario(form.id)}
                />
              }
              label={form.nombre}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCerrarCampos}>Cancelar</Button>
          <Button
            variant="contained"
            disabled={formulariosSeleccionados.length === 0}
            onClick={agregarCamposSeleccionados}
          >
            Agregar campos
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
