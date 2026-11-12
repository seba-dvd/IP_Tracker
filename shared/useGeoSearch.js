/* useGeoSearch.js - starea cautarii: rezultatul, eroarea si incarcarea (folosit de web si de mobil)
   M v2.1.0 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchGeoData } from './api';

export function useGeoSearch() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // la pornire se cauta imediat IP-ul propriu
  const lastRequest = useRef(0); // numarul ultimei cereri pornite

  // Trimite cererea. Raspunsul se foloseste doar daca intre timp nu a pornit alta cautare.
  const load = useCallback((query) => {
    const id = ++lastRequest.current;
    const isLatest = () => id === lastRequest.current;

    return fetchGeoData(query)
      .then((data) => {
        if (isLatest()) setResult(data);
        return isLatest();
      })
      .catch((err) => {
        if (isLatest()) setError(err.message);
        return false;
      })
      .finally(() => {
        if (isLatest()) setLoading(false);
      });
  }, []);

  // la pornire: datele pentru IP-ul utilizatorului
  useEffect(() => {
    load('');
  }, [load]);

  // Cautare pornita de utilizator. Intoarce true daca a reusit (App o salveaza atunci in istoric).
  function search(query) {
    setError('');
    setLoading(true);
    return load(query);
  }

  return { result, error, loading, search };
}
