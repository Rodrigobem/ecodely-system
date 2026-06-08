// api/whatsapp/webhook.js — Maya · prospecção Ecodely

const SUPA_URL = "https://xklvqcxhtariqqhvnseh.supabase.co";
const SUPA_KEY = process.env.SUPABASE_ANON_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const EVOLUTION_URL = process.env.EVOLUTION_URL;
const EVOLUTION_KEY = process.env.EVOLUTION_KEY;
const EVOLUTION_INSTANCEANCE = process.env.EVOLUTION_INSTANCEANCE || "maya";

const FOTOS_CASES = [
  "https://drive.usercontent.google.com/download?id=1qNEXechEqIf5BxAe5TcYlplKTFXFYqim&export=download",
  "https://drive.usercontent.google.com/download?id=1NopFJUr9EiNIs4G42p9Z8331ds3QIMnb&export=download",
  "https://drive.usercontent.google.com/download?id=1aQhWAWQETYZdDbVJlR8WJRlVvArVOkUt&export=download",
  "https://drive.usercontent.google.com/download?id=1vbSZrZih0KtuC9R_4zQW64Tzd83ZgyvV&export=download",
  "https://drive.usercontent.google.com/download?id=1od6N5I-HsWnZWqZAun-S_1oek6SG5zpr&export=download",
  "https://drive.usercontent.google.com/download?id=1j78oW2ukhpb1rttHFbFCiCunAlmVG8aw&export=download",
  "https://drive.usercontent.google.com/download?id=1jexyoFOa0SO637c98rPgb6RZIG-A1u_V&export=download",
];

const PEDIDOS_MIN = 250; // mínimo para qualificação

// ── DB ───────────────────────────────────────────────────────────────────────
const H = { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, "Content-Type": "application/json" };

const DB = {
  async get(table, col, val) {
    const r = await fetch(`${SUPA_URL}/rest/v1/${table}?${col}=eq.${encodeURIComponent(val)}&limit=1`, { headers: H });
    const d = await r.json();
    return Array.isArray(d) && d.length > 0 ? d[0] : null;
  },
  async insert(table, row) {
    const r = await fetch(`${SUPA_URL}/rest/v1/${table}`, {
      method: "POST", headers: { ...H, Prefer: "return=representation" }, body: JSON.stringify(row),
    });
    const d = await r.json();
    return Array.isArray(d) ? d[0] : d;
  },
  async update(table, col, val, data) {
    await fetch(`${SUPA_URL}/rest/v1/${table}?${col}=eq.${encodeURIComponent(val)}`, {
      method: "PATCH", headers: H, body: JSON.stringify(data),
    });
  },
  async list(table, col, val, order = "criado_em", asc = true, limit = 20) {
    const r = await fetch(
      `${SUPA_URL}/rest/v1/${table}?${col}=eq.${encodeURIComponent(val)}&order=${order}.${asc ? "asc" : "desc"}&limit=${limit}`,
      { headers: H }
    );
    return r.json();
  },
};

// ── Evolution API ────────────────────────────────────────────────────────────
async function sendText(numero, texto) {
  try {
    await fetch(`${EVOLUTION_URL}/message/sendText/${EVOLUTION_INSTANCE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: EVOLUTION_KEY },
      body: JSON.stringify({ number: numero, text: texto }),
    });
  } catch (e) { console.error("sendText:", e.message); }
}

async function sendImagem(numero, url, caption = "") {
  try {
    await fetch(`${EVOLUTION_URL}/message/sendMedia/${EVOLUTION_INSTANCE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: EVOLUTION_KEY },
      body: JSON.stringify({ number: numero, mediatype: "image", mimetype: "image/jpeg", caption, media: url }),
    });
  } catch (e) { console.error("sendImagem:", e.message); }
}

// ── Keyword shortcuts (sem gastar tokens) ────────────────────────────────────
const FOTO_KW  = ["foto", "imagem", "como é", "exemplo", "print", "mostra", "cases", "case"];
const HUMAN_KW = ["falar com alguém", "falar com pessoa", "falar com humano", "atendente",
                  "não quero falar com robô", "chama alguém", "me passa pra alguém"];

const temPalavra = (texto, kws) => kws.some(k => texto.toLowerCase().includes(k));

