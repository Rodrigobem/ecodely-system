// api/whatsapp/webhook.js
// Recebe mensagens da Evolution API, processa com Claude, responde

const SUPA_URL = "https://xklvqcxhtariqqhvnseh.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrbHZxY3hodGFyaXFxaHZuc2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0NTYxMjYsImV4cCI6MjA5NDAzMjEyNn0.uZmJKJNTMpH65z3eztXKbip6jiZnsuKIUUl3ceWd5XU";
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const EVOLUTION_URL = "http://2.24.111.162:8080";
const EVOLUTION_KEY = "ecodely2026";
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE || "victoria";

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
  async getMany(table, col, val, order="criado_em", limit=50) {
    const r = await fetch(`${SUPA_URL}/rest/v1/${table}?${col}=eq.${encodeURIComponent(val)}&order=${order}.asc&limit=${limit}`, {headers: H});
    return await r.json();
  }
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

// ── Delay humano ──────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function delayHumano(texto) {
  // ~60 palavras por minuto de digitação humana
  const palavras = texto.split(" ").length;
  const ms = Math.min(Math.max(palavras * 80, 1500), 5000);
  // adiciona leve variação aleatória
  return ms + Math.floor(Math.random() * 800);
}

// ── Quebrar resposta em partes curtas ─────────────────────────────────────
function quebrarEmPartes(texto) {
  // Divide por \n\n ou por frases longas
  const partes = texto
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  // Se só tem 1 parte mas é longa, divide por \n simples
  if (partes.length === 1 && texto.length > 120) {
    return texto.split(/\n/).map(p => p.trim()).filter(p => p.length > 0);
  }

  return partes;
}

