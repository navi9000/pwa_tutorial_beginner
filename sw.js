const VERSION = "v3"
const CACHE_NAME = `period-tracker-${VERSION}`

const APP_STATIC_RESOURCES = [
  "/pwa_tutorial_beginner/",
  "/pwa_tutorial_beginner/index.html",
  "/pwa_tutorial_beginner/style.css",
  "/pwa_tutorial_beginner/app.js",
  "/pwa_tutorial_beginner/manifest.json",
  "/pwa_tutorial_beginner/icons/circle.svg",
  "/pwa_tutorial_beginner/icons/tire.svg",
  "/pwa_tutorial_beginner/icons/wheel.svg",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      await cache.addAll(APP_STATIC_RESOURCES)
    })(),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys()
      await Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name)
          }
          return undefined
        }),
      )
      await clients.claim()
    })(),
  )
})

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(caches.match("/pwa_tutorial_beginner/"))
    return
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      const cachedResponse = await cache.match(event.request.url)
      if (cachedResponse) {
        return cachedResponse
      }
      return new Response(null, { status: 404 })
    })(),
  )
})
