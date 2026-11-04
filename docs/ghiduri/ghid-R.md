# Ghid R - rezumatul, detaliile cu ora locala si harta

| | |
|---|---|
| GitHub | adevaratulrazvanlrs |
| Branch | `R` |
| Versiune | v2.2.0 |
| Fisiere | `shared/format.js`, `shared/useClock.js`, `web/tests/format.test.js`; web: `ResultSummary`, `DetailsPanel`, `MapPanel` (cu fisierele `.css`); mobil: `ResultSummary`, `DetailsPanel`, `MapPanel`, `Skeleton` |

Citeste mai intai [ghidul comun](README.md), mai ales sectiunile 2-4 (structura si contractul) si 9 (designul teal si coral). Este aceeasi zona ca in v1.3.0 (detalii, ora locala, incarcare, harta), acum in React si React Native.

| Task | Ce faci | Dificultate |
|---|---|---|
| R1 | `shared/format.js`: textele afisate, lista de detalii cu iconite si tonuri + teste | usor |
| R2 | `shared/useClock.js`: ora locala actualizata in fiecare secunda | mediu |
| R3 | web: cardul cu rezultatul si panoul de detalii | mediu |
| R4 | web: harta cu react-leaflet | greu |
| R5 | mobil: cardul cu rezultatul si panoul de detalii | mediu |
| R6 | mobil: harta cu react-native-maps | greu |

**Ce primesti de la ceilalti (si nu modifici):** rezultatul cautarii si `loading` prin props (de la `App`); variabilele CSS, clasele comune si tonurile din `web/src/index.css`; `useTheme()` si `theme.js` pe mobil (toate de la M). D pune componentele tale in carduri; cardul cu rezultatul este colorat in teal de D (`.summary` pe web, `<Panel variant="primary">` pe mobil).

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
   git checkout R
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

**Date de proba:** pana cand M termina API-ul, `useGeoSearch` din schelet intoarce mereu datele pentru 8.8.8.8 (Ashburn, Virginia). Ca sa vezi blocurile de incarcare, schimba temporar `loading: false` in `loading: true` in `shared/useGeoSearch.js`, apoi anuleaza modificarea, fara commit:

```bash
git checkout -- shared/useGeoSearch.js
```

Dupa ce PR-ul lui M (v2.1.0) ajunge pe `main`, poti rula `git merge origin/main` ca sa lucrezi cu date reale.

---

## R1. Textele afisate: `shared/format.js` [usor]

**Scop:** functiile care transforma un rezultat in texte, folosite si pe web, si pe mobil. Lista campurilor din detalii (cu eticheta, iconita si culoarea fiecaruia) este scrisa o singura data, aici.

**Fisiere:** `shared/format.js` (nou), `web/tests/format.test.js` (nou; VS Code creeaza si folderul `tests` daca lipseste).

### `shared/format.js`

```js
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
```

### `web/tests/format.test.js`

```js
/* format.test.js - teste pentru shared/format.js (R v2.2.0) */
import { describe, expect, it } from 'vitest';
import { detailFields, formatLocalTime, formatLocation } from '../../shared/format';

describe('formatLocation', () => {
  it('uneste orasul, regiunea si tara', () => {
    const place = { city: 'Ashburn', region: 'Virginia', country: 'United States' };
    expect(formatLocation(place)).toBe('Ashburn, Virginia, United States');
  });

  it('sare peste campurile lipsa', () => {
    expect(formatLocation({ city: '', region: '', country: 'Romania' })).toBe('Romania');
    expect(formatLocation({})).toBe('Necunoscuta');
  });
});

describe('formatLocalTime', () => {
  it('afiseaza ora din fusul orar dat', () => {
    const noon = new Date('2026-01-15T12:00:00Z');
    expect(formatLocalTime('UTC', noon)).toContain('12:00:00');
    expect(formatLocalTime('Europe/Bucharest', noon)).toContain('14:00:00');
  });

  it('intoarce text gol pentru un fus orar lipsa sau invalid', () => {
    expect(formatLocalTime('')).toBe('');
    expect(formatLocalTime('Nu/Exista')).toBe('');
  });
});

describe('detailFields', () => {
  it('pune textele de rezerva pentru campurile lipsa', () => {
    const values = detailFields({ ip: '1.1.1.1', city: 'Sydney' }, '').map((field) => field.value);
    expect(values).toEqual(['Indisponibil', 'Necunoscut', 'Sydney', 'Necunoscut', 'Necunoscuta']);
  });

  it('da fiecarui camp o iconita si un ton', () => {
    const fields = detailFields({}, '');
    expect(fields.every((field) => field.icon && field.tone)).toBe(true);
  });
});
```

### Explicatie (pentru prezentare)

