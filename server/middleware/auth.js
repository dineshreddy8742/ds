import { supabaseServer, createSupabaseClient } from '../supabase.js';

// Verify Supabase Auth session
export const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Auth Error: No token provided');
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log('📡 [NEURAL_TRACE] Incoming Token Signal:', token?.substring(0, 15) + '...');
    
    // Verify the session with Supabase using the project's direct auth bridge
    const { data: { user }, error } = await supabaseServer.auth.getUser(token);

    if (error || !user) {
      console.error('❌ Security Breach: Neural Token Rejected');
      console.error('Trace:', error?.message || 'No user found');
      
      return res.status(401).json({ 
        error: 'System Access Denied: Invalid Security Signature',
        code: 'DIALSMART_NEURAL_V1_REJECT',
        trace: error?.message || 'Invalid Session'
      });
    }

    // Attach user metadata and session-scoped client to request
    req.user = user;
    req.userRole = user.user_metadata?.role || 'USER';
    console.log('✅ [NEURAL_TRACE] Identity Verified:', user.email, 'Role:', req.userRole);
    req.supabase = supabaseServer; // Use service role for admin-level operations to prevent RLS sync issues
    
    next();
  } catch (error) {
    console.error('💥 Core Auth Failure:', error.message);
    return res.status(500).json({ error: 'Internal Neural Verification Failure' });
  }
};

// Check if user is admin
export const requireAdmin = (req, res, next) => {
  if (req.userRole?.toUpperCase() !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required (Current: ' + req.userRole + ')' });
  }
  next();
};

// Check if user is college
export const requireCollege = (req, res, next) => {
  const role = req.userRole?.toUpperCase();
  if (role !== 'COLLEGE' && role !== 'ADMIN') {
    return res.status(403).json({ error: 'College access required (Current: ' + req.userRole + ')' });
  }
  next();
};
