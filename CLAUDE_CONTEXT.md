# CLAUDE_CONTEXT.md — Projeto Ecodely
> Atualizado em: 30/05/2026
> Versao publica — credenciais omitidas por segurança

---

## EMPRESA
**Ecodely Midia** — empresa de Midia In-Home (embalagens publicitarias para delivery)
- Produtos: sacolas kraft, caixas e embalagens com publicidade de marcas para restaurantes delivery
- Modelo: conecta marcas (anunciantes) com restaurantes (parceiros da base)

---

## SISTEMA DE GESTÃO
- **URL producao:** https://ecodely-sistema.vercel.app
- **GitHub:** https://github.com/Rodrigobem/ecodely-system (branch: main)
- **Stack:** React 18 + Vite 5 + Recharts + Supabase JS v2 + Vercel
- **Arquivo principal:** App.jsx (raiz do repositorio, ~8600 linhas)
- **Entry point:** main.jsx importa ./App.jsx (da raiz, nao do /src!)

---

## INFRAESTRUTURA

| Servico | Detalhes |
|---|---|
| Vercel | Deploy automatico via GitHub push |
| Supabase | Banco de dados + Storage |
| VPS Hostinger | IP: 2.24.111.162 — Evolution API |
| Evolution API | v2.3.7 — instancia "victoria" — chip Claro |
| Anthropic | Claude Haiku — agente Maya no WhatsApp |
| Google Cloud | Street View Static API + Maps JavaScript API + Maps Embed API ativadas |
| Resend | Email @ecodely.com.br — DNS configurado |

---

## USUARIOS DO SISTEMA

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

- **parceiros** — base de parceiros (formato jsonb)
  - Colunas: id (bigint), data (jsonb), updated_at
  - Total: 430 parceiros importados da planilha real
  - Campos jsonb: name, handle, city, state, category, deliveries, status, mesesNaBase, campanhas, engajamento, score, endereco{rua,bairro,numero,cep,lat,lng}, responsavel, telefone, cnpj, email, contrato{status,enviadoEm,assinadoEm,expiraEm}, fotos[], foto_fachada, whatsapp, instagram_seguidores, sv_heading, sv_pitch, obs

- **storage bucket "parceiros"** — fotos dos parceiros
  - Limite: 5MB, tipos: jpeg/jpg/png/webp, acesso publico

---

## TELAS DO SISTEMA

1. **Dashboard** — visao por role (admin/comercial/marketing/financeiro/base)
2. **Minha Fila** — tarefas pendentes do usuario logado
3. **Campanhas** — kanban drag & drop com 5 etapas
4. **Calendario** — calendario de campanhas
5. **Financeiro** — visao geral, fluxo de caixa (Supabase), cartoes, DAS/Simples, distribuicao socios, configuracoes
6. **Comercial** — pipeline kanban, faturamento, clientes
7. **Comissoes** — por role=base com botao Remover
8. **Parceiros** — prospeccao/base CSV
9. **Base** — 430 parceiros reais com filtros (estado/cidade/segmento/score/contrato/status)
10. **Cadastros** — clientes e fornecedores
11. **Usuarios** — gestao de usuarios (so admin)
12. **Planejamento de Midia** — IA integrada
13. **Relatorios** — templates prontos

---

## AGENTE MAYA (WhatsApp IA)
- Nome: Maya (antes era Victoria)
- Arquivo: api/whatsapp/webhook.js no Vercel
- Modelo: claude-haiku-4-5-20251001
- Funcoes: responder leads, filtrar historico corrompido, retry automatico

---

## GOOGLE MAPS API
- **Chave:** AIzaSyCQDy31u0Rm3iZuisHvdS9ZHpGOL0rc1l8
- **APIs ativadas:** Street View Static API, Maps JavaScript API, Maps Embed API
- **Uso no sistema:** foto de fachada automatica dos parceiros + Street View interativo

---

## BASE DE PARCEIROS (430)
- Maioria em SP (234), RJ (40), MG (30), BA (24)
- Segmentos: Hamburgueria (313), Lanches (75), Acai (9)
- 37 com contrato assinado, 393 sem contrato
- Fonte: planilha Base_google_v2 importada 29/05/2026

---

## FUNCIONALIDADES DA TELA BASE (PARCEIROS)

### Lista:
- Colunas: Estabelecimento / Segmento / Cidade / Score / Contrato / Responsavel / Telefone
- Filtros: Estado, Cidade (dinamica pelo estado), Segmento, Score minimo, Contrato, Status, Busca texto

### Modal do parceiro:
- Score detalhado com barras
- Campos editaveis: responsavel, telefone, email, cnpj, entregas/mes, meses na base, campanhas, engajamento
- Endereco com busca de coordenadas (Nominatim geocoding)
- Fotos do Parceiro:
  - WhatsApp e Seguidores Instagram
  - Foto de fachada automatica via Street View Static API pelo endereco
  - Botao "Reposicionar" — abre Street View interativo (Maps Embed API) para navegar e salvar angulo
  - Override manual — colar qualquer link (Google Maps, Instagram, Drive)
  - Upload de fotos adicionais para Supabase Storage bucket "parceiros"
- Contrato com acoes (enviar, assinar, renovar)

### Fluxo para usar Street View interativo:
1. Abrir parceiro
2. Endereco -> preencher -> clicar "Buscar coordenadas"
3. Salvar endereco
4. Fotos -> clicar "Reposicionar" -> navegar no Street View
5. Clicar "Salvar angulo"

---

## HISTORICO DE MUDANCAS

### 30/05/2026
- Foto de fachada automatica via Street View Static API
- Street View interativo com botao Reposicionar (Maps Embed API)
- Fallback quando sem coordenadas: mensagem orientando o usuario
- Upload de fotos para Supabase Storage (bucket "parceiros")
- Campos WhatsApp e Seguidores Instagram no modal
- CLAUDE_CONTEXT.md criado e mantido atualizado automaticamente

### 29/05/2026
- Comissoes dinamicas por role=base
- Responsavel no pipeline dinamico por role=comercial|admin
- Dados demo removidos do sistema
- Campo Cartao no Fluxo de Caixa (aparece quando forma=Cartao)
- Aba Cartoes integrada ao fluxo de caixa
- 430 parceiros importados no Supabase com dados reais
- Filtros na Base: estado, cidade, segmento, score, contrato, status
- Colunas lista: Estabelecimento / Segmento / Cidade / Score / Contrato / Responsavel / Telefone
- Modal: responsavel, telefone, email, cnpj editaveis
- Bucket Supabase Storage "parceiros" criado

---

## PENDENCIAS

### Alta prioridade:
- [ ] Emails boas-vindas para equipe (Resend configurado, DNS ok)
- [ ] Seguranca: trocar login hardcoded por Supabase Auth

### Media prioridade:
- [ ] Dominio sistema.ecodely.com.br
- [ ] Metricas visuais das postagens (print dos stories)
- [ ] Pente fino nas outras telas do sistema

### Baixa prioridade:
- [ ] Treinamento Maya com conversas reais
- [ ] Testar ciclo completo Maya -> Pipeline

---

## COMO INICIAR NOVA CONVERSA
1. Compartilhe este arquivo
2. Diga: **"Continuar desenvolvimento Ecodely — leia o CLAUDE_CONTEXT.md"**
3. O Claude pedira as credenciais necessarias conforme precisar
