import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jazqtxagwlhbhcdrfbij.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  console.warn('📡 Signal Lost: VITE_SUPABASE_ANON_KEY is missing. Ensure it is added to Vercel Environment Variables with the VITE_ prefix.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey || 'your_anon_key_here', {
  auth: {
    autoConfirmSignup: false,
    flowType: 'pkce',
  },
});
