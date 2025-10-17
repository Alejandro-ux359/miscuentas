import React, { useEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { db, Movimiento, Tasa } from "../../bdDexie";
import "../home/Home.css";
import { fetchTasaToque } from "../../servicios/Api";

// Función para detectar la moneda de cada movimiento
const detectarMoneda = (mov: Movimiento): string => {
  if (mov.moneda) return mov.moneda;
  const money = mov.moneda?.toUpperCase() || "";
  if (money.includes("USD")) return "USD";
  if (money.includes("EUR")) return "EUR";
  if (money.includes("MLC")) return "MLC";
  if (money.includes("CUP")) return "CUP";
  return "CUP";
};

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Hogar" | "Negocios">("Hogar");
  const [monedas, setMonedas] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [totales, setTotales] = useState<Record<string, number>>({});
  const [tasas, setTasas] = useState<Tasa[]>([]);
  const [tasaActual, setTasaActual] = useState<Tasa | null>(null);

  // mostrar la tasa de cambio del toque

  useEffect(() => {
    const obtenerTasas = async () => {
      const data = await fetchTasaToque();
       console.log("Datos de la API:", data)
      setTasas(data);
      if (data.length > 0) setTasaActual(data[0]); // Mostrar la primera tasa
    };

    obtenerTasas();
  }, []);

  // Calcular totales de cada moneda
  useEffect(() => {
    const calcularTotales = async () => {
      const movimientos: Movimiento[] = await db.movimientos.toArray();
      const resumen: Record<string, number> = {};

      movimientos.forEach((mov) => {
        const moneda = detectarMoneda(mov); // ✅ Agrupar por moneda
        if (!resumen[moneda]) resumen[moneda] = 0;
        if (mov.tipo === "Ingreso") resumen[moneda] += mov.monto;
        if (mov.tipo === "Gasto") resumen[moneda] -= mov.monto;
      });

      setTotales(resumen);
      setMonedas(Object.keys(resumen));
      if (
        Object.keys(resumen).length > 0 &&
        index >= Object.keys(resumen).length
      ) {
        setIndex(0); // Ajustar índice si la moneda actual desaparece
      }
    };

    calcularTotales();
  }, []);

  // Cambiar de moneda con el botón
  const handleNext = () => {
    setIndex((prev) => (monedas.length ? (prev + 1) % monedas.length : 0));
  };

  const handlePrev = () => {
    setIndex((prev) =>
      monedas.length ? (prev - 1 + monedas.length) % monedas.length : 0
    );
  };

  const monedaActual = monedas[index] || "CUP";
  const totalActual = totales[monedaActual] || 0;

  return (
    <div className="dashboard">
      {/* Pestañas */}
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
          {/* Tarjeta de total */}
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

          {/* Puntos indicadores */}
          <div className="dots">
            {monedas.map((_, i) => (
              <div
                key={i}
                className={`dot ${i === index ? "active" : ""}`}
              ></div>
            ))}
          </div>
          {tasaActual && (
            <div className="tasa-card">
              <h3>Tasa de Cambio (TOQUE)</h3>
              <p>
                {tasaActual.codigo} - Compra: {tasaActual.compras_tasa} | Venta:{" "}
                {tasaActual.ventas_tasa}
              </p>
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
