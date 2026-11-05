/* useHistory.js - VERSIUNE TEMPORARA din schelet (M v2.0.0): lista ramane doar in memorie.
   D o salveaza in localStorage in v2.3.0. */
import { useState } from 'react';

export function useHistory() {
  const [items, setItems] = useState([]);
  const add = (query) => setItems((prev) => [query, ...prev.filter((q) => q !== query)]);
  const clear = () => setItems([]);
  return { items, add, clear };
}
