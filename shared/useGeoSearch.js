/* useGeoSearch.js - VERSIUNE TEMPORARA din schelet (M v2.0.0); M o inlocuieste in v2.1.0.
   Intoarce mereu datele de proba de mai jos, ca R si D sa poata lucra fara API. */
const SAMPLE = {
  ip: '8.8.8.8',
  host: 'dns.google',
  isp: 'Google LLC',
  city: 'Ashburn',
  region: 'Virginia',
  country: 'United States',
  timezone: 'America/New_York',
  latitude: 39.03,
  longitude: -77.5,
};

export function useGeoSearch() {
  const search = async () => true; // simuleaza o cautare reusita
  return { result: SAMPLE, error: '', loading: false, search };
}
