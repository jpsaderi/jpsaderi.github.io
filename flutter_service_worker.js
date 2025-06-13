'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "06e196152b54d71123c5817d38d67615",
"version.json": "ca6626e40c6e321c5d535a7a5ed6d6ce",
"splash/img/light-2x.png": "ad2039f0bd97a58642cce9893e01ade0",
"splash/img/branding-4x.png": "cceee30c0e36145732391ff25cfc05d6",
"splash/img/dark-4x.png": "d6a734d8a80843813c952a1e209e96f4",
"splash/img/branding-dark-1x.png": "f44f4c1ac27c1383c84be320248bd83e",
"splash/img/light-3x.png": "a0706d9b8f12ffb0003ce1b2877ef5a5",
"splash/img/dark-3x.png": "a0706d9b8f12ffb0003ce1b2877ef5a5",
"splash/img/light-background.png": "e830047d3b4ab153414bf9face45bf6a",
"splash/img/light-4x.png": "d6a734d8a80843813c952a1e209e96f4",
"splash/img/branding-2x.png": "4c7f5a2577e7cadbb481b4250c33f8a6",
"splash/img/branding-3x.png": "2d1d571893a3a2fd5393409b1a2256ae",
"splash/img/dark-2x.png": "ad2039f0bd97a58642cce9893e01ade0",
"splash/img/dark-1x.png": "2da179b0244870839a74464181b197cd",
"splash/img/branding-dark-4x.png": "cceee30c0e36145732391ff25cfc05d6",
"splash/img/branding-1x.png": "f44f4c1ac27c1383c84be320248bd83e",
"splash/img/branding-dark-2x.png": "4c7f5a2577e7cadbb481b4250c33f8a6",
"splash/img/light-1x.png": "2da179b0244870839a74464181b197cd",
"splash/img/branding-dark-3x.png": "2d1d571893a3a2fd5393409b1a2256ae",
"index.html": "d6a8ae74c5e41d99263b98cee20bc6a2",
"/": "d6a8ae74c5e41d99263b98cee20bc6a2",
"main.dart.js": "fc3a5a8932b63070f8f48d21033b256c",
"flutter.js": "83d881c1dbb6d6bcd6b42e274605b69c",
"favicon.png": "10869adf6bd4949c45f2be73addb9d34",
"icons/Icon-192.png": "8dbf4e45d3998db2a00435c344ba6dd8",
"icons/Icon-maskable-192.png": "8dbf4e45d3998db2a00435c344ba6dd8",
"icons/Icon-maskable-512.png": "61743e4ab79cc08810c34bef2265a0ca",
"icons/Icon-512.png": "61743e4ab79cc08810c34bef2265a0ca",
"manifest.json": "87c9be05d07e5afd0e78a79a80e31622",
"assets/AssetManifest.json": "f9e89e97ce290e1dbf21f6b0cfc6407a",
"assets/NOTICES": "c5e70a138009efe7c501338f9017ae65",
"assets/FontManifest.json": "7b2a36307916a9721811788013e65289",
"assets/AssetManifest.bin.json": "71df3dcb09b0ca251b91883ada616b8d",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "05ec86d0f9c8582d6c3ca2d0c9ec1ec2",
"assets/fonts/MaterialIcons-Regular.otf": "180cdcff3a21c556d41d2fc80fd0df9a",
"assets/assets/background/background_tinted_splash.png": "a415f9be4f0588742b7cbd6de39dd6d5",
"assets/assets/background/welcome_page_dark.png": "cfa0c8f61fc53d5771b5e70ee15bf7ec",
"assets/assets/background/background_dark_splash.png": "e830047d3b4ab153414bf9face45bf6a",
"assets/assets/background/background_light_splash.png": "0b8b42248426c37c950995b5ca06b3a3",
"assets/assets/logos/google.png": "5cada5a14d15163b0f9ad66a268ff9cd",
"canvaskit/skwasm.js": "ea559890a088fe28b4ddf70e17e60052",
"canvaskit/skwasm.js.symbols": "e72c79950c8a8483d826a7f0560573a1",
"canvaskit/canvaskit.js.symbols": "bdcd3835edf8586b6d6edfce8749fb77",
"canvaskit/skwasm.wasm": "39dd80367a4e71582d234948adc521c0",
"canvaskit/chromium/canvaskit.js.symbols": "b61b5f4673c9698029fa0a746a9ad581",
"canvaskit/chromium/canvaskit.js": "8191e843020c832c9cf8852a4b909d4c",
"canvaskit/chromium/canvaskit.wasm": "f504de372e31c8031018a9ec0a9ef5f0",
"canvaskit/canvaskit.js": "728b2d477d9b8c14593d4f9b82b484f3",
"canvaskit/canvaskit.wasm": "7a3f4ae7d65fc1de6a6e7ddd3224bc93"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
