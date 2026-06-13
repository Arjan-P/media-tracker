import { useState, useEffect } from "react";
import { Tv, Film, Gamepad2, BookOpen, Ticket, BookMarked } from "lucide-react";
import type {
  LibraryEntry,
  MediaStatus,
  Progress,
} from "@media-tracker/shared";
import { cn } from "@/lib/utils";
import { useUpdateMedia, useRemoveFromLibrary } from "../hooks/useLibrary";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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

const STATUSES: { value: MediaStatus; label: string }[] = [
  { value: "planned", label: "Planned" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "dropped", label: "Dropped" },
];

function pct(cur: number, tot: number | null) {
  if (!tot) return null;
  return Math.min(100, Math.round((cur / tot) * 100));
}

interface ProgressFields {
  cur: number;
  tot: number | null;
  cur2?: number | null;
  tot2?: number | null;
}

function entryToProgressFields(entry: LibraryEntry): ProgressFields | null {
  const p = entry.progress;
  if (!p) return null;
  switch (p.type) {
    case "book":
      return { cur: p.progress.currentPage, tot: p.progress.totalPages };
    case "anime":
      return { cur: p.progress.currentEpisode, tot: p.progress.totalEpisodes };
    case "tv":
      return {
        cur: p.progress.currentEpisode,
        tot: p.progress.totalEpisodes,
        cur2: p.progress.currentSeason,
        tot2: p.progress.totalSeasons,
      };
    case "game":
      return {
        cur: p.progress.hoursPlayed,
        tot: null,
        cur2: p.progress.completionPct,
        tot2: 100,
      };
    case "manga":
      return { cur: p.progress.currentChapter, tot: p.progress.totalChapters };
    default:
      return null;
  }
}

function fieldsToProgress(
  type: LibraryEntry["mediaItem"]["type"],
  f: ProgressFields,
): Progress | null {
  switch (type) {
    case "movie":
      return { type: "movie", progress: null };
    case "book":
      return {
        type: "book",
        progress: {
          currentPage: f.cur,
          totalPages: f.tot ?? 1,
          percentage: pct(f.cur, f.tot) ?? 0,
        },
      };
    case "anime":
      return {
        type: "anime",
        progress: { currentEpisode: f.cur, totalEpisodes: f.tot },
      };
    case "tv":
      return {
        type: "tv",
        progress: {
          currentEpisode: f.cur,
          totalEpisodes: f.tot,
          currentSeason: f.cur2 ?? 1,
          totalSeasons: f.tot2 ?? null,
        },
      };
    case "game":
      return {
        type: "game",
        progress: { hoursPlayed: f.cur, completionPct: f.cur2 ?? null },
      };
    case "manga":
      return {
        type: "manga",
        progress: {
          currentChapter: f.cur,
          totalChapters: f.tot,
          currentVolume: null,
          totalVolumes: null,
        },
      };
    default:
      return null;
  }
}

function progressLabel(type: string): [string, string, string?, string?] {
  switch (type) {
    case "book":
      return ["Current page", "Total pages"];
    case "anime":
      return ["Episode", "Total episodes"];
    case "tv":
      return ["Episode", "Total episodes", "Season", "Total seasons"];
    case "game":
      return ["Hours played", "", "Completion %", "/ 100"];
    case "manga":
      return ["Chapter", "Total chapters"];
    default:
      return ["Progress", "Total"];
  }
}

interface Props {
  entry: LibraryEntry;
  /** Optional — the morphing dialog provides its own close affordance, so this is unused there. */
  onClose?: () => void;
}

