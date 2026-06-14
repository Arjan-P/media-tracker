import { api } from "@/lib/api";
import type {
  LibraryEntry,
  MediaItem,
  MediaStatus,
  StatsResponse,
  PaginatedResponse,
  Progress,
  SuccessResponse,
} from "@media-tracker/shared";

export interface MediaUpdateBody {
  status?: MediaStatus;
  rating?: number;
  review?: string;
  progress?: Progress;
}

export async function addMedia(item: MediaItem) {
  const res = await api.post<SuccessResponse<LibraryEntry>>(
    "/api/library",
    item,
  );
  return res.data.data;
}

export async function getStats() {
  const res =
    await api.get<SuccessResponse<StatsResponse>>("/api/library/stats");
  return res.data.data;
}

export async function listLibrary(params: {
  status?: MediaStatus;
  page?: number;
  limit?: number;
}) {
  const res = await api.get<PaginatedResponse<LibraryEntry>>("/api/library", {
    params,
  });
  return res.data;
}

export async function getLibraryItem(id: string) {
  const res = await api.get<SuccessResponse<LibraryEntry>>(
    `/api/library/${id}`,
  );
  return res.data.data;
}

export async function updateMedia(id: string, data: MediaUpdateBody) {
  const res = await api.patch<SuccessResponse<LibraryEntry>>(
    `/api/library/${id}`,
    data,
  );
  return res.data.data;
}

export async function removeFromLibrary(id: string) {
  await api.delete(`/api/library/${id}`);
}
