import type { LocationPoint } from './location';
import type { EmergencyPhoto } from './photo';

export type EmergencySessionStatus =
  | 'pending'
  | 'active'
  | 'expired';

export interface EmergencySession {
  id: number;
  phone: string;
  status: EmergencySessionStatus;
  createdAt: string;
  expiresAt: string;
  locations: LocationPoint[];
  photos: EmergencyPhoto[];
}