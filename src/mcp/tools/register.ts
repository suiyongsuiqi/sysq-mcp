import type { SysqSdk } from '@suiyongsuiqi/sysq-sdk';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import {
  handleMailboxBind,
  handleMailboxBuy,
  handleMailboxBuyBatch,
  handleMailboxBuyRandom,
  handleMailboxList,
  handleMailboxRemove,
  handleMailboxRemoveBatch,
  handleMailMarkRead,
  handleMailMessages,
  handleMailUnreadList,
  handleMailUnreadSummary,
} from './handlers';
import {
  mailboxBindInputSchema,
  mailboxBuyBatchInputSchema,
  mailboxBuyInputSchema,
  mailboxBuyRandomInputSchema,
  mailboxListInputSchema,
  mailboxRemoveBatchInputSchema,
  mailboxRemoveInputSchema,
  mailMarkReadInputSchema,
  mailMessagesInputSchema,
  mailUnreadListInputSchema,
  mailUnreadSummaryInputSchema,
} from './schemas';

export function registerSysqTools(server: McpServer, sdk: SysqSdk) {
  server.registerTool(
    'sysq_mailbox_list',
    {
      title: 'List SYSQ Mailboxes',
      description: 'List purchased SYSQ mailboxes for the configured user.',
      inputSchema: mailboxListInputSchema,
    },
    (args) => handleMailboxList(sdk, args)
  );

  server.registerTool(
    'sysq_mailbox_buy',
    {
      title: 'Buy SYSQ Mailbox',
      description: 'Purchase one SYSQ mailbox with a custom prefix.',
      inputSchema: mailboxBuyInputSchema,
    },
    (args) => handleMailboxBuy(sdk, args)
  );

  server.registerTool(
    'sysq_mailbox_buy_random',
    {
      title: 'Buy Random SYSQ Mailboxes',
      description: 'Purchase one or more random SYSQ mailboxes.',
      inputSchema: mailboxBuyRandomInputSchema,
    },
    (args) => handleMailboxBuyRandom(sdk, args)
  );

  server.registerTool(
    'sysq_mailbox_buy_batch',
    {
      title: 'Buy SYSQ Mailboxes In Batch',
      description: 'Purchase multiple SYSQ mailboxes in one request.',
      inputSchema: mailboxBuyBatchInputSchema,
    },
    (args) => handleMailboxBuyBatch(sdk, args)
  );

  server.registerTool(
    'sysq_mailbox_bind',
    {
      title: 'Bind SYSQ Mailbox',
      description: 'Bind a mailbox asset to another SYSQ user account.',
      inputSchema: mailboxBindInputSchema,
    },
    (args) => handleMailboxBind(sdk, args)
  );

  server.registerTool(
    'sysq_mailbox_remove',
    {
      title: 'Remove SYSQ Mailbox',
      description: 'Remove a purchased SYSQ mailbox.',
      inputSchema: mailboxRemoveInputSchema,
    },
    (args) => handleMailboxRemove(sdk, args)
  );

  server.registerTool(
    'sysq_mailbox_remove_batch',
    {
      title: 'Remove SYSQ Mailboxes In Batch',
      description: 'Remove up to 20 purchased SYSQ mailboxes in one request.',
      inputSchema: mailboxRemoveBatchInputSchema,
    },
    (args) => handleMailboxRemoveBatch(sdk, args)
  );

  server.registerTool(
    'sysq_mail_unread_summary',
    {
      title: 'Get SYSQ Unread Summary',
      description: 'Fetch unread-mail counts across owned SYSQ mailboxes.',
      inputSchema: mailUnreadSummaryInputSchema,
    },
    () => handleMailUnreadSummary(sdk)
  );

  server.registerTool(
    'sysq_mail_unread_list',
    {
      title: 'List SYSQ Unread Mailboxes',
      description: 'List owned SYSQ mailboxes that currently have unread messages.',
      inputSchema: mailUnreadListInputSchema,
    },
    (args) => handleMailUnreadList(sdk, args)
  );

  server.registerTool(
    'sysq_mail_messages',
    {
      title: 'Fetch SYSQ Mail Messages',
      description: 'Fetch mailbox messages, optionally incrementally with afterId.',
      inputSchema: mailMessagesInputSchema,
    },
    (args) => handleMailMessages(sdk, args)
  );

  server.registerTool(
    'sysq_mail_mark_read',
    {
      title: 'Mark SYSQ Messages As Read',
      description: 'Mark up to 100 SYSQ messages as read for one mailbox.',
      inputSchema: mailMarkReadInputSchema,
    },
    (args) => handleMailMarkRead(sdk, args)
  );
}
