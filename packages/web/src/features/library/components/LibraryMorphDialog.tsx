import type { LibraryEntry } from "@media-tracker/shared";

import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
} from "@/components/motion-primitives/morphing-dialog";

import { LibraryCard } from "@/components/MediaCard";
import { LibraryDetailPanel } from "../components/LibraryDetailPanel";

interface Props {
  entry: LibraryEntry;
}

export function LibraryMorphDialog({ entry }: Props) {
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
        <LibraryCard entry={entry} />
      </MorphingDialogTrigger>

      <MorphingDialogContainer>
        <MorphingDialogContent
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background sm:max-w-lg"
          style={{ borderRadius: "16px" }}
        >
          <LibraryDetailPanel entry={entry} />
          <MorphingDialogClose className="absolute top-3 right-3 rounded-full bg-black/40 p-1.5 text-white hover:bg-black/60 transition-colors" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}
