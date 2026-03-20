import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { loadSysqMcpConfig } from '../config/env';
import { createSysqMcpServer } from './factory';

export async function startStdioServer(env: NodeJS.ProcessEnv = process.env) {
  const config = loadSysqMcpConfig(env);
  const server = createSysqMcpServer(config);
  const transport = new StdioServerTransport();

  await server.connect(transport);
  console.error(`SYSQ MCP server running on stdio for ${config.baseUrl}`);

  return server;
}
