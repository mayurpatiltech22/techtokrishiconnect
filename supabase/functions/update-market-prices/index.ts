import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// 25+ crops with realistic Indian market price ranges (per quintal in INR)
const cropData = [
  // Cereals
  { name: "Wheat", minPrice: 2200, maxPrice: 2800, category: "Cereals" },
  { name: "Rice (Basmati)", minPrice: 3500, maxPrice: 5500, category: "Cereals" },
  { name: "Rice (Common)", minPrice: 2800, maxPrice: 3500, category: "Cereals" },
  { name: "Maize", minPrice: 1800, maxPrice: 2400, category: "Cereals" },
  { name: "Bajra (Pearl Millet)", minPrice: 2000, maxPrice: 2600, category: "Cereals" },
  { name: "Jowar (Sorghum)", minPrice: 2200, maxPrice: 3000, category: "Cereals" },
  { name: "Ragi", minPrice: 3000, maxPrice: 3800, category: "Cereals" },
  
  // Pulses
  { name: "Chana (Gram)", minPrice: 4500, maxPrice: 6000, category: "Pulses" },
  { name: "Tur Dal (Arhar)", minPrice: 6000, maxPrice: 9000, category: "Pulses" },
  { name: "Moong Dal", minPrice: 6500, maxPrice: 8500, category: "Pulses" },
  { name: "Urad Dal", minPrice: 7000, maxPrice: 10000, category: "Pulses" },
  { name: "Masoor Dal", minPrice: 5500, maxPrice: 7500, category: "Pulses" },
  
  // Oilseeds
  { name: "Soybean", minPrice: 4200, maxPrice: 5500, category: "Oilseeds" },
  { name: "Groundnut", minPrice: 5000, maxPrice: 7000, category: "Oilseeds" },
  { name: "Mustard", minPrice: 4500, maxPrice: 6000, category: "Oilseeds" },
  { name: "Sunflower", minPrice: 4000, maxPrice: 5500, category: "Oilseeds" },
  { name: "Sesame (Til)", minPrice: 10000, maxPrice: 15000, category: "Oilseeds" },
  
  // Vegetables
  { name: "Onion", minPrice: 1200, maxPrice: 3500, category: "Vegetables" },
  { name: "Potato", minPrice: 800, maxPrice: 2000, category: "Vegetables" },
  { name: "Tomato", minPrice: 1500, maxPrice: 4000, category: "Vegetables" },
  { name: "Garlic", minPrice: 8000, maxPrice: 15000, category: "Vegetables" },
  { name: "Ginger", minPrice: 6000, maxPrice: 12000, category: "Vegetables" },
  { name: "Green Chilli", minPrice: 3000, maxPrice: 8000, category: "Vegetables" },
  { name: "Cabbage", minPrice: 800, maxPrice: 2000, category: "Vegetables" },
  { name: "Cauliflower", minPrice: 1000, maxPrice: 2500, category: "Vegetables" },
  
  // Fruits
  { name: "Banana", minPrice: 2000, maxPrice: 4000, category: "Fruits" },
  { name: "Mango (Alphonso)", minPrice: 8000, maxPrice: 20000, category: "Fruits" },
  { name: "Orange", minPrice: 3000, maxPrice: 6000, category: "Fruits" },
  { name: "Pomegranate", minPrice: 6000, maxPrice: 12000, category: "Fruits" },
  { name: "Grapes", minPrice: 4000, maxPrice: 8000, category: "Fruits" },
  { name: "Apple", minPrice: 8000, maxPrice: 15000, category: "Fruits" },
  
  // Spices
  { name: "Turmeric", minPrice: 8000, maxPrice: 14000, category: "Spices" },
  { name: "Red Chilli", minPrice: 12000, maxPrice: 25000, category: "Spices" },
  { name: "Cumin (Jeera)", minPrice: 20000, maxPrice: 35000, category: "Spices" },
  { name: "Coriander", minPrice: 6000, maxPrice: 10000, category: "Spices" },
  
  // Cash Crops
  { name: "Cotton", minPrice: 5500, maxPrice: 7500, category: "Cash Crops" },
  { name: "Sugarcane", minPrice: 280, maxPrice: 400, category: "Cash Crops" },
  { name: "Jute", minPrice: 4000, maxPrice: 5500, category: "Cash Crops" },
];

