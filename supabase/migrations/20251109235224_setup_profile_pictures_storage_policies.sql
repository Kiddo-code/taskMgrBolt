/*
  # Setup storage policies for profile pictures

  1. Storage Policies
    - Allow authenticated users to upload their own profile pictures
    - Allow all authenticated users to view profile pictures
    - Allow users to update their own profile pictures
    - Allow users to delete their own profile pictures

  2. Security
    - Policies restrict uploads/updates/deletes to the user's own folder
    - Public read access for all authenticated users
*/

CREATE POLICY "Users can upload own profile picture"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view all profile pictures"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'profile-pictures');

CREATE POLICY "Users can update own profile picture"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own profile picture"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
