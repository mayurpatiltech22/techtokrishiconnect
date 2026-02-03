import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, BarChart3, ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { PriceHistoryChart } from "./PriceHistoryChart";
import { Link } from "react-router-dom";

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
    Mumbai: [],
    Pune: [],
    Nashik: [],
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [selectedCrop, setSelectedCrop] = useState<SelectedCrop | null>(null);
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [totalCrops, setTotalCrops] = useState(0);

  useEffect(() => {
    fetchMarketPrices();
  }, []);

  const fetchMarketPrices = async () => {
    try {
      // Fetch latest prices
      const { data: latestPrices, error: latestError } = await supabase
        .from("market_prices")
        .select("*")
        .order("recorded_at", { ascending: false })
        .limit(500);

      if (latestError) throw latestError;

      // Process prices by district
      const pricesByDistrict: { [key: string]: MarketPrice[] } = {
        Mumbai: [],
        Pune: [],
        Nashik: [],
      };

      // Get unique latest prices per crop/market
      const seenCrops: { [key: string]: boolean } = {};
      const uniqueCrops = new Set<string>();
      
      latestPrices?.forEach((p) => {
        const key = `${p.crop_name}-${p.market_name}`;
        uniqueCrops.add(p.crop_name);
        
        if (!seenCrops[key]) {
          seenCrops[key] = true;
          
          const priceData: MarketPrice = {
            crop_name: p.crop_name,
            market_name: p.market_name,
            district: p.district,
            price: p.price,
            previousPrice: null,
          };

          if (pricesByDistrict[p.district]) {
            pricesByDistrict[p.district].push(priceData);
          }
        }
      });

      setPrices(pricesByDistrict);
      setTotalCrops(uniqueCrops.size);
      setLastUpdated(latestPrices?.[0]?.recorded_at ? 
        new Date(latestPrices[0].recorded_at).toLocaleString('en-IN', { 
          dateStyle: 'medium', 
          timeStyle: 'short' 
        }) : 
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
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-accent" />
              Live Market Prices
            </CardTitle>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
              {totalCrops}+ Crops
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Tabs defaultValue="mumbai" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="mumbai">Mumbai</TabsTrigger>
                <TabsTrigger value="pune">Pune</TabsTrigger>
                <TabsTrigger value="nashik">Nashik</TabsTrigger>
              </TabsList>
              <TabsContent value="mumbai">
                {renderPriceList(prices.Mumbai.slice(0, 5))}
              </TabsContent>
              <TabsContent value="pune">
                {renderPriceList(prices.Pune.slice(0, 5))}
              </TabsContent>
              <TabsContent value="nashik">
                {renderPriceList(prices.Nashik.slice(0, 5))}
              </TabsContent>
            </Tabs>
          )}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Updated: {lastUpdated || "Loading..."}
            </p>
            <Button asChild variant="ghost" size="sm" className="text-primary">
              <Link to="/market-prices">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
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
