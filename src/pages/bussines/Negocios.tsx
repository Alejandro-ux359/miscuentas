import React, { useState, useEffect } from "react";
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
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { db, syncInsertNegocio } from "../../bdDexie";

import {
  Propietario,
  Direccion,
  Email,
  FechaCreacion,
  Descripcion,
  HorarioApertura,
  HorarioCierre,
  SitioWeb,
  Trabajadores,
  CargoEmpleado,
  SalarioEmpleado,
  FechaIngresosEmpleado,
  Movil,
  RolUsuario,
  Nombre,
  Apellido,
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
  ProductosSuministrado,
  MetodosPago,
  Dinero,
  Cuenta,
  TBussines,
  Tipos,
  TotalIngresos,
  TotalGastos,
  BalanceGeneral,
  VentasMensuales,
  MargenGanancias,
  HistorialDeCaja,
} from "./FormBusines";

export default function NegocioModal() {
  const [openMain, setOpenMain] = useState(false);
  const [openCampos, setOpenCampos] = useState(false);
  const [nombre, setNombre] = useState("");
  const [tipoNegocio, setTipoNegocio] = useState("");
  const [camposPersonalizados, setCamposPersonalizados] = useState<any[]>([]);
  const [valoresCampos, setValoresCampos] = useState<{ [key: string]: any }>({});
  const [formulariosSeleccionados, setFormulariosSeleccionados] = useState<string[]>([]);
  const [negocios, setNegocios] = useState<any[]>([]);
  const [selectedNegocio, setSelectedNegocio] = useState<any>(null);

  const formulariosDisponibles = [
    { id: "Propietario", nombre: "Propietario", campos: Propietario },
    { id: "Direccion", nombre: "Dirección", campos: Direccion },
    { id: "Email", nombre: "Correo Electrónico", campos: Email },
    { id: "FechaCreacion", nombre: "Fecha de Creación", campos: FechaCreacion },
    { id: "Descripcion", nombre: "Descripción", campos: Descripcion },
    { id: "HorarioApertura", nombre: "Horario de Apertura", campos: HorarioApertura },
    { id: "HorarioCierre", nombre: "Horario de Cierre", campos: HorarioCierre },
    { id: "SitioWeb", nombre: "Sitio Web", campos: SitioWeb },
    { id: "Trabajadores", nombre: "Cantidad de Trabajadores", campos: Trabajadores },
    { id: "CargoEmpleado", nombre: "Cargo del Empleado", campos: CargoEmpleado },
    { id: "SalarioEmpleado", nombre: "Salario", campos: SalarioEmpleado },
    { id: "FechaIngresosEmpleado", nombre: "Fecha de Ingreso del Empleado", campos: FechaIngresosEmpleado },
    { id: "MovilEmpleado", nombre: "Móvil o Teléfono", campos: Movil },
    { id: "RolUsuario", nombre: "Rol del Usuario / Empleado", campos: RolUsuario },
    { id: "Nombre", nombre: "Nombre", campos: Nombre },
    { id: "Apellido", nombre: "Apellido", campos: Apellido },
    { id: "Cedula", nombre: "Cédula del Cliente", campos: Cedula },
    { id: "TipoCliente", nombre: "Tipo de Cliente", campos: TipoCliente },
    { id: "HistorialCompraCliente", nombre: "Historial de Compras", campos: HistorialCompraCliente },
    { id: "DeudaCliente", nombre: "Deuda del Cliente", campos: DeudaCliente },
    { id: "NombreProducto", nombre: "Nombre del Producto", campos: NombreProducto },
    { id: "CategoriaProducto", nombre: "Categoría del Producto", campos: CategoriaProducto },
    { id: "PrecioProducto", nombre: "Precio del Producto", campos: PrecioProducto },
    { id: "Unidad", nombre: "Unidad de Medida", campos: Unidad },
    { id: "StockMaximo", nombre: "Stock Máximo", campos: StockMaximo },
    { id: "StockMinimo", nombre: "Stock Mínimo", campos: StockMinimo },
    { id: "FechaIngresos", nombre: "Fecha de Ingreso del Producto", campos: FechaIngresos },
    { id: "FechaActualizacion", nombre: "Fecha de Actualización", campos: FechaActualizacion },
    { id: "ProductosSuministrado", nombre: "Productos Suministrados", campos: ProductosSuministrado },
    { id: "MetodosPago", nombre: "Métodos de Pago", campos: MetodosPago },
    { id: "Dinero", nombre: "Dinero Disponible", campos: Dinero },
    { id: "Cuenta", nombre: "Cuenta Bancaria", campos: Cuenta },
    { id: "TBussines", nombre: "Tipo de Empresa", campos: TBussines },
    { id: "Tipos", nombre: "Tipos de Operaciones", campos: Tipos },
    { id: "TotalIngresos", nombre: "Total de Ingresos", campos: TotalIngresos },
    { id: "TotalGastos", nombre: "Total de Gastos", campos: TotalGastos },
    { id: "BalanceGeneral", nombre: "Balance General", campos: BalanceGeneral },
    { id: "VentasMensuales", nombre: "Ventas Mensuales", campos: VentasMensuales },
    { id: "MargenGanancias", nombre: "Margen de Ganancias", campos: MargenGanancias },
    { id: "HistorialDeCaja", nombre: "Historial de Caja", campos: HistorialDeCaja },
  ];

  useEffect(() => {
    const cargarNegocios = async () => {
      const lista = await db.bpropietario.toArray();
      setNegocios(lista);
    };
    cargarNegocios();
  }, []);

  const handleAbrirPrincipal = () => setOpenMain(true);
  const handleCerrarPrincipal = () => setOpenMain(false);
  const handleAbrirCampos = () => setOpenCampos(true);
  const handleCerrarCampos = () => setOpenCampos(false);

  const toggleFormulario = (id: string) => {
    setFormulariosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const agregarCamposSeleccionados = () => {
    const nuevosCampos = formulariosSeleccionados.flatMap((id) => {
      const form = formulariosDisponibles.find((f) => f.id === id);
      if (!form || !form.campos) return [];

      const camposArray = Array.isArray(form.campos) ? form.campos : [form.campos];

      return camposArray.map((campo: any, index: number) => ({
        id: `${id}_${index}`,
        nombre: campo.label || campo.nombre || id,
        tipo: campo.type || "text",
      }));
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

  const handleGuardarNegocio = async () => {
    const nuevoNegocio = {
      nombre_negocio: nombre,
      tipo_negocio: tipoNegocio,
      campos: camposPersonalizados.map((c) => ({
        ...c,
        valor: valoresCampos[c.id] ?? "",
      })),
    };

    const id = await db.bpropietario.add(nuevoNegocio as any);
    await syncInsertNegocio(nuevoNegocio as any, id);

    const lista = await db.bpropietario.toArray();
    setNegocios(lista);

    setNombre("");
    setTipoNegocio("");
    setCamposPersonalizados([]);
    setValoresCampos({});
    setOpenMain(false);
  };

  const handleEliminarNegocio = async (id: number) => {
    try {
      await db.bpropietario.delete(id);
      setNegocios((prev) => prev.filter((neg) => neg.id_negocio !== id));
    } catch (error) {
      console.error("Error eliminando negocio:", error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Botón flotante */}
      <IconButton
        color="primary"
        onClick={handleAbrirPrincipal}
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
        }}
      >
        <AddIcon style={{ fontSize: 30 }} />
      </IconButton>

      {/* Lista de negocios */}
      <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
        {negocios.map((neg) => (
          <Card key={neg.id_negocio} style={{ position: "relative" }}>
            <CardContent
              onClick={() => setSelectedNegocio(neg)}
              style={{ cursor: "pointer" }}
            >
              <Typography variant="h6">{neg.nombre_negocio}</Typography>
              <Typography color="textSecondary">{neg.tipo_negocio}</Typography>
            </CardContent>
            {/* Botón eliminar */}
            <IconButton
              onClick={() => handleEliminarNegocio(neg.id_negocio)}
              style={{ position: "absolute", top: 0, right: 0 }}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Card>
        ))}
      </div>

      {/* MODAL PRINCIPAL */}
      <Dialog open={openMain} onClose={handleCerrarPrincipal} fullWidth>
        <DialogTitle style={{ display: "flex", justifyContent: "space-between" }}>
          Nuevo Negocio
          <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={handleAbrirCampos}>
            Agregar campos
          </Button>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre del negocio"
            fullWidth
            margin="dense"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <TextField
            label="Tipo de negocio"
            fullWidth
            margin="dense"
            value={tipoNegocio}
            onChange={(e) => setTipoNegocio(e.target.value)}
          />

          {camposPersonalizados.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <h4>Campos personalizados:</h4>
              {camposPersonalizados.map((campo) => (
                <div
                  key={campo.id}
                  style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}
                >
                  {["text", "time"].includes(campo.tipo) && (
                    <TextField
                      label={campo.nombre}
                      fullWidth
                      value={valoresCampos[campo.id] || ""}
                      onChange={(e) => handleValorCampo(campo.id, e.target.value)}
                    />
                  )}
                  {campo.tipo === "number" && (
                    <TextField
                      type="number"
                      label={campo.nombre}
                      fullWidth
                      value={valoresCampos[campo.id] || ""}
                      onChange={(e) => handleValorCampo(campo.id, e.target.value)}
                    />
                  )}
                  {campo.tipo === "date" && (
                    <TextField
                      type="date"
                      label={campo.nombre}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={valoresCampos[campo.id] || ""}
                      onChange={(e) => handleValorCampo(campo.id, e.target.value)}
                    />
                  )}
                  {campo.tipo === "checkbox" && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!!valoresCampos[campo.id]}
                          onChange={(e) => handleValorCampo(campo.id, e.target.checked)}
                        />
                      }
                      label={campo.nombre}
                    />
                  )}
                  <IconButton color="error" onClick={() => eliminarCampo(campo.id)}>
                    <DeleteIcon />
                  </IconButton>
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

      {/* MODAL CAMPOS PERSONALIZADOS */}
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

      {/* MODAL DETALLE NEGOCIO */}
      <Dialog open={!!selectedNegocio} onClose={() => setSelectedNegocio(null)} fullWidth>
        <DialogTitle>{selectedNegocio?.nombre_negocio}</DialogTitle>
        <DialogContent>
          <div>
            <strong>Tipo de negocio:</strong> {selectedNegocio?.tipo_negocio}
          </div>
          {selectedNegocio?.campos
            ?.filter((c: any) => c.valor !== "" && c.valor !== null)
            .map((c: any) => (
              <div key={c.id} style={{ marginTop: 6 }}>
                <strong>{c.nombre}: </strong>
                <span>{c.valor}</span>
              </div>
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedNegocio(null)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
