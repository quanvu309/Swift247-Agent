import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  /** Kept for callers; shown as a quiet line under the title when there is no description. */
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  backTo?: string;
  backLabel?: string;
  meta?: React.ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions, backTo, backLabel = 'Back', meta }: PageHeaderProps) {
  return (
    <header className="space-y-3">
      {backTo ?
      <Link
        to={backTo}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">

          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {backLabel}
        </Link> :
      null}

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-[28px]">{title}</h1>
            {meta}
          </div>
          {description ?
          <p className="max-w-2xl text-[15px] leading-6 text-muted-foreground">{description}</p> :
          eyebrow ?
          <p className="text-[15px] text-muted-foreground">{eyebrow}</p> :
          null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>);

}
