# Project Charter – IP Tracker

> Versiunea PDF: [Project_Charter_IP_Tracker.pdf](Project_Charter_IP_Tracker.pdf), generată din acest fișier. Dacă cele două diferă, PDF-ul semnat este referința.

|                           |                                                                                                      |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Proiect**               | IP Tracker – aplicație web și mobilă pentru localizarea adreselor IP și a domeniilor                 |
| **Instituție**            | Universitatea Transilvania din Brașov – Facultatea de Inginerie Electrică și Știința Calculatoarelor |
| **Disciplina**            | SOPM – laborator                                                                                     |
| **Coordonator / Sponsor** | Teodora Hanganu                                                                                      |
| **Echipa**                | Mituleci Tudor (M), Luncașu Răzvan (R), Pilat David (D)                                              |
| **Repository**            | https://github.com/seba-dvd/IP_Tracker                                                               |
| **Versiune**              | 1.0                                                                                                  |

## 1. Scopul proiectului (Project purpose)

IP Tracker este o aplicație care arată, pentru o adresă IP sau un domeniu, locația aproximativă, fusul orar cu data și ora locală, furnizorul de internet (ISP) și poziția pe hartă. Proiectul se realizează în două etape:

- **Etapa 1:** o pagină web în HTML, CSS și JavaScript, fără framework;
- **Etapa 2:** aceeași aplicație, rescrisă în React (web) și React Native (mobil, pe Android și iOS), cu logica comună scrisă o singură dată.

Pe lângă aplicația în sine, proiectul urmărește lucrul în echipă cu Git și GitHub: fiecare membru are branch-ul și zona lui de cod, livrează prin pull request-uri, iar fiecare etapă încheiată primește o versiune (tag) și o intrare în jurnalul membrului.

## 2. Obiective măsurabile și criterii de succes

| #   | Obiectiv                               | Criteriu de succes (măsurabil)                                                                                                                       |
| --- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| O1  | Aplicație web funcțională (etapa 1)    | Pagina din `vanilla/` îndeplinește cerințele R1–R8 și rulează printr-un server local, fără erori în consolă                                         |
| O2  | Aplicație web în React (etapa 2)       | Aplicația din `web/` îndeplinește cerințele R1–R8; `npm test`, `npm run lint` și `npm run build` trec fără erori                                    |
| O3  | Aplicație mobilă în React Native       | Aplicația din `mobile/` rulează în Expo Go pe Android și iOS cu aceleași funcții; `npx expo-doctor` nu raportează probleme                           |
| O4  | Cod comun pentru web și mobil          | Validarea, cererea către API, formatarea și regulile istoricului sunt scrise o singură dată în `shared/` și acoperite de minimum 15 teste automate |
| O5  | Respectarea specificației de design    | La 1280 × 625: conținut de 1200px, hartă de 840px, coloană de carduri de 336px, zonă principală de 509px; la 390 × 844: o coloană, fără scroll orizontal |
| O6  | Lucru în echipă și versionare          | Fiecare membru livrează prin pull request de pe branch-ul lui; fiecare etapă încheiată are tag (v1.0.0–v2.3.0) și secțiune în jurnalul membrului  |
| O7  | Calitate                               | Zero erori critice (pagină albă, ecran roșu în Expo Go, pierderea istoricului) la demonstrație                                                       |

## 3. Cerințe de nivel înalt (High-level requirements)

### 3.1 Cerințe funcționale

| ID  | Cerință                  | Descriere                                                                                                                         |
| --- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| R1  | Căutare                  | După adresă IPv4, IPv6 sau domeniu; un link întreg este curățat (`https://github.com/user` devine `github.com`); un text invalid primește un mesaj de eroare |
| R2  | IP-ul propriu la pornire | La deschidere se afișează automat datele pentru IP-ul utilizatorului                                                             |
| R3  | Detaliile rezultatului   | Adresa IP, domeniul sau numele invers (hostname), ISP-ul, locația aproximativă, fusul orar, data și ora locală actualizate în fiecare secundă |
| R4  | Hartă                    | Poziția aproximativă a IP-ului pe hartă, cu marker și mutare animată la fiecare căutare                                          |
| R5  | Istoric                  | Ultimele 5 căutări, fără dubluri, păstrate între vizite; un click pe o căutare o reface, iar „Șterge tot” golește lista         |
| R6  | Temă                     | Temă luminoasă și întunecată, păstrată între vizite                                                                              |
| R7  | Încărcare și erori       | Indicatori de încărcare cât timp vin datele și mesaje clare pentru format invalid, eroare de rețea și prea multe cereri          |
| R8  | Design responsive        | Așezare adaptată pentru calculator, tabletă și telefon, după specificația primită                                                |

