import React from 'react';
import { Card, CardContent } from './ui/Card';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  hint?: string;
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <Card>
      <CardContent className="space-y-0.5 p-5">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">{label}</p>
        <p className="font-heading text-2xl font-semibold tracking-tight text-foreground">{value}</p>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>);

}