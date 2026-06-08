import type { MediaType } from "@media-tracker/shared";
import type { MediaProvider } from "./providers/provider.interface.js";
import {
  JikanAnimeProvider,
  JikanMangaProvider,
} from "./providers/jikan.provider.js";
import { NotFoundError, BadRequestError } from "../../errors/http.errors.js";
import type { SearchQueryType } from "./explore.schema.js";

const providerRegistry = new Map<MediaType, MediaProvider>([
  ["anime", JikanAnimeProvider],
  ["manga", JikanMangaProvider],
]);

export class ExploreService {
  private getProvider(type: MediaType): MediaProvider {
    const provider = providerRegistry.get(type);
    if (!provider) throw new BadRequestError(`No provider for type: ${type}`);
    return provider;
  }

  async search({ query, type, page, limit }: SearchQueryType) {
    const provider = this.getProvider(type);
    return provider.search({ query, page, limit });
  }

  async getById(type: MediaType, providerId: string) {
    const provider = this.getProvider(type);
    const item = await provider.getById(providerId);
    if (!item) throw new NotFoundError("Media item not found");
    return item;
  }
}
