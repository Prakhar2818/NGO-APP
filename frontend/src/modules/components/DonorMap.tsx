import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  Tooltip,
} from "react-leaflet";
import { useEffect, useState } from "react";
import api from "../../services/api";
import "leaflet/dist/leaflet.css";
import "../../utils/leafletIcons";

interface Props {
  donations: any[];
  ngoPos: [number, number];
  distanceById?: Record<string, number>;
}

const DonorMap: React.FC<Props> = ({
  donations,
  ngoPos,
  distanceById = {},
}) => {
  const [route, setRoute] = useState<any[]>([]);
  const [ngoName, setNgoName] = useState<string>("NGO");

  useEffect(() => {
    if (!donations.length) {
      setRoute([]);
      return;
    }

    const withLocation = donations.filter(
      (d) => d?.location?.coordinates?.length === 2,
    );

    if (!withLocation.length) {
      setRoute([]);
      return;
    }

    const nearest = withLocation.reduce((closest, current) => {
      const [curLng, curLat] = current.location.coordinates;
      const [bestLng, bestLat] = closest.location.coordinates;
      const curDist =
        Math.pow(curLat - ngoPos[0], 2) + Math.pow(curLng - ngoPos[1], 2);
      const bestDist =
        Math.pow(bestLat - ngoPos[0], 2) + Math.pow(bestLng - ngoPos[1], 2);
      return curDist < bestDist ? current : closest;
    });

    const [lng, lat] = nearest.location.coordinates;
    api
      .get("/donation/route", {
        params: {
          fromLat: ngoPos[0],
          fromLng: ngoPos[1],
          toLat: lat,
          toLng: lng,
        },
      })
      .then(({ data }) =>
        setRoute(data?.geometry?.map((g: any) => [g[1], g[0]]) || []),
      )
      .catch(() => {
        setRoute([]);
      });
  }, [donations, ngoPos]);

  useEffect(() => {
    const name =
      donations?.[0]?.ngo?.name ||
      donations?.[0]?.ngoName ||
      donations?.[0]?.ngo?.orgName ||
      "NGO";
    setNgoName(name);
  }, [donations]);


  return (
    <MapContainer center={ngoPos} zoom={13} style={{ height: 500 }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={ngoPos}>
        <Tooltip direction="top" offset={[0, -8]} opacity={1} permanent>
          NGO: {ngoName}
        </Tooltip>
        <Popup>{ngoName}</Popup>
      </Marker>

      {donations.map((d) => (
        <Marker
          key={d._id}
          position={[d.location.coordinates[1], d.location.coordinates[0]]}
        >
          <Tooltip direction="top" offset={[0, -8]} opacity={1} permanent>
            Restaurant: {d.restaurant?.name || d.restaurantName || "Restaurant"}
            {typeof distanceById[d._id] === "number" && (
              <span> • {distanceById[d._id].toFixed(2)} km</span>
            )}
          </Tooltip>
          <Popup>
            {d.restaurant?.name || d.restaurantName || "Restaurant"}
            {typeof distanceById[d._id] === "number" && (
              <div>{distanceById[d._id].toFixed(2)} km away</div>
            )}
          </Popup>
        </Marker>
      ))}

      {route.length > 0 && <Polyline positions={route} />}
    </MapContainer>
  );
};

export default DonorMap;
