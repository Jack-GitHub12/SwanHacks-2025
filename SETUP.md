# 🚀 Bookster Setup Guide

Complete setup instructions for the Iowa State Textbook Marketplace.

---

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier)
- OpenRouter API key (for AI features)
- Google Cloud Console account (for OAuth)

---

## 🔧 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create `.env.local` in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenRouter (for AI features)
OPENROUTER_API_KEY=your_openrouter_api_key

# Optional: Demo Mode
NEXT_PUBLIC_DEMO_MODE=false
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 🗄️ Database Setup (Supabase)

### Step 1: Create Tables

Run this SQL in your Supabase SQL Editor:

```sql
-- Create listings table
create table listings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete cascade,
  course_code text not null,
  book_title text not null,
  price numeric not null,
  contact_info text not null,
  condition text,
  notes text,
  status text default 'active' not null
);

-- Enable Row Level Security
alter table listings enable row level security;

-- Create policies
create policy "Anyone can view active listings"
  on listings for select
  using (status = 'active');

create policy "Users can insert their own listings"
  on listings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own listings"
  on listings for update
  using (auth.uid() = user_id);
```

### Step 2: Create Storage Bucket for Profile Pictures

1. **Go to Storage in Supabase Dashboard:**
   - Navigate to Storage → Create Bucket
   - Bucket name: `profile-pictures`
   - Public bucket: ✅ Yes (checked)
   - Click "Create bucket"

2. **Set up Storage Policies:**
   
   Run the SQL from `supabase-storage-setup.sql` or paste this:
   
```sql
-- Allow authenticated users to upload their own profile pictures
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'profile-pictures' AND
  (storage.foldername(name))[1] = 'avatars'
);

-- Allow anyone to view profile pictures (public read)
CREATE POLICY "Anyone can view profile pictures"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'profile-pictures');

-- Allow users to update their own profile pictures
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'profile-pictures');

-- Allow users to delete their own profile pictures
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'profile-pictures');
```

**Note:** If you skip this step, users can still use URL input for profile pictures.

---

## 🔐 Google OAuth Setup

### Step 1: Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Navigate to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**

### Step 2: Configure OAuth Consent Screen

- **User Type:** External
- **App name:** Bookster
- **User support email:** Your email
- **Scopes:** `email` and `profile`

### Step 3: Create OAuth Client

- **Application type:** Web application
- **Authorized JavaScript origins:**
  - `http://localhost:3000`
  - `https://your-production-domain.com`
- **Authorized redirect URIs:**
  - `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`

Copy your **Client ID** and **Client Secret**.

### Step 4: Configure Supabase

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Google** provider
3. Paste your Client ID and Client Secret
4. Save configuration

### Step 5: Update Site URLs

In Supabase → **Authentication** → **URL Configuration**:
- **Site URL:** `http://localhost:3000` (or your production URL)
- **Redirect URLs:** Add your application URLs including:
  - `http://localhost:3000/auth/callback` (development)
  - `https://your-production-domain.com/auth/callback` (production)

---

## 🤖 AI Features Setup (OpenRouter)

### Get API Key

1. Sign up at [OpenRouter.ai](https://openrouter.ai/)
2. Go to **API Keys** → Create new key
3. Add to `.env.local` as `OPENROUTER_API_KEY`

### AI Features Available

- **Description Enhancement** - Improves listing descriptions with Google Gemini
- **Search Suggestions** - Smart search assistance for finding items

---

## 🚀 Deployment

### Deploy to Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login and deploy:
```bash
netlify login
netlify init
netlify deploy --prod
```

3. Set environment variables in Netlify dashboard

### Environment Variables for Production

Make sure to set these in your hosting platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENROUTER_API_KEY`

---

## ✅ Verification Checklist

- [ ] Dependencies installed
- [ ] Environment variables set
- [ ] Supabase tables created
- [ ] RLS policies configured
- [ ] Google OAuth configured
- [ ] OpenRouter API key added
- [ ] Development server runs
- [ ] Can create account
- [ ] Can log in
- [ ] Can post listing
- [ ] Can browse listings
- [ ] AI features work

---

## 🐛 Troubleshooting

### Issue: "Invalid API Key"
- Check `.env.local` file exists
- Verify environment variables are correct
- Restart development server

### Issue: "Authentication Error"
- Verify Google OAuth redirect URIs match exactly
- Check Supabase site URL is configured
- Clear browser cookies and try again

### Issue: "Database Error"
- Verify Supabase tables are created
- Check RLS policies are enabled
- Ensure user is authenticated

### Issue: "AI Features Not Working"
- Verify OpenRouter API key is valid
- Check API key has sufficient credits
- Review API endpoint logs

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenRouter API Docs](https://openrouter.ai/docs)
- [Google OAuth Guide](https://developers.google.com/identity/protocols/oauth2)

---

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Supabase logs (Dashboard → Logs)
3. Check browser console for errors
4. Verify all environment variables are set

---

## 🎉 You're Ready!

Your Bookster marketplace is now set up and ready to use!

