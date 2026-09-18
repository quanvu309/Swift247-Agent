import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { defaultAccounts, operators } from '../data/team';
import { AccountProvider, ConnectedAccount, Operator } from '../types/session';

export interface AccountDraft {
  provider: AccountProvider;
  name: string;
  account: string;
  scopes: string[];
}

interface SessionContextValue {
  user: Operator;
  team: Operator[];
  accounts: ConnectedAccount[];
  signInAs: (id: string) => void;
  addAccount: (draft: AccountDraft) => void;
  updateAccount: (id: string, patch: Partial<ConnectedAccount>) => void;
  reconnectAccount: (id: string) => void;
  disconnectAccount: (id: string) => void;
  removeAccount: (id: string) => void;
  setSendingIdentity: (id: string) => void;
  sendingAccount?: ConnectedAccount;
}

const SessionContext = createContext<SessionContextValue | null>(null);

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function SessionProvider({ children }: {children: React.ReactNode;}) {
  const [userId, setUserId] = useState(operators[0].id);
  const [accounts, setAccounts] = useState<ConnectedAccount[]>(defaultAccounts);

  const user = operators.find((o) => o.id === userId) ?? operators[0];

  const signInAs = useCallback((id: string) => setUserId(id), []);

  const addAccount = useCallback((draft: AccountDraft) => {
    setAccounts((prev) => [
    ...prev,
    {
      id: `acc-${Date.now()}`,
      provider: draft.provider,
      name: draft.name,
      account: draft.account,
      scopes: draft.scopes,
      status: 'connected',
      connectedAt: today(),
      lastActivity: 'Just now',
      volume7d: 0
    }]
    );
  }, []);

  const updateAccount = useCallback((id: string, patch: Partial<ConnectedAccount>) => {
    setAccounts((prev) => prev.map((a) => a.id === id ? { ...a, ...patch } : a));
  }, []);

  const reconnectAccount = useCallback((id: string) => {
    setAccounts((prev) =>
    prev.map((a) =>
    a.id === id ?
    { ...a, status: 'connected', connectedAt: today(), lastActivity: 'Just now', errorDetail: undefined } :
    a
    )
    );
  }, []);

  const disconnectAccount = useCallback((id: string) => {
    setAccounts((prev) =>
    prev.map((a) =>
    a.id === id ?
    { ...a, status: 'disconnected', connectedAt: undefined, isSendingIdentity: false, errorDetail: undefined } :
    a
    )
    );
  }, []);

  const removeAccount = useCallback((id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const setSendingIdentity = useCallback((id: string) => {
    setAccounts((prev) =>
    prev.map((a) => ({ ...a, isSendingIdentity: a.id === id && a.status === 'connected' }))
    );
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      user,
      team: operators,
      accounts,
      signInAs,
      addAccount,
      updateAccount,
      reconnectAccount,
      disconnectAccount,
      removeAccount,
      setSendingIdentity,
      sendingAccount: accounts.find((a) => a.isSendingIdentity && a.status === 'connected')
    }),
    [
    accounts,
    addAccount,
    disconnectAccount,
    reconnectAccount,
    removeAccount,
    setSendingIdentity,
    signInAs,
    updateAccount,
    user]

  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside SessionProvider');
  return ctx;
}