import { fetchApi } from "@/lib/api";

export interface CommunityEvent {
  id: number;
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  isPublic: boolean;
  createdBy: number;
  createdAt: string;
}

export interface CreateCommunityEventDto {
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  isPublic: boolean;
}

export interface UpdateCommunityEventDto
  extends Partial<CreateCommunityEventDto> {}

export async function getCommunityEvents(): Promise<CommunityEvent[]> {
  return fetchApi("/communications/events");
}

export async function getCommunityEventById(
  id: number,
): Promise<CommunityEvent> {
  return fetchApi(`/communications/events/${id}`);
}

export async function createCommunityEvent(
  data: CreateCommunityEventDto,
): Promise<CommunityEvent> {
  return fetchApi("/communications/events", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCommunityEvent(
  id: number,
  data: UpdateCommunityEventDto,
): Promise<CommunityEvent> {
  return fetchApi(`/communications/events/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteCommunityEvent(id: number): Promise<void> {
  return fetchApi(`/communications/events/${id}`, {
    method: "DELETE",
  });
}
