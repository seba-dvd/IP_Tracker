# Etapa 2: React si React Native - ghid comun

Acesta este ghidul comun pentru M, R si D. Il cititi o data, apoi lucrati dupa ghidul vostru:

- [Ghid M](ghid-M.md): scheletul proiectelor, API-ul comun, cautarea, antetul si tema
- [Ghid R](ghid-R.md): cardul cu rezultatul, detaliile cu ora locala si harta
- [Ghid D](ghid-D.md): istoricul cautarilor, cardurile, asezarea in pagina si documentatia

Fiecare face partea lui **atat in React (web), cat si in React Native (mobil)**. Asa, la prezentare, fiecare poate explica ambele platforme pentru partea lui. Designul este comun: paleta teal si coral, cu culori pline, carduri rotunjite si iconite colorate (sectiunea 9).

Tot codul din ghiduri a fost rulat si verificat inainte: `npm run build`, `npm run lint` si `npm test` pe web, bundle-ul Expo pentru Android si iOS, `expo-doctor` (20/20), contrastul culorilor si verificarea in browser la 1280 x 625 si 390 x 844, in ambele teme. Pe telefon, in Expo Go, il verificati voi (pasii sunt in fiecare ghid).

---

## 1. Ce avem pana acum (etapa 1, v1.0.0 - v1.4.0)

O pagina web in HTML, CSS si JavaScript (module ES), fara framework:

| Fisier | Ce face | Cine |
|---|---|---|
| `index.html` | structura paginii | M, R, D (fiecare zona lui) |
| `styles.css` | variabile de design, teme, grid, harta, istoric, responsive | M, R, D |
| `theme.js` | tema luminoasa / intunecata, salvata in localStorage | M |
| `api.js` | curatarea si validarea cautarii, cererea catre ip-api.com, cache in sessionStorage | M |
| `details.js` | cardul de detalii si ora locala | R |
| `map.js` | harta Leaflet si markerul | R |
| `history.js` | ultimele 5 cautari, salvate in localStorage | D |
| `main.js` | leaga modulele: cautarea, erorile, istoricul | D |

Fluxul unei cautari: `main.js` -> `api.js` (`fetchGeoData`) -> `details.js` (`renderDetails`) + `map.js` (`updateMap`) + `history.js` (`addToHistory`).

In etapa 2 pastram aceeasi logica si aceleasi date, dar le scriem cu componente React. Detalii despre etapa 1: [README](../../README.md) si jurnalele [M](../jurnal-M.md), [R](../jurnal-R.md), [D](../jurnal-D.md).

## 2. Ce construim in etapa 2

| Folder | Ce este | Cum il pornesti |
|---|---|---|
| `vanilla/` | etapa 1, mutata aici fara modificari | `python -m http.server 5500` din `vanilla/` |
| `web/` | aplicatia web in React, creata cu Vite | `npm run dev` |
| `mobile/` | aplicatia mobila in React Native, creata cu Expo | `npx expo start` + Expo Go pe telefon |
| `shared/` | cod JavaScript fara interfata, folosit de web si de mobil | nu se porneste; il importa celelalte doua |

De ce asa:

- **Vite** porneste un server de dezvoltare foarte rapid (pagina se actualizeaza singura la fiecare salvare) si face build-ul final. Create React App nu mai este intretinut, iar documentatia React recomanda alte unelte.
- **Expo** ne lasa sa rulam aplicatia pe telefon prin aplicatia Expo Go, fara Android Studio sau Xcode. Toate bibliotecile alese (harta, AsyncStorage, zona sigura, iconite) sunt incluse in Expo Go.
- **`shared/`** contine validarea, cererea catre API, formatarea textelor, logica istoricului si doua hook-uri React. Le scriem o singura data. Web-ul si mobilul difera doar prin interfata (HTML si CSS fata de componente native) si prin locul unde salveaza datele (localStorage fata de AsyncStorage).

