// api/whatsapp/webhook.js
// Recebe mensagens da Evolution API, processa com Claude, responde

const SUPA_URL = "https://xklvqcxhtariqqhvnseh.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrbHZxY3hodGFyaXFxaHZuc2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0NTYxMjYsImV4cCI6MjA5NDAzMjEyNn0.uZmJKJNTMpH65z3eztXKbip6jiZnsuKIUUl3ceWd5XU";
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const EVOLUTION_URL = "http://2.24.111.162:8080";
const EVOLUTION_KEY = "ecodely2026";
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE || "victoria";

// ── Fotos dos cases ────────────────────────────────────────────────────────
const FOTOS_CASES = [
  "https://drive.usercontent.google.com/download?id=1qNEXechEqIf5BxAe5TcYlplKTFXFYqim&export=download",
  "https://drive.usercontent.google.com/download?id=1NopFJUr9EiNIs4G42p9Z8331ds3QIMnb&export=download",
  "https://drive.usercontent.google.com/download?id=1aQhWAWQETYZdDbVJlR8WJRlVvArVOkUt&export=download",
  "https://drive.usercontent.google.com/download?id=1vbSZrZih0KtuC9R_4zQW64Tzd83ZgyvV&export=download",
  "https://drive.usercontent.google.com/download?id=1od6N5I-HsWnZWqZAun-S_1oek6SG5zpr&export=download",
  "https://drive.usercontent.google.com/download?id=1j78oW2ukhpb1rttHFbFCiCunAlmVG8aw&export=download",
  "https://drive.usercontent.google.com/download?id=1jexyoFOa0SO637c98rPgp6RZIG-A1u_V&export=download",
];

const H = {"apikey": SUPA_KEY, "Authorization": "Bearer "+SUPA_KEY, "Content-Type": "application/json"};
const DB = {
  async get(table, col, val) {
    const r = await fetch(`${SUPA_URL}/rest/v1/${table}?${col}=eq.${encodeURIComponent(val)}&limit=1`, {headers: H});
    const d = await r.json();
    return Array.isArray(d) && d.length > 0 ? d[0] : null;
  },
  async insert(table, row) {
    const r = await fetch(`${SUPA_URL}/rest/v1/${table}`, {method:"POST", headers:{...H, "Prefer":"return=representation"}, body: JSON.stringify(row)});
    const d = await r.json();
    return Array.isArray(d) ? d[0] : d;
  },
  async update(table, col, val, data) {
    await fetch(`${SUPA_URL}/rest/v1/${table}?${col}=eq.${encodeURIComponent(val)}`, {method:"PATCH", headers: H, body: JSON.stringify(data)});
  },
};

const supabase = {
  from: (table) => ({
    select: () => ({
      eq: (col, val) => ({
        single: async () => ({data: await DB.get(table, col, val)}),
        order: (o, opts) => ({
          limit: async (n) => {
            const r = await fetch(`${SUPA_URL}/rest/v1/${table}?${col}=eq.${encodeURIComponent(val)}&order=${o}.${opts?.ascending?"asc":"desc"}&limit=${n}`, {headers: H});
            return {data: await r.json()};
          }
        })
      })
    }),
    insert: (rows) => ({
      select: () => ({
        single: async () => ({data: await DB.insert(table, Array.isArray(rows)?rows[0]:rows)})
      }),
      then: async (cb) => { const d = await DB.insert(table, Array.isArray(rows)?rows[0]:rows); return cb ? cb({data:d}) : {data:d}; }
    }),
    update: (data) => ({
      eq: async (col, val) => { await DB.update(table, col, val, data); return {data:null}; }
    })
  })
};

// ── Detectar se o lead pediu fotos ────────────────────────────────────────
function pedindoFotos(texto) {
  const t = texto.toLowerCase();
  return t.includes("foto") || t.includes("imagem") || t.includes("ver") ||
         t.includes("como é") || t.includes("como e ") || t.includes("exemplo") ||
         t.includes("modelo") || t.includes("print") || t.includes("mostra");
}

// ── Enviar imagem pelo WhatsApp ───────────────────────────────────────────
async function sendImagem(numero, url, caption = "") {
  try {
    const res = await fetch(`${EVOLUTION_URL}/message/sendMedia/${EVOLUTION_INSTANCE}`, {
      method: "POST",
      headers: {"Content-Type": "application/json", "apikey": EVOLUTION_KEY},
      body: JSON.stringify({
        number: numero,
        mediatype: "image",
        mimetype: "image/jpeg",
        caption,
        media: url,
      }),
    });
    return res.json();
  } catch(e) {
    console.error("Erro ao enviar imagem:", e.message);
  }
}

