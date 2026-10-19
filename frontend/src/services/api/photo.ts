import { apiClient } from './client';
import { resolveMediaUrl } from '../media';
import type { Photo, PhotoList } from '../../types';

const PHOTO_SHARES_PATH = '/api/v1/photo/photo-shares';

export const photoApi = {
  async upload(
    requestId: number,
    file: File,
  ): Promise<Photo> {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await apiClient.post<Photo>(
      PHOTO_SHARES_PATH,
      formData,
      {
        params: {
          request_id: requestId,
        },
      },
    );

    return {
      ...response.data,
      url: resolveMediaUrl(response.data.url),
    };
  },

  async getAll(
    requestId: number,
  ): Promise<PhotoList> {
    const response = await apiClient.get<PhotoList>(
      `${PHOTO_SHARES_PATH}/${requestId}/photos`,
    );

    return {
      ...response.data,
      items: response.data.items.map((photo) => ({
        ...photo,
        url: resolveMediaUrl(photo.url),
      })),
    };
  },
};