import { z } from 'zod';

import {
  DEFAULT_PAGE_CURRENT,
  DEFAULT_PAGE_SIZE,
  MAX_BATCH_REMOVE,
  MAX_MARK_READ,
  MAX_PAGE_SIZE,
} from '../../config/server';

const trimmedString = z.string().trim().min(1);
const optionalTrimmedString = z.string().trim().min(1).optional();
const positivePageSchema = z.number().int().positive().default(DEFAULT_PAGE_CURRENT);
const pageSizeSchema = z.number().int().positive().max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE);

export const mailboxListInputSchema = z.object({
  current: positivePageSchema.optional().default(DEFAULT_PAGE_CURRENT),
  size: pageSizeSchema.optional().default(DEFAULT_PAGE_SIZE),
});

export const mailboxBuyInputSchema = z.object({
  prefix: trimmedString,
  suffix: optionalTrimmedString,
});

export const mailboxBuyRandomInputSchema = z.object({
  suffix: optionalTrimmedString,
  count: z.number().int().positive().optional().default(1),
});

export const mailboxBuyBatchInputSchema = z.object({
  items: z
    .array(
      z.object({
        prefix: trimmedString,
        suffix: optionalTrimmedString,
      })
    )
    .min(1),
});

export const mailboxBindInputSchema = z.object({
  targetUserId: trimmedString,
  mailBoxId: optionalTrimmedString,
  fullAddress: optionalTrimmedString,
});

export const mailboxRemoveInputSchema = z.object({
  mailBoxId: trimmedString,
});

export const mailboxRemoveBatchInputSchema = z.object({
  mailBoxIds: z.array(trimmedString).min(1).max(MAX_BATCH_REMOVE),
});

export const mailUnreadSummaryInputSchema = z.object({});

export const mailUnreadListInputSchema = mailboxListInputSchema;

export const mailMessagesInputSchema = z.object({
  mailBoxId: trimmedString,
  current: positivePageSchema.optional().default(DEFAULT_PAGE_CURRENT),
  size: pageSizeSchema.optional().default(DEFAULT_PAGE_SIZE),
  afterId: optionalTrimmedString,
});

export const mailMarkReadInputSchema = z.object({
  mailBoxId: trimmedString,
  messageIds: z.array(trimmedString).min(1).max(MAX_MARK_READ),
});

export type MailboxListInput = z.infer<typeof mailboxListInputSchema>;
export type MailboxBuyInput = z.infer<typeof mailboxBuyInputSchema>;
export type MailboxBuyRandomInput = z.infer<typeof mailboxBuyRandomInputSchema>;
export type MailboxBuyBatchInput = z.infer<typeof mailboxBuyBatchInputSchema>;
export type MailboxBindInput = z.infer<typeof mailboxBindInputSchema>;
export type MailboxRemoveInput = z.infer<typeof mailboxRemoveInputSchema>;
export type MailboxRemoveBatchInput = z.infer<typeof mailboxRemoveBatchInputSchema>;
export type MailUnreadListInput = z.infer<typeof mailUnreadListInputSchema>;
export type MailMessagesInput = z.infer<typeof mailMessagesInputSchema>;
export type MailMarkReadInput = z.infer<typeof mailMarkReadInputSchema>;
