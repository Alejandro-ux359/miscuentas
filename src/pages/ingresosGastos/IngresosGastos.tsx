import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  IconButton,
  Button,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import GenericForm from "../../components/GenericForms";
import { useLiveQuery } from "dexie-react-hooks";

import {
  db,
  Movimiento,
  syncInsertMovimiento,
  syncUpdateMovimiento,
  syncDeleteMovimiento,
} from "../../bdDexie";
import { ingresosGastos } from "./FormIngresosGastos";
import "./IngresosGastos.css";

const MovimientoItem = React.memo(({ item, onEdit, onDelete }: any) => {
  // Formatear monto con $ y comas
  const formattedMonto = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(item.monto || 0);

  return (
    <div className="item-movimiento">
      <div className="info">
        <strong>{item.categoria}</strong> - {formattedMonto} {item.moneda} -{" "}
        {item.metodo} - {item.fecha}
      </div>
      <IconButton onClick={() => onEdit(item.tipo, item)}>
        <EditIcon color="primary" />
      </IconButton>
      <IconButton onClick={() => onDelete(item)}>
        <DeleteIcon color="error" />
      </IconButton>
    </div>
  );
});

export default function IngresosGastos() {
  const [activeTab, setActiveTab] = useState<"Ingresos" | "Gastos">("Ingresos");
  const [openModal, setOpenModal] = useState(false);
  const [editando, setEditando] = useState<Movimiento | null>(null);
  const [tipo, setTipo] = useState<"Ingreso" | "Gasto">("Ingreso");

  const [isMobile, setIsMobile] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileTipoSelection, setMobileTipoSelection] = useState({
    Ingreso: true,
    Gasto: true,
  });
  const [catOptions, setCatOptions] = useState<Record<string, boolean>>({});
  const [metOptions, setMetOptions] = useState<Record<string, boolean>>({});
  const [mndOptions, setMndOptions] = useState<Record<string, boolean>>({});
  const [formValues, setFormValues] = useState<any>({});

  // --- Detectar móvil ---
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 992);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Cargar movimientos en tiempo real desde Dexie ---
  const data =
    useLiveQuery(async () => {
      const movs = await db.movimientos.toArray();
      return movs.sort((a, b) => (a.fecha > b.fecha ? -1 : 1));
    }, []) ?? [];

  // --- Sincronizar pestaña con filtro móvil ---
  useEffect(() => {
    setMobileTipoSelection({
      Ingreso: activeTab === "Ingresos",
      Gasto: activeTab === "Gastos",
    });
  }, [activeTab]);

  // --- Modal ---
  const abrirModal = useCallback(
    (t: "Ingreso" | "Gasto", item?: Movimiento) => {
      setTipo(t);
      setEditando(item ?? null);
      setOpenModal(true);
    },
    []
  );

  const cerrarModal = useCallback(() => {
    setOpenModal(false);
    setEditando(null);
  }, []);

  // --- Guardar / Actualizar ---
  const handleSubmit = useCallback(
    async (values: any) => {
      const nuevo: Movimiento = {
        categoria: values.categoria || [""],
        monto: Number(values.monto) || 0,
        metodo: values.metodo || [""],
        fecha: values.fecha || new Date().toISOString().split("T")[0],
        moneda: values.moneda || [""],
        tipo,
      };

      if (editando && editando.id !== undefined) {
        await db.movimientos.update(editando.id, nuevo);
        syncUpdateMovimiento({ ...editando, ...nuevo });
      } else {
        const idDexie = await db.movimientos.add(nuevo);
        syncInsertMovimiento(nuevo, idDexie);
      }
      cerrarModal();
    },
    [editando, tipo, cerrarModal]
  );

  // --- Eliminar ---
  const handleDelete = useCallback(async (item: Movimiento) => {
    if (!item.id || !confirm("¿Eliminar este registro?")) return;
    await db.movimientos.delete(item.id);
    syncDeleteMovimiento(item);
  }, []);

  // --- Filtros móviles ---
  const toggleMobileTipo = useCallback(
    (t: "Ingreso" | "Gasto") =>
      setMobileTipoSelection((prev) => ({ ...prev, [t]: !prev[t] })),
    []
  );
  const toggleCat = useCallback(
    (k: string) => setCatOptions((prev) => ({ ...prev, [k]: !prev[k] })),
    []
  );
  const toggleMet = useCallback(
    (k: string) => setMetOptions((prev) => ({ ...prev, [k]: !prev[k] })),
    []
  );
  const toggleMnd = useCallback(
    (k: string) => setMndOptions((prev) => ({ ...prev, [k]: !prev[k] })),
    []
  );
  const resetMobileFilters = useCallback(() => {
    setMobileTipoSelection({ Ingreso: true, Gasto: true });
    const reset = (prev: Record<string, boolean>) =>
      Object.keys(prev).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setCatOptions((prev) => reset(prev));
    setMetOptions((prev) => reset(prev));
    setMndOptions((prev) => reset(prev));
  }, []);

  // --- Filtros ---
  const filtros = useMemo(
    () => ({
      tipo: isMobile
        ? mobileTipoSelection
        : { [activeTab === "Ingresos" ? "Ingreso" : "Gasto"]: true },
      cat: catOptions,
      met: metOptions,
      mnd: mndOptions,
    }),
    [
      activeTab,
      isMobile,
      mobileTipoSelection,
      catOptions,
      metOptions,
      mndOptions,
    ]
  );

  const filtrados = useMemo(
    () =>
      data.filter(
        (item) =>
          filtros.tipo[item.tipo] &&
          (filtros.cat[item.categoria || "Otro"] ?? true) &&
          (filtros.met[item.metodo || "Otro"] ?? true) &&
          (filtros.mnd[item.moneda || "Otro"] ?? true)
      ),
    [data, filtros]
  );

  return (
    <div className="ingresos-gastos-container">
      {/* Tabs fijos */}
      <div className="tabs">
        <button
          className={activeTab === "Ingresos" ? "tab active" : "tab"}
          onClick={() => setActiveTab("Ingresos")}
          style={{
            marginTop: 45,
            position: "fixed",
            top: 70,
            left: "10%",
            width: "35%",
            padding: "14px 0",
            backgroundColor: activeTab === "Ingresos" ? "#1000eb" : "#ccc",
            color: activeTab === "Ingresos" ? "#fff" : "#000",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 16,
            zIndex: 1000,
          }}
        >
          Ingresos
        </button>
        <button
          className={activeTab === "Gastos" ? "tab active" : "tab"}
          onClick={() => setActiveTab("Gastos")}
          style={{
            marginTop: 45,
            position: "fixed",
            top: 70,
            left: "55%",
            width: "35%",
            padding: "14px 0",
            backgroundColor: activeTab === "Gastos" ? "#1000eb" : "#ccc",
            color: activeTab === "Gastos" ? "#fff" : "#000",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 16,
            zIndex: 1000,
          }}
        >
          Gastos
        </button>
      </div>

      {/* Botón flotante */}
      <IconButton
        color="primary"
        onClick={() =>
          abrirModal(activeTab === "Ingresos" ? "Ingreso" : "Gasto")
        }
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

      {/* Lista */}
      <div className="lista-scrollable">
        <div className="lista-movimientos">
          {filtrados.length ? (
            filtrados.map((item) => (
              <MovimientoItem
                key={item.id}
                item={item}
                onEdit={abrirModal}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="no-datos">No hay datos registrados</div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Dialog open={openModal} onClose={cerrarModal} fullWidth>
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
          {editando ? `Editar ${tipo}` : `Nuevo ${tipo}`}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <GenericForm
            title=""
            controls={ingresosGastos}
            values={editando ?? {}}
            submitLabel={editando ? "Actualizar" : "Guardar"}
            onChange={setFormValues}
            onSubmit={() => handleSubmit(formValues)}
            onCancel={cerrarModal}
          />
        </DialogContent>
        <DialogActions
          sx={{
            padding: 3,
            backgroundColor: "white",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={cerrarModal}
            sx={{
              borderRadius: 2,
              justifyContent: "center",
              paddingX: 3,
              
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSubmit(formValues)}
            sx={{
              borderRadius: 2,
              justifyContent: "center",
              
              paddingX: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
              },
            }}
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
