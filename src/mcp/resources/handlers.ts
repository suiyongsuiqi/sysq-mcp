import type { SysqSdk } from '@suiyongsuiqi/sysq-sdk';
import type { Variables } from '@modelcontextprotocol/sdk/shared/uriTemplate.js';

import { DEFAULT_PAGE_CURRENT, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../../config/server';
import { normalizeSysqToolError } from '../../sysq/error';

type SysqMailSdk = Pick<SysqSdk, 'mail'>;

type ResourceResult = {
  contents: Array<{
    uri: string;
    mimeType: string;
    text: string;
  }>;
};

function asPositiveInt(value: string, label: string, defaultValue: number, max?: number) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${label} must be a positive integer.`);
  }

  if (typeof max === 'number' && parsed > max) {
    throw new Error(`${label} must be less than or equal to ${max}.`);
  }

  return parsed || defaultValue;
}

function getRequiredVariable(variables: Variables, name: string) {
  const value = variables[name];

  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${name} is required in the resource URI.`);
  }

  return value.trim();
}

function createJsonResourceResult(uri: URL, data: unknown, summary: string): ResourceResult {
  return {
    contents: [
      {
        uri: uri.href,
        mimeType: 'application/json',
        text: JSON.stringify(data, null, 2),
      },
      {
        uri: `${uri.href}#summary`,
        mimeType: 'text/plain',
        text: summary,
      },
    ],
  };
}

function rethrowAsResourceError(error: unknown): never {
  const normalized = normalizeSysqToolError(error);
  throw new Error(normalized.message);
}

export async function readMailConfigResource(sdk: SysqMailSdk, uri: URL) {
  try {
    const data = await sdk.mail.fetchMailConfig();
    return createJsonResourceResult(
      uri,
      data,
      `Loaded mail config with buy price ${data.price.buy} and bind price ${data.price.bind}.`
    );
  } catch (error) {
    rethrowAsResourceError(error);
  }
}

export async function readMailSuffixesResource(sdk: SysqMailSdk, uri: URL) {
  try {
    const data = await sdk.mail.fetchMailSuffixes();
    return createJsonResourceResult(uri, data, `Loaded ${data.length} available mailbox suffix(es).`);
  } catch (error) {
    rethrowAsResourceError(error);
  }
}

export async function readMailStatsResource(sdk: SysqMailSdk, uri: URL) {
  try {
    const data = await sdk.mail.fetchMailStats();
    return createJsonResourceResult(
      uri,
      data,
      `Loaded platform stats: ${data.total} total messages and ${data.mailBoxCount} mailboxes.`
    );
  } catch (error) {
    rethrowAsResourceError(error);
  }
}

export async function readDefaultUserMailboxesResource(sdk: SysqMailSdk, uri: URL) {
  try {
    const data = await sdk.mail.fetchUserMailBoxes({
      current: DEFAULT_PAGE_CURRENT,
      size: DEFAULT_PAGE_SIZE,
    });

    return createJsonResourceResult(
      uri,
      data,
      `Loaded ${data.records.length} mailbox(es) from page ${data.current} of ${data.pages}.`
    );
  } catch (error) {
    rethrowAsResourceError(error);
  }
}

export async function readPagedUserMailboxesResource(
  sdk: SysqMailSdk,
  uri: URL,
  params: Variables
) {
  try {
    const current = asPositiveInt(
      getRequiredVariable(params, 'current'),
      'current',
      DEFAULT_PAGE_CURRENT
    );
    const size = asPositiveInt(
      getRequiredVariable(params, 'size'),
      'size',
      DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE
    );
    const data = await sdk.mail.fetchUserMailBoxes({ current, size });

    return createJsonResourceResult(
      uri,
      data,
      `Loaded ${data.records.length} mailbox(es) from page ${data.current} of ${data.pages}.`
    );
  } catch (error) {
    rethrowAsResourceError(error);
  }
}

export async function readDefaultUnreadMailboxesResource(sdk: SysqMailSdk, uri: URL) {
  try {
    const data = await sdk.mail.fetchUserUnreadMailBoxes({
      current: DEFAULT_PAGE_CURRENT,
      size: DEFAULT_PAGE_SIZE,
    });

    return createJsonResourceResult(
      uri,
      data,
      `Loaded ${data.records.length} unread mailbox(es) from page ${data.current} of ${data.pages}.`
    );
  } catch (error) {
    rethrowAsResourceError(error);
  }
}

export async function readPagedUnreadMailboxesResource(
  sdk: SysqMailSdk,
  uri: URL,
  params: Variables
) {
  try {
    const current = asPositiveInt(
      getRequiredVariable(params, 'current'),
      'current',
      DEFAULT_PAGE_CURRENT
    );
    const size = asPositiveInt(
      getRequiredVariable(params, 'size'),
      'size',
      DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE
    );
    const data = await sdk.mail.fetchUserUnreadMailBoxes({ current, size });

    return createJsonResourceResult(
      uri,
      data,
      `Loaded ${data.records.length} unread mailbox(es) from page ${data.current} of ${data.pages}.`
    );
  } catch (error) {
    rethrowAsResourceError(error);
  }
}

export async function readPagedMailboxMessagesResource(
  sdk: SysqMailSdk,
  uri: URL,
  params: Variables
) {
  try {
    const current = asPositiveInt(
      getRequiredVariable(params, 'current'),
      'current',
      DEFAULT_PAGE_CURRENT
    );
    const size = asPositiveInt(
      getRequiredVariable(params, 'size'),
      'size',
      DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE
    );
    const data = await sdk.mail.fetchMailList({
      mailBoxId: getRequiredVariable(params, 'mailBoxId'),
      current,
      size,
    });

    return createJsonResourceResult(
      uri,
      data,
      `Loaded ${data.messages.records.length} message(s) from ${data.fullAddress}.`
    );
  } catch (error) {
    rethrowAsResourceError(error);
  }
}

export async function readIncrementalMailboxMessagesResource(
  sdk: SysqMailSdk,
  uri: URL,
  params: Variables
) {
  try {
    const current = asPositiveInt(
      getRequiredVariable(params, 'current'),
      'current',
      DEFAULT_PAGE_CURRENT
    );
    const size = asPositiveInt(
      getRequiredVariable(params, 'size'),
      'size',
      DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE
    );
    const data = await sdk.mail.fetchMailList({
      mailBoxId: getRequiredVariable(params, 'mailBoxId'),
      current,
      size,
      afterId: getRequiredVariable(params, 'afterId'),
    });

    return createJsonResourceResult(
      uri,
      data,
      `Loaded ${data.messages.records.length} incremental message(s) from ${data.fullAddress}.`
    );
  } catch (error) {
    rethrowAsResourceError(error);
  }
}
