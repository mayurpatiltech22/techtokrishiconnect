import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Calendar,
  RefreshCw
} from "lucide-react";

interface CityWeather {
  city: string;
  state: string;
  temp: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  forecast: {
    day: string;
    date: string;
    high: number;
    low: number;
    condition: string;
    rainChance: number;
  }[];
}

const getWeatherIcon = (condition: string) => {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes("rain") || lowerCondition.includes("shower")) return CloudRain;
  if (lowerCondition.includes("snow")) return CloudSnow;
  if (lowerCondition.includes("thunder") || lowerCondition.includes("storm")) return CloudLightning;
  if (lowerCondition.includes("cloud") || lowerCondition.includes("overcast")) return Cloud;
  return Sun;
};

const getConditionColor = (condition: string) => {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes("rain")) return "text-blue-500";
  if (lowerCondition.includes("snow")) return "text-cyan-400";
  if (lowerCondition.includes("thunder")) return "text-yellow-500";
  if (lowerCondition.includes("cloud")) return "text-gray-500";
  return "text-yellow-400";
};

// Simulated weather data for major Indian cities
const citiesWeatherData: CityWeather[] = [
  {
    city: "Mumbai",
    state: "Maharashtra",
    temp: 32,
    feelsLike: 36,
    condition: "Partly Cloudy",
    humidity: 75,
    windSpeed: 18,
    visibility: 8,
    pressure: 1008,
    uvIndex: 7,
    sunrise: "06:15",
    sunset: "18:45",
    forecast: [
      { day: "Today", date: "Jan 17", high: 32, low: 24, condition: "Partly Cloudy", rainChance: 20 },
      { day: "Sat", date: "Jan 18", high: 31, low: 23, condition: "Sunny", rainChance: 10 },
      { day: "Sun", date: "Jan 19", high: 30, low: 22, condition: "Cloudy", rainChance: 40 },
      { day: "Mon", date: "Jan 20", high: 29, low: 23, condition: "Light Rain", rainChance: 60 },
      { day: "Tue", date: "Jan 21", high: 30, low: 24, condition: "Partly Cloudy", rainChance: 30 },
      { day: "Wed", date: "Jan 22", high: 31, low: 24, condition: "Sunny", rainChance: 15 },
      { day: "Thu", date: "Jan 23", high: 32, low: 25, condition: "Sunny", rainChance: 10 }
    ]
  },
  {
    city: "Delhi",
    state: "Delhi",
    temp: 18,
    feelsLike: 16,
    condition: "Foggy",
    humidity: 85,
    windSpeed: 8,
    visibility: 2,
    pressure: 1018,
    uvIndex: 3,
    sunrise: "07:10",
    sunset: "17:50",
    forecast: [
      { day: "Today", date: "Jan 17", high: 18, low: 8, condition: "Foggy", rainChance: 5 },
      { day: "Sat", date: "Jan 18", high: 19, low: 7, condition: "Hazy", rainChance: 0 },
      { day: "Sun", date: "Jan 19", high: 20, low: 9, condition: "Sunny", rainChance: 0 },
      { day: "Mon", date: "Jan 20", high: 21, low: 10, condition: "Clear", rainChance: 0 },
      { day: "Tue", date: "Jan 21", high: 20, low: 9, condition: "Partly Cloudy", rainChance: 10 },
      { day: "Wed", date: "Jan 22", high: 19, low: 8, condition: "Foggy", rainChance: 5 },
      { day: "Thu", date: "Jan 23", high: 18, low: 7, condition: "Cold", rainChance: 5 }
    ]
  },
  {
    city: "Bangalore",
    state: "Karnataka",
    temp: 26,
    feelsLike: 27,
    condition: "Sunny",
    humidity: 55,
    windSpeed: 12,
    visibility: 10,
    pressure: 1012,
    uvIndex: 8,
    sunrise: "06:40",
    sunset: "18:20",
    forecast: [
      { day: "Today", date: "Jan 17", high: 26, low: 16, condition: "Sunny", rainChance: 5 },
      { day: "Sat", date: "Jan 18", high: 27, low: 17, condition: "Sunny", rainChance: 0 },
      { day: "Sun", date: "Jan 19", high: 28, low: 18, condition: "Partly Cloudy", rainChance: 15 },
      { day: "Mon", date: "Jan 20", high: 27, low: 17, condition: "Cloudy", rainChance: 30 },
      { day: "Tue", date: "Jan 21", high: 26, low: 16, condition: "Light Rain", rainChance: 45 },
      { day: "Wed", date: "Jan 22", high: 25, low: 16, condition: "Showers", rainChance: 55 },
      { day: "Thu", date: "Jan 23", high: 26, low: 17, condition: "Partly Cloudy", rainChance: 25 }
    ]
  },
  {
    city: "Chennai",
    state: "Tamil Nadu",
    temp: 30,
    feelsLike: 34,
    condition: "Humid",
    humidity: 80,
    windSpeed: 15,
    visibility: 9,
    pressure: 1010,
    uvIndex: 9,
    sunrise: "06:25",
    sunset: "18:10",
    forecast: [
      { day: "Today", date: "Jan 17", high: 30, low: 22, condition: "Humid", rainChance: 25 },
      { day: "Sat", date: "Jan 18", high: 31, low: 23, condition: "Sunny", rainChance: 15 },
      { day: "Sun", date: "Jan 19", high: 31, low: 23, condition: "Hot", rainChance: 10 },
      { day: "Mon", date: "Jan 20", high: 32, low: 24, condition: "Sunny", rainChance: 5 },
      { day: "Tue", date: "Jan 21", high: 31, low: 23, condition: "Partly Cloudy", rainChance: 20 },
      { day: "Wed", date: "Jan 22", high: 30, low: 22, condition: "Cloudy", rainChance: 35 },
      { day: "Thu", date: "Jan 23", high: 29, low: 22, condition: "Light Rain", rainChance: 50 }
    ]
  },
  {
    city: "Kolkata",
    state: "West Bengal",
    temp: 22,
    feelsLike: 23,
    condition: "Hazy",
    humidity: 70,
    windSpeed: 10,
    visibility: 5,
    pressure: 1014,
    uvIndex: 5,
    sunrise: "06:20",
    sunset: "17:25",
    forecast: [
      { day: "Today", date: "Jan 17", high: 22, low: 14, condition: "Hazy", rainChance: 10 },
      { day: "Sat", date: "Jan 18", high: 23, low: 15, condition: "Sunny", rainChance: 5 },
      { day: "Sun", date: "Jan 19", high: 24, low: 16, condition: "Clear", rainChance: 0 },
      { day: "Mon", date: "Jan 20", high: 25, low: 16, condition: "Sunny", rainChance: 0 },
      { day: "Tue", date: "Jan 21", high: 24, low: 15, condition: "Partly Cloudy", rainChance: 15 },
      { day: "Wed", date: "Jan 22", high: 23, low: 14, condition: "Cloudy", rainChance: 25 },
      { day: "Thu", date: "Jan 23", high: 22, low: 13, condition: "Light Rain", rainChance: 40 }
    ]
  },
  {
    city: "Hyderabad",
    state: "Telangana",
    temp: 28,
    feelsLike: 29,
    condition: "Clear",
    humidity: 50,
    windSpeed: 14,
    visibility: 10,
    pressure: 1013,
    uvIndex: 7,
    sunrise: "06:35",
    sunset: "18:05",
    forecast: [
      { day: "Today", date: "Jan 17", high: 28, low: 17, condition: "Clear", rainChance: 5 },
      { day: "Sat", date: "Jan 18", high: 29, low: 18, condition: "Sunny", rainChance: 0 },
      { day: "Sun", date: "Jan 19", high: 30, low: 19, condition: "Hot", rainChance: 0 },
      { day: "Mon", date: "Jan 20", high: 29, low: 18, condition: "Sunny", rainChance: 5 },
      { day: "Tue", date: "Jan 21", high: 28, low: 17, condition: "Partly Cloudy", rainChance: 20 },
      { day: "Wed", date: "Jan 22", high: 27, low: 17, condition: "Cloudy", rainChance: 35 },
      { day: "Thu", date: "Jan 23", high: 28, low: 18, condition: "Clear", rainChance: 10 }
    ]
  },
  {
    city: "Pune",
    state: "Maharashtra",
    temp: 29,
    feelsLike: 30,
    condition: "Sunny",
    humidity: 45,
    windSpeed: 16,
    visibility: 10,
    pressure: 1011,
    uvIndex: 8,
    sunrise: "06:55",
    sunset: "18:25",
    forecast: [
      { day: "Today", date: "Jan 17", high: 29, low: 14, condition: "Sunny", rainChance: 5 },
      { day: "Sat", date: "Jan 18", high: 30, low: 15, condition: "Clear", rainChance: 0 },
      { day: "Sun", date: "Jan 19", high: 31, low: 16, condition: "Sunny", rainChance: 0 },
      { day: "Mon", date: "Jan 20", high: 30, low: 15, condition: "Partly Cloudy", rainChance: 15 },
      { day: "Tue", date: "Jan 21", high: 29, low: 14, condition: "Cloudy", rainChance: 25 },
      { day: "Wed", date: "Jan 22", high: 28, low: 14, condition: "Light Rain", rainChance: 40 },
      { day: "Thu", date: "Jan 23", high: 29, low: 15, condition: "Partly Cloudy", rainChance: 20 }
    ]
  },
  {
    city: "Ahmedabad",
    state: "Gujarat",
    temp: 27,
    feelsLike: 27,
    condition: "Clear",
    humidity: 40,
    windSpeed: 12,
    visibility: 10,
    pressure: 1015,
    uvIndex: 7,
    sunrise: "07:15",
    sunset: "18:15",
    forecast: [
      { day: "Today", date: "Jan 17", high: 27, low: 13, condition: "Clear", rainChance: 0 },
      { day: "Sat", date: "Jan 18", high: 28, low: 14, condition: "Sunny", rainChance: 0 },
      { day: "Sun", date: "Jan 19", high: 29, low: 15, condition: "Sunny", rainChance: 0 },
      { day: "Mon", date: "Jan 20", high: 28, low: 14, condition: "Clear", rainChance: 0 },
      { day: "Tue", date: "Jan 21", high: 27, low: 13, condition: "Partly Cloudy", rainChance: 10 },
      { day: "Wed", date: "Jan 22", high: 26, low: 12, condition: "Sunny", rainChance: 5 },
      { day: "Thu", date: "Jan 23", high: 27, low: 13, condition: "Clear", rainChance: 0 }
    ]
  },
  {
    city: "Jaipur",
    state: "Rajasthan",
    temp: 22,
    feelsLike: 21,
    condition: "Clear",
    humidity: 35,
    windSpeed: 10,
    visibility: 10,
    pressure: 1017,
    uvIndex: 6,
    sunrise: "07:20",
    sunset: "18:00",
    forecast: [
      { day: "Today", date: "Jan 17", high: 22, low: 9, condition: "Clear", rainChance: 0 },
      { day: "Sat", date: "Jan 18", high: 23, low: 10, condition: "Sunny", rainChance: 0 },
      { day: "Sun", date: "Jan 19", high: 24, low: 11, condition: "Sunny", rainChance: 0 },
      { day: "Mon", date: "Jan 20", high: 23, low: 10, condition: "Clear", rainChance: 0 },
      { day: "Tue", date: "Jan 21", high: 22, low: 9, condition: "Hazy", rainChance: 5 },
      { day: "Wed", date: "Jan 22", high: 21, low: 8, condition: "Foggy", rainChance: 5 },
      { day: "Thu", date: "Jan 23", high: 22, low: 9, condition: "Clear", rainChance: 0 }
    ]
  },
  {
    city: "Lucknow",
    state: "Uttar Pradesh",
    temp: 19,
    feelsLike: 17,
    condition: "Foggy",
    humidity: 80,
    windSpeed: 6,
    visibility: 1,
    pressure: 1019,
    uvIndex: 3,
    sunrise: "06:55",
    sunset: "17:40",
    forecast: [
      { day: "Today", date: "Jan 17", high: 19, low: 9, condition: "Foggy", rainChance: 5 },
      { day: "Sat", date: "Jan 18", high: 20, low: 8, condition: "Hazy", rainChance: 0 },
      { day: "Sun", date: "Jan 19", high: 21, low: 10, condition: "Sunny", rainChance: 0 },
      { day: "Mon", date: "Jan 20", high: 22, low: 11, condition: "Clear", rainChance: 0 },
      { day: "Tue", date: "Jan 21", high: 21, low: 10, condition: "Partly Cloudy", rainChance: 10 },
      { day: "Wed", date: "Jan 22", high: 20, low: 9, condition: "Foggy", rainChance: 5 },
      { day: "Thu", date: "Jan 23", high: 19, low: 8, condition: "Cold", rainChance: 10 }
    ]
  },
  {
    city: "Nashik",
    state: "Maharashtra",
    temp: 28,
    feelsLike: 28,
    condition: "Clear",
    humidity: 42,
    windSpeed: 14,
    visibility: 10,
    pressure: 1012,
    uvIndex: 7,
    sunrise: "06:58",
    sunset: "18:22",
    forecast: [
      { day: "Today", date: "Jan 17", high: 28, low: 12, condition: "Clear", rainChance: 0 },
      { day: "Sat", date: "Jan 18", high: 29, low: 13, condition: "Sunny", rainChance: 0 },
      { day: "Sun", date: "Jan 19", high: 30, low: 14, condition: "Sunny", rainChance: 0 },
      { day: "Mon", date: "Jan 20", high: 29, low: 13, condition: "Partly Cloudy", rainChance: 10 },
      { day: "Tue", date: "Jan 21", high: 28, low: 12, condition: "Cloudy", rainChance: 25 },
      { day: "Wed", date: "Jan 22", high: 27, low: 12, condition: "Light Rain", rainChance: 35 },
      { day: "Thu", date: "Jan 23", high: 28, low: 13, condition: "Partly Cloudy", rainChance: 15 }
    ]
  },
  {
    city: "Indore",
    state: "Madhya Pradesh",
    temp: 25,
    feelsLike: 25,
    condition: "Sunny",
    humidity: 38,
    windSpeed: 11,
    visibility: 10,
    pressure: 1014,
    uvIndex: 7,
    sunrise: "07:05",
    sunset: "18:10",
    forecast: [
      { day: "Today", date: "Jan 17", high: 25, low: 12, condition: "Sunny", rainChance: 0 },
      { day: "Sat", date: "Jan 18", high: 26, low: 13, condition: "Clear", rainChance: 0 },
      { day: "Sun", date: "Jan 19", high: 27, low: 14, condition: "Sunny", rainChance: 0 },
      { day: "Mon", date: "Jan 20", high: 26, low: 13, condition: "Partly Cloudy", rainChance: 10 },
      { day: "Tue", date: "Jan 21", high: 25, low: 12, condition: "Cloudy", rainChance: 20 },
      { day: "Wed", date: "Jan 22", high: 24, low: 11, condition: "Clear", rainChance: 5 },
      { day: "Thu", date: "Jan 23", high: 25, low: 12, condition: "Sunny", rainChance: 0 }
    ]
  }
];