export function LibraryDetailPanel({ entry, onClose }: Props) {
  const { mediaItem } = entry;
  const Icon = TYPE_ICONS[mediaItem.type] ?? Film;

  const update = useUpdateMedia(entry.id);
  const remove = useRemoveFromLibrary();

  const [status, setStatus] = useState<MediaStatus>(entry.status);
  const [rating, setRating] = useState(entry.rating ?? 0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState(entry.review ?? "");
  const [pFields, setPFields] = useState<ProgressFields | null>(
    entryToProgressFields(entry),
  );
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setStatus(entry.status);
    setRating(entry.rating ?? 0);
    setReview(entry.review ?? "");
    setPFields(entryToProgressFields(entry));
    setDirty(false);
  }, [entry.id]);

  function mark() {
    setDirty(true);
  }

  const barPct = pFields
    ? (pct(pFields.cur, pFields.tot) ??
      (pFields.cur2 != null ? Math.round(pFields.cur2) : null))
    : null;

  function handleSave() {
    const progress = pFields
      ? fieldsToProgress(mediaItem.type, pFields)
      : undefined;
    update.mutate(
      {
        status,
        rating: rating || undefined,
        review: review || undefined,
        progress: progress ?? undefined,
      },
      { onSuccess: () => setDirty(false) },
    );
  }

  function handleRemove() {
    remove.mutate(entry.id, { onSuccess: onClose });
  }

  const [priLabel, totLabel, sec1Label, sec2Label] = progressLabel(
    mediaItem.type,
  );

  return (
    <div className="flex flex-col w-full bg-background overflow-y-auto max-h-[85vh]">
      {/* Cover */}
      <div
        className={cn(
          "relative w-full aspect-[16/7] flex items-center justify-center shrink-0",
          TYPE_BG[mediaItem.type] ?? "bg-muted",
        )}
      >
        {mediaItem.coverUrl ? (
          <img
            src={mediaItem.coverUrl}
            alt={mediaItem.name}
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
            {mediaItem.name}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 capitalize">
            {mediaItem.type} · {mediaItem.provider}
            {mediaItem.releaseDate
              ? ` · ${mediaItem.releaseDate.slice(0, 4)}`
              : ""}
          </p>
        </div>

        <Separator />

        {/* Status */}
        <div className="space-y-2">
          <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Status
          </Label>
          <ToggleGroup
            type="single"
            value={status}
            onValueChange={(v) => {
              if (v) {
                setStatus(v as MediaStatus);
                mark();
              }
            }}
            className="justify-start flex-wrap gap-1.5"
          >
            {STATUSES.map((s) => (
              <ToggleGroupItem
                key={s.value}
                value={s.value}
                className="text-xs px-3 h-7 rounded-full border data-[state=on]:bg-foreground data-[state=on]:text-background"
              >
                {s.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Rating
          </Label>
          <div
            className="flex items-center gap-0.5"
            onMouseLeave={() => setHover(0)}
          >
            {Array.from({ length: 10 }, (_, i) => (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setHover(i + 1)}
                onClick={() => {
                  setRating(i + 1);
                  mark();
                }}
                className={cn(
                  "text-lg leading-none transition-colors",
                  (hover || rating) > i
                    ? "text-amber-400"
                    : "text-muted-foreground/30",
                )}
                aria-label={`Rate ${i + 1}`}
              >
                ★
              </button>
            ))}
            {rating > 0 && (
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  setRating(0);
                  mark();
                }}
                className="ml-1.5 h-auto p-0 text-[11px] text-muted-foreground"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Progress — only for non-movie types */}
        {mediaItem.type !== "movie" && (
          <div className="space-y-2">
            <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Progress
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">
                  {priLabel}
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={pFields?.cur ?? ""}
                  onChange={(e) => {
                    setPFields((f) => ({
                      ...(f ?? { cur: 0, tot: null }),
                      cur: Number(e.target.value),
                    }));
                    mark();
                  }}
                  className="h-9"
                />
              </div>
              {totLabel && (
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">
                    {totLabel}
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={pFields?.tot ?? ""}
                    onChange={(e) => {
                      setPFields((f) => ({
                        ...(f ?? { cur: 0, tot: null }),
                        tot: Number(e.target.value) || null,
                      }));
                      mark();
                    }}
                    className="h-9"
                  />
                </div>
              )}
              {sec1Label && (
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">
                    {sec1Label}
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={pFields?.cur2 ?? ""}
                    onChange={(e) => {
                      setPFields((f) => ({
                        ...(f ?? { cur: 0, tot: null }),
                        cur2: Number(e.target.value) || null,
                      }));
                      mark();
                    }}
                    className="h-9"
                  />
                </div>
              )}
              {sec2Label && sec2Label !== "/ 100" && (
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">
                    {sec2Label}
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={pFields?.tot2 ?? ""}
                    onChange={(e) => {
                      setPFields((f) => ({
                        ...(f ?? { cur: 0, tot: null }),
                        tot2: Number(e.target.value) || null,
                      }));
                      mark();
                    }}
                    className="h-9"
                  />
                </div>
              )}
            </div>
            {barPct != null && (
              <div className="pt-1">
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary/70 rounded-full transition-all duration-300"
                    style={{ width: `${barPct}%` }}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground text-right mt-1">
                  {barPct}%
                </p>
              </div>
            )}
          </div>
        )}

        {/* Review */}
        <div className="space-y-2">
          <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Review
          </Label>
          <Textarea
            rows={3}
            placeholder="Write your thoughts…"
            value={review}
            onChange={(e) => {
              setReview(e.target.value);
              mark();
            }}
            className="resize-none"
          />
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleSave}
            disabled={!dirty || update.isPending}
            className="w-full"
          >
            {update.isPending ? "Saving…" : "Save changes"}
          </Button>
          <Button
            onClick={handleRemove}
            disabled={remove.isPending}
            variant="outline"
            className="w-full text-destructive border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
          >
            {remove.isPending ? "Removing…" : "Remove from library"}
          </Button>
        </div>
      </div>
    </div>
  );
}