- `formatLocation` este linia `where` din `details.js` (v1.3.0): `filter(Boolean)` scoate campurile goale, iar `|| 'Necunoscuta'` acopera cazul in care lipsesc toate.
- `formatLocalTime` foloseste `Intl.DateTimeFormat`, API-ul de formatare din JavaScript. Optiunea `timeZone` calculeaza ora din fusul orar al locatiei gasite, nu din cel al calculatorului; `'ro-RO'` da formatul romanesc ("4 nov. 2026, 14:03:22"). Un fus orar necunoscut ar arunca o eroare, de aceea exista `try / catch`. Optiunile sunt scrise explicit, ca rezultatul sa fie acelasi in browser si pe telefon.
- `detailFields` intoarce cele 5 campuri in ordinea afisarii, cu textele de rezerva ("Indisponibil", "Necunoscut"). Adresa IP nu mai apare aici, pentru ca este deja mare in cardul cu rezultatul, deasupra.
- Fiecare camp are si `icon` (numele iconitei din setul Ionicons, de exemplu `server-outline`) si `tone` (culoarea ei: teal, coral, amber, blue, plum). Culoarea arata tipul informatiei, iar web-ul si mobilul folosesc aceleasi nume. Componentele doar parcurg lista si o afiseaza, deci etichetele, iconitele si culorile nu sunt scrise de doua ori.
- Testele folosesc o data fixa (15 ianuarie, 12:00 UTC), ca rezultatul sa nu depinda de momentul rularii: in Bucuresti este 14:00 (UTC+2 iarna).

### Testare

```bash
cd web
npm test
```

Cele 6 teste din `format.test.js` trebuie sa treaca.

### Commit

```bash
cd ..
git add shared/format.js web/tests/format.test.js
git commit -m "feat(shared): formatarea locatiei, a orei locale si lista de detalii cu iconite"
git push origin R
```

---

## R2. Ora locala: `shared/useClock.js` [mediu]

**Scop:** un hook care intoarce data si ora din fusul orar dat si se actualizeaza in fiecare secunda.

**Fisiere:** `shared/useClock.js` (nou).

```js
/* useClock.js - data si ora locala dintr-un fus orar, actualizate in fiecare secunda (R v2.2.0) */
import { useEffect, useState } from 'react';
import { formatLocalTime } from './format';

export function useClock(timeZone) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer); // oprim ceasul cand componenta dispare de pe ecran
  }, []);

  return formatLocalTime(timeZone, now);
}
```

### Explicatie (pentru prezentare)

- `now` este state: la fiecare secunda, `setNow(new Date())` il schimba, iar componenta care foloseste hook-ul se redeseneaza cu ora noua.
- `useEffect(..., [])` porneste cronometrul o singura data, cand componenta apare. Functia intoarsa este **cleanup-ul**: React o apeleaza cand componenta dispare, iar `clearInterval` opreste cronometrul. In v1.3.0, `startClock` facea manual `clearInterval` la fiecare cautare; aici React se ocupa de asta.
- Fusul orar nu este in lista de dependinte: cronometrul doar actualizeaza momentul curent, iar textul se calculeaza la fiecare afisare cu fusul primit atunci. Cand vine alt rezultat, ora se schimba imediat, fara un cronometru nou.
- Hook-ul este in `shared/` pentru ca foloseste doar React (nu HTML sau componente native), deci merge identic pe web si pe mobil.

### Testare

Hook-ul se vede in R3 si R5 (campul "Data si ora locala" se schimba in fiecare secunda).

### Commit

```bash
git add shared/useClock.js
git commit -m "feat(shared): hook-ul useClock pentru ora locala"
git push origin R
```

---

## R3. Web: cardul cu rezultatul si panoul de detalii [mediu]

**Scop:** cardul teal cu adresa IP mare si locatia, apoi detaliile, fiecare cu iconita lui colorata, cu blocuri gri cat timp se incarca.

**Fisiere:** `web/src/components/ResultSummary.jsx` (inlocuiesti), `ResultSummary.css` (nou), `DetailsPanel.jsx` (inlocuiesti), `DetailsPanel.css` (nou).

### `web/src/components/ResultSummary.jsx`

```jsx
/* ResultSummary.jsx - cardul cu rezultatul: adresa IP si locatia, pe fundalul teal (R v2.2.0) */
import { IoGlobeOutline } from 'react-icons/io5';
import { formatLocation } from '../../../shared/format';
import './ResultSummary.css';

export default function ResultSummary({ result, loading }) {
  const empty = loading || !result; // fara date de afisat: blocuri translucide

  return (
    <div className="summary-card">
      <div>
        <h2 className="summary-label">Rezultat</h2>
        <p className={empty ? 'summary-ip skeleton' : 'summary-ip numeric'}>
          {empty ? '\u00a0' : result.ip}
        </p>
        <p className={empty ? 'summary-place skeleton' : 'summary-place'}>
          {empty ? '\u00a0' : formatLocation(result)}
        </p>
      </div>
      <span className="summary-icon" aria-hidden="true">
        <IoGlobeOutline />
      </span>
    </div>
  );
}
```

### `web/src/components/ResultSummary.css`

