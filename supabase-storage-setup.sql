-- Supabase Storage Setup for Profile Pictures
-- Run this in your Supabase SQL Editor to enable profile picture uploads

-- Note: Storage buckets are created through the Supabase Dashboard UI
-- Go to Storage > Create Bucket > "profile-pictures"
-- Then run this SQL to set up policies:

-- Create storage policies for profile pictures bucket
-- Allow authenticated users to upload their own profile pictures
CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-pictures' AND
  (storage.foldername(name))[1] = 'avatars' AND
  auth.uid()::text = (storage.filename(name))[1]
);

-- Allow anyone to view profile pictures (public read)
CREATE POLICY "Anyone can view profile pictures"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-pictures');

-- Allow users to update their own profile pictures
CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.filename(name))[1]
);

-- Allow users to delete their own profile pictures
CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.filename(name))[1]
);

