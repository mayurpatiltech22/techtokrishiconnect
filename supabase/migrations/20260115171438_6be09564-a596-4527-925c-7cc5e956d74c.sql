-- Create equipment table
CREATE TABLE public.equipment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price_per_day NUMERIC NOT NULL,
  location TEXT,
  district TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_available BOOLEAN DEFAULT true,
  specifications TEXT[],
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create equipment_bookings table
CREATE TABLE public.equipment_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id UUID NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
  renter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_amount NUMERIC,
  status TEXT DEFAULT 'pending',
  renter_phone TEXT,
  delivery_address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_bookings ENABLE ROW LEVEL SECURITY;

-- Equipment policies
CREATE POLICY "Anyone can view available equipment"
ON public.equipment FOR SELECT
USING (is_available = true OR owner_id = auth.uid());

CREATE POLICY "Owners can create equipment"
ON public.equipment FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own equipment"
ON public.equipment FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete own equipment"
ON public.equipment FOR DELETE
USING (auth.uid() = owner_id);

-- Equipment bookings policies
CREATE POLICY "Renters can create bookings"
ON public.equipment_bookings FOR INSERT
WITH CHECK (auth.uid() = renter_id);

CREATE POLICY "Users can view own bookings"
ON public.equipment_bookings FOR SELECT
USING (
  auth.uid() = renter_id OR 
  EXISTS (
    SELECT 1 FROM public.equipment 
    WHERE equipment.id = equipment_bookings.equipment_id 
    AND equipment.owner_id = auth.uid()
  )
);

CREATE POLICY "Users can update relevant bookings"
ON public.equipment_bookings FOR UPDATE
USING (
  auth.uid() = renter_id OR 
  EXISTS (
    SELECT 1 FROM public.equipment 
    WHERE equipment.id = equipment_bookings.equipment_id 
    AND equipment.owner_id = auth.uid()
  )
);

-- Add triggers for updated_at
CREATE TRIGGER update_equipment_updated_at
BEFORE UPDATE ON public.equipment
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_equipment_bookings_updated_at
BEFORE UPDATE ON public.equipment_bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();