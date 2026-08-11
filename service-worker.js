const CACHE_NAME = "ayuda123-colombia-v5";

const CORE_ASSETS = [
  "/",
  "/index.html",
  "/prioritario/",
  "/prioritario/index.html",
  "/mensajes/",
  "/mensajes/index.html",
  "/data.json",
  "/acopio-colombia.png",
  "/cruz-roja-colombia-donacion.png",
  "/tigresas-acopio-1.png",
  "/tigresas-acopio-2.png",
  "/tigresas-acopio-3.png",
  "/tigresas-donaciones.png",
  "/tigresas-que-donar.png",
  "/centros-acopio-colombia-2026.md",
  "/portada.jpg",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || !req.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req).then((cached) => cached || caches.match("/index.html")))
  );
});
