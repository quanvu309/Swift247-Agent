import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Check, Plus, ShieldCheck } from 'lucide-react';
import { AccountCard } from '../components/AccountCard';
import { PageHeader } from '../components/PageHeader';
import { ProviderMark } from '../components/ProviderMark';
import { Avatar, AvatarFallback } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
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
import { Separator } from '../components/ui/Separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
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

        <TabsContent value="accounts" className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {connectedCount} of {accounts.length} accounts active
            </p>
            <Button size="sm" onClick={openAdd}>
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Add account
            </Button>
          </div>

          <div ref={gridRef} className="grid gap-4 lg:grid-cols-2">
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
              className="flex min-h-[132px] flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border text-muted-foreground outline-none transition-colors hover:border-ring/60 hover:bg-accent/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
              
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm font-medium">Add account</span>
              <span className="text-xs">Gmail, Outlook or SmartKargo</span>
            </button>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile</CardTitle>
              <CardDescription>Shown on approvals and the order activity log</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">{user.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
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
              </div>
              <div className="flex justify-end">
                <Button size="sm" onClick={() => toast.success('Profile saved')}>
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Operators</CardTitle>
              <CardDescription>Who can review and send customer messages</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Last active</TableHead>
                    <TableHead className="w-28" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.map((member) =>
                  <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-[10px]">{member.initials}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{member.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{member.role}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{member.team}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{member.lastActive}</TableCell>
                      <TableCell>
                        {member.id === user.id ?
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                            You
                          </span> :

                      <Button variant="ghost" size="sm" onClick={() => signInAs(member.id)}>
                            Sign in as
                          </Button>
                      }
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={(open) => open ? null : closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ProviderMark provider={draft.provider} className="h-4 w-auto" />
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