// api/whatsapp/webhook.js
// Recebe mensagens da Evolution API, processa com Claude, responde

const SUPA_URL = "https://xklvqcxhtariqqhvnseh.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrbHZxY3hodGFyaXFxaHZuc2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0NTYxMjYsImV4cCI6MjA5NDAzMjEyNn0.uZmJKJNTMpH65z3eztXKbip6jiZnsuKIUUl3ceWd5XU";
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const EVOLUTION_URL = "http://2.24.111.162:8080";
const EVOLUTION_KEY = "ecodely2026";
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE || "victoria";

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

function pedindoFotos(texto) {
  const t = texto.toLowerCase();
  return t.includes("foto") || t.includes("imagem") || t.includes("ver") ||
         t.includes("como é") || t.includes("exemplo") || t.includes("print") ||
         t.includes("mostra");
}

async function sendImagem(numero, url, caption = "") {
  try {
    const res = await fetch(`${EVOLUTION_URL}/message/sendMedia/${EVOLUTION_INSTANCE}`, {
      method: "POST",
      headers: {"Content-Type": "application/json", "apikey": EVOLUTION_KEY},
      body: JSON.stringify({ number: numero, mediatype: "image", mimetype: "image/jpeg", caption, media: url }),
    });
    return res.json();
  } catch(e) { console.error("Erro imagem:", e.message); }
}

async function sendWhatsApp(numero, texto) {
  try {
    const res = await fetch(`${EVOLUTION_URL}/message/sendText/${EVOLUTION_INSTANCE}`, {
      method: "POST",
      headers: {"Content-Type": "application/json", "apikey": EVOLUTION_KEY},
      body: JSON.stringify({ number: numero, text: texto }),
    });
    return res.json();
  } catch(e) { console.error("Erro texto:", e.message); }
}

const SYSTEM_PROMPT = `Você é a Victória, da Ecodely Mídia. Fala pelo WhatsApp com donos de restaurantes. Nunca diga que é IA.

A Ecodely envia Ecobox — embalagens de delivery premium — de graça para restaurantes. O restaurante coloca o logo na frente, o anunciante fica no verso. Zero custo para o parceiro.

IMPORTANTE: Nunca mencione que a Ecodely lucra com publicidade ou que há anunciantes pagando. Se perguntarem diretamente como a Ecodely ganha dinheiro, pode dizer que é um modelo de parceria com marcas. Mas não traga isso espontaneamente.

TIPOS DE ESTABELECIMENTO QUE ATENDEMOS: hamburguerias, restaurantes, açaí, sushi, poke, marmitas, temakeria, cafeteria, entre outros. NÃO atendemos pizzarias.

MODELOS (sempre apresente os dois, nunca recomende um):
- Modelo Padrão: 18x13x23cm
- Modelo Mega: 21x15x18cm

REGRAS DE ESCRITA:
- Mensagens curtas, máximo 2-3 linhas
- Sem bullet points, só texto corrido
- Sem "Ótimo!", "Perfeito!", "Excelente!" no início
- Máximo 1 emoji por mensagem
- Linguagem informal, como pessoa real no zap
- Uma pergunta por vez
- Seja NATURAL — não force a conversão. Deixe fluir. Se o lead estiver engajado, avance. Se não, respeite o ritmo.
- Não repita perguntas que já foram respondidas no histórico

OBRIGAÇÕES DO PARCEIRO: postar no Instagram 1x/semana marcando @ecodelymidia, enviar métricas dos stories.

FLUXO SUGERIDO (não force, seja natural):
1. Apresentar proposta brevemente
2. Confirmar se fazem delivery
3. Tipo de estabelecimento
4. Apresentar os dois modelos
5. Volume de pedidos por mês
6. Nome do estabelecimento
7. Cidade
8. Confirmar WhatsApp
9. Cadastrar

Quando tiver nome + cidade + tipo, retorne APENAS: {"acao":"cadastrar_lead","dados":{"nome":"","tipo":"","cidade":"","responsavel":"","telefone":""}}
Quando confirmar parceria: {"acao":"converter_parceiro","dados":{"nome":"","tipo":"","cidade":"","responsavel":"","telefone":""}}
Quando encerrar: {"acao":"encerrar","motivo":"sem_interesse"}
Quando pedirem fotos: {"acao":"enviar_fotos"}
Nos demais casos, responda com texto curto e natural.`;

async function callClaude(messages) {
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
        system: SYSTEM_PROMPT,
        messages: messages.length > 0 ? messages : [{role:"user", content:"oi"}],
      }),
    });
    const data = await response.json();
    console.log("CLAUDE FULL:", JSON.stringify(data).substring(0,500));
    return data.content?.[0]?.text || "";
  } catch(e) {
    console.error("Erro Claude:", e.message);
    return "";
  }
}

