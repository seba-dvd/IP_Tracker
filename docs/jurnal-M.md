# Jurnal de cod - M

| | |
|---|---|
| GitHub | TudorMituleci |
| Branch | `M` |
| Versiuni | v1.0.0, v1.1.0, v1.2.0, v2.0.0, v2.1.0 |
| Fisiere | etapa 1 (`vanilla/`): `index.html`, `styles.css`, `theme.js`, `api.js`, `main.js` (prima versiune); etapa 2: scheletul `web/` si `mobile/`, `shared/api.js`, `shared/useGeoSearch.js`, tema, antetul si bara de cautare (web si mobil) |

**Responsabilitati:** partea de inceput a paginii (antetul cu bara de cautare si butonul de tema), stilurile de baza si variabilele de design, validarea textului introdus si functia care aduce datele despre IP-uri si domenii. In etapa 2: scheletul proiectelor web (React + Vite) si mobil (React Native + Expo), designul teal si coral (tokenii), API-ul comun si hook-ul de cautare din `shared/`, tema, antetul si bara de cautare pe ambele platforme.

**Cum se citeste:** in cod, blocurile scrise de M au comentarii de forma `M v1.2.0: ...`. Versiunea din comentariu este sectiunea din acest jurnal unde blocul este explicat.

---

## v1.0.0 - pagina de inceput, tema light / dark si design de baza

Commit: `044020d`

**Ce s-a facut**

- `index.html`: structura paginii si antetul (`<header class="topbar">`) cu logo-ul, formularul de cautare (`#search-form`, `#search-input`) si butonul de tema (`#theme-toggle`, cu iconitele soare si luna), plus alerta pentru erori (`#error`).
- In `<head>` se incarca fonturile Google (Bricolage Grotesque pentru titluri, Figtree pentru text) si stilurile Leaflet, folosite mai tarziu de harta.
- Un script scurt in `<head>` aplica tema salvata (cheia `geo-theme`) inainte sa se afiseze pagina, ca tema intunecata sa nu "clipeasca" alb la incarcare.
- `styles.css`:
  - variabilele de design din `:root` (culori, suprafete semitransparente, umbre, raze, fonturi), fiecare cu un comentariu;
  - `.dark-theme` redefineste aceleasi variabile pentru tema intunecata;
  - stilurile de baza, antetul si bara de cautare cu efect de sticla (`backdrop-filter`), alerta de eroare.
- `theme.js`: `initTheme(button)` alege tema salvata sau, daca nu exista, preferinta sistemului (`prefers-color-scheme`), o aplica pe `<html>` si o comuta la click, salvand-o in `localStorage`. Butonul primeste `aria-pressed`, pentru cititoarele de ecran.
- `README.md`: impartirea sarcinilor intre M, R si D.

**Decizii**

- Toate culorile sunt variabile CSS. Tema intunecata inseamna doar alte valori pentru aceleasi variabile, asa ca tot ce construiesc R si D cu aceste variabile functioneaza automat in ambele teme.
- Accesul la `localStorage` este pus in `try / catch`, ca pagina sa mearga si cand browserul blocheaza stocarea.

## v1.1.0 - primul API de geolocalizare, butonul de tema functional

Commit: `65d91b1`

**Ce s-a facut**

- `api.js` (nou):
  - `cleanQuery(input)` curata textul introdus (in aceasta versiune doar spatiile de la capete);
  - `classifyQuery(query)` stabileste tipul cautarii: IPv4, IPv6, domeniu sau IP-ul curent (text gol, `localhost`, `127.0.0.1`); pentru un format invalid intoarce `null`;
  - `fetchGeoData(query)` cere datele de la `ipwho.is` si arunca erori cu mesaje in romana (format invalid, eroare de retea, nu s-au gasit informatii).
- `main.js` (nou): comutarea temei la click, `showError` / `hideError` pentru alerta, cautarea la trimiterea formularului si incarcarea datelor pentru IP-ul propriu la deschiderea paginii. Rezultatul era afisat deocamdata doar in consola.

**Decizii**

- Butonul de tema nu functiona in v1.0.0, pentru ca pagina incarca `main.js`, care nu exista inca. Odata cu `main.js`, butonul a inceput sa functioneze.

## v1.2.0 - schelet pentru echipa, tema prin theme.js, domenii, cache si validare stricta

