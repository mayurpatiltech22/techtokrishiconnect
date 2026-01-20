import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Leaf, 
  TrendingUp, 
  CloudSun, 
  IndianRupee,
  Calendar,
  Sparkles,
  ThermometerSun,
  Droplets
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface CropRecommendation {
  crop: string;
  cropHi: string;
  cropMr: string;
  weatherScore: number;
  marketDemand: 'high' | 'medium' | 'low';
  profitPotential: 'high' | 'medium' | 'low';
  bestSowingTime: string;
  currentPrice: number;
  priceChange: number;
  reasons: string[];
  reasonsHi: string[];
  reasonsMr: string[];
}

interface WeatherData {
  temp: number;
  humidity: number;
  condition: string;
}

const cropDatabase = [
  {
    crop: 'Wheat',
    cropHi: 'गेहूं',
    cropMr: 'गहू',
    idealTempMin: 10,
    idealTempMax: 25,
    idealHumidity: 50,
    season: 'rabi',
    sowingMonths: [10, 11, 12],
  },
  {
    crop: 'Rice',
    cropHi: 'चावल',
    cropMr: 'तांदूळ',
    idealTempMin: 20,
    idealTempMax: 35,
    idealHumidity: 70,
    season: 'kharif',
    sowingMonths: [6, 7],
  },
  {
    crop: 'Cotton',
    cropHi: 'कपास',
    cropMr: 'कापूस',
    idealTempMin: 21,
    idealTempMax: 35,
    idealHumidity: 50,
    season: 'kharif',
    sowingMonths: [4, 5, 6],
  },
  {
    crop: 'Soybean',
    cropHi: 'सोयाबीन',
    cropMr: 'सोयाबीन',
    idealTempMin: 20,
    idealTempMax: 30,
    idealHumidity: 60,
    season: 'kharif',
    sowingMonths: [6, 7],
  },
  {
    crop: 'Sugarcane',
    cropHi: 'गन्ना',
    cropMr: 'ऊस',
    idealTempMin: 20,
    idealTempMax: 35,
    idealHumidity: 70,
    season: 'annual',
    sowingMonths: [1, 2, 3, 10, 11],
  },
  {
    crop: 'Onion',
    cropHi: 'प्याज',
    cropMr: 'कांदा',
    idealTempMin: 13,
    idealTempMax: 24,
    idealHumidity: 40,
    season: 'rabi',
    sowingMonths: [10, 11, 12],
  },
  {
    crop: 'Tomato',
    cropHi: 'टमाटर',
    cropMr: 'टोमॅटो',
    idealTempMin: 18,
    idealTempMax: 27,
    idealHumidity: 50,
    season: 'all',
    sowingMonths: [1, 2, 6, 7, 9, 10],
  },
  {
    crop: 'Potato',
    cropHi: 'आलू',
    cropMr: 'बटाटा',
    idealTempMin: 15,
    idealTempMax: 25,
    idealHumidity: 60,
    season: 'rabi',
    sowingMonths: [10, 11],
  },
  {
    crop: 'Groundnut',
    cropHi: 'मूंगफली',
    cropMr: 'भुईमूग',
    idealTempMin: 22,
    idealTempMax: 30,
    idealHumidity: 50,
    season: 'kharif',
    sowingMonths: [6, 7],
  },
  {
    crop: 'Maize',
    cropHi: 'मक्का',
    cropMr: 'मका',
    idealTempMin: 18,
    idealTempMax: 32,
    idealHumidity: 55,
    season: 'kharif',
    sowingMonths: [6, 7],
  },
];

const cities = [
  { name: 'Mumbai', state: 'Maharashtra' },
  { name: 'Pune', state: 'Maharashtra' },
  { name: 'Nashik', state: 'Maharashtra' },
  { name: 'Nagpur', state: 'Maharashtra' },
  { name: 'Delhi', state: 'Delhi' },
  { name: 'Jaipur', state: 'Rajasthan' },
  { name: 'Lucknow', state: 'Uttar Pradesh' },
  { name: 'Indore', state: 'Madhya Pradesh' },
  { name: 'Hyderabad', state: 'Telangana' },
  { name: 'Bangalore', state: 'Karnataka' },
];

