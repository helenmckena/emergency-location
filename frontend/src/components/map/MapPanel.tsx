import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';

interface MapPanelProps {
  latitude: number | null;
  longitude: number | null;
  draggableMarker?: boolean;
  onMarkerDragEnd?: (
    latitude: number,
    longitude: number,
  ) => void;
}

const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapCenter({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const map = useMap();

  map.setView([latitude, longitude], 16);

  return null;
}

export function MapPanel({
  latitude,
  longitude,
  draggableMarker = false,
  onMarkerDragEnd,
}: MapPanelProps) {
  const hasLocation =
    latitude !== null && longitude !== null;

  const defaultPosition: [number, number] = [43.2389, 76.8897];

  return (
    <section className="map-panel" aria-label="Карта">
      <MapContainer
        center={
          hasLocation
            ? [latitude, longitude]
            : defaultPosition
        }
        zoom={hasLocation ? 16 : 12}
        scrollWheelZoom={false}
        className="map-panel__map"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {hasLocation && (
          <>
            <MapCenter
              latitude={latitude}
              longitude={longitude}
            />

            <Marker
              position={[latitude, longitude]}
              icon={markerIcon}
              draggable={draggableMarker}
              eventHandlers={
                onMarkerDragEnd
                  ? {
                      dragend: (event) => {
                        const marker = event.target as L.Marker;
                        const { lat, lng } = marker.getLatLng();
                        onMarkerDragEnd(lat, lng);
                      },
                    }
                  : undefined
              }
            />
          </>
        )}
      </MapContainer>
    </section>
  );
}