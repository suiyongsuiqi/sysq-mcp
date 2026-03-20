import { normalizeSysqError, type SysqNormalizedError } from '@suiyongsuiqi/sysq-sdk';

export type SysqToolErrorPayload = {
  type: SysqNormalizedError['type'];
  errorKey: string;
  code?: number;
  traceId?: string;
  params?: Record<string, string | number | boolean | null>;
  details?: Array<{
    field: string;
    reason: string;
    params?: Record<string, string | number | boolean | null>;
  }>;
  message: string;
};

function toToolMessage(error: SysqNormalizedError) {
  switch (error.type) {
    case 'network':
      return error.messageFallback ?? 'Network request to SYSQ failed.';
    case 'validation':
      return error.messageFallback ?? `SYSQ validation failed: ${error.errorKey}`;
    case 'biz':
      return error.messageFallback ?? `SYSQ request failed: ${error.errorKey}`;
    case 'legacy':
      return error.messageFallback ?? `SYSQ request failed: ${error.errorKey}`;
  }
}

export function normalizeSysqToolError(error: unknown): SysqToolErrorPayload {
  const normalized = normalizeSysqError(error);
  const message = toToolMessage(normalized);

  switch (normalized.type) {
    case 'network':
      return {
        type: normalized.type,
        errorKey: normalized.errorKey,
        message,
      };
    case 'validation':
      return {
        type: normalized.type,
        errorKey: normalized.errorKey,
        code: normalized.code,
        traceId: normalized.traceId,
        details: normalized.details,
        message,
      };
    case 'biz':
      return {
        type: normalized.type,
        errorKey: normalized.errorKey,
        code: normalized.code,
        traceId: normalized.traceId,
        params: normalized.params,
        message,
      };
    case 'legacy':
      return {
        type: normalized.type,
        errorKey: normalized.errorKey,
        code: normalized.code,
        message,
      };
  }
}
