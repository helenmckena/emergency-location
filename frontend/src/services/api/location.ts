import { apiClient } from './client';
import type {
  LocationShareRecord,
  LocationShareRecordList,
  LocationShareRequest,
} from '../../types';

const LOCATION_SHARES_PATH = '/api/v1/location/location-shares';

export const locationApi = {
  async createShareRequest(phone: string): Promise<LocationShareRequest> {
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