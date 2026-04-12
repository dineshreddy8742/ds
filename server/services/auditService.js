import { supabaseServer } from '../supabase.js';

/**
 * Record a system-wide audit log event
 */
export const recordAudit = async ({ user_id, action, table_name, record_id, details }) => {
  try {
    const { error } = await supabaseServer
      .from('audit_logs')
      .insert([{
        user_id,
        action,
        table_name,
        record_id,
        details
      }]);
    
    if (error) console.error('Audit recording failed:', error);
  } catch (err) {
    console.error('Audit exception:', err);
  }
};

/**
 * Get all audit logs for admin
 */
export const getAuditLogs = async ({ page = 1, limit = 50 }) => {
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabaseServer
    .from('audit_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  
  return {
    data,
    total: count,
    totalPages: Math.ceil(count / limit)
  };
};
