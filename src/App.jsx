import { useState, useEffect, useCallback } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { createClient } from "@supabase/supabase-js";

const SUPA_URL = "https://xklvqcxhtariqqhvnseh.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrbHZxY3hodGFyaXFxaHZuc2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0NTYxMjYsImV4cCI6MjA5NDAzMjEyNn0.uZmJKJNTMpH65z3eztXKbip6jiZnsuKIUUl3ceWd5XU";
const supabase = createClient(SUPA_URL, SUPA_KEY);

const T={bg:"#06070D",surface:"#0C0E18",card:"#10121E",border:"#1A1E30",accent:"#00E5A0",accentDim:"#00E5A012",accentBorder:"#00E5A038",text:"#E6E8F0",muted:"#4A5070",soft:"#8A90A8",warn:"#F5A623",warnDim:"#F5A62315",danger:"#FF4D6A",dangerDim:"#FF4D6A12",info:"#3D9EFF",infoDim:"#3D9EFF12",purple:"#9B7FFF",purpleDim:"#9B7FFF12",pink:"#F472B6",green:"#25D366",greenDim:"#25D36612"};

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
const LANCAMENTOS_INIT=[
  {id:1,data:"02/04/2026",descricao:"PI 2523 CLIENTE DIALOGO | BAIRRO IPIRANGA - NF 134",entrada:76800,saida:0,tipo:"Receita",categoria:"Projeto",centrosCusto:"Comercial",forma:"PIX",projeto:"NF 134",contaBancoId:1},
  {id:2,data:"02/04/2026",descricao:"PI 2555 CLIENTE DIALOGO | BAIRRO MOOCA - NF 135",entrada:76800,saida:0,tipo:"Receita",categoria:"Projeto",centrosCusto:"Comercial",forma:"PIX",projeto:"NF 135",contaBancoId:1},
  {id:3,data:"02/04/2026",descricao:"PRONAMP - Conta Bradesco 13/42",entrada:0,saida:2494.85,tipo:"Despesa",categoria:"Financiamento",centrosCusto:"Financeiro",forma:"Debito",projeto:"",contaBancoId:1},
  {id:4,data:"02/04/2026",descricao:"SALARIO PRISCILA",entrada:0,saida:1000,tipo:"Despesa",categoria:"Salario",centrosCusto:"Comercial",forma:"PIX",projeto:"",contaBancoId:1},
  {id:5,data:"02/04/2026",descricao:"SALARIO VICTORIA (base)",entrada:0,saida:1000,tipo:"Despesa",categoria:"Salario",centrosCusto:"Base",forma:"PIX",projeto:"",contaBancoId:1},
  {id:6,data:"02/04/2026",descricao:"SALARIO LARISSA",entrada:0,saida:1343.75,tipo:"Despesa",categoria:"Salario",centrosCusto:"Marketing",forma:"PIX",projeto:"",contaBancoId:1},
  {id:7,data:"02/04/2026",descricao:"SALARIO PEDRO DESIGNER",entrada:0,saida:2500,tipo:"Despesa",categoria:"Salario",centrosCusto:"Operacional",forma:"PIX",projeto:"",contaBancoId:1},
  {id:8,data:"02/04/2026",descricao:"JUROS APORTE RENATO",entrada:0,saida:2400,tipo:"Despesa",categoria:"Financiamento",centrosCusto:"Financeiro",forma:"PIX",projeto:"",contaBancoId:1},
  {id:9,data:"02/04/2026",descricao:"SALARIO PEDRO (socio)",entrada:0,saida:12500,tipo:"Despesa",categoria:"Pro-Labore",centrosCusto:"Administrativo",forma:"PIX",projeto:"",contaBancoId:1},
  {id:10,data:"02/04/2026",descricao:"SALARIO RODRIGO (socio)",entrada:0,saida:12500,tipo:"Despesa",categoria:"Pro-Labore",centrosCusto:"Administrativo",forma:"PIX",projeto:"",contaBancoId:1},
  {id:11,data:"18/04/2026",descricao:"DAS - NF 134 e 135 DIALOGO",entrada:0,saida:173.34,tipo:"Despesa",categoria:"Imposto",centrosCusto:"Financeiro",forma:"Boleto",projeto:"DAS Abril/2026",contaBancoId:1},
  {id:12,data:"18/04/2026",descricao:"DARF",entrada:0,saida:178.31,tipo:"Despesa",categoria:"Imposto",centrosCusto:"Financeiro",forma:"DARF",projeto:"",contaBancoId:1},
  {id:13,data:"15/04/2026",descricao:"CONTADOR",entrada:0,saida:568.62,tipo:"Despesa",categoria:"Contador",centrosCusto:"Financeiro",forma:"Boleto",projeto:"",contaBancoId:1},
  {id:14,data:"15/04/2026",descricao:"COWORKING DELTA",entrada:0,saida:212,tipo:"Despesa",categoria:"Infraestrutura",centrosCusto:"Administrativo",forma:"Boleto",projeto:"",contaBancoId:1},
  {id:15,data:"30/04/2026",descricao:"ACAO AMBIENTAL - SELO EPN",entrada:0,saida:226,tipo:"Despesa",categoria:"Ambiental",centrosCusto:"Operacional",forma:"Boleto",projeto:"",contaBancoId:1},
];
const FAT_MENSAIS_INIT=[
  {mes:"Mai/2025",fat:80000},
  {mes:"Jun/2025",fat:45000},
  {mes:"Jul/2025",fat:60000},
  {mes:"Ago/2025",fat:120000},
  {mes:"Set/2025",fat:95000},
  {mes:"Out/2025",fat:110000},
  {mes:"Nov/2025",fat:85000},
  {mes:"Dez/2025",fat:70000},
  {mes:"Jan/2026",fat:115440},
  {mes:"Fev/2026",fat:39840},
  {mes:"Mar/2026",fat:90000},
  {mes:"Abr/2026",fat:153600},
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
  {id:1,name:"Rodrigo Bem",email:"rodrigobem@ecodely.com.br",pass:"admin123",role:"admin",avatar:"RB",active:true,lastAccess:"nunca",extraRoles:[],meta:500000},
  {id:1779900001,name:"Pedro Camaor",email:"pedro.camaor@ecodely.com.br",pass:"ecodely2026",role:"admin",avatar:"PC",active:true,lastAccess:"nunca",extraRoles:[],meta:0},
  {id:1779900002,name:"Priscila",email:"opec@ecodely.com.br",pass:"ecodely2026",role:"base",avatar:"P",active:true,lastAccess:"nunca",extraRoles:["operacional"],meta:0},
  {id:1779900003,name:"Larissa",email:"financeiro@ecodely.com.br",pass:"ecodely2026",role:"financeiro",avatar:"L",active:true,lastAccess:"nunca",extraRoles:[],meta:0},
  {id:1779900004,name:"Victoria",email:"victoria@ecodely.com.br",pass:"ecodely2026",role:"base",avatar:"V",active:true,lastAccess:"nunca",extraRoles:[],meta:0},
  {id:1779900005,name:"Pedro Henrique",email:"marketing@ecodely.com.br",pass:"ecodely2026",role:"marketing",avatar:"PH",active:true,lastAccess:"nunca",extraRoles:[],meta:0},
];
const ROLE_LABELS={admin:"Administrador",comercial:"Comercial",operacional:"Operacional",marketing:"Marketing",financeiro:"Financeiro",base:"Base"};
const ROLE_COLOR={admin:T.accent,comercial:T.info,operacional:T.purple,marketing:T.pink,financeiro:T.warn,base:T.green};
const SEC_COLOR={comercial:T.info,financeiro:T.warn,marketing:T.pink,base:T.accent,operacional:T.purple};
const SEC_LABEL={comercial:"Comercial",financeiro:"Financeiro",marketing:"Marketing",base:"Base",operacional:"Operacional"};

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
const mkImpactos=()=>({stories:[],influencer:[],impulsionado:[],galeria:[]});

