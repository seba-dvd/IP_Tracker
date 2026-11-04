# Ghid M - schelet, API comun, cautare, antet si tema

| | |
|---|---|
| GitHub | TudorMituleci |
| Branch | `M` |
| Versiuni | v2.0.0 (scheletul), v2.1.0 |
| Fisiere | `shared/api.js`, `shared/useGeoSearch.js`; web: `vite.config.js`, `index.html`, `main.jsx`, `index.css`, `Header`, `SearchBar`, `ThemeToggle`, `useTheme`; mobil: `app.json`, `metro.config.js`, `theme.js`, `ThemeContext.js`, `Header`, `SearchBar`, `ThemeToggle` |

Citeste mai intai [ghidul comun](README.md), mai ales sectiunile 2-4 (structura si contractul).

| Task | Ce faci | Dificultate |
|---|---|---|
| M0 | urci ghidurile pe branch-ul `M` | - |
| M1 | scheletul v2.0.0: proiectele web si mobil, configurarile, tokenii de design, App si versiunile temporare | mediu |
| M2 | `shared/api.js`: validarea si cererea catre ip-api.com + teste | mediu |
| M3 | `shared/useGeoSearch.js`: starea cautarii | greu |
| M4 | tema luminoasa / intunecata pe web si pe mobil | mediu |
| M5 | antetul si bara de cautare pe web | mediu |
| M6 | antetul si bara de cautare pe mobil | mediu |

Ordinea conteaza: M1 trebuie terminat cat mai repede (R si D pornesc de la el), iar M4 inaintea lui M5 si M6 (antetul foloseste butonul de tema).

---

## Ce instalezi si cum verifici

- Git Bash, Node.js LTS (tu ai deja Node 26), VS Code, Expo Go pe telefon. Detalii: ghidul comun, sectiunea 6.
- Pentru M1 ai nevoie de internet: comenzile de creare descarca pachetele (cateva minute).

```bash
git --version
node -v
npm -v
```

---

## M0. Urca ghidurile (ziua 0)

Ghidurile sunt in `docs/ghiduri/`. Le urci pe branch-ul `M`, ca R si D sa le poata citi pe GitHub inca de acum. Ajung pe `main` odata cu scheletul, in acelasi PR.

```bash
cd "/c/Facultate An 4 Sem 1/SOPM/Laborator/Etapa1_IP_Tracker/IP_Tracker"
git checkout M
git fetch origin
git merge origin/main
git add docs/ghiduri
git commit -m "docs: ghiduri pentru etapa 2 (React si React Native)"
git push origin M
```

Spune-le lui R si D ca ghidurile sunt pe GitHub, pe branch-ul `M`, in `docs/ghiduri`, si ca pot instala uneltele.

---

## M1. Scheletul v2.0.0 [mediu]

**Scop:** creezi cele doua proiecte, instalezi toate dependintele, configurezi folderul comun `shared/`, pui tokenii de design si structura aplicatiei, plus versiuni temporare pentru fisierele lui R si D. Dupa ce scheletul ajunge pe `main`, toti trei lucreaza in paralel.

### Pasul 1: etapa 1 se muta in `vanilla/`

```bash
mkdir vanilla
git mv index.html styles.css theme.js api.js details.js map.js history.js main.js vanilla/
```

`git mv` muta fisierele si pastreaza istoricul lor. Versiunea veche se porneste de acum din `vanilla/`.

### Pasul 2: proiectul web (React + Vite)

```bash
npm create vite@latest web -- --template react --no-interactive --no-immediate
cd web
npm install
npm install leaflet react-leaflet react-icons
npm install -D vitest
npm pkg set scripts.test="vitest run --passWithNoTests"
rm -rf src/assets public/icons.svg README.md
mkdir -p src/components src/hooks tests
cd ..
```

- Daca npm intreaba `Ok to proceed? (y)`, raspunzi `y`.
- `--template react` alege React cu JavaScript; `--no-interactive` si `--no-immediate` sar peste intrebari si nu pornesc serverul inca.
- `leaflet` + `react-leaflet` sunt pentru harta lui R, `react-icons` pentru iconite (setul Ionicons, acelasi ca pe mobil), `vitest` pentru teste. Le instalezi tu acum, ca nimeni altcineva sa nu mai modifice `package.json`.
- `npm pkg set` adauga scriptul `npm test`. `--passWithNoTests` il lasa sa treaca si cat timp nu exista teste.
- Stergi fisierele demo ale template-ului (logo-uri si README-ul Vite).

### Pasul 3: proiectul mobil (React Native + Expo)

```bash
npx create-expo-app@latest mobile --template blank
cd mobile
npx expo install react-native-maps @react-native-async-storage/async-storage react-native-safe-area-context @expo/vector-icons expo-font
sed -i 's/"name": "mobile"/"name": "IP Tracker"/; s/"slug": "mobile"/"slug": "ip-tracker"/; s/"userInterfaceStyle": "light"/"userInterfaceStyle": "automatic"/' app.json
rm -rf .claude AGENTS.md LICENSE
mkdir -p src/components src/hooks
cd ..
mkdir shared
```

- `--template blank` creeaza un proiect minimal in JavaScript. Comanda instaleaza singura pachetele si nu creeaza alt repo Git (vede ca suntem deja intr-unul).
- `npx expo install` alege versiunile compatibile cu SDK-ul Expo (58). Pachetele: harta, AsyncStorage (salvare pe telefon), zona sigura (sub notch / bara de stare) si iconitele; `expo-font` este cerut de iconite si adauga singur `"plugins": ["expo-font"]` in `app.json`.
- `sed` schimba in `app.json` numele, slug-ul si `userInterfaceStyle`. Fara `"automatic"`, aplicatia ar ignora tema intunecata a telefonului. Poti face si manual cele trei modificari.
- Template-ul Expo adauga fisiere pentru asistenti AI (`.claude`, `AGENTS.md`) si licenta template-ului; nu ne trebuie.

### Pasul 4: fisierele scheletului

Creezi (sau inlocuiesti complet) fisierele de mai jos. In VS Code: click dreapta pe folder -> New File; daca scrii o cale cu `/`, VS Code creeaza si folderele.

#### `web/vite.config.js`

```js
/* vite.config.js - configurarea Vite (M v2.0.0) */
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // fisierele din ../shared importa 'react': il luam tot din web/node_modules
    dedupe: ['react'],
  },
  server: {
    // serverul de dezvoltare poate citi si folderul parinte, unde este shared/
    fs: { allow: ['..'] },
  },
});
```

#### `web/index.html`

```html
<!doctype html>
<html lang="ro">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>IP Tracker</title>
    <!-- M v2.0.0: tema se aplica inainte de afisare, ca pagina sa nu clipeasca -->
    <script>
      try {
        const saved = localStorage.getItem('geo-theme');
        const dark = saved ? saved === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.dataset.theme = dark ? 'dark' : 'light';
      } catch {
        document.documentElement.dataset.theme = 'light';
      }
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

#### `web/public/favicon.svg` (inlocuieste logo-ul Vite cu globul nostru)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="7" fill="#0f766e"/><g fill="none" stroke="#ffffff" stroke-width="1.6"><circle cx="12" cy="12" r="6.5"/><path d="M5.5 12h13M12 5.5c2.2 2.3 2.2 10.7 0 13M12 5.5c-2.2 2.3-2.2 10.7 0 13"/></g></svg>
```

#### `web/src/main.jsx`

```jsx
/* main.jsx - punctul de pornire: afiseaza <App /> in elementul #root (M v2.0.0) */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // inaintea componentelor, ca stilurile lor sa aiba prioritate
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

#### `web/src/index.css`

```css
/* index.css - variabilele de design si clasele comune (M v2.0.0)
   Paleta teal si coral: culori pline, colturi rotunjite si umbre fine, fara gradient.
   Tema intunecata are aceleasi variabile, cu alte valori. */

