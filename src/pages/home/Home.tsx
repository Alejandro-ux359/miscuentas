import React, { useEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { db, Movimiento, Tasa } from "../../bdDexie";
import "../home/Home.css";

const detectarMoneda = (mov: Movimiento): string =>
  mov.moneda ? mov.moneda.toUpperCase() : "CUP";

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Hogar" | "Negocios">("Hogar");
  const [monedas, setMonedas] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [totales, setTotales] = useState<Record<string, number>>({});
  const [tasas, setTasas] = useState<Tasa[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Traer tasas del backend y sincronizar con localStorage
 useEffect(() => {
  let cancelado = false;

  const fetchTasas = async () => {
    setCargando(true);

    try {
      // 1️⃣ Cargar datos desde localStorage si existen
      const local = localStorage.getItem("tasas");
      if (local && !cancelado) {
        setTasas(JSON.parse(local));
      }

      // 2️⃣ Intentar actualizar desde el backend
      const res = await fetch("https://api-miscuentas.onrender.com/api/tasa");
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Datos inválidos del servidor");

      if (!cancelado) {
        setTasas(data); // Actualizar estado
        localStorage.setItem("tasas", JSON.stringify(data)); // Guardar localmente
      }
    } catch (err) {
      console.warn("⚠️ No se pudo actualizar desde el servidor, usando datos locales si existen.", err);
      // No sobreescribimos error si ya hay datos locales
    } finally {
      if (!cancelado) setCargando(false);
    }
  };

  fetchTasas();
  return () => { cancelado = true; };
}, []);



  // 🔹 Calcular totales por moneda
  useEffect(() => {
    const calcularTotales = async () => {
      const movimientos: Movimiento[] = await db.movimientos.toArray();
      const resumen: Record<string, number> = {};

      movimientos.forEach((mov) => {
        const moneda = detectarMoneda(mov);
        resumen[moneda] =
          (resumen[moneda] || 0) +
          (mov.tipo === "Ingreso" ? mov.monto : -mov.monto);
      });

      setTotales(resumen);
      setMonedas(Object.keys(resumen));
      if (index >= Object.keys(resumen).length) setIndex(0);
    };

    calcularTotales();
  }, [index]);

  const handleNext = () =>
    setIndex((prev) => (monedas.length ? (prev + 1) % monedas.length : 0));
  const handlePrev = () =>
    setIndex((prev) =>
      monedas.length ? (prev - 1 + monedas.length) % monedas.length : 0
    );

  const monedaActual = monedas[index] || "CUP";
  const totalActual = totales[monedaActual] || 0;

  return (
    <div className="dashboard">
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "Hogar" ? "active" : ""}`}
          onClick={() => setActiveTab("Hogar")}
        >
          Hogar
        </button>
        <button
          className={`tab-btn ${activeTab === "Negocios" ? "active" : ""}`}
          onClick={() => setActiveTab("Negocios")}
        >
          Negocios
        </button>
      </div>

      {activeTab === "Hogar" ? (
        <>
          <div className="total-card">
            <button className="arrow-btn left" onClick={handlePrev}>
              <ArrowBackIosIcon />
            </button>
            <div className="total-texto">
              <h2>Total {monedaActual}</h2>
              <p>${totalActual.toFixed(2)}</p>
            </div>
            <button className="arrow-btn right" onClick={handleNext}>
              <ArrowForwardIosIcon />
            </button>
          </div>

          <div className="dots">
            {monedas.map((_, i) => (
              <div key={i} className={`dot ${i === index ? "active" : ""}`} />
            ))}
          </div>

          {cargando && <p>🔄 Cargando tasas...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {!cargando && !error && tasas.length > 0 && (
            <div className="fondo-tabla-mercado">
            <div className="tabla-mercado">
              <h3>📊 Mercado informal</h3>
              <table>
                <thead>
                  <tr>
                    <th>Moneda</th>
                    <th>Compra</th>
                    <th>Venta</th>
                  </tr>
                </thead>
                <tbody>
                  {tasas.map((t, i) => (
                    <tr key={i}>
                      <td>{t.codigo}</td>
                      <td>{t.compras_tasa}</td>
                      <td>{t.ventas_tasa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
              
            </div>
          )}
        </>
      ) : (
        <div className="desarrollo-message">
          <h2>🚧 Disculpa</h2>
          <p>La sección de Negocios está en desarrollo.</p>
          <p>Gracias por tu paciencia 🙏</p>
        </div>
      )}
    </div>
  );
};

export default Home;
