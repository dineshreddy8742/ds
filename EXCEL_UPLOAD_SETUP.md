# Excel Upload & User Dashboard Setup Guide

## Overview
This document describes the complete data flow from Admin Excel upload to User Dashboard display.

---

## ✅ Implemented Features

### 1. Excel Column Mapping
The system now correctly maps ALL columns from your Excel file:

| Excel Column | Database Field | Display in Dashboard | Notes |
|-------------|----------------|---------------------|-------|
| **Name** | `student_name` | ✓ Name column | Also accepts: Student Name, Candidate Name, Full Name |
| **Phone** | `phone` | ✓ Phone column | Also accepts: Mobile, Contact Number, Contact, Phone Number |
| **Conversation** | `conversation` | ✓ Conversation column | Also accepts: Call Notes, Call Summary, Notes |
| **Duration** | `duration` | ✓ Duration column | Also accepts: Call Duration |
| **Status** | `status` | ✓ Status column (with color coding) | Preserves exact value from Excel (Interested, Not Interested, etc.) |
| **Score** | `ai_score` | ✓ Score column (with progress bar) | Also accepts: AI Score, Lead Score (0-100 range) |
| **Call Start Time** | `call_start_time` | ✓ Call Start Time column | Also accepts: Call Time, Start Time |

### 2. Status Filter
- ✓ Filter dropdown in User Dashboard with exact status matching
- ✓ Supports: New, Contacted, Interested, Not Interested, Enrolled
- ✓ **Preserves status from Excel** - if your Excel file has "Interested", it will show as "Interested"
- ✓ Backend query uses exact match: `query.eq('status', status)`

### 3. Search Functionality
- ✓ Search by Name, Phone, or Email
- ✓ Debounced input for performance
- ✓ Works across all filtered data

### 4. Date Filter
- ✓ Supports: Today, Yesterday, Last 7 Days, etc.
- ✓ Applied to `created_at` timestamp

---

## 📋 Setup Instructions

### Step 1: Run Database Migration

You **MUST** run the migration to add the new columns to your existing database:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/jazqtxagwlhbhcdrfbij/sql/new
2. Run the migration file: `database_migration_add_conversation_and_call_time.sql`

Or execute this SQL directly:

```sql
-- Add conversation column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'conversation'
  ) THEN
    ALTER TABLE leads ADD COLUMN conversation TEXT;
  END IF;
END $$;

-- Add call_start_time column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'call_start_time'
  ) THEN
    ALTER TABLE leads ADD COLUMN call_start_time TEXT;
  END IF;
END $$;
```

### Step 2: Prepare Your Excel File

Your Excel file should have these exact column headers (case-insensitive):

```
Name | Phone | Conversation | Duration | Status | Score | Call Start Time
```

**Example Excel:**

| Name | Phone | Conversation | Duration | Status | Score | Call Start Time |
|------|-------|--------------|----------|--------|-------|-----------------|
| John Doe | 1234567890 | Showed interest in course | 05m 30s | Interested | 85 | 2026-04-10 10:30 AM |
| Jane Smith | 0987654321 | Not interested currently | 02m 15s | Not Interested | 20 | 2026-04-10 11:00 AM |

**Alternative column names accepted:**
- Name: Student Name, Candidate Name, Full Name
- Phone: Mobile, Contact Number, Contact, Phone Number
- Conversation: Call Notes, Call Summary, Notes
- Duration: Call Duration
- Score: AI Score, Lead Score
- Call Start Time: Call Time, Start Time

### Step 3: Upload Process (Admin)

1. Login as Admin
2. Go to **Admin Portal**
3. Navigate to **Upload** tab
4. Select the organization/college from dropdown
5. Upload your Excel file (.xlsx, .xls, or .csv, max 10MB)
6. System will confirm: "Successfully imported X leads"

### Step 4: View in User Dashboard

1. Login as College User (or switch to college account)
2. Go to **Lead Pipeline** tab
3. You will see ALL columns displayed:
   - Name (with email underneath if available)
   - Phone
   - Conversation (truncated with ellipsis, hover for full text)
   - Duration
   - Status (color-coded badge)
   - Score (progress bar with number)
   - Call Start Time
   - View Details button

