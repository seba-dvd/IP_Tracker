/* history.js - logica listei de cautari recente, folosita de web si de mobil (D v2.3.0)
   Salvarea propriu-zisa (localStorage / AsyncStorage) se face in useHistory, in fiecare aplicatie. */

export const MAX_RECENT = 5;

// pune cautarea prima, scoate dublura si pastreaza cel mult MAX_RECENT intrari
export function addQuery(list, query) {
  return [query, ...list.filter((item) => item !== query)].slice(0, MAX_RECENT);
}

// transforma textul salvat inapoi in lista; datele lipsa sau stricate devin o lista goala
export function parseHistory(raw) {
  try {
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    return list.filter((item) => typeof item === 'string').slice(0, MAX_RECENT);
  } catch {
    return [];
  }
}