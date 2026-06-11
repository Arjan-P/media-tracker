import type { MediaStatus } from "@media-tracker/shared";
import { cn } from "@/lib/utils";

const STATUSES: { value: MediaStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "planned", label: "Planned" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "dropped", label: "Dropped" },
];

interface Props {
  value: MediaStatus | "all";
  onChange: (status: MediaStatus | "all") => void;
}

export function LibraryFilters({ value, onChange }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {STATUSES.map((s) => (
        <button
          key={s.value}
          onClick={() => onChange(s.value)}
          className={cn(
            "px-3 py-1 rounded-full text-sm border transition-colors",
            value === s.value
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border hover:border-primary/60 text-muted-foreground",
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
