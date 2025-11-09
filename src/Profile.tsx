import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Upload, User } from 'lucide-react';

export default function Profile() {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      setUserName(user.user_metadata?.name || user.email || 'User');

      const { data: files } = await supabase.storage
        .from('profile-pictures')
        .list(`${user.id}/`, {
          limit: 1,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (files && files.length > 0) {
        const { data } = supabase.storage
          .from('profile-pictures')
          .getPublicUrl(`${user.id}/${files[0].name}`);

        setProfilePicture(data.publicUrl);
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { data: existingFiles } = await supabase.storage
        .from('profile-pictures')
        .list(`${user.id}/`);

      if (existingFiles && existingFiles.length > 0) {
        for (const existingFile of existingFiles) {
          await supabase.storage
            .from('profile-pictures')
            .remove([`${user.id}/${existingFile.name}`]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      setProfilePicture(data.publicUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Profile</h2>

      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-sky-200 shadow-md">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sky-400 to-sky-600">
                <User size={48} className="text-white" />
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800">{userName}</h3>
        </div>

        <div className="w-full pt-4 border-t border-gray-200">
          <label
            htmlFor="profile-upload"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-sky-600 text-white font-semibold rounded-xl shadow-md hover:bg-sky-700 hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <Upload size={20} />
            {uploading ? 'Uploading...' : 'Upload Profile Picture'}
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </div>

        <p className="text-xs text-gray-500 text-center">
          Supported formats: JPG, PNG, GIF (Max 5MB)
        </p>
      </div>
    </div>
  );
}
