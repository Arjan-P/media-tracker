import type { MediaItem } from "@media-tracker/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookmarkSimpleIcon, SignInIcon } from "@phosphor-icons/react";
import { useAuthStore } from "@/features/auth";
import { cn } from "@/lib/utils";

interface Props {
  item: MediaItem;
  onAdd: (item: MediaItem) => void;
  isAdding: boolean;
}

export function MediaCard({ item, onAdd, isAdding }: Props) {
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);

  return (
    <div className="group flex gap-4 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/40">
      {/* Cover */}
      <div className="relative flex-shrink-0">
        {item.coverUrl ? (
          <img
            src={item.coverUrl}
            alt={item.name}
            className="h-28 w-20 rounded-lg object-cover"
          />
        ) : (
          <div className="h-28 w-20 rounded-lg bg-muted flex items-center justify-center">
            <BookmarkSimpleIcon className="size-6 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 min-w-0 py-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold leading-tight line-clamp-2">
            {item.name}
          </p>
          {item.releaseDate && (
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {item.releaseDate.slice(0, 4)}
            </span>
          )}
        </div>

        <Badge variant="secondary" className="w-fit capitalize text-xs">
          {item.provider}
        </Badge>

        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mt-1">
            {item.description}
          </p>
        )}

        <div className="mt-auto pt-2">
          <Button
            size="sm"
            variant={isAuthenticated ? "outline" : "ghost"}
            className="h-8 text-xs"
            onClick={() => onAdd(item)}
            disabled={isAdding}
          >
            {isAuthenticated ? (
              <>
                <BookmarkSimpleIcon className="mr-1 size-3.5" /> Add to Library
              </>
            ) : (
              <>
                <SignInIcon className="mr-1 size-3.5" /> Sign in to track
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
