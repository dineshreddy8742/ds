import { supabaseServer } from '../supabase.js';
import { recordAudit } from './auditService.js';
import { syncLeadToGoogleSheet } from './googleSyncService.js';

// Helper for date filtering
const applyDateFilter = (query, dateFilter) => {
  if (!dateFilter) return query;
  
  const now = new Date();
  if (dateFilter === 'today') {
    const start = new Date(now.setHours(0,0,0,0)).toISOString();
    const end = new Date(now.setHours(23,59,59,999)).toISOString();
    return query.gte('created_at', start).lte('created_at', end);
  } else if (dateFilter === 'yesterday') {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const start = new Date(yesterday.setHours(0,0,0,0)).toISOString();
    const end = new Date(yesterday.setHours(23,59,59,999)).toISOString();
    return query.gte('created_at', start).lte('created_at', end);
  } else if (dateFilter === 'tomorrow') {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const start = new Date(tomorrow.setHours(0,0,0,0)).toISOString();
    const end = new Date(tomorrow.setHours(23,59,59,999)).toISOString();
    return query.gte('created_at', start).lte('created_at', end);
  } else if (dateFilter === 'last7days') {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return query.gte('created_at', sevenDaysAgo.toISOString());
  } else if (dateFilter === 'last30days') {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return query.gte('created_at', thirtyDaysAgo.toISOString());
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateFilter)) {
    // Specific date filtering (YYYY-MM-DD)
    const start = new Date(dateFilter);
    start.setHours(0,0,0,0);
    const end = new Date(dateFilter);
    end.setHours(23,59,59,999);
    return query.gte('created_at', start.toISOString()).lte('created_at', end.toISOString());
  }
  return query;
};

