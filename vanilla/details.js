/* details.js - cardul "Detalii retea": adresa IP, locatie, fus orar cu ora locala, ISP
   R v1.3.0 - vezi docs/jurnal-R.md */

const $ = id => document.getElementById(id);
let clockTimer = null; // ceasul pornit pentru locatia afisata; oprit la fiecare cautare noua

// porneste / opreste animatia de incarcare (clasa is-loading, stilizata in styles.css la R v1.3.0)
export function setLoading(on) {
  const d = $('dashboard');
  d.classList.toggle('is-loading', on);
  d.setAttribute('aria-busy', String(on));
}

// ora locala a locatiei gasite (dupa fusul ei orar), actualizata in fiecare secunda
function startClock(timeZone) {
  clearInterval(clockTimer);
  if (!timeZone) { $('d-time').textContent = ''; return; }
  const fmt = new Intl.DateTimeFormat([], { timeZone, dateStyle: 'medium', timeStyle: 'medium' });
  const tick = () => { $('d-time').textContent = `Ora locala: ${fmt.format(new Date())}`; };
  tick();
  clockTimer = setInterval(tick, 1000);
}

// completeaza cardul; textul cautat apare intre paranteze daca difera de IP (ex. 140.82.121.4 (github.com))
export function renderDetails(data, query = '') {
  const where = [data.city, data.region, data.country].filter(Boolean).join(', ');
  $('d-ip').textContent = query && query !== data.ip ? `${data.ip} (${query})` : data.ip;
  $('d-location').textContent = where || 'Necunoscut';
  $('d-timezone').textContent = data.timezone?.id || 'Necunoscut';
  $('d-isp').textContent = data.connection?.isp || 'Necunoscut';
  startClock(data.timezone?.id);
}
