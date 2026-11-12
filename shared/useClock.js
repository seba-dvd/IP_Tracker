/* useClock.js - data si ora locala dintr-un fus orar, actualizate in fiecare secunda (R v2.2.0) */
import { useEffect, useState } from 'react';
import { formatLocalTime } from './format';

export function useClock(timeZone) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer); // oprim ceasul cand componenta dispare de pe ecran
  }, []);

  return formatLocalTime(timeZone, now);
}