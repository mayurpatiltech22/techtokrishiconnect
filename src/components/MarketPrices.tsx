import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { PriceHistoryChart } from "./PriceHistoryChart";

interface MarketPrice {
  crop_name: string;
  market_name: string;
  district: string;
  price: number;
  previousPrice: number | null;
}

interface SelectedCrop {
  cropName: string;
  marketName: string;
  district: string;
}

export const MarketPrices = () => {
  const [prices, setPrices] = useState<{ [key: string]: MarketPrice[] }>({
    Pune: [],
    Nashik: [],
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [selectedCrop, setSelectedCrop] = useState<SelectedCrop | null>(null);
  const [isChartOpen, setIsChartOpen] = useState(false);

  useEffect(() => {
    fetchMarketPrices();
  }, []);

  const fetchMarketPrices = async () => {
    try {
      // Fetch today's latest prices
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Get latest prices for each crop/market combination
      const { data: latestPrices, error: latestError } = await supabase
        .from("market_prices")
        .select("*")
        .gte("recorded_at", yesterday.toISOString())
        .order("recorded_at", { ascending: false });

      if (latestError) throw latestError;

      // Get previous day prices for comparison
      const twoDaysAgo = new Date(yesterday);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 1);

      const { data: previousPrices, error: prevError } = await supabase
        .from("market_prices")
        .select("*")
        .gte("recorded_at", twoDaysAgo.toISOString())
        .lt("recorded_at", yesterday.toISOString())
        .order("recorded_at", { ascending: false });

      if (prevError) throw prevError;

      // Process prices by district
      const pricesByDistrict: { [key: string]: MarketPrice[] } = {
        Pune: [],
        Nashik: [],
      };

      // Create a map for previous prices
      const prevPriceMap: { [key: string]: number } = {};
      previousPrices?.forEach((p) => {
        const key = `${p.crop_name}-${p.market_name}`;
        if (!prevPriceMap[key]) {
          prevPriceMap[key] = p.price;
        }
      });

      // Get unique latest prices per crop/market
      const seenCrops: { [key: string]: boolean } = {};
      
      latestPrices?.forEach((p) => {
        const key = `${p.crop_name}-${p.market_name}`;
        if (!seenCrops[key]) {
          seenCrops[key] = true;
          const previousPrice = prevPriceMap[key] || null;
          
          const priceData: MarketPrice = {
            crop_name: p.crop_name,
            market_name: p.market_name,
            district: p.district,
            price: p.price,
            previousPrice,
          };

          if (p.district === "Pune") {
            pricesByDistrict.Pune.push(priceData);
          } else if (p.district === "Nashik") {
            pricesByDistrict.Nashik.push(priceData);
          }
        }
      });

      setPrices(pricesByDistrict);
      setLastUpdated(latestPrices?.[0]?.recorded_at ? 
        new Date(latestPrices[0].recorded_at).toLocaleString() : 
        "Just now"
      );
    } catch (error) {
      console.error("Error fetching market prices:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateChange = (current: number, previous: number | null) => {
    if (!previous) return { change: "+0.0%", trend: "up" as const };
    const changePercent = ((current - previous) / previous) * 100;
    return {
      change: `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(1)}%`,
      trend: changePercent >= 0 ? ("up" as const) : ("down" as const),
    };
  };

  const handleViewHistory = (crop: MarketPrice) => {
    setSelectedCrop({
      cropName: crop.crop_name,
      marketName: crop.market_name,
      district: crop.district,
    });
    setIsChartOpen(true);
  };

  const renderPriceList = (priceList: MarketPrice[]) => (
    <div className="space-y-3">
      {priceList.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">
          No price data available
        </p>
      ) : (
        priceList.map((item, index) => {
          const { change, trend } = calculateChange(item.price, item.previousPrice);
          return (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <div className="flex-1">
                <p className="font-semibold">{item.crop_name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.market_name} • Per Quintal
                </p>
              </div>
              <div className="text-right flex items-center gap-3">
                <div>
                  <p className="font-bold text-lg">₹{item.price.toLocaleString()}</p>
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      trend === "up" ? "text-primary" : "text-destructive"
                    }`}
                  >
                    {trend === "up" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {change}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewHistory(item)}
                  className="ml-2"
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  return (
    <>
      <Card className="shadow-card border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-accent" />
            Live Market Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Tabs defaultValue="pune" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="pune">Pune ({prices.Pune.length})</TabsTrigger>
                <TabsTrigger value="nashik">Nashik ({prices.Nashik.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="pune">
                {renderPriceList(prices.Pune)}
              </TabsContent>
              <TabsContent value="nashik">
                {renderPriceList(prices.Nashik)}
              </TabsContent>
            </Tabs>
          )}
          <p className="text-xs text-muted-foreground text-center mt-4">
            Last updated: {lastUpdated || "Loading..."}
          </p>
        </CardContent>
      </Card>

      {selectedCrop && (
        <PriceHistoryChart
          isOpen={isChartOpen}
          onClose={() => setIsChartOpen(false)}
          cropName={selectedCrop.cropName}
          marketName={selectedCrop.marketName}
          district={selectedCrop.district}
        />
      )}
    </>
  );
};
