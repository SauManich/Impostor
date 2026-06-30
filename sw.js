/* Service Worker - Impostor Bíblico PWA */
// Sube este número cada vez que cambies la lista de assets o la estrategia.
const CACHE_NAME = "impostor-biblico-v3";

const ASSETS = [
  "./",
  "./index.html",
  "./css/index.css",
  "./js/index.js",
  "./html/game.html",
  "./css/game.css",
  "./js/game.js",
  "./html/config-game.html",
  "./css/config-game.css",
  "./js/config-game.js",
  "./img/LogoImpostor.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png",
  "./icons/favicon-16.png",
  "./manifest.json"
];

// Instalación: precache de los recursos base.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activación: limpiar caches viejos.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Permite que la página pida activar el SW nuevo de inmediato.
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Fetch: NETWORK-FIRST.
// Si hay internet, siempre se sirve la versión más reciente desde la red
// (así ves tus cambios al instante) y se actualiza el caché en segundo plano.
// El caché solo se usa como respaldo cuando no hay conexión.
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Solo manejamos GET del mismo origen.
  if (request.method !== "GET" || !request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Guardamos una copia fresca en el caché para uso offline.
        const copy = response.clone();
        if (response.ok) {
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => {
        // Sin red: respondemos desde el caché.
        return caches.match(request).then((cached) => {
          if (cached) {
            return cached;
          }
          // Para navegaciones sin caché, devolvemos el index como fallback.
          if (request.mode === "navigate") {
            return caches.match("./index.html");
          }
        });
      })
  );
});
