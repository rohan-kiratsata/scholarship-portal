"use client";

import { useEffect, useState } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandDialog,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";

export function CommandPalette({ scholarships }: { scholarships: any[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const [AIResults, setAIResults] = useState<any[]>([]);
  const [AILoading, setAILoading] = useState(false);

  async function handleAiSearch(query: string) {
    try {
      setAILoading(true);
      const res = await fetch("/api/ai-scholarship-search", {
        method: "POST",
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setAIResults(data.matches || []);
    } catch (error) {
      console.error("AI search failed:", error);
    } finally {
      setAILoading(false);
    }
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command>
        <CommandInput
          placeholder="Ask anything like 'scholarships for SC students in Maharashtra'..."
          value={query}
          onValueChange={setQuery}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim() !== "") {
              handleAiSearch(query);
            }
          }}
        />
        <CommandList>
          <CommandEmpty>No scholarships found.</CommandEmpty>
          <CommandGroup heading="Scholarships">
            {AILoading ? (
              <p className="p-4 text-center text-sm text-muted-foreground">
                Searching AI...
              </p>
            ) : AIResults.length > 0 ? (
              AIResults.map((s) => (
                <CommandItem
                  key={s.id}
                  onSelect={() => {
                    alert(`Clicked: ${s.title}`);
                    setOpen(false);
                  }}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{s.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {s.department}
                    </span>
                  </div>
                </CommandItem>
              ))
            ) : (
              scholarships
                .filter((s) =>
                  s.title.toLowerCase().includes(query.toLowerCase())
                )
                .map((s) => (
                  <CommandItem
                    key={s.id}
                    onSelect={() => {
                      alert(`Clicked: ${s.title}`);
                      setOpen(false);
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{s.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {s.department}
                      </span>
                    </div>
                  </CommandItem>
                ))
            )}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
