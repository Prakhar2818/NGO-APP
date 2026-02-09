import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { defaultMarkerIcon } from "../../utils/leafletIcons";

import RecenterMap from "./RecenterMap";

interface Props {
  onSelect: (lat: number, lng: number) => void;
}

const MapPicker: React.FC<Props> = ({ onSelect }) => {
  const [pos, setPos] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setPos([lat, lng]);
        onSelect(lat, lng);
      },
      () => {
        setPos([21.15, 79.08]);
      },
    );
  }, []);

  const MapClick = () => {
    useMapEvents({
      click(e) {
        setPos([e.latlng.lat, e.latlng.lng]);
        onSelect(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  return (
    <MapContainer center={[21.15, 79.08]} zoom={13} style={{ height: 300 }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {pos && <RecenterMap position={pos} />}
      <MapClick />
      {pos && <Marker position={pos} icon={defaultMarkerIcon} />}
    </MapContainer>
  );
};

export default MapPicker;
