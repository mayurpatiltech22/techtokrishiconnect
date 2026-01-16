-- Create market_prices table for live and historical crop prices
CREATE TABLE public.market_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_name TEXT NOT NULL,
  market_name TEXT NOT NULL,
  district TEXT NOT NULL,
  price NUMERIC NOT NULL,
  unit TEXT DEFAULT 'quintal',
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;

-- Anyone can view market prices
CREATE POLICY "Anyone can view market prices"
ON public.market_prices
FOR SELECT
USING (true);

-- Create index for efficient querying
CREATE INDEX idx_market_prices_crop ON public.market_prices(crop_name);
CREATE INDEX idx_market_prices_recorded_at ON public.market_prices(recorded_at DESC);
CREATE INDEX idx_market_prices_district ON public.market_prices(district);