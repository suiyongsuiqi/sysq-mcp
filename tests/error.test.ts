import { describe, expect, it } from 'vitest';
import { ApiError } from '@suiyongsuiqi/sysq-sdk';

import { normalizeSysqToolError } from '../src/sysq/error';

describe('normalizeSysqToolError', () => {
  it('maps SYSQ business errors into MCP-safe payloads', () => {
    const error = new ApiError(400, 400, 'Mailbox not found', {
      data: {
        errorKey: 'mail.box.notFound',
        traceId: 'trace-123',
      },
      msg: 'Mailbox not found',
    });

    expect(normalizeSysqToolError(error)).toEqual({
      type: 'biz',
      errorKey: 'mail.box.notFound',
      code: 400,
      traceId: 'trace-123',
      params: undefined,
      message: 'Mailbox not found',
    });
  });
});
