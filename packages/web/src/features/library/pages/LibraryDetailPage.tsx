import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { MediaStatus } from "@media-tracker/shared";
import {
  useLibraryItem,
  useUpdateStatus,
  useUpdateRating,
  useUpdateReview,
  useRemoveFromLibrary,
} from "../hooks/useLibrary";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StarIcon, TrashIcon, BookmarkSimpleIcon } from "@phosphor-icons/react";
import { ROUTES } from "@/app/router/routes";
import { cn } from "@/lib/utils";

const STATUSES: { value: MediaStatus; label: string }[] = [
  { value: "planned", label: "Planned" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "dropped", label: "Dropped" },
];

export function LibraryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: entry, isLoading } = useLibraryItem(id!);
  const updateStatus = useUpdateStatus(id!);
  const updateRating = useUpdateRating(id!);
  const updateReview = useUpdateReview(id!);
  const remove = useRemoveFromLibrary();

  const [reviewDraft, setReviewDraft] = useState("");
  const [editingReview, setEditingReview] = useState(false);

  if (isLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto flex flex-col gap-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (!entry) return null;

  const { mediaItem: item } = entry;

  function handleRemove() {
    remove.mutate(id!, {
      onSuccess: () => navigate(ROUTES.LIBRARY, { replace: true }),
    });
  }

  function handleSaveReview() {
    updateReview.mutate(reviewDraft, {
      onSuccess: () => setEditingReview(false),
    });
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto">
      {/* Hero */}
      <div className="flex gap-6">
        {item.coverUrl ? (
          <img
            src={item.coverUrl}
            alt={item.name}
            className="h-40 w-28 rounded-xl object-cover flex-shrink-0 shadow-md"
          />
        ) : (
          <div className="h-40 w-28 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
            <BookmarkSimpleIcon className="size-8 text-muted-foreground" />
          </div>
        )}

        <div className="flex flex-col gap-2 min-w-0 py-1">
          <h1 className="text-2xl font-bold leading-tight">{item.name}</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="capitalize">
              {item.type}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {item.provider}
            </Badge>
            {item.releaseDate && (
              <span className="text-sm text-muted-foreground">
                {item.releaseDate.slice(0, 4)}
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-sm text-muted-foreground line-clamp-4 mt-1">
              {item.description}
            </p>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Status</p>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              disabled={updateStatus.isPending}
              onClick={() => updateStatus.mutate(s.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm border transition-colors",
                entry.status === s.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:border-primary/60",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Rating</p>
        <div className="flex gap-1">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => updateRating.mutate(n)}
              disabled={updateRating.isPending}
              className="group p-0.5"
            >
              <StarIcon
                weight={entry.rating && n <= entry.rating ? "fill" : "regular"}
                className={cn(
                  "size-6 transition-colors",
                  entry.rating && n <= entry.rating
                    ? "text-yellow-500"
                    : "text-muted-foreground group-hover:text-yellow-400",
                )}
              />
            </button>
          ))}
          {entry.rating && (
            <span className="ml-2 text-sm text-muted-foreground self-center">
              {entry.rating}/10
            </span>
          )}
        </div>
      </div>

      {/* Review */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Review</p>
          {!editingReview && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setReviewDraft(entry.review ?? "");
                setEditingReview(true);
              }}
            >
              {entry.review ? "Edit" : "Write a review"}
            </Button>
          )}
        </div>

        {editingReview ? (
          <div className="flex flex-col gap-2">
            <Textarea
              value={reviewDraft}
              onChange={(e) => setReviewDraft(e.target.value)}
              placeholder="Write your thoughts..."
              className="min-h-24 resize-none"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSaveReview}
                disabled={updateReview.isPending}
              >
                {updateReview.isPending ? "Saving..." : "Save"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditingReview(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : entry.review ? (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {entry.review}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">No review yet</p>
        )}
      </div>

      {/* Remove */}
      <div className="pt-4 border-t border-border">
        <Button
          variant="destructive"
          size="sm"
          onClick={handleRemove}
          disabled={remove.isPending}
        >
          <TrashIcon className="mr-2 size-4" />
          {remove.isPending ? "Removing..." : "Remove from Library"}
        </Button>
      </div>
    </div>
  );
}
