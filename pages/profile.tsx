import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Flex, Heading, Text, Input, Textarea, Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, DEMO_MODE } from '@/lib/supabase';
import { getDemoProfile, setDemoProfile } from '@/lib/demoStorage';
import type { UserProfile, UpdateProfileData } from '@/types/profile';

export default function Profile() {
  const router = useRouter();
  const { user, loading: authLoading, refreshProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UpdateProfileData>({
    username: '',
    display_name: '',
    avatar_url: '',
    bio: '',
    major: '',
    graduation_year: undefined,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      // INSTANTLY show profile (from session storage or default)
      const defaultProfile = {
        username: user.email?.split('@')[0] || '',
        display_name: user.email?.split('@')[0] || 'User',
        avatar_url: '',
        bio: '',
        major: '',
        graduation_year: undefined,
      };
      
      if (DEMO_MODE) {
        // Load from session storage if exists
        const savedProfile = getDemoProfile(defaultProfile);
        setFormData(savedProfile);
        setIsLoading(false);
        console.log('DEMO_MODE enabled - loaded from session storage');
        return;
      }
      
      setFormData(defaultProfile);
      setIsLoading(false);
      console.log('Showing default profile instantly');

      console.log('Attempting to fetch real profile from Supabase...');
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Profile load error:', error);
        console.log('Keeping default profile');
        return;
      }

      // Only update if we got real profile data
      if (data) {
        console.log('Real profile loaded');
        setProfile(data);
        setFormData({
          username: data.username || '',
          display_name: data.display_name || '',
          avatar_url: data.avatar_url || '',
          bio: data.bio || '',
          major: data.major || '',
          graduation_year: data.graduation_year || undefined,
        });
      } else {
        console.log('No existing profile - keeping defaults');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      console.log('Keeping default profile');
      // Default already showing, form is editable
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile || !user) return;

    setIsUploading(true);
    setError('');

    try {
      if (DEMO_MODE) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Convert image to base64 so it persists in localStorage
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const updatedFormData = { ...formData, avatar_url: base64String };
          setFormData(updatedFormData);
          // Save to localStorage so it persists across sessions!
          setDemoProfile(updatedFormData);
          setMessage('Image uploaded and saved! (Demo mode - stored in browser)');
          setSelectedFile(null);
          setPreviewUrl('');
          setIsUploading(false);
        };
        reader.readAsDataURL(selectedFile);
        return;
      }

      // Generate file path as required by storage policy: avatars/{user_id}
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `avatars/${user.id}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: true, // Allow updating existing profile pictures
        });

      if (uploadError) {
        // If bucket doesn't exist, show helpful message
        if (uploadError.message.includes('not found')) {
          throw new Error('Storage bucket not configured. Using URL input instead.');
        }
        throw uploadError;
      }

      // Get public URL with cache-busting parameter
      const { data: urlData } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      if (urlData.publicUrl) {
        // Add cache-busting parameter to ensure fresh image loads
        const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;
        setFormData({ ...formData, avatar_url: avatarUrl });
        setMessage('Image uploaded successfully!');
        setSelectedFile(null);
        setPreviewUrl('');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setError(error.message || 'Failed to upload image. You can still use a URL instead.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsSaving(true);

    try {
      if (!user) {
        throw new Error('Not authenticated');
      }

      if (DEMO_MODE) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Save to session storage so it persists
        setDemoProfile(formData);
        
        setMessage('Profile saved! (Demo mode - stored in browser)');
        setIsSaving(false);
        return;
      }

      const profileData = {
        id: user.id,
        ...formData,
        updated_at: new Date().toISOString(),
      };

      const { error: upsertError } = await supabase
        .from('user_profiles')
        .upsert(profileData);

      if (upsertError) throw upsertError;

      // Reload profile to ensure changes are reflected
      await loadProfile();
      // Also refresh the profile in the auth context
      await refreshProfile();

      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      setError(error.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <Flex minH="100vh" align="center" justify="center" className="bg-gradient-to-br from-gray-50 via-white to-primary-50/20">
        <Box textAlign="center">
          <div className="spinner w-12 h-12 mx-auto mb-4" />
          <Text color="gray.600">Loading profile...</Text>
        </Box>
      </Flex>
    );
  }

  if (!user) return null;

  return (
    <>
      <Head>
        <title>Edit Profile - Bookster</title>
        <meta name="description" content="Edit your Bookster profile" />
      </Head>

      <Box minH="100vh" display="flex" flexDirection="column" className="bg-gradient-to-br from-gray-50 via-white to-primary-50/20 relative">
        <div className="fixed inset-0 bg-noise opacity-[0.02] pointer-events-none"></div>
        <Header subtitle="Edit Your Profile" />

        <Box flex={1} py={8}>
          <Box maxW="3xl" mx="auto" px={{ base: 4, sm: 6, lg: 8 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Box className="glass-enhanced rounded-2xl p-8">
                <Heading as="h1" fontSize="3xl" fontWeight="bold" color="gray.900" mb={2}>
                  Edit Profile
                </Heading>
                <Text fontSize="md" color="gray.600" mb={6}>
                  Update your information and customize your profile
                </Text>

                {message && (
                  <Box bg="green.50" border="1px solid" borderColor="green.200" color="green.700" px={4} py={3} borderRadius="xl" mb={6}>
                    {message}
                  </Box>
                )}

                {error && (
                  <Box bg="red.50" border="1px solid" borderColor="red.200" color="red.600" px={4} py={3} borderRadius="xl" mb={6}>
                    {error}
                  </Box>
                )}

                <form onSubmit={handleSave} className="space-y-6">
                  {/* Email (read-only) */}
                  <Box>
                    <Text as="label" fontSize="sm" fontWeight="semibold" color="gray.700" mb={2} display="block">
                      Email (ISU)
                    </Text>
                    <Input
                      value={user.email || ''}
                      disabled
                      className="input-enhanced bg-gray-100"
                      size="lg"
                    />
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Your ISU email cannot be changed
                    </Text>
                  </Box>

                  {/* Username */}
                  <Box>
                    <Text as="label" fontSize="sm" fontWeight="semibold" color="gray.700" mb={2} display="block">
                      Username
                    </Text>
                    <Input
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="cyclone_student"
                      className="input-enhanced"
                      size="lg"
                      maxLength={30}
                    />
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Used for display across the platform
                    </Text>
                  </Box>

                  {/* Display Name */}
                  <Box>
                    <Text as="label" fontSize="sm" fontWeight="semibold" color="gray.700" mb={2} display="block">
                      Display Name
                    </Text>
                    <Input
                      value={formData.display_name}
                      onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                      placeholder="John Doe"
                      className="input-enhanced"
                      size="lg"
                      maxLength={50}
                    />
                  </Box>

                  {/* Profile Picture Upload */}
                  <Box>
                    <Text as="label" fontSize="sm" fontWeight="semibold" color="gray.700" mb={2} display="block">
                      Profile Picture
                    </Text>
                    
                    {/* Current/Preview Image */}
                    <Flex align="center" gap={4} mb={4}>
                      <Box
                        w={24}
                        h={24}
                        borderRadius="full"
                        overflow="hidden"
                        border="3px solid"
                        borderColor="primary.200"
                        bg="gray.100"
                        position="relative"
                      >
                        {(previewUrl || formData.avatar_url) ? (
                          <img 
                            src={previewUrl || formData.avatar_url} 
                            alt="Profile preview" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23e5e7eb" width="100" height="100"/><circle cx="50" cy="40" r="15" fill="%239ca3af"/><path d="M20,85 Q50,70 80,85" fill="%239ca3af"/></svg>';
                            }}
                          />
                        ) : (
                          <Flex align="center" justify="center" h="full" color="gray.400">
                            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </Flex>
                        )}
                      </Box>
                      
                      <Box flex={1}>
                        <Text fontSize="sm" color="gray.600" mb={2}>
                          Upload a photo or provide a URL
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Max file size: 5MB • JPG, PNG, or GIF
                        </Text>
                      </Box>
                    </Flex>

                    {/* File Upload */}
                    <Box mb={3} className="bg-gradient-to-br from-primary-50 to-purple-50 p-4 rounded-xl border-2 border-dashed border-primary-300">
                      <Flex direction="column" gap={3}>
                        <Flex align="center" gap={3}>
                          <label htmlFor="avatar-upload" className="flex-1">
                            <input
                              type="file"
                              id="avatar-upload"
                              accept="image/*"
                              onChange={handleFileSelect}
                              className="hidden"
                            />
                            <Box
                              as="div"
                              className="btn btn-secondary w-full cursor-pointer text-center"
                            >
                              <Flex align="center" justify="center" gap={2}>
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5m0 0L7 8m5-5v12" />
                                </svg>
                                {selectedFile ? selectedFile.name : 'Choose File'}
                              </Flex>
                            </Box>
                          </label>
                          
                          {selectedFile && (
                            <motion.button
                              type="button"
                              onClick={handleUploadImage}
                              disabled={isUploading}
                              className="btn btn-primary px-6"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {isUploading ? (
                                <span className="flex items-center gap-2">
                                  <span className="spinner w-4 h-4 border-white" />
                                  Uploading...
                                </span>
                              ) : (
                                'Upload'
                              )}
                            </motion.button>
                          )}
                        </Flex>
                        
                        {selectedFile && (
                          <Text fontSize="xs" color="gray.600" className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                          </Text>
                        )}
                      </Flex>
                    </Box>

                    {/* Or separator */}
                    <Flex align="center" gap={3} mb={3}>
                      <Box flex={1} h="1px" bg="gray.200" />
                      <Text fontSize="xs" color="gray.500" fontWeight="medium">OR</Text>
                      <Box flex={1} h="1px" bg="gray.200" />
                    </Flex>

                    {/* URL Input */}
                    <Box>
                      <Input
                        type="url"
                        value={formData.avatar_url}
                        onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                        placeholder="https://example.com/your-photo.jpg"
                        className="input-enhanced"
                        size="lg"
                      />
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        Or paste a direct link to your profile picture
                      </Text>
                    </Box>
                  </Box>

                  {/* Bio */}
                  <Box>
                    <Text as="label" fontSize="sm" fontWeight="semibold" color="gray.700" mb={2} display="block">
                      Bio
                    </Text>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      className="input-enhanced w-full"
                      rows={4}
                      maxLength={500}
                    />
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      {formData.bio?.length || 0}/500 characters
                    </Text>
                  </Box>

                  {/* Major */}
                  <Box>
                    <Text as="label" fontSize="sm" fontWeight="semibold" color="gray.700" mb={2} display="block">
                      Major
                    </Text>
                    <Input
                      value={formData.major}
                      onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                      placeholder="Computer Science"
                      className="input-enhanced"
                      size="lg"
                    />
                  </Box>

                  {/* Graduation Year */}
                  <Box>
                    <Text as="label" fontSize="sm" fontWeight="semibold" color="gray.700" mb={2} display="block">
                      Expected Graduation Year
                    </Text>
                    <Input
                      type="number"
                      value={formData.graduation_year || ''}
                      onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value ? parseInt(e.target.value) : undefined })}
                      placeholder="2026"
                      className="input-enhanced"
                      size="lg"
                      min={2024}
                      max={2035}
                    />
                  </Box>

                  {/* Buttons */}
                  <Flex gap={4} justify="end" pt={4}>
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="btn btn-secondary"
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save Profile'}
                    </button>
                  </Flex>
                </form>
              </Box>
            </motion.div>
          </Box>
        </Box>

        <Footer />
      </Box>
    </>
  );
}

