import { useState, useEffect } from "react";
import { formulariosDisponibles } from "./FormBusines";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Box,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { CampoItem } from "../../components/GenericForms";
import {
  db,
  syncDeleteNegocio,
  syncUpdateNegocio,
  syncInsertNegocio,
} from "../../bdDexie";
import { BNegocios } from "../../bdDexie";
import { ISelect } from "../../components/controls.types";
import axios from "axios";
import { useNomencladoresLocal } from "../../nomencladores/useNomencladoresLocal";
import dayjs from "dayjs";

interface ISelectFieldProps {
  control: ISelect;
  value: string;
  onChange: (value: string) => void;
}

export default function Negocios() {
  const [camposSeleccionadosTemp, setCamposSeleccionadosTemp] = useState<
    string[]
  >([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [editarDesdeDetalle, setEditarDesdeDetalle] = useState(false);
  const { data: nomencladores, loading: loadingNomencladores } =
    useNomencladoresLocal();

  const [open, setOpen] = useState(false);
  const [openSubModal, setOpenSubModal] = useState(false);
  const [camposSeleccionados, setCamposSeleccionados] = useState<string[]>([]);
  const [negocioEditarIndex, setNegocioEditarIndex] = useState<number | null>(
    null
  );
  const [negociosGuardados, setNegociosGuardados] = useState<BNegocios[]>([]);
  const [negocioSeleccionado, setNegocioSeleccionado] =
    useState<BNegocios | null>(null);
  const [openDetalleModal, setOpenDetalleModal] = useState(false);

  const [confirmarEliminar, setConfirmarEliminar] = useState<{
    open: boolean;
    index: number | null;
    nombre_negocio?: string;
  }>({ open: false, index: null, nombre_negocio: "" });

  const [valores, setValores] = useState<Partial<BNegocios>>({
    nombre_negocio: "",
    tipo_negocio: "",
  });

  // Cargar negocios desde Dexie al inicio
  useEffect(() => {
    const cargarNegocios = async () => {
      const all = await db.bnegocios.toArray();
      setNegociosGuardados(all);
    };
    cargarNegocios();
  }, []);

  const SelectField = ({ control, value, onChange }: ISelectFieldProps) => {
    const [options, setOptions] = useState<any[]>(control.checkValues || []);

    useEffect(() => {
      const cargarOpciones = async () => {
        let localOptions: any[] = [];

        // Si hay URL y estamos online
        if (control.url && navigator.onLine) {
          try {
            const res = await axios.get(control.url);
            localOptions = res.data.map((item: any) => ({
              value: item.id ?? item.id_concepto,
              label: item.nombre ?? item.denominacion,
            }));
          } catch (err) {
            console.warn("Error cargando desde server, se usará local", err);
          }
        }

        // Si no hay URL o estamos offline
        if (!localOptions.length) {
          const nomencladores = await db.nomencladores.get("default");
          if (nomencladores) {
            const nameToNomenclador: Record<string, any[]> = {
              metodo_pago: nomencladores.metodoPago,
              tipos: nomencladores.compraventa,
              tipo_cliente: nomencladores.tcliente,
              // si quieres agregar más, ejemplo:
              moneda: nomencladores.moneda,
              categoria_producto: nomencladores.categoria,
            };

            localOptions = nameToNomenclador[control.name] || [];
          }
        }

        setOptions(localOptions);
      };

      cargarOpciones();
    }, [control]);

    return (
      <TextField
        select
        label={control.label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            backgroundColor: "white",
            "&:hover fieldset": { borderColor: "#667eea" },
            "&.Mui-focused fieldset": {
              borderColor: "#667eea",
              borderWidth: 2,
            },
          },
          "& .MuiInputLabel-root.Mui-focused": { color: "#667eea" },
        }}
      >
        <MenuItem value="" disabled>
          Selecciona...
        </MenuItem>
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.label}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>
    );
  };

  // Funciones de modales
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);

    if (editarDesdeDetalle) {
      setEditarDesdeDetalle(false);
      if (negocioTemporal) {
        handleOpenDetalle(negocioTemporal);
        setNegocioTemporal(null);
      }
    }
  };
  useEffect(() => {
    if (negocioSeleccionado?.id_negocio) {
      const actualizarDetalle = async () => {
        const negocioRefrescado = await db.bnegocios.get(
          negocioSeleccionado.id_negocio!
        );
        if (negocioRefrescado) {
          setNegocioSeleccionado({ ...negocioRefrescado });
        }
      };
      actualizarDetalle();
    }
  }, [negociosGuardados]);

  const handleOpenSubModal = () => {
    setCamposSeleccionadosTemp(camposSeleccionados);
    setOpenSubModal(true);
  };

  const handleCloseSubModal = () => setOpenSubModal(false);

  const handleOpenDetalle = (negocio: BNegocios) => {
    setNegocioSeleccionado(negocio);
    setOpenDetalleModal(true);
  };
  const handleCloseDetalle = () => {
    setNegocioSeleccionado(null);
    setOpenDetalleModal(false);
  };

  // Campos dinámicos
  const toggleCampoTemp = (name: string) => {
    setCamposSeleccionadosTemp((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const eliminarCamposActivos = (name: string) => {
    setCamposSeleccionados((prev) => prev.filter((n) => n !== name));
    setValores((prev) => {
      const copy = { ...prev };
      delete copy[name as keyof BNegocios];
      return copy;
    });
  };

  // Guardar negocio en Dexie
  const guardarNegocio = async () => {
    if (!valores.nombre_negocio || !valores.tipo_negocio) {
      alert("Debes completar los campos obligatorios");
      return;
    }

    const negocioAGuardar: BNegocios = {
      nombre_negocio: valores.nombre_negocio,
      tipo_negocio: valores.tipo_negocio,
      ...valores,
    };

    try {
      // Guardar o actualizar
      if (negocioEditarIndex !== null) {
        const negocio = negociosGuardados[negocioEditarIndex];
        if (negocio.id_negocio !== undefined) {
          const updatePayload: Partial<BNegocios> = { ...negocioAGuardar };
          delete updatePayload.id_negocio;

          // Actualizar Dexie
          await db.bnegocios.update(negocio.id_negocio, updatePayload);

          // Sincronizar con backend
          syncUpdateNegocio({
            ...negocioAGuardar,
            id_negocio: negocio.id_negocio,
          });
        }
      } else {
        // Insertar en Dexie
        const id = await db.bnegocios.add(negocioAGuardar);

        // Insertar en backend con idDexie
        syncInsertNegocio({ ...negocioAGuardar, id_negocio: id }, id);
      }

      // Actualizar lista local
      const all = await db.bnegocios.toArray();
      setNegociosGuardados(all);

      // Actualizar detalle si venías de allí
      if (editarDesdeDetalle && negocioTemporal) {
        const negocioActualizado = all.find(
          (n) => n.id_negocio === negocioTemporal.id_negocio
        );
        if (negocioActualizado) {
          setNegocioSeleccionado(negocioActualizado);
          setOpenDetalleModal(true);
        }
      }

      // Reset de estados
      setValores({ nombre_negocio: "", tipo_negocio: "" });
      setCamposSeleccionados([]);
      setNegocioEditarIndex(null);
      setEditarDesdeDetalle(false);
      setNegocioTemporal(null);
      handleClose();
    } catch (err) {
      console.error("Error guardando negocio:", err);
      alert("Ocurrió un error al guardar el negocio");
    }
  };

  const abrirNuevoFormulario = () => {
    setValores({ nombre_negocio: "", tipo_negocio: "" });
    setCamposSeleccionados([]);
    setNegocioEditarIndex(null);
    setEditarDesdeDetalle(false);
    handleOpen();
  };

  const handleEditarNegocio = (index: number) => {
    const negocio = negociosGuardados[index];
    if (!negocio) return;
    setValores({ ...negocio });
    setCamposSeleccionados(
      Object.keys(negocio).filter(
        (k) =>
          k !== "nombre_negocio" && k !== "tipo_negocio" && k !== "id_negocio"
      )
    );
    setNegocioEditarIndex(index);
    handleCloseDetalle();
    handleOpen();
  };

  const [negocioTemporal, setNegocioTemporal] = useState<BNegocios | null>(
    null
  );

  const handleEditarNegocioDesdeDetalle = (index: number) => {
    const negocio = negociosGuardados[index];
    setNegocioTemporal(negocio); // lo guardas antes de cerrar el detalle
    setEditarDesdeDetalle(true);
    handleEditarNegocio(index); // cierra el detalle y abre el modal de edición
  };

  const handleEliminarClick = (index: number) => {
    const negocio = negociosGuardados[index];
    setConfirmarEliminar({
      open: true,
      index,
      nombre_negocio: negocio?.nombre_negocio || "",
    });
  };

  const handleCancelarEliminar = () =>
    setConfirmarEliminar({ open: false, index: null });

  const handleConfirmarEliminar = async () => {
    if (confirmarEliminar.index !== null) {
      const negocio = negociosGuardados[confirmarEliminar.index];
      if (negocio.id_negocio !== undefined) {
        try {
          // Eliminar de Dexie
          await db.bnegocios.delete(negocio.id_negocio);

          // Sincronizar con Supabase
          syncDeleteNegocio(negocio);

          // Actualizar lista local
          setNegociosGuardados((prev) =>
            prev.filter((_, i) => i !== confirmarEliminar.index)
          );
        } catch (err) {
          console.error("Error eliminando negocio:", err);
          alert("Ocurrió un error al eliminar el negocio");
        }
      }
    }
    setConfirmarEliminar({ open: false, index: null });
  };

  return (
    <>
      {/* Botón abrir formulario */}
      <IconButton
        color="primary"
        onClick={abrirNuevoFormulario}
        style={{
          position: "fixed",
          bottom: 100,
          right: 20,
          width: 50,
          height: 50,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #1D4ED8 0%, #7E22CE 100%)",
          color: "white",
          boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
          zIndex: 1000,
        }}
      >
        <AddIcon style={{ fontSize: 30 }} />
      </IconButton>

      {/* Lista de negocios */}
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          mt: 9,
          maxHeight: "calc(100vh - 120px)",
          overflowY: "auto",
          paddingBottom: 18,
        }}
      >
        {negociosGuardados.map((negocio, index) => (
          <Card
            key={negocio.id_negocio}
            sx={{
              cursor: "pointer",
              position: "relative",
            }}
            onClick={() => handleOpenDetalle(negocio)}
          >
            <CardContent>
              <Typography variant="h6">{negocio.nombre_negocio}</Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {negocio.tipo_negocio}
              </Typography>
            </CardContent>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleEliminarClick(index);
              }}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "error.main",
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Card>
        ))}
      </Box>

      {/* Modal detalle */}
      <Dialog
        open={openDetalleModal}
        onClose={handleCloseDetalle}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3,
            padding: 0,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Detalles
          </Typography>

          <Box>
            {/* Botón Editar */}
            {negocioSeleccionado && (
              <IconButton
                onClick={() => {
                  const index = negociosGuardados.findIndex(
                    (n) => n.id_negocio === negocioSeleccionado?.id_negocio
                  );
                  if (index !== -1) handleEditarNegocioDesdeDetalle(index);
                }}
                sx={{ color: "white", mr: 1 }}
              >
                <EditIcon />
              </IconButton>
            )}

            {/* Botón Cerrar */}
            <IconButton onClick={handleCloseDetalle} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          {negocioSeleccionado &&
            Object.keys(negocioSeleccionado).map((campo) => (
              <Box
                key={campo}
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2" color="text.secondary">
                  {campo.replaceAll("_", " ")}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {negocioSeleccionado[campo as keyof BNegocios]}
                </Typography>
              </Box>
            ))}
        </DialogContent>
      </Dialog>

      {/* Confirmar eliminación */}
      <Dialog open={confirmarEliminar.open} onClose={handleCancelarEliminar}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de eliminar el negocio{" "}
          <strong>{confirmarEliminar.nombre_negocio}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelarEliminar}>Cancelar</Button>
          <Button onClick={handleConfirmarEliminar} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal principal */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3,
            padding: 0,
            maxHeight: "85vh",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
          },
        }}
      >
        {/* Header con AddIcon para abrir submodal */}
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            fontSize: "1.5rem",
            fontWeight: 600,
          }}
        >
          {negocioEditarIndex !== null ? "Editar negocio" : "Nuevo Formulario"}

          <IconButton
            onClick={handleOpenSubModal}
            sx={{
              color: "white",
              backgroundColor: "rgba(255,255,255,0.2)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.3)",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <AddIcon />
          </IconButton>
        </DialogTitle>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

        {/* Contenido */}
        <DialogContent
          dividers
          sx={{ overflowY: "auto", padding: 3, backgroundColor: "#f8fafc" }}
        >
          <TextField
            label="Nombre del negocio"
            name="nombre_negocio"
            value={valores.nombre_negocio || ""}
            onChange={(e) =>
              setValores((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
            fullWidth
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "white",
                "&:hover fieldset": { borderColor: "#667eea" },
                "&.Mui-focused fieldset": {
                  borderColor: "#667eea",
                  borderWidth: 2,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#667eea" },
            }}
          />

          <TextField
            label="Tipo de negocio"
            name="tipo_negocio"
            value={valores.tipo_negocio || ""}
            onChange={(e) =>
              setValores((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
            fullWidth
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "white",
                "&:hover fieldset": { borderColor: "#667eea" },
                "&.Mui-focused fieldset": {
                  borderColor: "#667eea",
                  borderWidth: 2,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#667eea" },
            }}
          />

          {/* Campos dinámicos */}
          {camposSeleccionados.length > 0 && (
            <>
              <Divider
                sx={{
                  my: 3,
                  borderColor: "#e2e8f0",
                  "&::before, &::after": { borderColor: "#e2e8f0" },
                }}
              />
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 2,
                  color: "#4a5568",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <span>📋</span> Campos personalizados:
              </Typography>

              {camposSeleccionados.map((campo) => {
                const control = formulariosDisponibles.find(
                  (f) => f.name === campo
                );
                if (!control) return null;

                // Campo de tipo select
                if (control.type === "select") {
                  return (
                    <Box
                      key={campo}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1,
                        mb: 2,
                        width: "100%",
                      }}
                    >
                      <SelectField
                        control={control as ISelect}
                        value={valores[control.name as keyof BNegocios] || ""}
                        onChange={(v) =>
                          setValores((prev) => ({
                            ...prev,
                            [control.name as keyof BNegocios]: v,
                          }))
                        }
                      />
                      <IconButton
                        onClick={() => eliminarCamposActivos(campo)}
                        color="error"
                        size="small"
                        sx={{ minWidth: "auto", padding: 2, color: "#c53030" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  );
                }

                // Otros tipos de campos
                return (
                  <Box
                    key={campo}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        flexGrow: 1,
                        width: "100%",
                        "& > *": { borderRadius: 2 },
                      }}
                    >
                      <CampoItem
                        campo={control}
                        valor={valores[control.name as keyof BNegocios]}
                        onChange={(v) =>
                          setValores((prev) => ({
                            ...prev,
                            [control.name as keyof BNegocios]: v,
                          }))
                        }
                        onDelete={() => eliminarCamposActivos(campo)}
                        maxDate={dayjs()}
                      />
                    </Box>
                  </Box>
                );
              })}
            </>
          )}
        </DialogContent>

        {/* Footer */}
        <DialogActions
          sx={{
            padding: 3,
            backgroundColor: "white",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{
              borderRadius: 2,
              paddingX: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
              },
              transition: "all 0.3s ease",
              fontWeight: 600,
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={guardarNegocio}
            variant="contained"
            sx={{
              borderRadius: 2,
              paddingX: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
              },
              transition: "all 0.3s ease",
              fontWeight: 600,
            }}
          >
            {negocioEditarIndex !== null ? "Actualizar" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* SubModal */}
      <Dialog
        open={openSubModal}
        onClose={handleCloseSubModal}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
      >
        {/* Header mejorado */}
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",

            color: "white",
            py: 2,
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          Formulario Personalizado
        </DialogTitle>

        <Divider />

        {/* Contenido mejorado */}
        <DialogContent sx={{ py: 3, maxHeight: "400px", overflowY: "auto" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {formulariosDisponibles.map((field) => (
              <Box
                key={field.name}
                component="label"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1.5,
                  borderRadius: 1,
                  border: "1px solid #e0e0e0",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  backgroundColor: camposSeleccionados.includes(field.name)
                    ? "#e8eaf6"
                    : "white",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    borderColor: "#2023ecd2",
                  },
                }}
              >
                <input
                  type="checkbox"
                  checked={camposSeleccionadosTemp.includes(field.name)}
                  onChange={() => toggleCampoTemp(field.name)}
                  id={field.name}
                  style={{
                    width: "18px",
                    height: "18px",
                    accentColor: "#2023ecd2",
                    marginRight: 12,
                    cursor: "pointer",
                  }}
                />
                <span style={{ fontWeight: 500, color: "#333", flex: 1 }}>
                  {field.label}
                </span>
              </Box>
            ))}
          </Box>
        </DialogContent>

        {/* Footer mejorado */}
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#f8f9fa",
            py: 2,
            px: 3,
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Button
            onClick={() => setOpenSubModal(false)}
            variant="contained"
            sx={{
              borderRadius: 2,
              paddingX: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
              },
              transition: "all 0.3s ease",
              fontWeight: 600,
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              setCamposSeleccionados(camposSeleccionadosTemp);

              // Inicializar valores vacíos para los nuevos campos
              setValores((prev) => {
                const nuevos = { ...prev };
                camposSeleccionadosTemp.forEach((campo) => {
                  if (!(campo in nuevos)) nuevos[campo as keyof BNegocios] = "";
                });
                return nuevos;
              });

              setOpenSubModal(false);
            }}
            variant="contained"
            sx={{
              borderRadius: 2,
              paddingX: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
              },
              transition: "all 0.3s ease",
              fontWeight: 600,
            }}
          >
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
