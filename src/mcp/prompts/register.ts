import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { createTextPrompt } from '../result';

export function registerSysqPrompts(server: McpServer) {
  server.registerPrompt(
    'sysq_mailbox_triage',
    {
      title: 'SYSQ Mailbox Triage',
      description: 'Guide the model to inspect one mailbox and summarize actionable unread mail.',
      argsSchema: {
        mailBoxId: z.string().trim().min(1).describe('Mailbox ID to inspect'),
      },
    },
    ({ mailBoxId }) =>
      createTextPrompt(
        [
          `Triage SYSQ mailbox ${mailBoxId}.`,
          'First call sysq_mail_messages for this mailbox.',
          'Summarize unread and recent messages by priority.',
          'Highlight OTP codes, verification links, deadlines, and suspicious mail.',
          'Do not delete or mark messages as read unless the user explicitly asks.',
        ].join('\n')
      )
  );

  server.registerPrompt(
    'sysq_buy_mailbox_for_task',
    {
      title: 'Buy SYSQ Mailbox For A Task',
      description: 'Guide the model to inspect suffixes and then buy the right mailbox.',
      argsSchema: {
        purpose: z.string().trim().min(1).describe('Why the mailbox is needed'),
        preferredSuffix: z.string().trim().min(1).optional().describe('Preferred suffix if any'),
        prefixHint: z.string().trim().min(1).optional().describe('Preferred prefix if any'),
      },
    },
    ({ purpose, preferredSuffix, prefixHint }) =>
      createTextPrompt(
        [
          `Buy a SYSQ mailbox for this purpose: ${purpose}.`,
          'First read sysq://mail/suffixes and sysq://mail/config.',
          preferredSuffix ? `Prefer suffix: ${preferredSuffix}.` : 'Choose a suffix only from available suffix resources.',
          prefixHint ? `Use this prefix hint if available: ${prefixHint}.` : 'Pick a concise, task-relevant prefix.',
          'Explain the expected purchase action before calling sysq_mailbox_buy or sysq_mailbox_buy_random.',
        ].join('\n')
      )
  );

  server.registerPrompt(
    'sysq_cleanup_mailboxes',
    {
      title: 'Cleanup SYSQ Mailboxes',
      description: 'Guide the model to review mailbox inventory before proposing cleanup.',
      argsSchema: {
        selectionRule: z.string().trim().min(1).describe('Rule for selecting mailboxes to remove'),
      },
    },
    ({ selectionRule }) =>
      createTextPrompt(
        [
          `Clean up SYSQ mailboxes using this rule: ${selectionRule}.`,
          'First call sysq_mailbox_list and show which mailboxes match the rule.',
          'State clearly which mailboxes would be removed and why.',
          'Only call sysq_mailbox_remove or sysq_mailbox_remove_batch after explicit user confirmation.',
        ].join('\n')
      )
  );
}
