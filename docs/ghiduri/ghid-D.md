# Ghid D - istoricul, asezarea in pagina si documentatia

|          |                                                                                                                                                                                                           |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GitHub   | seba-dvd                                                                                                                                                                                                  |
| Branch   | `D`                                                                                                                                                                                                     |
| Versiune | v2.3.0                                                                                                                                                                                                    |
| Fisiere  | `shared/history.js`, `web/tests/history.test.js`; web: `useHistory`, `RecentSearches` (cu `.css`), `App.css`; mobil: `useHistory`, `RecentSearches`, `Panel`, `App.js`; `README.md` |

Citeste mai intai [ghidul comun](README.md), mai ales sectiunile 2-4 (structura si contractul) si 9 (designul teal si coral). Este aceeasi zona ca in v1.4.0 (istoricul, responsive-ul, legarea si documentatia), acum in React si React Native.

| Task | Ce faci                                                                        | Dificultate |
| ---- | ------------------------------------------------------------------------------ | ----------- |
| D1   | `shared/history.js`: logica listei de cautari recente + teste                | usor        |
| D2   | web: `useHistory` (localStorage) si `RecentSearches` (pastile)             | mediu       |
| D3   | web: `App.css`, cardurile si asezarea paginii pe desktop, tableta si telefon | greu        |
| D4   | mobil: `useHistory` (AsyncStorage) si `RecentSearches` (pastile)           | mediu       |
| D5   | mobil: `App.js` si `Panel`, cardurile si asezarea ecranului                | mediu       |
| D6   | `README.md` pentru etapa 2 si verificarea finala pe `main`                 | mediu       |

**Ce primesti de la ceilalti (si nu modifici):** `App.jsx` (structura din schelet, M); `useGeoSearch`, variabilele CSS si clasele din `index.css` (M); componentele lui R (le pui in carduri, fara sa le schimbi); `useTheme()` si `theme.js` pe mobil (M).

---

## Ce instalezi si cum pornesti

1. Instalezi uneltele din ghidul comun, sectiunea 6: Git Bash, Node.js LTS, VS Code, Expo Go pe telefon.

   ```bash
   git --version
   node -v
   npm -v
   ```
2. Dupa ce M anunta ca scheletul v2.0.0 este pe `main`:

   ```bash
   cd /c/calea/catre/IP_Tracker
   git checkout D
   git fetch origin
   git merge origin/main
   cd web
   npm install
   cd ../mobile
   npm install
   cd ..
   ```
3. Pornesti aplicatiile (in doua terminale):

   ```bash
   cd web
   npm run dev
   ```

   ```bash
   cd mobile
   npx expo start
   ```

**Date de proba:** pana cand M termina API-ul, orice text cautat "reuseste" (versiunea temporara a lui `useGeoSearch` raspunde `true`), deci il vezi imediat in lista de cautari recente. Asa iti poti testa istoricul fara internet si fara API.

---

## D1. Logica istoricului: `shared/history.js` [usor]

**Scop:** regulile listei (cautarea noua prima, fara dubluri, maxim 5) si citirea sigura a listei salvate, scrise o singura data pentru web si mobil.

**Fisiere:** `shared/history.js` (nou), `web/tests/history.test.js` (nou; VS Code creeaza si folderul `tests` daca lipseste).

### `shared/history.js`

```js
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
```

### `web/tests/history.test.js`

```js
/* history.test.js - teste pentru shared/history.js (D v2.3.0) */
import { describe, expect, it } from 'vitest';
import { addQuery, parseHistory } from '../../shared/history';

describe('addQuery', () => {
  it('pune cautarea noua prima', () => {
    expect(addQuery(['1.1.1.1'], '8.8.8.8')).toEqual(['8.8.8.8', '1.1.1.1']);
  });

  it('muta o cautare repetata in fata, fara dubluri', () => {
    expect(addQuery(['a.com', 'b.com', 'c.com'], 'c.com')).toEqual(['c.com', 'a.com', 'b.com']);
  });

  it('pastreaza cel mult 5 cautari', () => {
    expect(addQuery(['1', '2', '3', '4', '5'], '6')).toEqual(['6', '1', '2', '3', '4']);
  });
});

describe('parseHistory', () => {
  it('citeste o lista salvata corect', () => {
    expect(parseHistory('["github.com","8.8.8.8"]')).toEqual(['github.com', '8.8.8.8']);
  });

  it('ignora datele lipsa sau stricate', () => {
    expect(parseHistory(null)).toEqual([]);
    expect(parseHistory('{nu este json')).toEqual([]);
    expect(parseHistory('[1, "ok", null]')).toEqual(['ok']);
  });
});
```

### Explicatie (pentru prezentare)

