export interface Visitor {
  id: number;
  name: string;
  documentType: string;
  documentNumber: string;
  purpose?: string;
  entryTime: string;
  exitTime?: string;
  status: string;
  residentId?: number;
  complexId?: number;
  propertyId?: number;
}

export interface PreRegisteredVisitor {
  id: number;
  name: string;
  documentType: string;
  documentNumber: string;
  expectedDate: string;
  validFrom: string;
  validUntil: string;
  residentId: number;
  unitId: number;
  complexId: string;
  qrCode: string;
}

export interface Package {
  id: number;
  trackingNumber: string;
  recipientUnit: string;
  status: "PENDING" | "DELIVERED";
  createdAt: string;
  deliveredAt?: string;
}
