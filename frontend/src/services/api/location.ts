import { apiClient } from './client';
import {
  DEMO_MODE,
  demoCreateRequest,
  demoGetRecords,
  demoSubmitLocation,
} from '../demo';
import type {
  LocationShareRecord,
  LocationShareRecordList,
  LocationShareRequest,
} from '../../types';

const LOCATION_SHARES_PATH = '/api/v1/location/location-shares';

export const locationApi = {
  async createShareRequest(phone: string): Promise<LocationShareRequest> {
    if (DEMO_MODE) {
      return demoCreateRequest(phone);
    }

    const response = await apiClient.post<LocationShareRequest>(
      LOCATION_SHARES_PATH,
      { phone },
    );

    return response.data;
  },

  async submitLocation(
    requestId: number,
    latitude: number,
    longitude: number,
  ): Promise<LocationShareRecord> {
    if (DEMO_MODE) {
      return demoSubmitLocation(requestId, latitude, longitude);
    }

    const response = await apiClient.post<LocationShareRecord>(
      `${LOCATION_SHARES_PATH}/${requestId}/records`,
      {
        latitude,
        longitude,
      },
    );

    return response.data;
  },

  async getLocationRecords(
    requestId: number,
    includeAll = false,
  ): Promise<LocationShareRecordList> {
    if (DEMO_MODE) {
      const all = demoGetRecords(requestId);

      return includeAll
        ? all
        : { items: all.items.slice(-1) };
    }

    const response = await apiClient.get<LocationShareRecordList>(
      `${LOCATION_SHARES_PATH}/${requestId}/records`,
      {
        params: {
          include_all: includeAll,
        },
      },
    );

    return response.data;
  },

  async getLatestLocation(
  requestId: number,
): Promise<LocationShareRecord | null> {
  if (DEMO_MODE) {
    const items = demoGetRecords(requestId).items;

    return items.length > 0 ? items[items.length - 1] : null;
  }

  const response = await apiClient.get<LocationShareRecordList>(
    `${LOCATION_SHARES_PATH}/${requestId}/records`,
    {
      params: {
        include_all: true,
      },
    },
  );

  const items = response.data.items;

  if (items.length === 0) {
    return null;
  }

    return items[items.length - 1];
  },
};