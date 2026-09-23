import { useState } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '../components/PageHeader';
import { Switch } from '../components/ui/CSwitch';
import { referenceRules } from '../data/referenceData';
import { ReferenceRule } from '../types/cargo';

const GROUPS: {category: ReferenceRule['category'];title: string;blurb: string;}[] = [
{ category: 'Order', title: 'Documents', blurb: 'Which documents an order needs and how they must agree.' },
{ category: 'KYC', title: 'Sender identity', blurb: 'When the sender must prove who they are.' },
{ category: 'Service rules', title: 'Service limits', blurb: 'Weight, size, COD, and insurance.' },
{ category: 'Restricted items', title: 'Restricted items', blurb: 'Goods that need extra papers or are refused.' }];


export function Rules() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
  Object.fromEntries(referenceRules.map((r) => [r.code, true]))
  );

  const toggle = (rule: ReferenceRule, on: boolean) => {
    setEnabled((prev) => ({ ...prev, [rule.code]: on }));
    toast.success(on ? `${rule.code} turned on` : `${rule.code} turned off`);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Rules"
        description="The checks the agent applies to every order. Values come from SmartKargo and update on each sync." />


      {GROUPS.map((group) => {
        const rules = referenceRules.filter((r) => r.category === group.category);
        if (!rules.length) return null;
        return (
          <section key={group.category} aria-labelledby={`rules-${group.category}`} className="space-y-3">
            <div>
              <h2 id={`rules-${group.category}`} className="text-base font-semibold text-foreground">
                {group.title}
              </h2>
              <p className="text-sm text-muted-foreground">{group.blurb}</p>
            </div>
            <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
              {rules.map((rule) =>
              <li key={rule.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{rule.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      <span className="font-mono text-xs">{rule.code}</span> · {rule.value}
                    </p>
                  </div>
                  <Switch
                  checked={enabled[rule.code]}
                  onCheckedChange={(on: boolean) => toggle(rule, on)}
                  aria-label={`${rule.title} ${enabled[rule.code] ? 'on' : 'off'}`} />

                </li>
              )}
            </ul>
          </section>);

      })}
    </div>);

}
