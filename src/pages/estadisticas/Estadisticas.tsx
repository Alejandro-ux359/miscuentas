import "../estadisticas/Estadisticas.css";
import React, { useEffect, useState } from "react";
import { db, Movimiento } from "../../bdDexie";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DatosPorCategoria {
  name: string;
  value: number;
}

interface RangoPorMoneda {
  [moneda: string]: DatosPorCategoria[];
}

// Detectar moneda de cada movimiento
const detectarMoneda = (mov: Movimiento): string => {
  if (mov.moneda) return mov.moneda;
  const mony = mov.moneda?.toUpperCase() || "";
  if (mony.includes("USD")) return "USD";
  if (mony.includes("EUR")) return "EUR";
  if (mony.includes("MLC")) return "MLC";
  if (mony.includes("CUP")) return "CUP";
  return "CUP";
};

const Estadisticas: React.FC = () => {
  const [datos, setDatos] = useState<Movimiento[]>([]);
  const [monedaSeleccionada, setMonedaSeleccionada] = useState<string>("CUP");
  const [rangos, setRangos] = useState<{
    ultimos7: RangoPorMoneda;
    ultimos15: RangoPorMoneda;
    ultimoMes: RangoPorMoneda;
  }>({ ultimos7: {}, ultimos15: {}, ultimoMes: {} });

  // Cargar datos desde Dexie
  useEffect(() => {
    const cargarDatos = async () => {
      const movimientos = await db.movimientos.toArray();
      const procesados = movimientos.map((m) => ({
        ...m,
        moneda: detectarMoneda(m),
      }));
      setDatos(procesados);

      // Establecer moneda seleccionada por defecto si no existe
      const monedasUnicas = Array.from(new Set(procesados.map((m) => m.moneda)));
      if (monedasUnicas.length > 0 && !monedasUnicas.includes(monedaSeleccionada)) {
        setMonedaSeleccionada(monedasUnicas[0]);
      }
    };
    cargarDatos();
  }, []);

  const filtrarPorFecha = (dias: number) => {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - dias);
    return datos.filter((d) => new Date(d.fecha) >= fechaLimite);
  };

  const agruparPorMonedaYCategoria = (arr: Movimiento[]) => {
    const resumen: Record<string, Record<string, number>> = {};
    arr.forEach((d) => {
      const moneda = d.moneda || "CUP";
      const categoria = d.categoria || "Otro";
      if (!resumen[moneda]) resumen[moneda] = {};
      resumen[moneda][categoria] = (resumen[moneda][categoria] || 0) + d.monto;
    });

    const resultado: RangoPorMoneda = {};
    for (const moneda in resumen) {
      resultado[moneda] = Object.entries(resumen[moneda]).map(([name, value]) => ({
        name,
        value,
      }));
    }
    return resultado;
  };

  useEffect(() => {
    setRangos({
      ultimos7: agruparPorMonedaYCategoria(filtrarPorFecha(7)),
      ultimos15: agruparPorMonedaYCategoria(filtrarPorFecha(15)),
      ultimoMes: agruparPorMonedaYCategoria(filtrarPorFecha(30)),
    });
  }, [datos]);

  const colores = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#C9CBCF"];

  const generarData = (arr: DatosPorCategoria[]) => ({
    labels: arr.map((d) => d.name),
    datasets: [
      {
        data: arr.map((d) => d.value),
        backgroundColor: arr.map((_, i) => colores[i % colores.length]),
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  });

  // Todas las monedas detectadas en los movimientos
  const monedasDisponibles = Array.from(new Set(datos.map((d) => d.moneda)));

  const getDataByMoneda = (rango: RangoPorMoneda) => rango[monedaSeleccionada] || [];

  const opciones: ChartOptions<"pie"> = {
    responsive: true,
    plugins: { legend: { position: "bottom" } },
  };

  return (
    <div className="estadisticas-container">
      <div className="header-estadisticas">
        <h2>📊 Estadísticas</h2>

        {monedasDisponibles.length > 0 && (
          <div className="selector-moneda">
            <label htmlFor="moneda">Moneda:</label>
            <select
              id="moneda"
              value={monedaSeleccionada}
              onChange={(e) => setMonedaSeleccionada(e.target.value)}
            >
              {monedasDisponibles.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="secciones-graficas">
        <div className="grafica-card">
          <h3>Últimos 7 días ({monedaSeleccionada})</h3>
          {getDataByMoneda(rangos.ultimos7).length > 0 ? (
            <Pie data={generarData(getDataByMoneda(rangos.ultimos7))} options={opciones} />
          ) : (
            <p>No hay datos</p>
          )}
        </div>

        <div className="grafica-card">
          <h3>Últimos 15 días ({monedaSeleccionada})</h3>
          {getDataByMoneda(rangos.ultimos15).length > 0 ? (
            <Pie data={generarData(getDataByMoneda(rangos.ultimos15))} options={opciones} />
          ) : (
            <p>No hay datos</p>
          )}
        </div>

        <div className="grafica-card">
          <h3>Último mes ({monedaSeleccionada})</h3>
          {getDataByMoneda(rangos.ultimoMes).length > 0 ? (
            <Pie data={generarData(getDataByMoneda(rangos.ultimoMes))} options={opciones} />
          ) : (
            <p>No hay datos</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;
