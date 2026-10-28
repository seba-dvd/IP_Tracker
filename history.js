/* history.js - ultimele cautari ale utilizatorului, salvate in localStorage */

const KEY = 'geo-history';
const MAX = 5;
let ui = null;

function load() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(list) ? list.filter(item => typeof item?.query === 'string') : [];
  } catch { return []; }
}

function save(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* ignora daca stocarea nu este disponibila */ }
}

function toItem({ query, ip, location }) {
  const title = document.createElement('span');
  title.className = 'history-query';
  title.textContent = query;

  const meta = document.createElement('span');
  meta.className = 'muted small';
  meta.textContent = [ip !== query && ip, location].filter(Boolean).join(' - ');

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'history-item';
  btn.dataset.query = query;
  btn.append(title, meta);

  const li = document.createElement('li');
  li.append(btn);
  return li;
}

function render() {
  if (!ui) return;
  const list = load();
  ui.list.replaceChildren(...list.map(toItem));
  ui.empty.hidden = list.length > 0;
  ui.clear.disabled = list.length === 0;
}

/**
 * Adauga o cautare la inceputul listei (fara duplicate, maxim MAX intrari).
 * @param {{ query: string, ip: string, location: string }} entry
 */
export function addToHistory(entry) {
  save([entry, ...load().filter(item => item.query !== entry.query)].slice(0, MAX));
  render();
}

/**
 * Afiseaza istoricul salvat si ataseaza evenimentele pe lista si pe butonul de stergere.
 * @param {{ list: HTMLUListElement, empty: HTMLElement, clear: HTMLButtonElement }} elements
 * @param {(query: string) => void} onSelect apelata la click pe o cautare recenta
 */
export function initHistory(elements, onSelect) {
  ui = elements;
  ui.list.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-query]');
    if (btn) onSelect(btn.dataset.query);
  });
  ui.clear.addEventListener('click', () => {
    try { localStorage.removeItem(KEY); } catch { /* ignora daca stocarea nu este disponibila */ }
    render();
  });
  render();
}