```text
                     shared/  (JavaScript fara interfata)
        api.js   useGeoSearch.js   format.js   useClock.js   history.js
                 /                                        \
     web/  (React + Vite)                         mobile/  (React Native + Expo)
     componente cu HTML si CSS                    componente cu View, Text, StyleSheet
     salvare in localStorage                      salvare in AsyncStorage
```

## 3. Structura finala si proprietarul fiecarui fisier

```text
IP_Tracker/
├── README.md                         D (la final)
├── docs/
│   ├── ghiduri/                      ghidurile (le urca M)
│   └── jurnal-M.md, -R.md, -D.md     fiecare isi scrie sectiunea v2.x
├── vanilla/                          etapa 1, nu se mai modifica
├── shared/
│   ├── api.js, useGeoSearch.js       M
│   ├── format.js, useClock.js        R
│   └── history.js                    D
├── web/
│   ├── package.json, vite.config.js, index.html, public/favicon.svg     M
│   ├── tests/api.test.js (M), format.test.js (R), history.test.js (D)
│   └── src/
│       ├── main.jsx, index.css                                          M
│       ├── App.jsx                   creat de M in schelet; nu e nevoie sa-l mai modifice nimeni
│       ├── App.css                                                      D
│       ├── hooks/useTheme.js (M), useHistory.js (D)
│       └── components/
│           ├── Header.jsx, Header.css, SearchBar.jsx, ThemeToggle.jsx   M
│           ├── ResultSummary.jsx/.css, DetailsPanel.jsx/.css, MapPanel.jsx/.css   R
│           └── RecentSearches.jsx/.css                                  D
└── mobile/
    ├── package.json, app.json, metro.config.js                          M
    ├── App.js                        creat de M in schelet, terminat de D
    └── src/
        ├── theme.js, ThemeContext.js                                    M
        ├── hooks/useHistory.js                                          D
        └── components/
            ├── Header.js, SearchBar.js, ThemeToggle.js                  M
            ├── ResultSummary.js, DetailsPanel.js, MapPanel.js, Skeleton.js   R
            └── Panel.js, RecentSearches.js                              D
```

**Regula de aur:** modifici doar fisierele tale. Daca ai nevoie de o schimbare intr-un fisier al altcuiva, ii scrii lui. Asa nu apar conflicte la merge, iar fiecare stie exact ce are de prezentat.

## 4. Contractul dintre noi

Contractul spune ce primeste si ce intoarce fiecare bucata de cod. Daca fiecare respecta contractul, putem lucra in paralel, fara sa asteptam unul dupa altul.

### Rezultatul unei cautari (il produce `api.js`, M)

```js
{
  ip: '8.8.8.8',                // adresa IP gasita
  host: 'dns.google',           // domeniul cautat sau numele invers al IP-ului; '' daca lipseste
  isp: 'Google LLC',
  city: 'Ashburn',
  region: 'Virginia',
  country: 'United States',
  timezone: 'America/New_York',
  latitude: 39.03,
  longitude: -77.5,
}
```

### Detaliile si iconitele (le produce `format.js`, R)

`detailFields(result, clock)` intoarce cele 5 campuri din panoul de detalii (adresa IP apare doar in cardul cu rezultatul):

```js
{ label: 'ISP', value: 'Google LLC', icon: 'business-outline', tone: 'coral' }
```

`icon` este un nume din setul Ionicons, acelasi pe ambele platforme: pe web prin `react-icons/io5`, pe mobil prin `@expo/vector-icons`. `tone` este una dintre culorile `teal`, `coral`, `amber`, `blue`, `plum`, definite de M ca tokeni.

### Hook-uri

| Hook | Fisier | Intoarce | Cine |
|---|---|---|---|
| `useGeoSearch()` | `shared/useGeoSearch.js` | `{ result, error, loading, search }`; `result` este `null` pana la primul raspuns | M |
| `search(query)` | (din `useGeoSearch`) | `Promise<boolean>`: `true` daca cautarea a reusit si este cea mai recenta | M |
| `useClock(timeZone)` | `shared/useClock.js` | textul cu data si ora locala, actualizat in fiecare secunda | R |
| `useHistory()` | `web/src/hooks`, `mobile/src/hooks` | `{ items, add(query), clear() }` | D |
| `useTheme()` (mobil) | `mobile/src/ThemeContext.js` | `{ colors, isDark, toggleTheme }` | M |

