module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { cidade, uf } = req.body || {};
  if (!cidade) return res.status(400).json({ error: 'cidade required' });

  try {
    const busca = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/municipios?nome=${encodeURIComponent(cidade)}`,
      { headers: { 'User-Agent': 'Ecodely-Sistema/1.0' } }
    );
    const municipios = await busca.json();
    if (!municipios.length) return res.status(404).json({ error: 'Município não encontrado', cidade });

    let municipio = municipios[0];
    if (uf) {
      const filtrado = municipios.find(m =>
        m.microrregiao?.mesorregiao?.UF?.sigla?.toLowerCase() === uf.toLowerCase()
      );
      if (filtrado) municipio = filtrado;
    }

    const id = municipio.id;
    const nomeMunicipio = municipio.nome;
    const siglaUF = municipio.microrregiao?.mesorregiao?.UF?.sigla || '';

    const [popResp, rendaResp, escolarResp] = await Promise.allSettled([
      fetch(`https://servicodados.ibge.gov.br/api/v3/agregados/6579/periodos/2024/variaveis/9324?localidades=N6[${id}]`),
      fetch(`https://servicodados.ibge.gov.br/api/v3/agregados/9605/periodos/2022/variaveis/10605?localidades=N6[${id}]`),
      fetch(`https://servicodados.ibge.gov.br/api/v3/agregados/9914/periodos/2022/variaveis/10750?localidades=N6[${id}]`),
    ]);

    const extract = async (resp) => {
      if (resp.status !== 'fulfilled' || !resp.value.ok) return null;
      const d = await resp.value.json();
      const entries = d?.[0]?.resultados?.[0]?.series?.[0]?.serie;
      if (!entries) return null;
      const val = Object.values(entries)[0];
      return val && val !== '...' && val !== '-' ? Number(val) : null;
    };

    const [populacao, rendaPerCapita, pctSuperior] = await Promise.all([
      extract(popResp), extract(rendaResp), extract(escolarResp),
    ]);

    return res.status(200).json({
      municipio: nomeMunicipio,
      uf: siglaUF,
      id,
      populacao,
      populacaoFormatada: populacao ? populacao.toLocaleString('pt-BR') + ' habitantes' : null,
      rendaPerCapita,
      rendaPerCapitaFormatada: rendaPerCapita ? `R$ ${rendaPerCapita.toFixed(2).replace('.', ',')} /mês` : null,
      pctSuperior: pctSuperior ? `${pctSuperior.toFixed(1)}%` : null,
      fonte: 'IBGE — Censo 2022 / Estimativa 2024',
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
