import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  CATCH_ALL_REDIRECT,
  ROOT_REDIRECT,
  appPageRoutes,
  isPageRoute
} from './appRoutes.js';

describe('app routes', () => {
  it('sends / to Flow Design', () => {
    assert.equal(ROOT_REDIRECT, '/design');
  });

  it('sends unknown paths to Flow Design', () => {
    assert.equal(CATCH_ALL_REDIRECT, '/design');
  });

  it('mounts Flow Design as the first page route', () => {
    assert.equal(appPageRoutes[0]?.path, '/design');
    assert.equal(appPageRoutes[0]?.page, 'FlowDesign');
  });

  it('does not mount Flows as a page', () => {
    assert.equal(isPageRoute('/flows'), false);
    assert.equal(
      appPageRoutes.some((route) => route.path === '/flows' || route.page === 'Flows'),
      false
    );
  });

  it('does not mount / as a page', () => {
    assert.equal(isPageRoute('/'), false);
  });
});
