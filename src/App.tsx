import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from './components/ui/Sonner';
import { AppShell } from './components/AppShell';
import { WorkflowProvider } from './contexts/WorkflowContext';
import { SessionProvider } from './contexts/SessionContext';
import { Account } from './pages/Account';
import { FlowDesign } from './pages/FlowDesign';
import { Orders } from './pages/Orders';
import { OrderDetail } from './pages/OrderDetail';
import { AgentRuns } from './pages/AgentRuns';
import { AgentRunDetail } from './pages/AgentRunDetail';
import { OpsQueue } from './pages/OpsQueue';
import { OpsCaseDetail } from './pages/OpsCaseDetail';
import { SmartKargo } from './pages/SmartKargo';

interface AppProps {
  /** Run the compliance agent automatically as soon as a shipper submits documents. */
  autoRunOnSubmit?: boolean;
  /** Keep a human in the loop: ops must approve the auto-drafted email before it is sent. */
  requireOpsApproval?: boolean;
}

export function App({ autoRunOnSubmit = true, requireOpsApproval = true }: AppProps) {
  return (
    <SessionProvider>
      <WorkflowProvider autoRunOnSubmit={autoRunOnSubmit} requireOpsApproval={requireOpsApproval}>
        <BrowserRouter>
          <AppShell>
          <Routes>
            <Route path="/" element={<Navigate to="/design" replace />} />
            <Route path="/design" element={<FlowDesign />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/executions" element={<AgentRuns />} />
            <Route path="/executions/:id" element={<AgentRunDetail />} />
            <Route path="/approvals" element={<OpsQueue />} />
            <Route path="/approvals/:id" element={<OpsCaseDetail />} />
            <Route path="/connections" element={<SmartKargo />} />
            <Route path="/account" element={<Account />} />
            <Route path="*" element={<Navigate to="/design" replace />} />
          </Routes>
          </AppShell>
          <Toaster position="bottom-right" closeButton />
        </BrowserRouter>
      </WorkflowProvider>
    </SessionProvider>);

}