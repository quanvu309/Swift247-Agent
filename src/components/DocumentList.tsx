import { FileCheck2, FileClock, FileWarning, FileX2 } from 'lucide-react';
import { CargoDocument } from '../types/cargo';
import { docLabels } from '../utils/agent';
import { cn } from '../utils/cn';

const statusMeta: Record<CargoDocument['status'], {label: string;className: string;}> = {
  extracted: { label: 'Read', className: 'bg-chart-2/10 text-[#1E6B48]' },
  processing: { label: 'Reading', className: 'bg-muted text-muted-foreground' },
  missing: { label: 'Missing', className: 'bg-destructive/10 text-[#B42318]' },
  invalid: { label: 'Needs a fix', className: 'bg-destructive/10 text-[#B42318]' }
};

function DocIcon({ status }: {status: CargoDocument['status'];}) {
  if (status === 'extracted') return <FileCheck2 className="h-[18px] w-[18px] text-chart-2" aria-hidden="true" />;
  if (status === 'processing') return <FileClock className="h-[18px] w-[18px] text-muted-foreground" aria-hidden="true" />;
  if (status === 'invalid') return <FileWarning className="h-[18px] w-[18px] text-destructive" aria-hidden="true" />;
  return <FileX2 className="h-[18px] w-[18px] text-destructive" aria-hidden="true" />;
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
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{docLabels[doc.type].en}</p>
                {doc.fileName ? <p className="truncate text-xs text-muted-foreground">{doc.fileName}</p> : null}
              </div>
            </div>
            <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-xs font-medium', meta.className)}>{meta.label}</span>
          </li>);

      })}
    </ul>);

}
