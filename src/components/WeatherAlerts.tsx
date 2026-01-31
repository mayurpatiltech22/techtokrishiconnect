import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Thermometer, 
  CloudRain, 
  Wind, 
  Snowflake,
  Sun,
  Droplets,
  ShieldAlert
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface WeatherData {
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    uvIndex: number;
  };
  forecast: {
    day: string;
    date: string;
    high: number;
    low: number;
    condition: string;
    rainChance: number;
  }[];
}

interface Alert {
  id: string;
  type: "danger" | "warning" | "info";
  title: string;
  description: string;
  icon: React.ElementType;
  advice: string[];
}

interface WeatherAlertsProps {
  weatherData: WeatherData;
}

export const WeatherAlerts = ({ weatherData }: WeatherAlertsProps) => {
  const { t } = useLanguage();

  const alerts = useMemo(() => {
    const alertList: Alert[] = [];
    const { current, forecast } = weatherData;

    // Heatwave Alert - Temperature above 40°C or feels like above 42°C
    if (current.temp >= 40 || current.feelsLike >= 42) {
      alertList.push({
        id: "heatwave",
        type: "danger",
        title: "Extreme Heat Warning",
        description: `Temperature is ${current.temp}°C (feels like ${current.feelsLike}°C). Dangerous heat conditions.`,
        icon: Thermometer,
        advice: [
          "Avoid outdoor work between 11 AM - 4 PM",
          "Keep livestock in shaded areas with plenty of water",
          "Irrigate crops early morning or late evening",
          "Watch for heat stress in plants - wilting, leaf burn",
          "Ensure farm workers stay hydrated"
        ]
      });
    } else if (current.temp >= 35 || current.feelsLike >= 38) {
      alertList.push({
        id: "heat-advisory",
        type: "warning",
        title: "Heat Advisory",
        description: `High temperature of ${current.temp}°C. Take precautions during outdoor activities.`,
        icon: Sun,
        advice: [
          "Schedule field work for cooler morning hours",
          "Increase irrigation frequency for sensitive crops",
          "Provide shade for young seedlings",
          "Monitor crops for heat stress symptoms"
        ]
      });
    }

    // Frost Warning - Temperature below 4°C
    const hasFrostRisk = forecast.some(day => day.low <= 4);
    const currentColdRisk = current.temp <= 8;
    
    if (forecast.some(day => day.low <= 0)) {
      alertList.push({
        id: "frost-danger",
        type: "danger",
        title: "Frost Warning",
        description: "Freezing temperatures expected. Severe risk to crops.",
        icon: Snowflake,
        advice: [
          "Cover sensitive crops with frost cloth or plastic sheets",
          "Harvest mature vegetables immediately",
          "Apply mulch around plant bases for insulation",
          "Water plants in late afternoon (wet soil retains heat)",
          "Delay sowing of new seeds until frost passes"
        ]
      });
    } else if (hasFrostRisk || currentColdRisk) {
      alertList.push({
        id: "cold-advisory",
        type: "warning",
        title: "Cold Weather Advisory",
        description: `Low temperatures expected (down to ${Math.min(...forecast.map(d => d.low))}°C). Protect sensitive plants.`,
        icon: Snowflake,
        advice: [
          "Cover tender plants overnight",
          "Avoid pruning which stimulates new growth",
          "Check for chilling injury in tropical crops"
        ]
      });
    }

    // Heavy Rain Warning
    const highRainDays = forecast.filter(day => day.rainChance >= 70);
    const veryHighRainDays = forecast.filter(day => day.rainChance >= 85);
    const hasRainCondition = current.condition.toLowerCase().includes("rain") || 
                             current.condition.toLowerCase().includes("storm") ||
                             current.condition.toLowerCase().includes("thunder");

    if (veryHighRainDays.length >= 2 || (hasRainCondition && forecast[0]?.rainChance >= 80)) {
      alertList.push({
        id: "heavy-rain",
        type: "danger",
        title: "Heavy Rain Alert",
        description: `${veryHighRainDays.length} days with high rainfall expected. Risk of waterlogging and crop damage.`,
        icon: CloudRain,
        advice: [
          "Clear drainage channels immediately",
          "Postpone fertilizer and pesticide application",
          "Harvest ripe crops before rain if possible",
          "Prop up tall plants to prevent lodging",
          "Avoid operating heavy machinery on wet soil",
          "Watch for fungal disease outbreaks after rain"
        ]
      });
    } else if (highRainDays.length >= 1) {
      alertList.push({
        id: "rain-advisory",
        type: "info",
        title: "Rain Expected",
        description: `${highRainDays.length} day(s) with significant rain chance in the forecast.`,
        icon: CloudRain,
        advice: [
          "Good opportunity to reduce irrigation",
          "Complete spraying operations before rain",
          "Prepare drainage for heavy runoff"
        ]
      });
    }

    // Strong Wind Warning
    if (current.windSpeed >= 40) {
      alertList.push({
        id: "strong-wind",
        type: "danger",
        title: "Strong Wind Warning",
        description: `Wind speeds of ${current.windSpeed} km/h detected. Risk of crop damage.`,
        icon: Wind,
        advice: [
          "Secure shade nets and polyhouse covers",
          "Stake tall crops like maize, sugarcane, banana",
          "Postpone pesticide spraying (drift risk)",
          "Avoid working near trees",
          "Check greenhouse structures for damage"
        ]
      });
    } else if (current.windSpeed >= 25) {
      alertList.push({
        id: "wind-advisory",
        type: "warning",
        title: "Windy Conditions",
        description: `Wind speed of ${current.windSpeed} km/h. Take precautions with spraying.`,
        icon: Wind,
        advice: [
          "Avoid pesticide/herbicide spraying today",
          "Secure loose coverings on stored materials",
          "Support young transplants"
        ]
      });
    }

    // High Humidity Warning
    if (current.humidity >= 85) {
      alertList.push({
        id: "high-humidity",
        type: "warning",
        title: "High Humidity Alert",
        description: `Humidity at ${current.humidity}%. Increased risk of fungal diseases.`,
        icon: Droplets,
        advice: [
          "Scout for fungal infections (powdery mildew, blight)",
          "Increase spacing for air circulation",
          "Apply preventive fungicides if needed",
          "Avoid overhead irrigation",
          "Harvest moisture-sensitive crops promptly"
        ]
      });
    }

    // Dry conditions warning
    if (current.humidity <= 25 && current.temp >= 30) {
      alertList.push({
        id: "dry-conditions",
        type: "warning",
        title: "Dry & Hot Conditions",
        description: "Low humidity combined with high temperature increases water stress.",
        icon: Sun,
        advice: [
          "Increase irrigation frequency",
          "Apply mulch to conserve soil moisture",
          "Watch for spider mites (thrive in dry conditions)",
          "Avoid cultivating soil to prevent moisture loss"
        ]
      });
    }

    return alertList;
  }, [weatherData]);

  const getAlertStyles = (type: Alert["type"]) => {
    switch (type) {
      case "danger":
        return {
          card: "border-destructive/50 bg-destructive/5",
          badge: "bg-destructive text-destructive-foreground",
          icon: "text-destructive"
        };
      case "warning":
        return {
          card: "border-accent/50 bg-accent/20",
          badge: "bg-accent text-accent-foreground",
          icon: "text-accent-foreground"
        };
      case "info":
        return {
          card: "border-primary/50 bg-primary/5",
          badge: "bg-primary text-primary-foreground",
          icon: "text-primary"
        };
    }
  };

  if (alerts.length === 0) {
    return (
      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <ShieldAlert className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-primary">No Weather Alerts</h3>
              <p className="text-muted-foreground">
                Weather conditions are favorable for farming activities. No extreme conditions detected.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-yellow-600" />
        <h2 className="text-xl font-bold">Weather Alerts for Farmers</h2>
        <Badge variant="outline" className="ml-2">
          {alerts.length} Active
        </Badge>
      </div>

      <div className="grid gap-4">
        {alerts.map((alert) => {
          const styles = getAlertStyles(alert.type);
          const Icon = alert.icon;
          
          return (
            <Card key={alert.id} className={`border-2 ${styles.card}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg bg-background ${styles.icon}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-lg">{alert.title}</CardTitle>
                      <Badge className={styles.badge}>
                        {alert.type === "danger" ? "Critical" : alert.type === "warning" ? "Warning" : "Advisory"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">{alert.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="ml-12">
                  <p className="text-sm font-medium mb-2">Recommended Actions:</p>
                  <ul className="space-y-1">
                    {alert.advice.map((tip, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
