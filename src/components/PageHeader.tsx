import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/Button';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  backTo?: string;
  backLabel?: string;
}

export function PageHeader({ eyebrow, title, description, actions, backTo, backLabel = 'Back' }: PageHeaderProps) {
  return (
    <header className="space-y-4 border-b border-border pb-5">
      {backTo ?
      <Button variant="ghost" size="sm" className="-ml-2 h-7 text-muted-foreground hover:text-foreground" asChild>
          <Link to={backTo}>
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            {backLabel}
          </Link>
        </Button> :
      null}

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-1">
          {eyebrow ?
          <p className="truncate text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
              {eyebrow}
            </p> :
          null}
          <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground md:text-2xl">{title}</h1>
          {description ? <p className="max-w-2xl text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2 md:pt-1">{actions}</div> : null}
      </div>
    </header>);

}