// ── Prompt de sistema por modo ──────────────────────────────────────────────
function buildSystemPrompt(modo, dadosLead) {

  const ECODELY_BASE = `
# QUEM VOCÊ É
Você é a Victória, da Ecodely Mídia. Fala pelo WhatsApp com donos e responsáveis de restaurantes. Nunca diga que é IA ou robô. Nunca diga que é inteligência artificial.

# O QUE É A ECODELY
A Ecodely conecta grandes anunciantes com restaurantes através do Ecobox — embalagem de delivery premium. O restaurante recebe as embalagens de graça, com o logo dele na frente e a campanha do anunciante no verso.

# MODELOS DE EMBALAGEM
Sempre apresente OS DOIS e deixe o parceiro escolher. NUNCA indique qual é o ideal.

- Modelo Padrão: 18x13x23cm — hambúrgueres, porções, kits, sobremesas
- Modelo Mega: 21x15x18cm — sushi, poke, temaki, marmitas

NUNCA chame de "Japonesa" ou "Poke". Use só "Modelo Padrão" e "Modelo Mega".

# COMO VOCÊ ESCREVE — REGRAS DE OURO
- Mensagens CURTAS. Máximo 2-3 linhas por mensagem.
- NUNCA use bullet points ou listas com traço/ponto. Escreva em texto corrido.
- NUNCA comece com "Ótima pergunta!", "Perfeito!", "Excelente!", "Ótimo!" — soa robótico.
- Máximo 1 emoji por mensagem. Às vezes nenhum.
- Linguagem informal, direta, como uma pessoa real falando no zap.
- Pode usar "rs", "haha", "é isso mesmo" naturalmente.
- Faça UMA pergunta por vez. Nunca várias perguntas na mesma mensagem.
- Se a pessoa mandar mensagem curta, responda curto também.

# EXEMPLOS DE COMO NÃO FALAR (robótico):
❌ "Ótimo, Rodrigo! Prazer! 😊 Então, pra eu avançar com tudo isso e te enviar as fotos + cases: • Qual é o nome da hamburgueria? • Qual cidade? • WhatsApp para contato?"
❌ "Excelente! 1000 pedidos é um volume bem interessante. 🚀 Então é assim: a gente vai dimensionar..."

# EXEMPLOS DE COMO FALAR (humano):
✅ "legal, 1000 pedidos é bastante. qual o nome da hamburgueria?"
✅ "temos dois modelos, você escolhe o que faz mais sentido pro seu produto"
✅ "ah entendi rs, mas a gente entrega diretamente aí — não precisa buscar nada"

# BENEFÍCIOS PARA O PARCEIRO
- Embalagem premium de graça com o logo deles em destaque
- Substitui a caixa kraft genérica
- Diferencial no iFood, Rappi e outros
- Sem custo, sem burocracia, sem fidelidade

# OBJEÇÕES COMUNS
- "Quanto custa?" → zero, chega de graça
- "O que aparece?" → logo de vocês na frente, anúncio no verso — discreto e bem feito
- "É confiável?" → trabalhamos com O Boticário, Engelux, Vult
- "Tem fidelidade?" → não, se não gostar é só falar
- "Quantas embalagens?" → depende do volume de vocês, a gente dimensiona

# OBRIGAÇÕES DO PARCEIRO (obrigatórias, não opcionais)
- Postar no Instagram 1x por semana durante a campanha
- Marcar @ecodelymidia nas postagens
- Enviar print das métricas dos stories
- Foto de check-in quando as embalagens chegarem

# LOGÍSTICA
A Ecodely entrega diretamente no estabelecimento. O parceiro não busca nada.`;

  const ACOES = `
# AÇÕES AUTOMÁTICAS
Quando tiver coletado: nome do estabelecimento + cidade + tipo, retorne APENAS este JSON (sem texto antes ou depois):
{"acao":"cadastrar_lead","dados":{"nome":"","tipo":"","cidade":"","responsavel":"","telefone":""}}

Quando o lead confirmar que quer a parceria, retorne APENAS:
{"acao":"converter_parceiro","dados":{"nome":"","tipo":"","cidade":"","responsavel":"","telefone":"","endereco":""}}

Quando encerrar sem interesse, retorne APENAS:
{"acao":"encerrar","motivo":"sem_interesse"}

Em qualquer outro caso, responda normalmente com texto curto.`;

  if (modo === "prospecto") {
    return ECODELY_BASE + `

# MODO: PROSPECÇÃO
Você está abordando o restaurante pelo WhatsApp.

# FLUXO NATURAL DA CONVERSA
1. Se apresentar brevemente e explicar a proposta em 2-3 linhas
2. Perguntar se usam delivery
3. Se sim, perguntar o tipo de estabelecimento
4. Apresentar os dois modelos e deixar escolher
5. Perguntar quantidade de pedidos por mês
6. Perguntar o nome do estabelecimento
7. Perguntar a cidade
8. Confirmar o WhatsApp
9. Registrar o cadastro

Colete UM dado por vez. Não peça tudo numa mensagem só.

# URGÊNCIA (use com naturalidade, não força)
- "as vagas por área são limitadas"
- "o cliente quer fechar a lista essa semana"
- "precisava confirmar hoje se tem vaga pra região de vocês"

# CASES QUE CONVERTERAM
- VK Steak & Burger: converteu após esclarecer dúvidas sobre a embalagem
- Açaí da Lara: converteu no 3º follow-up com "o cliente pediu a lista pra amanhã, desculpa a insistência 😅"
- Beer Rock Club: "seu estabelecimento foi indicado diretamente pelo cliente"

# FOLLOW-UP
NUNCA desistir no silêncio. Voltar depois com uma mensagem curta e urgência real.` + ACOES;
  }

  if (modo === "parceiro") {
    return ECODELY_BASE + `

# MODO: SUPORTE AO PARCEIRO
O estabelecimento já é parceiro. Ajude com dúvidas sobre embalagens, postagens, campanhas.
Seja resolutivo e direto. Se não souber, diga que verifica e volta.` + ACOES;
  }

  if (modo === "cobranca") {
    return ECODELY_BASE + `

# MODO: COBRANÇA DE POSTAGEM
O parceiro está com postagem pendente no Instagram.
Lembre de forma amigável, sem pressão. Ofereça ajuda com o conteúdo se precisar.` + ACOES;
  }

  if (modo === "equipe") {
    return `Você é o assistente interno da Ecodely. Seja direto e objetivo. Use texto corrido, sem bullet points.`;
  }

  return ECODELY_BASE + ACOES;
}

