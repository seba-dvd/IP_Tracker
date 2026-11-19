# Arhitectura IP Tracker

Documentul descrie cum este construită aplicația în etapa 2 (React și React Native) și ce a rămas din etapa 1. Scopul și cerințele sunt în [Project Charter](project-charter/Project_Charter_IP_Tracker.md), iar împărțirea sarcinilor în [plan-proiect.md](plan-proiect.md).

## Privire de ansamblu

Aplicația nu are server propriu. Web-ul și mobilul cer datele direct de la ip-api.com și le salvează local, pe dispozitivul utilizatorului. Logica fără interfață este scrisă o singură dată, în `shared/`.

```text
                        ip-api.com  (http://ip-api.com/json/...)
                              ▲
                              │ fetch
                    shared/  (JavaScript fără interfață)
      api.js   useGeoSearch.js   format.js   useClock.js   history.js
                 /                                        \
   web/  (React + Vite)                             mobile/  (React Native + Expo)
   componente cu HTML și CSS                        componente cu View, Text, StyleSheet
   harta: react-leaflet + OpenStreetMap             harta: react-native-maps
   salvare: localStorage                            salvare: AsyncStorage
```

## Structura repository-ului

| Folder     | Conținut                                                                                       |
| ---------- | ---------------------------------------------------------------------------------------------- |
| `vanilla/` | Etapa 1: pagina în HTML, CSS și JavaScript (module ES), fără framework; nu se mai modifică    |
| `shared/`  | Codul comun pentru web și mobil: validarea, cererea către API, formatarea, istoricul, hook-uri |
| `web/`     | Aplicația React creată cu Vite: `src/components`, `src/hooks`, testele în `tests/`             |
| `mobile/`  | Aplicația React Native creată cu Expo: `App.js`, `src/components`, `src/hooks`, `src/theme.js` |
| `docs/`    | Charter, plan, arhitectură, ghidurile etapei 2, jurnalele membrilor, captura de ecran          |

## Codul comun (`shared/`)

| Fișier            | Ce face                                                                                                                   | Membru |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------- | ------ |
| `api.js`          | `cleanQuery` (curăță textul), `classifyQuery` (IP propriu, IP sau domeniu), `fetchGeoData` (cererea și forma rezultatului) | M      |
| `useGeoSearch.js` | Hook-ul cu starea căutării: rezultatul, eroarea, încărcarea; caută IP-ul propriu la pornire                               | M      |
| `format.js`       | `formatLocation`, `formatLocalTime`, `detailFields` (cele 5 câmpuri din detalii, cu iconiță și ton)                       | R      |
| `useClock.js`     | Data și ora locală din fusul orar al rezultatului, actualizate în fiecare secundă                                         | R      |
| `history.js`      | `addQuery` (căutarea nouă prima, fără dubluri, maximum 5) și `parseHistory` (citirea sigură a listei salvate)            | D      |

## Contractul comun

Contractul spune ce primește și ce întoarce fiecare bucată de cod, ca membrii să poată lucra în paralel.

### Rezultatul unei căutări

`fetchGeoData` transformă răspunsul serviciului într-o formă proprie, folosită în toată aplicația. Dacă serviciul se schimbă, se modifică doar `api.js`.

```js
{
  ip: '8.8.8.8',              // adresa IP găsită
  host: 'dns.google',         // domeniul căutat sau numele invers al IP-ului; '' dacă lipsește
  isp: 'Google LLC',
  city: 'Ashburn',
  region: 'Virginia',
  country: 'United States',
  timezone: 'America/New_York',
  latitude: 39.03,
  longitude: -77.5,
}
```

### Hook-uri

| Hook                 | Unde                                 | Întoarce                                                                                 |
| -------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------- |
| `useGeoSearch()`     | `shared/useGeoSearch.js`             | `{ result, error, loading, search }`; `search(query)` întoarce `true` dacă a reușit       |
| `useClock(timeZone)` | `shared/useClock.js`                 | Textul cu data și ora locală, actualizat în fiecare secundă                               |
| `useHistory()`       | `web/src/hooks`, `mobile/src/hooks`  | `{ items, add(query), clear() }`                                                         |
| `useTheme()`         | `web/src/hooks`, `mobile/src`        | Tema curentă și funcția de comutare                                                      |

### Componente

| Componentă                                  | Props                                                 | Membru |
| ------------------------------------------- | ----------------------------------------------------- | ------ |
| `Header`, `SearchBar`, `ThemeToggle`        | `SearchBar`: `value`, `onChange(text)`, `onSubmit()`  | M      |
| `ResultSummary`, `DetailsPanel`, `MapPanel` | `result` (sau `null`), `loading`                      | R      |
| `RecentSearches`                            | `items`, `onSelect(query)`, `onClear()`               | D      |
| `Panel` (mobil)                             | `children`, `variant` (`"primary"`), `flush`          | D      |

## Fluxul unei căutări

1. Utilizatorul scrie un text și apasă „Caută” (sau alege o căutare recentă).
2. `App` apelează `search(query)` din `useGeoSearch`, care pornește indicatorul de încărcare.
3. `fetchGeoData` curăță și validează textul. Un format invalid aruncă o eroare cu mesaj în română.
4. Dacă rezultatul este deja în cache-ul sesiunii, se întoarce imediat; altfel se trimite cererea către ip-api.com.
5. Răspunsul este transformat în forma din contract. Dacă între timp a pornit o căutare mai nouă, răspunsul vechi este ignorat.
6. `ResultSummary`, `DetailsPanel` și `MapPanel` se redesenează cu noul rezultat, iar harta se mută animat la noua poziție.
7. Dacă `search` a reușit, `App` adaugă textul în istoric (`history.add`), care se salvează local.

