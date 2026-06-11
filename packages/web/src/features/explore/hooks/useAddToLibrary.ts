import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMedia, libraryKeys } from "@/features/library";
import type { MediaItem } from "@media-tracker/shared";

export function useAddToLibrary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: MediaItem) => addMedia(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.all });
    },
  });
}