### Componente si props

| Componenta | Props | Cine |
|---|---|---|
| `Header` (web) | `children`: bara de cautare, pusa intre logo si butonul de tema | M |
| `Header` (mobil) | fara props | M |
| `SearchBar` | `value`, `onChange(text)`, `onSubmit()` | M |
| `ResultSummary`, `DetailsPanel`, `MapPanel` | `result` (sau `null`), `loading` | R |
| `RecentSearches` | `items`, `onSelect(query)`, `onClear()` | D |
| `Panel` (mobil) | `children`, `variant` (`"primary"` = card plin teal, pentru rezultat), `flush` (fara padding, pentru harta) | D |

### Web: cine aseaza si cine deseneaza

- `App.jsx` pune componentele in containere: `.map-panel` (harta) si `.sidebar`, care contine trei `.section` (`.summary`, `.details`, `.recent`). D le face carduri in `App.css` (fundal alb, colturi de 16px, umbra, padding, grila); `.summary` este cardul plin teal pentru rezultat.
- Componentele lui R si D deseneaza doar continutul (titlul, lista, harta), fara fundal sau bordura de panou.
- Clase comune, definite de M in `index.css`: `.section-title` (16px, 600), `.label` (12px, culoare secundara), `.value` (15px, 500), `.numeric` (cifre de latime egala), `.skeleton` (bloc gri la incarcare), `.sr-only` (text doar pentru cititoarele de ecran), `.tone-teal` ... `.tone-plum` (seteaza `--tone` si `--tone-bg` pentru o iconita).
- Variabile CSS: `--bg`, `--panel`, `--border`, `--text`, `--muted`, `--primary`, `--on-primary`, `--on-primary-muted`, `--primary-text`, `--primary-soft`, `--accent`, `--on-accent`, `--danger`, `--danger-bg`, `--skeleton`, `--shadow`, `--focus`, `--radius-panel`, `--radius-control`.
- Breakpoint-uri: `@media (max-width: 900px)` (o singura coloana) si `@media (max-width: 640px)` (telefon).

### Mobil

- `theme.js` exporta `colors.light` si `colors.dark` (cu aceleasi nume ca variabilele CSS, plus `tones`, `accentSoft` pentru haloul markerului si `shadow` pentru `boxShadow`), `space` (`page`, `gap`, `panel`, toate 16), `radius` (`panel` 16, `control` 12) si `type` (`title`, `label`, `value`, `numeric`).
- Culorile se iau mereu din `useTheme().colors`, nu se scriu direct in componente. Asa tema intunecata merge peste tot.
- `App.js` pune fiecare sectiune intr-un `Panel`: rezultatul intr-un `<Panel variant="primary">` (teal), harta intr-un `<Panel flush>`, fara padding.

### Scheletul (v2.0.0)

M face scheletul in ziua 0. Pe langa proiectele create si tokenii de design, scheletul contine versiuni temporare (marcate in cod cu `VERSIUNE TEMPORARA`) pentru fisierele lui R si D si pentru `useGeoSearch`:

- `useGeoSearch` intoarce mereu datele de proba pentru 8.8.8.8, iar `search()` raspunde `true`. R isi vede componentele cu date, iar D isi vede istoricul crescand, fara sa astepte API-ul lui M.
- Toate dependintele sunt deja instalate. Nimeni altcineva nu ruleaza `npm install <pachet>` si nu modifica `package.json`. Asa nu apar conflicte in `package-lock.json`.

## 5. Calendar si versiuni

