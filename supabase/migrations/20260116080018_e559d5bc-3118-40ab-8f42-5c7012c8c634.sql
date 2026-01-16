-- Create storage bucket for equipment images
INSERT INTO storage.buckets (id, name, public) VALUES ('equipment-images', 'equipment-images', true);

-- Allow anyone to view equipment images
CREATE POLICY "Anyone can view equipment images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'equipment-images');

-- Allow authenticated users to upload equipment images
CREATE POLICY "Authenticated users can upload equipment images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'equipment-images' AND auth.role() = 'authenticated');

-- Allow users to update their own equipment images
CREATE POLICY "Users can update own equipment images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'equipment-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own equipment images
CREATE POLICY "Users can delete own equipment images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'equipment-images' AND auth.uid()::text = (storage.foldername(name))[1]);