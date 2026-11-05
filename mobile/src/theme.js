/* theme.js - culorile si dimensiunile din noul design teal si coral (M v2.0.0)
   Sunt aceleasi valori ca variabilele din web/src/index.css. */

export const colors = {
  light: {
    bg: '#F8F4EC',                       // fundalul ecranului: crem, plin
    panel: '#FFFFFF',                    // fundalul cardurilor
    border: 'rgba(31, 42, 46, 0.08)',    // bordura fina a cardurilor
    text: '#1F2A2E',                     // text principal
    muted: '#5F6B6E',                    // text secundar: etichete, placeholder
    primary: '#0F766E',                  // teal: logo-ul si cardul cu rezultatul
    onPrimary: '#FFFFFF',                // text pe teal
    onPrimaryMuted: '#E7F1F0',           // text secundar pe teal
    primaryText: '#0F766E',              // linkuri si iconite teal pe fundal deschis
    primarySoft: '#E3F1EF',              // teal foarte deschis: pastile
    accent: '#F2684A',                   // coral: butonul Cauta si markerul
    accentSoft: 'rgba(242, 104, 74, 0.22)', // haloul markerului
    onAccent: '#2B1007',                 // text pe coral
    danger: '#B42318',                   // textul mesajului de eroare
    dangerBg: '#FEF1EE',                 // fundalul mesajului de eroare
    skeleton: '#EEE8DD',                 // blocurile afisate cat timp se incarca
    shadow: '0 6px 16px rgba(31, 42, 46, 0.10)', // umbra cardurilor
    // tonurile iconitelor din detalii: fg = iconita, bg = fundalul ei
    tones: {
      teal: { fg: '#0F766E', bg: '#DDF1EE' },
      coral: { fg: '#C8462B', bg: '#FDE6E0' },
      amber: { fg: '#A16207', bg: '#FCF0D2' },
      blue: { fg: '#2B6CB0', bg: '#E1EDF9' },
      plum: { fg: '#7E4A9E', bg: '#F0E6F6' },
    },
  },
  dark: {
    bg: '#111418',
    panel: '#1B2026',
    border: 'rgba(255, 255, 255, 0.08)',
    text: '#E9EDF0',
    muted: '#A3ADB5',
    primary: '#0F766E',
    onPrimary: '#FFFFFF',
    onPrimaryMuted: '#E7F1F0',
    primaryText: '#2DD4BF',
    primarySoft: '#17302D',
    accent: '#F2684A',
    accentSoft: 'rgba(242, 104, 74, 0.22)',
    onAccent: '#2B1007',
    danger: '#FFB4AB',
    dangerBg: '#2A1715',
    skeleton: '#262C33',
    shadow: '0 6px 16px rgba(0, 0, 0, 0.45)',
    tones: {
      teal: { fg: '#5EEAD4', bg: '#17302D' },
      coral: { fg: '#FF9A84', bg: '#3A221D' },
      amber: { fg: '#F5C451', bg: '#362C14' },
      blue: { fg: '#8DBBEF', bg: '#1B2A3D' },
      plum: { fg: '#D2A8EE', bg: '#2E2238' },
    },
  },
};

// spatiile din specificatia pentru telefon
export const space = {
  page: 16,  // marginile ecranului
  gap: 16,   // spatiul dintre carduri
  panel: 16, // padding-ul cardurilor
};

// colturile rotunjite
export const radius = {
  panel: 16,   // carduri
  control: 12, // campuri si butoane
};

// stilurile de text comune
export const type = {
  title: { fontSize: 16, fontWeight: '600' },
  label: { fontSize: 12 },
  value: { fontSize: 15, fontWeight: '500' },
  numeric: { fontVariant: ['tabular-nums'] }, // cifre de latime egala: IP, ceas
};
