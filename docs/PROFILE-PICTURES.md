# 📸 Profile Picture Feature Guide

## Overview

Users can now upload profile pictures or provide a URL to personalize their Bookster profiles.

---

## ✨ Features

### Two Upload Methods

```
┌─────────────────────────────────────────────────────┐
│          PROFILE PICTURE OPTIONS                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Option 1: File Upload                              │
│  ┌─────────────────────────────────────────────┐  │
│  │  📁 Choose File → Upload → ✓ Saved         │  │
│  │  • Max 5MB                                  │  │
│  │  • JPG, PNG, GIF                            │  │
│  │  • Instant preview                          │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  Option 2: URL Input                                │
│  ┌─────────────────────────────────────────────┐  │
│  │  🔗 Paste URL → ✓ Auto Preview             │  │
│  │  • Any public image URL                     │  │
│  │  • Imgur, Gravatar, etc.                    │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 User Flow

```
1. Go to Profile Page
   │
   ▼
2. See Current Picture (or placeholder)
   │
   ├─────────────────┬──────────────────┐
   │                 │                  │
   ▼                 ▼                  ▼
UPLOAD FILE      PASTE URL         KEEP CURRENT
   │                 │                  │
   ▼                 │                  │
3. Choose File      │                  │
   │                 │                  │
   ▼                 │                  │
4. Preview Shows    │                  │
   │                 │                  │
   ▼                 │                  │
5. Click Upload     │                  │
   │                 │                  │
   ▼                 ▼                  ▼
6. ✓ Picture Updated Automatically
```

---

## 💻 Technical Implementation

### File Upload Process

```typescript
// 1. User selects file
<input
  type="file"
  accept="image/*"
  onChange={handleFileSelect}
/>

// 2. Validation
if (!file.type.startsWith('image/')) {
  error('Not an image file');
}
if (file.size > 5MB) {
  error('File too large');
}

// 3. Preview
const preview = URL.createObjectURL(file);

// 4. Upload to Supabase Storage
const filePath = `avatars/${userId}-${timestamp}.${ext}`;
await supabase.storage
  .from('profile-pictures')
  .upload(filePath, file);

// 5. Get public URL
const { publicUrl } = supabase.storage
  .from('profile-pictures')
  .getPublicUrl(filePath);

// 6. Save to profile
updateProfile({ avatar_url: publicUrl });
```

---

## 🗄️ Storage Structure

```
Supabase Storage Bucket: "profile-pictures"
│
└── avatars/
    ├── user-id-1-timestamp.jpg
    ├── user-id-2-timestamp.png
    ├── user-id-3-timestamp.gif
    └── ...

File Naming Convention:
{user_id}-{timestamp}.{extension}

Example:
550e8400-e29b-41d4-a716-446655440000-1699999999999.jpg
```

---

## 🔐 Security

### File Validation
- ✅ File type check (images only)
- ✅ File size limit (5MB max)
- ✅ Authenticated users only
- ✅ User can only upload their own picture

### Storage Policies
```sql
-- Users can only upload to their own folder
WITH CHECK (auth.uid()::text = filename)

-- Anyone can view (public bucket)
FOR SELECT TO public

-- Users can update/delete their own
USING (auth.uid()::text = filename)
```

---

## 📱 UI Components

### Profile Picture Section

```
┌──────────────────────────────────────────────────┐
│  Profile Picture                                 │
│                                                  │
│  ┌────────┐  Upload a photo or provide a URL    │
│  │  👤   │  Max file size: 5MB • JPG, PNG, GIF  │
│  │ Image │                                       │
│  └────────┘                                       │
│                                                  │
│  ╔════════════════════════════════════════╗     │
│  ║  📁 Choose File   │   🔼 Upload       ║     │
│  ╚════════════════════════════════════════╝     │
│                                                  │
│  ────────────────  OR  ─────────────────        │
│                                                  │
│  🔗 https://example.com/photo.jpg               │
│     Or paste a direct link to your profile...   │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## ✅ Features

- **Instant Preview** - See your image before uploading
- **File Info** - Shows filename and size
- **Progress Indicator** - Loading spinner during upload
- **Error Handling** - Clear error messages
- **Fallback Option** - Can use URL if upload fails
- **Demo Mode** - Works with local preview in demo mode

---

## 🧪 Testing

### Test File Upload:

1. **Go to Profile Page:**
   ```
   http://localhost:3000/profile
   ```

2. **Select a File:**
   - Click "Choose File"
   - Select an image (JPG, PNG, or GIF)
   - Max 5MB

3. **Preview:**
   - Image preview appears immediately
   - File info shows below button

4. **Upload:**
   - Click "Upload" button
   - Wait for spinner
   - Success message appears
   - Image URL updates

5. **Save Profile:**
   - Click "Save Profile"
   - Profile saved with new picture

### Test URL Input:

1. Find an image URL (e.g., from Imgur)
2. Paste in the URL input field
3. Preview appears immediately
4. Click "Save Profile"

---

## ⚠️ Troubleshooting

### "Storage bucket not configured"

**Solution:**
1. Go to Supabase Dashboard
2. Navigate to Storage
3. Create bucket named `profile-pictures`
4. Make it public
5. Run the storage policies SQL

**Fallback:**
- Users can still use URL input
- Error message guides them to use URL instead

### "Failed to upload image"

**Possible causes:**
- File too large (> 5MB)
- Not an image file
- Storage policies not set up
- Not authenticated

**Solutions:**
- Compress image before uploading
- Ensure file is JPG, PNG, or GIF
- Set up storage bucket and policies
- Log in first

### "Image not displaying"

**Causes:**
- URL is broken
- Image was deleted
- CORS issues

**Solutions:**
- Try re-uploading
- Use a different URL
- Check Supabase storage settings

---

## 🎨 UI Design

### Color Scheme
- Upload area: Gradient from primary to purple
- Border: Dashed primary-300
- Preview: Rounded full with primary border
- Buttons: Primary and secondary styles

### Animations
- Hover effects on buttons
- Scale animations on click
- Fade in for preview
- Loading spinner during upload

---

## 📊 Storage Limits

### Supabase Free Tier
- **Storage:** 1 GB
- **Bandwidth:** 2 GB/month
- **File uploads:** Unlimited

### Estimated Usage
- Average profile pic: 500 KB
- 1000 users = ~500 MB storage
- Well within free tier limits

---

## 🚀 Future Enhancements

- Drag-and-drop file upload
- Image cropping tool
- Multiple image support
- Automatic image optimization
- Webcam capture
- Avatar generator/presets
- GIF/animated avatar support

---

**Built for Swan Hacks 2025** 🦢

Profile pictures help personalize the student marketplace and build a stronger community connection!