```css
/* ResultSummary.css - cardul cu rezultatul; fundalul teal il pune D pe .summary, in App.css (R v2.2.0) */
.summary-card { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.summary-label { font-size: 13px; font-weight: 500; color: var(--on-primary-muted); }
.summary-ip { margin-top: 6px; font-size: 24px; font-weight: 600; color: var(--on-primary); }
.summary-place { margin-top: 2px; color: var(--on-primary-muted); }
.summary-icon {
  flex: none;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.16);
  color: var(--on-primary);
  font-size: 20px;
}

/* blocurile de incarcare trebuie sa se vada pe teal */
.summary-card .skeleton { background: rgba(255, 255, 255, 0.2); }
```

### `web/src/components/DetailsPanel.jsx`

```jsx
/* DetailsPanel.jsx - detaliile rezultatului, fiecare cu iconita lui colorata; ora locala in timp real (R v2.2.0) */
import { IoBusinessOutline, IoEarthOutline, IoLocationOutline, IoServerOutline, IoTimeOutline } from 'react-icons/io5';
import { detailFields } from '../../../shared/format';
import { useClock } from '../../../shared/useClock';
import './DetailsPanel.css';

// numele iconitelor din detailFields (aceleasi ca pe mobil) -> componentele din react-icons
const ICONS = {
  'server-outline': IoServerOutline,
  'business-outline': IoBusinessOutline,
  'location-outline': IoLocationOutline,
  'earth-outline': IoEarthOutline,
  'time-outline': IoTimeOutline,
};

// clasele unei valori: bloc gri cat timp se incarca, cifre tabulare pentru ceas
function valueClass(empty, numeric) {
  if (empty) return 'value skeleton';
  return numeric ? 'value numeric' : 'value';
}

export default function DetailsPanel({ result, loading }) {
  const clock = useClock(result?.timezone);
  const empty = loading || !result;

  return (
    <>
      <h2 className="section-title">Detalii</h2>
      <ul className="fields">
        {detailFields(result ?? {}, clock).map((field) => {
          const Icon = ICONS[field.icon];
          return (
            <li key={field.label} className="field">
              <span className={`field-icon tone-${field.tone}`} aria-hidden="true">
                <Icon />
              </span>
              <div>
                <p className="label">{field.label}</p>
                <p className={valueClass(empty, field.numeric)}>{empty ? '\u00a0' : field.value}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
```

### `web/src/components/DetailsPanel.css`

```css
/* DetailsPanel.css - fiecare camp: iconita colorata in stanga, eticheta 12px si valoarea 15px in dreapta,
   4px intre eticheta si valoare, 16px intre campuri (R v2.2.0) */
.fields { display: grid; gap: 16px; margin-top: 16px; }
.field { display: flex; align-items: center; gap: 12px; min-width: 0; }
.field > div { min-width: 0; } /* textele lungi se rup pe randul urmator, nu ies din card */
.field-icon {
  flex: none;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: var(--tone-bg); /* --tone si --tone-bg vin din clasa tone-... (index.css) */
  color: var(--tone);
  font-size: 18px;
}
.field .label { margin-bottom: 4px; }
```

### Explicatie (pentru prezentare)

- **Fragmentul `<>...</>`:** `DetailsPanel` intoarce titlul si lista fara un `div` in plus. Cardul alb (fundal, colturi, umbra) il pune D, prin containerul `.section` din `App.jsx`; componentele deseneaza doar continutul.
- **Cardul cu rezultatul:** fundalul teal vine de la D (`.summary` in `App.css`), iar `ResultSummary` foloseste culorile pentru text pe teal: `--on-primary` (alb) si `--on-primary-muted` (alb usor verzui, verificat la contrast). Iconita globului sta intr-un patrat alb translucid, ca un mic accent.
- **`empty`:** cat timp se incarca sau nu exista inca un rezultat, valorile sunt inlocuite cu blocuri (`.skeleton` din `index.css`); pe teal blocurile devin albe translucide, ca sa se vada. `'\u00a0'` este un spatiu care nu se strange, ca blocul sa aiba inaltimea unui rand de text.
- **Lista de detalii:** `detailFields(...).map(...)` face cate un rand pentru fiecare camp: patratul colorat cu iconita, apoi eticheta si valoarea. `key={field.label}` ii spune lui React care rand este care; `result ?? {}` da un obiect gol cat timp rezultatul este `null`, ca etichetele sa apara oricum. Am folosit o lista (`ul` / `li`) in loc de `dl`, pentru ca un `dl` nu poate contine iconite intre `dt` si `dd`.
- **Iconitele:** in `detailFields` sunt doar nume (`server-outline`), aceleasi ca pe mobil. Obiectul `ICONS` transforma numele in componenta potrivita din `react-icons/io5` (acelasi set Ionicons). `const Icon = ICONS[field.icon]` si apoi `<Icon />`: in JSX, o variabila cu litera mare poate fi folosita ca o componenta.
- **Tonurile:** clasa `tone-coral` (din `index.css`, de la M) seteaza `--tone` si `--tone-bg`; patratul foloseste fundalul deschis si iconita mai inchisa a aceluiasi ton. In tema intunecata, aceeasi clasa primeste alte valori, deci componenta nu se schimba.
- **Masuratori:** titlu 16px semibold, eticheta 12px secundara, valoare 15px medium, 4px intre eticheta si valoare, 16px intre campuri. Ceasul are `.numeric` (`tabular-nums`), ca cifrele sa nu "danseze" cand se schimba.

