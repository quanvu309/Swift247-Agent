import React from 'react';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { Badge } from './ui/Badge';
import { Finding } from '../types/cargo';
import { docLabels, severityRank } from '../utils/agent';
import { cn } from '../utils/cn';

const sourceLabels: Record<Finding['source'], string> = {
  ocr: 'OCR',
  service: 'Service rules',
  pricing: 'Pricing',
  restricted: 'Restricted items',
  kyc: 'KYC'
};

function SeverityIcon({ severity }: {severity: Finding['severity'];}) {
  if (severity === 'critical') return <ShieldAlert className="h-4 w-4 text-destructive" aria-hidden="true" />;
  if (severity === 'warning') return <AlertTriangle className="h-4 w-4 text-chart-5" aria-hidden="true" />;
  return <Info className="h-4 w-4 text-muted-foreground" aria-hidden="true" />;
}

export function FindingsList({ findings }: {findings: Finding[];}) {
  if (!findings.length) {
    return (
      <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
        No issues found.
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
          finding.severity === 'critical' ? 'border-destructive/40 bg-destructive/5' : 'border-border bg-card'
        )}>
        
          <div className="flex items-start gap-3">
            <SeverityIcon severity={finding.severity} />
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-foreground">{finding.title}</p>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {finding.ruleRef}
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  {sourceLabels[finding.source]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{finding.detail}</p>
              {finding.requiredDoc ?
            <p className="pt-1 text-xs font-medium text-foreground">
                  Needs: {docLabels[finding.requiredDoc].en}
                </p> :
            null}
            </div>
          </div>
        </li>
      )}
    </ul>);

}