# Ecodely — Sistema de Gestão

Sistema de gestão completo para operação da Ecodely (Mídia In-Home).

## Como subir no Vercel (passo a passo)

### 1. Criar repositório no GitHub

1. Acesse github.com e faça login (usuário: rodrigobem)
2. Clique em **New repository**
3. Nome: `ecodely-system`
4. Deixe **Private** (recomendado)
5. Clique em **Create repository**

### 2. Subir os arquivos

Na página do repositório recém-criado, clique em **uploading an existing file** e suba todos os arquivos desta pasta mantendo a estrutura:

```
ecodely-system/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── .gitignore
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    └── App.jsx
```

### 3. Deploy no Vercel

1. Acesse vercel.com e faça login com sua conta GitHub
2. Clique em **Add New Project**
3. Selecione o repositório `ecodely-system`
4. Clique em **Deploy** (as configurações já estão corretas)
5. Em ~2 minutos você terá um link tipo: `ecodely-system.vercel.app`

### 4. Domínio personalizado (opcional)

No painel do Vercel, vá em **Settings > Domains** e adicione:
`sistema.ecodely.com.br`

---

## Logins demo

| E-mail | Senha | Perfil |
|--------|-------|--------|
| a | 1 | Admin Teste (acesso rápido) |
| rodrigobem@ecodely.com.br | [ver Supabase] | Administrador |
| ana@ecodely.com.br | user123 | Comercial |
| juliana@ecodely.com.br | user123 | Marketing |
| paulo@ecodely.com.br | user123 | Financeiro |
| mariana@ecodely.com.br | user123 | Base |
| carlos@ecodely.com.br | user123 | Operacional |

## Módulos do sistema

- Dashboard com KPIs e alertas
- Minha Fila por setor
- Campanhas (Kanban + drag & drop mobile)
- Calendário de campanhas
- Comercial + Pipeline + Faturamento
- Comissões com aprovação
- Base de parceiros com Score + Contratos
- Prospecção automatizada
- Painel do Cliente (mapa + gráficos + galeria)
- Relatório PDF
- Notificações (sistema + WhatsApp + e-mail)
