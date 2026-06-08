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

const BASE = "https://openlibrary.org";

export class OpenLibraryProvider implements MediaProvider {
  readonly type: MediaType = "book";
  readonly provider: MediaProviderType = "openlibrary";

  private normalize(raw: any): MediaItem {
    const coverId = raw.cover_i ?? raw.cover_edition_key;
    return {
      provider: this.provider,
      providerId: raw.key.replace("/works/", ""), // e.g. "OL45804W"
      type: this.type,
      name: raw.title,
      description: raw.first_sentence?.value ?? null,
      coverUrl: coverId
        ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
        : null,
      releaseDate: raw.first_publish_year
        ? String(raw.first_publish_year)
        : null,
    };
  }
  async search({ query, page, limit }: SearchParams): Promise<ProviderResult> {
    const url = new URL(`${BASE}/search.json`);
    url.searchParams.set("q", query);
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));
    url.searchParams.set(
      "fields",
      // request specifically these fields
      "key,title,cover_i,cover_edition_key,first_publish_year,first_sentence",
    );

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`OpenLibrary error: ${res.status}`);
    const data = await res.json();

    return {
      items: data.docs.map((doc: any) => this.normalize(doc)),
      count: data.docs.length,
      totalItems: data.numFound,
    };
  }

  async getById(providerId: string): Promise<MediaItem | null> {
    const res = await fetch(`${BASE}/works/${providerId}.json`);
    if (!res.ok) return null;
    const raw = await res.json();
    return {
      provider: this.provider,
      providerId,
      type: "book",
      name: raw.title,
      description:
        typeof raw.description === "string"
          ? raw.description
          : (raw.description?.value ?? null),
      coverUrl: raw.covers?.[0]
        ? `https://covers.openlibrary.org/b/id/${raw.covers[0]}-L.jpg`
        : null,
      releaseDate: null,
    };
  }
}
