import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

let cacheTasas: any[] = [];
let ultimaActualizacion = 0;
const TIEMPO_CACHE = 1000 * 60 * 10; // 10 minutos

app.get("/api/tasa", async (req: Request, res: Response) => {
  try {
    const ahora = Date.now();

    if (cacheTasas.length && ahora - ultimaActualizacion < TIEMPO_CACHE) {
      console.log("📦 Enviando tasas desde cache");
      return res.json(cacheTasas);
    }

    console.log("🌐 Obteniendo la tasa del mercado del sitio web...");

    const URL = "https://eltoque.com/tasas-de-cambio-de-moneda-en-cuba-hoy";
    const response = await fetch(URL, { headers: { "User-Agent": "Mozilla/5.0" } });

    console.log(`🔹 Respuesta recibida: ${response.status} ${response.statusText}`);
    if (!response.ok) throw new Error(`No se pudo obtener la página: ${response.status}`);

    const html = await response.text();
    console.log("📄 HTML recibido, longitud:", html.length);

    const $ = cheerio.load(html);
    const tabla = $("table.sc-89f464ef-1.iNwCgp").first();
    if (!tabla.length) throw new Error("No se encontró la tabla de tasas");

    console.log("📝 Procesando filas de la tabla...");
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
        tasas.push({ codigo, compras_tasa: compra, ventas_tasa: venta });
        console.log(`💰 ${codigo} → Compra: ${compra}, Venta: ${venta}`);
      }
    });

    if (!tasas.length) throw new Error("No se encontraron filas válidas");

    cacheTasas = tasas;
    ultimaActualizacion = ahora;

    console.log("✅ Tasas procesadas correctamente y guardadas en cache");
    res.json(tasas);
  } catch (err) {
    console.error("❌ Error al obtener las tasas:", err);
    res.status(500).json({ error: err instanceof Error ? err.message : "Error desconocido" });
  }
});

app.listen(3001, () => console.log("🚀 Servidor backend corriendo en http://localhost:3001"));
