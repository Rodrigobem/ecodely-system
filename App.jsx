import { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xklvqcxhtariqqhvnseh.supabase.co";
const SUPABASE_KEY = "sb_publishable_0Y8LZnFlLIrVrQ-EdsjTQQ_1w0MwYQ2";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const THEMES={
  escuro:{name:"Escuro",bg:"#06070D",surface:"#0C0E18",card:"#10121E",border:"#1A1E30",accent:"#00E5A0",accentDim:"#00E5A012",accentBorder:"#00E5A038",text:"#E6E8F0",muted:"#4A5070",soft:"#8A90A8",warn:"#F5A623",warnDim:"#F5A62315",danger:"#FF4D6A",dangerDim:"#FF4D6A12",info:"#3D9EFF",infoDim:"#3D9EFF12",purple:"#9B7FFF",purpleDim:"#9B7FFF12",pink:"#F472B6",green:"#25D366",greenDim:"#25D36612"},
  claro:{name:"Claro",bg:"#f5f7fa",surface:"#ffffff",card:"#ffffff",border:"#e2e8f0",accent:"#059669",accentDim:"#05966912",accentBorder:"#05966938",text:"#1a202c",muted:"#718096",soft:"#a0aec0",warn:"#d97706",warnDim:"#d9770615",danger:"#dc2626",dangerDim:"#dc262612",info:"#2563eb",infoDim:"#2563eb12",purple:"#7c3aed",purpleDim:"#7c3aed12",pink:"#db2777",green:"#059669",greenDim:"#05966912"},
  azul:{name:"Azul",bg:"#0f172a",surface:"#1e293b",card:"#1e293b",border:"#334155",accent:"#00E5A0",accentDim:"#00E5A012",accentBorder:"#00E5A038",text:"#e2e8f0",muted:"#64748b",soft:"#94a3b8",warn:"#fbbf24",warnDim:"#fbbf2415",danger:"#f87171",dangerDim:"#f8717112",info:"#60a5fa",infoDim:"#60a5fa12",purple:"#a78bfa",purpleDim:"#a78bfa12",pink:"#f472b6",green:"#00E5A0",greenDim:"#00E5A012"},
  naval:{name:"Naval",bg:"#0f172a",surface:"#1e293b",card:"#1e293b",border:"#334155",accent:"#38bdf8",accentDim:"#38bdf812",accentBorder:"#38bdf838",text:"#e2e8f0",muted:"#64748b",soft:"#94a3b8",warn:"#fbbf24",warnDim:"#fbbf2415",danger:"#f87171",dangerDim:"#f8717112",info:"#60a5fa",infoDim:"#60a5fa12",purple:"#a78bfa",purpleDim:"#a78bfa12",pink:"#f472b6",green:"#34d399",greenDim:"#34d39912"},
};
let T=THEMES.escuro;

// --- FINANCIAL MODULE DATA ----------------------------------------------------
const SIMPLES_ANEXO_III=[
  {faixa:1,min:0,max:180000,aliquota:0.06,deducao:0,label:"Faixa 1"},
  {faixa:2,min:180000,max:360000,aliquota:0.112,deducao:9360,label:"Faixa 2"},
  {faixa:3,min:360000,max:720000,aliquota:0.135,deducao:17640,label:"Faixa 3"},
  {faixa:4,min:720000,max:1800000,aliquota:0.16,deducao:35640,label:"Faixa 4"},
  {faixa:5,min:1800000,max:3600000,aliquota:0.21,deducao:125640,label:"Faixa 5"},
];
const calcAliquotaEfetiva=(rbt12)=>{
  const faixa=SIMPLES_ANEXO_III.find(f=>rbt12>=f.min&&rbt12<f.max)||SIMPLES_ANEXO_III[0];
  if(rbt12===0)return{faixa,aliquotaEfetiva:0};
  const aliquotaEfetiva=((rbt12*faixa.aliquota)-faixa.deducao)/rbt12;
  return{faixa,aliquotaEfetiva:Math.max(0,aliquotaEfetiva)};
};
const CONTAS_INIT=[
  {id:1,banco:"Bradesco",tipo:"Conta Corrente",agencia:"1234-5",conta:"98765-4",saldo:14915.62,cor:"#CC0000"},
  {id:2,banco:"Nubank",tipo:"Conta Corrente",agencia:"",conta:"",saldo:5000,cor:"#820AD1"},
  {id:3,banco:"C6 Bank",tipo:"Conta Corrente",agencia:"",conta:"",saldo:2000,cor:"#F5C518"},
];
const CARTOES_INIT=[
  {id:1,nome:"C6 Azul Dani",titular:"Daniela Gmeiner",vencimento:15,limite:30000,banco:"C6 Bank",cor:"#3D9EFF"},
  {id:2,nome:"Latam Dani",titular:"Daniela Gmeiner",vencimento:20,limite:20000,banco:"Itaú",cor:"#F5A623"},
  {id:3,nome:"Mastercard Daniela",titular:"Daniela Gmeiner",vencimento:10,limite:25000,banco:"Santander",cor:"#FF4D6A"},
  {id:4,nome:"Master Santander Rodrigo",titular:"Rodrigo Bem",vencimento:15,limite:30000,banco:"Santander",cor:"#9B7FFF"},
];
const COMPRAS_CARTAO_INIT=[
  {id:1,cartaoId:1,projeto:"PP 131 - Gráfica EVO - Sensia",valorTotal:4490,parcelas:2,parcelaAtual:2,valorParcela:2245,mesInicio:"04/2026",descricao:"GRAFICA EVO SENSIA 2.000 MEGABOX"},
  {id:2,cartaoId:1,projeto:"PP 130 - Gráfica EVO - UNEX",valorTotal:7860,parcelas:2,parcelaAtual:2,valorParcela:3930,mesInicio:"04/2026",descricao:"GRAFICA EVO UNEX 3.000 MEGABOX BAHIA"},
  {id:3,cartaoId:4,projeto:"Fluxo Ecodely Midia",valorTotal:5000,parcelas:12,parcelaAtual:10,valorParcela:416.74,mesInicio:"07/2025",descricao:"FLUXO PAGAMENTOS ECODELY MIDIA"},
  {id:4,cartaoId:2,projeto:"Fluxo Ecodely Midia",valorTotal:5000,parcelas:12,parcelaAtual:10,valorParcela:416.74,mesInicio:"07/2025",descricao:"FLUXO PAGAMENTOS ECODELY MIDIA LATAM"},
];
const CUSTOS_FIXOS_INIT=[
  {id:1,descricao:"PRONAMP - Bradesco (Capital de Giro)",valor:2494.85,dia:2,categoria:"Financiamento",centrosCusto:"Financeiro",ativo:true},
  {id:2,descricao:"Advogado - Masserotto",valor:1860,dia:5,categoria:"Juridico",centrosCusto:"Administrativo",ativo:true},
  {id:3,descricao:"Salario Priscila",valor:1000,dia:5,categoria:"Salario",centrosCusto:"Comercial",ativo:true},
  {id:4,descricao:"Salario Larissa",valor:1343.75,dia:5,categoria:"Salario",centrosCusto:"Marketing",ativo:true},
  {id:5,descricao:"Salario Victoria (base)",valor:1000,dia:5,categoria:"Salario",centrosCusto:"Base",ativo:true},
  {id:6,descricao:"Salario Pedro Designer",valor:2500,dia:5,categoria:"Salario",centrosCusto:"Operacional",ativo:true},
  {id:7,descricao:"Coworking Delta",valor:212,dia:10,categoria:"Infraestrutura",centrosCusto:"Administrativo",ativo:true},
  {id:8,descricao:"Sistema Operand",valor:240,dia:15,categoria:"SaaS",centrosCusto:"Operacional",ativo:true},
  {id:9,descricao:"Google GSuite",valor:441,dia:15,categoria:"SaaS",centrosCusto:"Administrativo",ativo:true},
  {id:10,descricao:"Hostgator (Site Lock)",valor:38.99,dia:15,categoria:"SaaS",centrosCusto:"Marketing",ativo:true},
  {id:11,descricao:"Hostgator (Mensal)",valor:16.79,dia:15,categoria:"SaaS",centrosCusto:"Marketing",ativo:true},
  {id:12,descricao:"Contador (+ 13o proporcional)",valor:568.62,dia:15,categoria:"Contador",centrosCusto:"Financeiro",ativo:true},
  {id:13,descricao:"Salario Pedro (socio)",valor:12500,dia:15,categoria:"Pro-Labore",centrosCusto:"Administrativo",ativo:true},
  {id:14,descricao:"Salario Rodrigo (socio)",valor:12500,dia:15,categoria:"Pro-Labore",centrosCusto:"Administrativo",ativo:true},
  {id:15,descricao:"DARF",valor:178.31,dia:20,categoria:"Imposto",centrosCusto:"Financeiro",ativo:true},
  {id:16,descricao:"Acao Ambiental - Selo EPN",valor:226,dia:30,categoria:"Ambiental",centrosCusto:"Operacional",ativo:true},
];


const CAT_RECEITA=["Projeto","Acao Delivery","Consultoria","Patrocinio","Transferencia","Outros"];
const CAT_DESPESA=["Salario","Pro-Labore","Grafica","Frete","Imposto","Contador","Financiamento","SaaS","Infraestrutura","Marketing","Viagem","Juridico","Ambiental","Reembolso","Outros"];
const CENTROS_CUSTO_INIT=["Comercial","Operacional","Marketing","Financeiro","Base","Administrativo","RH"];
const FORMAS_PAG=["PIX","Cartao","Boleto","Debito","DARF","Cheque","Dinheiro"];
// --- END FINANCIAL DATA ------------------------------------------------------
const fmt=(v)=>"R$\u00A0"+Number(v).toLocaleString("pt-BR",{minimumFractionDigits:0});
const fmtK=(v)=>v>=1000?`R$ ${(v/1000).toFixed(0)}k`:fmt(v);
const now=()=>new Date().toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"});

// --- AUTH --------------------------------------------------------------------
const USERS_DB=[
  {id:0,name:"Admin Teste",email:"a",pass:"1",role:"admin",avatar:"AT",active:true},
  {id:1,name:"Rodrigo Bem",email:"rodrigo@ecodely.com.br",pass:"admin123",role:"admin",avatar:"RB",active:true},
  {id:2,name:"Ana Lima",email:"ana@ecodely.com.br",pass:"user123",role:"comercial",avatar:"AL",active:true},
  {id:3,name:"Carlos Mendes",email:"carlos@ecodely.com.br",pass:"user123",role:"operacional",avatar:"CM",active:true},
  {id:4,name:"Juliana Faria",email:"juliana@ecodely.com.br",pass:"user123",role:"marketing",avatar:"JF",active:true},
  {id:5,name:"Paulo Neto",email:"paulo@ecodely.com.br",pass:"user123",role:"financeiro",avatar:"PN",active:true},
  {id:6,name:"Mariana Costa",email:"mariana@ecodely.com.br",pass:"user123",role:"base",avatar:"MC",active:true},
];
const ROLE_LABELS={admin:"Administrador",comercial:"Comercial",operacional:"Operacional",marketing:"Marketing",financeiro:"Financeiro",base:"Base"};
const ROLE_COLOR={admin:T.accent,comercial:T.info,operacional:T.purple,marketing:T.pink,financeiro:T.warn,base:T.green};
const SEC_COLOR={comercial:T.info,financeiro:T.warn,marketing:T.pink,base:T.accent,operacional:T.purple,grafica:T.purple,logistica:T.info};
const SEC_LABEL={comercial:"Comercial",financeiro:"Financeiro",marketing:"Marketing",base:"Base",operacional:"Operacional",grafica:"Gráfica",logistica:"Logística"};

// Role - sector mapping
const ROLE_TO_SEC={comercial:"comercial",financeiro:"financeiro",marketing:"marketing",base:"base",operacional:"operacional",admin:null};

// --- CAMPAIGNS ---------------------------------------------------------------
const STAGES_CAMP=[
  {id:1,label:"Fechamento",color:T.info},
  {id:2,label:"Gráfica",color:T.purple},
  {id:3,label:"Logística",color:T.warn},
  {id:4,label:"Checking",color:T.pink},
  {id:5,label:"Finalizada",color:T.accent},
];

const mkTimeline=(entries)=>entries;
const mkFiles=(files)=>files;
const mkImpactos=()=>({stories:[],influencer:[],impulsionado:[],galeria:[],evidencias:{},influencerMetricas:{visualizacoes:0,alcance:0,comentarios:0}});



// --- COMMERCIAL ---------------------------------------------------------------
const PIPE_STAGES=[{id:"lead",label:"Lead",color:T.muted,prob:10},{id:"qualificado",label:"Qualificado",color:T.info,prob:30},{id:"proposta",label:"Proposta",color:T.purple,prob:60},{id:"negociacao",label:"Negociação",color:T.warn,prob:80},{id:"fechado",label:"Fechado",color:T.accent,prob:100}];
const PROSPECTS_INIT=[
  {id:1,name:"Natura",contact:"Paula Mendes",email:"paula@natura.com.br",segment:"Beleza",value:42000,stage:"lead",owner:"Ana Lima",notes:"Indicação O Boticário"},
  {id:2,name:"Ambev",contact:"Ricardo Torres",email:"ricardo@ambev.com.br",segment:"Alimentação",value:85000,stage:"qualificado",owner:"Ana Lima",notes:"Interesse em 3 capitais"},
  {id:3,name:"Magazine Luiza",contact:"Fernanda Luz",email:"fernanda@magalu.com.br",segment:"Tecnologia",value:120000,stage:"proposta",owner:"Rodrigo Bem",notes:"Proposta enviada 05/04"},
  {id:4,name:"iFood",contact:"Bruno Sá",email:"bruno@ifood.com.br",segment:"Tecnologia",value:200000,stage:"negociacao",owner:"Rodrigo Bem",notes:"Reunião marcada 20/04"},
  {id:5,name:"Riachuelo",contact:"Carla Vaz",email:"carla@riachuelo.com.br",segment:"Moda",value:55000,stage:"proposta",owner:"Ana Lima",notes:"Aguardando aprovação interna"},
];
const CLIENTS_LIST=[];
const CLIENT_BILLING=[];
const LANCAMENTOS_INIT=[];
const FAT_MENSAIS_INIT=[];
const CAMPS_INIT=[];
const SUPPLIERS=[];
const MONTHLY_DATA=[{month:"Nov/24",receita:28400,previsao:30000},{month:"Dez/24",receita:31200,previsao:32000},{month:"Jan/25",receita:19800,previsao:22000},{month:"Fev/25",receita:35600,previsao:34000},{month:"Mar/25",receita:42100,previsao:40000},{month:"Abr/25",receita:38700,previsao:41000},{month:"Mai/25",receita:0,previsao:52000},{month:"Jun/25",receita:0,previsao:58000}];
const USER_BILLING=[];

// --- COMMISSIONS -------------------------------------------------------------
const PROJECTS_INIT=[{id:1,name:"Copa 2025",active:true},{id:2,name:"Verão 2025",active:true},{id:3,name:"Dia das Mães 2025",active:true}];
const PTYPES_INIT=[{id:1,name:"Restaurante"},{id:2,name:"Bar"},{id:3,name:"Padaria"},{id:4,name:"Açaí"},{id:5,name:"Café"},{id:6,name:"Hamburgueria"}];
const COMM_TABLE_INIT=[{id:1,typeId:1,typeName:"Restaurante",projectId:1,projectName:"Copa 2025",value:80},{id:2,typeId:2,typeName:"Bar",projectId:1,projectName:"Copa 2025",value:120},{id:3,typeId:3,typeName:"Padaria",projectId:1,projectName:"Copa 2025",value:60},{id:4,typeId:1,typeName:"Restaurante",projectId:2,projectName:"Verão 2025",value:70},{id:5,typeId:4,typeName:"Açaí",projectId:2,projectName:"Verão 2025",value:90},{id:6,typeId:5,typeName:"Café",projectId:3,projectName:"Dia das Mães 2025",value:55}];
const CLOSINGS_INIT=[{id:1,user:"Mariana Costa",userId:6,partner:"Churrascaria do Zé",type:"Restaurante",typeId:1,project:"Copa 2025",projectId:1,value:80,date:"02/04",status:"aprovado",pago:true},{id:2,user:"Mariana Costa",userId:6,partner:"Bar do Alemão",type:"Bar",typeId:2,project:"Copa 2025",projectId:1,value:120,date:"05/04",status:"aprovado",pago:false},{id:3,user:"Mariana Costa",userId:6,partner:"Padaria Estrela",type:"Padaria",typeId:3,project:"Copa 2025",projectId:1,value:60,date:"08/04",status:"pendente",pago:false},{id:4,user:"Carlos Mendes",userId:3,partner:"Café Central",type:"Café",typeId:5,project:"Dia das Mães 2025",projectId:3,value:55,date:"20/04",status:"pendente",pago:false}];

// --- BASE PARTNERS ------------------------------------------------------------
const calcScore=(p)=>{
  const s1=Math.min(p.deliveries/500*30,30);
  const s2=p.campanhas*15;
  const s3=p.mesesNaBase*2;
  const s4=p.contrato.status==="assinado"?20:0;
  const s5=p.engajamento*5;
  return Math.min(Math.round(s1+s2+s3+s4+s5),100);
};
const BASE_PARTNERS_INIT=[];

// --- NAV ---------------------------------------------------------------------
const getNav=(role,queueCount,notifCount,extraRoles=[])=>[
  {id:"dashboard",label:"Dashboard",icon:"-",roles:["admin","comercial","operacional","marketing","financeiro","base"]},
  {id:"minha-fila",label:"Minha Fila",icon:"-",roles:["comercial","operacional","marketing","financeiro","base","admin"],badge:queueCount||null},
  {id:"campanhas",label:"Campanhas",icon:"-",roles:["admin","comercial","operacional","marketing","financeiro"]},
  {id:"calendario",label:"Calendário",icon:"-",roles:["admin","comercial","operacional","marketing","financeiro"]},
  {id:"financeiro-modulo",label:"Financeiro",icon:"-",roles:["admin","financeiro"]},
  {id:"comercial",label:"Comercial",icon:"-",roles:["admin","comercial","financeiro"]},
  {id:"comissoes",label:"Comissões",icon:"-",roles:["admin","base"]},
  {id:"parceiros",label:"Buscar Parceiros",icon:"-",roles:["admin","base"]},
  {id:"base",label:"Base",icon:"-",roles:["admin","base","comercial"]},
  {id:"planejamento-midia",label:"Planejamento de Mídia",icon:"-",roles:["admin","comercial"]},
  {id:"relatorios",label:"Relatórios",icon:"-",roles:["admin","comercial","operacional","marketing","financeiro","base"]},
  {id:"cadastros",label:"Cadastros",icon:"-",roles:["admin","comercial","operacional"]},
  {id:"usuarios",label:"Usuários",icon:"-",roles:["admin"]},
].filter(n=>n.roles.includes(role)||extraRoles.some(r=>n.roles.includes(r)));

// --- HELPERS -----------------------------------------------------------------
const Badge=({label,color})=>(<span style={{fontSize:9,padding:"2px 8px",borderRadius:4,background:color+"22",color,border:`1px solid ${color}33`,fontFamily:"Arial,sans-serif",whiteSpace:"nowrap"}}>{label}</span>);

// Helper: converte qualquer link externo para URL de embed
const toEmbedUrl=(url)=>{
  if(!url)return url;
  const driveId=url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/)?.[1];
  if(driveId)return{url:`https://drive.google.com/file/d/${driveId}/preview`,type:'drive',thumb:null};
  const ytId=url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1];
  if(ytId)return{url:`https://www.youtube.com/embed/${ytId}?autoplay=1`,type:'youtube',thumb:`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`};
  if(/\.(mp4|mov|webm)$/i.test(url))return{url,type:'video',thumb:null};
  return null; // imagem normal
};


// ── PLAN TAB COMPONENT ────────────────────────────────────────────────────
// ── WIZ STEP 1 ────────────────────────────────────────────────────────────
const WizStep1=({visible,planAtivo,setPlanAtivo,planGeoLoading,setPlanGeoLoading,geocodeEndereco,projects})=>{
  if(!visible)return null;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,color:T.accent,fontSize:12,marginBottom:4}}>Etapa 1 — Cliente e Objetivo</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {[["Nome do cliente","clienteNome"],["Segmento","clienteSegmento"],["Público-alvo","publicoAlvo"],["Faixa etária","faixaEtaria"],["Renda estimada","rendaEstimada"],["Prazo da campanha","prazo"]].map(([l,k])=>(
          <div key={k}>
            <div style={{fontSize:9,color:T.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>{l}</div>
            <input value={planAtivo[k]||""} onChange={e=>setPlanAtivo(p=>({...p,[k]:e.target.value}))} style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",fontSize:11,color:T.text,outline:"none"}}/>
          </div>
        ))}
      </div>
      <div>
        <div style={{fontSize:9,color:T.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Objetivo da campanha</div>
        <textarea value={planAtivo.objetivo||""} onChange={e=>setPlanAtivo(p=>({...p,objetivo:e.target.value}))} rows={2} style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",fontSize:11,color:T.text,outline:"none",resize:"vertical"}}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:8}}>
        <div>
          <div style={{fontSize:9,color:T.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Endereço / Região</div>
          <input value={planAtivo.regiao||""} onChange={e=>setPlanAtivo(p=>({...p,regiao:e.target.value,clienteEndereco:e.target.value}))} placeholder="Ex: Vila Madalena, São Paulo · SP" style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",fontSize:11,color:T.text,outline:"none"}}/>
        </div>
        <div style={{display:"flex",alignItems:"flex-end"}}>
          <button onClick={async()=>{setPlanGeoLoading(true);const geo=await geocodeEndereco(planAtivo.regiao||planAtivo.clienteEndereco);if(geo)setPlanAtivo(p=>({...p,clienteLat:geo.lat,clienteLng:geo.lng}));setPlanGeoLoading(false);}} style={{padding:"8px 14px",background:T.purpleDim,border:`1px solid ${T.purple}44`,color:T.purple,borderRadius:7,cursor:"pointer",fontSize:10,fontWeight:700,whiteSpace:"nowrap"}}>
            {planGeoLoading?"Buscando...":"📍 Geocodificar"}
          </button>
        </div>
      </div>
      {planAtivo.clienteLat&&<div style={{fontSize:9,color:T.accent,fontFamily:"Arial,sans-serif"}}>✓ {planAtivo.clienteLat.toFixed(4)}, {planAtivo.clienteLng.toFixed(4)}</div>}
      <div>
        <div style={{fontSize:9,color:T.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Preferência de segmento de parceiro <span style={{color:T.accent,fontWeight:700}}>(opcional)</span></div>
        <input value={planAtivo.preferenciaParceiro||""} onChange={e=>setPlanAtivo(p=>({...p,preferenciaParceiro:e.target.value}))} placeholder="Ex: restaurantes japoneses, hamburguerias artesanais · Deixe em branco para a IA identificar" style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",fontSize:11,color:T.text,outline:"none"}}/>
        <div style={{fontSize:8,color:T.muted,marginTop:3}}>💡 Se não preenchido, a IA vai identificar o perfil de parceiro ideal com base no briefing</div>
      </div>
      <div>
        <div style={{fontSize:9,color:T.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Verba disponível (R$)</div>
        <input type="number" value={planAtivo.verba||""} onChange={e=>setPlanAtivo(p=>({...p,verba:e.target.value}))} style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",fontSize:11,color:T.text,outline:"none"}}/>
      </div>
      <div>
        <div style={{fontSize:9,color:T.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Projeto vinculado</div>
        <select value={planAtivo.projectId||""} onChange={e=>setPlanAtivo(p=>({...p,projectId:e.target.value}))} style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",fontSize:11,color:T.text,outline:"none"}}>
          <option value="">Selecione...</option>
          {(projects||[]).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
    </div>
  );
};

// ── WIZ STEP 2 ────────────────────────────────────────────────────────────
const WizStep2=({visible,planAtivo,planAnalise,planLoading,gerarAnaliseIA})=>{
  if(!visible)return null;
  return(
    <div>
      <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,color:T.purple,fontSize:12,marginBottom:14}}>Etapa 2 — Análise da Região com IA</div>
      {!planAnalise&&!planLoading&&(
        <div style={{textAlign:"center",padding:"40px 20px",background:T.surface,borderRadius:12,marginBottom:16}}>
          <div style={{fontSize:32,marginBottom:12}}>🤖</div>
          <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:14,marginBottom:8}}>Análise demográfica por IA</div>
          <div style={{fontSize:11,color:T.muted,marginBottom:20}}>Com base na região e perfil do cliente, a IA gera dados demográficos, perfil de delivery e análise estratégica.</div>
          <button onClick={()=>gerarAnaliseIA(planAtivo)} style={{padding:"10px 24px",background:`linear-gradient(135deg,${T.purple},#7B5FE0)`,color:"#fff",borderRadius:9,cursor:"pointer",fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12,border:"none"}}>
            Analisar: {planAtivo.regiao||"(preencha a região)"}
          </button>
        </div>
      )}
      {planLoading&&<div style={{textAlign:"center",padding:"40px",background:T.surface,borderRadius:12}}><div style={{fontSize:24,marginBottom:10}}>⏳</div><div style={{fontSize:12,color:T.muted}}>Analisando com IA...</div></div>}
      {planAnalise&&!planLoading&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {[
              ["População",planAnalise.populacao,T.accent],
              ["Renda média",planAnalise.rendaMedia,T.info],
              ["Usuários delivery",planAnalise.usuariosDelivery,T.purple],
              ["Ticket médio",planAnalise.ticketMedioDelivery,T.warn],
              ["Pedidos/mês na região",planAnalise.pedidosMensais,T.pink],
            ].map(([l,v,c])=>(
              <div key={l} style={{background:T.surface,borderRadius:10,padding:"12px 14px",borderLeft:`3px solid ${c}`}}>
                <div style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>{l}</div>
                <div style={{fontSize:12,fontWeight:700,color:c}}>{v||"—"}</div>
              </div>
            ))}
            <div style={{background:T.surface,borderRadius:10,padding:"12px 14px",borderLeft:`3px solid ${T.soft}`}}>
              <div style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Apps líderes</div>
              {Array.isArray(planAnalise.appsLideres)&&planAnalise.appsLideres.length>0&&typeof planAnalise.appsLideres[0]==="object"?(
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  {planAnalise.appsLideres.slice(0,3).map((a,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:10,fontWeight:600,color:T.text}}>{a.nome}</span>
                      <span style={{fontSize:10,fontWeight:700,color:i===0?T.accent:i===1?T.info:T.muted}}>{a.share}</span>
                    </div>
                  ))}
                </div>
              ):(
                <div style={{fontSize:11,fontWeight:700,color:T.soft}}>{Array.isArray(planAnalise.appsLideres)?planAnalise.appsLideres.join(", "):planAnalise.appsLideres}</div>
              )}
            </div>
          </div>
          {/* Dados reais do IBGE */}
          {planAnalise.ibge&&(
            <div style={{background:T.surface,borderRadius:10,padding:16,border:`1px solid ${T.accent}44`}}>
              <div style={{fontSize:9,color:T.accent,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>
                📊 Dados oficiais — IBGE ({planAnalise.ibge.municipio}/{planAnalise.ibge.uf})
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:8}}>
                <div style={{background:T.card,borderRadius:8,padding:10,borderLeft:`3px solid ${T.accent}`}}>
                  <div style={{fontSize:7,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>População</div>
                  <div style={{fontSize:14,fontWeight:800,color:T.accent}}>{planAnalise.ibge.populacao||"—"}</div>
                </div>
                <div style={{background:T.card,borderRadius:8,padding:10,borderLeft:`3px solid ${T.info}`}}>
                  <div style={{fontSize:7,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>Renda per capita</div>
                  <div style={{fontSize:12,fontWeight:700,color:planAnalise.ibge.rendaMedia?T.info:T.warn}}>
                    {planAnalise.ibge.rendaMedia||"estimada pela IA ↓"}
                  </div>
                </div>
                <div style={{background:T.card,borderRadius:8,padding:10,borderLeft:`3px solid ${T.purple}`}}>
                  <div style={{fontSize:7,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>Com ensino superior</div>
                  <div style={{fontSize:12,fontWeight:700,color:planAnalise.ibge.pctSuperior?T.purple:T.warn}}>
                    {planAnalise.ibge.pctSuperior||"estimado pela IA ↓"}
                  </div>
                </div>
              </div>
              <div style={{fontSize:8,color:T.muted}}>Fonte: {planAnalise.ibge.fonte}</div>
            </div>
          )}
          {(planAnalise.totalRestaurantes||planAnalise.avaliacaoMedia)&&(
            <div style={{background:T.surface,borderRadius:10,padding:16,borderLeft:`3px solid ${T.info}`}}>
              <div style={{fontSize:9,color:T.info,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>🗺️ Dados reais — Google Maps (raio 5km)</div>
              <div style={{display:"flex",gap:20,flexWrap:"wrap",marginBottom:12}}>
                {planAnalise.totalRestaurantes&&<div><div style={{fontSize:8,color:T.muted}}>Restaurantes</div><div style={{fontSize:18,fontWeight:800,color:T.info}}>{planAnalise.totalRestaurantes}</div></div>}
                {planAnalise.avaliacaoMedia&&<div><div style={{fontSize:8,color:T.muted}}>Avaliação média</div><div style={{fontSize:18,fontWeight:800,color:T.warn}}>{planAnalise.avaliacaoMedia}★</div></div>}
                {planAnalise.totalReviews&&<div><div style={{fontSize:8,color:T.muted}}>Total de avaliações</div><div style={{fontSize:18,fontWeight:800,color:T.purple}}>{Number(planAnalise.totalReviews).toLocaleString("pt-BR")}</div></div>}
                {planAnalise.nivelPreco&&<div><div style={{fontSize:8,color:T.muted}}>Nível de preço</div><div style={{fontSize:14,fontWeight:800,color:T.accent}}>{planAnalise.nivelPreco}</div></div>}
              </div>
              {planAnalise.distribuicao&&(
                <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
                  <div style={{background:T.accentDim,borderRadius:6,padding:"4px 10px",fontSize:9,color:T.accent}}>⭐ {planAnalise.distribuicao.excelente} excelentes (4.5+)</div>
                  <div style={{background:T.warnDim,borderRadius:6,padding:"4px 10px",fontSize:9,color:T.warn}}>👍 {planAnalise.distribuicao.bom} bons (4.0+)</div>
                  <div style={{background:T.surface,borderRadius:6,padding:"4px 10px",fontSize:9,color:T.muted}}>😐 {planAnalise.distribuicao.regular} regulares</div>
                </div>
              )}
              {planAnalise.topDetalhado&&planAnalise.topDetalhado.length>0&&(
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:8,color:T.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Top estabelecimentos por relevância</div>
                  {planAnalise.topDetalhado.map((p,i)=>(
                    <div key={i} style={{background:T.card,borderRadius:8,padding:"8px 12px",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:9,color:T.muted,marginBottom:4}}>Estabelecimento {i+1} da região</div>
                        {p.topReviews?.[0]?.text&&<div style={{fontSize:9,color:T.soft,fontStyle:"italic",lineHeight:1.5}}>"{p.topReviews[0].text.slice(0,150)}..."</div>}
                      </div>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <div style={{fontSize:13,fontWeight:800,color:T.warn}}>{p.rating}★</div>
                        <div style={{fontSize:8,color:T.muted}}>{p.totalReviews} avaliações</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {planAnalise.topCulinarias&&planAnalise.topCulinarias.length>0&&(
                <div>
                  <div style={{fontSize:8,color:T.muted,marginBottom:6}}>Culinárias encontradas na região:</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {planAnalise.topCulinarias.map((c,i)=>{
                      const label=typeof c==="object"?c.label:c;
                      const count=typeof c==="object"?c.count:null;
                      const maxCount=typeof planAnalise.topCulinarias[0]==="object"?planAnalise.topCulinarias[0].count:20;
                      const pct=count?Math.round((count/maxCount)*100):null;
                      return(
                        <span key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,padding:"3px 10px",fontSize:9,color:T.soft}}>
                          {label}{pct&&pct<100?` · ${pct}%`:""}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          <div style={{background:T.surface,borderRadius:10,padding:16,borderLeft:`3px solid ${T.purple}`}}>
            <div style={{fontSize:9,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Análise estratégica</div>
            <div style={{fontSize:11,color:T.soft,lineHeight:1.7}}>{planAnalise.analise}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {planAnalise.oportunidade&&<div style={{background:T.surface,borderRadius:10,padding:14,borderLeft:`3px solid ${T.warn}`}}>
              <div style={{fontSize:9,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Oportunidade</div>
              <div style={{fontSize:11,color:T.soft,lineHeight:1.6}}>{planAnalise.oportunidade}</div>
            </div>}
            {planAnalise.potencialImpacto&&<div style={{background:T.surface,borderRadius:10,padding:14,borderLeft:`3px solid ${T.accent}`}}>
              <div style={{fontSize:9,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Potencial de impacto</div>
              <div style={{fontSize:11,color:T.soft,lineHeight:1.6}}>{planAnalise.potencialImpacto}</div>
            </div>}
            {planAnalise.melhorEpoca&&<div style={{background:T.surface,borderRadius:10,padding:14,borderLeft:`3px solid ${T.pink}`}}>
              <div style={{fontSize:9,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Melhor época</div>
              <div style={{fontSize:11,color:T.soft}}>{planAnalise.melhorEpoca}</div>
            </div>}
            {planAnalise.callToAction&&<div style={{background:T.surface,borderRadius:10,padding:14,borderLeft:`3px solid ${T.info}`}}>
              <div style={{fontSize:9,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Sugestão de call-to-action</div>
              <div style={{fontSize:11,color:T.soft}}>{planAnalise.callToAction}</div>
            </div>}
          </div>
          {planAnalise.roi&&<div style={{background:T.accentDim,border:`1px solid ${T.accentBorder}`,borderRadius:10,padding:14}}>
            <div style={{fontSize:9,color:T.accent,textTransform:"uppercase",letterSpacing:1,marginBottom:6,fontWeight:700}}>Estimativa de ROI</div>
            <div style={{fontSize:12,color:T.accent,fontWeight:600}}>{planAnalise.roi}</div>
          </div>}
          <button onClick={()=>gerarAnaliseIA(planAtivo)} style={{alignSelf:"flex-start",padding:"7px 14px",background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:7,cursor:"pointer",fontSize:9}}>Regenerar análise</button>
        </div>
      )}
    </div>
  );
};

// ── WIZ STEP 3 ────────────────────────────────────────────────────────────
const WizStep3=({visible,planAtivo,setPlanAtivo,parc,basePartners,geocodeEndereco,sugerirParceiros})=>{
  const [sugestao,setSugestao]=useState(null);
  const [loadingSug,setLoadingSug]=useState(false);
  if(!visible)return null;

  // Calculadora de campanha
  const calc=planAtivo.calc||{};
  const cValorProposta=parseFloat(String(calc.valorProposta||0).replace(",","."))||0;
  const cValorTabela=parseFloat(String(calc.valorTabela||0).replace(",","."))||0;
  const cDesconto=parseFloat(String(calc.desconto||0).replace(",","."))||0;
  const cValorBruto=cValorTabela>0?parseFloat((cValorTabela*(1-cDesconto/100)).toFixed(2)):0;
  const cTotalEmb=cValorBruto>0?Math.ceil(cValorProposta/cValorBruto):0;
  const cParcNecessarios=cTotalEmb>0?Math.ceil(cTotalEmb/1000):0;
  const cEmbPorParc=cParcNecessarios>0?Math.ceil(cTotalEmb/Math.max(cParcNecessarios,parc.length||1)):0;

  const distribuir=()=>{
    if(!cTotalEmb)return alert("Preencha os campos da calculadora primeiro.");
    if(!parc.length)return alert("Selecione pelo menos um parceiro antes de distribuir.");
    if(parc.length<cParcNecessarios){
      const falta=cParcNecessarios-parc.length;
      if(!window.confirm(`Você selecionou ${parc.length} parceiro(s), mas a calculadora indica ${cParcNecessarios} necessários.\nCada parceiro receberá mais de 1.000 embalagens.\n\nDeseja distribuir mesmo assim?`))return;
    }
    const embPorParc=Math.ceil(cTotalEmb/parc.length);
    setPlanAtivo(p=>({...p,parceiros:p.parceiros.map(x=>({...x,embalagens:embPorParc,tabela:cValorTabela||x.tabela,desconto:cDesconto}))}));
    alert(`✓ ${parc.length} parceiro(s) atualizado(s) com ${embPorParc.toLocaleString("pt-BR")} embalagens cada.\nTotal: ${(parc.length*embPorParc).toLocaleString("pt-BR")} embalagens · Valor: R$ ${(parc.length*embPorParc*cValorBruto).toLocaleString("pt-BR",{minimumFractionDigits:2})}`);
  };

  return(
    <div>
      <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,color:T.info,fontSize:12,marginBottom:14}}>Etapa 3 — Parceiros e Mapa de Calor</div>

      {/* CALCULADORA */}
      <div style={{background:T.surface,borderRadius:12,padding:14,marginBottom:16,border:`1px solid ${T.warn}44`}}>
        <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:10,color:T.warn,marginBottom:10}}>🧮 Calculadora de Campanha</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:cValorProposta>0&&cValorTabela>0?10:0}}>
          {[["Valor da proposta (R$)","valorProposta","Ex: 50.000,00"],["Valor tabela (R$/emb)","valorTabela","Ex: 12,00"],["Desconto (%)","desconto","Ex: 50"]].map(([l,k,ph])=>(
            <div key={k}>
              <div style={{fontSize:7,color:T.muted,marginBottom:3,textTransform:"uppercase",letterSpacing:1}}>{l}</div>
              {k==="desconto"?(
                <input type="number" min="0" max="100" value={calc[k]||""} onChange={e=>setPlanAtivo(p=>({...p,calc:{...(p.calc||{}),[k]:e.target.value}}))} placeholder={ph} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:"7px 9px",fontSize:11,color:T.text,outline:"none"}}/>
              ):(
                <input
                  type="text"
                  inputMode="numeric"
                  value={calc[k+"_fmt"]||""}
                  placeholder={ph}
                  onChange={()=>{}}
                  onKeyDown={e=>{
                    if(["Tab","Enter","ArrowLeft","ArrowRight"].includes(e.key))return;
                    e.preventDefault();
                    const raw=String(calc[k+"_raw"]||"");
                    let nr;
                    if(/^\d$/.test(e.key)) nr=raw+e.key;
                    else if(e.key==="Backspace"||e.key==="Delete") nr=raw.slice(0,-1);
                    else return;
                    const num=nr.length>0?Number(nr)/100:0;
                    const fmt=num>0?num.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}):"";
                    setPlanAtivo(p=>({...p,calc:{...(p.calc||{}),[k]:num,[k+"_raw"]:nr,[k+"_fmt"]:fmt}}));
                  }}
                  style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:"7px 9px",fontSize:11,color:T.text,outline:"none",cursor:"text",caretColor:T.accent}}
                />
              )}
            </div>
          ))}
        </div>
        {cValorProposta>0&&cValorTabela>0&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:8}}>
              {[
                ["Valor bruto/emb",`R$ ${cValorBruto.toFixed(2).replace(".",",")}`,T.accent],
                ["Total embalagens",cTotalEmb.toLocaleString("pt-BR"),T.purple],
                ["Parceiros necessários",cParcNecessarios,T.info],
                ["Emb. por parceiro",cEmbPorParc.toLocaleString("pt-BR"),T.warn],
              ].map(([l,v,cor])=>(
                <div key={l} style={{background:T.card,borderRadius:7,padding:"8px 10px",textAlign:"center",borderTop:`2px solid ${cor}`}}>
                  <div style={{fontSize:13,fontWeight:800,color:cor,marginBottom:1}}>{v}</div>
                  <div style={{fontSize:7,color:T.muted,textTransform:"uppercase",letterSpacing:0.5}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:8,color:parc.length<cParcNecessarios?T.warn:T.muted}}>
                {parc.length<cParcNecessarios
                  ?`⚠️ Selecione mais ${cParcNecessarios-parc.length} parceiro(s) — precisa de ${cParcNecessarios} para máx. 1.000 emb. cada`
                  :`✓ ${parc.length} selecionado(s) · ${cEmbPorParc.toLocaleString("pt-BR")} emb. por parceiro · total R$ ${(cTotalEmb*cValorBruto).toLocaleString("pt-BR",{minimumFractionDigits:0})}`
                }
              </div>
              {parc.length>0&&<button onClick={distribuir} style={{padding:"6px 14px",background:`linear-gradient(135deg,${T.accent},#00B87A)`,border:"none",color:"#000",borderRadius:6,cursor:"pointer",fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:9}}>✓ Distribuir automaticamente</button>}
            </div>
          </div>
        )}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div>
          {/* Sugestão da IA */}
          <div style={{marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:10,color:T.muted,fontWeight:700}}>Parceiros da base</div>
            <button onClick={async()=>{setLoadingSug(true);setSugestao(null);const s=await sugerirParceiros(planAtivo,basePartners||[]);setSugestao(s);setLoadingSug(false);}} style={{padding:"5px 12px",background:T.purpleDim,border:`1px solid ${T.purple}44`,color:T.purple,borderRadius:6,cursor:"pointer",fontSize:9,fontWeight:700}}>
              {loadingSug?"🤖 Analisando...":"🤖 Sugerir pelo briefing"}
            </button>
          </div>
          {sugestao&&(
            <div style={{background:T.purpleDim,border:`1px solid ${T.purple}44`,borderRadius:8,padding:"10px 12px",marginBottom:10}}>
              <div style={{fontSize:9,color:T.purple,fontWeight:700,marginBottom:4}}>IA recomenda para "{planAtivo.clienteNome}":</div>
              <div style={{fontSize:9,color:T.soft,marginBottom:6,lineHeight:1.5}}>{sugestao.perfilIdeal}</div>
              <div style={{fontSize:8,color:T.muted,fontStyle:"italic"}}>{sugestao.justificativa}</div>
            </div>
          )}
          <div style={{maxHeight:280,overflowY:"auto",marginBottom:10}}>
            {(()=>{
              const ativos=(basePartners||[]).filter(p=>p.status==="ativo");
              const recsIds=(sugestao&&sugestao.recomendados||[]).map(String);
              const recs=ativos.filter(p=>recsIds.includes(String(p.id)));
              const outros=ativos.filter(p=>!recsIds.includes(String(p.id)));
              return [...recs,...outros].map(p=>{
                const sel=parc.find(x=>x.id===p.id);
                const isRec=recsIds.includes(String(p.id));
                return(
                  <div key={p.id} onClick={async()=>{
                    if(sel){setPlanAtivo(x=>({...x,parceiros:x.parceiros.filter(y=>y.id!==p.id)}));}
                    else{
                      let lat=p.lat||null,lng=p.lng||null;
                      if(!lat&&(p.city||p.address)){try{const g=await geocodeEndereco(`${p.name}, ${p.city||p.address}, Brasil`);if(g){lat=g.lat;lng=g.lng;}}catch(e){}}
                      setPlanAtivo(x=>({...x,parceiros:[...x.parceiros,{id:p.id,nome:p.name,segmento:p.category,endereco:p.address||p.city||"",lat,lng,embalagens:500,tabela:6,desconto:0,raio:5,manual:false}]}));
                    }
                  }} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 10px",borderRadius:7,cursor:"pointer",marginBottom:4,background:sel?T.accentDim:isRec?T.purpleDim:T.surface,border:`1px solid ${sel?T.accentBorder:isRec?T.purple+"66":T.border}`}}>
                    <div>
                      <div style={{display:"flex",gap:5,alignItems:"center"}}>
                        <div style={{fontSize:10,fontWeight:sel||isRec?700:400,color:sel?T.accent:isRec?T.purple:T.text}}>{p.name}</div>
                        {isRec&&!sel&&<span style={{fontSize:7,background:T.purple,color:"#fff",borderRadius:4,padding:"1px 5px"}}>IA ✓</span>}
                      </div>
                      <div style={{fontSize:8,color:T.muted}}>{p.category} · {p.city}</div>
                    </div>
                    <div style={{fontSize:10,color:sel?T.accent:isRec?T.purple:T.muted}}>{sel?"✓":"+"}</div>
                  </div>
                );
              });
            })()}
          </div>
          <div style={{borderTop:`1px solid ${T.border}`,paddingTop:10,marginBottom:10}}>
            <div style={{fontSize:9,color:T.muted,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Adicionar parceiro manual</div>
            <div style={{display:"flex",flexDirection:"column",gap:6,background:T.bg,borderRadius:8,padding:"10px 12px",border:`1px solid ${T.border}`}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                <div>
                  <div style={{fontSize:8,color:T.muted,marginBottom:3}}>Nome do estabelecimento *</div>
                  <input id="pm-nome" placeholder="Ex: Burger King" style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:5,padding:"6px 8px",fontSize:10,color:T.text,outline:"none"}}/>
                </div>
                <div>
                  <div style={{fontSize:8,color:T.muted,marginBottom:3}}>Segmento</div>
                  <input id="pm-seg" placeholder="Ex: Fast Food" style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:5,padding:"6px 8px",fontSize:10,color:T.text,outline:"none"}}/>
                </div>
              </div>
              <div>
                <div style={{fontSize:8,color:T.muted,marginBottom:3}}>Rua / Avenida *</div>
                <input id="pm-rua" placeholder="Ex: Av. Paulista, 1000" style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:5,padding:"6px 8px",fontSize:10,color:T.text,outline:"none"}}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                <div>
                  <div style={{fontSize:8,color:T.muted,marginBottom:3}}>Bairro</div>
                  <input id="pm-bairro" placeholder="Ex: Bela Vista" style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:5,padding:"6px 8px",fontSize:10,color:T.text,outline:"none"}}/>
                </div>
                <div>
                  <div style={{fontSize:8,color:T.muted,marginBottom:3}}>Cidade *</div>
                  <input id="pm-cidade" placeholder="Ex: São Paulo" style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:5,padding:"6px 8px",fontSize:10,color:T.text,outline:"none"}}/>
                </div>
                <div>
                  <div style={{fontSize:8,color:T.muted,marginBottom:3}}>UF *</div>
                  <input id="pm-uf" placeholder="Ex: SP" maxLength={2} style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:5,padding:"6px 8px",fontSize:10,color:T.text,outline:"none",textTransform:"uppercase"}}/>
                </div>
              </div>
              <button onClick={async()=>{
                const nome=document.getElementById("pm-nome")?.value?.trim();
                const seg=document.getElementById("pm-seg")?.value?.trim();
                const rua=document.getElementById("pm-rua")?.value?.trim();
                const bairro=document.getElementById("pm-bairro")?.value?.trim();
                const cidade=document.getElementById("pm-cidade")?.value?.trim();
                const uf=document.getElementById("pm-uf")?.value?.trim();
                if(!nome||!cidade)return alert("Preencha pelo menos o nome e a cidade.");
                const enderecoCompleto=[rua,bairro,cidade,uf,"Brasil"].filter(Boolean).join(", ");
                let geo=null;
                const tentativas=[enderecoCompleto,`${nome}, ${rua||""}, ${cidade}, ${uf||""}, Brasil`,`${cidade}, ${uf||""}, Brasil`].filter(x=>x.trim().length>5);
                for(const t of tentativas){
                  try{geo=await geocodeEndereco(t);if(geo)break;}catch(e){}
                }
                setPlanAtivo(p=>({...p,parceiros:[...p.parceiros,{id:Date.now(),nome,segmento:seg||"",endereco:enderecoCompleto,lat:geo?.lat||null,lng:geo?.lng||null,embalagens:500,tabela:6,desconto:0,raio:5,manual:true,geocoded:!!geo}]}));
                ["pm-nome","pm-seg","pm-rua","pm-bairro","pm-cidade","pm-uf"].forEach(id=>{const el=document.getElementById(id);if(el)el.value="";});
                if(!geo)alert(`"${nome}" adicionado mas não localizado no mapa. Verifique o endereço.`);
              }} style={{padding:"7px",background:T.infoDim,border:`1px solid ${T.info}44`,color:T.info,borderRadius:6,cursor:"pointer",fontSize:10,fontWeight:700,width:"100%"}}>
                + Adicionar parceiro ao plano
              </button>
            </div>
          </div>
          {parc.map((p,i)=>(
            <div key={p.id||i} style={{background:T.surface,borderRadius:8,padding:"8px 10px",marginBottom:6,border:`1px solid ${p.lat?T.border:T.warn+"44"}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <div style={{display:"flex",gap:5,alignItems:"center"}}>
                  <span style={{fontSize:10,fontWeight:700}}>{p.nome}</span>
                  <span title={p.lat?"Localizado no mapa":"Sem localização — não aparece no mapa"} style={{fontSize:9}}>{p.lat?"📍":"⚠️"}</span>
                </div>
                <div onClick={()=>setPlanAtivo(x=>({...x,parceiros:x.parceiros.filter((_,j)=>j!==i)}))} style={{cursor:"pointer",color:T.muted,fontSize:14}}>×</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                {[["Embalagens","embalagens"],["R$/un","tabela"],["Desc %","desconto"]].map(([l,k])=>(
                  <div key={k}><div style={{fontSize:7,color:T.muted,marginBottom:2}}>{l}</div>
                  <input type="number" value={p[k]||""} onChange={e=>setPlanAtivo(x=>({...x,parceiros:x.parceiros.map((q,j)=>j===i?{...q,[k]:e.target.value}:q)}))} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:5,padding:"4px 6px",fontSize:10,color:T.text,outline:"none"}}/></div>
                ))}
              </div>
              <div style={{marginTop:6}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <div style={{fontSize:7,color:T.muted}}>Raio de abrangência</div>
                  <div style={{fontSize:9,color:T.danger,fontWeight:700}}>{p.raio||5} km</div>
                </div>
                <input type="range" min={1} max={10} step={1} value={p.raio||5} onChange={e=>setPlanAtivo(x=>({...x,parceiros:x.parceiros.map((q,j)=>j===i?{...q,raio:Number(e.target.value)}:q)}))} style={{width:"100%",accentColor:"#FF4D6A",cursor:"pointer"}}/>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:7,color:T.muted}}>1km</span>
                  <span style={{fontSize:7,color:T.muted}}>10km</span>
                </div>
              </div>
            </div>
          ))}
          <div style={{marginTop:12,borderTop:`1px solid ${T.border}`,paddingTop:10}}>
            <div style={{fontSize:9,color:T.purple,marginBottom:6,textTransform:"uppercase",letterSpacing:1,fontWeight:700}}>Outras mídias</div>
            {(planAtivo.outrasMidias||[]).map((m,i)=>(
              <div key={i} style={{background:T.surface,borderRadius:8,padding:"8px 10px",marginBottom:6,border:`1px solid ${T.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <input value={m.tipo||""} onChange={e=>setPlanAtivo(p=>({...p,outrasMidias:p.outrasMidias.map((x,j)=>j===i?{...x,tipo:e.target.value}:x)}))} placeholder="Tipo (ex: Push Notification)" style={{flex:1,background:T.card,border:`1px solid ${T.border}`,borderRadius:5,padding:"4px 8px",fontSize:10,color:T.text,outline:"none"}}/>
                  <div onClick={()=>setPlanAtivo(p=>({...p,outrasMidias:p.outrasMidias.filter((_,j)=>j!==i)}))} style={{cursor:"pointer",color:T.muted,fontSize:14,paddingLeft:8}}>×</div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:4}}>
                  {[["Descrição","descricao"],["Qtd","qtd"],["Tabela R$","tabela"],["Desc %","desconto"]].map(([l,k])=>(
                    <div key={k}><div style={{fontSize:7,color:T.muted,marginBottom:2}}>{l}</div>
                    <input value={m[k]||""} onChange={e=>setPlanAtivo(p=>({...p,outrasMidias:p.outrasMidias.map((x,j)=>j===i?{...x,[k]:e.target.value}:x)}))} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:5,padding:"4px 6px",fontSize:10,color:T.text,outline:"none"}}/></div>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={()=>setPlanAtivo(p=>({...p,outrasMidias:[...(p.outrasMidias||[]),{tipo:"",descricao:"",qtd:1,tabela:"",desconto:0}]}))} style={{padding:"6px 12px",background:"transparent",border:`1px solid ${T.purple}44`,color:T.purple,borderRadius:6,cursor:"pointer",fontSize:9,fontWeight:700}}>+ Adicionar mídia</button>
          </div>
        </div>
        <div>
          <div style={{fontSize:10,color:T.muted,marginBottom:8,fontWeight:700}}>Mapa de cobertura (raio 5km)</div>
          <MapaPlano clienteLat={planAtivo.clienteLat} clienteLng={planAtivo.clienteLng} clienteNome={planAtivo.clienteNome} parceiros={parc}/>
          <div style={{display:"flex",gap:12,marginTop:8}}>
            <div style={{display:"flex",gap:5,alignItems:"center"}}><div style={{width:10,height:10,borderRadius:"50%",background:"#00E5A0"}}/><span style={{fontSize:9,color:T.muted}}>Cliente</span></div>
            <div style={{display:"flex",gap:5,alignItems:"center"}}><div style={{width:10,height:10,borderRadius:"50%",background:"#3D9EFF"}}/><span style={{fontSize:9,color:T.muted}}>Parceiro</span></div>
            <div style={{display:"flex",gap:5,alignItems:"center"}}><div style={{width:10,height:10,borderRadius:2,background:"#FF4D6A33",border:"1px dashed #FF4D6A"}}/><span style={{fontSize:9,color:T.muted}}>Raio 5km</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── WIZ STEP 4 ────────────────────────────────────────────────────────────
const WizStep4=({visible,parc,outras,total,totalEmb,totalImpactos,custoImp,fmtCur,planAtivo,planAnalise,salvarPlano,gerarPropostaPDF,setPlanAtivo})=>{
  if(!visible)return null;

  return(
    <div>
      <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,color:T.warn,fontSize:12,marginBottom:14}}>Etapa 4 — Resumo e Proposta</div>


      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
        {[["Investimento",fmtCur(total),T.accent],["Embalagens",totalEmb.toLocaleString("pt-BR"),T.purple],["Impactos",totalImpactos.toLocaleString("pt-BR"),T.info],["Custo/impacto",`R$ ${custoImp}`,T.warn]].map(([l,v,c])=>(
          <div key={l} style={{background:T.surface,borderRadius:10,padding:14,textAlign:"center",border:`1px solid ${c}33`}}>
            <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:18,color:c,marginBottom:3}}>{v}</div>
            <div style={{fontSize:9,color:T.muted}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{background:T.surface,borderRadius:10,overflow:"hidden",marginBottom:16}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:T.card}}>{["Item","Qtd","Tabela (R$)","Desconto","Valor Bruto"].map(h=><th key={h} style={{padding:"8px 12px",fontSize:8,color:T.muted,textAlign:["Qtd","Tabela (R$)","Desconto","Valor Bruto"].includes(h)?"right":"left",textTransform:"uppercase",letterSpacing:1,borderBottom:`1px solid ${T.border}`}}>{h}</th>)}</tr></thead>
          <tbody>
            {parc.map((p,i)=>{const t=Number(p.tabela||6),q=Number(p.embalagens||0),d=Number(p.desconto||0),bruto=q*t*(1-d/100);return(
              <tr key={i} style={{borderBottom:`1px solid ${T.border}`,background:i%2===0?"transparent":T.bg}}>
                <td style={{padding:"7px 12px",fontSize:10,fontWeight:600}}>Embalagem — {p.nome}</td>
                <td style={{padding:"7px 12px",fontSize:10,textAlign:"right"}}>{q.toLocaleString("pt-BR")} un</td>
                <td style={{padding:"7px 12px",fontSize:10,textAlign:"right"}}>{t.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}/un</td>
                <td style={{padding:"7px 12px",fontSize:10,textAlign:"right",color:d>0?T.warn:T.muted}}>{d>0?d+"%":"—"}</td>
                <td style={{padding:"7px 12px",fontSize:11,textAlign:"right",fontWeight:700,color:T.accent}}>{bruto.toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:0})}</td>
              </tr>
            );})}
            {outras.map((m,i)=>{const t=Number(m.tabela||0),d=Number(m.desconto||0),bruto=t*(1-d/100);return(
              <tr key={"m"+i} style={{borderBottom:`1px solid ${T.border}`}}>
                <td style={{padding:"7px 12px",fontSize:10,fontWeight:600}}>{m.tipo}{m.descricao?` — ${m.descricao}`:""}</td>
                <td style={{padding:"7px 12px",fontSize:10,textAlign:"right"}}>{m.qtd||1}</td>
                <td style={{padding:"7px 12px",fontSize:10,textAlign:"right"}}>{t.toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:0})}</td>
                <td style={{padding:"7px 12px",fontSize:10,textAlign:"right",color:d>0?T.warn:T.muted}}>{d>0?d+"%":"—"}</td>
                <td style={{padding:"7px 12px",fontSize:11,textAlign:"right",fontWeight:700,color:T.accent}}>{bruto.toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:0})}</td>
              </tr>
            );})}
            <tr style={{background:T.accentDim}}>
              <td colSpan={4} style={{padding:"10px 12px",fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:12}}>TOTAL</td>
              <td style={{padding:"10px 12px",fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:14,color:T.accent,textAlign:"right"}}>{fmtCur(total)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{display:"flex",gap:10}}>
        <button onClick={async()=>{const s=await salvarPlano({...planAtivo,analise:planAnalise||planAtivo.analise});setPlanAtivo(s);}} style={{padding:"10px 20px",background:T.infoDim,border:`1px solid ${T.info}44`,color:T.info,borderRadius:9,cursor:"pointer",fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:11}}>💾 Salvar plano</button>
        <button onClick={async()=>{const s=await salvarPlano({...planAtivo,analise:planAnalise||planAtivo.analise});gerarPropostaPDF(s,s.analise);}} style={{padding:"10px 24px",background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",borderRadius:9,cursor:"pointer",fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:12,border:"none"}}>📄 Gerar Proposta PDF</button>
      </div>
    </div>
  );
};

// ── PLAN WIZARD ───────────────────────────────────────────────────────────
const PlanWizard=({planAtivo,setPlanAtivo,planStep,setPlanStep,planAnalise,setPlanAnalise,planLoading,planGeoLoading,setPlanGeoLoading,setShowPlanWizard,parc,outras,total,totalEmb,totalImpactos,custoImp,fmtCur,salvarPlano,gerarPropostaPDF,geocodeEndereco,gerarAnaliseIA,sugerirParceiros,user,basePartners,projects})=>(
  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,overflow:"hidden"}}>
    <div style={{padding:"16px 24px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:15}}>{planAtivo.clienteNome||"Novo Planejamento"}</div>
      <div style={{display:"flex",gap:6,alignItems:"center"}}>
        {["Cliente","Região","Parceiros","Proposta"].map((s,i)=>(
          <div key={i} onClick={()=>setPlanStep(i+1)} style={{width:24,height:24,borderRadius:"50%",background:planStep===i+1?T.accent:planStep>i+1?T.accentDim:T.surface,border:`2px solid ${planStep>=i+1?T.accent:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:planStep===i+1?"#000":planStep>i+1?T.accent:T.muted,cursor:"pointer"}}>{i+1}</div>
        ))}
        <button onClick={()=>setShowPlanWizard(false)} style={{marginLeft:8,background:"transparent",border:"none",color:T.muted,fontSize:18,cursor:"pointer"}}>×</button>
      </div>
    </div>
    <div style={{padding:24}}>
      <WizStep1 visible={planStep===1} planAtivo={planAtivo} setPlanAtivo={setPlanAtivo} planGeoLoading={planGeoLoading} setPlanGeoLoading={setPlanGeoLoading} geocodeEndereco={geocodeEndereco} projects={projects}/>
      <WizStep2 visible={planStep===2} planAtivo={planAtivo} planAnalise={planAnalise} planLoading={planLoading} gerarAnaliseIA={gerarAnaliseIA}/>
      <WizStep3 visible={planStep===3} planAtivo={planAtivo} setPlanAtivo={setPlanAtivo} parc={parc} basePartners={basePartners} geocodeEndereco={geocodeEndereco} sugerirParceiros={sugerirParceiros}/>
      <WizStep4 visible={planStep===4} parc={parc} outras={outras} total={total} totalEmb={totalEmb} totalImpactos={totalImpactos} custoImp={custoImp} fmtCur={fmtCur} planAtivo={planAtivo} planAnalise={planAnalise} salvarPlano={salvarPlano} gerarPropostaPDF={gerarPropostaPDF} setPlanAtivo={setPlanAtivo}/>
    </div>
    <div style={{padding:"14px 24px",borderTop:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between"}}>
      <button onClick={()=>planStep>1?setPlanStep(s=>s-1):setShowPlanWizard(false)} style={{padding:"8px 16px",background:T.surface,border:`1px solid ${T.border}`,color:T.muted,borderRadius:8,cursor:"pointer",fontSize:11}}>{planStep>1?"← Voltar":"Cancelar"}</button>
      {planStep<4&&<button onClick={()=>setPlanStep(s=>s+1)} style={{padding:"8px 20px",background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",borderRadius:8,cursor:"pointer",fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:11,border:"none"}}>Próximo →</button>}
    </div>
  </div>
);


const PlanTab=({planAtivo,setPlanAtivo,planStep,setPlanStep,planAnalise,setPlanAnalise,planLoading,planGeoLoading,setPlanGeoLoading,showPlanWizard,setShowPlanWizard,planejamentos,salvarPlano,gerarPropostaPDF,geocodeEndereco,gerarAnaliseIA,sugerirParceiros,user,basePartners,projects})=>{
  const parc=(planAtivo&&Array.isArray(planAtivo.parceiros)?planAtivo.parceiros:[]);
  const outras=(planAtivo&&Array.isArray(planAtivo.outrasMidias)?planAtivo.outrasMidias:[]);
  const pl=Array.isArray(planejamentos)?planejamentos:[];
  const totalEmb=parc.reduce((a,p)=>a+Number(p.embalagens||0),0);
  const totalImpactos=Math.round(totalEmb*3.3);
  const totalVal=parc.reduce((a,p)=>a+Number(p.embalagens||0)*Number(p.tabela||6)*(1-Number(p.desconto||0)/100),0);
  const totalMidia=outras.reduce((a,m)=>a+Number(m.tabela||0)*(1-Number(m.desconto||0)/100),0);
  const total=totalVal+totalMidia;
  const custoImp=totalImpactos>0?(total/totalImpactos).toFixed(2):0;
  const fmtCur=v=>Number(v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:0});
  const doNewPlan=()=>{
    setPlanAtivo({...EMPTY_PLAN,id:Date.now(),createdBy:(user&&user.name)||"",createdAt:new Date().toISOString()});
    setPlanStep(1);
    setPlanAnalise(null);
    setShowPlanWizard(true);
  };
  return(
    <div style={{padding:2}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div>
          <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:16,color:T.text}}>Planejamento de Mídia</div>
          <div style={{fontSize:10,color:T.muted,marginTop:2}}>Pense como planejador. Monte o plano antes de gerar a proposta.</div>
        </div>
        <button onClick={doNewPlan} style={{padding:"9px 18px",background:"#00E5A0",color:"#000",borderRadius:9,cursor:"pointer",fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:11,border:"none"}}>
          + Novo Planejamento
        </button>
      </div>

      {pl.length===0&&!showPlanWizard&&(
        <div style={{textAlign:"center",padding:"60px 20px"}}>
          <div style={{fontSize:40,marginBottom:12}}>📋</div>
          <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:16,color:T.soft,marginBottom:6}}>Nenhum planejamento ainda</div>
          <div style={{fontSize:11,color:T.muted}}>Crie um plano de mídia antes de gerar sua proposta</div>
        </div>
      )}

      {!showPlanWizard&&pl.map((p,idx)=>(
        <div key={p.id||idx} style={{background:T.card,border:"1px solid "+T.border,borderRadius:12,padding:"16px 20px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:14,marginBottom:3,color:T.text}}>{p.clienteNome||"Sem nome"}</div>
            <div style={{fontSize:10,color:T.muted}}>{p.regiao||"—"} · {(p.parceiros||[]).length} parceiros</div>
            <div style={{fontSize:9,color:T.muted,marginTop:2}}>{p.createdBy}</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{setPlanAtivo(p);setPlanAnalise(p.analise||null);setPlanStep(1);setShowPlanWizard(true);}} style={{padding:"7px 14px",background:T.accentDim,border:"1px solid "+T.accentBorder,color:T.accent,borderRadius:7,cursor:"pointer",fontSize:10,fontWeight:700}}>Editar</button>
            <button onClick={()=>gerarPropostaPDF(p,p.analise)} style={{padding:"7px 14px",background:"#00E5A0",border:"none",color:"#000",borderRadius:7,cursor:"pointer",fontSize:10,fontWeight:700}}>Proposta PDF</button>
          </div>
        </div>
      ))}

      {showPlanWizard&&(
        <PlanWizard
          planAtivo={planAtivo} setPlanAtivo={setPlanAtivo}
          planStep={planStep} setPlanStep={setPlanStep}
          planAnalise={planAnalise} setPlanAnalise={setPlanAnalise}
          planLoading={planLoading} planGeoLoading={planGeoLoading} setPlanGeoLoading={setPlanGeoLoading}
          setShowPlanWizard={setShowPlanWizard}
          parc={parc} outras={outras}
          total={total} totalEmb={totalEmb} totalImpactos={totalImpactos} custoImp={custoImp} fmtCur={fmtCur}
          salvarPlano={salvarPlano} gerarPropostaPDF={gerarPropostaPDF}
          geocodeEndereco={geocodeEndereco} gerarAnaliseIA={gerarAnaliseIA}
          sugerirParceiros={sugerirParceiros}
          user={user} basePartners={basePartners} projects={projects}
        />
      )}
    </div>
  );
};

const EMPTY_PLAN={id:null,projectId:"",clienteNome:"",clienteSegmento:"",clienteEndereco:"",clienteLat:null,clienteLng:null,publicoAlvo:"",faixaEtaria:"",rendaEstimada:"",objetivo:"",verba:"",prazo:"",regiao:"",preferenciaParceiro:"",analise:null,parceiros:[],outrasMidias:[],calc:{},createdBy:"",createdAt:""};

// ── MAPA DE PLANEJAMENTO (Leaflet) ──────────────────────────────────────────
const MapaPlano=({clienteLat,clienteLng,clienteNome,parceiros=[]})=>{
  const mapRef=useRef(null);
  const instRef=useRef(null);
  useEffect(()=>{
    const init=()=>{
      if(!mapRef.current)return;
      if(instRef.current){instRef.current.remove();instRef.current=null;}
      const L=window.L;
      const lat=clienteLat||-23.5505,lng=clienteLng||-46.6333;
      const map=L.map(mapRef.current,{zoomControl:true}).setView([lat,lng],13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}).addTo(map);
      if(clienteLat&&clienteLng){
        const icon=L.divIcon({html:`<div style="width:22px;height:22px;border-radius:50%;background:#00E5A0;border:3px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#000">C</div>`,className:"",iconSize:[22,22],iconAnchor:[11,11]});
        L.marker([lat,lng],{icon}).addTo(map).bindPopup(`<b>📍 ${clienteNome||"Cliente"}</b>`);
      }
      parceiros.forEach(p=>{
        if(!p.lat||!p.lng)return;
        const icon=L.divIcon({html:`<div style="width:14px;height:14px;border-radius:50%;background:#3D9EFF;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,className:"",iconSize:[14,14],iconAnchor:[7,7]});
        L.marker([p.lat,p.lng],{icon}).addTo(map).bindPopup(`<b>🏪 ${p.nome}</b><br/>${p.embalagens||0} emb.`);
        L.circle([p.lat,p.lng],{radius:(p.raio||5)*1000,color:"#FF4D6A",fillColor:"#FF4D6A",fillOpacity:0.06,weight:1.5,dashArray:"4"}).addTo(map);
      });
      instRef.current=map;
    };
    if(!document.getElementById("lf-css")){
      const l=document.createElement("link");l.id="lf-css";l.rel="stylesheet";
      l.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(l);
    }
    if(!window.L){
      const s=document.createElement("script");
      s.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      s.onload=init;document.head.appendChild(s);
    } else init();
    return()=>{if(instRef.current){instRef.current.remove();instRef.current=null;}};
  },[clienteLat,clienteLng,parceiros]);
  return <div ref={mapRef} style={{height:420,width:"100%",borderRadius:12,border:"1px solid #2A2E45",zIndex:1}}/>;
};

const GaleriaItem=({g,onRemove,editable=false})=>{
  const[playing,setPlaying]=useState(false);
  const embed=toEmbedUrl(g.url);
  const ar=g.orientacao==='vertical'?'9/16':g.orientacao==='quadrado'?'1/1':'16/9';
  return(
    <div style={{position:'relative',borderRadius:8,overflow:'hidden',background:T.surface,cursor:embed&&!playing?'pointer':'default'}}
         onClick={()=>embed&&!playing&&setPlaying(true)}>
      {/* Container com aspect ratio fixo apenas para embeds */}
      <div style={embed?{position:'relative',paddingBottom:ar==='9/16'?'177.77%':ar==='1/1'?'100%':'56.25%'}:{}}>
        {embed&&playing?(
          <iframe src={embed.url} style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',border:'none'}}
                  allow="autoplay;accelerometer;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowFullScreen/>
        ):embed?(
          // Thumbnail + play button
          <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
            {embed.thumb
              ?<img src={embed.thumb} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>
              :<div style={{position:'absolute',inset:0,background:'#0d1117',display:'flex',alignItems:'center',justifyContent:'center'}}>
                 <span style={{fontSize:9,color:T.muted,fontFamily:"Arial,sans-serif"}}>{embed.type==='drive'?'Google Drive':'Vídeo'}</span>
               </div>
            }
            {/* Play button overlay */}
            <div style={{position:'relative',zIndex:2,width:44,height:44,borderRadius:'50%',background:'rgba(255,255,255,0.92)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 12px #0006'}}>
              <div style={{width:0,height:0,borderTop:'9px solid transparent',borderBottom:'9px solid transparent',borderLeft:'15px solid #111',marginLeft:3}}/>
            </div>
          </div>
        ):(
          // Imagem normal — sem aspect ratio forçado
          <img src={g.url} alt={g.legenda||''} style={{width:'100%',height:'auto',display:'block'}}
               onError={e=>{e.currentTarget.style.display='none';}}/>
        )}
      </div>
      {g.legenda&&<div style={{position:'absolute',bottom:0,left:0,right:0,background:'#00000088',padding:'4px 6px',fontSize:8,color:'#fff',lineHeight:1.3}}>{g.legenda}</div>}
      {editable&&<div onClick={e=>{e.stopPropagation();onRemove();}} style={{position:'absolute',top:4,right:4,width:18,height:18,borderRadius:'50%',background:T.danger,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,cursor:'pointer',fontWeight:700,zIndex:3}}>x</div>}
    </div>
  );
};
const PBar=({pct,color,h=5})=>(<div style={{height:h,background:T.border,borderRadius:h}}><div style={{height:"100%",width:`${Math.min(100,pct)}%`,background:color||T.accent,borderRadius:h,transition:"width 0.4s ease"}}/></div>);
const KCard=({label,value,sub,color,icon,onClick,hint})=>(<div onClick={onClick} style={{background:T.card,border:`1px solid ${onClick?color+"44":T.border}`,borderRadius:12,padding:"16px 18px",cursor:onClick?"pointer":"default",transition:"all 0.15s",position:"relative"}} onMouseEnter={e=>{if(onClick)e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";}}>  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:9,color:T.muted,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1.5}}>{label}</span>{icon&&<span style={{fontSize:14}}>{icon}</span>}</div><div style={{fontFamily:"Arial,sans-serif",fontSize:24,fontWeight:800,color,marginBottom:3}}>{value}</div>{sub&&<div style={{fontSize:9,color:T.muted,fontFamily:"Arial,sans-serif"}}>{sub}</div>}{onClick&&<div style={{fontSize:8,color:color,marginTop:5,fontFamily:"Arial,sans-serif",opacity:0.7}}>{hint||"Ver detalhes -"}</div>}</div>);
const inpS={width:"100%",background:T.bg,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",fontSize:11,color:T.text,fontFamily:"Arial,sans-serif",outline:"none"};
const selS={...inpS};
const tasksDone=(tasks)=>{const all=Object.values(tasks).flat();return{done:all.filter(t=>t.done).length,total:all.length};};

// --- FILE TYPE COLORS ---------------------------------------------------------
const FILE_COLOR={arte:T.pink,pi:T.info,contrato:T.purple,base:T.green,nf:T.warn,relatorio:T.accent,outro:T.soft};

// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// CAMPAIGN MODAL - with Tarefas, Etapas, Histórico, Arquivos
// ------------------------------------------------------------------------------------------------------------------------------------------------------------
const CampModal=({camp,user,allPartners,onClose,onToggleTask,onAddComment,onAddFile,onUpdateSacolas,onUpdateImpactos,onOpenClientPanel,onEditCamp,onGerarCheckin,onGerarPosVenda,projects,suppliers,users:allUsers})=>{
  const[iTab,setITab]=useState("tarefas");
  const[comment,setComment]=useState("");
  const[uploading,setUploading]=useState(false);
  const fileInputRef=useRef(null);
  const[editMode,setEditMode]=useState(false);
  const[editData,setEditData]=useState({...camp});
  const td=tasksDone(camp.tasks);

  const handleComment=()=>{
    if(!comment.trim())return;
    onAddComment(camp.id,comment,user);
    setComment("");
  };

  const handleRealFile=async(e)=>{
    const file=e.target.files?.[0];
    if(!file)return;
    setUploading(true);
    const ext=file.name.split(".").pop();
    const path=`campanhas/${camp.id}/${Date.now()}_${file.name.replace(/\s/g,"_")}`;
    const{data,error}=await supabase.storage.from("ecodely-files").upload(path,file,{upsert:true});
    if(error){console.error("Storage upload error:",error);setUploading(false);return;}
    const{data:{publicUrl}}=supabase.storage.from("ecodely-files").getPublicUrl(path);
    const tipo=["pdf","doc","docx"].includes(ext)?"outro":["jpg","jpeg","png","gif","webp"].includes(ext)?"arte":["mp4","mov","avi"].includes(ext)?"outro":"outro";
    const kb=Math.round(file.size/1024);
    const size=kb>1024?`${(kb/1024).toFixed(1)} MB`:`${kb} KB`;
    onAddFile(camp.id,{id:Date.now(),name:file.name,type:tipo,size,uploadedBy:user.name,at:now(),icon:"-",url:publicUrl});
    setUploading(false);
    e.target.value="";
  };

  return(
    <div style={{position:"fixed",inset:0,background:"#000000D0",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,width:"100%",maxWidth:820,maxHeight:"92vh",overflow:"hidden",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>

        {/* Header */}
        <div style={{padding:"18px 22px",borderBottom:`1px solid ${T.border}`,display:"flex",gap:12,alignItems:"flex-start",flexShrink:0}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",gap:6,marginBottom:5,flexWrap:"wrap"}}>
              <Badge label={STAGES_CAMP.find(s=>s.id===camp.stage)?.label||""} color={STAGES_CAMP.find(s=>s.id===camp.stage)?.color||T.muted}/>
              <Badge label={camp.project} color={T.purple}/>
              <Badge label={camp.client} color={T.info}/>
            </div>
            <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:17}}>{camp.name}</div>
            <div style={{fontSize:10,color:T.muted,marginTop:2}}>{camp.startDate} - {camp.endDate} · {camp.region} · {camp.parceiros} parceiros</div>
          </div>
          <div onClick={onClose} style={{cursor:"pointer",color:T.muted,fontSize:20,flexShrink:0}}>×</div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",borderBottom:`1px solid ${T.border}`,flexShrink:0,overflowX:"auto"}}>
          {[["tarefas","Tarefas"],["etapas","Etapas"],["historico",`Histórico (${camp.timeline.length})`],["arquivos",`Arquivos (${camp.files.length})`],["impactos","- Impactos"],["editar","✎ Editar"],["cliente","- Painel Cliente"]].map(([id,l])=>(
            <div key={id} onClick={()=>setITab(id)} style={{padding:"10px 18px",fontSize:11,cursor:"pointer",color:iTab===id?(id==="cliente"?T.purple:T.accent):T.muted,borderBottom:`2px solid ${iTab===id?(id==="cliente"?T.purple:T.accent):"transparent"}`,transition:"all 0.15s",whiteSpace:"nowrap"}}>{l}</div>
          ))}
        </div>

        <div style={{flex:1,overflow:"auto",padding:20}}>

          {/* -- TAREFAS -- */}
          {iTab==="tarefas"&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
                {[{l:"Parceiros",v:camp.parceiros,c:T.accent},{l:"Embalagens",v:(camp.sacolas||0).toLocaleString("pt-BR"),c:T.purple},{l:"Tarefas",v:`${td.done}/${td.total}`,c:td.done===td.total?T.accent:T.info}].map((k,i)=>(
                  <div key={i} style={{background:T.card,borderRadius:10,padding:"12px 14px",border:`1px solid ${T.border}`}}>
                    <div style={{fontFamily:"Arial,sans-serif",fontSize:20,fontWeight:800,color:k.c}}>{k.v}</div>
                    <div style={{fontSize:9,color:T.muted,fontFamily:"Arial,sans-serif"}}>{k.l}</div>
                  </div>
                ))}
              </div>

              {/* Bloco Operacional */}
              <div style={{background:T.card,border:`1px solid ${camp.graficaFornecedor?T.purple+"44":T.warn+"44"}`,borderLeft:`3px solid ${camp.graficaFornecedor?T.purple:T.warn}`,borderRadius:10,padding:"12px 16px",marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12,color:camp.graficaFornecedor?T.purple:T.warn}}>Operacional</div>
                  {!camp.graficaFornecedor&&<div style={{fontSize:8,color:T.warn,background:T.warnDim,padding:"2px 8px",borderRadius:4,fontFamily:"Arial,sans-serif"}}>Pendente — preencha na aba Editar</div>}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                  {[
                    {l:"Gráfica",v:camp.graficaFornecedor,c:T.purple},
                    {l:"Material",v:camp.material,c:T.purple},
                    {l:"Prazo Gráfica",v:camp.graficaPrazo,c:T.purple},
                    {l:"Logística",v:camp.logistica,c:T.info},
                    {l:"Fornecedor Log.",v:camp.logisticaFornecedor,c:T.info},
                    {l:"Prazo Logística",v:camp.logisticaPrazo,c:T.info},
                  ].map(({l,v,c})=>(
                    <div key={l}>
                      <div style={{fontSize:8,color:T.muted,marginBottom:3,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>{l}</div>
                      <div style={{fontSize:11,color:v?c:T.border,fontFamily:"Arial,sans-serif"}}>{v||"—"}</div>
                    </div>
                  ))}
                </div>
                {(camp.valorLiquido>0||camp.numPI||camp.agencia)&&(
                  <div style={{display:"flex",gap:16,marginTop:10,paddingTop:10,borderTop:`1px solid ${T.border}`}}>
                    {camp.numPI&&<div><div style={{fontSize:8,color:T.muted,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Nº PI</div><div style={{fontSize:11,color:T.text}}>{camp.numPI}</div></div>}
                    {camp.agencia&&<div><div style={{fontSize:8,color:T.muted,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Agência</div><div style={{fontSize:11,color:T.text}}>{camp.agencia}</div></div>}
                    {camp.valorLiquido>0&&<div><div style={{fontSize:8,color:T.muted,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Valor Líquido</div><div style={{fontSize:12,color:T.accent,fontWeight:700,fontFamily:"Arial,sans-serif"}}>R$ {camp.valorLiquido.toLocaleString("pt-BR")}</div></div>}
                  </div>
                )}
                {camp.briefing&&(
                  <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${T.border}`}}>
                    <div style={{fontSize:8,color:T.muted,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Briefing</div>
                    <div style={{fontSize:10,color:T.soft,lineHeight:1.6,fontFamily:"Arial,sans-serif"}}>{camp.briefing}</div>
                  </div>
                )}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {Object.entries(camp.tasks).map(([sec,tasks])=>{
                  const done=tasks.filter(t=>t.done).length;
                  return(
                    <div key={sec} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden"}}>
                      <div style={{padding:"10px 14px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{fontSize:12,fontFamily:"Arial,sans-serif",fontWeight:700,color:SEC_COLOR[sec]||T.muted}}>{SEC_LABEL[sec]||sec}</span>
                        <span style={{fontSize:9,color:T.muted,fontFamily:"Arial,sans-serif"}}>{done}/{tasks.length}</span>
                      </div>
                      <div style={{padding:"10px 12px"}}>
                        <PBar pct={Math.round((done/tasks.length)*100)} color={SEC_COLOR[sec]||T.muted} h={4}/>
                        <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:4}}>
                          {tasks.map(t=>(
                            <div key={t.id} onClick={()=>onToggleTask(camp.id,sec,t.id,user)} style={{display:"flex",gap:8,alignItems:"flex-start",cursor:"pointer",padding:"5px 6px",borderRadius:6}}>
                              <div style={{width:15,height:15,borderRadius:4,border:`2px solid ${t.done?SEC_COLOR[sec]||T.accent:T.border}`,background:t.done?(SEC_COLOR[sec]||T.accent)+"33":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:SEC_COLOR[sec]||T.accent,flexShrink:0,marginTop:1}}>{t.done&&"-"}</div>
                              <div style={{flex:1}}>
                                <div style={{fontSize:11,color:t.done?T.muted:T.text,textDecoration:t.done?"line-through":"none",fontFamily:"Arial,sans-serif"}}>{t.label}</div>
                                {t.done&&t.doneAt&&<div style={{fontSize:8,color:T.muted,marginTop:2}}>{t.doneAt} · {t.doneBy}</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* -- ETAPAS -- */}
          {iTab==="etapas"&&(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {STAGES_CAMP.map(s=>{
                const isCur=camp.stage===s.id,isDone=camp.stage>s.id;
                return(
                  <div key={s.id} style={{border:`1px solid ${isCur?s.color+"55":T.border}`,background:isCur?s.color+"08":T.card,borderRadius:10,padding:"14px 16px"}}>
                    <div style={{display:"flex",gap:10,alignItems:"center"}}>
                      <div style={{width:26,height:26,borderRadius:"50%",background:isDone?T.accent+"33":isCur?s.color+"33":T.border,border:`2px solid ${isDone?T.accent:isCur?s.color:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:isDone?T.accent:isCur?s.color:T.muted,flexShrink:0}}>{isDone?"-":s.id}</div>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap",marginBottom:4}}>
                          <span style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12,color:isCur?s.color:isDone?T.soft:T.muted}}>{s.label}</span>
                          {isCur&&<Badge label="Em andamento" color={s.color}/>}
                          {isDone&&<Badge label="Concluída" color={T.accent}/>}
                        </div>
                        {s.id===2&&(camp.graficaFornecedor||camp.material)&&<div style={{fontSize:10,color:T.muted,fontFamily:"Arial,sans-serif"}}>{camp.graficaFornecedor} · {camp.material}{camp.graficaPrazo&&` · Prazo: ${camp.graficaPrazo}`}</div>}
                        {s.id===3&&(camp.logistica||camp.logisticaFornecedor)&&<div style={{fontSize:10,color:T.muted,fontFamily:"Arial,sans-serif"}}>{camp.logistica} · {camp.logisticaFornecedor}{camp.logisticaPrazo&&` · Prazo: ${camp.logisticaPrazo}`}</div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* -- HISTÓRICO (TIMELINE) -- */}
          {iTab==="historico"&&(
            <div>
              <div style={{display:"flex",flexDirection:"column",gap:0,position:"relative"}}>
                {/* Vertical line */}
                <div style={{position:"absolute",left:16,top:0,bottom:0,width:1,background:T.border,zIndex:0}}/>
                {camp.timeline.map((e,i)=>(
                  <div key={e.id} style={{display:"flex",gap:14,alignItems:"flex-start",paddingBottom:16,position:"relative",zIndex:1}}>
                    <div style={{width:32,height:32,borderRadius:"50%",border:`2px solid ${e.color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:e.color,fontWeight:700,flexShrink:0,background:T.surface}}>{e.avatar}</div>
                    <div style={{flex:1,background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 14px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4,flexWrap:"wrap",gap:4}}>
                        <div style={{display:"flex",gap:6,alignItems:"center"}}>
                          <div style={{width:6,height:6,borderRadius:"50%",background:e.color,flexShrink:0}}/>
                          <span style={{fontSize:10,color:e.color,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:0.5}}>
                            {e.type==="stage"?"Etapa":e.type==="task"?"Tarefa":e.type==="comment"?"Comentário":"Arquivo"}
                          </span>
                        </div>
                        <span style={{fontSize:9,color:T.muted,fontFamily:"Arial,sans-serif"}}>{e.at} · {e.user}</span>
                      </div>
                      <div style={{fontSize:12,color:e.type==="comment"?T.soft:T.text,fontStyle:e.type==="comment"?"italic":"normal"}}>{e.text}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Add comment */}
              <div style={{marginTop:8,background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:14}}>
                <div style={{fontSize:9,color:T.muted,marginBottom:8,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Adicionar comentário</div>
                <div style={{display:"flex",gap:8}}>
                  <input value={comment} onChange={e=>setComment(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleComment()} placeholder="Digite uma observação... (@menção)" style={{...inpS,flex:1}}/>
                  <button onClick={handleComment} style={{padding:"8px 14px",background:T.accent,color:"#000",borderRadius:7,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:11,border:"none",cursor:"pointer"}}>Enviar</button>
                </div>
              </div>
            </div>
          )}

          {/* -- ARQUIVOS -- */}
          {iTab==="arquivos"&&(
            <div>
              {/* Upload area — real file input */}
              <input ref={fileInputRef} type="file" accept="*/*" style={{display:"none"}} onChange={handleRealFile}/>
              <div onClick={()=>!uploading&&fileInputRef.current?.click()} style={{border:`2px dashed ${T.border}`,borderRadius:12,padding:"24px",textAlign:"center",cursor:"pointer",marginBottom:16,transition:"all 0.2s",background:uploading?T.accentDim:"transparent",borderColor:uploading?T.accent:T.border}}>
                {uploading?(
                  <div>
                    <div style={{fontSize:22,marginBottom:6}}>-</div>
                    <div style={{fontSize:11,color:T.accent,fontFamily:"Arial,sans-serif"}}>Enviando arquivo...</div>
                  </div>
                ):(
                  <div>
                    <div style={{fontSize:22,marginBottom:6}}>-</div>
                    <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,marginBottom:3,fontSize:13}}>Subir arquivo</div>
                    <div style={{fontSize:10,color:T.muted,fontFamily:"Arial,sans-serif"}}>PDF · DOC · JPG · PNG · MP4 · Qualquer formato</div>
                  </div>
                )}
              </div>

              {/* File type legend */}
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
                {Object.entries(FILE_COLOR).map(([type,color])=>(
                  <div key={type} style={{display:"flex",gap:4,alignItems:"center"}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:color}}/>
                    <span style={{fontSize:9,color:T.muted,textTransform:"capitalize"}}>{type}</span>
                  </div>
                ))}
              </div>

              {camp.files.length===0?(
                <div style={{textAlign:"center",padding:"40px 20px",color:T.muted,fontSize:12,fontFamily:"Arial,sans-serif"}}>Nenhum arquivo ainda. Suba o primeiro acima.</div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {camp.files.map((f,i)=>(
                    <div key={f.id} style={{display:"flex",gap:12,alignItems:"center",padding:"12px 16px",background:T.card,border:`1px solid ${T.border}`,borderLeft:`3px solid ${FILE_COLOR[f.type]||T.soft}`,borderRadius:10}}>
                      <div style={{fontSize:20,flexShrink:0}}>{f.icon}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:12,fontWeight:700,fontFamily:"Arial,sans-serif",marginBottom:2}}>{f.url?<a href={f.url} target="_blank" rel="noreferrer" style={{color:T.accent,textDecoration:"none"}}>{f.name} -</a>:f.name}</div>
                        <div style={{fontSize:9,color:T.muted,fontFamily:"Arial,sans-serif"}}>{f.size} · por {f.uploadedBy} · {f.at}</div>
                      </div>
                      <Badge label={f.type} color={FILE_COLOR[f.type]||T.soft}/>
                      <div style={{fontSize:10,color:T.accent,cursor:"pointer",fontFamily:"Arial,sans-serif"}}>- Baixar</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* -- IMPACTOS -- */}
          {iTab==="impactos"&&(
            <ImpactosTab camp={camp} allPartners={allPartners} onUpdate={onUpdateImpactos}/>
          )}

          {/* -- EDITAR CAMPANHA -- */}
          {iTab==="editar"&&(
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[["Nome","name"],["Cliente","client"],["Agência","agencia"],["Nº PI","numPI"],["Região","region"],["Responsável","responsavel"]].map(([l,k])=>(
                  <div key={k}>
                    <div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>{l}</div>
                    <input value={editData[k]||""} onChange={e=>setEditData(p=>({...p,[k]:e.target.value}))} style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",fontSize:11,color:T.text,fontFamily:"Arial,sans-serif",outline:"none"}}/>
                  </div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                <div>
                  <div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Projeto</div>
                  <select value={editData.project||""} onChange={e=>setEditData(p=>({...p,project:e.target.value}))} style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",fontSize:11,color:T.text,outline:"none"}}>
                    {(projects||[]).map(p=><option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Data início</div>
                  <input type="date" value={editData.startDate||""} onChange={e=>setEditData(p=>({...p,startDate:e.target.value}))} style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",fontSize:11,color:T.text,outline:"none"}}/>
                </div>
                <div>
                  <div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Data fim</div>
                  <input type="date" value={editData.endDate||""} onChange={e=>setEditData(p=>({...p,endDate:e.target.value}))} style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",fontSize:11,color:T.text,outline:"none"}}/>
                </div>
              </div>
              <div style={{borderTop:`1px solid ${T.border}`,paddingTop:14}}>
                <div style={{fontSize:10,color:T.purple,fontFamily:"Arial,sans-serif",fontWeight:700,marginBottom:10}}>Operacional</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                  <div>
                    <div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Gráfica</div>
                    <select value={editData.graficaFornecedor||""} onChange={e=>setEditData(p=>({...p,graficaFornecedor:e.target.value}))} style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",fontSize:11,color:T.text,outline:"none"}}>
                      <option value="">Selecione...</option>
                      {(suppliers||[]).filter(s=>s.type==="grafica").map(s=><option key={s.id} value={s.name}>{s.name}</option>)}
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                  <div>
                    <div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Material</div>
                    <input value={editData.material||""} onChange={e=>setEditData(p=>({...p,material:e.target.value}))} style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",fontSize:11,color:T.text,outline:"none"}}/>
                  </div>
                  <div>
                    <div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Prazo gráfica</div>
                    <input type="date" value={editData.graficaPrazo||""} onChange={e=>setEditData(p=>({...p,graficaPrazo:e.target.value}))} style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",fontSize:11,color:T.text,outline:"none"}}/>
                  </div>
                  <div>
                    <div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Logística</div>
                    <select value={editData.logistica||""} onChange={e=>setEditData(p=>({...p,logistica:e.target.value}))} style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",fontSize:11,color:T.text,outline:"none"}}>
                      <option value="">Selecione...</option>
                      {(suppliers||[]).filter(s=>s.type==="logistica").map(s=><option key={s.id} value={s.name}>{s.name}</option>)}
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                  <div>
                    <div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Fornecedor logística</div>
                    <input value={editData.logisticaFornecedor||""} onChange={e=>setEditData(p=>({...p,logisticaFornecedor:e.target.value}))} style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",fontSize:11,color:T.text,outline:"none"}}/>
                  </div>
                  <div>
                    <div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Prazo logística</div>
                    <input type="date" value={editData.logisticaPrazo||""} onChange={e=>setEditData(p=>({...p,logisticaPrazo:e.target.value}))} style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",fontSize:11,color:T.text,outline:"none"}}/>
                  </div>
                  <div>
                    <div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Nº parceiros</div>
                    <input type="number" value={editData.parceiros||""} onChange={e=>setEditData(p=>({...p,parceiros:Number(e.target.value)}))} style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",fontSize:11,color:T.text,outline:"none"}}/>
                  </div>
                  <div>
                    <div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Qtd embalagens</div>
                    <input type="number" value={editData.sacolas||""} onChange={e=>setEditData(p=>({...p,sacolas:Number(e.target.value)}))} style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",fontSize:11,color:T.text,outline:"none"}}/>
                  </div>
                  <div>
                    <div style={{fontSize:9,color:T.accent,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Valor líquido (R$)</div>
                    <input type="number" value={editData.valorLiquido||""} onChange={e=>setEditData(p=>({...p,valorLiquido:Number(e.target.value)}))} style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",fontSize:11,color:T.text,outline:"none"}}/>
                  </div>
                </div>
              </div>
              <div style={{borderTop:`1px solid ${T.border}`,paddingTop:14}}>
                <div style={{fontSize:9,color:T.muted,marginBottom:6,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Briefing</div>
                <textarea value={editData.briefing||""} onChange={e=>setEditData(p=>({...p,briefing:e.target.value}))} rows={4} style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",fontSize:11,color:T.text,outline:"none",resize:"vertical",lineHeight:1.6,fontFamily:"Arial,sans-serif"}}/>
              </div>
              <button onClick={()=>{onEditCamp(camp.id,editData);setITab("tarefas");}} style={{padding:"10px 20px",background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12,alignSelf:"flex-start"}}>
                Salvar alterações ✓
              </button>
            </div>
          )}

          {/* -- PAINEL CLIENTE -- */}
          {iTab==="cliente"&&(
            <div>
              {/* Admin override control */}
              <div style={{background:T.card,border:`1px solid ${T.purple}44`,borderLeft:`3px solid ${T.purple}`,borderRadius:10,padding:"14px 18px",marginBottom:16}}>
                <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12,color:T.purple,marginBottom:10}}>- Controle do Administrador</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:10}}>
                  <div>
                    <div style={{fontSize:9,color:T.muted,marginBottom:5,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Volume padrão (gráfica)</div>
                    <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",fontSize:12,color:T.soft,fontFamily:"Arial,sans-serif"}}>{camp.sacolas.toLocaleString()} embalagens</div>
                  </div>
                  <div>
                    <div style={{fontSize:9,color:T.purple,marginBottom:5,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Override - exibido ao cliente</div>
                    <input
                      type="number"
                      placeholder={`${camp.sacolas.toLocaleString()} (padrão)`}
                      value={camp.sacolasDistribuidas||""}
                      onChange={e=>onUpdateSacolas(camp.id,e.target.value?Number(e.target.value):null)}
                      style={{width:"100%",background:T.surface,border:`1px solid ${T.purple}66`,borderRadius:7,padding:"8px 12px",fontSize:12,color:T.text,fontFamily:"Arial,sans-serif",outline:"none"}}
                    />
                  </div>
                </div>
                <div style={{fontSize:10,color:T.muted,fontFamily:"Arial,sans-serif"}}>
                  {camp.sacolasDistribuidas
                    ? <span style={{color:T.purple}}>Override ativo: cliente verá <strong style={{color:T.text}}>{Number(camp.sacolasDistribuidas).toLocaleString()}</strong> embalagens</span>
                    : <span>Sem override - cliente verá o volume padrão: <strong style={{color:T.text}}>{camp.sacolas.toLocaleString()}</strong></span>
                  }
                </div>
              </div>

              {/* Link */}
              <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"14px 18px",marginBottom:16,display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Link do cliente</div>
                  <div style={{fontSize:11,color:T.soft,fontFamily:"Arial,sans-serif",wordBreak:"break-all"}}>
                    https://ecodely.com.br/cliente/{camp.id}/{camp.client.toLowerCase().replace(/\s/g,"-")}
                  </div>
                </div>
                <button className="btn" onClick={()=>onOpenClientPanel(camp)} style={{padding:"8px 16px",background:`linear-gradient(135deg,${T.purple},${T.purple}AA)`,color:"#fff",borderRadius:8,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:11,whiteSpace:"nowrap"}}>
                  - Visualizar painel
                </button>
                <button className="btn" onClick={()=>onGerarCheckin&&onGerarCheckin(camp)} style={{padding:"8px 16px",background:"linear-gradient(135deg,#1a3a1a,#3a7a1a)",color:"#A8E633",borderRadius:8,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:11,whiteSpace:"nowrap",border:"none"}}>
                  📍 Check-in PDF
                </button>
                <button className="btn" onClick={()=>onGerarPosVenda&&onGerarPosVenda(camp)} style={{padding:"8px 16px",background:"linear-gradient(135deg,#A8E633,#3a7a1a)",color:"#000",borderRadius:8,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:11,whiteSpace:"nowrap",border:"none"}}>
                  📋 Pós-venda PDF
                </button>
              </div>

              {/* Preview mini */}
              <div style={{border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden",opacity:0.85}}>
                <div style={{background:`linear-gradient(135deg,${T.accent}22,${T.purple}11)`,padding:"16px 20px",borderBottom:`1px solid ${T.border}`,display:"flex",gap:12,alignItems:"center"}}>
                  <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:16,color:T.accent}}>ECODELY</div>
                  <div style={{width:1,height:20,background:T.border}}/>
                  <div>
                    <div style={{fontSize:12,fontWeight:700}}>{camp.name}</div>
                    <div style={{fontSize:9,color:T.muted}}>{camp.startDate} - {camp.endDate}</div>
                  </div>
                </div>
                <div style={{padding:"14px 20px",background:T.bg}}>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:12}}>
                    {[
                      {l:"Embalagens",v:(camp.sacolasDistribuidas||camp.sacolas).toLocaleString(),c:T.accent},
                      {l:"Parceiros",v:camp.parceiros,c:T.purple},
                      {l:"Progresso",v:`${camp.progress}%`,c:camp.stage===5?T.accent:T.info},
                    ].map((k,i)=>(
                      <div key={i} style={{background:T.surface,borderRadius:8,padding:"10px 12px",textAlign:"center"}}>
                        <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:16,color:k.c}}>{k.v}</div>
                        <div style={{fontSize:9,color:T.muted}}>{k.l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginBottom:6}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <span style={{fontSize:10,color:T.soft}}>{STAGES_CAMP.find(s=>s.id===camp.stage)?.label}</span>
                      <span style={{fontSize:10,color:T.soft}}>{camp.progress}%</span>
                    </div>
                    <div style={{height:8,background:T.border,borderRadius:4}}>
                      <div style={{height:"100%",width:`${camp.progress}%`,background:`linear-gradient(90deg,${T.accent},${T.purple})`,borderRadius:4}}/>
                    </div>
                  </div>
                  <div style={{fontSize:9,color:T.muted,textAlign:"center",marginTop:8,fontFamily:"Arial,sans-serif"}}>Preview do painel - dados visíveis ao cliente</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// MAP COMPONENT - Leaflet with pins + 5km heat circles
// ------------------------------------------------------------------------------------------------------------------------------------------------------------

// MAP COMPONENT - Leaflet with pins + 5km circles
const CoverageMap=({partners,height=300})=>{
  const[mapId]=useState('map-'+Math.random().toString(36).slice(2));
  useEffect(()=>{
    let mapInstance=null;
    const validP=partners.filter(p=>p.endereco&&p.endereco.lat&&p.endereco.lng);
    if(validP.length===0)return;
    const init=()=>{
      const el=document.getElementById(mapId);
      if(!el||el._leaflet_id)return;
      const L=window.L;
      const center=[validP[0].endereco.lat,validP[0].endereco.lng];
      mapInstance=L.map(el,{zoomControl:true,scrollWheelZoom:false}).setView(center,13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'(c) OpenStreetMap',maxZoom:19}).addTo(mapInstance);
      validP.forEach(p=>{
        L.circle([p.endereco.lat,p.endereco.lng],{radius:5000,color:'#00C48C',fillColor:'#00C48C',fillOpacity:0.08,weight:1.5,opacity:0.4}).addTo(mapInstance);
        const icon=L.divIcon({html:'<div style="width:26px;height:26px;background:#00C48C;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px #0004;display:flex;align-items:center;justify-content:center;font-size:11px;">+</div>',className:'',iconSize:[26,26],iconAnchor:[13,13]});
        L.marker([p.endereco.lat,p.endereco.lng],{icon}).addTo(mapInstance).bindPopup('<b>'+p.name+'</b><br>'+p.endereco.rua+', '+p.endereco.numero+'<br>'+p.endereco.bairro);
      });
      if(validP.length>1){const b=L.latLngBounds(validP.map(p=>[p.endereco.lat,p.endereco.lng]));mapInstance.fitBounds(b,{padding:[40,40]});}
    };
    if(window.L){init();}else{
      const link=document.createElement('link');link.rel='stylesheet';link.href='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';document.head.appendChild(link);
      const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';s.onload=init;document.head.appendChild(s);
    }
    return()=>{if(mapInstance)try{mapInstance.remove();}catch(e){}};
  },[mapId]);
  return <div id={mapId} style={{height,width:'100%',borderRadius:10,overflow:'hidden',zIndex:1}}/>;
};

// IMPACTOS TAB
const ImpactosTab=({camp,allPartners,onUpdate})=>{
  const[uploadingKey,setUploadingKey]=useState(null);
  const[inflMet,setInflMet]=useState({visualizacoes:"",alcance:"",comentarios:""});
  const fileRef=useRef(null);
  const[uploadTarget,setUploadTarget]=useState(null); // {parceiroId, categoria}
  const imp=camp.impactos||{stories:[],influencer:[],impulsionado:[],galeria:[],evidencias:{},influencerMetricas:{}};
  const ev=imp.evidencias||{};
  const sacolas=camp.sacolasDistribuidas||camp.sacolas||0;
  const offline=Math.round(sacolas*3.3);
  const stTotal=imp.stories.reduce((a,s)=>a+Number(s.impressoes),0);
  const inTotal=(imp.influencerMetricas?.visualizacoes||imp.influencer?.reduce((a,i)=>a+Number(i.alcance),0)||0);
  const total=offline+stTotal+inTotal;
  const upd=(field,val)=>onUpdate(camp.id,{...imp,[field]:val});
  const updEv=(parceiroId,cat,arr)=>onUpdate(camp.id,{...imp,evidencias:{...ev,[parceiroId]:{...(ev[parceiroId]||{}), [cat]:arr}}});
  const iS={width:"100%",background:"#0C0E18",border:"1px solid #1A1E30",borderRadius:7,padding:"7px 11px",fontSize:11,color:"#E6E8F0",outline:"none"};

  const handleUpload=async(e)=>{
    const file=e.target.files?.[0];
    if(!file||!uploadTarget)return;
    const{parceiroId,categoria}=uploadTarget;
    setUploadingKey(`${parceiroId}_${categoria}`);
    const path=`campanhas/${camp.id}/evidencias/${parceiroId}_${categoria}_${Date.now()}_${file.name.replace(/\s/g,"_")}`;
    const{error}=await supabase.storage.from("ecodely-files").upload(path,file,{upsert:true});
    if(error){setUploadingKey(null);return;}
    const{data:{publicUrl}}=supabase.storage.from("ecodely-files").getPublicUrl(path);
    const arr=ev[parceiroId]?.[categoria]||[];
    updEv(parceiroId,categoria,[...arr,{url:publicUrl,at:new Date().toLocaleDateString("pt-BR"),legenda:file.name.replace(/\.[^.]+$/,"")}]);
    setUploadingKey(null);
    e.target.value="";
  };

  const triggerUpload=(parceiroId,categoria)=>{
    setUploadTarget({parceiroId,categoria});
    setTimeout(()=>fileRef.current?.click(),50);
  };

  const parceiros=(camp.parceirosIds||[]).map(id=>allPartners.find(p=>p.id===id)).filter(Boolean);
  const CATS=[{key:"checkin",label:"📍 Check-in",color:T.accent,hint:"Foto do parceiro com as embalagens no 1º dia"},
              {key:"stories",label:"📱 Print de Stories",color:"#E1306C",hint:"Print do stories postado pelo parceiro"},
              {key:"fotos",label:"📸 Fotos da Campanha",color:T.info,hint:"Fotos das embalagens em campo"}];

  return(
    <div>
      <input ref={fileRef} type="file" accept="image/*,video/*" style={{display:"none"}} onChange={handleUpload}/>

      {/* Totais */}
      <div style={{background:"linear-gradient(135deg,#00E5A015,#9B7FFF10)",border:"1px solid #00E5A040",borderRadius:12,padding:"18px 20px",marginBottom:16}}>
        <div style={{fontSize:9,color:T.accent,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>Total de impactos</div>
        <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:36,color:T.accent,marginBottom:8}}>{total.toLocaleString()}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
          {[{l:"Offline",v:offline,c:T.purple},{l:"Stories",v:stTotal,c:"#E1306C"},{l:"Influencer",v:inTotal,c:T.warn}].map((k,i)=>(
            <div key={i} style={{background:"#06070D",borderRadius:8,padding:"8px 10px",textAlign:"center"}}>
              <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:14,color:k.c}}>{k.v.toLocaleString()}</div>
              <div style={{fontSize:8,color:T.muted}}>{k.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stories dos parceiros */}
      <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:10,padding:"12px 16px",marginBottom:10}}>
        <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12,color:"#E1306C",marginBottom:10}}>Stories dos Parceiros</div>
        {imp.stories.map((s,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid "+T.border}}>
            <div style={{fontSize:11}}>{s.parceiro}</div>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <span style={{fontFamily:"Arial,sans-serif",fontSize:11,color:"#E1306C"}}>{Number(s.impressoes).toLocaleString()}</span>
              <button onClick={()=>upd("stories",imp.stories.filter((_,j)=>j!==i))} style={{background:"transparent",border:"none",color:T.danger,cursor:"pointer",fontSize:12}}>×</button>
            </div>
          </div>
        ))}
        <div style={{display:"flex",gap:6,marginTop:8}}>
          <select id="st-parc" style={{...iS,flex:1}}>
            <option value="">Parceiro</option>
            {parceiros.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
          <input id="st-imp" type="number" placeholder="Impressões" style={{...iS,width:110}}/>
          <button onClick={()=>{const parc=document.getElementById("st-parc").value,imp2=document.getElementById("st-imp").value;if(!parc||!imp2)return;upd("stories",[...imp.stories,{id:Date.now(),parceiro:parc,impressoes:Number(imp2),at:new Date().toLocaleDateString("pt-BR")}]);document.getElementById("st-imp").value="";}} style={{padding:"7px 14px",background:T.accentDim,border:`1px solid ${T.accentBorder}`,color:T.accent,borderRadius:7,cursor:"pointer",fontSize:10,fontWeight:700,whiteSpace:"nowrap"}}>+ Adicionar</button>
        </div>
      </div>

      {/* Influenciador */}
      <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:10,padding:"12px 16px",marginBottom:10}}>
        <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12,color:T.warn,marginBottom:10}}>Influenciador</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:8}}>
          {[["visualizacoes","Visualizações"],["alcance","Alcance"],["comentarios","Comentários"]].map(([k,l])=>(
            <div key={k}>
              <div style={{fontSize:8,color:T.muted,marginBottom:3,textTransform:"uppercase",letterSpacing:1}}>{l}</div>
              <input type="number" value={imp.influencerMetricas?.[k]||""} onChange={e=>upd("influencerMetricas",{...(imp.influencerMetricas||{}),[k]:Number(e.target.value)})} placeholder="0" style={iS}/>
            </div>
          ))}
        </div>
      </div>

      {/* Galeria por parceiro */}
      <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,color:T.text,marginBottom:10,marginTop:8}}>Evidências por Parceiro</div>
      {parceiros.length===0&&<div style={{fontSize:10,color:T.muted,padding:"12px 0"}}>Nenhum parceiro vinculado à campanha.</div>}
      {parceiros.map(p=>(
        <div key={p.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"14px 16px",marginBottom:10}}>
          <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12,color:T.text,marginBottom:12}}>{p.name} <span style={{fontSize:9,color:T.muted,fontWeight:400}}>· {p.city}/{p.state}</span></div>
          {CATS.map(cat=>{
            const fotos=(ev[p.id]||{})[cat.key]||[];
            const uploading=uploadingKey===`${p.id}_${cat.key}`;
            return(
              <div key={cat.key} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div>
                    <div style={{fontSize:10,fontWeight:700,color:cat.color}}>{cat.label}</div>
                    <div style={{fontSize:8,color:T.muted}}>{cat.hint}</div>
                  </div>
                  <button onClick={()=>triggerUpload(p.id,cat.key)} style={{padding:"5px 12px",background:uploading?T.surface:T.card,border:`1px solid ${cat.color}55`,color:cat.color,borderRadius:6,cursor:"pointer",fontSize:9,fontWeight:700}}>
                    {uploading?"Enviando...":"+ Upload"}
                  </button>
                </div>
                {fotos.length>0&&(
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {fotos.map((f,fi)=>(
                      <div key={fi} style={{position:"relative",width:80,height:80}}>
                        <img src={f.url} style={{width:80,height:80,objectFit:"cover",borderRadius:7,border:`1px solid ${cat.color}44`}} alt={f.legenda}/>
                        <button onClick={()=>updEv(p.id,cat.key,fotos.filter((_,j)=>j!==fi))} style={{position:"absolute",top:2,right:2,background:"#000000CC",border:"none",color:"#fff",borderRadius:"50%",width:18,height:18,cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>×</button>
                        <div style={{fontSize:7,color:T.muted,textAlign:"center",marginTop:2}}>{f.at}</div>
                      </div>
                    ))}
                  </div>
                )}
                {fotos.length===0&&<div style={{fontSize:9,color:T.muted,fontStyle:"italic"}}>Nenhuma foto ainda</div>}
              </div>
            );
          })}
        </div>
      ))}

      {/* Influenciador — galeria */}
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"14px 16px",marginBottom:10}}>
        <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12,color:T.warn,marginBottom:12}}>📢 Conteúdo de Influenciador</div>
        {(ev["influencer"]?.conteudo||[]).map((f,fi)=>(
          <div key={fi} style={{position:"relative",display:"inline-block",marginRight:8,marginBottom:8}}>
            <img src={f.url} style={{width:80,height:80,objectFit:"cover",borderRadius:7,border:`1px solid ${T.warn}44`}} alt={f.legenda}/>
            <button onClick={()=>{const arr=(ev["influencer"]?.conteudo||[]).filter((_,j)=>j!==fi);updEv("influencer","conteudo",arr);}} style={{position:"absolute",top:2,right:2,background:"#000000CC",border:"none",color:"#fff",borderRadius:"50%",width:18,height:18,cursor:"pointer",fontSize:11}}>×</button>
          </div>
        ))}
        <div>
          <button onClick={()=>triggerUpload("influencer","conteudo")} style={{padding:"6px 14px",background:T.card,border:`1px solid ${T.warn}55`,color:T.warn,borderRadius:6,cursor:"pointer",fontSize:9,fontWeight:700}}>
            {uploadingKey==="influencer_conteudo"?"Enviando...":"+ Upload Reels/Stories"}
          </button>
        </div>
      </div>
    </div>
  );
};

// CLIENT PANEL
const ClientPanel=({camp,allPartners,onClose,onPDF})=>{
  const sacolas=camp.sacolasDistribuidas||camp.sacolas||0;
  const imp=camp.impactos||{stories:[],influencer:[],impulsionado:[],galeria:[]};
  const offline=Math.round(sacolas*3.3);
  const stTotal=imp.stories.reduce((a,s)=>a+Number(s.impressoes),0);
  const inTotal=imp.influencer.reduce((a,i)=>a+Number(i.alcance),0);
  const imTotal=imp.impulsionado.reduce((a,i)=>a+Number(i.alcance),0);
  const total=offline+stTotal+inTotal+imTotal;
  const stage=STAGES_CAMP.find(s=>s.id===camp.stage)||STAGES_CAMP[0];
  const isFin=camp.stage===5;
  const campPartners=allPartners.filter(p=>camp.parceirosIds&&camp.parceirosIds.includes(p.id));
  const pieData=[{name:'Offline',value:offline,color:'#00C48C'},{name:'Stories',value:stTotal,color:'#E1306C'},{name:'Influencer',value:inTotal,color:'#F5A623'},{name:'Impulsionado',value:imTotal,color:'#3D9EFF'}].filter(d=>d.value>0);
  const barData=campPartners.map(p=>{const st=imp.stories.find(s=>s.parceiro===p.name);return{name:p.name.split(' ').slice(0,2).join(' '),entregas:p.deliveries,stories:st?Number(st.impressoes):0};});
  return(
    <div style={{position:'fixed',inset:0,zIndex:400,background:'#04060E',color:'#fff',fontFamily:"Arial,sans-serif",overflow:'auto'}}>
      <style>{'@import url(https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@400;500&display=swap);.leaflet-container{font-family:sans-serif;}.cp-card{background:linear-gradient(135deg,#0E1020,#0A0C18);border:1px solid #1E2240;border-radius:16px;}'}</style>
      <div style={{background:'#080A14',borderBottom:'1px solid #1A1E30',padding:'14px 28px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:10}}>
        <div style={{display:'flex',gap:14,alignItems:'center'}}>
          <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:20,color:'#00C48C',letterSpacing:-0.5}}>ECODELY</div>
          <div style={{width:1,height:18,background:'#1A1E30'}}/>
          <div style={{fontSize:11,color:'#556'}}>{camp.client} - Painel da Campanha</div>
        </div>
        <div style={{display:'flex',gap:10}}>
          {isFin&&<button onClick={onPDF} style={{padding:'8px 16px',background:'linear-gradient(135deg,#00C48C,#00A070)',color:'#000',borderRadius:8,fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:11,border:'none',cursor:'pointer'}}>PDF</button>}
          <button onClick={onClose} style={{padding:'8px 14px',background:'#0E1020',color:'#556',borderRadius:8,fontSize:11,border:'1px solid #1E2240',cursor:'pointer'}}>x Fechar</button>
        </div>
      </div>
      <div style={{maxWidth:1000,margin:'0 auto',padding:'32px 20px'}}>
        <div style={{position:'relative',borderRadius:24,overflow:'hidden',marginBottom:24,background:'linear-gradient(135deg,#001A10 0%,#000D24 50%,#0A0020 100%)',border:'1px solid #1E2240',padding:'40px 48px'}}>
          <div style={{position:'absolute',top:-60,left:-60,width:260,height:260,borderRadius:'50%',background:'#00C48C',opacity:0.06,filter:'blur(60px)',pointerEvents:'none'}}/>
          <div style={{position:'relative',zIndex:1}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:20,marginBottom:28}}>
              <div>
                <div style={{fontSize:9,color:'#00C48C',letterSpacing:3,textTransform:'uppercase',marginBottom:8}}>{camp.client} - {camp.project}</div>
                <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:28,color:'#fff',marginBottom:6,lineHeight:1.1}}>{camp.name}</div>
                <div style={{fontSize:12,color:'#778'}}>{camp.startDate} - {camp.endDate} - {camp.region}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'8px 16px',background:isFin?'#00C48C22':'#3D9EFF18',border:'1px solid '+(isFin?'#00C48C55':'#3D9EFF44'),borderRadius:10,marginBottom:12}}>
                  <span style={{fontSize:11,color:isFin?'#00C48C':'#3D9EFF',fontWeight:700}}>{isFin?'Finalizada':stage.label+' - Em andamento'}</span>
                </div>
                <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:42,color:'#00C48C',lineHeight:1}}>{total.toLocaleString()}</div>
                <div style={{fontSize:11,color:'#556',marginTop:4}}>impactos totais</div>
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center'}}>
              {STAGES_CAMP.map((s,i)=>(
                <div key={s.id} style={{display:'flex',flex:1,alignItems:'center'}}>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,flex:'none'}}>
                    <div style={{width:28,height:28,borderRadius:'50%',background:camp.stage>s.id?'#00C48C':camp.stage===s.id?'#3D9EFF22':'transparent',border:'2px solid '+(camp.stage>s.id?'#00C48C':camp.stage===s.id?'#3D9EFF':'#2A2E45'),display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:camp.stage>s.id?'#000':camp.stage===s.id?'#3D9EFF':'#444',fontWeight:800}}>{camp.stage>s.id?'v':s.id}</div>
                    <div style={{fontSize:8,color:camp.stage===s.id?'#3D9EFF':camp.stage>s.id?'#00C48C':'#445',whiteSpace:'nowrap'}}>{s.label}</div>
                  </div>
                  {i<STAGES_CAMP.length-1&&<div style={{flex:1,height:2,background:camp.stage>s.id?'#00C48C':'#1E2240',margin:'0 4px 16px'}}/>}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:24}}>
          {[{l:'Embalagens',v:sacolas.toLocaleString(),c:'#00C48C',sub:'distribuidas'},{l:'Parceiros',v:camp.parceiros,c:'#3D9EFF',sub:'ativos em campo'},{l:'Segmentos',v:camp.segments.length,c:'#9B7FFF',sub:'de delivery'},{l:'Progresso',v:camp.progress+'%',c:camp.progress===100?'#00C48C':'#F5A623',sub:'da campanha'}].map((k,i)=>(
            <div key={i} className="cp-card" style={{padding:'20px 18px',position:'relative',overflow:'hidden'}}>
              <div style={{fontSize:9,color:'#556',textTransform:'uppercase',letterSpacing:1.5,marginBottom:8}}>{k.l}</div>
              <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:26,color:k.c,marginBottom:3}}>{k.v}</div>
              <div style={{fontSize:9,color:'#445'}}>{k.sub}</div>
            </div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
          <div className="cp-card" style={{padding:'24px',boxShadow:'0 0 40px #00C48C18'}}>
            <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:14,color:'#fff',marginBottom:4}}>Distribuicao de Impactos</div>
            <div style={{fontSize:10,color:'#556',marginBottom:16}}>Total: {total.toLocaleString()}</div>
            {total>0?(
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} innerRadius={40} dataKey="value" paddingAngle={3}>
                    {pieData.map((e,i)=><Cell key={i} fill={e.color}/>)}
                  </Pie>
                  <Tooltip formatter={v=>v.toLocaleString()} contentStyle={{background:'#0E1020',border:'1px solid #1E2240',borderRadius:8,color:'#fff',fontSize:11}}/>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:10,color:'#889'}}/>
                </PieChart>
              </ResponsiveContainer>
            ):(
              <div style={{height:180,display:'flex',alignItems:'center',justifyContent:'center',color:'#334',fontSize:11}}>Dados serao exibidos aqui</div>
            )}
            <div style={{display:'flex',flexDirection:'column',gap:6,marginTop:8}}>
              {[{l:'Offline (sacolas)',v:offline,c:'#00C48C'},{l:'Stories',v:stTotal,c:'#E1306C'},{l:'Influencer',v:inTotal,c:'#F5A623'},{l:'Impulsionado',v:imTotal,c:'#3D9EFF'}].map((k,i)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{display:'flex',gap:7,alignItems:'center'}}><div style={{width:7,height:7,borderRadius:'50%',background:k.c}}/><span style={{fontSize:10,color:'#778'}}>{k.l}</span></div>
                  <span style={{fontSize:11,fontWeight:700,color:k.c,fontFamily:"Arial,sans-serif"}}>{k.v.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="cp-card" style={{padding:'24px'}}>
            <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:14,color:'#fff',marginBottom:4}}>Entregas por Parceiro</div>
            <div style={{fontSize:10,color:'#556',marginBottom:16}}>Volume mensal</div>
            {barData.length>0?(
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} margin={{top:0,right:0,left:-20,bottom:20}}>
                  <XAxis dataKey="name" tick={{fill:'#556',fontSize:9}} angle={-20} textAnchor="end"/>
                  <YAxis tick={{fill:'#445',fontSize:9}}/>
                  <Tooltip contentStyle={{background:'#0E1020',border:'1px solid #1E2240',borderRadius:8,color:'#fff',fontSize:11}}/>
                  <Bar dataKey="entregas" fill="#00C48C" radius={[4,4,0,0]} name="Entregas/mes"/>
                </BarChart>
              </ResponsiveContainer>
            ):(
              <div style={{height:220,display:'flex',alignItems:'center',justifyContent:'center',color:'#334',fontSize:11}}>Parceiros serao exibidos aqui</div>
            )}
          </div>
        </div>
        <div className="cp-card" style={{overflow:'hidden',marginBottom:20}}>
          <div style={{padding:'20px 24px',borderBottom:'1px solid #1E2240',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:14,color:'#fff'}}>Mapa de cobertura</div>
              <div style={{fontSize:10,color:'#556',marginTop:2}}>Raio de 5km por parceiro - {campPartners.filter(p=>p.endereco&&p.endereco.lat).length} pontos ativos</div>
            </div>
            <div style={{display:'flex',gap:14}}>
              <div style={{display:'flex',gap:6,alignItems:'center'}}><div style={{width:10,height:10,borderRadius:'50%',background:'#00C48C'}}/><span style={{fontSize:9,color:'#556'}}>Parceiro</span></div>
              <div style={{display:'flex',gap:6,alignItems:'center'}}><div style={{width:10,height:10,borderRadius:'50%',background:'#00C48C33',border:'1px solid #00C48C55'}}/><span style={{fontSize:9,color:'#556'}}>Cobertura 5km</span></div>
            </div>
          </div>
          {campPartners.filter(p=>p.endereco&&p.endereco.lat).length>0
            ?<CoverageMap partners={campPartners} height={340}/>
            :<div style={{height:200,display:'flex',alignItems:'center',justifyContent:'center',color:'#334',fontSize:11}}>Enderecos dos parceiros nao cadastrados</div>
          }
        </div>
        <div className="cp-card" style={{padding:'20px 24px',marginBottom:20}}>
          <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:14,color:'#fff',marginBottom:12}}>Segmentos alcancados</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {camp.segments.map((s,i)=>{
              const colors=['#00C48C','#3D9EFF','#9B7FFF','#F5A623','#E1306C','#F472B6'];
              const c=colors[i%colors.length];
              return <span key={s} style={{padding:'7px 16px',background:c+'22',borderRadius:20,fontSize:11,color:c,border:'1px solid '+c+'44',fontWeight:600}}>{s}</span>;
            })}
          </div>
        </div>
        {imp.galeria.length>0&&(
          <div className="cp-card" style={{padding:'20px 24px',marginBottom:20}}>
            <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:14,color:'#fff',marginBottom:14}}>Campanha em campo</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:10}}>
              {imp.galeria.map((g,i)=>(
                <GaleriaItem key={i} g={g}/>
              ))}
            </div>
          </div>
        )}
        <div style={{textAlign:'center',padding:'20px',color:'#334',fontSize:9,letterSpacing:1}}>ECODELY - MIDIA IN-HOME - DADOS ATUALIZADOS EM TEMPO REAL</div>
      </div>
    </div>
  );
};

// PDF REPORT
const PDFReport=({camp,onClose})=>{
  const sacolas=(camp.sacolasDistribuidas||camp.sacolas||0).toLocaleString();
  const imp=camp.impactos||{stories:[],influencer:[],impulsionado:[],galeria:[]};
  const offline=Math.round((camp.sacolasDistribuidas||camp.sacolas||0)*3.3);
  const stTotal=imp.stories.reduce((a,s)=>a+Number(s.impressoes),0);
  const inTotal=imp.influencer.reduce((a,i)=>a+Number(i.alcance),0);
  const imTotal=imp.impulsionado.reduce((a,i)=>a+Number(i.alcance),0);
  const total=offline+stTotal+inTotal+imTotal;
  return(
    <div style={{position:'fixed',inset:0,zIndex:500,background:'#888',overflow:'auto'}}>
      <style>{'@import url(https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@400;500&display=swap);@media print{.no-print{display:none!important}}'}</style>
      <div className="no-print" style={{background:'#333',padding:'12px 24px',display:'flex',gap:10,alignItems:'center',position:'sticky',top:0,zIndex:10}}>
        <div style={{flex:1,fontSize:12,color:'#fff'}}>Relatorio - {camp.name}</div>
        <button onClick={()=>window.print()} style={{padding:'8px 18px',background:'#00C48C',color:'#fff',borderRadius:8,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12,border:'none',cursor:'pointer'}}>Imprimir / Salvar PDF</button>
        <button onClick={onClose} style={{padding:'8px 14px',background:'#555',color:'#fff',borderRadius:8,fontSize:12,border:'none',cursor:'pointer'}}>x Fechar</button>
      </div>
      <div style={{width:794,minHeight:1123,background:'#fff',margin:'20px auto',borderRadius:8,overflow:'hidden',fontFamily:"Arial,sans-serif"}}>
        <div style={{background:'linear-gradient(135deg,#0A0F1E,#1A2040)',padding:'56px 56px 40px',color:'#fff'}}>
          <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:32,color:'#00C48C',letterSpacing:-1,marginBottom:4}}>ECODELY</div>
          <div style={{fontSize:10,color:'#667',letterSpacing:3,textTransform:'uppercase',marginBottom:48}}>Relatorio de Campanha</div>
          <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:26,color:'#fff',marginBottom:8,lineHeight:1.2}}>{camp.name}</div>
          <div style={{fontSize:13,color:'#889',marginBottom:32}}>{camp.client} - {camp.startDate} - {camp.endDate}</div>
        </div>
        <div style={{padding:'36px 56px 28px',borderBottom:'1px solid #EEF'}}>
          <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:15,color:'#1A1A2E',marginBottom:20}}>Resumo Executivo</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
            {[{l:'Embalagens distribuidas',v:sacolas,c:'#00C48C'},{l:'Parceiros ativos',v:camp.parceiros,c:'#3D9EFF'},{l:'Total de impactos',v:total.toLocaleString(),c:'#9B7FFF'},{l:'Impacto offline',v:offline.toLocaleString(),c:'#F5A623'},{l:'Regiao',v:camp.region,c:'#F472B6',small:true},{l:'Segmentos',v:camp.segments.join(', '),c:'#888',small:true}].map((k,i)=>(
              <div key={i} style={{background:'#F8FAFF',borderRadius:10,padding:'16px',border:'1px solid #E8EBF4'}}>
                <div style={{fontSize:9,color:'#999',textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>{k.l}</div>
                <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:k.small?13:20,color:k.c,lineHeight:1.3}}>{k.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{padding:'28px 56px',borderBottom:'1px solid #EEF'}}>
          <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:15,color:'#1A1A2E',marginBottom:16}}>Linha do Tempo</div>
          {camp.timeline.filter(e=>e.type==='stage').map((e,i)=>(
            <div key={i} style={{display:'flex',gap:16,alignItems:'flex-start',paddingBottom:14}}>
              <div style={{width:22,height:22,borderRadius:'50%',background:'#00C48C',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <div style={{width:6,height:6,borderRadius:'50%',background:'#fff'}}/>
              </div>
              <div>
                <div style={{fontSize:12,color:'#333'}}>{e.text}</div>
                <div style={{fontSize:9,color:'#999',marginTop:2}}>{e.at} - {e.user}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{padding:'28px 56px 48px'}}>
          <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:15,color:'#1A1A2E',marginBottom:14}}>Proximos Passos</div>
          <div style={{background:'linear-gradient(135deg,#00C48C11,#3D9EFF08)',border:'1px solid #00C48C33',borderRadius:10,padding:'16px 20px'}}>
            <div style={{fontSize:12,color:'#333',lineHeight:1.9}}>Relatorio de desempenho entregue ao cliente<br/>Agendar reuniao de resultado com {camp.client}<br/>Proposta para proxima campanha<br/>Renovacao dos contratos de exclusividade</div>
          </div>
          <div style={{marginTop:48,textAlign:'center',fontSize:9,color:'#CCC'}}>Ecodely - Midia In-Home - www.ecodely.com.br - Gerado em {new Date().toLocaleDateString('pt-BR')}</div>
        </div>
      </div>
    </div>
  );
};

const Toast=({notifs,onDismiss})=>{
  if(!notifs.length)return null;
  const n=notifs[0];
  return(
    <div style={{position:"fixed",bottom:24,right:24,zIndex:500,maxWidth:340,animation:"slideUp 0.3s ease"}} className="toast">
      <div style={{background:T.surface,border:`1px solid ${n.color}55`,borderLeft:`3px solid ${n.color}`,borderRadius:12,padding:"14px 16px",boxShadow:"0 8px 32px #00000060"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:n.color}}/>
            <span style={{fontSize:9,color:n.color,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>{n.title}</span>
          </div>
          <div onClick={onDismiss} style={{cursor:"pointer",color:T.muted,fontSize:14}}>×</div>
        </div>
        <div style={{fontSize:12,color:T.text,lineHeight:1.5}}>{n.msg}</div>
        <div style={{fontSize:9,color:T.muted,marginTop:6,fontFamily:"Arial,sans-serif"}}>{n.at}</div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// MAIN APP
// ------------------------------------------------------------------------------------------------------------------------------------------------------------
export default function App(){
  const[user,setUser]=useState(()=>{try{const s=localStorage.getItem("ecodely_user");return s?JSON.parse(s):null;}catch{return null;}});
  const[loginForm,setLoginForm]=useState({email:"",pass:""});
  const[loginErr,setLoginErr]=useState("");
  const[tab,setTab]=useState(()=>{try{const s=localStorage.getItem("ecodely_tab");return s||"dashboard";}catch{return"dashboard";}});
  const[camps,setCamps]=useState(CAMPS_INIT);
  const[selCamp,setSelCamp]=useState(null);
  const[campView,setCampView]=useState("kanban");
  const[showNewCamp,setShowNewCamp]=useState(false);
  const[newCampStep,setNewCampStep]=useState(1);
  const[newCamp,setNewCamp]=useState({
    name:"",client:"",agencia:"",numPI:"",project:"",responsavel:"",
    startDate:"",endDate:"",region:"",
    graficaFornecedor:"",material:"",graficaPrazo:"",
    logistica:"",logisticaFornecedor:"",logisticaPrazo:"",
    parceiros:"",sacolas:"",valorLiquido:"",
    briefing:"",segments:[]
  });
  const[calMonth,setCalMonth]=useState(4); // 0-indexed, 4=May
  const[calYear,setCalYear]=useState(2025);
  const[calHover,setCalHover]=useState(null);
  const[dashTab,setDashTab]=useState("geral");
  const[dashPeriod,setDashPeriod]=useState("mes");
  // Financial module state
  const[finTab,setFinTab]=useState(()=>localStorage.getItem("ecodely_finTab")||"visao");
  useEffect(()=>{localStorage.setItem("ecodely_finTab",finTab);},[finTab]);
  const[tema,setTema]=useState(()=>localStorage.getItem("ecodely_tema")||"escuro");
  useEffect(()=>{localStorage.setItem("ecodely_tab",tab);},[tab]);
  T=THEMES[tema]||THEMES.escuro;
  useEffect(()=>{localStorage.setItem("ecodely_tema",tema);document.body.style.background=T.bg;},[tema]);
  const[editLanc,setEditLanc]=useState(null);
  const[colWidths,setColWidths]=useState([90,340,120,120,110,110,130,36,180]);
  const[relTab,setRelTab]=useState("gerencial");
  const[relSelecionados,setRelSelecionados]=useState([]);
  const[relTitulo,setRelTitulo]=useState("Relatório Ecodely");
  const[relPeriodo,setRelPeriodo]=useState(new Date().toLocaleDateString("pt-BR",{month:"long",year:"numeric"}));
  const[relDateStart,setRelDateStart]=useState("");
  const[relDateEnd,setRelDateEnd]=useState("");
  // Planejamento de Mídia
  const[planejamentos,setPlanejamentos]=useState([]);
  const[showPlanWizard,setShowPlanWizard]=useState(false);
  const[planStep,setPlanStep]=useState(1);
  const[planAtivo,setPlanAtivo]=useState(EMPTY_PLAN);
  const[planAnalise,setPlanAnalise]=useState(null);
  const[planLoading,setPlanLoading]=useState(false);
  const[planGeoLoading,setPlanGeoLoading]=useState(false);
  const[lancamentos,setLancamentos]=useState(LANCAMENTOS_INIT);
  const[custosFix,setCustosFix]=useState(CUSTOS_FIXOS_INIT);
  const[cartoes,setCartoes]=useState(CARTOES_INIT);
  const[comprasCartao,setComprasCartao]=useState(COMPRAS_CARTAO_INIT);
  const[contas,setContas]=useState(CONTAS_INIT);
  const[fatMensais,setFatMensais]=useState(FAT_MENSAIS_INIT);
  const[centrosCusto,setCentrosCusto]=useState(CENTROS_CUSTO_INIT);
  const[suppliers,setSuppliers]=useState(SUPPLIERS);
  const[reservaCaixaPct,setReservaCaixaPct]=useState(10);
  const[socios,setSocios]=useState([{id:1,nome:"Rodrigo Bem",pct:50},{id:2,nome:"Pedro",pct:50}]);
  const[dasAjuste,setDasAjuste]=useState(null); // manual override
  const[finMesRef,setFinMesRef]=useState(()=>{const s=localStorage.getItem("ecodely_finMes");return s||`${String(new Date().getMonth()+1).padStart(2,"0")}/${new Date().getFullYear()}`;});
  useEffect(()=>{localStorage.setItem("ecodely_finMes",finMesRef);},[finMesRef]);
  const[clientPanelCamp,setClientPanelCamp]=useState(null);
  const[pdfCamp,setPdfCamp]=useState(null);
  // Notification center
  const[inboxOpen,setInboxOpen]=useState(false);
  const[inbox,setInbox]=useState([]);
  const[prospects,setProspects]=useState(PROSPECTS_INIT);
  const[pipeView,setPipeView]=useState("kanban");
  const[commTab,setCommTab]=useState(()=>localStorage.getItem("ecodely_commTab")||"pipeline");
  useEffect(()=>{localStorage.setItem("ecodely_commTab",commTab);},[commTab]);
  const[projects,setProjects]=useState(PROJECTS_INIT);
  const[ptypes,setPtypes]=useState(PTYPES_INIT);
  const[commTable,setCommTable]=useState(COMM_TABLE_INIT);
  const[closings,setClosings]=useState(CLOSINGS_INIT);
  const[commAdminTab,setCommAdminTab]=useState("visao");
  const[newClosing,setNewClosing]=useState({partner:"",typeId:"",projectId:""});
  const[showNewClosing,setShowNewClosing]=useState(false);
  const[newProject,setNewProject]=useState("");
  const[newPtype,setNewPtype]=useState("");
  const[newComm,setNewComm]=useState({typeId:"",projectId:"",value:""});
  const[users,setUsers]=useState(USERS_DB);
  const[showNewUser,setShowNewUser]=useState(false);
  const[newUser,setNewUser]=useState({name:"",email:"",pass:"",role:"base"});
  const[baseSearch,setBaseSearch]=useState("");
  const[baseFilter,setBaseFilter]=useState("todos");
  const[baseScoreMin,setBaseScoreMin]=useState(0);
  const[baseContratoFilter,setBaseContratoFilter]=useState("todos");
  const[basePartners,setBasePartners]=useState(BASE_PARTNERS_INIT);
  const[baseTab,setBaseTab]=useState("parceiros"); // parceiros | contratos | score
  const[selPartner,setSelPartner]=useState(null);
  const[contratoTableFilter,setContratoTableFilter]=useState("todos");
  const[cadTab,setCadTab]=useState("clientes");
  const[filterSeg,setFilterSeg]=useState("todos");
  const[filterFrom,setFilterFrom]=useState("2024-11");
  const[nf,setNf]=useState({name:"",type:"grafica",contact:"",phone:"",email:"",leadTime:"7 dias",rating:4});
  const[showNewCliente,setShowNewCliente]=useState(false);
  const[novoCliente,setNovoCliente]=useState({name:"",contact:"",email:"",phone:"",segment:"",agency:""});
  const[filterTo,setFilterTo]=useState("2025-06");
  const[showNewProsp,setShowNewProsp]=useState(false);
  const[newProsp,setNewProsp]=useState({name:"",contact:"",email:"",segment:"Beleza",value:"",stage:"lead",owner:"Ana Lima",notes:""});
  const[selProsp,setSelProsp]=useState(null);
  const[queueFilter,setQueueFilter]=useState("todos"); // todos | pendentes | concluidas
  const[notifs,setNotifs]=useState([]);
  const[dragCampId,setDragCampId]=useState(null);
  const[dragOverCampStage,setDragOverCampStage]=useState(null);
  const[dragProspId,setDragProspId]=useState(null);
  const[dragOverPipeStage,setDragOverPipeStage]=useState(null);
  // Touch drag
  const[touchDrag,setTouchDrag]=useState(null); // {type:'camp'|'prosp', id}
  const[ghostPos,setGhostPos]=useState(null);   // {x,y}
  const[touchOverStage,setTouchOverStage]=useState(null);
  // --- FINANCEIRO STATES (movidos do IIFE para nivel do componente) --------
  const[showAdd,setShowAdd]=useState(false);
  const todayISO=new Date().toISOString().slice(0,10);
  const[novoLanc,setNovoLanc]=useState({data:todayISO,descricao:"",entrada:0,saida:0,tipo:"Despesa",categoria:"Outros",centrosCusto:"Administrativo",forma:"PIX",projeto:"",contaBancoId:1,parcelas:1});
  const[showAddCartao,setShowAddCartao]=useState(false);
  const[showAddCompra,setShowAddCompra]=useState(false);
  const[novoCartao,setNovoCartao]=useState({nome:"",titular:"",vencimento:15,limite:0,banco:"",cor:"#3D9EFF"});
  const[novaCompra,setNovaCompra]=useState({cartaoId:1,projeto:"",descricao:"",valorTotal:0,parcelas:2,parcelaAtual:1,mesInicio:"04/2026"});
  const[nfValor,setNfValor]=useState("");
  const[dasManual,setDasManual]=useState("");
  const[showAddFixo,setShowAddFixo]=useState(false);
  const[showAddConta,setShowAddConta]=useState(false);
  const[showAddCentro,setShowAddCentro]=useState(false);
  const[novoCusto,setNovoCusto]=useState({descricao:"",valor:0,dia:5,categoria:"Outros",centrosCusto:"Administrativo",ativo:true});
  const[novaConta,setNovaConta]=useState({banco:"",tipo:"Conta Corrente",agencia:"",conta:"",saldo:0,cor:"#00E5A0"});
  const[novoCentro,setNovoCentro]=useState("");

  // --- SUPABASE LOAD -------------------------------------------------------
  useEffect(()=>{
    const load=async()=>{
      const [lanc,conts,carts,compras,custos,fats,camps,prosps,parts,cls,commt,projs,pts,usrs,centros,forn,cfgs]=await Promise.all([
        supabase.from("lancamentos").select("*").order("id").range(0,999),
        supabase.from("contas").select("*").order("id"),
        supabase.from("cartoes").select("*").order("id"),
        supabase.from("compras_cartao").select("*").order("id"),
        supabase.from("custos_fixos").select("*").order("id"),
        supabase.from("fat_mensais").select("*").order("id"),
        supabase.from("campanhas").select("*").order("id"),
        supabase.from("prospects").select("*").order("id"),
        supabase.from("parceiros").select("*").order("id"),
        supabase.from("closings").select("*").order("id"),
        supabase.from("comm_table").select("*").order("id"),
        supabase.from("projects").select("*").order("id"),
        supabase.from("ptypes").select("*").order("id"),
        supabase.from("usuarios").select("*").order("id"),
        supabase.from("centros_custo").select("*").order("id"),
        supabase.from("fornecedores").select("*").order("id"),
        supabase.from("configuracoes").select("*"),
      ]);
      // Paginação: Supabase limita 1000 rows por request
      const normData=d=>{try{if(!d)return"";const s=String(d);if(s.includes("/"))return s;const p=s.split("T")[0].split("-");return p.length===3?`${p[2]}/${p[1]}/${p[0]}`:s;}catch(e){return"";}};
      let allLanc=lanc.data||[];
      if(allLanc.length>=1000){
        let pg=1;
        while(true){
          const{data:bt}=await supabase.from("lancamentos").select("*").order("id").range(pg*1000,(pg+1)*1000-1);
          if(!bt?.length)break;
          allLanc=[...allLanc,...bt];
          if(bt.length<1000)break;
          pg++;
        }
      }
      if(allLanc.length)setLancamentos(allLanc.map(r=>({...r,data:normData(r.data),centrosCusto:r.centrosCusto||"",contaBancoId:r.contaBancoId||1})));
      if(conts.data?.length)setContas(conts.data);
      if(carts.data?.length)setCartoes(carts.data);
      if(compras.data?.length)setComprasCartao(compras.data.map(r=>({...r,cartaoId:r.cartaoId,valorTotal:r.valorTotal,parcelaAtual:r.parcelaAtual,valorParcela:r.valorParcela,mesInicio:r.mesInicio})));
      if(custos.data?.length)setCustosFix(custos.data.map(r=>({...r,centrosCusto:r.centrosCusto})));
      if(fats.data?.length)setFatMensais(fats.data);
      if(camps.data?.length)setCamps(camps.data.map(r=>r.data));
      if(prosps.data?.length)setProspects(prosps.data.map(r=>({...r,segment:r.email||r.segment||"",value:Number(r.value)||0})));
      if(parts.data?.length)setBasePartners(parts.data.map(r=>r.data));
      if(cls.data?.length)setClosings(cls.data);
      if(commt.data?.length)setCommTable(commt.data);
      if(projs.data?.length)setProjects(projs.data);
      if(pts.data?.length)setPtypes(pts.data);
      if(usrs.data?.length)setUsers(usrs.data);
      if(centros.data?.length)setCentrosCusto(centros.data.map(r=>r.nome));
      if(forn.data?.length)setSuppliers(forn.data);
      if(cfgs.data?.length){
        const cfg=Object.fromEntries(cfgs.data.map(r=>[r.chave,r.valor]));
        if(cfg.reservaCaixaPct!=null)setReservaCaixaPct(Number(cfg.reservaCaixaPct));
        if(cfg.socios!=null&&Array.isArray(cfg.socios))setSocios(cfg.socios);
        if(cfg.dasAjuste!=null&&cfg.dasAjuste!=="null")setDasAjuste(Number(cfg.dasAjuste));
      }
      // Planejamentos
      const plans=await supabase.from("planejamentos").select("*").order("id");
      if(plans.data?.length)setPlanejamentos(plans.data.map(r=>r.data));
    };
    load();
  },[]);

  // Gera notificações automáticas sempre que os dados principais carregam
  useEffect(()=>{
    if(!user||!camps.length&&!prospects.length&&!closings.length&&!basePartners.length)return;
    const hoje=new Date();
    const geradas=[];
    const parse=s=>{if(!s)return null;const d=s.includes("-")?new Date(s):new Date(s.split("/").reverse().join("-"));return isNaN(d)?null:d;};
    const diasAte=s=>{const d=parse(s);return d?Math.ceil((d-hoje)/86400000):null;};
    const now=()=>hoje.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"})+" "+hoje.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});

    // Prazos de gráfica e logística
    if(["admin","operacional"].includes(user.role)){
      camps.filter(c=>c.stage<5).forEach(c=>{
        if(c.graficaPrazo){const d=diasAte(c.graficaPrazo);if(d!==null&&d<=7){geradas.push({id:Date.now()+Math.random(),type:"prazo",title:d<=0?"Prazo de gráfica VENCIDO":`Gráfica vence em ${d}d`,msg:`${c.name} · ${c.graficaFornecedor||"Gráfica não definida"}`,tab:"campanhas",at:now(),read:false,color:d<=0?T.danger:d<=3?T.warn:T.info});}}
        if(c.logisticaPrazo){const d=diasAte(c.logisticaPrazo);if(d!==null&&d<=7){geradas.push({id:Date.now()+Math.random(),type:"prazo",title:d<=0?"Prazo de logística VENCIDO":`Logística vence em ${d}d`,msg:`${c.name} · ${c.logistica||"Logística não definida"}`,tab:"campanhas",at:now(),read:false,color:d<=0?T.danger:d<=3?T.warn:T.purple});}}
        if(!c.graficaFornecedor&&c.stage>=1){geradas.push({id:Date.now()+Math.random(),type:"operacional",title:"Operacional pendente",msg:`${c.name} ainda não tem gráfica ou logística definida`,tab:"campanhas",at:now(),read:false,color:T.warn});}
      });
    }

    // Comissões pendentes (admin e financeiro)
    if(["admin","financeiro"].includes(user.role)){
      const pend=closings.filter(c=>c.status==="pendente");
      if(pend.length>0){geradas.push({id:Date.now()+Math.random(),type:"comissao",title:`${pend.length} comissão${pend.length>1?"ões":""} pendente${pend.length>1?"s":""}`,msg:`Aguardando aprovação: ${pend.map(c=>c.partner).slice(0,3).join(", ")}${pend.length>3?` +${pend.length-3}`:""}`,tab:"comissoes",at:now(),read:false,color:T.warn});}
    }

    // Contratos expirando (admin e base)
    if(["admin","base"].includes(user.role)){
      basePartners.filter(p=>p.contrato?.expiraEm).forEach(p=>{
        const d=diasAte(p.contrato.expiraEm);
        if(d!==null&&d<=30&&d>=0){geradas.push({id:Date.now()+Math.random(),type:"contrato",title:`Contrato expirando em ${d}d`,msg:`${p.name} · ${p.category}`,tab:"base",at:now(),read:false,color:d<=7?T.danger:T.warn});}
      });
    }

    // Metas comerciais (comercial vê a sua própria)
    if(["admin","comercial"].includes(user.role)){
      const myProspects=prospects.filter(p=>p.owner===user.name||user.role==="admin");
      const myPipe=myProspects.reduce((a,p)=>a+(p.value||0),0);
      const myMeta=user.meta||0;
      if(myMeta>0&&myPipe>=myMeta){geradas.push({id:Date.now()+Math.random(),type:"meta",title:"Meta batida! 🎉",msg:`Pipeline de ${myPipe.toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:0})} superou a meta de ${myMeta.toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:0})}`,tab:"comercial",at:now(),read:false,color:T.accent});}
    }

    if(geradas.length>0)setInbox(prev=>{
      // Evita duplicar: filtra tipos que não existem ainda
      const tipos=prev.filter(n=>n.auto).map(n=>n.type+n.title);
      const novas=geradas.filter(n=>!tipos.includes(n.type+n.title)).map(n=>({...n,auto:true}));
      return[...novas,...prev.filter(n=>!n.auto)];
    });
  },[user,camps,closings,basePartners,prospects]);

  // --- DERIVED -------------------------------------------------------------
  const sec=user?ROLE_TO_SEC[user.role]:null;
  // Build queue: all pending tasks for the logged user's sector
  const myQueue=camps.flatMap(c=>{
    const secTasks=sec?c.tasks[sec]||[]:Object.values(c.tasks).flat();
    return secTasks.map(t=>({...t,campId:c.id,campName:c.name,campStage:c.stage,project:c.project,client:c.client,sector:sec||"admin"}));
  });
  const pendingQueue=myQueue.filter(t=>!t.done);
  const doneQueue=myQueue.filter(t=>t.done);
  const visibleQueue=queueFilter==="pendentes"?pendingQueue:queueFilter==="concluidas"?doneQueue:myQueue;

  const myClosings=closings.filter(c=>c.userId===user?.id);
  const myApproved=myClosings.filter(c=>c.status==="aprovado");
  const myTotal=myApproved.reduce((a,c)=>a+c.value,0);
  const myPendingPay=myApproved.filter(c=>!c.pago).reduce((a,c)=>a+c.value,0);
  const myPago=myApproved.filter(c=>c.pago).reduce((a,c)=>a+c.value,0);
  const META_COMM=800;
  const allPendingComm=closings.filter(c=>c.status==="pendente");
  const totalFat=CLIENT_BILLING.reduce((a,c)=>a+c.faturado,0);
  const totalPend=CLIENT_BILLING.reduce((a,c)=>a+c.pendente,0);
  const pipeTotal=prospects.reduce((a,p)=>a+(p.value||0),0);
  const forecastTotal=prospects.reduce((a,p)=>{const s=PIPE_STAGES.find(x=>x.id===p.stage);return a+(p.value||0)*(s?.prob||0)/100;},0);

  const nav=user?getNav(user.role,pendingQueue.length,0,user.extraRoles||[]):[];
  const TemaSelector=()=>(<div style={{display:"flex",gap:4,alignItems:"center"}}>
    {Object.entries(THEMES).map(([k,v])=>(
      <button key={k} onClick={()=>setTema(k)} title={v.name} style={{width:20,height:20,borderRadius:"50%",border:tema===k?"3px solid #fff":"2px solid transparent",cursor:"pointer",background:v.bg==="transparent"?v.surface:v.bg,outline:tema===k?"2px solid "+v.accent:"none",outlineOffset:1,transition:"all .2s"}}/>
    ))}
  </div>);

  // --- HANDLERS ------------------------------------------------------------
  const handleLogin=()=>{
    const u=users.find(u=>u.email===loginForm.email&&u.pass===loginForm.pass&&u.active!==false);
    if(u&&u.active){setUser(u);localStorage.setItem("ecodely_user",JSON.stringify(u));setTab("minha-fila");setLoginErr("");}
    else setLoginErr("E-mail ou senha incorretos.");
  };

  const pushNotif=(title,msg,color)=>{
    const n={id:Date.now(),title,msg,color,at:now()};
    setNotifs(p=>[n,...p.slice(0,2)]);
    setTimeout(()=>setNotifs(p=>p.filter(x=>x.id!==n.id)),5000);
  };

  const addNotif=async(type,title,msg,campanha,color,via,tab)=>{
    const entry={id:Date.now(),type,title,msg,campanha:campanha||null,at:now(),read:false,color,via:via||["sistema"],tab:tab||null};
    setInbox(p=>[entry,...p]);
    pushNotif(title,msg,color);
    if(user?.id){
      await supabase.from("notificacoes").insert({id:entry.id,user_id:user.id,tipo:type,titulo:title,mensagem:msg,link_tab:tab||null,lida:false});
    }
  };

  // -- DRAG HANDLERS - CAMPAIGNS --
  const onCampDragStart=(e,campId)=>{e.dataTransfer.effectAllowed="move";setDragCampId(campId);};
  const onCampDragOver=(e,stageId)=>{e.preventDefault();e.dataTransfer.dropEffect="move";setDragOverCampStage(stageId);};
  const onCampDrop=(e,stageId)=>{
    e.preventDefault();
    if(dragCampId===null||dragCampId===undefined)return;
    let updatedCamp=null;
    setCamps(prev=>prev.map(c=>{
      if(c.id!==dragCampId)return c;
      const prevStage=STAGES_CAMP.find(s=>s.id===c.stage);
      const newStage=STAGES_CAMP.find(s=>s.id===stageId);
      const entry={id:Date.now(),type:"stage",text:`Etapa movida: ${prevStage?.label} - ${newStage?.label}`,user:user?.name||"Sistema",avatar:user?.avatar||"?",at:now(),color:newStage?.color||T.accent};
      const newProgress=Math.round(((stageId-1)/4)*100);
      updatedCamp={...c,stage:stageId,progress:newProgress,timeline:[...c.timeline,entry]};
      return updatedCamp;
    }));
    if(updatedCamp)supabase.from("campanhas").upsert({id:updatedCamp.id,data:updatedCamp}).then(({error})=>{if(error)console.error("SUPABASE camp stage:",error);});
    addNotif("etapa","Campanha avancou","Movida para "+STAGES_CAMP.find(s=>s.id===stageId)?.label,STAGES_CAMP.find(s=>s.id===stageId)?.label,STAGES_CAMP.find(s=>s.id===stageId)?.color||T.accent,["sistema","whatsapp","email"]);
    setDragCampId(null);setDragOverCampStage(null);
  };
  const onCampDragEnd=()=>{setDragCampId(null);setDragOverCampStage(null);};

  // -- DRAG HANDLERS - PIPELINE --
  const onProspDragStart=(e,prospId)=>{e.dataTransfer.effectAllowed="move";setDragProspId(prospId);};
  const onProspDragOver=(e,stageId)=>{e.preventDefault();e.dataTransfer.dropEffect="move";setDragOverPipeStage(stageId);};
  const onProspDrop=(e,stageId)=>{
    e.preventDefault();
    if(dragProspId===null||dragProspId===undefined)return;
    const prevP=prospects.find(p=>p.id===dragProspId);
    setProspects(prev=>prev.map(p=>p.id===dragProspId?{...p,stage:stageId}:p));
    supabase.from("prospects").update({stage:stageId}).eq("id",dragProspId).then(({error})=>{if(error)console.error("SUPABASE prosp stage:",error);});
    if(selProsp?.id===dragProspId)setSelProsp(prev=>({...prev,stage:stageId}));
    pushNotif("Prospect movido",`${prevP?.name} - ${PIPE_STAGES.find(s=>s.id===stageId)?.label}`,PIPE_STAGES.find(s=>s.id===stageId)?.color||T.accent);
    setDragProspId(null);setDragOverPipeStage(null);
  };
  const onProspDragEnd=()=>{setDragProspId(null);setDragOverPipeStage(null);};

  // -- TOUCH DRAG (mobile) --
  const onTouchStart=(e,type,id)=>{
    const t=e.touches[0];
    setTouchDrag({type,id});
    setGhostPos({x:t.clientX,y:t.clientY});
  };
  const onTouchMove=(e,type)=>{
    if(!touchDrag)return;
    const t=e.touches[0];
    setGhostPos({x:t.clientX,y:t.clientY});
    // detect which column the finger is over
    const el=document.elementFromPoint(t.clientX,t.clientY);
    const col=el?.closest("[data-kanban-col]");
    setTouchOverStage(col?col.dataset.kanbanCol:null);
    // also update desktop drag-over for visual highlight
    if(type==="camp")setDragOverCampStage(col?Number(col.dataset.kanbanCol):null);
    if(type==="prosp")setDragOverPipeStage(col?col.dataset.kanbanCol:null);
  };
  const onTouchEnd=(e,type)=>{
    const stageTarget=touchOverStage;
    const campId=dragCampId;
    const prospId=dragProspId;
    setTouchDrag(null);setGhostPos(null);setTouchOverStage(null);
    setDragOverCampStage(null);setDragOverPipeStage(null);
    setDragCampId(null);setDragProspId(null);
    if(!stageTarget)return;
    if(type==="camp"&&campId){
      const stageId=Number(stageTarget);
      const prevStage=STAGES_CAMP.find(s=>s.id===camps.find(x=>x.id===campId)?.stage);
      const newStage=STAGES_CAMP.find(s=>s.id===stageId);
      if(prevStage?.id===stageId)return;
      let updatedCamp=null;
      setCamps(prev=>prev.map(c=>{
        if(c.id!==campId)return c;
        const entry={id:Date.now(),type:"stage",text:`Etapa movida: ${prevStage?.label} - ${newStage?.label}`,user:user?.name||"Sistema",avatar:user?.avatar||"?",at:now(),color:newStage?.color||T.accent};
        updatedCamp={...c,stage:stageId,progress:Math.round(((stageId-1)/4)*100),timeline:[...c.timeline,entry]};
        return updatedCamp;
      }));
      if(updatedCamp)supabase.from("campanhas").upsert({id:updatedCamp.id,data:updatedCamp}).then(({error})=>{if(error)console.error("SUPABASE touch camp:",error);});
      pushNotif("Campanha movida",`- ${newStage?.label}`,newStage?.color||T.accent);
    }
    if(type==="prosp"&&prospId){
      const stageId=stageTarget;
      const prevP=prospects.find(p=>p.id===prospId);
      if(prevP?.stage===stageId)return;
      setProspects(prev=>prev.map(p=>p.id===prospId?{...p,stage:stageId}:p));
      supabase.from("prospects").update({stage:stageId}).eq("id",prospId).then(({error})=>{if(error)console.error("SUPABASE touch prosp:",error);});
      pushNotif("Prospect movido",`${prevP?.name} - ${PIPE_STAGES.find(s=>s.id===stageId)?.label}`,PIPE_STAGES.find(s=>s.id===stageId)?.color||T.accent);
    }
  };

  const toggleTask=(campId,sec,taskId,byUser)=>{
    let taskLabel="";
    let wasDone=false;
    let updatedCamp=null;
    setCamps(prev=>prev.map(c=>{
      if(c.id!==campId)return c;
      const newTasks={...c.tasks,[sec]:c.tasks[sec].map(t=>{
        if(t.id!==taskId)return t;
        taskLabel=t.label;
        wasDone=t.done;
        const done=!t.done;
        return{...t,done,doneAt:done?now():undefined,doneBy:done?byUser?.name:undefined};
      })};
      const newTl=[...c.timeline,{id:Date.now(),type:"task",text:(newTasks[sec].find(t=>t.id===taskId)?.done?"Concluido":"Reaberto")+": "+taskLabel,user:byUser?.name||"Sistema",avatar:byUser?.avatar||"?",at:now(),color:SEC_COLOR[sec]||T.accent}];
      updatedCamp={...c,tasks:newTasks,timeline:newTl};
      return updatedCamp;
    }));
    if(updatedCamp)supabase.from("campanhas").upsert({id:updatedCamp.id,data:updatedCamp}).then(({error})=>{if(error)console.error("SUPABASE toggleTask:",error);});
    if(selCamp?.id===campId){
      setSelCamp(prev=>{
        const newTasks={...prev.tasks,[sec]:prev.tasks[sec].map(t=>t.id===taskId?{...t,done:!t.done,doneAt:!t.done?now():undefined,doneBy:!t.done?byUser?.name:undefined}:t)};
        const newTl=[...prev.timeline,{id:Date.now(),type:"task",text:(newTasks[sec].find(t=>t.id===taskId)?.done?"Concluido":"Reaberto")+": "+taskLabel,user:byUser?.name||"Sistema",avatar:byUser?.avatar||"?",at:now(),color:SEC_COLOR[sec]||T.accent}];
        return{...prev,tasks:newTasks,timeline:newTl};
      });
    }
    if(!wasDone) addNotif("tarefa","Tarefa concluída",`${byUser?.name||user?.name} concluiu: ${taskLabel}`,camps.find(c=>c.id===campId)?.name,SEC_COLOR[sec]||T.accent,["sistema"],"campanhas");
    else pushNotif("Tarefa reaberta",taskLabel,T.muted);
  };

  const addComment=(campId,text,byUser)=>{
    const entry={id:Date.now(),type:"comment",text,user:byUser.name,avatar:byUser.avatar,at:now(),color:T.soft};
    let updatedCamp=null;
    setCamps(prev=>prev.map(c=>{if(c.id!==campId)return c;updatedCamp={...c,timeline:[...c.timeline,entry]};return updatedCamp;}));
    if(updatedCamp)supabase.from("campanhas").upsert({id:updatedCamp.id,data:updatedCamp}).then(({error})=>{if(error)console.error("SUPABASE addComment:",error);});
    setSelCamp(prev=>prev&&prev.id===campId?{...prev,timeline:[...prev.timeline,entry]}:prev);
    pushNotif("Comentário adicionado",`${byUser.name}: "${text.slice(0,40)}..."`,T.soft);
  };

  const addFile=(campId,file)=>{
    const entry={id:Date.now(),type:"file",text:`Arquivo enviado: ${file.name}`,user:file.uploadedBy,avatar:user?.avatar||"?",at:file.at,color:FILE_COLOR[file.type]||T.soft};
    let updatedCamp=null;
    setCamps(prev=>prev.map(c=>{if(c.id!==campId)return c;updatedCamp={...c,files:[...c.files,file],timeline:[...c.timeline,entry]};return updatedCamp;}));
    if(updatedCamp)supabase.from("campanhas").upsert({id:updatedCamp.id,data:updatedCamp}).then(({error})=>{if(error)console.error("SUPABASE addFile:",error);});
    setSelCamp(prev=>prev&&prev.id===campId?{...prev,files:[...prev.files,file],timeline:[...prev.timeline,entry]}:prev);
    pushNotif("Arquivo enviado",file.name,T.accent);
  };

  const updateSacolas=(campId,val)=>{
    let updatedCamp=null;
    setCamps(prev=>prev.map(c=>{if(c.id!==campId)return c;updatedCamp={...c,sacolasDistribuidas:val};return updatedCamp;}));
    if(updatedCamp)supabase.from("campanhas").upsert({id:updatedCamp.id,data:updatedCamp}).then(({error})=>{if(error)console.error("SUPABASE updateSacolas:",error);});
    setSelCamp(prev=>prev&&prev.id===campId?{...prev,sacolasDistribuidas:val}:prev);
    if(clientPanelCamp?.id===campId)setClientPanelCamp(prev=>({...prev,sacolasDistribuidas:val}));
  };

  const updateImpactos=(campId,newImpactos)=>{
    let updatedCamp=null;
    setCamps(prev=>prev.map(c=>{if(c.id!==campId)return c;updatedCamp={...c,impactos:newImpactos};return updatedCamp;}));
    if(updatedCamp)supabase.from("campanhas").upsert({id:updatedCamp.id,data:updatedCamp}).then(({error})=>{if(error)console.error("SUPABASE updateImpactos:",error);});
    setSelCamp(prev=>prev&&prev.id===campId?{...prev,impactos:newImpactos}:prev);
    if(clientPanelCamp?.id===campId)setClientPanelCamp(prev=>({...prev,impactos:newImpactos}));
  };

  const addProsp=async()=>{
    if(!newProsp.name)return;
    const rec={...newProsp,id:Date.now(),value:Number(newProsp.value)||0};
    setProspects(p=>[...p,rec]);
    setNewProsp({name:"",contact:"",email:"",segment:"Beleza",value:"",stage:"lead",owner:"Ana Lima",notes:""});
    setShowNewProsp(false);
    const{error}=await supabase.from("prospects").insert({id:rec.id,name:rec.name,contact:rec.contact,email:rec.email,phone:rec.phone||"",notes:rec.notes,stage:rec.stage,value:rec.value,owner:rec.owner});
    if(error)console.error("SUPABASE addProsp:",error);
  };

  const submitClosing=async()=>{
    if(!newClosing.partner||!newClosing.typeId||!newClosing.projectId)return;
    const type=ptypes.find(t=>t.id===Number(newClosing.typeId));
    const proj=projects.find(p=>p.id===Number(newClosing.projectId));
    const comm=commTable.find(c=>c.typeId===Number(newClosing.typeId)&&c.projectId===Number(newClosing.projectId));
    const rec={id:Date.now(),user:user.name,userId:user.id,partner:newClosing.partner,type:type?.name||"",typeId:Number(newClosing.typeId),project:proj?.name||"",projectId:Number(newClosing.projectId),value:comm?.value||0,date:now().slice(0,5),status:"pendente",pago:false};
    setClosings(p=>[...p,rec]);
    setNewClosing({partner:"",typeId:"",projectId:""});setShowNewClosing(false);
    pushNotif("Fechamento registrado",`${newClosing.partner} · aguardando aprovação`,T.warn);
    await supabase.from("closings").insert(rec);
  };

  const enviarContrato=async(partnerId)=>{
    let upd=null;
    setBasePartners(prev=>prev.map(p=>{if(p.id!==partnerId)return p;upd={...p,contrato:{...p.contrato,status:"pendente",enviadoEm:new Date().toLocaleDateString("pt-BR")}};return upd;}));
    if(upd)await supabase.from("parceiros").upsert({id:upd.id,data:upd});
    addNotif("contrato","Contrato enviado","Aguardando assinatura do parceiro",null,T.warn,["sistema","email","whatsapp"]);
  };
  const assinarContrato=async(partnerId)=>{
    const expira=new Date();expira.setFullYear(expira.getFullYear()+1);
    const assinadoEm=new Date().toLocaleDateString("pt-BR");
    const expiraEm=expira.toLocaleDateString("pt-BR");
    let upd=null;
    setBasePartners(prev=>prev.map(p=>{if(p.id!==partnerId)return p;upd={...p,contrato:{status:"assinado",enviadoEm:p.contrato.enviadoEm,assinadoEm,expiraEm}};return{...upd,score:calcScore(upd)};}));
    if(upd)await supabase.from("parceiros").upsert({id:upd.id,data:{...upd,score:calcScore(upd)}});
    setSelPartner(prev=>prev?{...prev,contrato:{...prev.contrato,status:"assinado",assinadoEm,expiraEm}}:null);
    addNotif("contrato","Contrato assinado!",basePartners.find(p=>p.id===partnerId)?.name+" assinou o contrato de exclusividade",null,T.accent,["sistema","email"]);
  };
  const addProspectToBase=async(prosp)=>{
    const already=basePartners.find(p=>p.name===prosp.name);
    if(already){pushNotif("Já na base",`${prosp.name} já está cadastrado`,T.warn);return;}
    const newP={id:Date.now(),name:prosp.name,handle:`@${prosp.name.toLowerCase().replace(/\s/g,"_")}`,city:"-",state:"-",category:prosp.segment,deliveries:0,status:"prospectado",mesesNaBase:0,campanhas:0,engajamento:1,contrato:{status:"sem contrato",enviadoEm:null,assinadoEm:null,expiraEm:null},whatsapp:"",instagram_seguidores:0,foto_fachada:""};
    const withScore={...newP,score:calcScore(newP)};
    setBasePartners(prev=>[...prev,withScore]);
    setProspects(prev=>prev.map(p=>p.id===prosp.id?{...p,stage:"fechado"}:p));
    await supabase.from("parceiros").upsert({id:withScore.id,data:withScore});
    await supabase.from("prospects").update({stage:"fechado"}).eq("id",prosp.id);
    pushNotif("Adicionado à base!",prosp.name,T.accent);
  };

  // ── PLANEJAMENTO DE MÍDIA ─────────────────────────────────────────────────
  const geocodeEndereco=async(endereco)=>{
    try{
      const r=await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endereco+", Brasil")}&format=json&limit=1`,{headers:{"User-Agent":"Ecodely-Sistema/1.0 comercial@ecodely.com.br"}});
      const d=await r.json();
      if(d.length>0)return{lat:parseFloat(d[0].lat),lng:parseFloat(d[0].lon)};
      return null;
    }catch(e){return null;}
  };

  const gerarAnaliseIA=async(plano)=>{
    setPlanLoading(true);
    try{
      // 1. Busca dados reais do IBGE — usa reverse geocoding se tiver lat/lng
      let ibgeData=null;
      let cidade="", uf="";

      if(plano.clienteLat&&plano.clienteLng){
        // Reverse geocoding via Nominatim para pegar cidade exata
        try{
          const rgResp=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${plano.clienteLat}&lon=${plano.clienteLng}&format=json&accept-language=pt-BR`,{headers:{"User-Agent":"Ecodely-Sistema/1.0"}});
          const rgData=await rgResp.json();
          cidade=rgData.address?.city||rgData.address?.town||rgData.address?.municipality||rgData.address?.county||"";
          uf=rgData.address?.state_code||rgData.address?.["ISO3166-2-lvl4"]?.replace("BR-","")||"";
        }catch(e){console.warn("Reverse geocoding falhou:",e.message);}
      }

      // Fallback: extrai da string da região
      if(!cidade){
        const cidadeRaw=plano.regiao||plano.clienteEndereco||"";
        const partes=cidadeRaw.split(/[,\/\-–]/).map(s=>s.trim()).filter(Boolean);
        // Pega a parte que parece uma cidade (mais de 3 chars, não é sigla de UF)
        cidade=partes.find(p=>p.length>3&&!/^[A-Z]{2}$/.test(p))||partes[0]||"";
        const ufMatch=cidadeRaw.match(/\b([A-Z]{2})\b/);
        uf=ufMatch?ufMatch[1]:"";
      }

      if(cidade){
        try{
          const ir=await fetch("/api/ibge",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({cidade,uf})
          });
          if(ir.ok)ibgeData=await ir.json();
        }catch(e){console.warn("IBGE indisponível:",e.message);}
      }

      // 2. Busca dados reais de restaurantes via Google Maps
      let placesData=null;
      if(plano.clienteLat&&plano.clienteLng){
        try{
          const pr=await fetch("/api/places",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({lat:plano.clienteLat,lng:plano.clienteLng,radius:5000})
          });
          if(pr.ok)placesData=await pr.json();
        }catch(e){console.warn("Places API indisponível:",e.message);}
      }

      // 3. Monta contexto com dados reais para a IA
      const semRenda=!ibgeData?.rendaPerCapitaFormatada?"- ATENÇÃO: Renda per capita não disponível no IBGE. Estime a faixa de renda com base nos outros indicadores disponíveis e indique '(estimativa)'.":"";
      const semSuperior=!ibgeData?.pctSuperior?"- ATENÇÃO: % ensino superior não disponível no IBGE. Estime com base no perfil da região (porte da cidade, PIB, presença de universidades próximas) e indique '(estimativa)'.":"";
      const ibgeContext=ibgeData?`
DADOS OFICIAIS DO IBGE — ${ibgeData.municipio}/${ibgeData.uf}:
- População: ${ibgeData.populacaoFormatada||"não disponível"}
- Renda per capita: ${ibgeData.rendaPerCapitaFormatada||"não disponível"}
- % com ensino superior: ${ibgeData.pctSuperior||"não disponível"}
- Fonte: ${ibgeData.fonte}
${semRenda}
${semSuperior}
`:"(dados do IBGE não disponíveis)";
      const placesContext=placesData?`
DADOS REAIS DA REGIÃO (Google Maps API — raio 5km):
- Total de restaurantes: ${placesData.total}
- Avaliação média geral: ${placesData.avgRating}/5.0
- Total de avaliações na região: ${placesData.totalReviews?.toLocaleString('pt-BR')||"—"}
- Nível de preço médio: ${placesData.avgPriceLabel}
- Distribuição: ${placesData.distribuicao?.excelente||0} excelentes (4.5+), ${placesData.distribuicao?.bom||0} bons (4.0-4.5), ${placesData.distribuicao?.regular||0} regulares
- Culinárias presentes: ${(placesData.topCuisines||[]).map(c=>typeof c==='object'?`${c.label} (${c.count})`:`${c}`).join(', ')}
${placesData.topDetailed?.length?`
TOP ESTABELECIMENTOS (por relevância e avaliação):
${placesData.topDetailed.map((p,i)=>`${i+1}. ${p.name} — ${p.rating}★ (${p.totalReviews} avaliações)${p.topReviews?.length?` | Clientes dizem: "${p.topReviews[0]?.text?.slice(0,100)}..."`:''}`).join('\n')}
`:''}
`:"(dados do Google Maps não disponíveis — use estimativas baseadas no perfil da região)";


      const prompt=`Analise a região "${plano.regiao||plano.clienteEndereco||"Brasil"}" para campanha de mídia in-home (embalagens de delivery) para "${plano.clienteNome}" (${plano.clienteSegmento||"empresa"}). Público: ${plano.publicoAlvo||"geral"}, objetivo: ${plano.objetivo||"awareness"}.

${ibgeContext}
${placesContext}

Dados de mercado: 38,8% dos brasileiros usam delivery, ticket médio R$45-65, 4,9 pedidos/mês, iFood 92% market share.

REGRAS:
1. Nunca cite nomes de marcas ou restaurantes específicos — use categorias (ex: "hamburguerias artesanais")
2. Para rendaMedia: use dado do IBGE se disponível. Se não, estime com base no perfil da região
3. Para escolaridade: estime o % da população com ensino superior com base no porte da cidade e PIB
4. Não use dados de briefing do cliente para campos demográficos

Retorne SOMENTE JSON válido sem markdown:
{"populacao":"X","rendaMedia":"R$ X/mês","classesSociais":"X","usuariosDelivery":"X%","ticketMedioDelivery":"R$ X","pedidosMensais":"X pedidos/mês","appsLideres":[{"nome":"iFood","share":"XX%"},{"nome":"Rappi","share":"XX%"},{"nome":"Outros","share":"XX%"}],"culinariaDominante":"X","perfilConsumidor":"X","analise":"X","oportunidade":"X","potencialImpacto":"X","melhorEpoca":"X","callToAction":"X","roi":"X","escolaridade":"X% com ensino superior"}`;

      const r=await fetch("/api/analyze",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({messages:[{role:"user",content:prompt}]})
      });
      const d=await r.json();
      const txt=d.content?.find(b=>b.type==="text")?.text||"{}";
      let result;
      try{
        result=JSON.parse(txt.replace(/```json|```/g,"").trim());
      }catch(parseErr){
        // Tenta extrair JSON do texto mesmo que tenha conteúdo extra
        const match=txt.match(/\{[\s\S]*\}/);
        if(match){
          try{result=JSON.parse(match[0]);}
          catch{result={analise:txt.slice(0,500),populacao:"—",rendaMedia:"—",usuariosDelivery:"—",appsLideres:[],perfilConsumidor:"—",oportunidade:"—",potencialImpacto:"—"};}
        }else{
          result={analise:txt.slice(0,500),populacao:"—",rendaMedia:"—",usuariosDelivery:"—",appsLideres:[],perfilConsumidor:"—",oportunidade:"—",potencialImpacto:"—"};
        }
      }
      // Adiciona dados reais ao resultado
      if(ibgeData){
        result.populacao=ibgeData.populacaoFormatada||result.populacao;
        result.rendaMedia=ibgeData.rendaPerCapitaFormatada||result.rendaMedia;
        result.ibge={
          municipio:ibgeData.municipio,
          uf:ibgeData.uf,
          populacao:ibgeData.populacaoFormatada,
          rendaMedia:ibgeData.rendaPerCapitaFormatada||(result.rendaMedia||null),
          pctSuperior:ibgeData.pctSuperior||result.escolaridade||null,
          fonte:ibgeData.rendaPerCapitaFormatada?ibgeData.fonte:"IBGE (pop.) + est. IA",
        };
      }
      if(placesData){
        result.totalRestaurantes=placesData.total;
        result.avaliacaoMedia=placesData.avgRating;
        result.totalReviews=placesData.totalReviews;
        result.nivelPreco=placesData.avgPriceLabel;
        result.distribuicao=placesData.distribuicao;
        result.topDetalhado=placesData.topDetailed||[];
        result.topCulinarias=placesData.topCuisines||[];
        result.exemplosParceiros=placesData.sample;
      }
      setPlanAnalise(result);
      setPlanAtivo(p=>({...p,analise:result}));
    }catch(e){
      setPlanAnalise({analise:"Não foi possível gerar a análise. Verifique a conexão e tente novamente.",populacao:"—",rendaMedia:"—",usuariosDelivery:"—",appsLideres:[],perfilConsumidor:"—",oportunidade:"—",potencialImpacto:"—"});
    }finally{setPlanLoading(false);}
  };

  const salvarPlano=async(plano)=>{
    const rec={...plano,id:plano.id||Date.now(),updatedAt:new Date().toISOString()};
    setPlanejamentos(p=>{const exists=p.find(x=>x.id===rec.id);return exists?p.map(x=>x.id===rec.id?rec:x):[...p,rec];});
    await supabase.from("planejamentos").upsert({id:rec.id,data:rec});
    pushNotif("Plano salvo!",rec.clienteNome,T.accent);
    return rec;
  };

  const sugerirParceiros=async(plano,parceirosBase)=>{
    const ativos=parceirosBase.filter(p=>p.status==="ativo").slice(0,30); // max 30
    if(!ativos.length)return null;
    const ctrl=new AbortController();
    const timer=setTimeout(()=>ctrl.abort(),20000); // 20s timeout
    try{
      const r=await fetch("/api/analyze",{
        method:"POST",headers:{"Content-Type":"application/json"},
        signal:ctrl.signal,
        body:JSON.stringify({messages:[{role:"user",content:`Você é especialista em planejamento de mídia in-home no Brasil.

BRIEFING:
- Cliente: ${plano.clienteNome||"—"} | Segmento: ${plano.clienteSegmento||"—"}
- Público: ${plano.publicoAlvo||"—"} | Faixa etária: ${plano.faixaEtaria||"—"}
- Renda: ${plano.rendaEstimada||"—"} | Região: ${plano.regiao||"—"}
- Objetivo: ${plano.objetivo||"—"}
- Preferência de parceiro: ${plano.preferenciaParceiro||"sem preferência — identifique o perfil ideal"}

PARCEIROS DISPONÍVEIS (id|nome|categoria|cidade):
${ativos.map(p=>`${p.id}|${p.name}|${p.category||"—"}|${p.city||"—"}`).join("\n")}

Identifique os parceiros mais adequados para esta campanha com base no briefing.
Retorne SOMENTE JSON: {"recomendados":["id1","id2","id3"],"perfilIdeal":"perfil ideal em 1 frase","justificativa":"justificativa em 2 frases"}`}]})
      });
      clearTimeout(timer);
      const d=await r.json();
      const txt=d.content?.find(b=>b.type==="text")?.text||"{}";
      const match=txt.replace(/```json|```/g,"").trim().match(/\{[\s\S]*\}/);
      return match?JSON.parse(match[0]):null;
    }catch(e){
      clearTimeout(timer);
      return null;
    }
  };

  const gerarCheckinPDF=(camp,allPartners)=>{
    const w=window.open("","_blank");if(!w)return;
    const parceiros=(camp.parceirosIds||[]).map(id=>allPartners.find(p=>p.id===id)).filter(Boolean);
    const ev=camp.impactos?.evidencias||{};
    const numDoc=`CHK-${camp.id}-${new Date().getFullYear()}`;
    const dataHoje=new Date().toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric"});
    const horaHoje=new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});

    const parcRows=parceiros.map((p,i)=>{
      const checkins=ev[p.id]?.checkin||[];
      const endereco=p.endereco?`${p.endereco.rua||""}, ${p.endereco.numero||""} — ${p.endereco.bairro||""}, ${p.city}/${p.state}`:"Endereço não cadastrado";
      return`<div class="parc-block">
        <div class="parc-header">
          <div>
            <div class="parc-num">PARCEIRO ${String(i+1).padStart(2,"0")}</div>
            <div class="parc-name">${p.name}</div>
            <div class="parc-addr">📍 ${endereco}</div>
            ${p.category?`<div class="parc-cat">${p.category}</div>`:""}
          </div>
          ${p.foto_fachada?`<img src="${p.foto_fachada}" class="fachada-img" alt="Fachada"/>`:""}
        </div>
        <div class="checkin-grid">
          ${checkins.length>0
            ?checkins.map(f=>`<div class="checkin-item"><img src="${f.url}" alt="Check-in"/><div class="checkin-label">Check-in · ${f.at}</div></div>`).join("")
            :`<div class="no-foto">Foto de check-in pendente</div>`}
        </div>
        <div class="parc-footer">
          <span>Volume: <strong>${p.deliveries||"—"} embalagens</strong></span>
          <span>Data/Hora: <strong>${dataHoje} às ${horaHoje}</strong></span>
        </div>
      </div>`;
    }).join("");

    const html=`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
    <title>Check-in — ${camp.name}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#1a1a2e;background:#fff}
      @page{margin:15mm;size:A4}
      @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
      .header{background:linear-gradient(135deg,#050d1f,#0d1f3c);padding:32px 40px;color:#fff;display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px}
      .logo{font-size:24px;font-weight:900;color:#00E5A0;letter-spacing:-1px}
      .doc-title{font-size:11px;color:#00E5A066;letter-spacing:4px;text-transform:uppercase;margin-top:4px}
      .header-right{text-align:right}
      .doc-num{font-size:10px;color:#00E5A055;font-family:monospace}
      .doc-date{font-size:10px;color:#ffffff44;margin-top:4px}
      .campaign-box{background:#f8fafc;border:1px solid #e0e0e0;border-radius:10px;padding:20px 28px;margin:0 0 24px;display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
      .cb-lbl{font-size:8px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px}
      .cb-val{font-size:13px;font-weight:700;color:#0a1628}
      .section-title{font-size:10px;color:#00A36C;letter-spacing:3px;text-transform:uppercase;font-weight:700;margin-bottom:16px;padding-bottom:8px;border-bottom:2px solid #00E5A0}
      .parc-block{background:#fff;border:1px solid #e8ecf0;border-radius:10px;padding:20px;margin-bottom:18px;break-inside:avoid}
      .parc-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px}
      .parc-num{font-size:8px;color:#00A36C;letter-spacing:3px;text-transform:uppercase;font-weight:700;margin-bottom:4px}
      .parc-name{font-size:16px;font-weight:800;color:#0a1628;margin-bottom:4px}
      .parc-addr{font-size:10px;color:#666;margin-bottom:4px}
      .parc-cat{display:inline-block;background:#e8f8f2;color:#00A36C;font-size:8px;font-weight:700;border-radius:20px;padding:2px 10px;text-transform:uppercase;letter-spacing:1px}
      .fachada-img{width:100px;height:70px;object-fit:cover;border-radius:8px;border:1px solid #e0e0e0;flex-shrink:0}
      .checkin-grid{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;min-height:80px;background:#f8fafc;border-radius:8px;padding:10px;align-items:center}
      .checkin-item{text-align:center}
      .checkin-item img{width:90px;height:90px;object-fit:cover;border-radius:7px;border:1px solid #e0e0e0}
      .checkin-label{font-size:8px;color:#888;margin-top:4px}
      .no-foto{font-size:10px;color:#bbb;font-style:italic;padding:8px}
      .parc-footer{display:flex;justify-content:space-between;font-size:10px;color:#888;padding-top:10px;border-top:1px solid #f0f0f0}
      .parc-footer strong{color:#0a1628}
      .sign-box{background:#f0faf6;border:1px solid #00E5A033;border-radius:10px;padding:20px 28px;margin-top:24px;display:flex;justify-content:space-between;align-items:center}
      .sign-line{border-top:1px solid #0a1628;width:200px;padding-top:8px;font-size:9px;color:#888;text-align:center}
      .footer{text-align:center;margin-top:24px;font-size:8px;color:#bbb;padding-top:12px;border-top:1px solid #f0f0f0}
    </style></head><body>
    <div class="header">
      <div><div class="logo">ECODELY</div><div class="doc-title">Documento de Check-in</div></div>
      <div class="header-right"><div class="doc-num">Nº ${numDoc}</div><div class="doc-date">${dataHoje} às ${horaHoje}</div></div>
    </div>
    <div style="padding:0 0 24px">
      <div class="campaign-box">
        <div><div class="cb-lbl">Campanha</div><div class="cb-val">${camp.name}</div></div>
        <div><div class="cb-lbl">Anunciante</div><div class="cb-val">${camp.client}</div></div>
        <div><div class="cb-lbl">Localidade</div><div class="cb-val">${camp.city||parceiros[0]?.city||"—"}</div></div>
        <div><div class="cb-lbl">Período</div><div class="cb-val">${camp.period||"—"}</div></div>
        <div><div class="cb-lbl">Parceiros</div><div class="cb-val">${parceiros.length}</div></div>
        <div><div class="cb-lbl">Status</div><div class="cb-val" style="color:#00A36C">✓ Campanha no ar</div></div>
      </div>
      <div class="section-title">Comprovação de início — parceiros participantes</div>
      ${parcRows}
      <div class="sign-box">
        <div class="sign-line">Responsável Ecodely</div>
        <div style="font-size:10px;color:#888;text-align:center">Documento gerado automaticamente<br>em ${dataHoje} às ${horaHoje}</div>
        <div class="sign-line">Gerente de Operações</div>
      </div>
    </div>
    <div class="footer">ECODELY MÍDIA IN-HOME · ecodely.com.br · Documento Nº ${numDoc} · Confidencial</div>
    <script>setTimeout(()=>window.print(),600);</script>
    </body></html>`;
    w.document.write(html);w.document.close();
  };

  const gerarPosVendaPDF=async(camp,allPartners)=>{
    const w=window.open("","_blank");if(!w)return;
    const parceiros=(camp.parceirosIds||[]).map(id=>allPartners.find(p=>p.id===id)).filter(Boolean);
    const ev=camp.impactos?.evidencias||{};
    const inflMet=camp.impactos?.influencerMetricas||{};
    const inflConteudo=ev["influencer"]?.conteudo||[];
    const sacolas=camp.sacolasDistribuidas||camp.sacolas||0;
    const impactosFisicos=Math.round(sacolas*3.3*3);
    const impactosDigitais=parceiros.reduce((a,p)=>a+Math.round(Number(((ev[p.id]?.fotos||[]).length>0?camp.sacolas/parceiros.length:0)*0.9)),0);
    const impactosInfluencer=Number(inflMet.visualizacoes||0);
    const impactosTotal=impactosFisicos+impactosDigitais+impactosInfluencer;
    const custoImpressao=impactosTotal>0?(camp.valor||0)/impactosTotal:0;
    const numDoc=`PV-${camp.id}-${new Date().getFullYear()}`;
    const dataHoje=new Date().toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric"});

    // Gera conclusão com IA
    let conclusaoIA="";
    try{
      const r=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({messages:[{role:"user",content:`Escreva uma conclusão estratégica profissional para um relatório de pós-venda de mídia in-home.
Campanha: ${camp.name} | Cliente: ${camp.client} | Parceiros: ${parceiros.map(p=>p.name).join(", ")}
Embalagens: ${sacolas} | Impactos totais: ${impactosTotal.toLocaleString()} | Custo/impressão: R$ ${custoImpressao.toFixed(2)}
Seja conciso, profissional e positivo. 3-4 frases. Não use markdown.`}]})});
      const d=await r.json();
      conclusaoIA=d.content?.find(b=>b.type==="text")?.text||"";
    }catch(e){}

    const parcRows=parceiros.map((p,i)=>{
      const checkins=ev[p.id]?.checkin||[];
      const fotos=ev[p.id]?.fotos||[];
      const stories=ev[p.id]?.stories||[];
      const allFotos=[...checkins,...fotos,...stories];
      const volParceiro=Math.round(sacolas/parceiros.length);
      const impactosParceiro=Math.round(volParceiro*0.9);
      const endereco=p.endereco?`${p.endereco.rua||""}, ${p.endereco.numero||""} — ${p.endereco.bairro||""}, ${p.city}/${p.state}`:"";
      return`<div class="parc-page">
        <div class="parc-header-row">
          <div>
            <div class="parc-badge">PARCEIRO ${String(i+1).padStart(2,"0")}</div>
            <div class="parc-h">${p.name}</div>
            <div class="parc-loc">📍 ${p.city}/${p.state}${endereco?` · ${endereco}`:""}</div>
          </div>
          ${p.foto_fachada?`<img src="${p.foto_fachada}" class="fachada" alt="Fachada"/>`:""}
        </div>
        <div class="parc-stats">
          <div class="ps-card"><div class="ps-lbl">Volume</div><div class="ps-val">${volParceiro.toLocaleString()} unidades</div></div>
          <div class="ps-card"><div class="ps-lbl">Impactos digitais</div><div class="ps-val g">${impactosParceiro.toLocaleString()} pessoas</div></div>
          ${p.handle?`<div class="ps-card"><div class="ps-lbl">Instagram</div><div class="ps-val">${p.handle}${p.instagram_seguidores?` · ${Number(p.instagram_seguidores).toLocaleString()} seg.`:""}</div></div>`:""}
        </div>
        ${allFotos.length>0?`<div class="foto-grid">${allFotos.slice(0,4).map(f=>`<div class="foto-item"><img src="${f.url}" alt="${f.legenda||"Foto"}"/><div class="foto-lbl">${f.legenda||f.at||""}</div></div>`).join("")}</div>`:""}
      </div>`;
    }).join("");

    const html=`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
    <title>Pós-venda — ${camp.name}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#1a1a2e;background:#fff}
      @page{margin:0;size:A4}
      @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
      .pb{page-break-before:always}
      .capa{height:100vh;min-height:260mm;background:linear-gradient(145deg,#0a1f0a,#1a3a1a);display:flex;flex-direction:column;justify-content:space-between;padding:52px;position:relative;overflow:hidden}
      .capa::before{content:"";position:absolute;top:-100px;right:-100px;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,#A8E63344 0%,transparent 65%)}
      .logo{font-size:28px;font-weight:900;color:#A8E633;letter-spacing:-1px}
      .slogan{font-size:9px;color:#A8E63366;letter-spacing:4px;text-transform:uppercase;margin-top:4px}
      .capa-mid{flex:1;display:flex;flex-direction:column;justify-content:center;z-index:1}
      .capa-tag{font-size:8px;color:#A8E633;letter-spacing:5px;text-transform:uppercase;margin-bottom:14px;border-left:2px solid #A8E633;padding-left:10px}
      .capa-h{font-size:44px;font-weight:900;color:#fff;line-height:1.05;letter-spacing:-2px;margin-bottom:16px}
      .capa-sub{font-size:13px;color:#A8E633;font-weight:600;margin-bottom:4px}
      .capa-meta{font-size:10px;color:#ffffff44}
      .capa-foot{display:flex;justify-content:space-between;align-items:flex-end;z-index:1;font-size:9px}
      .capa-contact{color:#ffffff33;line-height:1.8}
      .capa-num{color:#A8E63355;font-family:monospace;text-align:right;line-height:1.8}
      .sec{padding:36px 48px}
      .sec-lbl{font-size:8px;color:#3a7a1a;letter-spacing:5px;text-transform:uppercase;font-weight:700;margin-bottom:8px}
      .sec-h{font-size:24px;font-weight:800;color:#0a1f0a;margin-bottom:16px}
      .bar{height:3px;background:linear-gradient(90deg,#A8E633,#3a7a1a,transparent);border-radius:2px;margin-bottom:24px}
      .exec-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
      .ec{background:#0a1f0a;border-radius:10px;padding:16px;text-align:center}
      .ec-v{font-size:24px;font-weight:900;color:#A8E633}
      .ec-l{font-size:8px;color:#ffffff66;margin-top:4px;text-transform:uppercase;letter-spacing:1px}
      .resumo-box{background:#f0faf0;border:1px solid #A8E63333;border-radius:10px;padding:18px;margin-bottom:16px;font-size:11px;color:#1a3a1a;line-height:1.85}
      .parc-page{background:#fff;border:1px solid #e8ecf0;border-radius:10px;padding:20px;margin-bottom:20px;break-inside:avoid}
      .parc-header-row{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px}
      .parc-badge{font-size:8px;color:#3a7a1a;letter-spacing:3px;text-transform:uppercase;font-weight:700;margin-bottom:4px}
      .parc-h{font-size:18px;font-weight:800;color:#0a1f0a;margin-bottom:4px}
      .parc-loc{font-size:9px;color:#666}
      .fachada{width:90px;height:65px;object-fit:cover;border-radius:7px;border:1px solid #e0e0e0}
      .parc-stats{display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap}
      .ps-card{background:#f8faf8;border-radius:7px;padding:8px 12px;border-left:2px solid #A8E633;flex:1;min-width:100px}
      .ps-lbl{font-size:8px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px}
      .ps-val{font-size:11px;font-weight:700;color:#0a1f0a}
      .ps-val.g{color:#3a7a1a}
      .foto-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
      .foto-item img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:7px;border:1px solid #e0e0e0}
      .foto-lbl{font-size:8px;color:#888;text-align:center;margin-top:3px}
      .infl-section{background:#fff8f0;border:1px solid #F5A62333;border-radius:10px;padding:20px;margin-bottom:16px}
      .infl-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:12px}
      .infl-img-grid{display:flex;gap:8px;flex-wrap:wrap}
      .infl-img-grid img{width:80px;height:80px;object-fit:cover;border-radius:7px}
      .conclusao{background:#0a1f0a;border-radius:12px;padding:24px;color:#fff}
      .conclusao-lbl{font-size:8px;color:#A8E633;letter-spacing:3px;text-transform:uppercase;font-weight:700;margin-bottom:10px}
      .conclusao-txt{font-size:12px;color:#ffffff99;line-height:1.85}
      .foot-bar{background:#0a1f0a;padding:14px 48px;display:flex;justify-content:space-between;align-items:center}
      .foot-t{font-size:8px;color:#ffffff33}
    </style></head><body>

    <!-- CAPA -->
    <div class="capa">
      <div><div class="logo">ECODELY</div><div class="slogan">Relatório de Comprovação</div></div>
      <div class="capa-mid">
        <div class="capa-tag">Pós-Venda</div>
        <div class="capa-h">${camp.client}</div>
        <div class="capa-sub">${camp.name}${camp.period?` · ${camp.period}`:""}</div>
        <div class="capa-meta">${parceiros.length} parceiro(s) · ${sacolas.toLocaleString()} embalagens · ${impactosTotal.toLocaleString()} impactos totais</div>
      </div>
      <div class="capa-foot">
        <div class="capa-contact">Mídia In-Home · Embalagens de Delivery<br>ecodely.com.br · comercial@ecodely.com.br</div>
        <div class="capa-num">Nº ${numDoc}<br>${dataHoje}</div>
      </div>
    </div>

    <!-- SÍNTESE EXECUTIVA -->
    <div class="sec pb">
      <div class="sec-lbl">Síntese executiva</div>
      <div class="sec-h">Resultados da campanha</div>
      <div class="bar"></div>
      <div class="exec-grid">
        <div class="ec"><div class="ec-v">${sacolas.toLocaleString()}</div><div class="ec-l">Embalagens</div></div>
        <div class="ec"><div class="ec-v">${impactosTotal.toLocaleString()}</div><div class="ec-l">Impactos Totais</div></div>
        <div class="ec"><div class="ec-v">2h a 4h</div><div class="ec-l">OTS</div></div>
        <div class="ec"><div class="ec-v">R$ ${custoImpressao.toFixed(2).replace(".",",")}</div><div class="ec-l">Custo/Impressão</div></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
        <div style="background:#f8faf8;border-radius:10px;padding:14px;border-left:3px solid #A8E633">
          <div style="font-size:8px;color:#888;text-transform:uppercase;margin-bottom:4px">Domicílios Impactados</div>
          <div style="font-size:18px;font-weight:800;color:#0a1f0a">${sacolas.toLocaleString()}</div>
          <div style="font-size:9px;color:#888">Acesso direto ao lar</div>
        </div>
        <div style="background:#f8faf8;border-radius:10px;padding:14px;border-left:3px solid #3a7a1a">
          <div style="font-size:8px;color:#888;text-transform:uppercase;margin-bottom:4px">Impactos Totais</div>
          <div style="font-size:18px;font-weight:800;color:#0a1f0a">${impactosTotal.toLocaleString()}</div>
          <div style="font-size:9px;color:#888">Físico + Digital + Influencers</div>
        </div>
      </div>
      <div class="resumo-box"><strong>Resumo da Operação:</strong> A campanha ${camp.name} para ${camp.client}${camp.city?` em ${camp.city}`:""} executou a distribuição de ${sacolas.toLocaleString()} embalagens branded delivery através de ${parceiros.length} parceiro(s) estratégicos. Com ${impactosTotal.toLocaleString()} impactos totais e custo por impressão de R$ ${custoImpressao.toFixed(2).replace(".",",")}, a campanha garantiu presença direta no lar do consumidor no momento de maior receptividade.</div>
      <div style="font-size:9px;color:#666;background:#f8faf8;border-radius:8px;padding:12px"><strong>Memória de Cálculo:</strong> Impactos gerados pelas exposições físicas (${sacolas.toLocaleString()} casas × 3,3 hab/casa × 15 olhares médios) somadas ao alcance digital orgânico${inflMet.visualizacoes?` e ${Number(inflMet.visualizacoes).toLocaleString()} visualizações via influenciadores`:""}</div>
    </div>

    <!-- POR PARCEIRO -->
    <div class="sec pb">
      <div class="sec-lbl">Evidências por parceiro</div>
      <div class="sec-h">Comprovação em campo</div>
      <div class="bar"></div>
      ${parcRows}
    </div>

    <!-- INFLUENCIADOR -->
    ${inflConteudo.length>0||inflMet.visualizacoes?`
    <div class="sec pb">
      <div class="sec-lbl">Amplificação digital</div>
      <div class="sec-h">Estratégia de Influenciadores</div>
      <div class="bar"></div>
      <div class="infl-section">
        <div class="infl-stats">
          ${inflMet.visualizacoes?`<div style="background:#fff;border-radius:7px;padding:10px;text-align:center;border:1px solid #F5A62333"><div style="font-size:18px;font-weight:800;color:#c87000">${Number(inflMet.visualizacoes).toLocaleString()}</div><div style="font-size:8px;color:#888">Visualizações</div></div>`:""}
          ${inflMet.alcance?`<div style="background:#fff;border-radius:7px;padding:10px;text-align:center;border:1px solid #F5A62333"><div style="font-size:18px;font-weight:800;color:#c87000">${Number(inflMet.alcance).toLocaleString()}</div><div style="font-size:8px;color:#888">Alcance</div></div>`:""}
          ${inflMet.comentarios?`<div style="background:#fff;border-radius:7px;padding:10px;text-align:center;border:1px solid #F5A62333"><div style="font-size:18px;font-weight:800;color:#c87000">${Number(inflMet.comentarios).toLocaleString()}</div><div style="font-size:8px;color:#888">Comentários</div></div>`:""}
        </div>
        ${inflConteudo.length>0?`<div class="infl-img-grid">${inflConteudo.map(f=>`<img src="${f.url}" alt="Influencer"/>`).join("")}</div>`:""}
      </div>
    </div>`:""} 

    <!-- CONCLUSÃO -->
    <div class="sec">
      <div class="sec-lbl">Conclusão</div>
      <div class="sec-h">Análise estratégica final</div>
      <div class="bar"></div>
      <div class="conclusao">
        <div class="conclusao-lbl">Ecodely Mídia — Relatório Consolidado · ${dataHoje}</div>
        <div class="conclusao-txt">${conclusaoIA||`A campanha ${camp.name} comprovou a eficácia da presença direta no cotidiano do consumidor através da mídia in-home. Com custo por impressão de R$ ${custoImpressao.toFixed(2).replace(".",",")} e alta visibilidade nos parceiros participantes, a Ecodely entregou resultados mensuráveis e de alto impacto.`}</div>
      </div>
    </div>

    <div class="foot-bar">
      <div class="foot-t">ECODELY MÍDIA IN-HOME · ecodely.com.br · comercial@ecodely.com.br</div>
      <div class="foot-t">Nº ${numDoc} · Confidencial · ${new Date().getFullYear()}</div>
    </div>
    <script>setTimeout(()=>window.print(),800);</script>
    </body></html>`;
    w.document.write(html);w.document.close();
  };

  const gerarPropostaPDF=(plano,analise)=>{
    const w=window.open("","_blank");
    if(!w)return;
    const fmt=v=>Number(v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:2});
    const fmtN=v=>Number(v||0).toLocaleString("pt-BR");
    const parceiros=plano.parceiros||[];
    const outras=plano.outrasMidias||[];
    const totalEmb=parceiros.reduce((a,p)=>a+Number(p.embalagens||0),0);
    const totalVal=parceiros.reduce((a,p)=>a+Number(p.embalagens||0)*Number(p.tabela||6)*(1-Number(p.desconto||0)/100),0);
    const totalMidia=outras.reduce((a,m)=>a+Number(m.tabela||0)*(1-Number(m.desconto||0)/100),0);
    const total=totalVal+totalMidia;
    const impactos=Math.round(totalEmb*3.3);
    const numProposta=`ECO-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
    const custoImpacto=impactos>0?(total/impactos).toFixed(2):0;

    // Apps com market share
    const appsArr=Array.isArray(analise?.appsLideres)&&typeof analise.appsLideres[0]==="object"
      ?analise.appsLideres
      :(analise?.appsLideres||[]).map(a=>({nome:a,share:"—"}));

    const html=`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
    <title>Proposta — ${plano.clienteNome}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#1a1a2e;background:#fff}
      @page{margin:0;size:A4}
      @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
      .pb{page-break-before:always}
      .capa{height:100vh;min-height:260mm;background:linear-gradient(145deg,#050d1f 0%,#0d1f3c 60%,#050d1f 100%);display:flex;flex-direction:column;justify-content:space-between;padding:56px;position:relative;overflow:hidden}
      .capa::before{content:"";position:absolute;top:-120px;right:-120px;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,#00E5A033 0%,transparent 65%)}
      .capa::after{content:"";position:absolute;bottom:-100px;left:-100px;width:450px;height:450px;border-radius:50%;background:radial-gradient(circle,#3D9EFF1a 0%,transparent 65%)}
      .logo{font-size:30px;font-weight:900;color:#00E5A0;letter-spacing:-1px}
      .slogan{font-size:10px;color:#00E5A066;letter-spacing:4px;text-transform:uppercase;margin-top:5px}
      .capa-mid{flex:1;display:flex;flex-direction:column;justify-content:center;z-index:1;padding:40px 0}
      .capa-tag{font-size:9px;color:#00E5A0;letter-spacing:5px;text-transform:uppercase;margin-bottom:18px;border-left:2px solid #00E5A0;padding-left:12px}
      .capa-h{font-size:52px;font-weight:900;color:#fff;line-height:1.05;letter-spacing:-2px;margin-bottom:20px}
      .capa-seg{font-size:15px;color:#00E5A0;font-weight:600;margin-bottom:6px}
      .capa-reg{font-size:12px;color:#ffffff55}
      .capa-foot{display:flex;justify-content:space-between;align-items:flex-end;z-index:1}
      .capa-contact{font-size:9px;color:#ffffff33;line-height:1.8}
      .capa-num{font-size:9px;color:#00E5A055;font-family:monospace;text-align:right;line-height:1.8}
      .sec{padding:44px 52px}
      .sec-lbl{font-size:8px;color:#00A36C;letter-spacing:5px;text-transform:uppercase;margin-bottom:10px;font-weight:700}
      .sec-h{font-size:26px;font-weight:800;color:#0a1628;margin-bottom:20px;letter-spacing:-0.5px}
      .bar{height:3px;background:linear-gradient(90deg,#00E5A0,#3D9EFF,transparent);border-radius:2px;margin-bottom:28px}
      .g3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px}
      .g4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px}
      .g2{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px}
      .card{background:#f8fafc;border-radius:10px;padding:16px;border-left:3px solid #00E5A0}
      .card.blue{border-left-color:#3D9EFF}
      .card.purple{border-left-color:#9B7FFF}
      .card.warn{border-left-color:#F5A623}
      .card.pink{border-left-color:#F472B6}
      .card.dark{background:#0a1628;border-left-color:#00E5A0}
      .lbl{font-size:8px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px}
      .val{font-size:15px;font-weight:800;color:#0a1628}
      .val.sm{font-size:12px}
      .val.green{color:#00A36C}
      .val.blue{color:#3D9EFF}
      .val.purple{color:#9B7FFF}
      .val.white{color:#fff}
      .sub{font-size:8px;color:#aaa;margin-top:2px}
      .box{background:#f0faf6;border:1px solid #00E5A033;border-radius:10px;padding:20px;margin-bottom:16px}
      .box.warn{background:#fff8f0;border-color:#F5A62333}
      .box.blue{background:#f0f6ff;border-color:#3D9EFF33}
      .box.purple{background:#f5f0ff;border-color:#9B7FFF33}
      .box.dark{background:#050d1f;border-color:#00E5A033}
      .box-lbl{font-size:8px;color:#00A36C;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;font-weight:700}
      .box-txt{font-size:11px;color:#2a4a3a;line-height:1.85}
      .ibge-badge{display:inline-flex;align-items:center;gap:5px;background:#e8f8f2;border:1px solid #00E5A044;border-radius:20px;padding:4px 10px;font-size:8px;color:#00A36C;font-weight:700;margin-bottom:14px}
      .maps-badge{display:inline-flex;align-items:center;gap:5px;background:#e8f0ff;border:1px solid #3D9EFF44;border-radius:20px;padding:4px 10px;font-size:8px;color:#3D9EFF;font-weight:700;margin-bottom:14px;margin-left:8px}
      .app-row{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #f0f0f0}
      .app-bar-bg{flex:1;background:#f0f0f0;border-radius:4px;height:6px}
      .app-bar{background:#00E5A0;border-radius:4px;height:6px}
      .imp-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:20px 0}
      .imp-card{text-align:center;background:#050d1f;border-radius:10px;padding:16px 10px}
      .imp-num{font-size:20px;font-weight:900;color:#00E5A0}
      .imp-lbl{font-size:8px;color:#ffffff55;margin-top:4px;text-transform:uppercase;letter-spacing:1px}
      .fin-t{width:100%;border-collapse:collapse;margin-bottom:16px;font-size:11px}
      .fin-t th{background:#0a1628;color:#fff;padding:9px 12px;font-size:8px;text-transform:uppercase;letter-spacing:1px;font-weight:700}
      .fin-t td{padding:9px 12px;border-bottom:1px solid #f0f0f0}
      .fin-t tr:nth-child(even) td{background:#fafafa}
      .fin-total td{background:#00E5A0;color:#000;font-weight:800;padding:11px 12px;font-size:13px}
      .step{display:flex;gap:12px;padding:11px 0;border-bottom:1px solid #f5f5f5}
      .step-n{width:26px;height:26px;border-radius:50%;background:#00E5A0;color:#000;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;flex-shrink:0;margin-top:1px}
      .step-t{font-size:11px;color:#333;line-height:1.65}
      .foot-bar{background:#050d1f;padding:16px 52px;display:flex;justify-content:space-between;align-items:center}
      .foot-t{font-size:8px;color:#ffffff33}
      .section-title-box{background:linear-gradient(135deg,#00E5A011,#3D9EFF08);border-radius:10px;padding:12px 16px;margin-bottom:20px;border:1px solid #00E5A022}
      .pill{display:inline-block;background:#f0f0f0;border-radius:20px;padding:3px 10px;font-size:9px;color:#555;margin:2px}
      .pill.green{background:#e8f8f2;color:#00A36C}
      .roi-box{background:linear-gradient(135deg,#050d1f,#0d1f3c);border-radius:12px;padding:24px;margin-bottom:16px;border:1px solid #00E5A033}
      .roi-h{font-size:10px;color:#00E5A0;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px}
      .roi-txt{font-size:12px;color:#00E5A0;font-weight:600;line-height:1.7}
      .cta-box{background:linear-gradient(135deg,#F5A62311,#F5A62305);border:1px solid #F5A62333;border-radius:10px;padding:20px;margin-bottom:16px}
    </style></head><body>

    <!-- CAPA -->
    <div class="capa">
      <div><div class="logo">ECODELY</div><div class="slogan">Onde tem Delivery, tem Ecodely</div></div>
      <div class="capa-mid">
        <div class="capa-tag">Proposta Comercial de Mídia</div>
        <div class="capa-h">${plano.clienteNome||"Cliente"}</div>
        <div class="capa-seg">${plano.clienteSegmento||""} ${plano.regiao?`· ${plano.regiao}`:""}</div>
        <div class="capa-reg">Responsável: ${plano.createdBy||user?.name||"—"} · ${new Date().toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric"})}</div>
      </div>
      <div class="capa-foot">
        <div class="capa-contact">Mídia In-Home · Embalagens de Delivery<br>ecodely.com.br · comercial@ecodely.com.br</div>
        <div class="capa-num">Nº ${numProposta}<br>Válida por 15 dias<br>${plano.prazo?`Período: ${plano.prazo}`:""}</div>
      </div>
    </div>

    <!-- SOBRE A ECODELY -->
    <div class="sec pb">
      <div class="sec-lbl">Quem somos</div>
      <div class="sec-h">A mídia que vai até o seu cliente</div>
      <div class="bar"></div>
      <p style="font-size:12px;color:#444;line-height:1.9;margin-bottom:14px">A <strong>Ecodely</strong> é uma plataforma de mídia in-home que transforma embalagens de delivery em poderosos canais de comunicação. Conectamos marcas ao consumidor final no momento mais receptivo: a chegada do pedido em casa.</p>
      <p style="font-size:12px;color:#444;line-height:1.9;margin-bottom:24px">Nossa rede de restaurantes, dark kitchens e estabelecimentos parceiros garante distribuição inteligente, segmentada por região, perfil demográfico e comportamento de consumo. Cada embalagem é uma experiência — não um anúncio.</p>
      <div class="g3">
        <div class="card"><div class="lbl">Impactos por embalagem</div><div class="val green">3,3×</div><div class="sub">Visualizações médias únicas</div></div>
        <div class="card blue"><div class="lbl">Modelo</div><div class="val blue">In-home</div><div class="sub">No ambiente do consumidor</div></div>
        <div class="card purple"><div class="lbl">Segmentação</div><div class="val purple">Geo + Demo</div><div class="sub">Regional + comportamental</div></div>
      </div>
    </div>

    ${analise?`
    <!-- INTELIGÊNCIA DE MERCADO -->
    <div class="sec pb">
      <div class="sec-lbl">Inteligência de mercado</div>
      <div class="sec-h">Análise da região — ${plano.regiao||plano.clienteEndereco||""}</div>
      <div class="bar"></div>

      ${analise.ibge?`
      <div class="ibge-badge">📊 Dados Oficiais IBGE — ${analise.ibge.municipio}/${analise.ibge.uf}</div>
      <div class="g3" style="margin-bottom:20px">
        <div class="card"><div class="lbl">População</div><div class="val green">${analise.ibge.populacao||"—"}</div><div class="sub">Estimativa 2024</div></div>
        <div class="card blue"><div class="lbl">Renda per capita</div><div class="val blue sm">${analise.ibge.rendaMedia||"—"}</div><div class="sub">Censo 2022</div></div>
        <div class="card purple"><div class="lbl">Ensino superior</div><div class="val purple">${analise.ibge.pctSuperior||"—"}</div><div class="sub">% da população</div></div>
      </div>`:""}

      ${analise.totalRestaurantes?`
      <div class="maps-badge">🗺️ Google Maps — raio 5km</div>
      <div class="g4" style="margin-bottom:20px">
        <div class="card"><div class="lbl">Restaurantes</div><div class="val">${analise.totalRestaurantes}</div><div class="sub">No raio de 5km</div></div>
        <div class="card warn"><div class="lbl">Avaliação média</div><div class="val" style="color:#F5A623">${analise.avaliacaoMedia}★</div></div>
        <div class="card blue"><div class="lbl">Total avaliações</div><div class="val blue sm">${Number(analise.totalReviews||0).toLocaleString("pt-BR")}</div></div>
        <div class="card"><div class="lbl">Nível de preço</div><div class="val sm">${analise.nivelPreco||"—"}</div></div>
      </div>
      ${analise.distribuicao?`<div style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap">
        <span class="pill green">⭐ ${analise.distribuicao.excelente} excelentes (4.5+)</span>
        <span class="pill" style="background:#fff8e8;color:#c87000">👍 ${analise.distribuicao.bom} bons (4.0+)</span>
        <span class="pill">😐 ${analise.distribuicao.regular} regulares</span>
        ${(analise.topCulinarias||[]).map(c=>`<span class="pill">${typeof c==="object"?c.label:c}</span>`).join("")}
      </div>`:""}
      `:""}

      <div class="g3">
        <div class="card"><div class="lbl">Usuários delivery</div><div class="val green">${analise.usuariosDelivery||"—"}</div></div>
        <div class="card warn"><div class="lbl">Ticket médio</div><div class="val" style="color:#F5A623">${analise.ticketMedioDelivery||"—"}</div></div>
        <div class="card blue"><div class="lbl">Pedidos/mês na região</div><div class="val blue sm">${analise.pedidosMensais||"—"}</div></div>
      </div>

      ${appsArr.length>0?`
      <div style="margin-bottom:20px">
        <div class="lbl" style="margin-bottom:12px">Apps líderes de delivery na região</div>
        ${appsArr.slice(0,3).map((a,i)=>{
          const pct=parseInt(String(a.share||"").replace("%",""))||0;
          const w=Math.max(pct,5);
          return `<div class="app-row">
            <div style="font-size:11px;font-weight:700;color:#0a1628;width:80px">${a.nome||a}</div>
            <div class="app-bar-bg"><div class="app-bar" style="width:${w}%;background:${i===0?"#00E5A0":i===1?"#3D9EFF":"#9B7FFF"}"></div></div>
            <div style="font-size:11px;font-weight:700;color:${i===0?"#00A36C":i===1?"#3D9EFF":"#9B7FFF"};width:40px;text-align:right">${a.share||"—"}</div>
          </div>`;
        }).join("")}
      </div>`:""}

      ${analise.perfilConsumidor?`<div class="box"><div class="box-lbl">Perfil do consumidor local</div><div class="box-txt">${analise.perfilConsumidor}</div></div>`:""}
      ${analise.analise?`<div class="box"><div class="box-lbl">Análise estratégica</div><div class="box-txt">${analise.analise}</div></div>`:""}
      ${analise.oportunidade?`<div class="box warn"><div class="box-lbl" style="color:#F5A623">Oportunidade identificada</div><div class="box-txt" style="color:#5a3a00">${analise.oportunidade}</div></div>`:""}
      ${analise.potencialImpacto?`<div class="box blue"><div class="box-lbl" style="color:#3D9EFF">Potencial de impacto</div><div class="box-txt" style="color:#0a2a5a">${analise.potencialImpacto}</div></div>`:""}
    </div>

    <!-- ROI E CALL-TO-ACTION -->
    ${analise.roi||analise.callToAction||analise.melhorEpoca?`
    <div class="sec pb">
      <div class="sec-lbl">Estratégia</div>
      <div class="sec-h">ROI e recomendações</div>
      <div class="bar"></div>
      ${analise.roi?`<div class="roi-box"><div class="roi-h">💰 Estimativa de ROI</div><div class="roi-txt">${analise.roi}</div></div>`:""}
      <div class="g2">
        ${analise.callToAction?`<div class="cta-box"><div class="lbl" style="color:#F5A623;margin-bottom:8px">📢 Call-to-action sugerido para a embalagem</div><div style="font-size:11px;color:#5a3a00;line-height:1.7">${analise.callToAction}</div></div>`:""}
        ${analise.melhorEpoca?`<div class="box purple"><div class="box-lbl" style="color:#9B7FFF">📅 Melhor época para veicular</div><div class="box-txt" style="color:#2a1a5a">${analise.melhorEpoca}</div></div>`:""}
      </div>
      ${analise.escolaridade?`<div class="box"><div class="box-lbl">🎓 Perfil educacional da região</div><div class="box-txt">${analise.escolaridade}</div></div>`:""}
    </div>`:""}`:""}

    <!-- CAMPANHA -->
    <div class="sec pb">
      <div class="sec-lbl">A campanha</div>
      <div class="sec-h">Embalagem Branded Delivery</div>
      <div class="bar"></div>
      <div class="g4">
        <div class="card"><div class="lbl">Embalagens</div><div class="val green">${fmtN(totalEmb)}</div><div class="sub">unidades</div></div>
        <div class="card blue"><div class="lbl">Parceiros</div><div class="val blue">${parceiros.length}</div><div class="sub">estabelecimentos</div></div>
        <div class="card warn"><div class="lbl">Público-alvo</div><div class="val sm" style="color:#c87000">${plano.publicoAlvo||"—"}</div></div>
        <div class="card purple"><div class="lbl">Período</div><div class="val purple sm">${plano.prazo||"—"}</div></div>
      </div>
      <div class="imp-grid">
        <div class="imp-card"><div class="imp-num">${fmtN(impactos)}</div><div class="imp-lbl">Impactos totais</div></div>
        <div class="imp-card"><div class="imp-num">3,3×</div><div class="imp-lbl">Por embalagem</div></div>
        <div class="imp-card"><div class="imp-num">R$ ${custoImpacto}</div><div class="imp-lbl">Custo/impacto</div></div>
        <div class="imp-card"><div class="imp-num">${plano.faixaEtaria||"18–45"}</div><div class="imp-lbl">Faixa etária</div></div>
      </div>
      ${parceiros.length>0?`
      <table style="width:100%;border-collapse:collapse;margin-top:8px;font-size:11px">
        <thead><tr style="background:#f8fafb"><th style="padding:8px 12px;font-size:8px;text-transform:uppercase;letter-spacing:1px;color:#888;text-align:left">Parceiro</th><th style="padding:8px 12px;font-size:8px;text-transform:uppercase;letter-spacing:1px;color:#888;text-align:right">Embalagens</th><th style="padding:8px 12px;font-size:8px;text-transform:uppercase;letter-spacing:1px;color:#888;text-align:left">Segmento</th><th style="padding:8px 12px;font-size:8px;text-transform:uppercase;letter-spacing:1px;color:#888;text-align:right">Raio</th></tr></thead>
        <tbody>${parceiros.map((p,i)=>`<tr style="border-bottom:1px solid #f0f0f0;background:${i%2===0?"#fff":"#fafafa"}"><td style="padding:8px 12px;font-weight:600">${p.nome}</td><td style="padding:8px 12px;text-align:right">${fmtN(p.embalagens)} un</td><td style="padding:8px 12px;color:#888">${p.segmento||"—"}</td><td style="padding:8px 12px;text-align:right;color:#888">${p.raio||5}km</td></tr>`).join("")}</tbody>
      </table>`:""}
    </div>

    <!-- FINANCEIRO -->
    <div class="sec pb">
      <div class="sec-lbl">Investimento</div>
      <div class="sec-h">Resumo financeiro</div>
      <div class="bar"></div>
      <table class="fin-t">
        <thead><tr><th style="text-align:left">Item</th><th style="text-align:center">Qtd</th><th style="text-align:right">Tabela (R$)</th><th style="text-align:center">Desconto</th><th style="text-align:right">Valor Bruto</th></tr></thead>
        <tbody>
          ${parceiros.map(p=>{const t=Number(p.tabela||6),q=Number(p.embalagens||0),d=Number(p.desconto||0),b=q*t*(1-d/100);return`<tr><td>Embalagem Branded — ${p.nome}</td><td style="text-align:center">${fmtN(q)} un</td><td style="text-align:right">${fmt(t)}/un</td><td style="text-align:center">${d>0?d+"%":"—"}</td><td style="text-align:right;font-weight:700;color:#00A36C">${fmt(b)}</td></tr>`;}).join("")}
          ${outras.map(m=>{const t=Number(m.tabela||0),d=Number(m.desconto||0),b=t*(1-d/100);return`<tr><td>${m.tipo}${m.descricao?` — ${m.descricao}`:""}</td><td style="text-align:center">${m.qtd||1}</td><td style="text-align:right">${fmt(t)}</td><td style="text-align:center">${d>0?d+"%":"—"}</td><td style="text-align:right;font-weight:700;color:#00A36C">${fmt(b)}</td></tr>`;}).join("")}
        </tbody>
        <tfoot><tr class="fin-total"><td colspan="4">INVESTIMENTO TOTAL</td><td style="text-align:right">${fmt(total)}</td></tr></tfoot>
      </table>
      <p style="font-size:9px;color:#999;margin-top:8px">* Valores em Reais (BRL). Impostos não inclusos quando aplicável. Proposta válida por 15 dias.</p>
    </div>

    <!-- PRÓXIMOS PASSOS -->
    <div class="sec">
      <div class="sec-lbl">Para começar</div>
      <div class="sec-h">Próximos passos</div>
      <div class="bar"></div>
      ${[["Aprovação","Proposta válida por 15 dias a partir da data de emissão. Confirme seu interesse pelo e-mail ou WhatsApp."],["Contrato","Aprovação mediante assinatura do contrato e emissão do PI (Pedido de Inserção)."],["Arte","Material criativo para embalagem enviado em até 5 dias úteis após aprovação. Fornecemos template."],["Produção","Gráfica inicia produção após recebimento da arte aprovada. Prazo médio: 7 dias úteis."],["Performance","Relatório de performance entregue ao final da campanha com dados de impacto, distribuição e alcance."]].map(([n,t],i)=>`<div class="step"><div class="step-n">${i+1}</div><div><strong style="font-size:11px;color:#0a1628">${n}</strong><div class="step-t">${t}</div></div></div>`).join("")}
    </div>

    <div class="foot-bar">
      <div class="foot-t">ECODELY MÍDIA IN-HOME · ecodely.com.br · comercial@ecodely.com.br</div>
      <div class="foot-t">Nº ${numProposta} · Documento Confidencial · ${new Date().getFullYear()}</div>
    </div>
    <script>setTimeout(()=>window.print(),800);</script>
    </body></html>`;
    w.document.write(html);w.document.close();
  };


  const createCamp=async()=>{
    if(!newCamp.name||!newCamp.client)return;
    const id=Date.now();
    const rec={
      id,
      name:newCamp.name,
      client:newCamp.client,
      agencia:newCamp.agencia,
      numPI:newCamp.numPI,
      project:newCamp.project,
      responsavel:newCamp.responsavel,
      startDate:newCamp.startDate,
      endDate:newCamp.endDate,
      region:newCamp.region,
      graficaFornecedor:newCamp.graficaFornecedor,
      material:newCamp.material,
      graficaPrazo:newCamp.graficaPrazo,
      logistica:newCamp.logistica,
      logisticaFornecedor:newCamp.logisticaFornecedor,
      logisticaPrazo:newCamp.logisticaPrazo,
      parceiros:Number(newCamp.parceiros)||0,
      sacolas:Number(newCamp.sacolas)||0,
      valorLiquido:Number(newCamp.valorLiquido)||0,
      briefing:newCamp.briefing,
      segments:newCamp.segments,
      sacolasDistribuidas:null,
      progress:0,
      stage:1,
      parceirosIds:[],
      tasks:{
        comercial:[{id:"c1",label:"Emitir PI",done:false},{id:"c2",label:"Enviar contrato ao cliente",done:false}],
        financeiro:[{id:"f1",label:"Receber PI",done:false},{id:"f2",label:"Faturar NF",done:false},{id:"f3",label:"Lançar planilha financeira",done:false}],
        marketing:[{id:"m1",label:"Post Instagram",done:false},{id:"m2",label:"Post LinkedIn",done:false},{id:"m3",label:"Contratar influencer",done:false}],
        base:[{id:"b1",label:"Confirmar base participante",done:false},{id:"b2",label:"Enviar contrato de exclusividade",done:false}],
        grafica:[{id:"g1",label:"Arte aprovada pelo cliente",done:false},{id:"g2",label:"Material enviado para gráfica",done:false},{id:"g3",label:"Impressão confirmada",done:false},{id:"g4",label:"Material entregue",done:false}],
        logistica:[{id:"l1",label:"Logística confirmada",done:false},{id:"l2",label:"Rota de entrega definida",done:false},{id:"l3",label:"Entrega realizada",done:false}]
      },
      timeline:[{id:Date.now(),type:"stage",text:"Campanha criada",user:user?.name||"Sistema",avatar:user?.avatar||"?",at:now(),color:T.info}],
      files:[],
      impactos:{stories:[],influencer:[],impulsionado:[],galeria:[]}
    };
    setCamps(p=>[...p,rec]);
    setShowNewCamp(false);
    setNewCampStep(1);
    setNewCamp({name:"",client:"",agencia:"",numPI:"",project:"",responsavel:"",startDate:"",endDate:"",region:"",graficaFornecedor:"",material:"",graficaPrazo:"",logistica:"",logisticaFornecedor:"",logisticaPrazo:"",parceiros:"",sacolas:"",valorLiquido:"",briefing:"",segments:[]});
    const{error}=await supabase.from("campanhas").insert({id:rec.id,data:rec});
    if(error)console.error("SUPABASE createCamp:",error);
    else pushNotif("Campanha criada!",rec.name,T.accent);
  };

  const addCommEntry=async()=>{
    if(!newComm.typeId||!newComm.projectId||!newComm.value)return;
    const type=ptypes.find(t=>t.id===Number(newComm.typeId));
    const proj=projects.find(p=>p.id===Number(newComm.projectId));
    const exists=commTable.find(c=>c.typeId===Number(newComm.typeId)&&c.projectId===Number(newComm.projectId));
    if(exists){
      setCommTable(p=>p.map(c=>c.id===exists.id?{...c,value:Number(newComm.value)}:c));
      await supabase.from("comm_table").update({value:Number(newComm.value)}).eq("id",exists.id);
    } else {
      const rec={id:Date.now(),typeId:Number(newComm.typeId),typeName:type.name,projectId:Number(newComm.projectId),projectName:proj.name,value:Number(newComm.value)};
      setCommTable(p=>[...p,rec]);
      await supabase.from("comm_table").insert(rec);
    }
    setNewComm({typeId:"",projectId:"",value:""});
  };

  const addUser=async()=>{
    if(!newUser.name||!newUser.email||!newUser.pass)return;
    const rec={id:Date.now(),...newUser,avatar:newUser.name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2),active:true,lastAccess:"nunca"};
    setUsers(p=>[...p,rec]);
    setNewUser({name:"",email:"",pass:"",role:"base"});setShowNewUser(false);
    const{error}=await supabase.from("usuarios").insert(rec);
    if(error)console.error("SUPABASE addUser erro:",error.message,error.details);
  };

  // -- LOGIN ------------------------------------------------------------------
  if(!user)return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Arial,sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@400;500&display=swap');*{box-sizing:border-box;}input{outline:none;}input::placeholder{color:#2A2E45;}`}</style>
      <div style={{width:"100%",maxWidth:400,padding:24}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontFamily:"Arial,sans-serif",fontSize:36,fontWeight:800,color:T.accent,letterSpacing:-1}}>ECODELY</div>
          <div style={{fontSize:9,color:T.muted,letterSpacing:3,marginTop:4}}>SISTEMA DE GESTÃO</div>
        </div>
        <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:30}}>
          {[["E-mail","email","text"],["Senha","pass","password"]].map(([l,k,t])=>(
            <div key={k} style={{marginBottom:16}}>
              <div style={{fontSize:9,color:T.muted,marginBottom:6,letterSpacing:1.5,textTransform:"uppercase"}}>{l}</div>
              <input type={t} value={loginForm[k]} onChange={e=>setLoginForm(p=>({...p,[k]:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                placeholder={k==="email"?"seu@ecodely.com.br":"--------"}
                style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:"11px 14px",fontSize:13,color:T.text,fontFamily:"Arial,sans-serif",outline:"none"}}/>
            </div>
          ))}
          {loginErr&&<div style={{fontSize:11,color:T.danger,marginBottom:10}}>{loginErr}</div>}
          <button onClick={handleLogin} style={{width:"100%",padding:"13px",borderRadius:10,background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:14,border:"none",cursor:"pointer",marginTop:8}}>Entrar</button>
          <div style={{marginTop:18,padding:"12px",background:T.card,borderRadius:8,fontSize:10,color:T.muted,lineHeight:2}}>
            <div style={{color:T.accent,fontWeight:700,marginBottom:4}}>Login rápido:</div>
            a · 1 (Admin Teste)<br/>
            <div style={{color:T.soft,marginTop:4,marginBottom:2}}>Outras contas demo:</div>
            rodrigo@ecodely.com.br · admin123<br/>
            juliana@ecodely.com.br · user123 (Marketing)<br/>
            paulo@ecodely.com.br · user123 (Financeiro)<br/>
            mariana@ecodely.com.br · user123 (Base)
          </div>
        </div>
      </div>
    </div>
  );

  // -- MAIN ------------------------------------------------------------------
  return(
    <div style={{display:"flex",height:"100vh",background:T.bg,color:T.text,overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:3px;height:3px;}::-webkit-scrollbar-thumb{background:#1A1E30;border-radius:2px;}
        .nb{transition:all 0.15s;cursor:pointer;}.nb:hover{background:#1A1E3045!important;}
        .hr{transition:background 0.12s;cursor:pointer;}.hr:hover{background:#1A1E3060!important;}
        .btn{transition:all 0.15s;cursor:pointer;border:none;}.btn:hover{filter:brightness(1.12);transform:translateY(-1px);}.btn:active{transform:translateY(0);}
        .fade{animation:fu 0.2s ease;}@keyframes fu{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
        input,select,textarea{outline:none;}input::placeholder,textarea::placeholder{color:#2A2E45;}
        .tb{transition:all 0.12s;cursor:pointer;}.tb:hover{opacity:0.8;}
        .pulse{animation:pl 2s infinite;}@keyframes pl{0%,100%{opacity:1;}50%{opacity:0.4;}}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        .toast{animation:slideUp 0.3s ease;}
        .drag-card{cursor:grab;transition:transform 0.15s,box-shadow 0.15s,opacity 0.15s;}
        .drag-card:active{cursor:grabbing;}
        .drag-card.dragging{opacity:0.35;transform:scale(0.97);}
        .drop-col{transition:background 0.15s,border-color 0.15s;}
        .drop-col.drag-over{background:#00E5A010!important;border:1px dashed #00E5A066!important;border-radius:10px;}
      `}</style>

      {/* TOAST */}
      <Toast notifs={notifs} onDismiss={()=>setNotifs(p=>p.slice(1))}/>

      {/* DRAG GHOST (mobile touch) */}
      {touchDrag&&ghostPos&&(
        <div style={{position:"fixed",left:ghostPos.x-90,top:ghostPos.y-36,width:180,background:T.card,border:`2px solid ${T.accent}`,borderRadius:12,padding:"10px 14px",zIndex:9999,opacity:0.92,pointerEvents:"none",boxShadow:`0 16px 40px ${T.accent}44`,transform:"rotate(2deg) scale(1.04)",transition:"none"}}>
          <div style={{fontSize:11,fontWeight:700,color:T.text,fontFamily:"Arial,sans-serif",marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            {touchDrag.type==="camp"?camps.find(c=>c.id===touchDrag.id)?.name:prospects.find(p=>p.id===touchDrag.id)?.name}
          </div>
          <div style={{fontSize:9,color:T.accent,fontFamily:"Arial,sans-serif"}}>
            {touchOverStage
              ?(touchDrag.type==="camp"?STAGES_CAMP.find(s=>s.id===Number(touchOverStage))?.label:PIPE_STAGES.find(s=>s.id===touchOverStage)?.label)||"Soltar aqui -"
              :"Arraste para uma coluna"}
          </div>
        </div>
      )}

      {/* MODAL */}
      {selCamp&&<CampModal camp={selCamp} user={user} allPartners={basePartners} onClose={()=>setSelCamp(null)} onToggleTask={toggleTask} onAddComment={addComment} onAddFile={addFile} onUpdateSacolas={updateSacolas} onUpdateImpactos={updateImpactos} onOpenClientPanel={(c)=>{setClientPanelCamp(c);setSelCamp(null);}} onGerarCheckin={(c)=>gerarCheckinPDF(c,basePartners)} onGerarPosVenda={(c)=>gerarPosVendaPDF(c,basePartners)} onEditCamp={async(id,fields)=>{let upd=null;setCamps(p=>p.map(c=>{if(c.id!==id)return c;upd={...c,...fields};return upd;}));setSelCamp(p=>({...p,...fields}));if(upd)await supabase.from("campanhas").upsert({id:upd.id,data:upd});}} projects={projects} suppliers={suppliers} users={users}/>}

      {/* CLIENT PANEL */}
      {clientPanelCamp&&<ClientPanel camp={clientPanelCamp} allPartners={basePartners} onClose={()=>setClientPanelCamp(null)} onPDF={()=>setPdfCamp(clientPanelCamp)}/>}

      {/* PDF REPORT */}
      {pdfCamp&&<PDFReport camp={pdfCamp} onClose={()=>setPdfCamp(null)}/>}

      {/* PROSPECT MODAL */}
      {selProsp&&(
        <div style={{position:"fixed",inset:0,background:"#000000BB",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setSelProsp(null)}>
          <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,width:"100%",maxWidth:460,padding:24}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
              <div><div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:18,marginBottom:5}}>{selProsp.name}</div><div style={{display:"flex",gap:5}}><Badge label={selProsp.segment} color={T.purple}/><Badge label={PIPE_STAGES.find(s=>s.id===selProsp.stage)?.label||""} color={PIPE_STAGES.find(s=>s.id===selProsp.stage)?.color||T.muted}/></div></div>
              <div onClick={()=>setSelProsp(null)} style={{cursor:"pointer",color:T.muted,fontSize:20}}>×</div>
            </div>
            {[["Contato",selProsp.contact],["E-mail",selProsp.email||"-"],["Responsável",selProsp.owner],["Valor estimado",fmtK(selProsp.value||selProsp.ltv||0)]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${T.border}`}}>
                <span style={{fontSize:10,color:T.muted,fontFamily:"Arial,sans-serif"}}>{l}</span>
                <span style={{fontSize:11}}>{v}</span>
              </div>
            ))}
            {selProsp.notes&&<div style={{marginTop:12,padding:"10px",background:T.card,borderRadius:8,fontSize:11,color:T.soft,fontStyle:"italic"}}>"{selProsp.notes}"</div>}
            {["negociacao","fechado"].includes(selProsp.stage)&&(
              <button className="btn" onClick={()=>{addProspectToBase(selProsp);setSelProsp(null);}} style={{width:"100%",marginTop:14,padding:"10px",background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",borderRadius:8,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12}}>- Adicionar à Base de Parceiros</button>
            )}
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div style={{width:210,background:T.surface,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"20px 16px 14px",borderBottom:`1px solid ${T.border}`}}>
          <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:17,color:T.accent,letterSpacing:-0.5}}>ECODELY</div>
          <div style={{fontSize:8,color:T.muted,letterSpacing:2.5,marginTop:2,fontFamily:"Arial,sans-serif"}}>SISTEMA DE GESTÃO</div>
        </div>
        <div style={{flex:1,padding:"10px 8px",overflowY:"auto"}}>
          {nav.map(n=>(
            <div key={n.id} className="nb" onClick={()=>setTab(n.id)} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 10px",borderRadius:7,marginBottom:1,background:tab===n.id?T.accentDim:"transparent",border:`1px solid ${tab===n.id?T.accentBorder:"transparent"}`}}>
              <span style={{fontSize:12,color:tab===n.id?T.accent:T.muted,width:16,textAlign:"center"}}>{n.icon}</span>
              <span style={{fontSize:11,color:tab===n.id?T.text:T.muted,fontFamily:"Arial,sans-serif"}}>{n.label}</span>
              {n.badge&&<div style={{marginLeft:"auto",background:T.danger,borderRadius:8,padding:"1px 5px",fontSize:8,color:"#fff",fontWeight:700}}>{n.badge}</div>}
            </div>
          ))}
        </div>
        <div style={{padding:12,borderTop:`1px solid ${T.border}`}}>
          <div style={{display:"flex",gap:8,alignItems:"center",padding:"8px 10px",background:T.card,borderRadius:8}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:ROLE_COLOR[user.role]+"22",border:`1px solid ${ROLE_COLOR[user.role]}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:ROLE_COLOR[user.role],fontWeight:700,flexShrink:0}}>{user.avatar}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:10,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name.split(" ")[0]}</div>
              <div style={{fontSize:9,color:ROLE_COLOR[user.role]}}>{ROLE_LABELS[user.role]}</div>
            </div>
            <div onClick={()=>{setUser(null);localStorage.removeItem("ecodely_user");}} style={{fontSize:13,color:T.muted,cursor:"pointer"}} title="Sair">-</div>
          </div>
        </div>
        {/* Seletor de Tema */}
        <div style={{padding:"8px 12px",borderTop:`1px solid ${T.border}`}}>
          <div style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Tema</div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            {Object.entries(THEMES).map(([k,v])=>(
              <button key={k} onClick={()=>setTema(k)} title={v.name} style={{padding:"4px 8px",borderRadius:5,border:tema===k?`2px solid ${T.accent}`:`1px solid ${T.border}`,cursor:"pointer",background:k===tema?T.accentDim:"transparent",fontSize:8,color:k===tema?T.accent:T.muted,fontWeight:k===tema?700:400,fontFamily:"Arial,sans-serif"}}>
                {v.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{flex:1,overflow:"auto",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"13px 24px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:T.surface,flexShrink:0}}>
          <div>
            <div style={{fontFamily:"Arial,sans-serif",fontSize:15,fontWeight:700}}>{nav.find(n=>n.id===tab)?.label||"Ecodely"}</div>
            <div style={{fontSize:9,color:T.muted,fontFamily:"Arial,sans-serif",marginTop:1}}>{new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            {pendingQueue.length>0&&tab!=="minha-fila"&&(
              <div onClick={()=>setTab("minha-fila")} style={{display:"flex",gap:8,alignItems:"center",padding:"7px 12px",background:T.dangerDim,border:`1px solid ${T.danger}44`,borderRadius:8,cursor:"pointer"}}>
                <div className="pulse" style={{width:6,height:6,borderRadius:"50%",background:T.danger}}/>
                <span style={{fontSize:10,color:T.danger,fontFamily:"Arial,sans-serif"}}>{pendingQueue.length} pendente{pendingQueue.length>1?"s":""}</span>
              </div>
            )}
            {/* Bell */}
            <div style={{position:"relative"}}>
              <div onClick={()=>setInboxOpen(p=>!p)} style={{width:34,height:34,borderRadius:"50%",background:inboxOpen?T.accentDim:T.card,border:`1px solid ${inboxOpen?T.accentBorder:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:14,transition:"all 0.15s"}}>
                -
              </div>
              {inbox.filter(n=>!n.read).length>0&&(
                <div style={{position:"absolute",top:-2,right:-2,width:16,height:16,borderRadius:"50%",background:T.danger,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#fff",fontWeight:800,border:`2px solid ${T.surface}`}}>
                  {inbox.filter(n=>!n.read).length}
                </div>
              )}
              {/* Inbox dropdown */}
              {inboxOpen&&(
                <div style={{position:"absolute",top:42,right:0,width:360,background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,boxShadow:"0 8px 32px #00000060",zIndex:500,overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
                  <div style={{padding:"14px 16px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13}}>Notificações</div>
                      {inbox.filter(n=>!n.read).length>0&&<div style={{fontSize:9,color:T.muted,marginTop:1}}>{inbox.filter(n=>!n.read).length} não lida{inbox.filter(n=>!n.read).length>1?"s":""}</div>}
                    </div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <div onClick={async()=>{setInbox(p=>p.map(n=>({...n,read:true})));if(user?.id)await supabase.from("notificacoes").update({lida:true}).eq("user_id",user.id);}} style={{fontSize:9,color:T.accent,cursor:"pointer",fontFamily:"Arial,sans-serif"}}>Marcar todas lidas</div>
                      <div onClick={()=>setInboxOpen(false)} style={{fontSize:18,color:T.muted,cursor:"pointer",lineHeight:1}}>×</div>
                    </div>
                  </div>
                  <div style={{maxHeight:420,overflowY:"auto"}}>
                    {inbox.length===0?(
                      <div style={{padding:"32px",textAlign:"center",color:T.muted}}>
                        <div style={{fontSize:28,marginBottom:8}}>🔔</div>
                        <div style={{fontSize:12}}>Tudo em dia!</div>
                      </div>
                    ):inbox.map((n,i)=>{
                      const ICONS={prazo:"⏰",comissao:"💰",tarefa:"✅",etapa:"🚀",contrato:"📄",meta:"🎯",operacional:"⚙️",sistema:"📢"};
                      return(
                        <div key={n.id}
                          onClick={async()=>{
                            setInbox(p=>p.map(x=>x.id===n.id?{...x,read:true}:x));
                            if(user?.id&&!n.auto)await supabase.from("notificacoes").update({lida:true}).eq("id",n.id);
                            if(n.tab){setTab(n.tab);setInboxOpen(false);}
                          }}
                          style={{padding:"12px 16px",borderBottom:`1px solid ${T.border}`,background:n.read?"transparent":n.color+"12",cursor:"pointer",transition:"background 0.15s"}}>
                          <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                            <div style={{width:34,height:34,borderRadius:10,background:n.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>
                              {ICONS[n.type]||"📢"}
                            </div>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:2}}>
                                <div style={{fontSize:11,fontWeight:n.read?500:700,color:n.read?T.soft:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n.title}</div>
                                <div style={{fontSize:8,color:T.muted,fontFamily:"Arial,sans-serif",flexShrink:0}}>{n.at}</div>
                              </div>
                              <div style={{fontSize:10,color:T.muted,lineHeight:1.4,marginBottom:n.tab?3:0}}>{n.msg}</div>
                              {n.tab&&<div style={{fontSize:8,color:n.color,fontFamily:"Arial,sans-serif"}}>→ Ir para {n.tab}</div>}
                            </div>
                            {!n.read&&<div style={{width:7,height:7,borderRadius:"50%",background:n.color,flexShrink:0,marginTop:5}}/>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {inbox.length>0&&<div style={{padding:"8px 16px",borderTop:`1px solid ${T.border}`,textAlign:"center"}}>
                    <div onClick={()=>setInbox(p=>p.filter(n=>!n.auto))} style={{fontSize:9,color:T.muted,cursor:"pointer",fontFamily:"Arial,sans-serif"}}>Limpar automáticas</div>
                  </div>}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{flex:1,padding:24,overflow:"auto"}} className="fade" key={tab} onClick={()=>inboxOpen&&setInboxOpen(false)}>

          {/* --------------------------------------
              DASHBOARD - ROLE BASED
          -------------------------------------- */}
          {tab==="dashboard"&&(()=>{
            // -- Shared computed values --
            const totalImpactos=camps.reduce((a,c)=>{
              const imp=c.impactos||{};
              const offline=Math.round((c.sacolasDistribuidas||c.sacolas||0)*3.3);
              const st=(imp.stories||[]).reduce((s,x)=>s+Number(x.impressoes),0);
              const inf=(imp.influencer||[]).reduce((s,x)=>s+Number(x.alcance),0);
              const im=(imp.impulsionado||[]).reduce((s,x)=>s+Number(x.alcance),0);
              return a+offline+st+inf+im;
            },0);
            const campsAtivas=camps.filter(c=>c.stage<5);
            const campsFin=camps.filter(c=>c.stage===5);
            const myProspects=prospects.filter(p=>p.owner===user.name||user.role==="admin");
            const myPipeTotal=myProspects.reduce((a,p)=>a+(p.value||0),0);

            // Faturamento real — soma entradas dos lançamentos
            const receitaReal=lancamentos.filter(l=>l.tipo!=="Saldo Anterior").reduce((a,l)=>a+(l.entrada||0),0);
            const despesaReal=lancamentos.filter(l=>l.tipo!=="Saldo Anterior").reduce((a,l)=>a+(l.saida||0),0);

            // Faturamento por cliente — agrupa camps por client com valorLiquido
            const fatPorCliente=Object.values(camps.reduce((acc,c)=>{
              if(!c.client)return acc;
              if(!acc[c.client])acc[c.client]={name:c.client,faturado:0,campanhas:0,pendente:0};
              acc[c.client].faturado+=(c.valorLiquido||0);
              acc[c.client].campanhas+=1;
              return acc;
            },{})).sort((a,b)=>b.faturado-a.faturado);

            // Meta comercial — total valorLiquido das campanhas ativas
            const metaComercial=Math.max(camps.reduce((a,c)=>a+(c.valorLiquido||0),0),150000);

            // Prazos críticos reais — campanhas com prazo de gráfica ou logística
            const hoje=new Date();
            const parsePrazo=(s)=>{if(!s)return null;const p=s.includes("-")?new Date(s):new Date(s.split("/").reverse().join("-"));return isNaN(p)?null:p;};
            const prazos=camps.filter(c=>c.stage<5).flatMap(c=>[
              c.graficaPrazo?{camp:c.name,prazo:`Gráfica: ${c.graficaPrazo}`,dt:parsePrazo(c.graficaPrazo),id:c.id,color:T.purple}:null,
              c.logisticaPrazo?{camp:c.name,prazo:`Logística: ${c.logisticaPrazo}`,dt:parsePrazo(c.logisticaPrazo),id:c.id,color:T.warn}:null
            ]).filter(Boolean).filter(p=>p.dt).map(p=>({...p,dias:Math.ceil((p.dt-hoje)/(1000*60*60*24))}))
              .sort((a,b)=>a.dias-b.dias).slice(0,5);

            // Mês atual para DRE
            const mesAtual=new Date().toLocaleDateString("pt-BR",{month:"short",year:"numeric"});

            // -- DASH COMERCIAL --
            const DashComercial=()=>(
              <div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
                  <KCard label="Meu pipeline" value={fmtK(myProspects.reduce((a,p)=>a+(p.value||0),0))} sub={`${myProspects.length} prospects`} color={T.info} icon="-" onClick={()=>{setTab("comercial");setCommTab("pipeline");}} hint="Ver pipeline -"/>
                  <KCard label="Propostas enviadas" value={myProspects.filter(p=>["proposta","negociacao","fechado"].includes(p.stage)).length} sub="no período" color={T.purple} icon="-"/>
                  <KCard label="Minha taxa conversao" value={myProspects.length>0?Math.round((myProspects.filter(p=>p.stage==="fechado").length/myProspects.length)*100)+"%":"0%"} sub="prospects fechados" color={T.accent} icon="-"/>
                  <KCard label="Minhas tarefas" value={pendingQueue.length} sub="pendentes" color={pendingQueue.length>0?T.danger:T.accent} icon="-" onClick={()=>setTab("minha-fila")} hint="Ver fila -"/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12,marginBottom:12}}>
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:20}}>
                    <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:14}}>Meu pipeline</div>
                    {PIPE_STAGES.map(stage=>{
                      const items=myProspects.filter(p=>p.stage===stage.id);
                      if(!items.length)return null;
                      return(<div key={stage.id} style={{marginBottom:12}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:10,color:stage.color}}>{stage.label}</span><span style={{fontSize:10,color:T.muted}}>{items.length} · {fmtK(items.reduce((a,p)=>a+(p.value||0),0))}</span></div>
                        {items.map(p=><div key={p.id} className="hr" onClick={()=>setSelProsp(p)} style={{padding:"6px 8px",borderRadius:7,display:"flex",justifyContent:"space-between",marginBottom:3}}>
                          <span style={{fontSize:11}}>{p.name}</span>
                          <span style={{fontSize:11,color:stage.color,fontFamily:"Arial,sans-serif",fontWeight:700}}>{fmtK(p.value)}</span>
                        </div>)}
                      </div>);
                    })}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:12}}>
                    <div style={{background:T.card,border:`1px solid ${T.accentBorder}`,borderRadius:12,padding:16}}>
                      <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12,color:T.accent,marginBottom:10}}>Meta do mês</div>
                      <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:26,color:T.accent,marginBottom:4}}>{fmtK(myPipeTotal)}</div>
                      <div style={{fontSize:9,color:T.muted,marginBottom:8}}>Meta: {user.meta>0?fmtK(user.meta):<span style={{color:T.warn}}>não definida</span>}</div>
                      {user.meta>0&&<><PBar pct={(myPipeTotal/user.meta)*100} color={myPipeTotal>=user.meta?T.accent:T.info}/>
                      <div style={{fontSize:9,color:T.muted,marginTop:4}}>{Math.round((myPipeTotal/user.meta)*100)}% da meta</div></>}
                      {!user.meta&&<div style={{fontSize:9,color:T.warn,marginTop:4}}>Solicite ao gestor definir sua meta</div>}
                    </div>
                    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16}}>
                      <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12,marginBottom:10}}>Próximos follow-ups</div>
                      {myProspects.slice(0,3).map((p,i)=><div key={i} style={{padding:"6px 0",borderBottom:`1px solid ${T.border}`}}>
                        <div style={{fontSize:11,fontWeight:600}}>{p.name}</div>
                        <div style={{fontSize:9,color:T.muted}}>{p.segment} · {p.owner}</div>
                      </div>)}
                    </div>
                  </div>
                </div>
                <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16,marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                    <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13}}>Meta do mês vs Realizado</div>
                    {user.meta>0&&<div style={{fontSize:11,color:myPipeTotal>=user.meta?T.accent:T.info,fontFamily:"Arial,sans-serif",fontWeight:700}}>
                      {Math.round((myPipeTotal/user.meta)*100)}% atingido
                    </div>}
                  </div>
                  {user.meta>0?(
                    <div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
                        {[
                          {l:"Meta",v:fmtK(user.meta),c:T.muted},
                          {l:"Realizado",v:fmtK(myPipeTotal),c:T.info},
                          {l:"Falta",v:fmtK(Math.max(0,user.meta-myPipeTotal)),c:myPipeTotal>=user.meta?T.accent:T.danger}
                        ].map((k,i)=>(
                          <div key={i} style={{background:T.surface,borderRadius:8,padding:"10px 14px",textAlign:"center"}}>
                            <div style={{fontSize:9,color:T.muted,marginBottom:3}}>{k.l}</div>
                            <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:16,color:k.c}}>{k.v}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{height:14,background:T.surface,borderRadius:7,overflow:"hidden",position:"relative"}}>
                        <div style={{height:"100%",width:`${Math.min(100,Math.round((myPipeTotal/user.meta)*100))}%`,background:`linear-gradient(90deg,${T.info},${T.accent})`,borderRadius:7,transition:"width 0.6s ease",display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:6}}>
                          {myPipeTotal>0&&<span style={{fontSize:8,color:"#000",fontWeight:700}}>{Math.round((myPipeTotal/user.meta)*100)}%</span>}
                        </div>
                      </div>
                    </div>
                  ):(
                    <div style={{textAlign:"center",padding:"20px",color:T.warn,fontSize:11}}>Meta não definida — solicite ao gestor</div>
                  )}
                </div>
                <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16}}>
                  <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12,color:T.purple,marginBottom:10}}>Simulador de receita por campanha</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                    {[{l:"500 sacolas",v:fmtK(500*2.5)},{l:"5.000 sacolas",v:fmtK(5000*2.5)},{l:"20.000 sacolas",v:fmtK(20000*2.5)}].map((k,i)=>(
                      <div key={i} style={{background:T.surface,borderRadius:8,padding:"10px 12px",textAlign:"center"}}>
                        <div style={{fontSize:9,color:T.muted,marginBottom:4}}>{k.l}</div>
                        <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:16,color:T.purple}}>{k.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );

            // -- DASH MARKETING --
            const DashMarketing=()=>{
              const totalImpMes=totalImpactos;
              const influAtivos=camps.flatMap(c=>(c.impactos?.influencer||[])).length;
              const campsComStories=camps.filter(c=>(c.impactos?.stories||[]).length>0).length;
              return(
                <div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
                    <KCard label="Campanhas no ar" value={campsAtivas.length} sub="em andamento" color={T.accent} icon="-" onClick={()=>setTab("campanhas")} hint="Ver campanhas -"/>
                    <KCard label="Influenciadores ativos" value={influAtivos} sub="no período" color={T.purple} icon="-"/>
                    <KCard label="Impactos totais" value={totalImpMes.toLocaleString()} sub="todos os canais" color={T.info} icon="-"/>
                    <KCard label="Ações com parceiros" value={campsComStories} sub="com stories registrados" color={T.warn} icon="-"/>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:20}}>
                      <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Campanhas no ar</div>
                      {campsAtivas.map(c=>{
                        const imp=c.impactos||{};
                        const total=Math.round((c.sacolasDistribuidas||c.sacolas||0)*3.3)+(imp.stories||[]).reduce((a,s)=>a+Number(s.impressoes),0)+(imp.influencer||[]).reduce((a,s)=>a+Number(s.alcance),0)+(imp.impulsionado||[]).reduce((a,s)=>a+Number(s.alcance),0);
                        return(<div key={c.id} className="hr" onClick={()=>setSelCamp(c)} style={{padding:"8px 6px",borderRadius:8,marginBottom:4}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                            <div style={{fontSize:11,fontWeight:700,fontFamily:"Arial,sans-serif"}}>{c.name}</div>
                            <div style={{fontSize:10,color:T.accent,fontFamily:"Arial,sans-serif",fontWeight:700}}>{total.toLocaleString()} impactos</div>
                          </div>
                          <PBar pct={c.progress} color={STAGES_CAMP.find(s=>s.id===c.stage)?.color||T.accent} h={4}/>
                        </div>);
                      })}
                    </div>
                    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:20}}>
                      <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Impactos por canal</div>
                      {[{l:"Offline (sacolas)",v:camps.reduce((a,c)=>a+Math.round((c.sacolasDistribuidas||c.sacolas||0)*3.3),0),c:T.purple},
                        {l:"Stories parceiros",v:camps.flatMap(c=>(c.impactos?.stories||[])).reduce((a,s)=>a+Number(s.impressoes),0),c:"#E1306C"},
                        {l:"Influenciadores",v:camps.flatMap(c=>(c.impactos?.influencer||[])).reduce((a,s)=>a+Number(s.alcance),0),c:T.warn},
                        {l:"Impulsionado",v:camps.flatMap(c=>(c.impactos?.impulsionado||[])).reduce((a,s)=>a+Number(s.alcance),0),c:T.info},
                      ].map((k,i)=>(
                        <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                          <div style={{display:"flex",gap:8,alignItems:"center"}}>
                            <div style={{width:8,height:8,borderRadius:"50%",background:k.c}}/>
                            <span style={{fontSize:10,color:T.soft}}>{k.l}</span>
                          </div>
                          <span style={{fontFamily:"Arial,sans-serif",fontWeight:700,color:k.c,fontSize:13}}>{k.v.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16}}>
                      <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12,color:T.pink,marginBottom:10}}>Posts por campanha ativa</div>
                      {campsAtivas.slice(0,4).map((c,i)=>{
                        const mkt=c.tasks?.marketing||[];
                        const posts=mkt.filter(t=>t.label.toLowerCase().includes("post")&&t.done).length;
                        const total=mkt.filter(t=>t.label.toLowerCase().includes("post")).length;
                        return(
                          <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${T.border}`}}>
                            <span style={{fontSize:10,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</span>
                            <span style={{fontSize:10,color:posts===total&&total>0?T.accent:T.muted,fontFamily:"Arial,sans-serif",flexShrink:0,marginLeft:8}}>{posts}/{total} posts</span>
                          </div>
                        );
                      })}
                      {campsAtivas.length===0&&<div style={{fontSize:11,color:T.muted}}>Nenhuma campanha ativa</div>}
                    </div>
                    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16}}>
                      <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12,color:T.warn,marginBottom:10}}>Projetos em andamento</div>
                      {campsAtivas.map((c,i)=>(
                        <div key={i} style={{padding:"6px 0",borderBottom:`1px solid ${T.border}`}}>
                          <div style={{fontSize:11,fontWeight:600}}>{c.name}</div>
                          <div style={{fontSize:9,color:c.progress>=60?T.accent:T.warn}}>{c.progress>=60?"No prazo":"Atenção"} · {c.progress}%</div>
                        </div>
                      ))}
                    </div>
                    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16}}>
                      <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12,color:T.info,marginBottom:10}}>Minhas tarefas</div>
                      <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:32,color:pendingQueue.length>0?T.danger:T.accent,marginBottom:4}}>{pendingQueue.length}</div>
                      <div style={{fontSize:9,color:T.muted,marginBottom:8}}>tarefas pendentes</div>
                      <button onClick={()=>setTab("minha-fila")} className="btn" style={{width:"100%",padding:"7px",background:T.accentDim,border:`1px solid ${T.accentBorder}`,color:T.accent,borderRadius:7,fontSize:10}}>Ver fila -</button>
                    </div>
                  </div>
                </div>
              );
            };

            // -- DASH FINANCEIRO --
            const DashFinanceiro=()=>(
              <div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
                  <KCard label="Receita total" value={fmtK(receitaReal)} sub="lançamentos no período" color={T.accent} icon="-" onClick={()=>{setTab("financeiro-modulo");}} hint="Ver financeiro -"/>
                  <KCard label="Total despesas" value={fmtK(despesaReal)} sub="lançamentos no período" color={T.danger} icon="-"/>
                  <KCard label="Resultado líquido" value={fmtK(receitaReal-despesaReal)} sub="receita - despesas" color={receitaReal>despesaReal?T.accent:T.danger} icon="-"/>
                  <KCard label="Pendente aprovação" value={closings.filter(c=>c.status==="pendente").length} sub="comissões" color={T.purple} icon="-" onClick={()=>setTab("comissoes")} hint="Aprovar -"/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:20}}>
                    <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Faturamento por cliente</div>
                    {fatPorCliente.length>0?fatPorCliente.slice(0,5).map((c,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                        <div><div style={{fontSize:11,fontWeight:600}}>{c.name}</div><div style={{fontSize:9,color:T.muted}}>{c.campanhas} campanha{c.campanhas!==1?"s":""}</div></div>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,color:T.accent}}>{fmtK(c.faturado)}</div>
                        </div>
                      </div>
                    )):<div style={{fontSize:11,color:T.muted}}>Nenhuma campanha com valor líquido cadastrado</div>}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:12}}>
                    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16}}>
                      <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12,marginBottom:10}}>DRE — {mesAtual}</div>
                      {[{l:"Receita bruta",v:receitaReal,c:T.accent},{l:"Despesas totais",v:-despesaReal,c:T.danger},{l:"Resultado líquido",v:receitaReal-despesaReal,c:receitaReal>despesaReal?T.accent:T.danger}].map((k,i)=>(
                        <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                          <span style={{fontSize:10,color:T.soft}}>{k.l}</span>
                          <span style={{fontFamily:"Arial,sans-serif",fontWeight:700,color:k.c,fontSize:12}}>{k.v<0?"-":""}{fmtK(Math.abs(k.v))}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16}}>
                      <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12,marginBottom:10}}>Pagamento por fornecedor</div>
                      {suppliers.map((s,i)=>(
                        <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${T.border}`}}>
                          <span style={{fontSize:10}}>{s.name}</span>
                          <Badge label={s.type==="grafica"?"Gráfica":"Logística"} color={s.type==="grafica"?T.purple:T.warn}/>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16}}>
                  <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12,marginBottom:10}}>Pipeline de receita (prospects)</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                    {[{l:"Em negociação",stages:["negociacao"],c:T.warn},{l:"Propostas enviadas",stages:["proposta"],c:T.info},{l:"Total pipeline",stages:["lead","qualificado","proposta","negociacao"],c:T.accent}].map((k,i)=>{
                      const v=prospects.filter(p=>k.stages.includes(p.stage)).reduce((a,p)=>a+(p.value||0),0);
                      return(<div key={i} style={{background:T.surface,borderRadius:8,padding:"12px",textAlign:"center"}}>
                        <div style={{fontSize:9,color:T.muted,marginBottom:4}}>{k.l}</div>
                        <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:18,color:k.c}}>{fmtK(v)}</div>
                      </div>);
                    })}
                  </div>
                </div>
              </div>
            );

            // -- DASH OPERACIONAL --
            const DashOperacional=()=>{
              const campsGrafica=camps.filter(c=>c.stage===2);
              const campsLogistica=camps.filter(c=>c.stage===3);
              return(
                <div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
                    <KCard label="Em gráfica" value={campsGrafica.length} sub="aguardando impressão" color={T.purple} icon="-"/>
                    <KCard label="Em logística" value={campsLogistica.length} sub="em distribuição" color={T.warn} icon="-"/>
                    <KCard label="Minhas tarefas" value={pendingQueue.length} sub="pendentes" color={pendingQueue.length>0?T.danger:T.accent} icon="-" onClick={()=>setTab("minha-fila")} hint="Ver fila -"/>
                    <KCard label="Parceiros na base" value={basePartners.length} sub="cadastrados" color={T.info} icon="-" onClick={()=>setTab("base")} hint="Ver base -"/>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                    {[{title:"Na Gráfica",camps:campsGrafica,color:T.purple},{title:"Na Logística",camps:campsLogistica,color:T.warn}].map((g,gi)=>(
                      <div key={gi} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:20}}>
                        <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,color:g.color,marginBottom:12}}>{g.title}</div>
                        {g.camps.length===0?<div style={{fontSize:11,color:T.muted}}>Nenhuma campanha</div>:g.camps.map(c=>(
                          <div key={c.id} className="hr" onClick={()=>setSelCamp(c)} style={{padding:"8px 6px",borderRadius:8,marginBottom:6}}>
                            <div style={{fontSize:11,fontWeight:700,fontFamily:"Arial,sans-serif",marginBottom:3}}>{c.name}</div>
                            <div style={{fontSize:9,color:T.muted,marginBottom:5}}>{c.graficaFornecedor||c.logisticaFornecedor||"Fornecedor não definido"}{(c.graficaPrazo||c.logisticaPrazo)&&` · Prazo: ${c.graficaPrazo||c.logisticaPrazo}`}</div>
                            <PBar pct={c.progress} color={g.color} h={4}/>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div style={{background:T.card,border:`1px solid ${T.warnDim}`,borderLeft:`3px solid ${T.warn}`,borderRadius:12,padding:16}}>
                    <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12,color:T.warn,marginBottom:10}}>Prazos críticos</div>
                    {prazos.length===0?<div style={{fontSize:11,color:T.accent}}>Nenhum prazo cadastrado</div>:prazos.map((a,i)=>(
                      <div key={i} onClick={()=>{const c=camps.find(x=>x.id===a.id);if(c)setSelCamp(c);}} className="hr" style={{padding:"6px 4px",borderRadius:6,cursor:"pointer",marginBottom:6}}>
                        <div style={{fontSize:11,fontWeight:600}}>{a.camp}</div>
                        <div style={{fontSize:9,color:a.dias<=3?T.danger:a.dias<=7?T.warn:T.muted}}>{a.prazo} · {a.dias<=0?"VENCIDO":a.dias===1?"amanhã":`${a.dias}d`}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            };

            // -- DASH BASE --
            const DashBase=()=>{
              const parceirosCamp=camps.flatMap(c=>c.parceirosIds||[]);
              const parceirosAtivos=basePartners.filter(p=>p.status==="ativo").length;
              const contratosMes=basePartners.filter(p=>p.contrato.status==="assinado").length;
              const parcFaltantes=camps.filter(c=>c.stage<5&&c.parceiros>0).reduce((a,c)=>a+(c.parceiros-((c.parceirosIds||[]).length)),0);
              return(
                <div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
                    <KCard label="Campanhas no ar" value={campsAtivas.length} sub="ativas" color={T.accent} icon="-" onClick={()=>setTab("campanhas")} hint="Ver campanhas -"/>
                    <KCard label="Parceiros ativos" value={parceirosAtivos} sub="na base" color={T.info} icon="-" onClick={()=>setTab("base")} hint="Ver base -"/>
                    <KCard label="Contratos assinados" value={contratosMes} sub="no total" color={T.green} icon="-"/>
                    <KCard label="Parceiros faltantes" value={Math.max(0,parcFaltantes)} sub="em campanhas ativas" color={parcFaltantes>0?T.danger:T.accent} icon="-"/>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12,marginBottom:12}}>
                    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:20}}>
                      <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Parceiros por campanha</div>
                      {campsAtivas.map(c=>(
                        <div key={c.id} style={{marginBottom:10}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                            <span style={{fontSize:11,fontWeight:600}}>{c.name}</span>
                            <span style={{fontSize:10,color:T.accent}}>{(c.parceirosIds||[]).length}/{c.parceiros}</span>
                          </div>
                          <PBar pct={Math.round(((c.parceirosIds||[]).length/c.parceiros)*100)} color={T.accent} h={5}/>
                        </div>
                      ))}
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:12}}>
                      <div style={{background:T.card,border:`1px solid ${T.danger}33`,borderRadius:12,padding:16}}>
                        <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12,color:T.danger,marginBottom:10}}>Contratos expirando</div>
                        {basePartners.filter(p=>p.contrato.status==="expirando").map((p,i)=>(
                          <div key={i} style={{padding:"5px 0",borderBottom:`1px solid ${T.border}`}}>
                            <div style={{fontSize:11,fontWeight:600}}>{p.name}</div>
                            <div style={{fontSize:9,color:T.danger}}>Vence: {p.contrato.expiraEm}</div>
                          </div>
                        ))}
                        {basePartners.filter(p=>p.contrato.status==="expirando").length===0&&<div style={{fontSize:11,color:T.accent}}>Nenhum expirando</div>}
                      </div>
                      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16}}>
                        <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12,marginBottom:8}}>Minha fila</div>
                        <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:28,color:pendingQueue.length>0?T.danger:T.accent}}>{pendingQueue.length}</div>
                        <div style={{fontSize:9,color:T.muted,marginBottom:8}}>tarefas pendentes</div>
                        <button onClick={()=>setTab("minha-fila")} className="btn" style={{width:"100%",padding:"7px",background:T.accentDim,border:`1px solid ${T.accentBorder}`,color:T.accent,borderRadius:7,fontSize:10}}>Ver fila -</button>
                      </div>
                    </div>
                  </div>
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16}}>
                    <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12,marginBottom:10}}>Ranking de parceiros</div>
                    <div style={{display:"flex",flexDirection:"column",gap:6}}>
                      {[...basePartners].sort((a,b)=>b.score-a.score).slice(0,5).map((p,i)=>(
                        <div key={i} style={{display:"flex",gap:12,alignItems:"center"}}>
                          <div style={{width:22,height:22,borderRadius:"50%",background:i<3?[T.warn+"33",T.soft+"22",T.soft+"15"][i]:T.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:T.soft,fontWeight:700,flexShrink:0}}>{i+1}</div>
                          <div style={{flex:1}}><div style={{fontSize:11,fontWeight:600}}>{p.name}</div><div style={{fontSize:9,color:T.muted}}>{p.category}</div></div>
                          <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,color:p.score>80?T.accent:T.warn}}>{p.score}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            };

            const DashGeral=()=>(
              <div>
                {/* Period selector */}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
                  <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:14}}>Visão geral</div>
                  <div style={{display:"flex",gap:6}}>
                    {[["mes","Mês atual"],["trim","Trimestre"],["ano","Ano"],["custom","Período"]].map(([id,l])=>(
                      <button key={id} onClick={()=>setDashPeriod(id)} className="btn" style={{padding:"5px 12px",fontSize:10,borderRadius:7,background:dashPeriod===id?T.accentDim:"transparent",border:`1px solid ${dashPeriod===id?T.accentBorder:T.border}`,color:dashPeriod===id?T.accent:T.muted,cursor:"pointer"}}>{l}</button>
                    ))}
                    {dashPeriod==="custom"&&(
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        <input type="date" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:"4px 8px",fontSize:10,color:T.text,outline:"none"}}/>
                        <span style={{fontSize:10,color:T.muted}}>até</span>
                        <input type="date" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:"4px 8px",fontSize:10,color:T.text,outline:"none"}}/>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:12}}>
                  <KCard label="Campanhas ativas" value={campsAtivas.length} sub="em andamento" color={T.accent} icon="-" onClick={()=>setTab("campanhas")} hint="Ver campanhas -"/>
                  <KCard label="Pipeline comercial" value={fmtK(pipeTotal)} sub={`${prospects.length} prospects`} color={T.info} icon="-" onClick={()=>{setTab("comercial");setCommTab("pipeline");}} hint="Ver pipeline -"/>
                  <KCard label="Total a receber" value={fmtK(CLIENT_BILLING.reduce((a,c)=>a+c.pendente,0))} sub="NFs em aberto" color={T.warn} icon="-"/>
                  <KCard label="Total a pagar" value={fmtK(closings.filter(c=>c.status==="aprovado"&&!c.pago).reduce((a,c)=>a+c.value,0))} sub="comissões aprovadas" color={T.danger} icon="-" onClick={()=>setTab("comissoes")} hint="Ver comissões -"/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12,marginBottom:12}}>
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:20}}>
                    <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:14}}>Campanhas em andamento</div>
                    {campsAtivas.map(c=>{const td=tasksDone(c.tasks);const s=STAGES_CAMP.find(x=>x.id===c.stage);return(
                      <div key={c.id} className="hr" onClick={()=>setSelCamp(c)} style={{padding:"10px 8px",borderRadius:8,marginBottom:4}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                          <div><div style={{fontSize:12,fontWeight:700,fontFamily:"Arial,sans-serif"}}>{c.name}</div><div style={{fontSize:9,color:T.muted}}>{c.region} · {c.project}</div></div>
                          <Badge label={s.label} color={s.color}/>
                        </div>
                        <div style={{display:"flex",gap:10,alignItems:"center"}}>
                          <div style={{flex:1}}><PBar pct={c.progress} color={s.color}/></div>
                          <span style={{fontSize:9,color:T.muted}}>{td.done}/{td.total}</span>
                        </div>
                      </div>
                    );})}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:12}}>
                    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:20}}>
                      <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:14}}>Pendências por setor</div>
                      {Object.keys(SEC_LABEL).filter(s=>["comercial","financeiro","marketing","base"].includes(s)).map(s=>{
                        const pend=camps.flatMap(c=>c.tasks[s]?.filter(t=>!t.done)||[]).length;
                        return(
                          <div key={s} onClick={()=>{setTab("minha-fila");setQueueFilter(pend>0?"pendentes":"todos");}} className="hr" style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${T.border}`,cursor:"pointer",borderRadius:4}}>
                            <span style={{fontSize:10,color:SEC_COLOR[s]}}>{SEC_LABEL[s]}</span>
                            <div style={{background:pend>0?T.danger+"22":T.accentDim,color:pend>0?T.danger:T.accent,border:`1px solid ${pend>0?T.danger+"44":T.accentBorder}`,borderRadius:7,padding:"2px 8px",fontSize:9,fontWeight:700}}>{pend>0?`${pend} pendente${pend>1?"s":""}` :"Em dia -"}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{background:T.card,border:`1px solid ${T.warnDim}`,borderLeft:`3px solid ${T.warn}`,borderRadius:12,padding:16}}>
                      <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:11,color:T.warn,marginBottom:10}}>Prazos próximos</div>
                      {[{camp:"T4F - Maio 2025",prazo:"Gráfica: 08/05",dias:5,id:4},{camp:"O Boticário - Maio",prazo:"Logística: 02/05",dias:1,id:1}].map((a,i)=>(
                        <div key={i} onClick={()=>{const c=camps.find(x=>x.id===a.id);if(c)setSelCamp(c);}} className="hr" style={{marginBottom:8,padding:"5px 4px",borderRadius:6,cursor:"pointer"}}>
                          <div style={{fontSize:11,fontWeight:600}}>{a.camp}</div>
                          <div style={{fontSize:9,color:T.warn}}>{a.prazo} · {a.dias}d restantes</div>
                        </div>
                      ))}
                      {basePartners.filter(p=>p.contrato.status==="expirando").map((p,i)=>(
                        <div key={`c${i}`} onClick={()=>{setTab("base");setBaseTab("contratos");}} className="hr" style={{marginBottom:8,padding:"5px 4px",borderRadius:6,cursor:"pointer"}}>
                          <div style={{fontSize:11,fontWeight:600}}>{p.name}</div>
                          <div style={{fontSize:9,color:T.danger}}>Contrato expira {p.contrato.expiraEm}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Metas do time comercial */}
                {users.filter(u=>["comercial","admin"].includes(u.role)&&u.active&&u.meta>0).length>0&&(
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18,marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                      <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13}}>Metas do time comercial</div>
                      <div style={{fontSize:10,color:T.muted,fontFamily:"Arial,sans-serif"}}>{new Date().toLocaleDateString("pt-BR",{month:"long",year:"numeric"})}</div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:10}}>
                      {users.filter(u=>["comercial","admin"].includes(u.role)&&u.active).map(u=>{
                        const pipeline=prospects.filter(p=>p.owner===u.name).reduce((a,p)=>a+(p.value||0),0);
                        const meta=u.meta||0;
                        const pct=meta>0?Math.min(Math.round((pipeline/meta)*100),100):0;
                        return(
                          <div key={u.id}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                                <div style={{width:24,height:24,borderRadius:"50%",background:ROLE_COLOR[u.role]+"22",border:`1px solid ${ROLE_COLOR[u.role]}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:ROLE_COLOR[u.role],fontWeight:700,flexShrink:0}}>{u.avatar}</div>
                                <span style={{fontSize:11,fontWeight:600}}>{u.name}</span>
                              </div>
                              <div style={{display:"flex",gap:16,alignItems:"center"}}>
                                {meta>0?(
                                  <>
                                    <span style={{fontSize:10,color:T.info,fontFamily:"Arial,sans-serif"}}>{fmtK(pipeline)}</span>
                                    <span style={{fontSize:9,color:T.muted}}>/</span>
                                    <span style={{fontSize:10,color:T.muted,fontFamily:"Arial,sans-serif"}}>{fmtK(meta)}</span>
                                    <div style={{width:42,height:20,background:pct>=100?T.accent:pct>=70?T.info:pct>=40?T.warn:T.danger,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center"}}>
                                      <span style={{fontSize:9,color:"#000",fontWeight:700}}>{pct}%</span>
                                    </div>
                                  </>
                                ):(
                                  <span style={{fontSize:9,color:T.warn}}>Sem meta</span>
                                )}
                              </div>
                            </div>
                            {meta>0&&(
                              <div style={{height:8,background:T.surface,borderRadius:4,overflow:"hidden"}}>
                                <div style={{height:"100%",width:`${pct}%`,background:pct>=100?`linear-gradient(90deg,${T.accent},#00B87A)`:pct>=70?`linear-gradient(90deg,${T.info},${T.accent})`:pct>=40?`linear-gradient(90deg,${T.warn},${T.info})`:`linear-gradient(90deg,${T.danger},${T.warn})`,borderRadius:4,transition:"width 0.5s ease"}}/>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {/* Totalizador */}
                    {(()=>{
                      const totalMeta=users.filter(u=>["comercial","admin"].includes(u.role)&&u.active&&u.meta>0).reduce((a,u)=>a+(u.meta||0),0);
                      const totalReal=users.filter(u=>["comercial","admin"].includes(u.role)&&u.active).reduce((a,u)=>a+prospects.filter(p=>p.owner===u.name).reduce((s,p)=>s+(p.value||0),0),0);
                      const pctTotal=totalMeta>0?Math.min(Math.round((totalReal/totalMeta)*100),100):0;
                      return totalMeta>0?(
                        <div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div style={{fontSize:10,color:T.muted}}>Time completo</div>
                          <div style={{display:"flex",gap:12,alignItems:"center"}}>
                            <span style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:14,color:T.info}}>{fmtK(totalReal)}</span>
                            <span style={{fontSize:9,color:T.muted}}>de</span>
                            <span style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:14,color:T.muted}}>{fmtK(totalMeta)}</span>
                            <div style={{width:52,height:24,background:pctTotal>=100?T.accent:pctTotal>=70?T.info:T.warn,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center"}}>
                              <span style={{fontSize:11,color:"#000",fontWeight:800}}>{pctTotal}%</span>
                            </div>
                          </div>
                        </div>
                      ):null;
                    })()}
                  </div>
                )}
                {/* Receita mensal com valores */}
                <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                    <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13}}>Receita mensal</div>
                    <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:18,color:T.accent}}>{fmtK(MONTHLY_DATA.reduce((a,d)=>a+d.receita,0))}</div>
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"flex-end",height:100}}>
                    {MONTHLY_DATA.map((d,i)=>{
                      const maxVal=Math.max(...MONTHLY_DATA.map(x=>x.receita),1);
                      const h=d.receita>0?Math.round((d.receita/maxVal)*75):4;
                      return(
                        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                          {d.receita>0&&<div style={{fontSize:7,color:T.accent,fontFamily:"Arial,sans-serif",whiteSpace:"nowrap"}}>{fmtK(d.receita)}</div>}
                          <div style={{width:"70%",background:d.receita>0?`linear-gradient(180deg,${T.accent},${T.accent}88)`:T.border,borderRadius:"3px 3px 0 0",height:`${h}px`,transition:"height 0.4s"}}/>
                          <div style={{fontSize:7,color:T.muted,whiteSpace:"nowrap"}}>{d.month}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );

            // -- RENDER by role --
            if(user.role==="admin"){
              const DASH_TABS=[["geral","Geral"],["comercial","Comercial"],["marketing","Marketing"],["financeiro","Financeiro"],["operacional","Operacional"],["base","Base"]];
              return(
                <div>
                  <div style={{display:"flex",gap:0,marginBottom:20,borderBottom:`1px solid ${T.border}`}}>
                    {DASH_TABS.map(([id,l])=>(
                      <div key={id} onClick={()=>setDashTab(id)} style={{padding:"9px 16px",fontSize:11,cursor:"pointer",color:dashTab===id?T.accent:T.muted,borderBottom:`2px solid ${dashTab===id?T.accent:"transparent"}`,transition:"all 0.15s"}}>{l}</div>
                    ))}
                  </div>
                  {dashTab==="geral"&&<DashGeral/>}
                  {dashTab==="comercial"&&<DashComercial/>}
                  {dashTab==="marketing"&&<DashMarketing/>}
                  {dashTab==="financeiro"&&<DashFinanceiro/>}
                  {dashTab==="operacional"&&<DashOperacional/>}
                  {dashTab==="base"&&<DashBase/>}
                </div>
              );
            }
            if(user.role==="comercial") return <DashComercial/>;
            if(user.role==="marketing") return <DashMarketing/>;
            if(user.role==="financeiro") return <DashFinanceiro/>;
            if(user.role==="operacional") return <DashOperacional/>;
            if(user.role==="base") return <DashBase/>;
            return <DashGeral/>;
          })()}

          {/* --------------------------------------
              SPRINT 02 - MINHA FILA
          -------------------------------------- */}
          {tab==="minha-fila"&&(
            <div>
              {/* Summary header */}
              <div style={{background:`linear-gradient(135deg,${SEC_COLOR[sec]||T.accent}15,${SEC_COLOR[sec]||T.accent}08)`,border:`1px solid ${(SEC_COLOR[sec]||T.accent)}40`,borderRadius:14,padding:"20px 24px",marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:14}}>
                <div>
                  <div style={{fontSize:10,color:SEC_COLOR[sec]||T.accent,fontFamily:"Arial,sans-serif",letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>{ROLE_LABELS[user.role]} · Fila de hoje</div>
                  <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:28,color:SEC_COLOR[sec]||T.accent,marginBottom:2}}>{pendingQueue.length} tarefa{pendingQueue.length!==1?"s":""} pendente{pendingQueue.length!==1?"s":""}</div>
                  <div style={{fontSize:11,color:T.soft}}>{doneQueue.length} concluída{doneQueue.length!==1?"s":""} hoje · {myQueue.length} total</div>
                </div>
                <div style={{display:"flex",gap:16}}>
                  {[{l:"Pendentes",v:pendingQueue.length,c:pendingQueue.length>0?T.danger:T.accent},{l:"Concluídas",v:doneQueue.length,c:T.accent},{l:"Campanhas",v:new Set(myQueue.map(t=>t.campId)).size,c:T.info}].map((k,i)=>(
                    <div key={i} style={{textAlign:"center"}}>
                      <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:22,color:k.c}}>{k.v}</div>
                      <div style={{fontSize:9,color:T.muted,fontFamily:"Arial,sans-serif"}}>{k.l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filters */}
              <div style={{display:"flex",gap:6,marginBottom:16,alignItems:"center",flexWrap:"wrap"}}>
                {[["todos","Todas"],["pendentes","Pendentes"],["concluidas","Concluídas"]].map(([v,l])=>(
                  <div key={v} onClick={()=>setQueueFilter(v)} className="tb" style={{padding:"6px 12px",borderRadius:6,fontSize:10,background:queueFilter===v?(SEC_COLOR[sec]||T.accent)+"22":T.card,border:`1px solid ${queueFilter===v?(SEC_COLOR[sec]||T.accent)+"55":T.border}`,color:queueFilter===v?SEC_COLOR[sec]||T.accent:T.muted}}>{l}</div>
                ))}
                <div style={{marginLeft:"auto",fontSize:10,color:T.muted,fontFamily:"Arial,sans-serif"}}>{visibleQueue.length} tarefa{visibleQueue.length!==1?"s":""}</div>
              </div>

              {/* Queue items */}
              {visibleQueue.length===0?(
                <div style={{textAlign:"center",padding:"60px 20px",background:T.card,border:`1px solid ${T.border}`,borderRadius:12}}>
                  <div style={{fontSize:40,marginBottom:12}}>-</div>
                  <div style={{fontFamily:"Arial,sans-serif",fontSize:18,fontWeight:800,color:T.accent,marginBottom:6}}>Fila limpa!</div>
                  <div style={{fontSize:11,color:T.muted,fontFamily:"Arial,sans-serif"}}>Todas as suas tarefas estão concluídas.</div>
                </div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {visibleQueue.map((t,i)=>{
                    const campColor=STAGES_CAMP.find(s=>s.id===t.campStage)?.color||T.muted;
                    return(
                      <div key={i} style={{background:T.card,border:`1px solid ${t.done?T.border:T.border}`,borderLeft:`3px solid ${t.done?T.muted:SEC_COLOR[t.sector]||T.accent}`,borderRadius:10,padding:"14px 18px",display:"flex",gap:14,alignItems:"center",flexWrap:"wrap",opacity:t.done?0.65:1}}>
                        {/* Checkbox */}
                        <div onClick={()=>toggleTask(t.campId,t.sector,t.id,user)} style={{width:22,height:22,borderRadius:5,border:`2px solid ${t.done?T.muted:SEC_COLOR[t.sector]||T.accent}`,background:t.done?(SEC_COLOR[t.sector]||T.accent)+"22":"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,fontSize:11,color:SEC_COLOR[t.sector]||T.accent,transition:"all 0.15s"}}>
                          {t.done&&"-"}
                        </div>
                        <div style={{flex:1,minWidth:160}}>
                          <div style={{fontSize:13,fontWeight:700,fontFamily:"Arial,sans-serif",textDecoration:t.done?"line-through":"none",color:t.done?T.muted:T.text,marginBottom:4}}>{t.label}</div>
                          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                            <Badge label={t.campName} color={campColor}/>
                            <Badge label={t.project} color={T.purple}/>
                          </div>
                          {t.done&&t.doneAt&&<div style={{fontSize:9,color:T.muted,marginTop:4,fontFamily:"Arial,sans-serif"}}>Concluído em {t.doneAt}</div>}
                        </div>
                        <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
                          {!t.done&&(
                            <button onClick={()=>toggleTask(t.campId,t.sector,t.id,user)} className="btn" style={{padding:"6px 14px",background:`linear-gradient(135deg,${SEC_COLOR[t.sector]||T.accent},${SEC_COLOR[t.sector]||T.accent}AA)`,color:"#000",borderRadius:7,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:10,whiteSpace:"nowrap"}}>
                              - Concluir
                            </button>
                          )}
                          <button onClick={()=>{const c=camps.find(x=>x.id===t.campId);setSelCamp(c);}} className="btn" style={{padding:"6px 12px",background:T.surface,border:`1px solid ${T.border}`,color:T.muted,borderRadius:7,fontSize:10,whiteSpace:"nowrap"}}>
                            Ver campanha -
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* --------------------------------------
              CAMPANHAS (Sprint 03 integrated)
          -------------------------------------- */}
          {tab==="campanhas"&&(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div style={{display:"flex",gap:6}}>
                  {[["kanban","Kanban"],["lista","Lista"],["projetos","Projetos"]].map(([v,l])=>(
                    <div key={v} onClick={()=>setCampView(v)} className="tb" style={{padding:"6px 12px",borderRadius:6,fontSize:10,background:campView===v?T.accentDim:T.card,border:`1px solid ${campView===v?T.accentBorder:T.border}`,color:campView===v?T.accent:T.muted}}>{l}</div>
                  ))}
                </div>
                {["admin","comercial","operacional"].includes(user.role)&&(
                  <button className="btn" onClick={()=>{setShowNewCamp(true);setNewCampStep(1);}} style={{padding:"8px 16px",background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",borderRadius:8,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:11}}>+ Nova Campanha</button>
                )}
              </div>

              {/* ── MODAL NOVA CAMPANHA ── */}
              {showNewCamp&&(
                <div style={{position:"fixed",inset:0,background:"#000000D0",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={()=>setShowNewCamp(false)}>
                  <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,width:"100%",maxWidth:680,maxHeight:"92vh",overflow:"hidden",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>

                    {/* Header */}
                    <div style={{padding:"18px 24px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
                      <div>
                        <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:16}}>Nova Campanha</div>
                        <div style={{fontSize:9,color:T.muted,marginTop:2,fontFamily:"Arial,sans-serif"}}>Etapa {newCampStep} de 3</div>
                      </div>
                      <div style={{display:"flex",gap:6}}>
                        {[1,2,3].map(s=>(
                          <div key={s} style={{width:28,height:4,borderRadius:2,background:newCampStep>=s?T.accent:T.border,transition:"all 0.3s"}}/>
                        ))}
                      </div>
                      <div onClick={()=>setShowNewCamp(false)} style={{cursor:"pointer",color:T.muted,fontSize:20}}>×</div>
                    </div>

                    {/* Body */}
                    <div style={{flex:1,overflow:"auto",padding:"20px 24px"}}>

                      {/* ETAPA 1 — BÁSICO */}
                      {newCampStep===1&&(
                        <div style={{display:"flex",flexDirection:"column",gap:14}}>
                          <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,color:T.accent,fontSize:12,marginBottom:2}}>Informações básicas</div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                            {[["Nome da campanha","name","text",true],["Cliente","client","text",true],["Agência","agencia","text",false],["Nº PI","numPI","text",false]].map(([l,k,t,req])=>(
                              <div key={k}>
                                <div style={{fontSize:9,color:req?T.accent:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>{l}{req&&" *"}</div>
                                <input type={t} value={newCamp[k]} onChange={e=>setNewCamp(p=>({...p,[k]:e.target.value}))} style={inpS}/>
                              </div>
                            ))}
                          </div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                            <div>
                              <div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Projeto</div>
                              <select value={newCamp.project} onChange={e=>setNewCamp(p=>({...p,project:e.target.value}))} style={selS}>
                                <option value="">Selecione...</option>
                                {projects.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}
                              </select>
                            </div>
                            <div>
                              <div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Comercial Responsável</div>
                              <select value={newCamp.responsavel} onChange={e=>setNewCamp(p=>({...p,responsavel:e.target.value}))} style={selS}>
                                <option value="">Selecione...</option>
                                {users.filter(u=>["admin","comercial"].includes(u.role)&&u.active).map(u=><option key={u.id} value={u.name}>{u.name}</option>)}
                              </select>
                            </div>
                            <div>
                              <div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Região</div>
                              <input value={newCamp.region} onChange={e=>setNewCamp(p=>({...p,region:e.target.value}))} placeholder="Ex: São Paulo · SP" style={inpS}/>
                            </div>
                          </div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                            <div>
                              <div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Data início</div>
                              <input type="date" value={newCamp.startDate} onChange={e=>setNewCamp(p=>({...p,startDate:e.target.value}))} style={inpS}/>
                            </div>
                            <div>
                              <div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Data fim</div>
                              <input type="date" value={newCamp.endDate} onChange={e=>setNewCamp(p=>({...p,endDate:e.target.value}))} style={inpS}/>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ETAPA 2 — OPERACIONAL */}
                      {newCampStep===2&&(
                        <div style={{display:"flex",flexDirection:"column",gap:14}}>
                          <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,color:T.purple,fontSize:12,marginBottom:2}}>Operacional & Produção</div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                            <div>
                              <div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Gráfica</div>
                              <select value={newCamp.graficaFornecedor} onChange={e=>setNewCamp(p=>({...p,graficaFornecedor:e.target.value}))} style={selS}>
                                <option value="">Selecione...</option>
                                {suppliers.filter(s=>s.type==="grafica").map(s=><option key={s.id} value={s.name}>{s.name}</option>)}
                                <option value="Outro">Outro</option>
                              </select>
                            </div>
                            <div>
                              <div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Material</div>
                              <input value={newCamp.material} onChange={e=>setNewCamp(p=>({...p,material:e.target.value}))} placeholder="Ex: Sacola kraft 30x40" style={inpS}/>
                            </div>
                            <div>
                              <div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Prazo gráfica</div>
                              <input type="date" value={newCamp.graficaPrazo} onChange={e=>setNewCamp(p=>({...p,graficaPrazo:e.target.value}))} style={inpS}/>
                            </div>
                          </div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                            <div>
                              <div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Logística</div>
                              <select value={newCamp.logistica} onChange={e=>setNewCamp(p=>({...p,logistica:e.target.value}))} style={selS}>
                                <option value="">Selecione...</option>
                                {suppliers.filter(s=>s.type==="logistica").map(s=><option key={s.id} value={s.name}>{s.name}</option>)}
                                <option value="Outro">Outro</option>
                              </select>
                            </div>
                            <div>
                              <div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Fornecedor logística</div>
                              <input value={newCamp.logisticaFornecedor} onChange={e=>setNewCamp(p=>({...p,logisticaFornecedor:e.target.value}))} placeholder="Nome do fornecedor" style={inpS}/>
                            </div>
                            <div>
                              <div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Prazo logística</div>
                              <input type="date" value={newCamp.logisticaPrazo} onChange={e=>setNewCamp(p=>({...p,logisticaPrazo:e.target.value}))} style={inpS}/>
                            </div>
                          </div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                            <div>
                              <div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Nº de parceiros</div>
                              <input type="number" value={newCamp.parceiros} onChange={e=>setNewCamp(p=>({...p,parceiros:e.target.value}))} placeholder="0" style={inpS}/>
                            </div>
                            <div>
                              <div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Qtd de embalagens</div>
                              <input type="number" value={newCamp.sacolas} onChange={e=>setNewCamp(p=>({...p,sacolas:e.target.value}))} placeholder="0" style={inpS}/>
                            </div>
                            <div>
                              <div style={{fontSize:9,color:T.accent,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Valor Líquido (R$)</div>
                              <input type="number" value={newCamp.valorLiquido} onChange={e=>setNewCamp(p=>({...p,valorLiquido:e.target.value}))} placeholder="0,00" style={inpS}/>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ETAPA 3 — BRIEFING & SEGMENTOS */}
                      {newCampStep===3&&(
                        <div style={{display:"flex",flexDirection:"column",gap:16}}>
                          <div>
                            <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,color:T.warn,fontSize:12,marginBottom:10}}>Briefing da campanha</div>
                            <textarea value={newCamp.briefing} onChange={e=>setNewCamp(p=>({...p,briefing:e.target.value}))} placeholder="Descreva o briefing completo da campanha — objetivos, público-alvo, diretrizes criativas, observações importantes..." rows={6} style={{...inpS,width:"100%",resize:"vertical",lineHeight:1.6}}/>
                          </div>
                          <div>
                            <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,color:T.info,fontSize:12,marginBottom:10}}>Segmentos de parceiro</div>
                            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                              {["Hamburguer","Pizza","Japonesa","Açaí","Café","Padaria","Churrascaria","Regional","Sobremesa","Bar","Restaurante","Sorvete","Saudável","Petshop","Farmácia"].map(seg=>{
                                const sel=newCamp.segments.includes(seg);
                                return(
                                  <div key={seg} onClick={()=>setNewCamp(p=>({...p,segments:sel?p.segments.filter(s=>s!==seg):[...p.segments,seg]}))} style={{padding:"6px 14px",borderRadius:20,cursor:"pointer",border:`1px solid ${sel?T.info+"88":T.border}`,background:sel?T.infoDim:T.surface,color:sel?T.info:T.muted,fontSize:11,fontFamily:"Arial,sans-serif",transition:"all 0.15s"}}>
                                    {seg}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div style={{padding:"14px 24px",borderTop:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",flexShrink:0}}>
                      <button onClick={()=>newCampStep>1?setNewCampStep(s=>s-1):setShowNewCamp(false)} style={{padding:"8px 16px",background:T.card,border:`1px solid ${T.border}`,color:T.muted,borderRadius:8,cursor:"pointer",fontSize:11}}>
                        {newCampStep>1?"← Voltar":"Cancelar"}
                      </button>
                      {newCampStep<3
                        ?<button onClick={()=>{if(newCampStep===1&&(!newCamp.name||!newCamp.client))return;setNewCampStep(s=>s+1);}} style={{padding:"8px 20px",background:newCampStep===1&&(!newCamp.name||!newCamp.client)?T.border:`linear-gradient(135deg,${T.accent},#00B87A)`,color:newCampStep===1&&(!newCamp.name||!newCamp.client)?T.muted:"#000",borderRadius:8,cursor:"pointer",fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:11,border:"none"}}>
                            Próximo →
                          </button>
                        :<button onClick={createCamp} style={{padding:"8px 20px",background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",borderRadius:8,cursor:"pointer",fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:11,border:"none"}}>
                            Criar Campanha ✓
                          </button>
                      }
                    </div>
                  </div>
                </div>
              )}

              {campView==="kanban"&&(
                <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,alignItems:"start"}}>
                  {STAGES_CAMP.map(stage=>(
                    <div key={stage.id}
                      data-kanban-col={stage.id}
                      className={`drop-col${dragOverCampStage===stage.id?" drag-over":""}`}
                      onDragOver={e=>onCampDragOver(e,stage.id)}
                      onDrop={e=>onCampDrop(e,stage.id)}
                      onDragLeave={()=>setDragOverCampStage(null)}
                      style={{padding:"6px",minHeight:120}}>
                      <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:8,padding:"0 2px"}}>
                        <div style={{width:6,height:6,borderRadius:"50%",background:stage.color}}/>
                        <span style={{fontSize:9,color:stage.color,fontFamily:"Arial,sans-serif",textTransform:"uppercase"}}>{stage.label}</span>
                        <span style={{fontSize:8,color:T.muted,marginLeft:"auto"}}>{camps.filter(c=>c.stage===stage.id).length}</span>
                        {dragOverCampStage===stage.id&&<span style={{fontSize:8,color:stage.color,animation:"pl 1s infinite"}}>-</span>}
                      </div>
                      {camps.filter(c=>c.stage===stage.id).map(c=>{
                        const td=tasksDone(c.tasks);
                        const isDragging=dragCampId===c.id||touchDrag?.id===c.id;
                        return(
                          <div key={c.id}
                            className={`drag-card${isDragging?" dragging":""}`}
                            draggable
                            onDragStart={e=>{ onCampDragStart(e,c.id); setDragCampId(c.id); }}
                            onDragEnd={onCampDragEnd}
                            onTouchStart={e=>{ onTouchStart(e,"camp",c.id); setDragCampId(c.id); }}
                            onTouchMove={e=>onTouchMove(e,"camp")}
                            onTouchEnd={e=>onTouchEnd(e,"camp")}
                            onClick={()=>!isDragging&&setSelCamp(c)}
                            style={{background:T.card,border:`1px solid ${isDragging?stage.color+"88":T.border}`,borderLeft:`3px solid ${stage.color}`,borderRadius:10,padding:"12px 13px",marginBottom:8,boxShadow:isDragging?`0 8px 24px ${stage.color}33`:"none",userSelect:"none",touchAction:"none"}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                              <div style={{fontSize:9,color:T.purple,fontFamily:"Arial,sans-serif",flex:1}}>{c.project||"—"}</div>
                              {!c.graficaFornecedor&&<div title="Operacional pendente" style={{fontSize:8,color:T.warn,background:T.warnDim,padding:"1px 5px",borderRadius:3,whiteSpace:"nowrap"}}>Op. pendente</div>}
                            </div>
                            <div style={{fontSize:12,fontWeight:700,fontFamily:"Arial,sans-serif",marginBottom:2,lineHeight:1.3}}>{c.name}</div>
                            <div style={{fontSize:9,color:T.soft,marginBottom:1}}>{c.client}</div>
                            {c.agencia&&<div style={{fontSize:8,color:T.muted,fontFamily:"Arial,sans-serif",marginBottom:6}}>{c.agencia}</div>}
                            {!c.agencia&&<div style={{marginBottom:4}}/>}

                            {/* Bloco operacional */}
                            {(c.graficaFornecedor||c.material||c.logistica||c.sacolas)?(
                              <div style={{background:T.surface,borderRadius:6,padding:"7px 8px",marginBottom:7,fontSize:8,color:T.muted,fontFamily:"Arial,sans-serif",display:"flex",flexDirection:"column",gap:3}}>
                                {c.graficaFornecedor&&<div style={{display:"flex",gap:4}}><span style={{color:T.purple}}>Grá:</span><span style={{color:T.soft}}>{c.graficaFornecedor}</span></div>}
                                {c.material&&<div style={{display:"flex",gap:4}}><span style={{color:T.purple}}>Mat:</span><span style={{color:T.soft,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.material}</span></div>}
                                {c.logistica&&<div style={{display:"flex",gap:4}}><span style={{color:T.info}}>Log:</span><span style={{color:T.soft}}>{c.logistica}</span></div>}
                                {c.sacolas>0&&<div style={{display:"flex",gap:4}}><span style={{color:T.accent}}>Emb:</span><span style={{color:T.soft}}>{c.sacolas.toLocaleString("pt-BR")}</span></div>}
                                {c.valorLiquido>0&&<div style={{display:"flex",gap:4}}><span style={{color:T.accent}}>Val:</span><span style={{color:T.accent,fontWeight:700}}>R${c.valorLiquido.toLocaleString("pt-BR")}</span></div>}
                              </div>
                            ):(
                              <div style={{background:T.warnDim,border:`1px solid ${T.warn}33`,borderRadius:6,padding:"5px 8px",marginBottom:7,fontSize:8,color:T.warn,fontFamily:"Arial,sans-serif"}}>
                                Operacional não preenchido
                              </div>
                            )}

                            <PBar pct={c.progress} color={stage.color} h={4}/>
                            <div style={{display:"flex",justifyContent:"space-between",marginTop:5,gap:6}}>
                              <span style={{fontSize:8,color:T.muted,fontFamily:"Arial,sans-serif"}}>{td.done}/{td.total} tarefas</span>
                              <div style={{display:"flex",gap:4}}>
                                {c.files.length>0&&<span style={{fontSize:8,color:T.purple}}>-{c.files.length}</span>}
                                {c.timeline.length>0&&<span style={{fontSize:8,color:T.soft}}>-{c.timeline.length}</span>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {dragOverCampStage===stage.id&&(dragCampId||touchDrag)&&(
                        <div style={{height:60,border:`2px dashed ${stage.color}55`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:stage.color,opacity:0.6}}>Soltar aqui</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {campView==="lista"&&(
                <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
                  <div style={{display:"grid",gridTemplateColumns:"2fr 0.8fr 1fr 1fr 0.8fr 0.7fr 0.6fr",padding:"10px 16px",borderBottom:`1px solid ${T.border}`,gap:8}}>
                    {["Campanha","Projeto","Região","Etapa","Progresso","Tarefas","Arquivos"].map(h=>(
                      <div key={h} style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:1.5,fontFamily:"Arial,sans-serif"}}>{h}</div>
                    ))}
                  </div>
                  {camps.map(c=>{const s=STAGES_CAMP.find(x=>x.id===c.stage);const td=tasksDone(c.tasks);return(
                    <div key={c.id} className="hr" onClick={()=>setSelCamp(c)} style={{display:"grid",gridTemplateColumns:"2fr 0.8fr 1fr 1fr 0.8fr 0.7fr 0.6fr",padding:"12px 16px",borderBottom:`1px solid ${T.border}`,gap:8,alignItems:"center"}}>
                      <div><div style={{fontSize:12,fontWeight:700,fontFamily:"Arial,sans-serif"}}>{c.name}</div><div style={{fontSize:9,color:T.muted}}>{c.client}</div></div>
                      <Badge label={c.project} color={T.purple}/>
                      <div style={{fontSize:10,color:T.soft,fontFamily:"Arial,sans-serif"}}>{c.region}</div>
                      <Badge label={s.label} color={s.color}/>
                      <div><PBar pct={c.progress} color={s.color}/><div style={{fontSize:8,color:T.muted,marginTop:2}}>{c.progress}%</div></div>
                      <div style={{fontSize:10,color:td.done===td.total?T.accent:T.muted,fontFamily:"Arial,sans-serif",fontWeight:700}}>{td.done}/{td.total}</div>
                      <div style={{fontSize:10,color:T.purple}}>- {c.files.length}</div>
                    </div>
                  );})}
                </div>
              )}

              {/* PROJETOS VIEW */}
              {campView==="projetos"&&(
                <div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
                    {projects.map(proj=>{
                      const projCamps=camps.filter(c=>c.project===proj.name);
                      const done=projCamps.filter(c=>c.stage===5).length;
                      const emAndamento=projCamps.filter(c=>c.stage>1&&c.stage<5).length;
                      const totalVal=projCamps.reduce((a,c)=>a+(c.valorLiquido||0),0);
                      return(
                        <div key={proj.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"16px 18px",cursor:"pointer"}} onClick={()=>{setCampView("kanban");}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                            <div>
                              <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:14,marginBottom:3}}>{proj.name}</div>
                              <div style={{fontSize:9,color:T.muted,fontFamily:"Arial,sans-serif"}}>{projCamps.length} campanha{projCamps.length!==1?"s":""}</div>
                            </div>
                            <div style={{fontSize:9,padding:"3px 8px",borderRadius:4,background:proj.active?T.accentDim:T.border,color:proj.active?T.accent:T.muted,border:`1px solid ${proj.active?T.accentBorder:T.border}`}}>
                              {proj.active?"Ativo":"Inativo"}
                            </div>
                          </div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
                            {[["Em andamento",emAndamento,T.info],["Finalizadas",done,T.accent],["Pendentes",projCamps.filter(c=>c.stage===1).length,T.warn]].map(([l,v,c])=>(
                              <div key={l} style={{background:T.surface,borderRadius:8,padding:"8px 10px",textAlign:"center"}}>
                                <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:18,color:c}}>{v}</div>
                                <div style={{fontSize:8,color:T.muted}}>{l}</div>
                              </div>
                            ))}
                          </div>
                          {totalVal>0&&<div style={{fontSize:10,color:T.accent,fontFamily:"Arial,sans-serif",marginBottom:8}}>R$ {totalVal.toLocaleString("pt-BR")} em valor líquido</div>}
                          <div style={{display:"flex",flexDirection:"column",gap:4}}>
                            {projCamps.slice(0,3).map(c=>{
                              const s=STAGES_CAMP.find(x=>x.id===c.stage);
                              return(
                                <div key={c.id} onClick={e=>{e.stopPropagation();setSelCamp(c);}} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 8px",background:T.surface,borderRadius:6,cursor:"pointer"}}>
                                  <div style={{fontSize:10,fontWeight:600}}>{c.name}</div>
                                  <div style={{fontSize:8,color:s?.color,background:s?.color+"22",padding:"2px 6px",borderRadius:3}}>{s?.label}</div>
                                </div>
                              );
                            })}
                            {projCamps.length>3&&<div style={{fontSize:9,color:T.muted,textAlign:"center"}}>+{projCamps.length-3} mais</div>}
                          </div>
                          <button onClick={e=>{e.stopPropagation();setNewCamp(p=>({...p,project:proj.name}));setShowNewCamp(true);setNewCampStep(1);}} style={{marginTop:10,width:"100%",padding:"7px",background:T.accentDim,border:`1px solid ${T.accentBorder}`,color:T.accent,borderRadius:7,cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:"Arial,sans-serif"}}>
                            + Nova campanha neste projeto
                          </button>
                        </div>
                      );
                    })}
                    {/* Card criar novo projeto */}
                    <div style={{background:"transparent",border:`2px dashed ${T.border}`,borderRadius:12,padding:"16px 18px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,minHeight:120,cursor:"pointer"}}
                         onClick={()=>{const n=prompt("Nome do novo projeto:");if(n?.trim()){const rec={id:Date.now(),name:n.trim(),active:true};setProjects(p=>[...p,rec]);supabase.from("projects").insert(rec);}}}>
                      <div style={{fontSize:24,color:T.muted}}>+</div>
                      <div style={{fontSize:11,color:T.muted,fontFamily:"Arial,sans-serif"}}>Novo projeto</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --------------------------------------
              CALENDARIO DE CAMPANHAS
          -------------------------------------- */}
          {tab==="calendario"&&(()=>{
            const MONTHS_PT=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
            const DAYS_PT=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
            const firstDay=new Date(calYear,calMonth,1).getDay();
            const daysInMonth=new Date(calYear,calMonth+1,0).getDate();
            const daysInPrev=new Date(calYear,calMonth,0).getDate();
            // Parse dd/MM/yyyy to Date
            const parseDate=(s)=>{ if(!s)return null; const[d,m,y]=s.split("/"); return new Date(Number(y),Number(m)-1,Number(d)); };
            // Get campaigns active on a given day of this month
            const campsOnDay=(day)=>{
              const dt=new Date(calYear,calMonth,day);
              return camps.filter(c=>{
                const s=parseDate(c.startDate),e=parseDate(c.endDate);
                return s&&e&&dt>=s&&dt<=e;
              });
            };
            // List view: all camps sorted by startDate
            const sortedCamps=[...camps].sort((a,b)=>{
              const sa=parseDate(a.startDate),sb=parseDate(b.startDate);
              return (sa||0)-(sb||0);
            });
            // Prev/next month
            const prevMonth=()=>{ if(calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1); };
            const nextMonth=()=>{ if(calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1); };
            // Deadline conflicts: campaigns ending within 3 days of another starting
            const conflicts=camps.filter(c=>{
              const e=parseDate(c.endDate);
              if(!e)return false;
              return camps.some(o=>{ if(o.id===c.id)return false; const s=parseDate(o.startDate); return s&&Math.abs(e-s)<3*86400000; });
            }).map(c=>c.id);

            return(
              <div>
                {/* Header */}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <button onClick={prevMonth} className="btn" style={{width:32,height:32,background:T.card,border:`1px solid ${T.border}`,borderRadius:8,color:T.soft,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>{"<"}</button>
                    <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:20,minWidth:180,textAlign:"center"}}>{MONTHS_PT[calMonth]} {calYear}</div>
                    <button onClick={nextMonth} className="btn" style={{width:32,height:32,background:T.card,border:`1px solid ${T.border}`,borderRadius:8,color:T.soft,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>{">"}</button>
                    <button onClick={()=>{setCalMonth(new Date().getMonth());setCalYear(new Date().getFullYear());}} className="btn" style={{padding:"6px 12px",background:T.accentDim,border:`1px solid ${T.accentBorder}`,borderRadius:7,fontSize:10,color:T.accent,fontFamily:"Arial,sans-serif"}}>Hoje</button>
                  </div>
                  {/* Legend */}
                  <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                    {STAGES_CAMP.map(s=>(
                      <div key={s.id} style={{display:"flex",gap:5,alignItems:"center"}}>
                        <div style={{width:10,height:10,borderRadius:3,background:s.color+"88"}}/>
                        <span style={{fontSize:9,color:T.muted}}>{s.label}</span>
                      </div>
                    ))}
                    <div style={{display:"flex",gap:5,alignItems:"center"}}>
                      <div style={{width:10,height:10,borderRadius:3,background:T.danger+"88",border:`1px solid ${T.danger}`}}/>
                      <span style={{fontSize:9,color:T.muted}}>Conflito de prazo</span>
                    </div>
                  </div>
                </div>

                {/* KPIs */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
                  {[
                    {l:"Campanhas no mês",v:camps.filter(c=>{const s=parseDate(c.startDate),e=parseDate(c.endDate);const ms=new Date(calYear,calMonth,1),me=new Date(calYear,calMonth+1,0);return s&&e&&s<=me&&e>=ms;}).length,c:T.accent},
                    {l:"Em andamento",v:camps.filter(c=>c.stage<5).length,c:T.info},
                    {l:"Finalizadas",v:camps.filter(c=>c.stage===5).length,c:T.purple},
                    {l:"Conflitos de prazo",v:conflicts.length,c:conflicts.length>0?T.danger:T.accent},
                  ].map((k,i)=>(
                    <div key={i} style={{background:T.card,border:`1px solid ${k.c}33`,borderRadius:10,padding:"14px 16px"}}>
                      <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:22,color:k.c}}>{k.v}</div>
                      <div style={{fontSize:9,color:T.muted,marginTop:2,fontFamily:"Arial,sans-serif"}}>{k.l}</div>
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,overflow:"hidden",marginBottom:20}}>
                  {/* Day headers */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",borderBottom:`1px solid ${T.border}`}}>
                    {DAYS_PT.map(d=>(
                      <div key={d} style={{padding:"10px 0",textAlign:"center",fontSize:9,color:T.muted,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1,background:T.surface}}>{d}</div>
                    ))}
                  </div>
                  {/* Day cells */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
                    {/* Prev month filler */}
                    {Array.from({length:firstDay}).map((_,i)=>(
                      <div key={"prev"+i} style={{minHeight:90,padding:"8px 10px",borderRight:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`,opacity:0.3}}>
                        <div style={{fontSize:11,color:T.muted}}>{daysInPrev-firstDay+i+1}</div>
                      </div>
                    ))}
                    {/* Current month days */}
                    {Array.from({length:daysInMonth}).map((_,i)=>{
                      const day=i+1;
                      const isToday=new Date().getDate()===day&&new Date().getMonth()===calMonth&&new Date().getFullYear()===calYear;
                      const dayCamps=campsOnDay(day);
                      const isStart=(c)=>{ const s=parseDate(c.startDate); return s&&s.getDate()===day&&s.getMonth()===calMonth&&s.getFullYear()===calYear; };
                      const isEnd=(c)=>{ const e=parseDate(c.endDate); return e&&e.getDate()===day&&e.getMonth()===calMonth&&e.getFullYear()===calYear; };
                      return(
                        <div key={day} style={{minHeight:90,padding:"8px 6px",borderRight:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`,background:isToday?T.accentDim:"transparent",position:"relative",cursor:dayCamps.length>0?"pointer":"default",transition:"background 0.1s"}}
                          onMouseEnter={()=>setCalHover(day)} onMouseLeave={()=>setCalHover(null)}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                            <div style={{width:22,height:22,borderRadius:"50%",background:isToday?T.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                              <span style={{fontSize:11,fontWeight:isToday?800:400,color:isToday?"#000":T.soft,fontFamily:"Arial,sans-serif"}}>{day}</span>
                            </div>
                            {dayCamps.length>2&&<span style={{fontSize:7,color:T.muted,fontFamily:"Arial,sans-serif"}}>+{dayCamps.length-2}</span>}
                          </div>
                          {/* Campaign bars */}
                          <div style={{display:"flex",flexDirection:"column",gap:2}}>
                            {dayCamps.slice(0,2).map(c=>{
                              const stg=STAGES_CAMP.find(s=>s.id===c.stage);
                              const hasConflict=conflicts.includes(c.id);
                              const startDay=isStart(c);
                              const endDay=isEnd(c);
                              return(
                                <div key={c.id} onClick={()=>setSelCamp(c)}
                                  title={c.name+" ("+c.startDate+" - "+c.endDate+")"}
                                  style={{height:18,background:hasConflict?T.danger+"88":stg?.color+"88",border:`1px solid ${hasConflict?T.danger:stg?.color}66`,borderRadius:endDay&&startDay?4:startDay?"4px 0 0 4px":endDay?"0 4px 4px 0":"0",padding:"2px 5px",fontSize:8,color:"#fff",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis",cursor:"pointer",fontWeight:600,boxShadow:hasConflict?"0 0 6px "+T.danger+"66":"none"}}>
                                  {startDay?c.client:""}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                    {/* Next month filler */}
                    {Array.from({length:(7-((firstDay+daysInMonth)%7))%7}).map((_,i)=>(
                      <div key={"next"+i} style={{minHeight:90,padding:"8px 10px",borderRight:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`,opacity:0.3}}>
                        <div style={{fontSize:11,color:T.muted}}>{i+1}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* List view - all campaigns */}
                <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,overflow:"hidden"}}>
                  <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.border}`,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13}}>Todas as campanhas</div>
                  {sortedCamps.map(c=>{
                    const stg=STAGES_CAMP.find(s=>s.id===c.stage);
                    const hasConflict=conflicts.includes(c.id);
                    const start=parseDate(c.startDate);
                    const end=parseDate(c.endDate);
                    const dur=start&&end?Math.round((end-start)/86400000)+1:0;
                    const isActive=c.stage<5;
                    return(
                      <div key={c.id} className="hr" onClick={()=>setSelCamp(c)}
                        style={{display:"flex",gap:14,alignItems:"center",padding:"13px 18px",borderBottom:`1px solid ${T.border}`,borderLeft:`4px solid ${hasConflict?T.danger:stg?.color}`,flexWrap:"wrap"}}>
                        <div style={{flex:1,minWidth:160}}>
                          <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4,flexWrap:"wrap"}}>
                            <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12}}>{c.name}</div>
                            {hasConflict&&<span style={{fontSize:8,padding:"1px 6px",borderRadius:4,background:T.danger+"22",color:T.danger,border:`1px solid ${T.danger}44`}}>Conflito de prazo</span>}
                          </div>
                          <div style={{fontSize:10,color:T.muted}}>{c.startDate} - {c.endDate} · {dur} dias · {c.region}</div>
                        </div>
                        <div style={{display:"flex",gap:10,alignItems:"center",flexShrink:0}}>
                          {/* Timeline bar */}
                          <div style={{width:120}}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                              <span style={{fontSize:8,color:T.muted}}>{c.startDate}</span>
                              <span style={{fontSize:8,color:T.muted}}>{c.endDate}</span>
                            </div>
                            <div style={{height:6,background:T.border,borderRadius:3}}>
                              <div style={{height:"100%",width:c.progress+"%",background:stg?.color,borderRadius:3}}/>
                            </div>
                          </div>
                          <div style={{display:"flex",gap:6,alignItems:"center"}}>
                            <span style={{fontSize:9,padding:"3px 8px",borderRadius:5,background:stg?.color+"22",color:stg?.color,border:`1px solid ${stg?.color}44`,fontFamily:"Arial,sans-serif"}}>{stg?.label}</span>
                            <span style={{fontSize:9,color:T.muted,fontFamily:"Arial,sans-serif"}}>{c.progress}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* --------------------------------------
              MODULO FINANCEIRO COMPLETO
          -------------------------------------- */}
          {tab==="financeiro-modulo"&&(()=>{
            // Modal de edição de lançamento
            const EditLancModal=editLanc?(<div style={{position:"fixed",inset:0,background:"#00000088",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setEditLanc(null)}>
              <div style={{background:"#fff",borderRadius:12,padding:24,width:520,maxWidth:"95vw",boxShadow:"0 20px 60px #00000033"}} onClick={e=>e.stopPropagation()}>
                <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:16,color:"#1a1a2e",marginBottom:16}}>Editar Lançamento</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                  {[["Data","data"],["Descrição","descricao"],["Entrada (R$)","entrada"],["Saída (R$)","saida"],["Categoria","categoria"],["Centro de custo","centrosCusto"]].map(([l,k])=>(
                    <div key={k} style={{gridColumn:k==="descricao"?"1/3":"auto"}}>
                      <div style={{fontSize:9,color:"#666",marginBottom:3,textTransform:"uppercase",letterSpacing:1}}>{l}</div>
                      <input value={editLanc[k]||""} onChange={e=>setEditLanc(p=>({...p,[k]:e.target.value}))} style={{width:"100%",border:"1px solid #ddd",borderRadius:6,padding:"7px 10px",fontSize:12,fontFamily:"Arial,sans-serif",outline:"none"}}/>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                  <button onClick={()=>setEditLanc(null)} style={{padding:"8px 16px",background:"#f0f0f0",border:"none",borderRadius:7,cursor:"pointer",fontSize:11}}>Cancelar</button>
                  <button onClick={async()=>{
                    const upd={...editLanc,entrada:Number(editLanc.entrada)||0,saida:Number(editLanc.saida)||0};
                    setLancamentos(p=>p.map(x=>x.id===upd.id?upd:x));
                    await supabase.from("lancamentos").update(upd).eq("id",upd.id);
                    setEditLanc(null);
                  }} style={{padding:"8px 20px",background:"#1a4a7a",color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontWeight:700,fontSize:11}}>Salvar</button>
                  <button onClick={async()=>{if(!window.confirm("Excluir este lançamento?"))return;setLancamentos(p=>p.filter(x=>x.id!==editLanc.id));await supabase.from("lancamentos").delete().eq("id",editLanc.id);setEditLanc(null);}} style={{padding:"8px 16px",background:"#fee2e2",color:"#dc2626",border:"none",borderRadius:7,cursor:"pointer",fontSize:11}}>Excluir</button>
                </div>
              </div>
            </div>):null;

            // Computed values
            const mesLanc=lancamentos.filter(l=>l.data.endsWith(finMesRef.replace("/","/2026").slice(-7))||l.data.slice(3).startsWith(finMesRef.split("/").reverse().join("/")));
            const lancMes=lancamentos.filter(l=>{ const parts=l.data.split("/"); return parts[1]+"/"+parts[2]===finMesRef.split("/")[0]+"/"+finMesRef.split("/")[1]||l.data.slice(3,10)===finMesRef.split("/").reverse().join("/"); });
            // simpler: filter by MM/YYYY in data field
            const filterByMes=(arr)=>arr.filter(l=>{ const d=l.data; const mm=d.slice(3,5); const yy=d.slice(6,10); return mm+"/"+yy===finMesRef; });
            const lancMesFilt=filterByMes(lancamentos);
            const totalEntradas=lancMesFilt.filter(l=>l.tipo!=="Saldo Anterior").reduce((a,l)=>a+(l.entrada||0),0);
            const totalSaidas=lancMesFilt.filter(l=>l.tipo!=="Saldo Anterior").reduce((a,l)=>a+(l.saida||0),0);
            const lucroMes=totalEntradas-totalSaidas;
            // Saldo acumulado = seed inicial (Saldo Anterior mais antigo) + todos lançamentos antes deste mês
            const [mmRef,aaRef]=finMesRef.split("/");
            const seedInicial=lancamentos
              .filter(l=>l.tipo==="Saldo Anterior")
              .reduce((a,l)=>a+(l.entrada||0)-(l.saida||0),0);
            const movimentosAnteriores=lancamentos
              .filter(l=>l.tipo!=="Saldo Anterior")
              .filter(l=>{const p=l.data.split("/");return p.length>=3&&(p[2]<aaRef||(p[2]===aaRef&&p[1]<mmRef));})
              .reduce((a,l)=>a+(l.entrada||0)-(l.saida||0),0);
            const saldoAcumuladoAnterior=seedInicial+movimentosAnteriores;
            const saldoMesFinal=saldoAcumuladoAnterior+lucroMes;
            const saldoTotal=contas.reduce((a,c)=>a+c.saldo,0);
            // RBT12 calc
            const rbt12=fatMensais.slice(-12).reduce((a,f)=>a+f.fat,0);
            const{faixa,aliquotaEfetiva}=calcAliquotaEfetiva(rbt12);
            const aliqDisplay=(dasAjuste!==null?dasAjuste:aliquotaEfetiva*100).toFixed(2);
            const aliqVal=dasAjuste!==null?dasAjuste/100:aliquotaEfetiva;
            // Reserva e distribuicao
            const reserva=lucroMes*(reservaCaixaPct/100);
            const paraDividir=Math.max(0,lucroMes-reserva);
            // Cartao totals
            const totalCartao=comprasCartao.reduce((a,c)=>a+(c.valorParcela*(c.parcelas-c.parcelaAtual+1)),0);
            const proximoMesCartao=comprasCartao.filter(c=>c.parcelaAtual<=c.parcelas).reduce((a,c)=>a+c.valorParcela,0);

            const FIN_TABS=[["visao","Visao Geral"],["fluxo","Fluxo de Caixa"],["cartoes","Cartoes"],["das","DAS / Simples"],["distribuicao","Distribuicao"],["config","Configuracoes"]];

            return(
              <div>
                {EditLancModal}
                {/* Sub-tabs */}
                <div style={{display:"flex",gap:0,marginBottom:20,borderBottom:`1px solid ${T.border}`,overflowX:"auto"}}>
                  {FIN_TABS.map(([id,l])=>(
                    <div key={id} onClick={()=>setFinTab(id)} style={{padding:"9px 16px",fontSize:11,cursor:"pointer",color:finTab===id?T.accent:T.muted,borderBottom:`2px solid ${finTab===id?T.accent:"transparent"}`,transition:"all 0.15s",whiteSpace:"nowrap"}}>{l}</div>
                  ))}
                </div>

                {/* MES SELECTOR */}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
                  <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:14}}>Referencia: {finMesRef}</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {["01","02","03","04","05","06","07","08","09","10","11","12"].map(m=>{
                      const yr=finMesRef.split("/")[1]||"2026";
                      const key=m+"/"+yr;
                      return <button key={key} onClick={()=>setFinMesRef(key)} className="btn" style={{padding:"4px 10px",fontSize:10,borderRadius:6,background:finMesRef===key?T.accentDim:"transparent",border:`1px solid ${finMesRef===key?T.accentBorder:T.border}`,color:finMesRef===key?T.accent:T.muted,cursor:"pointer"}}>{["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"][Number(m)-1]}</button>;
                    })}
                    {["2025","2026"].map(yr=>(
                      <button key={yr} onClick={()=>setFinMesRef(finMesRef.split("/")[0]+"/"+yr)} className="btn" style={{padding:"4px 10px",fontSize:10,borderRadius:6,background:finMesRef.endsWith(yr)?T.purpleDim:"transparent",border:`1px solid ${finMesRef.endsWith(yr)?T.purple+"55":T.border}`,color:finMesRef.endsWith(yr)?T.purple:T.muted,cursor:"pointer"}}>{yr}</button>
                    ))}
                  </div>
                </div>

                {/* VISAO GERAL */}
                {finTab==="visao"&&(
                  <div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
                      <KCard label="Total entradas" value={fmt(totalEntradas)} sub={finMesRef} color={T.accent} icon="-"/>
                      <KCard label="Total saidas" value={fmt(totalSaidas)} sub={finMesRef} color={T.danger} icon="-"/>
                      <KCard label="Resultado do mes" value={fmt(lucroMes)} sub="entradas - saidas" color={lucroMes>=0?T.accent:T.danger} icon="-"/>
                      <KCard label="Saldo em caixa" value={fmt(saldoMesFinal)} sub="saldo acumulado" color={saldoMesFinal>=0?T.info:T.danger} icon="-"/>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
                      {/* Contas bancarias */}
                      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18}}>
                        <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Contas Bancarias</div>
                        {contas.map(c=>(
                          <div key={c.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                            <div style={{display:"flex",gap:8,alignItems:"center"}}>
                              <div style={{width:8,height:8,borderRadius:"50%",background:c.cor||T.accent}}/>
                              <div>
                                <div style={{fontSize:11,fontWeight:600}}>{c.banco}</div>
                                <div style={{fontSize:8,color:T.muted}}>{c.tipo}</div>
                              </div>
                            </div>
                            <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:13,color:c.saldo>=0?T.accent:T.danger}}>{fmt(c.saldo)}</div>
                          </div>
                        ))}
                        <div style={{display:"flex",justifyContent:"space-between",paddingTop:8}}>
                          <span style={{fontSize:10,color:T.muted,fontWeight:600}}>TOTAL</span>
                          <span style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:14,color:T.accent}}>{fmt(saldoTotal)}</span>
                        </div>
                      </div>
                      {/* Custos fixos do mes */}
                      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18}}>
                        <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Custos Fixos do Mes</div>
                        <div style={{maxHeight:200,overflowY:"auto"}}>
                          {custosFix.filter(c=>c.ativo).map(c=>(
                            <div key={c.id} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${T.border}`}}>
                              <div style={{fontSize:10,color:T.soft,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.descricao}</div>
                              <div style={{fontSize:10,color:T.danger,fontFamily:"Arial,sans-serif",flexShrink:0}}>{fmt(c.valor)}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:`1px solid ${T.border}`,marginTop:4}}>
                          <span style={{fontSize:10,color:T.muted,fontWeight:600}}>TOTAL FIXO</span>
                          <span style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:13,color:T.danger}}>{fmt(custosFix.filter(c=>c.ativo).reduce((a,c)=>a+c.valor,0))}</span>
                        </div>
                      </div>
                      {/* Cartoes resumo */}
                      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18}}>
                        <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Cartoes</div>
                        {cartoes.map(c=>{
                          const parcMes=comprasCartao.filter(p=>p.cartaoId===c.id&&p.parcelaAtual<=p.parcelas);
                          const totalMes=parcMes.reduce((a,p)=>a+p.valorParcela,0);
                          const totalDev=comprasCartao.filter(p=>p.cartaoId===c.id).reduce((a,p)=>a+(p.valorParcela*(p.parcelas-p.parcelaAtual+1)),0);
                          if(totalDev===0)return null;
                          return(
                            <div key={c.id} style={{padding:"7px 0",borderBottom:`1px solid ${T.border}`}}>
                              <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                                <span style={{fontSize:10,color:c.cor||T.warn}}>{c.nome}</span>
                                <span style={{fontSize:10,color:T.danger,fontFamily:"Arial,sans-serif"}}>{fmt(totalMes)}/mes</span>
                              </div>
                              <div style={{fontSize:8,color:T.muted}}>Saldo devedor: {fmt(totalDev)}</div>
                            </div>
                          );
                        })}
                        <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:`1px solid ${T.border}`,marginTop:4}}>
                          <span style={{fontSize:10,color:T.muted}}>Proximo mes</span>
                          <span style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:13,color:T.warn}}>{fmt(proximoMesCartao)}</span>
                        </div>
                      </div>
                    </div>
                    {/* DAS preview */}
                    <div style={{background:T.card,border:`1px solid ${T.accentBorder}`,borderRadius:12,padding:18,marginBottom:16}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
                        <div>
                          <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:4}}>DAS estimado - {finMesRef}</div>
                          <div style={{fontSize:10,color:T.muted}}>RBT12: {fmt(rbt12)} - {faixa.label} - Aliquota efetiva: {aliqDisplay}%</div>
                        </div>
                        <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:24,color:T.accent}}>{fmt(totalEntradas*aliqVal)}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* FLUXO DE CAIXA */}
                {finTab==="fluxo"&&(()=>{
                  const [mmAtual,aaAtual]=[mmRef,aaRef];
                  const lancOrdenados=[...lancMesFilt].filter(l=>l.tipo!=="Saldo Anterior").sort((a,b)=>a.data.split("/").reverse().join("")-b.data.split("/").reverse().join(""));
                  let saldoAcum=saldoAcumuladoAnterior;
                  const grupos=[];
                  let diaAtual=null, grupoAtual=[];
                  lancOrdenados.forEach(l=>{
                    if(l.data!==diaAtual){
                      if(grupoAtual.length>0) grupos.push({data:diaAtual,lancs:grupoAtual});
                      diaAtual=l.data; grupoAtual=[];
                    }
                    grupoAtual.push(l);
                  });
                  if(grupoAtual.length>0) grupos.push({data:diaAtual,lancs:grupoAtual});
                  return(
                    <div>
                      {/* Summary bar */}
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
                        <div style={{background:T.card,border:`1px solid ${T.accent}33`,borderRadius:10,padding:"12px 16px",textAlign:"center"}}>
                          <div style={{fontSize:9,color:T.accent,marginBottom:4}}>TOTAL ENTRADAS</div>
                          <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:18,color:T.accent}}>{fmt(totalEntradas)}</div>
                        </div>
                        <div style={{background:T.card,border:`1px solid ${T.danger}33`,borderRadius:10,padding:"12px 16px",textAlign:"center"}}>
                          <div style={{fontSize:9,color:T.danger,marginBottom:4}}>TOTAL SAIDAS</div>
                          <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:18,color:T.danger}}>{fmt(totalSaidas)}</div>
                        </div>
                        <div style={{background:T.card,border:`1px solid ${lucroMes>=0?T.accent:T.danger}33`,borderRadius:10,padding:"12px 16px",textAlign:"center"}}>
                          <div style={{fontSize:9,color:lucroMes>=0?T.accent:T.danger,marginBottom:4}}>RESULTADO</div>
                          <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:18,color:lucroMes>=0?T.accent:T.danger}}>{fmt(lucroMes)}</div>
                        </div>
                      </div>
                      {/* Add button */}
                      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
                        <button onClick={()=>setShowAdd(true)} style={{padding:"9px 18px",background:T.accent,border:"none",color:"#000",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",letterSpacing:0.5}}>+ Novo Lançamento</button>
                      </div>
                      {/* Modal Novo Lançamento */}
                      {showAdd&&<div style={{position:"fixed",inset:0,background:"#00000099",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowAdd(false)}>
                        <div style={{background:"#fff",borderRadius:14,padding:28,width:560,maxWidth:"95vw",boxShadow:"0 24px 64px #00000044"}} onClick={e=>e.stopPropagation()}>
                          <div style={{fontWeight:800,fontSize:16,color:"#1a1a2e",marginBottom:20}}>Novo Lançamento</div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
                            <div style={{gridColumn:"1/3"}}>
                              <div style={{fontSize:9,color:"#666",marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Descrição *</div>
                              <input autoFocus value={novoLanc.descricao} onChange={e=>setNovoLanc(p=>({...p,descricao:e.target.value}))} placeholder="Ex: Salário Victor, NF 92, Gráfica..." style={{width:"100%",border:"1px solid #ddd",borderRadius:7,padding:"9px 12px",fontSize:12,fontFamily:"Arial,sans-serif",outline:"none",boxSizing:"border-box"}}/>
                            </div>
                            <div>
                              <div style={{fontSize:9,color:"#666",marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Data *</div>
                              <input type="date" value={novoLanc.data} onChange={e=>setNovoLanc(p=>({...p,data:e.target.value}))} style={{width:"100%",border:"1px solid #ddd",borderRadius:7,padding:"9px 12px",fontSize:12,fontFamily:"Arial,sans-serif",outline:"none",boxSizing:"border-box"}}/>
                            </div>
                            <div>
                              <div style={{fontSize:9,color:"#666",marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Tipo</div>
                              <select value={novoLanc.tipo} onChange={e=>setNovoLanc(p=>({...p,tipo:e.target.value,categoria:e.target.value==="Receita"?CAT_RECEITA[0]:CAT_DESPESA[0]}))} style={{width:"100%",border:"1px solid #ddd",borderRadius:7,padding:"9px 12px",fontSize:12,fontFamily:"Arial,sans-serif",outline:"none",boxSizing:"border-box"}}>
                                <option>Receita</option><option>Despesa</option>
                              </select>
                            </div>
                            <div>
                              <div style={{fontSize:9,color:"#666",marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Entrada (R$)</div>
                              <input type="number" value={novoLanc.entrada||""} onChange={e=>setNovoLanc(p=>({...p,entrada:Number(e.target.value),saida:0,tipo:"Receita"}))} placeholder="0,00" style={{width:"100%",border:"1px solid #ddd",borderRadius:7,padding:"9px 12px",fontSize:12,fontFamily:"Arial,sans-serif",outline:"none",boxSizing:"border-box",color:"#16a34a",fontWeight:700}}/>
                            </div>
                            <div>
                              <div style={{fontSize:9,color:"#666",marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Saída (R$)</div>
                              <input type="number" value={novoLanc.saida||""} onChange={e=>setNovoLanc(p=>({...p,saida:Number(e.target.value),entrada:0,tipo:"Despesa"}))} placeholder="0,00" style={{width:"100%",border:"1px solid #ddd",borderRadius:7,padding:"9px 12px",fontSize:12,fontFamily:"Arial,sans-serif",outline:"none",boxSizing:"border-box",color:"#dc2626",fontWeight:700}}/>
                            </div>
                            <div>
                              <div style={{fontSize:9,color:"#666",marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Categoria</div>
                              <select value={novoLanc.categoria} onChange={e=>setNovoLanc(p=>({...p,categoria:e.target.value}))} style={{width:"100%",border:"1px solid #ddd",borderRadius:7,padding:"9px 12px",fontSize:12,fontFamily:"Arial,sans-serif",outline:"none",boxSizing:"border-box"}}>
                                {(novoLanc.tipo==="Receita"?CAT_RECEITA:CAT_DESPESA).map(c=><option key={c}>{c}</option>)}
                              </select>
                            </div>
                            <div>
                              <div style={{fontSize:9,color:"#666",marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Forma de Pagamento</div>
                              <select value={novoLanc.forma} onChange={e=>setNovoLanc(p=>({...p,forma:e.target.value}))} style={{width:"100%",border:"1px solid #ddd",borderRadius:7,padding:"9px 12px",fontSize:12,fontFamily:"Arial,sans-serif",outline:"none",boxSizing:"border-box"}}>
                                {FORMAS_PAG.map(f=><option key={f}>{f}</option>)}
                              </select>
                            </div>
                            <div>
                              <div style={{fontSize:9,color:"#666",marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Centro de Custo</div>
                              <select value={novoLanc.centrosCusto} onChange={e=>setNovoLanc(p=>({...p,centrosCusto:e.target.value}))} style={{width:"100%",border:"1px solid #ddd",borderRadius:7,padding:"9px 12px",fontSize:12,fontFamily:"Arial,sans-serif",outline:"none",boxSizing:"border-box"}}>
                                {centrosCusto.map(c=><option key={c}>{c}</option>)}
                              </select>
                            </div>
                            <div>
                              <div style={{fontSize:9,color:"#666",marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Conta Bancária</div>
                              <select value={novoLanc.contaBancoId} onChange={e=>setNovoLanc(p=>({...p,contaBancoId:Number(e.target.value)}))} style={{width:"100%",border:"1px solid #ddd",borderRadius:7,padding:"9px 12px",fontSize:12,fontFamily:"Arial,sans-serif",outline:"none",boxSizing:"border-box"}}>
                                {contas.map(c=><option key={c.id} value={c.id}>{c.banco}</option>)}
                              </select>
                            </div>
                            <div>
                              <div style={{fontSize:9,color:"#666",marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Projeto / NF</div>
                              <input value={novoLanc.projeto} onChange={e=>setNovoLanc(p=>({...p,projeto:e.target.value}))} placeholder="Opcional" style={{width:"100%",border:"1px solid #ddd",borderRadius:7,padding:"9px 12px",fontSize:12,fontFamily:"Arial,sans-serif",outline:"none",boxSizing:"border-box"}}/>
                            </div>
                            <div>
                              <div style={{fontSize:9,color:"#666",marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Nº de Parcelas</div>
                              <input type="number" min="1" max="60" value={novoLanc.parcelas} onChange={e=>setNovoLanc(p=>({...p,parcelas:Math.max(1,parseInt(e.target.value)||1)}))} style={{width:"100%",border:`2px solid ${novoLanc.parcelas>1?"#1a4a7a":"#ddd"}`,borderRadius:7,padding:"9px 12px",fontSize:12,fontFamily:"Arial,sans-serif",outline:"none",boxSizing:"border-box",fontWeight:novoLanc.parcelas>1?700:400}}/>
                              {novoLanc.parcelas>1&&<div style={{fontSize:9,color:"#1a4a7a",marginTop:3}}>⚡ Vai criar {novoLanc.parcelas} lançamentos mensais</div>}
                            </div>
                          </div>
                          <div style={{display:"flex",gap:10,justifyContent:"flex-end",borderTop:"1px solid #f0f0f0",paddingTop:16}}>
                            <button onClick={()=>setShowAdd(false)} style={{padding:"9px 20px",background:"#f5f5f5",border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontFamily:"Arial,sans-serif"}}>Cancelar</button>
                            <button onClick={async()=>{
                              if(!novoLanc.data||!novoLanc.descricao.trim())return alert("Preencha data e descrição!");
                              if(!novoLanc.entrada&&!novoLanc.saida)return alert("Informe entrada ou saída!");
                              const parcelas=novoLanc.parcelas||1;
                              const novos=[];
                              for(let p=0;p<parcelas;p++){
                                const baseDate=new Date(novoLanc.data+'T12:00:00');
                                baseDate.setMonth(baseDate.getMonth()+p);
                                const dd=String(baseDate.getDate()).padStart(2,'0');
                                const mm=String(baseDate.getMonth()+1).padStart(2,'0');
                                const yyyy=baseDate.getFullYear();
                                const dateFmt=`${dd}/${mm}/${yyyy}`;
                                const desc=parcelas>1?`${novoLanc.descricao} ${p+1} de ${parcelas}`:novoLanc.descricao;
                                novos.push({...novoLanc,id:Date.now()+p,data:dateFmt,descricao:desc});
                              }
                              setLancamentos(prev=>[...prev,...novos]);
                              setShowAdd(false);
                              setNovoLanc({data:new Date().toISOString().slice(0,10),descricao:"",entrada:0,saida:0,tipo:"Despesa",categoria:"Outros",centrosCusto:"Administrativo",forma:"PIX",projeto:"",contaBancoId:1,parcelas:1});
                              for(const rec of novos){
                                await supabase.from("lancamentos").upsert({...rec,centrosCusto:rec.centrosCusto,contaBancoId:rec.contaBancoId});
                              }
                            }} style={{padding:"9px 28px",background:"#1a4a7a",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:12,fontFamily:"Arial,sans-serif"}}>Salvar Lançamento</button>
                          </div>
                        </div>
                      </div>}
                      {/* Transaction table */}
                      <div style={{background:"#fff",border:"2px solid #555",borderRadius:4,overflow:"auto",boxShadow:"0 1px 4px #00000022"}}>
                        {/* Header — Excel style com colunas redimensionáveis */}
                        <div style={{display:"grid",gridTemplateColumns:colWidths.map(w=>w+"px").join(" "),padding:"0",gap:0,background:"#1a4a7a",borderBottom:"2px solid #0f3460",position:"relative"}}>
                          {["DATA","DESCRIÇÃO","ENTRADA","SAÍDA","TOT. ENTRADA","TOT. SAÍDA","SALDO","✓","OBS"].map((h,i)=>(
                            <div key={h} style={{fontSize:8,color:"#fff",textTransform:"uppercase",letterSpacing:1,fontWeight:700,textAlign:i===0?"left":i===1?"center":"right",padding:"9px 10px",position:"relative",userSelect:"none",overflow:"hidden",whiteSpace:"nowrap",background:"#1a4a7a",boxShadow:"inset -1px 0 0 #4a7aaa"}}>
                              {h}
                              {i<8&&<div
                                style={{position:"absolute",right:0,top:0,bottom:0,width:6,cursor:"col-resize",zIndex:10}}
                                onDoubleClick={e=>{e.stopPropagation();const cells=document.querySelectorAll("[data-col='"+i+"']");let maxW=80;cells.forEach(el=>{const w=(el.textContent||"").length*7+24;if(w>maxW)maxW=w;});setColWidths(p=>{const n=[...p];n[i]=Math.min(Math.max(maxW,60),500);return n;});}}
                                onMouseDown={e=>{e.preventDefault();const sx=e.clientX,sw=colWidths[i];const mv=ev=>{setColWidths(p=>{const n=[...p];n[i]=Math.max(40,sw+(ev.clientX-sx));return n;});};const up=()=>{window.removeEventListener("mousemove",mv);window.removeEventListener("mouseup",up);};window.addEventListener("mousemove",mv);window.addEventListener("mouseup",up);}}
                              />}
                            </div>
                          ))}
                        </div>
                        {grupos.length===0&&<div style={{padding:"16px 14px",textAlign:"center",color:"#888",fontSize:11,background:"#fff",borderBottom:"1px solid #e0e0e0"}}>Nenhum lançamento registrado em {finMesRef}</div>}
                        {/* Linha de saldo anterior automático */}
                        {saldoAcumuladoAnterior!==0&&<div style={{display:"grid",gridTemplateColumns:colWidths.map(w=>w+"px").join(" "),gap:0,background:"#f0e8ff",alignItems:"stretch"}}>
                          <div style={{fontSize:10,color:"#7c3aed",fontFamily:"Arial,sans-serif",padding:"7px 10px",boxShadow:"inset -1px 0 0 #888, inset 0 -1px 0 #888",background:"#f0e8ff",display:"flex",alignItems:"center"}}>01/{mmRef}</div>
                          <div style={{padding:"7px 10px",boxShadow:"inset -2px 0 0 #888, inset 0 -1px 0 #888",background:"#f0e8ff"}}>
                            <div style={{fontSize:11,color:"#7c3aed",fontWeight:700}}>SALDO ANTERIOR</div>
                            <span style={{fontSize:7,padding:"1px 5px",borderRadius:3,background:"#ede9fe",color:"#7c3aed"}}>Calculado automaticamente</span>
                          </div>
                          <div style={{boxShadow:"inset -1px 0 0 #888, inset 0 -1px 0 #888",background:"#f0e8ff",fontFamily:"Arial,sans-serif",fontSize:11,color:"#16a34a",fontWeight:700,textAlign:"right",padding:"7px 10px",display:"flex",alignItems:"center",justifyContent:"flex-end"}}>{saldoAcumuladoAnterior>0?fmt(saldoAcumuladoAnterior):""}</div>
                          <div style={{boxShadow:"inset -1px 0 0 #888, inset 0 -1px 0 #888",background:"#f0e8ff",fontFamily:"Arial,sans-serif",fontSize:11,color:"#dc2626",fontWeight:700,textAlign:"right",padding:"7px 10px",display:"flex",alignItems:"center",justifyContent:"flex-end"}}>{saldoAcumuladoAnterior<0?fmt(Math.abs(saldoAcumuladoAnterior)):""}</div>
                          <div style={{boxShadow:"inset -1px 0 0 #888, inset 0 -1px 0 #888",background:"#f0e8ff",minHeight:38,alignSelf:"stretch"}}/>
                          <div style={{boxShadow:"inset -1px 0 0 #888, inset 0 -1px 0 #888",background:"#f0e8ff",minHeight:38,alignSelf:"stretch"}}/>
                          <div style={{boxShadow:"inset -1px 0 0 #888, inset 0 -1px 0 #888",background:"#f0e8ff",minHeight:38,alignSelf:"stretch"}}/>
                          <div style={{background:"#f0e8ff",minHeight:38,boxShadow:"inset -1px 0 0 #888, inset 0 -1px 0 #888"}}/>
                          <div style={{background:"#f0e8ff",minHeight:38}}/>
                        </div>}
                        {grupos.map((grupo,gi)=>{
                          const dEntradas=grupo.lancs.reduce((a,l)=>a+(l.entrada||0),0);
                          const dSaidas=grupo.lancs.reduce((a,l)=>a+(l.saida||0),0);
                          saldoAcum+=dEntradas-dSaidas;
                          const saldoDia=saldoAcum;
                          return(
                            <div key={gi}>
                              {grupo.lancs.map((l,i)=>{const rowBg=l.confirmado?"#d4edda":l.tipo==="Saldo Anterior"?"#f0e8ff":i%2===0?"#fff":"#f2f6fc";return(
                                <div key={l.id||i} style={{display:"grid",gridTemplateColumns:colWidths.map(w=>w+"px").join(" "),gap:0,background:rowBg,alignItems:"stretch",cursor:"pointer"}} onClick={()=>setEditLanc({...l})}>
                                  <div data-col="0" style={{fontSize:10,color:"#444",fontFamily:"Arial,sans-serif",padding:"7px 10px",overflow:"hidden",whiteSpace:"nowrap",background:rowBg,display:"flex",alignItems:"center",boxShadow:"inset -1px 0 0 #888, inset 0 -1px 0 #888"}}>{l.tipo==="Saldo Anterior"?"":l.data.slice(0,5)}</div>
                                  <div data-col="1" style={{padding:"7px 10px",borderRight:"1px solid #888",borderBottom:"1px solid #888",overflow:"hidden",background:rowBg}}>
                                    <div style={{fontSize:11,color:l.tipo==="Saldo Anterior"?"#7c3aed":"#1a1a2e",lineHeight:1.4}}>{l.descricao}</div>
                                    <span style={{fontSize:7,padding:"1px 5px",borderRadius:3,background:l.tipo==="Saldo Anterior"?"#ede9fe":l.tipo==="Receita"?"#dcfce7":"#fee2e2",color:l.tipo==="Saldo Anterior"?"#7c3aed":l.tipo==="Receita"?"#16a34a":"#dc2626"}}>{l.tipo==="Saldo Anterior"?"Saldo Ant.":l.categoria}</span>
                                  </div>
                                  <div data-col="2" style={{fontFamily:"Arial,sans-serif",fontSize:11,color:"#16a34a",fontWeight:700,textAlign:"right",padding:"7px 10px",whiteSpace:"nowrap",background:rowBg,display:"flex",alignItems:"center",justifyContent:"flex-end",boxShadow:"inset -1px 0 0 #888, inset 0 -1px 0 #888"}}>{l.entrada>0?fmt(l.entrada):""}</div>
                                  <div data-col="3" style={{fontFamily:"Arial,sans-serif",fontSize:11,color:"#dc2626",fontWeight:700,textAlign:"right",padding:"7px 10px",whiteSpace:"nowrap",background:rowBg,display:"flex",alignItems:"center",justifyContent:"flex-end",boxShadow:"inset -1px 0 0 #888, inset 0 -1px 0 #888"}}>{l.saida>0?fmt(l.saida):""}</div>
                                  <div style={{minHeight:38,background:rowBg,alignSelf:"stretch",boxShadow:"inset -1px 0 0 #888, inset 0 -1px 0 #888"}}/><div style={{minHeight:38,background:rowBg,alignSelf:"stretch",boxShadow:"inset -1px 0 0 #888, inset 0 -1px 0 #888"}}/><div style={{minHeight:38,background:rowBg,alignSelf:"stretch",boxShadow:"inset -1px 0 0 #888, inset 0 -1px 0 #888"}}/>
                                  <div onClick={async e=>{e.stopPropagation();const upd={...l,confirmado:!l.confirmado};setLancamentos(p=>p.map(x=>x.id===l.id?upd:x));await supabase.from("lancamentos").update({confirmado:!l.confirmado}).eq("id",l.id);}} style={{display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",height:"100%",background:l.confirmado?"#16a34a":rowBg}} title={l.confirmado?"Marcar como pendente":"Confirmar pagamento"}>
                                    <span style={{fontSize:14}}>{l.confirmado?"✓":"○"}</span>
                                  </div>
                                  <div data-col="8" style={{padding:"2px 6px",background:rowBg,display:"flex",alignItems:"center",boxShadow:"inset -1px 0 0 #888, inset 0 -1px 0 #888"}} onClick={e=>e.stopPropagation()}>
                                    <input
                                      defaultValue={l.obs||""}
                                      placeholder="obs..."
                                      style={{width:"100%",border:"none",outline:"none",background:"transparent",fontSize:10,color:"#555",fontFamily:"Arial,sans-serif",resize:"none"}}
                                      onBlur={async ev=>{const v=ev.target.value;if(v===(l.obs||""))return;const upd={...l,obs:v};setLancamentos(p=>p.map(x=>x.id===l.id?upd:x));await supabase.from("lancamentos").update({obs:v}).eq("id",l.id);}}
                                    />
                                  </div>
                                </div>
                              );})}
                              {/* Linha dedicada ao saldo do período */}
                              <div style={{display:"grid",gridTemplateColumns:colWidths.map(w=>w+"px").join(" "),gap:0,alignItems:"stretch",borderTop:"2px solid #555",borderBottom:"2px solid #555"}}>
                                <div style={{fontSize:9,color:"#2d6a4f",fontFamily:"Arial,sans-serif",fontWeight:700,padding:"6px 10px",background:"#d4edda",display:"flex",alignItems:"center",boxShadow:"inset -1px 0 0 #888, inset 0 -1px 0 #888"}}>{grupo.data.slice(0,5)}</div>
                                <div style={{fontSize:9,color:"#2d6a4f",fontWeight:800,textTransform:"uppercase",letterSpacing:1,padding:"6px 10px",background:"#d4edda",display:"flex",alignItems:"center",boxShadow:"inset -2px 0 0 #888, inset 0 -1px 0 #888"}}>Saldo do período</div>
                                <div style={{background:"#d4edda",minHeight:32,boxShadow:"inset -1px 0 0 #888, inset 0 -1px 0 #888"}}/>
                                <div style={{background:"#d4edda",minHeight:32,boxShadow:"inset -1px 0 0 #888, inset 0 -1px 0 #888"}}/>
                                <div style={{fontFamily:"Arial,sans-serif",fontSize:11,color:"#16a34a",fontWeight:800,textAlign:"right",padding:"6px 10px",background:"#d4edda",display:"flex",alignItems:"center",justifyContent:"flex-end",boxShadow:"inset -1px 0 0 #888, inset 0 -1px 0 #888"}}>{dEntradas>0?fmt(dEntradas):""}</div>
                                <div style={{fontFamily:"Arial,sans-serif",fontSize:11,color:"#dc2626",fontWeight:800,textAlign:"right",padding:"6px 10px",background:"#d4edda",display:"flex",alignItems:"center",justifyContent:"flex-end",boxShadow:"inset -1px 0 0 #888, inset 0 -1px 0 #888"}}>{dSaidas>0?fmt(dSaidas):""}</div>
                                <div style={{fontFamily:"Arial,sans-serif",fontSize:13,fontWeight:800,color:saldoDia>=0?"#16a34a":"#dc2626",textAlign:"right",padding:"6px 10px",background:"#d4edda",boxShadow:"inset -1px 0 0 #888, inset 0 -1px 0 #888",display:"flex",alignItems:"center",justifyContent:"flex-end"}}>{fmt(saldoDia)}</div>
                                <div style={{background:"#d4edda",boxShadow:"inset -1px 0 0 #888, inset 0 -1px 0 #888",minHeight:32,display:"flex",alignItems:"center",justifyContent:"center"}}/>
                                <div style={{background:"#d4edda",boxShadow:"inset 0 -1px 0 #888",minHeight:32}}/>
                              </div>
                            </div>
                          );
                        })}

                        <div style={{display:"grid",gridTemplateColumns:colWidths.map(w=>w+"px").join(" "),padding:"10px 0",gap:0,background:"#1a4a7a",borderTop:"2px solid #1a4a7a"}}>
                          <div style={{fontSize:9,color:"#fff",gridColumn:"1/3",fontWeight:800,textTransform:"uppercase",letterSpacing:1,padding:"0 10px"}}>TOTAL DO MÊS</div>
                          <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:12,color:"#90ee90",textAlign:"right",padding:"0 10px"}}>{fmt(totalEntradas)}</div>
                          <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:12,color:"#ff9999",textAlign:"right",padding:"0 10px"}}>{fmt(totalSaidas)}</div>
                          <div style={{gridColumn:"5/10",fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:13,color:lucroMes>=0?"#90ee90":"#ff9999",textAlign:"right",padding:"0 10px"}}>{fmt(lucroMes)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* CARTOES */}
                {finTab==="cartoes"&&(()=>{
                  // showAddCartao, showAddCompra, novoCartao, novaCompra ja declarados no nivel do componente
                  return(
                    <div>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
                        <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:14}}>Controle de Cartoes</div>
                        <div style={{display:"flex",gap:8}}>
                          <button onClick={()=>setShowAddCompra(p=>!p)} className="btn" style={{padding:"7px 14px",background:T.warnDim,border:`1px solid ${T.warn}44`,color:T.warn,borderRadius:8,fontSize:10,fontWeight:700}}>+ Compra Parcelada</button>
                          <button onClick={()=>setShowAddCartao(p=>!p)} className="btn" style={{padding:"7px 14px",background:T.accentDim,border:`1px solid ${T.accentBorder}`,color:T.accent,borderRadius:8,fontSize:10,fontWeight:700}}>+ Novo Cartao</button>
                        </div>
                      </div>
                      {/* Add cartao form */}
                      {showAddCartao&&(
                        <div style={{background:T.card,border:`1px solid ${T.accentBorder}`,borderRadius:12,padding:14,marginBottom:14}}>
                          <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12,color:T.accent,marginBottom:10}}>Novo Cartao</div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:8}}>
                            {[["nome","Nome do cartao"],["titular","Titular"],["banco","Banco"]].map(([k,ph])=>(
                              <div key={k}><div style={{fontSize:9,color:T.muted,marginBottom:2}}>{ph}</div>
                              <input value={novoCartao[k]} onChange={e=>setNovoCartao(p=>({...p,[k]:e.target.value}))} style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,padding:"6px 8px",fontSize:11,color:T.text,outline:"none"}}/></div>
                            ))}
                            <div><div style={{fontSize:9,color:T.muted,marginBottom:2}}>Vencimento (dia)</div>
                            <input type="number" min="1" max="31" value={novoCartao.vencimento} onChange={e=>setNovoCartao(p=>({...p,vencimento:Number(e.target.value)}))} style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,padding:"6px 8px",fontSize:11,color:T.text,outline:"none"}}/></div>
                            <div><div style={{fontSize:9,color:T.muted,marginBottom:2}}>Limite</div>
                            <input type="number" value={novoCartao.limite} onChange={e=>setNovoCartao(p=>({...p,limite:Number(e.target.value)}))} style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,padding:"6px 8px",fontSize:11,color:T.text,outline:"none"}}/></div>
                            <div><div style={{fontSize:9,color:T.muted,marginBottom:2}}>Cor</div>
                            <input type="color" value={novoCartao.cor} onChange={e=>setNovoCartao(p=>({...p,cor:e.target.value}))} style={{width:"100%",height:32,background:"transparent",border:`1px solid ${T.border}`,borderRadius:6,cursor:"pointer"}}/></div>
                          </div>
                          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                            <button onClick={()=>setShowAddCartao(false)} className="btn" style={{padding:"6px 12px",background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:7,fontSize:10}}>Cancelar</button>
                            <button onClick={async()=>{if(!novoCartao.nome)return;const rec={...novoCartao,id:Date.now()};setCartoes(p=>[...p,rec]);setShowAddCartao(false);await supabase.from("cartoes").upsert(rec);}} className="btn" style={{padding:"6px 12px",background:T.accentDim,border:`1px solid ${T.accentBorder}`,color:T.accent,borderRadius:7,fontSize:10,fontWeight:700}}>Salvar</button>
                          </div>
                        </div>
                      )}
                      {/* Add compra form */}
                      {showAddCompra&&(
                        <div style={{background:T.card,border:`1px solid ${T.warn}44`,borderRadius:12,padding:14,marginBottom:14}}>
                          <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12,color:T.warn,marginBottom:10}}>Nova Compra Parcelada</div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:8}}>
                            <div><div style={{fontSize:9,color:T.muted,marginBottom:2}}>Cartao</div>
                            <select value={novaCompra.cartaoId} onChange={e=>setNovaCompra(p=>({...p,cartaoId:Number(e.target.value)}))} style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,padding:"6px 8px",fontSize:11,color:T.text,outline:"none"}}>
                              {cartoes.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}
                            </select></div>
                            <div><div style={{fontSize:9,color:T.muted,marginBottom:2}}>Projeto vinculado</div>
                            <input value={novaCompra.projeto} onChange={e=>setNovaCompra(p=>({...p,projeto:e.target.value}))} placeholder="Ex: PP 131 Grafica EVO" style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,padding:"6px 8px",fontSize:11,color:T.text,outline:"none"}}/></div>
                            <div><div style={{fontSize:9,color:T.muted,marginBottom:2}}>Descricao</div>
                            <input value={novaCompra.descricao} onChange={e=>setNovaCompra(p=>({...p,descricao:e.target.value}))} style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,padding:"6px 8px",fontSize:11,color:T.text,outline:"none"}}/></div>
                            <div><div style={{fontSize:9,color:T.muted,marginBottom:2}}>Valor total</div>
                            <input type="number" value={novaCompra.valorTotal||""} onChange={e=>setNovaCompra(p=>({...p,valorTotal:Number(e.target.value),valorParcela:p.parcelas>0?Number(e.target.value)/p.parcelas:0}))} style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,padding:"6px 8px",fontSize:11,color:T.text,outline:"none"}}/></div>
                            <div><div style={{fontSize:9,color:T.muted,marginBottom:2}}>Parcelas</div>
                            <input type="number" min="1" value={novaCompra.parcelas} onChange={e=>setNovaCompra(p=>({...p,parcelas:Number(e.target.value),valorParcela:p.valorTotal>0?p.valorTotal/Number(e.target.value):0}))} style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,padding:"6px 8px",fontSize:11,color:T.text,outline:"none"}}/></div>
                            <div><div style={{fontSize:9,color:T.muted,marginBottom:2}}>Parcela atual</div>
                            <input type="number" min="1" value={novaCompra.parcelaAtual} onChange={e=>setNovaCompra(p=>({...p,parcelaAtual:Number(e.target.value)}))} style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,padding:"6px 8px",fontSize:11,color:T.text,outline:"none"}}/></div>
                          </div>
                          {novaCompra.valorTotal>0&&novaCompra.parcelas>0&&(
                            <div style={{background:T.surface,borderRadius:8,padding:"8px 12px",marginBottom:8,fontSize:10,color:T.warn}}>
                              Valor por parcela: {fmt(novaCompra.valorTotal/novaCompra.parcelas)} | Restante: {fmt((novaCompra.parcelas-novaCompra.parcelaAtual+1)*(novaCompra.valorTotal/novaCompra.parcelas))}
                            </div>
                          )}
                          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                            <button onClick={()=>setShowAddCompra(false)} className="btn" style={{padding:"6px 12px",background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:7,fontSize:10}}>Cancelar</button>
                            <button onClick={async()=>{if(!novaCompra.projeto||!novaCompra.valorTotal)return;const rec={...novaCompra,id:Date.now(),valorParcela:novaCompra.valorTotal/novaCompra.parcelas};setComprasCartao(p=>[...p,rec]);setShowAddCompra(false);await supabase.from("compras_cartao").upsert({...rec,cartaoId:rec.cartaoId,valorTotal:rec.valorTotal,parcelaAtual:rec.parcelaAtual,valorParcela:rec.valorParcela,mesInicio:rec.mesInicio});}} className="btn" style={{padding:"6px 12px",background:T.warnDim,border:`1px solid ${T.warn}44`,color:T.warn,borderRadius:7,fontSize:10,fontWeight:700}}>Salvar</button>
                          </div>
                        </div>
                      )}
                      {/* Cards list */}
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                        {cartoes.map(c=>{
                          const compras=comprasCartao.filter(p=>p.cartaoId===c.id);
                          const totalDevedor=compras.reduce((a,p)=>a+(p.valorParcela*(p.parcelas-p.parcelaAtual+1)),0);
                          const parcelaMes=compras.filter(p=>p.parcelaAtual<=p.parcelas).reduce((a,p)=>a+p.valorParcela,0);
                          const utilizadoPct=c.limite>0?(totalDevedor/c.limite)*100:0;
                          return(
                            <div key={c.id} style={{background:T.card,border:`1px solid ${c.cor}44`,borderRadius:14,padding:18}}>
                              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                                <div>
                                  <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:14,color:c.cor}}>{c.nome}</div>
                                  <div style={{fontSize:9,color:T.muted,marginTop:2}}>{c.titular} - Vencimento dia {c.vencimento} - {c.banco}</div>
                                </div>
                                <div style={{textAlign:"right"}}>
                                  <div style={{fontSize:9,color:T.muted}}>Limite</div>
                                  <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,color:c.cor}}>{fmt(c.limite)}</div>
                                </div>
                              </div>
                              <div style={{marginBottom:8}}>
                                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                                  <span style={{fontSize:9,color:T.muted}}>Utilizado</span>
                                  <span style={{fontSize:9,color:utilizadoPct>80?T.danger:T.warn}}>{utilizadoPct.toFixed(0)}%</span>
                                </div>
                                <div style={{height:6,background:T.border,borderRadius:3}}>
                                  <div style={{height:"100%",width:Math.min(100,utilizadoPct)+"%",background:utilizadoPct>80?T.danger:c.cor,borderRadius:3}}/>
                                </div>
                              </div>
                              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                                <div style={{background:T.surface,borderRadius:8,padding:"8px 10px"}}>
                                  <div style={{fontSize:8,color:T.muted,marginBottom:2}}>Saldo devedor</div>
                                  <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:14,color:T.danger}}>{fmt(totalDevedor)}</div>
                                </div>
                                <div style={{background:T.surface,borderRadius:8,padding:"8px 10px"}}>
                                  <div style={{fontSize:8,color:T.muted,marginBottom:2}}>Parcela do mes</div>
                                  <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:14,color:T.warn}}>{fmt(parcelaMes)}</div>
                                </div>
                              </div>
                              {compras.length>0&&(
                                <div>
                                  <div style={{fontSize:9,color:T.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Compras parceladas</div>
                                  {compras.map((cp,i)=>(
                                    <div key={i} style={{padding:"6px 0",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                      <div>
                                        <div style={{fontSize:10,fontWeight:600}}>{cp.projeto}</div>
                                        <div style={{fontSize:8,color:T.muted}}>{cp.parcelaAtual}/{cp.parcelas} parcelas - {fmt(cp.valorParcela)}/mes</div>
                                      </div>
                                      <div style={{fontSize:10,color:T.warn,fontFamily:"Arial,sans-serif"}}>{fmt(cp.valorParcela*(cp.parcelas-cp.parcelaAtual+1))}</div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* DAS / SIMPLES NACIONAL */}
                {finTab==="das"&&(()=>{
                  // nfValor, dasManual ja declarados no nivel do componente
                  const dasCalcNf=Number(nfValor)*(Number(dasManual)/100);
                  return(
                    <div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
                        {/* RBT12 */}
                        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:20}}>
                          <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:14}}>Faturamento dos ultimos 12 meses (RBT12)</div>
                          <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:280,overflowY:"auto",marginBottom:12}}>
                            {fatMensais.map((f,i)=>(
                              <div key={i} style={{display:"flex",gap:8,alignItems:"center"}}>
                                <span style={{fontSize:9,color:T.muted,width:60,flexShrink:0}}>{f.mes}</span>
                                <input type="number" value={f.fat} onChange={async e=>{const v=Number(e.target.value);setFatMensais(p=>p.map((x,j)=>j===i?{...x,fat:v}:x));await supabase.from("fat_mensais").update({fat:v}).eq("mes",f.mes);}} style={{flex:1,background:T.surface,border:`1px solid ${T.border}`,borderRadius:5,padding:"4px 8px",fontSize:11,color:T.text,outline:"none"}}/>
                                <span style={{fontSize:9,color:T.accent,fontFamily:"Arial,sans-serif",width:80,textAlign:"right",flexShrink:0}}>{fmt(f.fat)}</span>
                              </div>
                            ))}
                          </div>
                          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderTop:`1px solid ${T.border}`}}>
                            <span style={{fontWeight:700,fontSize:11}}>RBT12 Total</span>
                            <span style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:16,color:T.accent}}>{fmt(rbt12)}</span>
                          </div>
                        </div>
                        {/* Simples */}
                        <div style={{display:"flex",flexDirection:"column",gap:12}}>
                          <div style={{background:T.card,border:`1px solid ${T.accentBorder}`,borderRadius:12,padding:18}}>
                            <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:10}}>Faixa atual - Simples Nacional Anexo III</div>
                            {SIMPLES_ANEXO_III.map(f=>{
                              const isAtual=rbt12>=f.min&&rbt12<f.max;
                              return(
                                <div key={f.faixa} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 10px",borderRadius:8,marginBottom:4,background:isAtual?T.accentDim:"transparent",border:`1px solid ${isAtual?T.accentBorder:"transparent"}`}}>
                                  <span style={{fontSize:10,color:isAtual?T.accent:T.soft}}>{f.label}: ate {fmt(f.max)}</span>
                                  <span style={{fontSize:10,color:isAtual?T.accent:T.muted,fontWeight:isAtual?700:400}}>{(f.aliquota*100).toFixed(1)}%</span>
                                </div>
                              );
                            })}
                          </div>
                          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18}}>
                            <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:10}}>Aliquota efetiva calculada</div>
                            <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:32,color:T.accent,marginBottom:4}}>{aliqDisplay}%</div>
                            <div style={{fontSize:9,color:T.muted,marginBottom:12}}>{faixa.label} - ({fmt(rbt12)} x {(faixa.aliquota*100).toFixed(1)}% - {fmt(faixa.deducao)}) / {fmt(rbt12)}</div>
                            <div style={{fontSize:10,color:T.warn,marginBottom:6}}>Ajuste manual (se contador informar diferente):</div>
                            <div style={{display:"flex",gap:8,alignItems:"center"}}>
                              <input type="number" step="0.01" value={dasManual} onChange={async e=>{const v=Number(e.target.value);setDasManual(e.target.value);setDasAjuste(v);await supabase.from("configuracoes").upsert({chave:"dasAjuste",valor:v});}} style={{flex:1,background:T.surface,border:`1px solid ${T.warn}44`,borderRadius:6,padding:"6px 8px",fontSize:13,color:T.text,outline:"none",fontWeight:700}}/>
                              <span style={{fontSize:11,color:T.muted}}>%</span>
                              <button onClick={async()=>{setDasAjuste(null);setDasManual(aliquotaEfetiva.toFixed(4)*100+"");await supabase.from("configuracoes").upsert({chave:"dasAjuste",valor:"null"});}} className="btn" style={{padding:"6px 10px",background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:6,fontSize:9}}>Resetar</button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* DAS calculator */}
                      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18,marginBottom:14}}>
                        <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Calculadora DAS</div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,alignItems:"center"}}>
                          <div>
                            <div style={{fontSize:9,color:T.muted,marginBottom:4}}>Valor da NF</div>
                            <input type="number" placeholder="0,00" value={nfValor} onChange={e=>setNfValor(e.target.value)} style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",fontSize:14,color:T.text,outline:"none",fontWeight:700}}/>
                          </div>
                          <div>
                            <div style={{fontSize:9,color:T.muted,marginBottom:4}}>Aliquota efetiva</div>
                            <div style={{background:T.surface,border:`1px solid ${T.accentBorder}`,borderRadius:7,padding:"8px 12px",fontSize:14,color:T.accent,fontWeight:800}}>{dasManual}%</div>
                          </div>
                          <div>
                            <div style={{fontSize:9,color:T.muted,marginBottom:4}}>DAS a pagar</div>
                            <div style={{background:dasCalcNf>0?T.accentDim:T.surface,border:`1px solid ${T.accentBorder}`,borderRadius:7,padding:"8px 12px",fontSize:18,color:T.accent,fontWeight:800,fontFamily:"Arial,sans-serif"}}>{fmt(dasCalcNf)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* DISTRIBUICAO DE SOCIOS */}
                {finTab==="distribuicao"&&(
                  <div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
                      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18}}>
                        <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:14}}>Resultado de {finMesRef}</div>
                        {[{l:"Total entradas",v:totalEntradas,c:T.accent},{l:"Total saidas",v:totalSaidas,c:T.danger},{l:"Resultado bruto",v:lucroMes,c:lucroMes>=0?T.accent:T.danger}].map((k,i)=>(
                          <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                            <span style={{fontSize:11,color:T.soft}}>{k.l}</span>
                            <span style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,color:k.c}}>{fmt(k.v)}</span>
                          </div>
                        ))}
                        <div style={{marginTop:14}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                            <span style={{fontSize:11,color:T.warn}}>Reserva de caixa</span>
                            <div style={{display:"flex",gap:6,alignItems:"center"}}>
                              <input type="number" min="0" max="100" value={reservaCaixaPct} onChange={async e=>{const v=Number(e.target.value);setReservaCaixaPct(v);await supabase.from("configuracoes").upsert({chave:"reservaCaixaPct",valor:v});}} style={{width:50,background:T.surface,border:`1px solid ${T.warn}44`,borderRadius:5,padding:"3px 6px",fontSize:12,color:T.text,outline:"none",textAlign:"center"}}/>
                              <span style={{fontSize:11,color:T.muted}}>%</span>
                              <span style={{fontFamily:"Arial,sans-serif",fontWeight:700,color:T.warn,fontSize:13}}>{fmt(reserva)}</span>
                            </div>
                          </div>
                          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderTop:`1px solid ${T.border}`}}>
                            <span style={{fontWeight:700,fontSize:12}}>Para distribuir</span>
                            <span style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:18,color:T.accent}}>{fmt(paraDividir)}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18}}>
                        <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:14}}>Distribuicao por socio</div>
                        {socios.map((s,i)=>{
                          const valor=paraDividir*(s.pct/100);
                          return(
                            <div key={s.id} style={{background:T.surface,borderRadius:10,padding:14,marginBottom:10}}>
                              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                                <span style={{fontWeight:700,fontSize:12}}>{s.nome}</span>
                                <div style={{display:"flex",gap:5,alignItems:"center"}}>
                                  <input type="number" min="0" max="100" value={s.pct} onChange={async e=>{const novosSocios=socios.map((x,j)=>j===i?{...x,pct:Number(e.target.value)}:x);setSocios(novosSocios);await supabase.from("configuracoes").upsert({chave:"socios",valor:JSON.stringify(novosSocios)});}} style={{width:45,background:T.card,border:`1px solid ${T.border}`,borderRadius:5,padding:"2px 5px",fontSize:11,color:T.text,outline:"none",textAlign:"center"}}/>
                                  <span style={{fontSize:10,color:T.muted}}>%</span>
                                </div>
                              </div>
                              <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:28,color:T.accent}}>{fmt(valor)}</div>
                              <div style={{fontSize:9,color:T.muted,marginTop:2}}>Pro-labore ja incluido no total de saidas</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* CONFIGURACOES */}
                {finTab==="config"&&(()=>{
                  // showAddFixo, showAddConta, showAddCentro, novoCusto, novaConta, novoCentro ja declarados no nivel do componente
                  return(
                    <div>
                      {/* Custos fixos */}
                      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18,marginBottom:14}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                          <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13}}>Custos Fixos Mensais</div>
                          <button onClick={()=>setShowAddFixo(p=>!p)} className="btn" style={{padding:"6px 12px",background:T.accentDim,border:`1px solid ${T.accentBorder}`,color:T.accent,borderRadius:7,fontSize:10,fontWeight:700}}>+ Adicionar</button>
                        </div>
                        {showAddFixo&&(
                          <div style={{background:T.surface,borderRadius:9,padding:12,marginBottom:12}}>
                            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:8,marginBottom:8}}>
                              <div><div style={{fontSize:8,color:T.muted,marginBottom:2}}>Descricao</div><input value={novoCusto.descricao} onChange={e=>setNovoCusto(p=>({...p,descricao:e.target.value}))} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:5,padding:"5px 7px",fontSize:10,color:T.text,outline:"none"}}/></div>
                              <div><div style={{fontSize:8,color:T.muted,marginBottom:2}}>Valor</div><input type="number" value={novoCusto.valor||""} onChange={e=>setNovoCusto(p=>({...p,valor:Number(e.target.value)}))} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:5,padding:"5px 7px",fontSize:10,color:T.text,outline:"none"}}/></div>
                              <div><div style={{fontSize:8,color:T.muted,marginBottom:2}}>Dia venc.</div><input type="number" min="1" max="31" value={novoCusto.dia} onChange={e=>setNovoCusto(p=>({...p,dia:Number(e.target.value)}))} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:5,padding:"5px 7px",fontSize:10,color:T.text,outline:"none"}}/></div>
                              <div><div style={{fontSize:8,color:T.muted,marginBottom:2}}>Centro Custo</div><select value={novoCusto.centrosCusto} onChange={e=>setNovoCusto(p=>({...p,centrosCusto:e.target.value}))} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:5,padding:"5px 7px",fontSize:10,color:T.text,outline:"none"}}>{centrosCusto.map(c=><option key={c}>{c}</option>)}</select></div>
                            </div>
                            <div style={{display:"flex",gap:6,justifyContent:"flex-end"}}>
                              <button onClick={()=>setShowAddFixo(false)} className="btn" style={{padding:"5px 10px",background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:6,fontSize:9}}>Cancelar</button>
                              <button onClick={async()=>{if(!novoCusto.descricao)return;const rec={...novoCusto,id:Date.now()};setCustosFix(p=>[...p,rec]);setShowAddFixo(false);await supabase.from("custos_fixos").upsert({...rec,centrosCusto:rec.centrosCusto});}} className="btn" style={{padding:"5px 10px",background:T.accentDim,border:`1px solid ${T.accentBorder}`,color:T.accent,borderRadius:6,fontSize:9,fontWeight:700}}>Salvar</button>
                            </div>
                          </div>
                        )}
                        {[...custosFix].sort((a,b)=>a.dia-b.dia).map(c=>(
                          <div key={c.id} style={{display:"grid",gridTemplateColumns:"30px 1fr 80px 80px 60px",gap:8,alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${T.border}`}}>
                            <span style={{fontSize:9,color:T.muted,textAlign:"center"}}>{c.dia}</span>
                            <div>
                              <div style={{fontSize:11}}>{c.descricao}</div>
                              <div style={{fontSize:8,color:T.muted}}>{c.categoria} - {c.centrosCusto}</div>
                            </div>
                            <span style={{fontSize:11,color:T.danger,fontFamily:"Arial,sans-serif"}}>{fmt(c.valor)}</span>
                            <Badge label={c.ativo?"Ativo":"Inativo"} color={c.ativo?T.accent:T.muted}/>
                            <div onClick={async()=>{const novoAtivo=!c.ativo;setCustosFix(p=>p.map(x=>x.id===c.id?{...x,ativo:novoAtivo}:x));await supabase.from("custos_fixos").update({ativo:novoAtivo}).eq("id",c.id);}} style={{fontSize:9,color:T.muted,cursor:"pointer",textAlign:"center"}}>Toggle</div>
                          </div>
                        ))}
                      </div>
                      {/* Contas bancarias */}
                      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18,marginBottom:14}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                          <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13}}>Contas Bancarias</div>
                          <button onClick={()=>setShowAddConta(p=>!p)} className="btn" style={{padding:"6px 12px",background:T.infoDim,border:`1px solid ${T.info}44`,color:T.info,borderRadius:7,fontSize:10,fontWeight:700}}>+ Adicionar Conta</button>
                        </div>
                        {showAddConta&&(
                          <div style={{background:T.surface,borderRadius:9,padding:12,marginBottom:12}}>
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:8}}>
                              {[["banco","Banco"],["tipo","Tipo"],["agencia","Agencia"],["conta","Conta"]].map(([k,ph])=>(
                                <div key={k}><div style={{fontSize:8,color:T.muted,marginBottom:2}}>{ph}</div><input value={novaConta[k]} onChange={e=>setNovaConta(p=>({...p,[k]:e.target.value}))} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:5,padding:"5px 7px",fontSize:10,color:T.text,outline:"none"}}/></div>
                              ))}
                              <div><div style={{fontSize:8,color:T.muted,marginBottom:2}}>Saldo inicial</div><input type="number" value={novaConta.saldo||""} onChange={e=>setNovaConta(p=>({...p,saldo:Number(e.target.value)}))} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:5,padding:"5px 7px",fontSize:10,color:T.text,outline:"none"}}/></div>
                              <div><div style={{fontSize:8,color:T.muted,marginBottom:2}}>Cor</div><input type="color" value={novaConta.cor} onChange={e=>setNovaConta(p=>({...p,cor:e.target.value}))} style={{width:"100%",height:30,background:"transparent",border:`1px solid ${T.border}`,borderRadius:5,cursor:"pointer"}}/></div>
                            </div>
                            <div style={{display:"flex",gap:6,justifyContent:"flex-end"}}>
                              <button onClick={()=>setShowAddConta(false)} className="btn" style={{padding:"5px 10px",background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:6,fontSize:9}}>Cancelar</button>
                              <button onClick={async()=>{if(!novaConta.banco)return;const rec={...novaConta,id:Date.now()};setContas(p=>[...p,rec]);setShowAddConta(false);await supabase.from("contas").upsert(rec);}} className="btn" style={{padding:"5px 10px",background:T.infoDim,border:`1px solid ${T.info}44`,color:T.info,borderRadius:6,fontSize:9,fontWeight:700}}>Salvar</button>
                            </div>
                          </div>
                        )}
                        {contas.map(c=>(
                          <div key={c.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                            <div style={{display:"flex",gap:8,alignItems:"center"}}>
                              <div style={{width:10,height:10,borderRadius:"50%",background:c.cor}}/>
                              <div>
                                <div style={{fontSize:11,fontWeight:600}}>{c.banco}</div>
                                <div style={{fontSize:8,color:T.muted}}>{c.tipo}{c.agencia?" - Ag. "+c.agencia:""}{c.conta?" - Cc. "+c.conta:""}</div>
                              </div>
                            </div>
                            <div style={{display:"flex",gap:10,alignItems:"center"}}>
                              <input type="number" value={c.saldo} onChange={async e=>{const s=Number(e.target.value);setContas(p=>p.map(x=>x.id===c.id?{...x,saldo:s}:x));await supabase.from("contas").update({saldo:s}).eq("id",c.id);}} style={{width:100,background:T.surface,border:`1px solid ${T.border}`,borderRadius:5,padding:"4px 7px",fontSize:11,color:T.text,outline:"none",textAlign:"right"}}/>
                              <div onClick={async()=>{setContas(p=>p.filter(x=>x.id!==c.id));await supabase.from("contas").delete().eq("id",c.id);}} style={{fontSize:9,color:T.danger,cursor:"pointer"}}>x</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Centros de custo */}
                      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                          <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13}}>Centros de Custo</div>
                        </div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10}}>
                          {centrosCusto.map(c=>(
                            <div key={c} style={{display:"flex",gap:5,alignItems:"center",padding:"5px 12px",background:T.surface,border:`1px solid ${T.border}`,borderRadius:20}}>
                              <span style={{fontSize:11}}>{c}</span>
                              <div onClick={async()=>{setCentrosCusto(p=>p.filter(x=>x!==c));await supabase.from("centros_custo").delete().eq("nome",c);}} style={{fontSize:9,color:T.danger,cursor:"pointer",marginLeft:4}}>x</div>
                            </div>
                          ))}
                        </div>
                        <div style={{display:"flex",gap:8}}>
                          <input value={novoCentro} onChange={e=>setNovoCentro(e.target.value)} placeholder="Novo centro de custo..." style={{flex:1,background:T.surface,border:`1px solid ${T.border}`,borderRadius:7,padding:"7px 10px",fontSize:11,color:T.text,outline:"none"}}/>
                          <button onClick={async()=>{if(!novoCentro.trim())return;const nome=novoCentro.trim();const id=Date.now();setCentrosCusto(p=>[...p,nome]);setNovoCentro("");await supabase.from("centros_custo").insert({id,nome});}} className="btn" style={{padding:"7px 14px",background:T.accentDim,border:`1px solid ${T.accentBorder}`,color:T.accent,borderRadius:7,fontSize:10,fontWeight:700}}>+ Adicionar</button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })()}

          {/* --------------------------------------
              COMERCIAL
          -------------------------------------- */}
          {tab==="comercial"&&(
            <div>
              <div style={{display:"flex",gap:0,marginBottom:20,borderBottom:`1px solid ${T.border}`}}>
                {[["pipeline","Pipeline"],...(["admin","financeiro"].includes(user.role)?[["faturamento","Faturamento"]]:[[]]),...(["admin","comercial","financeiro"].includes(user.role)?[["clientes","Clientes"]]:[[]]),...(["admin","comercial"].includes(user.role)?[["metas","Metas"]]:[[]])].map(([id,l])=>(
                  <div key={id} onClick={()=>setCommTab(id)} style={{padding:"10px 18px",fontSize:11,cursor:"pointer",color:commTab===id?T.accent:T.muted,borderBottom:`2px solid ${commTab===id?T.accent:"transparent"}`,transition:"all 0.15s"}}>{l}</div>
                ))}
              </div>
              {commTab==="pipeline"&&(
                <div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
                    <KCard label="Pipeline total" value={fmtK(pipeTotal)} sub={`${prospects.length} prospects`} color={T.info} icon="-" onClick={()=>setPipeView("lista")} hint="Ver lista -"/>
                    <KCard label="Previsão ponderada" value={fmtK(Math.round(forecastTotal))} sub="por probabilidade" color={T.warn} icon="-"/>
                    <KCard label="Faturado total" value={fmtK(totalFat)} sub="clientes ativos" color={T.accent} icon="-" onClick={["admin","financeiro"].includes(user.role)?()=>setCommTab("faturamento"):undefined} hint="Ver faturamento -"/>
                    <KCard label="Pendente receber" value={fmtK(totalPend)} sub="NFs em aberto" color={T.danger} icon="-" onClick={["admin","financeiro"].includes(user.role)?()=>setCommTab("faturamento"):undefined} hint="Ver pendentes -"/>
                  </div>
                  <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center",flexWrap:"wrap"}}>
                    {[["kanban","Kanban"],["lista","Lista"]].map(([v,l])=>(
                      <div key={v} onClick={()=>setPipeView(v)} className="tb" style={{padding:"6px 12px",borderRadius:6,fontSize:10,background:pipeView===v?T.accentDim:T.card,border:`1px solid ${pipeView===v?T.accentBorder:T.border}`,color:pipeView===v?T.accent:T.muted}}>{l}</div>
                    ))}
                    <select value={filterSeg} onChange={e=>setFilterSeg(e.target.value)} style={{...selS,width:"auto"}}>
                      <option value="todos">Todos segmentos</option>
                      {["Beleza","Automotivo","Energia","Entretenimento","Alimentação","Tecnologia","Moda"].map(s=><option key={s}>{s}</option>)}
                    </select>
                    <button className="btn" onClick={()=>setShowNewProsp(true)} style={{marginLeft:"auto",padding:"7px 14px",background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",borderRadius:7,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:10}}>+ Prospect</button>
                  </div>
                  {showNewProsp&&(
                    <div style={{background:T.card,border:`1px solid ${T.accentBorder}`,borderRadius:12,padding:18,marginBottom:14}} className="fade">
                      <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,color:T.accent,marginBottom:12}}>+ Novo Prospect</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}>
                        {[["Empresa","name","text"],["Contato","contact","text"],["E-mail","email","email"],["Valor Est.","value","number"]].map(([l,k,t])=>(
                          <div key={k}><div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>{l}</div>
                          <input type={t} value={newProsp[k]} onChange={e=>setNewProsp(p=>({...p,[k]:e.target.value}))} style={inpS}/></div>
                        ))}
                        <div><div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Etapa</div>
                        <select value={newProsp.stage} onChange={e=>setNewProsp(p=>({...p,stage:e.target.value}))} style={selS}>{PIPE_STAGES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></div>
                        <div><div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Responsável</div>
                        <select value={newProsp.owner} onChange={e=>setNewProsp(p=>({...p,owner:e.target.value}))} style={selS}><option>Rodrigo Bem</option><option>Ana Lima</option></select></div>
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <button className="btn" onClick={addProsp} style={{padding:"8px 16px",background:T.accent,color:"#000",borderRadius:7,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:11}}>Salvar</button>
                        <button className="btn" onClick={()=>setShowNewProsp(false)} style={{padding:"8px 12px",background:T.card,border:`1px solid ${T.border}`,color:T.muted,borderRadius:7,fontSize:11}}>Cancelar</button>
                      </div>
                    </div>
                  )}
                  {pipeView==="kanban"&&(
                    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,alignItems:"start"}}>
                      {PIPE_STAGES.map(stage=>{
                        const items=(filterSeg==="todos"?prospects:prospects.filter(p=>p.segment===filterSeg)).filter(p=>p.stage===stage.id);
                        return(
                          <div key={stage.id}
                            data-kanban-col={stage.id}
                            className={`drop-col${dragOverPipeStage===stage.id?" drag-over":""}`}
                            onDragOver={e=>onProspDragOver(e,stage.id)}
                            onDrop={e=>onProspDrop(e,stage.id)}
                            onDragLeave={()=>setDragOverPipeStage(null)}
                            style={{padding:"6px",minHeight:100}}>
                            <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:8,padding:"0 2px"}}>
                              <div style={{width:6,height:6,borderRadius:"50%",background:stage.color}}/>
                              <span style={{fontSize:9,color:stage.color,fontFamily:"Arial,sans-serif",textTransform:"uppercase"}}>{stage.label}</span>
                              <span style={{fontSize:8,color:T.muted,marginLeft:"auto"}}>{items.length}</span>
                              {dragOverPipeStage===stage.id&&<span style={{fontSize:8,color:stage.color,animation:"pl 1s infinite"}}>-</span>}
                            </div>
                            {items.map(p=>{
                              const isDragging=dragProspId===p.id||touchDrag?.id===p.id;
                              return(
                                <div key={p.id}
                                  className={`drag-card${isDragging?" dragging":""}`}
                                  draggable
                                  onDragStart={e=>{ onProspDragStart(e,p.id); setDragProspId(p.id); }}
                                  onDragEnd={onProspDragEnd}
                                  onTouchStart={e=>{ onTouchStart(e,"prosp",p.id); setDragProspId(p.id); }}
                                  onTouchMove={e=>onTouchMove(e,"prosp")}
                                  onTouchEnd={e=>onTouchEnd(e,"prosp")}
                                  onClick={()=>!isDragging&&setSelProsp(p)}
                                  style={{background:T.card,border:`1px solid ${isDragging?stage.color+"88":T.border}`,borderLeft:`3px solid ${stage.color}`,borderRadius:10,padding:"11px 13px",marginBottom:8,boxShadow:isDragging?`0 8px 24px ${stage.color}33`:"none",userSelect:"none",touchAction:"none"}}>
                                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}>
                                    <div style={{fontSize:11,fontWeight:700,fontFamily:"Arial,sans-serif"}}>{p.name}</div>
                                    <div style={{fontSize:9,color:T.muted,opacity:0.5}}>-</div>
                                  </div>
                                  <div style={{fontSize:10,fontWeight:700,color:stage.color,fontFamily:"Arial,sans-serif",marginBottom:3}}>{fmtK(p.value)}</div>
                                  <div style={{fontSize:9,color:T.muted,marginBottom:4}}>{p.segment} · {p.owner}</div>
                                  {p.notes&&<div style={{fontSize:9,color:T.soft,fontStyle:"italic",lineHeight:1.4}}>"{p.notes}"</div>}
                                </div>
                              );
                            })}
                            {dragOverPipeStage===stage.id&&(dragProspId||touchDrag)&&(
                              <div style={{height:50,border:`2px dashed ${stage.color}55`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:stage.color,opacity:0.6}}>Soltar aqui</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {pipeView==="lista"&&(
                    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
                      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",padding:"10px 16px",borderBottom:`1px solid ${T.border}`,gap:10}}>
                        {["Empresa","Segmento","Valor","Etapa","Responsável"].map(h=><div key={h} style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:1.5}}>{h}</div>)}
                      </div>
                      {(filterSeg==="todos"?prospects:prospects.filter(p=>p.segment===filterSeg)).map((p,i)=>{const s=PIPE_STAGES.find(x=>x.id===p.stage);return(
                        <div key={i} className="hr" onClick={()=>setSelProsp(p)} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",padding:"12px 16px",borderBottom:`1px solid ${T.border}`,gap:10,alignItems:"center"}}>
                          <div><div style={{fontSize:12,fontWeight:700,fontFamily:"Arial,sans-serif"}}>{p.name}</div><div style={{fontSize:9,color:T.muted}}>{p.email}</div></div>
                          <Badge label={p.segment} color={T.purple}/>
                          <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,color:s.color}}>{fmtK(p.value)}</div>
                          <Badge label={s.label} color={s.color}/>
                          <div style={{fontSize:10,color:T.soft}}>{p.owner}</div>
                        </div>
                      );})}
                    </div>
                  )}
                </div>
              )}
              {commTab==="faturamento"&&(
                <div>
                  <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"flex-end"}}>
                    {[["De",filterFrom,setFilterFrom],["Até",filterTo,setFilterTo]].map(([l,val,fn])=>(
                      <div key={l}><div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>{l}</div>
                      <input type="month" value={val} onChange={e=>fn(e.target.value)} style={{...inpS,width:"auto"}}/></div>
                    ))}
                    <div><div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Segmento</div>
                    <select value={filterSeg} onChange={e=>setFilterSeg(e.target.value)} style={{...selS,width:"auto"}}><option value="todos">Todos</option>{["Beleza","Automotivo","Energia","Entretenimento"].map(s=><option key={s}>{s}</option>)}</select></div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
                    <KCard label="Total faturado" value={fmtK(totalFat)} sub="no período" color={T.accent} icon="-"/>
                    <KCard label="Pendente receber" value={fmtK(totalPend)} sub="NFs em aberto" color={T.danger} icon="-"/>
                    <KCard label="Previsão mai-jun" value={fmtK(110000)} sub="campanhas ativas" color={T.warn} icon="-"/>
                    <KCard label="Ticket médio" value={fmtK(Math.round(totalFat/7))} sub="por campanha" color={T.purple} icon="-"/>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18}}>
                      <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Receita mensal</div>
                      <div style={{display:"flex",gap:3,alignItems:"flex-end",height:110}}>
                        {MONTHLY_DATA.map((d,i)=>(
                          <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                            {d.receita>0&&<div style={{fontSize:7,color:T.soft,fontFamily:"Arial,sans-serif"}}>{fmtK(d.receita)}</div>}
                            <div style={{width:"65%",background:d.receita>0?`linear-gradient(180deg,${T.accent},${T.accent}88)`:T.border,borderRadius:"3px 3px 0 0",height:`${d.receita>0?(d.receita/42100)*80:6}px`,transition:"height 0.4s"}}/>
                            <div style={{width:"65%",height:3,background:T.warn+"55",borderRadius:"0 0 2px 2px"}}/>
                            <div style={{fontSize:7,color:T.muted,fontFamily:"Arial,sans-serif",whiteSpace:"nowrap"}}>{d.month}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18}}>
                      <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:14}}>Por vendedor</div>
                      {USER_BILLING.map((u,i)=>(
                        <div key={i} style={{marginBottom:16}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                            <div style={{display:"flex",gap:8,alignItems:"center"}}>
                              <div style={{width:26,height:26,borderRadius:"50%",background:u.color+"22",border:`1px solid ${u.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:u.color,fontWeight:700}}>{u.avatar}</div>
                              <div style={{fontSize:11,fontFamily:"Arial,sans-serif",fontWeight:700}}>{u.user}</div>
                            </div>
                            <div style={{textAlign:"right"}}>
                              <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:14,color:u.color}}>{fmtK(u.faturado)}</div>
                              <div style={{fontSize:8,color:u.faturado>=u.meta?T.accent:T.muted}}>{u.faturado>=u.meta?"- Meta":"falta "+fmtK(u.meta-u.faturado)}</div>
                            </div>
                          </div>
                          <PBar pct={(u.faturado/u.meta)*100} color={u.faturado>=u.meta?T.accent:u.color}/>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
                    <div style={{padding:"12px 18px",borderBottom:`1px solid ${T.border}`,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13}}>Faturamento por cliente</div>
                    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 0.8fr 1fr 1fr 1fr",padding:"10px 18px",borderBottom:`1px solid ${T.border}`,gap:8}}>
                      {["Cliente","Segmento","Camps.","Faturado","Pendente","Última"].map(h=><div key={h} style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:1.5}}>{h}</div>)}
                    </div>
                    {(filterSeg==="todos"?CLIENT_BILLING:CLIENT_BILLING.filter(c=>c.segment===filterSeg)).map((c,i)=>(
                      <div key={i} className="hr" style={{display:"grid",gridTemplateColumns:"2fr 1fr 0.8fr 1fr 1fr 1fr",padding:"12px 18px",borderBottom:`1px solid ${T.border}`,gap:8,alignItems:"center"}}>
                        <div style={{fontSize:12,fontWeight:700,fontFamily:"Arial,sans-serif"}}>{c.name}</div>
                        <Badge label={c.segment} color={T.purple}/>
                        <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:16,color:T.info}}>{c.campanhas}</div>
                        <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,color:T.accent}}>{fmtK(c.faturado)}</div>
                        <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,color:c.pendente>0?T.danger:T.muted}}>{c.pendente>0?fmtK(c.pendente):"-"}</div>
                        <div style={{fontSize:10,color:T.soft}}>{c.ultima}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {commTab==="clientes"&&(
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18}}>
                    <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Clientes Ativos</div>
                    {CLIENTS_LIST.map((c,i)=>(
                      <div key={i} className="hr" style={{padding:"10px 8px",borderRadius:8,display:"flex",gap:12,alignItems:"center",marginBottom:4}}>
                        <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,fontFamily:"Arial,sans-serif"}}>{c.name}</div><div style={{fontSize:9,color:T.muted}}>{c.segment} · {c.owner}</div></div>
                        <div style={{textAlign:"right"}}><div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:13,color:T.accent}}>{fmtK(c.ltv)}</div><div style={{fontSize:9,color:T.muted}}>{c.campaigns} camps.</div></div>
                      </div>
                    ))}
                  </div>
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18}}>
                    <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Prospects</div>
                    {prospects.map((p,i)=>{const s=PIPE_STAGES.find(x=>x.id===p.stage);return(
                      <div key={i} className="hr" onClick={()=>setSelProsp(p)} style={{padding:"10px 8px",borderRadius:8,display:"flex",gap:12,alignItems:"center",marginBottom:4}}>
                        <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,fontFamily:"Arial,sans-serif"}}>{p.name}</div><div style={{fontSize:9,color:T.muted}}>{p.segment}</div></div>
                        <div style={{display:"flex",gap:6,alignItems:"center"}}><Badge label={s.label} color={s.color}/><div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:11,color:s.color}}>{fmtK(p.value)}</div></div>
                      </div>
                    );})}
                  </div>
                </div>
              )}

              {/* METAS */}
              {commTab==="metas"&&(
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <div style={{background:T.card,border:`1px solid ${T.accentBorder}`,borderLeft:`3px solid ${T.accent}`,borderRadius:12,padding:"14px 18px"}}>
                    <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,color:T.accent,marginBottom:4}}>Metas do time comercial</div>
                    <div style={{fontSize:10,color:T.muted}}>Defina a meta mensal de cada membro. Clique no valor para editar.</div>
                  </div>
                  {users.filter(u=>["comercial","admin"].includes(u.role)&&u.active).map(u=>{
                    const pipeline=prospects.filter(p=>p.owner===u.name).reduce((a,p)=>a+(p.value||0),0);
                    const meta=u.meta||0;
                    const pct=meta>0?Math.min(Math.round((pipeline/meta)*100),100):0;
                    return(
                      <div key={u.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"16px 20px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                          <div style={{display:"flex",gap:10,alignItems:"center"}}>
                            <div style={{width:32,height:32,borderRadius:"50%",background:ROLE_COLOR[u.role]+"22",border:`2px solid ${ROLE_COLOR[u.role]}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:ROLE_COLOR[u.role],fontWeight:700}}>{u.avatar}</div>
                            <div>
                              <div style={{fontSize:13,fontWeight:700,fontFamily:"Arial,sans-serif"}}>{u.name}</div>
                              <div style={{fontSize:9,color:T.muted}}>{ROLE_LABELS[u.role]}</div>
                            </div>
                          </div>
                          <div style={{display:"flex",gap:12,alignItems:"center"}}>
                            <div style={{textAlign:"right"}}>
                              <div style={{fontSize:9,color:T.muted,marginBottom:2}}>Pipeline atual</div>
                              <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:14,color:T.info}}>{fmtK(pipeline)}</div>
                            </div>
                            <div style={{textAlign:"right"}}>
                              <div style={{fontSize:9,color:T.muted,marginBottom:2}}>Meta mensal</div>
                              <input
                                type="number"
                                defaultValue={meta}
                                onBlur={async e=>{
                                  const v=Number(e.target.value)||0;
                                  setUsers(p=>p.map(x=>x.id===u.id?{...x,meta:v}:x));
                                  await supabase.from("usuarios").update({meta:v}).eq("id",u.id);
                                }}
                                style={{width:100,background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,padding:"4px 8px",fontSize:13,color:T.accent,fontWeight:700,fontFamily:"Arial,sans-serif",outline:"none",textAlign:"right"}}
                              />
                            </div>
                          </div>
                        </div>
                        <PBar pct={pct} color={pct>=100?T.accent:pct>=70?T.info:T.warn} h={6}/>
                        <div style={{display:"flex",justifyContent:"space-between",marginTop:5}}>
                          <div style={{fontSize:9,color:T.muted}}>{pct}% da meta atingida</div>
                          {meta>0&&<div style={{fontSize:9,color:pct>=100?T.accent:T.muted}}>Falta: {fmtK(Math.max(0,meta-pipeline))}</div>}
                          {meta===0&&<div style={{fontSize:9,color:T.warn}}>Meta não definida</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* --------------------------------------
              COMISSÕES
          -------------------------------------- */}
          {tab==="comissoes"&&(
            <div>
              {user.role==="admin"&&(
                <div>
                  <div style={{display:"flex",gap:0,marginBottom:18,borderBottom:`1px solid ${T.border}`}}>
                    {[["visao","Visão Geral"],["aprovacoes",`Aprovações${allPendingComm.length>0?` (${allPendingComm.length})`:""}`],["config","Configurar"],["historico","Histórico"]].map(([id,l])=>(
                      <div key={id} onClick={()=>setCommAdminTab(id)} style={{padding:"10px 16px",fontSize:11,cursor:"pointer",color:commAdminTab===id?T.accent:T.muted,borderBottom:`2px solid ${commAdminTab===id?T.accent:"transparent"}`,transition:"all 0.15s"}}>{l}</div>
                    ))}
                  </div>
                  {commAdminTab==="visao"&&(
                    <div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18}}>
                        <KCard label="Total aprovado" value={fmt(closings.filter(c=>c.status==="aprovado").reduce((a,c)=>a+c.value,0))} sub="este mês" color={T.accent} icon="-" onClick={()=>setCommAdminTab("historico")} hint="Ver histórico -"/>
                        <KCard label="Pendente aprovação" value={allPendingComm.length} sub="aguardando" color={T.warn} icon="-" onClick={()=>setCommAdminTab("aprovacoes")} hint="Aprovar agora -"/>
                        <KCard label="A pagar" value={fmt(closings.filter(c=>c.status==="aprovado"&&!c.pago).reduce((a,c)=>a+c.value,0))} sub="aprovados não pagos" color={T.danger} icon="-" onClick={()=>setCommAdminTab("historico")} hint="Ver a pagar -"/>
                        <KCard label="Fechamentos" value={closings.length} sub="total do mês" color={T.info} icon="-" onClick={()=>setCommAdminTab("historico")} hint="Ver todos -"/>
                      </div>
                      {["Mariana Costa","Carlos Mendes"].map((name,i)=>{
                        const uc=closings.filter(c=>c.user===name);
                        const uA=uc.filter(c=>c.status==="aprovado").reduce((a,c)=>a+c.value,0);
                        const uP=uc.filter(c=>c.pago).reduce((a,c)=>a+c.value,0);
                        const colors=[T.accent,T.purple];const avs=["MC","CM"];
                        return(
                          <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16,marginBottom:10,display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
                            <div style={{width:34,height:34,borderRadius:"50%",background:colors[i]+"22",border:`1px solid ${colors[i]}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:colors[i],fontWeight:700,flexShrink:0}}>{avs[i]}</div>
                            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,fontFamily:"Arial,sans-serif"}}>{name}</div><div style={{fontSize:9,color:T.muted}}>{uc.length} fechamentos · {uc.filter(c=>c.status==="pendente").length} aguardando</div></div>
                            {[["aprovado",uA,T.accent],["pago",uP,T.green],["a pagar",uA-uP,T.danger]].map(([l,v,c])=>(
                              <div key={l} style={{textAlign:"center"}}><div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:16,color:c}}>{fmt(v)}</div><div style={{fontSize:8,color:T.muted}}>{l}</div></div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {commAdminTab==="aprovacoes"&&(
                    <div>
                      {allPendingComm.length===0?(<div style={{textAlign:"center",padding:"60px",color:T.accent,fontFamily:"Arial,sans-serif",fontSize:18,fontWeight:700}}>- Tudo em dia!</div>):(
                        <div style={{display:"flex",flexDirection:"column",gap:10}}>
                          {allPendingComm.map((c,i)=>(
                            <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderLeft:`3px solid ${T.warn}`,borderRadius:10,padding:"16px 20px",display:"flex",gap:14,alignItems:"center",flexWrap:"wrap"}}>
                              <div style={{flex:1}}><div style={{display:"flex",gap:5,marginBottom:5}}><Badge label={c.type} color={T.purple}/><Badge label={c.project} color={T.info}/></div><div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:14}}>{c.partner}</div><div style={{fontSize:10,color:T.muted}}>por {c.user} · {c.date}</div></div>
                              <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:22,color:T.warn}}>{fmt(c.value)}</div>
                              <div style={{display:"flex",gap:8}}>
                                <button className="btn" onClick={async()=>{setClosings(p=>p.map(x=>x.id===c.id?{...x,status:"aprovado"}:x));await supabase.from("closings").update({status:"aprovado"}).eq("id",c.id);pushNotif("Comissão aprovada",`${c.partner} · ${fmt(c.value)}`,T.accent);}} style={{padding:"8px 14px",background:T.accent,color:"#000",borderRadius:7,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:11}}>- Aprovar</button>
                                <button className="btn" onClick={async()=>{setClosings(p=>p.map(x=>x.id===c.id?{...x,status:"reprovado"}:x));await supabase.from("closings").update({status:"reprovado"}).eq("id",c.id);}} style={{padding:"8px 12px",background:T.dangerDim,border:`1px solid ${T.danger}44`,color:T.danger,borderRadius:7,fontSize:11}}>-</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {commAdminTab==="config"&&(
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18}}>
                        <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Projetos</div>
                        <div style={{display:"flex",gap:8,marginBottom:10}}>
                          <input value={newProject} onChange={e=>setNewProject(e.target.value)} placeholder="Nome..." style={{...inpS,flex:1}} onKeyDown={e=>e.key==="Enter"&&newProject.trim()&&(setProjects(p=>{const rec={id:Date.now(),name:newProject.trim(),active:true};supabase.from("projects").insert(rec);return[...p,rec];}),setNewProject(""))}/>
                          <button className="btn" onClick={()=>newProject.trim()&&(setProjects(p=>{const rec={id:Date.now(),name:newProject.trim(),active:true};supabase.from("projects").insert(rec);return[...p,rec];}),setNewProject(""))} style={{padding:"8px 12px",background:T.accent,color:"#000",borderRadius:7,fontWeight:700,fontFamily:"Arial,sans-serif"}}>+</button>
                        </div>
                        {projects.map(p=>(<div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",background:T.surface,borderRadius:8,marginBottom:5,border:`1px solid ${T.border}`}}>
                          <span style={{fontSize:12}}>{p.name}</span>
                          <div onClick={async()=>{const na=!p.active;setProjects(prev=>prev.map(x=>x.id===p.id?{...x,active:na}:x));await supabase.from("projects").update({active:na}).eq("id",p.id);}} style={{fontSize:10,cursor:"pointer",color:p.active?T.accent:T.muted}}>{p.active?"- Ativo":"- Inativo"}</div>
                        </div>))}
                      </div>
                      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18}}>
                        <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Tipos de Parceiro</div>
                        <div style={{display:"flex",gap:8,marginBottom:10}}>
                          <input value={newPtype} onChange={e=>setNewPtype(e.target.value)} placeholder="Ex: Sorveteria..." style={{...inpS,flex:1}} onKeyDown={e=>e.key==="Enter"&&newPtype.trim()&&(setPtypes(p=>{const rec={id:Date.now(),name:newPtype.trim()};supabase.from("ptypes").insert(rec);return[...p,rec];}),setNewPtype(""))}/>
                          <button className="btn" onClick={()=>newPtype.trim()&&(setPtypes(p=>{const rec={id:Date.now(),name:newPtype.trim()};supabase.from("ptypes").insert(rec);return[...p,rec];}),setNewPtype(""))} style={{padding:"8px 12px",background:T.accent,color:"#000",borderRadius:7,fontWeight:700,fontFamily:"Arial,sans-serif"}}>+</button>
                        </div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>{ptypes.map(t=><div key={t.id} style={{padding:"5px 11px",background:T.purpleDim,border:`1px solid ${T.purple}44`,borderRadius:6,fontSize:11,color:T.purple}}>{t.name}</div>)}</div>
                      </div>
                      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18,gridColumn:"1 / -1"}}>
                        <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Tabela de Comissões · Tipo × Projeto</div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:10,marginBottom:12,padding:"12px",background:T.surface,borderRadius:10,border:`1px solid ${T.border}`}}>
                          {[["Tipo","typeId",ptypes],["Projeto","projectId",projects]].map(([l,k,opts])=>(
                            <div key={k}><div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>{l}</div>
                            <select value={newComm[k]} onChange={e=>setNewComm(p=>({...p,[k]:e.target.value}))} style={selS}><option value="">Selecione...</option>{opts.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select></div>
                          ))}
                          <div><div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Valor (R$)</div>
                          <input type="number" value={newComm.value} onChange={e=>setNewComm(p=>({...p,value:e.target.value}))} placeholder="80" style={inpS}/></div>
                          <div style={{display:"flex",alignItems:"flex-end"}}><button className="btn" onClick={addCommEntry} style={{padding:"8px 14px",background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",borderRadius:7,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:11}}>Salvar</button></div>
                        </div>
                        <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden"}}>
                          {commTable.map((c,i)=>(
                            <div key={i} className="hr" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 0.5fr",padding:"10px 14px",borderBottom:`1px solid ${T.border}`,gap:8,alignItems:"center"}}>
                              <Badge label={c.typeName} color={T.purple}/>
                              <Badge label={c.projectName} color={T.info}/>
                              <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:15,color:T.accent}}>{fmt(c.value)}</div>
                              <div onClick={async()=>{setCommTable(p=>p.filter(x=>x.id!==c.id));await supabase.from("comm_table").delete().eq("id",c.id);}} style={{fontSize:9,color:T.danger,cursor:"pointer"}}>remover</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {commAdminTab==="historico"&&(
                    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
                      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr 1fr",padding:"10px 16px",borderBottom:`1px solid ${T.border}`,gap:8}}>
                        {["Parceiro","Usuário","Tipo","Projeto","Valor","Status","Pagamento"].map(h=><div key={h} style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:1.5}}>{h}</div>)}
                      </div>
                      {closings.map((c,i)=>(
                        <div key={i} className="hr" style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr 1fr",padding:"11px 16px",borderBottom:`1px solid ${T.border}`,gap:8,alignItems:"center"}}>
                          <div><div style={{fontSize:11,fontWeight:700,fontFamily:"Arial,sans-serif"}}>{c.partner}</div><div style={{fontSize:8,color:T.muted}}>{c.date}</div></div>
                          <div style={{fontSize:10,color:T.soft}}>{c.user.split(" ")[0]}</div>
                          <Badge label={c.type} color={T.purple}/>
                          <Badge label={c.project.split(" ")[0]} color={T.info}/>
                          <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,color:T.accent}}>{fmt(c.value)}</div>
                          <Badge label={c.status} color={c.status==="aprovado"?T.accent:c.status==="pendente"?T.warn:T.danger}/>
                          <div>{c.status==="aprovado"&&!c.pago?(<button className="btn" onClick={async()=>{setClosings(p=>p.map(x=>x.id===c.id?{...x,pago:true}:x));await supabase.from("closings").update({pago:true}).eq("id",c.id);}} style={{padding:"3px 8px",background:T.greenDim,border:`1px solid ${T.green}44`,color:T.green,borderRadius:5,fontSize:9}}>Marcar pago</button>):(<span style={{fontSize:9,color:c.pago?T.green:T.muted}}>{c.pago?"- Pago":"-"}</span>)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {user.role==="base"&&(
                <div>
                  <div style={{background:`linear-gradient(135deg,${T.green}15,${T.green}08)`,border:`1px solid ${T.green}40`,borderRadius:14,padding:"22px 24px",marginBottom:18}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:16}}>
                      <div><div style={{fontSize:10,color:T.green,fontFamily:"Arial,sans-serif",letterSpacing:1.5,textTransform:"uppercase",marginBottom:5}}>Abril 2025 · Sua comissão</div><div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:38,color:T.green,lineHeight:1,marginBottom:3}}>{fmt(myTotal)}</div><div style={{fontSize:11,color:T.soft}}>{myApproved.length} fechamentos aprovados</div></div>
                      <div style={{textAlign:"right"}}><div style={{fontSize:10,color:T.muted,marginBottom:3}}>Meta do mês</div><div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:22,color:myTotal>=META_COMM?T.accent:T.warn}}>{fmt(META_COMM)}</div><div style={{fontSize:10,color:myTotal>=META_COMM?T.accent:T.muted,marginTop:3}}>{myTotal>=META_COMM?"- Meta atingida!":`faltam ${fmt(META_COMM-myTotal)}`}</div></div>
                    </div>
                    <PBar pct={(myTotal/META_COMM)*100} color={myTotal>=META_COMM?T.accent:T.warn} h={10}/>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}><span style={{fontSize:9,color:T.muted}}>{fmt(0)}</span><span style={{fontSize:9,color:T.soft}}>{Math.round((myTotal/META_COMM)*100)}%</span><span style={{fontSize:9,color:T.muted}}>{fmt(META_COMM)}</span></div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
                    <KCard label="Fechamentos" value={myClosings.length} sub="este mês" color={T.info} icon="-"/>
                    <KCard label="A receber" value={fmt(myPendingPay)} sub="aprovados" color={T.accent} icon="-"/>
                    <KCard label="Já recebido" value={fmt(myPago)} sub="pago" color={T.green} icon="-"/>
                  </div>
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18,marginBottom:14}}>
                    <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:10}}>Comissões vigentes</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                      {commTable.filter(c=>projects.find(p=>p.id===c.projectId)?.active).map((c,i)=>(
                        <div key={i} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div><div style={{fontSize:11,fontWeight:600}}>{c.typeName}</div><div style={{fontSize:9,color:T.muted,marginTop:1}}>{c.projectName}</div></div>
                          <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:15,color:T.accent}}>{fmt(c.value)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:showNewClosing?14:0}}>
                      <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13}}>Registrar fechamento</div>
                      {!showNewClosing&&<button className="btn" onClick={()=>setShowNewClosing(true)} style={{padding:"8px 14px",background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",borderRadius:7,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:11}}>+ Registrar</button>}
                    </div>
                    {showNewClosing&&(
                      <div className="fade">
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}>
                          <div><div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Nome do parceiro</div><input value={newClosing.partner} onChange={e=>setNewClosing(p=>({...p,partner:e.target.value}))} placeholder="Ex: Bar do Alemão" style={inpS}/></div>
                          <div><div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Tipo</div><select value={newClosing.typeId} onChange={e=>setNewClosing(p=>({...p,typeId:e.target.value}))} style={selS}><option value="">Selecione...</option>{ptypes.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
                          <div><div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Projeto</div><select value={newClosing.projectId} onChange={e=>setNewClosing(p=>({...p,projectId:e.target.value}))} style={selS}><option value="">Selecione...</option>{projects.filter(p=>p.active).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
                        </div>
                        {newClosing.typeId&&newClosing.projectId&&(()=>{const comm=commTable.find(c=>c.typeId===Number(newClosing.typeId)&&c.projectId===Number(newClosing.projectId));return comm?(<div style={{padding:"10px 14px",background:T.accentDim,border:`1px solid ${T.accentBorder}`,borderRadius:8,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:11,color:T.soft}}>Comissão por este fechamento:</span><span style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:17,color:T.accent}}>{fmt(comm.value)}</span></div>):(<div style={{padding:"10px 14px",background:T.warnDim,border:`1px solid ${T.warn}44`,borderRadius:8,marginBottom:10,fontSize:11,color:T.warn}}>-- Sem comissão configurada.</div>);})()}
                        <div style={{display:"flex",gap:8}}>
                          <button className="btn" onClick={submitClosing} style={{padding:"9px 16px",background:T.accent,color:"#000",borderRadius:7,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:11}}>Enviar para aprovação</button>
                          <button className="btn" onClick={()=>setShowNewClosing(false)} style={{padding:"9px 12px",background:T.card,border:`1px solid ${T.border}`,color:T.muted,borderRadius:7,fontSize:11}}>Cancelar</button>
                        </div>
                      </div>
                    )}
                    {myClosings.length>0&&!showNewClosing&&(
                      <div style={{marginTop:14}}>
                        <div style={{fontSize:9,color:T.muted,marginBottom:6,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Meus fechamentos</div>
                        {myClosings.map((c,i)=>(
                          <div key={i} style={{display:"flex",gap:10,alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${T.border}`,flexWrap:"wrap"}}>
                            <div style={{flex:1}}><div style={{fontSize:11,fontWeight:700,fontFamily:"Arial,sans-serif"}}>{c.partner}</div><div style={{fontSize:9,color:T.muted}}>{c.type} · {c.project}</div></div>
                            <Badge label={c.status} color={c.status==="aprovado"?T.accent:c.status==="pendente"?T.warn:T.danger}/>
                            <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,color:T.accent}}>{fmt(c.value)}</div>
                            <div style={{fontSize:9,color:c.pago?T.green:T.muted}}>{c.pago?"- Pago":"-"}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --------------------------------------
              PARCEIROS
          -------------------------------------- */}
          {tab==="parceiros"&&(
            <div style={{maxWidth:620}}>
              <div style={{background:T.card,border:`1px solid ${T.accentBorder}`,borderRadius:12,padding:18,marginBottom:16}}>
                <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,marginBottom:5}}>Automação de Prospecção</div>
                <div style={{fontSize:11,color:T.muted,lineHeight:1.7,fontFamily:"Arial,sans-serif"}}>IA gera CSV com @perfis - suba aqui - disparo automático DM + WhatsApp.</div>
              </div>
              <div style={{border:`2px dashed ${T.border}`,borderRadius:12,padding:"32px",textAlign:"center",cursor:"pointer",marginBottom:16}}>
                <div style={{fontSize:26,marginBottom:7}}>-</div>
                <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,marginBottom:3}}>Subir CSV de leads</div>
                <div style={{fontSize:10,color:T.muted,fontFamily:"Arial,sans-serif"}}>instagram_handle · nome · cidade</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[
                  {l:"DMs hoje",v:"20",c:"#E1306C",hint:"Ver conversas DM -",action:()=>setTab("base")},
                  {l:"WhatsApps hoje",v:"38",c:T.green,hint:"Ver conversas WA -",action:()=>setTab("base")},
                  {l:"Aguardando resposta",v:"241",c:T.warn,hint:"Ver lista de aguardando -",action:()=>{setTab("base");setBaseFilter("prospectado");}},
                  {l:"Convertidos",v:"8",c:T.accent,hint:"Ver base ativa -",action:()=>{setTab("base");setBaseFilter("ativo");setBaseTab("parceiros");}},
                ].map((k,i)=>(
                  <div key={i} onClick={k.action} className="hr" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"13px 15px",cursor:"pointer",borderLeft:`3px solid ${k.c}`,transition:"all 0.15s"}}
                    onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                    onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                    <div style={{fontFamily:"Arial,sans-serif",fontSize:22,fontWeight:800,color:k.c,marginBottom:3}}>{k.v}</div>
                    <div style={{fontSize:10,color:T.muted,fontFamily:"Arial,sans-serif",marginBottom:5}}>{k.l}</div>
                    <div style={{fontSize:8,color:k.c,fontFamily:"Arial,sans-serif",opacity:0.7}}>{k.hint}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --------------------------------------
              SPRINT 04 - BASE (Score + Contratos)
          -------------------------------------- */}
          {tab==="base"&&(
            <div>
              {/* Partner detail modal */}
              {selPartner&&(
                <div style={{position:"fixed",inset:0,background:"#000000CC",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={()=>setSelPartner(null)}>
                  <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,width:"100%",maxWidth:540,maxHeight:"88vh",overflow:"auto"}} onClick={e=>e.stopPropagation()}>
                    <div style={{padding:"18px 22px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div>
                        <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:17,marginBottom:5}}>{selPartner.name||"Novo Parceiro"}</div>
                        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                          <Badge label={selPartner.category||"Sem categoria"} color={T.purple}/>
                          <Badge label={selPartner.status} color={STATUS_PARTNER[selPartner.status]||T.muted}/>
                          {selPartner.score&&<Badge label={`Score ${selPartner.score}`} color={selPartner.score>80?T.accent:selPartner.score>60?T.warn:T.danger}/>}
                        </div>
                      </div>
                      <div onClick={()=>setSelPartner(null)} style={{cursor:"pointer",color:T.muted,fontSize:20}}>×</div>
                    </div>
                    <div style={{padding:"18px 22px"}}>
                      {/* Dados básicos */}
                      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:16,marginBottom:14}}>
                        <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Dados Básicos</div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                          <div>
                            <div style={{fontSize:8,color:T.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Nome do estabelecimento *</div>
                            <input value={selPartner.name||""} onChange={e=>setSelPartner(p=>({...p,name:e.target.value}))} placeholder="Ex: Burger Bros SP" style={inpS}/>
                          </div>
                          <div>
                            <div style={{fontSize:8,color:T.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Segmento / Culinária *</div>
                            <input value={selPartner.category||""} onChange={e=>setSelPartner(p=>({...p,category:e.target.value}))} placeholder="Ex: Hamburguer, Japonesa" style={inpS}/>
                          </div>
                          <div>
                            <div style={{fontSize:8,color:T.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Handle Instagram</div>
                            <input value={selPartner.handle||""} onChange={e=>setSelPartner(p=>({...p,handle:e.target.value}))} placeholder="@restaurante" style={inpS}/>
                          </div>
                          <div>
                            <div style={{fontSize:8,color:T.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Status</div>
                            <select value={selPartner.status||"prospectado"} onChange={e=>setSelPartner(p=>({...p,status:e.target.value}))} style={inpS}>
                              {["prospectado","negociando","ativo","inativo"].map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                            </select>
                          </div>
                          <div>
                            <div style={{fontSize:8,color:T.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Cidade</div>
                            <input value={selPartner.city||""} onChange={e=>setSelPartner(p=>({...p,city:e.target.value}))} placeholder="São Paulo" style={inpS}/>
                          </div>
                          <div>
                            <div style={{fontSize:8,color:T.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Estado (UF)</div>
                            <input value={selPartner.state||""} onChange={e=>setSelPartner(p=>({...p,state:e.target.value.toUpperCase().slice(0,2)}))} placeholder="SP" style={inpS}/>
                          </div>
                          <div>
                            <div style={{fontSize:8,color:T.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Entregas / mês</div>
                            <input type="number" value={selPartner.deliveries||""} onChange={e=>setSelPartner(p=>({...p,deliveries:Number(e.target.value)}))} placeholder="Ex: 500" style={inpS}/>
                          </div>
                          <div>
                            <div style={{fontSize:8,color:T.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Meses na base</div>
                            <input type="number" value={selPartner.mesesNaBase||""} onChange={e=>setSelPartner(p=>({...p,mesesNaBase:Number(e.target.value)}))} placeholder="0" style={inpS}/>
                          </div>
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                          <div>
                            <div style={{fontSize:8,color:T.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>⭐ Avaliação Google (0-5)</div>
                            <input type="number" min="0" max="5" step="0.1" value={selPartner.avaliacaoGoogle||""} onChange={e=>setSelPartner(p=>({...p,avaliacaoGoogle:Number(e.target.value)}))} placeholder="Ex: 4.3" style={inpS}/>
                          </div>
                          <div>
                            <div style={{fontSize:8,color:T.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>🛵 Avaliação iFood (0-5)</div>
                            <input type="number" min="0" max="5" step="0.1" value={selPartner.avaliacaoIfood||""} onChange={e=>setSelPartner(p=>({...p,avaliacaoIfood:Number(e.target.value)}))} placeholder="Ex: 4.7" style={inpS}/>
                          </div>
                        </div>
                        <button onClick={async()=>{
                          const upd={...selPartner,score:calcScore(selPartner)};
                          setSelPartner(upd);
                          setBasePartners(prev=>{
                            const exists=prev.find(p=>p.id===upd.id);
                            return exists?prev.map(p=>p.id===upd.id?upd:p):[...prev,upd];
                          });
                          await supabase.from("parceiros").upsert({id:upd.id,data:upd});
                          pushNotif("Parceiro salvo",upd.name,"Dados atualizados",T.accent);
                        }} style={{width:"100%",padding:"9px",background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",borderRadius:7,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:11,border:"none",cursor:"pointer"}}>💾 Salvar dados básicos</button>
                      </div>
                      {/* Score breakdown */}
                      <div style={{marginBottom:18}}>
                        <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Score Detalhado</div>
                        <div style={{display:"flex",flexDirection:"column",gap:8}}>
                          {[
                            {l:"Volume de entregas",v:Math.min(Math.round(selPartner.deliveries/500*30),30),max:30,hint:`${selPartner.deliveries} entregas/mês`},
                            {l:"Campanhas participadas",v:selPartner.campanhas*15,max:45,hint:`${selPartner.campanhas} campanha${selPartner.campanhas!==1?"s":""}`},
                            {l:"Tempo na base",v:selPartner.mesesNaBase*2,max:24,hint:`${selPartner.mesesNaBase} meses`},
                            {l:"Contrato assinado",v:selPartner.contrato.status==="assinado"?20:0,max:20,hint:selPartner.contrato.status==="assinado"?"- Assinado":"Sem contrato"},
                            {l:"Engajamento",v:selPartner.engajamento*5,max:15,hint:`Nível ${selPartner.engajamento}/3`},
                          ].map((s,i)=>(
                            <div key={i}>
                              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                                <span style={{fontSize:11,color:T.soft}}>{s.l}</span>
                                <span style={{fontSize:11,color:T.text,fontFamily:"Arial,sans-serif"}}>{s.v}/{s.max} · <span style={{color:T.muted,fontSize:9}}>{s.hint}</span></span>
                              </div>
                              <PBar pct={(s.v/s.max)*100} color={s.v===s.max?T.accent:T.info} h={5}/>
                            </div>
                          ))}
                        </div>
                        <div style={{marginTop:12,padding:"10px 14px",background:T.accentDim,border:`1px solid ${T.accentBorder}`,borderRadius:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <span style={{fontSize:12,color:T.soft}}>Score total</span>
                          <span style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:22,color:selPartner.score>80?T.accent:selPartner.score>60?T.warn:T.danger}}>{selPartner.score}/100</span>
                        </div>
                      </div>
                      {/* Endereço */}
                      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:16,marginBottom:14}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                          <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13}}>Endereço</div>
                          <button className="btn" onClick={()=>{
                            if(!selPartner.endereco?.rua)return;
                            const addr=`${selPartner.endereco.rua} ${selPartner.endereco.numero}, ${selPartner.endereco.bairro}, ${selPartner.city}`;
                            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}&limit=1`)
                              .then(r=>r.json())
                              .then(data=>{
                                if(data[0]){
                                  const lat=Number(data[0].lat),lng=Number(data[0].lon);
                                  const updated={...selPartner,endereco:{...selPartner.endereco,lat,lng}};
                                  setSelPartner(updated);
                                  setBasePartners(prev=>prev.map(p=>p.id===selPartner.id?{...p,endereco:{...p.endereco,lat,lng}}:p));
                                }
                              }).catch(()=>{});
                          }} style={{fontSize:10,padding:"5px 12px",background:T.infoDim,border:`1px solid ${T.info}44`,color:T.info,borderRadius:6}}>
                            - Buscar coordenadas
                          </button>
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 0.4fr",gap:8,marginBottom:8}}>
                          <div>
                            <div style={{fontSize:8,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Rua</div>
                            <input value={selPartner.endereco?.rua||""} onChange={e=>setSelPartner(p=>({...p,endereco:{...p.endereco,rua:e.target.value}}))} placeholder="Ex: Rua Augusta" style={inpS}/>
                          </div>
                          <div>
                            <div style={{fontSize:8,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Nº</div>
                            <input value={selPartner.endereco?.numero||""} onChange={e=>setSelPartner(p=>({...p,endereco:{...p.endereco,numero:e.target.value}}))} placeholder="123" style={inpS}/>
                          </div>
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                          <div>
                            <div style={{fontSize:8,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Bairro</div>
                            <input value={selPartner.endereco?.bairro||""} onChange={e=>setSelPartner(p=>({...p,endereco:{...p.endereco,bairro:e.target.value}}))} placeholder="Centro" style={inpS}/>
                          </div>
                          <div>
                            <div style={{fontSize:8,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>CEP</div>
                            <input value={selPartner.endereco?.cep||""} onChange={e=>setSelPartner(p=>({...p,endereco:{...p.endereco,cep:e.target.value}}))} placeholder="00000-000" style={inpS}/>
                          </div>
                        </div>
                        {selPartner.endereco?.lat&&(
                          <div style={{padding:"8px 12px",background:T.accentDim,border:`1px solid ${T.accentBorder}`,borderRadius:7,fontSize:10,color:T.accent,fontFamily:"Arial,sans-serif"}}>
                            - Coordenadas: {selPartner.endereco.lat.toFixed(4)}, {selPartner.endereco.lng.toFixed(4)}
                          </div>
                        )}
                        <button className="btn" onClick={async()=>{let upd=null;setBasePartners(prev=>prev.map(p=>{if(p.id!==selPartner.id)return p;upd={...p,endereco:selPartner.endereco};return upd;}));if(upd)await supabase.from("parceiros").upsert({id:upd.id,data:upd});}} style={{width:"100%",marginTop:10,padding:"8px",background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",borderRadius:7,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:11}}>- Salvar endereço</button>
                      </div>

                      {/* WhatsApp + Instagram + Fachada */}
                      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:16,marginBottom:14}}>
                        <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Contato Digital</div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                          <div>
                            <div style={{fontSize:8,color:T.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>WhatsApp</div>
                            <input value={selPartner.whatsapp||""} onChange={e=>setSelPartner(p=>({...p,whatsapp:e.target.value}))} placeholder="+55 11 99999-9999" style={inpS}/>
                          </div>
                          <div>
                            <div style={{fontSize:8,color:T.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Seguidores Instagram</div>
                            <input type="number" value={selPartner.instagram_seguidores||""} onChange={e=>setSelPartner(p=>({...p,instagram_seguidores:Number(e.target.value)}))} placeholder="Ex: 20300" style={inpS}/>
                          </div>
                        </div>
                        <div style={{marginBottom:8}}>
                          <div style={{fontSize:8,color:T.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Foto da Fachada (URL)</div>
                          <input value={selPartner.foto_fachada||""} onChange={e=>setSelPartner(p=>({...p,foto_fachada:e.target.value}))} placeholder="https://... ou cole URL da imagem" style={inpS}/>
                          {selPartner.foto_fachada&&<img src={selPartner.foto_fachada} style={{width:"100%",height:100,objectFit:"cover",borderRadius:7,marginTop:6}} alt="Fachada" onError={e=>e.target.style.display="none"}/>}
                        </div>
                        <button className="btn" onClick={async()=>{let upd=null;setBasePartners(prev=>prev.map(p=>{if(p.id!==selPartner.id)return p;upd={...p,whatsapp:selPartner.whatsapp,instagram_seguidores:selPartner.instagram_seguidores,foto_fachada:selPartner.foto_fachada};return upd;}));if(upd)await supabase.from("parceiros").upsert({id:upd.id,data:upd});}} style={{width:"100%",padding:"8px",background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",borderRadius:7,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:11}}>Salvar contato digital</button>
                      </div>

                      {/* Contract */}
                      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:16}}>
                        <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Contrato de Exclusividade</div>
                        {[
                          ["Status", selPartner.contrato.status],
                          ["Enviado em", selPartner.contrato.enviadoEm||"-"],
                          ["Assinado em", selPartner.contrato.assinadoEm||"-"],
                          ["Expira em", selPartner.contrato.expiraEm||"-"],
                        ].map(([l,v])=>(
                          <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                            <span style={{fontSize:10,color:T.muted,fontFamily:"Arial,sans-serif"}}>{l}</span>
                            {l==="Status"
                              ? <Badge label={v} color={CONTRATO_COLOR[v]||T.muted}/>
                              : <span style={{fontSize:11,color:T.text}}>{v}</span>
                            }
                          </div>
                        ))}
                        <div style={{marginTop:12,display:"flex",gap:8}}>
                          {selPartner.contrato.status==="sem contrato"&&(
                            <button className="btn" onClick={()=>{enviarContrato(selPartner.id);setSelPartner(p=>({...p,contrato:{...p.contrato,status:"pendente",enviadoEm:new Date().toLocaleDateString("pt-BR")}}));}} style={{flex:1,padding:"9px",background:`linear-gradient(135deg,${T.warn},${T.warn}AA)`,color:"#000",borderRadius:7,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:11}}>- Enviar Contrato</button>
                          )}
                          {selPartner.contrato.status==="pendente"&&(
                            <button className="btn" onClick={()=>assinarContrato(selPartner.id)} style={{flex:1,padding:"9px",background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",borderRadius:7,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:11}}>- Marcar como Assinado</button>
                          )}
                          {(selPartner.contrato.status==="expirando"||selPartner.contrato.status==="expirado")&&(
                            <button className="btn" onClick={()=>{enviarContrato(selPartner.id);setSelPartner(p=>({...p,contrato:{...p.contrato,status:"pendente",enviadoEm:new Date().toLocaleDateString("pt-BR")}}));}} style={{flex:1,padding:"9px",background:`linear-gradient(135deg,${T.danger},${T.danger}AA)`,color:"#fff",borderRadius:7,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:11}}>- Renovar Contrato</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* KPIs */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18}}>
                <KCard label="Total na base" value={basePartners.length} sub="parceiros cadastrados" color={T.accent} icon="-" onClick={()=>setBaseTab("parceiros")} hint="Ver todos -"/>
                <KCard label="Score médio" value={Math.round(basePartners.reduce((a,p)=>a+p.score,0)/basePartners.length)} sub="da base ativa" color={T.purple} icon="-" onClick={()=>setBaseTab("score")} hint="Ver ranking -"/>
                <KCard label="Contratos pendentes" value={basePartners.filter(p=>["pendente","sem contrato"].includes(p.contrato.status)).length} sub="aguardando assinatura" color={T.warn} icon="-" onClick={()=>setBaseTab("contratos")} hint="Ver contratos -"/>
                <KCard label="Expirando em breve" value={basePartners.filter(p=>p.contrato.status==="expirando").length} sub="renovar até 30 dias" color={T.danger} icon="-" onClick={()=>setBaseTab("contratos")} hint="Renovar -"/>
              </div>

              {/* Sub tabs */}
              <div style={{display:"flex",gap:0,marginBottom:16,borderBottom:`1px solid ${T.border}`}}>
                {[["parceiros","Parceiros"],["score","Score & Ranking"],["contratos","Contratos"]].map(([id,l])=>(
                  <div key={id} onClick={()=>setBaseTab(id)} style={{padding:"9px 16px",fontSize:11,cursor:"pointer",color:baseTab===id?T.accent:T.muted,borderBottom:`2px solid ${baseTab===id?T.accent:"transparent"}`,transition:"all 0.15s"}}>{l}</div>
                ))}
              </div>

              {/* -- PARCEIROS -- */}
              {baseTab==="parceiros"&&(
                <div>
                  <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                    <input value={baseSearch} onChange={e=>setBaseSearch(e.target.value)} placeholder="Buscar parceiro ou @..." style={{...inpS,width:200}}/>
                    <select value={baseFilter} onChange={e=>setBaseFilter(e.target.value)} style={{...selS,width:"auto"}}><option value="todos">Todos status</option>{["ativo","negociando","prospectado"].map(s=><option key={s}>{s}</option>)}</select>
                    <select value={baseScoreMin} onChange={e=>setBaseScoreMin(Number(e.target.value))} style={{...selS,width:"auto"}}>
                      <option value={0}>Qualquer score</option>
                      <option value={80}>Score ≥ 80</option>
                      <option value={60}>Score ≥ 60</option>
                    </select>
                    <select value={baseContratoFilter} onChange={e=>setBaseContratoFilter(e.target.value)} style={{...selS,width:"auto"}}>
                      <option value="todos">Todos contratos</option>
                      {["assinado","pendente","expirando","sem contrato"].map(s=><option key={s}>{s}</option>)}
                    </select>
                    </div>
                    <button onClick={()=>setSelPartner({id:Date.now(),name:"",handle:"",city:"",state:"",category:"",deliveries:0,status:"prospectado",mesesNaBase:0,campanhas:0,engajamento:2,avaliacaoGoogle:0,avaliacaoIfood:0,contrato:{status:"sem contrato",enviadoEm:null,assinadoEm:null,expiraEm:null},whatsapp:"",instagram_seguidores:0,foto_fachada:"",address:"",_isNew:true})} style={{padding:"7px 16px",background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",border:"none",borderRadius:7,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:10,cursor:"pointer",whiteSpace:"nowrap"}}>+ Novo Parceiro</button>
                  </div>
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
                    <div style={{display:"grid",gridTemplateColumns:"2fr 1.1fr 0.9fr 0.7fr 0.7fr 0.9fr 1fr",padding:"10px 16px",borderBottom:`1px solid ${T.border}`,gap:8}}>
                      {["Estabelecimento","Cidade","Categoria","Entrega/mês","Score","Contrato","Status"].map(h=><div key={h} style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:1.5,fontFamily:"Arial,sans-serif"}}>{h}</div>)}
                    </div>
                    {basePartners.filter(p=>{
                      const ms=baseFilter==="todos"||p.status===baseFilter;
                      const mq=p.name.toLowerCase().includes(baseSearch.toLowerCase())||p.handle.toLowerCase().includes(baseSearch.toLowerCase());
                      const ms2=p.score>=baseScoreMin;
                      const mc=baseContratoFilter==="todos"||p.contrato.status===baseContratoFilter;
                      return ms&&mq&&ms2&&mc;
                    }).map((p,i)=>(
                      <div key={i} className="hr" onClick={()=>setSelPartner(p)} style={{display:"grid",gridTemplateColumns:"2fr 1.1fr 0.9fr 0.7fr 0.7fr 0.9fr 1fr",padding:"12px 16px",borderBottom:`1px solid ${T.border}`,gap:8,alignItems:"center"}}>
                        <div>
                          <div style={{fontSize:12,fontWeight:700,fontFamily:"Arial,sans-serif"}}>{p.name}</div>
                          <div style={{fontSize:9,color:T.muted,fontFamily:"Arial,sans-serif"}}>{p.handle}</div>
                        </div>
                        <div style={{fontSize:10,color:T.soft}}>{p.city} · {p.state}</div>
                        <div style={{fontSize:10,color:T.soft}}>{p.category}</div>
                        <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:14}}>{p.deliveries}</div>
                        <div>
                          <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:14,color:p.score>80?T.accent:p.score>60?T.warn:T.danger}}>{p.score}</div>
                          <PBar pct={p.score} color={p.score>80?T.accent:p.score>60?T.warn:T.danger} h={3}/>
                        </div>
                        <Badge label={p.contrato.status} color={CONTRATO_COLOR[p.contrato.status]||T.muted}/>
                        <Badge label={p.status} color={STATUS_PARTNER[p.status]||T.muted}/>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* -- SCORE & RANKING -- */}
              {baseTab==="score"&&(
                <div>
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:20,marginBottom:14}}>
                    <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,marginBottom:6}}>Como o score é calculado</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginTop:12}}>
                      {[{l:"Entregas/mês",pts:"até 30pts",icon:"--"},{l:"Campanhas",pts:"15pts cada",icon:"-"},{l:"Tempo na base",pts:"2pts/mês",icon:"-"},{l:"Contrato assinado",pts:"+20pts",icon:"-"},{l:"Engajamento",pts:"até 15pts",icon:"-"}].map((s,i)=>(
                        <div key={i} style={{background:T.surface,borderRadius:8,padding:"10px 12px",textAlign:"center",border:`1px solid ${T.border}`}}>
                          <div style={{fontSize:18,marginBottom:4}}>{s.icon}</div>
                          <div style={{fontSize:10,fontWeight:600,marginBottom:2}}>{s.l}</div>
                          <div style={{fontSize:9,color:T.accent,fontFamily:"Arial,sans-serif"}}>{s.pts}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
                    <div style={{padding:"12px 18px",borderBottom:`1px solid ${T.border}`,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13}}>Ranking da Base</div>
                    {[...basePartners].sort((a,b)=>b.score-a.score).map((p,i)=>(
                      <div key={p.id} className="hr" onClick={()=>setSelPartner(p)} style={{display:"flex",gap:14,padding:"13px 18px",borderBottom:`1px solid ${T.border}`,alignItems:"center"}}>
                        <div style={{width:28,height:28,borderRadius:"50%",background:i<3?[T.warn+"33",T.soft+"22",T.soft+"15"][i]:T.border,border:`2px solid ${i<3?[T.warn,T.soft,T.soft][i]:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:i<3?[T.warn,T.soft,T.soft][i]:T.muted,fontWeight:700,flexShrink:0}}>{i+1}</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:12,fontWeight:700,fontFamily:"Arial,sans-serif",marginBottom:2}}>{p.name}</div>
                          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                            <Badge label={p.category} color={T.purple}/>
                            <Badge label={p.contrato.status} color={CONTRATO_COLOR[p.contrato.status]||T.muted}/>
                          </div>
                        </div>
                        <div style={{width:120}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                            <span style={{fontSize:9,color:T.muted}}>Score</span>
                            <span style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:14,color:p.score>80?T.accent:p.score>60?T.warn:T.danger}}>{p.score}</span>
                          </div>
                          <PBar pct={p.score} color={p.score>80?T.accent:p.score>60?T.warn:T.danger} h={6}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* -- CONTRATOS -- */}
              {baseTab==="contratos"&&(
                <div>
                  {/* Summary cards - clicáveis para filtrar */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
                    {[
                      {l:"Assinados",k:"assinado",v:basePartners.filter(p=>p.contrato.status==="assinado").length,c:T.accent},
                      {l:"Pendentes",k:"pendente",v:basePartners.filter(p=>p.contrato.status==="pendente").length,c:T.warn},
                      {l:"Expirando",k:"expirando",v:basePartners.filter(p=>p.contrato.status==="expirando").length,c:T.danger},
                      {l:"Sem contrato",k:"sem contrato",v:basePartners.filter(p=>p.contrato.status==="sem contrato").length,c:T.muted},
                    ].map((k,i)=>{
                      const isActive=contratoTableFilter===k.k;
                      return(
                        <div key={i} onClick={()=>setContratoTableFilter(isActive?"todos":k.k)}
                          className="hr"
                          style={{background:isActive?k.c+"22":T.card,border:`2px solid ${isActive?k.c:k.c+"33"}`,borderRadius:10,padding:"14px 16px",cursor:"pointer",transition:"all 0.15s"}}>
                          <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:22,color:k.c}}>{k.v}</div>
                          <div style={{fontSize:10,color:isActive?k.c:T.muted,fontFamily:"Arial,sans-serif",marginTop:2}}>{k.l}</div>
                          {isActive&&<div style={{fontSize:8,color:k.c,marginTop:4,fontFamily:"Arial,sans-serif"}}>Filtrando - · clique para limpar</div>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Priority: needs action */}
                  {basePartners.filter(p=>["expirando","sem contrato"].includes(p.contrato.status)&&p.status==="ativo").length>0&&(
                    <div style={{background:T.card,border:`1px solid ${T.danger}44`,borderLeft:`3px solid ${T.danger}`,borderRadius:12,padding:16,marginBottom:14}}>
                      <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12,color:T.danger,marginBottom:10}}>- Ação necessária</div>
                      {basePartners.filter(p=>["expirando","sem contrato"].includes(p.contrato.status)&&p.status==="ativo").map((p,i)=>(
                        <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${T.border}`,gap:10,flexWrap:"wrap"}}>
                          <div>
                            <div style={{fontSize:12,fontWeight:700,fontFamily:"Arial,sans-serif"}}>{p.name}</div>
                            <div style={{fontSize:9,color:T.muted}}>{p.category} · {p.city}</div>
                          </div>
                          <Badge label={p.contrato.status} color={CONTRATO_COLOR[p.contrato.status]||T.muted}/>
                          <button className="btn" onClick={()=>enviarContrato(p.id)} style={{padding:"6px 12px",background:`linear-gradient(135deg,${T.warn},${T.warn}AA)`,color:"#000",borderRadius:6,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:10}}>- Enviar</button>
                        </div>
                      ))}
                      <button className="btn" onClick={()=>basePartners.filter(p=>["expirando","sem contrato"].includes(p.contrato.status)&&p.status==="ativo").forEach(p=>enviarContrato(p.id))} style={{width:"100%",marginTop:12,padding:"9px",background:T.surface,border:`1px solid ${T.border}`,color:T.warn,borderRadius:8,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:11}}>- Enviar para todos de uma vez</button>
                    </div>
                  )}

                  {/* All contracts table */}
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
                    {/* Filter bar */}
                    <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.border}`,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                      <span style={{fontSize:9,color:T.muted,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Filtrar:</span>
                      {[["todos","Todos"],["assinado","Assinados"],["pendente","Pendentes"],["expirando","Expirando"],["sem contrato","Sem contrato"]].map(([v,l])=>(
                        <div key={v} onClick={()=>setContratoTableFilter(v)} className="tb"
                          style={{fontSize:9,padding:"4px 10px",borderRadius:5,cursor:"pointer",fontFamily:"Arial,sans-serif",
                            background:contratoTableFilter===v?(CONTRATO_COLOR[v]||T.accent)+"22":T.surface,
                            border:`1px solid ${contratoTableFilter===v?(CONTRATO_COLOR[v]||T.accent)+"66":T.border}`,
                            color:contratoTableFilter===v?(CONTRATO_COLOR[v]||T.accent):T.muted}}>
                          {l}
                        </div>
                      ))}
                      {contratoTableFilter!=="todos"&&(
                        <div style={{marginLeft:"auto",fontSize:9,color:T.muted,fontFamily:"Arial,sans-serif"}}>
                          {basePartners.filter(p=>p.contrato.status===contratoTableFilter).length} resultado(s)
                        </div>
                      )}
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr",padding:"10px 16px",borderBottom:`1px solid ${T.border}`,gap:8}}>
                      {["Parceiro","Status","Enviado em","Assinado em","Expira em","Ação"].map(h=><div key={h} style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:1.5,fontFamily:"Arial,sans-serif"}}>{h}</div>)}
                    </div>
                    {basePartners.filter(p=>contratoTableFilter==="todos"||p.contrato.status===contratoTableFilter).map((p,i)=>(
                      <div key={i} className="hr" onClick={()=>setSelPartner(p)} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr",padding:"12px 16px",borderBottom:`1px solid ${T.border}`,gap:8,alignItems:"center"}}>
                        <div>
                          <div style={{fontSize:12,fontWeight:700,fontFamily:"Arial,sans-serif"}}>{p.name}</div>
                          <div style={{fontSize:9,color:T.muted}}>{p.category}</div>
                        </div>
                        <Badge label={p.contrato.status} color={CONTRATO_COLOR[p.contrato.status]||T.muted}/>
                        <div style={{fontSize:10,color:T.soft,fontFamily:"Arial,sans-serif"}}>{p.contrato.enviadoEm||"-"}</div>
                        <div style={{fontSize:10,color:p.contrato.assinadoEm?T.accent:T.muted,fontFamily:"Arial,sans-serif"}}>{p.contrato.assinadoEm||"-"}</div>
                        <div style={{fontSize:10,color:p.contrato.status==="expirando"?T.danger:T.soft,fontFamily:"Arial,sans-serif"}}>{p.contrato.expiraEm||"-"}</div>
                        <div onClick={e=>e.stopPropagation()}>
                          {p.contrato.status==="sem contrato"&&<button className="btn" onClick={()=>enviarContrato(p.id)} style={{fontSize:9,padding:"4px 8px",background:T.warnDim,border:`1px solid ${T.warn}44`,color:T.warn,borderRadius:5}}>Enviar</button>}
                          {p.contrato.status==="pendente"&&<button className="btn" onClick={()=>assinarContrato(p.id)} style={{fontSize:9,padding:"4px 8px",background:T.accentDim,border:`1px solid ${T.accentBorder}`,color:T.accent,borderRadius:5}}>Assinar</button>}
                          {p.contrato.status==="expirando"&&<button className="btn" onClick={()=>enviarContrato(p.id)} style={{fontSize:9,padding:"4px 8px",background:T.dangerDim,border:`1px solid ${T.danger}44`,color:T.danger,borderRadius:5}}>Renovar</button>}
                          {p.contrato.status==="assinado"&&<span style={{fontSize:9,color:T.accent}}>- Ok</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}


            </div>
          )}

          {/* --------------------------------------
              PLANEJAMENTO DE MÍDIA
          -------------------------------------- */}
          {tab==="planejamento-midia"&&(
            <PlanTab
              planAtivo={planAtivo} setPlanAtivo={setPlanAtivo}
              planStep={planStep} setPlanStep={setPlanStep}
              planAnalise={planAnalise} setPlanAnalise={setPlanAnalise}
              planLoading={planLoading} planGeoLoading={planGeoLoading} setPlanGeoLoading={setPlanGeoLoading}
              showPlanWizard={showPlanWizard} setShowPlanWizard={setShowPlanWizard}
              planejamentos={planejamentos}
              salvarPlano={salvarPlano} gerarPropostaPDF={gerarPropostaPDF}
              geocodeEndereco={geocodeEndereco} gerarAnaliseIA={gerarAnaliseIA}
              sugerirParceiros={sugerirParceiros}
              user={user} basePartners={basePartners} projects={projects}
            />
          )}

          {/* --------------------------------------
              RELATÓRIOS — CONSTRUTOR
          -------------------------------------- */}
          {tab==="relatorios"&&(()=>{
            const isAdmin=user.role==="admin";

            // --- FILTRO DE PERÍODO ---
            const parseDataLanc=s=>{if(!s)return null;const[d,m,y]=s.split("/");return y?new Date(Number(y),Number(m)-1,Number(d)):null;};
            const hj=new Date();
            const aplicarFiltro=(tipo)=>{
              const m=hj.getMonth(),y=hj.getFullYear();
              if(tipo==="mes"){const s=new Date(y,m,1),e=new Date(y,m+1,0);setRelDateStart(s.toISOString().slice(0,10));setRelDateEnd(e.toISOString().slice(0,10));setRelPeriodo(s.toLocaleDateString("pt-BR",{month:"long",year:"numeric"}));}
              else if(tipo==="mes_ant"){const s=new Date(y,m-1,1),e=new Date(y,m,0);setRelDateStart(s.toISOString().slice(0,10));setRelDateEnd(e.toISOString().slice(0,10));setRelPeriodo(s.toLocaleDateString("pt-BR",{month:"long",year:"numeric"}));}
              else if(tipo==="trim"){const s=new Date(y,Math.floor(m/3)*3,1),e=new Date(y,Math.floor(m/3)*3+3,0);setRelDateStart(s.toISOString().slice(0,10));setRelDateEnd(e.toISOString().slice(0,10));setRelPeriodo(`Q${Math.floor(m/3)+1} ${y}`);}
              else if(tipo==="ano"){setRelDateStart(`${y}-01-01`);setRelDateEnd(`${y}-12-31`);setRelPeriodo(`Ano ${y}`);}
              else{setRelDateStart("");setRelDateEnd("");setRelPeriodo("Todo o período");}
            };
            const dStart=relDateStart?new Date(relDateStart):null;
            const dEnd=relDateEnd?new Date(relDateEnd+"T23:59:59"):null;
            const lancFilt=lancamentos.filter(l=>{if(!dStart&&!dEnd)return true;const d=parseDataLanc(l.data);if(!d)return true;return(!dStart||d>=dStart)&&(!dEnd||d<=dEnd);});

            // --- GERADOR PDF ---
            const gerarPDF=()=>{
              const w=window.open("","_blank");
              if(!w)return;
              const blocos=relSelecionados.map(id=>BLOCOS.find(b=>b.id===id)).filter(Boolean);
              const fmt=v=>v?.toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:0})||"R$0";
              const receitaTotal=lancFilt.reduce((a,l)=>a+(l.entrada||0),0);
              const despesaTotal=lancFilt.reduce((a,l)=>a+(l.saida||0),0);
              const resultado=receitaTotal-despesaTotal;
              const CORES={accent:"#00E5A0",danger:"#FF4D6A",info:"#3D9EFF",warn:"#F5A623",purple:"#9B7FFF",pink:"#F472B6"};
              const barH=(label,value,max,color)=>`<div style="margin-bottom:8px"><div style="display:flex;justify-content:space-between;margin-bottom:3px"><span style="font-size:11px">${label}</span><span style="font-size:11px;font-weight:700;color:${color}">${value}</span></div><div style="height:6px;background:#f0f0f0;border-radius:3px"><div style="height:100%;width:${max>0?Math.min(100,Math.round((typeof value==="number"?value:0)/max*100)):0}%;background:${color};border-radius:3px"></div></div></div>`;
              const kpiH=(label,value,color)=>`<div style="background:#f8fafb;border-radius:10px;padding:12px;text-align:center;border:1px solid #eee"><div style="font-size:20px;font-weight:800;color:${color};font-family:sans-serif">${value}</div><div style="font-size:9px;color:#888;margin-top:2px">${label}</div></div>`;
              const renderB=(b)=>{
                if(b.id==="fat_mensal")return`<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">${fatMensais.slice(-8).map(f=>`<div style="text-align:center;background:#f8fafb;border-radius:6px;padding:8px"><div style="font-size:13px;font-weight:800;color:#00E5A0">${(f.fat/1000).toFixed(0)}k</div><div style="font-size:8px;color:#999">${f.mes}</div></div>`).join("")}</div>`;
                if(b.id==="dre")return`<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">${kpiH("Receita",fmt(receitaTotal),"#00E5A0")}${kpiH("Despesas",fmt(despesaTotal),"#FF4D6A")}${kpiH("Resultado",fmt(resultado),resultado>=0?"#00E5A0":"#FF4D6A")}</div>`;
                if(b.id==="saldos")return`<div>${contas.map(c=>barH(c.banco,fmt(c.saldo),contas.reduce((a,x)=>a+x.saldo,0),c.cor||"#3D9EFF")).join("")}<div style="display:flex;justify-content:space-between;margin-top:8px;padding-top:8px;border-top:1px solid #eee"><strong>Total</strong><strong style="color:#00E5A0">${fmt(contas.reduce((a,c)=>a+c.saldo,0))}</strong></div></div>`;
                if(b.id==="custo_pessoal"){const itens=custosFix.filter(c=>c.categoria==="Salario"||c.categoria==="Pro-Labore");const tot=itens.reduce((a,c)=>a+c.valor,0);return`<div>${itens.map(c=>barH(c.descricao,fmt(c.valor),tot,c.categoria==="Pro-Labore"?"#00E5A0":"#F472B6")).join("")}<div style="display:flex;justify-content:space-between;margin-top:8px;padding-top:8px;border-top:1px solid #eee"><strong>Total pessoal</strong><strong style="color:#FF4D6A">${fmt(tot)}</strong></div></div>`;}
                if(b.id==="desp_categoria"){const cats=Object.entries(lancFilt.filter(l=>l.saida>0).reduce((acc,l)=>{const cat=l.categoria||"Outros";acc[cat]=(acc[cat]||0)+(l.saida||0);return acc;},{})).sort((a,b)=>b[1]-a[1]).slice(0,6);const tot=cats.reduce((a,[,v])=>a+v,0);const cores=["#F5A623","#FF4D6A","#9B7FFF","#3D9EFF","#F472B6","#00E5A0"];return`<div>${cats.map(([cat,v],i)=>barH(cat,fmt(v),tot,cores[i])).join("")}</div>`;}
                if(b.id==="pipeline_etapas")return`<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:5px">${PIPE_STAGES.map(s=>{const v=prospects.filter(p=>p.stage===s.id).reduce((a,p)=>a+(p.value||0),0);return`<div style="text-align:center;background:#f8fafb;border-radius:6px;padding:8px"><div style="font-size:12px;font-weight:800;color:${s.color}">${(v/1000).toFixed(0)}k</div><div style="font-size:8px;color:#999">${s.label}</div></div>`;}).join("")}</div>`;
                if(b.id==="meta_vs_realizado")return`<div>${users.filter(u=>["comercial","admin"].includes(u.role)&&u.active).map(u=>{const r=prospects.filter(p=>p.owner===u.name).reduce((a,p)=>a+(p.value||0),0);const m=u.meta||0;const pct=m>0?Math.min(Math.round(r/m*100),100):0;return barH(u.name+" ("+pct+"%)",fmt(r),m||r,pct>=100?"#00E5A0":"#3D9EFF");}).join("")}</div>`;
                if(b.id==="camps_grafica"){const data=Object.entries(camps.reduce((acc,c)=>{const g=c.graficaFornecedor||"Não definido";acc[g]=(acc[g]||0)+1;return acc;},{}));const tot=data.reduce((a,[,v])=>a+v,0);return`<div>${data.map(([g,n])=>barH(g,n+" camp.",tot,"#9B7FFF")).join("")}</div>`;}
                if(b.id==="parceiros_status")return`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">${Object.entries(basePartners.reduce((acc,p)=>{acc[p.status]=(acc[p.status]||0)+1;return acc;},{})).map(([s,n])=>`<div style="background:#f8fafb;border-radius:6px;padding:8px;text-align:center"><div style="font-size:18px;font-weight:800;color:#00E5A0">${n}</div><div style="font-size:9px;color:#888">${s}</div></div>`).join("")}</div>`;
                if(b.id==="top_parceiros")return`<div>${[...basePartners].sort((a,c)=>c.score-a.score).slice(0,8).map((p,i)=>`<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #f0f0f0"><div><strong style="font-size:11px">${i+1}. ${p.name}</strong><span style="font-size:9px;color:#999"> · ${p.category}</span></div><span style="font-size:12px;font-weight:700;color:${p.score>=80?"#00E5A0":"#F5A623"}">${p.score}</span></div>`).join("")}</div>`;
                if(b.id==="prazos"){const pr=camps.filter(c=>c.stage<5).flatMap(c=>[c.graficaPrazo?{camp:c.name,tipo:"Gráfica",prazo:c.graficaPrazo,dias:Math.ceil((new Date(c.graficaPrazo.includes("-")?c.graficaPrazo:c.graficaPrazo.split("/").reverse().join("-"))-hj)/86400000)}:null,c.logisticaPrazo?{camp:c.name,tipo:"Logística",prazo:c.logisticaPrazo,dias:Math.ceil((new Date(c.logisticaPrazo.includes("-")?c.logisticaPrazo:c.logisticaPrazo.split("/").reverse().join("-"))-hj)/86400000)}:null]).filter(Boolean).sort((a,b)=>a.dias-b.dias);return pr.length===0?"<p style=\'color:#999;font-size:11px\'>Nenhum prazo cadastrado</p>":`<div>${pr.map(p=>`<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f0f0f0"><div><strong style="font-size:11px">${p.camp}</strong><span style="font-size:9px;color:#999"> · ${p.tipo}</span></div><span style="font-size:11px;font-weight:700;color:${p.dias<=0?"#FF4D6A":p.dias<=7?"#F5A623":"#888"}">${p.dias<=0?"VENCIDO":p.dias+"d"}</span></div>`).join("")}</div>`;}
                if(b.id==="impactos_canal"){const d=[{l:"Offline",v:camps.reduce((a,c)=>a+Math.round((c.sacolasDistribuidas||c.sacolas||0)*3.3),0)},{l:"Stories",v:camps.flatMap(c=>c.impactos?.stories||[]).reduce((a,s)=>a+Number(s.impressoes),0)},{l:"Influencer",v:camps.flatMap(c=>c.impactos?.influencer||[]).reduce((a,s)=>a+Number(s.alcance),0)}];const tot=d.reduce((a,x)=>a+x.v,0);const cores=["#00E5A0","#E1306C","#F5A623"];return`<div>${d.map((x,i)=>barH(x.l,x.v.toLocaleString("pt-BR"),tot,cores[i])).join("")}</div>`;}
                if(b.id==="perf_campanhas")return`<div>${camps.filter(c=>c.sacolas>0).slice(0,6).map(c=>{const imp=c.impactos||{};const total=Math.round((c.sacolasDistribuidas||c.sacolas||0)*3.3)+(imp.stories||[]).reduce((a,s)=>a+Number(s.impressoes),0)+(imp.influencer||[]).reduce((a,s)=>a+Number(s.alcance),0);return barH(c.name.slice(0,30),total.toLocaleString("pt-BR"),camps.reduce((mx,x)=>{const t=Math.round((x.sacolasDistribuidas||x.sacolas||0)*3.3);return t>mx?t:mx;},0),"#3D9EFF");}).join("")}</div>`;
                if(b.id==="conversao")return`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">${users.filter(u=>["comercial","admin"].includes(u.role)&&u.active).map(u=>{const meus=prospects.filter(p=>p.owner===u.name);const conv=meus.length>0?Math.round(meus.filter(p=>p.stage==="fechado").length/meus.length*100):0;return kpiH(u.name.split(" ")[0],conv+"%",conv>=60?"#00E5A0":conv>=30?"#3D9EFF":"#FF4D6A");}).join("")}</div>`;
                return`<p style="color:#999;font-size:11px">Dados do período selecionado</p>`;
              };
              const html=`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>${relTitulo}</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;background:#fff;color:#1a1a2e}@page{margin:15mm;size:A4}@media print{.no-print{display:none!important};body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}.page{max-width:840px;margin:0 auto;padding:24px}.header{background:linear-gradient(135deg,#00E5A0 0%,#00B87A 100%);border-radius:16px;padding:28px 32px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:flex-start}.logo-area .brand{font-size:9px;letter-spacing:4px;text-transform:uppercase;color:rgba(0,0,0,0.5);margin-bottom:6px}.logo-area .title{font-size:28px;font-weight:900;color:#000;margin-bottom:4px;letter-spacing:-0.5px}.logo-area .sub{font-size:12px;color:rgba(0,0,0,0.6)}.meta-area{text-align:right}.meta-area .user{font-size:13px;font-weight:700;color:#000}.meta-area .role{font-size:10px;color:rgba(0,0,0,0.55)}.meta-area .badge{display:inline-block;margin-top:8px;font-size:9px;background:rgba(0,0,0,0.12);color:#000;border-radius:20px;padding:3px 12px;font-weight:600}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}.card{background:#fff;border:1.5px solid #f0f0f0;border-radius:12px;padding:18px 20px;break-inside:avoid;box-shadow:0 1px 4px rgba(0,0,0,0.04)}.card-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:#555;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #f5f5f5}.footer{text-align:center;margin-top:28px;padding-top:16px;border-top:1px solid #f0f0f0;font-size:9px;color:#bbb;letter-spacing:0.5px}.divider{display:flex;align-items:center;gap:8px;margin-bottom:14px}.divider-line{flex:1;height:1px;background:#f0f0f0}.divider-text{font-size:9px;color:#bbb;text-transform:uppercase;letter-spacing:2px}</style></head><body><div class="page"><div class="header"><div class="logo-area"><div class="brand">Ecodely · Mídia In-Home · Sistema de Gestão</div><div class="title">${relTitulo}</div><div class="sub">${relPeriodo} · Gerado em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</div></div><div class="meta-area"><div class="user">${user.name}</div><div class="role">${ROLE_LABELS[user.role]||user.role}</div><div class="badge">${blocos.length} bloco${blocos.length!==1?"s":""} selecionado${blocos.length!==1?"s":""}</div></div></div><div class="grid">${blocos.map(b=>`<div class="card"><div class="card-title">${b.label}</div>${renderB(b)}</div>`).join("")}</div><div class="footer">ECODELY MÍDIA IN-HOME &nbsp;·&nbsp; ecodely.com.br &nbsp;·&nbsp; Relatório gerado automaticamente &nbsp;·&nbsp; ${new Date().getFullYear()}</div></div><script>setTimeout(()=>window.print(),600);</script></body></html>`;
              w.document.write(html);w.document.close();
            };

                        // Blocos disponíveis por setor
            const BLOCOS=[
              // FINANCEIRO
              {id:"fat_mensal",cat:"Financeiro",label:"Faturamento mensal",icon:"-",color:T.accent,roles:["admin","financeiro"],
               render:()=>{
                 const data=fatMensais.slice(-8).map(f=>({name:f.mes,value:f.fat}));
                 return(<div>
                   <ResponsiveContainer width="100%" height={180}>
                     <BarChart data={data} margin={{top:0,right:0,left:-10,bottom:20}}>
                       <XAxis dataKey="name" tick={{fontSize:8,fill:T.muted}} angle={-35} textAnchor="end"/>
                       <YAxis tick={{fontSize:8,fill:T.muted}} tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}k`:v}/>
                       <Tooltip formatter={v=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:0})} contentStyle={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,fontSize:10}}/>
                       <Bar dataKey="value" fill={T.accent} radius={[4,4,0,0]}/>
                     </BarChart>
                   </ResponsiveContainer>
                 </div>);
               }},
              {id:"dre",cat:"Financeiro",label:"DRE — Resultado",icon:"-",color:T.info,roles:["admin","financeiro"],
               render:()=>{
                 const rec=lancamentos.filter(l=>l.tipo!=="Saldo Anterior").reduce((a,l)=>a+(l.entrada||0),0);
                 const desp=lancamentos.filter(l=>l.tipo!=="Saldo Anterior").reduce((a,l)=>a+(l.saida||0),0);
                 const res=rec-desp;
                 const data=[{name:"Receita",value:rec,fill:T.accent},{name:"Despesas",value:desp,fill:T.danger},{name:"Resultado",value:res,fill:res>=0?T.info:T.danger}];
                 return(<div>
                   <ResponsiveContainer width="100%" height={160}>
                     <BarChart data={data} margin={{top:0,right:0,left:-10,bottom:0}}>
                       <XAxis dataKey="name" tick={{fontSize:10,fill:T.muted}}/>
                       <YAxis tick={{fontSize:8,fill:T.muted}} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
                       <Tooltip formatter={v=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:0})} contentStyle={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,fontSize:10}}/>
                       <Bar dataKey="value" radius={[4,4,0,0]}>{data.map((d,i)=><Cell key={i} fill={d.fill}/>)}</Bar>
                     </BarChart>
                   </ResponsiveContainer>
                 </div>);
               }},
              {id:"desp_categoria",cat:"Financeiro",label:"Despesas por categoria",icon:"-",color:T.warn,roles:["admin","financeiro"],
               render:()=>{
                 const cats=Object.entries(lancamentos.filter(l=>l.tipo!=="Saldo Anterior"&&l.saida>0).reduce((acc,l)=>{const cat=l.categoria||"Outros";acc[cat]=(acc[cat]||0)+(l.saida||0);return acc;},{})).sort((a,b)=>b[1]-a[1]).slice(0,6);
                 const COLORS=[T.warn,T.danger,T.purple,T.info,T.pink,T.accent];
                 const data=cats.map(([name,value])=>({name,value}));
                 return(<div style={{display:"flex",gap:12,alignItems:"center"}}>
                   <ResponsiveContainer width={140} height={140}>
                     <PieChart><Pie data={data} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value">{data.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie></PieChart>
                   </ResponsiveContainer>
                   <div style={{flex:1}}>
                     {data.map((d,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:`1px solid ${T.border}`}}>
                       <div style={{display:"flex",gap:6,alignItems:"center"}}><div style={{width:8,height:8,borderRadius:"50%",background:COLORS[i%COLORS.length]}}/><span style={{fontSize:10}}>{d.name}</span></div>
                       <span style={{fontSize:10,fontWeight:700,color:COLORS[i%COLORS.length]}}>{d.value.toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:0})}</span>
                     </div>)}
                   </div>
                 </div>);
               }},
              {id:"custo_pessoal",cat:"Financeiro",label:"Custo pessoal",icon:"-",color:T.pink,roles:["admin","financeiro"],
               render:()=>{
                 const itens=custosFix.filter(c=>c.categoria==="Salario"||c.categoria==="Pro-Labore").sort((a,b)=>b.valor-a.valor);
                 const total=itens.reduce((a,c)=>a+c.valor,0);
                 return(<div>
                   {itens.map((c,i)=><div key={i} style={{marginBottom:8}}>
                     <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                       <span style={{fontSize:11}}>{c.descricao}</span>
                       <span style={{fontSize:11,fontWeight:700,color:c.categoria==="Pro-Labore"?T.accent:T.pink}}>{c.valor.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</span>
                     </div>
                     <div style={{height:5,background:T.surface,borderRadius:3}}><div style={{height:"100%",width:`${Math.round(c.valor/total*100)}%`,background:c.categoria==="Pro-Labore"?T.accent:T.pink,borderRadius:3}}/></div>
                   </div>)}
                   <div style={{display:"flex",justifyContent:"space-between",marginTop:10,paddingTop:10,borderTop:`1px solid ${T.border}`}}>
                     <span style={{fontSize:11,fontWeight:700}}>Total pessoal</span>
                     <span style={{fontSize:13,fontWeight:800,color:T.danger,fontFamily:"Arial,sans-serif"}}>{total.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</span>
                   </div>
                 </div>);
               }},
              {id:"saldos",cat:"Financeiro",label:"Saldos bancários",icon:"-",color:T.info,roles:["admin","financeiro"],
               render:()=>{
                 const total=contas.reduce((a,c)=>a+c.saldo,0);
                 return(<div>
                   {contas.map((c,i)=><div key={i} style={{marginBottom:8}}>
                     <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                       <div style={{display:"flex",gap:6,alignItems:"center"}}><div style={{width:10,height:10,borderRadius:"50%",background:c.cor||T.info}}/><span style={{fontSize:11}}>{c.banco}</span></div>
                       <span style={{fontSize:12,fontWeight:700,color:T.info}}>{c.saldo.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</span>
                     </div>
                     <div style={{height:5,background:T.surface,borderRadius:3}}><div style={{height:"100%",width:`${total>0?Math.round(c.saldo/total*100):0}%`,background:c.cor||T.info,borderRadius:3}}/></div>
                   </div>)}
                   <div style={{display:"flex",justifyContent:"space-between",marginTop:10,paddingTop:10,borderTop:`1px solid ${T.border}`}}>
                     <span style={{fontSize:11,fontWeight:700}}>Total</span>
                     <span style={{fontSize:14,fontWeight:800,color:T.accent,fontFamily:"Arial,sans-serif"}}>{total.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</span>
                   </div>
                 </div>);
               }},
              // COMERCIAL
              {id:"pipeline_etapas",cat:"Comercial",label:"Pipeline por etapa",icon:"-",color:T.info,roles:["admin","comercial"],
               render:()=>{
                 const data=PIPE_STAGES.map(s=>({name:s.label,value:prospects.filter(p=>p.stage===s.id).reduce((a,p)=>a+(p.value||0),0),fill:s.color}));
                 return(<div>
                   <ResponsiveContainer width="100%" height={180}>
                     <BarChart data={data} margin={{top:0,right:0,left:-10,bottom:20}}>
                       <XAxis dataKey="name" tick={{fontSize:8,fill:T.muted}} angle={-20} textAnchor="end"/>
                       <YAxis tick={{fontSize:8,fill:T.muted}} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
                       <Tooltip formatter={v=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:0})} contentStyle={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,fontSize:10}}/>
                       <Bar dataKey="value" radius={[4,4,0,0]}>{data.map((d,i)=><Cell key={i} fill={d.fill}/>)}</Bar>
                     </BarChart>
                   </ResponsiveContainer>
                 </div>);
               }},
              {id:"meta_vs_realizado",cat:"Comercial",label:"Meta vs Realizado",icon:"-",color:T.accent,roles:["admin","comercial"],
               render:()=>{
                 const data=users.filter(u=>["comercial","admin"].includes(u.role)&&u.active).map(u=>({
                   name:u.name.split(" ")[0],
                   realizado:prospects.filter(p=>p.owner===u.name).reduce((a,p)=>a+(p.value||0),0),
                   meta:u.meta||0
                 })).filter(d=>d.meta>0||d.realizado>0);
                 return(<div>
                   <ResponsiveContainer width="100%" height={180}>
                     <BarChart data={data} margin={{top:0,right:0,left:-10,bottom:0}}>
                       <XAxis dataKey="name" tick={{fontSize:10,fill:T.muted}}/>
                       <YAxis tick={{fontSize:8,fill:T.muted}} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
                       <Tooltip formatter={v=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:0})} contentStyle={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,fontSize:10}}/>
                       <Legend wrapperStyle={{fontSize:10}}/>
                       <Bar dataKey="meta" name="Meta" fill={T.muted} radius={[4,4,0,0]}/>
                       <Bar dataKey="realizado" name="Realizado" fill={T.accent} radius={[4,4,0,0]}/>
                     </BarChart>
                   </ResponsiveContainer>
                 </div>);
               }},
              {id:"conversao",cat:"Comercial",label:"Conversão por usuário",icon:"-",color:T.purple,roles:["admin","comercial"],
               render:()=>{
                 const data=users.filter(u=>["comercial","admin"].includes(u.role)&&u.active).map(u=>{
                   const meus=prospects.filter(p=>p.owner===u.name);
                   const fech=meus.filter(p=>p.stage==="fechado").length;
                   return{name:u.name.split(" ")[0],conv:meus.length>0?Math.round(fech/meus.length*100):0,total:meus.length,fech};
                 }).filter(d=>d.total>0);
                 return(<div>
                   <ResponsiveContainer width="100%" height={180}>
                     <BarChart data={data} margin={{top:0,right:0,left:-10,bottom:0}}>
                       <XAxis dataKey="name" tick={{fontSize:10,fill:T.muted}}/>
                       <YAxis tick={{fontSize:8,fill:T.muted}} unit="%"/>
                       <Tooltip formatter={v=>`${v}%`} contentStyle={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,fontSize:10}}/>
                       <Bar dataKey="conv" name="Conversão" fill={T.purple} radius={[4,4,0,0]}>{data.map((_,i)=><Cell key={i} fill={_.conv>=60?T.accent:_.conv>=30?T.info:T.danger}/>)}</Bar>
                     </BarChart>
                   </ResponsiveContainer>
                 </div>);
               }},
              // OPERACIONAL
              {id:"camps_grafica",cat:"Operacional",label:"Campanhas por gráfica",icon:"-",color:T.purple,roles:["admin","operacional"],
               render:()=>{
                 const data=Object.entries(camps.reduce((acc,c)=>{const g=c.graficaFornecedor||"Não definido";acc[g]=(acc[g]||0)+1;return acc;},{})).map(([name,value])=>({name,value}));
                 const COLORS=[T.purple,T.info,T.accent,T.warn,T.pink];
                 return(<div style={{display:"flex",gap:12,alignItems:"center"}}>
                   <ResponsiveContainer width={140} height={140}>
                     <PieChart><Pie data={data} cx="50%" cy="50%" innerRadius={30} outerRadius={60} dataKey="value">{data.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie></PieChart>
                   </ResponsiveContainer>
                   <div style={{flex:1}}>
                     {data.map((d,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${T.border}`}}>
                       <div style={{display:"flex",gap:6,alignItems:"center"}}><div style={{width:8,height:8,borderRadius:"50%",background:COLORS[i%COLORS.length]}}/><span style={{fontSize:10}}>{d.name}</span></div>
                       <span style={{fontSize:11,fontWeight:700,color:COLORS[i%COLORS.length]}}>{d.value} camp.</span>
                     </div>)}
                   </div>
                 </div>);
               }},
              {id:"prazos",cat:"Operacional",label:"Prazos críticos",icon:"-",color:T.danger,roles:["admin","operacional"],
               render:()=>{
                 const hoje=new Date();
                 const parse=s=>{if(!s)return null;const d=s.includes("-")?new Date(s):new Date(s.split("/").reverse().join("-"));return isNaN(d)?null:d;};
                 const itens=camps.filter(c=>c.stage<5).flatMap(c=>[
                   c.graficaPrazo?{camp:c.name,tipo:"Gráfica",prazo:c.graficaPrazo,dias:Math.ceil((parse(c.graficaPrazo)-hoje)/86400000)}:null,
                   c.logisticaPrazo?{camp:c.name,tipo:"Logística",prazo:c.logisticaPrazo,dias:Math.ceil((parse(c.logisticaPrazo)-hoje)/86400000)}:null
                 ]).filter(Boolean).filter(p=>p.dias!==null).sort((a,b)=>a.dias-b.dias);
                 return itens.length===0?<div style={{fontSize:11,color:T.accent}}>Nenhum prazo cadastrado</div>:(
                   <div>{itens.map((p,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                     <div><div style={{fontSize:11,fontWeight:600}}>{p.camp}</div><div style={{fontSize:9,color:T.muted}}>{p.tipo} · {p.prazo}</div></div>
                     <div style={{padding:"3px 10px",borderRadius:6,background:p.dias<=0?T.danger:p.dias<=7?T.warn+"33":T.accentDim,color:p.dias<=0?T.danger:p.dias<=7?T.warn:T.accent,fontSize:10,fontWeight:700,alignSelf:"center"}}>
                       {p.dias<=0?"VENCIDO":p.dias===1?"amanhã":`${p.dias}d`}
                     </div>
                   </div>)}</div>
                 );
               }},
              // BASE
              {id:"parceiros_status",cat:"Base",label:"Parceiros por status",icon:"-",color:T.green,roles:["admin","base"],
               render:()=>{
                 const data=Object.entries(basePartners.reduce((acc,p)=>{acc[p.status]=(acc[p.status]||0)+1;return acc;},{})).map(([name,value])=>({name:name.charAt(0).toUpperCase()+name.slice(1),value}));
                 const COLORS=[T.accent,T.info,T.warn,T.muted,T.danger];
                 return(<div style={{display:"flex",gap:12,alignItems:"center"}}>
                   <ResponsiveContainer width={130} height={130}>
                     <PieChart><Pie data={data} cx="50%" cy="50%" innerRadius={28} outerRadius={55} dataKey="value">{data.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie></PieChart>
                   </ResponsiveContainer>
                   <div style={{flex:1}}>
                     {data.map((d,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${T.border}`}}>
                       <div style={{display:"flex",gap:6,alignItems:"center"}}><div style={{width:8,height:8,borderRadius:"50%",background:COLORS[i%COLORS.length]}}/><span style={{fontSize:10}}>{d.name}</span></div>
                       <span style={{fontSize:11,fontWeight:700,color:COLORS[i%COLORS.length]}}>{d.value}</span>
                     </div>)}
                   </div>
                 </div>);
               }},
              {id:"top_parceiros",cat:"Base",label:"Top parceiros por score",icon:"-",color:T.warn,roles:["admin","base"],
               render:()=>(
                 <div>{[...basePartners].sort((a,b)=>b.score-a.score).slice(0,8).map((p,i)=><div key={i} style={{display:"flex",gap:8,alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${T.border}`}}>
                   <div style={{width:20,height:20,borderRadius:"50%",background:i<3?T.warn+"33":T.surface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:T.muted,flexShrink:0}}>{i+1}</div>
                   <div style={{flex:1}}><div style={{fontSize:11,fontWeight:600}}>{p.name}</div><div style={{fontSize:8,color:T.muted}}>{p.category} · {p.city}</div></div>
                   <div style={{display:"flex",gap:4,alignItems:"center"}}>
                     <div style={{height:5,width:50,background:T.surface,borderRadius:3}}><div style={{height:"100%",width:`${p.score}%`,background:p.score>=80?T.accent:T.warn,borderRadius:3}}/></div>
                     <span style={{fontSize:11,fontWeight:700,color:p.score>=80?T.accent:T.warn,width:24,textAlign:"right"}}>{p.score}</span>
                   </div>
                 </div>)}</div>
               )},
              // MARKETING
              {id:"impactos_canal",cat:"Marketing",label:"Impactos por canal",icon:"-",color:T.pink,roles:["admin","marketing"],
               render:()=>{
                 const data=[
                   {name:"Offline",value:camps.reduce((a,c)=>a+Math.round((c.sacolasDistribuidas||c.sacolas||0)*3.3),0),fill:T.accent},
                   {name:"Stories",value:camps.flatMap(c=>c.impactos?.stories||[]).reduce((a,s)=>a+Number(s.impressoes),0),fill:"#E1306C"},
                   {name:"Influencer",value:camps.flatMap(c=>c.impactos?.influencer||[]).reduce((a,s)=>a+Number(s.alcance),0),fill:T.warn},
                   {name:"Impulsionado",value:camps.flatMap(c=>c.impactos?.impulsionado||[]).reduce((a,s)=>a+Number(s.alcance),0),fill:T.info},
                 ].filter(d=>d.value>0);
                 return(<div>
                   <ResponsiveContainer width="100%" height={160}>
                     <BarChart data={data} margin={{top:0,right:0,left:-10,bottom:0}}>
                       <XAxis dataKey="name" tick={{fontSize:9,fill:T.muted}}/>
                       <YAxis tick={{fontSize:8,fill:T.muted}} tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}k`:v}/>
                       <Tooltip formatter={v=>v.toLocaleString("pt-BR")} contentStyle={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,fontSize:10}}/>
                       <Bar dataKey="value" radius={[4,4,0,0]}>{data.map((d,i)=><Cell key={i} fill={d.fill}/>)}</Bar>
                     </BarChart>
                   </ResponsiveContainer>
                 </div>);
               }},
              {id:"perf_campanhas",cat:"Marketing",label:"Performance campanhas",icon:"-",color:T.info,roles:["admin","marketing"],
               render:()=>{
                 const data=camps.filter(c=>c.sacolas>0).map(c=>{const imp=c.impactos||{};return{name:c.name.split(" ").slice(0,2).join(" "),impactos:Math.round((c.sacolasDistribuidas||c.sacolas||0)*3.3)+(imp.stories||[]).reduce((a,s)=>a+Number(s.impressoes),0)+(imp.influencer||[]).reduce((a,s)=>a+Number(s.alcance),0)};}).sort((a,b)=>b.impactos-a.impactos).slice(0,6);
                 return(<div>
                   <ResponsiveContainer width="100%" height={180}>
                     <BarChart data={data} layout="vertical" margin={{top:0,right:10,left:60,bottom:0}}>
                       <XAxis type="number" tick={{fontSize:8,fill:T.muted}} tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}k`:v}/>
                       <YAxis type="category" dataKey="name" tick={{fontSize:9,fill:T.muted}} width={60}/>
                       <Tooltip formatter={v=>v.toLocaleString("pt-BR")} contentStyle={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,fontSize:10}}/>
                       <Bar dataKey="impactos" fill={T.info} radius={[0,4,4,0]}/>
                     </BarChart>
                   </ResponsiveContainer>
                 </div>);
               }},

              // ═══════════════════════════════════════════════
              // FINANCEIRO — NÍVEL CONTÁBIL
              // ═══════════════════════════════════════════════

              {id:"livro_caixa",cat:"Financeiro",label:"Livro Caixa completo",icon:"-",color:T.accent,roles:["admin","financeiro"],
               render:()=>{
                 const rows=lancFilt.sort((a,b)=>{const pa=a.data?.split("/").reverse().join("-"),pb=b.data?.split("/").reverse().join("-");return pa<pb?-1:1;});
                 let saldo=0;
                 const TH=s=><th style={{padding:"6px 10px",fontSize:8,color:T.muted,fontWeight:700,textAlign:"left",borderBottom:`1px solid ${T.border}`,textTransform:"uppercase",letterSpacing:1,whiteSpace:"nowrap"}}>{s}</th>;
                 const TD=(s,opts={})=><td style={{padding:"5px 10px",fontSize:9,fontFamily:"Arial,sans-serif",color:opts.color||T.text,textAlign:opts.right?"right":"left",fontWeight:opts.bold?"700":"400"}}>{s}</td>;
                 return(<div style={{overflowX:"auto",maxHeight:400,overflowY:"auto"}}>
                   <table style={{width:"100%",borderCollapse:"collapse"}}>
                     <thead style={{position:"sticky",top:0,background:T.card}}>
                       <tr>{[TH("Data"),TH("Descrição"),TH("Categoria"),TH("Entrada"),TH("Saída"),TH("Saldo"),TH("Forma")]}</tr>
                     </thead>
                     <tbody>
                       {rows.map((l,i)=>{saldo+=(l.entrada||0)-(l.saida||0);return(
                         <tr key={i} style={{background:i%2===0?T.surface:"transparent"}}>
                           {TD(l.data)}{TD(l.descricao,{color:T.soft})}
                           {TD(l.categoria||"—",{color:T.muted})}
                           {TD(l.entrada>0?l.entrada.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}):"—",{right:true,color:T.accent,bold:l.entrada>0})}
                           {TD(l.saida>0?l.saida.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}):"—",{right:true,color:T.danger,bold:l.saida>0})}
                           {TD(saldo.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}),{right:true,color:saldo>=0?T.info:T.danger,bold:true})}
                           {TD(l.forma||"—",{color:T.muted})}
                         </tr>
                       );})}
                     </tbody>
                     <tfoot>
                       <tr style={{borderTop:`2px solid ${T.border}`,background:T.card}}>
                         <td colSpan={3} style={{padding:"7px 10px",fontSize:9,fontWeight:700}}>TOTAL</td>
                         <td style={{padding:"7px 10px",fontSize:10,fontWeight:800,color:T.accent,textAlign:"right",fontFamily:"Arial,sans-serif"}}>{lancFilt.reduce((a,l)=>a+(l.entrada||0),0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</td>
                         <td style={{padding:"7px 10px",fontSize:10,fontWeight:800,color:T.danger,textAlign:"right",fontFamily:"Arial,sans-serif"}}>{lancFilt.reduce((a,l)=>a+(l.saida||0),0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</td>
                         <td style={{padding:"7px 10px",fontSize:10,fontWeight:800,color:T.info,textAlign:"right",fontFamily:"Arial,sans-serif"}}>{lancFilt.reduce((a,l)=>a+(l.entrada||0)-(l.saida||0),0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</td>
                         <td/>
                       </tr>
                     </tfoot>
                   </table>
                 </div>);
               }},

              {id:"dre_completo",cat:"Financeiro",label:"DRE Completo",icon:"-",color:T.info,roles:["admin","financeiro"],
               render:()=>{
                 const rec=lancFilt.reduce((a,l)=>a+(l.entrada||0),0);
                 const impostos=lancFilt.filter(l=>l.categoria==="Imposto"||l.categoria==="DAS"||l.categoria==="DARF").reduce((a,l)=>a+(l.saida||0),0);
                 const recLiq=rec-impostos;
                 const custosDiretos=lancFilt.filter(l=>["Gráfica","Logística","Material","Operacional"].some(k=>l.categoria?.includes(k)||l.centrosCusto?.includes("Operacional"))).reduce((a,l)=>a+(l.saida||0),0);
                 const lucroBruto=recLiq-custosDiretos;
                 const salarios=lancFilt.filter(l=>l.categoria==="Salario"||l.categoria==="Pro-Labore").reduce((a,l)=>a+(l.saida||0),0);
                 const saas=lancFilt.filter(l=>l.categoria==="SaaS"||l.categoria==="Infraestrutura").reduce((a,l)=>a+(l.saida||0),0);
                 const desp=lancFilt.filter(l=>!["Imposto","DAS","DARF","Salario","Pro-Labore","SaaS","Infraestrutura"].includes(l.categoria||"")&&!["Gráfica","Logística","Material"].some(k=>l.categoria?.includes(k))).reduce((a,l)=>a+(l.saida||0),0);
                 const fin=lancFilt.filter(l=>l.categoria==="Financiamento"||l.categoria==="Juros"||l.categoria==="Banco").reduce((a,l)=>a+(l.saida||0),0);
                 const ebitda=lucroBruto-salarios-saas-desp;
                 const res=ebitda-fin;
                 const pct=v=>rec>0?`${Math.round(v/rec*100)}%`:"—";
                 const Row=({label,v,color,bold,indent,separador})=>(
                   <tr style={{borderBottom:separador?`2px solid ${T.border}`:`1px solid ${T.border}22`,background:separador?T.surface:"transparent"}}>
                     <td style={{padding:"7px 12px",fontSize:indent?10:11,fontWeight:bold?"800":"400",fontFamily:"Arial,sans-serif",color:color||T.text,paddingLeft:indent?24:12}}>{label}</td>
                     <td style={{padding:"7px 12px",fontSize:11,fontWeight:bold?"800":"400",color:color||(v>=0?T.text:T.danger),textAlign:"right",fontFamily:"Arial,sans-serif"}}>{v<0?"-":""}{Math.abs(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:0})}</td>
                     <td style={{padding:"7px 12px",fontSize:9,color:T.muted,textAlign:"right",fontFamily:"Arial,sans-serif"}}>{pct(Math.abs(v))}</td>
                   </tr>
                 );
                 return(<table style={{width:"100%",borderCollapse:"collapse"}}>
                   <thead><tr>{["Linha contábil","Valor","% Receita"].map(h=><th key={h} style={{padding:"7px 12px",fontSize:8,color:T.muted,textAlign:h==="Linha contábil"?"left":"right",textTransform:"uppercase",letterSpacing:1,borderBottom:`2px solid ${T.border}`}}>{h}</th>)}</tr></thead>
                   <tbody>
                     <Row label="(+) Receita bruta" v={rec} color={T.accent} bold/>
                     <Row label="(-) Impostos e deduções" v={-impostos} color={T.danger} indent/>
                     <Row label="(=) Receita líquida" v={recLiq} color={T.info} bold separador/>
                     <Row label="(-) Custos diretos (produção)" v={-custosDiretos} color={T.warn} indent/>
                     <Row label="(=) Lucro bruto" v={lucroBruto} color={T.info} bold separador/>
                     <Row label="(-) Pessoal (salários + pró-labore)" v={-salarios} indent/>
                     <Row label="(-) Tecnologia e infraestrutura" v={-saas} indent/>
                     <Row label="(-) Outras despesas operacionais" v={-desp} indent/>
                     <Row label="(=) EBITDA" v={ebitda} color={ebitda>=0?T.accent:T.danger} bold separador/>
                     <Row label="(-) Despesas financeiras (juros, banco)" v={-fin} color={T.danger} indent/>
                     <Row label="(=) Resultado líquido" v={res} color={res>=0?T.accent:T.danger} bold/>
                   </tbody>
                 </table>);
               }},

              {id:"impostos_taxas",cat:"Financeiro",label:"Impostos e taxas pagos",icon:"-",color:T.warn,roles:["admin","financeiro"],
               render:()=>{
                 const rows=lancFilt.filter(l=>["Imposto","DAS","DARF","ISS","IOF","Banco","Taxa","Financiamento","Juros"].some(k=>(l.categoria||"").includes(k)));
                 const porTipo=Object.entries(rows.reduce((acc,l)=>{const k=l.categoria||"Outros";if(!acc[k])acc[k]={total:0,itens:[]};acc[k].total+=(l.saida||0);acc[k].itens.push(l);return acc;},{})).sort((a,b)=>b[1].total-a[1].total);
                 return(<div>
                   <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
                     {porTipo.slice(0,6).map(([tipo,d],i)=>(
                       <div key={i} style={{background:T.surface,borderRadius:8,padding:"10px 12px",borderLeft:`3px solid ${T.warn}`}}>
                         <div style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>{tipo}</div>
                         <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:15,color:T.warn}}>{d.total.toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:0})}</div>
                         <div style={{fontSize:8,color:T.muted,marginTop:2}}>{d.itens.length} lançamento{d.itens.length!==1?"s":""}</div>
                       </div>
                     ))}
                   </div>
                   <table style={{width:"100%",borderCollapse:"collapse"}}>
                     <thead><tr>{["Data","Descrição","Tipo","Valor"].map(h=><th key={h} style={{padding:"5px 8px",fontSize:8,color:T.muted,textAlign:h==="Valor"?"right":"left",textTransform:"uppercase",letterSpacing:1,borderBottom:`1px solid ${T.border}`}}>{h}</th>)}</tr></thead>
                     <tbody>
                       {rows.sort((a,b)=>a.data<b.data?-1:1).map((l,i)=>(
                         <tr key={i} style={{background:i%2===0?T.surface:"transparent"}}>
                           <td style={{padding:"5px 8px",fontSize:9,fontFamily:"Arial,sans-serif"}}>{l.data}</td>
                           <td style={{padding:"5px 8px",fontSize:9,color:T.soft}}>{l.descricao}</td>
                           <td style={{padding:"5px 8px"}}><span style={{fontSize:8,padding:"2px 6px",borderRadius:3,background:T.warnDim,color:T.warn}}>{l.categoria}</span></td>
                           <td style={{padding:"5px 8px",fontSize:10,fontWeight:700,color:T.danger,textAlign:"right",fontFamily:"Arial,sans-serif"}}>{(l.saida||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</td>
                         </tr>
                       ))}
                     </tbody>
                     <tfoot><tr style={{borderTop:`2px solid ${T.border}`}}>
                       <td colSpan={3} style={{padding:"6px 8px",fontSize:9,fontWeight:700}}>TOTAL IMPOSTOS E TAXAS</td>
                       <td style={{padding:"6px 8px",fontSize:11,fontWeight:800,color:T.danger,textAlign:"right",fontFamily:"Arial,sans-serif"}}>{rows.reduce((a,l)=>a+(l.saida||0),0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</td>
                     </tr></tfoot>
                   </table>
                 </div>);
               }},

              {id:"custo_fornecedor",cat:"Financeiro",label:"Custo por fornecedor (gráfica/logística)",icon:"-",color:T.purple,roles:["admin","financeiro","operacional"],
               render:()=>{
                 // Agrupa campanhas por fornecedor com valores e meses
                 const fornMap={};
                 camps.forEach(c=>{
                   const g=c.graficaFornecedor;const l=c.logistica;
                   if(g){if(!fornMap[g])fornMap[g]={tipo:"Gráfica",camps:[],total:0};fornMap[g].camps.push({nome:c.name,cliente:c.client,emb:c.sacolas||0,valor:c.valorLiquido||0,prazo:c.graficaPrazo,stage:c.stage});fornMap[g].total+=c.valorLiquido||0;}
                   if(l&&l!==g){if(!fornMap[l])fornMap[l]={tipo:"Logística",camps:[],total:0};fornMap[l].camps.push({nome:c.name,cliente:c.client,emb:c.sacolas||0,valor:0,prazo:c.logisticaPrazo,stage:c.stage});}
                 });
                 // Também pega lancamentos relacionados
                 const lancForn=lancamentos.filter(l=>l.categoria==="Projeto"||l.descricao?.toLowerCase().includes("grafic")||l.descricao?.toLowerCase().includes("logist"));
                 return(<div style={{display:"flex",flexDirection:"column",gap:12}}>
                   {Object.entries(fornMap).sort((a,b)=>b[1].camps.length-a[1].camps.length).map(([forn,d])=>(
                     <div key={forn} style={{background:T.surface,borderRadius:10,overflow:"hidden"}}>
                       <div style={{padding:"10px 14px",background:d.tipo==="Gráfica"?T.purple+"22":T.info+"22",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                         <div>
                           <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12}}>{forn}</div>
                           <div style={{fontSize:9,color:T.muted,marginTop:1}}>{d.camps.length} campanha{d.camps.length!==1?"s":" "} · {d.tipo}</div>
                         </div>
                         <div style={{textAlign:"right"}}>
                           <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:16,color:d.tipo==="Gráfica"?T.purple:T.info}}>{d.camps.reduce((a,c)=>a+(c.emb||0),0).toLocaleString("pt-BR")} emb.</div>
                         </div>
                       </div>
                       <table style={{width:"100%",borderCollapse:"collapse"}}>
                         <thead><tr>{["Campanha","Cliente","Embalagens","Prazo","Status"].map(h=><th key={h} style={{padding:"5px 10px",fontSize:8,color:T.muted,textAlign:h==="Embalagens"?"right":"left",textTransform:"uppercase",letterSpacing:1,borderBottom:`1px solid ${T.border}`}}>{h}</th>)}</tr></thead>
                         <tbody>{d.camps.map((camp,i)=>{const s=STAGES_CAMP.find(x=>x.id===camp.stage);return(
                           <tr key={i} style={{background:i%2===0?"transparent":T.bg}}>
                             <td style={{padding:"5px 10px",fontSize:10,fontWeight:600}}>{camp.nome}</td>
                             <td style={{padding:"5px 10px",fontSize:9,color:T.muted}}>{camp.cliente}</td>
                             <td style={{padding:"5px 10px",fontSize:10,textAlign:"right",fontFamily:"Arial,sans-serif"}}>{(camp.emb||0).toLocaleString("pt-BR")}</td>
                             <td style={{padding:"5px 10px",fontSize:9,color:T.muted,fontFamily:"Arial,sans-serif"}}>{camp.prazo||"—"}</td>
                             <td style={{padding:"5px 10px"}}>{s?<span style={{fontSize:8,padding:"2px 6px",borderRadius:3,background:s.color+"22",color:s.color}}>{s.label}</span>:"—"}</td>
                           </tr>
                         );})}
                         </tbody>
                       </table>
                     </div>
                   ))}
                   {Object.keys(fornMap).length===0&&<div style={{fontSize:11,color:T.muted,textAlign:"center",padding:20}}>Nenhum fornecedor cadastrado nas campanhas</div>}
                 </div>);
               }},

              {id:"custo_campanha_margem",cat:"Financeiro",label:"Custo e margem por campanha",icon:"-",color:T.accent,roles:["admin","financeiro"],
               render:()=>{
                 const rows=camps.map(c=>{
                   // Parcelas do cartão relacionadas a esta campanha
                   const cartCost=comprasCartao.filter(cc=>(cc.projeto||"").toLowerCase().includes((c.name||"").split(" ").slice(0,2).join(" ").toLowerCase())).reduce((a,cc)=>a+(cc.valorTotal||0),0);
                   const receita=c.valorLiquido||0;
                   const custo=cartCost;
                   const margem=receita-custo;
                   const pct=receita>0?Math.round(margem/receita*100):0;
                   const s=STAGES_CAMP.find(x=>x.id===c.stage);
                   return{...c,custo,margem,pct,stageName:s?.label,stageColor:s?.color};
                 }).sort((a,b)=>b.margem-a.margem);
                 const totalRec=rows.reduce((a,r)=>a+(r.valorLiquido||0),0);
                 const totalCusto=rows.reduce((a,r)=>a+r.custo,0);
                 const totalMargem=totalRec-totalCusto;
                 return(<div style={{overflowX:"auto"}}>
                   <table style={{width:"100%",borderCollapse:"collapse"}}>
                     <thead><tr>{["Campanha","Cliente","Etapa","Receita","Custo","Margem","Margem %"].map(h=><th key={h} style={{padding:"6px 10px",fontSize:8,color:T.muted,textAlign:["Receita","Custo","Margem","Margem %"].includes(h)?"right":"left",textTransform:"uppercase",letterSpacing:1,borderBottom:`2px solid ${T.border}`}}>{h}</th>)}</tr></thead>
                     <tbody>{rows.map((r,i)=>(
                       <tr key={i} style={{background:i%2===0?T.surface:"transparent"}}>
                         <td style={{padding:"6px 10px",fontSize:10,fontWeight:600}}>{r.name}</td>
                         <td style={{padding:"6px 10px",fontSize:9,color:T.muted}}>{r.client}</td>
                         <td style={{padding:"6px 10px"}}>{r.stageColor&&<span style={{fontSize:8,padding:"2px 6px",borderRadius:3,background:r.stageColor+"22",color:r.stageColor}}>{r.stageName}</span>}</td>
                         <td style={{padding:"6px 10px",fontSize:10,color:T.accent,textAlign:"right",fontFamily:"Arial,sans-serif",fontWeight:700}}>{r.valorLiquido>0?r.valorLiquido.toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:0}):"—"}</td>
                         <td style={{padding:"6px 10px",fontSize:10,color:T.danger,textAlign:"right",fontFamily:"Arial,sans-serif"}}>{r.custo>0?r.custo.toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:0}):"—"}</td>
                         <td style={{padding:"6px 10px",fontSize:10,fontWeight:700,color:r.margem>=0?T.info:T.danger,textAlign:"right",fontFamily:"Arial,sans-serif"}}>{r.valorLiquido>0?r.margem.toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:0}):"—"}</td>
                         <td style={{padding:"6px 10px",textAlign:"right"}}>{r.valorLiquido>0?<span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:4,background:r.pct>=60?T.accentDim:r.pct>=30?T.infoDim:T.dangerDim,color:r.pct>=60?T.accent:r.pct>=30?T.info:T.danger}}>{r.pct}%</span>:"—"}</td>
                       </tr>
                     ))}</tbody>
                     <tfoot><tr style={{borderTop:`2px solid ${T.border}`,background:T.card}}>
                       <td colSpan={3} style={{padding:"7px 10px",fontSize:9,fontWeight:700}}>TOTAIS</td>
                       <td style={{padding:"7px 10px",fontSize:11,fontWeight:800,color:T.accent,textAlign:"right"}}>{totalRec.toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:0})}</td>
                       <td style={{padding:"7px 10px",fontSize:11,fontWeight:800,color:T.danger,textAlign:"right"}}>{totalCusto.toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:0})}</td>
                       <td style={{padding:"7px 10px",fontSize:11,fontWeight:800,color:totalMargem>=0?T.info:T.danger,textAlign:"right"}}>{totalMargem.toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:0})}</td>
                       <td style={{padding:"7px 10px",fontSize:10,fontWeight:800,color:T.accent,textAlign:"right"}}>{totalRec>0?Math.round(totalMargem/totalRec*100):0}%</td>
                     </tr></tfoot>
                   </table>
                 </div>);
               }},

              {id:"parcelamentos_projecao",cat:"Financeiro",label:"Parcelamentos e projeção de pagamentos",icon:"-",color:T.warn,roles:["admin","financeiro"],
               render:()=>{
                 const hoje=new Date();
                 const proxMeses=Array.from({length:6},(_,i)=>{const d=new Date(hoje.getFullYear(),hoje.getMonth()+i,1);return{mes:`${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`,label:d.toLocaleDateString("pt-BR",{month:"short",year:"2-digit"})};});
                 const cartTotais=cartoes.map(cart=>{
                   const compras=comprasCartao.filter(c=>c.cartaoId===cart.id);
                   const saldoDev=compras.reduce((a,c)=>a+(c.valorParcela||0)*(c.parcelas-(c.parcelaAtual||0)+1),0);
                   const mensal=compras.reduce((a,c)=>a+(c.valorParcela||0),0);
                   return{...cart,compras,saldoDev,mensal};
                 }).filter(c=>c.compras.length>0);
                 return(<div>
                   <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
                     {cartTotais.map((cart,i)=>(
                       <div key={i} style={{background:T.surface,borderRadius:8,padding:"10px 12px",borderLeft:`3px solid ${cart.cor||T.warn}`}}>
                         <div style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cart.nome}</div>
                         <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:14,color:cart.cor||T.warn}}>{cart.mensal.toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:0})}<span style={{fontSize:8,color:T.muted,fontWeight:400}}>/mês</span></div>
                         <div style={{fontSize:8,color:T.muted,marginTop:2}}>Saldo: {cart.saldoDev.toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:0})}</div>
                       </div>
                     ))}
                   </div>
                   <table style={{width:"100%",borderCollapse:"collapse"}}>
                     <thead><tr>
                       <th style={{padding:"6px 10px",fontSize:8,color:T.muted,textAlign:"left",textTransform:"uppercase",letterSpacing:1,borderBottom:`1px solid ${T.border}`}}>Compra / Projeto</th>
                       <th style={{padding:"6px 10px",fontSize:8,color:T.muted,textAlign:"left",textTransform:"uppercase",letterSpacing:1,borderBottom:`1px solid ${T.border}`}}>Cartão</th>
                       <th style={{padding:"6px 10px",fontSize:8,color:T.muted,textAlign:"center",textTransform:"uppercase",letterSpacing:1,borderBottom:`1px solid ${T.border}`}}>Parcelas</th>
                       <th style={{padding:"6px 10px",fontSize:8,color:T.muted,textAlign:"right",textTransform:"uppercase",letterSpacing:1,borderBottom:`1px solid ${T.border}`}}>Mensal</th>
                       <th style={{padding:"6px 10px",fontSize:8,color:T.muted,textAlign:"right",textTransform:"uppercase",letterSpacing:1,borderBottom:`1px solid ${T.border}`}}>Saldo dev.</th>
                     </tr></thead>
                     <tbody>{comprasCartao.map((cc,i)=>{const cart=cartoes.find(c=>c.id===cc.cartaoId);const saldo=(cc.valorParcela||0)*(cc.parcelas-(cc.parcelaAtual||0)+1);return(
                       <tr key={i} style={{background:i%2===0?T.surface:"transparent"}}>
                         <td style={{padding:"5px 10px",fontSize:10,fontWeight:600}}>{cc.projeto||cc.descricao}</td>
                         <td style={{padding:"5px 10px",fontSize:9,color:T.muted}}>{cart?.nome||"—"}</td>
                         <td style={{padding:"5px 10px",fontSize:9,textAlign:"center",fontFamily:"Arial,sans-serif"}}>{cc.parcelaAtual||1}/{cc.parcelas}</td>
                         <td style={{padding:"5px 10px",fontSize:10,textAlign:"right",fontFamily:"Arial,sans-serif",color:T.warn,fontWeight:700}}>{(cc.valorParcela||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</td>
                         <td style={{padding:"5px 10px",fontSize:10,textAlign:"right",fontFamily:"Arial,sans-serif",color:T.danger}}>{saldo.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</td>
                       </tr>
                     );})}
                     </tbody>
                     <tfoot><tr style={{borderTop:`2px solid ${T.border}`}}>
                       <td colSpan={3} style={{padding:"6px 10px",fontSize:9,fontWeight:700}}>TOTAL</td>
                       <td style={{padding:"6px 10px",fontSize:11,fontWeight:800,color:T.warn,textAlign:"right"}}>{comprasCartao.reduce((a,c)=>a+(c.valorParcela||0),0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</td>
                       <td style={{padding:"6px 10px",fontSize:11,fontWeight:800,color:T.danger,textAlign:"right"}}>{comprasCartao.reduce((a,c)=>a+(c.valorParcela||0)*(c.parcelas-(c.parcelaAtual||0)+1),0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</td>
                     </tr></tfoot>
                   </table>
                 </div>);
               }},

              {id:"fluxo_categoria_mes",cat:"Financeiro",label:"Despesas por categoria × mês",icon:"-",color:T.purple,roles:["admin","financeiro"],
               render:()=>{
                 const meses=[...new Set(lancamentos.filter(l=>l.saida>0).map(l=>{const[d,m,y]=l.data?.split("/")||[];return y?`${m}/${y}`:"";}).filter(Boolean))].sort();
                 const cats=[...new Set(lancamentos.filter(l=>l.saida>0).map(l=>l.categoria||"Outros"))];
                 const matrix=cats.map(cat=>{const porMes=Object.fromEntries(meses.map(mes=>[mes,lancamentos.filter(l=>l.saida>0&&(l.categoria||"Outros")===cat&&l.data?.includes("/"+mes.replace("/","/")||mes)).reduce((a,l)=>a+(l.saida||0),0)]));const total=Object.values(porMes).reduce((a,v)=>a+v,0);return{cat,porMes,total};}).filter(r=>r.total>0).sort((a,b)=>b.total-a.total).slice(0,8);
                 const CORES=[T.warn,T.danger,T.purple,T.info,T.pink,T.accent,T.green,T.soft];
                 return(<div style={{overflowX:"auto"}}>
                   <table style={{width:"100%",borderCollapse:"collapse",minWidth:500}}>
                     <thead><tr>
                       <th style={{padding:"5px 8px",fontSize:8,color:T.muted,textAlign:"left",textTransform:"uppercase",letterSpacing:1,borderBottom:`1px solid ${T.border}`,minWidth:120}}>Categoria</th>
                       {meses.slice(-6).map(m=><th key={m} style={{padding:"5px 8px",fontSize:8,color:T.muted,textAlign:"right",textTransform:"uppercase",letterSpacing:1,borderBottom:`1px solid ${T.border}`}}>{m}</th>)}
                       <th style={{padding:"5px 8px",fontSize:8,color:T.muted,textAlign:"right",textTransform:"uppercase",letterSpacing:1,borderBottom:`1px solid ${T.border}`}}>Total</th>
                     </tr></thead>
                     <tbody>{matrix.map((r,i)=>(
                       <tr key={i} style={{background:i%2===0?T.surface:"transparent"}}>
                         <td style={{padding:"5px 8px"}}>
                           <div style={{display:"flex",gap:5,alignItems:"center"}}>
                             <div style={{width:8,height:8,borderRadius:"50%",background:CORES[i%CORES.length],flexShrink:0}}/>
                             <span style={{fontSize:10,fontWeight:600}}>{r.cat}</span>
                           </div>
                         </td>
                         {meses.slice(-6).map(m=><td key={m} style={{padding:"5px 8px",fontSize:9,textAlign:"right",fontFamily:"Arial,sans-serif",color:r.porMes[m]>0?T.text:T.border}}>{r.porMes[m]>0?r.porMes[m].toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:0}):"—"}</td>)}
                         <td style={{padding:"5px 8px",fontSize:10,fontWeight:700,textAlign:"right",fontFamily:"Arial,sans-serif",color:CORES[i%CORES.length]}}>{r.total.toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:0})}</td>
                       </tr>
                     ))}</tbody>
                   </table>
                 </div>);
               }},

              // ═══════════════════════════════════════════════
              // COMERCIAL — DETALHADO
              // ═══════════════════════════════════════════════

              {id:"historico_closings_det",cat:"Comercial",label:"Histórico completo de fechamentos",icon:"-",color:T.info,roles:["admin","comercial"],
               render:()=>(
                 <div style={{overflowX:"auto",maxHeight:350,overflowY:"auto"}}>
                   <table style={{width:"100%",borderCollapse:"collapse"}}>
                     <thead style={{position:"sticky",top:0,background:T.card}}><tr>{["Data","Parceiro","Tipo","Projeto","Usuário","Valor","Status","Pago"].map(h=><th key={h} style={{padding:"5px 8px",fontSize:8,color:T.muted,textAlign:["Valor"].includes(h)?"right":"left",textTransform:"uppercase",letterSpacing:1,borderBottom:`1px solid ${T.border}`}}>{h}</th>)}</tr></thead>
                     <tbody>{[...closings].sort((a,b)=>a.date<b.date?1:-1).map((c,i)=>(
                       <tr key={i} style={{background:i%2===0?T.surface:"transparent"}}>
                         <td style={{padding:"5px 8px",fontSize:9,fontFamily:"Arial,sans-serif"}}>{c.date}</td>
                         <td style={{padding:"5px 8px",fontSize:10,fontWeight:600}}>{c.partner}</td>
                         <td style={{padding:"5px 8px"}}><span style={{fontSize:8,padding:"2px 5px",borderRadius:3,background:T.purpleDim,color:T.purple}}>{c.type}</span></td>
                         <td style={{padding:"5px 8px",fontSize:9,color:T.muted}}>{c.project}</td>
                         <td style={{padding:"5px 8px",fontSize:9,color:T.soft}}>{c.user}</td>
                         <td style={{padding:"5px 8px",fontSize:10,fontWeight:700,color:T.accent,textAlign:"right",fontFamily:"Arial,sans-serif"}}>{(c.value||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</td>
                         <td style={{padding:"5px 8px"}}><span style={{fontSize:8,padding:"2px 5px",borderRadius:3,background:c.status==="aprovado"?T.accentDim:c.status==="reprovado"?T.dangerDim:T.warnDim,color:c.status==="aprovado"?T.accent:c.status==="reprovado"?T.danger:T.warn}}>{c.status}</span></td>
                         <td style={{padding:"5px 8px",textAlign:"center"}}><span style={{fontSize:10}}>{c.pago?"✓":"○"}</span></td>
                       </tr>
                     ))}
                     </tbody>
                     <tfoot><tr style={{borderTop:`2px solid ${T.border}`,background:T.card}}>
                       <td colSpan={5} style={{padding:"6px 8px",fontSize:9,fontWeight:700}}>TOTAL GERAL</td>
                       <td style={{padding:"6px 8px",fontSize:11,fontWeight:800,color:T.accent,textAlign:"right"}}>{closings.reduce((a,c)=>a+(c.value||0),0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</td>
                       <td colSpan={2}/>
                     </tr></tfoot>
                   </table>
                 </div>
               )},

              {id:"prospects_det",cat:"Comercial",label:"Pipeline detalhado por responsável",icon:"-",color:T.purple,roles:["admin","comercial"],
               render:()=>{
                 const porResp=Object.entries(prospects.reduce((acc,p)=>{if(!acc[p.owner])acc[p.owner]={nome:p.owner,itens:[],total:0,fechados:0};acc[p.owner].itens.push(p);acc[p.owner].total+=(p.value||0);if(p.stage==="fechado")acc[p.owner].fechados++;return acc;},{})).sort((a,b)=>b[1].total-a[1].total);
                 return(<div style={{display:"flex",flexDirection:"column",gap:10}}>
                   {porResp.map(([resp,d])=>(
                     <div key={resp} style={{background:T.surface,borderRadius:10,overflow:"hidden"}}>
                       <div style={{padding:"10px 14px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                         <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12}}>{resp}</div>
                         <div style={{display:"flex",gap:12}}>
                           <div style={{textAlign:"center"}}><div style={{fontSize:14,fontWeight:800,color:T.info,fontFamily:"Arial,sans-serif"}}>{d.itens.length}</div><div style={{fontSize:8,color:T.muted}}>prospects</div></div>
                           <div style={{textAlign:"center"}}><div style={{fontSize:14,fontWeight:800,color:T.accent,fontFamily:"Arial,sans-serif"}}>{d.fechados}</div><div style={{fontSize:8,color:T.muted}}>fechados</div></div>
                           <div style={{textAlign:"center"}}><div style={{fontSize:14,fontWeight:800,color:T.purple,fontFamily:"Arial,sans-serif"}}>{d.itens.length>0?Math.round(d.fechados/d.itens.length*100):0}%</div><div style={{fontSize:8,color:T.muted}}>conversão</div></div>
                           <div style={{textAlign:"right"}}><div style={{fontSize:16,fontWeight:800,color:T.accent,fontFamily:"Arial,sans-serif"}}>{(d.total/1000).toFixed(0)}k</div><div style={{fontSize:8,color:T.muted}}>pipeline</div></div>
                         </div>
                       </div>
                       <table style={{width:"100%",borderCollapse:"collapse"}}>
                         <thead><tr>{["Empresa","Segmento","Etapa","Valor"].map(h=><th key={h} style={{padding:"4px 10px",fontSize:8,color:T.muted,textAlign:h==="Valor"?"right":"left",textTransform:"uppercase",letterSpacing:1,borderBottom:`1px solid ${T.border}`}}>{h}</th>)}</tr></thead>
                         <tbody>{d.itens.map((p,i)=>{const s=PIPE_STAGES.find(x=>x.id===p.stage);return(
                           <tr key={i} style={{background:i%2===0?"transparent":T.bg}}>
                             <td style={{padding:"4px 10px",fontSize:10,fontWeight:600}}>{p.name}</td>
                             <td style={{padding:"4px 10px",fontSize:9,color:T.muted}}>{p.segment}</td>
                             <td style={{padding:"4px 10px"}}>{s&&<span style={{fontSize:8,padding:"1px 5px",borderRadius:3,background:s.color+"22",color:s.color}}>{s.label}</span>}</td>
                             <td style={{padding:"4px 10px",fontSize:10,fontWeight:700,color:T.info,textAlign:"right",fontFamily:"Arial,sans-serif"}}>{(p.value||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:0})}</td>
                           </tr>
                         );})}
                         </tbody>
                       </table>
                     </div>
                   ))}
                 </div>);
               }},

              // ═══════════════════════════════════════════════
              // OPERACIONAL — DETALHADO
              // ═══════════════════════════════════════════════

              {id:"camps_status_det",cat:"Operacional",label:"Status detalhado por campanha",icon:"-",color:T.warn,roles:["admin","operacional"],
               render:()=>(
                 <div style={{overflowX:"auto"}}>
                   <table style={{width:"100%",borderCollapse:"collapse"}}>
                     <thead><tr>{["Campanha","Cliente","Etapa","Gráfica","Logística","Emb.","Tasks","Prazo"].map(h=><th key={h} style={{padding:"5px 8px",fontSize:8,color:T.muted,textAlign:["Emb.","Tasks"].includes(h)?"right":"left",textTransform:"uppercase",letterSpacing:1,borderBottom:`2px solid ${T.border}`}}>{h}</th>)}</tr></thead>
                     <tbody>{camps.map((c,i)=>{const s=STAGES_CAMP.find(x=>x.id===c.stage);const td=tasksDone(c.tasks||{});const diasPrazo=c.graficaPrazo?Math.ceil((new Date(c.graficaPrazo.includes("-")?c.graficaPrazo:c.graficaPrazo.split("/").reverse().join("-"))-new Date())/86400000):null;return(
                       <tr key={i} style={{background:i%2===0?T.surface:"transparent"}}>
                         <td style={{padding:"5px 8px",fontSize:10,fontWeight:600,maxWidth:150,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</td>
                         <td style={{padding:"5px 8px",fontSize:9,color:T.muted}}>{c.client}</td>
                         <td style={{padding:"5px 8px"}}>{s&&<span style={{fontSize:8,padding:"1px 5px",borderRadius:3,background:s.color+"22",color:s.color}}>{s.label}</span>}</td>
                         <td style={{padding:"5px 8px",fontSize:9,color:c.graficaFornecedor?T.purple:T.danger}}>{c.graficaFornecedor||"—"}</td>
                         <td style={{padding:"5px 8px",fontSize:9,color:c.logistica?T.info:T.danger}}>{c.logistica||"—"}</td>
                         <td style={{padding:"5px 8px",fontSize:9,textAlign:"right",fontFamily:"Arial,sans-serif"}}>{(c.sacolas||0).toLocaleString("pt-BR")}</td>
                         <td style={{padding:"5px 8px",fontSize:9,textAlign:"right",color:td.done===td.total&&td.total>0?T.accent:T.muted,fontFamily:"Arial,sans-serif",fontWeight:700}}>{td.done}/{td.total}</td>
                         <td style={{padding:"5px 8px"}}>{diasPrazo!==null?<span style={{fontSize:8,padding:"1px 5px",borderRadius:3,background:diasPrazo<=0?T.dangerDim:diasPrazo<=7?T.warnDim:T.accentDim,color:diasPrazo<=0?T.danger:diasPrazo<=7?T.warn:T.accent}}>{diasPrazo<=0?"Vencido":diasPrazo+"d"}</span>:<span style={{fontSize:9,color:T.muted}}>—</span>}</td>
                       </tr>
                     );})}
                     </tbody>
                   </table>
                 </div>
               )},

              // ═══════════════════════════════════════════════
              // BASE — DETALHADO
              // ═══════════════════════════════════════════════

              {id:"ficha_parceiros_det",cat:"Base",label:"Ficha completa de parceiros",icon:"-",color:T.green,roles:["admin","base"],
               render:()=>(
                 <div style={{overflowX:"auto",maxHeight:380,overflowY:"auto"}}>
                   <table style={{width:"100%",borderCollapse:"collapse"}}>
                     <thead style={{position:"sticky",top:0,background:T.card}}><tr>{["Parceiro","Cidade/UF","Categoria","Score","Entregas","Campanhas","Contrato","Expira"].map(h=><th key={h} style={{padding:"5px 8px",fontSize:8,color:T.muted,textAlign:["Score","Entregas","Campanhas"].includes(h)?"right":"left",textTransform:"uppercase",letterSpacing:1,borderBottom:`1px solid ${T.border}`}}>{h}</th>)}</tr></thead>
                     <tbody>{[...basePartners].sort((a,b)=>b.score-a.score).map((p,i)=>(
                       <tr key={i} style={{background:i%2===0?T.surface:"transparent"}}>
                         <td style={{padding:"5px 8px",fontSize:10,fontWeight:600}}>{p.name}</td>
                         <td style={{padding:"5px 8px",fontSize:9,color:T.muted}}>{p.city}/{p.state}</td>
                         <td style={{padding:"5px 8px"}}><span style={{fontSize:8,padding:"1px 5px",borderRadius:3,background:T.infoDim,color:T.info}}>{p.category}</span></td>
                         <td style={{padding:"5px 8px",fontSize:10,fontWeight:700,textAlign:"right",color:p.score>=80?T.accent:p.score>=50?T.info:T.warn}}>{p.score}</td>
                         <td style={{padding:"5px 8px",fontSize:9,textAlign:"right",fontFamily:"Arial,sans-serif"}}>{(p.deliveries||0).toLocaleString("pt-BR")}</td>
                         <td style={{padding:"5px 8px",fontSize:9,textAlign:"right",fontFamily:"Arial,sans-serif"}}>{p.campanhas||0}</td>
                         <td style={{padding:"5px 8px"}}><span style={{fontSize:8,padding:"1px 5px",borderRadius:3,background:CONTRATO_COLOR[p.contrato?.status]+"22"||T.border,color:CONTRATO_COLOR[p.contrato?.status]||T.muted}}>{p.contrato?.status||"—"}</span></td>
                         <td style={{padding:"5px 8px",fontSize:9,color:T.muted,fontFamily:"Arial,sans-serif"}}>{p.contrato?.expiraEm||"—"}</td>
                       </tr>
                     ))}</tbody>
                   </table>
                 </div>
               )},

              // ═══════════════════════════════════════════════
              // MARKETING — DETALHADO
              // ═══════════════════════════════════════════════

              {id:"impactos_det",cat:"Marketing",label:"Impactos detalhados por campanha",icon:"-",color:T.pink,roles:["admin","marketing"],
               render:()=>(
                 <div style={{overflowX:"auto",maxHeight:380,overflowY:"auto"}}>
                   <table style={{width:"100%",borderCollapse:"collapse"}}>
                     <thead style={{position:"sticky",top:0,background:T.card}}><tr>{["Campanha","Cliente","Offline","Stories","Influencer","Impulsionado","Total"].map(h=><th key={h} style={{padding:"5px 8px",fontSize:8,color:T.muted,textAlign:h==="Campanha"||h==="Cliente"?"left":"right",textTransform:"uppercase",letterSpacing:1,borderBottom:`1px solid ${T.border}`}}>{h}</th>)}</tr></thead>
                     <tbody>{camps.map((c,i)=>{const imp=c.impactos||{};const offline=Math.round((c.sacolasDistribuidas||c.sacolas||0)*3.3);const stories=(imp.stories||[]).reduce((a,s)=>a+Number(s.impressoes),0);const infl=(imp.influencer||[]).reduce((a,s)=>a+Number(s.alcance),0);const impul=(imp.impulsionado||[]).reduce((a,s)=>a+Number(s.alcance),0);const total=offline+stories+infl+impul;return(
                       <tr key={i} style={{background:i%2===0?T.surface:"transparent"}}>
                         <td style={{padding:"5px 8px",fontSize:10,fontWeight:600,maxWidth:130,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</td>
                         <td style={{padding:"5px 8px",fontSize:9,color:T.muted}}>{c.client}</td>
                         {[offline,stories,infl,impul,total].map((v,j)=><td key={j} style={{padding:"5px 8px",fontSize:v===total?11:9,fontWeight:v===total?800:400,textAlign:"right",fontFamily:"Arial,sans-serif",color:v===total?T.pink:v>0?T.text:T.border}}>{v>0?v.toLocaleString("pt-BR"):"—"}</td>)}
                       </tr>
                     );})}
                     </tbody>
                     <tfoot><tr style={{borderTop:`2px solid ${T.border}`,background:T.card}}>
                       <td colSpan={2} style={{padding:"5px 8px",fontSize:9,fontWeight:700}}>TOTAL</td>
                       {[camps.reduce((a,c)=>a+Math.round((c.sacolasDistribuidas||c.sacolas||0)*3.3),0),camps.flatMap(c=>c.impactos?.stories||[]).reduce((a,s)=>a+Number(s.impressoes),0),camps.flatMap(c=>c.impactos?.influencer||[]).reduce((a,s)=>a+Number(s.alcance),0),camps.flatMap(c=>c.impactos?.impulsionado||[]).reduce((a,s)=>a+Number(s.alcance),0)].map((v,i)=>{const t=camps.reduce((a,c)=>{const imp=c.impactos||{};return a+Math.round((c.sacolasDistribuidas||c.sacolas||0)*3.3)+(imp.stories||[]).reduce((s,x)=>s+Number(x.impressoes),0)+(imp.influencer||[]).reduce((s,x)=>s+Number(x.alcance),0)+(imp.impulsionado||[]).reduce((s,x)=>s+Number(x.alcance),0);},0);return<td key={i} style={{padding:"5px 8px",fontSize:10,fontWeight:700,textAlign:"right",fontFamily:"Arial,sans-serif"}}>{v.toLocaleString("pt-BR")}</td>;})}
                       <td style={{padding:"5px 8px",fontSize:11,fontWeight:800,color:T.pink,textAlign:"right",fontFamily:"Arial,sans-serif"}}>{camps.reduce((a,c)=>{const imp=c.impactos||{};return a+Math.round((c.sacolasDistribuidas||c.sacolas||0)*3.3)+(imp.stories||[]).reduce((s,x)=>s+Number(x.impressoes),0)+(imp.influencer||[]).reduce((s,x)=>s+Number(x.alcance),0)+(imp.impulsionado||[]).reduce((s,x)=>s+Number(x.alcance),0);},0).toLocaleString("pt-BR")}</td>
                     </tr></tfoot>
                   </table>
                 </div>
               )},

              {id:"stories_parceiro_det",cat:"Marketing",label:"Stories por parceiro",icon:"-",color:"#E1306C",roles:["admin","marketing"],
               render:()=>{
                 const all=camps.flatMap(c=>(c.impactos?.stories||[]).map(s=>({...s,campanha:c.name,cliente:c.client})));
                 const porParc=Object.entries(all.reduce((acc,s)=>{if(!acc[s.parceiro])acc[s.parceiro]={total:0,itens:[]};acc[s.parceiro].total+=Number(s.impressoes);acc[s.parceiro].itens.push(s);return acc;},{})).sort((a,b)=>b[1].total-a[1].total);
                 return all.length===0?<div style={{fontSize:11,color:T.muted,textAlign:"center",padding:20}}>Nenhum story registrado ainda</div>:(
                   <div>
                     <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
                       {porParc.slice(0,3).map(([p,d],i)=>(
                         <div key={i} style={{background:T.surface,borderRadius:8,padding:"10px 12px",borderLeft:`3px solid #E1306C`}}>
                           <div style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p}</div>
                           <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:18,color:"#E1306C"}}>{d.total.toLocaleString("pt-BR")}</div>
                           <div style={{fontSize:8,color:T.muted,marginTop:2}}>{d.itens.length} post{d.itens.length!==1?"s":""}</div>
                         </div>
                       ))}
                     </div>
                     <table style={{width:"100%",borderCollapse:"collapse"}}>
                       <thead><tr>{["Parceiro","Campanha","Impressões","Data"].map(h=><th key={h} style={{padding:"4px 8px",fontSize:8,color:T.muted,textAlign:h==="Impressões"?"right":"left",textTransform:"uppercase",letterSpacing:1,borderBottom:`1px solid ${T.border}`}}>{h}</th>)}</tr></thead>
                       <tbody>{all.sort((a,b)=>Number(b.impressoes)-Number(a.impressoes)).map((s,i)=>(
                         <tr key={i} style={{background:i%2===0?T.surface:"transparent"}}>
                           <td style={{padding:"4px 8px",fontSize:10,fontWeight:600}}>{s.parceiro}</td>
                           <td style={{padding:"4px 8px",fontSize:9,color:T.muted}}>{s.campanha}</td>
                           <td style={{padding:"4px 8px",fontSize:10,fontWeight:700,color:"#E1306C",textAlign:"right",fontFamily:"Arial,sans-serif"}}>{Number(s.impressoes).toLocaleString("pt-BR")}</td>
                           <td style={{padding:"4px 8px",fontSize:9,color:T.muted,fontFamily:"Arial,sans-serif"}}>{s.at}</td>
                         </tr>
                       ))}</tbody>
                     </table>
                   </div>
                 );
               }},
            ];

            const cats=[...new Set(BLOCOS.filter(b=>isAdmin||b.roles.includes(user.role)).map(b=>b.cat))];
            // relSelecionados, relTitulo, relPeriodo declarados no nível do componente
            const toggle=id=>setRelSelecionados(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
            const blocosSel=relSelecionados.map(id=>BLOCOS.find(b=>b.id===id)).filter(Boolean);
            const disponiveis=BLOCOS.filter(b=>isAdmin||b.roles.includes(user.role));

            return(
              <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:16,minHeight:"calc(100vh - 120px)"}}>

                {/* ── PAINEL ESQUERDO — Seletor de blocos ── */}
                <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16,height:"fit-content",position:"sticky",top:0}}>
                  <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:14,marginBottom:4}}>Construtor</div>
                  <div style={{fontSize:9,color:T.muted,marginBottom:14}}>Escolha os blocos do relatório</div>

                  {/* Título */}
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:9,color:T.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Título</div>
                    <input value={relTitulo} onChange={e=>setRelTitulo(e.target.value)} style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,padding:"6px 8px",fontSize:11,color:T.text,outline:"none"}}/>
                  </div>

                  {/* Período — seletores rápidos */}
                  <div style={{marginBottom:14}}>
                    <div style={{fontSize:9,color:T.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Período</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:6}}>
                      {[["mes","Este mês"],["mes_ant","Mês ant."],["trim","Trimestre"],["ano","Este ano"],["tudo","Tudo"]].map(([tipo,label])=>(
                        <div key={tipo} onClick={()=>aplicarFiltro(tipo)} style={{padding:"4px 8px",borderRadius:5,cursor:"pointer",fontSize:9,background:T.surface,border:`1px solid ${T.border}`,color:T.muted,fontFamily:"Arial,sans-serif"}}>
                          {label}
                        </div>
                      ))}
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
                      <div>
                        <div style={{fontSize:8,color:T.muted,marginBottom:2}}>De</div>
                        <input type="date" value={relDateStart} onChange={e=>{setRelDateStart(e.target.value);setRelPeriodo("Personalizado");}} style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:5,padding:"5px 6px",fontSize:10,color:T.text,outline:"none"}}/>
                      </div>
                      <div>
                        <div style={{fontSize:8,color:T.muted,marginBottom:2}}>Até</div>
                        <input type="date" value={relDateEnd} onChange={e=>{setRelDateEnd(e.target.value);setRelPeriodo("Personalizado");}} style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:5,padding:"5px 6px",fontSize:10,color:T.text,outline:"none"}}/>
                      </div>
                    </div>
                    {relPeriodo&&<div style={{fontSize:9,color:T.accent,marginTop:5,fontFamily:"Arial,sans-serif"}}>↳ {relPeriodo}</div>}
                  </div>

                  {/* Blocos por categoria */}
                  {cats.map(cat=>(
                    <div key={cat} style={{marginBottom:14}}>
                      <div style={{fontSize:9,color:T.muted,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6,fontFamily:"Arial,sans-serif"}}>{cat}</div>
                      {disponiveis.filter(b=>b.cat===cat).map(b=>{
                        const sel=relSelecionados.includes(b.id);
                        return(
                          <div key={b.id} onClick={()=>toggle(b.id)} style={{display:"flex",gap:8,alignItems:"center",padding:"7px 8px",borderRadius:7,cursor:"pointer",marginBottom:4,background:sel?b.color+"15":T.surface,border:`1px solid ${sel?b.color+"55":T.border}`,transition:"all 0.15s"}}>
                            <div style={{width:12,height:12,borderRadius:3,border:`2px solid ${sel?b.color:T.border}`,background:sel?b.color:"transparent",flexShrink:0}}/>
                            <span style={{fontSize:10,color:sel?b.color:T.soft,fontWeight:sel?700:400}}>{b.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  ))}

                  {relSelecionados.length>0&&(
                    <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:6}}>
                      <button onClick={()=>gerarPDF()} style={{width:"100%",padding:"9px",background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",borderRadius:8,cursor:"pointer",fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:11,border:"none"}}>
                        Exportar PDF
                      </button>
                      <button onClick={()=>setRelSelecionados([])} style={{width:"100%",padding:"7px",background:"transparent",color:T.muted,borderRadius:8,cursor:"pointer",fontSize:10,border:`1px solid ${T.border}`}}>
                        Limpar seleção
                      </button>
                    </div>
                  )}
                </div>

                {/* ── PAINEL DIREITO — Preview do relatório ── */}
                <div>
                  {blocosSel.length===0?(
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"60vh",gap:12,color:T.muted}}>
                      <div style={{fontSize:40}}>📊</div>
                      <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:16,color:T.soft}}>Seu relatório aparece aqui</div>
                      <div style={{fontSize:11,color:T.muted}}>Selecione os blocos no painel ao lado</div>
                    </div>
                  ):(
                    <div className="print-area">
                      {/* Cabeçalho do relatório */}
                      <div style={{background:`linear-gradient(135deg,${T.accent}22,${T.purple}11)`,border:`1px solid ${T.accentBorder}`,borderRadius:12,padding:"20px 24px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                          <div style={{fontSize:8,color:T.accent,fontFamily:"Arial,sans-serif",letterSpacing:3,textTransform:"uppercase",marginBottom:4}}>ECODELY · MÍDIA IN-HOME</div>
                          <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:22,marginBottom:2}}>{relTitulo}</div>
                          <div style={{fontSize:10,color:T.muted}}>{relPeriodo} · Gerado em {new Date().toLocaleDateString("pt-BR")}</div>
                        </div>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontSize:9,color:T.muted,marginBottom:4}}>{blocosSel.length} bloco{blocosSel.length!==1?"s":""} selecionado{blocosSel.length!==1?"s":""}</div>
                          <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12,color:T.accent}}>{user.name}</div>
                          <div style={{fontSize:9,color:T.muted}}>{ROLE_LABELS[user.role]}</div>
                        </div>
                      </div>

                      {/* Blocos em grid */}
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                        {blocosSel.map(b=>(
                          <div key={b.id} style={{background:T.card,border:`1px solid ${T.border}`,borderLeft:`3px solid ${b.color}`,borderRadius:12,padding:"16px 18px",position:"relative"}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                              <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:12,color:b.color}}>{b.label}</div>
                              <div onClick={()=>toggle(b.id)} style={{cursor:"pointer",color:T.muted,fontSize:14,lineHeight:1}}>×</div>
                            </div>
                            {b.render()}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* --------------------------------------
              CADASTROS
          -------------------------------------- */}
          {tab==="cadastros"&&(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={{display:"flex",gap:5}}>
                  {[["clientes","Clientes"],["fornecedores","Fornecedores"]].map(([v,l])=>(
                    <div key={v} onClick={()=>setCadTab(v)} className="tb" style={{padding:"7px 12px",borderRadius:6,fontSize:10,background:cadTab===v?T.accentDim:T.card,border:`1px solid ${cadTab===v?T.accentBorder:T.border}`,color:cadTab===v?T.accent:T.muted,cursor:"pointer"}}>{l}</div>
                  ))}
                </div>
                {cadTab==="clientes"&&<button onClick={()=>setShowNewCliente(v=>!v)} style={{padding:"7px 14px",background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",border:"none",borderRadius:7,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:10,cursor:"pointer"}}>+ Novo Cliente</button>}
              </div>

              {cadTab==="clientes"&&(
                <div>
                  {showNewCliente&&(
                    <div style={{background:T.card,border:`1px solid ${T.accentBorder}`,borderRadius:12,padding:16,marginBottom:12}}>
                      <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,color:T.accent,marginBottom:12,fontSize:12}}>Novo Cliente</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
                        {[["Nome *","name","Ex: Selfit Academias"],["Contato","contact","Nome do responsável"],["Email","email","email@empresa.com"],["Telefone","phone","(11) 99999-9999"],["Segmento","segment","Ex: Academia, Varejo"],["Agência","agency","Nome da agência (opcional)"]].map(([l,k,ph])=>(
                          <div key={k}>
                            <div style={{fontSize:8,color:T.muted,marginBottom:3,textTransform:"uppercase",letterSpacing:1}}>{l}</div>
                            <input value={novoCliente[k]||""} onChange={e=>setNovoCliente(p=>({...p,[k]:e.target.value}))} placeholder={ph} style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,padding:"7px 9px",fontSize:11,color:T.text,outline:"none"}}/>
                          </div>
                        ))}
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <button onClick={()=>{if(!novoCliente.name)return;setShowNewCliente(false);setNovoCliente({name:"",contact:"",email:"",phone:"",segment:"",agency:""});pushNotif("Cliente cadastrado",novoCliente.name,"Novo cliente adicionado",T.accent);}} style={{padding:"7px 16px",background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",border:"none",borderRadius:7,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:10,cursor:"pointer"}}>Salvar</button>
                        <button onClick={()=>setShowNewCliente(false)} style={{padding:"7px 14px",background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:7,fontSize:10,cursor:"pointer"}}>Cancelar</button>
                      </div>
                    </div>
                  )}
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
                    <div style={{display:"grid",gridTemplateColumns:"2fr 1.5fr 1fr 0.8fr 1fr",padding:"10px 16px",borderBottom:`1px solid ${T.border}`,gap:10}}>
                      {["Cliente","Contato","Segmento","Campanhas","LTV"].map(h=><div key={h} style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:1.5}}>{h}</div>)}
                    </div>
                    {CLIENTS_LIST.map((c,i)=>(<div key={i} className="hr" style={{display:"grid",gridTemplateColumns:"2fr 1.5fr 1fr 0.8fr 1fr",padding:"12px 16px",borderBottom:`1px solid ${T.border}`,gap:10,alignItems:"center"}}>
                      <div><div style={{fontSize:12,fontWeight:700,fontFamily:"Arial,sans-serif"}}>{c.name}</div><div style={{fontSize:9,color:T.muted}}>{c.email}</div></div>
                      <div style={{fontSize:11,color:T.soft}}>{c.contact}</div>
                      <Badge label={c.segment} color={T.purple}/>
                      <div style={{fontFamily:"Arial,sans-serif",fontWeight:800,fontSize:18,color:T.info}}>{c.campaigns}</div>
                      <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:13,color:T.accent}}>{fmtK(c.ltv)}</div>
                    </div>))}
                  </div>
                </div>
              )}

              {cadTab==="fornecedores"&&(
                <div>
                  <div style={{background:T.card,border:`1px solid ${T.accentBorder}`,borderRadius:12,padding:16,marginBottom:12}}>
                    <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,color:T.accent,marginBottom:12,fontSize:11}}>Novo Fornecedor</div>
                    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",gap:8,marginBottom:8}}>
                      <div><div style={{fontSize:8,color:T.muted,marginBottom:3,textTransform:"uppercase",letterSpacing:1}}>Nome *</div><input placeholder="Ex: Gráfica Rápida" value={nf.name} onChange={e=>setNf(p=>({...p,name:e.target.value}))} style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,padding:"7px 9px",fontSize:11,color:T.text,outline:"none"}}/></div>
                      <div><div style={{fontSize:8,color:T.muted,marginBottom:3,textTransform:"uppercase",letterSpacing:1}}>Tipo</div><select value={nf.type} onChange={e=>setNf(p=>({...p,type:e.target.value}))} style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,padding:"7px 9px",fontSize:11,color:T.text,outline:"none"}}><option value="grafica">Gráfica</option><option value="logistica">Logística</option></select></div>
                      <div><div style={{fontSize:8,color:T.muted,marginBottom:3,textTransform:"uppercase",letterSpacing:1}}>Contato</div><input placeholder="Nome" value={nf.contact} onChange={e=>setNf(p=>({...p,contact:e.target.value}))} style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,padding:"7px 9px",fontSize:11,color:T.text,outline:"none"}}/></div>
                      <div><div style={{fontSize:8,color:T.muted,marginBottom:3,textTransform:"uppercase",letterSpacing:1}}>Email</div><input placeholder="email@fornecedor.com" value={nf.email} onChange={e=>setNf(p=>({...p,email:e.target.value}))} style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,padding:"7px 9px",fontSize:11,color:T.text,outline:"none"}}/></div>
                      <div><div style={{fontSize:8,color:T.muted,marginBottom:3,textTransform:"uppercase",letterSpacing:1}}>Prazo</div><input placeholder="7 dias" value={nf.leadTime} onChange={e=>setNf(p=>({...p,leadTime:e.target.value}))} style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,padding:"7px 9px",fontSize:11,color:T.text,outline:"none"}}/></div>
                    </div>
                    <button onClick={async()=>{if(!nf.name)return;const rec={...nf,id:Date.now(),campaigns:0};setSuppliers(p=>[...p,rec]);setNf({name:"",type:"grafica",contact:"",phone:"",email:"",leadTime:"7 dias",rating:4});await supabase.from("fornecedores").insert(rec);pushNotif("Fornecedor cadastrado",rec.name,"Adicionado com sucesso",T.accent);}} style={{padding:"7px 16px",background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",border:"none",borderRadius:7,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:10,cursor:"pointer"}}>+ Adicionar Fornecedor</button>
                  </div>
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
                    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 0.8fr 0.6fr 0.3fr",padding:"10px 16px",borderBottom:`1px solid ${T.border}`,gap:10}}>
                      {["Fornecedor","Tipo","Contato","Prazo","Rating",""].map(h=><div key={h} style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:1.5}}>{h}</div>)}
                    </div>
                    {suppliers.length===0&&<div style={{padding:"20px 16px",fontSize:11,color:T.muted,textAlign:"center"}}>Nenhum fornecedor cadastrado ainda.</div>}
                    {suppliers.map((s,i)=>(<div key={i} className="hr" style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 0.8fr 0.6fr 0.3fr",padding:"12px 16px",borderBottom:`1px solid ${T.border}`,gap:10,alignItems:"center"}}>
                      <div><div style={{fontSize:12,fontWeight:700,fontFamily:"Arial,sans-serif"}}>{s.name}</div><div style={{fontSize:9,color:T.muted}}>{s.email}</div></div>
                      <Badge label={s.type==="grafica"?"Gráfica":"Logística"} color={s.type==="grafica"?T.purple:T.warn}/>
                      <div style={{fontSize:11,color:T.soft}}>{s.contact}</div>
                      <div style={{fontSize:10,color:T.soft,fontFamily:"Arial,sans-serif"}}>{s.leadTime}</div>
                      <div style={{fontSize:11,color:T.warn}}>{"★".repeat(s.rating||0)}</div>
                      <div onClick={async()=>{setSuppliers(p=>p.filter(x=>x.id!==s.id));await supabase.from("fornecedores").delete().eq("id",s.id);}} style={{fontSize:9,color:T.danger,cursor:"pointer",textAlign:"center"}}>✕</div>
                    </div>))}
                  </div>
                </div>
              )}
            </div>
          )}


          {/* --------------------------------------
              USUÁRIOS
          -------------------------------------- */}
          {tab==="usuarios"&&user.role==="admin"&&(
            <div>
              <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
                <button className="btn" onClick={()=>setShowNewUser(true)} style={{padding:"8px 16px",background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",borderRadius:8,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:11}}>+ Novo Usuário</button>
              </div>
              {showNewUser&&(
                <div style={{background:T.card,border:`1px solid ${T.accentBorder}`,borderRadius:12,padding:18,marginBottom:12}} className="fade">
                  <div style={{fontFamily:"Arial,sans-serif",fontWeight:700,color:T.accent,marginBottom:12}}>Novo Usuário</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}>
                    {[["Nome","name","text"],["E-mail","email","email"],["Senha","pass","password"]].map(([l,k,t])=>(<div key={k}><div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>{l}</div><input type={t} value={newUser[k]} onChange={e=>setNewUser(p=>({...p,[k]:e.target.value}))} style={inpS}/></div>))}
                    <div><div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"Arial,sans-serif",textTransform:"uppercase",letterSpacing:1}}>Perfil</div><select value={newUser.role} onChange={e=>setNewUser(p=>({...p,role:e.target.value}))} style={selS}>{Object.entries(ROLE_LABELS).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></div>
                  </div>
                  <div style={{display:"flex",gap:8}}><button className="btn" onClick={addUser} style={{padding:"8px 16px",background:T.accent,color:"#000",borderRadius:7,fontFamily:"Arial,sans-serif",fontWeight:700,fontSize:11}}>Criar</button><button className="btn" onClick={()=>setShowNewUser(false)} style={{padding:"8px 12px",background:T.card,border:`1px solid ${T.border}`,color:T.muted,borderRadius:7,fontSize:11}}>Cancelar</button></div>
                </div>
              )}
              <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
                <div style={{display:"grid",gridTemplateColumns:"2fr 2fr 1fr 1fr 1fr",padding:"10px 16px",borderBottom:`1px solid ${T.border}`,gap:10}}>
                  {["Usuário","E-mail","Perfil","Acessos extras","Status"].map(h=><div key={h} style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:1.5}}>{h}</div>)}
                </div>
                {users.map((u,i)=>(
                  <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 2fr 1fr 1fr 1fr",padding:"12px 16px",borderBottom:`1px solid ${T.border}`,gap:10,alignItems:"start",opacity:u.active?1:0.5}}>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}><div style={{width:26,height:26,borderRadius:"50%",background:ROLE_COLOR[u.role]+"22",border:`1px solid ${ROLE_COLOR[u.role]}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:ROLE_COLOR[u.role],fontWeight:700,flexShrink:0}}>{u.avatar}</div><span style={{fontSize:12,fontWeight:600,fontFamily:"Arial,sans-serif"}}>{u.name}</span></div>
                    <div style={{fontSize:10,color:T.muted,fontFamily:"Arial,sans-serif"}}>{u.email}</div>
                    <Badge label={ROLE_LABELS[u.role]} color={ROLE_COLOR[u.role]}/>
                    {/* Acessos extras — só aparece para não-admin */}
                    <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                      {u.role!=="admin"&&Object.entries(ROLE_LABELS).filter(([r])=>r!=="admin"&&r!==u.role).map(([r,l])=>{
                        const extras=u.extraRoles||[];
                        const tem=extras.includes(r);
                        return(
                          <div key={r} onClick={async()=>{
                            const novas=tem?extras.filter(x=>x!==r):[...extras,r];
                            setUsers(p=>p.map(x=>x.id===u.id?{...x,extraRoles:novas}:x));
                            if(u.id===user.id)setUser(p=>({...p,extraRoles:novas}));
                            await supabase.from("usuarios").update({extraRoles:novas}).eq("id",u.id);
                          }} style={{fontSize:8,padding:"2px 7px",borderRadius:4,cursor:"pointer",border:`1px solid ${tem?ROLE_COLOR[r]+"66":T.border}`,background:tem?ROLE_COLOR[r]+"22":T.surface,color:tem?ROLE_COLOR[r]:T.muted,fontFamily:"Arial,sans-serif",transition:"all 0.15s"}}>
                            {l}
                          </div>
                        );
                      })}
                      {u.role==="admin"&&<span style={{fontSize:9,color:T.muted}}>Acesso total</span>}
                    </div>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <div style={{width:7,height:7,borderRadius:"50%",background:u.active?T.accent:T.danger}}/>
                      {u.id!==user.id&&<div onClick={async()=>{const na=!u.active;setUsers(p=>p.map(x=>x.id===u.id?{...x,active:na}:x));await supabase.from("usuarios").update({active:na}).eq("id",u.id);}} style={{fontSize:9,color:u.active?T.danger:T.accent,cursor:"pointer",fontFamily:"Arial,sans-serif"}}>{u.active?"Aposentar":"Reativar"}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
