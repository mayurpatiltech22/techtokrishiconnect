-- Fix: Restrict profiles SELECT policy to only allow users to view their own profile
-- This prevents phone number scraping

DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create a public view for non-sensitive profile data (for features that need to display user names)
CREATE OR REPLACE VIEW public.profiles_public
WITH (security_invoker=on) AS
  SELECT 
    id,
    user_id,
    full_name,
    district,
    user_type,
    avatar_url,
    created_at
  FROM public.profiles;
-- Note: phone is intentionally excluded from public view