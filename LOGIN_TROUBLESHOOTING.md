# Login Troubleshooting Guide

## ✅ What Was Fixed

The login redirect loop issue has been resolved with these changes:

1. **Session Establishment Delay** - Added 500ms delay after login to ensure session is fully established
2. **Reliable Redirect** - Changed from `router.push` to `window.location.href` for guaranteed redirect
3. **Prevent Double Login** - Login page now redirects authenticated users away
4. **Clean History** - Using `router.replace` instead of `router.push` to avoid browser history issues

## 🧪 How to Test Login on Vercel

### Method 1: Email/Password Login

1. Visit: https://booksterisu.vercel.app/signup
2. Create an account with **@iastate.edu** email
3. Check your email for confirmation link (if email confirmation is enabled)
4. Visit: https://booksterisu.vercel.app/login
5. Enter your credentials
6. Click "Sign In"
7. **Expected:** Should redirect to home page after ~500ms

### Method 2: Google OAuth Login

1. Visit: https://booksterisu.vercel.app/login
2. Click "Sign in with Google"
3. Select your Google account
4. **Expected:** Should redirect to `/auth/callback` then to home page
5. **Note:** Must be @iastate.edu or @gmail.com email

## 🔍 Debugging Steps

### If login still redirects back to /login:

1. **Open Browser DevTools** (F12 or Right Click → Inspect)

2. **Check Console Tab** for errors:
   ```
   - Look for Supabase authentication errors
   - Check for CORS errors
   - Look for session storage errors
   ```

3. **Check Network Tab**:
   ```
   - Filter by "auth" or "session"
   - Look for failed requests (red)
   - Check response codes (should be 200)
   ```

4. **Check Application Tab → Storage**:
   ```
   - Local Storage → Check for supabase auth tokens
   - Session Storage → Check for session data
   - Cookies → Check for sb-* cookies
   ```

### Common Issues and Solutions

#### Issue: "Session not found" error
**Cause:** Supabase redirect URLs not configured
**Solution:**
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add: `https://booksterisu.vercel.app/auth/callback`
3. Set Site URL: `https://booksterisu.vercel.app`

#### Issue: OAuth redirect fails
**Cause:** Google OAuth redirect URI not configured
**Solution:**
1. Go to Google Cloud Console → Credentials
2. Add redirect URI: `https://xapazebllxyonzrtrmcj.supabase.co/auth/v1/callback`

#### Issue: "Invalid email" error
**Cause:** Not using @iastate.edu email
**Solution:** Use an Iowa State email address or @gmail.com for testing

#### Issue: Session exists but redirect loops
**Cause:** Environment variables not set in Vercel
**Solution:**
1. Vercel Dashboard → Settings → Environment Variables
2. Verify these are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENROUTER_API_KEY`

#### Issue: Login works locally but not on Vercel
**Cause:** Different environment configurations
**Solution:**
1. Check Supabase has BOTH redirect URLs:
   - `http://localhost:3000/auth/callback` (local)
   - `https://booksterisu.vercel.app/auth/callback` (production)
2. Verify environment variables match in both environments

## 🔐 Security Checklist

Before going live, verify:

- [ ] Supabase RLS (Row Level Security) is enabled
- [ ] Only @iastate.edu emails can sign up (or intended domains)
- [ ] Environment variables are not exposed in client code
- [ ] HTTPS is enforced on production
- [ ] OAuth providers are properly configured
- [ ] Redirect URLs are whitelisted in Supabase

## 📊 Monitoring Login Success

To verify login is working:

1. **Test Account Creation**:
   ```bash
   # Create a test account
   Email: test@iastate.edu
   Password: TestPassword123!
   ```

2. **Test Login Flow**:
   ```
   1. Visit /login
   2. Enter credentials
   3. Submit form
   4. Wait for redirect (~500ms)
   5. Verify URL is now /
   6. Verify you can see authenticated content
   ```

3. **Test Protected Routes**:
   ```
   - Try accessing /browse
   - Try accessing /discussions
   - Try accessing /events
   - Try accessing /profile
   - All should be accessible when logged in
   ```

4. **Test Logout**:
   ```
   1. Click logout in header
   2. Verify redirected to /login
   3. Try accessing protected route
   4. Verify redirected back to /login
   ```

## 🛠️ Advanced Debugging

### Enable Verbose Logging

Add this to `lib/supabase.ts` temporarily:

```typescript
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event);
  console.log('Session:', session);
  console.log('User:', session?.user);
});
```

### Check Session Manually

In browser console:
```javascript
// Check if session exists
const { data: { session } } = await supabase.auth.getSession();
console.log('Current session:', session);

// Check user
const { data: { user } } = await supabase.auth.getUser();
console.log('Current user:', user);
```

### Force Session Refresh

```javascript
const { data: { session }, error } = await supabase.auth.refreshSession();
console.log('Refreshed session:', session, error);
```

## 📞 Need Help?

If login still doesn't work after trying these steps:

1. Check the full guide: `VERCEL_AUTH_SETUP.md`
2. Review Supabase logs: Dashboard → Logs → Auth logs
3. Check Vercel deployment logs: Dashboard → Deployments → [Latest] → Logs
4. Verify all configuration steps were completed

## ✅ Success Indicators

You'll know login is working when:

1. ✅ Can access https://booksterisu.vercel.app/login
2. ✅ Can submit credentials without errors
3. ✅ Redirects to home page after ~500ms
4. ✅ Header shows "Logout" button instead of "Login"
5. ✅ Can access all protected pages (/browse, /discussions, etc.)
6. ✅ Logout button works and redirects to /login
7. ✅ Browser DevTools shows no auth errors

---

## 🎯 Quick Fix Summary

**Most Common Fix:**
1. Supabase Dashboard → Authentication → URL Configuration
2. Add redirect URL: `https://booksterisu.vercel.app/auth/callback`
3. Set site URL: `https://booksterisu.vercel.app`
4. Save and try login again

If that doesn't work, follow the full troubleshooting guide above!
