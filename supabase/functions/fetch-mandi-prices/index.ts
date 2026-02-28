const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface DataGovRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  grade: string;
  arrival_date: string;
  min_price: string;
  max_price: string;
  modal_price: string;
}

interface DataGovResponse {
  status: string;
  message: string;
  total: number;
  count: number;
  records: DataGovRecord[];
}

// Map government crop names to our standardized names
const cropNameMapping: { [key: string]: string } = {
  'wheat': 'Wheat',
  'rice': 'Rice (Common)',
  'basmati rice': 'Rice (Basmati)',
  'paddy': 'Rice (Common)',
  'maize': 'Maize',
  'bajra': 'Bajra (Pearl Millet)',
  'jowar': 'Jowar (Sorghum)',
  'ragi': 'Ragi',
  'gram': 'Chana (Gram)',
  'chana': 'Chana (Gram)',
  'tur': 'Tur Dal (Arhar)',
  'arhar': 'Tur Dal (Arhar)',
  'moong': 'Moong Dal',
  'urad': 'Urad Dal',
  'masoor': 'Masoor Dal',
  'soyabean': 'Soybean',
  'soybean': 'Soybean',
  'groundnut': 'Groundnut',
  'mustard': 'Mustard',
  'sunflower': 'Sunflower',
  'sesame': 'Sesame (Til)',
  'til': 'Sesame (Til)',
  'onion': 'Onion',
  'potato': 'Potato',
  'tomato': 'Tomato',
  'garlic': 'Garlic',
  'ginger': 'Ginger',
  'green chilli': 'Green Chilli',
  'chilli': 'Green Chilli',
  'cabbage': 'Cabbage',
  'cauliflower': 'Cauliflower',
  'banana': 'Banana',
  'mango': 'Mango (Alphonso)',
  'orange': 'Orange',
  'pomegranate': 'Pomegranate',
  'grapes': 'Grapes',
  'apple': 'Apple',
  'turmeric': 'Turmeric',
  'red chilli': 'Red Chilli',
  'cumin': 'Cumin (Jeera)',
  'jeera': 'Cumin (Jeera)',
  'coriander': 'Coriander',
  'cotton': 'Cotton',
  'sugarcane': 'Sugarcane',
  'jute': 'Jute',
};

