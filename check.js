// api/check.js (Vercel Serverless Function)

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter.' });
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'manual'
    });

    const location = response.headers.get('location');
    res.status(200).json({
      status: response.status,
      location: location || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
