const CUISINE_KEYWORDS = [
  {label:'Hamburguer/Lanches', keyword:'hamburger'},
  {label:'Japonesa/Sushi', keyword:'japanese food'},
  {label:'Brasileira/Marmitex', keyword:'comida brasileira'},
  {label:'Açaí', keyword:'açaí'},
  {label:'Árabe/Esfiha', keyword:'arab food'},
  {label:'Italiana', keyword:'italian restaurant'},
  {label:'Saudável/Fit', keyword:'comida saudável'},
  {label:'Churrasco', keyword:'churrascaria'},
  {label:'Frango/Fast Food', keyword:'fast food'},
  {label:'Mexicana', keyword:'mexican food'},
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

    // 1. Busca geral de restaurantes com campos ricos
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&key=${apiKey}`;
    const resp = await fetch(url);
    const data = await resp.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return res.status(500).json({ error: data.status, message: data.error_message });
    }

    const places = data.results || [];

    // 2. Busca Place Details dos top 5 mais bem avaliados para obter reviews reais
    const topPlaces = [...places]
      .filter(p => p.rating && p.user_ratings_total)
      .sort((a, b) => (b.rating * Math.log(b.user_ratings_total + 1)) - (a.rating * Math.log(a.user_ratings_total + 1)))
      .slice(0, 5);

    const detailsResults = await Promise.allSettled(
      topPlaces.map(p =>
        fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${p.place_id}&fields=name,rating,user_ratings_total,price_level,reviews,opening_hours&language=pt-BR&key=${apiKey}`)
          .then(r => r.json())
      )
    );

    const topDetailed = detailsResults
      .filter(r => r.status === 'fulfilled' && r.value.result)
      .map(r => {
        const p = r.value.result;
        return {
          name: p.name,
          rating: p.rating,
          totalReviews: p.user_ratings_total,
          priceLevel: p.price_level,
          topReviews: (p.reviews || []).slice(0, 2).map(rv => ({
            rating: rv.rating,
            text: rv.text?.slice(0, 150),
            time: rv.relative_time_description,
          })),
          openNow: p.opening_hours?.open_now,
        };
      });

    // 3. Estatísticas gerais
    const rated = places.filter(p => p.rating);
    const avgRating = rated.length > 0
      ? (rated.reduce((a, p) => a + p.rating, 0) / rated.length).toFixed(1)
      : null;
    const totalReviews = places.reduce((a, p) => a + (p.user_ratings_total || 0), 0);
    const priced = places.filter(p => p.price_level !== undefined);
    const avgPrice = priced.length > 0
      ? Math.round(priced.reduce((a, p) => a + p.price_level, 0) / priced.length)
      : null;
    const priceLabelMap = { 0: 'Muito barato', 1: 'Econômico', 2: 'Moderado', 3: 'Premium', 4: 'Muito Premium' };

    // 4. Distribuição por avaliação
    const dist = { excelente: 0, bom: 0, regular: 0 };
    rated.forEach(p => {
      if (p.rating >= 4.5) dist.excelente++;
      else if (p.rating >= 4.0) dist.bom++;
      else dist.regular++;
    });

    // 5. Culinárias presentes (3 buscas paralelas para não estourar tempo)
    const cuisineChecks = await Promise.allSettled(
      CUISINE_KEYWORDS.slice(0, 5).map(async ({ label, keyword }) => {
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
      .sort((a, b) => b.count - a.count);

    return res.status(200).json({
      total: places.length,
      avgRating,
      totalReviews,
      avgPriceLevel: avgPrice,
      avgPriceLabel: priceLabelMap[avgPrice] || 'Moderado',
      distribuicao: dist,
      topDetailed,
      topCuisines: cuisines,
      sample: places.slice(0, 5).map(p => p.name),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
