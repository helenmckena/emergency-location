import { describe, expect, it } from 'vitest';

import {
  demoCreateRequest,
  demoGetRecords,
  demoSubmitLocation,
  demoSubscribeLocation,
} from './demo';

describe('demo mode', () => {
  it('создаёт запрос и сохраняет координаты без сервера', () => {
    const request = demoCreateRequest('+77007771111');
    const received: number[] = [];

    const unsubscribe = demoSubscribeLocation(request.id, (location) => {
      received.push(location.latitude);
    });

    demoSubmitLocation(request.id, 43.25, 76.95);
    unsubscribe();
    demoSubmitLocation(request.id, 43.3, 76.9);

    expect(received).toEqual([43.25]);
    expect(demoGetRecords(request.id).items).toHaveLength(2);
  });
});
