export function createUsage({ used = 0, limit = 0 } = {}) {
  const remaining = Math.max(0, limit - used);
  return { used, limit, remaining };
}

export function isUsageExhausted(usage) {
  return !!usage && usage.used >= usage.limit;
}