export const CropAdvisory = () => {
  const { t, language } = useLanguage();
  const [selectedCity, setSelectedCity] = useState('Pune');
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, [selectedCity]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      // Fetch weather data
      const weatherResponse = await supabase.functions.invoke('get-weather', {
        body: { city: selectedCity }
      });

      let weather: WeatherData = { temp: 25, humidity: 50, condition: 'Clear' };
      
      if (weatherResponse.data?.current) {
        weather = {
          temp: weatherResponse.data.current.temp,
          humidity: weatherResponse.data.current.humidity,
          condition: weatherResponse.data.current.condition
        };
        setWeatherData(weather);
      }

      // Fetch market prices
      const { data: priceData } = await supabase
        .from('market_prices')
        .select('crop_name, price, recorded_at')
        .order('recorded_at', { ascending: false });

      // Calculate price trends
      const priceTrends = new Map<string, { current: number; change: number }>();
      
      if (priceData) {
        const cropPrices = new Map<string, number[]>();
        priceData.forEach(p => {
          const prices = cropPrices.get(p.crop_name) || [];
          prices.push(p.price);
          cropPrices.set(p.crop_name, prices);
        });

        cropPrices.forEach((prices, crop) => {
          const current = prices[0] || 0;
          const previous = prices[prices.length > 7 ? 7 : prices.length - 1] || current;
          const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;
          priceTrends.set(crop, { current, change });
        });
      }

      // Generate recommendations
      const currentMonth = new Date().getMonth() + 1;
      const recs: CropRecommendation[] = cropDatabase.map(crop => {
        // Weather score calculation
        let weatherScore = 100;
        if (weather.temp < crop.idealTempMin) {
          weatherScore -= (crop.idealTempMin - weather.temp) * 5;
        }
        if (weather.temp > crop.idealTempMax) {
          weatherScore -= (weather.temp - crop.idealTempMax) * 5;
        }
        const humidityDiff = Math.abs(weather.humidity - crop.idealHumidity);
        weatherScore -= humidityDiff * 0.5;
        weatherScore = Math.max(0, Math.min(100, weatherScore));

        // Sowing time bonus
        if (crop.sowingMonths.includes(currentMonth)) {
          weatherScore = Math.min(100, weatherScore + 15);
        }

        const priceInfo = priceTrends.get(crop.crop) || { current: 2000, change: 0 };
        
        // Market demand based on price trends
        let marketDemand: 'high' | 'medium' | 'low' = 'medium';
        if (priceInfo.change > 5) marketDemand = 'high';
        else if (priceInfo.change < -5) marketDemand = 'low';

        // Profit potential
        let profitPotential: 'high' | 'medium' | 'low' = 'medium';
        if (weatherScore > 70 && marketDemand === 'high') profitPotential = 'high';
        else if (weatherScore < 50 || marketDemand === 'low') profitPotential = 'low';

        // Generate reasons
        const reasons: string[] = [];
        const reasonsHi: string[] = [];
        const reasonsMr: string[] = [];

        if (weatherScore > 70) {
          reasons.push('Current weather conditions are ideal');
          reasonsHi.push('वर्तमान मौसम की स्थिति आदर्श है');
          reasonsMr.push('सध्याची हवामान परिस्थिती आदर्श आहे');
        }
        if (crop.sowingMonths.includes(currentMonth)) {
          reasons.push('Best sowing season');
          reasonsHi.push('बुवाई का सबसे अच्छा मौसम');
          reasonsMr.push('पेरणीचा सर्वोत्तम हंगाम');
        }
        if (marketDemand === 'high') {
          reasons.push('Rising market prices');
          reasonsHi.push('बढ़ते बाजार भाव');
          reasonsMr.push('वाढते बाजारभाव');
        }

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const sowingTimeStr = crop.sowingMonths.map(m => monthNames[m - 1]).join(', ');

        return {
          crop: crop.crop,
          cropHi: crop.cropHi,
          cropMr: crop.cropMr,
          weatherScore,
          marketDemand,
          profitPotential,
          bestSowingTime: sowingTimeStr,
          currentPrice: priceInfo.current,
          priceChange: priceInfo.change,
          reasons,
          reasonsHi,
          reasonsMr
        };
      });

      // Sort by combined score and take top 5
      recs.sort((a, b) => {
        const scoreA = a.weatherScore + (a.marketDemand === 'high' ? 30 : a.marketDemand === 'medium' ? 15 : 0);
        const scoreB = b.weatherScore + (b.marketDemand === 'high' ? 30 : b.marketDemand === 'medium' ? 15 : 0);
        return scoreB - scoreA;
      });

      setRecommendations(recs.slice(0, 5));
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCropName = (rec: CropRecommendation) => {
    if (language === 'hi') return rec.cropHi;
    if (language === 'mr') return rec.cropMr;
    return rec.crop;
  };

  const getReasons = (rec: CropRecommendation) => {
    if (language === 'hi') return rec.reasonsHi;
    if (language === 'mr') return rec.reasonsMr;
    return rec.reasons;
  };

  const getDemandBadge = (demand: string) => {
    const colors = {
      high: 'bg-green-500/10 text-green-600 border-green-500/20',
      medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
      low: 'bg-red-500/10 text-red-600 border-red-500/20'
    };
    return colors[demand as keyof typeof colors] || colors.medium;
  };

  return (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">{t('advisory.title')}</CardTitle>
              <p className="text-sm text-muted-foreground">{t('advisory.subtitle')}</p>
            </div>
          </div>
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t('advisory.selectCity')} />
            </SelectTrigger>
            <SelectContent>
              {cities.map(city => (
                <SelectItem key={city.name} value={city.name}>
                  {city.name}, {city.state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {weatherData && (
          <div className="flex items-center gap-4 mt-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <ThermometerSun className="h-5 w-5 text-orange-500" />
              <span className="font-medium">{weatherData.temp}°C</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              <span>{weatherData.humidity}%</span>
            </div>
            <Badge variant="secondary">{weatherData.condition}</Badge>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">{t('common.loading')}</span>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div
                key={rec.crop}
                className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{getCropName(rec)}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getDemandBadge(rec.marketDemand)}>
                          {t(`advisory.${rec.marketDemand}`)} {t('advisory.marketDemand')}
                        </Badge>
                        <Badge className={getDemandBadge(rec.profitPotential)}>
                          {t(`advisory.${rec.profitPotential}`)} {t('advisory.profitPotential')}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <CloudSun className="h-4 w-4 text-primary" />
                      <span className="font-medium">{Math.round(rec.weatherScore)}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="h-4 w-4" />
                      <span>₹{rec.currentPrice}</span>
                      <span className={rec.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                        ({rec.priceChange >= 0 ? '+' : ''}{rec.priceChange.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {getReasons(rec).map((reason, i) => (
                    <span key={i} className="text-sm text-muted-foreground flex items-center gap-1">
                      <Leaf className="h-3 w-3 text-green-500" />
                      {reason}
                    </span>
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{t('advisory.bestTime')}: {rec.bestSowingTime}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
