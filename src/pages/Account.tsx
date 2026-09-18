import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Check, Plus, ShieldCheck } from 'lucide-react';
import { AccountCard } from '../components/AccountCard';
import { PageHeader } from '../components/PageHeader';
import { ProviderMark } from '../components/ProviderMark';
import { Avatar, AvatarFallback } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle } from
'../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { useSession } from '../contexts/SessionContext';
import { AccountProvider, ConnectedAccount, providerLabels } from '../types/session';
import { useScreenInit } from '../useScreenInit.js';

const placeholders: Record<AccountProvider, string> = {
  gmail: 'name@swift247.vn',
  outlook: 'name@swift247.vn',
  smartkargo: 'svc_account_name'
};

const scopeOptions: Record<AccountProvider, string[]> = {
  gmail: ['gmail.send', 'gmail.readonly', 'gmail.labels'],
  outlook: ['Mail.Send', 'Mail.Read', 'Mail.ReadWrite'],
  smartkargo: ['orders', 'rules', 'restricted', 'routes', 'orders.status', 'orders.fees']
};

interface Draft {
  provider: AccountProvider;
  name: string;
  account: string;
  scopes: string[];
}

const emptyDraft: Draft = { provider: 'gmail', name: '', account: '', scopes: ['gmail.send'] };

