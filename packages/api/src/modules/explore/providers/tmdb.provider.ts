import type {
  MediaItem,
  MediaProviderType,
  MediaType,
} from "@media-tracker/shared";
import type {
  MediaProvider,
  SearchParams,
  ProviderResult,
} from "./provider.interface.js";
import { env } from "../../../configs/env/env.js";

const BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";

const headers = {
  Authorization: `Bearer ${env.TMDB_API_KEY}`,
  "Content-Type": "application/json",
};

// Shared fetch helper
async function tmdbGet<T>(
  path: string,
  params: Record<string, string> = {},
): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { headers });
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}

function normalize(
  raw: any,
  provider: MediaProviderType,
  type: MediaType,
): MediaItem {
  return {
    provider,
    providerId: String(raw.id),
    type,
    name: raw.title ?? raw.name,
    description: raw.overview ?? null,
    coverUrl: raw.poster_path ? `${IMG}${raw.poster_path}` : null,
    releaseDate: raw.release_date ?? raw.first_air_date ?? null,
  };
}

export class TmdbMovieProvider implements MediaProvider {
  readonly type: MediaType = "movie";
  readonly provider: MediaProviderType = "tmdb";

  async search({ query, page }: SearchParams): Promise<ProviderResult> {
    const data = await tmdbGet<any>("/search/movie", {
      query,
      page: String(page),
    });
    return {
      items: data.results.map((r: any) =>
        normalize(r, this.provider, this.type),
      ),
      count: data.results.length,
      totalItems: data.total_results,
    };
  }

  async getById(providerId: string): Promise<MediaItem | null> {
    const raw = await tmdbGet<any>(`/movie/${providerId}`);
    return normalize(raw, this.provider, this.type);
  }
}

export class TmdbTvProvider implements MediaProvider {
  readonly type: MediaType = "tv";
  readonly provider: MediaProviderType = "tmdb";

  async search({ query, page }: SearchParams): Promise<ProviderResult> {
    const data = await tmdbGet<any>("/search/tv", {
      query,
      page: String(page),
    });
    return {
      items: data.results.map((r: any) =>
        normalize(r, this.provider, this.type),
      ),
      totalItems: data.results.length,
      count: data.total_results,
    };
  }

  async getById(providerId: string): Promise<MediaItem | null> {
    const raw = await tmdbGet<any>(`/tv/${providerId}`);
    return normalize(raw, this.provider, this.type);
  }
}