### Testare

- In browser: cardul teal arata `8.8.8.8` si "Ashburn, Virginia, United States"; detaliile au 5 randuri cu iconite colorate, iar ora se schimba in fiecare secunda.
- Cu `loading: true` temporar in `shared/useGeoSearch.js`: blocuri gri in detalii si albe translucide pe teal. Apoi `git checkout -- shared/useGeoSearch.js`.
- In tema intunecata iconitele isi schimba culorile, dar raman usor de citit.
- Fundalul teal apare dupa ce D termina `App.css` (D3); pana atunci textul alb se vede pe fundalul temporar, iar asta e normal.

### Commit

```bash
git add web/src/components/ResultSummary.jsx web/src/components/ResultSummary.css web/src/components/DetailsPanel.jsx web/src/components/DetailsPanel.css
git commit -m "feat(web): cardul cu rezultatul si detaliile cu iconite colorate"
git push origin R
```

---

## R4. Web: harta cu react-leaflet [greu]

**Scop:** harta OpenStreetMap cu un punct coral si un halou la locatia aproximativa, eticheta "Locatie aproximativa a IP-ului" ca pastila peste harta, zbor animat la fiecare rezultat nou, spinner la incarcare si harta intunecata in tema intunecata.

**Fisiere:** `web/src/components/MapPanel.jsx` (inlocuiesti), `web/src/components/MapPanel.css` (nou).

### `web/src/components/MapPanel.jsx`

```jsx
/* MapPanel.jsx - harta OpenStreetMap cu locatia aproximativa a IP-ului (R v2.2.0) */
import { useEffect } from 'react';
import { IoLocationSharp } from 'react-icons/io5';
import { CircleMarker, MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPanel.css';

const WORLD = [20, 0]; // vederea de pornire: toata lumea

// muta harta animat la coordonatele noi (useMap da acces la harta din MapContainer)
function FlyTo({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lon], 11, { duration: 1.2 });
  }, [map, lat, lon]);
  return null;
}

export default function MapPanel({ result, loading }) {
  return (
    <div className="map">
      <MapContainer center={WORLD} zoom={2} zoomControl={false} className="map-leaflet">
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={19}
        />
        <ZoomControl position="topright" />
        {result && (
          <>
            <CircleMarker
              center={[result.latitude, result.longitude]}
              radius={22}
              pathOptions={{ className: 'map-halo' }}
            />
            <CircleMarker
              center={[result.latitude, result.longitude]}
              radius={8}
              pathOptions={{ className: 'map-marker' }}
            />
            <FlyTo lat={result.latitude} lon={result.longitude} />
          </>
        )}
      </MapContainer>
      <p className="map-caption">
        <IoLocationSharp aria-hidden="true" />
        Locatie aproximativa a IP-ului
      </p>
      {loading && <div className="map-spinner" aria-hidden="true" />}
    </div>
  );
}
```

### `web/src/components/MapPanel.css`

```css
/* MapPanel.css - harta umple cardul; eticheta si spinner-ul stau deasupra ei (R v2.2.0) */
.map { position: relative; height: 100%; min-height: 280px; } /* 280px = inaltimea pe telefon */
.map-leaflet { position: absolute; inset: 0; z-index: 0; font-family: inherit; background: var(--skeleton); }

/* eticheta: o pastila peste harta, in stanga sus */
.map-caption {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1; /* deasupra hartii (harta are z-index 0) */
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--panel);
  box-shadow: var(--shadow);
  font-size: 12px;
  color: var(--muted);
}
.map-caption svg { font-size: 14px; color: var(--accent); }

/* markerul: punct coral cu margine alba si un halou transparent in jur */
.map-marker { fill: var(--accent); fill-opacity: 1; stroke: #ffffff; stroke-width: 3; }
.map-halo { fill: var(--accent); fill-opacity: 0.22; stroke: none; }

/* spinner peste harta cat timp se incarca */
.map-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  width: 40px;
  height: 40px;
  margin: -20px 0 0 -20px;
  border: 4px solid var(--primary-soft);
  border-top-color: var(--primary-text);
  border-radius: 50%;
  animation: map-spin 0.8s linear infinite;
}
@keyframes map-spin { to { transform: rotate(360deg); } }

/* tema intunecata: tile-urile hartii sunt inversate (filtrul vine din v1.4.0) */
[data-theme='dark'] .leaflet-tile-pane {
  filter: invert(1) hue-rotate(180deg) brightness(0.92) contrast(0.9) saturate(0.8);
}

/* controalele Leaflet in stilul aplicatiei: colturi rotunjite, umbra fina, culorile temei */
.map .leaflet-bar { border: 1px solid var(--border); border-radius: 10px; overflow: hidden; box-shadow: var(--shadow); }
.map .leaflet-bar a { background: var(--panel); color: var(--text); border-bottom-color: var(--border); }
.map .leaflet-bar a:hover { background: var(--primary-soft); }
.map .leaflet-control-attribution { border-radius: 8px 0 0 0; background: var(--panel); color: var(--muted); }
.map .leaflet-control-attribution a { color: var(--primary-text); }
```

