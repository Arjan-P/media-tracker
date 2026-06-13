import { Tv, Film, Gamepad2, BookOpen, Ticket, BookMarked } from "lucide-react";
import type { MediaItem } from "@media-tracker/shared";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const TYPE_ICONS = {
  movie: Film,
  tv: Tv,
  game: Gamepad2,
  book: BookOpen,
  anime: Ticket,
  manga: BookMarked,
};
const TYPE_BG: Record<string, string> = {
  movie: "bg-blue-950",
  tv: "bg-teal-950",
  game: "bg-violet-950",
  book: "bg-amber-950",
  anime: "bg-pink-950",
  manga: "bg-green-950",
};

const PROVIDER_LABELS: Record<string, string> = {
  tmdb: "TMDB",
  igdb: "IGDB",
  openlibrary: "Open Library",
  jikan: "Jikan",
};

interface Props {
  item: MediaItem;
  inLibrary?: boolean;
  isPending?: boolean;
  onAdd: () => void;
}

export function ExploreDetailPanel({
  item,
  inLibrary,
  isPending,
  onAdd,
}: Props) {
  const Icon = TYPE_ICONS[item.type] ?? Film;

  return (
    <div className="flex flex-col w-full bg-background overflow-y-auto max-h-[90vh]">
      {/* Cover */}
      <div
        className={cn(
          "relative w-full aspect-[16/7] flex items-center justify-center shrink-0",
          TYPE_BG[item.type] ?? "bg-muted",
        )}
      >
        {item.coverUrl ? (
          <img
            src={item.coverUrl}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <Icon className="w-12 h-12 text-white/30" />
        )}
      </div>

      <div className="flex flex-col gap-5 p-5">
        {/* Title */}
        <div>
          <h2 className="text-base font-medium text-foreground leading-snug">
            {item.name}
          </h2>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge
              variant="secondary"
              className="text-[10px] capitalize px-2 py-0.5 rounded-full"
            >
              {item.type}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {PROVIDER_LABELS[item.provider] ?? item.provider}
              {item.releaseDate ? ` · ${item.releaseDate.slice(0, 4)}` : ""}
            </span>
          </div>
        </div>

        <Separator />

        {/* Description */}
        <div className="space-y-2">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            About
          </p>
          {item.description ? (
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No description available.
            </p>
          )}
        </div>

        <Separator />

        {/* Action */}
        <Button
          onClick={onAdd}
          disabled={inLibrary || isPending}
          variant={inLibrary ? "secondary" : "default"}
          className="w-full"
        >
          {isPending ? "Adding…" : inLibrary ? "In library" : "Add to library"}
        </Button>
      </div>
    </div>
  );
}
