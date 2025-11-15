export interface UserProfile {
  id: string;
  created_at: string;
  updated_at: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  major?: string;
  graduation_year?: number;
}

export interface UpdateProfileData {
  username?: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  major?: string;
  graduation_year?: number;
}

