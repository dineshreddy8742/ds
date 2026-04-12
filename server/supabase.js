import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ CRITICAL: Missing Supabase credentials! Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment variables.');
}

// Server-side client with service role (bypasses RLS for admin operations)
export const supabaseServer = (supabaseUrl && supabaseServiceKey) 
  ? createClient(supabaseUrl, supabaseServiceKey, {
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
    })
  : null;

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
