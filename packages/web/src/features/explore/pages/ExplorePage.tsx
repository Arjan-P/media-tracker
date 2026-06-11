import { useParams } from "react-router-dom";
import { useState } from "react";
import type { MediaType } from "@media-tracker/shared";
import { useSearch } from "../hooks/useSearch";
import { useAddToLibrary } from "../hooks/useAddToLibrary";
import { MediaCard } from "../components/MediaCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react";
import { useDebounce } from "@/hooks/useDebounce";

const TYPE_LABELS: Record<MediaType, string> = {
  movie: "Movies",
  tv: "TV Shows",
  game: "Games",
  book: "Books",
  anime: "Anime",
  manga: "Manga",
};

export function ExplorePage() {
  // TODO: guard against invalid params
  const { type } = useParams<{ type: MediaType }>();
  const mediaType = (type as MediaType) ?? "movie";

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const debouncedQuery = useDebounce(query, 400);

  const { data, isFetching, isError } = useSearch(
    { query: debouncedQuery, type: mediaType, page },
    debouncedQuery.length >= 2,
  );

  const { add, isPending } = useAddToLibrary();

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">{TYPE_LABELS[mediaType]}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Search and discover {TYPE_LABELS[mediaType].toLowerCase()}
        </p>
      </div>

      {/* Search input */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder={`Search ${TYPE_LABELS[mediaType].toLowerCase()}...`}
          value={query}
          onChange={handleQueryChange}
        />
      </div>

      {/* States */}
      {!debouncedQuery && (
        <p className="text-sm text-muted-foreground text-center py-12">
          Start typing to search
        </p>
      )}

      {isFetching && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-4 p-3 rounded-xl border border-border"
            >
              <Skeleton className="h-28 w-20 rounded-lg flex-shrink-0" />
              <div className="flex flex-col gap-2 flex-1 py-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive text-center py-12">
          Something went wrong. Please try again.
        </p>
      )}

      {!isFetching && data && data.data.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-12">
          No results for "{debouncedQuery}"
        </p>
      )}

      {!isFetching && data && data.data.length > 0 && (
        <>
          <div className="flex flex-col gap-3">
            {data.data.map((item) => (
              <MediaCard
                key={`${item.provider}-${item.providerId}`}
                item={item}
                onAdd={add}
                isAdding={isPending}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!data.pagination.hasPreviousPage}
              onClick={() => setPage((p) => p - 1)}
            >
              <ArrowLeftIcon className="mr-1 size-4" /> Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {data.pagination.page} of {data.pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={!data.pagination.hasNextPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Next <ArrowRightIcon className="ml-1 size-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
