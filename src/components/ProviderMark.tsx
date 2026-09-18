import React from 'react';
import { AccountProvider } from '../types/session';
import { cn } from '../utils/cn';

const marks: Record<AccountProvider, {src: string;alt: string;}> = {
  gmail: {
    src: '/gmail.png',
    alt: 'Gmail'
  },
  outlook: {
    src: '/image-1.png',
    alt: 'Outlook'
  },
  smartkargo: {
    src: '/image-2.png',
    alt: 'SmartKargo'
  }
};

interface ProviderMarkProps {
  provider: AccountProvider;
  className?: string;
}

/** Brand marks for the systems this console connects to. */
export function ProviderMark({ provider, className }: ProviderMarkProps) {
  const mark = marks[provider];
  return <img src={mark.src} alt={mark.alt} className={cn('h-4 w-auto object-contain', className)} />;
}