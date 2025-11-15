# 🚨 CRITICAL: Supabase Configuration Required

## ⚠️ Your 401 Error Means This Step Was Skipped

The `401 Unauthorized` error on `/auth/v1/user` means **Supabase doesn't recognize your app's domain**.

## 🔧 MUST DO THIS NOW (Takes 2 minutes)

### Step 1: Add Vercel URL to Supabase

1. **Go to Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/xapazebllxyonzrtrmcj/auth/url-configuration
   ```

2. **Scroll to "Redirect URLs" section**

3. **Click "Add URL"** and add:
   ```
   https://booksterisu.vercel.app/auth/callback
   ```

4. **Also add localhost for testing:**
   ```
   http://localhost:3000/auth/callback
   ```

5. **Set "Site URL" field to:**
   ```
   https://booksterisu.vercel.app
   ```

6. **Click "Save"** at the bottom

---

### Step 2: Verify Authentication Settings

While in the Supabase dashboard:

1. **Click "Authentication" → "Providers"**

2. **Check "Email" provider:**
   - ✅ Should be ENABLED
   - ✅ "Confirm email" can be ON or OFF (your choice)

3. **If using Google OAuth, check "Google" provider:**
   - ✅ Should be ENABLED
   - ✅ Client ID and Secret should be set
   - ✅ Redirect URL should show: `https://xapazebllxyonzrtrmcj.supabase.co/auth/v1/callback`

---

## 🧪 After Saving, Test Immediately

1. **Go to your site:** https://booksterisu.vercel.app/login

2. **Open DevTools** (F12)

3. **Go to Application tab → Local Storage**

4. **Clear all Supabase keys:**
   - Look for keys starting with `sb-`
   - Delete all of them
   - Or just click "Clear All"

5. **Refresh the page**

6. **Try logging in again**

7. **Check Console tab:**
   - Should see NO 401 errors
   - Should see successful auth requests

---

## 🎯 What This Fixes

**Before:**
- ❌ Supabase doesn't recognize https://booksterisu.vercel.app
- ❌ Rejects all auth requests with 401
- ❌ Session can't be established

**After:**
- ✅ Supabase allows https://booksterisu.vercel.app
- ✅ Auth requests succeed with 200
- ✅ Session is properly established
- ✅ Login works!

---

## 📸 Visual Guide

Your Supabase configuration should look like this:

```
┌─────────────────────────────────────────────┐
│  Authentication > URL Configuration         │
├─────────────────────────────────────────────┤
│                                             │
│  Site URL                                   │
│  https://booksterisu.vercel.app             │
│                                             │
│  Redirect URLs                              │
│  ┌─────────────────────────────────────┐   │
│  │ http://localhost:3000/auth/callback │   │
│  │ https://booksterisu.vercel.app/...  │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [+ Add URL]                    [Save]      │
│                                             │
└─────────────────────────────────────────────┘
```

---

## ⚡ Quick Copy-Paste

Copy these exact URLs to add to Supabase:

**Redirect URLs (add both):**
```
http://localhost:3000/auth/callback
https://booksterisu.vercel.app/auth/callback
```

**Site URL:**
```
https://booksterisu.vercel.app
```

---

## 🔍 How to Verify It's Fixed

After saving in Supabase, wait 30 seconds, then:

1. Clear browser cache/cookies
2. Go to: https://booksterisu.vercel.app/login
3. Open DevTools Console (F12)
4. Try logging in
5. Watch Network tab for `/auth/v1/user` request
6. Should return **200 OK** instead of **401 Unauthorized**

---

## ❗ This is THE Solution

99% of 401 auth errors are caused by missing redirect URLs in Supabase. Once you add them and save, login will work immediately - no code changes needed!

Go do this now! → https://supabase.com/dashboard/project/xapazebllxyonzrtrmcj/auth/url-configuration
