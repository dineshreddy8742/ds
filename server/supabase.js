import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Singleton instance
let _supabaseInstance = null;

/**
 * Robust getter for the Supabase server client.
 */
export const getSupabase = () => {
  try {
    if (_supabaseInstance) return _supabaseInstance;

    const supabaseUrl = process.env.SUPABASE_URL?.trim();
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

    if (!supabaseUrl || !supabaseServiceKey) {
      return null;
    }

    _supabaseInstance = createClient(supabaseUrl, supabaseServiceKey, {
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

    return _supabaseInstance;
  } catch (err) {
    console.error('Supabase Initialization Error:', err.message);
    return null;
  }
};

/**
 * Lazy-Loading Proxy for supabaseServer.
 * This prevents top-level crashes and ensures the client is only created when first used.
 */
export const supabaseServer = new Proxy({}, {
  get(target, prop) {
    const instance = getSupabase();
    if (!instance) {
        throw new Error('Supabase credentials missing. Please check Vercel Environment Variables (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY).');
    }
    return instance[prop];
  }
});

/**
 * User-scoped client factory.
 */
export const createSupabaseClient = (accessToken) => {
  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  
  if (!supabaseUrl || !supabaseServiceKey) return null;

  return createClient(supabaseUrl, supabaseServiceKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
};