Commit-uri: `ed839ef` (PR #1), `ccc5e1d`, `eeee028`, `30b4623` (PR #2)

**Ce s-a facut**

- Schelet pentru R si D (`ed839ef`):
  - in `index.html` apare `<main id="dashboard" class="grid">`, cu comentarii-marcaj pentru zonele lui R (card detalii, harta, scriptul Leaflet) si ale lui D (istoric);
  - in `styles.css` apar sectiunile pentru R (grid, card detalii, harta, incarcare) si pentru D (istoric si responsive), ca fiecare sa lucreze in zona lui si sa nu apara conflicte la merge.
- `main.js` foloseste `initTheme` din `theme.js`, in locul codului de tema scris direct (`ccc5e1d`).
- `api.js` trece pe `ip-api.com`, care accepta direct si domenii (`eeee028`):
  - raspunsul este transformat intr-o forma proprie, `{ ip, city, region, country, latitude, longitude, timezone: { id }, connection: { isp } }`, ca detaliile si harta sa nu depinda de formatul serviciului;
  - cache pe durata sesiunii (`readCache` / `writeCache`, in `sessionStorage`, cheia `geo-cache:<cautare>`): aceeasi cautare nu mai trimite o cerere noua;
  - mesaje separate pentru prea multe cereri (HTTP 429), eroare de retea si pagina deschisa pe HTTPS.
- Validare mai stricta (`30b4623`):
  - `cleanQuery` scoate protocolul, calea, parametrii si portul (`https://github.com/x` devine `github.com`) si parantezele unui IPv6 (`[::1]` devine `::1`);
  - IPv4 accepta doar numere intre 0 si 255, IPv6 accepta si forma prescurtata (`2001:db8::1`), iar domeniile respecta lungimile maxime;
  - textul gol, `localhost` si `127.0.0.1` se verifica primii, altfel `127.0.0.1` ar fi fost tratat ca un IPv4 obisnuit.

**Decizii**

- Planul gratuit ip-api.com functioneaza doar prin HTTP. De aceea `fetchGeoData` verifica protocolul paginii si afiseaza un mesaj clar, in loc de o eroare de retea greu de inteles.

## v2.0.0 - scheletul pentru React si React Native

Commit-uri: `9c9ab08`, `514a6b1` (ghidurile, PR #6), `da4aebb` (scheletul, PR #7)

**Ce s-a facut**

- Ghidurile etapei 2, in `docs/ghiduri/`: ghidul comun (structura, contractul dintre noi, calendarul, designul) si cate un ghid pentru M, R si D.
- Etapa 1 a fost mutata in `vanilla/`, fara modificari.
- `web/`: proiect React creat cu Vite; dependinte: leaflet, react-leaflet, react-icons, vitest.
- `mobile/`: proiect Expo (template blank); dependinte: react-native-maps, AsyncStorage, safe-area-context, vector-icons, expo-font.
- `shared/`: cod comun pentru web si mobil; `vite.config.js` si `metro.config.js` il fac vizibil pentru ambele proiecte.
- Designul teal si coral (culori pline, carduri cu colturi de 16px, umbre fine, tonuri pentru iconite), ca tokeni: `index.css` (web) si `theme.js` (mobil), cu tema intunecata echivalenta si contrastul verificat.
- `App.jsx` / `App.js` cu structura finala si versiuni temporare pentru fisierele lui R si D, ca toti trei sa lucreze in paralel.

**Decizii**

- Vite in locul lui Create React App, care nu mai este intretinut; Expo, ca aplicatia sa ruleze pe telefon prin Expo Go, fara Android Studio sau Xcode.
- Toate dependintele sunt instalate in schelet, deci nimeni altcineva nu modifica `package.json` si nu apar conflicte in `package-lock.json`.
- Versiunile temporare respecta contractul (aceleasi nume si props), iar `useGeoSearch` din schelet intoarce date de proba, ca R si D sa nu astepte API-ul.

## v2.1.0 - API comun, cautare, antet si tema

Commit-uri: `b9d82a1` (API), `6c63ad4` (useGeoSearch), `672fc8a` (tema), `b35fb76` (antetul web), `517e8e4` (antetul mobil)

**Ce s-a facut**

- `shared/api.js`: validarea din v1.2.0, campul nou `reverse` (hostname), rezultat in forma plata, cache in memorie (`Map`); teste Vitest in `web/tests/api.test.js`.
- `shared/useGeoSearch.js`: rezultatul, eroarea si incarcarea; cautarea IP-ului propriu la pornire; raspunsurile vechi sunt ignorate.
- Tema: `useTheme` + `ThemeToggle` pe web (`data-theme`, localStorage), `ThemeContext` + `ThemeToggle` pe mobil (AsyncStorage).
- Antetul si bara de cautare pe web (160 / 24 / camp / 16 / 44) si pe mobil (camp de 48px): logo teal, camp alb cu iconita si umbra, buton coral; iconite Ionicons (react-icons pe web, @expo/vector-icons pe mobil).

**Decizii**

- Cache-ul este un `Map` in memorie, nu `sessionStorage`, care nu exista in React Native.
- `search` intoarce `true` sau `false`, iar `App` decide ce salveaza in istoric; asa hook-ul nu depinde de istoric (D).
- Numarul ultimei cereri este tinut in `useRef`, ca un raspuns intarziat sa nu suprascrie unul mai nou (aceeasi idee ca `requestId` din `main.js`, v1.4.0).
- Butonul "Cauta" are text inchis pe coral (contrast 5.8:1); textul alb ar avea doar 3.1:1.

**Verificare**

- In `web/`: `npm test` (4 teste), `npm run lint` si `npm run build`; pentru mobil, bundle-ul Expo pentru Android si iOS.
- In browser, la 1280 x 625 si 390 x 844: IP-ul propriu la pornire, `8.8.8.8` (hostname `dns.google`), `https://github.com/user` (devine `github.com`), un text invalid ("Format invalid..."), tema pastrata dupa reload, fara erori in consola.
