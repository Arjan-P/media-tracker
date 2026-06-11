import { useQuery } from "@tanstack/react-query";
import { searchMedia, type SearchParams } from "../api/explore.api";

export const searchQueryKey = (params: SearchParams) =>
  ["explore", "search", params] as const;

export function useSearch(params: SearchParams, enabled: boolean) {
  return useQuery({
    queryKey: searchQueryKey(params),
    queryFn: () => searchMedia(params),
    enabled: enabled && params.query.length > 0,
    placeholderData: (
      prev: Awaited<ReturnType<typeof searchMedia>> | undefined,
    ) => prev,
  });
}
