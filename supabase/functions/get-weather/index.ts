import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WeatherRequest {
  city: string;
  lat?: number;
  lon?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENWEATHERMAP_API_KEY = Deno.env.get('OPENWEATHERMAP_API_KEY');
    if (!OPENWEATHERMAP_API_KEY) {
      throw new Error('OPENWEATHERMAP_API_KEY is not configured');
    }

    const { city, lat, lon }: WeatherRequest = await req.json();

    let currentWeatherUrl: string;
    let forecastUrl: string;

    if (lat && lon) {
      currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
    } else if (city) {
      currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},IN&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)},IN&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
    } else {
      throw new Error('City name or coordinates required');
    }

    // Fetch current weather and forecast in parallel
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastUrl)
    ]);

    if (!currentResponse.ok) {
      const errorText = await currentResponse.text();
      console.error('Current weather API error:', errorText);
      throw new Error(`Weather API error: ${currentResponse.status}`);
    }

    if (!forecastResponse.ok) {
      const errorText = await forecastResponse.text();
      console.error('Forecast API error:', errorText);
      throw new Error(`Forecast API error: ${forecastResponse.status}`);
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    // Process current weather
    const current = {
      city: currentData.name,
      temp: Math.round(currentData.main.temp),
      feelsLike: Math.round(currentData.main.feels_like),
      humidity: currentData.main.humidity,
      pressure: currentData.main.pressure,
      windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
      visibility: Math.round((currentData.visibility || 10000) / 1000),
      condition: currentData.weather[0].main,
      description: currentData.weather[0].description,
      icon: currentData.weather[0].icon,
      sunrise: new Date(currentData.sys.sunrise * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
      sunset: new Date(currentData.sys.sunset * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
      uvIndex: 5, // OpenWeatherMap free tier doesn't include UV index
      country: currentData.sys.country,
      lat: currentData.coord.lat,
      lon: currentData.coord.lon
    };

    // Process 7-day forecast (OpenWeatherMap free tier provides 5-day/3-hour forecast)
    // Group by day and get daily high/low
    const dailyMap = new Map<string, { temps: number[], conditions: string[], icons: string[], rainChance: number[] }>();
    
    for (const item of forecastData.list) {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toISOString().split('T')[0];
      
      if (!dailyMap.has(dayKey)) {
        dailyMap.set(dayKey, { temps: [], conditions: [], icons: [], rainChance: [] });
      }
      
      const dayData = dailyMap.get(dayKey)!;
      dayData.temps.push(item.main.temp);
      dayData.conditions.push(item.weather[0].main);
      dayData.icons.push(item.weather[0].icon);
      dayData.rainChance.push((item.pop || 0) * 100);
    }

    const forecast = Array.from(dailyMap.entries())
      .slice(0, 7)
      .map(([dateStr, data], index) => {
        const date = new Date(dateStr);
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        return {
          day: index === 0 ? 'Today' : dayNames[date.getDay()],
          date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
          high: Math.round(Math.max(...data.temps)),
          low: Math.round(Math.min(...data.temps)),
          condition: data.conditions[Math.floor(data.conditions.length / 2)], // Middle of day condition
          icon: data.icons[Math.floor(data.icons.length / 2)],
          rainChance: Math.round(Math.max(...data.rainChance))
        };
      });

    return new Response(
      JSON.stringify({ current, forecast }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in get-weather function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
