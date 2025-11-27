import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Droplets, Wind, Sun } from "lucide-react";

export const WeatherWidget = () => {
  return (
    <Card className="shadow-card border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="h-6 w-6 text-accent" />
          Live Weather - Mumbai, Maharashtra
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-5xl font-bold">28°C</div>
            <p className="text-muted-foreground">Partly Cloudy</p>
          </div>
          <Cloud className="h-20 w-20 text-muted-foreground" />
        </div>
        <div className="grid grid-cols-3 gap-4">
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
            <Droplets className="h-5 w-5 text-primary mb-1" />
            <span className="text-sm font-medium">20%</span>
            <span className="text-xs text-muted-foreground">Rain</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
