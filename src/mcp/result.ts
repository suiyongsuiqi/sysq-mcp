import { normalizeSysqToolError } from '../sysq/error';

type StructuredContent = Record<string, unknown>;

export function createSuccessToolResult(summary: string, structuredContent: StructuredContent) {
  return {
    content: [{ type: 'text' as const, text: summary }],
    structuredContent,
  };
}

export function createErrorToolResult(error: unknown) {
  const normalized = normalizeSysqToolError(error);

  return {
    isError: true,
    content: [{ type: 'text' as const, text: normalized.message }],
    structuredContent: {
      error: normalized,
    },
  };
}

export function createTextPrompt(text: string) {
  return {
    messages: [
      {
        role: 'user' as const,
        content: {
          type: 'text' as const,
          text,
        },
      },
    ],
  };
}
