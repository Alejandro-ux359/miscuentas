import { useState } from "react";
import "../ingresosGastos/IngresosGastos.css";

function IngresosGastos() {
  const [openModal, setOpenModal] = useState(false);
  const [tipo, setTipo] = useState("");
  const [activeTab, setActiveTab] = useState("Ingresos");
  const [datos, setDatos] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");

  const abrirModal = (tipoForm: string) => {
    setTipo(tipoForm);
    setOpenModal(true);
  };

  const cerrarModal = () => setOpenModal(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const nuevo = {
      categoria: form.get("categoria"),
      monto: form.get("monto"),
      metodo: form.get("paymentMethod"),
      cuenta: form.get("cuenta"),
      fecha: form.get("fecha"),
      tipo,
    };
    setDatos([...datos, nuevo]);
    cerrarModal();
  };

  const filtrados = datos.filter((item) =>
    item.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      {/* Menú de navegación */}
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

      {/* Sección visible */}
      <div className="contenedor-principal">
        <div className="tabla-contenedor">
          <div className="tabla-header">
            <label>
              <input type="checkbox" />
            </label>
            <span className="tabla-subtitulo">Categoría</span>
            <span className="tabla-subtitulo">Monto</span>
            <span className="tabla-subtitulo">Método de pago</span>
            <span className="tabla-subtitulo">Cuenta</span>
            <input
              type="text"
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="buscador"
            />
          </div>
          <hr />

          {/* Tabla de datos */}
          {filtrados.length > 0 ? (
            <table className="tabla-datos">
              <tbody>
                {filtrados.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>{item.categoria}</td>
                    <td>{item.monto}</td>
                    <td>{item.metodo}</td>
                    <td>{item.cuenta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="sin-datos">No hay datos registrados</p>
          )}
        </div>

        {/* Botón flotante */}
        <button
          className="btn-flotante"
          onClick={() => abrirModal(activeTab === "Ingresos" ? "Ingreso" : "Gasto")}
        >
          +
        </button>
      </div>

      {/* Modal */}
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
              <input type="date" name="fecha" required />

              <label>Cuenta:</label>
              <input type="text" name="cuenta" required />

              <div className="acciones">
                <button type="button" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default IngresosGastos;
