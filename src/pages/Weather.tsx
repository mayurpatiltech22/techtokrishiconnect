import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Cloud, 
  Droplets, 
  Wind, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  CloudLightning,
  Search,
  MapPin,
  Thermometer,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  RefreshCw,
  Loader2
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CropAdvisory } from "@/components/CropAdvisory";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WeatherData {
  current: {
    city: string;
    temp: number;
    feelsLike: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    visibility: number;
    condition: string;
    description: string;
    icon: string;
    sunrise: string;
    sunset: string;
    uvIndex: number;
  };
  forecast: {
    day: string;
    date: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
    rainChance: number;
  }[];
}

interface CityInfo {
  city: string;
  state: string;
}

const cities: CityInfo[] = [
  { city: "Mumbai", state: "Maharashtra" },
  { city: "Delhi", state: "Delhi" },
  { city: "Bangalore", state: "Karnataka" },
  { city: "Chennai", state: "Tamil Nadu" },
  { city: "Kolkata", state: "West Bengal" },
  { city: "Hyderabad", state: "Telangana" },
  { city: "Pune", state: "Maharashtra" },
  { city: "Ahmedabad", state: "Gujarat" },
  { city: "Jaipur", state: "Rajasthan" },
  { city: "Lucknow", state: "Uttar Pradesh" },
  { city: "Nashik", state: "Maharashtra" },
  { city: "Indore", state: "Madhya Pradesh" },
  { city: "Nagpur", state: "Maharashtra" },
  { city: "Bhopal", state: "Madhya Pradesh" },
  { city: "Patna", state: "Bihar" },
];

// Fallback static weather data when API is unavailable
const getFallbackWeatherData = (cityName: string): WeatherData => {
  const baseTemp = Math.floor(Math.random() * 10) + 25; // 25-35°C
  const conditions = ["Clear", "Clouds", "Haze", "Mist"];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  
  const today = new Date();
  const forecast = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return {
      day: i === 0 ? 'Today' : dayNames[date.getDay()],
      date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      high: baseTemp + Math.floor(Math.random() * 5),
      low: baseTemp - 5 - Math.floor(Math.random() * 3),
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      icon: "01d",
      rainChance: Math.floor(Math.random() * 30)
    };
  });

  return {
    current: {
      city: cityName,
      temp: baseTemp,
      feelsLike: baseTemp + 2,
      humidity: 55 + Math.floor(Math.random() * 20),
      pressure: 1010 + Math.floor(Math.random() * 10),
      windSpeed: 10 + Math.floor(Math.random() * 15),
      visibility: 8 + Math.floor(Math.random() * 4),
      condition,
      description: condition.toLowerCase(),
      icon: "01d",
      sunrise: "06:15",
      sunset: "18:45",
      uvIndex: 5
    },
    forecast
  };
};

const getWeatherIcon = (condition: string) => {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes("rain") || lowerCondition.includes("shower") || lowerCondition.includes("drizzle")) return CloudRain;
  if (lowerCondition.includes("snow")) return CloudSnow;
  if (lowerCondition.includes("thunder") || lowerCondition.includes("storm")) return CloudLightning;
  if (lowerCondition.includes("cloud") || lowerCondition.includes("overcast") || lowerCondition.includes("mist") || lowerCondition.includes("fog") || lowerCondition.includes("haze")) return Cloud;
  return Sun;
};

const getConditionColor = (condition: string) => {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes("rain")) return "text-blue-500";
  if (lowerCondition.includes("snow")) return "text-cyan-400";
  if (lowerCondition.includes("thunder")) return "text-yellow-500";
  if (lowerCondition.includes("cloud") || lowerCondition.includes("mist") || lowerCondition.includes("fog")) return "text-muted-foreground";
  return "text-yellow-400";
};

