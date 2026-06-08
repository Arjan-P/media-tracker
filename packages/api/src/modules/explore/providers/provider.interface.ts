import type { MediaItem, MediaType } from "@media-tracker/shared";

export interface SearchParams {
  query: string;
  page: number;
  limit: number;
}

export interface ProviderResult {
  items: MediaItem[];
  totalItems: number;
}

export interface MediaProvider {
  readonly type: MediaType;
  search(params: SearchParams): Promise<ProviderResult>;
  getById(providerId: string): Promise<MediaItem | null>;
}
