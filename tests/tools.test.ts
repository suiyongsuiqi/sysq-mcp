import { describe, expect, it, vi } from 'vitest';

import { handleMailboxBind, handleMailboxList } from '../src/mcp/tools/handlers';

function createMockMailSdk() {
  return {
    mail: {
      fetchUserMailBoxes: vi.fn().mockResolvedValue({
        records: [
          {
            id: '1',
            prefix: 'demo',
            suffix: 'gmail.com',
            fullAddress: 'demo@gmail.com',
            source: 'PURCHASED',
            createTime: '2026-03-20T00:00:00Z',
            unreadCount: 2,
          },
        ],
        total: 1,
        size: 20,
        current: 1,
        pages: 1,
      }),
      bindMailToAccount: vi.fn(),
    },
  };
}

describe('SYSQ tool handlers', () => {
  it('returns structured mailbox list data', async () => {
    const sdk = createMockMailSdk();
    const result = await handleMailboxList(sdk as never, { current: 1, size: 20 });

    expect(sdk.mail.fetchUserMailBoxes).toHaveBeenCalledWith({ current: 1, size: 20 });
    expect(result.isError).toBeUndefined();
    expect(result.structuredContent.records).toHaveLength(1);
    expect(result.content[0]?.text).toContain('Fetched 1 mailbox(es)');
  });

  it('returns a tool error when bind arguments conflict', async () => {
    const sdk = createMockMailSdk();
    const result = await handleMailboxBind(sdk as never, {
      targetUserId: '1001',
      mailBoxId: 'mb-1',
      fullAddress: 'demo@gmail.com',
    });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('Pass only one of mailBoxId or fullAddress.');
    expect(sdk.mail.bindMailToAccount).not.toHaveBeenCalled();
  });
});
