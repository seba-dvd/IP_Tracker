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

/* Apeleaza API-ul ipwho.is pentru a obtine datele de geolocalizare */
export async function fetchGeoData(query = '') {
    const validated = classifyQuery(query);
    
    if (!validated && query !== '') {
        throw new Error('Format invalid. Introdu o adresa IP sau un domeniu corect.');
    }

    const target = validated ? validated.value : '';
    const url = `https://ipwho.is/${target}`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Eroare de retea. Serviciul nu putut fi contactat.');
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Nu s-au gasit informatii pentru aceasta cautare.');
        }

        return data;
    } catch (error) {
        console.error('Eroare la preluarea datelor:', error);
        throw error;
    }
}