| Cand | Cine | Ce | Versiune |
|---|---|---|---|
| Ziua 0 | M | ghidurile (M0) si scheletul (M1), PR, tag | v2.0.0 |
| Ziua 0 | R, D | instaleaza uneltele (sectiunea 6), citesc ghidurile, ruleaza versiunea din `vanilla/` | - |
| Dupa v2.0.0 | toti | sincronizare cu `main`, apoi task-urile din ghid, in paralel | - |
| La final | M | PR si tag | v2.1.0 |
| La final | R | PR si tag | v2.2.0 |
| La final | D | PR si tag, verificarea finala, README | v2.3.0 |

PR-urile se pot deschide oricand, dar se unesc pe `main` in ordinea M, R, D, ca versiunile sa fie in ordine. Fiecare lucreaza in fisierele lui, deci nu apar conflicte.

Daca vreti sa vedeti datele reale inainte de PR-ul vostru, dupa ce PR-ul lui M (v2.1.0) ajunge pe `main` rulati `git merge origin/main` pe branch-ul vostru.

## 6. Instalare (o singura data, pentru toti)

| Ce | De unde | Cum verifici |
|---|---|---|
| Git for Windows (include Git Bash) | https://git-scm.com | `git --version` |
| Node.js, versiunea LTS (22 sau mai noua; la noi merge 26) | https://nodejs.org | `node -v` si `npm -v` |
| VS Code | https://code.visualstudio.com | se deschide folderul proiectului |
| Expo Go pe telefon (ultima versiune) | Google Play sau App Store | aplicatia se deschide |
| Chrome sau Edge | - | F12 deschide DevTools |

Optional in VS Code: extensia **Oxc** (arata erorile de lint din `npm run lint`) si **ES7+ React/Redux/React-Native snippets**.

Fara telefon, aplicatia mobila poate rula intr-un emulator Android (Android Studio, apoi tasta `a` in terminalul Expo), dar instalarea dureaza mult. Expo Go pe telefon este varianta recomandata.

Verificare in Git Bash:

```bash
git --version
node -v
npm -v
```

Dupa ce scheletul ajunge pe `main` (R si D):

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

Inlocuiti `R` cu branch-ul vostru. `npm install` citeste `package.json` si `package-lock.json` si instaleaza exact versiunile din schelet.

## 7. Git: comenzile pe care le folosim

**Daca nu ai repo-ul pe calculator (o singura data):**

```bash
git clone https://github.com/seba-dvd/IP_Tracker.git
cd IP_Tracker
git checkout R
```

**La inceputul fiecarei sesiuni de lucru:**

```bash
git checkout R
git fetch origin
git merge origin/main
git status
```

**Dupa fiecare task (comenzile exacte sunt in ghidul fiecaruia):**

```bash
git status
git add <fisierele tale>
git commit -m "feat(web): descriere scurta"
git push origin R
```

Mesajele de commit pastreaza stilul din etapa 1: `feat:`, `fix:`, `style:`, `test:`, `docs:`, `refactor:`, optional cu zona in paranteze (`feat(web):`, `feat(mobile):`, `feat(shared):`), apoi o descriere scurta in romana, fara diacritice.

**Pull request:** pe GitHub, Pull requests -> New pull request -> base: `main`, compare: branch-ul tau -> titlu si descriere -> Create pull request. Daca aveti GitHub CLI: `gh pr create --base main --head R --title "..." --body "..."`.

**Dupa ce PR-ul este unit: tag-ul versiunii**

```bash
git checkout main
git pull origin main
git tag -a v2.2.0 -m "R: rezumat, detalii, ora locala si harta"
git push origin v2.2.0
git checkout R
```

**Daca apare un conflict** (nu ar trebui, daca fiecare isi modifica doar fisierele lui):

```bash
git status
```

Fisierele cu conflict apar la "both modified". Le deschizi in VS Code, alegi varianta corecta intre marcajele `<<<<<<<` si `>>>>>>>`, apoi:

```bash
git add <fisier>
git commit
```

**Ce nu se urca pe GitHub:** `node_modules/`, `dist/`, `.expo/`. Sunt deja in `.gitignore`-urile din `web/` si `mobile/`. Verifica cu `git status` inainte de fiecare commit.

## 8. Cum rulam si cum testam

### Web

