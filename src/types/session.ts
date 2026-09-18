export type OperatorRole = 'CX agent' | 'CX lead' | 'Ops manager' | 'Admin';

export interface Operator {
  id: string;
  name: string;
  email: string;
  role: OperatorRole;
  team: string;
  initials: string;
  lastActive: string;
}

export type AccountProvider = 'gmail' | 'outlook' | 'smartkargo';

export type AccountStatus = 'connected' | 'disconnected' | 'error';

export interface ConnectedAccount {
  id: string;
  provider: AccountProvider;
  /** What this account is used for, e.g. "Customer support inbox". */
  name: string;
  /** Mailbox address or service account id. */
  account: string;
  status: AccountStatus;
  scopes: string[];
  connectedAt?: string;
  lastActivity?: string;
  /** Messages sent or records synced in the last 7 days. */
  volume7d?: number;
  /** Only one account sends customer messages. */
  isSendingIdentity?: boolean;
  errorDetail?: string;
}

export const providerLabels: Record<AccountProvider, string> = {
  gmail: 'Gmail',
  outlook: 'Outlook',
  smartkargo: 'SmartKargo'
};