## Aplicația web (`web/`)

- **Pornire și build:** Vite (`npm run dev`, `npm run build`); `vite.config.js` permite importul din `shared/`.
- **Așezare:** `App.jsx` (M) pune componentele în containere, iar `App.css` (D) le face carduri: harta în stânga și o coloană de carduri de 336px în dreapta, cu zona principală de înălțimea ecranului; o coloană sub 900px; dimensiuni de telefon sub 640px.
- **Design:** variabilele CSS din `index.css` (M): culori, colțuri, umbre, aceleași nume în ambele teme.
- **Hartă:** react-leaflet cu tile-uri OpenStreetMap, marker coral cu halou, mutare animată (R).
- **Iconițe:** `react-icons/io5` (setul Ionicons).

## Aplicația mobilă (`mobile/`)

- **Pornire:** Expo (SDK 58); aplicația rulează în Expo Go, fără compilare (`npx expo start`).
- **Ecran:** `App.js` pune furnizorii (`SafeAreaProvider`, `ThemeProvider`), apoi secțiunile în carduri `Panel`, în ordinea antet, căutare, rezumat, hartă, detalii, căutări recente; `ScrollView` cu scroll vertical.
- **Temă:** `src/theme.js` (culori, spații, colțuri, tipografie) și `src/ThemeContext.js` (tema curentă, salvată în AsyncStorage).
- **Hartă:** react-native-maps (Google Maps pe Android, Apple Maps pe iOS), de 280px înălțime.
- **Iconițe:** `@expo/vector-icons` (același set Ionicons ca pe web).

## Salvarea locală

| Date                  | Cheie         | Web                          | Mobil                         |
| --------------------- | ------------- | ---------------------------- | ----------------------------- |
| Istoricul căutărilor  | `geo-history` | `localStorage` (JSON cu texte) | AsyncStorage (JSON cu texte) |
| Tema aleasă           | `geo-theme`   | `localStorage`               | AsyncStorage                  |
| Rezultatele primite   | –             | în memorie, pe durata sesiunii | în memorie, pe durata sesiunii |

Pe web, tema salvată se aplică din `index.html`, înainte de afișarea paginii, ca aceasta să nu „clipească” la încărcare. Pe mobil, AsyncStorage răspunde asincron, așa că lista salvată se citește la pornire și se scrie înapoi doar după ce a fost citită, ca să nu fie suprascrisă.

## Erori și cazuri limită

| Situație                                     | Comportament                                                                     |
| -------------------------------------------- | -------------------------------------------------------------------------------- |
| Text invalid                                 | `Format invalid. Introdu o adresa IP sau un domeniu corect.`                     |
| Fără rețea sau serviciul nu răspunde         | `Eroare de retea. Serviciul nu a putut fi contactat.`                            |
| Peste 45 de cereri pe minut (HTTP 429)       | `Prea multe cereri. Asteapta un minut si incearca din nou.`                      |
| Pagina web servită prin HTTPS                | `Serviciul de geolocalizare functioneaza doar cand pagina ruleaza pe http.`      |
| IP privat sau domeniu fără informații        | `Nu s-au gasit informatii pentru aceasta cautare.`                               |
| Text gol, `localhost` sau `127.0.0.1`        | Se afișează datele pentru IP-ul propriu                                          |
| Date stricate în stocarea locală             | Istoricul pornește gol, fără eroare                                              |

## Securitate și confidențialitate

- Nu există conturi și nici server propriu; istoricul și tema rămân pe dispozitivul utilizatorului.
- Textele (căutările, răspunsurile serviciului) sunt afișate de React ca text, nu ca HTML, deci nu pot injecta cod.
- Cererile către ip-api.com folosesc HTTP, deoarece planul gratuit nu oferă HTTPS. Din acest motiv aplicația web nu este găzduită online, iar cererile trimit doar textul căutat.

## Calitate și testare

| Verificare                          | Unde      | Ce acoperă                                                                    |
| ----------------------------------- | --------- | ----------------------------------------------------------------------------- |
| `npm test` (Vitest)                 | `web/`    | 15 teste pentru `shared/`: `api.test.js` (M), `format.test.js` (R), `history.test.js` (D) |
| `npm run lint` (oxlint)             | `web/`    | Greșeli de cod și importuri nefolosite                                        |
| `npm run build`                     | `web/`    | Build-ul final; dacă trece, nu există erori de import                         |
| `npx expo-doctor`                   | `mobile/` | Compatibilitatea pachetelor cu Expo SDK 58                                    |
| Expo Go și DevTools                 | ambele    | Verificarea manuală, după lista din [plan-proiect.md](plan-proiect.md)        |

## Etapa 1 (`vanilla/`)

Etapa 1 are aceeași logică, scrisă fără framework: `api.js` (validarea și cererea, cache în `sessionStorage`), `details.js` (cardul și ora locală), `map.js` (Leaflet), `history.js` (istoricul) și `main.js`, care leagă modulele. În etapa 2, aceste module au devenit codul din `shared/` și componentele React. Detaliile sunt în [jurnalele etapei 1](jurnal-D.md) și în README.

## Limitări cunoscute

- Planul gratuit ip-api.com funcționează doar prin HTTP și permite 45 de cereri pe minut;
- Locația unui IP este aproximativă, de obicei la nivel de oraș;
- Aplicația mobilă nu are variantă web, pentru că `react-native-maps` nu funcționează în browser;
- Istoricul nu se sincronizează între dispozitive.
