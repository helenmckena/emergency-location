export interface LocationShareRequest {
  id: number;
  phone: string;
  created_at: string;
  expired_at: string;
}

export interface LocationShareRecord {
  id: number;
  request_id: number;
  latitude: number;
  longitude: number;
  created_at: string;
}

export interface LocationShareRecordList {
  items: LocationShareRecord[];
}