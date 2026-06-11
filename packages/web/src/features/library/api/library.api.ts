import { api } from "@/lib/api";
import type {
  LibraryEntry,
  MediaItem,
  MediaStatus,
  PaginatedResponse,
  SuccessResponse,
} from "@media-tracker/shared";

export async function addMedia(item: MediaItem) {
  const res = await api.post<SuccessResponse<LibraryEntry>>(
    "/api/library",
    item,
  );
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

export async function updateStatus(id: string, status: MediaStatus) {
  const res = await api.patch<SuccessResponse<LibraryEntry>>(
    `/api/library/${id}/status`,
    { status },
  );
  return res.data.data;
}

export async function updateRating(id: string, rating: number) {
  const res = await api.patch<SuccessResponse<LibraryEntry>>(
    `/api/library/${id}/rating`,
    { rating },
  );
  return res.data.data;
}

export async function updateReview(id: string, review: string) {
  const res = await api.patch<SuccessResponse<LibraryEntry>>(
    `/api/library/${id}/review`,
    { review },
  );
  return res.data.data;
}

export async function removeFromLibrary(id: string) {
  await api.delete(`/api/library/${id}`);
}
