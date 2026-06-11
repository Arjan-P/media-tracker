import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-64 gap-3 text-center px-6">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-56 leading-relaxed">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
