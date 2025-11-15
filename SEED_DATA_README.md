# Seed Data Instructions

This guide explains how to populate your Supabase database with fake data for testing and development.

## Prerequisites

Before running the seed script, you need to have:
1. **At least one user account** created in your Supabase `auth.users` table
   - You can create test users through your app's signup page
   - Or manually create users in the Supabase Auth dashboard

## How to Run

### Option 1: Using Supabase SQL Editor (Recommended)

1. Open your Supabase dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `supabase-seed-data.sql`
5. Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`)

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
supabase db execute --file supabase-seed-data.sql
```

## What Gets Created

The seed script will populate your database with:

- **15 Textbook Listings** - Various courses across different departments
- **15 Discussions** - Mix of:
  - General discussions
  - Study groups
  - Housing posts
  - Job opportunities
  - Club announcements
  - Events (with dates, times, and locations)
- **Multiple Replies** - Replies to various discussions
- **Votes** - Upvotes on popular discussions and events

## Important Notes

- The script uses existing users from `auth.users` table
- If you have fewer than 5 users, it will reuse the first user for multiple entries
- If you have no users, the script will fail with an error message
- All events are set to future dates (3-45 days from when you run the script)
- All listings are set to `active` status

## Customization

You can modify `supabase-seed-data.sql` to:
- Add more listings or discussions
- Change the data values
- Adjust event dates
- Add more replies or votes

## Troubleshooting

**Error: "No users found in auth.users"**
- Solution: Create at least one user account first through your app's signup or the Supabase Auth dashboard

**Error: "Permission denied"**
- Solution: Make sure you're running the script with appropriate permissions. The SQL Editor in Supabase dashboard should work fine.

**Data not showing up**
- Check that Row Level Security (RLS) policies allow viewing the data
- Verify you're logged in as an authenticated user when viewing the app
- Check that the data was actually inserted in the Supabase Table Editor

## Resetting Seed Data

To clear all seed data and start fresh:

1. Go to Supabase Table Editor
2. Manually delete rows from:
   - `discussion_votes`
   - `discussion_replies`
   - `discussions`
   - `listings`
3. Or run a DELETE query in SQL Editor (be careful with this!)

