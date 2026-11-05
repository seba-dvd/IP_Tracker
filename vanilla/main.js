// main.js - coordoneaza modulele
// D v1.4.0 (versiunea finala; prima versiune: M v1.1.0) - vezi docs/jurnal-D.md
import { fetchGeoData } from './api.js';
import { initTheme } from './theme.js';
import { renderDetails, setLoading } from './details.js';
import { initMap, updateMap } from './map.js';
import { addToHistory, clearHistory, renderHistory } from './history.js';

// elementele din pagina folosite de aplicatie (index.html)
const el = {
    form: document.getElementById('search-form'),
    input: document.getElementById('search-input'),
    error: document.getElementById('error'),
    themeToggle: document.getElementById('theme-toggle'),
    historyList: document.getElementById('history-list'),
    historyClear: document.getElementById('history-clear')
};

let requestId = 0; // ignora raspunsurile vechi daca se cauta repede

// afisarea erorilor in alerta de sub antet (M v1.1.0)
function showError(message) { el.error.textContent = message; el.error.hidden = false; }
function hideError() { el.error.hidden = true; el.error.textContent = ''; }

// o cautare completa: animatie de incarcare, cerere (api.js), card detalii (details.js),
// marker pe harta (map.js) si, daca save e true si textul nu e gol, salvare in istoric (history.js)
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

// click pe o cautare recenta: o pune in bara de cautare si o reface
function onHistoryClick(q) { el.input.value = q; search(q); }

// pornire: tema (theme.js), harta (map.js) si istoricul salvat (history.js)
initTheme(el.themeToggle);
initMap('map');
renderHistory(el.historyList, onHistoryClick);

// trimiterea formularului si butonul "Sterge tot"
el.form.addEventListener('submit', (e) => { e.preventDefault(); search(el.input.value); });
el.historyClear.addEventListener('click', () => { clearHistory(); renderHistory(el.historyList, onHistoryClick); });

search('', { save: false }); // la pornire: IP-ul utilizatorului