### Step 5: Use Filters

- **Search Box**: Type name, phone, or email to find specific leads
- **Status Filter**: Select status to filter (All, New, Contacted, Interested, Not Interested, Enrolled)
- **Date Filter**: Select date range (Today, Yesterday, Last 7 Days, etc.)

---

## 🔄 Complete Data Flow

```
┌─────────────────────────────────────────┐
│ 1. ADMIN UPLOADS EXCEL FILE             │
│    - Select organization                │
│    - Upload .xlsx/.xls/.csv file        │
│    - Columns: Name, Phone, Conversation,│
│      Duration, Status, Score,           │
│      Call Start Time                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 2. BACKEND PROCESSING                   │
│    - Read Excel with xlsx library       │
│    - Map columns (with aliases)         │
│    - Preserve Status from Excel         │
│    - Validate Score (0-100)             │
│    - Bulk insert to Supabase            │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 3. DATABASE (leads table)               │
│    - student_name                       │
│    - phone                              │
│    - email                              │
│    - conversation (NEW)                 │
│    - duration                           │
│    - status (from Excel)                │
│    - ai_score (from Excel)              │
│    - call_start_time (NEW)              │
│    - college_id                         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 4. USER DASHBOARD DISPLAY               │
│    - ALL columns visible in table       │
│    - Status filter works correctly      │
│    - Search by name/phone/email         │
│    - Date filter applied                │
│    - Export to Excel available          │
└─────────────────────────────────────────┘
```

---

## 🧪 Testing Checklist

After setup, verify:

- [ ] Database migration ran successfully
- [ ] Created test Excel file with all 7 columns
- [ ] Uploaded Excel from Admin Portal without errors
- [ ] Logged in as College User
- [ ] Lead Pipeline tab shows ALL columns
- [ ] Status from Excel is preserved (not overridden)
- [ ] Score displays correctly (0-100)
- [ ] Conversation text is visible
- [ ] Call Start Time displays correctly
- [ ] Status filter filters correctly (test each status)
- [ ] Search works for name, phone, email
- [ ] Date filter works (test Today, Last 7 Days)
- [ ] Export to Excel includes all data
- [ ] Export Interested Only works correctly

---

## 🐛 Troubleshooting

### Issue: Columns not showing in dashboard
**Solution**: Clear browser cache, hard refresh (Ctrl+Shift+R)

### Issue: Status not matching from Excel
**Solution**: Ensure Excel column header is exactly "Status" or "status"

### Issue: Database error on upload
**Solution**: Run the migration SQL script first

### Issue: Score showing 0
**Solution**: Check Excel column is "Score", "AI Score", or "Lead Score" with numeric values

### Issue: Chart width error (-1)
**Solution**: Already fixed with minWidth={300} on ResponsiveContainer

---

## 📁 Files Modified

1. `server/controllers/fileController.js` - Excel column mapping
2. `server/services/leadService.js` - Query to include new columns
3. `database.sql` - Schema with conversation & call_start_time
4. `database_migration_add_conversation_and_call_time.sql` - Migration for existing DB
5. `src/pages/college/CollegePortalPage.jsx` - Dashboard table with all columns
6. `src/pages/admin/AdminPortalPage.jsx` - Chart minWidth fix

---

## ✨ Key Improvements

1. ✅ **Exact Status Preservation**: Status from Excel is now preserved (was hardcoded to "New")
2. ✅ **Complete Column Mapping**: All 7 columns mapped with intelligent aliases
3. ✅ **Full Dashboard Display**: All columns visible in user dashboard
4. ✅ **Working Filters**: Status, Search, and Date filters all functional
5. ✅ **Visual Enhancements**: Color-coded status badges, score progress bars
6. ✅ **Responsive Table**: Horizontal scroll for smaller screens
7. ✅ **Chart Error Fixed**: Added minWidth to prevent -1 dimension error

---

## 🚀 Next Steps (Optional)

- [ ] Add lead detail modal when clicking "View Details"
- [ ] Support webhook URL for live Excel sync
- [ ] Support Google Sheets URL for direct connection
- [ ] Add bulk status update functionality
- [ ] Add conversation full-text view in modal
