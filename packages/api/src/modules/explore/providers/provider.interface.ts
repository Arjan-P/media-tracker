import type {
  MediaItem,
  MediaProviderType,
  MediaType,
} from "@media-tracker/shared";

export interface SearchParams {
  query: string;
  page: number;
  limit: number;
}

export interface ProviderResult {
  items: MediaItem[];
  count: number;
  totalItems: number;
}

export interface MediaProvider {
  readonly provider: MediaProviderType;
  readonly type: MediaType;
  search(params: SearchParams): Promise<ProviderResult>;
  getById(providerId: string): Promise<MediaItem | null>;
}
