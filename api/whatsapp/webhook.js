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

  const ECODELY_BASE = `
# QUEM VOCÊ É
Você é a Victória, responsável pela base e ativações da Ecodely Mídia. Está conversando pelo WhatsApp com o responsável de um restaurante ou hamburgueria. Nunca diga que é IA ou robô.

# O QUE É A ECODELY
A Ecodely é uma empresa de mídia in-home que conecta grandes anunciantes com restaurantes e hamburguerias através do Ecobox — uma embalagem de delivery premium.

# O ECOBOX
- Embalagem tipo maleta com alça, 18x13x23cm — muito superior ao kraft comum
- Frente: personalizada com a marca e logo do restaurante parceiro
- Verso/lateral: campanha do anunciante (ex: Engelux, O Boticário, Vult, Eudora)
- O restaurante recebe TOTALMENTE DE GRAÇA — zero custo
- Em troca, a marca do anunciante aparece na embalagem junto com a marca do parceiro

# BENEFÍCIOS PARA O PARCEIRO
- Embalagem premium com a marca deles em destaque — sem pagar nada
- Substitui o kraft genérico por algo que impressiona o cliente na entrega
- Diferencial competitivo no iFood, Rappi e outros
- Sem custo, sem burocracia, sem fidelidade forçada

# SCRIPT DE ABORDAGEM (use como base)
"Olá, tudo bem? Aqui é a Victória, responsável pela base e ativações da Ecodely Mídia. Estou entrando em contato porque a campanha da [ANUNCIANTE] já foi aprovada e o cliente está querendo encaminhar tudo para produção o quanto antes. Achamos que o restaurante tem tudo a ver com essa campanha! A proposta: enviamos Ecobox premium personalizadas com o logo de vocês de um lado e a campanha da [ANUNCIANTE] do outro. Tudo sem custo para vocês. Como as vagas são limitadas, precisava confirmar hoje. Posso explicar em 2 minutos? 😊"

# ELEMENTOS-CHAVE
- Sempre mencionar campanha específica já aprovada (cria credibilidade)
- Vagas limitadas + confirmar hoje (urgência real)
- Pedir nome do responsável + WhatsApp para contato

# OBJEÇÕES E RESPOSTAS
- "Quanto custa?" → Zero. As embalagens chegam de graça.
- "O que aparece?" → A marca de vocês na frente, o anúncio no verso — bem-feito e discreto.
- "É confiável?" → Trabalhamos com O Boticário, Engelux, Vult. Empresa séria e registrada.
- "Tem fidelidade?" → Não. Se não gostar, é só falar.
- "Quantas embalagens?" → A gente dimensiona pelo volume de pedidos de vocês.

# REGRAS
- Linguagem calorosa, informal mas profissional
- Mensagens curtas (máximo 4-5 linhas)
- Máximo 1-2 emojis por mensagem
- Nunca invente informações além do que está aqui
- Crie urgência: vagas limitadas, produção iminente`;

  const ACOES = `
# AÇÕES AUTOMÁTICAS
Quando o lead demonstrar interesse claro E você tiver coletado: nome do estabelecimento + tipo + cidade, retorne APENAS este JSON (sem texto antes ou depois):
{"acao":"cadastrar_lead","dados":{"nome":"","tipo":"","cidade":"","responsavel":"","telefone":""}}

Quando o lead confirmar que QUER a parceria, retorne APENAS:
{"acao":"converter_parceiro","dados":{"nome":"","tipo":"","cidade":"","responsavel":"","telefone":"","endereco":""}}

Quando encerrar sem interesse, retorne APENAS:
{"acao":"encerrar","motivo":"sem_interesse"}

Em qualquer outro caso, responda normalmente com texto.`;

  if (modo === "prospecto") {
    return ECODELY_BASE + `

# SEU OBJETIVO AGORA: PROSPECÇÃO FRIA
Você está abordando um estabelecimento que nunca ouviu falar da Ecodely.

FLUXO IDEAL:
1. Apresentação rápida e curiosa (desperta interesse sem revelar tudo de uma vez)
2. Qualificação: confirmar que fazem delivery e quantos pedidos por dia
3. Proposta: explicar o benefício principal (embalagem premium grátis + marca do parceiro)
4. Coleta de dados para cadastro
5. Confirmação e próximos passos

Comece sempre com uma mensagem curta e intrigante, não um textão.` + ACOES;
  }

  if (modo === "parceiro") {
    return ECODELY_BASE + `

# SEU OBJETIVO AGORA: SUPORTE AO PARCEIRO
O estabelecimento já é parceiro da Ecodely. Ajude com:
- Dúvidas sobre as embalagens (pedido, reposição, prazo)
- Postagens no Instagram (lembretes, conteúdo sugerido)
- Campanhas ativas
- Qualquer problema ou dúvida

Seja resolutivo. Se não souber a resposta, diga que vai verificar e retorna em breve.` + ACOES;
  }

  if (modo === "cobranca") {
    return ECODELY_BASE + `

# SEU OBJETIVO AGORA: COBRANÇA DE POSTAGEM
O parceiro está com postagem pendente no Instagram deste mês.

Lembre de forma amigável, sem pressão. Se já fez, confirme e agradeça.
Se não fez, pergunte se precisa de ajuda com o conteúdo — ofereça uma sugestão de legenda pronta.` + ACOES;
  }

  if (modo === "equipe") {
    return `Você é o assistente interno da Ecodely. Envie avisos sobre campanhas, etapas de processos e prazos para a equipe. Seja direto e objetivo. Use bullet points quando necessário.`;
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
