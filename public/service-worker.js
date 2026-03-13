// ══════════════════════════════════════════════════════
// MEDICONLINE — Service Worker PWA
// Cache intelligent + support hors ligne
// ══════════════════════════════════════════════════════

const CACHE_NAME = "mediconline-v1";
const CACHE_STATIC = "mediconline-static-v1";
const CACHE_DYNAMIC = "mediconline-dynamic-v1";

// Fichiers à mettre en cache immédiatement
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/static/js/main.chunk.js",
  "/static/js/bundle.js",
  "/static/css/main.chunk.css",
  "/manifest.json",
  // Leaflet CDN (carte)
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
];

// ── INSTALLATION ──────────────────────────────────────
self.addEventListener("install", (event) => {
  console.log("[SW] Installation Mediconline PWA...");
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => {
      return cache.addAll(STATIC_ASSETS.map(url => {
        return new Request(url, { mode: "no-cors" });
      })).catch(err => console.log("[SW] Cache partiel:", err));
    })
  );
  self.skipWaiting();
});

// ── ACTIVATION ────────────────────────────────────────
self.addEventListener("activate", (event) => {
  console.log("[SW] Activation Mediconline PWA...");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_STATIC && key !== CACHE_DYNAMIC)
          .map((key) => {
            console.log("[SW] Suppression ancien cache:", key);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim();
});

// ── STRATÉGIE DE CACHE ───────────────────────────────
// Network First pour Firebase (données temps réel)
// Cache First pour assets statiques
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Firebase → toujours réseau (données temps réel)
  if (
    url.hostname.includes("firebase") ||
    url.hostname.includes("firebaseio") ||
    url.hostname.includes("googleapis")
  ) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Hors ligne : retourner réponse vide JSON
        return new Response(JSON.stringify({ offline: true }), {
          headers: { "Content-Type": "application/json" },
        });
      })
    );
    return;
  }

  // OpenStreetMap (tuiles carte) → cache puis réseau
  if (url.hostname.includes("tile.openstreetmap")) {
    event.respondWith(
      caches.open(CACHE_DYNAMIC).then((cache) =>
        cache.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((response) => {
            cache.put(event.request, response.clone());
            return response;
          }).catch(() => cached);
        })
      )
    );
    return;
  }

  // Assets statiques → Cache First
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_DYNAMIC).then((cache) =>
              cache.put(event.request, clone)
            );
          }
          return response;
        })
        .catch(() => {
          // Page hors ligne
          if (event.request.destination === "document") {
            return caches.match("/index.html");
          }
        });
    })
  );
});

// ── NOTIFICATIONS PUSH ────────────────────────────────
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "⏰ Mediconline";
  const options = {
    body: data.body || "N'oubliez pas de mettre à jour votre stock !",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-72.png",
    vibrate: [200, 100, 200],
    data: { url: data.url || "/" },
    actions: [
      { action: "update", title: "📦 Mettre à jour maintenant" },
      { action: "later", title: "Plus tard" },
    ],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "update") {
    clients.openWindow("/?tab=stock");
  } else {
    clients.openWindow("/");
  }
});

// ── SYNC EN ARRIÈRE-PLAN ──────────────────────────────
// Synchronise les modifications faites hors ligne
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-stock") {
    console.log("[SW] Synchronisation stock hors ligne...");
    // Les données Firebase se synchronisent automatiquement
    // dès que la connexion est rétablie
  }
});

console.log("[SW] Mediconline Service Worker chargé ✅");
