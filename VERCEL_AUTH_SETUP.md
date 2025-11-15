# Vercel Authentication Setup Guide

Your app is deployed at: **https://booksterisu.vercel.app/**

## ✅ What's Already Configured

Your code is already set up correctly:
- OAuth redirect uses `window.location.origin` (automatic)
- Callback handler at `/auth/callback`
- Email domain validation for ISU emails

## 🔧 Required Configuration Steps

### Step 1: Configure Supabase Auth URLs

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your project: `xapazebllxyonzrtrmcj`

2. **Navigate to Authentication Settings:**
   - Click **Authentication** in the left sidebar
   - Click **URL Configuration**

3. **Add Vercel URL to Redirect URLs:**

   Add these URLs to **Redirect URLs** list:
   ```
   https://booksterisu.vercel.app/auth/callback
   http://localhost:3000/auth/callback
   ```

4. **Set Site URL:**
   ```
   https://booksterisu.vercel.app
   ```

5. **Click "Save"**

### Step 2: Configure Google OAuth (if using Google Login)

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Select your project

2. **Navigate to Credentials:**
   - APIs & Services → Credentials
   - Click on your OAuth 2.0 Client ID

3. **Add Authorized Redirect URIs:**

   Add this URL to **Authorized redirect URIs**:
   ```
   https://xapazebllxyonzrtrmcj.supabase.co/auth/v1/callback
   ```

4. **Add Authorized JavaScript Origins (optional):**
   ```
   https://booksterisu.vercel.app
   ```

5. **Click "Save"**

### Step 3: Verify Environment Variables in Vercel

Your environment variables should already be set, but verify:

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Select your project

2. **Check Environment Variables:**
   - Settings → Environment Variables
   - Verify these are set for **Production, Preview, and Development**:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://xapazebllxyonzrtrmcj.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
     OPENROUTER_API_KEY=[your-openrouter-key]
     ```

3. **If any are missing, add them now**

### Step 4: Test Authentication

1. **Visit your app:**
   ```
   https://booksterisu.vercel.app/login
   ```

2. **Test Email/Password Login:**
   - Sign up with an @iastate.edu email
   - Verify you can log in
   - Check you're redirected to home page

3. **Test Google OAuth:**
   - Click "Sign in with Google"
   - Should redirect to Google login
   - After login, should redirect back to your app
   - Should land on home page successfully

## 🐛 Troubleshooting

### Issue: "Invalid redirect URL"
**Solution:** Make sure you added the exact URL to Supabase:
- `https://booksterisu.vercel.app/auth/callback` (with /auth/callback)

### Issue: Google OAuth redirect fails
**Solution:** Check Google Cloud Console redirect URI:
- Must be: `https://xapazebllxyonzrtrmcj.supabase.co/auth/v1/callback`
- This is your Supabase auth callback, NOT your app URL

### Issue: Invalid email address
**Solution:** The app now accepts all valid email addresses from any domain.

### Issue: Login works locally but not on Vercel
**Solution:**
1. Check Supabase redirect URLs include Vercel URL
2. Verify environment variables are set in Vercel
3. Check browser console for errors
4. Verify Google OAuth redirect URI is correct

## ✅ Testing Checklist

After configuration, test these flows:

- [ ] Visit login page loads without errors
- [ ] Email/password signup works
- [ ] Email/password login works
- [ ] Google OAuth button redirects to Google
- [ ] After Google login, redirects back to app
- [ ] Successfully lands on home page after login
- [ ] User can navigate protected pages
- [ ] Logout works correctly

## 📝 Current URLs

- **Production:** https://booksterisu.vercel.app/
- **Login Page:** https://booksterisu.vercel.app/login
- **Auth Callback:** https://booksterisu.vercel.app/auth/callback
- **Supabase Project:** https://xapazebllxyonzrtrmcj.supabase.co

## 🔒 Security Notes

- ✅ Environment variables are secure (not in git)
- ✅ OAuth uses proper redirect URLs
- ✅ Email validation enforces ISU domain
- ✅ Supabase RLS policies protect data
- ✅ HTTPS enforced on production

---

## Quick Setup Summary

1. **Supabase:** Add `https://booksterisu.vercel.app/auth/callback` to redirect URLs
2. **Google OAuth:** Add `https://xapazebllxyonzrtrmcj.supabase.co/auth/v1/callback` to redirect URIs
3. **Vercel:** Verify environment variables are set
4. **Test:** Try logging in at https://booksterisu.vercel.app/login

That's it! 🎉