- Sunt regulile din `history.js` (v1.4.0), separate de salvare: `addQuery` primeste lista veche si intoarce una noua, fara sa o modifice pe cea veche. In React, state-ul nu se modifica pe loc, ci se inlocuieste cu o valoare noua, iar `addQuery` face exact asta.
- `[query, ...list.filter(...)]` pune cautarea prima si scoate aparitia ei veche; `slice(0, MAX_RECENT)` taie lista la 5.
- `parseHistory` transforma textul salvat (JSON) inapoi in lista. Daca lipseste (`null`), este stricat sau contine altceva decat texte, intoarce o lista goala sau doar textele bune, ca in v1.4.0.
- Fiind functii fara React si fara salvare (functii "pure"), se testeaza usor si se folosesc identic pe web si pe mobil.

### Testare

```bash
cd web
npm test
```

Cele 5 teste din `history.test.js` trebuie sa treaca.

### Commit

```bash
cd ..
git add shared/history.js web/tests/history.test.js
git commit -m "feat(shared): logica istoricului de cautari, cu teste"
git push origin D
```

---

## D2. Web: istoricul salvat si cautarile recente ca pastile [mediu]

**Scop:** istoricul pastrat in `localStorage` intre vizite si lista de cautari recente ca pastile teal deschis, cu iconita de reluare si "Sterge tot" ca link.

**Fisiere:** `web/src/hooks/useHistory.js` (inlocuiesti), `web/src/components/RecentSearches.jsx` (inlocuiesti), `web/src/components/RecentSearches.css` (nou).

### `web/src/hooks/useHistory.js`

```js
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
```

### `web/src/components/RecentSearches.jsx`

```jsx
/* RecentSearches.jsx - cautarile recente, ca pastile; un click pe una o reface (D v2.3.0) */
import { IoRefreshOutline } from 'react-icons/io5';
import './RecentSearches.css';

export default function RecentSearches({ items, onSelect, onClear }) {
  return (
    <>
      <div className="recent-head">
        <h2 className="section-title">Cautari recente</h2>
        {items.length > 0 && (
          <button type="button" className="link-btn" onClick={onClear}>Sterge tot</button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="label">Nu ai facut inca nicio cautare.</p>
      ) : (
        <ul className="recent-list">
          {items.map((query) => (
            <li key={query}>
              <button type="button" className="recent-chip" onClick={() => onSelect(query)}>
                <IoRefreshOutline aria-hidden="true" />
                <span>{query}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
```

### `web/src/components/RecentSearches.css`

```css
/* RecentSearches.css - titlul cu "Sterge tot" si cautarile ca pastile (D v2.3.0) */
.recent-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 28px;
  margin-bottom: 10px;
}

/* "Sterge tot" arata ca un link: text teal, fara fundal */
.link-btn {
  padding: 4px 8px;
  border: 0;
  border-radius: 8px;
  background: none;
  color: var(--primary-text);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.link-btn:hover { background: var(--primary-soft); }

.recent-list { display: flex; flex-wrap: wrap; gap: 8px; }
.recent-list li { min-width: 0; max-width: 100%; }
.recent-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  height: 36px;
  padding: 0 14px;
  border: 0;
  border-radius: 999px; /* pastila */
  background: var(--primary-soft);
  color: var(--text);
  font-size: 14px;
  cursor: pointer;
}
.recent-chip svg { flex: none; color: var(--primary-text); }
.recent-chip span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.recent-chip:hover { box-shadow: inset 0 0 0 1px var(--primary-text); }
```

### Explicatie (pentru prezentare)

- **`useState(loadSaved)`:** primeste functia, nu rezultatul ei. React o apeleaza o singura data, la prima afisare (initializare "lazy"), deci `localStorage` nu se citeste la fiecare redesenare.
- **Salvarea intr-un efect:** `useEffect(..., [items])` ruleaza dupa fiecare schimbare a listei si o scrie in `localStorage`. Asa `add` si `clear` doar schimba state-ul, iar salvarea este intr-un singur loc. `try / catch` pastreaza comportamentul din v1: daca stocarea este blocata, aplicatia merge mai departe.
- **`setItems((prev) => addQuery(prev, query))`:** forma cu functie primeste mereu lista cea mai noua, chiar daca `add` este apelata dupa un `await` (cum face `App` dupa o cautare).
- **Pastilele:** lista este un rand care se rupe pe mai multe randuri (`flex-wrap: wrap`), cu 8px intre pastile. Fiecare pastila este un `button` (merge si din tastatura) cu iconita de reluare din `react-icons` (setul Ionicons, ca pe mobil) si textul cautarii; un text prea lung se termina cu "..." (`text-overflow: ellipsis`). Fundalul teal foarte deschis (`--primary-soft`) leaga lista de restul designului.
- **Click:** apeleaza `onSelect(query)`; `App` pune textul in bara de cautare si reface cautarea. Textul este afisat de React ca text, nu ca HTML, deci nu poate injecta cod (in v1 foloseam `textContent` pentru acelasi motiv).
- **`key={query}`:** cautarile sunt unice in lista (fara dubluri), deci textul poate fi cheia.

### Testare

- Cauti cateva texte: apar primele, ca pastile, fara dubluri, maxim 5. Click pe una: textul apare in bara de cautare si pastila urca prima.
- Reload: lista ramane. DevTools -> Application -> Local Storage: cheia `geo-history`.
- "Sterge tot": lista se goleste si apare mesajul "Nu ai facut inca nicio cautare."

