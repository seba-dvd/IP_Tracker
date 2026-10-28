const $ = id => document.getElementById(id);
let clockTimer = null;

export function setLoading(on) {
  const d = $('dashboard');
  d.classList.toggle('is-loading', on);
  d.setAttribute('aria-busy', String(on));
}

function startClock(timeZone) {
  clearInterval(clockTimer);
  if (!timeZone) { $('d-time').textContent = ''; return; }
  const fmt = new Intl.DateTimeFormat([], { timeZone, dateStyle: 'medium', timeStyle: 'medium' });
  const tick = () => { $('d-time').textContent = `Ora locala: ${fmt.format(new Date())}`; };
  tick();
  clockTimer = setInterval(tick, 1000);
}

export function renderDetails(data, query = '') {
  const where = [data.city, data.region, data.country].filter(Boolean).join(', ');
  $('d-ip').textContent = query && query !== data.ip ? `${data.ip} (${query})` : data.ip;
  $('d-location').textContent = where || 'Necunoscut';
  $('d-timezone').textContent = data.timezone?.id || 'Necunoscut';
  $('d-isp').textContent = data.connection?.isp || 'Necunoscut';
  startClock(data.timezone?.id);
}