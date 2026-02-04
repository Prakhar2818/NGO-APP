import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";

interface Props {
  onSelect: (lat: number, lng: number) => void;
}

const MapPicker: React.FC<Props> = ({ onSelect }) => {
  const [pos, setPos] = useState<[number, number] | null>(null);

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
    <MapContainer center={[28.61, 77.2]} zoom={13} style={{ height: 300 }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClick />
      {pos && <Marker position={pos} />}
    </MapContainer>
  );
};

export default MapPicker;
