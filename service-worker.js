const CACHE_NAME = 'toast-site-cache-v1';
const ASSETS = [
  '/',
  'index.html',
  'style.css',
  'app.js',
  'olympia-hero.jpg',
  'toast-logo.png',
  'bardya-logo.png',
  'bardya-photo.jpg',
  'icon-revenue-growth.svg',
  'icon-efficient.svg',
  'icon-customer-care.svg',
  'icon-intuitive.svg'
];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
