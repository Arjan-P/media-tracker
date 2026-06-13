import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { MediaStatus, MediaType } from "@media-tracker/shared";

import { useLibraryList } from "../hooks/useLibrary";
import { LibraryMorphDialog } from "../components/LibraryMorphDialog";
import { EmptyState } from "../components/EmptyState";

import { ROUTES } from "@/app/router/routes";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import { LibraryBig } from "lucide-react";

const STATUS_FILTERS: { value: MediaStatus | undefined; label: string }[] = [
  { value: undefined, label: "All" },
  { value: "planned", label: "Planned" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "dropped", label: "Dropped" },
];

const TYPE_FILTERS: { value: MediaType | undefined; label: string }[] = [
  { value: undefined, label: "All Types" },
  { value: "movie", label: "Movies" },
  { value: "tv", label: "TV" },
  { value: "game", label: "Games" },
  { value: "book", label: "Books" },
  { value: "anime", label: "Anime" },
  { value: "manga", label: "Manga" },
];

export function LibraryPage() {
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState<MediaStatus | undefined>();
  const [typeFilter, setTypeFilter] = useState<MediaType | undefined>();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useLibraryList({
    status: statusFilter,
    page,
  });

  const entries = data?.data ?? [];
  const pagination = data?.pagination;

  const filtered = typeFilter
    ? entries.filter((e) => e.mediaItem.type === typeFilter)
    : entries;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Filters */}
      <div className="flex items-center gap-3 border-b px-4 py-3 shrink-0 overflow-x-auto">
        <div className="flex gap-2 shrink-0">
          {STATUS_FILTERS.map((filter) => (
            <Button
              key={String(filter.value)}
              size="sm"
              variant={statusFilter === filter.value ? "default" : "outline"}
              onClick={() => {
                setStatusFilter(filter.value);
                setPage(1);
              }}
              className="rounded-full"
            >
              {filter.label}
            </Button>
          ))}
        </div>

        <div className="h-5 w-px bg-border shrink-0" />

        <Select
          value={typeFilter ?? "all"}
          onValueChange={(value) =>
            setTypeFilter(value === "all" ? undefined : (value as MediaType))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter type" />
          </SelectTrigger>

          <SelectContent>
            {TYPE_FILTERS.map((filter) => (
              <SelectItem
                key={String(filter.value)}
                value={filter.value ?? "all"}
              >
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl border">
                <Skeleton className="aspect-[2/3] w-full" />
                <div className="space-y-2 p-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
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
                : "Find something to watch, read, or play from Explore."
            }
            action={
              !statusFilter && !typeFilter ? (
                <Button onClick={() => navigate(ROUTES.EXPLORE_MOVIES)}>
                  Browse Explore
                </Button>
              ) : undefined
            }
          />
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-4">
              {filtered.map((entry) => (
                <LibraryMorphDialog key={entry.id} entry={entry} />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-3">
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
