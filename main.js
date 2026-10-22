// main.js - Gestionează tema și interacțiunea cu api.js
import { fetchGeoData } from './api.js';

const el = {
    form: document.getElementById('search-form'),
    input: document.getElementById('search-input'),
    error: document.getElementById('error'),
    themeToggle: document.getElementById('theme-toggle')
};
// switch de tema
el.themeToggle?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark-theme');
    localStorage.setItem('geo-theme', isDark ? 'dark' : 'light');
});
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

// submit form pentru cautare IP / domeniu
el.form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const query = el.input.value;

    try {
        const data = await fetchGeoData(query);
        console.log('Date primite de la API:', data);
    } catch (err) {
        showError(err.message);
    }
});

// la incarcarea paginii, incarca datele de geolocalizare pentru IP-ul curent
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await fetchGeoData();
        console.log('Locatia ta initiala:', data);
    } catch (err) {
        showError(err.message || 'Nu s-a putut incarca locatia initiala.');
    }
});