### Commit

```bash
git add web/src/hooks/useHistory.js web/src/components/RecentSearches.jsx web/src/components/RecentSearches.css
git commit -m "feat(web): istoricul salvat in localStorage si cautarile recente ca pastile"
git push origin D
```

---

## D3. Web: cardurile si asezarea paginii, `App.css` [greu]

**Scop:** asezarea din specificatie, cu cardurile noului design. Desktop: continut de 1200px la 1280px, harta 840px, coloana de carduri de 336px, zona principala de inaltimea ecranului. Pana la 900px: o coloana. Pana la 640px: dimensiunile pentru telefon.

**Fisiere:** `web/src/App.css` (inlocuiesti tot continutul). `App.jsx` ramane cum l-a facut M: containerele de care ai nevoie sunt deja acolo (`.app`, `.error`, `.layout`, `.map-panel`, `.sidebar`, `.section`, `.summary`, `.details`, `.recent`).

```css
/* App.css - asezarea paginii (D v2.3.0)
   Desktop (de exemplu 1280 x 625): continut de 1200px, margini de 40px, harta 840px | 24px | carduri 336px.
   Cardurile au colturi de 16px si o umbra fina. Pana la 900px: o coloana. Pana la 640px: telefon. */

.app {
  width: min(1440px, 100% - 80px); /* cel mult 1440px si cel putin 40px liberi pe fiecare parte */
  margin: 0 auto;
  padding: 24px 0;
}

.error {
  margin-top: 24px;
  padding: 12px 16px;
  border-radius: var(--radius-control);
  background: var(--danger-bg);
  color: var(--danger);
  font-weight: 500;
}

/* zona principala: harta in stanga, coloana de carduri in dreapta */
.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 336px;
  gap: 24px;
  margin-top: 24px;
  height: calc(100dvh - 116px); /* ecranul minus 24 sus, 44 antetul, 24 spatiul si 24 jos */
  min-height: 460px;
}

/* cardurile: alb, colturi de 16px, bordura fina si umbra moale */
.map-panel,
.section {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: var(--radius-panel);
  box-shadow: var(--shadow);
}
.map-panel { overflow: hidden; } /* colturile rotunjite taie si harta */

/* coloana din dreapta: carduri separate; daca nu incap, coloana are scroll propriu */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  padding-bottom: 8px; /* loc pentru umbra ultimului card */
  scrollbar-width: thin;
}
.section { flex: none; padding: 20px; }

/* cardul cu rezultatul este plin, in culoarea principala */
.summary { background: var(--primary); border-color: transparent; color: var(--on-primary); }

/* tableta: o singura coloana, in ordinea rezumat, harta, detalii, cautari recente */
@media (max-width: 900px) {
  .layout {
    display: flex;
    flex-direction: column;
    height: auto;
    min-height: 0;
  }
  .sidebar { display: contents; } /* cardurile devin elemente separate ale coloanei */
  .summary { order: 1; }
  .map-panel { order: 2; }
  .details { order: 3; }
  .recent { order: 4; }
}

/* telefon (390px): margini, spatii si padding de 16px */
@media (max-width: 640px) {
  .app { width: auto; padding: 16px; }
  .error,
  .layout { margin-top: 16px; }
  .layout { gap: 16px; }
  .section { padding: 16px; }
}
```

### Explicatie (pentru prezentare)

- **Containerul:** `width: min(1440px, 100% - 80px)` inseamna "cel mult 1440px, dar lasa mereu cel putin 40px pe fiecare parte". La 1280px: 1280 - 80 = 1200px, deci exact marginile de 40px din specificatie. `margin: 0 auto` il centreaza pe orizontala; pe verticala pagina ramane lipita sus, la 24px.
- **Grila:** doua coloane, `minmax(0, 1fr)` pentru harta (tot ce ramane) si 336px pentru carduri, cu 24px intre ele: 1200 - 336 - 24 = 840px pentru harta. `minmax(0, ...)` lasa coloana sa se micsoreze fara sa iasa din pagina.
- **Inaltimea:** `calc(100dvh - 116px)`: 116 = 24 (sus) + 44 (antet) + 24 (spatiu) + 24 (jos). La 625px inaltime: 625 - 116 = 509px, ca in specificatie. `dvh` tine cont de barele browserului de pe telefon. `min-height: 460px` impiedica o harta prea mica pe ecrane joase.
- **Cardurile:** harta si fiecare sectiune sunt carduri albe cu colturi de 16px (`--radius-panel`), o bordura foarte fina si o umbra moale (`--shadow`), toate variabile de la M. Asa designul nu mai pare "din cutii": cardurile par usor ridicate deasupra fundalului crem. `overflow: hidden` pe harta face ca si harta sa urmeze colturile rotunjite.
- **Cardul cu rezultatul:** `.summary` primeste fundalul plin teal (`--primary`) si textul alb; continutul il deseneaza R. Este singurul card colorat, deci atrage privirea primul.
- **Coloana din dreapta:** cardurile sunt separate, cu 16px intre ele (`gap`). Daca nu incap in inaltimea ecranului, coloana are scroll propriu, iar harta ramane fixa. Umbra are `spread` negativ, deci nu iese in lateral si nu este taiata de scroll; `padding-bottom` lasa loc umbrei ultimului card.
- **Tableta (pana la 900px):** `display: contents` face ca `.sidebar` sa "dispara" din asezare, iar cardurile lui devin elemente ale coloanei, la fel ca harta. Asa `order` le poate aranja in ordinea din specificatie: rezumat, harta, detalii, cautari recente. Inaltimea nu mai este fixa: pagina are scroll normal.
- **Telefon (pana la 640px):** margini, spatii si padding de 16px; antetul si harta de 280px sunt facute de M si R in fisierele lor.
- Componentele lui R si D nu au fundal sau bordura proprie; cardurile vin doar din acest fisier, deci asezarea se poate schimba fara sa atingi componentele.

