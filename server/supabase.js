import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

// Initialization Helper
const initSupabase = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase credentials missing. Please check Vercel Environment Variables.');
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: (...args) => fetch(...args).catch(err => {
        console.error('💥 Neural Fetch Failure:', err.message);
        throw err;
      })
    }
  });
};

// Singleton instance
let _supabaseInstance = null;

export const getSupabase = () => {
  try {
    if (!_supabaseInstance) {
        _supabaseInstance = initSupabase();
    }
    return _supabaseInstance;
  } catch (err) {
    console.error('Supabase Init Error:', err.message);
    return null;
  }
};

// Export original for compatibility
export const supabaseServer = getSupabase();

// Create a client scoped to a user's session (respects RLS)
export const createSupabaseClient = (accessToken) => {
  if (!supabaseUrl || !supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
};
