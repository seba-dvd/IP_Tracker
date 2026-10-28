// main.js - coordoneaza modulele
import { fetchGeoData } from './api.js';
import { initTheme } from './theme.js';
import { renderDetails, setLoading } from './details.js';
import { initMap, updateMap } from './map.js';
import { addToHistory, clearHistory, renderHistory } from './history.js';

const el = {
    form: document.getElementById('search-form'),
    input: document.getElementById('search-input'),
    error: document.getElementById('error'),
    themeToggle: document.getElementById('theme-toggle'),
    historyList: document.getElementById('history-list'),
    historyClear: document.getElementById('history-clear')
};

let requestId = 0; // ignora raspunsurile vechi daca se cauta repede

function showError(message) { el.error.textContent = message; el.error.hidden = false; }
function hideError() { el.error.hidden = true; el.error.textContent = ''; }

async function search(query, { save = true } = {}) {
    const id = ++requestId;
    hideError();
    setLoading(true);
    try {
        const data = await fetchGeoData(query);
        if (id !== requestId) return;
        renderDetails(data, query);
        updateMap(data.latitude, data.longitude, `${data.ip} - ${data.city || ''}`);
        if (save && query.trim()) {
            addToHistory(query.trim());
            renderHistory(el.historyList, onHistoryClick);
        }
    } catch (err) {
        if (id === requestId) showError(err.message);
    } finally {
        if (id === requestId) setLoading(false);
    }
}

function onHistoryClick(q) { el.input.value = q; search(q); }

initTheme(el.themeToggle);
initMap('map');
renderHistory(el.historyList, onHistoryClick);

el.form.addEventListener('submit', (e) => { e.preventDefault(); search(el.input.value); });
el.historyClear.addEventListener('click', () => { clearHistory(); renderHistory(el.historyList, onHistoryClick); });

search('', { save: false }); // la pornire: IP-ul utilizatorului
