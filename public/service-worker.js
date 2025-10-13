
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';

// ==========================
// ⚙️ CONFIGURACIÓN BASE
// ==========================
clientsClaim();
self.skipWaiting();

// Recibir mensajes desde la app (por ejemplo, para actualizar el SW)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ==========================
// 📦 PRECACHE DE ARCHIVOS GENERADOS POR VITE
// ==========================
// Vite inyecta automáticamente los assets en __WB_MANIFEST
precacheAndRoute(self.__WB_MANIFEST);

// ==========================
// 🧹 GESTIÓN DE VERSIONADO Y LIMPIEZA
// ==========================
function obtenerFechaFormato() {
  const ahora = new Date();
  const año = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  const hora = String(ahora.getHours()).padStart(2, '0');
  const minuto = String(ahora.getMinutes()).padStart(2, '0');
  return `${año}.${mes}.${dia}.${hora}.${minuto}`;
}

const version = `v${obtenerFechaFormato()}`;
const coreID = version + '_core';
const imgID = version + '_assets';
const apiID = version + '_api';
const pageID = version + '_pages';
const cacheIDs = [coreID, imgID, apiID, pageID];

console.log("📦 Service Worker versión:", version);

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter(
            (key) => !cacheIDs.includes(key) && !/\b(workbox)\b/.test(key)
          )
          .map((key) => caches.delete(key))
      )
    )
  );
});

// ==========================
// 🧭 ESTRATEGIAS DE CACHE
// ==========================

// 🖼️ Imágenes y CSS - Cache First
registerRoute(
  /.*\.(?:png|jpg|jpeg|svg|gif|webp|css)$/,
  new CacheFirst({ cacheName: imgID })
);

// 🌐 Peticiones API (por ejemplo a Supabase o tu backend) - Network First
registerRoute(
  ({ url }) => url.origin.includes('supabase') || url.pathname.startsWith('/api'),
  new NetworkFirst({ cacheName: apiID })
);

// 📄 Páginas HTML y todo lo demás - Stale While Revalidate
registerRoute(
  ({ request }) => request.destination === 'document' || request.destination === '',
  new StaleWhileRevalidate({ cacheName: coreID })
);



// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open("app-cache").then((cache) => {
//       return cache.addAll(["/", "/index.html"]);
//     })
//   );
// });

// self.addEventListener("activate", (event) => {
//   console.log("Service Worker activado");
// });

// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((cached) => cached || fetch(event.request))
//   );
// });