// ── System prompt ─────────────────────────────────────────────────────────────
function buildSystemPrompt(conversa) {
  const nome   = conversa.nome || conversa.dados_lead?.nome_restaurante || "";
  const etapa  = conversa.dados_lead?.qualif_etapa || "inicial";
  const cidade = conversa.dados_lead?.cidade || "";

  return `Você é a Maya, da Ecodely Mídia. Fala pelo WhatsApp com donos de restaurante. Você é uma pessoa real — nunca diga que é IA ou robô.

TOM: descontraído, direto, como amigo. NUNCA mande textão. Máximo 2 linhas por mensagem. Uma pergunta por vez. Espera a resposta antes de avançar.

CONTEXTO ATUAL:
${nome ? `Restaurante: "${nome}"` : "Nome: ainda não coletado"}${cidade ? ` · Cidade: ${cidade}` : ""}
Etapa: ${etapa}

─────────────────────────
SOBRE A ECODELY
─────────────────────────
Fornece embalagens de delivery (Ecobox) de graça para restaurantes parceiros.
Logo do restaurante na frente, campanha de marca conhecida no verso (tipo Claro).
Zero custo pro restaurante — as embalagens são o pagamento pelo espaço de mídia.

Segmentos atendidos: hamburguerias, japoneses, açaí, marmitas, cafeterias, temakerias.
NÃO atende pizzarias.

Obrigações do parceiro (não negociáveis):
- Postar no Instagram 1× por semana marcando @ecodelymidia
- Enviar print das métricas dos stories
- Foto de check-in quando as embalagens chegarem

─────────────────────────
FLUXO (uma pergunta por vez, em ordem)
─────────────────────────
1. FAZ DELIVERY? (qualquer plataforma ou app próprio)
   Não faz → {"acao":"encerrar","motivo":"nao_faz_delivery"}

2. QUANTOS PEDIDOS/DIA?
   Menos de ${PEDIDOS_MIN} → {"acao":"lista_espera","dados":{...}}
   ${PEDIDOS_MIN}+ → qualificado, avançar

3. QUAL PLATAFORMA? (iFood, Rappi, app próprio, outros)

4. COLETAR: nome do responsável + WhatsApp de contato

5. QUALIFICADO → {"acao":"qualificado","dados":{...}}
   Avisar que a Victória da equipe vai entrar em contato para fechar os detalhes.

─────────────────────────
OBJEÇÕES (resposta curta, natural, máximo 2 linhas)
─────────────────────────
"não tenho interesse" / "não quero"
→ é grátis e sem compromisso, vale 2 min. Se persistir: encerrar com {"acao":"encerrar","motivo":"sem_interesse"}

"como funciona?"
→ 3 passos: escolhem a embalagem, personalizam com o logo de vocês, entregamos de graça. só isso.

"tem custo?"
→ zero. pelo contrário, vocês ganham embalagens de graça.

"quem são os anunciantes?"
→ marcas conhecidas — Claro, bancos, apps populares. nada que constranja.

"preciso assinar contrato?"
→ sim, só 1 página, sem fidelidade. simples.

"já tenho embalagem"
→ a nossa chega de graça e já vem com o logo de vocês. quanto vocês pagam por mês com embalagem?

─────────────────────────
TRANSFERIR PARA HUMANO
─────────────────────────
Quando: pediu explicitamente pessoa/atendente, dúvida técnica que não sabe responder.
→ {"acao":"passar_para_humano","motivo":"pediu_humano|duvida_tecnica","dados":{...}}

─────────────────────────
REGRAS ABSOLUTAS
─────────────────────────
- Máximo 2 linhas por mensagem
- Uma pergunta por vez
- Sem bullet points no WhatsApp — texto corrido
- Sem "Ótimo!", "Perfeito!", "Excelente!", "Claro!" no início
- Máximo 1 emoji por mensagem
- Não repita o que já perguntou no histórico
- Use o nome do restaurante quando souber

─────────────────────────
AÇÕES JSON (retorne SOMENTE o JSON, sem texto antes ou depois)
─────────────────────────
{"acao":"qualificado","dados":{"nome_restaurante":"","responsavel":"","telefone":"","cidade":"","plataforma":"","pedidos_dia":0}}
{"acao":"lista_espera","dados":{"nome_restaurante":"","responsavel":"","telefone":"","cidade":"","plataforma":"","pedidos_dia":0}}
{"acao":"encerrar","motivo":"nao_faz_delivery|sem_interesse"}
{"acao":"passar_para_humano","motivo":"","dados":{"nome_restaurante":"","responsavel":"","telefone":"","pedidos_dia":0,"cidade":""}}
{"acao":"enviar_fotos"}

Para tudo mais: responda com texto normal.`;
}

