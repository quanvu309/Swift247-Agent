import React from 'react';
import { AlertTriangle, MoreHorizontal, Send } from 'lucide-react';
import { ProviderMark } from './ProviderMark';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/Tooltip';
import { ConnectedAccount, providerLabels } from '../types/session';
import { cn } from '../utils/cn';

interface AccountCardProps {
  account: ConnectedAccount;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onEdit: () => void;
  onConnect: () => void;
  onDisconnect: () => void;
  onRemove: () => void;
  onUseForSending: () => void;
}

const statusMeta: Record<ConnectedAccount['status'], {label: string;dot: string;text: string;}> = {
  connected: { label: 'Connected', dot: 'bg-chart-2', text: 'text-chart-2' },
  disconnected: { label: 'Not connected', dot: 'bg-muted-foreground/40', text: 'text-muted-foreground' },
  error: { label: 'Needs attention', dot: 'bg-destructive', text: 'text-destructive' }
};

export function AccountCard({
  account,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  onEdit,
  onConnect,
  onDisconnect,
  onRemove,
  onUseForSending
}: AccountCardProps) {
  const meta = statusMeta[account.status];
  const isConnected = account.status === 'connected';
  const isMailbox = account.provider !== 'smartkargo';

  return (
    <Card className={cn('overflow-hidden', account.status === 'error' && 'border-destructive/40')}>
      <CardContent className="p-0">
        <div className="flex items-start gap-3 p-4">
          <span
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card',
              !isConnected && 'opacity-50 grayscale'
            )}>
            
            <ProviderMark provider={account.provider} className="h-5 w-auto" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{account.name}</p>
                <p className="truncate font-mono text-xs text-muted-foreground">{account.account}</p>
              </div>

              <div className="relative flex shrink-0 items-center gap-1">
                {account.isSendingIdentity && isConnected ?
                <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex h-6 items-center gap-1 rounded-full bg-primary/10 px-2 text-[10px] font-medium text-primary">
                        <Send className="h-2.5 w-2.5" aria-hidden="true" />
                        Sending
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Customer messages go out from here</TooltipContent>
                  </Tooltip> :
                null}

                <Button variant="ghost" size="icon-xs" aria-label="Account options" onClick={onToggleMenu}>
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>

                {menuOpen ?
                <div
                  role="menu"
                  className="absolute right-0 top-7 z-30 w-44 overflow-hidden rounded-lg border border-border bg-popover py-1 shadow-lg">
                  
                    <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onCloseMenu();
                      onEdit();
                    }}
                    className="block w-full px-3 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-accent">
                    
                      Edit
                    </button>
                    {isConnected && isMailbox && !account.isSendingIdentity ?
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onCloseMenu();
                      onUseForSending();
                    }}
                    className="block w-full px-3 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-accent">
                    
                        Use for sending
                      </button> :
                  null}
                    {isConnected ?
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onCloseMenu();
                      onDisconnect();
                    }}
                    className="block w-full px-3 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-accent">
                    
                        Disconnect
                      </button> :
                  null}
                    <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onCloseMenu();
                      onRemove();
                    }}
                    className="block w-full px-3 py-1.5 text-left text-xs text-destructive transition-colors hover:bg-destructive/10">
                    
                      Remove
                    </button>
                  </div> :
                null}
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className={cn('flex items-center gap-1.5 text-xs', meta.text)}>
                <span className={cn('h-1.5 w-1.5 rounded-full', meta.dot)} aria-hidden="true" />
                {meta.label}
              </span>
              <span className="text-xs text-muted-foreground">{providerLabels[account.provider]}</span>
              {account.lastActivity ?
              <span className="text-xs text-muted-foreground">Active {account.lastActivity}</span> :
              null}
            </div>

            <div className="mt-2.5 flex flex-wrap gap-1">
              {account.scopes.map((scope) =>
              <span
                key={scope}
                className="rounded border border-border bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                
                  {scope}
                </span>
              )}
            </div>
          </div>
        </div>

        {account.status === 'error' && account.errorDetail ?
        <div className="flex items-start gap-2 border-t border-destructive/30 bg-destructive/5 px-4 py-2.5">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" aria-hidden="true" />
            <p className="min-w-0 flex-1 text-xs text-destructive">{account.errorDetail}</p>
            <Button variant="outline" size="sm" className="h-6 shrink-0 px-2 text-xs" onClick={onConnect}>
              Re-authorize
            </Button>
          </div> :
        null}

        <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/30 px-4 py-2">
          <p className="font-mono text-[10px] text-muted-foreground">
            {isConnected ?
            `${(account.volume7d ?? 0).toLocaleString()} ${isMailbox ? 'messages' : 'records'} / 7d` :
            'No activity'}
          </p>
          {isConnected ?
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={onEdit}>
              Edit
            </Button> :

          <Button size="sm" className="h-6 px-2.5 text-xs" onClick={onConnect}>
              Connect
            </Button>
          }
        </div>
      </CardContent>
    </Card>);

}