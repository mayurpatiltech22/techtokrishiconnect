import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Search, BarChart3, MapPin, RefreshCw, Wheat, Apple, Leaf } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PriceHistoryChart } from "@/components/PriceHistoryChart";

interface MarketPrice {
  crop_name: string;
  market_name: string;
  district: string;
  price: number;
  previousPrice: number | null;
  unit: string;
}

interface CropCategory {
  name: string;
  crops: string[];
  icon: React.ReactNode;
}

const cropCategories: CropCategory[] = [
  {
    name: "Cereals",
    crops: ["Wheat", "Rice (Basmati)", "Rice (Common)", "Maize", "Bajra (Pearl Millet)", "Jowar (Sorghum)", "Ragi"],
    icon: <Wheat className="h-4 w-4" />
  },
  {
    name: "Pulses",
    crops: ["Chana (Gram)", "Tur Dal (Arhar)", "Moong Dal", "Urad Dal", "Masoor Dal"],
    icon: <Leaf className="h-4 w-4" />
  },
  {
    name: "Oilseeds",
    crops: ["Soybean", "Groundnut", "Mustard", "Sunflower", "Sesame (Til)"],
    icon: <Leaf className="h-4 w-4" />
  },
  {
    name: "Vegetables",
    crops: ["Onion", "Potato", "Tomato", "Garlic", "Ginger", "Green Chilli", "Cabbage", "Cauliflower"],
    icon: <Apple className="h-4 w-4" />
  },
  {
    name: "Fruits",
    crops: ["Banana", "Mango (Alphonso)", "Orange", "Pomegranate", "Grapes", "Apple"],
    icon: <Apple className="h-4 w-4" />
  },
  {
    name: "Spices",
    crops: ["Turmeric", "Red Chilli", "Cumin (Jeera)", "Coriander"],
    icon: <Leaf className="h-4 w-4" />
  },
  {
    name: "Cash Crops",
    crops: ["Cotton", "Sugarcane", "Jute"],
    icon: <Wheat className="h-4 w-4" />
  }
];

const cities = [
  "All Cities",
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Nashik",
  "Indore",
  "Jaipur",
  "Lucknow",
  "Ahmedabad",
  "Bhopal"
];

