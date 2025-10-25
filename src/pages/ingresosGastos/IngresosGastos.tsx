import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TuneIcon from "@mui/icons-material/Tune";
import GenericForm from "../../components/GenericForms";
import {
  db,
  Movimiento,
  syncInsertMovimiento,
  syncUpdateMovimiento,
  syncDeleteMovimiento,
} from "../../bdDexie";
import { ingresosGastos } from "./FormIngresosGastos";
import "./IngresosGastos.css";

// Item memoizado para evitar re-renders innecesarios
const MovimientoItem = React.memo(({ item, onEdit, onDelete }: any) => (
  <div className="item-movimiento">
    <div className="info">
      <strong>{item.categoria}</strong> - {item.monto} {item.moneda} -{" "}
      {item.metodo} - {item.fecha}
    </div>
    <IconButton onClick={() => onEdit(item.tipo, item)}>
      <EditIcon color="primary" />
    </IconButton>
    <IconButton onClick={() => onDelete(item)}>
      <DeleteIcon color="error" />
    </IconButton>
  </div>
));

export default function IngresosGastos() {
  const [activeTab, setActiveTab] = useState<"Ingresos" | "Gastos">("Ingresos");
  const [datos, setDatos] = useState<Movimiento[]>([]);
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

  // --- Detectar móvil ---
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 992);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Cargar datos ---
  const cargarDatos = useCallback(async () => {
    const lista = await db.movimientos.toArray();
    const cat: Record<string, boolean> = {};
    const met: Record<string, boolean> = {};
    const mnd: Record<string, boolean> = {};

    lista.forEach((d) => {
      cat[d.categoria || "Otro"] ??= true;
      met[d.metodo || "Otro"] ??= true;
      mnd[d.moneda || "Otro"] ??= true;
    });

    setDatos(lista);
    setCatOptions(cat);
    setMetOptions(met);
    setMndOptions(mnd);
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

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
        categoria: values.categoria || "",
        monto: Number(values.monto) || 0,
        metodo: values.metodo || "",
        fecha: values.fecha || "",
        moneda: values.moneda || "",
        tipo,
      };

      if (editando && editando.id !== undefined) {
        await db.movimientos.update(editando.id, nuevo);
        syncUpdateMovimiento({ ...editando, ...nuevo });
        setDatos((prev) =>
          prev.map((d) => (d.id === editando.id ? { ...d, ...nuevo } : d))
        );
      } else {
        const idDexie = await db.movimientos.add(nuevo);
        syncInsertMovimiento(nuevo, idDexie);
        setDatos((prev) => [...prev, { ...nuevo, id: idDexie }]);
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
    setDatos((prev) => prev.filter((d) => d.id !== item.id));
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

  // --- Filtrar datos ---
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
      datos.filter(
        (item) =>
          filtros.tipo[item.tipo] &&
          filtros.cat[item.categoria || "Otro"] &&
          filtros.met[item.metodo || "Otro"] &&
          filtros.mnd[item.moneda || "Otro"]
      ),
    [datos, filtros]
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

      {/* Filtro móvil */}
      {isMobile && (
        <div className="mobile-filters">
          <button
            className="color-filter"
            onClick={() => setMobileFilterOpen((v) => !v)}
          >
            <TuneIcon className="style-icon" />
          </button>

          {/* Modal de filtros */}
          <Dialog
            open={mobileFilterOpen}
            onClose={() => setMobileFilterOpen(false)}
            fullWidth
            maxWidth="xs"
            PaperProps={{
              style: {
                borderRadius: 16,
                padding: 16,
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            <DialogTitle>Filtros</DialogTitle>
            <Divider />
            <DialogContent
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              {/* Tipo */}
              <div>
                <strong>Tipo:</strong>
                <label>
                  <input
                    type="checkbox"
                    checked={mobileTipoSelection.Ingreso}
                    onChange={() => toggleMobileTipo("Ingreso")}
                  />
                  Ingreso
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={mobileTipoSelection.Gasto}
                    onChange={() => toggleMobileTipo("Gasto")}
                  />
                  Gasto
                </label>
              </div>
              {/* Categoría */}
              <div>
                <strong>Categoría:</strong>
                {Object.keys(catOptions).map((k) => (
                  <label key={k}>
                    <input
                      type="checkbox"
                      checked={!!catOptions[k]}
                      onChange={() => toggleCat(k)}
                    />
                    {k}
                  </label>
                ))}
              </div>
              {/* Método */}
              <div>
                <strong>Método:</strong>
                {Object.keys(metOptions).map((k) => (
                  <label key={k}>
                    <input
                      type="checkbox"
                      checked={!!metOptions[k]}
                      onChange={() => toggleMet(k)}
                    />
                    {k}
                  </label>
                ))}
              </div>
              {/* Moneda */}
              <div>
                <strong>Moneda:</strong>
                {Object.keys(mndOptions).map((k) => (
                  <label key={k}>
                    <input
                      type="checkbox"
                      checked={!!mndOptions[k]}
                      onChange={() => toggleMnd(k)}
                    />
                    {k}
                  </label>
                ))}
              </div>
            </DialogContent>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
                padding: 8,
              }}
            >
              <button
                onClick={() => setMobileFilterOpen(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "none",
                  backgroundColor: "#ccc",
                  color: "#000",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Cerrar
              </button>
              <button
                onClick={resetMobileFilters}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "none",
                  backgroundColor: "#1000eb",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Reset
              </button>
            </div>
          </Dialog>
        </div>
      )}

      {/* Lista scrollable */}
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
        <DialogTitle>
          {editando ? `Editar ${tipo}` : `Nuevo ${tipo}`}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <GenericForm
            title=""
            controls={ingresosGastos}
            values={editando ?? {}}
            submitLabel={editando ? "Actualizar" : "Guardar"}
            onSubmit={handleSubmit}
            onCancel={cerrarModal}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
