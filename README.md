# IP Tracker

Aplicatie web care arata informatii despre o adresa IP sau un domeniu: locatia, fusul orar cu ora locala, furnizorul de internet (ISP) si pozitia pe o harta interactiva.

![IP Tracker - cautare dupa 8.8.8.8](docs/screenshot.png)

## Functionalitati

- Cautare dupa adresa IPv4, IPv6 sau domeniu; merge si un link intreg (`https://github.com/user` devine `github.com`)
- La deschiderea paginii se afiseaza automat datele pentru IP-ul propriu
- Card cu detaliile retelei: adresa IP, locatie, fus orar cu ora locala actualizata in fiecare secunda, ISP
- Harta interactiva (Leaflet si OpenStreetMap) cu marker si zoom animat catre locatia gasita
- Istoric cu ultimele 5 cautari, salvat in browser; click pe o cautare o reface, iar "Sterge tot" goleste lista
- Tema luminoasa si intunecata, pastrata intre vizite; in tema intunecata si harta devine intunecata
- Animatii de incarcare (skeleton si spinner) si mesaje de eroare clare
- Cache pe durata sesiunii: aceeasi cautare nu mai trimite o cerere noua
- Design responsive pentru calculator, tableta si telefon

## Tehnologii

- HTML, CSS si JavaScript (module ES), fara framework-uri si fara pas de build
- [Leaflet](https://leafletjs.com/) 1.9.4, cu harti [OpenStreetMap](https://www.openstreetmap.org/)
- [ip-api.com](https://ip-api.com/) pentru datele de geolocalizare
- Fonturile Bricolage Grotesque si Figtree (Google Fonts)

## Rulare locala

Pagina trebuie deschisa printr-un server local. Daca este deschisa direct din fisier (`file://`), browserul nu incarca modulele JavaScript.

**Cu VS Code:** instaleaza extensia Live Server, apoi click dreapta pe `index.html` si alege *Open with Live Server*.

**Cu Python:**

```bash
python -m http.server 5500
```

apoi deschide http://localhost:5500.

> Planul gratuit ip-api.com functioneaza doar prin HTTP si permite 45 de cereri pe minut. Pe o gazduire HTTPS (de exemplu GitHub Pages), browserul blocheaza cererile, iar aplicatia afiseaza un mesaj in acest sens.

## Structura proiectului

```text
IP_Tracker/
├── index.html    structura paginii
├── styles.css    variabile de design, teme, grid, harta, istoric, responsive
├── theme.js      comutatorul de tema (light / dark)
├── api.js        validarea cautarii si cererea catre ip-api.com
├── details.js    cardul cu detaliile retelei si ora locala
├── map.js        harta Leaflet si markerul
├── history.js    istoricul cautarilor (localStorage)
├── main.js       porneste aplicatia si leaga modulele
└── docs/         jurnalele de cod ale echipei si captura de ecran
```

## Echipa

| Membru | GitHub | Contributie | Jurnal |
|---|---|---|---|
| M | TudorMituleci | antetul si bara de cautare, temele, stilurile de baza, validarea si API-ul | [jurnal-M.md](docs/jurnal-M.md) |
| R | adevaratulrazvanlrs | grid-ul, cardul de detalii cu ora locala, animatiile de incarcare, harta | [jurnal-R.md](docs/jurnal-R.md) |
| D | seba-dvd | istoricul cautarilor, design-ul responsive, legarea modulelor, documentatia | [jurnal-D.md](docs/jurnal-D.md) |

In cod, comentariile de forma `R v1.3.0: ...` arata membrul care a scris blocul si versiunea in care a aparut. Explicatia completa se afla in jurnalul acelui membru, la versiunea respectiva.

## Versiuni

| Versiune | Membru | Ce aduce |
|---|---|---|
| v1.0.0 | M | pagina de inceput: antetul, bara de cautare, tema light / dark, design de baza |
| v1.1.0 | M | primul API de geolocalizare (ipwho.is), butonul de tema functional |
| v1.2.0 | M | scheletul pentru R si D, tema prin theme.js, domenii prin ip-api.com, cache si validare stricta |
| v1.3.0 | R | grid-ul, cardul de detalii cu ora locala, animatiile de incarcare, harta cu marker si zoom animat |
| v1.4.0 | D | stilurile hartii, istoricul cautarilor, design-ul responsive, main.js final, documentatia |
