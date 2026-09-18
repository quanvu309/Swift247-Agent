import React from 'react';
import { Link } from 'react-router-dom';
import { ProviderMark } from './ProviderMark';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/Tooltip';
import { useSession } from '../contexts/SessionContext';
import { AccountProvider, providerLabels } from '../types/session';
import { cn } from '../utils/cn';

const providers: AccountProvider[] = ['gmail', 'outlook', 'smartkargo'];

/** Live connection state per provider, shown in the header. */
export function ConnectionStatus() {
  const { accounts } = useSession();

  return (
    <div className="hidden items-center gap-1 rounded-full border border-border bg-card px-1.5 py-1 md:flex">
      {providers.map((provider) => {
        const owned = accounts.filter((a) => a.provider === provider);
        const live = owned.filter((a) => a.status === 'connected');
        const failing = owned.some((a) => a.status === 'error');
        const connected = live.length > 0;

        return (
          <Tooltip key={provider}>
            <TooltipTrigger asChild>
              <Link
                to="/account"
                aria-label={`${providerLabels[provider]} ${connected ? 'connected' : 'not connected'}`}
                className={cn(
                  'relative flex h-6 w-6 items-center justify-center rounded-full outline-none transition-colors',
                  'hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring',
                  !connected && 'opacity-40 grayscale'
                )}>
                
                <ProviderMark provider={provider} className="h-3.5 w-auto" />
                <span
                  className={cn(
                    'absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full ring-2 ring-card',
                    failing ? 'bg-destructive' : connected ? 'bg-chart-2' : 'bg-muted-foreground/50'
                  )}
                  aria-hidden="true" />
                
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              {providerLabels[provider]}
              {connected ? `. ${live.length} active` : '. Not connected'}
              {failing ? ', 1 needs attention' : ''}
            </TooltipContent>
          </Tooltip>);

      })}
    </div>);

}