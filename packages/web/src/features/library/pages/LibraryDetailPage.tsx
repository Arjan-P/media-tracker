import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLibraryItem } from "../hooks/useLibrary";
import { LibraryDetailPanel } from "../components/LibraryDetailPanel";
import { ROUTES } from "@/app/router/routes";

export function LibraryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: entry, isLoading, isError } = useLibraryItem(id!);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading…</div>
        </div>
      </div>
    );
  }

  if (isError || !entry) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <p className="text-sm text-muted-foreground">Item not found.</p>
        <button
          onClick={() => navigate(ROUTES.LIBRARY)}
          className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
        >
          Back to library
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Back nav for narrow viewports where panel fills the screen */}
      <div className="md:hidden flex items-center gap-2 px-4 py-3 border-b border-border shrink-0">
        <button
          onClick={() => navigate(ROUTES.LIBRARY)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Library
        </button>
      </div>

      <LibraryDetailPanel
        entry={entry}
        onClose={() => navigate(ROUTES.LIBRARY)}
      />
    </div>
  );
}