const CAMPS_INIT=[
  {id:1,name:"O Boticário - Maio 2025",client:"O Boticário",stage:3,project:"Dia das Mães",startDate:"05/05/2025",endDate:"31/05/2025",region:"São Paulo · SP",segments:["Hamburguer","Açaí","Café"],graficaFornecedor:"Gráfica TopPrint",material:"Sacola kraft 30x40",graficaPrazo:"28/04/2025",logistica:"Transportadora",logisticaFornecedor:"TransBrasil Cargo",logisticaPrazo:"02/05/2025",parceiros:87,sacolas:18000,sacolasDistribuidas:null,progress:60,
    parceirosIds:[1,7],
    impactos:{
      stories:[{id:1,parceiro:"Burger Bros SP",impressoes:4200,at:"02/05 18:00"},{id:2,parceiro:"Café Paulistano",impressoes:2800,at:"03/05 10:00"}],
      influencer:[],
      impulsionado:[],
      galeria:[{id:1,url:"https://images.unsplash.com/photo-1591715088903-00b4d9543e87?w=400",tipo:"foto",legenda:"Sacolas em campo - SP",at:"01/05"},{id:2,url:"https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400",tipo:"foto",legenda:"Parceiro Burger Bros",at:"02/05"}]
    },
    tasks:{comercial:[{id:"c1",label:"Emitir PI",done:true,doneAt:"28/04 10:20",doneBy:"Ana Lima"},{id:"c2",label:"Enviar contrato ao cliente",done:true,doneAt:"28/04 11:05",doneBy:"Ana Lima"}],financeiro:[{id:"f1",label:"Receber PI",done:true,doneAt:"29/04 09:00",doneBy:"Paulo Neto"},{id:"f2",label:"Faturar NF",done:false},{id:"f3",label:"Lançar planilha financeira",done:false}],marketing:[{id:"m1",label:"Post Instagram",done:true,doneAt:"01/05 14:30",doneBy:"Juliana Faria"},{id:"m2",label:"Post LinkedIn",done:false},{id:"m3",label:"Contratar influencer",done:false}],base:[{id:"b1",label:"Confirmar base participante",done:true,doneAt:"27/04 16:00",doneBy:"Mariana Costa"},{id:"b2",label:"Enviar contrato de exclusividade",done:false}]},
    timeline:mkTimeline([
      {id:1,type:"stage",text:"Campanha criada - Etapa: Fechamento",user:"Rodrigo Bem",avatar:"RB",at:"25/04 09:00",color:T.info},
      {id:2,type:"task",text:"Tarefa concluída: Confirmar base participante",user:"Mariana Costa",avatar:"MC",at:"27/04 16:00",color:T.green},
      {id:3,type:"task",text:"Tarefa concluída: Emitir PI",user:"Ana Lima",avatar:"AL",at:"28/04 10:20",color:T.info},
      {id:4,type:"task",text:"Tarefa concluída: Enviar contrato ao cliente",user:"Ana Lima",avatar:"AL",at:"28/04 11:05",color:T.info},
      {id:5,type:"stage",text:"Etapa avançada: Gráfica - Logística",user:"Carlos Mendes",avatar:"CM",at:"02/05 08:30",color:T.purple},
      {id:6,type:"task",text:"Tarefa concluída: Receber PI",user:"Paulo Neto",avatar:"PN",at:"29/04 09:00",color:T.warn},
      {id:7,type:"comment",text:"Arte aprovada pelo cliente. Seguindo para impressão.",user:"Ana Lima",avatar:"AL",at:"30/04 15:00",color:T.soft},
      {id:8,type:"task",text:"Tarefa concluída: Post Instagram",user:"Juliana Faria",avatar:"JF",at:"01/05 14:30",color:T.pink},
    ]),
    files:mkFiles([
      {id:1,name:"Arte_Boticario_MaeDias.pdf",type:"arte",size:"4.2 MB",uploadedBy:"Ana Lima",at:"30/04 14:55",icon:"-"},
      {id:2,name:"PI_Boticario_0052025.pdf",type:"pi",size:"1.1 MB",uploadedBy:"Ana Lima",at:"28/04 10:18",icon:"-"},
      {id:3,name:"Contrato_Boticario_Assinado.pdf",type:"contrato",size:"890 KB",uploadedBy:"Rodrigo Bem",at:"28/04 11:00",icon:"-"},
      {id:4,name:"Base_Parceiros_Confirmada.xlsx",type:"base",size:"320 KB",uploadedBy:"Mariana Costa",at:"27/04 16:00",icon:"-"},
    ])},

  {id:2,name:"Pirelli - Junho 2025",client:"Pirelli Brasil",stage:1,project:"Copa 2025",startDate:"01/06/2025",endDate:"30/06/2025",region:"Rio de Janeiro · RJ",segments:["Pizza","Japonesa","Hamburguer"],graficaFornecedor:"",material:"",graficaPrazo:"",logistica:"",logisticaFornecedor:"",logisticaPrazo:"",parceiros:54,sacolas:10000,progress:15,
    parceirosIds:[2],impactos:mkImpactos(),
    tasks:{comercial:[{id:"c1",label:"Emitir PI",done:false},{id:"c2",label:"Enviar contrato ao cliente",done:false}],financeiro:[{id:"f1",label:"Receber PI",done:false},{id:"f2",label:"Faturar NF",done:false},{id:"f3",label:"Lançar planilha financeira",done:false}],marketing:[{id:"m1",label:"Post Instagram",done:false},{id:"m2",label:"Post LinkedIn",done:false},{id:"m3",label:"Contratar influencer",done:false}],base:[{id:"b1",label:"Confirmar base participante",done:true,doneAt:"02/05 09:00",doneBy:"Mariana Costa"},{id:"b2",label:"Enviar contrato de exclusividade",done:false}]},
    timeline:mkTimeline([
      {id:1,type:"stage",text:"Campanha criada - Etapa: Fechamento",user:"Rodrigo Bem",avatar:"RB",at:"01/05 10:00",color:T.info},
      {id:2,type:"task",text:"Tarefa concluída: Confirmar base participante",user:"Mariana Costa",avatar:"MC",at:"02/05 09:00",color:T.green},
    ]),
    files:mkFiles([])},

  {id:3,name:"Supergasbras - Abril 2025",client:"Supergasbras",stage:5,project:"Verão 2025",startDate:"01/04/2025",endDate:"30/04/2025",region:"Salvador · BA + Recife · PE",segments:["Açaí","Regional","Padaria"],graficaFornecedor:"Gráfica ColorMax",material:"Sacola biodegradável",graficaPrazo:"20/03/2025",logistica:"Correios",logisticaFornecedor:"ECT",logisticaPrazo:"28/03/2025",parceiros:123,sacolas:25000,sacolasDistribuidas:null,progress:100,
    parceirosIds:[4,6],
    impactos:{
      stories:[{id:1,parceiro:"Açaí Raiz",impressoes:8400,at:"15/04 12:00"},{id:2,parceiro:"Tapioca Nordestina",impressoes:3200,at:"18/04 16:00"}],
      influencer:[{id:1,nome:"@blogdochef_ssa",alcance:45000,at:"10/04"}],
      impulsionado:[{id:1,plataforma:"Instagram Ads",alcance:120000,at:"12/04"}],
      galeria:[{id:1,url:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",tipo:"foto",legenda:"Açaí Raiz com sacolas Ecodely",at:"05/04"},{id:2,url:"https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",tipo:"foto",legenda:"Campanha em campo - Salvador",at:"10/04"},{id:3,url:"https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",tipo:"foto",legenda:"Story parceiro Recife",at:"18/04"}]
    },
    tasks:{comercial:[{id:"c1",label:"Emitir PI",done:true,doneAt:"10/03 09:00",doneBy:"Ana Lima"},{id:"c2",label:"Enviar contrato ao cliente",done:true,doneAt:"10/03 11:00",doneBy:"Ana Lima"}],financeiro:[{id:"f1",label:"Receber PI",done:true,doneAt:"11/03 10:00",doneBy:"Paulo Neto"},{id:"f2",label:"Faturar NF",done:true,doneAt:"02/04 09:00",doneBy:"Paulo Neto"},{id:"f3",label:"Lançar planilha financeira",done:true,doneAt:"02/04 10:00",doneBy:"Paulo Neto"}],marketing:[{id:"m1",label:"Post Instagram",done:true,doneAt:"01/04 08:00",doneBy:"Juliana Faria"},{id:"m2",label:"Post LinkedIn",done:true,doneAt:"01/04 08:30",doneBy:"Juliana Faria"},{id:"m3",label:"Contratar influencer",done:true,doneAt:"15/03 14:00",doneBy:"Juliana Faria"}],base:[{id:"b1",label:"Confirmar base participante",done:true,doneAt:"08/03 16:00",doneBy:"Mariana Costa"},{id:"b2",label:"Enviar contrato de exclusividade",done:true,doneAt:"12/03 11:00",doneBy:"Mariana Costa"}]},
    timeline:mkTimeline([
      {id:1,type:"stage",text:"Campanha criada",user:"Rodrigo Bem",avatar:"RB",at:"05/03 09:00",color:T.info},
      {id:2,type:"stage",text:"Campanha finalizada com sucesso",user:"Rodrigo Bem",avatar:"RB",at:"30/04 18:00",color:T.accent},
    ]),
    files:mkFiles([
      {id:1,name:"Relatorio_Final_Supergasbras.pdf",type:"relatorio",size:"2.8 MB",uploadedBy:"Rodrigo Bem",at:"30/04 17:00",icon:"-"},
      {id:2,name:"NF_Supergasbras_04_2025.pdf",type:"nf",size:"540 KB",uploadedBy:"Paulo Neto",at:"02/04 09:05",icon:"-"},
    ])},

  {id:4,name:"T4F - Maio 2025",client:"T4F Entretenimento",stage:2,project:"Copa 2025",startDate:"15/05/2025",endDate:"15/06/2025",region:"São Paulo + Porto Alegre",segments:["Café","Sobremesa","Hamburguer"],graficaFornecedor:"Gráfica TopPrint",material:"Sacola papel offset",graficaPrazo:"08/05/2025",logistica:"",logisticaFornecedor:"",logisticaPrazo:"",parceiros:67,sacolas:14000,progress:30,
    parceirosIds:[1,5,7],impactos:mkImpactos(),
    tasks:{comercial:[{id:"c1",label:"Emitir PI",done:true,doneAt:"25/04 10:00",doneBy:"Ana Lima"},{id:"c2",label:"Enviar contrato ao cliente",done:true,doneAt:"25/04 11:00",doneBy:"Ana Lima"}],financeiro:[{id:"f1",label:"Receber PI",done:true,doneAt:"26/04 09:00",doneBy:"Paulo Neto"},{id:"f2",label:"Faturar NF",done:false},{id:"f3",label:"Lançar planilha financeira",done:false}],marketing:[{id:"m1",label:"Post Instagram",done:true,doneAt:"28/04 10:00",doneBy:"Juliana Faria"},{id:"m2",label:"Post LinkedIn",done:true,doneAt:"28/04 10:30",doneBy:"Juliana Faria"},{id:"m3",label:"Contratar influencer",done:false}],base:[{id:"b1",label:"Confirmar base participante",done:true,doneAt:"27/04 15:00",doneBy:"Mariana Costa"},{id:"b2",label:"Enviar contrato de exclusividade",done:false}]},
    timeline:mkTimeline([
      {id:1,type:"stage",text:"Campanha criada - Etapa: Fechamento",user:"Rodrigo Bem",avatar:"RB",at:"24/04 14:00",color:T.info},
      {id:2,type:"stage",text:"Etapa avançada: Fechamento - Gráfica",user:"Carlos Mendes",avatar:"CM",at:"02/05 09:00",color:T.purple},
      {id:3,type:"comment",text:"-- Prazo da gráfica é 08/05. Confirmar arte até 06/05.",user:"Carlos Mendes",avatar:"CM",at:"03/05 08:00",color:T.warn},
    ]),
    files:mkFiles([
      {id:1,name:"PI_T4F_Copa2025.pdf",type:"pi",size:"980 KB",uploadedBy:"Ana Lima",at:"25/04 10:00",icon:"-"},
    ])},
];

// --- COMMERCIAL ---------------------------------------------------------------
const PIPE_STAGES=[{id:"lead",label:"Lead",color:T.muted,prob:10},{id:"qualificado",label:"Qualificado",color:T.info,prob:30},{id:"proposta",label:"Proposta",color:T.purple,prob:60},{id:"negociacao",label:"Negociação",color:T.warn,prob:80},{id:"fechado",label:"Fechado",color:T.accent,prob:100}];
const PROSPECTS_INIT=[
  {id:1,name:"Natura",contact:"Paula Mendes",email:"paula@natura.com.br",segment:"Beleza",value:42000,stage:"lead",owner:"Ana Lima",notes:"Indicação O Boticário"},
  {id:2,name:"Ambev",contact:"Ricardo Torres",email:"ricardo@ambev.com.br",segment:"Alimentação",value:85000,stage:"qualificado",owner:"Ana Lima",notes:"Interesse em 3 capitais"},
  {id:3,name:"Magazine Luiza",contact:"Fernanda Luz",email:"fernanda@magalu.com.br",segment:"Tecnologia",value:120000,stage:"proposta",owner:"Rodrigo Bem",notes:"Proposta enviada 05/04"},
  {id:4,name:"iFood",contact:"Bruno Sá",email:"bruno@ifood.com.br",segment:"Tecnologia",value:200000,stage:"negociacao",owner:"Rodrigo Bem",notes:"Reunião marcada 20/04"},
  {id:5,name:"Riachuelo",contact:"Carla Vaz",email:"carla@riachuelo.com.br",segment:"Moda",value:55000,stage:"proposta",owner:"Ana Lima",notes:"Aguardando aprovação interna"},
];
const CLIENTS_LIST=[{id:10,name:"O Boticário",contact:"Maria Silva",email:"maria@boticario.com.br",segment:"Beleza",campaigns:3,ltv:127000,owner:"Rodrigo Bem"},{id:11,name:"Pirelli Brasil",contact:"João Souza",email:"joao@pirelli.com",segment:"Automotivo",campaigns:1,ltv:38000,owner:"Ana Lima"},{id:12,name:"Supergasbras",contact:"Carla Moura",email:"carla@supergasbras.com.br",segment:"Energia",campaigns:2,ltv:74000,owner:"Rodrigo Bem"},{id:13,name:"T4F",contact:"Bruno Lima",email:"bruno@t4f.com.br",segment:"Entretenimento",campaigns:1,ltv:42000,owner:"Ana Lima"}];
const CLIENT_BILLING=[{name:"O Boticário",segment:"Beleza",campanhas:3,faturado:127000,pendente:0,ultima:"Abr/25"},{name:"Pirelli Brasil",segment:"Automotivo",campanhas:1,faturado:38000,pendente:14000,ultima:"Jun/25"},{name:"Supergasbras",segment:"Energia",campanhas:2,faturado:74000,pendente:0,ultima:"Abr/25"},{name:"T4F",segment:"Entretenimento",campanhas:1,faturado:42000,pendente:22000,ultima:"Mai/25"}];
const MONTHLY_DATA=[{month:"Nov/24",receita:28400,previsao:30000},{month:"Dez/24",receita:31200,previsao:32000},{month:"Jan/25",receita:19800,previsao:22000},{month:"Fev/25",receita:35600,previsao:34000},{month:"Mar/25",receita:42100,previsao:40000},{month:"Abr/25",receita:38700,previsao:41000},{month:"Mai/25",receita:0,previsao:52000},{month:"Jun/25",receita:0,previsao:58000}];
const USER_BILLING=[{user:"Rodrigo Bem",avatar:"RB",color:T.accent,faturado:127000,meta:150000,campanhas:4},{user:"Ana Lima",avatar:"AL",color:T.info,faturado:154000,meta:150000,campanhas:5}];

// --- COMMISSIONS -------------------------------------------------------------
const PROJECTS_INIT=[{id:1,name:"Copa 2025",active:true},{id:2,name:"Verão 2025",active:true},{id:3,name:"Dia das Mães 2025",active:true}];
const PTYPES_INIT=[{id:1,name:"Restaurante"},{id:2,name:"Bar"},{id:3,name:"Padaria"},{id:4,name:"Açaí"},{id:5,name:"Café"},{id:6,name:"Hamburgueria"}];
const COMM_TABLE_INIT=[{id:1,typeId:1,typeName:"Restaurante",projectId:1,projectName:"Copa 2025",value:80},{id:2,typeId:2,typeName:"Bar",projectId:1,projectName:"Copa 2025",value:120},{id:3,typeId:3,typeName:"Padaria",projectId:1,projectName:"Copa 2025",value:60},{id:4,typeId:1,typeName:"Restaurante",projectId:2,projectName:"Verão 2025",value:70},{id:5,typeId:4,typeName:"Açaí",projectId:2,projectName:"Verão 2025",value:90},{id:6,typeId:5,typeName:"Café",projectId:3,projectName:"Dia das Mães 2025",value:55}];
const CLOSINGS_INIT=[{id:1,user:"Victoria",userId:1779900004,partner:"Churrascaria do Zé",type:"Restaurante",typeId:1,project:"Copa 2025",projectId:1,value:80,date:"02/04",status:"aprovado",pago:true},{id:2,user:"Victoria",userId:1779900004,partner:"Bar do Alemão",type:"Bar",typeId:2,project:"Copa 2025",projectId:1,value:120,date:"05/04",status:"aprovado",pago:false},{id:3,user:"Victoria",userId:1779900004,partner:"Padaria Estrela",type:"Padaria",typeId:3,project:"Copa 2025",projectId:1,value:60,date:"08/04",status:"pendente",pago:false},{id:4,user:"Priscila",userId:1779900002,partner:"Café Central",type:"Café",typeId:5,project:"Dia das Mães 2025",projectId:3,value:55,date:"20/04",status:"pendente",pago:false}];
// --- BASE PARTNERS ------------------------------------------------------------
const calcScore=(p)=>{
  const s1=Math.min(p.deliveries/500*30,30);
  const s2=p.campanhas*15;
  const s3=p.mesesNaBase*2;
  const s4=p.contrato.status==="assinado"?20:0;
  const s5=p.engajamento*5;
  return Math.min(Math.round(s1+s2+s3+s4+s5),100);
};
const BASE_PARTNERS_INIT=[
  {id:1,name:"Burger Bros SP",handle:"@burgerbros_sp",city:"São Paulo",state:"SP",category:"Hamburguer",deliveries:312,status:"ativo",mesesNaBase:8,campanhas:3,engajamento:3,
    endereco:{rua:"Rua Augusta",numero:"1204",bairro:"Consolação",cep:"01304-001",lat:-23.5542,lng:-46.6527},
    contrato:{status:"assinado",enviadoEm:"10/09/2024",assinadoEm:"12/09/2024",expiraEm:"12/09/2025"}},
  {id:2,name:"Pizza da Vila",handle:"@pizzadavila_rj",city:"Rio de Janeiro",state:"RJ",category:"Pizza",deliveries:187,status:"prospectado",mesesNaBase:1,campanhas:0,engajamento:2,
    endereco:{rua:"Rua Voluntários da Pátria",numero:"340",bairro:"Botafogo",cep:"22270-010",lat:-22.9519,lng:-43.1823},
    contrato:{status:"pendente",enviadoEm:"01/05/2025",assinadoEm:null,expiraEm:null}},
  {id:3,name:"Sushi Zen",handle:"@sushizen_bsb",city:"Brasília",state:"DF",category:"Japonesa",deliveries:445,status:"negociando",mesesNaBase:3,campanhas:1,engajamento:3,
    endereco:{rua:"CLN 408 Bloco B",numero:"12",bairro:"Asa Norte",cep:"70855-520",lat:-15.7396,lng:-47.8826},
    contrato:{status:"pendente",enviadoEm:"15/03/2025",assinadoEm:null,expiraEm:null}},
  {id:4,name:"Açaí Raiz",handle:"@acairaiz_ssa",city:"Salvador",state:"BA",category:"Açaí",deliveries:276,status:"ativo",mesesNaBase:6,campanhas:2,engajamento:3,
    endereco:{rua:"Av. Oceânica",numero:"876",bairro:"Ondina",cep:"40170-010",lat:-13.0061,lng:-38.5147},
    contrato:{status:"assinado",enviadoEm:"05/11/2024",assinadoEm:"06/11/2024",expiraEm:"06/11/2025"}},
  {id:5,name:"Churrasco do Gaúcho",handle:"@churrascodogaucho",city:"Porto Alegre",state:"RS",category:"Churrascaria",deliveries:203,status:"ativo",mesesNaBase:5,campanhas:2,engajamento:2,
    endereco:{rua:"Av. Ipiranga",numero:"1681",bairro:"Azenha",cep:"90160-093",lat:-30.0453,lng:-51.2177},
    contrato:{status:"expirando",enviadoEm:"02/05/2024",assinadoEm:"04/05/2024",expiraEm:"04/06/2025"}},
  {id:6,name:"Tapioca Nordestina",handle:"@tapioca_nordestina",city:"Recife",state:"PE",category:"Regional",deliveries:98,status:"ativo",mesesNaBase:2,campanhas:1,engajamento:1,
    endereco:{rua:"Rua do Bom Jesus",numero:"197",bairro:"Recife Antigo",cep:"50030-170",lat:-8.0631,lng:-34.8711},
    contrato:{status:"sem contrato",enviadoEm:null,assinadoEm:null,expiraEm:null}},
  {id:7,name:"Café Paulistano",handle:"@cafepaulistano",city:"São Paulo",state:"SP",category:"Café",deliveries:156,status:"ativo",mesesNaBase:4,campanhas:1,engajamento:2,
    endereco:{rua:"Rua Oscar Freire",numero:"540",bairro:"Jardins",cep:"01426-000",lat:-23.5635,lng:-46.6711},
    contrato:{status:"assinado",enviadoEm:"10/01/2025",assinadoEm:"11/01/2025",expiraEm:"11/01/2026"}},
].map(p=>({...p,score:calcScore(p)}));
const STATUS_PARTNER={ativo:T.accent,negociando:T.warn,prospectado:T.info,"sem resposta":T.muted};
const CONTRATO_COLOR={"assinado":T.accent,"pendente":T.warn,"expirando":T.danger,"sem contrato":T.muted,"expirado":T.danger};
const SUPPLIERS=[{id:1,name:"Gráfica TopPrint",type:"grafica",contact:"Roberto Alves",phone:"(11) 3333-0001",email:"roberto@topprint.com.br",leadTime:"7 dias",rating:5,campaigns:2},{id:2,name:"Gráfica ColorMax",type:"grafica",contact:"Sandra Reis",phone:"(11) 3333-0002",email:"sandra@colormax.com.br",leadTime:"10 dias",rating:4,campaigns:1},{id:3,name:"TransBrasil Cargo",type:"logistica",contact:"Fernando Dias",phone:"(11) 4444-0001",email:"fernando@transbrasil.com.br",leadTime:"3 dias",rating:4,campaigns:1},{id:4,name:"ECT Correios",type:"logistica",contact:"Agência SP",phone:"0800-725-0100",email:"",leadTime:"5-10 dias",rating:3,campaigns:1}];

// --- NAV ---------------------------------------------------------------------
const getNav=(role,queueCount,notifCount)=>[
  {id:"dashboard",label:"Dashboard",icon:"-",roles:["admin","comercial","operacional","marketing","financeiro","base"]},
  {id:"minha-fila",label:"Minha Fila",icon:"-",roles:["comercial","operacional","marketing","financeiro","base","admin"],badge:queueCount||null},
  {id:"campanhas",label:"Campanhas",icon:"-",roles:["admin","comercial","operacional","marketing","financeiro"]},
  {id:"calendario",label:"Calendário",icon:"-",roles:["admin","comercial","operacional","marketing","financeiro"]},
  {id:"financeiro-modulo",label:"Financeiro",icon:"-",roles:["admin","financeiro"]},
  {id:"comercial",label:"Comercial",icon:"-",roles:["admin","comercial","financeiro"]},
  {id:"comissoes",label:"Comissões",icon:"-",roles:["admin","base"]},
  {id:"parceiros",label:"Buscar Parceiros",icon:"-",roles:["admin","base"]},
  {id:"base",label:"Base",icon:"-",roles:["admin","base","comercial"]},
  {id:"cadastros",label:"Cadastros",icon:"-",roles:["admin","comercial","operacional"]},
  {id:"usuarios",label:"Usuários",icon:"-",roles:["admin"]},
].filter(n=>n.roles.includes(role));

// --- HELPERS -----------------------------------------------------------------
const Badge=({label,color})=>(<span style={{fontSize:9,padding:"2px 8px",borderRadius:4,background:color+"22",color,border:`1px solid ${color}33`,fontFamily:"'JetBrains Mono',monospace",whiteSpace:"nowrap"}}>{label}</span>);
const PBar=({pct,color,h=5})=>(<div style={{height:h,background:T.border,borderRadius:h}}><div style={{height:"100%",width:`${Math.min(100,pct)}%`,background:color||T.accent,borderRadius:h,transition:"width 0.4s ease"}}/></div>);
const KCard=({label,value,sub,color,icon,onClick,hint})=>(<div onClick={onClick} style={{background:T.card,border:`1px solid ${onClick?color+"44":T.border}`,borderRadius:12,padding:"16px 18px",cursor:onClick?"pointer":"default",transition:"all 0.15s",position:"relative"}} onMouseEnter={e=>{if(onClick)e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";}}>  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:9,color:T.muted,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:1.5}}>{label}</span>{icon&&<span style={{fontSize:14}}>{icon}</span>}</div><div style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,color,marginBottom:3}}>{value}</div>{sub&&<div style={{fontSize:9,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>{sub}</div>}{onClick&&<div style={{fontSize:8,color:color,marginTop:5,fontFamily:"'JetBrains Mono',monospace",opacity:0.7}}>{hint||"Ver detalhes -"}</div>}</div>);
const inpS={width:"100%",background:T.bg,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",fontSize:11,color:T.text,fontFamily:"'JetBrains Mono',monospace",outline:"none"};
const selS={...inpS};
const tasksDone=(tasks)=>{const all=Object.values(tasks).flat();return{done:all.filter(t=>t.done).length,total:all.length};};

// --- FILE TYPE COLORS ---------------------------------------------------------
const FILE_COLOR={arte:T.pink,pi:T.info,contrato:T.purple,base:T.green,nf:T.warn,relatorio:T.accent,outro:T.soft};

// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// CAMPAIGN MODAL - with Tarefas, Etapas, Histórico, Arquivos
// ------------------------------------------------------------------------------------------------------------------------------------------------------------
const CampModal=({camp,user,allPartners,onClose,onToggleTask,onAddComment,onAddFile,onUpdateSacolas,onUpdateImpactos,onOpenClientPanel})=>{
  const[iTab,setITab]=useState("tarefas");
  const[comment,setComment]=useState("");
  const[fakeUpload,setFakeUpload]=useState(false);
  const td=tasksDone(camp.tasks);

  const handleComment=()=>{
    if(!comment.trim())return;
    onAddComment(camp.id,comment,user);
    setComment("");
  };

  const handleFakeFile=()=>{
    setFakeUpload(true);
    setTimeout(()=>{
      onAddFile(camp.id,{id:Date.now(),name:`Arquivo_${camp.client.replace(/\s/g,"_")}_${Date.now()}.pdf`,type:"outro",size:"1.2 MB",uploadedBy:user.name,at:now(),icon:"-"});
      setFakeUpload(false);
    },1400);
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
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17}}>{camp.name}</div>
            <div style={{fontSize:10,color:T.muted,marginTop:2}}>{camp.startDate} - {camp.endDate} · {camp.region} · {camp.parceiros} parceiros</div>
          </div>
          <div onClick={onClose} style={{cursor:"pointer",color:T.muted,fontSize:20,flexShrink:0}}>×</div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",borderBottom:`1px solid ${T.border}`,flexShrink:0,overflowX:"auto"}}>
          {[["tarefas","Tarefas"],["etapas","Etapas"],["historico",`Histórico (${camp.timeline.length})`],["arquivos",`Arquivos (${camp.files.length})`],["impactos","- Impactos"],["cliente","- Painel Cliente"]].map(([id,l])=>(
            <div key={id} onClick={()=>setITab(id)} style={{padding:"10px 18px",fontSize:11,cursor:"pointer",color:iTab===id?(id==="cliente"?T.purple:T.accent):T.muted,borderBottom:`2px solid ${iTab===id?(id==="cliente"?T.purple:T.accent):"transparent"}`,transition:"all 0.15s",whiteSpace:"nowrap"}}>{l}</div>
          ))}
        </div>

        <div style={{flex:1,overflow:"auto",padding:20}}>

          {/* -- TAREFAS -- */}
          {iTab==="tarefas"&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
                {[{l:"Parceiros",v:camp.parceiros,c:T.accent},{l:"Sacolas",v:camp.sacolas.toLocaleString(),c:T.purple},{l:"Tarefas",v:`${td.done}/${td.total}`,c:td.done===td.total?T.accent:T.info}].map((k,i)=>(
                  <div key={i} style={{background:T.card,borderRadius:10,padding:"12px 14px",border:`1px solid ${T.border}`}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:k.c}}>{k.v}</div>
                    <div style={{fontSize:9,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>{k.l}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {Object.entries(camp.tasks).map(([sec,tasks])=>{
                  const done=tasks.filter(t=>t.done).length;
                  return(
                    <div key={sec} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden"}}>
                      <div style={{padding:"10px 14px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{fontSize:12,fontFamily:"'Syne',sans-serif",fontWeight:700,color:SEC_COLOR[sec]||T.muted}}>{SEC_LABEL[sec]||sec}</span>
                        <span style={{fontSize:9,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>{done}/{tasks.length}</span>
                      </div>
                      <div style={{padding:"10px 12px"}}>
                        <PBar pct={Math.round((done/tasks.length)*100)} color={SEC_COLOR[sec]||T.muted} h={4}/>
                        <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:4}}>
                          {tasks.map(t=>(
                            <div key={t.id} onClick={()=>onToggleTask(camp.id,sec,t.id,user)} style={{display:"flex",gap:8,alignItems:"flex-start",cursor:"pointer",padding:"5px 6px",borderRadius:6}}>
                              <div style={{width:15,height:15,borderRadius:4,border:`2px solid ${t.done?SEC_COLOR[sec]||T.accent:T.border}`,background:t.done?(SEC_COLOR[sec]||T.accent)+"33":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:SEC_COLOR[sec]||T.accent,flexShrink:0,marginTop:1}}>{t.done&&"-"}</div>
                              <div style={{flex:1}}>
                                <div style={{fontSize:11,color:t.done?T.muted:T.text,textDecoration:t.done?"line-through":"none",fontFamily:"'JetBrains Mono',monospace"}}>{t.label}</div>
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
                          <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:isCur?s.color:isDone?T.soft:T.muted}}>{s.label}</span>
                          {isCur&&<Badge label="Em andamento" color={s.color}/>}
                          {isDone&&<Badge label="Concluída" color={T.accent}/>}
                        </div>
                        {s.id===2&&(camp.graficaFornecedor||camp.material)&&<div style={{fontSize:10,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>{camp.graficaFornecedor} · {camp.material}{camp.graficaPrazo&&` · Prazo: ${camp.graficaPrazo}`}</div>}
                        {s.id===3&&(camp.logistica||camp.logisticaFornecedor)&&<div style={{fontSize:10,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>{camp.logistica} · {camp.logisticaFornecedor}{camp.logisticaPrazo&&` · Prazo: ${camp.logisticaPrazo}`}</div>}
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
                    <div style={{width:32,height:32,borderRadius:"50%",background:e.color+"22",border:`2px solid ${e.color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:e.color,fontWeight:700,flexShrink:0,background:T.surface}}>{e.avatar}</div>
                    <div style={{flex:1,background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 14px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4,flexWrap:"wrap",gap:4}}>
                        <div style={{display:"flex",gap:6,alignItems:"center"}}>
                          <div style={{width:6,height:6,borderRadius:"50%",background:e.color,flexShrink:0}}/>
                          <span style={{fontSize:10,color:e.color,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:0.5}}>
                            {e.type==="stage"?"Etapa":e.type==="task"?"Tarefa":e.type==="comment"?"Comentário":"Arquivo"}
                          </span>
                        </div>
                        <span style={{fontSize:9,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>{e.at} · {e.user}</span>
                      </div>
                      <div style={{fontSize:12,color:e.type==="comment"?T.soft:T.text,fontStyle:e.type==="comment"?"italic":"normal"}}>{e.text}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Add comment */}
              <div style={{marginTop:8,background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:14}}>
                <div style={{fontSize:9,color:T.muted,marginBottom:8,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:1}}>Adicionar comentário</div>
                <div style={{display:"flex",gap:8}}>
                  <input value={comment} onChange={e=>setComment(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleComment()} placeholder="Digite uma observação... (@menção)" style={{...inpS,flex:1}}/>
                  <button onClick={handleComment} style={{padding:"8px 14px",background:T.accent,color:"#000",borderRadius:7,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,border:"none",cursor:"pointer"}}>Enviar</button>
                </div>
              </div>
            </div>
          )}

          {/* -- ARQUIVOS -- */}
          {iTab==="arquivos"&&(
            <div>
              {/* Upload area */}
              <div onClick={handleFakeFile} style={{border:`2px dashed ${T.border}`,borderRadius:12,padding:"24px",textAlign:"center",cursor:"pointer",marginBottom:16,transition:"all 0.2s",background:fakeUpload?T.accentDim:"transparent",borderColor:fakeUpload?T.accent:T.border}}>
                {fakeUpload?(
                  <div>
                    <div style={{fontSize:22,marginBottom:6}}>-</div>
                    <div style={{fontSize:11,color:T.accent,fontFamily:"'JetBrains Mono',monospace"}}>Enviando arquivo...</div>
                  </div>
                ):(
                  <div>
                    <div style={{fontSize:22,marginBottom:6}}>-</div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,marginBottom:3,fontSize:13}}>Subir arquivo</div>
                    <div style={{fontSize:10,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>Arte · PI · Contrato · NF · Checklist · Qualquer doc</div>
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
                <div style={{textAlign:"center",padding:"40px 20px",color:T.muted,fontSize:12,fontFamily:"'JetBrains Mono',monospace"}}>Nenhum arquivo ainda. Suba o primeiro acima.</div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {camp.files.map((f,i)=>(
                    <div key={f.id} style={{display:"flex",gap:12,alignItems:"center",padding:"12px 16px",background:T.card,border:`1px solid ${T.border}`,borderLeft:`3px solid ${FILE_COLOR[f.type]||T.soft}`,borderRadius:10}}>
                      <div style={{fontSize:20,flexShrink:0}}>{f.icon}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:12,fontWeight:700,fontFamily:"'Syne',sans-serif",marginBottom:2}}>{f.name}</div>
                        <div style={{fontSize:9,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>{f.size} · por {f.uploadedBy} · {f.at}</div>
                      </div>
                      <Badge label={f.type} color={FILE_COLOR[f.type]||T.soft}/>
                      <div style={{fontSize:10,color:T.accent,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace"}}>- Baixar</div>
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

          {/* -- PAINEL CLIENTE -- */}
          {iTab==="cliente"&&(
            <div>
              {/* Admin override control */}
              <div style={{background:T.card,border:`1px solid ${T.purple}44`,borderLeft:`3px solid ${T.purple}`,borderRadius:10,padding:"14px 18px",marginBottom:16}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:T.purple,marginBottom:10}}>- Controle do Administrador</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:10}}>
                  <div>
                    <div style={{fontSize:9,color:T.muted,marginBottom:5,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:1}}>Volume padrão (gráfica)</div>
                    <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",fontSize:12,color:T.soft,fontFamily:"'JetBrains Mono',monospace"}}>{camp.sacolas.toLocaleString()} embalagens</div>
                  </div>
                  <div>
                    <div style={{fontSize:9,color:T.purple,marginBottom:5,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:1}}>Override - exibido ao cliente</div>
                    <input
                      type="number"
                      placeholder={`${camp.sacolas.toLocaleString()} (padrão)`}
                      value={camp.sacolasDistribuidas||""}
                      onChange={e=>onUpdateSacolas(camp.id,e.target.value?Number(e.target.value):null)}
                      style={{width:"100%",background:T.surface,border:`1px solid ${T.purple}66`,borderRadius:7,padding:"8px 12px",fontSize:12,color:T.text,fontFamily:"'JetBrains Mono',monospace",outline:"none"}}
                    />
                  </div>
                </div>
                <div style={{fontSize:10,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>
                  {camp.sacolasDistribuidas
                    ? <span style={{color:T.purple}}>Override ativo: cliente verá <strong style={{color:T.text}}>{Number(camp.sacolasDistribuidas).toLocaleString()}</strong> embalagens</span>
                    : <span>Sem override - cliente verá o volume padrão: <strong style={{color:T.text}}>{camp.sacolas.toLocaleString()}</strong></span>
                  }
                </div>
              </div>

              {/* Link */}
              <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"14px 18px",marginBottom:16,display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:1}}>Link do cliente</div>
                  <div style={{fontSize:11,color:T.soft,fontFamily:"'JetBrains Mono',monospace",wordBreak:"break-all"}}>
                    https://ecodely.com.br/cliente/{camp.id}/{camp.client.toLowerCase().replace(/\s/g,"-")}
                  </div>
                </div>
                <button className="btn" onClick={()=>onOpenClientPanel(camp)} style={{padding:"8px 16px",background:`linear-gradient(135deg,${T.purple},${T.purple}AA)`,color:"#fff",borderRadius:8,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,whiteSpace:"nowrap"}}>
                  - Visualizar painel
                </button>
              </div>

              {/* Preview mini */}
              <div style={{border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden",opacity:0.85}}>
                <div style={{background:`linear-gradient(135deg,${T.accent}22,${T.purple}11)`,padding:"16px 20px",borderBottom:`1px solid ${T.border}`,display:"flex",gap:12,alignItems:"center"}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:T.accent}}>ECODELY</div>
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
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:k.c}}>{k.v}</div>
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
                  <div style={{fontSize:9,color:T.muted,textAlign:"center",marginTop:8,fontFamily:"'JetBrains Mono',monospace"}}>Preview do painel - dados visíveis ao cliente</div>
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
  const[newStory,setNewStory]=useState({parceiro:'',impressoes:''});
  const[newInfl,setNewInfl]=useState({nome:'',alcance:''});
  const[newImp,setNewImp]=useState({plataforma:'',alcance:''});
  const[newFoto,setNewFoto]=useState({url:'',legenda:''});
  const imp=camp.impactos||{stories:[],influencer:[],impulsionado:[],galeria:[]};
  const sacolas=camp.sacolasDistribuidas||camp.sacolas||0;
  const offline=Math.round(sacolas*3.3);
  const stTotal=imp.stories.reduce((a,s)=>a+Number(s.impressoes),0);
  const inTotal=imp.influencer.reduce((a,i)=>a+Number(i.alcance),0);
  const imTotal=imp.impulsionado.reduce((a,i)=>a+Number(i.alcance),0);
  const total=offline+stTotal+inTotal+imTotal;
  const upd=(field,val)=>onUpdate(camp.id,{...imp,[field]:val});
  const iS={width:'100%',background:'#0C0E18',border:'1px solid #1A1E30',borderRadius:7,padding:'7px 11px',fontSize:11,color:'#E6E8F0',outline:'none',fontFamily:"'JetBrains Mono',monospace"};
  return(
    <div>
      <div style={{background:'linear-gradient(135deg,#00E5A015,#9B7FFF10)',border:'1px solid #00E5A040',borderRadius:12,padding:'18px 20px',marginBottom:16}}>
        <div style={{fontSize:9,color:T.accent,fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase',letterSpacing:1.5,marginBottom:6}}>Total de impactos</div>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:36,color:T.accent,marginBottom:8}}>{total.toLocaleString()}</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
          {[{l:'Offline',v:offline,c:T.purple},{l:'Stories',v:stTotal,c:'#E1306C'},{l:'Influencer',v:inTotal,c:T.warn},{l:'Impulsionado',v:imTotal,c:T.info}].map((k,i)=>(
            <div key={i} style={{background:'#06070D',borderRadius:8,padding:'8px 10px',textAlign:'center'}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:k.c}}>{k.v.toLocaleString()}</div>
              <div style={{fontSize:8,color:T.muted}}>{k.l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:T.card,border:'1px solid '+T.border,borderRadius:10,padding:'12px 16px',marginBottom:10}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div><div style={{fontSize:11,fontWeight:700,color:T.purple,fontFamily:"'Syne',sans-serif"}}>Impacto Offline</div><div style={{fontSize:9,color:T.muted,marginTop:2}}>{sacolas.toLocaleString()} sacolas x 3,3</div></div>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:T.purple}}>{offline.toLocaleString()}</div>
        </div>
      </div>
      {[
        {title:'Stories dos Parceiros',color:'#E1306C',items:imp.stories,field:'stories',addItem:newStory,setAdd:setNewStory,inputs:[{k:'parceiro',ph:'Parceiro',isSelect:true},{k:'impressoes',ph:'Impressoes',type:'number'}],labelKey:'parceiro',valueKey:'impressoes'},
        {title:'Influenciadores',color:T.warn,items:imp.influencer,field:'influencer',addItem:newInfl,setAdd:setNewInfl,inputs:[{k:'nome',ph:'@influencer'},{k:'alcance',ph:'Alcance',type:'number'}],labelKey:'nome',valueKey:'alcance'},
        {title:'Campanha Impulsionada',color:T.info,items:imp.impulsionado,field:'impulsionado',addItem:newImp,setAdd:setNewImp,inputs:[{k:'plataforma',ph:'Plataforma',isSelectPl:true},{k:'alcance',ph:'Alcance',type:'number'}],labelKey:'plataforma',valueKey:'alcance'},
      ].map((section)=>(
        <div key={section.field} style={{background:T.card,border:'1px solid '+T.border,borderRadius:10,padding:'12px 16px',marginBottom:10}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:section.color,marginBottom:10}}>{section.title}</div>
          {section.items.map((item,i)=>(
            <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 0',borderBottom:'1px solid '+T.border}}>
              <div style={{fontSize:11}}>{item[section.labelKey]}</div>
              <div style={{display:'flex',gap:10,alignItems:'center'}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:section.color,fontSize:13}}>{Number(item[section.valueKey]).toLocaleString()}</div>
                <div onClick={()=>upd(section.field,section.items.filter((_,j)=>j!==i))} style={{fontSize:9,color:T.danger,cursor:'pointer'}}>x</div>
              </div>
            </div>
          ))}
          <div style={{display:'flex',gap:8,marginTop:10}}>
            {section.inputs.map(inp=>(
              inp.isSelect?(
                <select key={inp.k} value={section.addItem[inp.k]} onChange={e=>section.setAdd(p=>({...p,[inp.k]:e.target.value}))} style={{...iS,flex:2}}>
                  <option value="">Parceiro...</option>
                  {allPartners.filter(p=>camp.parceirosIds&&camp.parceirosIds.includes(p.id)).map(p=><option key={p.id}>{p.name}</option>)}
                </select>
              ):inp.isSelectPl?(
                <select key={inp.k} value={section.addItem[inp.k]} onChange={e=>section.setAdd(p=>({...p,[inp.k]:e.target.value}))} style={{...iS,flex:2}}>
                  <option value="">Plataforma...</option>
                  {['Instagram Ads','Facebook Ads','TikTok Ads','Google Ads','YouTube'].map(pl=><option key={pl}>{pl}</option>)}
                </select>
              ):(
                <input key={inp.k} type={inp.type||'text'} placeholder={inp.ph} value={section.addItem[inp.k]} onChange={e=>section.setAdd(p=>({...p,[inp.k]:e.target.value}))} style={{...iS,flex:inp.type==='number'?1:2}}/>
              )
            ))}
            <button onClick={()=>{
              const lk=section.labelKey,vk=section.valueKey;
              if(!section.addItem[lk]||!section.addItem[vk])return;
              upd(section.field,[...section.items,{id:Date.now(),...section.addItem,at:new Date().toLocaleDateString('pt-BR')}]);
              section.setAdd({[lk]:'',alcance:'',nome:'',impressoes:'',plataforma:''});
            }} style={{padding:'7px 12px',background:section.color,color:section.color===T.info?'#fff':'#000',borderRadius:7,border:'none',cursor:'pointer',fontWeight:700,fontSize:11}}>+</button>
          </div>
        </div>
      ))}
      <div style={{background:T.card,border:'1px solid '+T.border,borderRadius:10,padding:'12px 16px'}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:T.accent,marginBottom:10}}>Galeria da Campanha</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:10}}>
          {imp.galeria.map((g,i)=>(
            <div key={i} style={{position:'relative',borderRadius:8,overflow:'hidden',aspectRatio:'1'}}>
              <img src={g.url} alt={g.legenda} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              {g.legenda&&<div style={{position:'absolute',bottom:0,left:0,right:0,background:'#00000088',padding:'4px 6px',fontSize:8,color:'#fff'}}>{g.legenda}</div>}
              <div onClick={()=>upd('galeria',imp.galeria.filter((_,j)=>j!==i))} style={{position:'absolute',top:4,right:4,width:18,height:18,borderRadius:'50%',background:T.danger,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,cursor:'pointer',fontWeight:700}}>x</div>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:8}}>
          <input placeholder="URL da foto/video" value={newFoto.url} onChange={e=>setNewFoto(p=>({...p,url:e.target.value}))} style={{...iS,flex:2}}/>
          <input placeholder="Legenda" value={newFoto.legenda} onChange={e=>setNewFoto(p=>({...p,legenda:e.target.value}))} style={{...iS,flex:1}}/>
          <button onClick={()=>{if(!newFoto.url)return;upd('galeria',[...imp.galeria,{id:Date.now(),...newFoto,tipo:'foto',at:new Date().toLocaleDateString('pt-BR')}]);setNewFoto({url:'',legenda:''}); }} style={{padding:'7px 12px',background:T.accent,color:'#000',borderRadius:7,border:'none',cursor:'pointer',fontWeight:700,fontSize:11}}>+</button>
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
    <div style={{position:'fixed',inset:0,zIndex:400,background:'#04060E',color:'#fff',fontFamily:"'JetBrains Mono',monospace",overflow:'auto'}}>
      <style>{'@import url(https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@400;500&display=swap);.leaflet-container{font-family:sans-serif;}.cp-card{background:linear-gradient(135deg,#0E1020,#0A0C18);border:1px solid #1E2240;border-radius:16px;}'}</style>
      <div style={{background:'#080A14',borderBottom:'1px solid #1A1E30',padding:'14px 28px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:10}}>
        <div style={{display:'flex',gap:14,alignItems:'center'}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:'#00C48C',letterSpacing:-0.5}}>ECODELY</div>
          <div style={{width:1,height:18,background:'#1A1E30'}}/>
          <div style={{fontSize:11,color:'#556'}}>{camp.client} - Painel da Campanha</div>
        </div>
        <div style={{display:'flex',gap:10}}>
          {isFin&&<button onClick={onPDF} style={{padding:'8px 16px',background:'linear-gradient(135deg,#00C48C,#00A070)',color:'#000',borderRadius:8,fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:11,border:'none',cursor:'pointer'}}>PDF</button>}
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
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:28,color:'#fff',marginBottom:6,lineHeight:1.1}}>{camp.name}</div>
                <div style={{fontSize:12,color:'#778'}}>{camp.startDate} - {camp.endDate} - {camp.region}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'8px 16px',background:isFin?'#00C48C22':'#3D9EFF18',border:'1px solid '+(isFin?'#00C48C55':'#3D9EFF44'),borderRadius:10,marginBottom:12}}>
                  <span style={{fontSize:11,color:isFin?'#00C48C':'#3D9EFF',fontWeight:700}}>{isFin?'Finalizada':stage.label+' - Em andamento'}</span>
                </div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:42,color:'#00C48C',lineHeight:1}}>{total.toLocaleString()}</div>
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
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:26,color:k.c,marginBottom:3}}>{k.v}</div>
              <div style={{fontSize:9,color:'#445'}}>{k.sub}</div>
            </div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
          <div className="cp-card" style={{padding:'24px',boxShadow:'0 0 40px #00C48C18'}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:'#fff',marginBottom:4}}>Distribuicao de Impactos</div>
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
                  <span style={{fontSize:11,fontWeight:700,color:k.c,fontFamily:"'Syne',sans-serif"}}>{k.v.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="cp-card" style={{padding:'24px'}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:'#fff',marginBottom:4}}>Entregas por Parceiro</div>
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
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:'#fff'}}>Mapa de cobertura</div>
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
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:'#fff',marginBottom:12}}>Segmentos alcancados</div>
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
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:'#fff',marginBottom:14}}>Campanha em campo</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
              {imp.galeria.map((g,i)=>(
                <div key={i} style={{borderRadius:12,overflow:'hidden',aspectRatio:'4/3',position:'relative'}}>
                  <img src={g.url} alt={g.legenda} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  {g.legenda&&<div style={{position:'absolute',bottom:0,left:0,right:0,background:'linear-gradient(transparent,#000000CC)',padding:'12px 12px 10px',fontSize:10,color:'#fff'}}>{g.legenda}</div>}
                </div>
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
        <button onClick={()=>window.print()} style={{padding:'8px 18px',background:'#00C48C',color:'#fff',borderRadius:8,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,border:'none',cursor:'pointer'}}>Imprimir / Salvar PDF</button>
        <button onClick={onClose} style={{padding:'8px 14px',background:'#555',color:'#fff',borderRadius:8,fontSize:12,border:'none',cursor:'pointer'}}>x Fechar</button>
      </div>
      <div style={{width:794,minHeight:1123,background:'#fff',margin:'20px auto',borderRadius:8,overflow:'hidden',fontFamily:"'JetBrains Mono',monospace"}}>
        <div style={{background:'linear-gradient(135deg,#0A0F1E,#1A2040)',padding:'56px 56px 40px',color:'#fff'}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:32,color:'#00C48C',letterSpacing:-1,marginBottom:4}}>ECODELY</div>
          <div style={{fontSize:10,color:'#667',letterSpacing:3,textTransform:'uppercase',marginBottom:48}}>Relatorio de Campanha</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:26,color:'#fff',marginBottom:8,lineHeight:1.2}}>{camp.name}</div>
          <div style={{fontSize:13,color:'#889',marginBottom:32}}>{camp.client} - {camp.startDate} - {camp.endDate}</div>
        </div>
        <div style={{padding:'36px 56px 28px',borderBottom:'1px solid #EEF'}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,color:'#1A1A2E',marginBottom:20}}>Resumo Executivo</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
            {[{l:'Embalagens distribuidas',v:sacolas,c:'#00C48C'},{l:'Parceiros ativos',v:camp.parceiros,c:'#3D9EFF'},{l:'Total de impactos',v:total.toLocaleString(),c:'#9B7FFF'},{l:'Impacto offline',v:offline.toLocaleString(),c:'#F5A623'},{l:'Regiao',v:camp.region,c:'#F472B6',small:true},{l:'Segmentos',v:camp.segments.join(', '),c:'#888',small:true}].map((k,i)=>(
              <div key={i} style={{background:'#F8FAFF',borderRadius:10,padding:'16px',border:'1px solid #E8EBF4'}}>
                <div style={{fontSize:9,color:'#999',textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>{k.l}</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:k.small?13:20,color:k.c,lineHeight:1.3}}>{k.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{padding:'28px 56px',borderBottom:'1px solid #EEF'}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,color:'#1A1A2E',marginBottom:16}}>Linha do Tempo</div>
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
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,color:'#1A1A2E',marginBottom:14}}>Proximos Passos</div>
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
            <span style={{fontSize:9,color:n.color,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:1}}>{n.title}</span>
          </div>
          <div onClick={onDismiss} style={{cursor:"pointer",color:T.muted,fontSize:14}}>×</div>
        </div>
        <div style={{fontSize:12,color:T.text,lineHeight:1.5}}>{n.msg}</div>
        <div style={{fontSize:9,color:T.muted,marginTop:6,fontFamily:"'JetBrains Mono',monospace"}}>{n.at}</div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// VISÃO GERAL FINANCEIRA — componente separado para permitir useState
// ------------------------------------------------------------------------------------------------------------------------------------------------------------
function VisaoGeralFin({lancamentos,finMesRef,contas,custosFix,cartoes,comprasCartao,proximoMesCartao,rbt12,faixa,aliqDisplay,aliqVal}){
  const MESES_DISP=[...new Set(lancamentos.map(l=>l.data.slice(3,5)+"/"+l.data.slice(6,10)))].sort();
  const[periodoAtivo,setPeriodoAtivo]=useState("mes");
  const[periodoDE,setPeriodoDE]=useState(finMesRef);
  const[periodoATE,setPeriodoATE]=useState(finMesRef);
  const saldoTotal=contas.reduce((a,c)=>a+c.saldo,0);

  const filtrarPeriodo=(arr)=>{
    if(periodoAtivo==="mes") return arr.filter(l=>{ const mm=l.data.slice(3,5); const yy=l.data.slice(6,10); return mm+"/"+yy===finMesRef; });
    const[deM,deY]=periodoDE.split("/"); const[ateM,ateY]=periodoATE.split("/");
    return arr.filter(l=>{ const mm=l.data.slice(3,5); const yy=l.data.slice(6,10); const d=Number(yy)*100+Number(mm); return d>=Number(deY)*100+Number(deM)&&d<=Number(ateY)*100+Number(ateM); });
  };
  const lancPeriodo=filtrarPeriodo(lancamentos);
  const entPeriodo=lancPeriodo.reduce((a,l)=>a+l.entrada,0);
  const saidPeriodo=lancPeriodo.reduce((a,l)=>a+l.saida,0);
  const resutPeriodo=entPeriodo-saidPeriodo;
  const labelPeriodo=periodoAtivo==="mes"?finMesRef:`${periodoDE} → ${periodoATE}`;

  const dreReceitas=CAT_RECEITA.map(cat=>({cat,val:lancPeriodo.filter(l=>l.categoria===cat&&l.entrada>0).reduce((a,l)=>a+l.entrada,0)})).filter(x=>x.val>0);
  const dreDespesas=CAT_DESPESA.map(cat=>({cat,val:lancPeriodo.filter(l=>l.categoria===cat&&l.saida>0).reduce((a,l)=>a+l.saida,0)})).filter(x=>x.val>0).sort((a,b)=>b.val-a.val);

  const mesesGraf=MESES_DISP.filter(m=>{
    const[mm,yy]=m.split("/"); const d=Number(yy)*100+Number(mm);
    if(periodoAtivo==="mes"){ const[rm,ry]=finMesRef.split("/"); return d===Number(ry)*100+Number(rm); }
    const[deM,deY]=periodoDE.split("/"); const[ateM,ateY]=periodoATE.split("/");
    return d>=Number(deY)*100+Number(deM)&&d<=Number(ateY)*100+Number(ateM);
  });
  const grafData=mesesGraf.map(m=>{ const[mm,yy]=m.split("/"); const ls=lancamentos.filter(l=>l.data.slice(3,5)===mm&&l.data.slice(6,10)===yy); return{mes:m,entradas:ls.reduce((a,l)=>a+l.entrada,0),saidas:ls.reduce((a,l)=>a+l.saida,0)}; });

  const selS2={background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,padding:"5px 8px",fontSize:11,color:T.text,outline:"none"};

  // GUARD: se lancamentos não é array, evita crash
  if(!Array.isArray(lancamentos)) return <div style={{color:"red",padding:20}}>Erro: lancamentos não é array</div>;

  return(
    <div>
      {/* DEBUG temporário */}
      <div style={{background:"#1a0a00",border:"1px solid #f5a623",borderRadius:8,padding:"8px 14px",marginBottom:12,fontSize:10,fontFamily:"monospace",color:"#f5a623"}}>
        DEBUG — total: {lancamentos.length} | finMesRef: {finMesRef} | sample data[0]: {lancamentos[0]?.data||"(vazio)"} | filtrados: {lancamentos.filter(l=>{ const d=l.data||""; return d.slice(3,5)+"/"+d.slice(6,10)===finMesRef; }).length}
      </div>
      {/* Barra de período */}
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
        <div style={{fontSize:10,color:T.muted,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:1}}>Período</div>
        <div style={{display:"flex",gap:4}}>
          {[["mes","Mês atual"],["custom","Personalizado"]].map(([v,l])=>(
            <button key={v} onClick={()=>{setPeriodoAtivo(v);if(v==="custom"){setPeriodoDE(finMesRef);setPeriodoATE(finMesRef);}}} style={{padding:"5px 12px",borderRadius:6,fontSize:10,fontWeight:600,cursor:"pointer",border:`1px solid ${periodoAtivo===v?T.accentBorder:T.border}`,background:periodoAtivo===v?T.accentDim:"transparent",color:periodoAtivo===v?T.accent:T.muted}}>{l}</button>
          ))}
        </div>
        {periodoAtivo==="custom"&&(
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:10,color:T.muted}}>De</span>
            <select value={periodoDE} onChange={e=>setPeriodoDE(e.target.value)} style={selS2}>{MESES_DISP.map(m=><option key={m} value={m}>{m}</option>)}</select>
            <span style={{fontSize:10,color:T.muted}}>até</span>
            <select value={periodoATE} onChange={e=>setPeriodoATE(e.target.value)} style={selS2}>{MESES_DISP.map(m=><option key={m} value={m}>{m}</option>)}</select>
          </div>
        )}
        <div style={{marginLeft:"auto",fontSize:10,color:T.accent,fontFamily:"'JetBrains Mono',monospace"}}>{lancPeriodo.length} lançamentos · {labelPeriodo}</div>
      </div>
      {/* Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
        <KCard label="Total entradas" value={fmt(entPeriodo)} sub={labelPeriodo} color={T.accent} icon="-"/>
        <KCard label="Total saídas" value={fmt(saidPeriodo)} sub={labelPeriodo} color={T.danger} icon="-"/>
        <KCard label="Resultado" value={fmt(resutPeriodo)} sub="entradas - saídas" color={resutPeriodo>=0?T.accent:T.danger} icon="-"/>
        <KCard label="Saldo em caixa" value={fmt(saldoTotal)} sub="todas as contas" color={T.info} icon="-"/>
      </div>
      {/* Contas + Custos + Cartões */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Contas Bancárias</div>
          {contas.map(c=>(<div key={c.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}><div style={{display:"flex",gap:8,alignItems:"center"}}><div style={{width:8,height:8,borderRadius:"50%",background:c.cor||T.accent}}/><div><div style={{fontSize:11,fontWeight:600}}>{c.banco}</div><div style={{fontSize:8,color:T.muted}}>{c.tipo}</div></div></div><div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:13,color:c.saldo>=0?T.accent:T.danger}}>{fmt(c.saldo)}</div></div>))}
          <div style={{display:"flex",justifyContent:"space-between",paddingTop:8}}><span style={{fontSize:10,color:T.muted,fontWeight:600}}>TOTAL</span><span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:14,color:T.accent}}>{fmt(saldoTotal)}</span></div>
        </div>
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Custos Fixos do Mês</div>
          <div style={{maxHeight:200,overflowY:"auto"}}>{custosFix.filter(c=>c.ativo).map(c=>(<div key={c.id} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${T.border}`}}><div style={{fontSize:10,color:T.soft,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.descricao}</div><div style={{fontSize:10,color:T.danger,fontFamily:"'JetBrains Mono',monospace",flexShrink:0}}>{fmt(c.valor)}</div></div>))}</div>
          <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:`1px solid ${T.border}`,marginTop:4}}><span style={{fontSize:10,color:T.muted,fontWeight:600}}>TOTAL FIXO</span><span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:13,color:T.danger}}>{fmt(custosFix.filter(c=>c.ativo).reduce((a,c)=>a+c.valor,0))}</span></div>
        </div>
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Cartões</div>
          {cartoes.map(c=>{ const parcMes=comprasCartao.filter(p=>p.cartaoId===c.id&&p.parcelaAtual<=p.parcelas); const totalMes=parcMes.reduce((a,p)=>a+p.valorParcela,0); const totalDev=comprasCartao.filter(p=>p.cartaoId===c.id).reduce((a,p)=>a+(p.valorParcela*(p.parcelas-p.parcelaAtual+1)),0); if(totalDev===0)return null; return(<div key={c.id} style={{padding:"7px 0",borderBottom:`1px solid ${T.border}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:10,color:c.cor||T.warn}}>{c.nome}</span><span style={{fontSize:10,color:T.danger,fontFamily:"'JetBrains Mono',monospace"}}>{fmt(totalMes)}/mês</span></div><div style={{fontSize:8,color:T.muted}}>Saldo devedor: {fmt(totalDev)}</div></div>); })}
          <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:`1px solid ${T.border}`,marginTop:4}}><span style={{fontSize:10,color:T.muted}}>Próximo mês</span><span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:13,color:T.warn}}>{fmt(proximoMesCartao)}</span></div>
        </div>
      </div>
      {/* Gráfico evolução — só aparece com >1 mês */}
      {grafData.length>1&&(
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18,marginBottom:16}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:14}}>Evolução Mensal — {labelPeriodo}</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={grafData} barSize={20}>
              <XAxis dataKey="mes" tick={{fontSize:9,fill:T.muted}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:9,fill:T.muted}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
              <Tooltip formatter={(v,n)=>[fmt(v),n==="entradas"?"Entradas":"Saídas"]} contentStyle={{background:T.card,border:`1px solid ${T.border}`,borderRadius:8,fontSize:11}}/>
              <Legend wrapperStyle={{fontSize:10}}/>
              <Bar dataKey="entradas" fill={T.accent} radius={[4,4,0,0]} name="Entradas"/>
              <Bar dataKey="saidas" fill={T.danger} radius={[4,4,0,0]} name="Saídas"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {/* DRE por categoria */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <div style={{background:T.card,border:`1px solid ${T.accentBorder}`,borderRadius:12,padding:18}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:T.accent,marginBottom:12}}>Receitas por Categoria</div>
          {dreReceitas.length===0&&<div style={{fontSize:10,color:T.muted}}>Nenhuma receita no período</div>}
          {dreReceitas.map(({cat,val})=>(<div key={cat} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${T.border}`}}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:3,height:14,borderRadius:2,background:T.accent}}/><span style={{fontSize:10,color:T.soft}}>{cat}</span></div><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:60,height:4,borderRadius:2,background:T.border,overflow:"hidden"}}><div style={{width:`${entPeriodo>0?Math.round((val/entPeriodo)*100):0}%`,height:"100%",background:T.accent,borderRadius:2}}/></div><span style={{fontSize:10,color:T.accent,fontFamily:"'JetBrains Mono',monospace",fontWeight:700,minWidth:80,textAlign:"right"}}>{fmt(val)}</span></div></div>))}
          {dreReceitas.length>0&&<div style={{display:"flex",justifyContent:"space-between",paddingTop:8}}><span style={{fontSize:10,color:T.muted,fontWeight:700}}>TOTAL</span><span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:13,color:T.accent}}>{fmt(entPeriodo)}</span></div>}
        </div>
        <div style={{background:T.card,border:`1px solid ${T.danger}22`,borderRadius:12,padding:18}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:T.danger,marginBottom:12}}>Despesas por Categoria</div>
          {dreDespesas.length===0&&<div style={{fontSize:10,color:T.muted}}>Nenhuma despesa no período</div>}
          {dreDespesas.map(({cat,val})=>(<div key={cat} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${T.border}`}}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:3,height:14,borderRadius:2,background:T.danger}}/><span style={{fontSize:10,color:T.soft}}>{cat}</span></div><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:60,height:4,borderRadius:2,background:T.border,overflow:"hidden"}}><div style={{width:`${saidPeriodo>0?Math.round((val/saidPeriodo)*100):0}%`,height:"100%",background:T.danger,borderRadius:2}}/></div><span style={{fontSize:10,color:T.danger,fontFamily:"'JetBrains Mono',monospace",fontWeight:700,minWidth:80,textAlign:"right"}}>{fmt(val)}</span></div></div>))}
          {dreDespesas.length>0&&<div style={{display:"flex",justifyContent:"space-between",paddingTop:8}}><span style={{fontSize:10,color:T.muted,fontWeight:700}}>TOTAL</span><span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:13,color:T.danger}}>{fmt(saidPeriodo)}</span></div>}
        </div>
      </div>
      {/* DAS estimado */}
      <div style={{background:T.card,border:`1px solid ${T.accentBorder}`,borderRadius:12,padding:18,marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:4}}>DAS estimado — {labelPeriodo}</div>
            <div style={{fontSize:10,color:T.muted}}>RBT12: {fmt(rbt12)} · {faixa.label} · Alíquota efetiva: {aliqDisplay}%</div>
          </div>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:24,color:T.accent}}>{fmt(entPeriodo*aliqVal)}</div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// MAIN APP
// ------------------------------------------------------------------------------------------------------------------------------------------------------------
export default function App(){
  const[user,setUser]=useState(null);
  const[loginForm,setLoginForm]=useState({email:"",pass:""});
  const[loginErr,setLoginErr]=useState("");
  const[tab,setTab]=useState("dashboard");
  const[camps,setCamps]=useState(CAMPS_INIT);
  const[selCamp,setSelCamp]=useState(null);
  const[campView,setCampView]=useState("kanban");
  const[calMonth,setCalMonth]=useState(4); // 0-indexed, 4=May
  const[calYear,setCalYear]=useState(2025);
  const[calHover,setCalHover]=useState(null);
  const[dashTab,setDashTab]=useState("geral");
  const[dashPeriod,setDashPeriod]=useState("mes");
  // Financial module state
  const[finTab,setFinTab]=useState("visao");
  const[lancamentos,setLancamentos]=useState(LANCAMENTOS_INIT);
  const[lancLoading,setLancLoading]=useState(true);
  const[lancError,setLancError]=useState(null);
  const[editLanc,setEditLanc]=useState(null); // lançamento sendo editado
  const[deleteConfirm,setDeleteConfirm]=useState(null); // id a excluir

  // Carregar lançamentos do Supabase
  const loadLancamentos = useCallback(async () => {
    setLancLoading(true); setLancError(null);
    const { data, error } = await supabase
      .from("lancamentos")
      .select("*")
      .order("data", { ascending: true });
    if (error) { setLancError(error.message); setLancLoading(false); return; }
    // Normalizar: converter data ISO → DD/MM/YYYY e garantir tipos
    const toDataBR=(d)=>{
      if(!d) return "";
      if(/^\d{4}-\d{2}-\d{2}/.test(d)) return d.slice(8,10)+"/"+d.slice(5,7)+"/"+d.slice(0,4);
      return d;
    };
    const normalized = (data||[]).map(l => ({
      ...l,
      data: toDataBR(l.data),
      entrada: Number(l.entrada)||0,
      saida: Number(l.saida)||0,
      confirmado: !!l.confirmado,
      obs: l.obs||"",
    }));
    setLancamentos(normalized.length > 0 ? normalized : LANCAMENTOS_INIT);
    setLancLoading(false);
  }, []);

  useEffect(() => { loadLancamentos(); }, [loadLancamentos]);

  const[custosFix,setCustosFix]=useState(CUSTOS_FIXOS_INIT);
  const[cartoes,setCartoes]=useState(CARTOES_INIT);
  const[comprasCartao,setComprasCartao]=useState(COMPRAS_CARTAO_INIT);
  const[contas,setContas]=useState(CONTAS_INIT);
  const[fatMensais,setFatMensais]=useState(FAT_MENSAIS_INIT);
  const[centrosCusto,setCentrosCusto]=useState(CENTROS_CUSTO_INIT);
  const[reservaCaixaPct,setReservaCaixaPct]=useState(10);
  const[socios,setSocios]=useState([{id:1,nome:"Rodrigo Bem",pct:50},{id:2,nome:"Pedro",pct:50}]);
  const[dasAjuste,setDasAjuste]=useState(null); // manual override
  const[finMesRef,setFinMesRef]=useState("04/2026"); // current view month
  const[clientPanelCamp,setClientPanelCamp]=useState(null);
  const[pdfCamp,setPdfCamp]=useState(null);
  // Notification center
  const[inboxOpen,setInboxOpen]=useState(false);
  const[inbox,setInbox]=useState([
    {id:1,type:"tarefa",title:"Tarefa concluída",msg:"Ana Lima concluiu: Emitir PI - O Boticário",campanha:"O Boticário - Maio 2025",at:"02/05 10:20",read:false,color:T.info,via:["sistema","email"]},
    {id:2,type:"etapa",title:"Campanha avançou",msg:"T4F - Maio 2025 entrou em Gráfica",campanha:"T4F - Maio 2025",at:"02/05 09:00",read:false,color:T.purple,via:["sistema","whatsapp"]},
    {id:3,type:"contrato",title:"Contrato expirando",msg:"Churrasco do Gaúcho: contrato vence em 30 dias",campanha:null,at:"01/05 08:00",read:true,color:T.danger,via:["sistema","email","whatsapp"]},
    {id:4,type:"comissao",title:"Comissão aprovada",msg:"Sua comissão de R$ 80 foi aprovada pelo admin",campanha:null,at:"30/04 17:30",read:true,color:T.accent,via:["sistema"]},
  ]);
  const[prospects,setProspects]=useState(PROSPECTS_INIT);
  const[pipeView,setPipeView]=useState("kanban");
  const[commTab,setCommTab]=useState("pipeline");
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
  const[newUser,setNewUser]=useState({name:"",email:"",role:"base"});
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

  const nav=user?getNav(user.role,pendingQueue.length):[];

  // --- HANDLERS ------------------------------------------------------------
  const handleLogin=()=>{
    const u=USERS_DB.find(u=>u.email===loginForm.email&&u.pass===loginForm.pass);
    if(u&&u.active){setUser(u);setTab("minha-fila");setLoginErr("");}
    else setLoginErr("E-mail ou senha incorretos.");
  };

  const pushNotif=(title,msg,color)=>{
    const n={id:Date.now(),title,msg,color,at:now()};
    setNotifs(p=>[n,...p.slice(0,2)]);
    setTimeout(()=>setNotifs(p=>p.filter(x=>x.id!==n.id)),5000);
  };

  const addNotif=(type,title,msg,campanha,color,via)=>{
    const entry={id:Date.now(),type,title,msg,campanha:campanha||null,at:now(),read:false,color,via:via||["sistema"]};
    setInbox(p=>[entry,...p]);
    pushNotif(title,msg,color);
    // Simulate WhatsApp/email log
    if(via&&via.includes("whatsapp")) console.log("[WhatsApp] ->",user?.name,":",title,"-",msg);
    if(via&&via.includes("email")) console.log("[Email] ->",user?.email,":",title,"-",msg);
  };

  // -- DRAG HANDLERS - CAMPAIGNS --
  const onCampDragStart=(e,campId)=>{e.dataTransfer.effectAllowed="move";setDragCampId(campId);};
  const onCampDragOver=(e,stageId)=>{e.preventDefault();e.dataTransfer.dropEffect="move";setDragOverCampStage(stageId);};
  const onCampDrop=(e,stageId)=>{
    e.preventDefault();
    if(dragCampId===null||dragCampId===undefined)return;
    setCamps(prev=>prev.map(c=>{
      if(c.id!==dragCampId)return c;
      const prevStage=STAGES_CAMP.find(s=>s.id===c.stage);
      const newStage=STAGES_CAMP.find(s=>s.id===stageId);
      const entry={id:Date.now(),type:"stage",text:`Etapa movida: ${prevStage?.label} - ${newStage?.label}`,user:user?.name||"Sistema",avatar:user?.avatar||"?",at:now(),color:newStage?.color||T.accent};
      const newProgress=Math.round(((stageId-1)/4)*100);
      return{...c,stage:stageId,progress:newProgress,timeline:[...c.timeline,entry]};
    }));
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
      setCamps(prev=>prev.map(c=>{
        if(c.id!==campId)return c;
        const entry={id:Date.now(),type:"stage",text:`Etapa movida: ${prevStage?.label} - ${newStage?.label}`,user:user?.name||"Sistema",avatar:user?.avatar||"?",at:now(),color:newStage?.color||T.accent};
        return{...c,stage:stageId,progress:Math.round(((stageId-1)/4)*100),timeline:[...c.timeline,entry]};
      }));
      pushNotif("Campanha movida",`- ${newStage?.label}`,newStage?.color||T.accent);
    }
    if(type==="prosp"&&prospId){
      const stageId=stageTarget;
      const prevP=prospects.find(p=>p.id===prospId);
      if(prevP?.stage===stageId)return;
      setProspects(prev=>prev.map(p=>p.id===prospId?{...p,stage:stageId}:p));
      pushNotif("Prospect movido",`${prevP?.name} - ${PIPE_STAGES.find(s=>s.id===stageId)?.label}`,PIPE_STAGES.find(s=>s.id===stageId)?.color||T.accent);
    }
  };

  const toggleTask=(campId,sec,taskId,byUser)=>{
    let taskLabel="";
    let wasDone=false;
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
      return{...c,tasks:newTasks,timeline:newTl};
    }));
    if(selCamp?.id===campId){
      setSelCamp(prev=>{
        const newTasks={...prev.tasks,[sec]:prev.tasks[sec].map(t=>t.id===taskId?{...t,done:!t.done,doneAt:!t.done?now():undefined,doneBy:!t.done?byUser?.name:undefined}:t)};
        const newTl=[...prev.timeline,{id:Date.now(),type:"task",text:(newTasks[sec].find(t=>t.id===taskId)?.done?"Concluido":"Reaberto")+": "+taskLabel,user:byUser?.name||"Sistema",avatar:byUser?.avatar||"?",at:now(),color:SEC_COLOR[sec]||T.accent}];
        return{...prev,tasks:newTasks,timeline:newTl};
      });
    }
    if(!wasDone) addNotif("tarefa","Tarefa concluida",byUser?.name+" concluiu: "+taskLabel,camps.find(c=>c.id===campId)?.name,SEC_COLOR[sec]||T.accent,["sistema","email"]);
    else pushNotif("Tarefa reaberta",taskLabel,T.muted);
  };

  const addComment=(campId,text,byUser)=>{
    const entry={id:Date.now(),type:"comment",text,user:byUser.name,avatar:byUser.avatar,at:now(),color:T.soft};
    setCamps(prev=>prev.map(c=>c.id===campId?{...c,timeline:[...c.timeline,entry]}:c));
    setSelCamp(prev=>prev&&prev.id===campId?{...prev,timeline:[...prev.timeline,entry]}:prev);
    pushNotif("Comentário adicionado",`${byUser.name}: "${text.slice(0,40)}..."`,T.soft);
  };

  const addFile=(campId,file)=>{
    const entry={id:Date.now(),type:"file",text:`Arquivo enviado: ${file.name}`,user:file.uploadedBy,avatar:user?.avatar||"?",at:file.at,color:FILE_COLOR[file.type]||T.soft};
    setCamps(prev=>prev.map(c=>c.id===campId?{...c,files:[...c.files,file],timeline:[...c.timeline,entry]}:c));
    setSelCamp(prev=>prev&&prev.id===campId?{...prev,files:[...prev.files,file],timeline:[...prev.timeline,entry]}:prev);
    pushNotif("Arquivo enviado",file.name,T.accent);
  };

  const updateSacolas=(campId,val)=>{
    setCamps(prev=>prev.map(c=>c.id===campId?{...c,sacolasDistribuidas:val}:c));
    setSelCamp(prev=>prev&&prev.id===campId?{...prev,sacolasDistribuidas:val}:prev);
    if(clientPanelCamp?.id===campId)setClientPanelCamp(prev=>({...prev,sacolasDistribuidas:val}));
  };

  const updateImpactos=(campId,newImpactos)=>{
    setCamps(prev=>prev.map(c=>c.id===campId?{...c,impactos:newImpactos}:c));
    setSelCamp(prev=>prev&&prev.id===campId?{...prev,impactos:newImpactos}:prev);
    if(clientPanelCamp?.id===campId)setClientPanelCamp(prev=>({...prev,impactos:newImpactos}));
  };

  const addProsp=()=>{
    if(!newProsp.name)return;
    setProspects(p=>[...p,{...newProsp,id:Date.now(),value:Number(newProsp.value)||0}]);
    setNewProsp({name:"",contact:"",email:"",segment:"Beleza",value:"",stage:"lead",owner:"Ana Lima",notes:""});
    setShowNewProsp(false);
  };

  const submitClosing=()=>{
    if(!newClosing.partner||!newClosing.typeId||!newClosing.projectId)return;
    const type=ptypes.find(t=>t.id===Number(newClosing.typeId));
    const proj=projects.find(p=>p.id===Number(newClosing.projectId));
    const comm=commTable.find(c=>c.typeId===Number(newClosing.typeId)&&c.projectId===Number(newClosing.projectId));
    setClosings(p=>[...p,{id:Date.now(),user:user.name,userId:user.id,partner:newClosing.partner,type:type?.name||"",typeId:Number(newClosing.typeId),project:proj?.name||"",projectId:Number(newClosing.projectId),value:comm?.value||0,date:now().slice(0,5),status:"pendente",pago:false}]);
    setNewClosing({partner:"",typeId:"",projectId:""});setShowNewClosing(false);
    pushNotif("Fechamento registrado",`${newClosing.partner} · aguardando aprovação`,T.warn);
  };

  const enviarContrato=(partnerId)=>{
    setBasePartners(prev=>prev.map(p=>p.id!==partnerId?p:{...p,contrato:{...p.contrato,status:"pendente",enviadoEm:new Date().toLocaleDateString("pt-BR")}}));
    addNotif("contrato","Contrato enviado","Aguardando assinatura do parceiro",null,T.warn,["sistema","email","whatsapp"]);
  };
  const assinarContrato=(partnerId)=>{
    const expira=new Date();
    expira.setFullYear(expira.getFullYear()+1);
    const assinadoEm=new Date().toLocaleDateString("pt-BR");
    const expiraEm=expira.toLocaleDateString("pt-BR");
    setBasePartners(prev=>prev.map(p=>{
      if(p.id!==partnerId)return p;
      const updated={...p,contrato:{status:"assinado",enviadoEm:p.contrato.enviadoEm,assinadoEm,expiraEm}};
      return{...updated,score:calcScore(updated)};
    }));
    setSelPartner(prev=>prev?{...prev,contrato:{...prev.contrato,status:"assinado",assinadoEm,expiraEm}}:null);
    addNotif("contrato","Contrato assinado!",basePartners.find(p=>p.id===partnerId)?.name+" assinou o contrato de exclusividade",null,T.accent,["sistema","email"]);
  };
  const addProspectToBase=(prosp)=>{
    const already=basePartners.find(p=>p.name===prosp.name);
    if(already){pushNotif("Já na base",`${prosp.name} já está cadastrado`,T.warn);return;}
    const newP={id:Date.now(),name:prosp.name,handle:`@${prosp.name.toLowerCase().replace(/\s/g,"_")}`,city:"-",state:"-",category:prosp.segment,deliveries:0,status:"prospectado",mesesNaBase:0,campanhas:0,engajamento:1,contrato:{status:"sem contrato",enviadoEm:null,assinadoEm:null,expiraEm:null}};
    const withScore={...newP,score:calcScore(newP)};
    setBasePartners(prev=>[...prev,withScore]);
    setProspects(prev=>prev.map(p=>p.id===prosp.id?{...p,stage:"fechado"}:p));
    pushNotif("Adicionado à base!",prosp.name,T.accent);
  };

  const addCommEntry=()=>{
    if(!newComm.typeId||!newComm.projectId||!newComm.value)return;
    const type=ptypes.find(t=>t.id===Number(newComm.typeId));
    const proj=projects.find(p=>p.id===Number(newComm.projectId));
    const exists=commTable.find(c=>c.typeId===Number(newComm.typeId)&&c.projectId===Number(newComm.projectId));
    if(exists)setCommTable(p=>p.map(c=>c.id===exists.id?{...c,value:Number(newComm.value)}:c));
    else setCommTable(p=>[...p,{id:Date.now(),typeId:Number(newComm.typeId),typeName:type.name,projectId:Number(newComm.projectId),projectName:proj.name,value:Number(newComm.value)}]);
    setNewComm({typeId:"",projectId:"",value:""});
  };

  const addUser=()=>{
    if(!newUser.name||!newUser.email)return;
    setUsers(p=>[...p,{id:Date.now(),...newUser,avatar:newUser.name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2),active:true,lastAccess:"nunca"}]);
    setNewUser({name:"",email:"",role:"base"});setShowNewUser(false);
  };

  // -- LOGIN ------------------------------------------------------------------
  if(!user)return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@400;500&display=swap');*{box-sizing:border-box;}input{outline:none;}input::placeholder{color:#2A2E45;}`}</style>
      <div style={{width:"100%",maxWidth:400,padding:24}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:36,fontWeight:800,color:T.accent,letterSpacing:-1}}>ECODELY</div>
          <div style={{fontSize:9,color:T.muted,letterSpacing:3,marginTop:4}}>SISTEMA DE GESTÃO</div>
        </div>
        <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:30}}>
          {[["E-mail","email","text"],["Senha","pass","password"]].map(([l,k,t])=>(
            <div key={k} style={{marginBottom:16}}>
              <div style={{fontSize:9,color:T.muted,marginBottom:6,letterSpacing:1.5,textTransform:"uppercase"}}>{l}</div>
              <input type={t} value={loginForm[k]} onChange={e=>setLoginForm(p=>({...p,[k]:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                placeholder={k==="email"?"seu@ecodely.com.br":"--------"}
                style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:"11px 14px",fontSize:13,color:T.text,fontFamily:"'JetBrains Mono',monospace",outline:"none"}}/>
            </div>
          ))}
          {loginErr&&<div style={{fontSize:11,color:T.danger,marginBottom:10}}>{loginErr}</div>}
          <button onClick={handleLogin} style={{width:"100%",padding:"13px",borderRadius:10,background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:14,border:"none",cursor:"pointer",marginTop:8}}>Entrar</button>
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
          <div style={{fontSize:11,fontWeight:700,color:T.text,fontFamily:"'Syne',sans-serif",marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            {touchDrag.type==="camp"?camps.find(c=>c.id===touchDrag.id)?.name:prospects.find(p=>p.id===touchDrag.id)?.name}
          </div>
          <div style={{fontSize:9,color:T.accent,fontFamily:"'JetBrains Mono',monospace"}}>
            {touchOverStage
              ?(touchDrag.type==="camp"?STAGES_CAMP.find(s=>s.id===Number(touchOverStage))?.label:PIPE_STAGES.find(s=>s.id===touchOverStage)?.label)||"Soltar aqui -"
              :"Arraste para uma coluna"}
          </div>
        </div>
      )}

      {/* MODAL */}
      {selCamp&&<CampModal camp={selCamp} user={user} allPartners={basePartners} onClose={()=>setSelCamp(null)} onToggleTask={toggleTask} onAddComment={addComment} onAddFile={addFile} onUpdateSacolas={updateSacolas} onUpdateImpactos={updateImpactos} onOpenClientPanel={(c)=>{setClientPanelCamp(c);setSelCamp(null);}}/>}

      {/* CLIENT PANEL */}
      {clientPanelCamp&&<ClientPanel camp={clientPanelCamp} allPartners={basePartners} onClose={()=>setClientPanelCamp(null)} onPDF={()=>setPdfCamp(clientPanelCamp)}/>}

      {/* PDF REPORT */}
      {pdfCamp&&<PDFReport camp={pdfCamp} onClose={()=>setPdfCamp(null)}/>}

      {/* PROSPECT MODAL */}
      {selProsp&&(
        <div style={{position:"fixed",inset:0,background:"#000000BB",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setSelProsp(null)}>
          <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,width:"100%",maxWidth:460,padding:24}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
              <div><div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,marginBottom:5}}>{selProsp.name}</div><div style={{display:"flex",gap:5}}><Badge label={selProsp.segment} color={T.purple}/><Badge label={PIPE_STAGES.find(s=>s.id===selProsp.stage)?.label||""} color={PIPE_STAGES.find(s=>s.id===selProsp.stage)?.color||T.muted}/></div></div>
              <div onClick={()=>setSelProsp(null)} style={{cursor:"pointer",color:T.muted,fontSize:20}}>×</div>
            </div>
            {[["Contato",selProsp.contact],["E-mail",selProsp.email||"-"],["Responsável",selProsp.owner],["Valor estimado",fmtK(selProsp.value||selProsp.ltv||0)]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${T.border}`}}>
                <span style={{fontSize:10,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>{l}</span>
                <span style={{fontSize:11}}>{v}</span>
              </div>
            ))}
            {selProsp.notes&&<div style={{marginTop:12,padding:"10px",background:T.card,borderRadius:8,fontSize:11,color:T.soft,fontStyle:"italic"}}>"{selProsp.notes}"</div>}
            {["negociacao","fechado"].includes(selProsp.stage)&&(
              <button className="btn" onClick={()=>{addProspectToBase(selProsp);setSelProsp(null);}} style={{width:"100%",marginTop:14,padding:"10px",background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",borderRadius:8,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12}}>- Adicionar à Base de Parceiros</button>
            )}
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div style={{width:210,background:T.surface,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"20px 16px 14px",borderBottom:`1px solid ${T.border}`}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:T.accent,letterSpacing:-0.5}}>ECODELY</div>
          <div style={{fontSize:8,color:T.muted,letterSpacing:2.5,marginTop:2,fontFamily:"'JetBrains Mono',monospace"}}>SISTEMA DE GESTÃO</div>
        </div>
        <div style={{flex:1,padding:"10px 8px",overflowY:"auto"}}>
          {nav.map(n=>(
            <div key={n.id} className="nb" onClick={()=>setTab(n.id)} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 10px",borderRadius:7,marginBottom:1,background:tab===n.id?T.accentDim:"transparent",border:`1px solid ${tab===n.id?T.accentBorder:"transparent"}`}}>
              <span style={{fontSize:12,color:tab===n.id?T.accent:T.muted,width:16,textAlign:"center"}}>{n.icon}</span>
              <span style={{fontSize:11,color:tab===n.id?T.text:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>{n.label}</span>
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
            <div onClick={()=>setUser(null)} style={{fontSize:13,color:T.muted,cursor:"pointer"}} title="Sair">-</div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{flex:1,overflow:"auto",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"13px 24px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:T.surface,flexShrink:0}}>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700}}>{nav.find(n=>n.id===tab)?.label||"Ecodely"}</div>
            <div style={{fontSize:9,color:T.muted,fontFamily:"'JetBrains Mono',monospace",marginTop:1}}>{new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            {pendingQueue.length>0&&tab!=="minha-fila"&&(
              <div onClick={()=>setTab("minha-fila")} style={{display:"flex",gap:8,alignItems:"center",padding:"7px 12px",background:T.dangerDim,border:`1px solid ${T.danger}44`,borderRadius:8,cursor:"pointer"}}>
                <div className="pulse" style={{width:6,height:6,borderRadius:"50%",background:T.danger}}/>
                <span style={{fontSize:10,color:T.danger,fontFamily:"'JetBrains Mono',monospace"}}>{pendingQueue.length} pendente{pendingQueue.length>1?"s":""}</span>
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
                <div style={{position:"absolute",top:42,right:0,width:340,background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,boxShadow:"0 8px 32px #00000060",zIndex:500,overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
                  <div style={{padding:"14px 16px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13}}>Notificacoes</div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <div onClick={()=>setInbox(p=>p.map(n=>({...n,read:true})))} style={{fontSize:9,color:T.accent,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace"}}>Marcar todas lidas</div>
                      <div onClick={()=>setInboxOpen(false)} style={{fontSize:14,color:T.muted,cursor:"pointer"}}>x</div>
                    </div>
                  </div>
                  <div style={{maxHeight:380,overflowY:"auto"}}>
                    {inbox.length===0?(
                      <div style={{padding:"32px",textAlign:"center",color:T.muted,fontSize:12}}>Nenhuma notificacao</div>
                    ):inbox.map((n,i)=>(
                      <div key={n.id} onClick={()=>setInbox(p=>p.map(x=>x.id===n.id?{...x,read:true}:x))}
                        style={{padding:"12px 16px",borderBottom:`1px solid ${T.border}`,background:n.read?"transparent":n.color+"08",cursor:"pointer",transition:"background 0.15s"}}>
                        <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                          <div style={{width:8,height:8,borderRadius:"50%",background:n.read?T.muted:n.color,marginTop:4,flexShrink:0}}/>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:3}}>
                              <div style={{fontSize:11,fontWeight:n.read?400:700,color:n.read?T.soft:T.text}}>{n.title}</div>
                              <div style={{fontSize:8,color:T.muted,fontFamily:"'JetBrains Mono',monospace",flexShrink:0}}>{n.at}</div>
                            </div>
                            <div style={{fontSize:10,color:T.muted,marginBottom:6,lineHeight:1.4}}>{n.msg}</div>
                            {n.campanha&&<div style={{fontSize:8,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>Campanha: {n.campanha}</div>}
                            <div style={{display:"flex",gap:5,marginTop:5}}>
                              {(n.via||["sistema"]).map(v=>(
                                <span key={v} style={{fontSize:7,padding:"1px 6px",borderRadius:4,background:v==="whatsapp"?"#25D36622":v==="email"?T.infoDim:T.accentDim,color:v==="whatsapp"?"#25D366":v==="email"?T.info:T.accent,border:`1px solid ${v==="whatsapp"?"#25D36633":v==="email"?T.info+"33":T.accentBorder}`}}>
                                  {v==="whatsapp"?"WhatsApp":v==="email"?"E-mail":"Sistema"}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{padding:"10px 16px",borderTop:`1px solid ${T.border}`,display:"flex",gap:8,justifyContent:"center"}}>
                    {["sistema","email","whatsapp"].map(canal=>(
                      <div key={canal} style={{display:"flex",gap:4,alignItems:"center"}}>
                        <div style={{width:6,height:6,borderRadius:"50%",background:canal==="whatsapp"?"#25D366":canal==="email"?T.info:T.accent}}/>
                        <span style={{fontSize:9,color:T.muted}}>{canal==="whatsapp"?"WhatsApp":canal==="email"?"E-mail":"Sistema"}</span>
                      </div>
                    ))}
                  </div>
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
            const myFat=CLIENT_BILLING.reduce((a,c)=>a+c.faturado,0);

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
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:14}}>Meu pipeline</div>
                    {PIPE_STAGES.map(stage=>{
                      const items=myProspects.filter(p=>p.stage===stage.id);
                      if(!items.length)return null;
                      return(<div key={stage.id} style={{marginBottom:12}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:10,color:stage.color}}>{stage.label}</span><span style={{fontSize:10,color:T.muted}}>{items.length} · {fmtK(items.reduce((a,p)=>a+(p.value||0),0))}</span></div>
                        {items.map(p=><div key={p.id} className="hr" onClick={()=>setSelProsp(p)} style={{padding:"6px 8px",borderRadius:7,display:"flex",justifyContent:"space-between",marginBottom:3}}>
                          <span style={{fontSize:11}}>{p.name}</span>
                          <span style={{fontSize:11,color:stage.color,fontFamily:"'Syne',sans-serif",fontWeight:700}}>{fmtK(p.value)}</span>
                        </div>)}
                      </div>);
                    })}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:12}}>
                    <div style={{background:T.card,border:`1px solid ${T.accentBorder}`,borderRadius:12,padding:16}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:T.accent,marginBottom:10}}>Meta do mês</div>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:26,color:T.accent,marginBottom:4}}>{fmtK(myPipeTotal)}</div>
                      <div style={{fontSize:9,color:T.muted,marginBottom:8}}>Meta: {fmtK(150000)}</div>
                      <PBar pct={(myPipeTotal/150000)*100} color={myPipeTotal>=150000?T.accent:T.info}/>
                      <div style={{fontSize:9,color:T.muted,marginTop:4}}>{Math.round((myPipeTotal/150000)*100)}% da meta</div>
                    </div>
                    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,marginBottom:10}}>Próximos follow-ups</div>
                      {myProspects.slice(0,3).map((p,i)=><div key={i} style={{padding:"6px 0",borderBottom:`1px solid ${T.border}`}}>
                        <div style={{fontSize:11,fontWeight:600}}>{p.name}</div>
                        <div style={{fontSize:9,color:T.muted}}>{p.segment} · {p.owner}</div>
                      </div>)}
                    </div>
                  </div>
                </div>
                <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:T.purple,marginBottom:10}}>Simulador de receita por campanha</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                    {[{l:"500 sacolas",v:fmtK(500*2.5)},{l:"5.000 sacolas",v:fmtK(5000*2.5)},{l:"20.000 sacolas",v:fmtK(20000*2.5)}].map((k,i)=>(
                      <div key={i} style={{background:T.surface,borderRadius:8,padding:"10px 12px",textAlign:"center"}}>
                        <div style={{fontSize:9,color:T.muted,marginBottom:4}}>{k.l}</div>
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:T.purple}}>{k.v}</div>
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
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Campanhas no ar</div>
                      {campsAtivas.map(c=>{
                        const imp=c.impactos||{};
                        const total=Math.round((c.sacolasDistribuidas||c.sacolas||0)*3.3)+(imp.stories||[]).reduce((a,s)=>a+Number(s.impressoes),0)+(imp.influencer||[]).reduce((a,s)=>a+Number(s.alcance),0)+(imp.impulsionado||[]).reduce((a,s)=>a+Number(s.alcance),0);
                        return(<div key={c.id} className="hr" onClick={()=>setSelCamp(c)} style={{padding:"8px 6px",borderRadius:8,marginBottom:4}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                            <div style={{fontSize:11,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>{c.name}</div>
                            <div style={{fontSize:10,color:T.accent,fontFamily:"'Syne',sans-serif",fontWeight:700}}>{total.toLocaleString()} impactos</div>
                          </div>
                          <PBar pct={c.progress} color={STAGES_CAMP.find(s=>s.id===c.stage)?.color||T.accent} h={4}/>
                        </div>);
                      })}
                    </div>
                    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:20}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Impactos por canal</div>
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
                          <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:k.c,fontSize:13}}>{k.v.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:T.pink,marginBottom:10}}>Redes sociais ativas</div>
                      {["Instagram","LinkedIn","TikTok","YouTube"].map((r,i)=>(
                        <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${T.border}`}}>
                          <span style={{fontSize:11}}>{r}</span>
                          <Badge label="Ativo" color={T.accent}/>
                        </div>
                      ))}
                    </div>
                    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:T.warn,marginBottom:10}}>Projetos em andamento</div>
                      {campsAtivas.map((c,i)=>(
                        <div key={i} style={{padding:"6px 0",borderBottom:`1px solid ${T.border}`}}>
                          <div style={{fontSize:11,fontWeight:600}}>{c.name}</div>
                          <div style={{fontSize:9,color:c.progress>=60?T.accent:T.warn}}>{c.progress>=60?"No prazo":"Atenção"} · {c.progress}%</div>
                        </div>
                      ))}
                    </div>
                    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:T.info,marginBottom:10}}>Minhas tarefas</div>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:32,color:pendingQueue.length>0?T.danger:T.accent,marginBottom:4}}>{pendingQueue.length}</div>
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
                  <KCard label="Faturado total" value={fmtK(myFat)} sub="no período" color={T.accent} icon="-" onClick={()=>{setTab("comercial");setCommTab("faturamento");}} hint="Ver faturamento -"/>
                  <KCard label="Contas a receber" value={fmtK(CLIENT_BILLING.reduce((a,c)=>a+c.pendente,0))} sub="NFs em aberto" color={T.warn} icon="-"/>
                  <KCard label="Contas a pagar" value={fmtK(closings.filter(c=>c.status==="aprovado"&&!c.pago).reduce((a,c)=>a+c.value,0))} sub="comissões aprovadas" color={T.danger} icon="-"/>
                  <KCard label="Pendente aprovação" value={closings.filter(c=>c.status==="pendente").length} sub="comissões" color={T.purple} icon="-" onClick={()=>setTab("comissoes")} hint="Aprovar -"/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:20}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Faturamento por cliente</div>
                    {CLIENT_BILLING.map((c,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                        <div><div style={{fontSize:11,fontWeight:600}}>{c.name}</div><div style={{fontSize:9,color:T.muted}}>{c.segment}</div></div>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:T.accent}}>{fmtK(c.faturado)}</div>
                          {c.pendente>0&&<div style={{fontSize:9,color:T.danger}}>+{fmtK(c.pendente)} pendente</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:12}}>
                    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,marginBottom:10}}>DRE simplificado - Mai/2025</div>
                      {[{l:"Receita bruta",v:myFat,c:T.accent},{l:"Despesas brutas",v:-closings.filter(c=>c.status==="aprovado").reduce((a,c)=>a+c.value,0),c:T.danger},{l:"Resultado líquido",v:myFat-closings.filter(c=>c.status==="aprovado").reduce((a,c)=>a+c.value,0),c:T.purple}].map((k,i)=>(
                        <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                          <span style={{fontSize:10,color:T.soft}}>{k.l}</span>
                          <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:k.c,fontSize:12}}>{k.v<0?"-":""}{fmtK(Math.abs(k.v))}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,marginBottom:10}}>Pagamento por fornecedor</div>
                      {SUPPLIERS.map((s,i)=>(
                        <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${T.border}`}}>
                          <span style={{fontSize:10}}>{s.name}</span>
                          <Badge label={s.type==="grafica"?"Gráfica":"Logística"} color={s.type==="grafica"?T.purple:T.warn}/>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,marginBottom:10}}>Fluxo de caixa projetado</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                    {[{l:"30 dias",v:fmtK(CLIENT_BILLING.reduce((a,c)=>a+c.pendente,0)),c:T.warn},{l:"60 dias",v:fmtK(58000),c:T.info},{l:"90 dias",v:fmtK(72000),c:T.accent}].map((k,i)=>(
                      <div key={i} style={{background:T.surface,borderRadius:8,padding:"12px",textAlign:"center"}}>
                        <div style={{fontSize:9,color:T.muted,marginBottom:4}}>{k.l}</div>
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:k.c}}>{k.v}</div>
                      </div>
                    ))}
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
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:g.color,marginBottom:12}}>{g.title}</div>
                        {g.camps.length===0?<div style={{fontSize:11,color:T.muted}}>Nenhuma campanha</div>:g.camps.map(c=>(
                          <div key={c.id} className="hr" onClick={()=>setSelCamp(c)} style={{padding:"8px 6px",borderRadius:8,marginBottom:6}}>
                            <div style={{fontSize:11,fontWeight:700,fontFamily:"'Syne',sans-serif",marginBottom:3}}>{c.name}</div>
                            <div style={{fontSize:9,color:T.muted,marginBottom:5}}>{c.graficaFornecedor||c.logisticaFornecedor||"Fornecedor não definido"}{(c.graficaPrazo||c.logisticaPrazo)&&` · Prazo: ${c.graficaPrazo||c.logisticaPrazo}`}</div>
                            <PBar pct={c.progress} color={g.color} h={4}/>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div style={{background:T.card,border:`1px solid ${T.warnDim}`,borderLeft:`3px solid ${T.warn}`,borderRadius:12,padding:16}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:T.warn,marginBottom:10}}>Prazos críticos</div>
                    {[{camp:"T4F - Maio 2025",prazo:"Gráfica: 08/05",dias:5,id:4},{camp:"O Boticário - Maio",prazo:"Logística: 02/05",dias:1,id:1}].map((a,i)=>(
                      <div key={i} onClick={()=>{const c=camps.find(x=>x.id===a.id);if(c)setSelCamp(c);}} className="hr" style={{padding:"6px 4px",borderRadius:6,cursor:"pointer",marginBottom:6}}>
                        <div style={{fontSize:11,fontWeight:600}}>{a.camp}</div>
                        <div style={{fontSize:9,color:T.warn}}>{a.prazo} · {a.dias}d restantes</div>
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
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Parceiros por campanha</div>
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
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:T.danger,marginBottom:10}}>Contratos expirando</div>
                        {basePartners.filter(p=>p.contrato.status==="expirando").map((p,i)=>(
                          <div key={i} style={{padding:"5px 0",borderBottom:`1px solid ${T.border}`}}>
                            <div style={{fontSize:11,fontWeight:600}}>{p.name}</div>
                            <div style={{fontSize:9,color:T.danger}}>Vence: {p.contrato.expiraEm}</div>
                          </div>
                        ))}
                        {basePartners.filter(p=>p.contrato.status==="expirando").length===0&&<div style={{fontSize:11,color:T.accent}}>Nenhum expirando</div>}
                      </div>
                      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16}}>
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,marginBottom:8}}>Minha fila</div>
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:28,color:pendingQueue.length>0?T.danger:T.accent}}>{pendingQueue.length}</div>
                        <div style={{fontSize:9,color:T.muted,marginBottom:8}}>tarefas pendentes</div>
                        <button onClick={()=>setTab("minha-fila")} className="btn" style={{width:"100%",padding:"7px",background:T.accentDim,border:`1px solid ${T.accentBorder}`,color:T.accent,borderRadius:7,fontSize:10}}>Ver fila -</button>
                      </div>
                    </div>
                  </div>
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,marginBottom:10}}>Ranking de parceiros</div>
                    <div style={{display:"flex",flexDirection:"column",gap:6}}>
                      {[...basePartners].sort((a,b)=>b.score-a.score).slice(0,5).map((p,i)=>(
                        <div key={i} style={{display:"flex",gap:12,alignItems:"center"}}>
                          <div style={{width:22,height:22,borderRadius:"50%",background:i<3?[T.warn+"33",T.soft+"22",T.soft+"15"][i]:T.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:T.soft,fontWeight:700,flexShrink:0}}>{i+1}</div>
                          <div style={{flex:1}}><div style={{fontSize:11,fontWeight:600}}>{p.name}</div><div style={{fontSize:9,color:T.muted}}>{p.category}</div></div>
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:p.score>80?T.accent:T.warn}}>{p.score}</div>
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
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14}}>Visão geral</div>
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
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:14}}>Campanhas em andamento</div>
                    {campsAtivas.map(c=>{const td=tasksDone(c.tasks);const s=STAGES_CAMP.find(x=>x.id===c.stage);return(
                      <div key={c.id} className="hr" onClick={()=>setSelCamp(c)} style={{padding:"10px 8px",borderRadius:8,marginBottom:4}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                          <div><div style={{fontSize:12,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>{c.name}</div><div style={{fontSize:9,color:T.muted}}>{c.region} · {c.project}</div></div>
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
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:14}}>Pendências por setor</div>
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
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:T.warn,marginBottom:10}}>Prazos próximos</div>
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
                {/* Receita mensal com valores */}
                <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13}}>Receita mensal</div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:T.accent}}>{fmtK(MONTHLY_DATA.reduce((a,d)=>a+d.receita,0))}</div>
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"flex-end",height:100}}>
                    {MONTHLY_DATA.map((d,i)=>{
                      const maxVal=Math.max(...MONTHLY_DATA.map(x=>x.receita),1);
                      const h=d.receita>0?Math.round((d.receita/maxVal)*75):4;
                      return(
                        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                          {d.receita>0&&<div style={{fontSize:7,color:T.accent,fontFamily:"'JetBrains Mono',monospace",whiteSpace:"nowrap"}}>{fmtK(d.receita)}</div>}
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
                  <div style={{fontSize:10,color:SEC_COLOR[sec]||T.accent,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>{ROLE_LABELS[user.role]} · Fila de hoje</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:28,color:SEC_COLOR[sec]||T.accent,marginBottom:2}}>{pendingQueue.length} tarefa{pendingQueue.length!==1?"s":""} pendente{pendingQueue.length!==1?"s":""}</div>
                  <div style={{fontSize:11,color:T.soft}}>{doneQueue.length} concluída{doneQueue.length!==1?"s":""} hoje · {myQueue.length} total</div>
                </div>
                <div style={{display:"flex",gap:16}}>
                  {[{l:"Pendentes",v:pendingQueue.length,c:pendingQueue.length>0?T.danger:T.accent},{l:"Concluídas",v:doneQueue.length,c:T.accent},{l:"Campanhas",v:new Set(myQueue.map(t=>t.campId)).size,c:T.info}].map((k,i)=>(
                    <div key={i} style={{textAlign:"center"}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:k.c}}>{k.v}</div>
                      <div style={{fontSize:9,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>{k.l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filters */}
              <div style={{display:"flex",gap:6,marginBottom:16,alignItems:"center",flexWrap:"wrap"}}>
                {[["todos","Todas"],["pendentes","Pendentes"],["concluidas","Concluídas"]].map(([v,l])=>(
                  <div key={v} onClick={()=>setQueueFilter(v)} className="tb" style={{padding:"6px 12px",borderRadius:6,fontSize:10,background:queueFilter===v?(SEC_COLOR[sec]||T.accent)+"22":T.card,border:`1px solid ${queueFilter===v?(SEC_COLOR[sec]||T.accent)+"55":T.border}`,color:queueFilter===v?SEC_COLOR[sec]||T.accent:T.muted}}>{l}</div>
                ))}
                <div style={{marginLeft:"auto",fontSize:10,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>{visibleQueue.length} tarefa{visibleQueue.length!==1?"s":""}</div>
              </div>

              {/* Queue items */}
              {visibleQueue.length===0?(
                <div style={{textAlign:"center",padding:"60px 20px",background:T.card,border:`1px solid ${T.border}`,borderRadius:12}}>
                  <div style={{fontSize:40,marginBottom:12}}>-</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:T.accent,marginBottom:6}}>Fila limpa!</div>
                  <div style={{fontSize:11,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>Todas as suas tarefas estão concluídas.</div>
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
                          <div style={{fontSize:13,fontWeight:700,fontFamily:"'Syne',sans-serif",textDecoration:t.done?"line-through":"none",color:t.done?T.muted:T.text,marginBottom:4}}>{t.label}</div>
                          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                            <Badge label={t.campName} color={campColor}/>
                            <Badge label={t.project} color={T.purple}/>
                          </div>
                          {t.done&&t.doneAt&&<div style={{fontSize:9,color:T.muted,marginTop:4,fontFamily:"'JetBrains Mono',monospace"}}>Concluído em {t.doneAt}</div>}
                        </div>
                        <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
                          {!t.done&&(
                            <button onClick={()=>toggleTask(t.campId,t.sector,t.id,user)} className="btn" style={{padding:"6px 14px",background:`linear-gradient(135deg,${SEC_COLOR[t.sector]||T.accent},${SEC_COLOR[t.sector]||T.accent}AA)`,color:"#000",borderRadius:7,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:10,whiteSpace:"nowrap"}}>
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
                  {[["kanban","Kanban"],["lista","Lista"]].map(([v,l])=>(
                    <div key={v} onClick={()=>setCampView(v)} className="tb" style={{padding:"6px 12px",borderRadius:6,fontSize:10,background:campView===v?T.accentDim:T.card,border:`1px solid ${campView===v?T.accentBorder:T.border}`,color:campView===v?T.accent:T.muted}}>{l}</div>
                  ))}
                </div>
                <button className="btn" style={{padding:"8px 16px",background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",borderRadius:8,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11}}>+ Nova Campanha</button>
              </div>

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
                        <span style={{fontSize:9,color:stage.color,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase"}}>{stage.label}</span>
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
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}>
                              <div style={{fontSize:9,color:T.purple,fontFamily:"'JetBrains Mono',monospace"}}>{c.project}</div>
                              <div style={{fontSize:9,color:T.muted,opacity:0.5}}>-</div>
                            </div>
                            <div style={{fontSize:11,fontWeight:700,fontFamily:"'Syne',sans-serif",marginBottom:3,lineHeight:1.3}}>{c.name}</div>
                            <div style={{fontSize:9,color:T.muted,marginBottom:7}}>{c.region}</div>
                            <PBar pct={c.progress} color={stage.color} h={4}/>
                            <div style={{display:"flex",justifyContent:"space-between",marginTop:5,gap:6}}>
                              <span style={{fontSize:8,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>{td.done}/{td.total} tarefas</span>
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
                      <div key={h} style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:1.5,fontFamily:"'JetBrains Mono',monospace"}}>{h}</div>
                    ))}
                  </div>
                  {camps.map(c=>{const s=STAGES_CAMP.find(x=>x.id===c.stage);const td=tasksDone(c.tasks);return(
                    <div key={c.id} className="hr" onClick={()=>setSelCamp(c)} style={{display:"grid",gridTemplateColumns:"2fr 0.8fr 1fr 1fr 0.8fr 0.7fr 0.6fr",padding:"12px 16px",borderBottom:`1px solid ${T.border}`,gap:8,alignItems:"center"}}>
                      <div><div style={{fontSize:12,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>{c.name}</div><div style={{fontSize:9,color:T.muted}}>{c.client}</div></div>
                      <Badge label={c.project} color={T.purple}/>
                      <div style={{fontSize:10,color:T.soft,fontFamily:"'JetBrains Mono',monospace"}}>{c.region}</div>
                      <Badge label={s.label} color={s.color}/>
                      <div><PBar pct={c.progress} color={s.color}/><div style={{fontSize:8,color:T.muted,marginTop:2}}>{c.progress}%</div></div>
                      <div style={{fontSize:10,color:td.done===td.total?T.accent:T.muted,fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>{td.done}/{td.total}</div>
                      <div style={{fontSize:10,color:T.purple}}>- {c.files.length}</div>
                    </div>
                  );})}
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
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,minWidth:180,textAlign:"center"}}>{MONTHS_PT[calMonth]} {calYear}</div>
                    <button onClick={nextMonth} className="btn" style={{width:32,height:32,background:T.card,border:`1px solid ${T.border}`,borderRadius:8,color:T.soft,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>{">"}</button>
                    <button onClick={()=>{setCalMonth(new Date().getMonth());setCalYear(new Date().getFullYear());}} className="btn" style={{padding:"6px 12px",background:T.accentDim,border:`1px solid ${T.accentBorder}`,borderRadius:7,fontSize:10,color:T.accent,fontFamily:"'JetBrains Mono',monospace"}}>Hoje</button>
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
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:k.c}}>{k.v}</div>
                      <div style={{fontSize:9,color:T.muted,marginTop:2,fontFamily:"'JetBrains Mono',monospace"}}>{k.l}</div>
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,overflow:"hidden",marginBottom:20}}>
                  {/* Day headers */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",borderBottom:`1px solid ${T.border}`}}>
                    {DAYS_PT.map(d=>(
                      <div key={d} style={{padding:"10px 0",textAlign:"center",fontSize:9,color:T.muted,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:1,background:T.surface}}>{d}</div>
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
                              <span style={{fontSize:11,fontWeight:isToday?800:400,color:isToday?"#000":T.soft,fontFamily:"'Syne',sans-serif"}}>{day}</span>
                            </div>
                            {dayCamps.length>2&&<span style={{fontSize:7,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>+{dayCamps.length-2}</span>}
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
                  <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.border}`,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13}}>Todas as campanhas</div>
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
                            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12}}>{c.name}</div>
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
                            <span style={{fontSize:9,padding:"3px 8px",borderRadius:5,background:stg?.color+"22",color:stg?.color,border:`1px solid ${stg?.color}44`,fontFamily:"'JetBrains Mono',monospace"}}>{stg?.label}</span>
                            <span style={{fontSize:9,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>{c.progress}%</span>
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
            // Computed values
            const mesLanc=lancamentos.filter(l=>l.data.endsWith(finMesRef.replace("/","/2026").slice(-7))||l.data.slice(3).startsWith(finMesRef.split("/").reverse().join("/")));
            const lancMes=lancamentos.filter(l=>{ const parts=l.data.split("/"); return parts[1]+"/"+parts[2]===finMesRef.split("/")[0]+"/"+finMesRef.split("/")[1]||l.data.slice(3,10)===finMesRef.split("/").reverse().join("/"); });
            // simpler: filter by MM/YYYY in data field
            const filterByMes=(arr)=>arr.filter(l=>{ const d=l.data; const mm=d.slice(3,5); const yy=d.slice(6,10); return mm+"/"+yy===finMesRef; });
            const lancMesFilt=filterByMes(lancamentos);
            const totalEntradas=lancMesFilt.reduce((a,l)=>a+l.entrada,0);
            const totalSaidas=lancMesFilt.reduce((a,l)=>a+l.saida,0);
            const lucroMes=totalEntradas-totalSaidas;
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
                {/* Sub-tabs */}
                <div style={{display:"flex",gap:0,marginBottom:20,borderBottom:`1px solid ${T.border}`,overflowX:"auto"}}>
                  {FIN_TABS.map(([id,l])=>(
                    <div key={id} onClick={()=>setFinTab(id)} style={{padding:"9px 16px",fontSize:11,cursor:"pointer",color:finTab===id?T.accent:T.muted,borderBottom:`2px solid ${finTab===id?T.accent:"transparent"}`,transition:"all 0.15s",whiteSpace:"nowrap"}}>{l}</div>
                  ))}
                </div>

                {/* MES SELECTOR */}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14}}>Referencia: {finMesRef}</div>
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
                {finTab==="visao"&&<VisaoGeralFin lancamentos={lancamentos} finMesRef={finMesRef} contas={contas} custosFix={custosFix} cartoes={cartoes} comprasCartao={comprasCartao} proximoMesCartao={proximoMesCartao} rbt12={rbt12} faixa={faixa} aliqDisplay={aliqDisplay} aliqVal={aliqVal}/>}

                {/* FLUXO DE CAIXA */}
                {finTab==="fluxo"&&(()=>{
                  const[showAdd,setShowAdd]=useState(false);
                  const[saving,setSaving]=useState(false);
                  const[obsEditing,setObsEditing]=useState(null); // id da linha com obs em edição
                  const LANC_EMPTY={data:"",descricao:"",entrada:0,saida:0,tipo:"Despesa",categoria:"Outros",centrosCusto:"Administrativo",forma:"PIX",projeto:"",contaBancoId:1,confirmado:false,obs:""};
                  const[novoLanc,setNovoLanc]=useState(LANC_EMPTY);
                  const inpStyle={width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,padding:"6px 8px",fontSize:11,color:T.text,outline:"none"};

                  // Ordenar e calcular saldo acumulado com seed anterior
                  const lancOrdenados=[...lancMesFilt].sort((a,b)=>{
                    const da=a.data.split("/").reverse().join(""); const db=b.data.split("/").reverse().join(""); return da-db;
                  });
                  // Saldo anterior = seed R$6,08 + todos lançamentos ANTES do mês selecionado
                  const SEED=6.08;
                  const [mesRefMM,mesRefYY]=finMesRef.split("/");
                  const saldoAnterior=SEED+lancamentos
                    .filter(l=>{ const mm=l.data.slice(3,5); const yy=l.data.slice(6,10); const before=yy<mesRefYY||(yy===mesRefYY&&mm<mesRefMM); return before; })
                    .reduce((a,l)=>a+l.entrada-l.saida,0);
                  let saldoAcum=saldoAnterior;
                  const lancComSaldo=lancOrdenados.map(l=>{ saldoAcum+=l.entrada-l.saida; return{...l,saldoAcum}; });

                  // Salvar novo lançamento no Supabase
                  const salvarNovoLanc=async()=>{
                    if(!novoLanc.data||!novoLanc.descricao)return;
                    setSaving(true);
                    const dateFmt=novoLanc.data.includes("-")?novoLanc.data.split("-").reverse().join("/"):novoLanc.data;
                    const payload={data:dateFmt,descricao:novoLanc.descricao,entrada:Number(novoLanc.entrada)||0,saida:Number(novoLanc.saida)||0,tipo:novoLanc.tipo,categoria:novoLanc.categoria,centrosCusto:novoLanc.centrosCusto,forma:novoLanc.forma,projeto:novoLanc.projeto,contaBancoId:Number(novoLanc.contaBancoId)||1,confirmado:false,obs:""};
                    const{data:inserted,error}=await supabase.from("lancamentos").insert([payload]).select().single();
                    if(!error&&inserted){
                      setLancamentos(p=>[...p,{...inserted,entrada:Number(inserted.entrada)||0,saida:Number(inserted.saida)||0,confirmado:!!inserted.confirmado,obs:inserted.obs||""}]);
                    } else {
                      // fallback local
                      setLancamentos(p=>[...p,{...payload,id:Date.now()}]);
                    }
                    setShowAdd(false); setNovoLanc(LANC_EMPTY); setSaving(false);
                  };

                  // Salvar edição no Supabase
                  const salvarEdicao=async()=>{
                    if(!editLanc)return;
                    setSaving(true);
                    const dateFmt=editLanc.data.includes("-")?editLanc.data.split("-").reverse().join("/"):editLanc.data;
                    const payload={data:dateFmt,descricao:editLanc.descricao,entrada:Number(editLanc.entrada)||0,saida:Number(editLanc.saida)||0,tipo:editLanc.tipo,categoria:editLanc.categoria,centrosCusto:editLanc.centrosCusto,forma:editLanc.forma,projeto:editLanc.projeto,contaBancoId:Number(editLanc.contaBancoId)||1,confirmado:!!editLanc.confirmado,obs:editLanc.obs||""};
                    const{error}=await supabase.from("lancamentos").update(payload).eq("id",editLanc.id);
                    if(!error){
                      setLancamentos(p=>p.map(l=>l.id===editLanc.id?{...l,...payload}:l));
                    }
                    setEditLanc(null); setSaving(false);
                  };

                  // Excluir lançamento no Supabase
                  const excluirLanc=async(id)=>{
                    const{error}=await supabase.from("lancamentos").delete().eq("id",id);
                    if(!error) setLancamentos(p=>p.filter(l=>l.id!==id));
                    setDeleteConfirm(null); setEditLanc(null);
                  };

                  // Toggle confirmado
                  const toggleConfirmado=async(l)=>{
                    const novoVal=!l.confirmado;
                    setLancamentos(p=>p.map(x=>x.id===l.id?{...x,confirmado:novoVal}:x));
                    await supabase.from("lancamentos").update({confirmado:novoVal}).eq("id",l.id);
                  };

                  // Salvar OBS inline
                  const salvarObs=async(l,valor)=>{
                    setLancamentos(p=>p.map(x=>x.id===l.id?{...x,obs:valor}:x));
                    await supabase.from("lancamentos").update({obs:valor}).eq("id",l.id);
                    setObsEditing(null);
                  };

                  const FormFields=({vals,setVals})=>(
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:8}}>
                      {[["data","Data","date"],["descricao","Descrição","text"],["projeto","Projeto/NF","text"]].map(([k,ph,tp])=>(
                        <div key={k}><div style={{fontSize:9,color:T.muted,marginBottom:3}}>{ph}</div>
                        <input type={tp} value={vals[k]||""} onChange={e=>setVals(p=>({...p,[k]:e.target.value}))} style={inpStyle}/></div>
                      ))}
                      {[["entrada","Entrada (R$)"],["saida","Saída (R$)"]].map(([k,ph])=>(
                        <div key={k}><div style={{fontSize:9,color:T.muted,marginBottom:3}}>{ph}</div>
                        <input type="number" value={vals[k]||""} onChange={e=>setVals(p=>({...p,[k]:Number(e.target.value)}))} style={inpStyle}/></div>
                      ))}
                      <div><div style={{fontSize:9,color:T.muted,marginBottom:3}}>Tipo</div>
                      <select value={vals.tipo||"Despesa"} onChange={e=>setVals(p=>({...p,tipo:e.target.value}))} style={inpStyle}><option>Receita</option><option>Despesa</option></select></div>
                      <div><div style={{fontSize:9,color:T.muted,marginBottom:3}}>Categoria</div>
                      <select value={vals.categoria||"Outros"} onChange={e=>setVals(p=>({...p,categoria:e.target.value}))} style={inpStyle}>{(vals.tipo==="Receita"?CAT_RECEITA:CAT_DESPESA).map(c=><option key={c}>{c}</option>)}</select></div>
                      <div><div style={{fontSize:9,color:T.muted,marginBottom:3}}>Centro de Custo</div>
                      <select value={vals.centrosCusto||""} onChange={e=>setVals(p=>({...p,centrosCusto:e.target.value}))} style={inpStyle}>{centrosCusto.map(c=><option key={c}>{c}</option>)}</select></div>
                      <div><div style={{fontSize:9,color:T.muted,marginBottom:3}}>Forma Pagamento</div>
                      <select value={vals.forma||"PIX"} onChange={e=>setVals(p=>({...p,forma:e.target.value}))} style={inpStyle}>{FORMAS_PAG.map(f=><option key={f}>{f}</option>)}</select></div>
                      <div><div style={{fontSize:9,color:T.muted,marginBottom:3}}>Conta</div>
                      <select value={vals.contaBancoId||1} onChange={e=>setVals(p=>({...p,contaBancoId:Number(e.target.value)}))} style={inpStyle}>{contas.map(c=><option key={c.id} value={c.id}>{c.banco}</option>)}</select></div>
                      <div style={{gridColumn:"1/-1"}}><div style={{fontSize:9,color:T.muted,marginBottom:3}}>OBS</div>
                      <input value={vals.obs||""} onChange={e=>setVals(p=>({...p,obs:e.target.value}))} placeholder="Observação..." style={inpStyle}/></div>
                    </div>
                  );

                  return(
                    <div>
                      {/* Modal de Edição */}
                      {editLanc&&(
                        <div style={{position:"fixed",inset:0,background:"#00000088",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={e=>{if(e.target===e.currentTarget)setEditLanc(null);}}>
                          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:24,width:"min(680px,95vw)",maxHeight:"90vh",overflowY:"auto"}} className="fade">
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:T.accent}}>Editar Lançamento #{editLanc.id}</div>
                              <button onClick={()=>setEditLanc(null)} style={{background:"none",border:"none",color:T.muted,fontSize:18,cursor:"pointer"}}>✕</button>
                            </div>
                            <FormFields vals={editLanc} setVals={setEditLanc}/>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12}}>
                              <button onClick={()=>setDeleteConfirm(editLanc.id)} style={{padding:"7px 14px",background:T.dangerDim,border:`1px solid ${T.danger}44`,color:T.danger,borderRadius:7,fontSize:10,fontWeight:700,cursor:"pointer"}}>🗑 Excluir</button>
                              <div style={{display:"flex",gap:8}}>
                                <button onClick={()=>setEditLanc(null)} style={{padding:"7px 14px",background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:7,fontSize:10,cursor:"pointer"}}>Cancelar</button>
                                <button onClick={salvarEdicao} disabled={saving} style={{padding:"7px 16px",background:T.accentDim,border:`1px solid ${T.accentBorder}`,color:T.accent,borderRadius:7,fontSize:10,fontWeight:700,cursor:"pointer"}}>{saving?"Salvando...":"✓ Salvar"}</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Modal de Confirmação Exclusão */}
                      {deleteConfirm&&(
                        <div style={{position:"fixed",inset:0,background:"#00000099",zIndex:1100,display:"flex",alignItems:"center",justifyContent:"center"}}>
                          <div style={{background:T.card,border:`1px solid ${T.danger}55`,borderRadius:12,padding:24,width:360,textAlign:"center"}} className="fade">
                            <div style={{fontSize:28,marginBottom:8}}>⚠️</div>
                            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,marginBottom:8}}>Excluir lançamento?</div>
                            <div style={{fontSize:11,color:T.muted,marginBottom:20}}>Esta ação não pode ser desfeita.</div>
                            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
                              <button onClick={()=>setDeleteConfirm(null)} style={{padding:"8px 18px",background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:7,fontSize:11,cursor:"pointer"}}>Cancelar</button>
                              <button onClick={()=>excluirLanc(deleteConfirm)} style={{padding:"8px 18px",background:T.dangerDim,border:`1px solid ${T.danger}`,color:T.danger,borderRadius:7,fontSize:11,fontWeight:700,cursor:"pointer"}}>Excluir</button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Summary bar */}
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:16}}>
                        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 14px"}}>
                          <div style={{fontSize:8,color:T.muted,marginBottom:3}}>SALDO ANTERIOR</div>
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:saldoAnterior>=0?T.info:T.danger}}>{fmt(saldoAnterior)}</div>
                        </div>
                        <div style={{background:T.card,border:`1px solid ${T.accent}33`,borderRadius:10,padding:"10px 14px"}}>
                          <div style={{fontSize:8,color:T.accent,marginBottom:3}}>ENTRADAS</div>
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:T.accent}}>{fmt(totalEntradas)}</div>
                        </div>
                        <div style={{background:T.card,border:`1px solid ${T.danger}33`,borderRadius:10,padding:"10px 14px"}}>
                          <div style={{fontSize:8,color:T.danger,marginBottom:3}}>SAÍDAS</div>
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:T.danger}}>{fmt(totalSaidas)}</div>
                        </div>
                        <div style={{background:T.card,border:`1px solid ${lucroMes>=0?T.accent:T.danger}33`,borderRadius:10,padding:"10px 14px"}}>
                          <div style={{fontSize:8,color:lucroMes>=0?T.accent:T.danger,marginBottom:3}}>RESULTADO</div>
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:lucroMes>=0?T.accent:T.danger}}>{fmt(lucroMes)}</div>
                        </div>
                      </div>

                      {/* Toolbar */}
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                        <div style={{fontSize:10,color:T.muted}}>{lancLoading?"Carregando...":lancError?`Erro: ${lancError}`:`${lancMesFilt.length} lançamentos`}</div>
                        <div style={{display:"flex",gap:8}}>
                          <button onClick={loadLancamentos} style={{padding:"7px 12px",background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:7,fontSize:10,cursor:"pointer"}}>↻ Atualizar</button>
                          <button onClick={()=>setShowAdd(p=>!p)} className="btn" style={{padding:"8px 16px",background:T.accentDim,border:`1px solid ${T.accentBorder}`,color:T.accent,borderRadius:8,fontSize:11,fontWeight:700}}>+ Novo Lançamento</button>
                        </div>
                      </div>

                      {/* Add form */}
                      {showAdd&&(
                        <div style={{background:T.card,border:`1px solid ${T.accentBorder}`,borderRadius:12,padding:16,marginBottom:16}}>
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:T.accent,marginBottom:12}}>Novo Lançamento</div>
                          <FormFields vals={novoLanc} setVals={setNovoLanc}/>
                          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                            <button onClick={()=>{setShowAdd(false);setNovoLanc(LANC_EMPTY);}} style={{padding:"7px 14px",background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:7,fontSize:10,cursor:"pointer"}}>Cancelar</button>
                            <button onClick={salvarNovoLanc} disabled={saving} style={{padding:"7px 14px",background:T.accentDim,border:`1px solid ${T.accentBorder}`,color:T.accent,borderRadius:7,fontSize:10,fontWeight:700,cursor:"pointer"}}>{saving?"Salvando...":"Salvar"}</button>
                          </div>
                        </div>
                      )}

                      {/* Tabela */}
                      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
                        {/* Header */}
                        <div style={{display:"grid",gridTemplateColumns:"70px 1fr 95px 95px 95px 32px 160px",background:T.surface,padding:"8px 14px",gap:6,borderBottom:`1px solid ${T.border}`}}>
                          {["DATA","DESCRIÇÃO","ENTRADA","SAÍDA","SALDO","✓","OBS"].map(h=><div key={h} style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:1}}>{h}</div>)}
                        </div>
                        {/* Linha saldo anterior */}
                        <div style={{display:"grid",gridTemplateColumns:"70px 1fr 95px 95px 95px 32px 160px",padding:"7px 14px",gap:6,background:T.surface+"88",borderBottom:`1px solid ${T.border}`}}>
                          <div style={{fontSize:9,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>—</div>
                          <div style={{fontSize:9,color:T.muted,fontStyle:"italic"}}>Saldo Anterior</div>
                          <div/><div/>
                          <div style={{fontSize:10,color:saldoAnterior>=0?T.info:T.danger,fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>{fmt(saldoAnterior)}</div>
                          <div/><div/>
                        </div>
                        {lancLoading&&<div style={{padding:24,textAlign:"center",color:T.muted,fontSize:11}}>Carregando lançamentos...</div>}
                        {!lancLoading&&lancComSaldo.length===0&&<div style={{padding:24,textAlign:"center",color:T.muted,fontSize:11}}>Nenhum lançamento em {finMesRef}</div>}
                        {!lancLoading&&lancComSaldo.map((l,i)=>(
                          <div key={l.id} style={{display:"grid",gridTemplateColumns:"70px 1fr 95px 95px 95px 32px 160px",padding:"8px 14px",gap:6,borderBottom:`1px solid ${T.border}`,background:l.confirmado?T.accentDim:i%2===0?"transparent":T.surface+"44",cursor:"pointer",transition:"background 0.1s"}}
                            onMouseEnter={e=>e.currentTarget.style.background=T.surface}
                            onMouseLeave={e=>e.currentTarget.style.background=l.confirmado?T.accentDim:i%2===0?"transparent":T.surface+"44"}>
                            {/* DATA */}
                            <div onClick={()=>setEditLanc({...l,data:l.data})} style={{fontSize:10,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>{l.data?l.data.slice(0,5):""}</div>
                            {/* DESCRIÇÃO */}
                            <div onClick={()=>setEditLanc({...l,data:l.data})}>
                              <div style={{fontSize:11,fontWeight:500}}>{l.descricao}</div>
                              <div style={{display:"flex",gap:4,marginTop:2,flexWrap:"wrap"}}>
                                <span style={{fontSize:7,padding:"1px 5px",borderRadius:3,background:l.tipo==="Receita"?T.accentDim:T.dangerDim,color:l.tipo==="Receita"?T.accent:T.danger}}>{l.categoria}</span>
                                <span style={{fontSize:7,color:T.muted}}>{l.centrosCusto}</span>
                                {l.forma&&<span style={{fontSize:7,color:T.muted}}>{l.forma}</span>}
                                {l.projeto&&<span style={{fontSize:7,color:T.info}}>{l.projeto}</span>}
                              </div>
                            </div>
                            {/* ENTRADA */}
                            <div onClick={()=>setEditLanc({...l,data:l.data})} style={{fontSize:11,color:T.accent,fontFamily:"'JetBrains Mono',monospace",fontWeight:l.entrada>0?700:400}}>{l.entrada>0?fmt(l.entrada):"—"}</div>
                            {/* SAÍDA */}
                            <div onClick={()=>setEditLanc({...l,data:l.data})} style={{fontSize:11,color:T.danger,fontFamily:"'JetBrains Mono',monospace",fontWeight:l.saida>0?700:400}}>{l.saida>0?fmt(l.saida):"—"}</div>
                            {/* SALDO */}
                            <div onClick={()=>setEditLanc({...l,data:l.data})} style={{fontSize:11,color:l.saldoAcum>=0?T.accent:T.danger,fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>{fmt(l.saldoAcum)}</div>
                            {/* CONFIRMADO */}
                            <div onClick={e=>{e.stopPropagation();toggleConfirmado(l);}} style={{display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                              <div style={{width:18,height:18,borderRadius:4,border:`2px solid ${l.confirmado?T.accent:T.border}`,background:l.confirmado?T.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#000",fontWeight:900,transition:"all 0.15s"}}>
                                {l.confirmado?"✓":""}
                              </div>
                            </div>
                            {/* OBS */}
                            <div onClick={e=>e.stopPropagation()} style={{fontSize:10}}>
                              {obsEditing===l.id?(
                                <input autoFocus defaultValue={l.obs||""} onBlur={e=>salvarObs(l,e.target.value)} onKeyDown={e=>{if(e.key==="Enter")salvarObs(l,e.target.value);if(e.key==="Escape")setObsEditing(null);}}
                                  style={{width:"100%",background:T.surface,border:`1px solid ${T.accentBorder}`,borderRadius:4,padding:"3px 6px",fontSize:10,color:T.text,outline:"none"}}/>
                              ):(
                                <div onClick={()=>setObsEditing(l.id)} style={{color:l.obs?T.soft:T.border,fontStyle:l.obs?"normal":"italic",cursor:"text",padding:"2px 4px",borderRadius:4,border:"1px solid transparent",minHeight:20}}
                                  title="Clique para editar">
                                  {l.obs||"—"}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {/* Footer totais */}
                        <div style={{display:"grid",gridTemplateColumns:"70px 1fr 95px 95px 95px 32px 160px",padding:"10px 14px",gap:6,background:T.surface,borderTop:`2px solid ${T.border}`}}>
                          <div style={{fontSize:9,color:T.muted,gridColumn:"1/3",fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>TOTAL DO MÊS</div>
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:12,color:T.accent}}>{fmt(totalEntradas)}</div>
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:12,color:T.danger}}>{fmt(totalSaidas)}</div>
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:12,color:lucroMes>=0?T.accent:T.danger}}>{fmt(saldoAcum)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* CARTOES */}
                {finTab==="cartoes"&&(()=>{
                  const[showAddCartao,setShowAddCartao]=useState(false);
                  const[showAddCompra,setShowAddCompra]=useState(false);
                  const[novoCartao,setNovoCartao]=useState({nome:"",titular:"",vencimento:15,limite:0,banco:"",cor:"#3D9EFF"});
                  const[novaCompra,setNovaCompra]=useState({cartaoId:1,projeto:"",descricao:"",valorTotal:0,parcelas:2,parcelaAtual:1,mesInicio:finMesRef});
                  return(
                    <div>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14}}>Controle de Cartoes</div>
                        <div style={{display:"flex",gap:8}}>
                          <button onClick={()=>setShowAddCompra(p=>!p)} className="btn" style={{padding:"7px 14px",background:T.warnDim,border:`1px solid ${T.warn}44`,color:T.warn,borderRadius:8,fontSize:10,fontWeight:700}}>+ Compra Parcelada</button>
                          <button onClick={()=>setShowAddCartao(p=>!p)} className="btn" style={{padding:"7px 14px",background:T.accentDim,border:`1px solid ${T.accentBorder}`,color:T.accent,borderRadius:8,fontSize:10,fontWeight:700}}>+ Novo Cartao</button>
                        </div>
                      </div>
                      {/* Add cartao form */}
                      {showAddCartao&&(
                        <div style={{background:T.card,border:`1px solid ${T.accentBorder}`,borderRadius:12,padding:14,marginBottom:14}}>
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:T.accent,marginBottom:10}}>Novo Cartao</div>
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
                            <button onClick={()=>{if(!novoCartao.nome)return;setCartoes(p=>[...p,{...novoCartao,id:Date.now()}]);setShowAddCartao(false);}} className="btn" style={{padding:"6px 12px",background:T.accentDim,border:`1px solid ${T.accentBorder}`,color:T.accent,borderRadius:7,fontSize:10,fontWeight:700}}>Salvar</button>
                          </div>
                        </div>
                      )}
                      {/* Add compra form */}
                      {showAddCompra&&(
                        <div style={{background:T.card,border:`1px solid ${T.warn}44`,borderRadius:12,padding:14,marginBottom:14}}>
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:T.warn,marginBottom:10}}>Nova Compra Parcelada</div>
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
                            <button onClick={()=>{if(!novaCompra.projeto||!novaCompra.valorTotal)return;setComprasCartao(p=>[...p,{...novaCompra,id:Date.now(),valorParcela:novaCompra.valorTotal/novaCompra.parcelas}]);setShowAddCompra(false);}} className="btn" style={{padding:"6px 12px",background:T.warnDim,border:`1px solid ${T.warn}44`,color:T.warn,borderRadius:7,fontSize:10,fontWeight:700}}>Salvar</button>
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
                                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:c.cor}}>{c.nome}</div>
                                  <div style={{fontSize:9,color:T.muted,marginTop:2}}>{c.titular} - Vencimento dia {c.vencimento} - {c.banco}</div>
                                </div>
                                <div style={{textAlign:"right"}}>
                                  <div style={{fontSize:9,color:T.muted}}>Limite</div>
                                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:c.cor}}>{fmt(c.limite)}</div>
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
                                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:T.danger}}>{fmt(totalDevedor)}</div>
                                </div>
                                <div style={{background:T.surface,borderRadius:8,padding:"8px 10px"}}>
                                  <div style={{fontSize:8,color:T.muted,marginBottom:2}}>Parcela do mes</div>
                                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:T.warn}}>{fmt(parcelaMes)}</div>
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
                                      <div style={{fontSize:10,color:T.warn,fontFamily:"'JetBrains Mono',monospace"}}>{fmt(cp.valorParcela*(cp.parcelas-cp.parcelaAtual+1))}</div>
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
                  const[nfValor,setNfValor]=useState("");
                  const[dasManual,setDasManual]=useState(aliqDisplay);
                  const dasCalcNf=Number(nfValor)*(Number(dasManual)/100);
                  return(
                    <div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
                        {/* RBT12 */}
                        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:20}}>
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:14}}>Faturamento dos ultimos 12 meses (RBT12)</div>
                          <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:280,overflowY:"auto",marginBottom:12}}>
                            {fatMensais.map((f,i)=>(
                              <div key={i} style={{display:"flex",gap:8,alignItems:"center"}}>
                                <span style={{fontSize:9,color:T.muted,width:60,flexShrink:0}}>{f.mes}</span>
                                <input type="number" value={f.fat} onChange={e=>setFatMensais(p=>p.map((x,j)=>j===i?{...x,fat:Number(e.target.value)}:x))} style={{flex:1,background:T.surface,border:`1px solid ${T.border}`,borderRadius:5,padding:"4px 8px",fontSize:11,color:T.text,outline:"none"}}/>
                                <span style={{fontSize:9,color:T.accent,fontFamily:"'JetBrains Mono',monospace",width:80,textAlign:"right",flexShrink:0}}>{fmt(f.fat)}</span>
                              </div>
                            ))}
                          </div>
                          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderTop:`1px solid ${T.border}`}}>
                            <span style={{fontWeight:700,fontSize:11}}>RBT12 Total</span>
                            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:T.accent}}>{fmt(rbt12)}</span>
                          </div>
                        </div>
                        {/* Simples */}
                        <div style={{display:"flex",flexDirection:"column",gap:12}}>
                          <div style={{background:T.card,border:`1px solid ${T.accentBorder}`,borderRadius:12,padding:18}}>
                            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:10}}>Faixa atual - Simples Nacional Anexo III</div>
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
                            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:10}}>Aliquota efetiva calculada</div>
                            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:32,color:T.accent,marginBottom:4}}>{aliqDisplay}%</div>
                            <div style={{fontSize:9,color:T.muted,marginBottom:12}}>{faixa.label} - ({fmt(rbt12)} x {(faixa.aliquota*100).toFixed(1)}% - {fmt(faixa.deducao)}) / {fmt(rbt12)}</div>
                            <div style={{fontSize:10,color:T.warn,marginBottom:6}}>Ajuste manual (se contador informar diferente):</div>
                            <div style={{display:"flex",gap:8,alignItems:"center"}}>
                              <input type="number" step="0.01" value={dasManual} onChange={e=>{setDasManual(e.target.value);setDasAjuste(Number(e.target.value));}} style={{flex:1,background:T.surface,border:`1px solid ${T.warn}44`,borderRadius:6,padding:"6px 8px",fontSize:13,color:T.text,outline:"none",fontWeight:700}}/>
                              <span style={{fontSize:11,color:T.muted}}>%</span>
                              <button onClick={()=>{setDasAjuste(null);setDasManual(aliquotaEfetiva.toFixed(4)*100+"");}} className="btn" style={{padding:"6px 10px",background:"transparent",border:`1px solid ${T.border}`,color:T.muted,borderRadius:6,fontSize:9}}>Resetar</button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* DAS calculator */}
                      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18,marginBottom:14}}>
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Calculadora DAS</div>
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
                            <div style={{background:dasCalcNf>0?T.accentDim:T.surface,border:`1px solid ${T.accentBorder}`,borderRadius:7,padding:"8px 12px",fontSize:18,color:T.accent,fontWeight:800,fontFamily:"'Syne',sans-serif"}}>{fmt(dasCalcNf)}</div>
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
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:14}}>Resultado de {finMesRef}</div>
                        {[{l:"Total entradas",v:totalEntradas,c:T.accent},{l:"Total saidas",v:totalSaidas,c:T.danger},{l:"Resultado bruto",v:lucroMes,c:lucroMes>=0?T.accent:T.danger}].map((k,i)=>(
                          <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                            <span style={{fontSize:11,color:T.soft}}>{k.l}</span>
                            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:k.c}}>{fmt(k.v)}</span>
                          </div>
                        ))}
                        <div style={{marginTop:14}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                            <span style={{fontSize:11,color:T.warn}}>Reserva de caixa</span>
                            <div style={{display:"flex",gap:6,alignItems:"center"}}>
                              <input type="number" min="0" max="100" value={reservaCaixaPct} onChange={e=>setReservaCaixaPct(Number(e.target.value))} style={{width:50,background:T.surface,border:`1px solid ${T.warn}44`,borderRadius:5,padding:"3px 6px",fontSize:12,color:T.text,outline:"none",textAlign:"center"}}/>
                              <span style={{fontSize:11,color:T.muted}}>%</span>
                              <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:T.warn,fontSize:13}}>{fmt(reserva)}</span>
                            </div>
                          </div>
                          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderTop:`1px solid ${T.border}`}}>
                            <span style={{fontWeight:700,fontSize:12}}>Para distribuir</span>
                            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:T.accent}}>{fmt(paraDividir)}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18}}>
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:14}}>Distribuicao por socio</div>
                        {socios.map((s,i)=>{
                          const valor=paraDividir*(s.pct/100);
                          return(
                            <div key={s.id} style={{background:T.surface,borderRadius:10,padding:14,marginBottom:10}}>
                              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                                <span style={{fontWeight:700,fontSize:12}}>{s.nome}</span>
                                <div style={{display:"flex",gap:5,alignItems:"center"}}>
                                  <input type="number" min="0" max="100" value={s.pct} onChange={e=>setSocios(p=>p.map((x,j)=>j===i?{...x,pct:Number(e.target.value)}:x))} style={{width:45,background:T.card,border:`1px solid ${T.border}`,borderRadius:5,padding:"2px 5px",fontSize:11,color:T.text,outline:"none",textAlign:"center"}}/>
                                  <span style={{fontSize:10,color:T.muted}}>%</span>
                                </div>
                              </div>
                              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:28,color:T.accent}}>{fmt(valor)}</div>
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
                  const[showAddFixo,setShowAddFixo]=useState(false);
                  const[showAddConta,setShowAddConta]=useState(false);
                  const[showAddCentro,setShowAddCentro]=useState(false);
                  const[novoCusto,setNovoCusto]=useState({descricao:"",valor:0,dia:5,categoria:"Outros",centrosCusto:"Administrativo",ativo:true});
                  const[novaConta,setNovaConta]=useState({banco:"",tipo:"Conta Corrente",agencia:"",conta:"",saldo:0,cor:"#00E5A0"});
                  const[novoCentro,setNovoCentro]=useState("");
                  return(
                    <div>
                      {/* Custos fixos */}
                      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18,marginBottom:14}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13}}>Custos Fixos Mensais</div>
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
                              <button onClick={()=>{if(!novoCusto.descricao)return;setCustosFix(p=>[...p,{...novoCusto,id:Date.now()}]);setShowAddFixo(false);}} className="btn" style={{padding:"5px 10px",background:T.accentDim,border:`1px solid ${T.accentBorder}`,color:T.accent,borderRadius:6,fontSize:9,fontWeight:700}}>Salvar</button>
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
                            <span style={{fontSize:11,color:T.danger,fontFamily:"'JetBrains Mono',monospace"}}>{fmt(c.valor)}</span>
                            <Badge label={c.ativo?"Ativo":"Inativo"} color={c.ativo?T.accent:T.muted}/>
                            <div onClick={()=>setCustosFix(p=>p.map(x=>x.id===c.id?{...x,ativo:!x.ativo}:x))} style={{fontSize:9,color:T.muted,cursor:"pointer",textAlign:"center"}}>Toggle</div>
                          </div>
                        ))}
                      </div>
                      {/* Contas bancarias */}
                      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18,marginBottom:14}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13}}>Contas Bancarias</div>
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
                              <button onClick={()=>{if(!novaConta.banco)return;setContas(p=>[...p,{...novaConta,id:Date.now()}]);setShowAddConta(false);}} className="btn" style={{padding:"5px 10px",background:T.infoDim,border:`1px solid ${T.info}44`,color:T.info,borderRadius:6,fontSize:9,fontWeight:700}}>Salvar</button>
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
                              <input type="number" value={c.saldo} onChange={e=>setContas(p=>p.map(x=>x.id===c.id?{...x,saldo:Number(e.target.value)}:x))} style={{width:100,background:T.surface,border:`1px solid ${T.border}`,borderRadius:5,padding:"4px 7px",fontSize:11,color:T.text,outline:"none",textAlign:"right"}}/>
                              <div onClick={()=>setContas(p=>p.filter(x=>x.id!==c.id))} style={{fontSize:9,color:T.danger,cursor:"pointer"}}>x</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Centros de custo */}
                      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13}}>Centros de Custo</div>
                        </div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10}}>
                          {centrosCusto.map(c=>(
                            <div key={c} style={{display:"flex",gap:5,alignItems:"center",padding:"5px 12px",background:T.surface,border:`1px solid ${T.border}`,borderRadius:20}}>
                              <span style={{fontSize:11}}>{c}</span>
                              <div onClick={()=>setCentrosCusto(p=>p.filter(x=>x!==c))} style={{fontSize:9,color:T.danger,cursor:"pointer",marginLeft:4}}>x</div>
                            </div>
                          ))}
                        </div>
                        <div style={{display:"flex",gap:8}}>
                          <input value={novoCentro} onChange={e=>setNovoCentro(e.target.value)} placeholder="Novo centro de custo..." style={{flex:1,background:T.surface,border:`1px solid ${T.border}`,borderRadius:7,padding:"7px 10px",fontSize:11,color:T.text,outline:"none"}}/>
                          <button onClick={()=>{if(!novoCentro.trim())return;setCentrosCusto(p=>[...p,novoCentro.trim()]);setNovoCentro("");}} className="btn" style={{padding:"7px 14px",background:T.accentDim,border:`1px solid ${T.accentBorder}`,color:T.accent,borderRadius:7,fontSize:10,fontWeight:700}}>+ Adicionar</button>
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
                {[["pipeline","Pipeline"],...(["admin","financeiro"].includes(user.role)?[["faturamento","Faturamento"]]:[[]]),...(["admin","comercial","financeiro"].includes(user.role)?[["clientes","Clientes"]]:[[]])].map(([id,l])=>(
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
                    <button className="btn" onClick={()=>setShowNewProsp(true)} style={{marginLeft:"auto",padding:"7px 14px",background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",borderRadius:7,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:10}}>+ Prospect</button>
                  </div>
                  {showNewProsp&&(
                    <div style={{background:T.card,border:`1px solid ${T.accentBorder}`,borderRadius:12,padding:18,marginBottom:14}} className="fade">
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:T.accent,marginBottom:12}}>+ Novo Prospect</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}>
                        {[["Empresa","name","text"],["Contato","contact","text"],["E-mail","email","email"],["Valor Est.","value","number"]].map(([l,k,t])=>(
                          <div key={k}><div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:1}}>{l}</div>
                          <input type={t} value={newProsp[k]} onChange={e=>setNewProsp(p=>({...p,[k]:e.target.value}))} style={inpS}/></div>
                        ))}
                        <div><div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:1}}>Etapa</div>
                        <select value={newProsp.stage} onChange={e=>setNewProsp(p=>({...p,stage:e.target.value}))} style={selS}>{PIPE_STAGES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></div>
                        <div><div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:1}}>Responsável</div>
                        <select value={newProsp.owner} onChange={e=>setNewProsp(p=>({...p,owner:e.target.value}))} style={selS}><option>Rodrigo Bem</option><option>Ana Lima</option></select></div>
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <button className="btn" onClick={addProsp} style={{padding:"8px 16px",background:T.accent,color:"#000",borderRadius:7,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11}}>Salvar</button>
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
                              <span style={{fontSize:9,color:stage.color,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase"}}>{stage.label}</span>
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
                                    <div style={{fontSize:11,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>{p.name}</div>
                                    <div style={{fontSize:9,color:T.muted,opacity:0.5}}>-</div>
                                  </div>
                                  <div style={{fontSize:10,fontWeight:700,color:stage.color,fontFamily:"'Syne',sans-serif",marginBottom:3}}>{fmtK(p.value)}</div>
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
                          <div><div style={{fontSize:12,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>{p.name}</div><div style={{fontSize:9,color:T.muted}}>{p.email}</div></div>
                          <Badge label={p.segment} color={T.purple}/>
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:s.color}}>{fmtK(p.value)}</div>
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
                      <div key={l}><div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:1}}>{l}</div>
                      <input type="month" value={val} onChange={e=>fn(e.target.value)} style={{...inpS,width:"auto"}}/></div>
                    ))}
                    <div><div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:1}}>Segmento</div>
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
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Receita mensal</div>
                      <div style={{display:"flex",gap:3,alignItems:"flex-end",height:110}}>
                        {MONTHLY_DATA.map((d,i)=>(
                          <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                            {d.receita>0&&<div style={{fontSize:7,color:T.soft,fontFamily:"'JetBrains Mono',monospace"}}>{fmtK(d.receita)}</div>}
                            <div style={{width:"65%",background:d.receita>0?`linear-gradient(180deg,${T.accent},${T.accent}88)`:T.border,borderRadius:"3px 3px 0 0",height:`${d.receita>0?(d.receita/42100)*80:6}px`,transition:"height 0.4s"}}/>
                            <div style={{width:"65%",height:3,background:T.warn+"55",borderRadius:"0 0 2px 2px"}}/>
                            <div style={{fontSize:7,color:T.muted,fontFamily:"'JetBrains Mono',monospace",whiteSpace:"nowrap"}}>{d.month}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:14}}>Por vendedor</div>
                      {USER_BILLING.map((u,i)=>(
                        <div key={i} style={{marginBottom:16}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                            <div style={{display:"flex",gap:8,alignItems:"center"}}>
                              <div style={{width:26,height:26,borderRadius:"50%",background:u.color+"22",border:`1px solid ${u.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:u.color,fontWeight:700}}>{u.avatar}</div>
                              <div style={{fontSize:11,fontFamily:"'Syne',sans-serif",fontWeight:700}}>{u.user}</div>
                            </div>
                            <div style={{textAlign:"right"}}>
                              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:14,color:u.color}}>{fmtK(u.faturado)}</div>
                              <div style={{fontSize:8,color:u.faturado>=u.meta?T.accent:T.muted}}>{u.faturado>=u.meta?"- Meta":"falta "+fmtK(u.meta-u.faturado)}</div>
                            </div>
                          </div>
                          <PBar pct={(u.faturado/u.meta)*100} color={u.faturado>=u.meta?T.accent:u.color}/>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
                    <div style={{padding:"12px 18px",borderBottom:`1px solid ${T.border}`,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13}}>Faturamento por cliente</div>
                    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 0.8fr 1fr 1fr 1fr",padding:"10px 18px",borderBottom:`1px solid ${T.border}`,gap:8}}>
                      {["Cliente","Segmento","Camps.","Faturado","Pendente","Última"].map(h=><div key={h} style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:1.5}}>{h}</div>)}
                    </div>
                    {(filterSeg==="todos"?CLIENT_BILLING:CLIENT_BILLING.filter(c=>c.segment===filterSeg)).map((c,i)=>(
                      <div key={i} className="hr" style={{display:"grid",gridTemplateColumns:"2fr 1fr 0.8fr 1fr 1fr 1fr",padding:"12px 18px",borderBottom:`1px solid ${T.border}`,gap:8,alignItems:"center"}}>
                        <div style={{fontSize:12,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>{c.name}</div>
                        <Badge label={c.segment} color={T.purple}/>
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:T.info}}>{c.campanhas}</div>
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:T.accent}}>{fmtK(c.faturado)}</div>
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:c.pendente>0?T.danger:T.muted}}>{c.pendente>0?fmtK(c.pendente):"-"}</div>
                        <div style={{fontSize:10,color:T.soft}}>{c.ultima}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {commTab==="clientes"&&(
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Clientes Ativos</div>
                    {CLIENTS_LIST.map((c,i)=>(
                      <div key={i} className="hr" style={{padding:"10px 8px",borderRadius:8,display:"flex",gap:12,alignItems:"center",marginBottom:4}}>
                        <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>{c.name}</div><div style={{fontSize:9,color:T.muted}}>{c.segment} · {c.owner}</div></div>
                        <div style={{textAlign:"right"}}><div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:13,color:T.accent}}>{fmtK(c.ltv)}</div><div style={{fontSize:9,color:T.muted}}>{c.campaigns} camps.</div></div>
                      </div>
                    ))}
                  </div>
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Prospects</div>
                    {prospects.map((p,i)=>{const s=PIPE_STAGES.find(x=>x.id===p.stage);return(
                      <div key={i} className="hr" onClick={()=>setSelProsp(p)} style={{padding:"10px 8px",borderRadius:8,display:"flex",gap:12,alignItems:"center",marginBottom:4}}>
                        <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>{p.name}</div><div style={{fontSize:9,color:T.muted}}>{p.segment}</div></div>
                        <div style={{display:"flex",gap:6,alignItems:"center"}}><Badge label={s.label} color={s.color}/><div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:s.color}}>{fmtK(p.value)}</div></div>
                      </div>
                    );})}
                  </div>
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
                      {["Victoria","Priscila"].map((name,i)=>{
                        const uc=closings.filter(c=>c.user===name);
                        const uA=uc.filter(c=>c.status==="aprovado").reduce((a,c)=>a+c.value,0);
                        const uP=uc.filter(c=>c.pago).reduce((a,c)=>a+c.value,0);
                        const colors=[T.accent,T.purple];const avs=["MC","CM"];
                        return(
                          <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16,marginBottom:10,display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
                            <div style={{width:34,height:34,borderRadius:"50%",background:colors[i]+"22",border:`1px solid ${colors[i]}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:colors[i],fontWeight:700,flexShrink:0}}>{avs[i]}</div>
                            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>{name}</div><div style={{fontSize:9,color:T.muted}}>{uc.length} fechamentos · {uc.filter(c=>c.status==="pendente").length} aguardando</div></div>
                            {[["aprovado",uA,T.accent],["pago",uP,T.green],["a pagar",uA-uP,T.danger]].map(([l,v,c])=>(
                              <div key={l} style={{textAlign:"center"}}><div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:c}}>{fmt(v)}</div><div style={{fontSize:8,color:T.muted}}>{l}</div></div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {commAdminTab==="aprovacoes"&&(
                    <div>
                      {allPendingComm.length===0?(<div style={{textAlign:"center",padding:"60px",color:T.accent,fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:700}}>- Tudo em dia!</div>):(
                        <div style={{display:"flex",flexDirection:"column",gap:10}}>
                          {allPendingComm.map((c,i)=>(
                            <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderLeft:`3px solid ${T.warn}`,borderRadius:10,padding:"16px 20px",display:"flex",gap:14,alignItems:"center",flexWrap:"wrap"}}>
                              <div style={{flex:1}}><div style={{display:"flex",gap:5,marginBottom:5}}><Badge label={c.type} color={T.purple}/><Badge label={c.project} color={T.info}/></div><div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14}}>{c.partner}</div><div style={{fontSize:10,color:T.muted}}>por {c.user} · {c.date}</div></div>
                              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:T.warn}}>{fmt(c.value)}</div>
                              <div style={{display:"flex",gap:8}}>
                                <button className="btn" onClick={()=>{setClosings(p=>p.map(x=>x.id===c.id?{...x,status:"aprovado"}:x));pushNotif("Comissão aprovada",`${c.partner} · ${fmt(c.value)}`,T.accent);}} style={{padding:"8px 14px",background:T.accent,color:"#000",borderRadius:7,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11}}>- Aprovar</button>
                                <button className="btn" onClick={()=>setClosings(p=>p.map(x=>x.id===c.id?{...x,status:"reprovado"}:x))} style={{padding:"8px 12px",background:T.dangerDim,border:`1px solid ${T.danger}44`,color:T.danger,borderRadius:7,fontSize:11}}>-</button>
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
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Projetos</div>
                        <div style={{display:"flex",gap:8,marginBottom:10}}>
                          <input value={newProject} onChange={e=>setNewProject(e.target.value)} placeholder="Nome..." style={{...inpS,flex:1}} onKeyDown={e=>e.key==="Enter"&&newProject.trim()&&(setProjects(p=>[...p,{id:Date.now(),name:newProject.trim(),active:true}]),setNewProject(""))}/>
                          <button className="btn" onClick={()=>newProject.trim()&&(setProjects(p=>[...p,{id:Date.now(),name:newProject.trim(),active:true}]),setNewProject(""))} style={{padding:"8px 12px",background:T.accent,color:"#000",borderRadius:7,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>+</button>
                        </div>
                        {projects.map(p=>(<div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",background:T.surface,borderRadius:8,marginBottom:5,border:`1px solid ${T.border}`}}>
                          <span style={{fontSize:12}}>{p.name}</span>
                          <div onClick={()=>setProjects(prev=>prev.map(x=>x.id===p.id?{...x,active:!x.active}:x))} style={{fontSize:10,cursor:"pointer",color:p.active?T.accent:T.muted}}>{p.active?"- Ativo":"- Inativo"}</div>
                        </div>))}
                      </div>
                      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18}}>
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Tipos de Parceiro</div>
                        <div style={{display:"flex",gap:8,marginBottom:10}}>
                          <input value={newPtype} onChange={e=>setNewPtype(e.target.value)} placeholder="Ex: Sorveteria..." style={{...inpS,flex:1}} onKeyDown={e=>e.key==="Enter"&&newPtype.trim()&&(setPtypes(p=>[...p,{id:Date.now(),name:newPtype.trim()}]),setNewPtype(""))}/>
                          <button className="btn" onClick={()=>newPtype.trim()&&(setPtypes(p=>[...p,{id:Date.now(),name:newPtype.trim()}]),setNewPtype(""))} style={{padding:"8px 12px",background:T.accent,color:"#000",borderRadius:7,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>+</button>
                        </div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>{ptypes.map(t=><div key={t.id} style={{padding:"5px 11px",background:T.purpleDim,border:`1px solid ${T.purple}44`,borderRadius:6,fontSize:11,color:T.purple}}>{t.name}</div>)}</div>
                      </div>
                      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18,gridColumn:"1 / -1"}}>
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Tabela de Comissões · Tipo × Projeto</div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:10,marginBottom:12,padding:"12px",background:T.surface,borderRadius:10,border:`1px solid ${T.border}`}}>
                          {[["Tipo","typeId",ptypes],["Projeto","projectId",projects]].map(([l,k,opts])=>(
                            <div key={k}><div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:1}}>{l}</div>
                            <select value={newComm[k]} onChange={e=>setNewComm(p=>({...p,[k]:e.target.value}))} style={selS}><option value="">Selecione...</option>{opts.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select></div>
                          ))}
                          <div><div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:1}}>Valor (R$)</div>
                          <input type="number" value={newComm.value} onChange={e=>setNewComm(p=>({...p,value:e.target.value}))} placeholder="80" style={inpS}/></div>
                          <div style={{display:"flex",alignItems:"flex-end"}}><button className="btn" onClick={addCommEntry} style={{padding:"8px 14px",background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",borderRadius:7,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11}}>Salvar</button></div>
                        </div>
                        <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden"}}>
                          {commTable.map((c,i)=>(
                            <div key={i} className="hr" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 0.5fr",padding:"10px 14px",borderBottom:`1px solid ${T.border}`,gap:8,alignItems:"center"}}>
                              <Badge label={c.typeName} color={T.purple}/>
                              <Badge label={c.projectName} color={T.info}/>
                              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,color:T.accent}}>{fmt(c.value)}</div>
                              <div onClick={()=>setCommTable(p=>p.filter(x=>x.id!==c.id))} style={{fontSize:9,color:T.danger,cursor:"pointer"}}>remover</div>
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
                          <div><div style={{fontSize:11,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>{c.partner}</div><div style={{fontSize:8,color:T.muted}}>{c.date}</div></div>
                          <div style={{fontSize:10,color:T.soft}}>{c.user.split(" ")[0]}</div>
                          <Badge label={c.type} color={T.purple}/>
                          <Badge label={c.project.split(" ")[0]} color={T.info}/>
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:T.accent}}>{fmt(c.value)}</div>
                          <Badge label={c.status} color={c.status==="aprovado"?T.accent:c.status==="pendente"?T.warn:T.danger}/>
                          <div>{c.status==="aprovado"&&!c.pago?(<button className="btn" onClick={()=>setClosings(p=>p.map(x=>x.id===c.id?{...x,pago:true}:x))} style={{padding:"3px 8px",background:T.greenDim,border:`1px solid ${T.green}44`,color:T.green,borderRadius:5,fontSize:9}}>Marcar pago</button>):(<span style={{fontSize:9,color:c.pago?T.green:T.muted}}>{c.pago?"- Pago":"-"}</span>)}</div>
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
                      <div><div style={{fontSize:10,color:T.green,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1.5,textTransform:"uppercase",marginBottom:5}}>Abril 2025 · Sua comissão</div><div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:38,color:T.green,lineHeight:1,marginBottom:3}}>{fmt(myTotal)}</div><div style={{fontSize:11,color:T.soft}}>{myApproved.length} fechamentos aprovados</div></div>
                      <div style={{textAlign:"right"}}><div style={{fontSize:10,color:T.muted,marginBottom:3}}>Meta do mês</div><div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:myTotal>=META_COMM?T.accent:T.warn}}>{fmt(META_COMM)}</div><div style={{fontSize:10,color:myTotal>=META_COMM?T.accent:T.muted,marginTop:3}}>{myTotal>=META_COMM?"- Meta atingida!":`faltam ${fmt(META_COMM-myTotal)}`}</div></div>
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
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:10}}>Comissões vigentes</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                      {commTable.filter(c=>projects.find(p=>p.id===c.projectId)?.active).map((c,i)=>(
                        <div key={i} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div><div style={{fontSize:11,fontWeight:600}}>{c.typeName}</div><div style={{fontSize:9,color:T.muted,marginTop:1}}>{c.projectName}</div></div>
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,color:T.accent}}>{fmt(c.value)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:showNewClosing?14:0}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13}}>Registrar fechamento</div>
                      {!showNewClosing&&<button className="btn" onClick={()=>setShowNewClosing(true)} style={{padding:"8px 14px",background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",borderRadius:7,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11}}>+ Registrar</button>}
                    </div>
                    {showNewClosing&&(
                      <div className="fade">
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}>
                          <div><div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:1}}>Nome do parceiro</div><input value={newClosing.partner} onChange={e=>setNewClosing(p=>({...p,partner:e.target.value}))} placeholder="Ex: Bar do Alemão" style={inpS}/></div>
                          <div><div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:1}}>Tipo</div><select value={newClosing.typeId} onChange={e=>setNewClosing(p=>({...p,typeId:e.target.value}))} style={selS}><option value="">Selecione...</option>{ptypes.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
                          <div><div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:1}}>Projeto</div><select value={newClosing.projectId} onChange={e=>setNewClosing(p=>({...p,projectId:e.target.value}))} style={selS}><option value="">Selecione...</option>{projects.filter(p=>p.active).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
                        </div>
                        {newClosing.typeId&&newClosing.projectId&&(()=>{const comm=commTable.find(c=>c.typeId===Number(newClosing.typeId)&&c.projectId===Number(newClosing.projectId));return comm?(<div style={{padding:"10px 14px",background:T.accentDim,border:`1px solid ${T.accentBorder}`,borderRadius:8,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:11,color:T.soft}}>Comissão por este fechamento:</span><span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,color:T.accent}}>{fmt(comm.value)}</span></div>):(<div style={{padding:"10px 14px",background:T.warnDim,border:`1px solid ${T.warn}44`,borderRadius:8,marginBottom:10,fontSize:11,color:T.warn}}>-- Sem comissão configurada.</div>);})()}
                        <div style={{display:"flex",gap:8}}>
                          <button className="btn" onClick={submitClosing} style={{padding:"9px 16px",background:T.accent,color:"#000",borderRadius:7,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11}}>Enviar para aprovação</button>
                          <button className="btn" onClick={()=>setShowNewClosing(false)} style={{padding:"9px 12px",background:T.card,border:`1px solid ${T.border}`,color:T.muted,borderRadius:7,fontSize:11}}>Cancelar</button>
                        </div>
                      </div>
                    )}
                    {myClosings.length>0&&!showNewClosing&&(
                      <div style={{marginTop:14}}>
                        <div style={{fontSize:9,color:T.muted,marginBottom:6,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:1}}>Meus fechamentos</div>
                        {myClosings.map((c,i)=>(
                          <div key={i} style={{display:"flex",gap:10,alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${T.border}`,flexWrap:"wrap"}}>
                            <div style={{flex:1}}><div style={{fontSize:11,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>{c.partner}</div><div style={{fontSize:9,color:T.muted}}>{c.type} · {c.project}</div></div>
                            <Badge label={c.status} color={c.status==="aprovado"?T.accent:c.status==="pendente"?T.warn:T.danger}/>
                            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:T.accent}}>{fmt(c.value)}</div>
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
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,marginBottom:5}}>Automação de Prospecção</div>
                <div style={{fontSize:11,color:T.muted,lineHeight:1.7,fontFamily:"'JetBrains Mono',monospace"}}>IA gera CSV com @perfis - suba aqui - disparo automático DM + WhatsApp.</div>
              </div>
              <div style={{border:`2px dashed ${T.border}`,borderRadius:12,padding:"32px",textAlign:"center",cursor:"pointer",marginBottom:16}}>
                <div style={{fontSize:26,marginBottom:7}}>-</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,marginBottom:3}}>Subir CSV de leads</div>
                <div style={{fontSize:10,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>instagram_handle · nome · cidade</div>
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
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:k.c,marginBottom:3}}>{k.v}</div>
                    <div style={{fontSize:10,color:T.muted,fontFamily:"'JetBrains Mono',monospace",marginBottom:5}}>{k.l}</div>
                    <div style={{fontSize:8,color:k.c,fontFamily:"'JetBrains Mono',monospace",opacity:0.7}}>{k.hint}</div>
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
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,marginBottom:5}}>{selPartner.name}</div>
                        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                          <Badge label={selPartner.category} color={T.purple}/>
                          <Badge label={selPartner.status} color={STATUS_PARTNER[selPartner.status]||T.muted}/>
                          <Badge label={`Score ${selPartner.score}`} color={selPartner.score>80?T.accent:selPartner.score>60?T.warn:T.danger}/>
                        </div>
                      </div>
                      <div onClick={()=>setSelPartner(null)} style={{cursor:"pointer",color:T.muted,fontSize:20}}>×</div>
                    </div>
                    <div style={{padding:"18px 22px"}}>
                      {/* Score breakdown */}
                      <div style={{marginBottom:18}}>
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Score Detalhado</div>
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
                                <span style={{fontSize:11,color:T.text,fontFamily:"'JetBrains Mono',monospace"}}>{s.v}/{s.max} · <span style={{color:T.muted,fontSize:9}}>{s.hint}</span></span>
                              </div>
                              <PBar pct={(s.v/s.max)*100} color={s.v===s.max?T.accent:T.info} h={5}/>
                            </div>
                          ))}
                        </div>
                        <div style={{marginTop:12,padding:"10px 14px",background:T.accentDim,border:`1px solid ${T.accentBorder}`,borderRadius:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <span style={{fontSize:12,color:T.soft}}>Score total</span>
                          <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:selPartner.score>80?T.accent:selPartner.score>60?T.warn:T.danger}}>{selPartner.score}/100</span>
                        </div>
                      </div>
                      {/* Endereço */}
                      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:16,marginBottom:14}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13}}>Endereço</div>
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
                            <div style={{fontSize:8,color:T.muted,marginBottom:4,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:1}}>Rua</div>
                            <input value={selPartner.endereco?.rua||""} onChange={e=>setSelPartner(p=>({...p,endereco:{...p.endereco,rua:e.target.value}}))} placeholder="Ex: Rua Augusta" style={inpS}/>
                          </div>
                          <div>
                            <div style={{fontSize:8,color:T.muted,marginBottom:4,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:1}}>Nº</div>
                            <input value={selPartner.endereco?.numero||""} onChange={e=>setSelPartner(p=>({...p,endereco:{...p.endereco,numero:e.target.value}}))} placeholder="123" style={inpS}/>
                          </div>
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                          <div>
                            <div style={{fontSize:8,color:T.muted,marginBottom:4,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:1}}>Bairro</div>
                            <input value={selPartner.endereco?.bairro||""} onChange={e=>setSelPartner(p=>({...p,endereco:{...p.endereco,bairro:e.target.value}}))} placeholder="Centro" style={inpS}/>
                          </div>
                          <div>
                            <div style={{fontSize:8,color:T.muted,marginBottom:4,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:1}}>CEP</div>
                            <input value={selPartner.endereco?.cep||""} onChange={e=>setSelPartner(p=>({...p,endereco:{...p.endereco,cep:e.target.value}}))} placeholder="00000-000" style={inpS}/>
                          </div>
                        </div>
                        {selPartner.endereco?.lat&&(
                          <div style={{padding:"8px 12px",background:T.accentDim,border:`1px solid ${T.accentBorder}`,borderRadius:7,fontSize:10,color:T.accent,fontFamily:"'JetBrains Mono',monospace"}}>
                            - Coordenadas: {selPartner.endereco.lat.toFixed(4)}, {selPartner.endereco.lng.toFixed(4)}
                          </div>
                        )}
                        <button className="btn" onClick={()=>setBasePartners(prev=>prev.map(p=>p.id===selPartner.id?{...p,endereco:selPartner.endereco}:p))} style={{width:"100%",marginTop:10,padding:"8px",background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",borderRadius:7,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11}}>- Salvar endereço</button>
                      </div>

                      {/* Contract */}
                      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:16}}>
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:12}}>Contrato de Exclusividade</div>
                        {[
                          ["Status", selPartner.contrato.status],
                          ["Enviado em", selPartner.contrato.enviadoEm||"-"],
                          ["Assinado em", selPartner.contrato.assinadoEm||"-"],
                          ["Expira em", selPartner.contrato.expiraEm||"-"],
                        ].map(([l,v])=>(
                          <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                            <span style={{fontSize:10,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>{l}</span>
                            {l==="Status"
                              ? <Badge label={v} color={CONTRATO_COLOR[v]||T.muted}/>
                              : <span style={{fontSize:11,color:T.text}}>{v}</span>
                            }
                          </div>
                        ))}
                        <div style={{marginTop:12,display:"flex",gap:8}}>
                          {selPartner.contrato.status==="sem contrato"&&(
                            <button className="btn" onClick={()=>{enviarContrato(selPartner.id);setSelPartner(p=>({...p,contrato:{...p.contrato,status:"pendente",enviadoEm:new Date().toLocaleDateString("pt-BR")}}));}} style={{flex:1,padding:"9px",background:`linear-gradient(135deg,${T.warn},${T.warn}AA)`,color:"#000",borderRadius:7,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11}}>- Enviar Contrato</button>
                          )}
                          {selPartner.contrato.status==="pendente"&&(
                            <button className="btn" onClick={()=>assinarContrato(selPartner.id)} style={{flex:1,padding:"9px",background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",borderRadius:7,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11}}>- Marcar como Assinado</button>
                          )}
                          {(selPartner.contrato.status==="expirando"||selPartner.contrato.status==="expirado")&&(
                            <button className="btn" onClick={()=>{enviarContrato(selPartner.id);setSelPartner(p=>({...p,contrato:{...p.contrato,status:"pendente",enviadoEm:new Date().toLocaleDateString("pt-BR")}}));}} style={{flex:1,padding:"9px",background:`linear-gradient(135deg,${T.danger},${T.danger}AA)`,color:"#fff",borderRadius:7,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11}}>- Renovar Contrato</button>
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
                  <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
                    <input value={baseSearch} onChange={e=>setBaseSearch(e.target.value)} placeholder="Buscar parceiro ou @..." style={{...inpS,width:200}}/>
                    <select value={baseFilter} onChange={e=>setBaseFilter(e.target.value)} style={{...selS,width:"auto"}}><option value="todos">Todos status</option>{["ativo","negociando","prospectado"].map(s=><option key={s}>{s}</option>)}</select>
                    <select value={baseScoreMin} onChange={e=>setBaseScoreMin(Number(e.target.value))} style={{...selS,width:"auto"}}>
                      <option value={0}>Qualquer score</option>
                      <option value={80}>Score - 80</option>
                      <option value={60}>Score - 60</option>
                    </select>
                    <select value={baseContratoFilter} onChange={e=>setBaseContratoFilter(e.target.value)} style={{...selS,width:"auto"}}>
                      <option value="todos">Todos contratos</option>
                      {["assinado","pendente","expirando","sem contrato"].map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
                    <div style={{display:"grid",gridTemplateColumns:"2fr 1.1fr 0.9fr 0.7fr 0.7fr 0.9fr 1fr",padding:"10px 16px",borderBottom:`1px solid ${T.border}`,gap:8}}>
                      {["Estabelecimento","Cidade","Categoria","Entrega/mês","Score","Contrato","Status"].map(h=><div key={h} style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:1.5,fontFamily:"'JetBrains Mono',monospace"}}>{h}</div>)}
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
                          <div style={{fontSize:12,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>{p.name}</div>
                          <div style={{fontSize:9,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>{p.handle}</div>
                        </div>
                        <div style={{fontSize:10,color:T.soft}}>{p.city} · {p.state}</div>
                        <div style={{fontSize:10,color:T.soft}}>{p.category}</div>
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14}}>{p.deliveries}</div>
                        <div>
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:14,color:p.score>80?T.accent:p.score>60?T.warn:T.danger}}>{p.score}</div>
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
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:6}}>Como o score é calculado</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginTop:12}}>
                      {[{l:"Entregas/mês",pts:"até 30pts",icon:"--"},{l:"Campanhas",pts:"15pts cada",icon:"-"},{l:"Tempo na base",pts:"2pts/mês",icon:"-"},{l:"Contrato assinado",pts:"+20pts",icon:"-"},{l:"Engajamento",pts:"até 15pts",icon:"-"}].map((s,i)=>(
                        <div key={i} style={{background:T.surface,borderRadius:8,padding:"10px 12px",textAlign:"center",border:`1px solid ${T.border}`}}>
                          <div style={{fontSize:18,marginBottom:4}}>{s.icon}</div>
                          <div style={{fontSize:10,fontWeight:600,marginBottom:2}}>{s.l}</div>
                          <div style={{fontSize:9,color:T.accent,fontFamily:"'JetBrains Mono',monospace"}}>{s.pts}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
                    <div style={{padding:"12px 18px",borderBottom:`1px solid ${T.border}`,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13}}>Ranking da Base</div>
                    {[...basePartners].sort((a,b)=>b.score-a.score).map((p,i)=>(
                      <div key={p.id} className="hr" onClick={()=>setSelPartner(p)} style={{display:"flex",gap:14,padding:"13px 18px",borderBottom:`1px solid ${T.border}`,alignItems:"center"}}>
                        <div style={{width:28,height:28,borderRadius:"50%",background:i<3?[T.warn+"33",T.soft+"22",T.soft+"15"][i]:T.border,border:`2px solid ${i<3?[T.warn,T.soft,T.soft][i]:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:i<3?[T.warn,T.soft,T.soft][i]:T.muted,fontWeight:700,flexShrink:0}}>{i+1}</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:12,fontWeight:700,fontFamily:"'Syne',sans-serif",marginBottom:2}}>{p.name}</div>
                          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                            <Badge label={p.category} color={T.purple}/>
                            <Badge label={p.contrato.status} color={CONTRATO_COLOR[p.contrato.status]||T.muted}/>
                          </div>
                        </div>
                        <div style={{width:120}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                            <span style={{fontSize:9,color:T.muted}}>Score</span>
                            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:14,color:p.score>80?T.accent:p.score>60?T.warn:T.danger}}>{p.score}</span>
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
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:k.c}}>{k.v}</div>
                          <div style={{fontSize:10,color:isActive?k.c:T.muted,fontFamily:"'JetBrains Mono',monospace",marginTop:2}}>{k.l}</div>
                          {isActive&&<div style={{fontSize:8,color:k.c,marginTop:4,fontFamily:"'JetBrains Mono',monospace"}}>Filtrando - · clique para limpar</div>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Priority: needs action */}
                  {basePartners.filter(p=>["expirando","sem contrato"].includes(p.contrato.status)&&p.status==="ativo").length>0&&(
                    <div style={{background:T.card,border:`1px solid ${T.danger}44`,borderLeft:`3px solid ${T.danger}`,borderRadius:12,padding:16,marginBottom:14}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:T.danger,marginBottom:10}}>- Ação necessária</div>
                      {basePartners.filter(p=>["expirando","sem contrato"].includes(p.contrato.status)&&p.status==="ativo").map((p,i)=>(
                        <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${T.border}`,gap:10,flexWrap:"wrap"}}>
                          <div>
                            <div style={{fontSize:12,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>{p.name}</div>
                            <div style={{fontSize:9,color:T.muted}}>{p.category} · {p.city}</div>
                          </div>
                          <Badge label={p.contrato.status} color={CONTRATO_COLOR[p.contrato.status]||T.muted}/>
                          <button className="btn" onClick={()=>enviarContrato(p.id)} style={{padding:"6px 12px",background:`linear-gradient(135deg,${T.warn},${T.warn}AA)`,color:"#000",borderRadius:6,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:10}}>- Enviar</button>
                        </div>
                      ))}
                      <button className="btn" onClick={()=>basePartners.filter(p=>["expirando","sem contrato"].includes(p.contrato.status)&&p.status==="ativo").forEach(p=>enviarContrato(p.id))} style={{width:"100%",marginTop:12,padding:"9px",background:T.surface,border:`1px solid ${T.border}`,color:T.warn,borderRadius:8,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11}}>- Enviar para todos de uma vez</button>
                    </div>
                  )}

                  {/* All contracts table */}
                  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
                    {/* Filter bar */}
                    <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.border}`,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                      <span style={{fontSize:9,color:T.muted,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:1}}>Filtrar:</span>
                      {[["todos","Todos"],["assinado","Assinados"],["pendente","Pendentes"],["expirando","Expirando"],["sem contrato","Sem contrato"]].map(([v,l])=>(
                        <div key={v} onClick={()=>setContratoTableFilter(v)} className="tb"
                          style={{fontSize:9,padding:"4px 10px",borderRadius:5,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",
                            background:contratoTableFilter===v?(CONTRATO_COLOR[v]||T.accent)+"22":T.surface,
                            border:`1px solid ${contratoTableFilter===v?(CONTRATO_COLOR[v]||T.accent)+"66":T.border}`,
                            color:contratoTableFilter===v?(CONTRATO_COLOR[v]||T.accent):T.muted}}>
                          {l}
                        </div>
                      ))}
                      {contratoTableFilter!=="todos"&&(
                        <div style={{marginLeft:"auto",fontSize:9,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>
                          {basePartners.filter(p=>p.contrato.status===contratoTableFilter).length} resultado(s)
                        </div>
                      )}
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr",padding:"10px 16px",borderBottom:`1px solid ${T.border}`,gap:8}}>
                      {["Parceiro","Status","Enviado em","Assinado em","Expira em","Ação"].map(h=><div key={h} style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:1.5,fontFamily:"'JetBrains Mono',monospace"}}>{h}</div>)}
                    </div>
                    {basePartners.filter(p=>contratoTableFilter==="todos"||p.contrato.status===contratoTableFilter).map((p,i)=>(
                      <div key={i} className="hr" onClick={()=>setSelPartner(p)} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr",padding:"12px 16px",borderBottom:`1px solid ${T.border}`,gap:8,alignItems:"center"}}>
                        <div>
                          <div style={{fontSize:12,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>{p.name}</div>
                          <div style={{fontSize:9,color:T.muted}}>{p.category}</div>
                        </div>
                        <Badge label={p.contrato.status} color={CONTRATO_COLOR[p.contrato.status]||T.muted}/>
                        <div style={{fontSize:10,color:T.soft,fontFamily:"'JetBrains Mono',monospace"}}>{p.contrato.enviadoEm||"-"}</div>
                        <div style={{fontSize:10,color:p.contrato.assinadoEm?T.accent:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>{p.contrato.assinadoEm||"-"}</div>
                        <div style={{fontSize:10,color:p.contrato.status==="expirando"?T.danger:T.soft,fontFamily:"'JetBrains Mono',monospace"}}>{p.contrato.expiraEm||"-"}</div>
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
              CADASTROS
          -------------------------------------- */}
          {tab==="cadastros"&&(
            <div>
              <div style={{display:"flex",gap:5,marginBottom:14}}>
                {[["clientes","Clientes"],["fornecedores","Fornecedores"]].map(([v,l])=>(
                  <div key={v} onClick={()=>setCadTab(v)} className="tb" style={{padding:"7px 12px",borderRadius:6,fontSize:10,background:cadTab===v?T.accentDim:T.card,border:`1px solid ${cadTab===v?T.accentBorder:T.border}`,color:cadTab===v?T.accent:T.muted}}>{l}</div>
                ))}
              </div>
              {cadTab==="clientes"&&(
                <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
                  <div style={{display:"grid",gridTemplateColumns:"2fr 1.5fr 1fr 0.8fr 1fr",padding:"10px 16px",borderBottom:`1px solid ${T.border}`,gap:10}}>
                    {["Cliente","Contato","Segmento","Campanhas","LTV"].map(h=><div key={h} style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:1.5}}>{h}</div>)}
                  </div>
                  {CLIENTS_LIST.map((c,i)=>(<div key={i} className="hr" style={{display:"grid",gridTemplateColumns:"2fr 1.5fr 1fr 0.8fr 1fr",padding:"12px 16px",borderBottom:`1px solid ${T.border}`,gap:10,alignItems:"center"}}>
                    <div><div style={{fontSize:12,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>{c.name}</div><div style={{fontSize:9,color:T.muted}}>{c.email}</div></div>
                    <div style={{fontSize:11,color:T.soft}}>{c.contact}</div>
                    <Badge label={c.segment} color={T.purple}/>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:T.info}}>{c.campaigns}</div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:T.accent}}>{fmtK(c.ltv)}</div>
                  </div>))}
                </div>
              )}
              {cadTab==="fornecedores"&&(
                <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
                  <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 0.8fr 0.6fr",padding:"10px 16px",borderBottom:`1px solid ${T.border}`,gap:10}}>
                    {["Fornecedor","Tipo","Contato","Prazo","-"].map(h=><div key={h} style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:1.5}}>{h}</div>)}
                  </div>
                  {SUPPLIERS.map((s,i)=>(<div key={i} className="hr" style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 0.8fr 0.6fr",padding:"12px 16px",borderBottom:`1px solid ${T.border}`,gap:10,alignItems:"center"}}>
                    <div><div style={{fontSize:12,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>{s.name}</div><div style={{fontSize:9,color:T.muted}}>{s.email}</div></div>
                    <Badge label={s.type==="grafica"?"Gráfica":"Logística"} color={s.type==="grafica"?T.purple:T.warn}/>
                    <div style={{fontSize:11,color:T.soft}}>{s.contact}</div>
                    <div style={{fontSize:10,color:T.soft,fontFamily:"'JetBrains Mono',monospace"}}>{s.leadTime}</div>
                    <div style={{fontSize:11}}>{"-".repeat(s.rating)}<span style={{color:T.border}}>{"-".repeat(5-s.rating)}</span></div>
                  </div>))}
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
                <button className="btn" onClick={()=>setShowNewUser(true)} style={{padding:"8px 16px",background:`linear-gradient(135deg,${T.accent},#00B87A)`,color:"#000",borderRadius:8,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11}}>+ Novo Usuário</button>
              </div>
              {showNewUser&&(
                <div style={{background:T.card,border:`1px solid ${T.accentBorder}`,borderRadius:12,padding:18,marginBottom:12}} className="fade">
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:T.accent,marginBottom:12}}>Novo Usuário</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}>
                    {[["Nome","name","text"],["E-mail","email","email"]].map(([l,k,t])=>(<div key={k}><div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:1}}>{l}</div><input type={t} value={newUser[k]} onChange={e=>setNewUser(p=>({...p,[k]:e.target.value}))} style={inpS}/></div>))}
                    <div><div style={{fontSize:9,color:T.muted,marginBottom:4,fontFamily:"'JetBrains Mono',monospace",textTransform:"uppercase",letterSpacing:1}}>Perfil</div><select value={newUser.role} onChange={e=>setNewUser(p=>({...p,role:e.target.value}))} style={selS}>{Object.entries(ROLE_LABELS).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></div>
                  </div>
                  <div style={{display:"flex",gap:8}}><button className="btn" onClick={addUser} style={{padding:"8px 16px",background:T.accent,color:"#000",borderRadius:7,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11}}>Criar</button><button className="btn" onClick={()=>setShowNewUser(false)} style={{padding:"8px 12px",background:T.card,border:`1px solid ${T.border}`,color:T.muted,borderRadius:7,fontSize:11}}>Cancelar</button></div>
                </div>
              )}
              <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
                <div style={{display:"grid",gridTemplateColumns:"2fr 2fr 1fr 1fr 1fr",padding:"10px 16px",borderBottom:`1px solid ${T.border}`,gap:10}}>
                  {["Usuário","E-mail","Perfil","Último acesso","Status"].map(h=><div key={h} style={{fontSize:8,color:T.muted,textTransform:"uppercase",letterSpacing:1.5}}>{h}</div>)}
                </div>
                {users.map((u,i)=>(
                  <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 2fr 1fr 1fr 1fr",padding:"12px 16px",borderBottom:`1px solid ${T.border}`,gap:10,alignItems:"center",opacity:u.active?1:0.5}}>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}><div style={{width:26,height:26,borderRadius:"50%",background:ROLE_COLOR[u.role]+"22",border:`1px solid ${ROLE_COLOR[u.role]}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:ROLE_COLOR[u.role],fontWeight:700,flexShrink:0}}>{u.avatar}</div><span style={{fontSize:12,fontWeight:600,fontFamily:"'Syne',sans-serif"}}>{u.name}</span></div>
                    <div style={{fontSize:10,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>{u.email}</div>
                    <Badge label={ROLE_LABELS[u.role]} color={ROLE_COLOR[u.role]}/>
                    <div style={{fontSize:10,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>-</div>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <div style={{width:7,height:7,borderRadius:"50%",background:u.active?T.accent:T.danger}}/>
                      {u.id!==user.id&&<div onClick={()=>setUsers(p=>p.map(x=>x.id===u.id?{...x,active:!x.active}:x))} style={{fontSize:9,color:u.active?T.danger:T.accent,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace"}}>{u.active?"Aposentar":"Reativar"}</div>}
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
