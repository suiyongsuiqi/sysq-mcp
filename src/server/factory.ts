import { createSysqSdk } from '@suiyongsuiqi/sysq-sdk';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import type { SysqMcpConfig } from '../config/env';
import { SYSQ_MCP_SERVER_NAME, SYSQ_MCP_SERVER_VERSION } from '../config/server';
import { registerSysqPrompts } from '../mcp/prompts/register';
import { registerSysqResources } from '../mcp/resources/register';
import { registerSysqTools } from '../mcp/tools/register';

export function createSysqMcpServer(config: SysqMcpConfig) {
  const sdk = createSysqSdk({
    baseUrl: config.baseUrl,
    apiKey: config.apiKey,
  });

  const server = new McpServer(
    {
      name: SYSQ_MCP_SERVER_NAME,
      version: SYSQ_MCP_SERVER_VERSION,
    },
    {
      capabilities: {
        logging: {},
      },
    }
  );

  registerSysqTools(server, sdk);
  registerSysqResources(server, sdk);
  registerSysqPrompts(server);

  return server;
}