### Explicatie (pentru prezentare)

- **react-leaflet** este varianta React a bibliotecii Leaflet din v1.3.0. In loc de `L.map(...)` si `L.tileLayer(...)` scriem componente: `MapContainer` creeaza harta, `TileLayer` adauga imaginile (tile-urile) OpenStreetMap, `CircleMarker` deseneaza cercurile, `ZoomControl` butoanele +/-. CSS-ul Leaflet se importa direct in componenta.
- `center` si `zoom` din `MapContainer` sunt folosite doar la creare; dupa aceea harta se muta prin cod. `zoomControl={false}` scoate butoanele din stanga sus, iar `<ZoomControl position="topright" />` le pune in dreapta, ca sa lase loc etichetei.
- **`FlyTo` si `useMap`:** `useMap()` da acces la obiectul Leaflet al hartii, dar functioneaza doar in componentele din interiorul lui `MapContainer`. De aceea zborul este o componenta mica, care nu afiseaza nimic (`return null`) si apeleaza `map.flyTo` intr-un efect, ca `updateMap` din v1.3.0.
- **Dependintele `[map, lat, lon]`** sunt numere, nu un array nou. Un array `[lat, lon]` ar fi alt obiect la fiecare afisare (de exemplu la fiecare tasta din bara de cautare), iar harta ar zbura din nou fara motiv.
- **Markerul:** doua `CircleMarker` pe aceleasi coordonate: haloul mare, coral transparent, si punctul coral cu margine alba. Cercurile sunt desenate in SVG, deci nu depind de imaginea markerului (care se pierde usor la build cu Vite) si primesc culoarea din CSS prin `className`. Un punct cu halou sugereaza o zona aproximativa, nu adresa exacta a unui dispozitiv; pastila de deasupra o spune explicit.
- **Pastila si `z-index`:** harta are `z-index: 0`, deci straturile Leaflet raman "inchise" in ea, iar pastila si spinner-ul, cu `z-index: 1`, stau mereu deasupra.
- **URL-ul tile-urilor:** `https://tile.openstreetmap.org/{z}/{x}/{y}.png`, fara subdomeniile `a/b/c`, cum recomanda acum OpenStreetMap. Atributia OpenStreetMap este obligatorie.
- **Inaltimea:** `.map` umple cardul pus de D (`height: 100%`), dar are cel putin 280px, inaltimea hartii pe telefon. Colturile rotunjite le taie cardul lui D (`overflow: hidden`).
- **Tema intunecata:** filtrul CSS inverseaza doar stratul cu tile-uri (din v1.4.0); punctul si haloul sunt in alt strat, deci raman coral. Butoanele +/- si atributia primesc colturi rotunjite, umbra fina si culorile temei.

### Testare

- In browser: harta zboara la Ashburn (datele de proba), cu punctul coral si haloul; pastila "Locatie aproximativa a IP-ului" in stanga sus, butoanele +/- in dreapta sus.
- Tema intunecata: harta devine inchisa, punctul ramane coral.
- Cu `loading: true` temporar in `shared/useGeoSearch.js`: spinner-ul teal se roteste peste harta. Apoi `git checkout -- shared/useGeoSearch.js`.
- Consola fara erori. Dupa API-ul lui M, la fiecare cautare harta zboara la locatia noua.

### Commit

```bash
git add web/src/components/MapPanel.jsx web/src/components/MapPanel.css
git commit -m "feat(web): harta cu react-leaflet, marker coral cu halou si zbor animat"
git push origin R
```

---

## R5. Mobil: cardul cu rezultatul si panoul de detalii [mediu]

**Scop:** aceleasi informatii ca pe web, cu componente React Native.

**Fisiere:** `mobile/src/components/Skeleton.js` (nou), `ResultSummary.js` (inlocuiesti), `DetailsPanel.js` (inlocuiesti).

### `mobile/src/components/Skeleton.js`

```jsx
/* Skeleton.js - bloc afisat in locul unui text cat timp se incarca (R v2.2.0)
   onPrimary = blocul sta pe cardul teal, deci este alb translucid. */
import { View } from 'react-native';
import { useTheme } from '../ThemeContext';

export default function Skeleton({ width = 180, height = 20, onPrimary = false }) {
  const { colors } = useTheme();
  const backgroundColor = onPrimary ? 'rgba(255, 255, 255, 0.2)' : colors.skeleton;
  return <View style={{ width, height, borderRadius: 6, backgroundColor }} />;
}
```

### `mobile/src/components/ResultSummary.js`