const MarketPricesPage = () => {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [selectedCrop, setSelectedCrop] = useState<{
    cropName: string;
    marketName: string;
    district: string;
  } | null>(null);
  const [isChartOpen, setIsChartOpen] = useState(false);

  useEffect(() => {
    fetchMarketPrices();
  }, []);

  const fetchMarketPrices = async () => {
    setLoading(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Get latest prices
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
      const processedPrices: MarketPrice[] = [];

      latestPrices?.forEach((p) => {
        const key = `${p.crop_name}-${p.market_name}`;
        if (!seenCrops[key]) {
          seenCrops[key] = true;
          processedPrices.push({
            crop_name: p.crop_name,
            market_name: p.market_name,
            district: p.district,
            price: p.price,
            previousPrice: prevPriceMap[key] || null,
            unit: p.unit || "quintal"
          });
        }
      });

      setPrices(processedPrices);
      setLastUpdated(
        latestPrices?.[0]?.recorded_at
          ? new Date(latestPrices[0].recorded_at).toLocaleString()
          : "Just now"
      );
    } catch (error) {
      console.error("Error fetching market prices:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateChange = (current: number, previous: number | null) => {
    if (!previous) return { change: "+0.0%", trend: "neutral" as const, value: 0 };
    const changePercent = ((current - previous) / previous) * 100;
    return {
      change: `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(1)}%`,
      trend: changePercent > 0 ? ("up" as const) : changePercent < 0 ? ("down" as const) : ("neutral" as const),
      value: changePercent
    };
  };

  const handleViewHistory = (crop: MarketPrice) => {
    setSelectedCrop({
      cropName: crop.crop_name,
      marketName: crop.market_name,
      district: crop.district
    });
    setIsChartOpen(true);
  };

  // Get crops for selected category
  const getCropsForCategory = (category: string): string[] => {
    if (category === "all") return [];
    const cat = cropCategories.find(c => c.name === category);
    return cat ? cat.crops : [];
  };

  // Filter prices
  const filteredPrices = prices.filter((price) => {
    const matchesSearch =
      price.crop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      price.market_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      price.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity =
      selectedCity === "All Cities" || price.district === selectedCity;

    const categorycrops = getCropsForCategory(selectedCategory);
    const matchesCategory =
      selectedCategory === "all" || categorycrops.includes(price.crop_name);

    return matchesSearch && matchesCity && matchesCategory;
  });

  // Group prices by crop
  const groupedByCrop = filteredPrices.reduce((acc, price) => {
    if (!acc[price.crop_name]) {
      acc[price.crop_name] = [];
    }
    acc[price.crop_name].push(price);
    return acc;
  }, {} as { [key: string]: MarketPrice[] });

  // Get unique crops
  const uniqueCrops = [...new Set(prices.map(p => p.crop_name))].sort();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-background py-12">
          <div className="container px-4">
            <div className="text-center max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-4">
                <TrendingUp className="h-10 w-10 text-green-600" />
                <h1 className="text-3xl md:text-5xl font-bold">Live Mandi Prices</h1>
              </div>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Real-time market prices for 25+ crops from major mandis across India.
                Track historical trends and make informed selling decisions.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
                <div className="bg-background/80 backdrop-blur p-4 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{uniqueCrops.length}+</p>
                  <p className="text-sm text-muted-foreground">Crops</p>
                </div>
                <div className="bg-background/80 backdrop-blur p-4 rounded-lg">
                  <p className="text-2xl font-bold text-primary">12</p>
                  <p className="text-sm text-muted-foreground">Markets</p>
                </div>
                <div className="bg-background/80 backdrop-blur p-4 rounded-lg">
                  <p className="text-2xl font-bold text-primary">30</p>
                  <p className="text-sm text-muted-foreground">Days History</p>
                </div>
              </div>

              {/* Search */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search crop, market, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-4 border-b sticky top-16 bg-background z-40">
          <div className="container px-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 overflow-x-auto">
                <div className="flex gap-2">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("all")}
                  >
                    All Crops
                  </Button>
                  {cropCategories.map((cat) => (
                    <Button
                      key={cat.name}
                      variant={selectedCategory === cat.name ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat.name)}
                      className="whitespace-nowrap"
                    >
                      {cat.icon}
                      <span className="ml-1">{cat.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={fetchMarketPrices}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </section>

        {/* Prices Grid */}
        <section className="py-8">
          <div className="container px-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : Object.keys(groupedByCrop).length === 0 ? (
              <div className="text-center py-20">
                <Wheat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No prices found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedByCrop).map(([cropName, cropPrices]) => (
                  <Card key={cropName} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 py-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl flex items-center gap-2">
                          <Wheat className="h-5 w-5 text-primary" />
                          {cropName}
                          <Badge variant="secondary" className="ml-2">
                            {cropPrices.length} markets
                          </Badge>
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">
                          Per {cropPrices[0]?.unit || "quintal"}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-muted/30">
                            <tr>
                              <th className="text-left p-4 font-semibold">Market</th>
                              <th className="text-left p-4 font-semibold">City</th>
                              <th className="text-right p-4 font-semibold">Price (₹)</th>
                              <th className="text-right p-4 font-semibold">Change</th>
                              <th className="text-center p-4 font-semibold">History</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cropPrices
                              .sort((a, b) => b.price - a.price)
                              .map((price, index) => {
                                const { change, trend, value } = calculateChange(
                                  price.price,
                                  price.previousPrice
                                );
                                return (
                                  <tr
                                    key={`${price.market_name}-${index}`}
                                    className="border-t hover:bg-muted/30 transition-colors"
                                  >
                                    <td className="p-4">
                                      <span className="font-medium">{price.market_name}</span>
                                    </td>
                                    <td className="p-4">
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-muted-foreground">
                                          {price.district}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="p-4 text-right">
                                      <span className="text-xl font-bold">
                                        ₹{price.price.toLocaleString()}
                                      </span>
                                    </td>
                                    <td className="p-4 text-right">
                                      <div
                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
                                          trend === "up"
                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                            : trend === "down"
                                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                        }`}
                                      >
                                        {trend === "up" ? (
                                          <TrendingUp className="h-4 w-4" />
                                        ) : trend === "down" ? (
                                          <TrendingDown className="h-4 w-4" />
                                        ) : null}
                                        {change}
                                      </div>
                                    </td>
                                    <td className="p-4 text-center">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleViewHistory(price)}
                                      >
                                        <BarChart3 className="h-4 w-4 mr-1" />
                                        View
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <p className="text-center text-sm text-muted-foreground mt-8">
              Last updated: {lastUpdated || "Loading..."}
            </p>
          </div>
        </section>
      </main>
      <Footer />

      {selectedCrop && (
        <PriceHistoryChart
          isOpen={isChartOpen}
          onClose={() => setIsChartOpen(false)}
          cropName={selectedCrop.cropName}
          marketName={selectedCrop.marketName}
          district={selectedCrop.district}
        />
      )}
    </div>
  );
};

export default MarketPricesPage;
