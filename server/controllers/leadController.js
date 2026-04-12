import * as leadService from '../services/leadService.js';

// Get all leads with pagination
export const getLeads = async (req, res, next) => {
  try {
    const { page, limit, search, status, dateFilter, college_id: query_college_id } = req.query;
    
    let college_id = null;

    if (req.userRole === 'ADMIN') {
      // Admin defaults to searching all, but can filter by query_college_id
      college_id = query_college_id || null;
    } else if (req.userRole === 'COLLEGE') {
      const { data: college } = await req.supabase
        .from('colleges')
        .select('id')
        .eq('email', req.user.email)
        .single();
      
      if (!college) {
        return res.status(403).json({ error: 'Unauthorized: No organization node linked to this account.' });
      }
      college_id = college.id;
    } else {
      // Regular users or unknown roles see NOTHING by default
      return res.status(403).json({ error: 'Access denied: Profile does not have lead clearance.' });
    }

    const result = await leadService.getLeads({ 
      page, 
      limit, 
      search, 
      status, 
      college_id,
      dateFilter
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Get single lead
export const getLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lead = await leadService.getLeadById(id);
    res.json(lead);
  } catch (error) {
    next(error);
  }
};

// Create lead
export const createLead = async (req, res, next) => {
  try {
    const leadData = {
      ...req.body,
      created_by: req.user.id,
    };

    const lead = await leadService.createLead(leadData);
    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
};

// Update lead
export const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lead = await leadService.updateLead(id, req.body, req.user.id);
    res.json(lead);
  } catch (error) {
    next(error);
  }
};

// Delete lead
export const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    await leadService.deleteLead(id);
    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Purge leads surgically by date and college
export const purgeLeads = async (req, res, next) => {
  try {
    const { date, college_id } = req.body;
    
    if (req.userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied: Admin only' });
    }

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    let start = new Date();
    if (date === 'tomorrow') {
      start.setDate(start.getDate() + 1);
    }
    
    // Set to start of day (00:00:00.000)
    start.setHours(0, 0, 0, 0);
    const startDate = start.toISOString();
    
    // Set to end of day (23:59:59.999)
    let end = new Date(start);
    end.setHours(23, 59, 59, 999);
    const endDate = end.toISOString();

    const result = await leadService.purgeLeadsByDate({
      college_id,
      startDate,
      endDate,
      user_id: req.user.id
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Get lead statistics
export const getLeadStats = async (req, res, next) => {
  try {
    const { college_id: query_id, dateFilter } = req.query;
    let college_id = null;

    if (req.userRole === 'ADMIN') {
      college_id = query_id || null;
    } else if (req.userRole === 'COLLEGE') {
      const { data: college } = await req.supabase
        .from('colleges')
        .select('id')
        .eq('email', req.user.email)
        .single();
      
      if (!college) {
        return res.status(403).json({ error: 'Unauthorized stats access' });
      }
      college_id = college.id;
    } else {
      return res.status(403).json({ error: 'No clearance for stats' });
    }

    const stats = await leadService.getLeadStats(college_id, dateFilter);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

// Get lead activity
export const getLeadActivity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const activity = await leadService.getLeadActivity(id);
    res.json(activity);
  } catch (error) {
    next(error);
  }
};
// Get global stats (admin only)
export const getGlobalStats = async (req, res, next) => {
  try {
    console.log('📡 [NEURAL_DIAGNOSTIC] Global Stats Request by:', req.user?.email, 'Role:', req.userRole);
    if (req.userRole?.toUpperCase() !== 'ADMIN') {
      console.warn('⚠️ [NEURAL_DIAGNOSTIC] Access Blocked: Non-admin attempt');
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    const { dateFilter } = req.query;
    const stats = await leadService.getGlobalStats(dateFilter);
    console.log('✅ [NEURAL_DIAGNOSTIC] Global Stats Compiled. Total Leads:', stats?.total);
    res.json(stats);
  } catch (error) {
    console.error('💥 [NEURAL_DIAGNOSTIC] Global Stats Crash:', error.message);
    next(error);
  }
};

// Get global intelligence (admin only)
export const getGlobalIntelligence = async (req, res, next) => {
  try {
    console.log('📡 [NEURAL_DIAGNOSTIC] Global Intelligence Request by:', req.user?.email);
    if (req.userRole?.toUpperCase() !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    const intel = await leadService.getGlobalIntelligence();
    console.log('✅ [NEURAL_DIAGNOSTIC] Intelligence Synced. Nodes:', intel?.leaderboard?.length);
    res.json(intel);
  } catch (error) {
    console.error('💥 [NEURAL_DIAGNOSTIC] Intelligence Crash:', error.message);
    next(error);
  }
};

// Global search leads (admin only)
export const getGlobalLeads = async (req, res, next) => {
  try {
    if (req.userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    const { search, dateFilter } = req.query;
    const leads = await leadService.searchGlobalLeads(search, dateFilter);
    res.json(leads);
  } catch (error) {
    next(error);
  }
};
