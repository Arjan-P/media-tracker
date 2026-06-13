import { useState } from "react";
import { useParams } from "react-router-dom";
import { Compass } from "lucide-react";
import type { MediaType } from "@media-tracker/shared";
import { useSearch } from "../hooks/useSearch";
import { useAddToLibrary } from "../hooks/useAddToLibrary";
import { SearchBar } from "../components/SearchBar";
import { ExploreCard } from "@/components/MediaCard";
import { EmptyState } from "@/features/library/components/EmptyState";
import { useDebounce } from "@/hooks/useDebounce";
import { useLibraryList } from "@/features/library/hooks/useLibrary";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const TYPE_LABELS: Record<MediaType, string> = {
  movie: "Movies",
  tv: "TV shows",
  game: "Games",
  book: "Books",
  anime: "Anime",
  manga: "Manga",
};

const TYPE_PLACEHOLDERS: Record<MediaType, string> = {
  movie: "Search movies…",
  tv: "Search TV shows…",
  game: "Search games…",
  book: "Search books…",
  anime: "Search anime…",
  manga: "Search manga…",
};

export function ExplorePage() {
  const { type } = useParams<{ type: MediaType }>();
  const mediaType = (type ?? "movie") as MediaType;

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const debouncedQuery = useDebounce(query, 350);

  const { data, isLoading, isFetching } = useSearch(
    { query: debouncedQuery, type: mediaType, page },
    debouncedQuery.length > 0,
  );

  // Load one page of library items to know which are already added
  const { data: libraryData } = useLibraryList({ page: 1 });
  const libraryProviderIds = new Set(
    (libraryData?.data ?? []).map((e) => e.mediaItem.providerId),
  );

  const { add, isPending: addPending } = useAddToLibrary();
  const [pendingId, setPendingId] = useState<string | null>(null);

  function handleAdd(item: Parameters<typeof add>[0]) {
    setPendingId(item.providerId);
    add(item);
    setTimeout(() => setPendingId(null), 1500);
  }

  const items = data?.data ?? [];
  const pagination = data?.pagination;
  const hasQuery = debouncedQuery.length > 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Search bar */}
      <div className="px-4 py-3 border-b border-border shrink-0">
        <SearchBar
          value={query}
          onChange={(v) => {
            setQuery(v);
            setPage(1);
          }}
          placeholder={TYPE_PLACEHOLDERS[mediaType]}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Loading skeleton */}
        {(isLoading || (isFetching && items.length === 0)) && hasQuery && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl border">
                <Skeleton className="aspect-[2/3] w-full" />
                <div className="space-y-2 p-3">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-2.5 w-1/2" />
                  <Skeleton className="h-7 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty / prompt states */}
        {!hasQuery && (
          <EmptyState
            icon={Compass}
            title={`Search ${TYPE_LABELS[mediaType]}`}
            description={`Type a title above to find ${TYPE_LABELS[mediaType].toLowerCase()} to add to your library.`}
          />
        )}

        {hasQuery && !isLoading && items.length === 0 && (
          <EmptyState
            icon={Compass}
            title="No results"
            description={`Nothing found for "${debouncedQuery}". Try a different search.`}
          />
        )}

        {/* Results grid */}
        {hasQuery && !isLoading && items.length > 0 && (
          <>
            <div
              className={cn(
                "grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-4 transition-opacity",
                isFetching ? "opacity-60" : "opacity-100",
              )}
            >
              {items.map((item) => (
                <ExploreCard
                  key={item.providerId}
                  item={item}
                  inLibrary={libraryProviderIds.has(item.providerId)}
                  isPending={pendingId === item.providerId && addPending}
                  onAdd={() => handleAdd(item)}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6 pb-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
