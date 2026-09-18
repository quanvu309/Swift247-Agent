import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const trunk = 'M 36 92 H 392';
const toMessage = 'M 392 92 C 430 92, 448 44, 496 44';
const toApproval = 'M 392 92 C 430 92, 448 140, 496 140';

const nodes = [
  { x: 36, y: 92, label: 'Order created', tone: 'idle' as const },
  { x: 154, y: 92, label: 'Read documents', tone: 'run' as const },
  { x: 272, y: 92, label: 'Check rules', tone: 'run' as const },
  { x: 392, y: 92, label: 'Decision', tone: 'gate' as const },
  { x: 528, y: 44, label: 'Customer message', tone: 'out' as const },
  { x: 528, y: 140, label: 'CX approval', tone: 'human' as const }
];

const tones = {
  idle: 'var(--brand-purple)',
  run: 'var(--brand-orange)',
  gate: 'var(--brand-magenta)',
  out: 'var(--chart-2)',
  human: 'var(--brand-purple)'
};

function Dot({ d, delay, color }: { d: string; delay: number; color: string }) {
  return (
    <motion.circle
      r="3.5"
      fill={color}
      style={{ offsetPath: `path('${d}')`, offsetRotate: '0deg' }}
      initial={{ offsetDistance: '0%', opacity: 0 }}
      animate={{ offsetDistance: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 2.6, delay, repeat: Infinity, ease: 'linear' }}
    />
  );
}

export function PipelineHero() {
  const reduce = usePrefersReducedMotion();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-[var(--brand-lavender)] px-4 py-6 sm:px-6">
      <svg viewBox="0 0 620 196" className="h-[196px] w-full" role="img" aria-label="Parcel check pipeline">
        <path d={trunk} fill="none" stroke="var(--border)" strokeWidth="2" />
        <path d={toMessage} fill="none" stroke="var(--border)" strokeWidth="2" />
        <path d={toApproval} fill="none" stroke="var(--border)" strokeWidth="2" />

        {!reduce ?
        <>
            <Dot d={trunk} delay={0} color="var(--brand-orange)" />
            <Dot d={trunk} delay={1.3} color="var(--brand-magenta)" />
            <Dot d={toMessage} delay={0.4} color="var(--chart-2)" />
            <Dot d={toApproval} delay={1.1} color="var(--brand-purple)" />
          </> :
        null}

        {nodes.map((node) =>
        <g key={node.label} transform={`translate(${node.x}, ${node.y})`}>
            <motion.circle
            r="9"
            fill="var(--background)"
            stroke={tones[node.tone]}
            strokeWidth="2.5"
            animate={reduce ? undefined : { scale: [1, 1.14, 1] }}
            transition={reduce ? undefined : { duration: 2.2, repeat: Infinity, ease: 'easeOut' }} />
            
            <circle r="3.5" fill={tones[node.tone]} />
            <text
            y="28"
            textAnchor="middle"
            className="fill-foreground"
            style={{ fontSize: 10, fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
              
              {node.label}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
