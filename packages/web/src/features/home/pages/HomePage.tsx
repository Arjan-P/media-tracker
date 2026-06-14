import { useMemo } from "react";
import { useLibraryStats } from "@/features/library";
import { useActivityFeed } from "@/features/activity";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow, format, parseISO } from "date-fns";
import {
  Star,
  MessageSquare,
  BarChart3,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityHeatmap } from "../components/ActivityHeatmap";

const STATUS_LABELS: Record<string, string> = {
  planned: "Planned",
  in_progress: "In Progress",
  completed: "Completed",
  dropped: "Dropped",
};

const STATUS_COLORS: Record<string, string> = {
  planned: "var(--chart-3)",
  in_progress: "var(--chart-1)",
  completed: "var(--chart-2)",
  dropped: "var(--chart-5)",
};

const ACTIVITY_ICONS: Record<string, typeof PlusCircle> = {
  added: PlusCircle,
  status_changed: BarChart3,
  rated: Star,
  reviewed: MessageSquare,
  progress_updated: BarChart3,
  removed: Trash2,
};

function activityLabel(entry: {
  type: string;
  data: Record<string, unknown>;
  media: { name: string | null } | null;
}) {
  const name = entry.media?.name ?? "an item";
  switch (entry.type) {
    case "added":
      return `Added ${name} to your library`;
    case "status_changed":
      return `Marked ${name} as ${STATUS_LABELS[entry.data.to as string] ?? entry.data.to}`;
    case "rated":
      return `Rated ${name} ${entry.data.rating}/10`;
    case "reviewed":
      return `Reviewed ${name}`;
    case "progress_updated":
      return `Updated progress for ${name}`;
    case "removed":
      return `Removed ${name} from your library`;
    default:
      return `Updated ${name}`;
  }
}

export function HomePage() {
  const { data: stats, isLoading: statsLoading } = useLibraryStats();
  const { data: activity, isLoading: activityLoading } = useActivityFeed({
    limit: 10,
  });

  const ringData = useMemo(() => {
    if (!stats) return [];
    return stats.statusCounts
      .filter((s) => s.count > 0)
      .map((s) => ({
        label: STATUS_LABELS[s.status],
        value: s.count,
        maxValue: stats.total,
        color: STATUS_COLORS[s.status],
      }));
  }, [stats]);

  const barData = useMemo(() => {
    if (!stats) return [];
    return stats.activityByDay.map((d) => ({
      day: format(parseISO(d.day), "EEE"),
      activity: d.count,
    }));
  }, [stats]);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 overflow-y-auto h-full">
      <div>
        <h1 className="text-lg font-medium text-foreground">Home</h1>
        <p className="text-sm text-muted-foreground mt-1">Library overview</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
        </CardHeader>

        <CardContent>
          <ActivityHeatmap />
        </CardContent>
      </Card>
      {/* Recent activity feed */}
      <div className="rounded-xl border border-border bg-card">
        <div className="px-5 py-4 border-b border-border">
          <p className="text-sm font-medium text-foreground">Recent activity</p>
        </div>
        <div className="divide-y divide-border">
          {activityLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}

          {!activityLoading && activity?.data.length === 0 && (
            <p className="text-sm text-muted-foreground px-5 py-8 text-center">
              No activity yet — add something from Explore to get started.
            </p>
          )}

          {activity?.data.map((entry) => {
            const Icon = ACTIVITY_ICONS[entry.type] ?? BarChart3;
            return (
              <div key={entry.id} className="flex items-center gap-3 px-5 py-3">
                <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Icon className="size-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">
                    {activityLabel(entry)}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {formatDistanceToNow(parseISO(entry.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                {entry.media?.coverUrl && (
                  <img
                    src={entry.media.coverUrl}
                    alt=""
                    className="size-10 rounded-md object-cover shrink-0"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