### 3.2 Cerințe nefuncționale

| ID  | Cerință              | Descriere                                                                                                           |
| --- | -------------------- | ------------------------------------------------------------------------------------------------------------------- |
| N1  | Cod comun            | Web-ul și mobilul folosesc aceeași logică din `shared/`; diferă doar interfața și locul în care se salvează datele |
| N2  | Fără server propriu  | Aplicația nu are backend și nu cere cont de utilizator; datele vin direct de la ip-api.com                          |
| N3  | Economia de cereri   | Rezultatele se păstrează în cache pe durata sesiunii, ca să nu se depășească limita serviciului (45 cereri / minut) |
| N4  | Securitate           | Textele primite sau introduse sunt afișate ca text, nu ca HTML, deci nu pot injecta cod                            |
| N5  | Accesibilitate       | Butoane accesibile din tastatură, etichete pentru cititoarele de ecran, contrast de minimum 4.5:1 pentru text       |

### 3.3 Unelte software

| Unealtă                                    | Utilizare                                                   |
| ------------------------------------------ | ----------------------------------------------------------- |
| HTML, CSS, JavaScript (module ES)          | Aplicația web din etapa 1                                   |
| React 19 + Vite                            | Aplicația web din etapa 2                                   |
| React Native + Expo (SDK 58), Expo Go      | Aplicația mobilă, rulată pe telefon fără compilare          |
| Leaflet / react-leaflet + OpenStreetMap    | Harta pe web                                                |
| react-native-maps                          | Harta pe mobil (Google Maps pe Android, Apple Maps pe iOS)  |
| ip-api.com                                 | Datele de geolocalizare                                     |
| react-icons, @expo/vector-icons (Ionicons) | Iconițele, același set pe ambele platforme                  |
| localStorage, AsyncStorage                 | Salvarea locală a istoricului și a temei                    |
| Vitest, oxlint                             | Teste automate și verificarea codului                       |
| Git + GitHub                               | Versionare, branch-uri pe membri, pull request-uri, tag-uri |
| VS Code, Markdown                          | Editor; documentația (README, ghiduri, jurnale, charter)    |

## 4. Descrierea proiectului, limite și livrabile

### 4.1 Descriere

Toate variantele aplicației stau în același repository: `vanilla/` (etapa 1), `web/` (React), `mobile/` (React Native) și `shared/` (codul comun pentru web și mobil). Aplicațiile nu au server propriu: cer datele direct de la ip-api.com și le salvează local, pe dispozitivul utilizatorului. Detaliile tehnice sunt în [arhitectura.md](../arhitectura.md), iar împărțirea pe etape și sarcini în [plan-proiect.md](../plan-proiect.md).

### 4.2 În afara proiectului (Out of scope)

- Publicarea în App Store sau Google Play (aplicația mobilă rulează prin Expo Go);
- Găzduirea online pe HTTPS (de exemplu GitHub Pages): planul gratuit ip-api.com funcționează doar prin HTTP, iar browserul blochează astfel de cereri pe o pagină HTTPS;
- Conturi de utilizator și sincronizarea istoricului între dispozitive;
- Localizarea exactă: locația unui IP este aproximativă, de obicei la nivel de oraș;
- Modul offline;
- Varianta web a aplicației mobile (`react-native-maps` nu funcționează în browser).

### 4.3 Livrabile principale

| #   | Livrabil        | Conținut                                                                                          | Versiuni        |
| --- | --------------- | ------------------------------------------------------------------------------------------------- | --------------- |
| L1  | Etapa 1 – web   | Aplicația în HTML, CSS și JavaScript (`vanilla/`), README, jurnalele membrilor                    | v1.0.0 – v1.4.0 |
| L2  | Etapa 2 – web   | Aplicația în React (`web/`), codul comun (`shared/`) și testele automate                          | v2.0.0 – v2.3.0 |
| L3  | Etapa 2 – mobil | Aplicația în React Native (`mobile/`), rulabilă în Expo Go pe Android și iOS                      | v2.0.0 – v2.3.0 |
| L4  | Documentație    | README, project charter, planul proiectului, arhitectura, ghidurile etapei 2, jurnalele M, R și D | toate           |

## 5. Riscul general al proiectului (Overall project risk)

**Nivel general de risc: MEDIU**

