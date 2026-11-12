/* MapPanel.jsx - harta OpenStreetMap cu locatia aproximativa a IP-ului (R v2.2.0) */
import { useEffect } from 'react';
import { IoLocationSharp } from 'react-icons/io5';
import { CircleMarker, MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPanel.css';

const WORLD = [20, 0]; // vederea de pornire: toata lumea

// muta harta animat la coordonatele noi (useMap da acces la harta din MapContainer)
function FlyTo({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lon], 11, { duration: 1.2 });
  }, [map, lat, lon]);
  return null;
}

export default function MapPanel({ result, loading }) {
  return (
    <div className="map">
      <MapContainer center={WORLD} zoom={2} zoomControl={false} className="map-leaflet">
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={19}
        />
        <ZoomControl position="topright" />
        {result && (
          <>
            <CircleMarker
              center={[result.latitude, result.longitude]}
              radius={22}
              pathOptions={{ className: 'map-halo' }}
            />
            <CircleMarker
              center={[result.latitude, result.longitude]}
              radius={8}
              pathOptions={{ className: 'map-marker' }}
            />
            <FlyTo lat={result.latitude} lon={result.longitude} />
          </>
        )}
      </MapContainer>
      <p className="map-caption">
        <IoLocationSharp aria-hidden="true" />
        Locatie aproximativa a IP-ului
      </p>
      {loading && <div className="map-spinner" aria-hidden="true" />}
    </div>
  );
}

