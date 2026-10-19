import { describe, expect, it, vi } from 'vitest';

import { isCameraPermissionDenied } from './camera';

function stubPermissions(value: unknown) {
  Object.defineProperty(navigator, 'permissions', {
    value,
    configurable: true,
    writable: true,
  });
}

describe('isCameraPermissionDenied', () => {
  it('reports a denied camera permission', async () => {
    stubPermissions({
      query: vi.fn().mockResolvedValue({ state: 'denied' }),
    });

    await expect(isCameraPermissionDenied()).resolves.toBe(
      true,
    );
  });

  it('lets a granted permission through', async () => {
    stubPermissions({
      query: vi.fn().mockResolvedValue({ state: 'granted' }),
    });

    await expect(isCameraPermissionDenied()).resolves.toBe(
      false,
    );
  });

  it('stays out of the way when the browser cannot answer', async () => {
    stubPermissions({
      query: vi
        .fn()
        .mockRejectedValue(new TypeError('unsupported')),
    });

    await expect(isCameraPermissionDenied()).resolves.toBe(
      false,
    );
  });

  it('stays out of the way without the permissions api', async () => {
    stubPermissions(undefined);

    await expect(isCameraPermissionDenied()).resolves.toBe(
      false,
    );
  });
});
