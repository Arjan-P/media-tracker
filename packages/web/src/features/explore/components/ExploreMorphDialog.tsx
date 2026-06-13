import type { MediaItem } from "@media-tracker/shared";

import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
} from "@/components/motion-primitives/morphing-dialog";

import { ExploreCard } from "@/components/MediaCard";
import { ExploreDetailPanel } from "../components/ExploreDetailPanel";

interface Props {
  item: MediaItem;
  inLibrary?: boolean;
  isPending?: boolean;
  onAdd: () => void;
}

export function ExploreMorphDialog({
  item,
  inLibrary,
  isPending,
  onAdd,
}: Props) {
  return (
    <MorphingDialog
      transition={{
        type: "spring",
        bounce: 0.05,
        duration: 0.5,
      }}
    >
      <MorphingDialogTrigger
        className="block w-full rounded-xl"
        style={{ borderRadius: "12px" }}
      >
        <ExploreCard
          item={item}
          inLibrary={inLibrary}
          isPending={isPending}
          onAdd={onAdd}
        />
      </MorphingDialogTrigger>

      <MorphingDialogContainer>
        <MorphingDialogContent
          className="relative w-[95vw] max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-border bg-background"
          style={{ borderRadius: "16px" }}
        >
          <ExploreDetailPanel
            item={item}
            inLibrary={inLibrary}
            isPending={isPending}
            onAdd={onAdd}
          />
          <MorphingDialogClose className="absolute top-3 right-3 rounded-full bg-black/40 p-1.5 text-white hover:bg-black/60 transition-colors" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}