// ── Claude ────────────────────────────────────────────────────────────────────
async function callClaude(systemPrompt, messages) {
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system: systemPrompt,
        messages: messages.length > 0 ? messages : [{ role: "user", content: "oi" }],
      }),
    });
    const data = await r.json();
    console.log("CLAUDE:", JSON.stringify(data).substring(0, 300));
    return data.content?.[0]?.text || "";
  } catch (e) {
    console.error("callClaude:", e.message);
    return "";
  }
}

// ── Salvar prospect na tabela prospects ──────────────────────────────────────
async function saveProspect(dados, numero, conversaId, stage = "qualificado") {
  try {
    await DB.insert("prospects", {
      name:           dados.nome_restaurante || numero || "",
      phone:          dados.telefone || numero || "",
      contact:        dados.responsavel || "",
      stage,
      cidade:         dados.cidade || "",
      plataforma:     dados.plataforma || "",
      pedidos_dia:    dados.pedidos_dia || null,
      wa_conversa_id: conversaId,
      notes:          `Via Maya WhatsApp. Pedidos/dia: ${dados.pedidos_dia || "—"}. Plataforma: ${dados.plataforma || "—"}.`,
    });
    console.log(`Prospect salvo [${stage}]:`, dados.nome_restaurante);
  } catch (e) { console.error("saveProspect:", e.message); }
}

// ── Pipeline (pipeline_leads) ─────────────────────────────────────────────────
async function upsertPipeline(conversaId, etapa, dados = {}) {
  try {
    const existente = await DB.get("pipeline_leads", "wa_conversa_id", conversaId);
    const ORDEM = ["abordado", "respondeu", "em_qualificacao", "lista_espera", "interessado", "qualificado", "convertido", "encerrado"];
    const payload = {
      nome:           dados.nome_restaurante || dados.nome || "",
      responsavel:    dados.responsavel || "Maya",
      etapa,
      cidade:         dados.cidade || "",
      tipo:           dados.tipo || dados.plataforma || "",
      telefone:       dados.telefone || "",
      pedidos_dia:    dados.pedidos_dia || null,
      usa_ifood:      (dados.plataforma || "").toLowerCase().includes("ifood"),
      usa_rappi:      (dados.plataforma || "").toLowerCase().includes("rappi"),
      origem:         "whatsapp",
      wa_conversa_id: conversaId,
      atualizado_em:  new Date().toISOString(),
    };
    if (existente) {
      if (ORDEM.indexOf(etapa) > ORDEM.indexOf(existente.etapa || "")) {
        await DB.update("pipeline_leads", "wa_conversa_id", conversaId, payload);
      }
    } else {
      await DB.insert("pipeline_leads", { ...payload, criado_em: new Date().toISOString() });
    }
  } catch (e) { console.error("upsertPipeline:", e.message); }
}

