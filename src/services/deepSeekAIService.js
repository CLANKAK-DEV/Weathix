export const MAX_CHAT_TEXT_LENGTH = 100;
const HISTORY_LIMIT = 10;
const DAILY_REQUEST_LIMIT = 3;
const STORAGE_KEY = 'deepseek_api_usage';

function readUsage() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"date":"","count":0}');
}

function checkDailyLimit() {
  const today = new Date().toDateString();
  const usage = readUsage();

  if (usage.date !== today) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: 0 }));
    return true;
  }

  return usage.count < DAILY_REQUEST_LIMIT;
}

function incrementUsage() {
  const today = new Date().toDateString();
  const usage = readUsage();
  usage.date = today;
  usage.count = (usage.count || 0) + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
}

function sanitizeInput(text) {
  let sanitized = text.trim();
  sanitized = sanitized.replace(/https?:\/\/[^\s]+/gi, '[LINK REMOVED]');
  sanitized = sanitized.replace(/www\.[^\s]+/gi, '[LINK REMOVED]');

  if (sanitized.length > MAX_CHAT_TEXT_LENGTH) {
    sanitized = sanitized.substring(0, MAX_CHAT_TEXT_LENGTH);
  }

  return sanitized;
}

function buildWeatherContext(weatherData) {
  if (!weatherData) return 'No weather data available.';

  const {
    temp,
    feels_like,
    humidity,
    wind_speed,
    label,
    name,
    country,
    uv_index,
    visibility,
    dew_point,
  } = weatherData;

  return `
Current Weather for ${name}, ${country}:
- Temperature: ${Math.round(temp)}C (feels like ${Math.round(feels_like)}C)
- Condition: ${label}
- Humidity: ${humidity}%
- Wind Speed: ${Math.round(wind_speed)} km/h
- UV Index: ${uv_index?.toFixed(1) || 'N/A'}
- Visibility: ${(visibility / 1000).toFixed(1)} km
- Dew Point: ${Math.round(dew_point)}C
`.trim();
}

function getHistoryMessages(messages) {
  const sourceMessages = Array.isArray(messages)
    ? messages
    : [{ role: 'user', text: String(messages || '') }];

  return sourceMessages
    .filter((m) => m?.text && !m.isError)
    .map((m) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.role === 'user' ? sanitizeInput(m.text) : m.text,
    }))
    .slice(-HISTORY_LIMIT);
}

// Calls the local API proxy. The proxy owns the official DeepSeek credentials.
export async function getWeatherAIResponse(messages, weatherData) {
  if (!checkDailyLimit()) {
    return {
      error: `Daily limit reached. You can ask ${DAILY_REQUEST_LIMIT} weather questions per day. Try again tomorrow.`,
      limitReached: true,
    };
  }

  try {
    const response = await fetch('/api/deepseek-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: getHistoryMessages(messages),
        weatherContext: buildWeatherContext(weatherData),
      }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        error: payload.error || 'Failed to get AI response. Please try again.',
        networkError: response.status >= 500,
        authError: response.status === 401,
        rateLimit: response.status === 429,
      };
    }

    incrementUsage();

    return {
      response: payload.response || 'Sorry, I could not generate a response.',
      usage: {
        used: readUsage().count,
        limit: DAILY_REQUEST_LIMIT,
      },
    };
  } catch (error) {
    console.error('DeepSeek proxy request failed:', error);
    return { error: 'Failed to reach the AI service. Please try again.', networkError: true };
  }
}

export function getDailyUsage() {
  const usage = readUsage();
  return {
    used: usage.count || 0,
    limit: DAILY_REQUEST_LIMIT,
    remaining: DAILY_REQUEST_LIMIT - (usage.count || 0),
  };
}

export function resetDailyUsage() {
  localStorage.removeItem(STORAGE_KEY);
}
