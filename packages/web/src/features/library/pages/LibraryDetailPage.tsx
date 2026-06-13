import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLibraryItem } from "../hooks/useLibrary";
import { LibraryDetailPanel } from "../components/LibraryDetailPanel";
import { ROUTES } from "@/app/router/routes";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function LibraryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: entry, isLoading, isError } = useLibraryItem(id!);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex-1 p-5 space-y-4">
          <Skeleton className="aspect-[16/7] w-full rounded-xl" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
    );
  }

  if (isError || !entry) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <p className="text-sm text-muted-foreground">Item not found.</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(ROUTES.LIBRARY)}
        >
          Back to library
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.LIBRARY)}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Library
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <LibraryDetailPanel
          entry={entry}
          onClose={() => navigate(ROUTES.LIBRARY)}
        />
      </div>
    </div>
  );
}
