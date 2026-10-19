import { describe, expect, it } from 'vitest';

import { getCurrentPosition } from './geolocation';

type SuccessCallback = (position: {
  coords: { latitude: number; longitude: number };
}) => void;

type ErrorCallback = (error: unknown) => void;

function stubGeolocation(value: unknown) {
  Object.defineProperty(navigator, 'geolocation', {
    value,
    configurable: true,
    writable: true,
  });
}

describe('getCurrentPosition', () => {
  it('resolves with the coordinates reported by the browser', async () => {
    stubGeolocation({
      getCurrentPosition: (onSuccess: SuccessCallback) => {
        onSuccess({
          coords: { latitude: 43.238, longitude: 76.889 },
        });
      },
    });

    await expect(getCurrentPosition()).resolves.toEqual({
      latitude: 43.238,
      longitude: 76.889,
    });
  });

  it('rejects when the browser reports an error', async () => {
    const permissionDenied = {
      code: 1,
      message: 'User denied Geolocation',
    };

    stubGeolocation({
      getCurrentPosition: (
        _onSuccess: SuccessCallback,
        onError: ErrorCallback,
      ) => {
        onError(permissionDenied);
      },
    });

    await expect(getCurrentPosition()).rejects.toBe(
      permissionDenied,
    );
  });

  it('rejects when the browser has no geolocation support', async () => {
    stubGeolocation(undefined);

    await expect(getCurrentPosition()).rejects.toThrow(
      'Geolocation is not supported',
    );
  });

  it('asks for a high accuracy fix by default', async () => {
    let received: PositionOptions | undefined;

    stubGeolocation({
      getCurrentPosition: (
        onSuccess: SuccessCallback,
        _onError: ErrorCallback,
        options: PositionOptions,
      ) => {
        received = options;
        onSuccess({ coords: { latitude: 1, longitude: 2 } });
      },
    });

    await getCurrentPosition();

    expect(received).toEqual({
      enableHighAccuracy: true,
      timeout: 10_000,
      maximumAge: 0,
    });
  });

  it('lets the caller relax the cache age for background refreshes', async () => {
    let received: PositionOptions | undefined;

    stubGeolocation({
      getCurrentPosition: (
        onSuccess: SuccessCallback,
        _onError: ErrorCallback,
        options: PositionOptions,
      ) => {
        received = options;
        onSuccess({ coords: { latitude: 1, longitude: 2 } });
      },
    });

    await getCurrentPosition({ maximumAge: 5_000 });

    expect(received).toMatchObject({
      enableHighAccuracy: true,
      maximumAge: 5_000,
    });
  });
});
