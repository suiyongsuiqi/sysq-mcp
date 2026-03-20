import { startStdioServer } from './server/stdio';

startStdioServer().catch((error) => {
  console.error('Fatal error in SYSQ MCP server:', error);
  process.exit(1);
});
