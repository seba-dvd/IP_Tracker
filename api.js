/*api.js - Gestioneaza validarea intrarilor si cererile catre API-ul de geolocalizare */

/* Curata textul introdus de utilizator */
export function cleanQuery(input) {
    return input.trim();
}

/* Valideaza daca textul este un IPv4, IPv6 sau un nume de domeniu valid */
export function classifyQuery(query) {
    const clean = cleanQuery(query);

    // Regex pentru IPv4
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    // Regex simplificat pentru IPv6
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    // Regex pentru domenii web (ex: google.com, github.io)
    const domainRegex = /^([a-zA-Z0-9][-a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;

    if (ipv4Regex.test(clean) || ipv6Regex.test(clean)) {
        return { type: 'ip', value: clean };
    } else if (domainRegex.test(clean)) {
        return { type: 'domain', value: clean };
    } else if (clean === '' || clean === 'localhost' || clean === '127.0.0.1') {
        // Daca e gol, API-ul detecteaza IP-ul utilizatorului curent
        return { type: 'current', value: '' };
    }

    return null; /*Format invalid*/
}

/* Cache pe durata sesiunii (sessionStorage): aceeasi cautare nu mai consuma o cerere noua */
function readCache(key) {
    try { return JSON.parse(sessionStorage.getItem(key)); } catch { return null; }
}
function writeCache(key, data) {
    try { sessionStorage.setItem(key, JSON.stringify(data)); } catch { /* stocare indisponibila */ }
}

/* Apeleaza API-ul ip-api.com (accepta direct IP-uri si domenii) pentru a obtine datele de geolocalizare.
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