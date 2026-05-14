const CUISINE_KEYWORDS = [
  {label:'Hamburguer/Lanches', keyword:'hamburger'},
  {label:'Pizza', keyword:'pizza'},
  {label:'Japonesa/Sushi', keyword:'japanese food'},
  {label:'Brasileira/Marmitex', keyword:'comida brasileira'},
  {label:'Açaí', keyword:'açaí'},
  {label:'Árabe/Esfiha', keyword:'arab food'},
  {label:'Italiana', keyword:'italian restaurant'},
  {label:'Saudável/Fit', keyword:'comida saudável'},
  {label:'Churrasco', keyword:'churrascaria'},
  {label:'Frango/Fast Food', keyword:'fast food'},
];

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GOOGLE_MAPS_API_KEY not configured' });

  try {
    const { lat, lng, radius = 5000 } = req.body || {};
    if (!lat || !lng) return res.status(400).json({ error: 'lat/lng required' });

    // 1. Busca geral de restaurantes
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&key=${apiKey}`;
    const resp = await fetch(url);
    const data = await resp.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return res.status(500).json({ error: data.status, message: data.error_message });
    }

    const places = data.results || [];
    const rated = places.filter(p => p.rating);
    const avgRating = rated.length > 0 ? (rated.reduce((a,p)=>a+p.rating,0)/rated.length).toFixed(1) : null;
    const priced = places.filter(p => p.price_level !== undefined);
    const avgPrice = priced.length > 0 ? Math.round(priced.reduce((a,p)=>a+p.price_level,0)/priced.length) : null;
    const priceLabelMap = {0:'Muito barato',1:'Econômico',2:'Moderado',3:'Premium',4:'Muito Premium'};

    // 2. Busca culinárias específicas em paralelo (amostra de 5 tipos)
    const cuisineChecks = await Promise.allSettled(
      CUISINE_KEYWORDS.slice(0, 6).map(async ({label, keyword}) => {
        const r = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&keyword=${encodeURIComponent(keyword)}&key=${apiKey}`
        );
        const d = await r.json();
        return { label, count: (d.results || []).length };
      })
    );

    const cuisines = cuisineChecks
      .filter(r => r.status === 'fulfilled' && r.value.count > 0)
      .map(r => r.value)
      .sort((a,b) => b.count - a.count);

    return res.status(200).json({
      total: places.length + (data.next_page_token ? '+' : ''),
      totalNum: places.length,
      avgRating,
      avgPriceLevel: avgPrice,
      avgPriceLabel: priceLabelMap[avgPrice] || 'Moderado',
      topCuisines: cuisines,
      sample: places.slice(0,5).map(p=>p.name),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
