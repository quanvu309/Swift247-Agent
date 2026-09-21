import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from './components/ui/Sonner';
import { AppShell } from './components/AppShell';
import { WorkflowProvider } from './contexts/WorkflowContext';
import { SessionProvider } from './contexts/SessionContext';
import { Account } from './pages/Account';
import { FlowDesign } from './pages/FlowDesign';
import { Showcase } from './pages/Showcase';
import { Orders } from './pages/Orders';
import { OrderDetail } from './pages/OrderDetail';
import { AgentRuns } from './pages/AgentRuns';
import { AgentRunDetail } from './pages/AgentRunDetail';
import { OpsQueue } from './pages/OpsQueue';
import { OpsCaseDetail } from './pages/OpsCaseDetail';
import { SmartKargo } from './pages/SmartKargo';
import { CATCH_ALL_REDIRECT, ROOT_REDIRECT, appPageRoutes } from './product/appRoutes.js';

const pages: Record<string, React.ComponentType> = {
  FlowDesign,
  Showcase,
  Orders,
  OrderDetail,
  AgentRuns,
  AgentRunDetail,
  OpsQueue,
  OpsCaseDetail,
  SmartKargo,
  Account
};

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
            <Route path="/" element={<Navigate to={ROOT_REDIRECT} replace />} />
            {appPageRoutes.map((route) => {
              const Page = pages[route.page];
              return <Route key={route.path} path={route.path} element={<Page />} />;
            })}
            <Route path="*" element={<Navigate to={CATCH_ALL_REDIRECT} replace />} />
          </Routes>
          </AppShell>
          <Toaster position="bottom-right" closeButton />
        </BrowserRouter>
      </WorkflowProvider>
    </SessionProvider>);

}