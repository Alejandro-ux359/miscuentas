import { useState, useEffect } from "react";
import "../ingresosGastos/IngresosGastos.css";
import { db, Movimiento } from "../../bdDexie";
import { supabase } from "../../supaBase";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function IngresosGastos() {
  const [openModal, setOpenModal] = useState(false);
  const [tipo, setTipo] = useState<"Ingreso" | "Gasto">("Ingreso");
  const [activeTab, setActiveTab] = useState("Ingresos");
  const [datos, setDatos] = useState<Movimiento[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      const todos = await db.movimientos.toArray();
      setDatos(todos);
    };
    cargarDatos();
  }, []);

  const abrirModal = (tipoForm: "Ingreso" | "Gasto") => {
    setTipo(tipoForm);
    setOpenModal(true);
  };

  const cerrarModal = () => setOpenModal(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const form = new FormData(e.target);

    const nuevo: Movimiento = {
      categoria: form.get("categoria") as string,
      monto: Number(form.get("monto")),
      metodo: form.get("paymentMethod") as string,
      cuenta: form.get("cuenta") as string,
      fecha: form.get("fecha") as string,
      tipo,
    };

    try {
      setGuardando(true);
      await db.movimientos.add(nuevo);
      const { error } = await supabase.from("movimientos").insert([nuevo]);
      if (error) console.error("Error guardando en Supabase:", error);

      const todos = await db.movimientos.toArray();
      setDatos(todos);
      cerrarModal();
    } finally {
      setGuardando(false);
    }
  };

  const handleDelete = async (id: number) => {
    await db.movimientos.delete(id);
    const { error } = await supabase.from("movimientos").delete().eq("id", id);
    if (error) console.error(error);
    const todos = await db.movimientos.toArray();
    setDatos(todos);
  };

  const handleEdit = (item: Movimiento) => {
    alert(`Editar: ${item.categoria}`);
  };

 const filtrados = datos
  .filter(item => item.tipo === (activeTab === "Ingresos" ? "Ingreso" : "Gasto"))
  .filter(item => {
    if (!busqueda.trim()) return true;

   
    const terminos = busqueda
      .toLowerCase()
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    
    return terminos.every((termino, index) => {
      if (index === 0) {
        return item.categoria.toLowerCase().includes(termino);
      } else if (index === 1) {
        return item.metodo.toLowerCase().includes(termino);
      } else if (index === 2) {
        return item.cuenta.toLowerCase().includes(termino);
      }
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
                  <tr key={i}>
                   
                    <td>{item.categoria}</td>
                    <td>{item.monto}</td>
                    <td>{item.metodo}</td>
                    <td>{item.cuenta}</td>
                    <td className="acciones-fila">
                      <EditIcon
                        className="icono-editar"
                        onClick={() => handleEdit(item)}
                      />
                      <DeleteIcon
                        className="icono-eliminar"
                        onClick={() => handleDelete(item.id!)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                    No hay datos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <button
          className="btn-flotante"
          onClick={() =>
            abrirModal(activeTab === "Ingresos" ? "Ingreso" : "Gasto")
          }
        >
          +
        </button>
      </div>

      {openModal && (
        <div className="modal">
          <div className="modal-contenido">
            <h3>Nuevo {tipo}</h3>
            <form onSubmit={handleSubmit}>
              <label>Categoría:</label>
              <select name="categoria" required>
                <option value="salario">Salario</option>
                <option value="ventas">Ventas</option>
                <option value="regalia">Regalía</option>
                <option value="inversion">Inversión</option>
                <option value="reenbolso">Reembolso</option>
                <option value="otro">Otro</option>
              </select>

              <label>Monto:</label>
              <input type="number" name="monto" required />

              <label>Método de pago:</label>
              <select name="paymentMethod" required>
                <optgroup label="Métodos en Pago">
                  <option value="transfermovil">Transfermóvil</option>
                  <option value="enzona">EnZona</option>
                </optgroup>
              </select>

              <label>Fecha:</label>
              <input type="date" name="fecha" required />

              <label>Cuenta:</label>
              <input type="text" name="cuenta" required />

              <div className="acciones">
                <button type="button" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" disabled={guardando}>
                  Guardar
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
