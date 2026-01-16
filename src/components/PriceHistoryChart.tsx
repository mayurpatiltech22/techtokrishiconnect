import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { format } from "date-fns";

interface PriceHistoryChartProps {
  isOpen: boolean;
  onClose: () => void;
  cropName: string;
  marketName: string;
  district: string;
}

interface PriceData {
  date: string;
  price: number;
  formattedDate: string;
}

interface PriceStats {
  min: number;
  max: number;
  avg: number;
  change: number;
  changePercent: number;
}

export const PriceHistoryChart = ({
  isOpen,
  onClose,
  cropName,
  marketName,
  district,
}: PriceHistoryChartProps) => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [stats, setStats] = useState<PriceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<7 | 30>(30);

  useEffect(() => {
    if (isOpen) {
      fetchPriceHistory();
    }
  }, [isOpen, cropName, marketName, timeRange]);

  const fetchPriceHistory = async () => {
    setLoading(true);
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - timeRange);

      const { data, error } = await supabase
        .from("market_prices")
        .select("price, recorded_at")
        .eq("crop_name", cropName)
        .eq("market_name", marketName)
        .gte("recorded_at", startDate.toISOString())
        .order("recorded_at", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedData = data.map((item) => ({
          date: item.recorded_at,
          price: Number(item.price),
          formattedDate: format(new Date(item.recorded_at), "MMM dd"),
        }));

        setPriceData(formattedData);

        // Calculate statistics
        const prices = formattedData.map((d) => d.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
        const firstPrice = prices[0];
        const lastPrice = prices[prices.length - 1];
        const change = lastPrice - firstPrice;
        const changePercent = (change / firstPrice) * 100;

        setStats({ min, max, avg, change, changePercent });
      }
    } catch (error) {
      console.error("Error fetching price history:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {cropName} - Price History ({district})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Time Range Selector */}
          <div className="flex gap-2">
            <Button
              variant={timeRange === 7 ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(7)}
            >
              7 Days
            </Button>
            <Button
              variant={timeRange === 30 ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(30)}
            >
              30 Days
            </Button>
          </div>

          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-4 gap-3">
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Min</p>
                <p className="font-bold text-lg">₹{stats.min.toFixed(0)}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Max</p>
                <p className="font-bold text-lg">₹{stats.max.toFixed(0)}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Average</p>
                <p className="font-bold text-lg">₹{stats.avg.toFixed(0)}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Change</p>
                <div
                  className={`flex items-center justify-center gap-1 font-bold text-lg ${
                    stats.change >= 0 ? "text-primary" : "text-destructive"
                  }`}
                >
                  {stats.change >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {stats.changePercent.toFixed(1)}%
                </div>
              </div>
            </div>
          )}

          {/* Chart */}
          <div className="h-[300px] w-full">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : priceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={priceData}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="formattedDate"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={["dataMin - 50", "dataMax + 50"]}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`₹${value.toFixed(0)}`, "Price"]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No price data available for this period
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Prices shown per quintal • Data from {marketName}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
