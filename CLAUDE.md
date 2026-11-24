# IP Tracker

## Scop
Aplicație care arată informații despre o adresă IP sau un domeniu (locație aproximativă, fus orar și ora locală, ISP, hartă), în trei variante: pagina din etapa 1 (`vanilla/`), aplicația web React (`web/`) și aplicația mobilă React Native (`mobile/`). Proiect de echipă la SOPM, UNITBV. „Gata” pentru o etapă înseamnă cerințele R1–R8 îndeplinite și verificarea finală din `docs/plan-proiect.md` trecută.

## Decizii (cu data și cine a decis)
- Etapa 1 — date de la ip-api.com în locul ipwho.is (v1.2.0) — suportă și domenii (M)
- Etapa 2 — cod comun web + mobil în `shared/`, testat cu Vitest din `web/` (M)
- Etapa 2 — Expo SDK 58, verificat cu `npx expo-doctor` (echipa)
- 2026-11-19 — propunerea pentru etapa 3 (9 funcționalități) trimisă echipei, cu primele trei recomandate (D); votul e în `docs/propunere-etapa-3.md`

## Mediu de lucru
- Node.js LTS. Web: `cd web && npm install && npm run dev` (http://localhost:5173), teste `npm test`.
- Mobil: `cd mobile && npm install && npx expo start`, apoi Expo Go (aceeași rețea Wi-Fi sau `--tunnel`).
- Etapa 1: `cd vanilla && python -m http.server 5500`.
- Echipa: M = Mituleci Tudor, R = Luncașu Răzvan, D = Pilat David. Fiecare modifică doar zona lui (tabelul din `docs/plan-proiect.md`); codul nou are comentariul cu membrul și versiunea (de exemplu `D v2.3.0`).

## Structura repo-ului
- `vanilla/` — etapa 1 (HTML, CSS, JS, Leaflet)
- `shared/` — validarea, cererea către API, formatarea, istoricul și hook-urile comune
- `web/` — React 19 + Vite, react-leaflet; testele Vitest pentru `shared/` sunt aici
- `mobile/` — React Native + Expo SDK 58, react-native-maps
- `docs/` — charter, plan, arhitectură, jurnalele de cod (`jurnal-D/M/R.md`), propunerea pentru etapa 3, `jurnal.md` (sesiunile de lucru)

## Cifre de referință
- Versiunea curentă: v2.3.0 (etapa 2 încheiată).
- Istoric: maxim 5 căutări, fără dubluri (R5).
- ip-api.com gratuit: doar HTTP, 45 de cereri pe minut (din README, nemăsurat de noi).

## Capcane cunoscute
- ip-api.com gratuit merge doar pe HTTP: o pagină HTTPS blochează cererea (`shared/api.js` aruncă eroare), iar `mobile/app.json` n-are excepție pentru cleartext, deci un build standalone (APK / iOS) va bloca cererile. Merge doar în Expo Go și local.
- Istoricul salvează `query.trim()` brut, iar `addQuery` compară șiruri exacte: „GitHub.com”, „github.com” și „https://github.com/x” devin trei intrări.
- `mobile/src/hooks/useHistory.js`: `AsyncStorage.getItem()` n-are `catch`, iar o căutare făcută înainte de citire e suprascrisă.
- Nu există CI (`.github/` lipsește), iar `vitest run --passWithNoTests` trece și fără teste.

## Unde am rămas
Etapa 2 e încheiată (v2.3.0, 19.11.2026). Propunerea pentru etapa 3 așteaptă votul echipei; tabelul de decizie e încă gol. **Următorul pas:** decizia echipei pe etapa 3, apoi corectarea dublurilor din istoric (normalizare + test). Detaliile pe sesiuni sunt în `docs/jurnal.md`.
