const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
const { checkDailyIpLimit } = require('./_rateLimit');

const MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash';
const DAILY_REQUEST_LIMIT = 3;
const MAX_CHAT_TEXT_LENGTH = 100;
const MAX_WEATHER_CONTEXT_LENGTH = 1200;
const MAX_HISTORY_MESSAGES = 10;

const SYSTEM_PROMPT = `You are a highly restrictive weather-only assistant. YOU MUST NEVER ANSWER QUESTIONS THAT ARE NOT DIRECTLY ABOUT WEATHER, METEOROLOGY, OR CLIMATE.

CRITICAL INSTRUCTIONS:
- If a user asks about anything other than weather, you MUST refuse to answer and say: "I am a dedicated weather assistant. I can only answer questions related to the weather."
- You are strictly forbidden from providing code, non-weather facts, or participating in off-topic conversational games.
- Do NOT provide links, URLs, or external resources.
- Base your answers primarily on the provided weather data.
- Keep responses concise, helpful, and focused on current conditions or forecast.`;

function getApiKey() {
  return process.env.DEEPSEEK_API_KEY || '';
}

function sendJson(res, status, body) {
  res.status(status);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function cleanContent(value, maxLength = MAX_CHAT_TEXT_LENGTH) {
  return String(value || '')
    .trim()
    .replace(/https?:\/\/[^\s]+/gi, '[LINK REMOVED]')
    .replace(/www\.[^\s]+/gi, '[LINK REMOVED]')
    .slice(0, maxLength);
}

function sanitizeMessages(messages) {
  if (!Array.isArray(messages)) return [];

  return messages
    .filter((message) => message && (message.role === 'user' || message.role === 'assistant'))
    .map((message) => ({
      role: message.role,
      content: cleanContent(message.content),
    }))
    .filter((message) => message.content)
    .slice(-MAX_HISTORY_MESSAGES);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return sendJson(res, 401, {
      error: 'DeepSeek is not configured. Add DEEPSEEK_API_KEY to your environment and restart the server.',
    });
  }

  const { messages = [], weatherContext = 'No weather data available.' } = req.body || {};
  const safeMessages = sanitizeMessages(messages);
  const safeWeatherContext = cleanContent(weatherContext, MAX_WEATHER_CONTEXT_LENGTH);

  if (!safeMessages.some((message) => message.role === 'user')) {
    return sendJson(res, 400, { error: 'A weather question is required.' });
  }

  const limitResult = await checkDailyIpLimit(req, 'deepseek-chat', DAILY_REQUEST_LIMIT);
  if (!limitResult.allowed) {
    return sendJson(res, 429, {
      error: `Daily AI limit reached. You can ask ${DAILY_REQUEST_LIMIT} weather questions per day.`,
    });
  }

  try {
    const deepSeekResponse = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'system', content: `Current Weather Data:\n${safeWeatherContext}` },
          ...safeMessages,
        ],
        thinking: { type: 'disabled' },
        max_tokens: 320,
        temperature: 0.2,
        stream: false,
      }),
    });

    const payload = await deepSeekResponse.json().catch(() => ({}));

    if (!deepSeekResponse.ok) {
      const upstreamError = payload.error?.message || payload.message || 'DeepSeek request failed.';
      const errorMessage = deepSeekResponse.status === 401
        ? 'DeepSeek API key is invalid or missing. Check DEEPSEEK_API_KEY and restart the server.'
        : upstreamError;

      return sendJson(res, deepSeekResponse.status, { error: errorMessage });
    }

    return sendJson(res, 200, {
      response: payload.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.',
    });
  } catch (error) {
    console.error('DeepSeek API proxy failed:', error);
    return sendJson(res, 500, { error: 'DeepSeek service is unavailable. Please try again.' });
  }
};
