import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('--- NEURAL CONNECTIVITY TEST ---');
console.log('Target URL:', url);
console.log('Secret Signature Format:', key?.substring(0, 10) + '...');

if (!url || !key) {
    console.error('❌ FATAL: Credentials missing from .env');
    process.exit(1);
}

const supabase = createClient(url, key);

async function test() {
    console.log('📡 Attempting to handshake with Supabase Auth API...');
    try {
        // We use a dummy token to see if the FETCH itself fails or if we get a proper 401 from Supabase
        const { data, error } = await supabase.auth.getUser('invalid-token-test-pulse');
        
        if (error) {
            console.log('--- Handshake Complete ---');
            console.log('Identity Response:', error.message);
            if (error.message.includes('fetch failed')) {
                console.error('❌ FATAL: Auth API is unreachable (Persistent Fetch Failure)');
            } else {
                console.log('✅ Auth API responded correctly (Token was rejected as expected, but the bridge is open)');
            }
        }
    } catch (e) {
        console.error('💥 FATAL ERROR during execution:', e.message);
    }
}

test();
