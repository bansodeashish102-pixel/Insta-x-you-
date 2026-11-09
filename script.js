
const CACHE = "insta-x-you-v1";

const FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() =>
        caches.match("./index.html")
      );
    })
  );
});

/* LIQUID SWIPE NAVIGATION */

const swipePages = ["home", "discover", "create", "profile"];
let startX = 0;
let startY = 0;

const appArea = document.querySelector(".app");

appArea.addEventListener("touchstart", (e) => {
  startX = e.changedTouches[0].clientX;
  startY = e.changedTouches[0].clientY;
}, {passive:true});

appArea.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;

  const dx = endX - startX;
  const dy = endY - startY;

  if (Math.abs(dx) < 65 || Math.abs(dx) < Math.abs(dy)) return;

  if (e.target.closest("input, textarea, button")) return;

  const current = swipePages.findIndex(id =>
    document.getElementById(id).classList.contains("active")
  );

  if (current === -1) return;

  const next = dx < 0 ? current + 1 : current - 1;

  if (next < 0 || next >= swipePages.length) return;

  const buttons = document.querySelectorAll(".nav button");

  showPage(swipePages[next], buttons[next]);
}, {passive:true});


