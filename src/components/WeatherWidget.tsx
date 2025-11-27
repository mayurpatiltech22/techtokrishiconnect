import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Droplets, Wind, Sun, CloudRain, CloudSnow } from "lucide-react";

export const WeatherWidget = () => {
  const forecast = [
    { day: "Today", temp: "28°C", icon: Sun, condition: "Sunny" },
    { day: "Tomorrow", temp: "26°C", icon: Cloud, condition: "Cloudy" },
    { day: "Day 3", temp: "24°C", icon: CloudRain, condition: "Rainy" },
    { day: "Day 4", temp: "27°C", icon: Sun, condition: "Clear" }
  ];

  return (
    <Card className="shadow-card border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="h-6 w-6 text-accent" />
          Live Weather - Pune, Maharashtra
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-5xl font-bold">28°C</div>
            <p className="text-muted-foreground">Partly Cloudy</p>
            <p className="text-sm text-muted-foreground mt-1">Feels like 30°C</p>
          </div>
          <Cloud className="h-20 w-20 text-muted-foreground" />
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
            <Droplets className="h-5 w-5 text-primary mb-1" />
            <span className="text-sm font-medium">65%</span>
            <span className="text-xs text-muted-foreground">Humidity</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
            <Wind className="h-5 w-5 text-primary mb-1" />
            <span className="text-sm font-medium">12 km/h</span>
            <span className="text-xs text-muted-foreground">Wind</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
            <CloudRain className="h-5 w-5 text-primary mb-1" />
            <span className="text-sm font-medium">20%</span>
            <span className="text-xs text-muted-foreground">Rain</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-semibold mb-3">4-Day Forecast</p>
          <div className="grid grid-cols-4 gap-2">
            {forecast.map((day, index) => {
              const Icon = day.icon;
              return (
                <div key={index} className="text-center p-2 bg-muted rounded-lg">
                  <p className="text-xs font-medium mb-1">{day.day}</p>
                  <Icon className="h-6 w-6 mx-auto mb-1 text-primary" />
                  <p className="text-sm font-bold">{day.temp}</p>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
