const cache='befaringsskisse-v95';
const assets=['./','./index.html','./style.css','./fix.css','./editor.css','./polish.css','./finish.css','./icons.css','./brand.css','./sticky.css','./rumag-logo-hvit.svg','./rumag-r-hvit.svg','./app.js','./pdf-export.js','./finish.js','./editor-flow.js','./finish-gallery.js','./manifest.webmanifest','./app-icon-rstudios.svg','./apple-touch-icon-v9.png','./app-icon-192-v9.png','./app-icon-512-v9.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(cache).then(store=>store.addAll(assets)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==cache).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(fetch(event.request).then(response=>response).catch(()=>caches.match(event.request)));});