// ── Handler principal ─────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, apikey");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method === "GET")     return res.json({ ok: true, agent: "Maya · Ecodely" });
  if (req.method !== "POST")   return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = req.body;

    // Extrair JID e número
    const rawJid = body?.data?.key?.remoteJid || "";
    if (rawJid.includes("@g.us")) return res.status(200).json({ ok: true, skipped: "group" });
    if (body?.data?.key?.fromMe)  return res.status(200).json({ ok: true, skipped: "fromMe" });

    let jid    = rawJid;
    let numero = rawJid.replace("@s.whatsapp.net", "").replace("@c.us", "").replace("@lid", "") || body?.numero;

    // Resolver @lid
    if (rawJid.includes("@lid")) {
      try {
        const msgResp = await fetch(`${EVOLUTION_URL}/chat/findMessages/${EVOLUTION_INSTANCE}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: EVOLUTION_KEY },
          body: JSON.stringify({ where: { key: { remoteJid: rawJid } }, limit: 5 }),
        });
        const msgs = await msgResp.json();
        if (Array.isArray(msgs) && msgs.length > 0) {
          const real = msgs[0]?.key?.remoteJid || "";
          if (real.includes("@s.whatsapp.net")) { jid = real; numero = real.replace("@s.whatsapp.net", ""); }
        }
        if (jid.includes("@lid")) {
          const conv = await DB.get("wa_conversas", "lid_jid", rawJid);
          if (conv?.numero) { numero = conv.numero; jid = numero + "@s.whatsapp.net"; }
        }
      } catch (e) { console.log("@lid:", e.message); }
    }

    const textoRecebido =
      body?.data?.message?.conversation ||
      body?.data?.message?.extendedTextMessage?.text ||
      body?.mensagem;

    if (!numero || !textoRecebido) return res.status(200).json({ ok: true, skipped: "no text" });
    console.log(`[${numero}] ${textoRecebido.substring(0, 120)}`);

    // Buscar ou criar conversa
    let conversa = await DB.get("wa_conversas", "numero", numero);
    if (!conversa) {
      conversa = await DB.insert("wa_conversas", {
        numero, modo: "prospecto", status: "novo",
        dados_lead: { qualif_etapa: "inicial" },
      });
    }
    if (!conversa?.id) return res.status(200).json({ ok: true, skipped: "db error" });

    // Salvar mensagem e atualizar status
    await DB.insert("wa_mensagens", { conversa_id: conversa.id, role: "user", conteudo: textoRecebido });
    await DB.update("wa_conversas", "id", conversa.id, {
      status: conversa.status === "novo" ? "em_andamento" : conversa.status,
      atualizado_em: new Date().toISOString(),
    });
    await upsertPipeline(conversa.id, conversa.status === "novo" ? "abordado" : "respondeu");

    // Atalhos por keyword
    if (temPalavra(textoRecebido, FOTO_KW)) {
      const msg = "aqui vão alguns cases das nossas embalagens 📸";
      await DB.insert("wa_mensagens", { conversa_id: conversa.id, role: "assistant", conteudo: msg });
      await sendText(jid, msg);
      const fotos = [...FOTOS_CASES].sort(() => Math.random() - 0.5).slice(0, 3);
      for (const url of fotos) await sendImagem(jid, url);
      return res.status(200).json({ ok: true, acao: "fotos" });
    }

    if (temPalavra(textoRecebido, HUMAN_KW)) {
      const msg = "claro! vou chamar alguém da equipe agora pra continuar com você 👍";
      await DB.insert("wa_mensagens", { conversa_id: conversa.id, role: "assistant", conteudo: msg });
      await sendText(jid, msg);
      await DB.update("wa_conversas", "id", conversa.id, { status: "aguardando_humano" });
      await upsertPipeline(conversa.id, "interessado", conversa.dados_lead || {});
      return res.status(200).json({ ok: true, acao: "passar_para_humano" });
    }

    // Histórico (filtra JSON actions para não confundir a IA)
    const historicoBruto = await DB.list("wa_mensagens", "conversa_id", conversa.id, "criado_em", true, 20);
    const messages = (Array.isArray(historicoBruto) ? historicoBruto : [])
      .filter(m => {
        if (m.role !== "user" && m.role !== "assistant") return false;
        if (!m.conteudo?.trim()) return false;
        if (m.conteudo.trim().startsWith("{")) return false;
        return true;
      })
      .map(m => ({ role: m.role, content: m.conteudo }));

    // Chamar Claude
    const systemPrompt = buildSystemPrompt(conversa);
    let resposta = await callClaude(systemPrompt, messages);

    if (!resposta?.trim()) {
      console.log("RETRY sem histórico");
      resposta = await callClaude(systemPrompt, [{ role: "user", content: textoRecebido }]);
    }
    if (!resposta?.trim()) resposta = "desculpa, pode repetir?";

    // Detectar JSON na resposta
    try {
      const jsonMatch = resposta.match(/\{[\s\S]*"acao"[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.acao) {
          await processarAcao(parsed, conversa, numero, jid, res);
          return;
        }
      }
    } catch (_) { /* resposta textual */ }

    // Texto normal
    if (resposta && !resposta.trim().startsWith("{") && resposta.length > 2) {
      await DB.insert("wa_mensagens", { conversa_id: conversa.id, role: "assistant", conteudo: resposta });
      await sendText(jid, resposta);
    }

    return res.status(200).json({ ok: true, acao: "resposta", resposta });

  } catch (err) {
    console.error("webhook error:", err);
    try { res.status(500).json({ error: err.message }); } catch (_) {}
  }
}

// ── Ações ─────────────────────────────────────────────────────────────────────
async function processarAcao(parsed, conversa, numero, jid, res) {
  const dados = parsed.dados || {};
  let texto = "";
  let enviarFotos = false;

  switch (parsed.acao) {

    case "enviar_fotos":
      texto = "aqui vão alguns cases das nossas embalagens 📸";
      enviarFotos = true;
      break;

    case "qualificado": {
      texto = `perfeito! a Victória da nossa equipe vai entrar em contato com você pra fechar os detalhes. fica no aguardo 🙌`;
      await DB.update("wa_conversas", "id", conversa.id, {
        nome:      dados.nome_restaurante || conversa.nome,
        status:    "qualificado",
        dados_lead: { ...(conversa.dados_lead || {}), ...dados, qualif_etapa: "qualificado" },
      });
      await upsertPipeline(conversa.id, "qualificado", dados);
      await saveProspect(dados, numero, conversa.id, "qualificado");
      break;
    }

    case "lista_espera": {
      const nomeExib = dados.nome_restaurante ? `o ${dados.nome_restaurante}` : "vocês";
      texto = `entendido! por enquanto o mínimo é ${PEDIDOS_MIN} pedidos/dia, mas vou salvar o contato de ${nomeExib}. quando tiver vaga na sua cidade a gente avisa 👋`;
      await DB.update("wa_conversas", "id", conversa.id, {
        nome:      dados.nome_restaurante || conversa.nome,
        status:    "lista_espera",
        dados_lead: { ...(conversa.dados_lead || {}), ...dados, qualif_etapa: "lista_espera" },
      });
      await upsertPipeline(conversa.id, "lista_espera", dados);
      await saveProspect(dados, numero, conversa.id, "lista_espera");
      break;
    }

    case "passar_para_humano": {
      const motivo = parsed.motivo || "pediu_humano";
      texto = motivo === "duvida_tecnica"
        ? "boa pergunta! essa aí é melhor a equipe responder — vou te conectar agora 👍"
        : "claro! um momento, já chamo alguém da equipe pra você 👍";
      await DB.update("wa_conversas", "id", conversa.id, {
        nome:      dados.nome_restaurante || conversa.nome,
        status:    "aguardando_humano",
        dados_lead: { ...(conversa.dados_lead || {}), ...dados, qualif_etapa: "aguardando_humano" },
      });
      const etapaPip = (dados.pedidos_dia || 0) >= PEDIDOS_MIN ? "qualificado" : "interessado";
      await upsertPipeline(conversa.id, etapaPip, dados);
      if ((dados.pedidos_dia || 0) >= PEDIDOS_MIN) await saveProspect(dados, numero, conversa.id, "qualificado");
      break;
    }

    case "encerrar":
      texto = parsed.motivo === "nao_faz_delivery"
        ? "entendido! por enquanto trabalhamos só com delivery. se isso mudar, pode chamar 🙂"
        : "tudo bem! se quiser saber mais sobre a Ecodely é só chamar 👋";
      await DB.update("wa_conversas", "id", conversa.id, { status: "encerrado" });
      await upsertPipeline(conversa.id, "encerrado", conversa.dados_lead || {});
      break;

    default:
      texto = "deixa eu verificar e já te falo 👍";
  }

  if (texto) {
    await DB.insert("wa_mensagens", { conversa_id: conversa.id, role: "assistant", conteudo: texto });
    await sendText(jid, texto);
  }

  if (enviarFotos) {
    const fotos = [...FOTOS_CASES].sort(() => Math.random() - 0.5).slice(0, 3);
    for (const url of fotos) await sendImagem(jid, url);
  }

  return res.status(200).json({ ok: true, acao: parsed.acao, resposta: texto });
}
