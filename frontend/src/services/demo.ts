/**
 * Демо-режим: сайт работает без бэкенда.
 *
 * Запросы, координаты и фото хранятся в браузере (localStorage), а
 * вкладки обмениваются обновлениями через BroadcastChannel. SMS при этом
 * НЕ отправляются: оператор сам открывает ссылку пострадавшего.
 *
 * Чтобы вернуть настоящий бэкенд, задайте переменную окружения
 * VITE_DEMO_MODE=false (и VITE_API_URL) и пересоберите проект.
 */
import type {
  LocationShareRecord,
  LocationShareRecordList,
  LocationShareRequest,
  Photo,
  PhotoList,
} from '../types';

export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false';

const PREFIX = 'emergency-demo:';
const CHANNEL_NAME = 'emergency-demo';

const memoryStore = new Map<string, string>();

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw =
      window.localStorage.getItem(PREFIX + key) ??
      memoryStore.get(key) ??
      null;

    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    const raw = memoryStore.get(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  }
}

function writeJson(key: string, value: unknown) {
  const raw = JSON.stringify(value);
  memoryStore.set(key, raw);

  try {
    window.localStorage.setItem(PREFIX + key, raw);
  } catch {
    // Хранилище переполнено или недоступно: остаёмся на памяти вкладки.
  }
}

function nextId(): number {
  const id = readJson<number>('last-id', 0) + 1;
  writeJson('last-id', id);
  return id;
}

type DemoMessage =
  | { kind: 'location'; requestId: number; data: LocationShareRecord }
  | { kind: 'photo'; requestId: number; data: Photo };

const localListeners = new Set<(message: DemoMessage) => void>();

const channel =
  typeof BroadcastChannel !== 'undefined'
    ? new BroadcastChannel(CHANNEL_NAME)
    : null;

channel?.addEventListener('message', (event) => {
  localListeners.forEach((listener) =>
    listener(event.data as DemoMessage),
  );
});

function publish(message: DemoMessage) {
  localListeners.forEach((listener) => listener(message));
  channel?.postMessage(message);
}

function subscribe<TData>(
  kind: DemoMessage['kind'],
  requestId: number,
  onData: (data: TData) => void,
) {
  const listener = (message: DemoMessage) => {
    if (message.kind === kind && message.requestId === requestId) {
      onData(message.data as TData);
    }
  };

  localListeners.add(listener);
  return () => {
    localListeners.delete(listener);
  };
}

/* ---------- Запросы и координаты ---------- */

export function demoCreateRequest(phone: string): LocationShareRequest {
  const now = Date.now();

  const request: LocationShareRequest = {
    id: nextId(),
    phone,
    created_at: new Date(now).toISOString(),
    expired_at: new Date(now + 24 * 60 * 60 * 1000).toISOString(),
  };

  writeJson(`request:${request.id}`, request);
  return request;
}

export function demoSubmitLocation(
  requestId: number,
  latitude: number,
  longitude: number,
): LocationShareRecord {
  const records = readJson<LocationShareRecord[]>(
    `records:${requestId}`,
    [],
  );

  const record: LocationShareRecord = {
    id: nextId(),
    request_id: requestId,
    latitude,
    longitude,
    created_at: new Date().toISOString(),
  };

  writeJson(`records:${requestId}`, [...records, record]);
  publish({ kind: 'location', requestId, data: record });

  return record;
}

export function demoGetRecords(
  requestId: number,
): LocationShareRecordList {
  return {
    items: readJson<LocationShareRecord[]>(`records:${requestId}`, []),
  };
}

export function demoSubscribeLocation(
  requestId: number,
  onLocation: (location: {
    id: number;
    latitude: number;
    longitude: number;
  }) => void,
) {
  return subscribe<LocationShareRecord>('location', requestId, onLocation);
}

/* ---------- Фото ---------- */

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Уменьшаем фото, чтобы оно поместилось в localStorage.
async function shrinkImage(dataUrl: string): Promise<string> {
  try {
    const image = new Image();
    image.src = dataUrl;
    await image.decode();

    const maxSide = 900;
    const scale = Math.min(
      1,
      maxSide / Math.max(image.width, image.height),
    );

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);
    canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/jpeg', 0.7);
  } catch {
    return dataUrl;
  }
}

export async function demoUploadPhoto(
  requestId: number,
  file: File,
): Promise<Photo> {
  const url = await shrinkImage(await readAsDataUrl(file));

  const photos = readJson<Photo[]>(`photos:${requestId}`, []);
  const photo: Photo = { id: nextId(), url };

  writeJson(`photos:${requestId}`, [...photos, photo]);
  publish({ kind: 'photo', requestId, data: photo });

  return photo;
}

export function demoGetPhotos(requestId: number): PhotoList {
  return { items: readJson<Photo[]>(`photos:${requestId}`, []) };
}

export function demoSubscribePhoto(
  requestId: number,
  onPhoto: (photo: Photo) => void,
) {
  return subscribe<Photo>('photo', requestId, onPhoto);
}
