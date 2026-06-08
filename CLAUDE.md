# CLAUDE.md — Contexto completo do projeto Ecodely Sistema

Leia este arquivo no início de cada sessão. Contém tudo para trabalhar no projeto sem perder contexto.

---

## 1. A EMPRESA

**Ecodely Mídia** — mídia OOH in-home via embalagens de delivery.

**Modelo de negócio:**
- **Anunciantes (clientes)** pagam campanhas para ter a marca impressa em embalagens
- **Parceiros** são restaurantes de delivery que recebem as embalagens personalizadas gratuitamente em troca de postagens no Instagram marcando @ecodelymidia
- A embalagem (Ecobox) tem o logo do restaurante na frente e a publicidade do cliente no verso

**Produtos:**
- Ecobox Tradicional: 18×13×23cm com alça (hambúrgueres, porções, sobremesas)
- Ecobox Mega Box: 21×15×18cm (sushi, poke, marmitas)

---

## 2. O SISTEMA

**Repositório:** `https://github.com/Rodrigobem/ecodely-system`
**Deploy:** Vercel — `https://ecodely-sistema.vercel.app`
**Equipe Vercel:** `team_Z70Kq0N5p6HKuEGv7JtR3QRa`
**Projeto Vercel:** `prj_bZo3AoVHo2WSF5SJq3JYvcgXdbqj` / slug `ecodely-sistema`

**Stack:**
- React 18.2 + Vite 5.0
- Supabase JS v2 (`@supabase/supabase-js ^2.105.4`)
- Recharts 2.10 (gráficos)
- xlsx 0.18 (exportação Excel)
- Node 20.x (Vercel serverless functions em `/api`)

**Arquivo principal:** `App.jsx` na raiz (~10.000 linhas) — **não está em `/src`**
**Entry point:** `main.jsx` na raiz
**API serverless:** `/api/whatsapp/webhook.js` e `/api/whatsapp/chat.js`

**Variáveis de ambiente (Vercel):**
```
VITE_SUPABASE_URL        https://xklvqcxhtariqqhvnseh.supabase.co
VITE_SUPA_KEY            sb_publishable_... (anon key)
VITE_GOOGLE_MAPS_KEY     AIza... (Google Maps)
ANTHROPIC_API_KEY        sk-ant-... (Claude API)
EVOLUTION_URL            URL da instância Evolution API
EVOLUTION_KEY            API key Evolution
EVOLUTION_INSTANCEANCE   nome da instância (padrão: "maya")
```

---

## 3. BANCO DE DADOS — Supabase

**Projeto:** `xklvqcxhtariqqhvnseh.supabase.co`

### Tabelas principais

| Tabela | Descrição |
|--------|-----------|
| `parceiros` | Restaurantes parceiros. Campo `data jsonb` contém todo o objeto (nome, cidade, estado, endereco{lat,lng,rua}, demograficos, scores, etc.) |
| `campanhas` | Campanhas publicitárias. Stages 0–7. Tem `projectId` para vincular a projetos |
| `projects` | Projetos que agrupam campanhas |
| `prospects` | Pipeline comercial (lead→qualificado→proposta→negociacao→fechado). Campos: `owner`, `representante_id`, `representante_nome`, `stage`, `value` |
| `lancamentos` | Lançamentos financeiros. Tem `fornecedorId bigint` para vincular a gráficas |
| `custos_fixos` | Custos fixos mensais |
| `compras_cartao` | Compras parceladas no cartão |
| `cartoes` | Cartões de crédito cadastrados |
| `contas` | Contas bancárias |
| `fat_mensais` | Metas de faturamento mensais |
| `closings` | Comissões. Campos: `userId`, `status` (pendente/aprovado/reprovado), `pago`, `value`, `prospectId` |
| `fornecedores` | Fornecedores (gráficas, logística). Campo `data jsonb` com todos os dados. Tem toggle `principal` |
| `usuarios` | Usuários do sistema. Senhas com hash SHA-256. Campos: `name`, `email`, `role`, `regiao[]`, `comissao_pct`, `meta` |
| `notificacoes` | Notificações in-app |
| `wa_conversas` | Conversas WhatsApp (Maya/Victoria). Campos: `numero`, `modo` (prospecto/parceiro/cobranca), `status`, `dados_lead jsonb` |
| `wa_mensagens` | Mensagens individuais de cada conversa |
| `planejamentos` | Planejamentos de mídia salvos |
| `pipeline_leads` | Pipeline WhatsApp Maya (separado do pipeline comercial) |
| `configuracoes` | Config do sistema (tema, etc.) |
| `centros_custo` | Centros de custo financeiro |
| `ptypes` | Tipos de parceiro |
| `simulador_feedback` | Feedbacks do simulador WhatsApp IA |
| `comm_table` | Tabela de comissões (legacy/alternativa) |