// Map districts to our supported cities
const districtMapping: { [key: string]: string } = {
  // Maharashtra
  'mumbai': 'Mumbai',
  'mumbai suburban': 'Mumbai',
  'pune': 'Pune',
  'nashik': 'Nashik',
  'nasik': 'Nashik',
  'nagpur': 'Nagpur',
  'aurangabad': 'Aurangabad',
  'solapur': 'Solapur',
  'kolhapur': 'Kolhapur',
  'sangli': 'Sangli',
  'satara': 'Satara',
  'ahmednagar': 'Ahmednagar',
  'jalgaon': 'Jalgaon',
  'latur': 'Latur',
  'nanded': 'Nanded',
  'amravati': 'Amravati',
  'akola': 'Akola',
  'buldhana': 'Buldhana',
  'wardha': 'Wardha',
  'yavatmal': 'Yavatmal',
  'ratnagiri': 'Ratnagiri',
  // Delhi & NCR
  'delhi': 'Delhi',
  'new delhi': 'Delhi',
  'gurgaon': 'Gurgaon',
  'gurugram': 'Gurgaon',
  'noida': 'Noida',
  'gautam buddha nagar': 'Noida',
  'faridabad': 'Faridabad',
  'ghaziabad': 'Ghaziabad',
  // Karnataka
  'bangalore': 'Bangalore',
  'bangalore urban': 'Bangalore',
  'bengaluru': 'Bangalore',
  'mysore': 'Mysore',
  'mysuru': 'Mysore',
  'hubli': 'Hubli',
  'dharwad': 'Hubli',
  'belgaum': 'Belgaum',
  'belagavi': 'Belgaum',
  'davangere': 'Davangere',
  'shimoga': 'Shimoga',
  'gulbarga': 'Gulbarga',
  'kalaburagi': 'Gulbarga',
  // Tamil Nadu
  'chennai': 'Chennai',
  'coimbatore': 'Coimbatore',
  'madurai': 'Madurai',
  'salem': 'Salem',
  'tiruchirappalli': 'Trichy',
  'trichy': 'Trichy',
  'erode': 'Erode',
  'tirunelveli': 'Tirunelveli',
  // Telangana & Andhra Pradesh
  'hyderabad': 'Hyderabad',
  'rangareddy': 'Hyderabad',
  'warangal': 'Warangal',
  'karimnagar': 'Karimnagar',
  'vijayawada': 'Vijayawada',
  'krishna': 'Vijayawada',
  'guntur': 'Guntur',
  'visakhapatnam': 'Visakhapatnam',
  'kurnool': 'Kurnool',
  // Gujarat
  'ahmedabad': 'Ahmedabad',
  'rajkot': 'Rajkot',
  'surat': 'Surat',
  'vadodara': 'Vadodara',
  'baroda': 'Vadodara',
  'junagadh': 'Junagadh',
  'mehsana': 'Mehsana',
  'bhavnagar': 'Bhavnagar',
  // Rajasthan
  'jaipur': 'Jaipur',
  'jodhpur': 'Jodhpur',
  'udaipur': 'Udaipur',
  'kota': 'Kota',
  'ajmer': 'Ajmer',
  'alwar': 'Alwar',
  'bikaner': 'Bikaner',
  'sri ganganagar': 'Sri Ganganagar',
  // Madhya Pradesh
  'indore': 'Indore',
  'bhopal': 'Bhopal',
  'jabalpur': 'Jabalpur',
  'gwalior': 'Gwalior',
  'ujjain': 'Ujjain',
  'dewas': 'Dewas',
  'sagar': 'Sagar',
  // Uttar Pradesh
  'lucknow': 'Lucknow',
  'kanpur': 'Kanpur',
  'kanpur nagar': 'Kanpur',
  'agra': 'Agra',
  'varanasi': 'Varanasi',
  'allahabad': 'Prayagraj',
  'prayagraj': 'Prayagraj',
  'meerut': 'Meerut',
  'bareilly': 'Bareilly',
  'gorakhpur': 'Gorakhpur',
  'mathura': 'Mathura',
  // Punjab & Haryana
  'ludhiana': 'Ludhiana',
  'amritsar': 'Amritsar',
  'jalandhar': 'Jalandhar',
  'patiala': 'Patiala',
  'bathinda': 'Bathinda',
  'karnal': 'Karnal',
  'hisar': 'Hisar',
  'ambala': 'Ambala',
  'sirsa': 'Sirsa',
  // West Bengal & East
  'kolkata': 'Kolkata',
  'howrah': 'Kolkata',
  'hooghly': 'Hooghly',
  'burdwan': 'Burdwan',
  'bardhaman': 'Burdwan',
  'midnapore': 'Midnapore',
  'patna': 'Patna',
  'muzaffarpur': 'Muzaffarpur',
  'ranchi': 'Ranchi',
  // Kerala & Others
  'ernakulam': 'Kochi',
  'kochi': 'Kochi',
  'thiruvananthapuram': 'Thiruvananthapuram',
  'kozhikode': 'Kozhikode',
  'raipur': 'Raipur',
  'chandigarh': 'Chandigarh',
  'dehradun': 'Dehradun',
  'jammu': 'Jammu',
  'srinagar': 'Srinagar',
  'guwahati': 'Guwahati',
  'kamrup': 'Guwahati',
  'bhubaneswar': 'Bhubaneswar',
  'khordha': 'Bhubaneswar',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('DATA_GOV_IN_API_KEY');
    if (!apiKey) {
      console.error('DATA_GOV_IN_API_KEY not configured');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'API key not configured',
          source: 'config'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, commodity, state, limit = 500 } = await req.json();
    
    // Resource ID for Current Daily Price of Various Commodities
    const resourceId = '9ef84268-d588-465a-a308-a864a43d0070';
    const baseUrl = 'https://api.data.gov.in/resource';
    
    // Build URL with filters
    let url = `${baseUrl}/${resourceId}?api-key=${apiKey}&format=json&limit=${limit}`;
    
    if (commodity) {
      url += `&filters[commodity]=${encodeURIComponent(commodity)}`;
    }
    if (state) {
      url += `&filters[state]=${encodeURIComponent(state)}`;
    }

    console.log('Fetching from data.gov.in API...');
    
    // Retry logic for network issues
    let response: Response | null = null;
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'KrishiConnect/1.0',
          },
        });
        break; // Success, exit retry loop
      } catch (fetchError) {
        lastError = fetchError instanceof Error ? fetchError : new Error(String(fetchError));
        console.log(`Attempt ${attempt} failed: ${lastError.message}`);
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        }
      }
    }
    
    if (!response) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Network error after 3 attempts: ${lastError?.message}`,
          source: 'network'
        }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('data.gov.in API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `API request failed: ${response.status}`,
          details: errorText,
          source: 'api'
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data: DataGovResponse = await response.json();
    
    if (data.status !== 'ok' || !data.records) {
      console.error('Invalid response from data.gov.in:', data);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: data.message || 'Invalid API response',
          source: 'api'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Received ${data.records.length} records from data.gov.in`);

    // Process and normalize the data
    const processedRecords = data.records
      .map(record => {
        const commodityLower = record.commodity?.toLowerCase() || '';
        const districtLower = record.district?.toLowerCase() || '';
        
        // Find matching crop name
        let cropName = null;
        for (const [key, value] of Object.entries(cropNameMapping)) {
          if (commodityLower.includes(key)) {
            cropName = value;
            break;
          }
        }
        
        // Find matching district
        let district = null;
        for (const [key, value] of Object.entries(districtMapping)) {
          if (districtLower.includes(key)) {
            district = value;
            break;
          }
        }
        
        if (!cropName || !district) return null;
        
        const modalPrice = parseFloat(record.modal_price) || 0;
        if (modalPrice <= 0) return null;
        
        return {
          crop_name: cropName,
          market_name: record.market || 'Main Mandi',
          district: district,
          price: modalPrice,
          min_price: parseFloat(record.min_price) || modalPrice,
          max_price: parseFloat(record.max_price) || modalPrice,
          arrival_date: record.arrival_date,
          variety: record.variety,
          unit: 'quintal',
          source: 'data.gov.in'
        };
      })
      .filter((record): record is NonNullable<typeof record> => record !== null);

    console.log(`Processed ${processedRecords.length} matching records`);

    // If action is 'sync', also update the database
    if (action === 'sync') {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (supabaseUrl && supabaseKey) {
        const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        const now = new Date().toISOString();
        const priceRecords = processedRecords.map(record => ({
          crop_name: record.crop_name,
          market_name: record.market_name,
          district: record.district,
          price: record.price,
          unit: record.unit,
          recorded_at: now,
        }));
        
        if (priceRecords.length > 0) {
          const { error: insertError } = await supabase
            .from('market_prices')
            .insert(priceRecords);
          
          if (insertError) {
            console.error('Error inserting prices:', insertError);
          } else {
            console.log(`Synced ${priceRecords.length} prices to database`);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        total: data.total,
        count: processedRecords.length,
        records: processedRecords,
        source: 'data.gov.in',
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching mandi prices:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        source: 'server'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
