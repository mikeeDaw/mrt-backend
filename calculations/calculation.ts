import { LatLngExpression } from "leaflet";
import { StationMod } from "../types/models";

interface Coordinate {
  lat: number;
  lng: number;
}

export const haversine = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

export const stationDistance = (coords: Coordinate, stations: StationMod[]) => {
  if (stations.length === 0 || !stations) {
    return true;
  }

  for (const station of stations) {
    if (
      coords.lat === station.coordinates.x &&
      coords.lng === station.coordinates.y
    ) {
      continue;
    }
    const stationLat = Number(station.coordinates.x);
    const stationLng = Number(station.coordinates.y);
    const dist = haversine(coords.lat, coords.lng, stationLat, stationLng);

    if (dist <= 0.5) {
      return { station: station.name, distance: (dist * 1000).toFixed(2) };
    }
  }

  return true;
};

export function calculateCenter(
  src: number[],
  dest: number[]
): LatLngExpression {
  const lat1 = src[0];
  const lon1 = src[1];
  const lat2 = dest[0];
  const lon2 = dest[1];

  const centerLat = (lat1 + lat2) / 2;
  const centerLon = (lon1 + lon2) / 2;

  return [centerLat, centerLon];
}
