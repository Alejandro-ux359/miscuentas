import React, { useEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { db, Movimiento, Tasa } from "../../bdDexie";
import "../home/Home.css";

const detectarMoneda = (mov: Movimiento): string =>
  mov.moneda ? mov.moneda.toUpperCase() : "CUP";

const Home: React.FC = () => {
  const [monedas, setMonedas] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [totales, setTotales] = useState<Record<string, number>>({});
  const [tasas, setTasas] = useState<Tasa[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizarCodigo = (codigo: string) =>
    String(codigo)
      .replace(/^\d+\s*/, "") // elimina "1 ", "2 ", etc
      .trim()
      .toUpperCase();

  useEffect(() => {
    let cancelado = false;

    const fetchTasas = async () => {
      setCargando(true);
      try {
        const local = localStorage.getItem("tasas");
        if (local && !cancelado) {
          setTasas(JSON.parse(local));
        }

        const res = await fetch("https://api-miscuentas.onrender.com/api/tasa");
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        const data = await res.json();
        if (!Array.isArray(data))
          throw new Error("Datos inválidos del servidor");

        if (!cancelado) {
          setTasas(data);
          localStorage.setItem("tasas", JSON.stringify(data));
        }
      } catch (err) {
        console.warn(
          "⚠️ No se pudo actualizar desde el servidor, usando datos locales si existen.",
          err
        );
      } finally {
        if (!cancelado) setCargando(false);
      }
    };

    fetchTasas();
    return () => {
      cancelado = true;
    };
  }, []);

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

  // 🔹 Función para convertir totalActual a otra moneda usando tasa de venta

  const convertirTotal = (monedaDestino: string): string => {
    if (totalActual < 0) return "0.00"; // ⛔ NO convertir valores negativos

    const monedaA = normalizarCodigo(monedaActual);
    const monedaB = normalizarCodigo(monedaDestino);

    if (monedaA === monedaB) return totalActual.toFixed(2);

    const tasaA = tasas.find((t) => normalizarCodigo(t.codigo) === monedaA);
    const tasaB = tasas.find((t) => normalizarCodigo(t.codigo) === monedaB);

    if (!tasaA || !tasaB) return "0.00";

    const ventaA = Number(tasaA.ventas_tasa);
    const ventaB = Number(tasaB.ventas_tasa);

    const totalEnCUP = totalActual * ventaA;

    if (monedaB === "CUP") {
      return totalEnCUP.toFixed(2);
    }

    return (totalEnCUP / ventaB).toFixed(2);
  };

  // Función para calcular total en CUP
  const totalEnCUP = () => {
    if (totalActual < 0) return "0.00"; // ⛔ NO convertir valores negativos

    const monedaA = normalizarCodigo(monedaActual);
    const tasa = tasas.find((t) => normalizarCodigo(t.codigo) === monedaA);

    if (!tasa) return "0.00";

    return (totalActual * Number(tasa.ventas_tasa)).toFixed(2);
  };

  return (
    <div className="dashboard">
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
                    <th>Total {monedaActual}</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Fila de CUP — se muestra solo si la moneda actual NO es CUP */}
                  {monedaActual !== "CUP" && (
                    <tr>
                      <td>1 CUP</td>
                      <td>-</td>
                      <td>-</td>
                      <td>{totalEnCUP()}</td>
                    </tr>
                  )}

                  {/* Filas de las demás monedas */}
                  {tasas.map((t, i) => (
                    <tr key={i}>
                      <td>{t.codigo}</td>
                      <td>{t.compras_tasa}</td>
                      <td>{t.ventas_tasa}</td>
                      <td>
                        {totalActual < 0
                          ? "0.00" // ⛔ NO convertir valores negativos
                          : monedaActual === "CUP"
                          ? (totalActual / t.ventas_tasa).toFixed(2)
                          : convertirTotal(t.codigo.toUpperCase())}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default Home;
