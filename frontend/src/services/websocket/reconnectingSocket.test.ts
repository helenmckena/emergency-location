import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { connectReconnectingSocket } from './reconnectingSocket';

class FakeSocket {
  static instances: FakeSocket[] = [];
  static readonly OPEN = 1;

  readyState = 0;
  sent: string[] = [];
  closedByCode = false;

  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: ((event: unknown) => void) | null = null;
  onclose: (() => void) | null = null;

  readonly url: string;

  constructor(url: string) {
    this.url = url;
    FakeSocket.instances.push(this);
  }

  send(data: string) {
    this.sent.push(data);
  }

  close() {
    this.closedByCode = true;
  }

  // helpers driven by the tests, not part of the WebSocket API
  simulateOpen() {
    this.readyState = FakeSocket.OPEN;
    this.onopen?.();
  }

  simulateMessage(data: string) {
    this.onmessage?.({ data });
  }

  simulateDrop() {
    this.readyState = 3;
    this.onclose?.();
  }
}

function latestSocket() {
  return FakeSocket.instances[FakeSocket.instances.length - 1];
}

describe('connectReconnectingSocket', () => {
  beforeEach(() => {
    FakeSocket.instances = [];
    vi.useFakeTimers();
    vi.stubGlobal('WebSocket', FakeSocket);
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('forwards parsed messages to the handler', () => {
    const onMessage = vi.fn();

    connectReconnectingSocket<{ id: number }>({
      url: 'ws://localhost/ws/1',
      label: 'Location',
      onMessage,
    });

    latestSocket().simulateOpen();
    latestSocket().simulateMessage('{"id":7}');

    expect(onMessage).toHaveBeenCalledWith({ id: 7 });
  });

  it('swallows malformed json instead of throwing', () => {
    const onMessage = vi.fn();

    connectReconnectingSocket({
      url: 'ws://localhost/ws/1',
      label: 'Photo',
      onMessage,
    });

    latestSocket().simulateOpen();

    expect(() =>
      latestSocket().simulateMessage('not json'),
    ).not.toThrow();

    expect(onMessage).not.toHaveBeenCalled();
  });

  it('sends a heartbeat so idle connections are not dropped', () => {
    connectReconnectingSocket({
      url: 'ws://localhost/ws/1',
      label: 'Location',
      onMessage: vi.fn(),
    });

    const socket = latestSocket();
    socket.simulateOpen();

    vi.advanceTimersByTime(25_000);

    expect(socket.sent).toEqual(['ping']);
  });

  it('reconnects after the connection drops', () => {
    connectReconnectingSocket({
      url: 'ws://localhost/ws/1',
      label: 'Location',
      onMessage: vi.fn(),
    });

    latestSocket().simulateOpen();
    latestSocket().simulateDrop();

    expect(FakeSocket.instances).toHaveLength(1);

    vi.advanceTimersByTime(3_000);

    expect(FakeSocket.instances).toHaveLength(2);
  });

  it('stops reconnecting once the caller unsubscribes', () => {
    const disconnect = connectReconnectingSocket({
      url: 'ws://localhost/ws/1',
      label: 'Location',
      onMessage: vi.fn(),
    });

    const socket = latestSocket();
    socket.simulateOpen();

    disconnect();
    socket.simulateDrop();

    vi.advanceTimersByTime(30_000);

    expect(socket.closedByCode).toBe(true);
    expect(FakeSocket.instances).toHaveLength(1);
    expect(socket.sent).toEqual([]);
  });
});