| Risc                                                                    | Probabilitate | Impact | Măsuri de reducere                                                                                                      |
| ----------------------------------------------------------------------- | ------------- | ------ | ----------------------------------------------------------------------------------------------------------------------- |
| API-ul gratuit funcționează doar prin HTTP                              | Mare          | Mediu  | Rulare prin server local și Expo Go; mesaj clar când pagina e pe HTTPS; găzduirea online scoasă din scope              |
| Limita de 45 de cereri pe minut a serviciului                           | Medie         | Mic    | Cache pe durata sesiunii; mesajul „Prea multe cereri” cu indicația de a aștepta un minut                               |
| Versiuni Expo nepotrivite între pachete, SDK și Expo Go                 | Medie         | Mare   | Versiuni fixate în `package-lock.json`; doar M modifică `package.json`; `npx expo-doctor` înainte de fiecare PR         |
| Conflicte la unirea codului                                             | Medie         | Mediu  | Fiecare membru modifică doar fișierele lui; contract comun stabilit la început; PR-uri unite în ordinea M, R, D         |
| Experiență redusă cu React și React Native                              | Mare          | Mediu  | Ghiduri pentru fiecare membru; logică comună în `shared/`; versiuni temporare în schelet, ca toți să lucreze în paralel  |
| Serviciul de geolocalizare devine indisponibil sau își schimbă formatul | Mică          | Mare   | `api.js` transformă răspunsul într-o formă proprie, deci la o schimbare se modifică un singur fișier                   |
| Precizia redusă a locației unui IP                                      | Mare          | Mic    | Locația este prezentată explicit ca „aproximativă”                                                                      |
| Indisponibilitatea unui membru al echipei                               | Medie         | Mediu  | Cod pe GitHub, ghiduri scrise, jurnale actualizate la fiecare versiune                                                 |

## 6. Calendarul milestone-urilor (Summary milestone schedule)

Calendarul urmărește etapele laboratorului și versiunile proiectului. Un milestone este încheiat când pull request-ul lui este unit în `main` și versiunea are tag.

| Milestone       | Etapa   | Versiune | Responsabil | Conținut                                                                                                |
| --------------- | ------- | -------- | ----------- | ------------------------------------------------------------------------------------------------------- |
| M0              | Etapa 1 | –        | Echipa      | Lansare: temă primită, echipă formată, repository creat, zone de cod împărțite între M, R și D         |
| M1              | Etapa 1 | v1.0.0   | M           | Pagina de început: antetul, bara de căutare, tema luminoasă / întunecată, designul de bază             |
| M2              | Etapa 1 | v1.1.0   | M           | Primul API de geolocalizare, butonul de temă funcțional                                                 |
| M3              | Etapa 1 | v1.2.0   | M           | Scheletul pentru R și D, tema în `theme.js`, domenii prin ip-api.com, cache, validare strictă          |
| M4              | Etapa 1 | v1.3.0   | R           | Grid-ul, cardul de detalii cu ora locală, animațiile de încărcare, harta cu marker                     |
| M5 – L1         | Etapa 1 | v1.4.0   | D           | Stilurile hărții, istoricul, design-ul responsive, legarea modulelor, documentația etapei 1            |
| M6              | Etapa 2 | v2.0.0   | M           | Ghidurile etapei 2 și scheletul pentru React și React Native, codul comun din `shared/`, designul      |
| M7              | Etapa 2 | v2.1.0   | M           | API-ul comun, hook-ul de căutare, antetul, bara de căutare și tema, pe web și pe mobil                 |
| M8              | Etapa 2 | v2.2.0   | R           | Cardul cu rezultatul, detaliile cu ora locală și harta, pe web și pe mobil                             |
| M9 – L2, L3, L4 | Etapa 2 | v2.3.0   | D           | Istoricul, cardurile și așezarea în pagină, pe web și pe mobil, README-ul etapei 2, verificarea finală |

**Organizarea pe etape:** în etapa 1, M face partea de început și scheletul, apoi R și D lucrează în paralel în zonele lor. În etapa 2, M face mai întâi scheletul (v2.0.0), cu versiuni temporare pentru componentele lui R și D, așa că toți trei lucrează în paralel. Pull request-urile se unesc în ordinea M, R, D, ca versiunile să fie la rând.

## 7. Resurse financiare preaprobate (Preapproved financial resources)

**Buget total: 0 lei.** Proiectul folosește exclusiv unelte gratuite sau planurile gratuite ale serviciilor:

