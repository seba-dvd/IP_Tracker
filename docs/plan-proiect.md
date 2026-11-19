# Planul proiectului și împărțirea sarcinilor

Planul detaliază [Project Charter-ul](project-charter/Project_Charter_IP_Tracker.md): cine ce face, în ce ordine se livrează și când o sarcină este considerată terminată. Calendarul urmărește etapele și versiunile proiectului. Detaliile tehnice sunt în [arhitectura.md](arhitectura.md).

Funcționalitățile propuse pentru etapa 3, încă nedecise de echipă, sunt în [propunere-etapa-3.md](propunere-etapa-3.md).

## Echipa și zonele de cod

Fiecare membru are un branch propriu și o zonă de cod. Modifică doar fișierele din zona lui; dacă are nevoie de o schimbare în altă zonă, o cere membrului responsabil.

| Membru             | Branch | Etapa 1 (`vanilla/`)                                                   | Etapa 2 (`shared/`, `web/`, `mobile/`)                                                                 |
| ------------------ | ------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Mituleci Tudor (M) | `M`    | antetul și căutarea, temele, stilurile de bază, validarea și API-ul   | scheletul și ghidurile, tokenii de design, `api.js`, `useGeoSearch.js`, antetul, căutarea și tema      |
| Luncașu Răzvan (R) | `R`    | grid-ul, cardul de detalii cu ora locală, animațiile, harta           | `format.js`, `useClock.js`, cardul cu rezultatul, panoul de detalii și harta                           |
| Pilat David (D)    | `D`    | istoricul, design-ul responsive, legarea modulelor, documentația      | `history.js`, `useHistory`, cautările recente, cardurile și așezarea în pagină, README-ul și documentația |

## Fluxul de lucru (Git)

1. La începutul fiecărei sesiuni: `git checkout <branch>`, `git fetch origin`, `git merge origin/main`.
2. Fiecare sarcină se termină cu un commit cu mesaj în stilul echipei: `feat:`, `fix:`, `style:`, `docs:`, `refactor:`, `chore:`, opțional cu zona (`feat(web):`, `feat(mobile):`, `feat(shared):`), apoi o descriere scurtă în română.
3. Partea fiecărui membru ajunge pe `main` printr-un pull request de pe branch-ul lui.
4. Pull request-urile se unesc în ordinea M, R, D, ca versiunile să fie la rând.
5. După unire, membrul pune tag-ul versiunii (`git tag -a vX.Y.Z -m "..."`) și își completează jurnalul.

## Etape și versiuni

### Etapa 1 – HTML, CSS și JavaScript

| Versiune | Membru | Pull request   | Conținut                                                                                     |
| -------- | ------ | -------------- | -------------------------------------------------------------------------------------------- |
| v1.0.0   | M      | –              | Pagina de început: antetul, bara de căutare, tema luminoasă / întunecată, designul de bază  |
| v1.1.0   | M      | –              | Primul API de geolocalizare (ipwho.is), butonul de temă funcțional                           |
| v1.2.0   | M      | #1, #2         | Scheletul pentru R și D, tema în `theme.js`, domenii prin ip-api.com, cache, validare strictă |
| v1.3.0   | R      | #3, #4         | Grid-ul, cardul de detalii cu ora locală, animațiile de încărcare, harta cu marker          |
| v1.4.0   | D      | #5             | Stilurile hărții, istoricul, design-ul responsive, `main.js` final, documentația            |

### Etapa 2 – React și React Native

| Versiune | Membru | Pull request | Conținut                                                                                          |
| -------- | ------ | ------------ | ------------------------------------------------------------------------------------------------- |
| –        | M      | #6           | Ghidurile etapei 2 (documentație, fără tag)                                                        |
| v2.0.0   | M      | #7           | Scheletul pentru React și React Native, codul comun din `shared/`, designul teal și coral        |
| v2.1.0   | M      | #8           | API-ul comun, hook-ul de căutare, antetul, bara de căutare și tema, pe web și pe mobil           |
| v2.2.0   | R      | #9           | Cardul cu rezultatul, detaliile cu ora locală și harta, pe web și pe mobil                       |
| v2.3.0   | D      | #10          | Istoricul, cardurile și așezarea în pagină, pe web și pe mobil, README-ul etapei 2               |
| –        | D      | #11          | Actualizarea pachetelor Expo în cadrul SDK 58, verificată cu `expo-doctor` (fără tag)            |

## Sarcinile etapei 2

