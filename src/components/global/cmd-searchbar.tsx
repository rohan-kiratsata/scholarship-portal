"use client";

import { useCommandPalette } from "@/store/cmd-store";
import { Command, Search } from "lucide-react";

export default function HeaderSearchBar() {
  const { setIsOpen } = useCommandPalette();

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="flex gap-2 rounded-full items-center px-2 border border-neutral-100 bg-primary/5"
    >
      <span className="text-sm text-muted-foreground">Search...</span>
      <kbd className="inline-flex items-center gap-1">
        <Command className="h-3 w-3" /> <span className="text-sm">K</span>
      </kbd>
    </button>
  );
}
