import { describe, expect, it } from 'vitest';

import { create2GisGeoUrl } from './maps';

describe('create2GisGeoUrl', () => {
  it('puts longitude before latitude, as 2GIS expects', () => {
    expect(create2GisGeoUrl(43.2389, 76.8897)).toBe(
      'https://2gis.kz/geo/76.8897,43.2389',
    );
  });
});
