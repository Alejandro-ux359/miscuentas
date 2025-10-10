const CACHE_NAME = "mis-cuentas";

// Archivos que siempre queremos cachear
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/favicon.ico",
];

// ===== Instalación =====
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting(); // Activar inmediatamente
});

// ===== Activación =====
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // Tomar control de todas las pestañas
});

// ===== Fetch =====
self.addEventListener("fetch", (event) => {
  // Solo interceptar GET
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          // Guardar en cache la respuesta válida
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          // Fallback offline para HTML
          if (event.request.destination === "document") {
            return caches.match("/index.html");
          }
        });
    })
  );
});
