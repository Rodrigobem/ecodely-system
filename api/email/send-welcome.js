// api/email/send-welcome.js
// Envia email de boas-vindas para os usuários do sistema Ecodely

const RESEND_KEY = process.env.RESEND_API_KEY;

const usuarios = [
  { name: "Rodrigo Bem", email: "rodrigobem@ecodely.com.br", role: "Administrador", pass: process.env.ADMIN_PASS||"[redacted]" },
  { name: "Pedro Camaor", email: "pedro.camaor@ecodely.com.br", role: "Administrador", pass: "[redacted]" },
  { name: "Priscila", email: "opec@ecodely.com.br", role: "Base & Operacional", pass: "[redacted]" },
  { name: "Larissa", email: "financeiro@ecodely.com.br", role: "Financeiro", pass: "[redacted]" },
  { name: "Victoria", email: "victoria@ecodely.com.br", role: "Base", pass: "[redacted]" },
  { name: "Pedro Henrique", email: "marketing@ecodely.com.br", role: "Marketing", pass: "[redacted]" },
];

function emailHtml(name, email, role, pass) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0f1117;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1117;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#00c896,#00a07a);border-radius:16px 16px 0 0;padding:48px 40px;text-align:center;">
              <div style="font-size:36px;font-weight:900;color:#fff;letter-spacing:-1px;">ECODELY</div>
              <div style="font-size:13px;color:rgba(255,255,255,0.8);letter-spacing:4px;margin-top:4px;">MÍDIA</div>
              <div style="margin-top:24px;font-size:22px;color:#fff;font-weight:600;">Bem-vindo ao Sistema Ecodely 🎉</div>
              <div style="margin-top:8px;font-size:15px;color:rgba(255,255,255,0.85);">Sua plataforma de gestão está pronta</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#1a1d27;padding:40px;">
              <p style="color:#e0e0e0;font-size:16px;margin:0 0 16px;">Olá, <strong style="color:#00c896;">${name}</strong>!</p>
              <p style="color:#a0a0a0;font-size:15px;line-height:1.7;margin:0 0 32px;">
                O Sistema Ecodely está no ar e você já tem acesso. Gerencie campanhas, acompanhe a base de parceiros, monitore o financeiro e muito mais — tudo em um só lugar.
              </p>

              <!-- Credenciais -->
              <div style="background:#0f1117;border:1px solid #2a2d3a;border-radius:12px;padding:24px;margin-bottom:32px;">
                <div style="color:#00c896;font-size:12px;letter-spacing:2px;font-weight:700;margin-bottom:16px;">SEUS DADOS DE ACESSO</div>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:8px 0;border-bottom:1px solid #2a2d3a;">
                      <span style="color:#606070;font-size:13px;">Perfil</span>
                      <span style="color:#fff;font-size:14px;font-weight:600;float:right;">${role}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;border-bottom:1px solid #2a2d3a;">
                      <span style="color:#606070;font-size:13px;">Email</span>
                      <span style="color:#00c896;font-size:14px;font-weight:600;float:right;">${email}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;">
                      <span style="color:#606070;font-size:13px;">Senha</span>
                      <span style="color:#fff;font-size:14px;font-weight:600;float:right;letter-spacing:2px;">${pass}</span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- CTA -->
              <div style="text-align:center;margin-bottom:32px;">
                <a href="https://ecodely-sistema.vercel.app" 
                   style="display:inline-block;background:linear-gradient(135deg,#00c896,#00a07a);color:#fff;font-size:16px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:50px;letter-spacing:0.5px;">
                  Acessar o Sistema →
                </a>
              </div>

              <p style="color:#606070;font-size:13px;text-align:center;margin:0;">
                Recomendamos trocar sua senha no primeiro acesso.<br>
                Dúvidas? Fale com o Rodrigo.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0f1117;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;border-top:1px solid #2a2d3a;">
              <div style="color:#00c896;font-size:14px;font-weight:700;">ECODELY MÍDIA</div>
              <div style="color:#404050;font-size:12px;margin-top:4px;">© 2026 — Sistema de Gestão Interno</div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Verificar se é admin
  const { adminKey } = req.body || {};
  if (adminKey !== process.env.ADMIN_KEY||"ecodely2026admin") {
    return res.status(401).json({ error: "Não autorizado" });
  }

  const resultados = [];

  for (const usuario of usuarios) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Ecodely Sistema <onboarding@resend.dev>",
          to: [usuario.email],
          subject: "🎉 Bem-vindo ao Sistema Ecodely!",
          html: emailHtml(usuario.name, usuario.email, usuario.role, usuario.pass),
        }),
      });

      const data = await response.json();
      resultados.push({ name: usuario.name, email: usuario.email, status: data.id ? "enviado" : "erro", data });
      console.log(`Email para ${usuario.name}: ${data.id ? "OK" : "ERRO"}`);
    } catch (e) {
      resultados.push({ name: usuario.name, email: usuario.email, status: "erro", error: e.message });
    }
  }

  return res.status(200).json({ ok: true, resultados });
}
