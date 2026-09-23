export const ROOT_REDIRECT: '/design';
export const CATCH_ALL_REDIRECT: '/design';

export const appPageRoutes: ReadonlyArray<{
  path: string;
  page: string;
}>;

export function isPageRoute(path: string): boolean;

export const LEGACY_REDIRECTS: ReadonlyArray<{
  from: string;
  to: string;
}>;
