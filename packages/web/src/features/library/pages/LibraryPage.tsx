import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type {
  LibraryEntry,
  MediaStatus,
  MediaType,
} from "@media-tracker/shared";
import { useLibraryList } from "../hooks/useLibrary";
import { LibraryCard } from "@/components/MediaCard";
import { LibraryDetailPanel } from "../components/LibraryDetailPanel";
import { EmptyState } from "../components/EmptyState";
import { ROUTES } from "@/app/router/routes";
import { cn } from "@/lib/utils";
import { LibraryBig } from "lucide-react";

const STATUS_FILTERS: { value: MediaStatus | undefined; label: string }[] = [
  { value: undefined, label: "All" },
  { value: "planned", label: "Planned" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "dropped", label: "Dropped" },
];

const TYPE_FILTERS: { value: MediaType | undefined; label: string }[] = [
  { value: undefined, label: "All types" },
  { value: "movie", label: "Movies" },
  { value: "tv", label: "TV" },
  { value: "game", label: "Games" },
  { value: "book", label: "Books" },
  { value: "anime", label: "Anime" },
  { value: "manga", label: "Manga" },
];

export function LibraryPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<MediaStatus | undefined>(
    undefined,
  );
  const [typeFilter, setTypeFilter] = useState<MediaType | undefined>(
    undefined,
  );
  const [selected, setSelected] = useState<LibraryEntry | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useLibraryList({
    status: statusFilter,
    page,
  });

  const entries = data?.data ?? [];
  const pagination = data?.pagination;

  function handleSelect(entry: LibraryEntry) {
    setSelected((prev) => (prev?.id === entry.id ? null : entry));
  }

  // Keep selected in sync if the entry was updated in the cache
  const displaySelected = selected
    ? (entries.find((e) => e.id === selected.id) ?? selected)
    : null;

  const filtered = typeFilter
    ? entries.filter((e) => e.mediaItem.type === typeFilter)
    : entries;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Filter bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border overflow-x-auto shrink-0">
          <div className="flex items-center gap-1.5 shrink-0">
            {STATUS_FILTERS.map((f) => (
              <button
                key={String(f.value)}
                onClick={() => {
                  setStatusFilter(f.value);
                  setPage(1);
                  setSelected(null);
                }}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors",
                  statusFilter === f.value
                    ? "bg-foreground text-background border-transparent"
                    : "border-border text-muted-foreground hover:border-foreground/30",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="w-px h-4 bg-border mx-1 shrink-0" />

          <select
            value={typeFilter ?? ""}
            onChange={(e) =>
              setTypeFilter((e.target.value as MediaType) || undefined)
            }
            className="text-xs px-2.5 py-1.5 rounded-full border border-border bg-background text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {TYPE_FILTERS.map((f) => (
              <option key={String(f.value)} value={f.value ?? ""}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border overflow-hidden animate-pulse"
                >
                  <div className="aspect-[2/3] bg-muted" />
                  <div className="p-2.5 space-y-1.5">
                    <div className="h-3 bg-muted rounded w-3/4" />
                    <div className="h-2.5 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {isError && (
            <EmptyState
              icon={LibraryBig}
              title="Couldn't load your library"
              description="Something went wrong. Refresh to try again."
            />
          )}

          {!isLoading && !isError && filtered.length === 0 && (
            <EmptyState
              icon={LibraryBig}
              title={
                statusFilter || typeFilter
                  ? "Nothing matches these filters"
                  : "Your library is empty"
              }
              description={
                statusFilter || typeFilter
                  ? "Try adjusting the filters above."
                  : "Find something to watch, read, or play — add it from Explore."
              }
              action={
                !statusFilter && !typeFilter ? (
                  <button
                    onClick={() => navigate(ROUTES.EXPLORE_MOVIES)}
                    className="text-xs px-4 py-2 rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors"
                  >
                    Browse Explore
                  </button>
                ) : undefined
              }
            />
          )}

          {!isLoading && !isError && filtered.length > 0 && (
            <>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-3">
                {filtered.map((entry) => (
                  <LibraryCard
                    key={entry.id}
                    entry={entry}
                    selected={selected?.id === entry.id}
                    onClick={() => handleSelect(entry)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-6 pb-2">
                  <button
                    disabled={!pagination.hasPreviousPage}
                    onClick={() => setPage((p) => p - 1)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-border disabled:opacity-40 hover:bg-muted transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-muted-foreground">
                    {pagination.page} / {pagination.totalPages}
                  </span>
                  <button
                    disabled={!pagination.hasNextPage}
                    onClick={() => setPage((p) => p + 1)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-border disabled:opacity-40 hover:bg-muted transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Detail panel */}
      {displaySelected && (
        <LibraryDetailPanel
          entry={displaySelected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