### Testare

DevTools (F12 -> Ctrl+Shift+M):

- 1280 x 625: `.app` are 1200px si incepe la x = 40; antetul la y = 24; zona principala la y = 92, inalta de 509px; harta 840px, coloana de carduri 336px la x = 904; pagina fara scroll (coloana din dreapta poate avea scroll propriu).
- 800px: o coloana, cu margini de 40px, in ordinea rezumat, harta, detalii, cautari recente.
- 390 x 844: margini de 16px, latime 358px, 16px intre carduri, harta de 280px (dupa R4), fara scroll orizontal.
- Un text invalid (dupa API-ul lui M): mesajul apare sub antet, intr-un dreptunghi rotunjit, rosu deschis.

Inainte ca R sa-si termine componentele, poti verifica asezarea cu versiunile temporare: masuratorile cardurilor sunt aceleasi.

### Commit

```bash
git add web/src/App.css
git commit -m "style(web): cardurile si asezarea paginii pe desktop, tableta si telefon"
git push origin D
```

---

## D4. Mobil: istoricul salvat si cautarile recente ca pastile [mediu]

**Scop:** acelasi istoric pe telefon, salvat cu AsyncStorage, si aceleasi pastile.

**Fisiere:** `mobile/src/hooks/useHistory.js` (inlocuiesti), `mobile/src/components/RecentSearches.js` (inlocuiesti).

### `mobile/src/hooks/useHistory.js`

```js
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
```

### `mobile/src/components/RecentSearches.js`

```jsx
/* RecentSearches.js - cautarile recente, ca pastile; o apasare reface cautarea (D v2.3.0) */
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { type } from '../theme';
import { useTheme } from '../ThemeContext';

export default function RecentSearches({ items, onSelect, onClear }) {
  const { colors } = useTheme();

  return (
    <View>
      <View style={styles.head}>
        <Text style={[type.title, { color: colors.text }]}>Cautari recente</Text>
        {items.length > 0 && (
          <Pressable onPress={onClear} accessibilityRole="button" hitSlop={8}>
            <Text style={[styles.link, { color: colors.primaryText }]}>Sterge tot</Text>
          </Pressable>
        )}
      </View>

      {items.length === 0 ? (
        <Text style={[type.label, { color: colors.muted }]}>Nu ai facut inca nicio cautare.</Text>
      ) : (
        <View style={styles.chips}>
          {items.map((query) => (
            <Pressable
              key={query}
              onPress={() => onSelect(query)}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.chip,
                { backgroundColor: colors.primarySoft },
                pressed && styles.pressed, // usor transparenta cat timp e apasata
              ]}
            >
              <Ionicons name="refresh-outline" size={16} color={colors.primaryText} />
              <Text numberOfLines={1} style={[styles.chipText, { color: colors.text }]}>{query}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  link: { fontSize: 13, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    maxWidth: '100%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    borderRadius: 999, // pastila
  },
  chipText: { flexShrink: 1, fontSize: 14 },
  pressed: { opacity: 0.7 },
});
```

### Explicatie (pentru prezentare)

- **AsyncStorage fata de localStorage:** pe telefon, citirea si scrierea sunt asincrone (intorc un Promise), ca sa nu blocheze interfata. Deci lista salvata nu exista la prima afisare: o citim intr-un efect si o punem in state cand soseste.
- **De ce `null` la inceput?** `null` inseamna "inca nu am citit". Al doilea efect salveaza doar cand `items` nu este `null`; altfel, la prima afisare ar scrie o lista goala peste cea salvata, inainte ca citirea sa se termine. Spre exterior hook-ul intoarce mereu o lista (`items ?? []`), deci `App` si `RecentSearches` nu trebuie sa stie de `null`.
- **Aceeasi logica:** `addQuery` si `parseHistory` sunt cele din `shared/history.js`, ca pe web.
- **Pastilele:** un `View` cu `flexDirection: 'row'` si `flexWrap: 'wrap'` le aseaza pe randuri; fiecare are 40px inaltime (usor de atins cu degetul), colturi complet rotunjite (`borderRadius: 999`) si iconita de reluare din Ionicons. `numberOfLines={1}` si `flexShrink: 1` taie textele prea lungi cu "...".
- **`Pressable`:** `style` poate fi o functie care primeste `{ pressed }`, deci pastila devine usor transparenta cat timp este apasata. `hitSlop={8}` mareste zona de atingere a linkului "Sterge tot".
- **`items.length > 0 && ...`:** conditia este booleana. Cu `items.length && ...`, pentru o lista goala React Native ar incerca sa afiseze cifra 0 in afara unui `Text`, ceea ce da eroare.

