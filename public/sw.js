const CACHE_NAME = 'lisa-cache-v1'

// Determine the base path of the application. When the app is served from a
// subdirectory (e.g. https://example.com/lisa/), the service worker will live
// at `<basePath>/sw.js`. The `VITE_BASE_PATH` global may be injected at build
// time, but we also fall back to deriving it from the service worker location so
// the file works when served directly from `public/` during development.
let basePath = typeof VITE_BASE_PATH !== 'undefined'
  ? VITE_BASE_PATH
  : self.location.pathname.replace(/[^/]+$/, '/')

if (!basePath.endsWith('/')) basePath += '/'

// Avoid generating malformed URLs like "//index.html" when the base path is root
const BASE = basePath === '/' ? '' : basePath.replace(/\/$/, '')

const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg'
].map(p => `${BASE}${p}`)

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) return // skip external requests
  event.respondWith(
    caches.match(event.request)
      .then((resp) => resp || fetch(event.request))
      .catch(() => caches.match('/index.html'))
  )
})
