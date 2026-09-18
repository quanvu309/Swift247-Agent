import React from 'react';
import { Loader2 } from 'lucide-react';
import { Skeleton } from './ui/Skeleton';

export function LoadingBlock({ label, rows = 3 }: {label: string;rows?: number;}) {
  return (
    <div className="space-y-3" role="status" aria-live="polite">
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        {label}
      </p>
      {Array.from({ length: rows }).map((_, i) =>
      <Skeleton key={i} className="h-9 w-full" />
      )}
    </div>);

}