| Serviciu / unealtă | Plan                         | Cost  |
| ------------------ | ---------------------------- | ----- |
| ip-api.com         | Free (HTTP, 45 cereri / min) | 0 lei |
| OpenStreetMap      | Gratuit, cu atribuire        | 0 lei |
| Expo / Expo Go     | Free                         | 0 lei |
| GitHub             | Free                         | 0 lei |
| Node.js, VS Code   | Gratuit                      | 0 lei |

Costurile neaprobate (în afara proiectului): planul plătit ip-api.com (cu HTTPS), conturile Apple Developer și Google Play Developer. Orice cheltuială necesită aprobarea coordonatoarei.

## 8. Părțile interesate cheie (Key stakeholder list)

| Parte interesată   | Rol                   | Interes / Implicare                                                                                                  |
| ------------------ | --------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Teodora Hanganu    | Coordonator / Sponsor | Aprobă charter-ul, evaluează și acceptă proiectul                                                                    |
| Mituleci Tudor (M) | Membru al echipei     | Partea de început și designul, temele, validarea și API-ul; scheletul și ghidurile etapei 2                         |
| Luncașu Răzvan (R) | Membru al echipei     | Cardul cu rezultatul, detaliile cu ora locală, animațiile de încărcare și harta                                     |
| Pilat David (D)    | Membru al echipei     | Istoricul, așezarea în pagină și design-ul responsive, legarea modulelor, documentația                              |
| Utilizatori finali | Utilizatori           | Persoane care vor să afle de unde provine o adresă IP sau un domeniu (de exemplu studenți, administratori de rețea) |

## 9. Cerințe de aprobare (Project approval requirements)

- **Ce înseamnă succesul proiectului:** cerințele R1–R8 sunt funcționale în cele trei variante (etapa 1, web, mobil), livrabilele L1–L4 sunt predate, iar obiectivele O1–O7 sunt îndeplinite.
- **Cine decide dacă proiectul are succes:** coordonatoarea, Teodora Hanganu, pe baza demonstrației practice.
- **Cine semnează închiderea proiectului:** Teodora Hanganu.

## 10. Criterii de ieșire (Project exit criteria)

**Închiderea proiectului:**

- Toate livrabilele (L1–L4) sunt pe ramura `main` din GitHub, cu tag-urile v1.0.0–v2.3.0;
- Cele trei variante ale aplicației au fost demonstrate coordonatoarei;
- Coordonatoarea a acceptat proiectul.

**Închiderea unei etape (versiuni):** pull request-ul este unit în `main`; testele, lint-ul, build-ul și `expo-doctor` trec; versiunea are tag, iar jurnalul membrului este actualizat.

**Anularea proiectului:**

- Decizia coordonatoarei;
- Imposibilitatea de a îndeplini cerințele R1–R5 până la termenul final.

## 11. Coordonarea echipei – responsabilitate și nivel de autoritate

Echipa nu are un Project Manager separat. Deciziile se iau împreună, iar fiecare membru răspunde de zona lui de cod, pe ambele platforme.

**Responsabilități comune:**

- Fiecare membru lucrează pe branch-ul lui (`M`, `R`, `D`) și modifică doar fișierele din zona lui;
- Fiecare membru deschide pull request-ul pentru partea lui și pune tag-ul versiunii după ce acesta este unit;
- Fiecare membru își scrie secțiunea în jurnal (`docs/jurnal-M.md`, `-R.md`, `-D.md`) la fiecare versiune;
- Comunicarea cu coordonatoarea și prezentarea finală se fac de toată echipa, fiecare pentru partea lui.

**Nivel de autoritate:**

- Contractul comun (forma rezultatului unei căutări, hook-urile și props-urile componentelor) se schimbă doar cu acordul întregii echipe;
- Doar M modifică dependențele (`package.json`), ca să nu apară conflicte în `package-lock.json`;
- Cerințele R1–R8 și bugetul nu se modifică fără aprobarea coordonatoarei;
- Problemele care pun în pericol termenul final se escaladează la coordonatoare.

## 12. Sponsorul / persoana care autorizează proiectul

|                |                                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| **Nume**       | Teodora Hanganu                                                                                        |
| **Rol**        | Coordonatoarea laboratorului                                                                           |
| **Autoritate** | Aprobă project charter-ul, aprobă modificările de scope și buget, evaluează și acceptă proiectul final |

## Semnături

| Rol                   | Nume            | Semnătură | Data |
| --------------------- | --------------- | --------- | ---- |
| Sponsor / Coordonator | Teodora Hanganu |           |      |
| Membru al echipei (M) | Mituleci Tudor  |           |      |
| Membru al echipei (R) | Luncașu Răzvan  |           |      |
| Membru al echipei (D) | Pilat David     |           |      |
