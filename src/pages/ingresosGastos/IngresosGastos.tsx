import { useState, useEffect, JSX } from "react";
import "../ingresosGastos/IngresosGastos.css";
import GenericForm from "../../components/GenericForms";
import {
  db,
  Movimiento,
  syncDeleteMovimiento,
  syncInsertMovimiento,
  syncUpdateMovimiento,
} from "../../bdDexie";
import DeleteIcon from "@mui/icons-material/Delete";
import TuneIcon from "@mui/icons-material/Tune";
import EditIcon from "@mui/icons-material/Edit";
import { IGenericControls } from "../../components/controls.types";

function IngresosGastos(): JSX.Element {
  const [openModal, setOpenModal] = useState(false);
  const [tipo, setTipo] = useState<"Ingreso" | "Gasto">("Ingreso");
  const [activeTab, setActiveTab] = useState("Ingresos");
  const [datos, setDatos] = useState<Movimiento[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [editando, setEditando] = useState<Movimiento | null>(null);

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const [mobileTipoSelection, setMobileTipoSelection] = useState<
    Record<"Ingreso" | "Gasto", boolean>
  >({
    Ingreso: true,
    Gasto: true,
  });

  const [catOptions, setCatOptions] = useState<Record<string, boolean>>({});
  const [metOptions, setMetOptions] = useState<Record<string, boolean>>({});
  const [mndOptions, setMndOptions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 992);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const cargarDatos = async () => {
      const todos = await db.movimientos.toArray();
      setDatos(todos);
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    const makeOptions = (arr: string[], prev: Record<string, boolean>) => {
      const next = { ...prev };
      arr.forEach((k) => {
        const key = k || "Otro";
        if (!(key in next)) next[key] = true;
      });
      return next;
    };

    const cats = datos.map((d) => d.categoria || "Otro");
    const mets = datos.map((d) => d.metodo || "Otro");
    const mnds = datos.map((d) => d.moneda || "Otro");

    setCatOptions((prev) => makeOptions(cats, prev));
    setMetOptions((prev) => makeOptions(mets, prev));
    setMndOptions((prev) => makeOptions(mnds, prev));
  }, [datos]);

  useEffect(() => {
    const savedTipos = localStorage.getItem("mobileTipoSelection");
    if (savedTipos) {
      try {
        setMobileTipoSelection(JSON.parse(savedTipos));
      } catch {}
    }
    const savedFilters = localStorage.getItem("mobileFilters_v2");
    if (savedFilters) {
      try {
        const parsed = JSON.parse(savedFilters);
        if (parsed.catOptions) setCatOptions(parsed.catOptions);
        if (parsed.metOptions) setMetOptions(parsed.metOptions);
        if (parsed.mndOptions) setMndOptions(parsed.mndOptions);
      } catch {}
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "mobileTipoSelection",
        JSON.stringify(mobileTipoSelection)
      );
      localStorage.setItem(
        "mobileFilters_v2",
        JSON.stringify({
          catOptions,
          metOptions,
          mndOptions,
        })
      );
    } catch {}
  }, [mobileTipoSelection, catOptions, metOptions, mndOptions]);

  useEffect(() => {
    if (!isMobile) return;
    if (activeTab === "Ingresos") {
      setMobileTipoSelection({ Ingreso: true, Gasto: false });
    } else {
      setMobileTipoSelection({ Ingreso: false, Gasto: true });
    }
  }, [activeTab, isMobile]);

  const toggleMobileTipo = (t: "Ingreso" | "Gasto") =>
    setMobileTipoSelection((prev) => ({ ...prev, [t]: !prev[t] }));

  const toggleCat = (key: string) =>
    setCatOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleMet = (key: string) =>
    setMetOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleMnd = (key: string) =>
    setMndOptions((prev) => ({ ...prev, [key]: !prev[key] }));

  const resetMobileFilters = () => {
    setMobileTipoSelection({ Ingreso: true, Gasto: true });
    const reset = (prev: Record<string, boolean>) =>
      Object.keys(prev).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setCatOptions((p) => reset(p));
    setMetOptions((p) => reset(p));
    setMndOptions((p) => reset(p));
  };

  const abrirModal = (tipoForm: "Ingreso" | "Gasto", itemEdit?: Movimiento) => {
    setTipo(tipoForm);
    setEditando(itemEdit ?? null);
    setOpenModal(true);
  };

  const cerrarModal = () => {
    setOpenModal(false);
    setEditando(null);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const form = new FormData(e.target);

    const nuevo: Movimiento = {
      categoria: (form.get("categoria") as string) || "",
      monto: Number(form.get("monto")) || 0,
      metodo: (form.get("paymentMethod") as string) || "",
      fecha: (form.get("fecha") as string) || "",
      moneda: (form.get("moneda") as string) || "",
      tipo,
    };

    setGuardando(true);

    try {
      if (editando && editando.id !== undefined) {
        await db.movimientos.update(editando.id, nuevo);
        setDatos(await db.movimientos.toArray());
        cerrarModal();
        syncUpdateMovimiento(editando.id, nuevo);
      } else {
        const idDexie = await db.movimientos.add(nuevo);
        setDatos(await db.movimientos.toArray());
        cerrarModal();
        syncInsertMovimiento(nuevo, idDexie);
      }
    } catch (err) {
      console.error("Error guardando/actualizando:", err);
    } finally {
      setGuardando(false);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm("¿Eliminar este registro?")) return;
    try {
      await db.movimientos.delete(id);
      setDatos(await db.movimientos.toArray());
      syncDeleteMovimiento(id);
    } catch (err) {
      console.error("Error eliminando:", err);
    }
  };

  const handleEdit = (item: Movimiento) => abrirModal(item.tipo, item);

  const filtrados = datos
    .filter((item) => {
      if (isMobile) {
        if (!mobileTipoSelection[item.tipo]) return false;
        if (!catOptions[item.categoria || "Otro"]) return false;
        if (!metOptions[item.metodo || "Otro"]) return false;
        if (!mndOptions[item.moneda || "Otro"]) return false;
        return true;
      }
      return item.tipo === (activeTab === "Ingresos" ? "Ingreso" : "Gasto");
    })
    .filter((item) => {
      if (isMobile) return true;
      if (!busqueda.trim()) return true;
      const terminos = busqueda
        .toLowerCase()
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      return terminos.every((termino, index) => {
        if (index === 0) return item.categoria.toLowerCase().includes(termino);
        if (index === 1) return item.metodo.toLowerCase().includes(termino);
        if (index === 2) return item.moneda.toLowerCase().includes(termino);
        return true;
      });
    });

  const ingresosGastos: IGenericControls[] = [
    {
      type: "select",
      label: "Categoría",
      name: "categoria",
      checkValues: [
        { label: "Salario", value: "salario" },
        { label: "Ventas", value: "ventas" },
        { label: "Regalía", value: "regalia" },
        { label: "Inversión", value: "inversion" },
        { label: "Reembolso", value: "reembolso" },
        { label: "Otro", value: "otro" },
      ],
      
    },
    {
      type: "number",
      label: "Monto",
      name: "monto",
      format:"finance"
     
    },
    {
      type: "select",
      label: "Método de pago",
      name: "metodo",
      checkValues: [
        { label: "Efectivo", value: "efectivo" },
        { label: "Transfermóvil", value: "transfermovil" },
        { label: "EnZona", value: "enzona" },
        { label: "QvaPay", value: "qvapay" },
        { label: "TropiPay", value: "tropipay" },
      ],
     
    },
    {
      type: "date",
      label: "Fecha",
      name: "fecha",
      
    },
    {
      type: "select",
      label: "Moneda",
      name: "moneda",
      checkValues: [
        { label: "CUP", value: "CUP" },
        { label: "USD", value: "USD" },
        { label: "EUR", value: "EUR" },
        { label: "CAD", value: "CAD" },
        { label: "MXN", value: "MXN" },
      ],
      
    },
  ];

  return (
    <div className="pagina-ingresos-gastos">
      <nav className="contenedor">
        <button
          className={`nav-btn ${activeTab === "Ingresos" ? "activo" : ""}`}
          onClick={() => setActiveTab("Ingresos")}
        >
          Ingresos
        </button>
        <button
          className={`nav-btn ${activeTab === "Gastos" ? "activo" : ""}`}
          onClick={() => setActiveTab("Gastos")}
        >
          Gastos
        </button>
      </nav>

      {/* Filtro móvil */}
      {isMobile && (
        <div className="mobile-filter-row">
          <button
            className="filtro-btn"
            onClick={() => setMobileFilterOpen((v) => !v)}
          >
            <TuneIcon />
          </button>

          {mobileFilterOpen && (
            <div className="menu-filtro">
              <div className="menu-section">
                <div className="section-title">Tipo</div>
                <label>
                  <input
                    type="checkbox"
                    checked={mobileTipoSelection.Ingreso}
                    onChange={() => toggleMobileTipo("Ingreso")}
                  />
                  Ingresos
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={mobileTipoSelection.Gasto}
                    onChange={() => toggleMobileTipo("Gasto")}
                  />
                  Gastos
                </label>
              </div>

              <div className="menu-section">
                <div className="section-title">Categoría</div>
                <div className="options-scroll">
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
              </div>

              <div className="menu-section">
                <div className="section-title">Método</div>
                <div className="options-scroll">
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
              </div>

              <div className="menu-section">
                <div className="section-title">Moneda</div>
                <div className="options-scroll">
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
              </div>

              <div className="menu-actions">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                >
                  Cerrar
                </button>
                <button type="button" onClick={resetMobileFilters}>
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabla / Lista */}
      <div className="scroll-area">
        <div className="tabla-contenedor">
          {!isMobile ? (
            <table className="tabla-datos">
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Monto</th>
                  <th>Método</th>
                  <th>Moneda</th>
                  <th>
                    <input
                      type="text"
                      placeholder="Buscar... (cat, método, moneda)"
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="buscador"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length ? (
                  filtrados.map((item, i) => (
                    <tr key={item.id ?? i}>
                      <td>{item.categoria}</td>
                      <td>{item.monto}</td>
                      <td>{item.metodo}</td>
                      <td>{item.moneda}</td>
                      <td className="acciones-fila">
                        <EditIcon
                          className="icono-editar"
                          onClick={() => handleEdit(item)}
                        />
                        <DeleteIcon
                          className="icono-eliminar"
                          onClick={() => handleDelete(item.id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      style={{ textAlign: "center", padding: 20 }}
                    >
                      No hay datos registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <div className="lista-movimientos-mobile">
              {filtrados.length ? (
                filtrados.map((item, i) => (
                  <div className="mov-card" key={item.id ?? i}>
                    <div className="mov-info">
                      <div className="mov-top">
                        <strong>{item.categoria}</strong>
                        <span>
                          $ {item.monto} {item.moneda}
                        </span>
                      </div>
                      <div className="mov-bottom">
                        <small>{item.metodo}</small>
                        <small>{item.fecha}</small>
                      </div>
                    </div>
                    <div className="mov-acciones">
                      <button
                        className="icono-editar"
                        onClick={() => handleEdit(item)}
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="icono-eliminar"
                        onClick={() => handleDelete(item.id)}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="sin-datos">No hay datos registrados</div>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        className="btn-flotante"
        onClick={() =>
          abrirModal(activeTab === "Ingresos" ? "Ingreso" : "Gasto")
        }
      >
        +
      </button>

      {openModal && (
        <div className="modal">
          <div className="modal-contenido">
            <GenericForm
              title={editando ? `Editar ${tipo}` : `Nuevo ${tipo}`}
              controls={ingresosGastos} 
              values={editando ?? {}}
              submitLabel={editando ? "Actualizar" : "Guardar"}
              onSubmit={async (values) => {
                const nuevo: Movimiento = {
                  categoria: values.categoria || "",
                  monto: Number(values.monto) || 0,
                  metodo: values.metodo || "",
                  fecha: values.fecha || "",
                  moneda: values.moneda || "",
                  tipo,
                };

                setGuardando(true);
                try {
                  if (editando && editando.id !== undefined) {
                    await db.movimientos.update(editando.id, nuevo);
                    setDatos(await db.movimientos.toArray());
                    cerrarModal();
                    syncUpdateMovimiento(editando.id, nuevo);
                  } else {
                    const idDexie = await db.movimientos.add(nuevo);
                    setDatos(await db.movimientos.toArray());
                    cerrarModal();
                    syncInsertMovimiento(nuevo, idDexie);
                  }
                } catch (err) {
                  console.error("Error guardando/actualizando:", err);
                } finally {
                  setGuardando(false);
                }
              }}
              onCancel={cerrarModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default IngresosGastos;
