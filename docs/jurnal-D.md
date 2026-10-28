# Jurnal de cod - D

| | |
|---|---|
| GitHub | seba-dvd |
| Branch | `D` |
| Versiuni | v1.4.0 |
| Fisiere | `history.js`, `main.js` (versiunea finala), `index.html` (sectiunea istoric), `styles.css` (stilurile hartii si sectiunea D), `README.md`, `docs/` |

**Responsabilitati:** salvarea ultimelor cautari in browser, afisarea si stergerea listei, aspectul corect pe calculator, tableta si telefon. In plus: legarea tuturor modulelor in `main.js` si documentatia proiectului.

**Cum se citeste:** in cod, blocurile scrise de D au comentarii de forma `D v1.4.0: ...` si trimit la sectiunea de mai jos.

---

## v1.4.0 - istoric, responsive si legarea modulelor

Commit-uri: `6125f38`, `13018dc`, `392aeeb`, `8a1ab58`, `3546961`, plus documentatia

Inainte de lucru, branch-ul `D` a fost adus la zi cu `main`, care continea deja v1.3.0.

### Stilurile hartii (`6125f38`)

- Problema: `#map` nu avea inaltime, asa ca harta nu se vedea, iar spinner-ul nu era centrat peste ea.
- `styles.css`, blocul `D v1.4.0: harta`:
  - `.map-wrap` primeste `position: relative`, `overflow: hidden` (colturile rotunjite taie si harta) si `min-height: 460px`;
  - `#map` umple tot containerul (`position: absolute; inset: 0`);
  - in tema intunecata, tile-urile hartii sunt inversate cu un filtru CSS (`invert`, `hue-rotate`, `brightness` si altele). Markerul este in alt strat Leaflet, deci ramane neschimbat.

### Prima legare a cardului si a hartii (`13018dc`)

- `main.js` doar afisa rezultatul in consola. A aparut o functie `search()` care porneste animatia de incarcare, cere datele, completeaza cardul (`renderDetails`), muta markerul (`updateMap`) si opreste animatia.
- Un contor de cereri ignora raspunsurile care vin dupa o cautare mai noua (cand se cauta repede, una dupa alta).
- Aceasta varianta a fost inlocuita de `main.js` final (`3546961`, mai jos).

### Istoricul cautarilor (`392aeeb`)

- `history.js` (nou) salveaza ultimele cautari in `localStorage`, sub cheia `geo-history`.
- `index.html`, intre marcajele `D v1.4.0: istoric`: cardul `<section class="card history">` cu titlul "Cautari recente", butonul "Sterge tot" (`#history-clear`) si lista `#history-list`.
- `styles.css`, sectiunea `D v1.4.0: istoric si responsive`: titlul si butonul pe acelasi rand, intrarile ca butoane cu bordura si efect la hover. Se folosesc doar variabilele lui M, deci ambele teme functioneaza automat.

### Design responsive (`8a1ab58`)

- Ecrane mari: continutul se opreste la 1440px latime si se centreaza.
- Sub 900px (tableta): o singura coloana, in ordinea detalii, harta, istoric. Detaliile sunt pe doua coloane, iar harta are minim 360px inaltime.
- Sub 640px (telefon): logo-ul si butonul de tema raman pe primul rand, iar cautarea ocupa tot randul urmator. Detaliile sunt pe o coloana, harta are minim 300px inaltime si spatiile sunt mai mici.
- Leaflet isi recalculeaza singur dimensiunea cand se redimensioneaza fereastra, deci nu a fost nevoie de cod JavaScript in plus.

### main.js final si API-ul istoricului (`3546961`)

- `main.js` final coordoneaza modulele:
  - la pornire initializeaza tema (`theme.js`), harta (`map.js`) si istoricul salvat (`history.js`), apoi cauta IP-ul utilizatorului, fara sa-l salveze in istoric;
  - `search(query, { save })` porneste animatia, cere datele (`api.js`), completeaza cardul (`details.js`) si muta markerul (`map.js`); dupa o cautare reusita cu text, salveaza textul (fara spatii la capete) in istoric si redeseneaza lista;
  - `requestId` ignora raspunsurile vechi, iar butonul "Sterge tot" goleste istoricul.
- `history.js`, adaptat la acest `main.js`:
  - `addToHistory(query)` pune cautarea prima, scoate duplicatul si pastreaza maxim 5 intrari;
  - `clearHistory()` sterge istoricul;
  - `renderHistory(listEl, onClick)` deseneaza lista sau mesajul "Nu ai facut inca nicio cautare.". Fiecare intrare este un buton care reface cautarea. Butoanele sunt create din nou la fiecare afisare, deci un click porneste o singura cautare;
  - datele stricate din `localStorage` sunt ignorate, iar textul cautarilor este pus cu `textContent`, nu ca HTML, ca sa nu poata injecta cod.

### Documentatie

- `README.md` rescris ca un README obisnuit: descriere, functionalitati, rulare, structura, echipa si versiuni.
- Folderul `docs/`: jurnalele de cod pentru M, R si D si o captura de ecran a aplicatiei.
- Comentarii in cod cu marcajul membru + versiune (de exemplu `R v1.3.0: ...`), ca fiecare sectiune din jurnale sa poata fi gasita direct in fisiere.

### Verificare

- Aplicatia a fost testata in browser, servita local prin HTTP:
  - cautari dupa IP, domeniu si link, plus text invalid;
  - istoricul: adaugare, fara duplicate, click pe o cautare, pastrare dupa reload, "Sterge tot";
  - ambele teme si latimile 1920, 1280, 800 si 375px, fara scroll orizontal si fara erori in consola.
