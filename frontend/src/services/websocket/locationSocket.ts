import { connectReconnectingSocket } from './reconnectingSocket';

export interface LocationSocketMessage {
  id: number;
  latitude: number;
  longitude: number;
}

function getWebSocketBaseUrl() {
  const apiUrl =
    import.meta.env.VITE_API_URL ||
    'http://localhost:8080';

  return apiUrl
    .replace(/^https:\/\//, 'wss://')
    .replace(/^http:\/\//, 'ws://');
}

export function connectLocationSocket(
  requestId: number,
  onLocation: (
    location: LocationSocketMessage,
  ) => void,
) {
  return connectReconnectingSocket<LocationSocketMessage>({
    url: `${getWebSocketBaseUrl()}/api/v1/location/location-shares/ws/${requestId}`,
    label: 'Location',
    onMessage: onLocation,
  });
}