:root {
  --bg: #f8f4ec;                     /* fundalul paginii: crem, plin */
  --panel: #ffffff;                  /* fundalul cardurilor */
  --border: rgba(31, 42, 46, 0.08);  /* bordura fina a cardurilor */
  --text: #1f2a2e;                   /* text principal */
  --muted: #5f6b6e;                  /* text secundar: etichete, placeholder */
  --primary: #0f766e;                /* teal: logo-ul si cardul cu rezultatul */
  --on-primary: #ffffff;             /* text pe teal */
  --on-primary-muted: #e7f1f0;       /* text secundar pe teal */
  --primary-text: #0f766e;           /* linkuri, iconite si focus pe fundal deschis */
  --primary-soft: #e3f1ef;           /* teal foarte deschis: pastile, hover */
  --accent: #f2684a;                 /* coral: butonul Cauta si markerul */
  --on-accent: #2b1007;              /* text pe coral */
  --danger: #b42318;                 /* textul mesajului de eroare */
  --danger-bg: #fef1ee;              /* fundalul mesajului de eroare */
  --skeleton: #eee8dd;               /* blocurile afisate cat timp se incarca */
  --shadow: 0 1px 2px rgba(31, 42, 46, 0.06), 0 8px 24px -12px rgba(31, 42, 46, 0.22);
  --focus: 0 0 0 3px rgba(15, 118, 110, 0.2); /* inelul din jurul campului activ */
  --radius-panel: 16px;              /* colturile cardurilor */
  --radius-control: 12px;            /* colturile campurilor si butoanelor */
  --font: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color-scheme: light;
}

/* atributul data-theme este pus pe <html> din index.html si din useTheme;
   teal-ul si coralul de umplere raman aceleasi, se schimba fundalurile si textele */
[data-theme='dark'] {
  --bg: #111418;
  --panel: #1b2026;
  --border: rgba(255, 255, 255, 0.08);
  --text: #e9edf0;
  --muted: #a3adb5;
  --primary-text: #2dd4bf;           /* teal mai deschis, ca sa se citeasca pe fundal inchis */
  --primary-soft: #17302d;
  --danger: #ffb4ab;
  --danger-bg: #2a1715;
  --skeleton: #262c33;
  --shadow: 0 8px 24px -12px rgba(0, 0, 0, 0.6);
  --focus: 0 0 0 3px rgba(45, 212, 191, 0.25);
  color-scheme: dark;
}

