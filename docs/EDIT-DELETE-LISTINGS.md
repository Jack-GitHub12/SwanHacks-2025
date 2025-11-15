# ✏️ Edit & Delete Listings Feature

## Overview

Users can now edit and delete their own listings directly from the marketplace.

---

## ✨ Features

### For Your Own Listings

When viewing your own listings, you'll see:

```
┌──────────────────────────────────────────────────┐
│  CS 161                                          │
│  Introduction to Computer Science                │
│  $65.00                                          │
│                                                  │
│  [✏️ Edit]  [🗑️ Delete]                          │
└──────────────────────────────────────────────────┘
```

### For Other Users' Listings

```
┌──────────────────────────────────────────────────┐
│  CS 161                                          │
│  Introduction to Computer Science                │
│  $65.00                                          │
│                                                  │
│            [Show Contact]                        │
└──────────────────────────────────────────────────┘
```

---

## 🎯 User Flow

### Edit Flow

```
1. Browse Your Listings
   │
   ▼
2. Click "Edit" Button
   │
   ▼
3. Edit Page Loads
   │
   ├─ Pre-filled with current data
   ├─ All fields editable
   └─ AI enhancement available
   │
   ▼
4. Make Changes
   │
   ▼
5. Click "Save Changes"
   │
   ▼
6. ✓ Success Modal
   │
   ▼
7. Redirect to Home
```

### Delete Flow

```
1. Browse Your Listings
   │
   ▼
2. Click "Delete" Button
   │
   ▼
3. Confirmation Dialog
   "Are you sure? This cannot be undone."
   │
   ├─ Cancel → Stay on page
   │
   ▼
4. Click "OK"
   │
   ▼
5. Listing Deleted
   │
   ▼
6. Success Alert
   │
   ▼
7. Listing Removed from View
```

---

## 🔐 Security

### Ownership Verification

```
┌─────────────────────────────────────────────────┐
│           SECURITY CHECKS                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. Authentication Required                     │
│     ✓ Must be logged in                         │
│                                                 │
│  2. Ownership Verification                      │
│     ✓ listing.user_id === current_user.id      │
│                                                 │
│  3. Database Level (RLS)                        │
│     ✓ Row Level Security policies enforce       │
│       USING (auth.uid() = user_id)             │
│                                                 │
│  4. API Level                                   │
│     ✓ Supabase enforces policies automatically  │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Result:** Users can ONLY edit/delete their own listings ✅

---

## 💻 Technical Implementation

### ListingCard Component

```typescript
interface ListingCardProps {
  listing: Listing;
  index: number;
  onShowContact: (contactInfo: string) => void;
  currentUserId?: string;      // NEW
  onEdit?: (listingId: string) => void;    // NEW
  onDelete?: (listingId: string) => void;  // NEW
}

// Check ownership
const isOwner = currentUserId && listing.user_id === currentUserId;

// Conditional rendering
{isOwner ? (
  // Show Edit & Delete buttons
) : (
  // Show Contact button
)}
```

### Edit Page

**Route:** `/edit/[id]`

**Features:**
- Loads existing listing data
- Verifies ownership
- Pre-fills all form fields
- Validates before saving
- AI enhancement available
- Success modal on save

### Delete Function

```typescript
const handleDelete = async (listingId: string) => {
  // Confirmation dialog
  if (!confirm('Are you sure?')) return;
  
  // Delete from database
  await supabase
    .from('listings')
    .delete()
    .eq('id', listingId);
  
  // Update local state
  setListings(prev => prev.filter(l => l.id !== listingId));
};
```

---

## 🎨 UI Design

### Edit Button
- **Icon:** Pencil/edit icon
- **Color:** Secondary blue
- **Text:** "Edit"
- **Animation:** Scale on hover

### Delete Button
- **Icon:** Trash can icon
- **Color:** Red (danger)
- **Text:** "Delete"
- **Animation:** Scale on hover
- **Style:** Red background with border

### Placement
- Bottom right of listing card
- Side by side with small gap
- Replaces "Show Contact" button for owners

---

## 📝 Fields That Can Be Edited

✅ **Course Code** - Update to different course  
✅ **Item Title** - Change the title  
✅ **Price** - Adjust pricing  
✅ **Contact Info** - Update phone/email  
✅ **Condition** - Change condition  
✅ **Notes** - Edit description (with AI!)  

❌ **Cannot Edit:**
- Created date
- Listing ID
- Owner (user_id)
- Status (must delete instead)

---

## 🧪 Testing

### Test Edit Functionality:

1. **Create a listing:**
   - Go to /post
   - Fill out form and submit

2. **Find your listing:**
   - Go to homepage or /browse
   - Your listing shows "Edit" and "Delete" buttons
   - Other listings show "Show Contact"

3. **Click Edit:**
   - Redirects to `/edit/{listing-id}`
   - Form is pre-filled with current data
   - Make changes
   - Click "Save Changes"
   - Success modal appears
   - Redirects to home

4. **Verify changes:**
   - Check that your edits saved correctly

### Test Delete Functionality:

1. **Find your listing**
2. **Click "Delete" button**
3. **Confirm deletion** in dialog
4. **Listing disappears** from view
5. **Success alert** shows

---

## ⚠️ Important Notes

### Confirmation Dialog
- Users must confirm before deletion
- Prevents accidental deletions
- Clear warning message

### No Undo
- Deletions are permanent
- Data is removed from database
- Cannot be recovered

### Demo Mode
- Edit redirects to home (no actual editing)
- Delete removes from local state only
- Changes not persisted

---

## 📊 Database Queries

### Load Listing for Edit
```sql
SELECT * FROM listings
WHERE id = $1
AND user_id = auth.uid();
```

### Update Listing
```sql
UPDATE listings
SET 
  course_code = $1,
  book_title = $2,
  price = $3,
  contact_info = $4,
  condition = $5,
  notes = $6
WHERE id = $7
AND user_id = auth.uid();
```

### Delete Listing
```sql
DELETE FROM listings
WHERE id = $1
AND user_id = auth.uid();
```

**Note:** `auth.uid()` is enforced by RLS policies automatically!

---

## 🚀 Future Enhancements

- Bulk edit multiple listings
- Mark as sold (without deleting)
- Edit history/changelog
- Restore deleted items (soft delete)
- Duplicate listing feature
- Archive old listings
- Export listing data

---

## ✅ Success Criteria

When this feature is working correctly:

- ✅ Users see edit/delete on their own listings
- ✅ Users don't see edit/delete on others' listings
- ✅ Edit page loads with correct data
- ✅ Changes save successfully
- ✅ Deletions remove listings
- ✅ Confirmation dialogs prevent accidents
- ✅ Error handling works gracefully
- ✅ UI updates immediately after actions

---

**Built for Swan Hacks 2025** 🦢

This feature gives users complete control over their marketplace listings while maintaining security and data integrity!