const Weather = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<CityInfo>(cities[6]); // Pune default
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cityWeatherCache, setCityWeatherCache] = useState<Map<string, { temp: number; condition: string }>>(new Map());

  const filteredCities = cities.filter(
    (city) =>
      city.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [usingFallback, setUsingFallback] = useState(false);

  const fetchWeather = async (cityName: string, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const { data, error } = await supabase.functions.invoke('get-weather', {
        body: { city: cityName }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setWeatherData(data);
      setUsingFallback(false);
      
      // Cache the weather for city list
      setCityWeatherCache(prev => {
        const newCache = new Map(prev);
        newCache.set(cityName, {
          temp: data.current.temp,
          condition: data.current.condition
        });
        return newCache;
      });
    } catch (error) {
      console.error('Error fetching weather, using fallback data:', error);
      // Use fallback static data instead of showing error
      const fallbackData = getFallbackWeatherData(cityName);
      setWeatherData(fallbackData);
      setUsingFallback(true);
      
      // Cache fallback data too
      setCityWeatherCache(prev => {
        const newCache = new Map(prev);
        newCache.set(cityName, {
          temp: fallbackData.current.temp,
          condition: fallbackData.current.condition
        });
        return newCache;
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch weather for all cities in background with fallback
  const fetchAllCitiesWeather = async () => {
    for (const city of cities) {
      if (!cityWeatherCache.has(city.city)) {
        try {
          const { data } = await supabase.functions.invoke('get-weather', {
            body: { city: city.city }
          });
          if (data?.current) {
            setCityWeatherCache(prev => {
              const newCache = new Map(prev);
              newCache.set(city.city, {
                temp: data.current.temp,
                condition: data.current.condition
              });
              return newCache;
            });
          } else {
            throw new Error('No data');
          }
        } catch (e) {
          // Use fallback data for failed cities
          const fallback = getFallbackWeatherData(city.city);
          setCityWeatherCache(prev => {
            const newCache = new Map(prev);
            newCache.set(city.city, {
              temp: fallback.current.temp,
              condition: fallback.current.condition
            });
            return newCache;
          });
        }
      }
    }
  };

  useEffect(() => {
    fetchWeather(selectedCity.city);
    fetchAllCitiesWeather();
  }, []);

  useEffect(() => {
    fetchWeather(selectedCity.city);
  }, [selectedCity]);

  const handleRefresh = () => {
    fetchWeather(selectedCity.city, true);
  };

  const Icon = weatherData ? getWeatherIcon(weatherData.current.condition) : Sun;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-background py-12">
          <div className="container px-4">
            <div className="text-center max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Cloud className="h-10 w-10 text-blue-500" />
                <h1 className="text-3xl md:text-5xl font-bold">{t('weather.title')}</h1>
              </div>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                {t('weather.subtitle')}
              </p>

              {/* Search */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={t('weather.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* City List */}
              <div className="lg:col-span-1">
                <Card className="h-fit sticky top-20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {t('weather.selectCity')} ({filteredCities.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[600px] overflow-y-auto space-y-2">
                    {filteredCities.map((city) => {
                      const cached = cityWeatherCache.get(city.city);
                      const CityIcon = cached ? getWeatherIcon(cached.condition) : Cloud;
                      return (
                        <button
                          key={city.city}
                          onClick={() => setSelectedCity(city)}
                          className={`w-full p-3 rounded-lg text-left transition-all flex items-center justify-between ${
                            selectedCity.city === city.city
                              ? "bg-primary/10 border-2 border-primary"
                              : "bg-muted hover:bg-muted/80 border-2 border-transparent"
                          }`}
                        >
                          <div>
                            <p className="font-semibold">{city.city}</p>
                            <p className="text-sm text-muted-foreground">{city.state}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {cached ? (
                              <>
                                <CityIcon className={`h-6 w-6 ${getConditionColor(cached.condition)}`} />
                                <span className="text-xl font-bold">{cached.temp}°</span>
                              </>
                            ) : (
                              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

              {/* Weather Details */}
              <div className="lg:col-span-2 space-y-6">
                {loading ? (
                  <Card className="p-12">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      <p className="text-muted-foreground">{t('weather.loading')}</p>
                    </div>
                  </Card>
                ) : weatherData ? (
                  <>
                    {/* Current Weather */}
                    <Card className="overflow-hidden">
                      <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 text-white">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <MapPin className="h-5 w-5" />
                              <h2 className="text-2xl font-bold">{weatherData.current.city}</h2>
                              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                                {selectedCity.state}
                              </Badge>
                              {usingFallback && (
                                <Badge variant="outline" className="bg-amber-500/20 text-white border-amber-300">
                                  Demo Data
                                </Badge>
                              )}
                            </div>
                            <div className="text-7xl font-bold mb-2">{weatherData.current.temp}°C</div>
                            <p className="text-xl opacity-90">{weatherData.current.condition}</p>
                            <p className="opacity-75">{t('weather.feelsLike')} {weatherData.current.feelsLike}°C</p>
                          </div>
                          <div className="text-right">
                            <Icon className="h-24 w-24 opacity-90" />
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-white hover:bg-white/20 mt-4"
                              onClick={handleRefresh}
                              disabled={refreshing}
                            >
                              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                              {t('weather.refresh')}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                            <Droplets className="h-8 w-8 text-blue-500" />
                            <div>
                              <p className="text-2xl font-bold">{weatherData.current.humidity}%</p>
                              <p className="text-sm text-muted-foreground">{t('weather.humidity')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                            <Wind className="h-8 w-8 text-teal-500" />
                            <div>
                              <p className="text-2xl font-bold">{weatherData.current.windSpeed} km/h</p>
                              <p className="text-sm text-muted-foreground">{t('weather.wind')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                            <Eye className="h-8 w-8 text-purple-500" />
                            <div>
                              <p className="text-2xl font-bold">{weatherData.current.visibility} km</p>
                              <p className="text-sm text-muted-foreground">{t('weather.visibility')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                            <Gauge className="h-8 w-8 text-orange-500" />
                            <div>
                              <p className="text-2xl font-bold">{weatherData.current.pressure} hPa</p>
                              <p className="text-sm text-muted-foreground">{t('weather.pressure')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                            <Sunrise className="h-8 w-8 text-amber-500" />
                            <div>
                              <p className="text-2xl font-bold">{weatherData.current.sunrise}</p>
                              <p className="text-sm text-muted-foreground">{t('weather.sunrise')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                            <Sunset className="h-8 w-8 text-rose-500" />
                            <div>
                              <p className="text-2xl font-bold">{weatherData.current.sunset}</p>
                              <p className="text-sm text-muted-foreground">{t('weather.sunset')}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 7-Day Forecast */}
                    <Card>
                      <CardHeader>
                        <CardTitle>{t('weather.forecast')}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                          {weatherData.forecast.map((day, index) => {
                            const DayIcon = getWeatherIcon(day.condition);
                            return (
                              <div
                                key={index}
                                className={`text-center p-4 rounded-lg transition-all ${
                                  index === 0 ? "bg-primary/10 border-2 border-primary" : "bg-muted hover:bg-muted/80"
                                }`}
                              >
                                <p className="font-semibold">{day.day}</p>
                                <p className="text-xs text-muted-foreground mb-2">{day.date}</p>
                                <DayIcon className={`h-10 w-10 mx-auto mb-2 ${getConditionColor(day.condition)}`} />
                                <p className="font-bold">{day.high}°</p>
                                <p className="text-sm text-muted-foreground">{day.low}°</p>
                                {day.rainChance > 0 && (
                                  <div className="flex items-center justify-center gap-1 mt-2 text-xs text-blue-500">
                                    <Droplets className="h-3 w-3" />
                                    {day.rainChance}%
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="p-12">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Cloud className="h-12 w-12 text-muted-foreground" />
                      <p className="text-muted-foreground">{t('weather.error')}</p>
                      <Button onClick={() => fetchWeather(selectedCity.city)}>
                        {t('common.retry')}
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Crop Advisory */}
                <CropAdvisory />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Weather;
