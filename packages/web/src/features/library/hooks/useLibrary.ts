import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listLibrary,
  getLibraryItem,
  updateStatus,
  updateRating,
  updateReview,
  removeFromLibrary,
} from "../api/library.api";
import { MediaStatus } from "@media-tracker/shared";

export const libraryKeys = {
  all: ["library"] as const,
  list: (params: object) => ["library", "list", params] as const,
  details: (id: string) => ["library", "details", id] as const,
};

export function useLibraryList(params: {
  status?: MediaStatus;
  page?: number;
}) {
  return useQuery({
    queryKey: libraryKeys.list(params),
    queryFn: () => listLibrary(params),
  });
}

export function useLibraryItem(id: string) {
  return useQuery({
    queryKey: libraryKeys.details(id),
    queryFn: () => getLibraryItem(id),
  });
}

export function useUpdateStatus(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (status: MediaStatus) => updateStatus(id, status),
    onSuccess: (updated) => {
      qc.setQueryData(libraryKeys.details(id), updated);
      qc.invalidateQueries({ queryKey: libraryKeys.all });
    },
  });
}

export function useUpdateRating(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (rating: number) => updateRating(id, rating),
    onSuccess: (updated) => {
      qc.setQueryData(libraryKeys.details(id), updated);
    },
  });
}

export function useUpdateReview(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (review: string) => updateReview(id, review),
    onSuccess: (updated) => {
      qc.setQueryData(libraryKeys.details(id), updated);
    },
  });
}

export function useRemoveFromLibrary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: removeFromLibrary,
    onSuccess: () => qc.invalidateQueries({ queryKey: libraryKeys.all }),
  });
}