```bash
cd web
npm run dev
npm test
npm run lint
npm run build
```

- `npm run dev` porneste aplicatia la http://localhost:5173; pagina se actualizeaza singura la fiecare salvare. Se opreste cu Ctrl+C.
- `npm test` ruleaza testele Vitest din `web/tests` (inclusiv cele pentru codul din `shared/`).
- `npm run lint` verifica codul cu oxlint. `npm run build` face build-ul final in `web/dist`; daca trece, nu ai erori de import.
- Dimensiuni: F12 -> Toggle device toolbar (Ctrl+Shift+M) -> Responsive -> 1280 x 625 (desktop) si 390 x 844 (telefon). Pentru masuratori: click dreapta pe element -> Inspect; marimea apare in tab-ul Computed.
- Tema intunecata: butonul din antet (dupa task-ul M4) sau DevTools -> Rendering -> "Emulate CSS prefers-color-scheme: dark", la o vizita fara tema salvata.
- Consola (F12 -> Console) trebuie sa nu aiba erori rosii.

### Mobil

```bash
cd mobile
npx expo start
```

- Android: deschizi Expo Go -> Scan QR code. iPhone: scanezi codul QR cu aplicatia Camera.
- Telefonul si calculatorul trebuie sa fie in aceeasi retea Wi-Fi. Prima data, Windows intreaba de firewall pentru Node.js: permiti pe retele private.
- Daca telefonul nu se conecteaza (de exemplu in reteaua facultatii): `npx expo start --tunnel` (prima data cere instalarea `@expo/ngrok`; raspunzi `y`).
- In terminalul Expo: `r` reincarca aplicatia, `j` deschide debugger-ul, Ctrl+C opreste serverul.
- `npx expo start -c` porneste cu cache-ul golit (util dupa modificari in `metro.config.js`).
- `npx expo-doctor` verifica daca versiunile pachetelor se potrivesc cu Expo.
- Nu folosim varianta web a aplicatiei mobile (tasta `w`): `react-native-maps` nu merge in browser.
- Cererile catre ip-api.com folosesc `http://`. In Expo Go merg; doar o aplicatie compilata separat (pe care nu o facem) ar avea nevoie de o exceptie de securitate.

### Lista de verificare inainte de PR

- [ ] in `web/`: `npm test`, `npm run lint` si `npm run build` trec
- [ ] aplicatia web arata ca in specificatie la 1280 x 625 si la 390 x 844, fara scroll orizontal si fara erori in consola
- [ ] aplicatia mobila se deschide in Expo Go fara ecran rosu de eroare, in ambele teme
- [ ] `git status` arata doar fisierele tale

## 9. Designul teal si coral si ce se schimba fata de etapa 1

Din specificatia primita pastram **asezarea si dimensiunile**. **Stilul vizual** l-am facut mai colorat si mai prietenos, fara sa arate ca un sablon generic: culori pline (fara gradient, glow sau blur), carduri cu colturi rotunjite, umbre fine si iconite colorate.

### Pe scurt

- Fundal plin crem `#F8F4EC`. Carduri albe cu colturi de 16px, o bordura foarte fina si o umbra moale. Campuri si butoane cu colturi de 12px. Cautarile recente si eticheta hartii sunt pastile.
- **Teal `#0F766E`** este culoarea principala: logo-ul, cardul plin cu rezultatul (text alb), linkurile si focusul.
- **Coral `#F2684A`** este culoarea de actiune: butonul "Cauta" (cu text inchis `#2B1007`) si markerul de pe harta (punct cu halou).
- Fiecare camp din detalii are o iconita intr-un patrat colorat, iar culoarea arata tipul informatiei: teal = hostname, coral = ISP, amber = locatie, albastru = fus orar, prun = data si ora.
- Iconite din setul Ionicons pe ambele platforme; fontul sistemului; cifre tabulare (`tabular-nums`) pentru IP si ceas.
- Adresa IP apare o singura data, mare, in cardul cu rezultatul; panoul de detalii are 5 campuri.
- Desktop (1280 x 625): continut de 1200px centrat, margini de 40px stanga-dreapta si 24px sus-jos, antet de 44px, 24px pana la continut, harta 840px, 24px spatiu, coloana de carduri 336px, zona principala 509px (coloana de carduri are scroll propriu daca nu incape). Containerul are cel mult 1440px.
- Antet pe un rand: logo 160px, 24px, campul de cautare (restul latimii), 16px, butonul de tema 44 x 44. Campul are 44px, text de 16px, padding orizontal 14px si butonul "Cauta" de 88 x 36, la 4px de marginea campului.
- In carduri: padding 20px, titlu 16px semibold, etichete 12px, valori 15px medium, 4px intre eticheta si valoare, 16px intre campuri si intre carduri.
- Telefon (390px): margini 16px, latime 358px, sus 16px, cautare de 48px, 16px intre carduri, harta de 280px, padding 16px. Ordinea: antet, cautare, rezumat, harta, detalii, cautari recente. Scroll vertical normal, fara inaltime fixa.

