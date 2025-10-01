import { useState } from "react";
import "../ingresosGastos/IngresosGastos.css";

function IngresosGastos() {
  const [openModal, setOpenModal] = useState(false);
  const [tipo, setTipo] = useState("");
  const [activeTab, setActiveTab] = useState("Ingresos"); // pestaña activa

  const abrirModal = (tipoForm: string) => {
    setTipo(tipoForm);
    setOpenModal(true);
  };

  const cerrarModal = () => {
    setOpenModal(false);
  };

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

      {/* Sección visible según pestaña */}
      <div className="contenedor-principal">
        {activeTab === "Ingresos" && (
          <section className="seccion ingresos">
            {/* Botón flotante */}
            <button
              className="btn-flotante"
              onClick={() => abrirModal("Ingreso")}
            >
              +
            </button>
          </section>
        )}

        {activeTab === "Gastos" && (
          <section className="seccion gastos">
            {/* Botón flotante */}
            <button
              className="btn-flotante"
              onClick={() => abrirModal("Gasto")}
            >
              +
            </button>
          </section>
        )}
      </div>

      {/* Modal */}
      {openModal && (
        <div className="modal">
          <div className="modal-contenido">
            <h3>Nuevo {tipo}</h3>
            <form>
              <label>Categoría:</label>
              <select name="categoria">
                <option value="salario">Salario</option>
                <option value="ventas">Ventas</option>
                <option value="regalia">Regalía</option>
                <option value="inversion">Inversión</option>
                <option value="reenbolso">Reembolso</option>
                <option value="otro">Otro</option>
              </select>

              <label>Monto:</label>
              <input type="number" name="monto" />

              <label className="paymentMethod">Elige un método de pago:</label>
              <select name="paymentMethod" id="paymentMethod">
                <optgroup label="Efectivo">
                  <option value="cash">Efectivo</option>
                  <option value="cod">Contra entrega (Cash on Delivery)</option>
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
              <input type="date" name="fecha" />

              <label>Cuenta:</label>
              <input type="text" name="cuenta" />

              <div className="acciones">
                <button type="button" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="button">Aplicar</button>
                <button type="submit">Aceptar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default IngresosGastos;