### Testare

- In Expo Go: cauti cateva texte; apar primele, ca pastile, fara dubluri, maxim 5. O apasare pe una o pune in bara de cautare.
- Apesi `r` in terminalul Expo (reincarcare): lista ramane.
- "Sterge tot" goleste lista.

### Commit

```bash
git add mobile/src/hooks/useHistory.js mobile/src/components/RecentSearches.js
git commit -m "feat(mobile): istoricul salvat in AsyncStorage si cautarile recente ca pastile"
git push origin D
```

---

## D5. Mobil: cardurile si asezarea ecranului, `App.js` si `Panel` [mediu]

**Scop:** zona sigura (sub bara de stare si notch), bara de stare in culorile temei, sectiunile in carduri rotunjite cu umbra (cardul cu rezultatul in teal), in ordinea din specificatie, cu 16px margini si spatii.

**Fisiere:** `mobile/src/components/Panel.js` (nou), `mobile/App.js` (inlocuiesti tot continutul).

### `mobile/src/components/Panel.js`

```jsx
/* Panel.js - cardul aplicatiei: colturi de 16px, bordura fina si umbra moale (D v2.3.0)
   variant="primary" = card plin teal (pentru rezultat); flush = fara padding (pentru harta). */
import { StyleSheet, View } from 'react-native';
import { radius, space } from '../theme';
import { useTheme } from '../ThemeContext';

export default function Panel({ children, variant = 'default', flush = false }) {
  const { colors } = useTheme();
  const background = variant === 'primary' ? colors.primary : colors.panel;
  const border = variant === 'primary' ? colors.primary : colors.border;

  return (
    <View
      style={[
        styles.panel,
        { backgroundColor: background, borderColor: border, boxShadow: colors.shadow },
        flush && styles.flush,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { borderWidth: 1, borderRadius: radius.panel, padding: space.panel },
  flush: { padding: 0, overflow: 'hidden' }, // harta umple cardul, iar colturile o taie
});
```

### `mobile/App.js`

```jsx
/* App.js - ecranul aplicatiei mobile: starea cautarii, istoricul si ordinea sectiunilor
   M v2.0.0 (structura); D v2.3.0 (zona sigura, bara de stare, cardurile si spatiile)
   Ordinea din specificatie: antet, cautare, rezumat, harta, detalii, cautari recente. */
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useGeoSearch } from '../shared/useGeoSearch';
import DetailsPanel from './src/components/DetailsPanel';
import Header from './src/components/Header';
import MapPanel from './src/components/MapPanel';
import Panel from './src/components/Panel';
import RecentSearches from './src/components/RecentSearches';
import ResultSummary from './src/components/ResultSummary';
import SearchBar from './src/components/SearchBar';
import { useHistory } from './src/hooks/useHistory';
import { radius, space } from './src/theme';
import { ThemeProvider, useTheme } from './src/ThemeContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Screen />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function Screen() {
  const { colors, isDark } = useTheme();
  const { result, error, loading, search } = useGeoSearch();
  const history = useHistory();
  const [text, setText] = useState(''); // textul din bara de cautare

  // cauta textul dat; daca reuseste, il pune primul in istoric
  async function runSearch(query) {
    setText(query);
    const ok = await search(query);
    if (ok && query.trim()) history.add(query.trim());
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.bg }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Header />
        <SearchBar value={text} onChange={setText} onSubmit={() => runSearch(text)} />
        {error ? (
          <Text style={[styles.error, { color: colors.danger, backgroundColor: colors.dangerBg }]}>{error}</Text>
        ) : null}
        <Panel variant="primary">
          <ResultSummary result={result} loading={loading} />
        </Panel>
        <Panel flush>
          <MapPanel result={result} loading={loading} />
        </Panel>
        <Panel>
          <DetailsPanel result={result} loading={loading} />
        </Panel>
        <Panel>
          <RecentSearches items={history.items} onSelect={runSearch} onClear={history.clear} />
        </Panel>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: space.page, gap: space.gap }, // margini si spatii de 16px
  error: { padding: 12, borderRadius: radius.control, overflow: 'hidden', fontWeight: '500' },
});
```

### Explicatie (pentru prezentare)

