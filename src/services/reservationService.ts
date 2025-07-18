import { fetchApi } from "@/lib/api";

export enum ReservationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum CommonAreaType {
  SALON = 'SALON',
  BBQ = 'BBQ',
  COURT = 'COURT',
  POOL = 'POOL',
  GYM = 'GYM',
  OTHER = 'OTHER',
}

export interface CommonArea {
  id: number;
  name: string;
  description?: string;
  type: CommonAreaType;
  capacity?: number;
  requiresApproval?: boolean;
  hourlyRate?: number;
  availableDays?: string[];
  openingTime?: string;
  closingTime?: string;
}

export interface CreateCommonAreaDto {
  name: string;
  description?: string;
  type: CommonAreaType;
  capacity?: number;
  requiresApproval?: boolean;
  hourlyRate?: number;
  availableDays?: string[];
  openingTime?: string;
  closingTime?: string;
}

export interface UpdateCommonAreaDto extends Partial<CreateCommonAreaDto> {}

export interface Reservation {
  id: number;
  commonAreaId: number;
  commonArea: CommonArea; // Populated relation
  userId: number;
  user: any; // Populated relation (UserDto)
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  status: ReservationStatus;
  attendees?: number;
  requiresPayment?: boolean;
  paymentAmount?: number;
  paymentStatus?: string;
  rejectionReason?: string;
  approvedById?: number;
  approvedAt?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationDto {
  commonAreaId: number;
  userId: number;
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  attendees?: number;
  requiresPayment?: boolean;
  paymentAmount?: number;
}

export interface UpdateReservationDto extends Partial<CreateReservationDto> {
  status?: ReservationStatus;
  rejectionReason?: string;
  cancellationReason?: string;
}

export interface ReservationFilterParams {
  commonAreaId?: number;
  userId?: number;
  status?: ReservationStatus;
  startDate?: string;
  endDate?: string;
}

// Common Area API calls
export async function getCommonAreas(): Promise<CommonArea[]> {
  return fetchApi("/reservations/common-areas");
}

export async function getCommonAreaById(id: number): Promise<CommonArea> {
  return fetchApi(`/reservations/common-areas/${id}`);
}

export async function createCommonArea(data: CreateCommonAreaDto): Promise<CommonArea> {
  return fetchApi("/reservations/common-areas", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCommonArea(id: number, data: UpdateCommonAreaDto): Promise<CommonArea> {
  return fetchApi(`/reservations/common-areas/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteCommonArea(id: number): Promise<void> {
  return fetchApi(`/reservations/common-areas/${id}`, {
    method: "DELETE",
  });
}

// Reservation API calls
export async function getReservations(filters?: ReservationFilterParams): Promise<Reservation[]> {
  const query = new URLSearchParams();
  if (filters) {
    for (const key in filters) {
      if (filters[key as keyof ReservationFilterParams]) {
        query.append(key, filters[key as keyof ReservationFilterParams] as string);
      }
    }
  }
  return fetchApi(`/reservations?${query.toString()}`);
}

export async function getReservationById(id: number): Promise<Reservation> {
  return fetchApi(`/reservations/${id}`);
}

export async function createReservation(data: CreateReservationDto): Promise<Reservation> {
  return fetchApi("/reservations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateReservation(id: number, data: UpdateReservationDto): Promise<Reservation> {
  return fetchApi(`/reservations/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function updateReservationStatus(id: number, status: ReservationStatus): Promise<Reservation> {
  return fetchApi(`/reservations/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export async function deleteReservation(id: number): Promise<void> {
  return fetchApi(`/reservations/${id}`, {
    method: "DELETE",
  });
}