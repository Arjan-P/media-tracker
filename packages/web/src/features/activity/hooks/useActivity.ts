import { useQuery } from "@tanstack/react-query";
import { listActivity } from "../api/activity.api";

export const activityKeys = {
  list: (params: object) => ["activity", "list", params] as const,
};
export function useActivityFeed(
  params: { page?: number; limit?: number } = {},
) {
  return useQuery({
    queryKey: activityKeys.list(params),
    queryFn: () => listActivity(params),
  });
}
