# `@suiyongsuiqi/sysq-mcp`

Official stdio-only MCP server for SYSQ mailbox automation.

`sysq-mcp` is the official MCP server for SYSQ. It currently focuses on local `stdio` usage, so MCP-compatible LLM clients such as Claude Desktop, Cursor, and Cherry Studio can directly use SYSQ mailbox capabilities. It reads SYSQ credentials from the local environment and maps LLM tool calls to `sysq-sdk` and SYSQ OpenAPI.

## Positioning

This package is a local MCP bridge for LLM clients.

- It runs on `stdio`
- It reads `SYSQ_BASE_URL` and `SYSQ_API_KEY` from the local environment
- It uses `@suiyongsuiqi/sysq-sdk` to call SYSQ OpenAPI

It does **not** provide a public `Streamable HTTP` endpoint in v1.

## Install

From npm:

```bash
npm i -g @suiyongsuiqi/sysq-mcp
```

From source:

```bash
git clone https://github.com/suiyongsuiqi/sysq-mcp.git
cd sysq-mcp
pnpm install
pnpm build
```

## Required Environment Variables

```bash
export SYSQ_BASE_URL="https://www.suiyongsuiqi.com/openapi/api"
export SYSQ_API_KEY="ak-xxxxxxxx"
```

Notes:

- `SYSQ_API_KEY` should be created from the SYSQ console
- the underlying SDK will automatically send `Tenant-Id: 000000`
- this MCP server is single-user per process, because one process maps to one SYSQ API key

## Run Locally

```bash
sysq-mcp
```

Or from source:

```bash
pnpm dev
```

## MCP Clients

### Claude Desktop

```json
{
  "mcpServers": {
    "sysq": {
      "command": "sysq-mcp",
      "env": {
        "SYSQ_BASE_URL": "https://www.suiyongsuiqi.com/openapi/api",
        "SYSQ_API_KEY": "ak-xxxxxxxx"
      }
    }
  }
}
```

### Cursor

```json
{
  "mcpServers": {
    "sysq": {
      "command": "node",
      "args": ["E:/path/to/sysq-mcp/dist/stdio.js"],
      "env": {
        "SYSQ_BASE_URL": "https://www.suiyongsuiqi.com/openapi/api",
        "SYSQ_API_KEY": "ak-xxxxxxxx"
      }
    }
  }
}
```

## Exposed Tools

- `sysq_mailbox_list`
- `sysq_mailbox_buy`
- `sysq_mailbox_buy_random`
- `sysq_mailbox_buy_batch`
- `sysq_mailbox_bind`
- `sysq_mailbox_remove`
- `sysq_mailbox_remove_batch`
- `sysq_mail_unread_summary`
- `sysq_mail_unread_list`
- `sysq_mail_messages`
- `sysq_mail_mark_read`

## Exposed Resources

- `sysq://mail/config`
- `sysq://mail/suffixes`
- `sysq://mail/stats`
- `sysq://user/mailboxes`
- `sysq://user/mailboxes/{current}/{size}`
- `sysq://user/unread-mailboxes`
- `sysq://user/unread-mailboxes/{current}/{size}`
- `sysq://mailbox/{mailBoxId}/messages/{current}/{size}`
- `sysq://mailbox/{mailBoxId}/messages/{current}/{size}/after/{afterId}`

## Exposed Prompts

- `sysq_mailbox_triage`
- `sysq_buy_mailbox_for_task`
- `sysq_cleanup_mailboxes`

## Development

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
```
