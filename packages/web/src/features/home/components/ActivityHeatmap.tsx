import { useMemo } from "react";
import { format } from "date-fns";
import { useLibraryStats } from "@/features/library";
import { buildHeatmapData } from "../utils/heatmap";
import {
  HeatmapCells,
  HeatmapChart,
  HeatmapInteractionBoundary,
  HeatmapInteractionProvider,
  HeatmapLegend,
  HeatmapTooltip,
  HeatmapXAxis,
  HeatmapYAxis,
} from "@/components/charts/heatmap";

const LEVEL_STYLES = [
  { color: "var(--color-muted)", fillMode: "solid" },
  { color: "oklch(0.488 0.243 264.376 / 0.20)", fillMode: "solid" },
  { color: "oklch(0.488 0.243 264.376 / 0.45)", fillMode: "solid" },
  { color: "oklch(0.488 0.243 264.376 / 0.70)", fillMode: "solid" },
  { color: "oklch(0.488 0.243 264.376)", fillMode: "solid" },
] as const;

export function ActivityHeatmap() {
  const { data, isLoading } = useLibraryStats();

  const heatmapData = useMemo(
    () => buildHeatmapData(data?.heatmap ?? []),
    [data?.heatmap],
  );

  return (
    <HeatmapInteractionProvider>
      <HeatmapInteractionBoundary>
        <div className="flex flex-col gap-2 min-w-[700px]">
          <HeatmapChart
            className="w-full"
            data={heatmapData}
            layout="fluid"
            levelStyles={LEVEL_STYLES}
            sizingColumnCount={53}
            gap={1}
            status={isLoading ? "loading" : "ready"}
            loadingLabel="Loading activity…"
          >
            <HeatmapCells cornerRadius={3} />
            <HeatmapXAxis />
            <HeatmapYAxis />
            <HeatmapTooltip
              formatLabel={(count, date) => {
                const label = format(date, "MMM d, yyyy");
                if (count === 0) return `No activity · ${label}`;
                const word = count === 1 ? "action" : "actions";
                return `${count} ${word} · ${label}`;
              }}
            />
          </HeatmapChart>
          <HeatmapLegend levelStyles={LEVEL_STYLES} align="end" />
        </div>
      </HeatmapInteractionBoundary>
    </HeatmapInteractionProvider>
  );
}
