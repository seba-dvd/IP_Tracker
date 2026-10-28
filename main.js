// main.js - Leaga cautarea de api.js, cardul de detalii, harta si istoricul
import { fetchGeoData, cleanQuery, classifyQuery } from './api.js';
import { initTheme } from './theme.js';
import { renderDetails, setLoading } from './details.js';
import { initMap, updateMap } from './map.js';
import { initHistory, addToHistory } from './history.js';

const el = {
    form: document.getElementById('search-form'),
    input: document.getElementById('search-input'),
    error: document.getElementById('error'),
    themeToggle: document.getElementById('theme-toggle'),
    historyList: document.getElementById('history-list'),
    historyEmpty: document.getElementById('history-empty'),
    historyClear: document.getElementById('history-clear')
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

// cauta un IP / domeniu, actualizeaza cardul de detalii si harta si (daca save) salveaza in istoric
async function search(query = '', save = true) {
    const id = ++lastSearch;
    hideError();
    setLoading(true);

    try {
        const data = await fetchGeoData(query);
        if (id !== lastSearch) return; // intre timp a pornit o cautare mai noua

        const q = cleanQuery(query);
        const where = [data.city, data.country].filter(Boolean).join(', ');
        renderDetails(data, q);
        updateMap(data.latitude, data.longitude, where ? `${data.ip} - ${where}` : data.ip);
        // pt IP-ul curent (cautare goala sau localhost) se salveaza IP-ul gasit
        if (save) addToHistory({ query: (classifyQuery(q)?.value || data.ip).toLowerCase(), ip: data.ip, location: where });
    } catch (err) {
        if (id === lastSearch) showError(err.message || 'Cautarea nu a putut fi efectuata.');
    } finally {
        if (id === lastSearch) setLoading(false);
    }
}

// istoric cautari (logica este in history.js): click pe o cautare recenta o reface
if (el.historyList) {
    initHistory({ list: el.historyList, empty: el.historyEmpty, clear: el.historyClear }, (query) => {
        el.input.value = query;
        search(query);
    });
}

// submit form pentru cautare IP / domeniu
el.form?.addEventListener('submit', (e) => {
    e.preventDefault();
    search(el.input.value);
});

// la incarcarea paginii: harta si datele pentru IP-ul curent (nu intra in istoric)
window.addEventListener('DOMContentLoaded', () => {
    if (window.L) initMap('map');
    search('', false);
});
