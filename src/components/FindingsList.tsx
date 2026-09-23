import React from 'react';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { Finding } from '../types/cargo';
import { docLabels, severityRank } from '../utils/agent';
import { cn } from '../utils/cn';

function SeverityIcon({ severity }: {severity: Finding['severity'];}) {
  if (severity === 'critical') return <ShieldAlert className="h-4 w-4 text-destructive" aria-hidden="true" />;
  if (severity === 'warning') return <AlertTriangle className="h-4 w-4 text-chart-5" aria-hidden="true" />;
  return <Info className="h-4 w-4 text-muted-foreground" aria-hidden="true" />;
}

export function FindingsList({ findings }: {findings: Finding[];}) {
  if (!findings.length) {
    return (
      <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
        No issues. Everything matches.
      </p>);

  }

  const sorted = [...findings].sort((a, b) => severityRank(a.severity) - severityRank(b.severity));

  return (
    <ul className="space-y-3">
      {sorted.map((finding) =>
      <li
        key={finding.id}
        className={cn(
          'rounded-xl border p-4',
          finding.severity === 'critical' ? 'border-destructive/25 bg-destructive/[0.04]' : 'border-border bg-card'
        )}>
        
          <div className="flex items-start gap-3">
            <SeverityIcon severity={finding.severity} />
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-sm font-medium text-foreground">{finding.title}</p>
              <p className="text-sm text-muted-foreground">{finding.detail}</p>
              {finding.requiredDoc ?
            <p className="pt-1 text-xs font-medium text-foreground">
                  Needs: {docLabels[finding.requiredDoc].en}
                </p> :
            null}
              <p className="pt-0.5 font-mono text-[11px] text-muted-foreground">Rule {finding.ruleRef}</p>
            </div>
          </div>
        </li>
      )}
    </ul>);

}