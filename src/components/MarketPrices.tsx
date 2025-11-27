import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const MarketPrices = () => {
  const pricesData = {
    pune: [
      { crop: "Wheat", price: "₹2,450", change: "+5.2%", trend: "up", market: "Pune APMC" },
      { crop: "Rice", price: "₹3,200", change: "+2.8%", trend: "up", market: "Pune APMC" },
      { crop: "Cotton", price: "₹6,800", change: "-1.5%", trend: "down", market: "Pune APMC" },
      { crop: "Onion", price: "₹2,800", change: "+8.5%", trend: "up", market: "Pune APMC" }
    ],
    nashik: [
      { crop: "Grapes", price: "₹4,500", change: "+4.2%", trend: "up", market: "Nashik APMC" },
      { crop: "Tomato", price: "₹1,800", change: "+6.1%", trend: "up", market: "Nashik APMC" },
      { crop: "Wheat", price: "₹2,400", change: "+3.5%", trend: "up", market: "Nashik APMC" },
      { crop: "Sugarcane", price: "₹3,500", change: "+3.1%", trend: "up", market: "Nashik APMC" }
    ]
  };

  const renderPriceList = (prices: typeof pricesData.pune) => (
    <div className="space-y-3">
      {prices.map((item, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
          <div>
            <p className="font-semibold">{item.crop}</p>
            <p className="text-xs text-muted-foreground">{item.market} • Per Quintal</p>
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
  );

  return (
    <Card className="shadow-card border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-accent" />
          Live Market Prices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pune" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="pune">Pune</TabsTrigger>
            <TabsTrigger value="nashik">Nashik</TabsTrigger>
          </TabsList>
          <TabsContent value="pune">
            {renderPriceList(pricesData.pune)}
          </TabsContent>
          <TabsContent value="nashik">
            {renderPriceList(pricesData.nashik)}
          </TabsContent>
        </Tabs>
        <p className="text-xs text-muted-foreground text-center mt-4">
          Last updated: 2 hours ago
        </p>
      </CardContent>
    </Card>
  );
};
