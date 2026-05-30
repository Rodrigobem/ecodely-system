# CLAUDE_CONTEXT.md — Projeto Ecodely
> Atualizado em: 29/05/2026
> ⚠️ Versão pública — credenciais omitidas por segurança
> Para versão completa com credenciais, peça ao Rodrigo

---

## EMPRESA
**Ecodely Mídia** — empresa de Mídia In-Home (embalagens publicitárias para delivery)
- Produtos: sacolas kraft, caixas e embalagens com publicidade de marcas para restaurantes delivery
- Modelo: conecta marcas (anunciantes) com restaurantes (parceiros da base)

---

## SISTEMA DE GESTÃO
- **URL produção:** https://ecodely-sistema.vercel.app
- **GitHub:** https://github.com/Rodrigobem/ecodely-system (branch: main)
- **Stack:** React 18 + Vite 5 + Recharts + Supabase JS v2 + Vercel
- **Arquivo principal:** App.jsx (raiz do repositório, ~8500 linhas)
- **Entry point:** main.jsx importa `./App.jsx` (da raiz, não do /src!)

---

## INFRAESTRUTURA

| Serviço | Detalhes |
|---|---|
| Vercel | Deploy automático via GitHub push |
| Supabase | Banco de dados + Storage |
| VPS Hostinger | IP: 2.24.111.162 — Evolution API |
| Evolution API | v2.3.7 — instância "victoria" — chip Claro |
| Anthropic | Claude Haiku — agente Maya no WhatsApp |
| Google Cloud | Street View Static API ativada |
| Resend | Email @ecodely.com.br — DNS configurado |

---

## USUÁRIOS DO SISTEMA

| ID | Nome | Email | Role |
|---|---|---|---|
| 1 | Rodrigo Bem | rodrigobem@ecodely.com.br | admin |
| 1779900001 | Pedro Camaor | pedro.camaor@ecodely.com.br | admin |
| 1779900002 | Priscila | opec@ecodely.com.br | base |
| 1779900003 | Larissa | financeiro@ecodely.com.br | financeiro |
| 1779900004 | Victoria | victoria@ecodely.com.br | base |
| 1779900005 | Pedro Henrique | marketing@ecodely.com.br | marketing |

---

## BANCO DE DADOS SUPABASE

### Tabelas:
- **lancamentos** — fluxo de caixa financeiro
  - Colunas: id, data (DD/MM/YYYY), descricao, entrada, saida, tipo, categoria, centrosCusto, forma, projeto, contaBancoId, cartaoId, confirmado, obs
  - Saldo seed: R$6,08 (Dez/2024)

- **parceiros** — base de parceiros (formato jsonb)
  - Colunas: id (bigint), data (jsonb), updated_at
  - Total: **430 parceiros** importados da planilha real
  - Campos jsonb: name, handle, city, state, category, deliveries, status, mesesNaBase, campanhas, engajamento, score, endereco{rua,bairro,numero,cep,lat,lng}, responsavel, telefone, cnpj, email, contrato{status,enviadoEm,assinadoEm,expiraEm}, fotos[], obs

- **storage bucket "parceiros"** — fotos dos parceiros
  - Limite: 5MB, tipos: jpeg/jpg/png/webp, acesso público

---

## TELAS DO SISTEMA

1. **Dashboard** — visão por role (admin/comercial/marketing/financeiro/base)
2. **Minha Fila** — tarefas pendentes do usuário logado
3. **Campanhas** — kanban drag & drop com 5 etapas
4. **Calendário** — calendário de campanhas
5. **Financeiro** — visão geral, fluxo de caixa (Supabase), cartões, DAS/Simples, distribuição sócios, configurações
6. **Comercial** — pipeline kanban, faturamento, clientes
7. **Comissões** — por role=base com botão Remover
8. **Parceiros** — prospecção/base CSV
9. **Base** — 430 parceiros reais com filtros (estado/cidade/segmento/score/contrato/status)
10. **Cadastros** — clientes e fornecedores
11. **Usuários** — gestão de usuários (só admin)
12. **Planejamento de Mídia** — IA integrada
13. **Relatórios** — templates prontos

---

## AGENTE MAYA (WhatsApp IA)
- Nome: Maya (antes era Victoria)
- Arquivo: api/whatsapp/webhook.js no Vercel
- Modelo: claude-haiku-4-5-20251001
- Funções: responder leads, filtrar histórico corrompido, retry automático

---

## CONTEXTO DE NEGÓCIO

### Fluxo de campanha:
1. Cliente fecha com Ecodely
2. Campanha criada no sistema: Fechamento → Gráfica → Logística → Checking → Finalizada
3. Parceiros da base recebem as embalagens
4. **Checking**: parceiro manda foto pelo WhatsApp confirmando recebimento
5. **Impactos**: stories dos parceiros, influenciadores, campanha impulsionada
6. **Relatório** gerado em tempo real para o cliente

### Fotos no sistema:
1. **Checking** — aba Impactos das campanhas ✅
2. **Stories/influenciadores** — aba Impactos ✅
3. **Métricas de postagens** — prints de métricas ⏳
4. **Foto de fachada** — Street View API + override manual ⏳

### Base de parceiros (430):
- Maioria em SP (234), RJ (40), MG (30), BA (24)
- Segmentos: Hamburgueria (313), Lanches (75), Açaí (9)
- 37 com contrato assinado, 393 sem contrato

---

## HISTÓRICO DE MUDANÇAS

### 29/05/2026
- ✅ Comissões dinâmicas por role=base
- ✅ Responsável no pipeline dinâmico por role=comercial|admin
- ✅ Dados demo removidos do sistema
- ✅ Campo Cartão no Fluxo de Caixa (aparece quando forma=Cartão)
- ✅ Aba Cartões integrada ao fluxo de caixa
- ✅ 430 parceiros importados no Supabase com dados reais
- ✅ Filtros na Base: estado, cidade, segmento, score, contrato, status
- ✅ Colunas: Estabelecimento / Segmento / Cidade / Score / Contrato / Responsável / Telefone
- ✅ Modal do parceiro: responsavel, telefone, email, cnpj editáveis
- ✅ Bucket Supabase Storage "parceiros" criado
- ⏳ Upload de fotos dos parceiros (build com erro JSX)
- ⏳ Foto de fachada Street View (aguardando API Key)
- ⏳ CLAUDE_CONTEXT.md criado e mantido atualizado

---

## PENDÊNCIAS

### Alta prioridade:
- [ ] Corrigir build fotos dos parceiros (erro JSX no Vercel)
- [ ] API Key Google Maps → Street View na fachada do parceiro
- [ ] Emails boas-vindas para equipe (Resend configurado)

### Média prioridade:
- [ ] Segurança: trocar login hardcoded por Supabase Auth
- [ ] Domínio sistema.ecodely.com.br
- [ ] Métricas visuais das postagens (print dos stories)

### Baixa prioridade:
- [ ] Treinamento Maya com conversas reais
- [ ] Webhook ManyChat → backend
- [ ] Testar ciclo completo Maya → Pipeline

---

## COMO INICIAR NOVA CONVERSA
1. Compartilhe este arquivo (ou o CLAUDE_CONTEXT.md completo)
2. Diga: **"Continuar desenvolvimento Ecodely — leia o CLAUDE_CONTEXT.md"**
3. O Claude pedirá as credenciais necessárias conforme precisar
