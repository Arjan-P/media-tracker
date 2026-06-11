import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search…",
  className,
}: SearchBarProps) {
  return (
    <div className={cn("relative flex items-center", className)}>
      <Search className="absolute left-3 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
