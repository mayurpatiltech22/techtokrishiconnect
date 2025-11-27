import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export const MarketPrices = () => {
  const prices = [
    { crop: "Wheat", price: "₹2,450", change: "+5.2%", trend: "up" },
    { crop: "Rice", price: "₹3,200", change: "+2.8%", trend: "up" },
    { crop: "Cotton", price: "₹6,800", change: "-1.5%", trend: "down" },
    { crop: "Sugarcane", price: "₹3,500", change: "+3.1%", trend: "up" },
  ];

  return (
    <Card className="shadow-card border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-accent" />
          Live Market Prices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {prices.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
              <div>
                <p className="font-semibold">{item.crop}</p>
                <p className="text-sm text-muted-foreground">Per Quintal</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{item.price}</p>
                <div className={`flex items-center gap-1 text-sm ${item.trend === 'up' ? 'text-primary' : 'text-destructive'}`}>
                  {item.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {item.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
