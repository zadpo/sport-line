"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const debouncedSearch = useDebouncedCallback((value: string) => {
    onSearch(value);
  }, 300);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="pl-10"
        placeholder="Search teams, games, or contests..."
        onChange={(e) => debouncedSearch(e.target.value)}
      />
    </div>
  );
}
