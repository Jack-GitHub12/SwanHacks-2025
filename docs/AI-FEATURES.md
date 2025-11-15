# 🤖 AI Features Documentation

## Overview

Bookster uses **Google Gemini** via OpenRouter to provide intelligent features that enhance the user experience.

---

## ✅ Active AI Features

### 1. **Description Enhancement** 

**Location:** Post Item page (`/post`)

**How it works:**
1. User enters course code and book title
2. User (optionally) enters initial notes/description
3. User clicks the "Enhance" button (sparkle icon) in the notes field
4. AI analyzes the item and generates an enhanced description

**Example:**

**Before Enhancement:**
```
Some highlighting
```

**After Enhancement:**
```
This textbook is in good condition with minimal highlighting in key sections. 
Perfect for CS 161 students. All pages intact, no tears or damage. A great 
way to save money compared to buying new from the bookstore!
```

**Technical Details:**
- **Model:** Google Gemini (via OpenRouter)
- **Endpoint:** `/api/ai/enhance-description`
- **Max Tokens:** 100
- **Rate Limit:** 10 requests per minute per user
- **Authentication:** Required (Bearer token)

**User Benefits:**
- Saves time writing descriptions
- Creates more attractive listings
- Improves chances of selling
- Maintains professional tone

---

### 2. **Search Suggestions** (Future Feature)

**Location:** Browse page search bar

**Status:** Planned for future implementation

**Description:** Will provide intelligent course code suggestions as users type.

---

## ❌ Removed AI Features

### Price Suggestions

**Reason for removal:** 
- Users prefer to set their own prices based on item condition
- Manual pricing gives sellers more control
- Market prices vary significantly by timing and demand
- Reduces API costs

---

## 🔧 Technical Implementation

### API Structure

```typescript
// POST /api/ai/enhance-description
{
  courseCode: string,
  bookTitle: string,
  currentNotes: string
}

// Response
{
  enhancedDescription: string,
  tokensUsed: number
}
```

### Security Features

✅ **Authentication Required** - Must be logged in  
✅ **Rate Limiting** - 10 requests per minute per user  
✅ **Input Validation** - Length limits on all inputs  
✅ **CORS Protection** - Proper headers configured  
✅ **Error Handling** - Graceful failures with user feedback

### OpenRouter Configuration

```typescript
{
  model: "google/gemini-flash-1.5",
  messages: [
    {
      role: "system",
      content: "You are a helpful assistant..."
    },
    {
      role: "user",
      content: "Enhance this description..."
    }
  ],
  max_tokens: 100
}
```

---

## 💰 Cost Optimization

**Strategies Used:**
1. **Low Token Limit** - Max 100 tokens for descriptions
2. **Rate Limiting** - Prevents abuse
3. **Authentication** - Only registered users
4. **Efficient Prompts** - Concise system messages
5. **No Price Suggestions** - Removed costly feature

**Estimated Costs:**
- Description Enhancement: ~$0.001 per request
- Monthly (1000 users, 5 requests each): ~$5

---

## 📊 Usage Analytics (Demo Mode)

When `NEXT_PUBLIC_DEMO_MODE=true`:
- AI features return mock responses
- No actual API calls made
- Instant responses for testing
- Zero API costs

---

## 🚀 How to Use AI Enhancement

### For Users:

1. Go to "Post Item" page
2. Fill in Course Code and Book Title (required)
3. Optionally add some notes
4. Click the sparkle "Enhance" button in the notes field
5. Wait 2-3 seconds
6. Enhanced description appears automatically!
7. Edit as needed before posting

### For Developers:

```typescript
// Component Usage
const handleEnhanceDescription = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  const response = await fetch('/api/ai/enhance-description', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`,
    },
    body: JSON.stringify({
      courseCode: formData.course_code,
      bookTitle: formData.book_title,
      currentNotes: formData.notes,
    }),
  });
  
  const data = await response.json();
  // Use data.enhancedDescription
};
```

---

## 🧪 Testing AI Features

### Manual Testing:

1. **Start Dev Server:**
   ```bash
   npm run dev
   ```

2. **Set OpenRouter API Key:**
   ```env
   OPENROUTER_API_KEY=sk-or-xxxxx
   ```

3. **Test Enhancement:**
   - Log in to the app
   - Go to Post Item page
   - Enter: CS 161 / Introduction to Computer Science
   - Click "Enhance" button
   - Verify enhanced description appears

### Expected Behavior:

- ✅ Button shows spinner while processing
- ✅ Enhanced text appears in notes field
- ✅ Success tooltip shows "✨ Enhanced with AI!"
- ✅ User can edit the enhanced description
- ✅ Error alerts if API fails

---

## ⚠️ Troubleshooting

### "Failed to enhance description"

**Possible causes:**
1. OpenRouter API key not set
2. Not logged in
3. Missing course code or book title
4. Rate limit exceeded
5. API key has no credits

**Solutions:**
1. Check `.env.local` for `OPENROUTER_API_KEY`
2. Ensure user is authenticated
3. Fill in required fields first
4. Wait 1 minute and try again
5. Add credits to OpenRouter account

### "Unauthorized" error

- Make sure you're logged in
- Check that session token is valid
- Try logging out and back in

---

## 🎯 Future AI Enhancements

Planned features for future releases:

1. **Smart Pricing** - ML model based on historical sales data
2. **Image Recognition** - Automatically detect book condition from photos
3. **Auto-tagging** - Generate relevant tags from descriptions
4. **Duplicate Detection** - Warn if similar item already listed
5. **Quality Scoring** - Rate listing quality and suggest improvements
6. **Translation** - Multi-language support for international students

---

**Built for Swan Hacks 2025** 🦢

AI features demonstrate our commitment to enhancing user experience through intelligent automation while keeping costs low and user control high.

