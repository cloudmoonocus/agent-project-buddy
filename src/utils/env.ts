export function getEnv(key: string): string {
  // eslint-disable-next-line node/prefer-global/process
  return process.env[key] || ''
}
