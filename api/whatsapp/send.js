export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { number, text } = req.body;

  if (!number || !text) {
    return res.status(400).json({ error: 'number and text are required' });
  }

  try {
    const response = await fetch('http://2.24.111.162:8080/message/sendText/victoria', {
      method: 'POST',
      headers: {
        'apikey': 'ecodely2026',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ number, text })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return res.status(500).json({ error: error.message });
  }
}