### Tokenii (aceleasi valori in `web/src/index.css` si `mobile/src/theme.js`)

| Token (web / mobil) | Luminos | Intunecat |
|---|---|---|
| fundal (`--bg` / `bg`) | `#F8F4EC` | `#111418` |
| card (`--panel` / `panel`) | `#FFFFFF` | `#1B2026` |
| bordura (`--border` / `border`) | `rgba(31, 42, 46, 0.08)` | `rgba(255, 255, 255, 0.08)` |
| text (`--text` / `text`) | `#1F2A2E` | `#E9EDF0` |
| text secundar (`--muted` / `muted`) | `#5F6B6E` | `#A3ADB5` |
| teal de umplere (`--primary` / `primary`) | `#0F766E` | `#0F766E` |
| text pe teal (`--on-primary`, `--on-primary-muted`) | `#FFFFFF`, `#E7F1F0` | la fel |
| teal pentru linkuri (`--primary-text` / `primaryText`) | `#0F766E` | `#2DD4BF` |
| teal deschis (`--primary-soft` / `primarySoft`) | `#E3F1EF` | `#17302D` |
| coral (`--accent` / `accent`) | `#F2684A` | `#F2684A` |
| text pe coral (`--on-accent` / `onAccent`) | `#2B1007` | `#2B1007` |
| eroare (`--danger`, `--danger-bg`) | `#B42318`, `#FEF1EE` | `#FFB4AB`, `#2A1715` |
| incarcare (`--skeleton` / `skeleton`) | `#EEE8DD` | `#262C33` |
| tonuri: iconita / fundal | teal `#0F766E / #DDF1EE`, coral `#C8462B / #FDE6E0`, amber `#A16207 / #FCF0D2`, albastru `#2B6CB0 / #E1EDF9`, prun `#7E4A9E / #F0E6F6` | teal `#5EEAD4 / #17302D`, coral `#FF9A84 / #3A221D`, amber `#F5C451 / #362C14`, albastru `#8DBBEF / #1B2A3D`, prun `#D2A8EE / #2E2238` |

Colturi: 16px la carduri, 12px la campuri si butoane (butonul din camp are 9px). Umbra pe web: `0 1px 2px rgba(31, 42, 46, 0.06), 0 8px 24px -12px rgba(31, 42, 46, 0.22)`; pe mobil: `boxShadow: '0 6px 16px rgba(31, 42, 46, 0.10)'`. Toate perechile au fost verificate la contrast, in ambele teme: textul are cel putin 4.5:1, iconitele cel putin 3:1.

### Ce s-ar schimba in etapa 1 si unde este acum

Versiunea din `vanilla/` ramane cum este (v1.4.0). Tabelul arata, pentru fiecare indicatie, unde ar trebui modificat in etapa 1 si unde este implementata in etapa 2. Liniile sunt cele din `vanilla/` (aceleasi ca pe `main` la v1.4.0).