// ── Chamar Claude ─────────────────────────────────────────────────────────
async function callClaude(systemPrompt, messages) {
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
}

// ── Enviar mensagem pelo WhatsApp ─────────────────────────────────────────
async function sendWhatsApp(numero, texto) {
  if (!EVOLUTION_URL || !EVOLUTION_KEY) {
    console.log("[WA MOCK] Para:", numero, "→", texto);
    return { mock: true };
  }
  const res = await fetch(`${EVOLUTION_URL}/message/sendText/${EVOLUTION_INSTANCE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": EVOLUTION_KEY,
    },
    body: JSON.stringify({
      number: numero,
      text: texto,
    }),
  });
  return res.json();
}

// ── Enviar com delay humano e múltiplas partes ────────────────────────────
async function sendWhatsAppHumano(numero, texto) {
  const partes = quebrarEmPartes(texto);

  for (let i = 0; i < partes.length; i++) {
    const parte = partes[i];
    // delay antes de cada mensagem
    const delay = delayHumano(parte);
    await sleep(delay);
    await sendWhatsApp(numero, parte);
  }
}

// ── Upsert no pipeline ────────────────────────────────────────────────────
async function upsertPipeline(supabase, conversa, etapa, dados = {}) {
  try {
    const { data: existente } = await supabase
      .from("pipeline_leads")
      .select("id, etapa")
      .eq("wa_conversa_id", conversa.id)
      .single();

    const payload = {
      nome: dados.nome || dados.restaurante || conversa.nome || conversa.numero,
      responsavel: dados.responsavel || conversa.responsavel || "Victória",
      etapa,
      campanha: dados.campanha || conversa.dados_lead?.campanha || "",
      cidade: dados.cidade || conversa.dados_lead?.cidade || "",
      tipo: dados.tipo || conversa.dados_lead?.tipo || "",
      telefone: dados.telefone || conversa.numero || "",
      instagram: dados.instagram || "",
      origem: "whatsapp",
      wa_conversa_id: conversa.id,
      atualizado_em: new Date().toISOString(),
    };

    if (existente) {
      const ORDEM = ["abordado", "respondeu", "interessado", "convertido", "encerrado"];
      const ordemAtual = ORDEM.indexOf(existente.etapa);
      const ordemNova = ORDEM.indexOf(etapa);
      if (ordemNova > ordemAtual) {
        await supabase.from("pipeline_leads").update(payload).eq("id", existente.id);
      }
    } else {
      await supabase.from("pipeline_leads").insert([{ ...payload, criado_em: new Date().toISOString() }]);
    }
  } catch (e) {
    console.error("Pipeline upsert error:", e.message);
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
          if (conv?.numero) {
            numero = conv.numero;
            remoteJidCompleto = numero + "@s.whatsapp.net";
          }
        }
      } catch(e) {
        console.log("Erro ao resolver @lid:", e.message);
      }
    }

    const textoRecebido = body?.data?.message?.conversation ||
                          body?.data?.message?.extendedTextMessage?.text ||
                          body?.mensagem;

    if (!numero || !textoRecebido) {
      return res.status(200).json({ ok: true, skipped: "no text message" });
    }

    if (body?.data?.key?.fromMe) return res.status(200).json({ ok: true, skipped: "fromMe" });

    // ── 1. Buscar ou criar conversa ────────────────────────────────────────
    let { data: conversa } = await supabase
      .from("wa_conversas")
      .select("*")
      .eq("numero", numero)
      .single();

    if (!conversa) {
      const { data: nova } = await supabase
        .from("wa_conversas")
        .insert({ numero, modo: "prospecto", status: "novo" })
        .select()
        .single();
      conversa = nova;
    }

    // ── 2. Salvar mensagem do usuário ──────────────────────────────────────
    await supabase.from("wa_mensagens").insert({
      conversa_id: conversa.id,
      role: "user",
      conteudo: textoRecebido,
    });

    await supabase.from("wa_conversas").update({
      status: conversa.status === "novo" ? "em_andamento" : conversa.status,
      atualizado_em: new Date().toISOString(),
    }).eq("id", conversa.id);

    if (conversa.status === "novo" || conversa.status === "em_andamento") {
      await upsertPipeline(supabase, conversa, "respondeu");
    }

    // ── 3. Buscar histórico ────────────────────────────────────────────────
    const { data: historico } = await supabase
      .from("wa_mensagens")
      .select("role, conteudo")
      .eq("conversa_id", conversa.id)
      .order("criado_em", { ascending: true })
      .limit(20);

    const messages = (historico || [])
      .filter(m => m.role === "user" || m.role === "assistant")
      .map(m => ({ role: m.role, content: m.conteudo }));

    // ── 4. Chamar Claude ───────────────────────────────────────────────────
    const systemPrompt = buildSystemPrompt(conversa.modo, conversa.dados_lead);
    const resposta = await callClaude(systemPrompt, messages);

    // ── 5. Verificar se é JSON de ação ────────────────────────────────────
    let textoFinal = resposta;
    let acao = null;

    try {
      const parsed = JSON.parse(resposta.trim());
      if (parsed.acao) {
        acao = parsed;
        if (parsed.acao === "cadastrar_lead") {
          textoFinal = `anotei tudo aqui 📋 nossa equipe entra em contato em breve. tem mais alguma dúvida?`;
          await supabase.from("wa_conversas").update({
            dados_lead: parsed.dados,
            status: "aguardando",
            nome: parsed.dados?.nome || conversa.nome,
          }).eq("id", conversa.id);
          await upsertPipeline(supabase, conversa, "interessado", parsed.dados);
        } else if (parsed.acao === "converter_parceiro") {
          textoFinal = `que bom! bem-vindo à Ecodely 🎉 cadastro confirmado. nossa equipe entra em contato em breve pra dar andamento`;
          await supabase.from("wa_conversas").update({
            dados_lead: parsed.dados,
            status: "convertido",
            modo: "parceiro",
            nome: parsed.dados?.nome || conversa.nome,
          }).eq("id", conversa.id);
          await upsertPipeline(supabase, conversa, "convertido", parsed.dados);
        } else if (parsed.acao === "encerrar") {
          textoFinal = `tudo bem! se quiser saber mais sobre a Ecodely, pode chamar aqui a qualquer hora 👋`;
          await supabase.from("wa_conversas").update({ status: "encerrado" }).eq("id", conversa.id);
          await upsertPipeline(supabase, conversa, "encerrado");
        }
      }
    } catch (e) {
      // resposta normal de texto
    }

    // ── 6. Salvar resposta do agente ───────────────────────────────────────
    await supabase.from("wa_mensagens").insert({
      conversa_id: conversa.id,
      role: "assistant",
      conteudo: textoFinal,
    });

    // ── 7. Retornar 200 imediatamente e enviar em background ───────────────
    res.status(200).json({ ok: true, acao: acao?.acao || "resposta", resposta: textoFinal });

    // Enviar com delay humano APÓS retornar 200
    await sendWhatsAppHumano(remoteJidCompleto || numero, textoFinal);

  } catch (err) {
    console.error("Webhook error:", err);
    // Se já respondeu, não pode responder de novo
    try { res.status(500).json({ error: err.message }); } catch(e) {}
  }
};
