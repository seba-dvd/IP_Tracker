/* useHistory.js - cautarile recente, salvate in localStorage ca sa ramana dupa reincarcare (D v2.3.0) */
import { useEffect, useState } from 'react';
import { addQuery, parseHistory } from '../../../shared/history';

const KEY = 'geo-history';

// lista salvata; daca stocarea este blocata, pornim cu o lista goala
function loadSaved() {
  try {
    return parseHistory(localStorage.getItem(KEY));
  } catch {
    return [];
  }
}

export function useHistory() {
  const [items, setItems] = useState(loadSaved); // loadSaved ruleaza o singura data, la pornire

  // dupa fiecare schimbare, lista se salveaza
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      // stocarea poate fi blocata; aplicatia merge mai departe fara salvare
    }
  }, [items]);

  const add = (query) => setItems((prev) => addQuery(prev, query));
  const clear = () => setItems([]);

  return { items, add, clear };
}