```jsx
/* ResultSummary.js - cardul cu rezultatul: adresa IP si locatia, pe fundalul teal (R v2.2.0)
   Fundalul teal il pune App.js, prin <Panel variant="primary"> (D). */
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { formatLocation } from '../../../shared/format';
import { type } from '../theme';
import { useTheme } from '../ThemeContext';
import Skeleton from './Skeleton';

export default function ResultSummary({ result, loading }) {
  const { colors } = useTheme();
  const empty = loading || !result; // fara date de afisat: blocuri translucide

  return (
    <View style={styles.row}>
      <View style={styles.lines}>
        <Text style={[styles.label, { color: colors.onPrimaryMuted }]}>Rezultat</Text>
        {empty ? (
          <Skeleton width={160} height={30} onPrimary />
        ) : (
          <Text style={[styles.ip, type.numeric, { color: colors.onPrimary }]}>{result.ip}</Text>
        )}
        {empty ? (
          <Skeleton width={200} onPrimary />
        ) : (
          <Text style={[type.value, { color: colors.onPrimaryMuted }]}>{formatLocation(result)}</Text>
        )}
      </View>
      <View style={styles.icon}>
        <Ionicons name="globe-outline" size={20} color={colors.onPrimary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  lines: { flex: 1, gap: 4 },
  label: { fontSize: 13, fontWeight: '500' },
  ip: { fontSize: 24, fontWeight: '600' },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
});
```

### `mobile/src/components/DetailsPanel.js`

```jsx
/* DetailsPanel.js - detaliile rezultatului, fiecare cu iconita lui colorata; ora locala in timp real (R v2.2.0) */
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { detailFields } from '../../../shared/format';
import { useClock } from '../../../shared/useClock';
import { type } from '../theme';
import { useTheme } from '../ThemeContext';
import Skeleton from './Skeleton';

export default function DetailsPanel({ result, loading }) {
  const { colors } = useTheme();
  const clock = useClock(result?.timezone);
  const empty = loading || !result;

  return (
    <View>
      <Text style={[type.title, styles.title, { color: colors.text }]}>Detalii</Text>
      <View style={styles.fields}>
        {detailFields(result ?? {}, clock).map((field) => {
          const tone = colors.tones[field.tone]; // { fg, bg } pentru iconita
          return (
            <View key={field.label} style={styles.field}>
              <View style={[styles.icon, { backgroundColor: tone.bg }]}>
                <Ionicons name={field.icon} size={18} color={tone.fg} />
              </View>
              <View style={styles.text}>
                <Text style={[type.label, { color: colors.muted }]}>{field.label}</Text>
                {empty ? (
                  <Skeleton />
                ) : (
                  <Text style={[type.value, field.numeric && type.numeric, { color: colors.text }]}>
                    {field.value}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { marginBottom: 16 },
  fields: { gap: 16 }, // 16px intre campuri
  field: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, gap: 4 }, // 4px intre eticheta si valoare
});
```

### Explicatie (pentru prezentare)

- **Aceeasi logica, alte elemente:** `formatLocation`, `detailFields` si `useClock` sunt exact cele de pe web (din `shared/`). Difera doar afisarea: `View` in loc de `div` / `li`, `Text` in loc de `p`.
- **Iconitele:** pe mobil, `<Ionicons name={field.icon} />` primeste direct numele din `detailFields`, pentru ca `@expo/vector-icons` foloseste aceleasi nume Ionicons. Culoarea vine din `colors.tones[field.tone]`: `bg` pentru patrat, `fg` pentru iconita. Pe web exista clasele `tone-...`; pe mobil, unde nu avem CSS, tonurile sunt obiecte in `theme.js` (M).
- **Cardul teal:** fundalul il pune `App.js` (`<Panel variant="primary">`, de la D), iar `ResultSummary` foloseste `colors.onPrimary` si `colors.onPrimaryMuted` pentru text. `Skeleton` primeste `onPrimary`, ca blocurile sa fie albe translucide pe teal.
- **Array de stiluri:** `style={[type.value, field.numeric && type.numeric, { color }]}` combina mai multe stiluri; un `false` (cand campul nu este numeric) este ignorat. `fontVariant: ['tabular-nums']` este echivalentul lui `font-variant-numeric` din CSS.
- **`gap`:** spatiul dintre elementele unui `View` (16px intre campuri, 4px intre eticheta si valoare, 12px intre iconita si text).

### Testare

- In Expo Go: rezumatul cu 8.8.8.8 si locatia, detaliile cu 5 randuri si iconite colorate, ora se schimba in fiecare secunda.
- Cu `loading: true` temporar: blocuri gri, respectiv albe translucide pe teal. Apoi `git checkout -- shared/useGeoSearch.js`.
- Tema intunecata a telefonului (sau butonul lui M, dupa v2.1.0): textele si iconitele isi schimba culorile.

### Commit

```bash
git add mobile/src/components/Skeleton.js mobile/src/components/ResultSummary.js mobile/src/components/DetailsPanel.js
git commit -m "feat(mobile): cardul cu rezultatul si detaliile cu iconite colorate"
git push origin R
```

---

## R6. Mobil: harta cu react-native-maps [greu]

**Scop:** harta de 280px cu punctul coral si haloul, pastila cu eticheta peste harta, mutare animata la fiecare rezultat, spinner si stil intunecat.