const Weather = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<CityWeather>(citiesWeatherData[0]);

  const filteredCities = citiesWeatherData.filter(
    (city) =>
      city.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <h1 className="text-3xl md:text-5xl font-bold">24/7 Weather Forecast</h1>
              </div>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Live weather conditions and 7-day forecasts for major cities across India. Plan your farming activities with accurate weather predictions.
              </p>

              {/* Search */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search city or state..."
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
                      Select City ({filteredCities.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[600px] overflow-y-auto space-y-2">
                    {filteredCities.map((city) => {
                      const Icon = getWeatherIcon(city.condition);
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
                            <Icon className={`h-6 w-6 ${getConditionColor(city.condition)}`} />
                            <span className="text-xl font-bold">{city.temp}°</span>
                          </div>
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

              {/* Weather Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Current Weather */}
                <Card className="overflow-hidden">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 text-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-5 w-5" />
                          <h2 className="text-2xl font-bold">{selectedCity.city}</h2>
                          <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                            {selectedCity.state}
                          </Badge>
                        </div>
                        <p className="text-white/80 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                        <RefreshCw className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center gap-6">
                        {(() => {
                          const Icon = getWeatherIcon(selectedCity.condition);
                          return <Icon className="h-24 w-24 text-white" />;
                        })()}
                        <div>
                          <div className="text-7xl font-bold">{selectedCity.temp}°C</div>
                          <p className="text-xl text-white/90">{selectedCity.condition}</p>
                          <p className="text-white/70">Feels like {selectedCity.feelsLike}°C</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                        <Droplets className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Humidity</p>
                          <p className="text-xl font-bold">{selectedCity.humidity}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                        <Wind className="h-8 w-8 text-cyan-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Wind</p>
                          <p className="text-xl font-bold">{selectedCity.windSpeed} km/h</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                        <Eye className="h-8 w-8 text-gray-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Visibility</p>
                          <p className="text-xl font-bold">{selectedCity.visibility} km</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                        <Gauge className="h-8 w-8 text-green-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Pressure</p>
                          <p className="text-xl font-bold">{selectedCity.pressure} hPa</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                        <Thermometer className="h-8 w-8 text-orange-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">UV Index</p>
                          <p className="text-xl font-bold">{selectedCity.uvIndex}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                        <Sunrise className="h-8 w-8 text-yellow-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Sunrise</p>
                          <p className="text-xl font-bold">{selectedCity.sunrise}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                        <Sunset className="h-8 w-8 text-orange-400" />
                        <div>
                          <p className="text-sm text-muted-foreground">Sunset</p>
                          <p className="text-xl font-bold">{selectedCity.sunset}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 7-Day Forecast */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      7-Day Forecast
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3">
                      {selectedCity.forecast.map((day, index) => {
                        const Icon = getWeatherIcon(day.condition);
                        return (
                          <div
                            key={index}
                            className={`p-4 rounded-lg text-center ${
                              index === 0 ? "bg-primary/10 border-2 border-primary" : "bg-muted"
                            }`}
                          >
                            <p className="font-semibold">{day.day}</p>
                            <p className="text-xs text-muted-foreground mb-2">{day.date}</p>
                            <Icon className={`h-10 w-10 mx-auto mb-2 ${getConditionColor(day.condition)}`} />
                            <div className="flex items-center justify-center gap-1">
                              <span className="font-bold">{day.high}°</span>
                              <span className="text-muted-foreground">/</span>
                              <span className="text-muted-foreground">{day.low}°</span>
                            </div>
                            <div className="flex items-center justify-center gap-1 mt-2 text-blue-500">
                              <Droplets className="h-3 w-3" />
                              <span className="text-xs">{day.rainChance}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Farming Tips */}
                <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-green-700 dark:text-green-400">🌾 Farming Tips for Today</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {selectedCity.humidity > 70 && (
                        <li className="flex items-start gap-2">
                          <span className="text-green-500">•</span>
                          High humidity detected. Monitor crops for fungal diseases and ensure proper ventilation.
                        </li>
                      )}
                      {selectedCity.temp > 30 && (
                        <li className="flex items-start gap-2">
                          <span className="text-green-500">•</span>
                          Hot weather expected. Irrigate crops during early morning or evening to reduce water loss.
                        </li>
                      )}
                      {selectedCity.forecast.some(d => d.rainChance > 50) && (
                        <li className="flex items-start gap-2">
                          <span className="text-green-500">•</span>
                          Rain expected this week. Consider postponing pesticide application and prepare drainage.
                        </li>
                      )}
                      {selectedCity.windSpeed > 15 && (
                        <li className="flex items-start gap-2">
                          <span className="text-green-500">•</span>
                          Strong winds forecasted. Secure young plants and check support structures.
                        </li>
                      )}
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">•</span>
                        Best time for field work: 6:00 AM - 10:00 AM and 4:00 PM - 6:00 PM
                      </li>
                    </ul>
                  </CardContent>
                </Card>
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
