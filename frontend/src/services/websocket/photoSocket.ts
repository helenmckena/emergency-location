import { connectReconnectingSocket } from './reconnectingSocket';

export interface PhotoSocketMessage {
  id: number;
  url: string;
}

function getWebSocketBaseUrl() {
  const apiUrl =
    import.meta.env.VITE_API_URL ||
    'http://localhost:8080';

  return apiUrl
    .replace(/^https:\/\//, 'wss://')
    .replace(/^http:\/\//, 'ws://');
}

export function connectPhotoSocket(
  requestId: number,
  onPhoto: (
    photo: PhotoSocketMessage,
  ) => void,
) {
  return connectReconnectingSocket<PhotoSocketMessage>({
    url: `${getWebSocketBaseUrl()}/api/v1/photo/photo-shares/ws/${requestId}`,
    label: 'Photo',
    onMessage: onPhoto,
  });
}
