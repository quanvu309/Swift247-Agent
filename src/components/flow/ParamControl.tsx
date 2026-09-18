import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Switch } from '../ui/CSwitch';
import { FlowNodeParam } from '../../types/flow';

interface ParamControlProps {
  param: FlowNodeParam;
  onChange: (value: string) => void;
}

/** Renders the right editor for a node parameter. */
export function ParamControl({ param, onChange }: ParamControlProps) {
  const control = param.control ?? 'text';
  const [tagDraft, setTagDraft] = useState('');

  if (control === 'toggle') {
    const on = param.value === 'on';
    return (
      <label className="flex items-center justify-between gap-3 rounded-md border border-border bg-background px-2.5 py-2">
        <span className="min-w-0">
          <span className="block text-xs text-foreground">{param.label}</span>
          {param.hint ? <span className="block text-[10px] text-muted-foreground">{param.hint}</span> : null}
        </span>
        <Switch
          size="sm"
          checked={on}
          onCheckedChange={(next) => onChange(next ? 'on' : 'off')}
          aria-label={param.label} />
        
      </label>);

  }

  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-medium text-muted-foreground">{param.label}</label>

      {control === 'select' ?
      <Select value={param.value} onValueChange={onChange}>
          <SelectTrigger aria-label={param.label} className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(param.options ?? [param.value]).map((option) =>
          <SelectItem key={option} value={option} className="text-xs">
                {option}
              </SelectItem>
          )}
          </SelectContent>
        </Select> :
      null}

      {control === 'number' ?
      <div className="flex items-center gap-1.5">
          <Input
          type="number"
          value={param.value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={param.label}
          className="h-8 font-mono text-[11px]" />
        
          {param.unit ?
        <span className="shrink-0 rounded-md border border-border bg-muted/50 px-2 py-1.5 font-mono text-[10px] text-muted-foreground">
              {param.unit}
            </span> :
        null}
        </div> :
      null}

      {control === 'tags' ?
      <div className="rounded-md border border-border bg-background p-1.5">
          <div className="flex flex-wrap gap-1">
            {param.value.
          split(',').
          map((t) => t.trim()).
          filter(Boolean).
          map((tag) =>
          <span
            key={tag}
            className="flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-[10px] text-secondary-foreground">
            
                  {tag}
                  <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={() =>
              onChange(
                param.value.
                split(',').
                map((t) => t.trim()).
                filter((t) => t && t !== tag).
                join(', ')
              )
              }
              className="rounded text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring">
              
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
          )}
          </div>
          <div className="mt-1 flex items-center gap-1">
            <Input
            value={tagDraft}
            onChange={(e) => setTagDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter' || !tagDraft.trim()) return;
              e.preventDefault();
              const existing = param.value.
              split(',').
              map((t) => t.trim()).
              filter(Boolean);
              onChange([...existing, tagDraft.trim()].join(', '));
              setTagDraft('');
            }}
            placeholder="Add and press Enter"
            aria-label={`Add to ${param.label}`}
            className="h-7 border-0 px-1.5 text-[11px] shadow-none focus-visible:ring-0" />
          
            <Plus className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden="true" />
          </div>
        </div> :
      null}

      {control === 'text' ?
      <Input
        value={param.value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={param.label}
        className="h-8 font-mono text-[11px]" /> :

      null}

      {param.hint ? <p className="text-[10px] text-muted-foreground">{param.hint}</p> : null}
    </div>);

}