| Indicatie | In etapa 1 (fisier:linii) | In etapa 2 |
|---|---|---|
| Fundal plin crem, fara gradient | `styles.css:6-8` (`--bg`, `--bg-glow-1/2`) si `47-51` (gradientii de pe `body`) | `--bg` / `colors.bg` (M) |
| Carduri albe cu colturi de 16px si umbra fina, fara blur | `styles.css:9-11` (suprafete semitransparente), `18-19` (umbra mare, raza 18px), `69-70`, `85-86`, `113-116` (`backdrop-filter`) | `.map-panel`, `.section` in `App.css`; `Panel.js` (D); tokenii `--radius-panel`, `--shadow` (M) |
| Campuri si butoane cu colturi de 12px | `styles.css:69` si `79` (999px), `84` (50%), `96`, `150`, `158` | `--radius-control` / `radius.control` (M) |
| Teal ca principala, coral ca actiune | `styles.css:14` (`--accent` albastru), `66` (logo albastru), `78-82` (butonul "Cauta" albastru) | `--primary`, `--accent`; antetul si butonul (M), cardul `.summary` (D), markerul (R) |
| Text `#1F2A2E` si `#5F6B6E` | `styles.css:12-13` | `--text`, `--muted` |
| Font neutru, cifre tabulare | `index.html:10-12` (Google Fonts), `styles.css:20-21`, `55`, `121` | `--font`; `.numeric` / `type.numeric` pe IP si ceas |
| Desktop 1200 / 40 / 24 / 44 / 840 / 336 / 24 / 509 | `styles.css:52` (padding pe `body`), `63`, `102-107` (grila cu 340px), `139` (min-height 460), `165` (1440px) | `App.css`: `.app` si `.layout { height: calc(100dvh - 116px) }` (D) |
| Antet si camp de cautare | `styles.css:63-91`; `index.html:27-42` | `Header.jsx`, `Header.css`, `SearchBar.jsx` (M) |
| Detalii in carduri separate, cu iconite colorate | `index.html:49-57` si `68-74`; `styles.css:56` (titluri), `117-121` (padding, dl, dt, dd) | `DetailsPanel` (R), tonurile (M), cardurile (D) |
| Campurile din detalii | `index.html:51-56`; `details.js:15-31`; `api.js:67` (fara `reverse`) | `shared/api.js` (`host`, M); `shared/format.js` (`detailFields`, R) |
| "Locatie aproximativa a IP-ului" si marker coral cu halou | `map.js:16-23` (popup cu IP si oras, marker standard); `index.html:61-64` | `MapPanel` (web si mobil, R) |
| Cautarile recente ca pastile | `styles.css:155-161` (randuri cu bordura si raza 12px) | `RecentSearches` (web si mobil, D) |
| Telefon 390px | `styles.css:168-188` (alta ordine: detalii, harta, istoric; harta 300px) | `App.css` (D), `Header.css` (M), harta de 280px (R), `App.js` (D) |
| Cardul cu rezultatul (element nou) | nu exista | `ResultSummary` (R), `.summary` / `Panel variant="primary"` (D) |

## 10. Notiuni React si React Native pentru prezentare