- **`App` si `Screen`:** `App` pune "furnizorii": `SafeAreaProvider` (masoara zonele ocupate de notch si bara de stare) si `ThemeProvider` (culorile, de la M). `Screen` este in interiorul lor, deci poate folosi `useTheme()`. Un hook care citeste un context functioneaza doar sub provider-ul lui.
- **`SafeAreaView`** adauga spatiu sus si jos exact cat ocupa bara de stare, notch-ul sau bara de gesturi, pe orice telefon (inlocuieste `paddingTop: 56` din schelet). Vine din `react-native-safe-area-context`, inclus in Expo Go.
- **`StatusBar`** (din `expo-status-bar`): iconitele barei de stare devin deschise pe tema intunecata si inchise pe cea luminoasa, ca sa se vada mereu.
- **`ScrollView`:** ecranul are scroll vertical normal, fara inaltime fixa (cerinta din specificatie). `keyboardShouldPersistTaps="handled"` face ca o apasare pe "Cauta" sau pe o pastila sa functioneze din prima, chiar daca tastatura este deschisa.
- **`Panel`:** cardul cu colturi de 16px, bordura fina si umbra moale. `boxShadow` primeste acelasi tip de text ca in CSS (`'0 6px 16px rgba(...)'`) si functioneaza pe Android si pe iOS (React Native 0.76+, folosit de Expo Go). `variant="primary"` face cardul plin teal, pentru rezultat; `flush` scoate padding-ul, ca harta sa umple cardul.
- **De ce `overflow: 'hidden'` doar la harta?** Taie harta dupa colturile rotunjite. Pe iOS, `overflow: 'hidden'` poate taia si umbra, asa ca nu il punem pe celelalte carduri, unde nu e nevoie.
- **Ordinea si spatiile:** antet, cautare, rezumat, harta, detalii, cautari recente; `padding: space.page` (16px) si `gap: space.gap` (16px), ca in specificatie.
- **Eroarea:** `{error ? <Text>...</Text> : null}`, nu `{error && ...}`: un text gol in afara unui `Text` ar da eroare in React Native. Pe iOS, un `Text` cu fundal are nevoie de `overflow: 'hidden'` ca fundalul sa urmeze colturile rotunjite.

### Testare

- In Expo Go: nimic nu intra sub bara de stare sau sub notch; ordinea sectiunilor este cea din specificatie; cardurile au colturi rotunjite si umbra, cel cu rezultatul este teal.
- Tema intunecata: fundalul, cardurile si iconitele barei de stare se schimba.
- Cu tastatura deschisa, apesi "Cauta" sau o pastila: functioneaza din prima.
- Un text invalid (dupa API-ul lui M): mesajul apare sub bara de cautare, pe fundal rosu deschis.

### Commit

```bash
git add mobile/src/components/Panel.js mobile/App.js
git commit -m "feat(mobile): cardurile si asezarea ecranului cu zona sigura si spatiile din specificatie"
git push origin D
```

---

## D6. README-ul pentru etapa 2 si verificarea finala [mediu]

**Scop:** README-ul descrie toate cele trei variante (vanilla, web, mobil) si cum se ruleaza. Dupa ce toate PR-urile sunt pe `main`, verifici aplicatia completa.

### Pasul 1: README.md

Inlocuiesti continutul lui `README.md` cu textul de mai jos (il poti adapta). Optional, faci o captura noua a aplicatiei web la 1280 x 625 si inlocuiesti `docs/screenshot.png`.

````markdown
# IP Tracker

Aplicatie care arata informatii despre o adresa IP sau un domeniu: locatia aproximativa, fusul orar cu data si ora locala, furnizorul de internet (ISP) si pozitia pe harta. Exista in trei variante: pagina web din etapa 1 (HTML, CSS si JavaScript), aplicatia web in React si aplicatia mobila in React Native.

![IP Tracker - cautare dupa 8.8.8.8](docs/screenshot.png)

## Functionalitati

- Cautare dupa adresa IPv4, IPv6 sau domeniu; merge si un link intreg (`https://github.com/user` devine `github.com`)
- La pornire se afiseaza automat datele pentru IP-ul propriu
- Cardul cu rezultatul (adresa IP si locatia) si detaliile, fiecare cu iconita lui colorata: domeniul sau numele invers (hostname), ISP, locatia aproximativa, fusul orar, data si ora locala actualizate in fiecare secunda
- Harta cu locatia aproximativa a IP-ului: OpenStreetMap pe web, Google Maps (Android) sau Apple Maps (iOS) pe telefon
- Istoric cu ultimele 5 cautari, pastrat intre vizite; o cautare recenta se reface cu un click
- Tema luminoasa si intunecata, pastrata intre vizite
- Mesaje de eroare clare si blocuri de incarcare cat timp vin datele
- Design colorat si prietenos (teal si coral, carduri rotunjite cu umbra fina, fara gradient), adaptat pentru calculator, tableta si telefon

## Tehnologii

| | Etapa 1 (`vanilla/`) | Etapa 2: web (`web/`) | Etapa 2: mobil (`mobile/`) |
|---|---|---|---|
| Interfata | HTML, CSS, JavaScript | React 19 + Vite | React Native + Expo (SDK 58) |
| Harta | Leaflet | react-leaflet (Leaflet) | react-native-maps |
| Iconite | SVG scrise de mana | react-icons (Ionicons) | @expo/vector-icons (Ionicons) |
| Salvare locala | localStorage | localStorage | AsyncStorage |
| Teste | - | Vitest | - |

