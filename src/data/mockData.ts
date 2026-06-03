export interface Facility {
  id: string;
  name: string;
  county: string;
  subCounty: string;
}

export interface InventoryItem {
  id: string;
  deviceType: string;
  imei: string | null;
  serial: string | null;
  status: string;
  dateReceived: string;
  facilityId: string;
}

export interface Requisition {
  id: string;
  sdpName: string;
  hrCount: number;
  deviceType: string;
  existingQty: number;
  requestedQty: number;
  status: string;
  timestamp: string;
}

export const COUNTIES: string[] = [];

export const FACILITIES: Facility[] = [];


export const DEVICE_TYPES = ['Tablet', 'Desktop', 'Laptop', 'Biometric'];

export const MOCK_INVENTORY: InventoryItem[] = [];


export const MOCK_REQUISITIONS: Requisition[] = [];
