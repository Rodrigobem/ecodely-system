// api/whatsapp/webhook.js
// Recebe mensagens da Evolution API, processa com Claude, responde

const { createClient } = require("@supabase/supabase-js");

const SUPA_URL = process.env.SUPABASE_URL || "https://xklvqcxhtariqqhvnseh.supabase.co";
const SUPA_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrbHZxY3hodGFyaXFxaHZuc2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0NTYxMjYsImV4cCI6MjA5NDAzMjEyNn0.uZmJKJNTMpH65z3eztXKbip6jiZnsuKIUUl3ceWd5XU";
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const EVOLUTION_URL = process.env.EVOLUTION_API_URL;   // ex: https://evo.seudominio.com
const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY;   // api key da Evolution API
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE || "ecodely";

const supabase = createClient(SUPA_URL, SUPA_KEY);

// ── Prompt de sistema por modo ──────────────────────────────────────────────
function buildSystemPrompt(modo, dadosLead) {
  const base = `Você é o agente comercial da Ecodely Mídia In-Home, uma empresa de publicidade que instala displays com anúncios de grandes marcas dentro de estabelecimentos comerciais (restaurantes, padarias, bares, etc). Os estabelecimentos parceiros recebem comissão mensal sem nenhum custo.

REGRAS ABSOLUTAS:
- Nunca diga que é uma IA ou robô. Se perguntarem, diga que é do time comercial da Ecodely.
- Seja natural, direto e amigável. Use linguagem brasileira informal mas profissional.
- Mensagens curtas — máximo 3 parágrafos por resposta.
- Use emojis com moderação.
- Nunca invente valores de comissão específicos — diga que depende do perfil do local.

QUANDO DETECTAR INTERESSE REAL e coletar nome + tipo de estabelecimento + cidade, retorne um JSON assim (e APENAS o JSON, sem texto antes ou depois):
{"acao":"cadastrar_lead","dados":{"nome":"${dadosLead?.nome || ""}","tipo":"","cidade":"","responsavel":"","telefone":""}}

QUANDO O LEAD CONFIRMAR PARCERIA, retorne:
{"acao":"converter_parceiro","dados":{"nome":"","tipo":"","cidade":"","responsavel":"","telefone":"","endereco":""}}

QUANDO ENCERRAR conversa sem interesse, retorne:
{"acao":"encerrar","motivo":"sem_interesse"}`;

  if (modo === "prospecto") {
    return base + `

MODO: PROSPECÇÃO FRIA
Seu objetivo é:
1. Apresentar a Ecodely de forma atrativa
2. Qualificar o estabelecimento (tipo, fluxo de pessoas, localização)
3. Se qualificado, propor a parceria e coletar os dados para cadastro
4. Se não qualificado ou sem interesse, encerrar cordialmente

Fluxo sugerido: apresentação → qualificação → proposta → dados → confirmação`;
  }

  if (modo === "parceiro") {
    return `Você é o assistente da Ecodely para parceiros já cadastrados. Ajude com dúvidas sobre postagens, materiais, pagamentos e campanhas. Seja prestativo e resolutivo.`;
  }

  if (modo === "cobranca") {
    return `Você é o assistente da Ecodely. Lembre o parceiro sobre a postagem pendente do mês de forma amigável. Se já fez, confirme e agradeça. Se não fez, motive e ofereça ajuda com o conteúdo.`;
  }

  return base;
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
      max_tokens: 500,
      system: systemPrompt,
      messages,
    }),
  });
  const data = await response.json();
  return data.content?.[0]?.text || "";
}

// ── Enviar mensagem pelo WhatsApp (Evolution API) ─────────────────────────
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

// ── Handler principal ──────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, apikey");
  if (req.method === "OPTIONS") return res.status(200).end();

  // GET — health check
  if (req.method === "GET") return res.json({ ok: true, agent: "Ecodely WhatsApp Agent" });

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = req.body;

    // Evolution API envia: { data: { key: { remoteJid }, message: { conversation } } }
    const numero = body?.data?.key?.remoteJid?.replace("@s.whatsapp.net", "") ||
                   body?.numero; // fallback para testes manuais
    const textoRecebido = body?.data?.message?.conversation ||
                          body?.data?.message?.extendedTextMessage?.text ||
                          body?.mensagem; // fallback para testes

    if (!numero || !textoRecebido) {
      return res.status(200).json({ ok: true, skipped: "no text message" });
    }

    // Ignorar mensagens do próprio agente
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

    // Atualizar status e timestamp
    await supabase.from("wa_conversas").update({
      status: conversa.status === "novo" ? "em_andamento" : conversa.status,
      atualizado_em: new Date().toISOString(),
    }).eq("id", conversa.id);

    // ── 3. Buscar histórico para contexto ─────────────────────────────────
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
        // Gerar mensagem humana baseada na ação
        if (parsed.acao === "cadastrar_lead") {
          textoFinal = `Perfeito! Registrei seus dados aqui. 📋 Nossa equipe vai entrar em contato em breve para dar continuidade. Tem mais alguma dúvida?`;
          await supabase.from("wa_conversas").update({
            dados_lead: parsed.dados,
            status: "aguardando",
            nome: parsed.dados?.nome || conversa.nome,
          }).eq("id", conversa.id);
        } else if (parsed.acao === "converter_parceiro") {
          textoFinal = `🎉 Que ótima notícia! Bem-vindo à família Ecodely! Seu cadastro foi confirmado. Nossa equipe de instalação vai entrar em contato para agendar a visita. Qualquer dúvida, é só chamar aqui!`;
          await supabase.from("wa_conversas").update({
            dados_lead: parsed.dados,
            status: "convertido",
            modo: "parceiro",
            nome: parsed.dados?.nome || conversa.nome,
          }).eq("id", conversa.id);

          // Inserir como parceiro na base
          await supabase.from("parceiros").insert({
            data: {
              name: parsed.dados?.nome || "Novo Parceiro",
              category: parsed.dados?.tipo || "Outro",
              city: parsed.dados?.cidade || "",
              whatsapp: numero,
              status: "prospectado",
              mesesNaBase: 0,
              campanhas: 0,
              engajamento: 1,
              score: 20,
              contrato: { status: "sem contrato" },
            }
          });
        } else if (parsed.acao === "encerrar") {
          textoFinal = `Tudo bem! Qualquer dia que quiser saber mais sobre a Ecodely, pode chamar aqui. Até mais! 👋`;
          await supabase.from("wa_conversas").update({ status: "encerrado" }).eq("id", conversa.id);
        }
      }
    } catch (e) {
      // Não é JSON — resposta normal de texto
    }

    // ── 6. Salvar resposta do agente ───────────────────────────────────────
    await supabase.from("wa_mensagens").insert({
      conversa_id: conversa.id,
      role: "assistant",
      conteudo: textoFinal,
    });

    // ── 7. Enviar pelo WhatsApp ────────────────────────────────────────────
    await sendWhatsApp(numero, textoFinal);

    return res.status(200).json({ ok: true, acao: acao?.acao || "resposta", resposta: textoFinal });

  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ error: err.message });
  }
};
