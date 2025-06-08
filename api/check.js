export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const { url, params } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter.' });
  }

  const redirParams = params ? params.split(',') : ['url', 'next', 'redirect'];
  const payloads = [
    'https://example.com',
    'https://evil.com',
    '//evil.com',
    '/\\evil.com',
    '///evil.com',
    'https:@evil.com'
  ];

  const results = [];

  for (const param of redirParams) {
    for (const payload of payloads) {
      try {
        const testUrl = new URL(url);
        testUrl.searchParams.set(param, payload);

        const response = await fetch(testUrl.href, { method: 'GET', redirect: 'manual' });
        const location = response.headers.get('location');

        results.push({
          param,
          payload,
          testUrl: testUrl.href,
          status: response.status,
          location: location || null
        });

      } catch (err) {
        results.push({
          param,
          payload,
          testUrl: null,
          status: 'error',
          error: err.message
        });
      }
    }
  }

  res.status(200).json({ results });
}