**Fisiere:** `mobile/src/components/MapPanel.js` (inlocuiesti).

```jsx
/* MapPanel.js - harta cu locatia aproximativa a IP-ului (R v2.2.0)
   react-native-maps foloseste Google Maps pe Android si Apple Maps pe iOS; este inclus in Expo Go. */
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { type } from '../theme';
import { useTheme } from '../ThemeContext';

const WORLD = { latitude: 20, longitude: 0, latitudeDelta: 100, longitudeDelta: 100 };
const CITY_ZOOM = { latitudeDelta: 0.2, longitudeDelta: 0.2 }; // cat de mult se apropie harta

// stil intunecat pentru Google Maps (Android); pe iOS tema se alege cu userInterfaceStyle
const DARK_MAP = [
  { elementType: 'geometry', stylers: [{ color: '#1d2329' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#9aa5b4' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1d2329' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2b333d' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1a26' }] },
];

export default function MapPanel({ result, loading }) {
  const { colors, isDark } = useTheme();
  const mapRef = useRef(null); // acces direct la harta, pentru animateToRegion
  const [ready, setReady] = useState(false); // harta s-a incarcat si poate fi mutata
  const lat = result?.latitude;
  const lon = result?.longitude;

  // la fiecare rezultat nou, harta se muta animat la locatie
  useEffect(() => {
    if (ready && lat != null && lon != null) {
      mapRef.current?.animateToRegion({ latitude: lat, longitude: lon, ...CITY_ZOOM }, 1200);
    }
  }, [ready, lat, lon]);

  return (
    <View style={styles.map}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={WORLD}
        onMapReady={() => setReady(true)}
        userInterfaceStyle={isDark ? 'dark' : 'light'}
        customMapStyle={isDark ? DARK_MAP : []}
      >
        {result && (
          <Marker coordinate={{ latitude: lat, longitude: lon }} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={[styles.halo, { backgroundColor: colors.accentSoft }]}>
              <View style={[styles.dot, { backgroundColor: colors.accent }]} />
            </View>
          </Marker>
        )}
      </MapView>
      <View style={[styles.caption, { backgroundColor: colors.panel, boxShadow: colors.shadow }]}>
        <Ionicons name="location" size={14} color={colors.accent} />
        <Text style={[type.label, { color: colors.muted }]}>Locatie aproximativa a IP-ului</Text>
      </View>
      {loading && <ActivityIndicator style={StyleSheet.absoluteFill} size="large" color={colors.primaryText} />}
    </View>
  );
}

const styles = StyleSheet.create({
  map: { height: 280 },
  caption: {
    position: 'absolute', // pastila sta peste harta, in stanga sus
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  halo: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 18, height: 18, borderRadius: 9, borderWidth: 3, borderColor: '#FFFFFF' },
});
```

### Explicatie (pentru prezentare)

- **react-native-maps** afiseaza harta nativa a telefonului: Google Maps pe Android, Apple Maps pe iOS. Este inclusa in Expo Go, deci nu trebuie cheie API pentru testare (doar pentru publicare in magazin).
- **Regiunea:** in loc de zoom, harta foloseste `latitudeDelta` / `longitudeDelta` (cate grade se vad). 100 inseamna aproape toata lumea, 0.2 un oras.
- **`useRef` + `animateToRegion`:** `mapRef` tine referinta la componenta nativa a hartii, iar `animateToRegion(regiune, 1200)` o muta animat in 1,2 secunde (echivalentul lui `flyTo` de pe web).
- **`onMapReady` si `ready`:** pe Android, o comanda trimisa inainte ca harta sa fie gata se pierde. De aceea efectul asteapta `ready`, iar dependintele `[ready, lat, lon]` il ruleaza din nou si cand harta devine gata, si la fiecare locatie noua.
- **Markerul** are ca fiu un `View`: un cerc coral transparent (haloul, `colors.accentSoft`) cu punctul coral in mijloc. `anchor={{ x: 0.5, y: 0.5 }}` il centreaza pe coordonate, ca pe web.
- **Pastila:** este un `View` cu `position: 'absolute'`, pus dupa `MapView`, deci desenat deasupra hartii. `boxShadow` (React Native 0.76+, folosit de Expo Go) ii da aceeasi umbra fina ca pe web.
- **Tema intunecata:** pe iOS, `userInterfaceStyle="dark"`; pe Android, `customMapStyle` primeste o lista scurta de reguli de culoare pentru Google Maps. `StyleSheet.absoluteFill` intinde harta si spinner-ul peste toata zona de 280px.
- **Colturile rotunjite** le taie cardul lui D (`<Panel flush>`). Pe unele telefoane Android, harta nativa poate ramane cu colturi drepte; nu este o eroare a codului.

### Testare

- In Expo Go: harta de 280px, zoom pe Ashburn (datele de proba), punctul coral cu halou si pastila in stanga sus.
- Tema intunecata a telefonului: harta devine inchisa (Android: stilul nostru; iOS: tema Apple Maps).
- Dupa API-ul lui M: la fiecare cautare harta se muta animat la locatia noua.