// ── Enviar texto pelo WhatsApp ─────────────────────────────────────────────
async function sendWhatsApp(numero, texto) {
  try {
    const res = await fetch(`${EVOLUTION_URL}/message/sendText/${EVOLUTION_INSTANCE}`, {
      method: "POST",
      headers: {"Content-Type": "application/json", "apikey": EVOLUTION_KEY},
      body: JSON.stringify({ number: numero, text: texto }),
    });
    return res.json();
  } catch(e) {
    console.error("Erro ao enviar texto:", e.message);
  }
}

// ── Prompt de sistema ──────────────────────────────────────────────────────
function buildSystemPrompt(modo, dadosLead) {

  const ECODELY_BASE = `
# QUEM VOCÊ É
Você é a Victória, da Ecodely Mídia. Fala pelo WhatsApp com donos e responsáveis de restaurantes. Nunca diga que é IA ou robô.

# O QUE É A ECODELY
A Ecodely conecta grandes anunciantes com restaurantes através do Ecobox — embalagem de delivery premium. O restaurante recebe as embalagens de graça, com o logo dele na frente e a campanha do anunciante no verso.

# MODELOS DE EMBALAGEM — REGRA CRÍTICA
SEMPRE apresente OS DOIS modelos. NUNCA diga qual é o ideal ou recomende um específico. Deixe o parceiro escolher.
- Modelo Padrão: 18x13x23cm
- Modelo Mega: 21x15x18cm
NUNCA diga "ideal para hamburgueria" ou qualquer sugestão de modelo.

# COMO VOCÊ ESCREVE — REGRAS DE OURO
- Mensagens CURTAS. Máximo 2-3 linhas.
- NUNCA use bullet points ou listas. Só texto corrido.
- NUNCA comece com "Ótimo!", "Perfeito!", "Excelente!", "Ótima pergunta!" — soa robótico.
- Máximo 1 emoji por mensagem. Às vezes nenhum.
- Linguagem informal, direta, como uma pessoa real no zap.
- Faça UMA pergunta por vez. Nunca várias perguntas juntas.
- Se a pessoa mandar mensagem curta, responda curto também.
- Quando não souber responder algo, diga "deixa eu verificar e já te falo" — nunca trave.

# QUANDO PEDIREM FOTOS
Diga que está enviando as fotos agora. Não precisa explicar mais nada sobre as fotos — elas falam por si.

# EXEMPLOS DE COMO NÃO FALAR (robótico):
❌ "Ótimo, Rodrigo! Prazer! Então, pra eu avançar: • Nome? • Cidade? • WhatsApp?"
❌ "Perfeito! Então temos o Modelo Padrão que é ideal pra hamburgueria"
❌ "Excelente! 1000 pedidos é um volume bem interessante 🚀"

# EXEMPLOS DE COMO FALAR (humano):
✅ "legal, 1000 pedidos é bastante. qual o nome da hamburgueria?"
✅ "temos dois modelos, você escolhe — Padrão (18x13x23cm) ou Mega (21x15x18cm)"
✅ "deixa eu verificar e já te falo"

# BENEFÍCIOS
- Embalagem premium de graça com o logo deles em destaque
- Sem custo, sem burocracia, sem fidelidade forçada
- Trabalhamos com O Boticário, Engelux, Vult

# OBRIGAÇÕES DO PARCEIRO
- Postar no Instagram 1x por semana durante a campanha, marcar @ecodelymidia
- Enviar print das métricas dos stories
- Foto de check-in quando as embalagens chegarem

# LOGÍSTICA
A Ecodely entrega diretamente no estabelecimento.`;

  const ACOES = `
# AÇÕES AUTOMÁTICAS
Quando tiver: nome do estabelecimento + cidade + tipo, retorne APENAS este JSON:
{"acao":"cadastrar_lead","dados":{"nome":"","tipo":"","cidade":"","responsavel":"","telefone":""}}

Quando confirmar parceria:
{"acao":"converter_parceiro","dados":{"nome":"","tipo":"","cidade":"","responsavel":"","telefone":"","endereco":""}}

Quando encerrar sem interesse:
{"acao":"encerrar","motivo":"sem_interesse"}

Quando pedirem fotos/imagens/exemplos, retorne APENAS:
{"acao":"enviar_fotos"}

Em qualquer outro caso, responda com texto curto.`;

  if (modo === "prospecto") {
    return ECODELY_BASE + `

# MODO: PROSPECÇÃO
Fluxo natural — colete UM dado por vez:
1. Se apresentar e explicar a proposta em 2 linhas
2. Perguntar se usam delivery
3. Tipo do estabelecimento
4. Apresentar OS DOIS modelos (nunca recomendar um)
5. Quantidade de pedidos por mês
6. Nome do estabelecimento
7. Cidade
8. Confirmar WhatsApp

Urgência natural: "vagas por área são limitadas", "cliente quer fechar a lista essa semana".
NUNCA desistir no silêncio — follow-up com mensagem curta.` + ACOES;
  }

  if (modo === "parceiro") {
    return ECODELY_BASE + `
# MODO: SUPORTE
O estabelecimento já é parceiro. Ajude com dúvidas. Seja direto.` + ACOES;
  }

  if (modo === "cobranca") {
    return ECODELY_BASE + `
# MODO: COBRANÇA
Parceiro com postagem pendente. Lembre de forma amigável. Ofereça ajuda com conteúdo.` + ACOES;
  }

  return ECODELY_BASE + ACOES;
}

