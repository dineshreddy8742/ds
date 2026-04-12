# 🚀 Quick Setup Guide

## The 422 error is happening because:
1. Email confirmation is enabled in Supabase (default setting)
2. OR the database schema hasn't been run yet

## ✅ **FIX - Follow These Steps:**

### **Step 1: Disable Email Confirmation (2 minutes)**

1. Go to: https://supabase.com/dashboard/project/jazqtxagwlhbhcdrfbij/auth/providers
2. Scroll down to **"Email"** section  
3. Click the **toggle** to disable "Confirm email"
4. It should say "Email confirmations: Disabled"

### **Step 2: Run Database Schema (3 minutes)**

1. Open: https://supabase.com/dashboard/project/jazqtxagwlhbhcdrfbij/sql/new
2. Open the file `database.sql` from your project
3. Copy ALL the content
4. Paste in the SQL Editor
5. Click **"Run"** (or Ctrl+Enter)
6. Wait for success message ✅

### **Step 3: Try Signup Again**

1. Refresh your browser (Ctrl+F5)
2. Go to http://localhost:5173/signup
3. Fill in the form:
   - Account Type: **Admin**
   - Full Name: **dinesh**
   - Email: **palavaladineshkumarreddy@gmail.com**
   - Password: Your password (min 6 chars)
4. Click **Sign Up**

It should work now! 🎉

---

## 🆘 **Still Getting Errors?**

### **Error: "User already registered"**
- The email already exists in Supabase
- Either use a different email OR
- Delete the existing user: https://supabase.com/dashboard/project/jazqtxagwlhbhcdrfbij/auth/users

### **Error: "Invalid API key"**  
- Check `.env.local` has the correct keys
- Restart dev server: `npm run dev`

### **Error: Something else**
- Check browser console (F12) for error details
- The error message should tell you exactly what's wrong

---

## 💡 **Alternative: Use Login Instead of Signup**

If signup keeps failing, you can manually create the user in Supabase:

1. Go to: https://supabase.com/dashboard/project/jazqtxagwlhbhcdrfbij/auth/users
2. Click **"Add user"**
3. Email: `palavaladineshkumarreddy@gmail.com`
4. Password: Choose a password
5. In **User metadata** (JSON), add:
   ```json
   {
     "role": "ADMIN",
     "full_name": "dinesh"
   }
   ```
6. Click **"Create user"**
7. Now go to http://localhost:5173/login and login with those credentials

---

## 📞 **Need Help?**

The most common issue is:
- ❌ Email confirmation still enabled → **Disable it in Auth > Providers**
- ❌ Database tables don't exist → **Run database.sql in SQL Editor**
- ❌ Wrong API keys → **Check .env.local file**
