import React from 'react';
import { FileCheck2, FileClock, FileWarning, FileX2 } from 'lucide-react';
import { Badge } from './ui/Badge';
import { CargoDocument } from '../types/cargo';
import { docLabels } from '../utils/agent';

const statusMeta: Record<
  CargoDocument['status'],
  {label: string;tone: 'default' | 'secondary' | 'destructive' | 'outline';}> =
{
  extracted: { label: 'Read', tone: 'secondary' },
  processing: { label: 'Processing', tone: 'outline' },
  missing: { label: 'Missing', tone: 'destructive' },
  invalid: { label: 'Invalid', tone: 'destructive' }
};

function DocIcon({ status }: {status: CargoDocument['status'];}) {
  if (status === 'extracted') return <FileCheck2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />;
  if (status === 'processing') return <FileClock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />;
  if (status === 'invalid') return <FileWarning className="h-4 w-4 text-destructive" aria-hidden="true" />;
  return <FileX2 className="h-4 w-4 text-destructive" aria-hidden="true" />;
}

export function DocumentList({ docs }: {docs: CargoDocument[];}) {
  return (
    <ul className="divide-y divide-border">
      {docs.map((doc) => {
        const meta = statusMeta[doc.status];
        return (
          <li key={doc.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
            <div className="flex min-w-0 items-center gap-3">
              <DocIcon status={doc.status} />
              <p className="truncate text-sm text-foreground">{docLabels[doc.type].en}</p>
            </div>
            <Badge variant={meta.tone} className="shrink-0 text-[10px]">
              {meta.label}
            </Badge>
          </li>);

      })}
    </ul>);

}