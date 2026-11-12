/* format.js - textele afisate pentru un rezultat, folosite de web si de mobil (R v2.2.0) */

// "Oras, Regiune, Tara", fara campurile lipsa
export function formatLocation({ city, region, country }) {
  return [city, region, country].filter(Boolean).join(', ') || 'Necunoscuta';
}

// data si ora din fusul orar dat, de exemplu "4 nov. 2026, 14:03:22"; text gol daca fusul lipseste
export function formatLocalTime(timeZone, date = new Date()) {
  if (!timeZone) return '';
  try {
    return new Intl.DateTimeFormat('ro-RO', {
      timeZone,
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  } catch {
    return ''; // fus orar necunoscut
  }
}

// campurile din panoul de detalii, in ordinea afisarii (IP-ul este deja in cardul cu rezultatul).
// icon = numele iconitei din setul Ionicons (acelasi pe web si pe mobil), tone = culoarea iconitei,
// numeric = cifre tabulare
export function detailFields(result, clock) {
  return [
    { label: 'Domeniu / hostname', value: result.host || 'Indisponibil', icon: 'server-outline', tone: 'teal' },
    { label: 'ISP', value: result.isp || 'Necunoscut', icon: 'business-outline', tone: 'coral' },
    { label: 'Locatie aproximativa', value: formatLocation(result), icon: 'location-outline', tone: 'amber' },
    { label: 'Fus orar', value: result.timezone || 'Necunoscut', icon: 'earth-outline', tone: 'blue' },
    { label: 'Data si ora locala', value: clock || 'Necunoscuta', icon: 'time-outline', tone: 'plum', numeric: true },
  ];
}
