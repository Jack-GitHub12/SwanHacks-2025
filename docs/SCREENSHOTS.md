# 📸 Screenshot Guide for Bookster

This guide will help you capture and add screenshots to showcase your Swan Hacks 2025 project.

---

## 📋 Required Screenshots

### 1. Landing Page (`landing.png`)
**URL:** `http://localhost:3000/landing`

**What to capture:**
- Full page view showing the hero section
- "Buy & Sell Items" animated heading
- "The Smart Way" gradient text
- Feature cards with icons
- "Get Started" and "Sign In" buttons

**Tips:**
- Take screenshot before any scrolling
- Make sure all animations have loaded
- Use full browser width (1920x1080 recommended)

---

### 2. Browse Marketplace (`browse.png`)
**URL:** `http://localhost:3000/browse`

**What to capture:**
- Header with search bar
- Category filters (All, Computer Science, Mathematics, etc.)
- At least 6 item cards visible
- Sorting options
- Item count indicator

**Tips:**
- Make sure demo data is loaded
- Show the glassmorphism effects
- Capture the filter buttons in different states

---

### 3. Post Item (`post.png`)
**URL:** `http://localhost:3000/post`

**What to capture:**
- "Sell Your Item" heading
- Form with all fields visible
- AI enhancement buttons (sparkle icons)
- Price suggestion feature
- Submit button

**Tips:**
- Scroll to show the full form
- You can partially fill in some fields to show interaction
- Make sure the glassmorphism card is fully visible

---

### 4. Discussion Board (`discussions.png`)
**URL:** `http://localhost:3000/discussions`

**What to capture:**
- Search bar
- "New Discussion" button
- Category filter pills (All Categories, Clubs & Organizations, etc.)
- At least 4-5 discussion cards
- View counts and reply counts

**Tips:**
- Show different category buttons
- Ensure demo discussions are visible
- Capture the "ISU Community Board" header

---

### 5. Events Feed (`events.png`)
**URL:** `http://localhost:3000/events`

**What to capture:**
- "Upcoming Events" heading
- Sort options (Top Rated, Date, Newest, Most Popular)
- At least 3-4 event cards
- Vote buttons (upvote/downvote)
- "Add to Google Calendar" buttons
- Event details (date, time, location)

**Tips:**
- Show pinned events at the top
- Capture event tags (Open, Pinned, etc.)
- Include vote scores

---

### 6. Login Page (`login.png`)
**URL:** `http://localhost:3000/login`

**What to capture:**
- Bookster logo
- "Welcome Back" animated heading
- "Continue with Google" button with Google logo
- Email/password form
- "Sign up" link at bottom
- Gradient background with blur effects

**Tips:**
- Center the card in the viewport
- Show the animated background effects
- Include the "Back to home" button

---

### 7. AI Features (`ai-features.png`)
**URL:** `http://localhost:3000/post`

**What to capture:**
- Focus on the AI enhancement section
- Show "Enhance with AI" button (with sparkle icon)
- Demonstrate the AI enhancement in action
- Show the "Enhanced with AI!" tooltip

**Alternative:** Create a collage showing:
- Before/after AI description enhancement
- The enhance button in loading state
- The success tooltip after enhancement

---

## 🛠️ How to Take Screenshots

### Option 1: Browser Built-in Tools
**Chrome/Edge:**
1. Press `F12` to open DevTools
2. Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
3. Type "Capture full size screenshot"
4. Press Enter

**Firefox:**
1. Press `Ctrl+Shift+I` (Windows) or `Cmd+Opt+I` (Mac)
2. Click the three dots menu
3. Select "Take a screenshot" → "Save full page"

### Option 2: Browser Extensions
- **Awesome Screenshot** - Chrome/Firefox
- **Nimbus Screenshot** - Chrome/Firefox
- **Full Page Screen Capture** - Chrome

### Option 3: System Tools
**Mac:**
- `Cmd+Shift+4` - Select area
- `Cmd+Shift+3` - Full screen
- `Cmd+Shift+5` - Screenshot options

**Windows:**
- `Windows+Shift+S` - Snipping tool
- `Windows+PrtScn` - Full screen
- Use Snip & Sketch app

---

## 📐 Screenshot Specifications

### Recommended Settings
- **Resolution:** 1920x1080 (Full HD)
- **Format:** PNG (for quality)
- **File Size:** < 2MB per image (compress if needed)
- **Aspect Ratio:** 16:9

### Image Optimization
Use these tools to compress images:
- **TinyPNG** - https://tinypng.com/
- **Squoosh** - https://squoosh.app/
- **ImageOptim** (Mac) - https://imageoptim.com/

---

## 📂 File Organization

Place all screenshots in the `docs/images/` directory:

```
docs/
└── images/
    ├── landing.png
    ├── browse.png
    ├── post.png
    ├── discussions.png
    ├── events.png
    ├── login.png
    └── ai-features.png
```

---

## 🎨 Screenshot Tips

### Do's ✅
- Use consistent browser window size
- Clear browser cache before screenshots
- Make sure demo data is loaded
- Show the app in its best state
- Use incognito/private mode for clean UI
- Take screenshots in good lighting
- Show interactive elements (hover states if possible)

### Don'ts ❌
- Don't include your personal information
- Don't show browser bookmarks or extensions
- Don't capture error states (unless showing error handling)
- Don't use low resolution
- Don't include unnecessary browser UI

---

## 🖼️ Alternative: Use Hosted Screenshots

If you prefer, you can host screenshots on:
- **Imgur** - https://imgur.com/
- **GitHub Issues** - Upload and copy image URL
- **Cloudinary** - https://cloudinary.com/

Then update the README with direct URLs:
```markdown
![Landing Page](https://imgur.com/your-image-url.png)
```

---

## ✅ Checklist

Before submitting, make sure you have:
- [ ] All 7 screenshots captured
- [ ] Images optimized (< 2MB each)
- [ ] Files named correctly
- [ ] Files placed in `docs/images/`
- [ ] README.md paths updated (if needed)
- [ ] All screenshots show the app in working state
- [ ] No personal information visible
- [ ] Consistent styling across all screenshots

---

## 🆘 Troubleshooting

**Issue: Demo data not showing**
- Set `NEXT_PUBLIC_DEMO_MODE=false` in `.env.local`
- Restart the dev server
- Refresh the page

**Issue: Animations not capturing**
- Wait 2-3 seconds after page load
- Use browser screenshot tools instead of system tools
- Record a short video and extract frames

**Issue: Images too large**
- Use TinyPNG or Squoosh to compress
- Save as PNG-8 instead of PNG-24
- Reduce resolution to 1600x900 if needed

---

## 🎯 Pro Tips

1. **Consistency** - Use the same browser zoom level (100%)
2. **Clean State** - Use incognito mode or clear cookies
3. **Full Features** - Make sure you're logged in to show all features
4. **Mobile View** - Consider adding mobile screenshots too
5. **GIF Demos** - Create animated GIFs for interactive features

---

**Good luck with your Swan Hacks 2025 submission!** 🦢✨