/* tonurile iconitelor din detalii: iconita (--tone) pe un fundal deschis al aceluiasi ton (--tone-bg) */
.tone-teal  { --tone: #0f766e; --tone-bg: #ddf1ee; }
.tone-coral { --tone: #c8462b; --tone-bg: #fde6e0; }
.tone-amber { --tone: #a16207; --tone-bg: #fcf0d2; }
.tone-blue  { --tone: #2b6cb0; --tone-bg: #e1edf9; }
.tone-plum  { --tone: #7e4a9e; --tone-bg: #f0e6f6; }
[data-theme='dark'] .tone-teal  { --tone: #5eead4; --tone-bg: #17302d; }
[data-theme='dark'] .tone-coral { --tone: #ff9a84; --tone-bg: #3a221d; }
[data-theme='dark'] .tone-amber { --tone: #f5c451; --tone-bg: #362c14; }
[data-theme='dark'] .tone-blue  { --tone: #8dbbef; --tone-bg: #1b2a3d; }
[data-theme='dark'] .tone-plum  { --tone: #d2a8ee; --tone-bg: #2e2238; }

*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font: 15px/1.4 var(--font);
}

h1, h2, p, ul, dl, dd { margin: 0; }
ul { padding: 0; list-style: none; }
button, input { font: inherit; color: inherit; }
:focus-visible { outline: 2px solid var(--primary-text); outline-offset: 2px; }

/* text ascuns vizual, dar citit de cititoarele de ecran */
.sr-only {
  position: absolute; width: 1px; height: 1px; overflow: hidden;
  clip-path: inset(50%); white-space: nowrap;
}

/* clase folosite de mai multe componente */
.section-title { font-size: 16px; font-weight: 600; }
.label { font-size: 12px; color: var(--muted); }
.value { font-size: 15px; font-weight: 500; overflow-wrap: anywhere; }
.numeric { font-variant-numeric: tabular-nums; }  /* cifre de latime egala: IP, ceas */
.skeleton { max-width: 220px; border-radius: 6px; color: transparent; background: var(--skeleton); user-select: none; }
```

#### `web/src/App.jsx`

```jsx
/* App.jsx - leaga componentele: starea cautarii, istoricul si ordinea din pagina
   M v2.0.0 (structura); asezarea in pagina este in App.css (D v2.3.0) */
import { useState } from 'react';
import { useGeoSearch } from '../../shared/useGeoSearch';
import DetailsPanel from './components/DetailsPanel';
import Header from './components/Header';
import MapPanel from './components/MapPanel';
import RecentSearches from './components/RecentSearches';
import ResultSummary from './components/ResultSummary';
import SearchBar from './components/SearchBar';
import { useHistory } from './hooks/useHistory';
import './App.css';

export default function App() {
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
    <div className="app">
      <Header>
        <SearchBar value={text} onChange={setText} onSubmit={() => runSearch(text)} />
      </Header>

      {error && <p className="error" role="alert">{error}</p>}

      <main className="layout" aria-busy={loading}>
        <section className="map-panel" aria-label="Harta">
          <MapPanel result={result} loading={loading} />
        </section>
        <div className="sidebar">
          <section className="section summary" aria-label="Rezultat">
            <ResultSummary result={result} loading={loading} />
          </section>
          <section className="section details" aria-label="Detalii">
            <DetailsPanel result={result} loading={loading} />
          </section>
          <section className="section recent" aria-label="Cautari recente">
            <RecentSearches items={history.items} onSelect={runSearch} onClear={history.clear} />
          </section>
        </div>
      </main>
    </div>
  );
}
```

#### `web/src/App.css` (temporar; D il scrie in v2.3.0)

```css
/* App.css - VERSIUNE TEMPORARA din schelet (M v2.0.0); D scrie asezarea in pagina in v2.3.0 */
.app { padding: 24px; }
```

#### Versiunile temporare pentru web

Au exact numele si props-urile din contract, ca App sa functioneze de azi. Fiecare proprietar inlocuieste fisierul lui.

`web/src/components/Header.jsx`

```jsx
/* Header.jsx - VERSIUNE TEMPORARA din schelet (M v2.0.0); M o termina in v2.1.0 */
export default function Header({ children }) {
  return <header className="topbar">{children}</header>;
}
```

`web/src/components/SearchBar.jsx`

```jsx
/* SearchBar.jsx - VERSIUNE TEMPORARA din schelet (M v2.0.0); M o termina in v2.1.0 */
export default function SearchBar({ value, onChange, onSubmit }) {
  function handleSubmit(event) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={value} onChange={(e) => onChange(e.target.value)} aria-label="Adresa IP sau domeniu" />
      <button type="submit">Cauta</button>
    </form>
  );
}
```

`web/src/components/ResultSummary.jsx`

```jsx
/* ResultSummary.jsx - VERSIUNE TEMPORARA din schelet (M v2.0.0); R o inlocuieste in v2.2.0 */
export default function ResultSummary({ result }) {
  return <p>Rezultat: {result?.ip}</p>;
}
```

`web/src/components/DetailsPanel.jsx`

```jsx
/* DetailsPanel.jsx - VERSIUNE TEMPORARA din schelet (M v2.0.0); R o inlocuieste in v2.2.0 */
export default function DetailsPanel({ result }) {
  return <pre>{JSON.stringify(result, null, 2)}</pre>;
}
```

`web/src/components/MapPanel.jsx`

```jsx
/* MapPanel.jsx - VERSIUNE TEMPORARA din schelet (M v2.0.0); R o inlocuieste in v2.2.0 */
export default function MapPanel() {
  return <p>Aici va fi harta.</p>;
}
```

`web/src/components/RecentSearches.jsx`

```jsx
/* RecentSearches.jsx - VERSIUNE TEMPORARA din schelet (M v2.0.0); D o inlocuieste in v2.3.0 */
export default function RecentSearches({ items, onSelect }) {
  return (
    <ul>
      {items.map((query) => (
        <li key={query}>
          <button type="button" onClick={() => onSelect(query)}>{query}</button>
        </li>
      ))}
    </ul>
  );
}
```

`web/src/hooks/useHistory.js`

```js
/* useHistory.js - VERSIUNE TEMPORARA din schelet (M v2.0.0): lista ramane doar in memorie.
   D o salveaza in localStorage in v2.3.0. */
import { useState } from 'react';

export function useHistory() {
  const [items, setItems] = useState([]);
  const add = (query) => setItems((prev) => [query, ...prev.filter((q) => q !== query)]);
  const clear = () => setItems([]);
  return { items, add, clear };
}
```

#### `shared/useGeoSearch.js` (temporar; il scrii complet in M3)

```js
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
```

#### `mobile/metro.config.js`

```js
/* metro.config.js - Metro (bundler-ul folosit de Expo) poate citi si codul din ../shared (M v2.0.0) */
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Metro urmareste si folderul shared, aflat in afara proiectului mobile/
config.watchFolders = [path.resolve(__dirname, '../shared')];
// pachetele importate din shared (de exemplu react) se cauta in mobile/node_modules
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules')];

module.exports = config;
```

#### `mobile/src/theme.js`

```js
/* theme.js - culorile si dimensiunile din noul design teal si coral (M v2.0.0)
   Sunt aceleasi valori ca variabilele din web/src/index.css. */

export const colors = {
  light: {
    bg: '#F8F4EC',                       // fundalul ecranului: crem, plin
    panel: '#FFFFFF',                    // fundalul cardurilor
    border: 'rgba(31, 42, 46, 0.08)',    // bordura fina a cardurilor
    text: '#1F2A2E',                     // text principal
    muted: '#5F6B6E',                    // text secundar: etichete, placeholder
    primary: '#0F766E',                  // teal: logo-ul si cardul cu rezultatul
    onPrimary: '#FFFFFF',                // text pe teal
    onPrimaryMuted: '#E7F1F0',           // text secundar pe teal
    primaryText: '#0F766E',              // linkuri si iconite teal pe fundal deschis
    primarySoft: '#E3F1EF',              // teal foarte deschis: pastile
    accent: '#F2684A',                   // coral: butonul Cauta si markerul
    accentSoft: 'rgba(242, 104, 74, 0.22)', // haloul markerului
    onAccent: '#2B1007',                 // text pe coral
    danger: '#B42318',                   // textul mesajului de eroare
    dangerBg: '#FEF1EE',                 // fundalul mesajului de eroare
    skeleton: '#EEE8DD',                 // blocurile afisate cat timp se incarca
    shadow: '0 6px 16px rgba(31, 42, 46, 0.10)', // umbra cardurilor
    // tonurile iconitelor din detalii: fg = iconita, bg = fundalul ei
    tones: {
      teal: { fg: '#0F766E', bg: '#DDF1EE' },
      coral: { fg: '#C8462B', bg: '#FDE6E0' },
      amber: { fg: '#A16207', bg: '#FCF0D2' },
      blue: { fg: '#2B6CB0', bg: '#E1EDF9' },
      plum: { fg: '#7E4A9E', bg: '#F0E6F6' },
    },
  },
  dark: {
    bg: '#111418',
    panel: '#1B2026',
    border: 'rgba(255, 255, 255, 0.08)',
    text: '#E9EDF0',
    muted: '#A3ADB5',
    primary: '#0F766E',
    onPrimary: '#FFFFFF',
    onPrimaryMuted: '#E7F1F0',
    primaryText: '#2DD4BF',
    primarySoft: '#17302D',
    accent: '#F2684A',
    accentSoft: 'rgba(242, 104, 74, 0.22)',
    onAccent: '#2B1007',
    danger: '#FFB4AB',
    dangerBg: '#2A1715',
    skeleton: '#262C33',
    shadow: '0 6px 16px rgba(0, 0, 0, 0.45)',
    tones: {
      teal: { fg: '#5EEAD4', bg: '#17302D' },
      coral: { fg: '#FF9A84', bg: '#3A221D' },
      amber: { fg: '#F5C451', bg: '#362C14' },
      blue: { fg: '#8DBBEF', bg: '#1B2A3D' },
      plum: { fg: '#D2A8EE', bg: '#2E2238' },
    },
  },
};

// spatiile din specificatia pentru telefon
export const space = {
  page: 16,  // marginile ecranului
  gap: 16,   // spatiul dintre carduri
  panel: 16, // padding-ul cardurilor
};

// colturile rotunjite
export const radius = {
  panel: 16,   // carduri
  control: 12, // campuri si butoane
};

// stilurile de text comune
export const type = {
  title: { fontSize: 16, fontWeight: '600' },
  label: { fontSize: 12 },
  value: { fontSize: 15, fontWeight: '500' },
  numeric: { fontVariant: ['tabular-nums'] }, // cifre de latime egala: IP, ceas
};
```

#### `mobile/src/ThemeContext.js` (varianta din schelet; o completezi in M4)

```jsx
/* ThemeContext.js - culorile temei, disponibile in toata aplicatia (M v2.0.0)
   In schelet urmeaza tema telefonului; M adauga butonul si salvarea alegerii in v2.1.0. */
import { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { colors } from './theme';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const value = { colors: colors[scheme], isDark: scheme === 'dark', toggleTheme: () => {} };
  return <ThemeContext value={value}>{children}</ThemeContext>;
}

// in componente: const { colors, isDark, toggleTheme } = useTheme();
export function useTheme() {
  return useContext(ThemeContext);
}
```

#### `mobile/App.js` (inlocuieste fisierul generat; D il termina in v2.3.0)

```jsx
/* App.js - ecranul aplicatiei mobile: starea cautarii, istoricul si ordinea sectiunilor
   M v2.0.0 (structura); asezarea si stilurile: D v2.3.0 */
import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useGeoSearch } from '../shared/useGeoSearch';
import DetailsPanel from './src/components/DetailsPanel';
import Header from './src/components/Header';
import MapPanel from './src/components/MapPanel';
import RecentSearches from './src/components/RecentSearches';
import ResultSummary from './src/components/ResultSummary';
import SearchBar from './src/components/SearchBar';
import { useHistory } from './src/hooks/useHistory';
import { ThemeProvider, useTheme } from './src/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <Screen />
    </ThemeProvider>
  );
}

function Screen() {
  const { colors } = useTheme();
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
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={styles.content}>
      <Header />
      <SearchBar value={text} onChange={setText} onSubmit={() => runSearch(text)} />
      {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}
      <ResultSummary result={result} loading={loading} />
      <MapPanel result={result} loading={loading} />
      <DetailsPanel result={result} loading={loading} />
      <RecentSearches items={history.items} onSelect={runSearch} onClear={history.clear} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingTop: 56, gap: 16 },
});
```

#### Versiunile temporare pentru mobil

`mobile/src/components/Header.js`

```jsx
/* Header.js - VERSIUNE TEMPORARA din schelet (M v2.0.0); M o termina in v2.1.0 */
import { Text } from 'react-native';
import { useTheme } from '../ThemeContext';

export default function Header() {
  const { colors } = useTheme();
  return <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>IP Tracker</Text>;
}
```

`mobile/src/components/SearchBar.js`

```jsx
/* SearchBar.js - VERSIUNE TEMPORARA din schelet (M v2.0.0); M o termina in v2.1.0 */
import { TextInput } from 'react-native';
import { useTheme } from '../ThemeContext';

export default function SearchBar({ value, onChange, onSubmit }) {
  const { colors } = useTheme();
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      onSubmitEditing={onSubmit}
      placeholder="Adresa IP sau domeniu"
      placeholderTextColor={colors.muted}
      autoCapitalize="none"
      style={{ height: 48, borderWidth: 1, borderColor: colors.border, color: colors.text, paddingHorizontal: 14 }}
    />
  );
}
```

`mobile/src/components/ResultSummary.js`

```jsx
/* ResultSummary.js - VERSIUNE TEMPORARA din schelet (M v2.0.0); R o inlocuieste in v2.2.0 */
import { Text } from 'react-native';
import { useTheme } from '../ThemeContext';

export default function ResultSummary({ result }) {
  const { colors } = useTheme();
  return <Text style={{ color: colors.text }}>Rezultat: {result?.ip}</Text>;
}
```

`mobile/src/components/DetailsPanel.js`

```jsx
/* DetailsPanel.js - VERSIUNE TEMPORARA din schelet (M v2.0.0); R o inlocuieste in v2.2.0 */
import { Text } from 'react-native';
import { useTheme } from '../ThemeContext';

export default function DetailsPanel({ result }) {
  const { colors } = useTheme();
  return <Text style={{ color: colors.text }}>{JSON.stringify(result, null, 2)}</Text>;
}
```

`mobile/src/components/MapPanel.js`

```jsx
/* MapPanel.js - VERSIUNE TEMPORARA din schelet (M v2.0.0); R o inlocuieste in v2.2.0 */
import { Text } from 'react-native';
import { useTheme } from '../ThemeContext';

export default function MapPanel() {
  const { colors } = useTheme();
  return <Text style={{ color: colors.muted }}>Aici va fi harta.</Text>;
}
```

`mobile/src/components/RecentSearches.js`

```jsx
/* RecentSearches.js - VERSIUNE TEMPORARA din schelet (M v2.0.0); D o inlocuieste in v2.3.0 */
import { Pressable, Text } from 'react-native';
import { useTheme } from '../ThemeContext';

export default function RecentSearches({ items, onSelect }) {
  const { colors } = useTheme();
  return items.map((query) => (
    <Pressable key={query} onPress={() => onSelect(query)}>
      <Text style={{ color: colors.text }}>{query}</Text>
    </Pressable>
  ));
}
```

`mobile/src/hooks/useHistory.js`

```js
/* useHistory.js - VERSIUNE TEMPORARA din schelet (M v2.0.0): lista ramane doar in memorie.
   D o salveaza in AsyncStorage in v2.3.0. */
import { useState } from 'react';

export function useHistory() {
  const [items, setItems] = useState([]);
  const add = (query) => setItems((prev) => [query, ...prev.filter((q) => q !== query)]);
  const clear = () => setItems([]);
  return { items, add, clear };
}
```

### Explicatie (pentru prezentare)

- **De ce exista configurari pentru `shared/`?** Vite si Metro lucreaza implicit doar in folderul proiectului lor. Am verificat ce se intampla fara ele:
  - fara `resolve.dedupe: ['react']`, build-ul web se opreste cu `Rolldown failed to resolve import "react" from ".../shared/useGeoSearch.js"`: Vite cauta `react` langa fisierul din `shared/`, unde nu exista `node_modules`. `dedupe` il obliga sa foloseasca React-ul din `web/`. `server.fs.allow: ['..']` lasa serverul de dezvoltare sa citeasca folderul parinte;
  - fara `watchFolders`, Expo spune `Unable to resolve module ../shared/useGeoSearch`; fara `nodeModulesPaths`, spune `Unable to resolve "react" from "../shared/useGeoSearch.js"`.
- **`index.html`:** scriptul mic din `<head>` ruleaza inainte de React si pune `data-theme="dark"` sau `"light"` pe `<html>`, dupa alegerea salvata sau dupa tema sistemului. Asa pagina nu apare alba o fractiune de secunda inainte sa devina intunecata (aceeasi idee ca in v1.0.0).
- **`main.jsx`:** porneste React in `<div id="root">`. `index.css` se importa inaintea lui `App`, ca regulile de baza sa fie primele in pagina, iar stilurile componentelor sa le poata suprascrie. `StrictMode` verifica in dezvoltare greselile frecvente.
- **`index.css`:** aici este tot designul teal si coral, ca variabile CSS: culorile, umbra (`--shadow`), inelul de focus (`--focus`) si colturile (`--radius-panel` 16px, `--radius-control` 12px). Tema intunecata nu are alte reguli, doar alte valori pentru aceleasi variabile, deci tot ce scriu R si D cu `var(--...)` merge automat in ambele teme. Teal-ul si coralul de umplere raman la fel; se schimba fundalurile, textele si `--primary-text` (un teal mai deschis, lizibil pe fundal inchis).
- **Tonurile:** clasele `.tone-teal` ... `.tone-plum` dau fiecarei iconite din detalii (R) o culoare: `--tone` pentru desen si `--tone-bg` pentru fundalul deschis. Toate perechile text / fundal au fost verificate la contrast (text cel putin 4.5:1, iconite cel putin 3:1). Clasele comune (`.label`, `.value`, `.numeric`, `.skeleton`) sunt aici ca R si D sa nu le scrie de doua ori.
- **`App.jsx`:** este dirijorul aplicatiei. Tine textul din bara de cautare (`text`), primeste rezultatul de la `useGeoSearch` si istoricul de la `useHistory`, apoi da fiecarei componente doar ce ii trebuie, prin props. `runSearch` pune textul in bara (util la click pe o cautare recenta), asteapta raspunsul si salveaza in istoric doar daca `search` a intors `true`.
- **Versiunile temporare** respecta contractul (aceleasi nume, aceleasi props). Asa aplicatia porneste de azi, iar fiecare isi inlocuieste fisierele fara sa modifice `App`.
- **Mobil:** `theme.js` contine aceleasi culori ca `index.css`, dar ca obiect JavaScript, pentru ca in React Native nu exista CSS: culorile fiecarei teme, tonurile (`tones`), umbra (`shadow`, folosita cu proprietatea `boxShadow`) si colturile (`radius.panel`, `radius.control`). `ThemeContext` face culorile disponibile in toata aplicatia; `useColorScheme()` spune tema telefonului. In React 19, `<ThemeContext value={...}>` este chiar provider-ul contextului.
- **De ce `{error ? <Text>...</Text> : null}` si nu `{error && ...}`?** Pe mobil, daca `error` ar fi un text gol, `&&` ar incerca sa afiseze textul gol direct intr-un `View`, ceea ce React Native nu permite.

### Testare

```bash
cd web
npm run build
npm run lint
npm test
npm run dev
```

- `build`, `lint` si `test` trebuie sa treaca (la `test` apare "No test files found, exiting with code 0").
- La http://localhost:5173 vezi datele de proba (8.8.8.8). Scrii ceva in camp si apesi Enter: textul apare in lista de cautari recente (versiunea temporara).

Opresti serverul web cu Ctrl+C (sau deschizi alt terminal in `web/`), apoi:

```bash
cd ../mobile
npx expo-doctor
npx expo start
```

- `expo-doctor` trebuie sa raporteze `20/20 checks passed`.
- Scanezi codul QR cu Expo Go: apar "IP Tracker", campul de cautare si datele de proba. Schimbi tema telefonului: fundalul se schimba.

### Commit, PR si tag

```bash
cd ..
git add -A
git status
git commit -m "feat: schelet v2.0.0 pentru React (web) si React Native (mobile), cu cod comun in shared"
git push origin M
```

- In `git status` verifici ca nu apar `node_modules` sau `dist`.
- Pe GitHub deschizi PR-ul `M` -> `main` cu titlul "v2.0.0: scheletul pentru React si React Native". In descriere: structura, contractul (link la ghidul comun) si ce urmeaza.
- Dupa ce PR-ul este unit:

```bash
git checkout main
git pull origin main
git tag -a v2.0.0 -m "M: scheletul pentru React si React Native"
git push origin v2.0.0
git checkout M
```

Anunta-i pe R si D: "scheletul e pe main, rulati sectiunea 6 din ghidul comun si porniti".

---

## M2. API-ul comun: `shared/api.js` [mediu]

**Scop:** muti in `shared/` logica din `vanilla/api.js`, ca sa o foloseasca si web-ul, si mobilul. In plus: numele invers al IP-ului (`reverse`), o forma de rezultat mai simpla si un cache care merge si pe telefon.

**Fisiere:** `shared/api.js` (nou), `web/tests/api.test.js` (nou).

### `shared/api.js`

```js
/* api.js - validarea cautarii si cererea catre ip-api.com, folosite de web si de mobil
   M v2.1.0 (portat din vanilla/api.js, M v1.2.0) */

// Curata textul introdus: scoate protocolul, calea si portul (https://github.com/x -> github.com)
export function cleanQuery(input) {
  let query = input.trim().replace(/^[a-z]+:\/\//i, '').split(/[/?#]/)[0];
  if ((query.match(/:/g) || []).length === 1) query = query.split(':')[0]; // host:port, nu IPv6
  return query.replace(/^\[|\]$/g, ''); // [::1] -> ::1
}

const IPV4 = /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/;
const IPV6 = /^(?:[0-9a-f]{0,4}:){2,7}[0-9a-f]{0,4}$/i;
const DOMAIN = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;

// Tipul cautarii: 'current' (IP-ul propriu), 'ip' sau 'domain'; null daca formatul este invalid
export function classifyQuery(input) {
  const value = cleanQuery(input);
  // textul gol si adresele locale se verifica primele, altfel 127.0.0.1 ar fi un IPv4 obisnuit
  if (value === '' || value === 'localhost' || value === '127.0.0.1') return { type: 'current', value: '' };
  if (IPV4.test(value) || IPV6.test(value)) return { type: 'ip', value };
  if (DOMAIN.test(value)) return { type: 'domain', value };
  return null;
}

const FIELDS = 'status,query,country,regionName,city,lat,lon,timezone,isp,reverse';
const cache = new Map(); // rezultatele deja primite in sesiunea curenta

// Aduce datele pentru un IP sau un domeniu. La orice problema arunca o eroare cu mesaj in romana.
export async function fetchGeoData(input = '') {
  const target = classifyQuery(input);
  if (!target) throw new Error('Format invalid. Introdu o adresa IP sau un domeniu corect.');

  // planul gratuit ip-api.com merge doar prin http; o pagina https ar bloca cererea
  if (globalThis.location?.protocol === 'https:') {
    throw new Error('Serviciul de geolocalizare functioneaza doar cand pagina ruleaza pe http.');
  }
  if (cache.has(target.value)) return cache.get(target.value);

  let response;
  try {
    response = await fetch(`http://ip-api.com/json/${target.value}?fields=${FIELDS}`);
  } catch {
    throw new Error('Eroare de retea. Serviciul nu a putut fi contactat.');
  }
  if (response.status === 429) {
    throw new Error('Prea multe cereri. Asteapta un minut si incearca din nou.');
  }
  if (!response.ok) throw new Error('Eroare de retea. Serviciul nu a putut fi contactat.');

  const data = await response.json();
  if (data.status !== 'success') throw new Error('Nu s-au gasit informatii pentru aceasta cautare.');

  // forma folosita in toata aplicatia, independenta de formatul serviciului
  const result = {
    ip: data.query,
    host: target.type === 'domain' ? target.value : data.reverse || '', // domeniul cautat sau numele invers
    isp: data.isp || '',
    city: data.city || '',
    region: data.regionName || '',
    country: data.country || '',
    timezone: data.timezone || '',
    latitude: data.lat,
    longitude: data.lon,
  };
  cache.set(target.value, result);
  return result;
}
```

### `web/tests/api.test.js`

```js
/* api.test.js - teste pentru validarea cautarii din shared/api.js (M v2.1.0) */
import { describe, expect, it } from 'vitest';
import { classifyQuery, cleanQuery } from '../../shared/api';

describe('cleanQuery', () => {
  it('scoate protocolul, portul si calea', () => {
    expect(cleanQuery(' https://github.com:443/user?tab=1 ')).toBe('github.com');
  });

  it('scoate parantezele unui IPv6', () => {
    expect(cleanQuery('[::1]')).toBe('::1');
  });
});

describe('classifyQuery', () => {
  it('recunoaste IP-uri, domenii si IP-ul propriu', () => {
    expect(classifyQuery('8.8.8.8')).toEqual({ type: 'ip', value: '8.8.8.8' });
    expect(classifyQuery('2001:db8::1')).toEqual({ type: 'ip', value: '2001:db8::1' });
    expect(classifyQuery('https://github.com/user')).toEqual({ type: 'domain', value: 'github.com' });
    expect(classifyQuery('localhost')).toEqual({ type: 'current', value: '' });
  });

  it('respinge formatele invalide', () => {
    expect(classifyQuery('256.1.1.1')).toBeNull();
    expect(classifyQuery('nu este domeniu')).toBeNull();
  });
});
```

### Explicatie (pentru prezentare)

- `cleanQuery` si `classifyQuery` sunt cele din v1.2.0, scrise mai compact: expresiile regulate sunt constante la nivelul fisierului (nu se recreeaza la fiecare apel), iar `/i` face potrivirea fara diferenta intre litere mari si mici.
- `fetchGeoData` urmeaza aceiasi pasi ca in v1: valideaza, verifica protocolul, cauta in cache, trimite cererea, trateaza erorile (retea, 429, raspuns fara date) si transforma raspunsul.
- **Ce s-a schimbat fata de v1:**
  - campul nou `reverse` din ip-api.com da numele invers al IP-ului (de exemplu `dns.google` pentru 8.8.8.8). `host` este domeniul cautat, daca s-a cautat un domeniu, altfel numele invers, altfel text gol (afisat ca "Indisponibil");
  - rezultatul are forma plata (`timezone`, `isp`) in loc de `timezone.id` si `connection.isp`, pastrate in v1 doar pentru compatibilitate cu primul API;
  - cache-ul este un `Map` in memorie: `sessionStorage` nu exista in React Native, iar un `Map` merge peste tot si traieste cat timp aplicatia este deschisa;
  - `globalThis.location?.protocol`: pe telefon nu exista `location`, iar `?.` intoarce `undefined` in loc sa dea eroare.
- Testele verifica doar functiile fara retea (`cleanQuery`, `classifyQuery`), ca sa ruleze rapid si fara internet.

### Testare

```bash
cd web
npm test
```

Cele 4 teste din `api.test.js` trebuie sa treaca. Aplicatia foloseste inca versiunea temporara a lui `useGeoSearch`, deci cererea reala o vezi dupa M3.

### Commit

```bash
cd ..
git add shared/api.js web/tests/api.test.js
git commit -m "feat(shared): api comun cu validare, hostname si cache"
git push origin M
```

---

## M3. Starea cautarii: `shared/useGeoSearch.js` [greu]

**Scop:** inlocuiesti versiunea temporara cu hook-ul real: cauta IP-ul propriu la pornire, tine rezultatul, eroarea si starea de incarcare si ignora raspunsurile care vin prea tarziu.

**Fisiere:** `shared/useGeoSearch.js` (inlocuiesti tot continutul).

```js
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
```

### Explicatie (pentru prezentare)

- **Trei bucati de state:** `result` (ultimul rezultat bun), `error` (mesajul de afisat) si `loading` (porneste `true`, pentru ca imediat dupa afisare cautam IP-ul propriu). Cand se schimba oricare, React redeseneaza componentele care le folosesc.
- **`useRef` pentru `lastRequest`:** numarul ultimei cereri trebuie pastrat intre afisari, dar schimbarea lui nu trebuie sa redeseneze nimic, deci nu este state. Este acelasi `requestId` din `main.js` (v1.4.0).
- **`isLatest`:** daca utilizatorul cauta "a", apoi repede "b", raspunsul pentru "a" poate veni dupa cel pentru "b". Fiecare cerere isi tine minte numarul (`id`) si isi aplica raspunsul doar daca este inca ultima.
- **`.then` / `.catch` / `.finally`:** `then` primeste datele, `catch` primeste eroarea aruncata de `fetchGeoData` (cu mesaj in romana), `finally` opreste incarcarea in ambele cazuri. Valoarea intoarsa (`true` / `false`) ajunge la cel care a apelat `search`.
- **`useCallback(..., [])`** pastreaza aceeasi functie `load` intre afisari. Efectul depinde de `load` (`[load]`), deci ruleaza o singura data, la pornire. In dezvoltare, `StrictMode` il ruleaza de doua ori; a doua cerere o "invinge" pe prima prin `isLatest`, iar in build-ul final ramane una.
- **`search` intoarce un Promise cu `true` / `false`:** hook-ul nu stie nimic de istoric. `App` decide ce face cu rezultatul, deci logica cautarii si cea a istoricului (D) raman separate.
- **De ce state-ul se schimba in `.then` si nu direct in efect?** Asa este modelul recomandat de React pentru cereri: efectul porneste cererea, iar state-ul se actualizeaza cand vine raspunsul.

### Testare

```bash
cd web
npm run build
npm run dev
```

- La pornire apare IP-ul tau real. Cauti `8.8.8.8` (Domeniu / hostname: `dns.google`, dupa ce R termina detaliile), `https://github.com/user` (devine `github.com`) si un text invalid: apare "Format invalid...".
- Cautarile reusite intra in lista de cautari recente; cele invalide nu.
- Pe mobil (`cd ../mobile`, `npx expo start`): aceleasi date reale in Expo Go.

### Commit

```bash
cd ..
git add shared/useGeoSearch.js
git commit -m "feat(shared): hook-ul useGeoSearch cu cautare la pornire si raspunsuri vechi ignorate"
git push origin M
```

---

## M4. Tema luminoasa / intunecata, pe web si pe mobil [mediu]

**Scop:** butonul de tema pe ambele platforme, cu alegerea salvata intre vizite.

**Fisiere:** web: `src/hooks/useTheme.js` (nou), `src/components/ThemeToggle.jsx` (nou); mobil: `src/ThemeContext.js` (inlocuiesti), `src/components/ThemeToggle.js` (nou). Temporar, adaugi butonul si in versiunile temporare ale lui `Header`, ca sa-l poti testa.

### `web/src/hooks/useTheme.js`

```js
/* useTheme.js - tema luminoasa sau intunecata, salvata in localStorage (M v2.1.0)
   Tema de pornire este pusa pe <html> de scriptul din index.html, inainte sa porneasca React. */
import { useEffect, useState } from 'react';

const KEY = 'geo-theme';

export function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');

  // la fiecare schimbare actualizam atributul de pe <html>; variabilele CSS fac restul
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // stocarea poate fi blocata; tema se schimba oricum, doar nu se mai tine minte
    }
  }

  return { theme, toggleTheme };
}
```

### `web/src/components/ThemeToggle.jsx`

```jsx
/* ThemeToggle.jsx - butonul de 44x44 care comuta tema (M v2.1.0) */
import { IoMoonOutline, IoSunnyOutline } from 'react-icons/io5';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Tema intunecata"
      aria-pressed={isDark}
    >
      {isDark ? <IoMoonOutline aria-hidden="true" /> : <IoSunnyOutline aria-hidden="true" />}
    </button>
  );
}
```

### `mobile/src/ThemeContext.js` (inlocuiesti tot continutul)

```jsx
/* ThemeContext.js - tema aplicatiei: urmeaza telefonul pana cand utilizatorul alege una
   M v2.0.0 (schelet), M v2.1.0 (butonul de tema si salvarea alegerii in AsyncStorage) */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { colors } from './theme';

const KEY = 'geo-theme';
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const system = useColorScheme(); // tema telefonului: 'light' sau 'dark'
  const [choice, setChoice] = useState(null); // tema aleasa de utilizator; null = cea a telefonului

  // la pornire citim alegerea salvata (AsyncStorage raspunde asincron, printr-un Promise)
  useEffect(() => {
    AsyncStorage.getItem(KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark') setChoice(saved);
    });
  }, []);

  const scheme = choice ?? (system === 'dark' ? 'dark' : 'light');

  function toggleTheme() {
    const next = scheme === 'dark' ? 'light' : 'dark';
    setChoice(next);
    AsyncStorage.setItem(KEY, next);
  }

  const value = { colors: colors[scheme], isDark: scheme === 'dark', toggleTheme };
  return <ThemeContext value={value}>{children}</ThemeContext>;
}

// in componente: const { colors, isDark, toggleTheme } = useTheme();
export function useTheme() {
  return useContext(ThemeContext);
}
```

### `mobile/src/components/ThemeToggle.js`

```jsx
/* ThemeToggle.js - butonul de 44x44 care comuta tema (M v2.1.0) */
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';
import { radius } from '../theme';
import { useTheme } from '../ThemeContext';

export default function ThemeToggle() {
  const { colors, isDark, toggleTheme } = useTheme();

  return (
    <Pressable
      onPress={toggleTheme}
      accessibilityRole="switch"
      accessibilityLabel="Tema intunecata"
      accessibilityState={{ checked: isDark }}
      style={[
        styles.button,
        { backgroundColor: colors.panel, borderColor: colors.border, boxShadow: colors.shadow },
      ]}
    >
      <Ionicons name={isDark ? 'moon-outline' : 'sunny-outline'} size={20} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: radius.control,
  },
});
```

### Butonul in antetul temporar (pana la M5 si M6)

`web/src/components/Header.jsx`

```jsx
/* Header.jsx - VERSIUNE TEMPORARA din schelet (M v2.0.0); M o termina in v2.1.0 */
import ThemeToggle from './ThemeToggle';

export default function Header({ children }) {
  return (
    <header className="topbar">
      {children}
      <ThemeToggle />
    </header>
  );
}
```

`mobile/src/components/Header.js`

```jsx
/* Header.js - VERSIUNE TEMPORARA din schelet (M v2.0.0); M o termina in v2.1.0 */
import { Text, View } from 'react-native';
import { useTheme } from '../ThemeContext';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>IP Tracker</Text>
      <ThemeToggle />
    </View>
  );
}
```

### Explicatie (pentru prezentare)

- **Web:** tema este doar atributul `data-theme` de pe `<html>`; restul il face CSS-ul din `index.css`. `useState(() => ...)` primeste o functie, deci tema initiala se citeste o singura data, din atributul pus de scriptul din `index.html`; asa logica de alegere nu este scrisa de doua ori. Efectul sincronizeaza atributul cu state-ul, iar `toggleTheme` salveaza alegerea in `localStorage` (in `try / catch`, ca in v1).
- **Accesibilitate:** `aria-pressed` spune cititoarelor de ecran daca tema intunecata este activa; iconita (soare sau luna) arata tema curenta, ca in v1.
- **Iconitele web** vin din `react-icons/io5`: fiecare iconita este o componenta React (`<IoSunnyOutline />`) care deseneaza un SVG cu culoarea textului si marimea fontului. Este acelasi set Ionicons ca pe mobil, deci aplicatiile arata la fel.
- **Mobil:** nu exista CSS si nici `<html>`, deci tema este un Context: orice componenta apeleaza `useTheme()` si primeste culorile potrivite. `choice ?? system` inseamna: alegerea utilizatorului, iar daca nu exista, tema telefonului. AsyncStorage raspunde asincron, de aceea alegerea salvata se citeste intr-un efect si poate aparea dupa prima afisare.
- `accessibilityRole="switch"` si `accessibilityState={{ checked }}` sunt echivalentul lui `aria-pressed` pe Android si iOS. Iconitele vin din `@expo/vector-icons` (Ionicons), inclus in Expo.

### Testare

- Web: butonul schimba tema; dupa reload tema ramane. In DevTools -> Application -> Local Storage apare `geo-theme`.
- Mobil: butonul schimba tema; apesi `r` in terminalul Expo (reincarcare) si tema ramane cea aleasa.

### Commit

```bash
git add web/src/hooks/useTheme.js web/src/components/ThemeToggle.jsx web/src/components/Header.jsx mobile/src/ThemeContext.js mobile/src/components/ThemeToggle.js mobile/src/components/Header.js
git commit -m "feat: tema luminoasa si intunecata salvata, pe web si pe mobil"
git push origin M
```

---

## M5. Antetul si bara de cautare pe web [mediu]

**Scop:** antetul din specificatie: logo de 160px, 24px, campul de cautare (restul latimii), 16px, butonul de tema de 44 x 44, toate pe un rand de 44px. Pe telefon, cautarea trece pe randul al doilea si are 48px.

**Fisiere:** `web/src/components/Header.jsx` (inlocuiesti), `web/src/components/Header.css` (nou), `web/src/components/SearchBar.jsx` (inlocuiesti).

### `web/src/components/Header.jsx`

```jsx
/* Header.jsx - antetul: logo, bara de cautare (primita ca children) si butonul de tema
   M v2.1.0 */
import { IoGlobeOutline } from 'react-icons/io5';
import ThemeToggle from './ThemeToggle';
import './Header.css';

export default function Header({ children }) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-logo" aria-hidden="true">
          <IoGlobeOutline />
        </span>
        <h1 className="brand-name">IP Tracker</h1>
      </div>
      {children}
      <ThemeToggle />
    </header>
  );
}
```

### `web/src/components/Header.css`

```css
/* Header.css - antetul, bara de cautare si butonul de tema (M v2.1.0)
   Desktop, pe un singur rand de 44px: logo 160px | 24px | cautare | 16px | tema 44px. */

.topbar {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 44px;
}

.brand {
  flex: none;
  width: 160px;
  margin-right: 8px; /* 8px + gap-ul de 16px = 24px pana la cautare */
  display: flex;
  align-items: center;
  gap: 10px;
}
.brand-logo {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: var(--primary);
  color: var(--on-primary);
  font-size: 20px;
}
.brand-name { font-size: 18px; font-weight: 600; white-space: nowrap; }

/* campul de cautare: card alb de 44px, iconita in stanga, butonul coral in dreapta, la 4px de margine */
.search {
  flex: 1;
  min-width: 0;
  height: 44px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 3px 0 14px; /* 3px + bordura de 1px = 4px pana la marginea campului */
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: var(--radius-control);
  box-shadow: var(--shadow);
}
.search:focus-within { border-color: var(--primary-text); box-shadow: var(--focus), var(--shadow); }
.search-icon { flex: none; font-size: 18px; color: var(--muted); }
.search input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 16px;
  text-overflow: ellipsis;
}
.search input::placeholder { color: var(--muted); }
.search button {
  flex: none;
  width: 88px;
  height: 36px;
  border: 0;
  border-radius: 9px; /* 12px - 3px, ca sa urmeze coltul campului */
  background: var(--accent);
  color: var(--on-accent);
  font-weight: 600;
  cursor: pointer;
}
.search button:hover { filter: brightness(1.05); }

/* butonul de tema: 44 x 44 */
.theme-toggle {
  flex: none;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: var(--radius-control);
  box-shadow: var(--shadow);
  color: var(--text);
  font-size: 20px;
  cursor: pointer;
}
.theme-toggle:hover { background: var(--primary-soft); }

/* telefon: logo si tema pe primul rand, cautarea pe tot randul al doilea, inalta de 48px */
@media (max-width: 640px) {
  .topbar { flex-wrap: wrap; }
  .brand { margin-right: auto; }
  .search { order: 1; flex-basis: 100%; height: 48px; }
  .search button { height: 40px; } /* tot la 4px de margine */
}
```

### `web/src/components/SearchBar.jsx`

```jsx
/* SearchBar.jsx - formularul de cautare; textul este tinut in App (componenta controlata)
   M v2.1.0 */
import { IoSearchOutline } from 'react-icons/io5';

export default function SearchBar({ value, onChange, onSubmit }) {
  function handleSubmit(event) {
    event.preventDefault(); // fara reincarcarea paginii
    onSubmit();
  }

  return (
    <form className="search" role="search" onSubmit={handleSubmit}>
      <IoSearchOutline className="search-icon" aria-hidden="true" />
      <label htmlFor="search-input" className="sr-only">Adresa IP sau domeniu</label>
      <input
        id="search-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Cauta o adresa IP sau un domeniu, de exemplu 8.8.8.8 sau github.com"
        autoComplete="off"
        spellCheck={false}
      />
      <button type="submit">Cauta</button>
    </form>
  );
}
```

### Explicatie (pentru prezentare)

- **`children`:** `Header` nu stie nimic despre cautare; primeste bara de cautare de la `App` si o pune intre logo si buton. Asa antetul ramane o componenta de asezare, iar starea cautarii ramane in `App`.
- **Componenta controlata:** `value` vine din state-ul lui `App`, iar fiecare tasta apeleaza `onChange`. De aceea, la click pe o cautare recenta, `App` poate scrie textul in camp. `preventDefault()` opreste reincarcarea paginii la trimiterea formularului.
- **Masuratorile:** `.brand` are 160px; intre logo si cautare sunt 24px (8px margine + 16px gap), intre cautare si buton 16px. Campul are 44px si `padding-right: 3px`, deci cu bordura de 1px butonul de 88 x 36 sta la 4px de margine; `align-items: center` aliniaza iconita, textul si butonul pe aceeasi linie.
- **Designul:** logo-ul este un patrat teal cu globul alb (aceeasi idee ca favicon-ul). Campul de cautare este un card alb cu colturi de 12px, bordura fina si umbra, cu iconita de lupa in stanga. Butonul "Cauta" este coral, singura culoare de actiune din pagina; are text inchis (`--on-accent`), pentru ca alb pe coral ar avea contrast prea mic (3.1:1), iar textul inchis are 5.8:1. Coltul butonului (9px) este coltul campului minus distanta de 3px, ca cele doua sa para concentrice.
- **Focus:** cand scrii in camp, `:focus-within` schimba bordura in teal si adauga un inel teal transparent (`--focus`), ca sa se vada clar unde este cursorul.
- **Telefon (pana la 640px):** `flex-wrap: wrap` permite al doilea rand, `margin-right: auto` impinge butonul de tema la dreapta, iar `order: 1` + `flex-basis: 100%` muta cautarea pe tot randul urmator, cu 48px inaltime.
- **Accesibilitate:** eticheta `.sr-only` este citita de cititoarele de ecran; `role="search"` marcheaza formularul ca zona de cautare.

### Testare

- DevTools, 1280 x 625: logo 160, cautarea incepe la 24px dupa logo, campul are 44px, butonul "Cauta" are 88 x 36 si sta la 4px de margini, butonul de tema are 44 x 44 si sta la 16px de camp.
- 390 x 844: logo si tema pe primul rand, cautarea pe al doilea, 48px.
- Click pe o cautare recenta: textul ei apare in camp.

### Commit

```bash
git add web/src/components/Header.jsx web/src/components/Header.css web/src/components/SearchBar.jsx
git commit -m "feat(web): antetul si bara de cautare dupa noua specificatie"
git push origin M
```

---

## M6. Antetul si bara de cautare pe mobil [mediu]

**Scop:** antetul (logo in stanga, buton de tema in dreapta) si campul de cautare de 48px, cu butonul "Cauta" in interior.

**Fisiere:** `mobile/src/components/Header.js` (inlocuiesti), `mobile/src/components/SearchBar.js` (inlocuiesti).

### `mobile/src/components/Header.js`

```jsx
/* Header.js - antetul aplicatiei mobile: logo-ul in stanga, butonul de tema in dreapta (M v2.1.0) */
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../ThemeContext';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.brand}>
        <View style={[styles.logo, { backgroundColor: colors.primary }]}>
          <Ionicons name="globe-outline" size={20} color={colors.onPrimary} />
        </View>
        <Text style={[styles.name, { color: colors.text }]}>IP Tracker</Text>
      </View>
      <ThemeToggle />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: '600' },
});
```

### `mobile/src/components/SearchBar.js`

```jsx
/* SearchBar.js - campul de cautare de 48px: iconita, textul si butonul coral, la 4px de margine (M v2.1.0) */
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { radius } from '../theme';
import { useTheme } from '../ThemeContext';

export default function SearchBar({ value, onChange, onSubmit }) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.field,
        { backgroundColor: colors.panel, borderColor: colors.border, boxShadow: colors.shadow },
      ]}
    >
      <Ionicons name="search-outline" size={18} color={colors.muted} />
      <TextInput
        value={value}
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
        placeholder="IP sau domeniu, de exemplu 8.8.8.8"
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        returnKeyType="search"
        accessibilityLabel="Adresa IP sau domeniu"
        style={[styles.input, { color: colors.text }]}
      />
      <Pressable
        onPress={onSubmit}
        accessibilityRole="button"
        style={[styles.button, { backgroundColor: colors.accent }]}
      >
        <Text style={[styles.buttonText, { color: colors.onAccent }]}>Cauta</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 14,
    paddingRight: 3, // 3px + bordura de 1px = 4px pana la marginea campului
    borderWidth: 1,
    borderRadius: radius.control,
  },
  input: { flex: 1, height: '100%', fontSize: 16 },
  button: { width: 88, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 9 },
  buttonText: { fontSize: 15, fontWeight: '600' },
});
```

### Explicatie (pentru prezentare)

- **Componentele native:** `View` este echivalentul lui `div`, `Text` al textului (orice text trebuie pus intr-un `Text`), `TextInput` al lui `input`, iar `Pressable` al unui buton.
- **`TextInput`:** `onChangeText` primeste direct textul (pe web luam `event.target.value`). `onSubmitEditing` ruleaza la tasta de trimitere de pe tastatura, care se numeste "Search" datorita lui `returnKeyType`. `keyboardType="url"` afiseaza tastatura cu `.` si `/`; `autoCapitalize` si `autoCorrect` sunt oprite, ca adresele sa nu fie modificate.
- **`StyleSheet`:** stilurile sunt obiecte JavaScript (camelCase, numere fara `px`). In `style` se pot da mai multe obiecte intr-un array: stilul fix din `StyleSheet` plus culorile temei, care se schimba.
- **Masuratori:** camp de 48px, buton de 88 x 40 (48 minus 2 x 4px), la 4px de marginea campului, ca pe web.
- **Designul:** acelasi ca pe web: logo-ul intr-un patrat teal, campul ca un card alb cu colturi de 12px (`radius.control`), iconita de lupa si butonul coral cu text inchis. Umbra vine din `colors.shadow`, prin proprietatea `boxShadow`, care in React Native 0.76+ (folosit de Expo Go) primeste acelasi text ca in CSS si merge pe Android si pe iOS.

### Testare

- In Expo Go: logo-ul si butonul de tema pe primul rand; campul de 48px sub ele.
- Scrii `8.8.8.8` si apesi "Cauta" sau tasta "Search": rezultatul se schimba. Literele nu se transforma automat in majuscule.

### Commit

```bash
git add mobile/src/components/Header.js mobile/src/components/SearchBar.js
git commit -m "feat(mobile): antetul si bara de cautare dupa noua specificatie"
git push origin M
```

---

## Final: jurnalul, PR-ul v2.1.0 si tag-ul

Adaugi la sfarsitul lui `docs/jurnal-M.md` sectiunile de mai jos (le poti adapta):

```markdown
## v2.0.0 - scheletul pentru React si React Native

- Etapa 1 a fost mutata in `vanilla/`, fara modificari.
- `web/`: proiect React creat cu Vite; dependinte: leaflet, react-leaflet, react-icons, vitest.
- `mobile/`: proiect Expo (template blank); dependinte: react-native-maps, AsyncStorage, safe-area-context, vector-icons, expo-font.
- `shared/`: cod comun pentru web si mobil; `vite.config.js` si `metro.config.js` il fac vizibil pentru ambele proiecte.
- Designul teal si coral (culori pline, carduri cu colturi de 16px, umbre fine, tonuri pentru iconite), ca tokeni: `index.css` (web) si `theme.js` (mobil), cu tema intunecata echivalenta si contrastul verificat.
- `App.jsx` / `App.js` cu structura finala si versiuni temporare pentru fisierele lui R si D, ca toti trei sa lucreze in paralel.

## v2.1.0 - API comun, cautare, antet si tema

- `shared/api.js`: validarea din v1.2.0, campul nou `reverse` (hostname), rezultat in forma plata, cache in memorie (`Map`); teste Vitest.
- `shared/useGeoSearch.js`: rezultatul, eroarea si incarcarea; cautarea IP-ului propriu la pornire; raspunsurile vechi sunt ignorate.
- Tema: `useTheme` + `ThemeToggle` pe web (`data-theme`, localStorage), `ThemeContext` + `ThemeToggle` pe mobil (AsyncStorage).
- Antetul si bara de cautare pe web (160 / 24 / camp / 16 / 44) si pe mobil (camp de 48px): logo teal, camp alb cu iconita si umbra, buton coral; iconite Ionicons (react-icons pe web, @expo/vector-icons pe mobil).
```

```bash
git add docs/jurnal-M.md
git commit -m "docs: jurnalul lui M pentru v2.0.0 si v2.1.0"
git push origin M
```

Deschizi PR-ul `M` -> `main` ("v2.1.0: API comun, cautare, antet si tema"). Dupa unire:

```bash
git checkout main
git pull origin main
git tag -a v2.1.0 -m "M: API comun, cautare, antet si tema"
git push origin v2.1.0
git checkout M
```

---

## Intrebari posibile la prezentare

**De ce Vite si nu Create React App?** Create React App nu mai este intretinut. Vite porneste instant, actualizeaza pagina la fiecare salvare fara reincarcare completa si face un build mic pentru productie.

**Ce este Expo si de ce nu React Native "simplu"?** Expo este un set de unelte peste React Native. Cu Expo Go rulam aplicatia direct pe telefon, fara Android Studio sau Xcode, iar `npx expo install` alege versiuni compatibile intre ele.

**Ce contine `shared/` si cum il vad cele doua proiecte?** Validarea, cererea catre API si hook-ul de cautare (plus formatarea lui R si istoricul lui D). Vite il vede prin `server.fs.allow` si `resolve.dedupe`, iar Metro prin `watchFolders` si `resolver.nodeModulesPaths`.

**Ce face `useGeoSearch` si de ce `useRef`?** Tine rezultatul, eroarea si incarcarea. Numarul ultimei cereri este in `useRef` pentru ca trebuie pastrat intre afisari fara sa provoace redesenare. Cu el, un raspuns intarziat nu suprascrie unul mai nou.

**De ce cererea de la pornire apare de doua ori in Network?** In dezvoltare, `StrictMode` ruleaza efectele de doua ori, ca sa gaseasca efecte fara curatare. Prima cerere este ignorata prin `isLatest`; in build-ul final este o singura cerere.

**De ce `search` intoarce `true` sau `false`?** Ca hook-ul sa nu depinda de istoric. `App` decide: salveaza in istoric doar o cautare reusita, cu text.

**Ce este o componenta controlata?** Un camp al carui text vine din state (`value`) si se schimba prin `onChange`. Asa `App` poate scrie in camp textul unei cautari recente.

**Cum functioneaza tema pe web fata de mobil?** Pe web: atributul `data-theme` pe `<html>` si variabile CSS. Pe mobil nu exista CSS: un Context ofera obiectul de culori, iar fiecare componenta il citeste cu `useTheme()`.

**De ce scriptul din `index.html`?** Ruleaza inainte de React si aplica tema salvata, ca pagina sa nu clipeasca alb la incarcare.

**Cum ati ales designul?** Am pastrat asezarea si dimensiunile din specificatie, dar am facut interfata mai prietenoasa: o paleta teal si coral cu culori pline (fara gradient), carduri cu colturi rotunjite si umbre fine, iconite colorate. Teal-ul este culoarea principala (logo, cardul cu rezultatul, linkuri), coralul este culoarea de actiune (butonul "Cauta", markerul).

**Ce sunt tokenii de design?** Valorile designului (culori, colturi, umbre) puse intr-un singur loc, ca variabile: `index.css` pe web, `theme.js` pe mobil. Componentele folosesc doar numele (`var(--primary)`, `colors.primary`), deci o culoare se schimba dintr-un singur loc, iar tema intunecata inseamna doar alte valori.

**De ce butonul coral are text inchis?** Textul alb pe coral ar avea un contrast de doar 3.1:1, sub minimul de 4.5:1 pentru text. Textul aproape negru are 5.8:1, deci se citeste usor.

**De ce cache-ul este un `Map` si nu `sessionStorage`?** `sessionStorage` nu exista in React Native. Un `Map` in memorie merge si pe web, si pe telefon.

**De ce merge ip-api.com doar pe http?** Planul gratuit nu ofera HTTPS. Pe `http://localhost` si in Expo Go cererile merg; pe o pagina HTTPS browserul le blocheaza, iar aplicatia afiseaza un mesaj.

**Ce este AsyncStorage?** Echivalentul lui `localStorage` pe telefon: salveaza text sub o cheie. Raspunde asincron, printr-un Promise, ca sa nu blocheze interfata.
