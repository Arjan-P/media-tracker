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

const BASE = "https://api.jikan.moe/v4";

// normalize api response shape to api MediaItem
function normalize(
  raw: any,
  provider: MediaProviderType,
  type: MediaType,
): MediaItem {
  return {
    provider,
    providerId: String(raw.mal_id),
    type,
    name: raw.title_english ?? raw.title,
    description: raw.synopsis ?? null,
    coverUrl: raw.images?.jpg?.large_image_url ?? null,
    releaseDate: (raw.aired?.from ?? raw.published?.from)?.slice(0, 10) ?? null,
  };
}

function makeJikanProvider(mediaType: MediaType): MediaProvider {
  const endpoint = mediaType === "anime" ? "anime" : "manga";

  return {
    provider: "jikan",
    type: mediaType,

    // Jikan rate-limits at 3 req/sec
    // TODO: add retry logic
    //
    // TODO: call external api in try...catch and wrap external api error
    async search({
      query,
      page,
      limit,
    }: SearchParams): Promise<ProviderResult> {
      const url = new URL(`${BASE}/${endpoint}`);
      url.searchParams.set("q", query);
      url.searchParams.set("page", String(page));
      url.searchParams.set("limit", String(limit));
      // Jikan rate-limits at 3 req/sec — add retry logic in production
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`Jikan error: ${res.status}`);
      const data = await res.json();
      return {
        items: data.data.map((r: any) =>
          normalize(r, this.provider, mediaType),
        ),
        totalItems: data.pagination?.items?.total ?? data.data.length,
        count: data.pagination?.items?.count ?? 0,
      };
    },

    async getById(providerId: string): Promise<MediaItem | null> {
      const res = await fetch(`${BASE}/${endpoint}/${providerId}`);
      if (!res.ok) return null;
      const { data } = await res.json();
      return normalize(data, this.provider, mediaType);
    },
  };
}

export const JikanAnimeProvider = makeJikanProvider("anime");
export const JikanMangaProvider = makeJikanProvider("manga");
