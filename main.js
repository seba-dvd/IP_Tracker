// main.js - Leaga cautarea de api.js, cardul de detalii si harta
import { fetchGeoData, cleanQuery } from './api.js';
import { initTheme } from './theme.js';
import { renderDetails, setLoading } from './details.js';
import { initMap, updateMap } from './map.js';

const el = {
    form: document.getElementById('search-form'),
    input: document.getElementById('search-input'),
    error: document.getElementById('error'),
    themeToggle: document.getElementById('theme-toggle')
};

let lastSearch = 0;

// switch de tema (logica este in theme.js)
if (el.themeToggle) initTheme(el.themeToggle);

// fctii pentru afisarea erorilor in interfata
function showError(message) {
    if (!el.error) return;
    el.error.textContent = message;
    el.error.hidden = false;
}

function hideError() {
    if (!el.error) return;
    el.error.hidden = true;
    el.error.textContent = '';
}

// cauta un IP / domeniu si actualizeaza cardul de detalii si harta
async function search(query = '') {
    const id = ++lastSearch;
    hideError();
    setLoading(true);

    try {
        const data = await fetchGeoData(query);
        if (id !== lastSearch) return; // intre timp a pornit o cautare mai noua

        const where = [data.city, data.country].filter(Boolean).join(', ');
        renderDetails(data, cleanQuery(query));
        updateMap(data.latitude, data.longitude, where ? `${data.ip} - ${where}` : data.ip);
    } catch (err) {
        if (id === lastSearch) showError(err.message || 'Cautarea nu a putut fi efectuata.');
    } finally {
        if (id === lastSearch) setLoading(false);
    }
}

// submit form pentru cautare IP / domeniu
el.form?.addEventListener('submit', (e) => {
    e.preventDefault();
    search(el.input.value);
});

// la incarcarea paginii: harta si datele de geolocalizare pentru IP-ul curent
window.addEventListener('DOMContentLoaded', () => {
    if (window.L) initMap('map');
    search();
});
