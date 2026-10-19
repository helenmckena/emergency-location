const HEARTBEAT_INTERVAL_MS = 25_000;
const RECONNECT_DELAY_MS = 3_000;

interface ReconnectingSocketOptions<TMessage> {
  url: string;
  label: string;
  onMessage: (message: TMessage) => void;
}

export function connectReconnectingSocket<TMessage>({
  url,
  label,
  onMessage,
}: ReconnectingSocketOptions<TMessage>): () => void {
  let socket: WebSocket | null = null;
  let heartbeatTimer: number | null = null;
  let reconnectTimer: number | null = null;
  let closedByClient = false;

  function clearHeartbeat() {
    if (heartbeatTimer !== null) {
      window.clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
  }

  function scheduleReconnect() {
    if (closedByClient || reconnectTimer !== null) {
      return;
    }

    reconnectTimer = window.setTimeout(() => {
      reconnectTimer = null;
      connect();
    }, RECONNECT_DELAY_MS);
  }

  function connect() {
    socket = new WebSocket(url);

    socket.onopen = () => {
      console.log(`${label} WebSocket connected`);

      clearHeartbeat();
      heartbeatTimer = window.setInterval(() => {
        if (socket?.readyState === WebSocket.OPEN) {
          socket.send('ping');
        }
      }, HEARTBEAT_INTERVAL_MS);
    };

    socket.onmessage = (event) => {
      try {
        onMessage(JSON.parse(event.data) as TMessage);
      } catch (error) {
        console.error(
          `Failed to parse ${label} WebSocket message:`,
          error,
        );
      }
    };

    socket.onerror = (error) => {
      console.error(`${label} WebSocket error:`, error);
    };

    socket.onclose = () => {
      console.log(`${label} WebSocket closed`);

      clearHeartbeat();
      scheduleReconnect();
    };
  }

  connect();

  return () => {
    closedByClient = true;

    clearHeartbeat();

    if (reconnectTimer !== null) {
      window.clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    socket?.close();
  };
}
