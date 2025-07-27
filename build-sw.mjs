import { generateSW } from 'workbox-build';

generateSW({
  globDirectory: 'dist',
  globPatterns: ['**/*.{js,css,html,svg,webmanifest}'],
  swDest: 'dist/sw.js',
  clientsClaim: true,
  skipWaiting: true,
  navigateFallback: '/offline.html',
  runtimeCaching: [
    {
      urlPattern: ({request}) => ['script','style'].includes(request.destination),
      handler: 'StaleWhileRevalidate',
    },
    {
      urlPattern: ({request}) => request.destination === 'image',
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
      },
    },
    {
      urlPattern: /\/api\//,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api',
      },
    },
  ],
  cleanupOutdatedCaches: true,
}).then(({count, size}) => {
  console.log(`Generated sw, precaching ${count} files, ${size} bytes.`);
}).catch((err) => {
  console.error('Service worker build failed:', err);
  process.exit(1);
});
