import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { Toaster } from './components/ui/Sonner';
import { AppShell } from './components/AppShell';
import { WorkflowProvider } from './contexts/WorkflowContext';
import { SessionProvider } from './contexts/SessionContext';
import { Account } from './pages/Account';
import { FlowBuilder, FlowDesign } from './pages/FlowDesign';
import { Rules } from './pages/Rules';
import { Orders } from './pages/Orders';
import { OrderDetail } from './pages/OrderDetail';
import { OpsQueue } from './pages/OpsQueue';
import { OpsCaseDetail } from './pages/OpsCaseDetail';
import { SmartKargo } from './pages/SmartKargo';
import { CATCH_ALL_REDIRECT, LEGACY_REDIRECTS, ROOT_REDIRECT, appPageRoutes } from './product/appRoutes.js';

const pages: Record<string, React.ComponentType> = {
  FlowDesign,
  FlowBuilder,
  Rules,
  Orders,
  OrderDetail,
  OpsQueue,
  OpsCaseDetail,
  SmartKargo,
  Account
};

function LegacyRedirect({ to }: {to: string;}) {
  const params = useParams();
  return <Navigate to={to.replace(':id', params.id ?? '')} replace />;
}

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
            {LEGACY_REDIRECTS.map((r) =>
            <Route key={r.from} path={r.from} element={<LegacyRedirect to={r.to} />} />
            )}
            <Route path="*" element={<Navigate to={CATCH_ALL_REDIRECT} replace />} />
          </Routes>
          </AppShell>
          <Toaster position="bottom-right" closeButton />
        </BrowserRouter>
      </WorkflowProvider>
    </SessionProvider>);

}