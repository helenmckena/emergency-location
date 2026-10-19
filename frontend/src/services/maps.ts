export function create2GisGeoUrl(
  latitude: number,
  longitude: number,
): string {
  return `https://2gis.kz/geo/${longitude},${latitude}`;
}