// ── Chamar Claude ──────────────────────────────────────────────────────────
async function callClaude(systemPrompt, messages) {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system: systemPrompt,
        messages,
      }),
    });
    const data = await response.json();
    return data.content?.[0]?.text || "";
  } catch(e) {
    console.error("Erro Claude:", e.message);
    return "";
  }
}

// ── Upsert pipeline ────────────────────────────────────────────────────────
async function upsertPipeline(supabase, conversa, etapa, dados = {}) {
  try {
    const { data: existente } = await supabase
      .from("pipeline_leads").select("id, etapa").eq("wa_conversa_id", conversa.id).single();

    const payload = {
      nome: dados.nome || conversa.nome || conversa.numero,
      responsavel: dados.responsavel || "Victória",
      etapa,
      cidade: dados.cidade || conversa.dados_lead?.cidade || "",
      tipo: dados.tipo || conversa.dados_lead?.tipo || "",
      telefone: dados.telefone || conversa.numero || "",
      origem: "whatsapp",
      wa_conversa_id: conversa.id,
      atualizado_em: new Date().toISOString(),
    };

    if (existente) {
      const ORDEM = ["abordado","respondeu","interessado","convertido","encerrado"];
      if (ORDEM.indexOf(etapa) > ORDEM.indexOf(existente.etapa)) {
        await supabase.from("pipeline_leads").update(payload).eq("id", existente.id);
      }
    } else {
      await supabase.from("pipeline_leads").insert([{...payload, criado_em: new Date().toISOString()}]);
    }
  } catch(e) {
    console.error("Pipeline error:", e.message);
  }
}