Fiecare membru face partea lui atât pe web, cât și pe mobil. Pașii detaliați, codul și testele pentru fiecare sarcină sunt în [ghidurile etapei 2](ghiduri/README.md).

### M – scheletul, API-ul, căutarea și tema

| Sarcină | Ce se face                                                                                         |
| ------- | -------------------------------------------------------------------------------------------------- |
| M0      | Ghidurile etapei 2, urcate printr-un pull request separat                                          |
| M1      | Scheletul v2.0.0: proiectele web și mobil, configurările, tokenii de design, `App` și versiunile temporare |
| M2      | `shared/api.js`: validarea și cererea către ip-api.com, cu teste                                   |
| M3      | `shared/useGeoSearch.js`: starea căutării                                                          |
| M4      | Tema luminoasă / întunecată pe web și pe mobil                                                     |
| M5      | Antetul și bara de căutare pe web                                                                  |
| M6      | Antetul și bara de căutare pe mobil                                                                |

### R – rezultatul, detaliile și harta

| Sarcină | Ce se face                                                                         |
| ------- | ---------------------------------------------------------------------------------- |
| R1      | `shared/format.js`: textele afișate, lista de detalii cu iconițe și tonuri, cu teste |
| R2      | `shared/useClock.js`: ora locală actualizată în fiecare secundă                    |
| R3      | Web: cardul cu rezultatul și panoul de detalii                                     |
| R4      | Web: harta cu react-leaflet                                                         |
| R5      | Mobil: cardul cu rezultatul și panoul de detalii                                   |
| R6      | Mobil: harta cu react-native-maps                                                   |

### D – istoricul, așezarea în pagină și documentația

| Sarcină | Ce se face                                                                    |
| ------- | ----------------------------------------------------------------------------- |
| D1      | `shared/history.js`: logica listei de căutări recente, cu teste              |
| D2      | Web: `useHistory` (localStorage) și `RecentSearches` (pastile)               |
| D3      | Web: `App.css`, cardurile și așezarea paginii pe desktop, tabletă și telefon |
| D4      | Mobil: `useHistory` (AsyncStorage) și `RecentSearches` (pastile)             |
| D5      | Mobil: `App.js` și `Panel`, cardurile și așezarea ecranului                  |
| D6      | `README.md` pentru etapa 2 și verificarea finală pe `main`                   |

## Definition of Done (pentru orice sarcină)

O sarcină este terminată când:

- funcționează pe toate platformele pe care le privește (web, mobil sau amândouă);
- în `web/`, `npm test`, `npm run lint` și `npm run build` trec;
- în `mobile/`, aplicația pornește în Expo Go fără ecran roșu, iar `npx expo-doctor` nu raportează probleme;
- consola browserului nu are erori;
- `git status` arată doar fișierele membrului care a lucrat la sarcină;
- codul nou are comentariul cu membrul și versiunea (de exemplu `D v2.3.0`);
- schimbarea este unită în `main` printr-un pull request.

## Verificarea finală

Înainte de închiderea proiectului se verifică aplicația completă de pe `main`:

- căutări după IP (`8.8.8.8`), domeniu (`github.com`), link (`https://github.com/user`) și un text invalid, pe web și pe mobil;
- istoricul: adăugare, fără dubluri, maximum 5 intrări, click pe o căutare recentă, păstrare după reîncărcare, „Șterge tot”;
- ambele teme;
- pe web, lățimile 1920, 1280 × 625, 800 și 390 px, fără scroll orizontal și fără erori în consolă;
- în Expo Go: harta se mută la fiecare căutare, iar tema și istoricul rămân după reîncărcare.

## Probleme întâlnite și rezolvarea lor

| Problemă                                                                                        | Rezolvare                                                                                                              |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Etapa 1: harta nu se vedea, pentru că containerul ei nu avea înălțime                          | Stilurile de dimensiune pentru `.map-wrap` și `#map` (v1.4.0)                                                          |
| Etapa 1: detaliile și harta nu se actualizau la căutare                                         | `main.js` final, care leagă căutarea de card, hartă și istoric (v1.4.0)                                                |
| Etapa 2: o versiune greșită de Expo (52 în loc de 58) a ajuns în `package.json`                | Revenirea la fișierele din git, reinstalarea cu `npm ci` și verificarea cu `npx expo-doctor`                          |
| Etapa 2: pachete Expo ușor în urmă față de SDK 58                                               | Actualizarea lor cu `npx expo install --check` și verificarea bundle-ului pentru Android și iOS (#11)                  |
