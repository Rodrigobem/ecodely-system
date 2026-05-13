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

    // Busca restaurantes próximos
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&key=${apiKey}`;
    const resp = await fetch(url);
    const data = await resp.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return res.status(500).json({ error: data.status, message: data.error_message });
    }

    const places = (data.results || []).map(p => ({
      name: p.name,
      rating: p.rating,
      userRatingsTotal: p.user_ratings_total,
      priceLevel: p.price_level,
      types: p.types?.filter(t => !['point_of_interest','establishment','food'].includes(t)),
      vicinity: p.vicinity,
    }));

    // Agrupa por tipo de culinária
    const typeCount = {};
    places.forEach(p => {
      (p.types || []).forEach(t => {
        const label = t.replace(/_/g,' ');
        typeCount[label] = (typeCount[label] || 0) + 1;
      });
    });
    const topTypes = Object.entries(typeCount).sort((a,b)=>b[1]-a[1]).slice(0,8);

    // Estatísticas
    const rated = places.filter(p => p.rating);
    const avgRating = rated.length > 0 ? (rated.reduce((a,p)=>a+p.rating,0)/rated.length).toFixed(1) : null;
    const priced = places.filter(p => p.priceLevel !== undefined);
    const avgPrice = priced.length > 0 ? Math.round(priced.reduce((a,p)=>a+p.priceLevel,0)/priced.length) : null;
    const priceLabelMap = {0:'Muito barato',1:'Barato',2:'Moderado',3:'Caro',4:'Muito caro'};

    return res.status(200).json({
      total: places.length,
      avgRating,
      avgPriceLevel: avgPrice,
      avgPriceLabel: priceLabelMap[avgPrice] || 'Moderado',
      topCuisines: topTypes,
      sample: places.slice(0,5).map(p=>p.name),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