### Buckets Storage
- `ecodely-files` — uploads gerais (evidências de campanhas, artes)
- `parceiros` — fotos de parceiros

### Padrão de acesso
```js
// Leitura
const { data } = await supabase.from("tabela").select("*").order("id");

// Parceiros: dados no campo jsonb
const parceiros = data.map(r => r.data && typeof r.data === "object" ? { ...r.data, id: r.id } : r);

// Fornecedores: mesmo padrão
const forn = data.map(r => r.data && typeof r.data === "object" ? { ...r.data, id: r.id } : r);
```

---

## 4. INTEGRAÇÕES ATIVAS

### Google Maps API (`VITE_GOOGLE_MAPS_KEY`)
- **Geocoding:** converte endereço → lat/lng dos parceiros
- **Street View Static API:** foto de fachada do parceiro (salva heading/pitch/zoom via listener em tempo real)
- **Places API:** enriquecimento de dados de parceiros (parcialmente implementado)
- Chave usada via `import.meta.env.VITE_GOOGLE_MAPS_KEY` — NUNCA hardcoded no código

### IBGE API (pública, sem chave)
- Base: `https://servicodados.ibge.gov.br/api`
- Dados demográficos Censo 2022 por município: população, área km², densidade, faixas etárias
- Salvos em `parceiro.data.demograficos` no Supabase
- Scripts batch em `/tmp/ibge_demograficos.js` e `/tmp/geocode_parceiros.js`

### Evolution API WhatsApp
- Env vars: `EVOLUTION_URL`, `EVOLUTION_KEY`, `EVOLUTION_INSTANCEANCE`
- Instância padrão: **maya** (chip Claro 11 91503-8750 — número da Victoria)
- Webhook: `/api/whatsapp/webhook.js`
- Envia texto e mídia via `/message/sendText/{instancia}` e `/message/sendMedia/{instancia}`

### Anthropic API — Claude (`ANTHROPIC_API_KEY`)
- Usado em dois lugares:
  1. **Maya** (`/api/whatsapp/webhook.js`): qualificação automática de prospects via WhatsApp
  2. **Victoria** (`/api/whatsapp/chat.js`): simulador de atendimento comercial na tela WhatsApp IA
- Modelo atual: `claude-sonnet-4-20250514` (atualizar para versão mais recente quando necessário)

---

## 5. TELAS DO SISTEMA (14 telas)

