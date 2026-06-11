import { api } from "@/lib/api";
import {
  paginatedResponse,
  type MediaItem,
  type MediaType,
  type PaginatedResponse,
  type SuccessResponse,
} from "@media-tracker/shared";

export interface SearchParams {
  query: string;
  type: MediaType;
  page?: number;
  limit?: number;
}

export async function searchMedia(params: SearchParams) {
  const res = await api.get<PaginatedResponse<MediaItem>>(
    "/api/explore/search",
    {
      params,
    },
  );

  return res.data;
}

export async function getMediaItem(type: MediaType, providerId: string) {
  const res = await api.get<SuccessResponse<MediaItem>>("/api/explore/item", {
    params: { type, providerId },
  });

  return res.data;
}
