export const ROOT_REDIRECT = '/design';
export const CATCH_ALL_REDIRECT = '/design';

export const appPageRoutes = [
  { path: '/design', page: 'FlowDesign' },
  { path: '/showcase', page: 'Showcase' },
  { path: '/orders', page: 'Orders' },
  { path: '/orders/:id', page: 'OrderDetail' },
  { path: '/executions', page: 'AgentRuns' },
  { path: '/executions/:id', page: 'AgentRunDetail' },
  { path: '/approvals', page: 'OpsQueue' },
  { path: '/approvals/:id', page: 'OpsCaseDetail' },
  { path: '/connections', page: 'SmartKargo' },
  { path: '/account', page: 'Account' }
];

export function isPageRoute(path) {
  return appPageRoutes.some((route) => route.path === path);
}
