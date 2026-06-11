import { useState } from "react";
import type { MediaStatus } from "@media-tracker/shared";
import { useLibraryList } from "../hooks/useLibrary";
import { LibraryFilters } from "../components/LibraryFilters";
import { LibraryCard } from "../components/LibraryCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenIcon,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/app/router/routes";

export function LibraryPage() {
  const [status, setStatus] = useState<MediaStatus | "all">("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useLibraryList({
    status: status === "all" ? undefined : status,
    page,
  });

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Library</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data
              ? `${data.pagination.totalItems} items`
              : "Your tracked media"}
          </p>
        </div>
      </div>

      <LibraryFilters
        value={status}
        onChange={(s) => {
          setStatus(s);
          setPage(1);
        }}
      />

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-3 rounded-xl border">
              <Skeleton className="h-24 w-16 rounded-lg flex-shrink-0" />
              <div className="flex flex-col gap-2 flex-1 py-1">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && data?.data.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <BookOpenIcon className="size-10 text-muted-foreground" />
          <p className="text-muted-foreground">Nothing here yet</p>
          <Button asChild variant="outline" size="sm">
            <Link to={ROUTES.EXPLORE_MOVIES}>Browse and add media</Link>
          </Button>
        </div>
      )}

      {!isLoading && data && data.data.length > 0 && (
        <>
          <div className="flex flex-col gap-3">
            {data.data.map((entry) => (
              <LibraryCard key={entry.id} entry={entry} />
            ))}
          </div>

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
              {data.pagination.page} / {data.pagination.totalPages}
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
