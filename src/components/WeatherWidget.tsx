import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Cloud, Droplets, Wind, Sun, CloudRain, CloudSnow, Loader2 } from "lucide-react";

type WeatherData = {
  current: {
    city: string;
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    condition: string;
  };
  forecast: {
    day: string;
    high: number;
    low: number;
    condition: string;
    rainChance: number;
  }[];
};

const getWeatherIcon = (condition: string) => {
  const c = condition.toLowerCase();
  if (c.includes("rain") || c.includes("shower") || c.includes("drizzle")) return CloudRain;
  if (c.includes("snow")) return CloudSnow;
  if (c.includes("cloud") || c.includes("mist") || c.includes("fog") || c.includes("haze")) return Cloud;
  return Sun;
};

export const WeatherWidget = () => {
  const CITY = "Pune";

  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.functions.invoke("get-weather", {
          body: { city: CITY },
        });

        if (error) throw new Error(error.message);
        if (!data?.current) throw new Error("No weather data returned");

        if (mounted) setData(data);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to load weather";
        if (mounted) setError(message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, []);

  const Icon = useMemo(() => {
    if (!data?.current?.condition) return Sun;
    return getWeatherIcon(data.current.condition);
  }, [data?.current?.condition]);

  const forecast = (data?.forecast ?? []).slice(0, 4);

  return (
    <Card className="shadow-card border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="h-6 w-6 text-primary" />
          Live Weather - {CITY}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-10 gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading weather…
          </div>
        ) : error || !data ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">Unable to load live weather.</p>
            <p className="text-xs text-muted-foreground mt-1">{error}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-5xl font-bold">{data.current.temp}°C</div>
                <p className="text-muted-foreground">{data.current.condition}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Feels like {data.current.feelsLike}°C
                </p>
              </div>
              <Icon className="h-20 w-20 text-muted-foreground" />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                <Droplets className="h-5 w-5 text-primary mb-1" />
                <span className="text-sm font-medium">{data.current.humidity}%</span>
                <span className="text-xs text-muted-foreground">Humidity</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                <Wind className="h-5 w-5 text-primary mb-1" />
                <span className="text-sm font-medium">{data.current.windSpeed} km/h</span>
                <span className="text-xs text-muted-foreground">Wind</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                <CloudRain className="h-5 w-5 text-primary mb-1" />
                <span className="text-sm font-medium">{forecast[0]?.rainChance ?? 0}%</span>
                <span className="text-xs text-muted-foreground">Rain</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-semibold mb-3">4-Day Forecast</p>
              <div className="grid grid-cols-4 gap-2">
                {forecast.map((day, index) => {
                  const DayIcon = getWeatherIcon(day.condition);
                  return (
                    <div key={index} className="text-center p-2 bg-muted rounded-lg">
                      <p className="text-xs font-medium mb-1">{day.day}</p>
                      <DayIcon className="h-6 w-6 mx-auto mb-1 text-primary" />
                      <p className="text-sm font-bold">{day.high}°/{day.low}°</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
