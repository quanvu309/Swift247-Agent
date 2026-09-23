export const ROOT_REDIRECT = '/design';
export const CATCH_ALL_REDIRECT = '/design';

export const appPageRoutes = [
  { path: '/design', page: 'FlowDesign' },
  { path: '/approvals', page: 'OpsQueue' },
  { path: '/approvals/:id', page: 'OpsCaseDetail' },
  { path: '/orders', page: 'Orders' },
  { path: '/orders/:id', page: 'OrderDetail' },
  { path: '/builder', page: 'FlowBuilder' },
  { path: '/rules', page: 'Rules' },
  { path: '/connections', page: 'SmartKargo' },
  { path: '/account', page: 'Account' }
];

// Executions merged into Orders. Old links keep working.
export const LEGACY_REDIRECTS = [
  { from: '/executions', to: '/orders' },
  { from: '/executions/:id', to: '/orders/:id' }
];

export function isPageRoute(path) {
  return appPageRoutes.some((route) => route.path === path);
}
