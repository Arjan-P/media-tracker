import type { LibraryEntry } from "@media-tracker/shared";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { StarIcon, BookmarkSimpleIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/app/router/routes";

const STATUS_STYLES: Record<string, string> = {
  planned: "bg-muted text-muted-foreground",
  in_progress: "bg-blue-500/10 text-blue-500",
  completed: "bg-green-500/10 text-green-600",
  dropped: "bg-destructive/10 text-destructive",
};

const STATUS_LABELS: Record<string, string> = {
  planned: "Planned",
  in_progress: "In Progress",
  completed: "Completed",
  dropped: "Dropped",
};

interface Props {
  entry: LibraryEntry;
}

export function LibraryCard({ entry }: Props) {
  const { mediaItem: item } = entry;

  return (
    <Link
      to={ROUTES.LIBRARY_ITEM.replace(":id", entry.id)}
      className="group flex gap-4 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/40"
    >
      {/* Cover */}
      {item.coverUrl ? (
        <img
          src={item.coverUrl}
          alt={item.name}
          className="h-24 w-16 flex-shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div className="h-24 w-16 flex-shrink-0 rounded-lg bg-muted flex items-center justify-center">
          <BookmarkSimpleIcon className="size-5 text-muted-foreground" />
        </div>
      )}

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1.5 min-w-0 py-0.5">
        <p className="font-semibold leading-tight line-clamp-1 group-hover:text-primary transition-colors">
          {item.name}
        </p>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-full font-medium",
              STATUS_STYLES[entry.status],
            )}
          >
            {STATUS_LABELS[entry.status]}
          </span>
          <span className="text-xs text-muted-foreground capitalize">
            {item.type}
          </span>
        </div>

        {entry.rating && (
          <div className="flex items-center gap-1">
            <StarIcon weight="fill" className="size-3.5 text-yellow-500" />
            <span className="text-sm font-medium">{entry.rating}</span>
            <span className="text-xs text-muted-foreground">/10</span>
          </div>
        )}

        {entry.review && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-auto">
            {entry.review}
          </p>
        )}
      </div>
    </Link>
  );
}