export function Account() {
  const {
    user,
    team,
    accounts,
    signInAs,
    addAccount,
    updateAccount,
    reconnectAccount,
    disconnectAccount,
    removeAccount,
    setSendingIdentity
  } = useSession();

  const screenInit = useScreenInit();
  const [tab, setTab] = useState<string>(screenInit.tab ?? 'accounts');
  const [menuId, setMenuId] = useState<string | null>(null);
  const [editing, setEditing] = useState<ConnectedAccount | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuId) return;
    const onClick = (e: MouseEvent) => {
      if (gridRef.current && !gridRef.current.contains(e.target as Node)) setMenuId(null);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuId]);

  const openEdit = (account: ConnectedAccount) => {
    setEditing(account);
    setDraft({
      provider: account.provider,
      name: account.name,
      account: account.account,
      scopes: account.scopes
    });
  };

  const openAdd = () => {
    setAdding(true);
    setDraft(emptyDraft);
  };

  const closeDialog = () => {
    setEditing(null);
    setAdding(false);
  };

  const toggleScope = (scope: string) => {
    setDraft((d) => ({
      ...d,
      scopes: d.scopes.includes(scope) ? d.scopes.filter((s) => s !== scope) : [...d.scopes, scope]
    }));
  };

  const submit = () => {
    if (editing) {
      updateAccount(editing.id, { name: draft.name.trim(), account: draft.account.trim(), scopes: draft.scopes });
      toast.success('Account updated', { description: draft.account.trim() });
    } else {
      addAccount({
        provider: draft.provider,
        name: draft.name.trim(),
        account: draft.account.trim(),
        scopes: draft.scopes
      });
      toast.success(`${providerLabels[draft.provider]} connected`, { description: draft.account.trim() });
    }
    closeDialog();
  };

  const dialogOpen = adding || !!editing;
  const valid = draft.name.trim().length > 0 && draft.account.trim().length > 0 && draft.scopes.length > 0;
  const connectedCount = accounts.filter((a) => a.status === 'connected').length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Account"
        title={user.name}
        description={`${user.role}, ${user.team}`}
        actions={
        <Badge variant="secondary" className="gap-1.5">
            <ShieldCheck className="h-3 w-3" aria-hidden="true" />
            Signed in
          </Badge>
        } />
      

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="accounts">Connected accounts</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="mt-8 space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-sm font-medium text-foreground">Connected accounts</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {connectedCount} of {accounts.length} active
              </p>
            </div>
            <Button size="sm" onClick={openAdd}>
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Add account
            </Button>
          </div>

          <div ref={gridRef} className="divide-y divide-border border-y border-border">
            {accounts.map((account) =>
            <AccountCard
              key={account.id}
              account={account}
              menuOpen={menuId === account.id}
              onToggleMenu={() => setMenuId((id) => id === account.id ? null : account.id)}
              onCloseMenu={() => setMenuId(null)}
              onEdit={() => openEdit(account)}
              onConnect={() => {
                reconnectAccount(account.id);
                toast.success(`${providerLabels[account.provider]} connected`, { description: account.account });
              }}
              onDisconnect={() => {
                disconnectAccount(account.id);
                toast.success(`${account.name} disconnected`);
              }}
              onRemove={() => {
                removeAccount(account.id);
                toast.success(`${account.name} removed`);
              }}
              onUseForSending={() => {
                setSendingIdentity(account.id);
                toast.success(`Messages now send from ${account.account}`);
              }} />

            )}
            <button
              type="button"
              onClick={openAdd}
              className="flex w-full items-center gap-3 py-3 text-left text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add account
            </button>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="mt-8 max-w-xl space-y-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11">
              <AvatarFallback className="bg-primary text-primary-foreground">{user.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input id="name" defaultValue={user.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" defaultValue={user.email} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" defaultValue={user.role} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team">Team</Label>
              <Input id="team" defaultValue={user.team} readOnly />
            </div>
            <Button size="sm" onClick={() => toast.success('Profile saved')}>
              Save
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="team" className="mt-8 space-y-4">
          <div>
            <h2 className="text-sm font-medium text-foreground">Team</h2>
            <p className="mt-1 text-sm text-muted-foreground">Who can review and send customer messages</p>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {team.map((member) =>
            <div key={member.id} className="flex items-center gap-3 py-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-[10px]">{member.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{member.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                </div>
                <p className="hidden text-sm text-muted-foreground sm:block">{member.role}</p>
                {member.id === user.id ?
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    You
                  </span> :

                <Button variant="ghost" size="sm" onClick={() => signInAs(member.id)}>
                    Sign in as
                  </Button>
                }
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={(open) => open ? null : closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ProviderMark provider={draft.provider} className="h-6 w-6" />
              {editing ? 'Edit account' : 'Add account'}
            </DialogTitle>
            <DialogDescription>
              {draft.provider === 'smartkargo' ?
              'Use a SmartKargo service account issued for this extension.' :
              'Authorize a mailbox the CX team can read and send from.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!editing ?
            <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <Select
                value={draft.provider}
                onValueChange={(value) => {
                  const provider = value as AccountProvider;
                  setDraft({ provider, name: '', account: '', scopes: [scopeOptions[provider][0]] });
                }}>
                
                  <SelectTrigger id="provider">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                    <SelectItem value="gmail">Gmail</SelectItem>
                    <SelectItem value="outlook">Outlook</SelectItem>
                    <SelectItem value="smartkargo">SmartKargo</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div> :
            null}

            <div className="space-y-2">
              <Label htmlFor="accountName">Label</Label>
              <Input
                id="accountName"
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                placeholder="Customer support inbox" />
              
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountId">
                {draft.provider === 'smartkargo' ? 'Service account' : 'Mailbox'}
              </Label>
              <Input
                id="accountId"
                value={draft.account}
                onChange={(e) => setDraft((d) => ({ ...d, account: e.target.value }))}
                placeholder={placeholders[draft.provider]}
                className="font-mono" />
              
            </div>

            <div className="space-y-2">
              <Label>Scopes</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {scopeOptions[draft.provider].map((scope) =>
                <label key={scope} className="flex items-center gap-2 text-xs">
                    <Checkbox
                    checked={draft.scopes.includes(scope)}
                    onCheckedChange={() => toggleScope(scope)}
                    aria-label={scope} />
                  
                    <span className="font-mono text-muted-foreground">{scope}</span>
                  </label>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={!valid}>
              {editing ? 'Save' : 'Authorize'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>);

}