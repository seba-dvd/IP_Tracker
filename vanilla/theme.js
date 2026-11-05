/* theme.js - comutator tema intunecata / luminoasa, salvat in localStorage
   M v1.0.0 - vezi docs/jurnal-M.md */

const KEY = 'geo-theme';
const root = document.documentElement;

// pune / scoate clasa dark-theme pe <html> si actualizeaza aria-pressed pe buton
function apply(theme, button) {
  root.classList.toggle('dark-theme', theme === 'dark');
  button?.setAttribute('aria-pressed', String(theme === 'dark'));
}

/**
 * Initializeaza tema de culori din localStorage sau din preferinta sistemului
 * si ataseaza evenimentul de click pe butonul de comutare.
 * @param {HTMLButtonElement} button
 */
export function initTheme(button) {
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch { /* ignora daca stocarea nu este disponibila */ }
  const theme = saved || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  apply(theme, button);

  button.addEventListener('click', () => {
    const next = root.classList.contains('dark-theme') ? 'light' : 'dark';
    apply(next, button);
    try { localStorage.setItem(KEY, next); } catch { /* ignora daca stocarea nu este disponibila */ }
  });
}