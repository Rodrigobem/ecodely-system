module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { cidade, uf } = req.body || {};
  if (!cidade) return res.status(400).json({ error: 'cidade required' });

  try {
    // 1. Busca código do município
    const busca = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/municipios?nome=${encodeURIComponent(cidade)}`,
      { headers: { 'User-Agent': 'Ecodely-Sistema/1.0' } }
    );
    const municipios = await busca.json();
    if (!municipios.length) return res.status(404).json({ error: 'Município não encontrado', cidade });

    // Filtra por UF se fornecido
    let municipio = municipios[0];
    if (uf) {
      const filtrado = municipios.find(m => m.microrregiao?.mesorregiao?.UF?.sigla?.toLowerCase() === uf.toLowerCase());
      if (filtrado) municipio = filtrado;
    }

    const id = municipio.id;
    const nomeMunicipio = municipio.nome;
    const siglaUF = municipio.microrregiao?.mesorregiao?.UF?.sigla || '';

    // 2. Busca dados em paralelo
    const [popResp, rendaResp, idadeResp] = await Promise.allSettled([
      // População estimada 2024
      fetch(`https://servicodados.ibge.gov.br/api/v3/agregados/6579/periodos/2024/variaveis/9324?localidades=N6[${id}]`),
      // Rendimento médio mensal per capita (Censo 2022)
      fetch(`https://servicodados.ibge.gov.br/api/v3/agregados/9605/periodos/2022/variaveis/10605?localidades=N6[${id}]`),
      // Densidade demográfica
      fetch(`https://servicodados.ibge.gov.br/api/v3/agregados/6579/periodos/2022/variaveis/9324?localidades=N6[${id}]`),
    ]);

    let populacao = null, rendaMedia = null, populacao2022 = null;

    if (popResp.status === 'fulfilled' && popResp.value.ok) {
      const d = await popResp.value.json();
      const val = d?.[0]?.resultados?.[0]?.series?.[0]?.serie?.['2024'];
      if (val) populacao = Number(val);
    }

    if (rendaResp.status === 'fulfilled' && rendaResp.value.ok) {
      const d = await rendaResp.value.json();
      const val = d?.[0]?.resultados?.[0]?.series?.[0]?.serie?.['2022'];
      if (val) rendaMedia = Number(val);
    }

    if (idadeResp.status === 'fulfilled' && idadeResp.value.ok) {
      const d = await idadeResp.value.json();
      const val = d?.[0]?.resultados?.[0]?.series?.[0]?.serie?.['2022'];
      if (val) populacao2022 = Number(val);
    }

    return res.status(200).json({
      municipio: nomeMunicipio,
      uf: siglaUF,
      id,
      populacao: populacao || populacao2022,
      populacaoFormatada: populacao
        ? populacao.toLocaleString('pt-BR') + ' habitantes'
        : populacao2022
          ? populacao2022.toLocaleString('pt-BR') + ' habitantes (Censo 2022)'
          : null,
      rendaMedia,
      rendaMediaFormatada: rendaMedia
        ? 'R$ ' + rendaMedia.toFixed(2).replace('.', ',') + ' per capita/mês'
        : null,
      fonte: 'IBGE — Censo 2022 / Estimativa 2024',
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
