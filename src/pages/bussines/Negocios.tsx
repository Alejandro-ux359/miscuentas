import React, { useState, useEffect, useCallback, memo } from "react";
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
  Divider,
} from "@mui/material";
import { FixedSizeList as List } from "react-window";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { v4 as uuidv4 } from "uuid";
import { db, syncInsertNegocio } from "../../bdDexie";
import GenericForm, { CampoItem } from "../../components/GenericForms";
import { formulariosDisponibles } from "./ListadeFormulario";

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
  const [negocios, setNegocios] = useState<any[]>([]);
  const [selectedNegocio, setSelectedNegocio] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableNegocio, setEditableNegocio] = useState<any>(null);

  // --- Funciones de apertura/cierre de modales ---
  const handleAbrirPrincipal = () => setOpenMain(true);
  const handleCerrarPrincipal = () => setOpenMain(false);
  const handleAbrirCampos = () => setOpenCampos(true);
  const handleCerrarCampos = () => setOpenCampos(false);

  // --- Cargar negocios desde la DB ---
  useEffect(() => {
    const cargarNegocios = async () => {
      const lista = await db.bpropietario.toArray();
      setNegocios(lista);
    };
    cargarNegocios();
  }, []);

  useEffect(() => {
    if (selectedNegocio) setEditableNegocio(selectedNegocio);
    setIsEditing(false);
  }, [selectedNegocio]);

  // --- Toggle formularios seleccionados ---
  const toggleFormulario = useCallback((id: string) => {
    setFormulariosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }, []);

  // --- Agregar campos seleccionados ---
  const agregarCamposSeleccionados = useCallback(() => {
    const nuevosCampos = formulariosSeleccionados.flatMap((id) => {
      const form = formulariosDisponibles.find((f) => f.id === id);
      if (!form || !form.campos) return [];
      const camposArray = Array.isArray(form.campos)
        ? form.campos
        : [form.campos];
      return camposArray.map((campo: any, index: number) => ({
        id: `${id}_${index}_${uuidv4()}`,
        label: campo.label || campo.nombre || id,
        name: campo.name || `${id}_${index}_${uuidv4()}`,
        type: campo.type || "text",
        valor: "",
      }));
    });

    if (isEditing && editableNegocio) {
      setEditableNegocio({
        ...editableNegocio,
        campos: [...(editableNegocio.campos || []), ...nuevosCampos],
      });
    } else {
      setCamposPersonalizados((prev) => [...prev, ...nuevosCampos]);
    }

    setFormulariosSeleccionados([]);
    handleCerrarCampos();
  }, [formulariosSeleccionados, editableNegocio, isEditing]);

  // --- Eliminar campo ---
  const eliminarCampo = useCallback((id: string) => {
    setCamposPersonalizados((prev) => prev.filter((c) => c.id !== id));
    setValoresCampos((prev) => {
      const newValores = { ...prev };
      delete newValores[id];
      return newValores;
    });
  }, []);

  // --- Actualizar valor de campo ---
  const handleValorCampo = useCallback((id: string, valor: any) => {
    setValoresCampos((prev) => ({ ...prev, [id]: valor }));
  }, []);

  // --- Guardar negocio ---
  const handleGuardarNegocio = useCallback(async () => {
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

    // Reset
    setNombre("");
    setTipoNegocio("");
    setCamposPersonalizados([]);
    setValoresCampos({});
    handleCerrarPrincipal();
  }, [nombre, tipoNegocio, camposPersonalizados, valoresCampos]);

  // --- Eliminar negocio ---
  const handleEliminarNegocio = useCallback(async (id: number) => {
    await db.bpropietario.delete(id);
    setNegocios((prev) => prev.filter((neg) => neg.id_negocio !== id));
  }, []);

  // --- Formularios disponibles (puedes mover esto a un archivo separado) ---
  const formulariosMemo = React.useMemo(() => formulariosDisponibles, []);

  // --- CampoItem memoizado ---
  const MemoCampoItem = memo(CampoItem);

  return (
    <div style={{ padding: 20 }}>
      {/* Botón flotante */}
      <IconButton
        color="primary"
        onClick={handleAbrirPrincipal}
        style={{
          position: "fixed",
          bottom: 100,
          right: 20,
          width: 50,
          height: 50,
          borderRadius: "50%",
          backgroundColor: "#1000eb",
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
            <IconButton
              onClick={() => {
                if (
                  window.confirm(`¿Eliminar negocio "${neg.nombre_negocio}"?`)
                ) {
                  handleEliminarNegocio(neg.id_negocio);
                }
              }}
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
        <DialogTitle
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          Nuevo Negocio
          <Button onClick={handleAbrirCampos}>
            <AddIcon />
          </Button>
          <Divider />
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
            <div style={{ marginTop: 20, maxHeight: 300, overflowY: "auto" }}>
              <h4>Campos personalizados:</h4>
              {camposPersonalizados.map((campo) => (
                <MemoCampoItem
                  key={campo.id}
                  campo={campo}
                  valor={valoresCampos[campo.id]}
                  onChange={(valor) => handleValorCampo(campo.id, valor)}
                  onDelete={() => eliminarCampo(campo.id)}
                  editable={true}
                />
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
        <Divider />
        <DialogContent style={{ height: 430, padding: 20 }}>
          <List
            height={400}
            itemCount={formulariosDisponibles.length}
            itemSize={45}
            width="90%"
          >
            {({
              index,
              style,
            }: {
              index: number;
              style: React.CSSProperties;
            }) => {
              const form = formulariosDisponibles[index];
              return (
                <div style={style} key={form.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formulariosSeleccionados.includes(form.id)}
                        onChange={() => toggleFormulario(form.id)}
                      />
                    }
                    label={form.nombre}
                  />
                </div>
              );
            }}
          </List>
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

      {/* MODAL DETALLE NEGOCIO EDITABLE */}
      <Dialog
        open={!!selectedNegocio}
        onClose={() => setSelectedNegocio(null)}
        fullWidth
      >
        <DialogTitle
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {selectedNegocio?.nombre_negocio}
          <div style={{ display: "flex", alignItems: "center" }}>
            {!isEditing && (
              <IconButton onClick={() => setIsEditing(true)}>
                <EditIcon color="primary" />
              </IconButton>
            )}
            {isEditing && (
              <Button
                startIcon={<AddIcon />}
                variant="outlined"
                size="small"
                onClick={handleAbrirCampos}
                style={{ marginLeft: 8 }}
              >
                Agregar campos
              </Button>
            )}
          </div>
        </DialogTitle>

        <DialogContent>
          <div>
            <strong>Tipo de negocio:</strong>{" "}
            {isEditing ? (
              <TextField
                value={editableNegocio?.tipo_negocio || ""}
                onChange={(e) =>
                  setEditableNegocio({
                    ...editableNegocio,
                    tipo_negocio: e.target.value,
                  })
                }
                fullWidth
                margin="dense"
              />
            ) : (
              selectedNegocio?.tipo_negocio
            )}
          </div>

          {(editableNegocio?.campos || []).map((c: any) => (
            <div
              key={c.id}
              style={{
                marginTop: 10,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ flex: 1, }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {c.label || c.nombre || c.name}:
                </Typography>
                {isEditing ? (
                  <TextField
                    value={c.valor || ""}
                    onChange={(e) => {
                      const nuevosCampos = editableNegocio.campos.map(
                        (campo: any) =>
                          campo.id === c.id
                            ? { ...campo, valor: e.target.value }
                            : campo
                      );
                      setEditableNegocio({
                        ...editableNegocio,
                        campos: nuevosCampos,
                      });
                    }}
                    fullWidth
                    size="small"
                    margin="dense"
                  />
                ) : (
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {c.valor || "—"}
                  </Typography>
                )}
              </div>

              {isEditing && (
                <IconButton
                  color="error"
                  onClick={() => {
                    const nuevosCampos = editableNegocio.campos.filter(
                      (campo: any) => campo.id !== c.id
                    );
                    setEditableNegocio({
                      ...editableNegocio,
                      campos: nuevosCampos,
                    });
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </div>
          ))}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              if (isEditing) {
                setIsEditing(false);
              } else {
                setSelectedNegocio(null);
              }
            }}
          >
            Cerrar
          </Button>
          {isEditing && (
            <Button
              variant="contained"
              onClick={async () => {
                await db.bpropietario.update(
                  selectedNegocio.id_negocio,
                  editableNegocio
                );
                setNegocios((prev) =>
                  prev.map((n) =>
                    n.id_negocio === selectedNegocio.id_negocio
                      ? { ...n, ...editableNegocio }
                      : n
                  )
                );
                setSelectedNegocio(editableNegocio);
                setIsEditing(false);
              }}
            >
              Guardar
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
