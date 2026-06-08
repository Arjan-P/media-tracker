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

const BASE = "https://api.igdb.com/v4";

// Simple in-memory token cache
let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const res = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${env.TWITCH_CLIENT_ID}&client_secret=${env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
    { method: "POST" },
  );
  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000 - 60_000; // refresh 1min early
  return cachedToken!;
}

async function igdbPost<T>(endpoint: string, body: string): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(`${BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Client-ID": env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${token}`,
      "Content-Type": "text/plain",
    },
    body,
  });
  if (!res.ok) throw new Error(`IGDB error: ${res.status}`);
  return res.json();
}

export class IgdbProvider implements MediaProvider {
  readonly type: MediaType = "game";
  readonly provider: MediaProviderType = "igdb";

  private normalize(raw: any): MediaItem {
    return {
      provider: this.provider,
      providerId: String(raw.id),
      type: this.type,
      name: raw.name,
      description: raw.summary ?? null,
      coverUrl: raw.cover?.url
        ? `https:${raw.cover.url.replace("t_thumb", "t_cover_big")}`
        : null,
      releaseDate: raw.first_release_date
        ? new Date(raw.first_release_date * 1000).toISOString().split("T")[0]
        : null,
    };
  }
  async search({ query, page, limit }: SearchParams): Promise<ProviderResult> {
    const offset = (page - 1) * limit;
    const items = await igdbPost<any[]>(
      "/games",
      `search "${query}"; fields name,summary,cover.url,first_release_date; limit ${limit}; offset ${offset};`,
    );
    // IGDB doesn't return total_count on search — fetch count separately
    const countResult = await igdbPost<{ count: number }>(
      "/games/count",
      `search "${query}";`,
    );
    return {
      items: items.map((r: any) => this.normalize(r)),
      count: items.length,
      totalItems: countResult?.count ?? items.length,
    };
  }

  async getById(providerId: string): Promise<MediaItem | null> {
    const results = await igdbPost<any[]>(
      "/games",
      `where id = ${providerId}; fields name,summary,cover.url,first_release_date; limit 1;`,
    );
    return results[0] ? this.normalize(results[0]) : null;
  }
}
