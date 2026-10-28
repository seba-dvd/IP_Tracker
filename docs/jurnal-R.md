# Jurnal de cod - R

| | |
|---|---|
| GitHub | adevaratulrazvanlrs |
| Branch | `R` |
| Versiuni | v1.3.0 |
| Fisiere | `styles.css` (sectiunea R), `index.html` (card detalii, harta, scriptul Leaflet), `details.js`, `map.js` |

**Responsabilitati:** zona principala cu detaliile retelei (adresa IP, locatia, fusul orar, ora exacta, furnizorul de internet), animatiile de incarcare si harta interactiva, cu markerul mutat la fiecare cautare.

**Cum se citeste:** in cod, blocurile scrise de R au comentarii de forma `R v1.3.0: ...` si trimit la sectiunea de mai jos.

---

## v1.3.0 - grid, card detalii cu ora locala, animatii de incarcare si harta

Commit-uri: `cd40ed9` (PR #3), `bc9146d`, `aad4761`, `0991964`, `1d64bd9` (PR #4)

### Grid principal si card detalii (`cd40ed9`)

- `.grid` imparte pagina in doua coloane: harta in stanga si o coloana fixa de 340px in dreapta, cu zonele `map`, `details` si `history` (`grid-template-areas`). Harta ocupa ambele randuri.
- `.card` si `.map-wrap` folosesc variabilele lui M (suprafata semitransparenta, bordura, umbra, blur), deci arata la fel ca antetul in ambele teme.
- Lista de detalii foloseste `dl` / `dt` / `dd`; ora are `tabular-nums`, ca cifrele sa nu se miste cand se schimba in fiecare secunda.

### Afisarea detaliilor si ora locala (`bc9146d`)

- `details.js` (nou):
  - `renderDetails(data, query)` completeaza cardul: IP-ul (cu textul cautat intre paranteze daca difera, de exemplu `140.82.121.4 (github.com)`), locatia `oras, regiune, tara`, fusul orar si ISP-ul; ce lipseste apare ca `Necunoscut`;
  - `startClock(timeZone)` afiseaza ora locala a locatiei gasite, cu `Intl.DateTimeFormat` si fusul ei orar, actualizata in fiecare secunda; ceasul anterior este oprit inainte (`clearInterval`), ca sa nu ruleze doua ceasuri;
  - `setLoading(on)` pune sau scoate clasa `is-loading` pe `#dashboard` si seteaza `aria-busy`.
- `map.js` a fost creat gol aici si completat in `1d64bd9`.

### Animatii de incarcare (`aad4761`)

- Cat timp `#dashboard` are clasa `is-loading`, valorile din card sunt inlocuite de un efect "skeleton" (gradient animat, `@keyframes shimmer`), iar peste harta se roteste un spinner (`.spinner`, `@keyframes spin`).

### Containerul hartii si Leaflet (`0991964`)

- `index.html`:
  - cardul `<section class="card details">`, cu campurile `#d-ip`, `#d-location`, `#d-timezone`, `#d-time` si `#d-isp`;
  - zona `<section class="map-wrap">`, cu `#map` si spinner-ul;
  - scriptul Leaflet 1.9.4 de pe unpkg (cu `integrity`), pus inaintea lui `main.js`, care il foloseste.

### Harta cu marker si zoom animat (`1d64bd9`)

- `map.js`:
  - `initMap(elementId)` creeaza harta Leaflet cu tile-uri OpenStreetMap si o vedere initiala pe toata lumea;
  - `updateMap(lat, lon, label)` creeaza markerul la prima cautare, apoi doar il muta, ii pune un popup cu textul primit si zboara animat la locatie (`flyTo`, zoom 11).

**Decizii**

- In popup, caracterele speciale HTML (`& < > "`) sunt inlocuite, ca textul afisat sa nu poata injecta cod in pagina.
- Detaliile si harta sunt module separate, cu functii exportate, ca `main.js` sa le poata apela dupa fiecare cautare.

**Legatura cu v1.4.0:** stilurile care dau inaltime hartii (`#map`) si apelarea functiilor din `details.js` si `map.js` in `main.js` au fost adaugate de D in v1.4.0 (vezi [jurnal-D.md](jurnal-D.md)).
