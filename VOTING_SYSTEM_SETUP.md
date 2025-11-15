# 🗳️ Voting System Setup Guide

## ✅ What Was Done

### 1. **Removed VSA Events from Demo Data**
All Vietnamese Student Association events have been removed from the demo data in `/pages/events.tsx`:
- ❌ VSA Lunar New Year Celebration 2025
- ❌ VSA Weekly Game Night
- ❌ Vietnamese Student Association: Phở Night Fundraiser  
- ❌ VSA Cultural Exchange Dinner - Spring Semester

### 2. **Created SQL Migration Scripts**
Two SQL scripts have been created to set up the voting system:
- `APPLY_VOTING_SYSTEM.sql` - Sets up the complete voting infrastructure
- `DELETE_VSA_EVENTS.sql` - Removes VSA events from production database

## 🚀 How to Enable Voting System

### **Step 1: Apply the Voting System Schema**

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: `xapazebllxyonzrtrmcj`
3. **Click on "SQL Editor"** in the left sidebar
4. **Click "New query"**
5. **Copy the entire contents** of `APPLY_VOTING_SYSTEM.sql`
6. **Paste it** into the SQL editor
7. **Click "Run"** (or press Cmd/Ctrl + Enter)
8. **Wait for success message** - Should show "Success. No rows returned"

### **Step 2: Delete VSA Events from Database (Optional)**

**Only do this if you have real VSA events in your production database!**

1. Still in **SQL Editor**
2. **Click "New query"**
3. **Copy the entire contents** of `DELETE_VSA_EVENTS.sql`
4. **Paste it** into the SQL editor
5. **Click "Run"**
6. **Check the result** - It will show how many rows were deleted

## 🧪 Test the Voting System

### **Test Locally:**

1. Make sure environment variables are set in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xapazebllxyonzrtrmcj.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-key]
   NEXT_PUBLIC_DEMO_MODE=false
   ```

2. Run your dev server:
   ```bash
   npm run dev
   ```

3. Visit: http://localhost:3000/events

4. **Try voting:**
   - Click the ⬆️ upvote button on any event
   - The number should increase
   - Click it again - it should remove your vote
   - Try downvote ⬇️ - should work the same way

### **Test on Production:**

1. Visit: https://booksterisu.vercel.app/events
2. Sign in with your account
3. Try upvoting/downvoting events
4. Refresh the page - your votes should persist!

## 🔧 How the Voting System Works

### **Database Structure:**

```
discussions table:
  - upvotes (INTEGER)
  - downvotes (INTEGER)  
  - vote_score (INTEGER) = upvotes - downvotes

discussion_votes table:
  - id
  - discussion_id (references discussions)
  - user_id (references auth.users)
  - vote_type ('up' or 'down')
  - UNIQUE constraint on (discussion_id, user_id)
```

### **User Actions:**

1. **First vote**: Creates a record in `discussion_votes`
2. **Change vote**: Updates the existing record (up ↔ down)
3. **Remove vote**: Deletes the record
4. **Trigger fires**: Automatically updates counts in `discussions` table

### **Vote Calculations:**

- **Upvotes**: Count of 'up' votes
- **Downvotes**: Count of 'down' votes
- **Vote Score**: upvotes - downvotes (can be negative!)

## 🎨 UI Features

### **Vote Buttons Component** (`/components/VoteButtons.tsx`):

- ✅ Shows current vote score
- ✅ Highlights user's vote (green for up, red for down)
- ✅ Prevents double-clicking
- ✅ Works in demo mode for testing
- ✅ Animates on hover/click
- ✅ Updates in real-time

### **Visual Indicators:**

- **Green** vote score = More upvotes than downvotes
- **Red** vote score = More downvotes than upvotes  
- **Gray** vote score = Equal votes (0)

## 🔒 Security (RLS Policies)

The voting system has proper Row Level Security:

- ✅ Anyone can view vote counts
- ✅ Only authenticated users can vote
- ✅ Users can only modify their own votes
- ✅ Users can't vote multiple times (UNIQUE constraint)
- ✅ Votes cascade delete when user/discussion is deleted

## 📊 Sorting Events by Votes

Events can be sorted by:
- **Top Rated** (votes) - Highest vote_score first
- **Newest** (new) - Most recent first
- **By Date** (date) - Earliest event date first
- **Most Popular** (popular) - Combination of views, replies, and votes

## ❓ Troubleshooting

### **Issue: Votes not working**

**Solution:**
1. Make sure you ran `APPLY_VOTING_SYSTEM.sql` in Supabase
2. Check that `DEMO_MODE=false` in your env vars
3. Verify you're signed in as an authenticated user
4. Check browser console for errors

### **Issue: Vote counts not updating**

**Solution:**
1. Verify the trigger is created:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'update_vote_counts';
   ```
2. Check that the function exists:
   ```sql
   SELECT proname FROM pg_proc WHERE proname = 'update_discussion_vote_counts';
   ```

### **Issue: "Permission denied" error**

**Solution:**
1. Check RLS policies are created:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'discussion_votes';
   ```
2. Make sure user is authenticated (not anonymous)

### **Issue: Can vote multiple times**

**Solution:**
The UNIQUE constraint should prevent this. If it's happening:
```sql
-- Check if constraint exists
SELECT conname FROM pg_constraint 
WHERE conrelid = 'discussion_votes'::regclass 
AND contype = 'u';

-- If missing, add it:
ALTER TABLE discussion_votes 
ADD CONSTRAINT discussion_votes_discussion_id_user_id_key 
UNIQUE (discussion_id, user_id);
```

## 🎯 Quick Verification Checklist

After running the SQL scripts, verify:

- [ ] `discussion_votes` table exists
- [ ] `upvotes`, `downvotes`, `vote_score` columns exist in `discussions`
- [ ] Trigger `update_vote_counts` exists
- [ ] Function `update_discussion_vote_counts` exists
- [ ] 4 RLS policies exist on `discussion_votes`
- [ ] Can vote on events when logged in
- [ ] Vote counts update automatically
- [ ] Can't vote twice on the same event
- [ ] Can change/remove vote

## 📝 Verification Queries

Run these in Supabase SQL Editor to check setup:

```sql
-- Check vote columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'discussions' 
AND column_name IN ('upvotes', 'downvotes', 'vote_score');

-- Check votes table
SELECT COUNT(*) as vote_records FROM discussion_votes;

-- Check RLS policies
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'discussion_votes';

-- Check trigger
SELECT tgname, tgtype 
FROM pg_trigger 
WHERE tgrelid = 'discussion_votes'::regclass;
```

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Upvote/downvote buttons appear on events
2. ✅ Clicking upvote turns it green and increases the score
3. ✅ Clicking upvote again removes the vote
4. ✅ Score updates persist after page refresh
5. ✅ Can't vote multiple times on same event
6. ✅ Events can be sorted by "Top Rated"

---

## 🚀 Deploy Changes

Once verified locally, deploy to production:

```bash
git add -A
git commit -m "Remove VSA events and enable voting system"
git push origin main
```

Vercel will automatically deploy the changes!

---

**Your voting system is now ready! Users can upvote/downvote events and discussions! 🗳️✨**