async function upsertPipeline(supabase, conversa, etapa, dados = {}) {
  try {
    const { data: existente } = await supabase.from("pipeline_leads").select("id, etapa").eq("wa_conversa_id", conversa.id).single();
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
  } catch(e) { console.error("Pipeline error:", e.message); }
}

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

    // Buscar ou criar conversa
    let { data: conversa } = await supabase.from("wa_conversas").select("*").eq("numero", numero).single();
    if (!conversa) {
      const { data: nova } = await supabase.from("wa_conversas")
        .insert({ numero, modo: "prospecto", status: "novo" }).select().single();
      conversa = nova;
    }

    // Salvar mensagem do usuário
    await supabase.from("wa_mensagens").insert({ conversa_id: conversa.id, role: "user", conteudo: textoRecebido });
    await supabase.from("wa_conversas").update({
      status: conversa.status === "novo" ? "em_andamento" : conversa.status,
      atualizado_em: new Date().toISOString(),
    }).eq("id", conversa.id);

    if (conversa.status === "novo" || conversa.status === "em_andamento") {
      await upsertPipeline(supabase, conversa, "respondeu");
    }

    // Fotos direto sem chamar Claude
    if (pedindoFotos(textoRecebido)) {
      const textoFotos = "aqui estão alguns cases 📸";
      await supabase.from("wa_mensagens").insert({ conversa_id: conversa.id, role: "assistant", conteudo: textoFotos });
      await sendWhatsApp(remoteJidCompleto || numero, textoFotos);
      // Sorteia 3 fotos aleatórias
      const fotosEmbaralhadas = [...FOTOS_CASES].sort(() => Math.random() - 0.5).slice(0, 3);
      for (const url of fotosEmbaralhadas) {
        await sendImagem(remoteJidCompleto || numero, url);
      }
      return res.status(200).json({ ok: true, acao: "enviar_fotos" });
    }

    // Buscar histórico
    const { data: historico } = await supabase.from("wa_mensagens")
      .select("role, conteudo").eq("conversa_id", conversa.id)
      .order("criado_em", { ascending: true }).limit(10);

    const messages = (historico || [])
      .filter(m => {
        if (m.role !== "user" && m.role !== "assistant") return false;
        if (!m.conteudo || m.conteudo.trim() === "") return false;
        // Remove mensagens que são JSONs de ação ou fallback
        if (m.conteudo.trim().startsWith("{")) return false;
        if (m.conteudo === "oi! tudo bem? como posso te ajudar?") return false;
        if (m.conteudo === "deixa eu verificar e já te falo 👍") return false;
        return true;
      })
      .map(m => ({ role: m.role, content: m.conteudo }));

    // Chamar Claude
    let resposta = await callClaude(messages);

    // Se retornou vazio, tenta só com a última mensagem (histórico corrompido)
    if (!resposta || resposta.trim() === "") {
      console.log("RETRY: tentando sem histórico");
      resposta = await callClaude([{role:"user", content: textoRecebido}]);
    }

    // Processar resposta
    let textoFinal = resposta;
    let acao = null;

    if (!textoFinal || textoFinal.trim() === "") {
      textoFinal = "desculpa, pode repetir?";
    }

    try {
      const parsed = JSON.parse(textoFinal.trim());
      if (parsed.acao) {
        acao = parsed;
        if (parsed.acao === "enviar_fotos") {
          textoFinal = "aqui estão alguns cases 📸";
          await supabase.from("wa_mensagens").insert({ conversa_id: conversa.id, role: "assistant", conteudo: textoFinal });
          await sendWhatsApp(remoteJidCompleto || numero, textoFinal);
          for (const url of FOTOS_CASES) { await sendImagem(remoteJidCompleto || numero, url); }
          return res.status(200).json({ ok: true, acao: "enviar_fotos" });
        } else if (parsed.acao === "cadastrar_lead") {
          textoFinal = "anotei tudo aqui 📋 nossa equipe entra em contato em breve. tem mais alguma dúvida?";
          await supabase.from("wa_conversas").update({ dados_lead: parsed.dados, status: "aguardando", nome: parsed.dados?.nome || conversa.nome }).eq("id", conversa.id);
          await upsertPipeline(supabase, conversa, "interessado", parsed.dados);
        } else if (parsed.acao === "converter_parceiro") {
          textoFinal = "que bom! bem-vindo à Ecodely 🎉 cadastro confirmado. nossa equipe entra em contato em breve";
          await supabase.from("wa_conversas").update({ dados_lead: parsed.dados, status: "convertido", modo: "parceiro", nome: parsed.dados?.nome || conversa.nome }).eq("id", conversa.id);
          await upsertPipeline(supabase, conversa, "convertido", parsed.dados);
        } else if (parsed.acao === "encerrar") {
          textoFinal = "tudo bem! se quiser saber mais sobre a Ecodely, pode chamar aqui a qualquer hora 👋";
          await supabase.from("wa_conversas").update({ status: "encerrado" }).eq("id", conversa.id);
          await upsertPipeline(supabase, conversa, "encerrado");
        }
      }
    } catch(e) { /* resposta normal */ }

    // Só salva no histórico se for texto válido (não JSON, não fallback)
    const ehTextoValido = textoFinal && !textoFinal.trim().startsWith("{") && textoFinal.length > 2;
    if (ehTextoValido) {
      await supabase.from("wa_mensagens").insert({ conversa_id: conversa.id, role: "assistant", conteudo: textoFinal });
    }
    await sendWhatsApp(remoteJidCompleto || numero, textoFinal);

    return res.status(200).json({ ok: true, acao: acao?.acao || "resposta", resposta: textoFinal });

  } catch(err) {
    console.error("Webhook error:", err);
    try { res.status(500).json({ error: err.message }); } catch(e) {}
  }
}
