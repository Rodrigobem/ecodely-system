// api/whatsapp/send.js
// Envio manual de mensagens pelo painel do sistema

const { createClient } = require("@supabase/supabase-js");

const SUPA_URL = process.env.SUPABASE_URL || "https://xklvqcxhtariqqhvnseh.supabase.co";
const SUPA_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrbHZxY3hodGFyaXFxaHZuc2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0NTYxMjYsImV4cCI6MjA5NDAzMjEyNn0.uZmJKJNTMpH65z3eztXKbip6jiZnsuKIUUl3ceWd5XU";
const EVOLUTION_URL = process.env.EVOLUTION_API_URL;
const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY;
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE || "ecodely";

const supabase = createClient(SUPA_URL, SUPA_KEY);

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { numero, mensagem, conversa_id, modo } = req.body;
    if (!numero || !mensagem) return res.status(400).json({ error: "numero e mensagem obrigatórios" });

    // Enviar pelo WhatsApp
    if (EVOLUTION_URL && EVOLUTION_KEY) {
      await fetch(`${EVOLUTION_URL}/message/sendText/${EVOLUTION_INSTANCE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": EVOLUTION_KEY },
        body: JSON.stringify({ number: numero, text: mensagem }),
      });
    } else {
      console.log("[WA MOCK] Enviando para", numero, ":", mensagem);
    }

    // Salvar no histórico
    if (conversa_id) {
      await supabase.from("wa_mensagens").insert({
        conversa_id,
        role: "assistant",
        conteudo: mensagem,
      });
      await supabase.from("wa_conversas").update({
        atualizado_em: new Date().toISOString(),
      }).eq("id", conversa_id);
    }

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
