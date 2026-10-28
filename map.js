/* map.js - harta Leaflet (tile-uri OpenStreetMap) si markerul locatiei gasite
   R v1.3.0 - vezi docs/jurnal-R.md; dimensiunea hartii este in styles.css (D v1.4.0: harta) */

let map, marker;

// creeaza harta in elementul cu id-ul dat, cu vedere initiala pe toata lumea
export function initMap(elementId) {
  map = L.map(elementId).setView([20, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
}

// muta markerul (il creeaza la prima cautare), ii pune popup-ul si zboara animat la locatie
export function updateMap(lat, lon, label = '') {
  if (!map) return;
  if (marker) marker.setLatLng([lat, lon]);
  else marker = L.marker([lat, lon]).addTo(map);
  // caracterele speciale HTML sunt inlocuite, ca textul din popup sa nu poata injecta cod
  marker.bindPopup(label.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])));
  map.flyTo([lat, lon], 11, { duration: 1.2 });
}
