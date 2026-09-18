import React from 'react';
import { Badge } from './ui/Badge';
import { ShipmentStage } from '../types/cargo';
import { stageMeta } from '../utils/agent';

export function StageBadge({ stage }: {stage: ShipmentStage;}) {
  const meta = stageMeta[stage];
  return (
    <Badge variant={meta.tone} className="font-medium">
      {meta.label}
    </Badge>);

}