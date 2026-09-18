import React from 'react';
import { MoreHorizontal, Send } from 'lucide-react';
import { ProviderMark } from './ProviderMark';
import { Button } from './ui/Button';
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
  connected: { label: 'Connected', dot: 'bg-chart-2', text: 'text-foreground' },
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
    <div className="flex items-center gap-3 py-3">
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center',
          !isConnected && 'opacity-50'
        )}>
        <ProviderMark provider={account.provider} className="h-7 w-7" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-medium text-foreground">{account.name}</p>
          {account.isSendingIdentity && isConnected ?
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Send className="h-2.5 w-2.5" aria-hidden="true" />
              Sending
            </span> :
          null}
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {account.account}
          <span className="text-muted-foreground/70"> · {providerLabels[account.provider]}</span>
          {account.lastActivity ? <span> · Active {account.lastActivity}</span> : null}
        </p>
        {account.status === 'error' && account.errorDetail ?
        <p className="mt-1 text-xs text-destructive">{account.errorDetail}</p> :
        null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className={cn('hidden items-center gap-1.5 text-xs sm:inline-flex', meta.text)}>
          <span className={cn('h-1.5 w-1.5 rounded-full', meta.dot)} aria-hidden="true" />
          {meta.label}
        </span>
        {account.status === 'error' ?
        <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs" onClick={onConnect}>
            Reauthorize
          </Button> :
        null}
        {!isConnected && account.status !== 'error' ?
        <Button size="sm" className="h-7 px-2.5 text-xs" onClick={onConnect}>
            Connect
          </Button> :
        null}

        <div className="relative">
          <Button variant="ghost" size="icon-xs" aria-label="Account options" onClick={onToggleMenu}>
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
          {menuOpen ?
          <div
            role="menu"
            className="absolute right-0 top-7 z-30 w-40 overflow-hidden rounded-lg border border-border bg-popover py-1 shadow-lg">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onCloseMenu();
                onEdit();
              }}
              className="block w-full px-3 py-1.5 text-left text-xs text-foreground hover:bg-accent">
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
              className="block w-full px-3 py-1.5 text-left text-xs text-foreground hover:bg-accent">
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
              className="block w-full px-3 py-1.5 text-left text-xs text-foreground hover:bg-accent">
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
              className="block w-full px-3 py-1.5 text-left text-xs text-destructive hover:bg-destructive/10">
              Remove
            </button>
          </div> :
          null}
        </div>
      </div>
    </div>
  );
}
