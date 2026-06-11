import { type LibraryEntry, type MediaItem } from "@media-tracker/shared";
import { cn } from "@/lib/utils";
import { BookOpen, Tv, Film, Gamepad2, Ticket, BookMarked } from "lucide-react";

const TYPE_ICONS = {
  movie: Film,
  tv: Tv,
  game: Gamepad2,
  book: BookOpen,
  anime: Ticket,
  manga: BookMarked,
} as const;

const TYPE_COLORS: Record<string, string> = {
  movie: "bg-blue-950",
  tv: "bg-teal-950",
  game: "bg-violet-950",
  book: "bg-amber-950",
  anime: "bg-pink-950",
  manga: "bg-green-950",
};

const STATUS_STYLES = {
  planned: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  in_progress:
    "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  dropped: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
} as const;

const STATUS_LABELS = {
  planned: "Planned",
  in_progress: "In progress",
  completed: "Completed",
  dropped: "Dropped",
} as const;

function progressPercent(entry: LibraryEntry): number | null {
  const p = entry.progress;
  if (!p) return null;
  switch (p.type) {
    case "book":
      return p.progress.percentage;
    case "anime":
      return p.progress.totalEpisodes
        ? Math.round(
            (p.progress.currentEpisode / p.progress.totalEpisodes) * 100,
          )
        : null;
    case "tv":
      return p.progress.totalEpisodes
        ? Math.round(
            (p.progress.currentEpisode / p.progress.totalEpisodes) * 100,
          )
        : null;
    case "manga":
      return p.progress.totalChapters
        ? Math.round(
            (p.progress.currentChapter / p.progress.totalChapters) * 100,
          )
        : null;
    case "game":
      return p.progress.completionPct ?? null;
    default:
      return null;
  }
}

interface LibraryCardProps {
  entry: LibraryEntry;
  selected?: boolean;
  onClick: () => void;
}

export function LibraryCard({ entry, selected, onClick }: LibraryCardProps) {
  const { mediaItem, status, rating } = entry;
  const Icon = TYPE_ICONS[mediaItem.type] ?? Film;
  const pct = progressPercent(entry);

  return (
    <button
      onClick={onClick}
      className={cn(
        "group text-left w-full rounded-xl border overflow-hidden transition-all duration-150",
        "bg-card hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected ? "border-primary ring-1 ring-primary" : "border-border",
      )}
    >
      <div
        className={cn(
          "relative w-full aspect-[2/3] flex items-center justify-center overflow-hidden",
          TYPE_COLORS[mediaItem.type] ?? "bg-muted",
        )}
      >
        {mediaItem.coverUrl ? (
          <img
            src={mediaItem.coverUrl}
            alt={mediaItem.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <Icon className="w-10 h-10 text-white/30" />
        )}

        <span
          className={cn(
            "absolute top-2 left-2 text-[10px] font-medium px-2 py-0.5 rounded-full",
            STATUS_STYLES[status],
          )}
        >
          {STATUS_LABELS[status]}
        </span>

        {rating != null && (
          <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
            ★ {rating}
          </span>
        )}
      </div>

      <div className="px-2.5 pt-2 pb-2.5">
        <p className="text-xs font-medium text-foreground leading-tight truncate">
          {mediaItem.name}
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5 capitalize">
          {mediaItem.type}
          {mediaItem.releaseDate
            ? ` · ${mediaItem.releaseDate.slice(0, 4)}`
            : ""}
        </p>
        {pct != null && (
          <div className="mt-1.5 h-0.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary/70 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>
    </button>
  );
}

interface ExploreCardProps {
  item: MediaItem;
  inLibrary?: boolean;
  isPending?: boolean;
  onAdd: () => void;
}

export function ExploreCard({
  item,
  inLibrary,
  isPending,
  onAdd,
}: ExploreCardProps) {
  const Icon = TYPE_ICONS[item.type] ?? Film;

  return (
    <div className="group rounded-xl border border-border bg-card overflow-hidden flex flex-col">
      <div
        className={cn(
          "relative w-full aspect-[2/3] flex items-center justify-center overflow-hidden",
          TYPE_COLORS[item.type] ?? "bg-muted",
        )}
      >
        {item.coverUrl ? (
          <img
            src={item.coverUrl}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <Icon className="w-10 h-10 text-white/30" />
        )}
      </div>
      <div className="px-2.5 pt-2 pb-2.5 flex flex-col flex-1">
        <p className="text-xs font-medium text-foreground leading-tight line-clamp-2 flex-1">
          {item.name}
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5 capitalize mb-2">
          {item.releaseDate?.slice(0, 4) ?? "—"}
        </p>
        <button
          onClick={onAdd}
          disabled={inLibrary || isPending}
          className={cn(
            "w-full text-[11px] font-medium py-1.5 rounded-lg transition-colors",
            inLibrary
              ? "bg-muted text-muted-foreground cursor-default"
              : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]",
          )}
        >
          {isPending ? "Adding…" : inLibrary ? "In library" : "+ Add"}
        </button>
      </div>
    </div>
  );
}
