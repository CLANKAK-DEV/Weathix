const memoryUsage = new Map();

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getClientIp(req) {
  const forwardedFor = req.headers['x-forwarded-for'];
  const forwardedIp = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(',')[0];
  const realIp = req.headers['x-real-ip'];

  return String(forwardedIp || realIp || req.socket?.remoteAddress || 'unknown').trim();
}

function getRedisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  return {
    url: url.replace(/\/$/, ''),
    token,
  };
}

async function redisCommand(command) {
  const config = getRedisConfig();
  if (!config) return null;

  const response = await fetch(`${config.url}/${command.map(encodeURIComponent).join('/')}`, {
    headers: {
      Authorization: `Bearer ${config.token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Redis command failed with status ${response.status}`);
  }

  return response.json();
}

function checkMemoryLimit(key, limit) {
  const used = memoryUsage.get(key) || 0;
  if (used >= limit) return { allowed: false, used, limit };

  const nextUsed = used + 1;
  memoryUsage.set(key, nextUsed);

  return { allowed: true, used: nextUsed, limit };
}

async function checkRedisLimit(key, limit, ttlSeconds) {
  const incremented = await redisCommand(['incr', key]);
  const used = Number(incremented?.result || 0);

  if (used === 1) {
    await redisCommand(['expire', key, String(ttlSeconds)]);
  }

  return {
    allowed: used <= limit,
    used,
    limit,
  };
}

async function checkDailyIpLimit(req, namespace, limit) {
  const day = getTodayKey();
  const ip = getClientIp(req);
  const key = `ratelimit:${namespace}:${day}:${ip}`;
  const ttlSeconds = 60 * 60 * 36;

  try {
    if (getRedisConfig()) {
      return await checkRedisLimit(key, limit, ttlSeconds);
    }
  } catch (error) {
    console.error('Persistent rate limit failed, using memory fallback:', error.message);
  }

  return checkMemoryLimit(key, limit);
}

module.exports = {
  checkDailyIpLimit,
  getClientIp,
};
