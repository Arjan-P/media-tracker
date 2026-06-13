import { type LibraryEntry, type MediaItem } from "@media-tracker/shared";
import { cn } from "@/lib/utils";
import { BookOpen, Tv, Film, Gamepad2, Ticket, BookMarked } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MorphingDialogImage,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
} from "@/components/motion-primitives/morphing-dialog";

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

const STATUS_VARIANTS = {
  planned: "outline",
  in_progress: "secondary",
  completed: "default",
  dropped: "destructive",
} as const;

const STATUS_LABELS = {
  planned: "Planned",
  in_progress: "In progress",
  completed: "Completed",
  dropped: "Dropped",
} as const;

export function progressPercent(entry: LibraryEntry): number | null {
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
}

export function LibraryCard({ entry }: LibraryCardProps) {
  const { mediaItem, status, rating } = entry;
  const Icon = TYPE_ICONS[mediaItem.type] ?? Film;
  const pct = progressPercent(entry);

  return (
    <div
      className={cn(
        "group text-left w-full rounded-xl border border-border overflow-hidden cursor-pointer",
        "bg-card hover:border-foreground/30 transition-colors",
      )}
    >
      <div
        className={cn(
          "relative w-full aspect-[2/3] flex items-center justify-center overflow-hidden",
          TYPE_COLORS[mediaItem.type] ?? "bg-muted",
        )}
      >
        {mediaItem.coverUrl ? (
          <MorphingDialogImage
            src={mediaItem.coverUrl}
            alt={mediaItem.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <Icon className="w-10 h-10 text-white/30" />
        )}

        <Badge
          variant={STATUS_VARIANTS[status]}
          className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full"
        >
          {STATUS_LABELS[status]}
        </Badge>

        {rating != null && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
            ★ {rating}
          </span>
        )}
      </div>

      <div className="px-2.5 pt-2 pb-2.5">
        <MorphingDialogTitle className="text-xs font-medium text-foreground leading-tight truncate">
          {mediaItem.name}
        </MorphingDialogTitle>
        <MorphingDialogSubtitle className="text-[11px] text-muted-foreground mt-0.5 capitalize">
          {mediaItem.type}
          {mediaItem.releaseDate
            ? ` · ${mediaItem.releaseDate.slice(0, 4)}`
            : ""}
        </MorphingDialogSubtitle>
        {pct != null && (
          <div className="mt-1.5 h-0.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary/70 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>
    </div>
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
    <div className="group rounded-xl border border-border bg-card overflow-hidden flex flex-col cursor-pointer hover:border-foreground/30 transition-colors">
      <div
        className={cn(
          "relative w-full aspect-[2/3] flex items-center justify-center overflow-hidden",
          TYPE_COLORS[item.type] ?? "bg-muted",
        )}
      >
        {item.coverUrl ? (
          <MorphingDialogImage
            src={item.coverUrl}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <Icon className="w-10 h-10 text-white/30" />
        )}
      </div>
      <div className="px-2.5 pt-2 pb-2.5 flex flex-col flex-1">
        <MorphingDialogTitle className="text-xs font-medium text-foreground leading-tight line-clamp-2 flex-1">
          {item.name}
        </MorphingDialogTitle>
        <MorphingDialogSubtitle className="text-[11px] text-muted-foreground mt-0.5 capitalize mb-2">
          {item.releaseDate?.slice(0, 4) ?? "—"}
        </MorphingDialogSubtitle>
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          disabled={inLibrary || isPending}
          variant={inLibrary ? "secondary" : "default"}
          className="w-full text-[11px] h-7"
        >
          {isPending ? "Adding…" : inLibrary ? "In library" : "+ Add"}
        </Button>
      </div>
    </div>
  );
}
