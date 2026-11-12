/* api.js - validarea cautarii si cererea catre ip-api.com, folosite de web si de mobil
   M v2.1.0 (portat din vanilla/api.js, M v1.2.0) */

// Curata textul introdus: scoate protocolul, calea si portul (https://github.com/x -> github.com)
export function cleanQuery(input) {
  let query = input.trim().replace(/^[a-z]+:\/\//i, '').split(/[/?#]/)[0];
  if ((query.match(/:/g) || []).length === 1) query = query.split(':')[0]; // host:port, nu IPv6
  return query.replace(/^\[|\]$/g, ''); // [::1] -> ::1
}

const IPV4 = /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/;
const IPV6 = /^(?:[0-9a-f]{0,4}:){2,7}[0-9a-f]{0,4}$/i;
const DOMAIN = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;

// Tipul cautarii: 'current' (IP-ul propriu), 'ip' sau 'domain'; null daca formatul este invalid
export function classifyQuery(input) {
  const value = cleanQuery(input);
  // textul gol si adresele locale se verifica primele, altfel 127.0.0.1 ar fi un IPv4 obisnuit
  if (value === '' || value === 'localhost' || value === '127.0.0.1') return { type: 'current', value: '' };
  if (IPV4.test(value) || IPV6.test(value)) return { type: 'ip', value };
  if (DOMAIN.test(value)) return { type: 'domain', value };
  return null;
}

const FIELDS = 'status,query,country,regionName,city,lat,lon,timezone,isp,reverse';
const cache = new Map(); // rezultatele deja primite in sesiunea curenta

// Aduce datele pentru un IP sau un domeniu. La orice problema arunca o eroare cu mesaj in romana.
export async function fetchGeoData(input = '') {
  const target = classifyQuery(input);
  if (!target) throw new Error('Format invalid. Introdu o adresa IP sau un domeniu corect.');

  // planul gratuit ip-api.com merge doar prin http; o pagina https ar bloca cererea
  if (globalThis.location?.protocol === 'https:') {
    throw new Error('Serviciul de geolocalizare functioneaza doar cand pagina ruleaza pe http.');
  }
  if (cache.has(target.value)) return cache.get(target.value);

  let response;
  try {
    response = await fetch(`http://ip-api.com/json/${target.value}?fields=${FIELDS}`);
  } catch {
    throw new Error('Eroare de retea. Serviciul nu a putut fi contactat.');
  }
  if (response.status === 429) {
    throw new Error('Prea multe cereri. Asteapta un minut si incearca din nou.');
  }
  if (!response.ok) throw new Error('Eroare de retea. Serviciul nu a putut fi contactat.');

  const data = await response.json();
  if (data.status !== 'success') throw new Error('Nu s-au gasit informatii pentru aceasta cautare.');

  // forma folosita in toata aplicatia, independenta de formatul serviciului
  const result = {
    ip: data.query,
    host: target.type === 'domain' ? target.value : data.reverse || '', // domeniul cautat sau numele invers
    isp: data.isp || '',
    city: data.city || '',
    region: data.regionName || '',
    country: data.country || '',
    timezone: data.timezone || '',
    latitude: data.lat,
    longitude: data.lon,
  };
  cache.set(target.value, result);
  return result;
}
