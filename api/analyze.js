module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Show all env var NAMES (not values) for debugging
  const allEnvKeys = Object.keys(process.env).filter(k => !k.startsWith('npm_'));
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'No API key',
      availableEnvKeys: allEnvKeys,
      hasAnthropicKey: !!apiKey,
    });
  }

  try {
    const messages = req.body?.messages || [{role:'user',content:'Diga "funcionou" em português'}];
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 100, messages }),
    });
    const text = await response.text();
    return res.status(response.status).json({ ok: true, result: text.slice(0, 300) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
