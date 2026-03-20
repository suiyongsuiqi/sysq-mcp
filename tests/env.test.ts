import { describe, expect, it } from 'vitest';

import { loadSysqMcpConfig } from '../src/config/env';

describe('loadSysqMcpConfig', () => {
  it('loads and trims required env vars', () => {
    const config = loadSysqMcpConfig({
      SYSQ_BASE_URL: ' https://www.suiyongsuiqi.com/openapi/api ',
      SYSQ_API_KEY: ' ak-demo ',
    });

    expect(config).toEqual({
      baseUrl: 'https://www.suiyongsuiqi.com/openapi/api',
      apiKey: 'ak-demo',
    });
  });

  it('throws when required env vars are missing', () => {
    expect(() =>
      loadSysqMcpConfig({
        SYSQ_BASE_URL: 'https://www.suiyongsuiqi.com/openapi/api',
      })
    ).toThrow('SYSQ_API_KEY is required.');
  });
});
