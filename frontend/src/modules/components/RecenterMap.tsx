import { useMap } from "react-leaflet";
import { useEffect } from "react";

interface RecenterProps {
  position: [number, number];
}

const RecenterMap: React.FC<RecenterProps> = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, map.getZoom());
  }, [position]);
  return null;
};

export default RecenterMap;