// Major markets across India
const markets = [
  { name: "Vashi APMC", district: "Mumbai" },
  { name: "Lasalgaon Mandi", district: "Nashik" },
  { name: "Pune APMC", district: "Pune" },
  { name: "Azadpur Mandi", district: "Delhi" },
  { name: "Koyambedu Market", district: "Chennai" },
  { name: "Yeshwanthpur APMC", district: "Bangalore" },
  { name: "Bowenpally Market", district: "Hyderabad" },
  { name: "Devi Ahilya Mandi", district: "Indore" },
  { name: "Mandi Samiti", district: "Jaipur" },
  { name: "Lucknow Mandi", district: "Lucknow" },
  { name: "Ahmedabad APMC", district: "Ahmedabad" },
  { name: "Bhopal Mandi", district: "Bhopal" },
];

function generatePrice(minPrice: number, maxPrice: number, variance: number = 0.15): number {
  const basePrice = minPrice + Math.random() * (maxPrice - minPrice);
  const varianceFactor = 1 + (Math.random() * 2 - 1) * variance;
  return Math.round(basePrice * varianceFactor);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const today = new Date();
    const priceRecords = [];

    // Generate prices for all crop-market combinations
    for (const crop of cropData) {
      for (const market of markets) {
        const price = generatePrice(crop.minPrice, crop.maxPrice);
        
        priceRecords.push({
          crop_name: crop.name,
          market_name: market.name,
          district: market.district,
          price: price,
          unit: 'quintal',
          recorded_at: today.toISOString(),
        });
      }
    }

    // Delete old prices (older than 45 days)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 45);
    
    await supabase
      .from('market_prices')
      .delete()
      .lt('recorded_at', cutoffDate.toISOString());

    // Insert new prices in batches
    const batchSize = 100;
    for (let i = 0; i < priceRecords.length; i += batchSize) {
      const batch = priceRecords.slice(i, i + batchSize);
      const { error } = await supabase
        .from('market_prices')
        .insert(batch);

      if (error) {
        console.error('Error inserting batch:', error);
        throw error;
      }
    }

    // Also generate historical data for the past 30 days if needed
    const { count } = await supabase
      .from('market_prices')
      .select('*', { count: 'exact', head: true })
      .gte('recorded_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    // If we have less than 1000 records for last 30 days, generate historical data
    if ((count || 0) < 1000) {
      console.log('Generating historical data...');
      const historicalRecords = [];
      
      for (let daysAgo = 1; daysAgo <= 30; daysAgo++) {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        
        for (const crop of cropData) {
          // Generate for 3-4 random markets per day to keep data realistic
          const shuffledMarkets = [...markets].sort(() => Math.random() - 0.5).slice(0, 4);
          
          for (const market of shuffledMarkets) {
            const price = generatePrice(crop.minPrice, crop.maxPrice);
            
            historicalRecords.push({
              crop_name: crop.name,
              market_name: market.name,
              district: market.district,
              price: price,
              unit: 'quintal',
              recorded_at: date.toISOString(),
            });
          }
        }
      }

      // Insert historical data in batches
      for (let i = 0; i < historicalRecords.length; i += batchSize) {
        const batch = historicalRecords.slice(i, i + batchSize);
        const { error } = await supabase
          .from('market_prices')
          .insert(batch);

        if (error) {
          console.error('Error inserting historical batch:', error);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Updated ${priceRecords.length} market prices for ${cropData.length} crops across ${markets.length} markets`,
        crops: cropData.length,
        markets: markets.length,
        totalRecords: priceRecords.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error updating market prices:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
