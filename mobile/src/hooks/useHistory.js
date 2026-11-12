/* useHistory.js - cautarile recente, salvate in AsyncStorage ca sa ramana dupa repornire (D v2.3.0) */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { addQuery, parseHistory } from '../../../shared/history';

const KEY = 'geo-history';

export function useHistory() {
  const [items, setItems] = useState(null); // null = lista salvata nu a fost citita inca

  // la pornire citim lista salvata (AsyncStorage raspunde asincron, printr-un Promise)
  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => setItems(parseHistory(raw)));
  }, []);

  // dupa fiecare schimbare salvam lista, dar nu inainte de citire, ca sa nu o stergem pe cea veche
  useEffect(() => {
    if (items !== null) AsyncStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const add = (query) => setItems((prev) => addQuery(prev ?? [], query));
  const clear = () => setItems([]);

  return { items: items ?? [], add, clear };
}
