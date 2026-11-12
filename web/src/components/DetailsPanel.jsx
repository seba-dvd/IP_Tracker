/* DetailsPanel.jsx - detaliile rezultatului, fiecare cu iconita lui colorata; ora locala in timp real (R v2.2.0) */
import { IoBusinessOutline, IoEarthOutline, IoLocationOutline, IoServerOutline, IoTimeOutline } from 'react-icons/io5';
import { detailFields } from '../../../shared/format';
import { useClock } from '../../../shared/useClock';
import './DetailsPanel.css';

// numele iconitelor din detailFields (aceleasi ca pe mobil) -> componentele din react-icons
const ICONS = {
  'server-outline': IoServerOutline,
  'business-outline': IoBusinessOutline,
  'location-outline': IoLocationOutline,
  'earth-outline': IoEarthOutline,
  'time-outline': IoTimeOutline,
};

// clasele unei valori: bloc gri cat timp se incarca, cifre tabulare pentru ceas
function valueClass(empty, numeric) {
  if (empty) return 'value skeleton';
  return numeric ? 'value numeric' : 'value';
}

export default function DetailsPanel({ result, loading }) {
  const clock = useClock(result?.timezone);
  const empty = loading || !result;

  return (
    <>
      <h2 className="section-title">Detalii</h2>
      <ul className="fields">
        {detailFields(result ?? {}, clock).map((field) => {
          const Icon = ICONS[field.icon];
          return (
            <li key={field.label} className="field">
              <span className={`field-icon tone-${field.tone}`} aria-hidden="true">
                <Icon />
              </span>
              <div>
                <p className="label">{field.label}</p>
                <p className={valueClass(empty, field.numeric)}>{empty ? '\u00a0' : field.value}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

