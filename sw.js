const cache='befaringsskisse-v27';
const assets=['./','./index.html','./style.css','./fix.css','./editor.css','./polish.css','./finish.css','./icons.css','./app.js','./finish.js','./manifest.webmanifest','./app-icon.svg','./app-icon-180-v2.png','./app-icon-192-v2.png','./app-icon-512-v2.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(cache).then(store=>store.addAll(assets)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==cache).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(fetch(event.request).then(response=>response).catch(()=>caches.match(event.request)));});

