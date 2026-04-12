const API_BASE_URL = 'http://localhost:3002/api';

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}/${endpoint}`;
  
  const { headers = {}, ...restOptions } = options;
  
  // Get session token from localStorage
  let token = null;
  
  try {
    const sessionStr = localStorage.getItem('supabase_session');
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      token = session.access_token;
    }
  } catch (e) {
    console.error('Failed to get session token:', e);
  }

  const config = {
    ...restOptions,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      // Don't set Content-Type for FormData, let browser handle it
      ...((!(restOptions.body instanceof FormData)) && { 'Content-Type': 'application/json' }),
      ...headers,
    },
  };

  console.log(`API ${restOptions.method || 'GET'} ${endpoint}`, { hasToken: !!token });

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    console.error(`API Error ${endpoint}:`, error);
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Leads API
export const leadsAPI = {
  getAll: (params = {}) => {
    // Filter out undefined/null values before creating query string
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v != null && v !== '')
    );
    const query = new URLSearchParams(cleanParams).toString();
    return fetchAPI(`leads${query ? '?' + query : ''}`);
  },
  getById: (id) => fetchAPI(`leads/${id}`),
  create: (data) => fetchAPI('leads', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
  update: (id, data) => fetchAPI(`leads/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
  delete: (id) => fetchAPI(`leads/${id}`, { method: 'DELETE' }),
  purge: (data) => fetchAPI('leads/purge', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
  getStats: (collegeId, dateFilter) => fetchAPI(`leads/stats?${new URLSearchParams({ ...(collegeId && { college_id: collegeId }), ...(dateFilter && { dateFilter }) })}`),
  getActivityLogs: (id) => fetchAPI(`leads/${id}/activity`),
  getGlobalStats: (dateFilter) => fetchAPI(`leads/global/stats${dateFilter ? `?dateFilter=${dateFilter}` : ''}`),
  getGlobalIntelligence: () => fetchAPI('leads/intelligence'),
  searchGlobal: (query, dateFilter) => fetchAPI(`leads/global/search?search=${query}&dateFilter=${dateFilter}`),
};

// Colleges API
export const collegesAPI = {
  getAll: () => fetchAPI('colleges'),
  getById: (id) => fetchAPI(`colleges/${id}`),
  create: (data) => fetchAPI('colleges', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
  update: (id, data) => fetchAPI(`colleges/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
  delete: (id) => fetchAPI(`colleges/${id}`, { method: 'DELETE' }),
  resetPassword: (id, password) => fetchAPI(`colleges/${id}/reset-password`, { 
    method: 'POST', 
    body: JSON.stringify({ password }), 
    headers: { 'Content-Type': 'application/json' } 
  }),
};

// File Upload API
export const uploadAPI = {
  uploadLeads: (file, college_id) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('college_id', college_id);
    
    return fetchAPI('upload', {
      method: 'POST',
      body: formData,
    });
  },
};

// Sync API
export const syncAPI = {
  syncGoogleSheet: (college_id) => fetchAPI(`sync/google-sheet/${college_id}`, { method: 'POST' }),
};

// Audit API
export const auditAPI = {
  getLogs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`audit${query ? '?' + query : ''}`);
  },
};

// Inquiries API (Landing Page & Admin)
export const inquiriesAPI = {
  submit: (data) => fetchAPI('inquiries/submit', { 
    method: 'POST', 
    body: JSON.stringify(data), 
    headers: { 'Content-Type': 'application/json' } 
  }),
  getAll: () => fetchAPI('inquiries'),
  updateStatus: (id, status) => fetchAPI(`inquiries/${id}/status`, { 
    method: 'PATCH', 
    body: JSON.stringify({ status }), 
    headers: { 'Content-Type': 'application/json' } 
  }),
};

// Support Messages API
export const messagesAPI = {
  getChat: (college_id) => fetchAPI(`messages/${college_id}`),
  send: (data) => fetchAPI('messages', { 
    method: 'POST', 
    body: JSON.stringify(data), 
    headers: { 'Content-Type': 'application/json' } 
  }),
  resolveIssue: (id, status) => fetchAPI(`messages/${id}/issue`, { 
    method: 'PATCH', 
    body: JSON.stringify({ status }), 
    headers: { 'Content-Type': 'application/json' } 
  }),
};
