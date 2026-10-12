# Befaringsskisse

En mobil-first webapp for befaring: ta bilde, tegn/legg til tekst, gjenkjenn handskrift og del den ferdige skissen.

## Slik brukes den

1. Apne **Apne kamera** eller velg et eksisterende bilde.
2. Tegn med pennen. Velg **T** for plassert, redigerbar tekst.
3. Har du skrevet et tall eller en tekst for hand, trykk **Gjenkjenn**. Resultatet blir en tekstboks som kan rettes for eksport.
4. Velg **Ferdig** og del filen eller lagre den til Bilder/kamerarull.

## Kjøring på telefon

Kamera i mobilnettlesere krever normalt en sikker forbindelse (**HTTPS**). En vanlig `http://192.168...`-adresse pa Wi-Fi er derfor ikke et godt produksjonsoppsett, selv om resten av appen vil kunne lastes.

Anbefalt forste utrulling: publiser denne mappen som en statisk side hos Netlify, Cloudflare Pages eller Vercel. Da far dere HTTPS og en fast lenke som montorene kan legge pa hjemskjermen. Appen kan installeres som en PWA fra Safari/Chrome.

Hvis dere bare tester fra en PC lokalt, kan en enkel statisk server brukes. Den gir ikke palitelig kameratilgang fra andre telefoner for den er eksponert over HTTPS.

## Om tekstgjenkjenning

Gjenkjenning bruker Tesseract.js og lastes forste gang den trengs. Den fungerer best med mork, tydelig handskrift og korte markeringer/tall. Resultatet er alltid redigerbart, slik at f.eks. `7` enkelt kan endres til `1`.
