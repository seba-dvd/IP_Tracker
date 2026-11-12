/* ResultSummary.jsx - cardul cu rezultatul: adresa IP si locatia, pe fundalul teal (R v2.2.0) */
import { IoGlobeOutline } from 'react-icons/io5';
import { formatLocation } from '../../../shared/format';
import './ResultSummary.css';

export default function ResultSummary({ result, loading }) {
  const empty = loading || !result; // fara date de afisat: blocuri translucide

  return (
    <div className="summary-card">
      <div>
        <h2 className="summary-label">Rezultat</h2>
        <p className={empty ? 'summary-ip skeleton' : 'summary-ip numeric'}>
          {empty ? '\u00a0' : result.ip}
        </p>
        <p className={empty ? 'summary-place skeleton' : 'summary-place'}>
          {empty ? '\u00a0' : formatLocation(result)}
        </p>
      </div>
      <span className="summary-icon" aria-hidden="true">
        <IoGlobeOutline />
      </span>
    </div>
  );
}