| ID | Nome | O que faz |
|----|------|-----------|
| `dashboard` | Dashboard | KPIs gerais (ou dashboard personalizado para representante) |
| `minha-fila` | Minha Fila | Checklist de tarefas por campanha — cada role vê sua etapa |
| `campanhas` | Campanhas | Kanban/lista de campanhas com stages 0–7, evidências, PDF proposta/relatório |
| `calendario` | Calendário | View mensal de campanhas e atividades |
| `financeiro-modulo` | Financeiro | Lançamentos, cartão, custos fixos, DRE, fluxo de caixa, contas bancárias |
| `comercial` | Comercial | Pipeline de prospects (Kanban + lista), comissões, histórico de fechamentos |
| `comissoes` | Comissões | Registro de comissões por representante (pendente/aprovado/reprovado/pago) |
| `parceiros` | Buscar Parceiros | Mapa Google Maps com busca e cadastro de novos parceiros |
| `base` | Base | Lista de parceiros cadastrados, ficha completa, Street View, dados demográficos |
| `planejamento-midia` | Planejamento de Mídia | Wizard 3 etapas: escolher parceiros → mapa cobertura → calculadora (custo, impactos, margem) |
| `relatorios` | Relatórios | 30+ blocos de relatório filtráveis, exportação PDF/Excel |
| `cadastros` | Cadastros | Tabs: Campanhas (tipos), Parceiros (tipos), Fornecedores (gráficas/logística com custos), Segmentos |
| `whatsapp` | WhatsApp IA | Conversas Maya/Victoria, simulador de atendimento, pipeline de leads WhatsApp |
| `usuarios` | Usuários | CRUD de usuários, roles, regiões (representante), comissão % |

---

## 6. ROLES E ACESSOS

| Role | Cor | Acesso |
|------|-----|--------|
| `admin` | `T.accent` (verde) | Tudo |
| `comercial` | `T.info` (azul) | Dashboard, Fila, Campanhas, Calendário, Comercial, Planejamento, Relatórios, Cadastros, WhatsApp |
| `operacional` | `T.purple` | Dashboard, Fila, Campanhas, Calendário, Relatórios, Cadastros |
| `marketing` | `T.pink` | Dashboard, Fila, Campanhas, Calendário, Relatórios |
| `financeiro` | `T.warn` (amarelo) | Dashboard, Fila, Campanhas, Calendário, Financeiro, Comercial, Relatórios, Cadastros |
| `base` | `T.green` | Dashboard, Fila, Campanhas, Comissões, Buscar Parceiros, Base, Relatórios, WhatsApp |
| `representante` | `#F59E0B` (âmbar) | Dashboard (custom), Campanhas, Comercial (só próprios prospects), Planejamento, Comissões |

**Campos exclusivos do representante** (na tabela `usuarios`):
- `regiao`: array de estados BR (multi-select)
- `comissao_pct`: percentual de comissão (%)
- `meta`: meta mensal em R$

**Auto-comissão:** quando representante move prospect para "fechado", gera automaticamente registro em `closings` com `value = prospect.value × comissao_pct / 100`.

---

## 7. AGENTE MAYA (WhatsApp)

**Papel:** qualificação automática de novos parceiros via WhatsApp

**Fluxo:**
1. Lead entra pelo WhatsApp → Maya recebe via webhook Evolution API
2. Maya faz perguntas de qualificação: pedidos/dia, Instagram, nome, cidade, plataforma
3. **≥ 250 pedidos/dia** → `{"acao":"qualificado"}` → salva em `prospects` stage "qualificado" + pipeline WhatsApp
4. **< 250 pedidos/dia** → `{"acao":"lista_espera"}` → salva como lista de espera
5. Ao qualificar → mensagem "vou passar para a Victoria" e muda status no sistema

**Victoria** (`/api/whatsapp/chat.js`):
- Atendimento humano assistido por IA
- Modos: `prospecto` (primeira abordagem), `parceiro` (parceiro ativo), `cobranca` (cobrança de postagem)
- Regra de ouro: NUNCA sugere modelo de embalagem — apresenta os 2 e deixa o parceiro escolher

---

## 8. DECISÕES TÉCNICAS IMPORTANTES

### Estrutura de arquivos
- `App.jsx` fica na **raiz do projeto**, não em `/src`
- É um único arquivo de ~10.000 linhas com todas as telas — essa é a arquitetura intencional, não refatorar sem instrução explícita
- Componentes são definidos como funções inline dentro de IIFEs no JSX: `{tab==="x"&&(()=>{...})()}`

### Supabase / dados
- Parceiros e fornecedores salvam tudo no campo `data jsonb` — ao ler, usar `r.data || r` para compatibilidade retroativa
- Fornecedores: inserir com `{id, name, type, data: objetoCompleto}` — atualizar com `.update({name, type, data})`
- `lancamentos` tem `fornecedorId bigint` para vincular a fornecedor gráfica