// ── Handler principal ──────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, apikey");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method === "GET") return res.json({ ok: true, agent: "Ecodely WhatsApp Agent" });
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = req.body;

    const rawJid = body?.data?.key?.remoteJid || "";
    if (rawJid.includes("@g.us")) return res.status(200).json({ ok: true, skipped: "group" });
    if (body?.data?.key?.fromMe) return res.status(200).json({ ok: true, skipped: "fromMe" });

    let remoteJidCompleto = rawJid;
    let numero = rawJid.replace("@s.whatsapp.net","").replace("@c.us","").replace("@lid","") || body?.numero;

    if (rawJid.includes("@lid") && EVOLUTION_URL) {
      try {
        const msgResp = await fetch(`${EVOLUTION_URL}/chat/findMessages/victoria`, {
          method: "POST",
          headers: {"Content-Type":"application/json","apikey":EVOLUTION_KEY},
          body: JSON.stringify({"where":{"key":{"remoteJid":rawJid}},"limit":5})
        });
        const msgs = await msgResp.json();
        if (Array.isArray(msgs) && msgs.length > 0) {
          const jidReal = msgs[0]?.key?.remoteJid || "";
          if (jidReal.includes("@s.whatsapp.net")) {
            remoteJidCompleto = jidReal;
            numero = jidReal.replace("@s.whatsapp.net","");
          }
        }
        if (remoteJidCompleto.includes("@lid")) {
          const conv = await DB.get("wa_conversas","lid_jid",rawJid);
          if (conv?.numero) { numero = conv.numero; remoteJidCompleto = numero + "@s.whatsapp.net"; }
        }
      } catch(e) { console.log("Erro @lid:", e.message); }
    }

    const textoRecebido = body?.data?.message?.conversation ||
                          body?.data?.message?.extendedTextMessage?.text ||
                          body?.mensagem;

    if (!numero || !textoRecebido) return res.status(200).json({ ok: true, skipped: "no text" });

    // ── 1. Buscar ou criar conversa ────────────────────────────────────────
    let { data: conversa } = await supabase.from("wa_conversas").select("*").eq("numero", numero).single();

    if (!conversa) {
      const { data: nova } = await supabase.from("wa_conversas")
        .insert({ numero, modo: "prospecto", status: "novo" }).select().single();
      conversa = nova;
    }

    // ── 2. Salvar mensagem do usuário ──────────────────────────────────────
    await supabase.from("wa_mensagens").insert({ conversa_id: conversa.id, role: "user", conteudo: textoRecebido });
    await supabase.from("wa_conversas").update({
      status: conversa.status === "novo" ? "em_andamento" : conversa.status,
      atualizado_em: new Date().toISOString(),
    }).eq("id", conversa.id);

    if (conversa.status === "novo" || conversa.status === "em_andamento") {
      await upsertPipeline(supabase, conversa, "respondeu");
    }

    // ── 3. Buscar histórico ────────────────────────────────────────────────
    const { data: historico } = await supabase.from("wa_mensagens")
      .select("role, conteudo").eq("conversa_id", conversa.id)
      .order("criado_em", { ascending: true }).limit(20);

    const messages = (historico || [])
      .filter(m => m.role === "user" || m.role === "assistant")
      .map(m => ({ role: m.role, content: m.conteudo }));

    // ── 4. Verificar se pediu fotos (atalho direto) ────────────────────────
    if (pedindoFotos(textoRecebido)) {
      const textoFotos = "aqui estão alguns cases 📸";
      await supabase.from("wa_mensagens").insert({ conversa_id: conversa.id, role: "assistant", conteudo: textoFotos });
      await sendWhatsApp(remoteJidCompleto || numero, textoFotos);
      for (const url of FOTOS_CASES) {
        await sendImagem(remoteJidCompleto || numero, url);
      }
      return res.status(200).json({ ok: true, acao: "enviar_fotos" });
    }

    // ── 5. Chamar Claude ───────────────────────────────────────────────────
    const systemPrompt = buildSystemPrompt(conversa.modo, conversa.dados_lead);
    const resposta = await callClaude(systemPrompt, messages);

    // ── 6. Processar resposta ──────────────────────────────────────────────
    let textoFinal = resposta;
    let acao = null;

    // Fallback se Claude não responder
    if (!textoFinal || textoFinal.trim() === "") {
      textoFinal = "deixa eu verificar e já te falo 👍";
    }

    try {
      const parsed = JSON.parse(textoFinal.trim());
      if (parsed.acao) {
        acao = parsed;

        if (parsed.acao === "enviar_fotos") {
          textoFinal = "aqui estão alguns cases 📸";
          await supabase.from("wa_mensagens").insert({ conversa_id: conversa.id, role: "assistant", conteudo: textoFinal });
          await sendWhatsApp(remoteJidCompleto || numero, textoFinal);
          for (const url of FOTOS_CASES) {
            await sendImagem(remoteJidCompleto || numero, url);
          }
          return res.status(200).json({ ok: true, acao: "enviar_fotos" });

        } else if (parsed.acao === "cadastrar_lead") {
          textoFinal = "anotei tudo aqui 📋 nossa equipe entra em contato em breve. tem mais alguma dúvida?";
          await supabase.from("wa_conversas").update({
            dados_lead: parsed.dados, status: "aguardando", nome: parsed.dados?.nome || conversa.nome,
          }).eq("id", conversa.id);
          await upsertPipeline(supabase, conversa, "interessado", parsed.dados);

        } else if (parsed.acao === "converter_parceiro") {
          textoFinal = "que bom! bem-vindo à Ecodely 🎉 cadastro confirmado. nossa equipe entra em contato em breve";
          await supabase.from("wa_conversas").update({
            dados_lead: parsed.dados, status: "convertido", modo: "parceiro", nome: parsed.dados?.nome || conversa.nome,
          }).eq("id", conversa.id);
          await upsertPipeline(supabase, conversa, "convertido", parsed.dados);

        } else if (parsed.acao === "encerrar") {
          textoFinal = "tudo bem! se quiser saber mais sobre a Ecodely, pode chamar aqui a qualquer hora 👋";
          await supabase.from("wa_conversas").update({ status: "encerrado" }).eq("id", conversa.id);
          await upsertPipeline(supabase, conversa, "encerrado");
        }
      }
    } catch(e) {
      // Resposta normal de texto — ok
    }

    // ── 7. Salvar e enviar ─────────────────────────────────────────────────
    await supabase.from("wa_mensagens").insert({ conversa_id: conversa.id, role: "assistant", conteudo: textoFinal });
    await sendWhatsApp(remoteJidCompleto || numero, textoFinal);

    return res.status(200).json({ ok: true, acao: acao?.acao || "resposta", resposta: textoFinal });

  } catch(err) {
    console.error("Webhook error:", err);
    try { res.status(500).json({ error: err.message }); } catch(e) {}
  }
}
