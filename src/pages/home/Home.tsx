import React, { useEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { db, Movimiento, Tasa } from "../../bdDexie";
import "../home/Home.css";

const detectarMoneda = (mov: Movimiento): string => {
  return mov.moneda ? mov.moneda.toUpperCase() : "CUP";
};

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Hogar" | "Negocios">("Hogar");
  const [monedas, setMonedas] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [totales, setTotales] = useState<Record<string, number>>({});
  const [tasas, setTasas] = useState<Tasa[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Traer datos de la API (una sola vez)
useEffect(() => {
  let cancelado = false; // Para evitar setState si el componente se desmonta

  const fetchTasas = async () => {
    setCargando(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:3001/api/tasa");
      console.log("Respuesta raw:", res);

      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      const data = await res.json();
      console.log("Datos crudos del servidor:", data);

      if (!Array.isArray(data)) throw new Error("Datos inválidos del servidor");

      // Normalizar datos: todos los elementos deben tener codigo, compras_tasa, ventas_tasa
      const tasasNormalizadas: Tasa[] = data
        .map((t: any) => {
          // Si viene con codigo y compras/ventas
          if (t.codigo && (t.compras_tasa || t.ventas_tasa)) {
            return {
              codigo: t.codigo,
              compras_tasa: t.compras_tasa ?? t.valor ?? 0,
              ventas_tasa: t.ventas_tasa ?? t.valor ?? 0,
            };
          }

          // Si viene del scraping
          if (t.moneda && t.valor) {
            return {
              codigo: t.moneda,
              compras_tasa: parseFloat(t.valor),
              ventas_tasa: parseFloat(t.valor),
            };
          }

          return null;
        })
        .filter(Boolean) as Tasa[];

      if (!cancelado) setTasas(tasasNormalizadas);
    } catch (err) {
      console.error("Error al obtener la tasa:", err);
      if (!cancelado)
        setError("No se pudieron cargar las tasas. Intenta más tarde.");
    } finally {
      if (!cancelado) setCargando(false);
    }
  };

  fetchTasas();

  return () => {
    cancelado = true;
  };
}, []);




 // ✅ vacío: solo se ejecuta una vez

  // 🔹 Calcular totales por moneda
  useEffect(() => {
    const calcularTotales = async () => {
      const movimientos: Movimiento[] = await db.movimientos.toArray();
      const resumen: Record<string, number> = {};

      movimientos.forEach((mov) => {
        const moneda = detectarMoneda(mov);
        if (!resumen[moneda]) resumen[moneda] = 0;
        resumen[moneda] += mov.tipo === "Ingreso" ? mov.monto : -mov.monto;
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
          {/* Total por moneda */}
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
              <div key={i} className={`dot ${i === index ? "active" : ""}`} />
            ))}
          </div>

          {/* Estado de carga o error */}
          {cargando && <p>🔄 Cargando tasas...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {/* Tabla de mercado informal */}
          {!cargando && !error && tasas.length > 0 && (
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
