import type { SysqSdk } from '@suiyongsuiqi/sysq-sdk';
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';

import {
  readDefaultUnreadMailboxesResource,
  readDefaultUserMailboxesResource,
  readIncrementalMailboxMessagesResource,
  readMailConfigResource,
  readMailStatsResource,
  readMailSuffixesResource,
  readPagedMailboxMessagesResource,
  readPagedUnreadMailboxesResource,
  readPagedUserMailboxesResource,
} from './handlers';

export function registerSysqResources(server: McpServer, sdk: SysqSdk) {
  server.registerResource(
    'sysq_mail_config',
    'sysq://mail/config',
    {
      title: 'SYSQ Mail Config',
      description: 'Mail pricing and quota configuration from SYSQ.',
      mimeType: 'application/json',
    },
    (uri) => readMailConfigResource(sdk, uri)
  );

  server.registerResource(
    'sysq_mail_suffixes',
    'sysq://mail/suffixes',
    {
      title: 'SYSQ Mail Suffixes',
      description: 'Available mailbox suffixes for SYSQ purchases.',
      mimeType: 'application/json',
    },
    (uri) => readMailSuffixesResource(sdk, uri)
  );

  server.registerResource(
    'sysq_mail_stats',
    'sysq://mail/stats',
    {
      title: 'SYSQ Mail Stats',
      description: 'Platform-level SYSQ mailbox and message statistics.',
      mimeType: 'application/json',
    },
    (uri) => readMailStatsResource(sdk, uri)
  );

  server.registerResource(
    'sysq_user_mailboxes_default',
    'sysq://user/mailboxes',
    {
      title: 'SYSQ User Mailboxes',
      description: 'First page of purchased SYSQ mailboxes for the configured user.',
      mimeType: 'application/json',
    },
    (uri) => readDefaultUserMailboxesResource(sdk, uri)
  );

  server.registerResource(
    'sysq_user_mailboxes_paged',
    new ResourceTemplate('sysq://user/mailboxes/{current}/{size}', { list: undefined }),
    {
      title: 'SYSQ User Mailboxes By Page',
      description: 'Paged mailbox listing using path params current/size.',
      mimeType: 'application/json',
    },
    (uri, params) => readPagedUserMailboxesResource(sdk, uri, params)
  );

  server.registerResource(
    'sysq_user_unread_mailboxes_default',
    'sysq://user/unread-mailboxes',
    {
      title: 'SYSQ Unread Mailboxes',
      description: 'First page of SYSQ mailboxes that currently have unread mail.',
      mimeType: 'application/json',
    },
    (uri) => readDefaultUnreadMailboxesResource(sdk, uri)
  );

  server.registerResource(
    'sysq_user_unread_mailboxes_paged',
    new ResourceTemplate('sysq://user/unread-mailboxes/{current}/{size}', { list: undefined }),
    {
      title: 'SYSQ Unread Mailboxes By Page',
      description: 'Paged unread mailbox listing using path params current/size.',
      mimeType: 'application/json',
    },
    (uri, params) => readPagedUnreadMailboxesResource(sdk, uri, params)
  );

  server.registerResource(
    'sysq_mailbox_messages_paged',
    new ResourceTemplate('sysq://mailbox/{mailBoxId}/messages/{current}/{size}', {
      list: undefined,
    }),
    {
      title: 'SYSQ Mailbox Messages By Page',
      description: 'Read mailbox messages using path params mailBoxId/current/size.',
      mimeType: 'application/json',
    },
    (uri, params) => readPagedMailboxMessagesResource(sdk, uri, params)
  );

  server.registerResource(
    'sysq_mailbox_messages_incremental',
    new ResourceTemplate(
      'sysq://mailbox/{mailBoxId}/messages/{current}/{size}/after/{afterId}',
      { list: undefined }
    ),
    {
      title: 'SYSQ Mailbox Messages Incremental',
      description: 'Read mailbox messages incrementally using afterId in the path.',
      mimeType: 'application/json',
    },
    (uri, params) => readIncrementalMailboxMessagesResource(sdk, uri, params)
  );
}