// Get all leads with pagination and filters
export const getLeads = async ({ 
  page = 1, 
  limit = 20, 
  search, 
  status, 
  college_id, 
  dateFilter 
}) => {
  const p = Math.max(1, parseInt(page) || 1);
  const l = Math.max(1, Math.min(10000, parseInt(limit) || 20));
  const offset = (p - 1) * l;
  
  let query = supabaseServer
    .from('leads')
    .select('*, colleges(name)', { count: 'exact' });

  // Add filters
  if (college_id) query = query.eq('college_id', college_id);
  if (status) query = query.eq('status', status);
  
  if (search) {
    query = query.or(`student_name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
  }

  query = applyDateFilter(query, dateFilter);
  query = query.order('created_at', { ascending: false });

  // Apply pagination
  query = query.range(offset, offset + l - 1);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data,
    pagination: {
      page: p,
      limit: l,
      total: count,
      totalPages: Math.ceil(count / l),
    },
  };
};

// Get single lead
export const getLeadById = async (id) => {
  const { data, error } = await supabaseServer
    .from('leads')
    .select('id, student_name, phone, email, intent, duration, status, college_id, created_at')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// Create lead
export const createLead = async (leadData) => {
  const { data, error } = await supabaseServer
    .from('leads')
    .insert([leadData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update lead
export const updateLead = async (id, updates, user_id = null) => {
  // 1. Get current lead data for activity log
  const { data: oldLead } = await supabaseServer
    .from('leads')
    .select('*, colleges(*)')
    .eq('id', id)
    .single();

  // 2. Perform database update
  const { data: newLead, error } = await supabaseServer
    .from('leads')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // 3. Record Activity Log (Lifecycle Management)
  await supabaseServer.from('lead_activity_logs').insert([{
    lead_id: id,
    user_id,
    action: 'UPDATE_LEAD',
    old_data: oldLead,
    new_data: newLead,
  }]);

  // 4. Trigger Two-Way Sync (Background)
  if (oldLead?.colleges?.google_sheet_id) {
    syncLeadToGoogleSheet(oldLead.colleges, newLead).catch(console.error);
  }

  return newLead;
};

// Delete lead
export const deleteLead = async (id) => {
  const { error } = await supabaseServer
    .from('leads')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return { success: true };
};

// Surgical Purge: Delete leads by date range and college
export const purgeLeadsByDate = async ({ college_id, startDate, endDate, user_id }) => {
  let query = supabaseServer
    .from('leads')
    .delete()
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  if (college_id) {
    query = query.eq('college_id', college_id);
  }

  const { data, error, count } = await query.select();

  if (error) throw error;

  // Record this major action in audit logs
  await recordAudit({
    user_id,
    action: 'PURGE_LEADS',
    table_name: 'leads',
    details: { 
      college_id, 
      startDate, 
      endDate, 
      countDeleted: data?.length || 0 
    }
  });

  return { 
    success: true, 
    count: data?.length || 0,
    message: `Successfully purged ${data?.length || 0} leads from the selected range.`
  };
};

// Bulk create leads (for Excel upload)
export const bulkCreateLeads = async (leadsArray) => {
  const { data, error } = await supabaseServer
    .from('leads')
    .insert(leadsArray)
    .select();

  if (error) throw error;
  return data;
};

// Get lead statistics with trend data for charts
export const getLeadStats = async (college_id = null, dateFilter = null) => {
  let query = supabaseServer.from('leads').select('*');

  if (college_id) {
    query = query.eq('college_id', college_id);
  }

  if (dateFilter) {
    query = applyDateFilter(query, dateFilter);
  }

  const { data, error } = await query;

  if (error) throw error;
  if (!data) return { total: 0, interested: 0, notInterested: 0, by_status: {}, by_intent: {}, by_district: {}, by_sentiment: { positive: 0, negative: 0, neutral: 0 }, trends: [] };

  const stats = {
    total: data.length,
    interested: data.filter(l => {
      const s = String(l?.status || '').toLowerCase();
      const i = String(l?.intent || '').toLowerCase();
      return s === 'interested' || s === 'enrolled' || 
             i.includes('high') || i.includes('interested') || i.includes('yes') || i.includes('positive');
    }).length,
    notInterested: data.filter(l => {
      const s = String(l?.status || '').toLowerCase();
      const i = String(l?.intent || '').toLowerCase();
      return s === 'not interested' || 
             i.includes('low') || i.includes('not interested') || i.includes('negative') || i.includes('disinterested');
    }).length,
    by_status: {},
    by_intent: {},
    by_district: {},
    by_sentiment: { positive: 0, negative: 0, neutral: 0 },
    trends: [],
  };

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const trendMap = last7Days.reduce((acc, date) => {
    acc[date] = { date, leads: 0, highIntent: 0 };
    return acc;
  }, {});

  data.forEach(lead => {
    if (!lead) return;

    const status = lead.status || 'Unknown';
    stats.by_status[status] = (stats.by_status[status] || 0) + 1;

    const intent = lead.intent || 'Unknown';
    stats.by_intent[intent] = (stats.by_intent[intent] || 0) + 1;

    if (lead.district) {
      stats.by_district[lead.district] = (stats.by_district[lead.district] || 0) + 1;
    }

    const sent = String(lead.sentiment || lead.intent || '').toLowerCase();
    if (sent.includes('pos') || sent.includes('yes') || sent.includes('agree') || sent.includes('happy')) {
      stats.by_sentiment.positive++;
    } else if (sent.includes('neg') || sent.includes('no') || sent.includes('dis') || sent.includes('problem') || sent.includes('sad')) {
      stats.by_sentiment.negative++;
    } else {
      stats.by_sentiment.neutral++;
    }

    const date = lead.created_at ? lead.created_at.split('T')[0] : null;
    if (date && trendMap[date]) {
      trendMap[date].leads++;
      const i = String(intent).toLowerCase();
      if (i.includes('high') || i.includes('interested') || i.includes('yes') || i.includes('positive')) {
        trendMap[date].highIntent++;
      }
    }
  });

  stats.trends = Object.values(trendMap);
  return stats;
};

// Get lead activity logs
export const getLeadActivity = async (lead_id) => {
    const { data, error } = await supabaseServer
    .from('lead_activity_logs')
    .select('*')
    .eq('lead_id', lead_id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Get Platform-Wide Global Statistics (Admin Only)
 */
export const getGlobalStats = async (dateFilter = null) => {
  console.log('📡 [NEURAL_AGGREGATOR] Initiating Global Platform Pulse with filter:', dateFilter);
  
  let query = supabaseServer
    .from('leads')
    .select('status, intent, created_at, ai_score');

  if (dateFilter) {
    query = applyDateFilter(query, dateFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error('💥 [NEURAL_AGGREGATOR] Lead Pulse Failed:', error.message);
    throw error;
  }

  // Heartbeat check: if the main query is empty, let's double check the count
  if (!data || data.length === 0) {
    const { count } = await supabaseServer.from('leads').select('*', { count: 'exact', head: true });
    console.warn('⚠️ [NEURAL_AGGREGATOR] Main query silent. Heartbeat Count:', count);
    
    return {
      total: count || 0,
      interested: 0,
      notInterested: 0,
      by_status: {},
      by_intent: {},
      trends: [],
    };
  }

  console.log('✅ [NEURAL_AGGREGATOR] Lead Pulse Success. Rows:', data.length);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const trendMap = last7Days.reduce((acc, date) => {
    acc[date] = { date, leads: 0, highIntent: 0 };
    return acc;
  }, {});

  const stats = {
    total: data.length,
    interested: data.filter(l => {
      const s = String(l?.status || '').toLowerCase();
      const i = String(l?.intent || '').toLowerCase();
      return s === 'interested' || s === 'enrolled' || i.includes('high') || i.includes('interested');
    }).length,
    notInterested: data.filter(l => {
        const s = String(l?.status || '').toLowerCase();
        const i = String(l?.intent || '').toLowerCase();
        return s === 'not interested' || i.includes('low') || i.includes('no');
    }).length,
    by_status: {},
    by_intent: {},
    trends: [],
  };

  data.forEach(l => {
    if (!l) return;
    const s = l.status || 'New';
    stats.by_status[s] = (stats.by_status[s] || 0) + 1;
    const i = l.intent || 'Pending';
    stats.by_intent[i] = (stats.by_intent[i] || 0) + 1;

    const createdDate = l.created_at?.split('T')[0];
    if (createdDate && trendMap[createdDate]) {
      trendMap[createdDate].leads += 1;
      if (i.toLowerCase().includes('high') || i.toLowerCase().includes('interested')) {
        trendMap[createdDate].highIntent += 1;
      }
    }
  });

  stats.trends = Object.values(trendMap);
  return stats;
};

/**
 * Get Global Leaderboard and Recent Signals
 */
export const getGlobalIntelligence = async () => {
  // Get lead counts grouped by college
  let leadCounts = [];
  try {
    const { data, error: leadError } = await supabaseServer
      .from('leads')
      .select('college_id, intent'); // removed colleges(name) to avoid potential join issues during grouping

    if (leadError) throw leadError;
    leadCounts = data || [];
  } catch (err) {
    console.error('⚠️ [LEAD_SERVICE] Early counting failed, attempting safe fallback:', err.message);
  }

  const leaderboard = {};
  const globalDistricts = {};
  const globalSentiment = { positive: 0, negative: 0, neutral: 0 };
  
  // Pre-populate with all colleges so they show up even with 0 leads
  const { data: allColleges, error: collError } = await supabaseServer.from('colleges').select('id, name');
  if (collError) {
    console.error('💥 [LEAD_SERVICE] Node mapping failed:', collError.message);
  }

  (allColleges || []).forEach(c => {
    leaderboard[c.id] = { id: c.id, name: c.name, total: 0, high_intent: 0 };
  });

  if (leadCounts.length > 0) {
    leadCounts.forEach(l => {
      const id = l.college_id;
      if (id && leaderboard[id]) {
        leaderboard[id].total += 1;
        const intentStr = String(l.intent || '').toLowerCase();
        if (intentStr.includes('high') || intentStr.includes('interested')) {
          leaderboard[id].high_intent += 1;
        }
      }

      // Global District & Sentiment
      if (l.district) {
        globalDistricts[l.district] = (globalDistricts[l.district] || 0) + 1;
      }
      const sent = String(l.sentiment || l.intent || '').toLowerCase();
      if (sent.includes('pos') || sent.includes('yes') || sent.includes('happy')) {
        globalSentiment.positive++;
      } else if (sent.includes('neg') || sent.includes('no') || sent.includes('dis') || sent.includes('problem')) {
        globalSentiment.negative++;
      } else {
        globalSentiment.neutral++;
      }
    });
  }

  const sortedLeaderboard = Object.values(leaderboard)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // Get 5 most recent leads platform-wide
  let recentLeads = [];
  try {
    const { data: rd, error: recentError } = await supabaseServer
      .from('leads')
      .select('id, student_name, intent, created_at, college_id')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentError) throw recentError;
    recentLeads = (rd || []).map(rl => ({
        ...rl,
        colleges: { name: leaderboard[rl.college_id]?.name || 'Unknown Node' }
    }));
  } catch (err) {
    console.error('💥 [LEAD_SERVICE] Recent signal pulse failed:', err.message);
  }

  return {
    leaderboard: sortedLeaderboard,
    recentLeads,
    globalDistricts,
    globalSentiment
  };
};

/**
 * Global Lead Search across all colleges (Admin Only)
 */
export const searchGlobalLeads = async (query, dateFilter) => {
  let dbQuery = supabaseServer
    .from('leads')
    .select('*, colleges(name)');

  if (query) {
    dbQuery = dbQuery.or(`student_name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`);
  }

  dbQuery = applyDateFilter(dbQuery, dateFilter);

  const { data, error } = await dbQuery.limit(50).order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};
