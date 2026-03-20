export type SysqMcpConfig = {
  baseUrl: string;
  apiKey: string;
};

function requireTrimmed(name: string, value: string | undefined) {
  const normalized = value?.trim();

  if (!normalized) {
    throw new Error(`${name} is required.`);
  }

  return normalized;
}

export function loadSysqMcpConfig(env: NodeJS.ProcessEnv = process.env): SysqMcpConfig {
  return {
    baseUrl: requireTrimmed('SYSQ_BASE_URL', env.SYSQ_BASE_URL),
    apiKey: requireTrimmed('SYSQ_API_KEY', env.SYSQ_API_KEY),
  };
}
