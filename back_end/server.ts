import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
app.use(cors({
  origin: "*", // permite cualquier origen (móvil, web, etc.)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// ==== 🔹 CACHE ====
let cacheTasas: any[] = [];
let ultimaActualizacion = 0;
const TIEMPO_CACHE = 1000 * 60 * 10; // 10 minutos

// ==== 🔹 RUTA API ====
app.get("/api/tasa", async (req: Request, res: Response) => {
  try {
    const ahora = Date.now();

    if (cacheTasas.length && ahora - ultimaActualizacion < TIEMPO_CACHE) {
      console.log("📦 Enviando tasas desde cache");
      return res.json(cacheTasas);
    }

    console.log("🌐 Obteniendo tasas del mercado desde el sitio web...");
    const URL = "https://eltoque.com/tasas-de-cambio-de-moneda-en-cuba-hoy";
    const response = await fetch(URL, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!response.ok) throw new Error(`No se pudo obtener la página: ${response.status}`);

    const html = await response.text();
    const $ = cheerio.load(html);
    const tabla = $("table.sc-89f464ef-1.iNwCgp").first();
    if (!tabla.length) throw new Error("No se encontró la tabla de tasas");

    const tasas: any[] = [];
    tabla.find("tbody tr").each((_, tr) => {
      const tds = $(tr).find("td");
      if (!tds.length) return;

      const codigo = $(tds[0]).find(".currency").text().trim();
      const priceCell = $(tds[2]);
      const ventaText = priceCell.find(".name-type:contains('VENTA')").next(".price-text").text().trim();
      const compraText = priceCell.find(".name-type:contains('COMPRA')").nextAll(".price-text").first().text().trim();

      const venta = parseFloat(ventaText.replace(/[^0-9.,]/g, "").replace(",", "."));
      const compra = parseFloat(compraText.replace(/[^0-9.,]/g, "").replace(",", "."));

      if (codigo && (!isNaN(compra) || !isNaN(venta))) {
        tasas.push({
          id_tasa: codigo,
          codigo,
          nombre_tasa: codigo,
          compras_tasa: compra,
          ventas_tasa: venta,
          tasa: (compra + venta) / 2
        });
      }
    });

    cacheTasas = tasas;
    ultimaActualizacion = ahora;

    console.log("✅ Tasas obtenidas y guardadas en cache");
    res.json(tasas);
  } catch (err) {
    console.error("❌ Error al obtener las tasas:", err);
    res.status(500).json({ error: err instanceof Error ? err.message : "Error desconocido" });
  }
});



// Servir el frontend (por ejemplo si está en ../frontend/build)
const buildPath = path.join(__dirname, "../front_end", "build");
app.use(express.static(buildPath));

// ✅ Usar app.use() en lugar de app.get("*") (Express 5 compatible)
app.use((req: Request, res: Response) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// ==== 🔹 INICIAR SERVIDOR ====
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`));
