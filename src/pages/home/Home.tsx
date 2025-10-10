import React, { useEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { db, Movimiento } from "../../bdDexie";
import "../home/Home.css";

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Hogar" | "Negocios">("Hogar");
  const [monedas, setMonedas] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [totales, setTotales] = useState<Record<string, number>>({});

  // Calcular totales de cada moneda
  useEffect(() => {
    const calcularTotales = async () => {
      const movimientos: Movimiento[] = await db.movimientos.toArray();
      const resumen: Record<string, number> = {};

      movimientos.forEach((mov) => {
        if (!resumen[mov.cuenta]) resumen[mov.cuenta] = 0;
        if (mov.tipo === "Ingreso") resumen[mov.cuenta] += mov.monto;
        if (mov.tipo === "Gasto") resumen[mov.cuenta] -= mov.monto;
      });

      setTotales(resumen);
      setMonedas(Object.keys(resumen));
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
          <div key={i} className={`dot ${i === index ? "active" : ""}`}></div>
        ))}
      </div>
    </div>
  );
};

export default Home;
