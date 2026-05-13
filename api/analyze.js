module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Return diagnostic info
  const diag = {
    hasApiKey: !!apiKey,
    apiKeyPrefix: apiKey ? apiKey.slice(0, 10) + '...' : null,
    method: req.method,
    bodyType: typeof req.body,
    body: req.body,
  };

  if (!apiKey) return res.status(500).json({ error: 'No API key', diag });

  try {
    const messages = req.body?.messages || [{role:'user',content:'Say "API working" in Portuguese'}];
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 100,
        messages,
      }),
    });

    const text = await response.text();
    return res.status(response.status).json({ 
      ok: response.ok, 
      status: response.status,
      diag,
      result: text.slice(0, 500) 
    });
  } catch (err) {
    return res.status(500).json({ error: err.message, diag });
  }
};
