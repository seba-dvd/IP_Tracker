/*api.js - Gestioneaza validarea intrarilor si cererile catre API-ul de geolocalizare
  M v1.1.0 (ipwho.is), refacut in M v1.2.0 (ip-api.com, cache, validare stricta) - vezi docs/jurnal-M.md */

/* M v1.2.0: Curata textul introdus: scoate protocolul, calea si portul (https://github.com/x -> github.com) */
export function cleanQuery(input) {
    let q = input.trim().replace(/^[a-z]+:\/\//i, '').split(/[/?#]/)[0];
    if ((q.match(/:/g) || []).length === 1) q = q.split(':')[0]; // host:port (nu IPv6)
    return q.replace(/^\[|\]$/g, '');                              // [::1] -> ::1
}

/* M v1.2.0: Valideaza daca textul este un IPv4, IPv6 sau un nume de domeniu valid */
export function classifyQuery(query) {
    const clean = cleanQuery(query);

    // Gol sau adresa locala: API-ul detecteaza IP-ul utilizatorului curent
    // (verificat primul, altfel 127.0.0.1 ar fi tratat ca IPv4 obisnuit)
    if (clean === '' || clean === 'localhost' || clean === '127.0.0.1') {
        return { type: 'current', value: '' };
    }

    // IPv4: fiecare numar trebuie sa fie intre 0 si 255
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/;
    // IPv6, inclusiv forma prescurtata (ex: 2001:db8::1)
    const ipv6Regex = /^(?:[0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
    // Domenii web (ex: google.com, github.io)
    const domainRegex = /^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;

    if (ipv4Regex.test(clean) || ipv6Regex.test(clean)) {
        return { type: 'ip', value: clean };
    } else if (domainRegex.test(clean)) {
        return { type: 'domain', value: clean };
    }

    return null; /*Format invalid*/
}

/* M v1.2.0: Cache pe durata sesiunii (sessionStorage): aceeasi cautare nu mai consuma o cerere noua */
function readCache(key) {
    try { return JSON.parse(sessionStorage.getItem(key)); } catch { return null; }
}
function writeCache(key, data) {
    try { sessionStorage.setItem(key, JSON.stringify(data)); } catch { /* stocare indisponibila */ }
}

/* M v1.2.0: Apeleaza API-ul ip-api.com (accepta direct IP-uri si domenii) pentru a obtine datele de geolocalizare.
   Raspunsul este adus la forma { ip, city, region, country, latitude, longitude, timezone: { id }, connection: { isp } },
   ca restul aplicatiei (detalii, harta) sa nu depinda de formatul serviciului. */
export async function fetchGeoData(query = '') {
    const validated = classifyQuery(query);

    if (!validated && query !== '') {
        throw new Error('Format invalid. Introdu o adresa IP sau un domeniu corect.');
    }

    try {
        const target = validated ? validated.value : '';

        // planul gratuit ip-api.com este doar HTTP; pe o pagina https browserul blocheaza cererea
        if (location.protocol === 'https:') {
            throw new Error('Serviciul de geolocalizare functioneaza doar cand pagina ruleaza pe http (ex. Live Server).');
        }

        const cacheKey = `geo-cache:${target}`;
        const cached = readCache(cacheKey);
        if (cached) return cached;

        const fields = 'status,message,query,country,regionName,city,lat,lon,timezone,isp';
        let response;
        try {
            response = await fetch(`http://ip-api.com/json/${target}?fields=${fields}`);
        } catch {
            throw new Error('Eroare de retea. Serviciul nu a putut fi contactat.');
        }

        if (response.status === 429) {
            throw new Error('Prea multe cereri catre serviciul de geolocalizare. Asteapta un minut si incearca din nou.');
        }

        if (!response.ok) {
            throw new Error('Eroare de retea. Serviciul nu a putut fi contactat.');
        }

        const d = await response.json();

        if (d.status !== 'success') {
            throw new Error('Nu s-au gasit informatii pentru aceasta cautare.');
        }

        const data = {
            success: true,
            ip: d.query,
            city: d.city,
            region: d.regionName,
            country: d.country,
            latitude: d.lat,
            longitude: d.lon,
            timezone: { id: d.timezone },
            connection: { isp: d.isp }
        };

        writeCache(cacheKey, data);
        return data;
    } catch (error) {
        console.error('Eroare la preluarea datelor:', error);
        throw error;
    }
}