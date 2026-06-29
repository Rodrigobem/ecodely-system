export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { number, text } = req.body;

  console.log('[whatsapp/send] chamada recebida — number:', number, '| text:', text);

  if (!number || !text) {
    return res.status(400).json({ error: 'number and text are required' });
  }

  const evolutionUrl = process.env.EVOLUTION_URL;
  const evolutionKey = process.env.EVOLUTION_KEY;
  const evolutionInstance = process.env.EVOLUTION_INSTANCE;

  try {
    const response = await fetch(`${evolutionUrl}/message/sendText/${evolutionInstance}`, {
      method: 'POST',
      headers: {
        'apikey': evolutionKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ number, text })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('[whatsapp/send] erro:', error);
    return res.status(500).json({ error: error.message });
  }
}
