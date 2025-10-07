import { useState, useEffect, JSX } from "react";
import "../ingresosGastos/IngresosGastos.css";
import { db, Movimiento, syncDelete, syncInsert, syncUpdate } from "../../bdDexie";
import { supabase } from "../../supaBase";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function IngresosGastos(): JSX.Element {
  const [openModal, setOpenModal] = useState(false);
  const [tipo, setTipo] = useState<"Ingreso" | "Gasto">("Ingreso");
  const [activeTab, setActiveTab] = useState("Ingresos");
  const [datos, setDatos] = useState<Movimiento[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [editando, setEditando] = useState<Movimiento | null>(null);

  // 🔹 Cargar datos locales al inicio
  useEffect(() => {
    const cargarDatos = async () => {
      const todos = await db.movimientos.toArray();
      setDatos(todos);
    };
    cargarDatos();
  }, []);

  const abrirModal = (tipoForm: "Ingreso" | "Gasto", itemEdit?: Movimiento) => {
    setTipo(tipoForm);
    if (itemEdit) setEditando(itemEdit);
    else setEditando(null);
    setOpenModal(true);
  };

  const cerrarModal = () => {
    setOpenModal(false);
    setEditando(null);
  };

  // 🔹 Guardar o actualizar registro
 // Guardar o actualizar
const handleSubmit = async (e: any) => {
  e.preventDefault();
  const form = new FormData(e.target);

  const nuevo: Movimiento = {
    categoria: (form.get("categoria") as string) || "",
    monto: Number(form.get("monto")) || 0,
    metodo: (form.get("paymentMethod") as string) || "",
    cuenta: (form.get("cuenta") as string) || "",
    fecha: (form.get("fecha") as string) || "",
    tipo,
  };

  setGuardando(true);

  try {
    if (editando && editando.id !== undefined) {
      await db.movimientos.update(editando.id, nuevo);
      setDatos(await db.movimientos.toArray());
      cerrarModal();

      // Sincronizar con Supabase
      syncUpdate(editando.id, nuevo);

    } else {
      const idDexie = await db.movimientos.add(nuevo);
      setDatos(await db.movimientos.toArray());
      cerrarModal();

      // Sincronizar con Supabase
      syncInsert(nuevo, idDexie);
    }
  } catch (err) {
    console.error("Error guardando/actualizando:", err);
  } finally {
    setGuardando(false);
  }
};


  // 🔹 Eliminar registro (sincronizado Dexie + Supabase)
 const handleDelete = async (id?: number) => {
  if (id === undefined) return;
  if (!confirm("¿Eliminar este registro?")) return;

  try {
    await db.movimientos.delete(id);
    setDatos(await db.movimientos.toArray());

    // Sincronizar con Supabase
    syncDelete(id);
  } catch (err) {
    console.error("Error eliminando:", err);
  }
};


  const handleEdit = (item: Movimiento) => abrirModal(item.tipo, item);

  // 🔹 Filtro de búsqueda
  const filtrados = datos
    .filter((item) => item.tipo === (activeTab === "Ingresos" ? "Ingreso" : "Gasto"))
    .filter((item) => {
      if (!busqueda.trim()) return true;
      const terminos = busqueda
        .toLowerCase()
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      return terminos.every((termino, index) => {
        if (index === 0) return item.categoria.toLowerCase().includes(termino);
        if (index === 1) return item.metodo.toLowerCase().includes(termino);
        if (index === 2) return item.cuenta.toLowerCase().includes(termino);
        return true;
      });
    });

  return (
    <>
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

      <div className="contenedor-principal">
        <div className="tabla-contenedor">
          <table className="tabla-datos">
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Monto</th>
                <th>Método</th>
                <th>Cuenta</th>
                <th>
                  <input
                    type="text"
                    placeholder="Buscar... (separa términos con coma)"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="buscador"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length > 0 ? (
                filtrados.map((item, i) => (
                  <tr key={item.id ?? i}>
                    <td>{item.categoria}</td>
                    <td>{item.monto}</td>
                    <td>{item.metodo}</td>
                    <td>{item.cuenta}</td>
                    <td className="acciones-fila">
                      <EditIcon
                        className="icono-editar"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEdit(item)}
                      />
                      <DeleteIcon
                        className="icono-eliminar"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDelete(item.id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 20 }}>
                    No hay datos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <button
          className="btn-flotante"
          onClick={() => abrirModal(activeTab === "Ingresos" ? "Ingreso" : "Gasto")}
        >
          +
        </button>
      </div>

      {openModal && (
        <div className="modal">
          <div className="modal-contenido">
            <h3>{editando ? `Editar ${tipo}` : `Nuevo ${tipo}`}</h3>
            <form onSubmit={handleSubmit}>
              <label>Categoría:</label>
              <select name="categoria" required defaultValue={editando?.categoria ?? ""}>
                <option value="">Seleccione...</option>
                <option value="salario">Salario</option>
                <option value="ventas">Ventas</option>
                <option value="regalia">Regalía</option>
                <option value="inversion">Inversión</option>
                <option value="reenbolso">Reembolso</option>
                <option value="otro">Otro</option>
              </select>

              <label>Monto:</label>
              <input type="number" name="monto" required defaultValue={editando?.monto ?? ""} />

              <label>Método de pago:</label>
              <select name="paymentMethod" required defaultValue={editando?.metodo ?? ""}>
                <optgroup label="Efectivo">
                  <option value="cash">Efectivo</option>
                  <option value="cod">Contra entrega</option>
                </optgroup>
                <optgroup label="Tarjetas bancarias">
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                  <option value="amex">American Express</option>
                </optgroup>
                <optgroup label="Criptomonedas">
                  <option value="btc">Bitcoin</option>
                  <option value="eth">Ethereum</option>
                </optgroup>
                <optgroup label="Métodos en Cuba">
                  <option value="transfermovil">Transfermóvil</option>
                  <option value="enzona">EnZona</option>
                  <option value="qvapay">QvaPay</option>
                </optgroup>
              </select>

              <label>Fecha:</label>
              <input type="date" name="fecha" required defaultValue={editando?.fecha ?? ""} />

              <label>Cuenta:</label>
              <input type="text" name="cuenta" required defaultValue={editando?.cuenta ?? ""} />

              <div className="acciones">
                <button type="button" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" disabled={guardando}>
                  {guardando ? "Guardando..." : editando ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default IngresosGastos;
