export type HeatmapColumn = {
  bin: number;
  bins: {
    bin: number;
    count: number;
    date: Date;
  }[];
};

export function buildHeatmapData(
  data: { day: string; count: number }[],
): HeatmapColumn[] {
  if (!data.length) return [];

  const byWeek = new Map<number, HeatmapColumn>();

  data.forEach((item) => {
    const date = new Date(item.day);

    // Sunday = 0 ... Saturday = 6
    const dayOfWeek = date.getDay();

    const start = new Date(data[0].day);

    const weekIndex = Math.floor(
      (date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7),
    );

    if (!byWeek.has(weekIndex)) {
      byWeek.set(weekIndex, {
        bin: weekIndex,
        bins: [],
      });
    }

    byWeek.get(weekIndex)!.bins.push({
      bin: dayOfWeek,
      count: item.count,
      date,
    });
  });

  return [...byWeek.values()];
}
