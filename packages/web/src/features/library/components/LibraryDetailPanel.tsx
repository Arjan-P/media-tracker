import { useState, useEffect } from "react";
import {
  X,
  Trash2,
  BookOpen,
  Tv,
  Film,
  Gamepad2,
  Ticket,
  BookMarked,
} from "lucide-react";
import type {
  LibraryEntry,
  MediaStatus,
  Progress,
} from "@media-tracker/shared";
import { cn } from "@/lib/utils";
import { useUpdateMedia, useRemoveFromLibrary } from "../hooks/useLibrary";

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
  onClose: () => void;
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
    <aside className="flex flex-col w-72 border-l border-border bg-background overflow-y-auto shrink-0">
      {/* Cover */}
      <div
        className={cn(
          "relative w-full aspect-video flex items-center justify-center shrink-0",
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
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-md bg-black/40 text-white hover:bg-black/60 transition-colors"
          aria-label="Close detail panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col gap-5 p-4">
        {/* Title */}
        <div>
          <h2 className="text-sm font-medium text-foreground leading-snug">
            {mediaItem.name}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 capitalize">
            {mediaItem.type} · {mediaItem.provider}
            {mediaItem.releaseDate
              ? ` · ${mediaItem.releaseDate.slice(0, 4)}`
              : ""}
          </p>
        </div>

        {/* Status */}
        <div>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Status
          </p>
          <div className="flex flex-wrap gap-1.5">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                onClick={() => {
                  setStatus(s.value);
                  mark();
                }}
                className={cn(
                  "text-xs px-2.5 py-1 rounded-full border transition-colors",
                  status === s.value
                    ? "bg-foreground text-background border-transparent"
                    : "border-border text-muted-foreground hover:border-foreground/40",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Rating
          </p>
          <div className="flex gap-0.5" onMouseLeave={() => setHover(0)}>
            {Array.from({ length: 10 }, (_, i) => (
              <button
                key={i}
                onMouseEnter={() => setHover(i + 1)}
                onClick={() => {
                  setRating(i + 1);
                  mark();
                }}
                className={cn(
                  "text-base leading-none transition-colors",
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
              <button
                onClick={() => {
                  setRating(0);
                  mark();
                }}
                className="ml-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Progress — only for non-movie types */}
        {mediaItem.type !== "movie" && (
          <div>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Progress
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">
                  {priLabel}
                </label>
                <input
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
                  className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              {totLabel && (
                <div>
                  <label className="text-[11px] text-muted-foreground block mb-1">
                    {totLabel}
                  </label>
                  <input
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
                    className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              )}
              {sec1Label && (
                <div>
                  <label className="text-[11px] text-muted-foreground block mb-1">
                    {sec1Label}
                  </label>
                  <input
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
                    className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              )}
              {sec2Label && sec2Label !== "/ 100" && (
                <div>
                  <label className="text-[11px] text-muted-foreground block mb-1">
                    {sec2Label}
                  </label>
                  <input
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
                    className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              )}
            </div>
            {barPct != null && (
              <div className="mt-2">
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
        <div>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Review
          </p>
          <textarea
            rows={3}
            placeholder="Write your thoughts…"
            value={review}
            onChange={(e) => {
              setReview(e.target.value);
              mark();
            }}
            className="w-full text-sm px-2.5 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 pb-2">
          <button
            onClick={handleSave}
            disabled={!dirty || update.isPending}
            className={cn(
              "w-full py-2 rounded-lg text-sm font-medium transition-colors",
              dirty
                ? "bg-foreground text-background hover:bg-foreground/90"
                : "bg-muted text-muted-foreground cursor-default",
            )}
          >
            {update.isPending ? "Saving…" : "Save changes"}
          </button>
          <button
            onClick={handleRemove}
            disabled={remove.isPending}
            className="w-full py-2 rounded-lg text-sm border border-destructive/40 text-destructive hover:bg-destructive/5 transition-colors"
          >
            {remove.isPending ? "Removing…" : "Remove from library"}
          </button>
        </div>
      </div>
    </aside>
  );
}
