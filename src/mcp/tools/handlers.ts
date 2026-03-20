import type { SysqSdk } from '@suiyongsuiqi/sysq-sdk';

import { createErrorToolResult, createSuccessToolResult } from '../result';
import type {
  MailMarkReadInput,
  MailMessagesInput,
  MailUnreadListInput,
  MailboxBindInput,
  MailboxBuyBatchInput,
  MailboxBuyInput,
  MailboxBuyRandomInput,
  MailboxListInput,
  MailboxRemoveBatchInput,
  MailboxRemoveInput,
} from './schemas';

type SysqMailSdk = Pick<SysqSdk, 'mail'>;

async function runMailTool<T extends Record<string, unknown>>(
  execute: () => Promise<T>,
  summarize: (data: T) => string
) {
  try {
    const data = await execute();
    return createSuccessToolResult(summarize(data), data);
  } catch (error) {
    return createErrorToolResult(error);
  }
}

export function handleMailboxList(sdk: SysqMailSdk, args: MailboxListInput) {
  return runMailTool(
    () => sdk.mail.fetchUserMailBoxes({ current: args.current, size: args.size }),
    (data) =>
      `Fetched ${data.records.length} mailbox(es) from page ${data.current} of ${data.pages}.`
  );
}

export function handleMailboxBuy(sdk: SysqMailSdk, args: MailboxBuyInput) {
  return runMailTool(
    () => sdk.mail.purchaseMail({ prefix: args.prefix, suffix: args.suffix }),
    (data) => `Purchased mailbox ${data.fullAddress}.`
  );
}

export function handleMailboxBuyRandom(sdk: SysqMailSdk, args: MailboxBuyRandomInput) {
  return runMailTool(
    () => sdk.mail.purchaseRandomMail({ suffix: args.suffix, count: args.count }),
    (data) => `Purchased ${data.mailBoxes.length} random mailbox(es).`
  );
}

export function handleMailboxBuyBatch(sdk: SysqMailSdk, args: MailboxBuyBatchInput) {
  return runMailTool(
    () => sdk.mail.batchPurchaseMail({ items: args.items }),
    (data) => `Purchased ${data.mailBoxes.length} mailbox(es) in batch.`
  );
}

export function handleMailboxBind(sdk: SysqMailSdk, args: MailboxBindInput) {
  return runMailTool(async () => {
    if (!args.mailBoxId && !args.fullAddress) {
      throw new Error('Provide either mailBoxId or fullAddress.');
    }

    if (args.mailBoxId && args.fullAddress) {
      throw new Error('Pass only one of mailBoxId or fullAddress.');
    }

    return sdk.mail.bindMailToAccount({
      targetUserId: args.targetUserId,
      mailBoxId: args.mailBoxId,
      fullAddress: args.fullAddress,
    });
  }, (data) => `Bound mailbox ${data.fullAddress} to user ${data.userId}.`);
}

export function handleMailboxRemove(sdk: SysqMailSdk, args: MailboxRemoveInput) {
  return runMailTool(
    async () => ({
      mailBoxId: args.mailBoxId,
      success: await sdk.mail.removeUserMail({ mailBoxId: args.mailBoxId }),
    }),
    (data) => `Removed mailbox ${data.mailBoxId}.`
  );
}

export function handleMailboxRemoveBatch(sdk: SysqMailSdk, args: MailboxRemoveBatchInput) {
  return runMailTool(
    async () => ({
      mailBoxIds: args.mailBoxIds,
      success: await sdk.mail.batchRemoveUserMail({ mailBoxIds: args.mailBoxIds }),
    }),
    (data) => `Removed ${data.mailBoxIds.length} mailbox(es).`
  );
}

export function handleMailUnreadSummary(sdk: SysqMailSdk) {
  return runMailTool(
    () => sdk.mail.fetchUserUnreadSummary(),
    (data) =>
      `You have ${data.totalUnread} unread message(s) across ${data.unreadMailboxCount} mailbox(es).`
  );
}

export function handleMailUnreadList(sdk: SysqMailSdk, args: MailUnreadListInput) {
  return runMailTool(
    () => sdk.mail.fetchUserUnreadMailBoxes({ current: args.current, size: args.size }),
    (data) =>
      `Fetched ${data.records.length} unread mailbox(es) from page ${data.current} of ${data.pages}.`
  );
}

export function handleMailMessages(sdk: SysqMailSdk, args: MailMessagesInput) {
  return runMailTool(
    () =>
      sdk.mail.fetchMailList({
        mailBoxId: args.mailBoxId,
        current: args.current,
        size: args.size,
        afterId: args.afterId,
      }),
    (data) => `Fetched ${data.messages.records.length} message(s) from ${data.fullAddress}.`
  );
}

export function handleMailMarkRead(sdk: SysqMailSdk, args: MailMarkReadInput) {
  return runMailTool(
    () =>
      sdk.mail.markMessagesRead({
        mailBoxId: args.mailBoxId,
        messageIds: args.messageIds,
      }),
    (data) => `Marked ${data.updatedCount} message(s) as read.`
  );
}