### Autenticação
- Login atual é hardcoded contra tabela `usuarios` no Supabase (sem Supabase Auth)
- Senhas com hash SHA-256 via Web Crypto API nativa: `crypto.subtle.digest("SHA-256", ...)`
- Migração automática de senhas em texto plano para SHA-256 no primeiro login

### Uploads
- `sanitizeFileName(name)` remove acentos e caracteres especiais antes de qualquer upload para o Storage — obrigatório para evitar "Invalid key" no Supabase
- Bucket principal: `ecodely-files`

### Tema / cores
- `T` é o objeto de tema (cores). `ROLE_COLOR` referencia `T.*` — as cores são recalculadas a cada render via `const T = calcTheme(config)`
- Após `calcTheme()`, atualizar manualmente: `ROLE_COLOR.admin = T.accent; ROLE_COLOR.comercial = T.info; ...`

### Google Maps
- Chave via `import.meta.env.VITE_GOOGLE_MAPS_KEY` — NUNCA colocar hardcoded no código
- Street View: salvar POV via listener `position_changed` / `pov_changed` em tempo real, não ao clicar salvar (evita null)
- Círculo 5km: coordenadas do parceiro estão em `p.endereco.lat` / `p.endereco.lng` (não em `p.lat` / `p.lng`)

### Padrão de notificações
```js
pushNotif("Título", "Mensagem", T.accent); // cor é opcional
```

---

## 9. PENDÊNCIAS / DÍVIDAS TÉCNICAS

| Item | Status | Detalhes |
|------|--------|----------|
| Street View ângulo | Em aberto | Ângulo salvo às vezes não corresponde à fachada correta |
| Google Places enriquecer parceiros | Em aberto | Usar Places API para preencher telefone, site, horários automaticamente ao cadastrar parceiro |
| Supabase Auth | Em aberto | Substituir login hardcoded por Supabase Auth nativo + RLS |
| RLS Supabase | Em aberto | 19 tabelas com RLS desabilitado — habilitar com políticas adequadas antes de expor publicamente |
| Domínio `sistema.ecodely.com.br` | Em aberto | Apontar para Vercel |
| Automação prospecção em escala | Em aberto | Maya ainda é ativada manualmente por conversa |
| Modelo Claude nas API routes | Atenção | Atualizar `claude-sonnet-4-20250514` para versão mais recente quando necessário |

---

## 10. COMO TRABALHAR NESTE PROJETO

### Antes de editar
```bash
git pull origin main          # sempre sincronizar antes de editar
```

### Fluxo de trabalho padrão
1. Editar `App.jsx` (ou arquivos em `/api`)
2. Verificar se o build passa: `npm run build` (opcional mas recomendado para mudanças grandes)
3. `git add App.jsx` (ou arquivo específico)
4. `git commit -m "tipo: descrição breve"`
5. `git push origin main` → deploy automático no Vercel

### Deploy manual (se necessário)
- O push para `main` dispara deploy automático no Vercel
- Verificar status: Vercel MCP `list_deployments` projeto `ecodely-sistema` team `team_Z70Kq0N5p6HKuEGv7JtR3QRa`

### Migrações Supabase
- Usar Supabase MCP `apply_migration` para alterações de schema
- Projeto Supabase: verificar com `list_projects` no MCP

### Padrão de commit
```
feat: nova funcionalidade
fix: correção de bug
refactor: refatoração sem mudança de comportamento
style: ajustes visuais
chore: configs, deps
```

### Nunca fazer
- Hardcodar chaves de API no código — sempre `import.meta.env.VITE_*`
- Recriar o mapa Leaflet em um mesmo useEffect que depende de parceiros (causa bug do `_leaflet_id`)
- Usar `gap:6"` (aspa sobrando) — sempre `gap:6` sem aspas nos valores numéricos do style inline
- Chamar `Date.now()` ou `Math.random()` dentro de scripts de workflow Claude
