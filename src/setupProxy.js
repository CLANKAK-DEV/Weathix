const deepSeekHandler = require('../api/deepseek-chat');
const weatherTileHandler = require('../api/weather-tile');

function parseJsonBody(req, res, done) {
  let rawBody = '';

  req.on('data', (chunk) => {
    rawBody += chunk;
  });

  req.on('end', () => {
    try {
      req.body = rawBody ? JSON.parse(rawBody) : {};
      done();
    } catch {
      res.status(400).setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Invalid JSON request body.' }));
    }
  });
}

module.exports = function setupProxy(app) {
  app.use('/api/deepseek-chat', (req, res, next) => {
    if (req.method !== 'POST') return deepSeekHandler(req, res);

    parseJsonBody(req, res, () => deepSeekHandler(req, res));
    req.on('error', next);
  });

  app.use('/api/weather-tile', (req, res) => {
    const requestUrl = new URL(req.url, 'http://localhost');
    req.query = Object.fromEntries(requestUrl.searchParams.entries());
    weatherTileHandler(req, res);
  });
};
