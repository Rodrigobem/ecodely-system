import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xklvqcxhtariqqhvnseh.supabase.co';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Protect: only Vercel cron or local dev
  if (req.headers['x-vercel-cron'] !== '1' && process.env.NODE_ENV !== 'development') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabaseKey = process.env.VITE_SUPA_KEY;
  if (!supabaseKey) {
    return res.status(500).json({ error: 'Missing env var: VITE_SUPA_KEY' });
  }
  const supabase = createClient(SUPABASE_URL, supabaseKey);

  const wRodrigo = process.env.RODRIGO_WHATSAPP || '5511968134927';
  const evolutionUrl = process.env.EVOLUTION_URL;
  const evolutionKey = process.env.EVOLUTION_KEY;
  const evolutionInstance = process.env.EVOLUTION_INSTANCE;

  if (!evolutionUrl) {
    return res.status(500).json({ error: 'Missing env var: EVOLUTION_URL' });
  }

  // Build date strings in dd/mm/yyyy format for today + next 3 days
  const agora = new Date();
  const toBR = d => {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };
  const toWeekday = d => d.toLocaleDateString('pt-BR', { weekday: 'long' });
  const toDateFull = d => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const hoje = toBR(agora);
  const proximosDias = [0, 1, 2, 3].map(n => {
    const d = new Date(agora);
    d.setDate(d.getDate() + n);
    return toBR(d);
  });

  // Fetch all lancamentos (table stores date as text in dd/mm/yyyy)
  const { data: lancamentos, error } = await supabase
    .from('lancamentos')
    .select('id,data,descricao,entrada,saida,confirmado,categoria,tipo')
    .order('data');

  if (error) {
    console.error('[cron/financeiro-diario] supabase error:', error);
    return res.status(500).json({ error: error.message });
  }

  const fmt = v => `R$ ${Number(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Saldo em caixa: todas as entradas confirmadas - todas as saídas confirmadas
  const saldo = lancamentos.reduce((acc, l) => {
    if (l.confirmado !== true && l.confirmado !== 'true') return acc;
    return acc + (Number(l.entrada) || 0) - (Number(l.saida) || 0);
  }, 0);

  // Contas a receber hoje: entrada > 0, não confirmado, data = hoje
  const receberHoje = lancamentos.filter(l =>
    l.data === hoje &&
    Number(l.entrada) > 0 &&
    l.confirmado !== true && l.confirmado !== 'true' &&
    l.tipo !== 'Saldo Anterior'
  );

  // Contas a pagar hoje: saida > 0, não confirmado, data = hoje
  const pagarHoje = lancamentos.filter(l =>
    l.data === hoje &&
    Number(l.saida) > 0 &&
    l.confirmado !== true && l.confirmado !== 'true' &&
    l.tipo !== 'Saldo Anterior'
  );

  // Vencendo nos próximos 3 dias (excluindo hoje)
  const proximosDiasStr = proximosDias.slice(1); // dias 1, 2, 3
  const vencendoProximos = lancamentos.filter(l =>
    proximosDiasStr.includes(l.data) &&
    (Number(l.entrada) > 0 || Number(l.saida) > 0) &&
    l.confirmado !== true && l.confirmado !== 'true' &&
    l.tipo !== 'Saldo Anterior'
  );

  const formatItem = l => {
    const valor = Number(l.entrada) > 0
      ? `+${fmt(l.entrada)}`
      : `-${fmt(l.saida)}`;
    return `• ${l.descricao || l.categoria || '—'}: ${valor}`;
  };

  const listReceberHoje = receberHoje.length > 0
    ? receberHoje.map(formatItem).join('\n')
    : 'Nenhuma';

  const listPagarHoje = pagarHoje.length > 0
    ? pagarHoje.map(formatItem).join('\n')
    : 'Nenhuma';

  const listProximos = vencendoProximos.length > 0
    ? vencendoProximos.map(l => `• ${l.data} - ${l.descricao || l.categoria || '—'}: ${Number(l.entrada) > 0 ? '+' + fmt(l.entrada) : '-' + fmt(l.saida)}`).join('\n')
    : 'Nenhuma';

  const weekday = toWeekday(agora);
  const dateFull = toDateFull(agora);

  const mensagem = `📊 *Resumo Financeiro Ecodely*
📅 ${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${dateFull}

💰 *Saldo em Caixa:* ${fmt(saldo)}

📥 *Contas a Receber hoje:*
${listReceberHoje}

📤 *Contas a Pagar hoje:*
${listPagarHoje}

⚠️ *Vencendo nos próximos 3 dias:*
${listProximos}`;

  try {
    const response = await fetch(`${evolutionUrl}/message/sendText/${evolutionInstance}`, {
      method: 'POST',
      headers: {
        'apikey': evolutionKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ number: wRodrigo, text: mensagem }),
    });

    const data = await response.json();
    console.log('[cron/financeiro-diario] enviado para Rodrigo:', data);
    return res.status(200).json({ ok: true, saldo, receberHoje: receberHoje.length, pagarHoje: pagarHoje.length });
  } catch (err) {
    console.error('[cron/financeiro-diario] whatsapp error:', err);
    return res.status(500).json({ error: err.message });
  }
}