| Notiune | Pe scurt |
|---|---|
| Componenta | O functie care intoarce ce trebuie afisat (JSX). Numele incepe cu litera mare: `DetailsPanel`, `MapPanel`. |
| JSX | Sintaxa asemanatoare cu HTML din fisierele React. Pe web devine elemente HTML, pe mobil componente native. In JSX se scrie `className` in loc de `class`. |
| Props | Datele primite de o componenta de la parinte: `<DetailsPanel result={result} loading={loading} />`. O componenta nu isi modifica props-urile. |
| State (`useState`) | Date care se schimba in timp (rezultatul, textul cautat). Cand state-ul se schimba, React redeseneaza componenta. |
| `useEffect` | Cod care ruleaza dupa afisare: cereri, cronometre, sincronizare cu `localStorage`. Functia intoarsa (cleanup) opreste ce a pornit efectul. |
| `useRef` | O valoare care se pastreaza intre afisari fara sa provoace redesenare (numarul ultimei cereri) sau o referinta la un obiect (harta de pe mobil). |
| `useCallback` | Pastreaza aceeasi functie intre afisari, ca un efect care depinde de ea sa nu ruleze din nou fara motiv. |
| Hook propriu | O functie `useCeva` care foloseste alte hook-uri si poate fi refolosita: `useGeoSearch`, `useHistory`, `useClock`, `useTheme`. |
| Context | Date disponibile pentru toate componentele dintr-un arbore, fara sa le trimitem prin props la fiecare nivel (tema pe mobil). |
| Componenta controlata | Un camp al carui text vine din state (`value`) si se schimba prin `onChange`. Asa App poate pune textul unei cautari recente in bara de cautare. |
| `key` | Identificator unic pentru elementele unei liste (`items.map`), ca React sa stie ce s-a schimbat. |
| Randare conditionala | `{error && <p>...</p>}` sau `{loading ? <A /> : <B />}`. |
| StrictMode | In dezvoltare, React ruleaza efectele de doua ori la pornire, ca sa gaseasca greseli. In build-ul final ruleaza o data. |
| React fata de React Native | Aceleasi notiuni (componente, props, state, hook-uri). Difera elementele: `div` -> `View`, `p` / `span` -> `Text`, `button` -> `Pressable`, `input` -> `TextInput`, CSS -> `StyleSheet` (nume camelCase, numere fara `px`, Flexbox implicit pe coloana). |
| Vite / Metro | Unelte care impacheteaza codul: Vite pentru web, Metro pentru Expo. Amandoua reincarca aplicatia la fiecare salvare. |
| Expo si Expo Go | Expo este platforma peste React Native; Expo Go este aplicatia de pe telefon care ruleaza proiectul nostru fara compilare. |
| `localStorage` / AsyncStorage | Salvare locala de text. `localStorage` (browser) raspunde imediat; AsyncStorage (telefon) raspunde printr-un Promise. |
| Tokeni de design | Valorile designului (culori, colturi, umbre) puse intr-un singur loc: variabile CSS in `index.css` pe web, obiectul `colors` din `theme.js` pe mobil. Componentele folosesc doar numele lor. |
| Iconite | Setul Ionicons pe ambele platforme: `react-icons/io5` pe web (componente care deseneaza SVG), `@expo/vector-icons` pe mobil (`<Ionicons name="..." />`). |
| `boxShadow` (mobil) | Umbra scrisa ca in CSS (`'0 6px 16px rgba(...)'`), pe Android si iOS, in React Native 0.76+ (Expo Go). |

## 11. Probleme frecvente

| Mesaj sau situatie | Cauza si rezolvare |
|---|---|
| `Rolldown failed to resolve import "react" from ".../shared/..."` | Lipseste `resolve.dedupe: ['react']` din `web/vite.config.js` (M). |
| `Unable to resolve module ../shared/...` in Expo | Lipseste `watchFolders` din `mobile/metro.config.js`; dupa corectare: `npx expo start -c`. |
| `Unable to resolve "react" from "../shared/..."` in Expo | Lipseste `resolver.nodeModulesPaths` din `mobile/metro.config.js`. |
| Expo Go spune ca proiectul nu este compatibil | Actualizeaza Expo Go din magazin (trebuie sa suporte SDK 58). |
| Telefonul nu se conecteaza la Expo | Aceeasi retea Wi-Fi, permisiune in firewall sau `npx expo start --tunnel`. |
| `Text strings must be rendered within a <Text> component` | Pe mobil, orice text trebuie pus in `<Text>`. Atentie la `{conditie && ...}` cand conditia poate fi un text gol sau 0: folositi `{conditie ? ... : null}` sau o conditie booleana (`items.length > 0`). |
| "Prea multe cereri" | ip-api.com permite 45 de cereri pe minut; asteptati un minut. Cautarile repetate vin din cache. |
| Portul 5173 este ocupat | Vite alege singur alt port; il vedeti in terminal. |
| Dupa `git merge origin/main` apar erori de import | Rulati `npm install` in `web/` si in `mobile/`. |
