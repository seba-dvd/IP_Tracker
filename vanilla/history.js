/* history.js - ultimele cautari ale utilizatorului, salvate in localStorage
   D v1.4.0 - vezi docs/jurnal-D.md */

const KEY = 'geo-history';
const MAX = 5;

// citeste lista salvata; datele stricate sau in alt format sunt ignorate
function load() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(list) ? list.filter(q => typeof q === 'string') : [];
  } catch { return []; }
}

// salveaza lista; daca stocarea este blocata, aplicatia merge mai departe fara istoric
function save(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* ignora daca stocarea nu este disponibila */ }
}

/**
 * Adauga o cautare la inceputul listei (fara duplicate, maxim MAX intrari).
 * @param {string} query
 */
export function addToHistory(query) {
  save([query, ...load().filter(q => q !== query)].slice(0, MAX));
}

/** Sterge tot istoricul salvat. */
export function clearHistory() {
  try { localStorage.removeItem(KEY); } catch { /* ignora daca stocarea nu este disponibila */ }
}

/**
 * Afiseaza cautarile salvate in lista; click pe o cautare apeleaza onClick(query).
 * @param {HTMLUListElement} listEl
 * @param {(query: string) => void} onClick
 */
export function renderHistory(listEl, onClick) {
  const list = load();
  if (!list.length) {
    const empty = document.createElement('li');
    empty.className = 'history-empty muted small';
    empty.textContent = 'Nu ai facut inca nicio cautare.';
    listEl.replaceChildren(empty);
    return;
  }

  listEl.replaceChildren(...list.map((query) => {
    const title = document.createElement('span');
    title.className = 'history-query';
    title.textContent = query;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'history-item';
    btn.append(title);
    btn.addEventListener('click', () => onClick(query)); // butoanele se recreeaza la fiecare afisare, deci fara listener dublu

    const li = document.createElement('li');
    li.append(btn);
    return li;
  }));
}