Datele vin de la [ip-api.com](https://ip-api.com/). Codul comun pentru web si mobil (validarea, cererea catre API, formatarea, istoricul si doua hook-uri React) este in `shared/` si este testat cu Vitest din `web/`.

## Rulare locala

Ai nevoie de Node.js (versiunea LTS) si, pentru aplicatia mobila, de aplicatia Expo Go pe telefon.

**Web (React):**

```bash
cd web
npm install
npm run dev
```

apoi deschide http://localhost:5173. Testele: `npm test`.

**Mobil (React Native):**

```bash
cd mobile
npm install
npx expo start
```

apoi scaneaza codul QR cu Expo Go (Android) sau cu camera (iPhone). Telefonul si calculatorul trebuie sa fie in aceeasi retea Wi-Fi; altfel foloseste `npx expo start --tunnel`.

**Etapa 1 (HTML, CSS, JavaScript):**

```bash
cd vanilla
python -m http.server 5500
```

apoi deschide http://localhost:5500 (sau foloseste Live Server din VS Code).

> Planul gratuit ip-api.com functioneaza doar prin HTTP si permite 45 de cereri pe minut. Pe o gazduire HTTPS (de exemplu GitHub Pages), browserul blocheaza cererile, iar aplicatia afiseaza un mesaj in acest sens.

## Structura proiectului

```text
IP_Tracker/
├── vanilla/     etapa 1: HTML, CSS si JavaScript, fara framework
├── shared/      cod comun pentru web si mobil: api.js, useGeoSearch.js, format.js, useClock.js, history.js
├── web/         aplicatia React (Vite): src/components, src/hooks, tests
├── mobile/      aplicatia React Native (Expo): App.js, src/components, src/hooks, theme.js
└── docs/        jurnalele echipei, ghidurile etapei 2 si captura de ecran
```

## Echipa

| Membru | GitHub | Etapa 1 | Etapa 2 | Jurnal |
|---|---|---|---|---|
| M | TudorMituleci | antetul si cautarea, temele, stilurile de baza, validarea si API-ul | scheletul web si mobil, designul (culori si tokeni), API-ul comun, hook-ul de cautare, antetul, cautarea si tema | [jurnal-M.md](docs/jurnal-M.md) |
| R | adevaratulrazvanlrs | grid-ul, cardul de detalii cu ora locala, animatiile de incarcare, harta | cardul cu rezultatul, detaliile cu ora locala si harta, pe web si pe mobil | [jurnal-R.md](docs/jurnal-R.md) |
| D | seba-dvd | istoricul, design-ul responsive, legarea modulelor, documentatia | istoricul, cardurile si asezarea in pagina, pe web si pe mobil, documentatia | [jurnal-D.md](docs/jurnal-D.md) |

In cod, comentariile de forma `R v2.2.0: ...` arata membrul care a scris blocul si versiunea in care a aparut. Explicatia completa se afla in jurnalul acelui membru, la versiunea respectiva. Ghidurile etapei 2 sunt in [docs/ghiduri](docs/ghiduri/README.md).

## Versiuni

| Versiune | Membru | Ce aduce |
|---|---|---|
| v1.0.0 | M | pagina de inceput: antetul, bara de cautare, tema light / dark, design de baza |
| v1.1.0 | M | primul API de geolocalizare (ipwho.is), butonul de tema functional |
| v1.2.0 | M | scheletul pentru R si D, tema prin theme.js, domenii prin ip-api.com, cache si validare stricta |
| v1.3.0 | R | grid-ul, cardul de detalii cu ora locala, animatiile de incarcare, harta cu marker si zoom animat |
| v1.4.0 | D | stilurile hartii, istoricul cautarilor, design-ul responsive, main.js final, documentatia |
| v2.0.0 | M | scheletul pentru React si React Native, codul comun din shared/, designul teal si coral |
| v2.1.0 | M | API-ul comun, hook-ul de cautare, antetul, bara de cautare si tema (web si mobil) |
| v2.2.0 | R | cardul cu rezultatul, detaliile cu ora locala si harta (web si mobil) |
| v2.3.0 | D | istoricul, cardurile si asezarea in pagina (web si mobil), README-ul etapei 2 |
````

```bash
git add README.md
git commit -m "docs: readme pentru etapa 2 (React si React Native)"
git push origin D
```

Daca ai facut si captura noua: `git add docs/screenshot.png` inainte de commit.

### Pasul 2: jurnalul

Adaugi la sfarsitul lui `docs/jurnal-D.md` (poti adapta):

```markdown
## v2.3.0 - istoric, carduri si asezare in pagina, in React si React Native

- `shared/history.js`: `addQuery` (cautarea noua prima, fara dubluri, maxim 5) si `parseHistory` (datele stricate devin lista goala); teste Vitest.
- Web: `useHistory` (localStorage, initializare lazy, salvare intr-un efect) si `RecentSearches` (pastile cu iconita, "Sterge tot").
- Web: `App.css`: carduri cu colturi de 16px si umbra fina, cardul cu rezultatul in teal, continut de cel mult 1440px cu margini de minim 40px, grila harta / carduri de 336px, zona principala de inaltimea ecranului, coloana de carduri cu scroll propriu; o coloana sub 900px (display: contents si order), dimensiuni de telefon sub 640px.
- Mobil: `useHistory` (AsyncStorage, citire asincrona, fara suprascrierea listei salvate), `RecentSearches` (pastile), `Panel` (variantele default si primary, boxShadow) si `App.js` (zona sigura, bara de stare dupa tema, ordinea si spatiile din specificatie).
- README-ul pentru etapa 2 si verificarea finala pe main.
```

```bash
git add docs/jurnal-D.md
git commit -m "docs: jurnalul lui D pentru v2.3.0"
git push origin D
```

### Pasul 3: PR, verificarea finala si tag-ul

Deschizi PR-ul `D` -> `main` ("v2.3.0: istoric, carduri, asezare in pagina si documentatie"). Se uneste dupa PR-urile lui M si R. Dupa unire, verifici aplicatia completa pe `main`:

```bash
git checkout main
git pull origin main
cd web
npm install
npm test
npm run lint
npm run build
npm run dev
```

Intr-un al doilea terminal, din folderul proiectului:

```bash
cd mobile
npm install
npx expo-doctor
npx expo start
```

Lista de verificare (ca in v1.4.0):

- [ ] cautari dupa IP (`8.8.8.8`), domeniu (`github.com`), link (`https://github.com/user`) si un text invalid, pe web si pe mobil
- [ ] istoricul: adaugare, fara dubluri, click pe o pastila, pastrare dupa reload, "Sterge tot"
- [ ] ambele teme si latimile 1920, 1280 x 625, 800 si 390 px pe web, fara scroll orizontal si fara erori in consola
- [ ] Expo Go: fara ecran rosu, harta se misca la fiecare cautare, tema si istoricul raman dupa reincarcare

Apoi tag-ul, in primul terminal (opresti serverul web cu Ctrl+C):

```bash
cd ..
git tag -a v2.3.0 -m "D: istoric, carduri, asezare in pagina si documentatie"
git push origin v2.3.0
git checkout D
```

---

## Intrebari posibile la prezentare

**Cum salvezi istoricul pe web si pe mobil?** Pe web, in `localStorage`, care raspunde imediat. Pe mobil, in AsyncStorage, care raspunde printr-un Promise. Regulile listei (prima, fara dubluri, maxim 5) sunt aceleasi, in `shared/history.js`.

**De ce `useState(loadSaved)` si nu `useState(loadSaved())`?** Cu functia, React o apeleaza o singura data, la prima afisare. Cu `loadSaved()`, citirea din `localStorage` s-ar repeta la fiecare redesenare, chiar daca rezultatul este ignorat.

**De ce porneste lista de pe mobil cu `null`?** Ca sa stim daca lista salvata a fost citita. Altfel, prima salvare ar scrie o lista goala peste cea veche, inainte ca citirea asincrona sa se termine.

**De ce logica istoricului este in `shared/`?** Sunt functii pure, fara React si fara salvare: se testeaza usor cu Vitest si se folosesc identic pe web si pe mobil.

**Cum este facuta asezarea pe desktop?** O grila cu doua coloane: harta (`minmax(0, 1fr)`) si coloana de carduri de 336px, cu 24px intre ele, iar inaltimea zonei principale este `calc(100dvh - 116px)`. Coloana de carduri are scroll propriu, ca harta sa ramana pe tot ecranul.

**Cum arata cardurile si de unde vin culorile?** Colturi de 16px, bordura fina si umbra moale, toate din variabilele lui M (`--radius-panel`, `--border`, `--shadow`). Cardul cu rezultatul primeste fundalul teal (`--primary`), iar tema intunecata schimba doar valorile variabilelor.

**Ce face `display: contents`?** Elementul dispare din asezare, iar copiii lui devin direct elementele parintelui. Asa, pe tableta si telefon, cardurile din coloana din dreapta pot fi ordonate cu `order` printre celelalte (rezumatul inaintea hartii).

**Cum faci umbra pe mobil?** Cu proprietatea `boxShadow`, care primeste acelasi text ca in CSS si merge pe Android si pe iOS in React Native 0.76+ (Expo Go). Valoarea vine din `theme.js`, diferita pentru tema intunecata.

**De ce `SafeAreaView` si `StatusBar`?** `SafeAreaView` pastreaza continutul in afara zonelor ocupate de notch si bare. `StatusBar` schimba culoarea iconitelor barei de stare dupa tema, ca sa se vada.

**Ce face `keyboardShouldPersistTaps="handled"`?** Fara el, prima atingere cu tastatura deschisa doar inchide tastatura; cu el, butoanele raspund din prima.

**De ce `{error ? ... : null}` si nu `{error && ...}`?** In React Native, un text (chiar gol) sau un numar afisat in afara unui `Text` da eroare. Ternarul intoarce mereu un element sau `null`.

**Cum ai testat responsive-ul?** Cu DevTools (device toolbar) la 1280 x 625 si 390 x 844, masurand containerele, plus pe telefon in Expo Go.
