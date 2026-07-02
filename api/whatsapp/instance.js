// api/whatsapp/instance.js — proxy de gerenciamento de instâncias Evolution API
// mantém EVOLUTION_KEY fora do browser; usado pela aba "Instâncias" do WhatsApp IA

// timeout curto pra nunca deixar a função serverless (e a tela que a chama) pendurada
// esperando o VPS Evolution API — se estiver fora do ar/lento, falha rápido e explícito
async function fetchComTimeout(url, opts = {}, ms = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...opts, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, instanceName } = req.body || {};
  const evolutionUrl = process.env.EVOLUTION_URL;
  const evolutionKey = process.env.EVOLUTION_KEY;

  if (!evolutionUrl || !evolutionKey) {
    return res.status(500).json({ error: 'EVOLUTION_URL/EVOLUTION_KEY não configurados' });
  }

  try {
    if (action === 'create') {
      if (!instanceName) return res.status(400).json({ error: 'instanceName obrigatório' });
      const r = await fetchComTimeout(`${evolutionUrl}/instance/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: evolutionKey },
        body: JSON.stringify({ instanceName, qrcode: true, integration: 'WHATSAPP-BAILEYS' }),
      });
      const data = await r.json().catch(() => ({}));
      return res.status(r.status).json(data);
    }

    if (action === 'connect') {
      if (!instanceName) return res.status(400).json({ error: 'instanceName obrigatório' });
      const r = await fetchComTimeout(`${evolutionUrl}/instance/connect/${instanceName}`, {
        headers: { apikey: evolutionKey },
      });
      const data = await r.json().catch(() => ({}));
      // versões da Evolution API divergem no formato — normaliza pros campos mais comuns
      const base64 = data?.base64 || data?.qrcode?.base64 || data?.code || null;
      return res.status(200).json({ base64, raw: data });
    }

    if (action === 'logout') {
      if (!instanceName) return res.status(400).json({ error: 'instanceName obrigatório' });
      const r = await fetchComTimeout(`${evolutionUrl}/instance/logout/${instanceName}`, {
        method: 'DELETE',
        headers: { apikey: evolutionKey },
      });
      const data = await r.json().catch(() => ({}));
      return res.status(200).json({ ok: true, raw: data });
    }

    if (action === 'status') {
      // "nice to have" — em caso de falha/timeout, devolve lista vazia em vez de erro,
      // pra tela cair no fallback (status já salvo no banco) sem travar
      try {
        const r = await fetchComTimeout(`${evolutionUrl}/instance/fetchInstances`, {
          headers: { apikey: evolutionKey },
        }, 6000);
        const data = await r.json().catch(() => ([]));
        return res.status(200).json({ instances: Array.isArray(data) ? data : data?.instances || [] });
      } catch (e) {
        console.error('[whatsapp/instance] status indisponível/lento:', e.message);
        return res.status(200).json({ instances: [], warning: 'Evolution API indisponível ou lenta' });
      }
    }

    return res.status(400).json({ error: 'action inválida (use create|connect|logout|status)' });
  } catch (error) {
    console.error('[whatsapp/instance] erro:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