### Commit

```bash
git add mobile/src/components/MapPanel.js
git commit -m "feat(mobile): harta cu react-native-maps, marker coral cu halou si mutare animata"
git push origin R
```

---

## Final: jurnalul, PR-ul v2.2.0 si tag-ul

Adaugi la sfarsitul lui `docs/jurnal-R.md` (poti adapta):

```markdown
## v2.2.0 - rezumat, detalii, ora locala si harta in React si React Native

- `shared/format.js`: `formatLocation`, `formatLocalTime` (Intl.DateTimeFormat cu fusul orar al locatiei) si `detailFields`, lista campurilor cu eticheta, iconita (nume Ionicons) si tonul de culoare, folosita pe web si pe mobil; teste Vitest.
- `shared/useClock.js`: hook care actualizeaza ora in fiecare secunda si opreste cronometrul la demontare.
- Web: `ResultSummary` (cardul teal cu IP-ul si locatia), `DetailsPanel` (randuri cu iconite colorate din react-icons, blocuri de incarcare), `MapPanel` cu react-leaflet (marker coral cu halou, zbor animat cu useMap, eticheta ca pastila peste harta, spinner, harta intunecata).
- Mobil: `ResultSummary`, `DetailsPanel` si `Skeleton`, `MapPanel` cu react-native-maps (harta de 280px, animateToRegion dupa onMapReady, marker cu halou, stil intunecat).
```

```bash
git add docs/jurnal-R.md
git commit -m "docs: jurnalul lui R pentru v2.2.0"
git push origin R
```

Deschizi PR-ul `R` -> `main` ("v2.2.0: rezumat, detalii, ora locala si harta"). Se uneste dupa PR-ul lui M. Dupa unire:

```bash
git checkout main
git pull origin main
git tag -a v2.2.0 -m "R: rezumat, detalii, ora locala si harta"
git push origin v2.2.0
git checkout R
```

---

## Intrebari posibile la prezentare

**Cum functioneaza ceasul?** `useClock` porneste un `setInterval` intr-un `useEffect`. La fiecare secunda schimba state-ul `now`, iar componenta se redeseneaza cu ora formatata in fusul orar al locatiei.

**De ce efectul intoarce o functie?** Este cleanup-ul: React il apeleaza cand componenta dispare, iar `clearInterval` opreste cronometrul. Fara el, cronometrul ar merge la nesfarsit si ar incerca sa actualizeze o componenta care nu mai exista.

**Ce face `Intl.DateTimeFormat` cu `timeZone`?** Formateaza o data in fusul orar cerut (de exemplu `America/New_York`), indiferent de fusul calculatorului sau al telefonului.

**De ce `detailFields` este in `shared/`?** Lista campurilor, ordinea, textele de rezerva, iconitele si culorile sunt aceleasi pe web si pe mobil. Scrise o singura data, nu pot ajunge diferite pe cele doua platforme.

**Cum ajunge aceeasi iconita pe web si pe mobil?** Amandoua folosesc setul Ionicons: pe web prin `react-icons/io5`, pe mobil prin `@expo/vector-icons`. `detailFields` da doar numele (`server-outline`); pe web un obiect il transforma in componenta, pe mobil numele merge direct in `<Ionicons name=...>`.

**De ce fiecare camp are alta culoare?** Culoarea ajuta la recunoasterea rapida a tipului de informatie (server, furnizor, loc, fus orar, ora) si face panoul mai placut, fara gradient. Fiecare iconita are fundalul deschis si desenul mai inchis din acelasi ton, verificate la contrast.

**Ce este `key` intr-o lista?** Un identificator unic pentru fiecare element din `map`, ca React sa stie ce rand s-a schimbat. Am folosit eticheta campului, care este unica.

**Cum muti harta pe web?** Componenta `FlyTo`, aflata in `MapContainer`, ia harta cu `useMap()` si apeleaza `flyTo` intr-un efect care depinde de latitudine si longitudine.

**De ce doua `CircleMarker`?** Unul este haloul transparent (zona aproximativa), celalalt punctul coral. Fiind cercuri SVG, nu depind de imaginea markerului si iau culoarea din CSS.

**Cum este facuta harta intunecata pe web?** Cu un filtru CSS (`invert` + `hue-rotate`) aplicat doar stratului cu tile-uri; markerul ramane coral.

**Pe mobil, de ce astepti `onMapReady`?** Pe Android, harta ignora comenzile trimise inainte sa fie gata. Efectul ruleaza cand harta devine gata si la fiecare locatie noua.

**De ce harta difera intre Android si iOS?** react-native-maps foloseste harta nativa a fiecarui sistem: Google Maps pe Android, Apple Maps pe iOS.

**De ce blocuri la incarcare?** Utilizatorul vede imediat unde vor aparea datele, iar pagina nu "sare" cand ele sosesc.

**Ce inseamna `tabular-nums`?** Toate cifrele au aceeasi latime, deci IP-ul si ceasul nu isi schimba latimea cand se schimba cifrele.
