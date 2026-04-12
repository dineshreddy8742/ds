import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { leadsAPI, messagesAPI } from '../../services/api';
import { supabase } from '../../lib/supabase';
import { Sidebar } from '../../components/layout/Sidebar';
import { LoadingSpinner } from '../../components/common/Loading';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import * as XLSX from 'xlsx';
import { 
  Zap,
  Menu,
  Sun,
  Moon,
  LayoutDashboard,
  Users,
  MessageSquare,
  Settings,
  Shield,
  Search,
  Download,
  Upload,
  RefreshCw,
  Clock,
  CheckCircle2,
  Trash2,
  Phone,
  Bot,
  Filter,
  Calendar,
  User,
  PhoneCall,
  ThumbsUp,
  ThumbsDown,
  Target,
  Activity,
  BrainCircuit
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

const STATUS_OPTIONS = [
  { value: 'New', label: 'New', color: '#3b82f6' },
  { value: 'Contacted', label: 'Contacted', color: '#8b5cf6' },
  { value: 'Interested', label: 'Interested', color: '#10b981' },
  { value: 'Not Interested', label: 'Not Interested', color: '#ef4444' },
  { value: 'Enrolled', label: 'Enrolled', color: '#059669' }
];

export default function CollegePortalPage() {
  const { user, signOut, userRole, collegeName } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stats, setStats] = useState({ total: 0, interested: 0, notInterested: 0, by_status: {}, by_intent: {}, trends: [] });
  const [selectedLead, setSelectedLead] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateFilter, setDateFilter] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isIssue, setIsIssue] = useState(false);
  const [collegeId, setCollegeId] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user, pagination.page, search, statusFilter, dateFilter, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsData, statsData] = await Promise.all([
        leadsAPI.getAll({ 
          page: pagination.page, 
          limit: pagination.limit, 
          search,
          status: statusFilter,
          dateFilter
        }),
        leadsAPI.getStats(null, dateFilter),
      ]);

      setLeads(leadsData.data || []);
      setPagination(prev => ({ ...prev, ...leadsData.pagination }));
      setStats(statsData);
      
      // Get internal college ID for chat
      if (leadsData.data && leadsData.data.length > 0) {
        setCollegeId(leadsData.data[0].college_id);
      }
    } catch (error) {
      toast.error('Failed to fetch lead data');
    } finally {
      setLoading(false);
    }
  };

  const fetchChat = async () => {
    if (!collegeId) return;
    setChatLoading(true);
    try {
      const data = await messagesAPI.getChat(collegeId);
      setMessages(data || []);
    } catch (error) {
      console.error('Chat fetch failed');
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'support' && collegeId) {
      fetchChat();
      
      // Subscribe to real-time chat updates
      const channel = supabase
        .channel('support_messages')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'support_messages', 
          filter: `college_id=eq.${collegeId}` 
        }, payload => {
          setMessages(prev => [...prev, payload.new]);
          if (payload.new.sender_role === 'ADMIN') {
            if (payload.new.message.includes('__CALL_SIGNAL__')) {
                toast('EMERGENCY: Administrator is initiating a Neural Audio Bridge!', { icon: '🎙️', duration: 6000 });
                setIsCalling(true);
            } else {
                toast('New signal from Admin', { icon: '💬' });
            }
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeTab, collegeId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !collegeId) return;

    try {
      await messagesAPI.send({
        college_id: collegeId,
        message: newMessage,
        is_issue: isIssue
      });
      setNewMessage('');
      setIsIssue(false);
    } catch (error) {
      toast.error('Message delivery failed');
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const sanitizeLeadsForExcel = (data) => {
    return (data || []).map(l => ({
      'Student Name': l.student_name || 'N/A',
      'Phone': l.phone || 'N/A',
      'Status': l.status || 'New',
      'AI Score': l.ai_score || 0,
      'Call Duration': l.duration ? `${l.duration}s` : '0s',
      'Conversation Transcript': l.conversation || 'No transcript available',
      'Created At': new Date(l.created_at).toLocaleDateString()
    }));
  };

  const exportToExcel = async () => {
    setIsExporting(true);
    const id = toast.loading('Synchronizing full institutional data...');
    try {
      // Fetch all leads in batches (backend limit is 1000 per request)
      const allLeads = [];
      let page = 1;
      let hasMore = true;
      
      while (hasMore) {
        const data = await leadsAPI.getAll({
          page,
          limit: 1000,
          search,
          status: statusFilter,
          dateFilter
        });
        allLeads.push(...(data.data || []));
        hasMore = allLeads.length < (data.total || 0);
        page++;
      }

      const cleanData = sanitizeLeadsForExcel(allLeads);
      const worksheet = XLSX.utils.json_to_sheet(cleanData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Institutional Leads');
      
      // Auto-size columns for better readability
      const columnWidths = [
        { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 10 },
        { wch: 15 }, { wch: 100 }, { wch: 15 }
      ];
      worksheet['!cols'] = columnWidths;

      XLSX.writeFile(workbook, `dialsmart-intelligence-${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success(`Successfully exported ${cleanData.length} records`, { id });
    } catch (error) {
      toast.error('Bulk export sequence failed', { id });
    } finally {
      setIsExporting(false);
    }
  };

  const exportInterestedLeads = async () => {
    setIsExporting(true);
    const id = toast.loading('Extracting High-Intent success signals...');
    try {
      // Fetch all leads in batches (backend limit is 1000 per request)
      const allLeads = [];
      let page = 1;
      let hasMore = true;
      
      while (hasMore) {
        const data = await leadsAPI.getAll({
          page,
          limit: 1000,
          search,
          dateFilter
        });
        allLeads.push(...(data.data || []));
        hasMore = allLeads.length < (data.total || 0);
        page++;
      }

      const interestedLeads = allLeads.filter(l => {
        const s = String(l?.status || '').toLowerCase();
        const i = String(l?.intent || '').toLowerCase();
        // Match backend's broad-spectrum interest detection
        return s === 'interested' || s === 'enrolled' || 
               i.includes('high') || i.includes('interested') || 
               i.includes('yes') || i.includes('positive');
      });
      
      if (interestedLeads.length === 0) {
        toast.error('No high-intent signals detected in this range', { id });
        return;
      }

      const cleanData = sanitizeLeadsForExcel(interestedLeads);
      const worksheet = XLSX.utils.json_to_sheet(cleanData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Target Leads');
      
      // Apply column widths
      worksheet['!cols'] = [
        { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 10 },
        { wch: 15 }, { wch: 100 }, { wch: 15 }
      ];

      XLSX.writeFile(workbook, `DIALSMART-HIGH-INTENT-${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success(`Exported ${cleanData.length} Success-Signal leads`, { id });
    } catch (error) {
      toast.error('Interested export sequence failed', { id });
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusColor = (status) => {
    return STATUS_OPTIONS.find(s => s.value === status)?.color || '#71717a';
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'leads', label: 'Lead Pipeline', icon: <Filter size={20} /> },
    { id: 'support', label: 'Neural Link Hub', icon: <MessageSquare size={20} /> },
    { id: 'followups', label: 'Follow-ups', icon: <Calendar size={20} /> },
    { id: 'profile', label: 'Settings', icon: <User size={20} /> },
  ];

  return (
    <div className="cosmic-bg responsive-container" style={{ minHeight: '100vh', color: 'var(--text-main)' }}>
      <div className="stars-container">
        <div className="stars star-layer-1"></div>
        <div className="stars star-layer-2"></div>
      </div>
      <div className="nebula-glow"></div>

      {/* Mobile Header */}
      <header className="mobile-only" style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: '60px', 
        background: 'var(--panel-bg)', 
        borderBottom: '1px solid var(--border)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 1.25rem', 
        zIndex: 45,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 900 }}>
          <Zap size={20} color="var(--accent)" />
          <span>DialSmart<span style={{ color: 'var(--accent)' }}>.ai</span></span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
        >
          <Menu size={24} />
        </button>
      </header>

      <Sidebar
        title={<div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 900, fontSize: '1.25rem' }}>
          <div style={{ padding: '0.4rem', background: 'linear-gradient(135deg, var(--accent), #6366f1)', borderRadius: '8px' }}>
            <Zap size={20} color="white" />
          </div>
          DialSmart<span style={{ color: 'var(--accent)' }}>.ai</span>
        </div>}
        navItems={navItems}
        activeItem={activeTab}
        onNavClick={(id) => {
          if (id === 'profile') navigate('/profile');
          else setActiveTab(id);
          setIsSidebarOpen(false);
        }}
        onLogout={handleLogout}
        userBadge={{ label: 'ORGANIZATION', value: collegeName || 'General Client' }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="dashboard-main" style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', zIndex: 1, marginTop: 'max(0px, 60px)' }}>
        <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h1 className="shimmer-text" style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 900, margin: '0 0 0.5rem', letterSpacing: '-0.04em' }}>
              Welcome Back, Counselor
            </h1>
            <p style={{ color: 'var(--text-muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} color="var(--accent)" /> Neural sync active • {new Date().toLocaleTimeString()}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>

            <Button 
              onClick={exportInterestedLeads} 
              disabled={isExporting}
              style={{ background: 'linear-gradient(135deg, var(--success), #059669)', border: 'none', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}
            >
              {isExporting ? <RefreshCw size={18} className="animate-spin" /> : <Zap size={18} />}
              {isExporting ? 'Processing...' : 'Export Interested Only'}
            </Button>
            <Button 
              onClick={exportToExcel} 
              variant="secondary" 
              disabled={isExporting}
              style={{ borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {isExporting ? <RefreshCw size={18} className="animate-spin" /> : <Download size={18} />}
              {isExporting ? 'Processing...' : 'All Records'}
            </Button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <>
            {/* Call Analytics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              <div className="premium-glass" style={{ padding: '1.75rem', borderRadius: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ padding: '0.6rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '14px' }}>
                    <PhoneCall size={24} color="var(--accent)" />
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)' }}>TOTAL EXECUTION</div>
                </div>
                <div style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.25rem' }}>{stats.total || 0}</div>
                <div style={{ fontSize: '0.875rem', color: "var(--text-muted)", fontWeight: 600 }}>Total Calls Made</div>
              </div>

              <div className="premium-glass" style={{ padding: '1.75rem', borderRadius: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ padding: '0.6rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '14px' }}>
                    <ThumbsUp size={24} color="var(--success)" />
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--success)' }}>SUCCESS SIGNAL</div>
                </div>
                <div style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.25rem' }}>{stats.interested || 0}</div>
                <div style={{ fontSize: '0.875rem', color: "var(--text-muted)", fontWeight: 600 }}>Interested Leads</div>
              </div>

              <div className="premium-glass" style={{ padding: '1.75rem', borderRadius: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ padding: '0.6rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '14px' }}>
                    <ThumbsDown size={24} color="var(--danger)" />
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--danger)' }}>NO INTEREST</div>
                </div>
                <div style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.25rem' }}>{stats.notInterested || 0}</div>
                <div style={{ fontSize: '0.875rem', color: "var(--text-muted)", fontWeight: 600 }}>Not Interested</div>
              </div>

              <div className="premium-glass" style={{ padding: '1.75rem', borderRadius: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ padding: '0.6rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '14px' }}>
                    <Target size={24} color="#8b5cf6" />
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8b5cf6' }}>PRECISION</div>
                </div>
                <div style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.25rem' }}>98%</div>
                <div style={{ fontSize: '0.875rem', color: "var(--text-muted)", fontWeight: 600 }}>AI Accuracy Rate</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div className="premium-glass" style={{ padding: '2rem', borderRadius: '24px', minHeight: '400px' }}>
                <h4 style={{ margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Activity size={18} color="var(--accent)" /> Engagement Trends
                </h4>
                <div style={{ width: '100%', height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.trends}>
                      <defs>
                        <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="leads" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLeads)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="premium-glass" style={{ padding: '2.5rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), transparent)' }}>
                <div style={{ width: '60px', height: '60px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <BrainCircuit size={32} color="#3b82f6" />
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '0.75rem' }}>Predictive AI Sync</h4>
                <p style={{ color: "var(--text-muted)", fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                  "Neural analysis complete. Your campaign is performing at 98% efficiency. Focus on high-intent signals &gt; 80 for optimal conversion."
                </p>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '0.5rem' }}>NEXT BEST ACTION</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Re-engage morning cohort with intent &lt; 40</div>
                </div>
              </div>
            </div>
          </>
        )}

        {(activeTab === 'leads' || activeTab === 'followups') && (
          <div>
            {/* Search & Intelligence Controls */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  placeholder="Query student intelligence (Name, Phone, Email)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1.125rem 1.25rem 1.125rem 3.5rem',
                    background: 'var(--glass)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '16px',
                    color: "var(--text-main)",
                    outline: 'none',
                    fontSize: '0.9375rem',
                    boxShadow: 'inset 0 2px 4px var(--glass)'
                  }}
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={selectStyle}
              >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value} style={{ background: 'var(--panel-bg)', color: 'var(--text-main)' }}>{opt.label}</option>
                ))}
              </select>

              <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--glass)', padding: '0.5rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                {[
                  { id: '', label: 'All Time' },
                  { id: 'today', label: 'Today' },
                  { id: 'last7days', label: 'Weekly' },
                  { id: 'last30days', label: 'Monthly' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setDateFilter(f.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: dateFilter === f.id ? 'var(--accent)' : 'transparent',
                      color: dateFilter === f.id ? 'white' : 'var(--text-muted)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
                <input 
                  type="date"
                  value={/^\d{4}-\d{2}-\d{2}$/.test(dateFilter) ? dateFilter : ''}
                  onChange={(e) => setDateFilter(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-main)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    outline: 'none',
                    padding: '0 0.5rem'
                  }}
                />
              </div>
            </div>

            {/* Main Lead Data Grid */}
            <div className="premium-glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1200px' }}>
                  <thead>
                    <tr style={{ background: 'var(--glass)', borderBottom: '1px solid var(--glass-border)' }}>
                      <th style={tableHeaderStyle}>Name</th>
                      <th style={tableHeaderStyle}>Phone</th>
                      <th style={tableHeaderStyle}>Conversation</th>
                      <th style={tableHeaderStyle}>Duration</th>
                      <th style={tableHeaderStyle}>Status</th>
                      <th style={tableHeaderStyle}>Score</th>
                      <th style={tableHeaderStyle}>Call Start Time</th>
                      <th style={tableHeaderStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.length > 0 ? leads.map((lead) => (
                      <tr key={lead.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }} className="hover-row">
                        <td style={tableCellStyle}>
                          <div style={{ fontWeight: 800, fontSize: '0.9375rem' }}>{lead.student_name || 'Unknown'}</div>
                          {lead.email && (
                            <div style={{ fontSize: '0.75rem', color: "var(--text-muted)", marginTop: '0.25rem' }}>{lead.email}</div>
                          )}
                        </td>
                        <td style={tableCellStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem' }}>
                            <Phone size={14} color="var(--text-muted)" /> {lead.phone || '-'}
                          </div>
                        </td>
                        <td style={{ ...tableCellStyle, maxWidth: '250px' }}>
                          <div style={{ 
                            fontSize: '0.8125rem', 
                            color: "var(--text-muted)",
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '250px'
                          }} title={lead.conversation || ''}>
                            {lead.conversation || '-'}
                          </div>
                        </td>
                        <td style={tableCellStyle}>
                          <div style={{ fontSize: '0.875rem', fontFamily: 'monospace', color: "var(--text-main)" }}>
                            {lead.duration || '-'}
                          </div>
                        </td>
                        <td style={tableCellStyle}>
                          <span style={{
                            padding: '0.4rem 0.75rem',
                            borderRadius: '24px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            background: `${getStatusColor(lead.status)}15`,
                            color: getStatusColor(lead.status),
                            border: `1px solid ${getStatusColor(lead.status)}30`,
                            display: 'inline-block',
                            whiteSpace: 'nowrap'
                          }}>
                            {lead.status || 'New'}
                          </span>
                        </td>
                        <td style={tableCellStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ 
                              width: '50px', 
                              height: '6px', 
                              background: 'rgba(255,255,255,0.05)', 
                              borderRadius: '10px', 
                              overflow: 'hidden' 
                            }}>
                              <div style={{ 
                                width: `${lead.ai_score || 0}%`, 
                                height: '100%', 
                                background: (lead.ai_score || 0) > 70 ? 'var(--success)' : (lead.ai_score || 0) > 40 ? 'var(--warning)' : 'var(--danger)',
                                borderRadius: '10px'
                              }} />
                            </div>
                            <span style={{ fontSize: '0.8125rem', fontWeight: 800, minWidth: '30px' }}>
                              {lead.ai_score || 0}
                            </span>
                          </div>
                        </td>
                        <td style={tableCellStyle}>
                          <div style={{ fontSize: '0.8125rem', color: "var(--text-muted)", fontFamily: 'monospace' }}>
                            {lead.call_start_time || '-'}
                          </div>
                        </td>
                        <td style={tableCellStyle}>
                          <Button variant="secondary" onClick={() => setSelectedLead(lead)} style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                            View Details
                          </Button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="8" style={{ padding: '6rem', textAlign: 'center', color: "var(--text-muted)" }}>
                          No lead signals detected in this range.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 1.5rem',
                  borderTop: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '0.8125rem', color: "var(--text-muted)" }}>
                      Showing {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} leads
                    </div>
                    <select
                      value={pagination.limit}
                      onChange={(e) => {
                        const newLimit = Number(e.target.value);
                        setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
                      }}
                      style={{
                        padding: '0.4rem 0.75rem',
                        background: 'rgba(15, 23, 42, 0.8)',
                        color: "var(--text-main)",
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      <option value={10}>10 per page</option>
                      <option value={25}>25 per page</option>
                      <option value={50}>50 per page</option>
                      <option value={100}>100 per page</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        background: pagination.page === 1 ? 'transparent' : 'var(--glass)',
                        color: pagination.page === 1 ? 'var(--text-muted)' : 'var(--text-main)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
                        opacity: pagination.page === 1 ? 0.5 : 1
                      }}
                    >
                      ← Previous
                    </button>
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      const isActive = pagination.page === pageNum;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                          style={{
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.875rem',
                            fontWeight: isActive ? 900 : 700,
                            minWidth: '40px',
                            background: isActive ? 'var(--accent)' : 'var(--glass)',
                            color: isActive ? '#ffffff' : 'var(--text-main)',
                            border: isActive ? '1px solid var(--accent)' : '1px solid var(--glass-border)',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === pagination.totalPages}
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        background: pagination.page === pagination.totalPages ? 'transparent' : 'var(--glass)',
                        color: pagination.page === pagination.totalPages ? 'var(--text-muted)' : 'var(--text-main)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer',
                        opacity: pagination.page === pagination.totalPages ? 0.5 : 1
                      }}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div style={{ width: '100%', height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
            <div className="premium-glass" style={{ flex: 1, borderRadius: '24px 24px 0 0', padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.25rem' }}>Neural Link Support</h3>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: "var(--text-muted)" }}>Direct communication pulse with Super Admin</p>
                </div>
                <div 
                  onClick={() => setIsCalling(true)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2))',
                    color: 'var(--accent)',
                    borderRadius: '16px',
                    fontSize: '0.875rem', 
                    fontWeight: 900, 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    border: '1px solid var(--accent)',
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  className="pulse-button"
                >
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'var(--accent)', opacity: 0.4, filter: 'blur(8px)', borderRadius: '50%' }} className="animate-pulse"></div>
                    <PhoneCall size={18} style={{ position: 'relative' }} />
                  </div>
                  Join Neural Audio Bridge
                </div>
              </div>

              {chatLoading ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LoadingSpinner /></div>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {messages.map((msg) => (
                    <div key={msg.id} style={{
                      alignSelf: msg.sender_role === 'ADMIN' ? 'flex-start' : 'flex-end',
                      maxWidth: '80%',
                      background: msg.sender_role === 'ADMIN' ? 'rgba(59, 130, 246, 0.1)' : 'var(--glass)',
                      padding: '1rem',
                      borderRadius: msg.sender_role === 'ADMIN' ? '0 16px 16px 16px' : '16px 16px 0 16px',
                      border: msg.sender_role === 'ADMIN' ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid var(--glass-border)'
                    }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 900, color: msg.sender_role === 'ADMIN' ? 'var(--accent)' : 'var(--text-muted)', marginBottom: '0.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                        <span>{msg.sender_role === 'ADMIN' ? 'SYSTEM ADMIN' : 'MY NODE'}</span>
                        {msg.is_issue && (
                          <span style={{
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            background: msg.issue_status === 'Solved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: msg.issue_status === 'Solved' ? 'var(--success)' : 'var(--danger)'
                          }}>
                            ISSUE: {msg.issue_status}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.9375rem', lineHeight: 1.5 }}>{msg.message}</div>
                      <div style={{ fontSize: '0.6rem', color: "var(--text-muted)", marginTop: '0.4rem', textAlign: 'right' }}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <form onSubmit={handleSendMessage} className="premium-glass" style={{ borderRadius: '0 0 24px 24px', padding: '1.25rem', borderTop: 'none', background: 'var(--panel-bg)' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <Input
                    placeholder="Describe your issue or thought..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{ marginBottom: 0 }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                   <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800, color: isIssue ? 'var(--danger)' : 'var(--text-muted)' }}>
                    <input type="checkbox" checked={isIssue} onChange={(e) => setIsIssue(e.target.checked)} />
                    REPORT ISSUE
                   </label>
                   <Button type="submit" style={{ borderRadius: '12px' }}>Send</Button>
                </div>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* Neural Audio Bridge Modal */}
      <Modal
        isOpen={isCalling}
        onClose={() => setIsCalling(false)}
        title={`Neural Audio Bridge: Super Admin`}
        size="full"
      >
        <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.1)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--accent)', borderRadius: '50%' }}>
                <Activity size={20} color="white" />
            </div>
            <div>
                <div style={{ fontWeight: 900, fontSize: '0.875rem' }}>Secure Frequency Established</div>
                <div style={{ fontSize: '0.75rem', color: "var(--text-muted)" }}>Establishing encrypted p2p tunnel...</div>
            </div>
        </div>

        <div style={{ width: '100%', height: '75vh', borderRadius: '24px', overflow: 'hidden', background: 'var(--panel-bg)', border: '1px solid var(--border)' }}>
            {isCalling && (
              <iframe
                src={`https://meet.jit.si/dialsmart-support-${collegeId}`}
                allow="camera; microphone; fullscreen; display-capture; autoplay"
                style={{ width: '100%', height: '100%', border: 'none' }}
              ></iframe>
            )}
        </div>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Button onClick={() => setIsCalling(false)} variant="secondary" style={{ borderRadius: '14px', padding: '0.75rem 2rem' }}>
                Terminate Signal
            </Button>
        </div>
      </Modal>

      {/* Lead Details Modal */}
      <Modal
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title="Neural Lead Intelligence"
      >
        {selectedLead && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="premium-glass" style={{ padding: '1rem', borderRadius: '16px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '0.25rem' }}>STUDENT NAME</div>
                <div style={{ fontWeight: 700 }}>{selectedLead.student_name}</div>
              </div>
              <div className="premium-glass" style={{ padding: '1rem', borderRadius: '16px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '0.25rem' }}>SIGNAL STATUS</div>
                <div style={{ fontWeight: 700, color: getStatusColor(selectedLead.status) }}>{selectedLead.status}</div>
              </div>
            </div>

            <div className="premium-glass" style={{ padding: '1.5rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BrainCircuit size={16} /> NEURAL TRANSCRIPT
              </div>
              <div style={{
                fontSize: '0.875rem',
                lineHeight: 1.6,
                color: "var(--text-main)",
                maxHeight: '300px',
                overflowY: 'auto',
                padding: '0.5rem'
              }}>
                {selectedLead.conversation ? selectedLead.conversation.split('\n').map((line, i) => (
                  <div key={i} style={{ marginBottom: '0.75rem' }}>{line}</div>
                )) : 'No conversation data available.'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
               <div className="premium-glass" style={{ flex: 1, padding: '1rem', borderRadius: '16px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: "var(--text-muted)", marginBottom: '0.25rem' }}>AI PRECISION SCORE</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: (selectedLead.ai_score || 0) > 70 ? 'var(--success)' : 'var(--text-main)' }}>{selectedLead.ai_score || 0}%</div>
               </div>
               <div className="premium-glass" style={{ flex: 1, padding: '1rem', borderRadius: '16px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: "var(--text-muted)", marginBottom: '0.25rem' }}>CALL DURATION</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>{selectedLead.duration || '0s'}</div>
               </div>
            </div>

            <Button onClick={() => setSelectedLead(null)} fullWidth style={{ borderRadius: '14px', padding: '1rem' }}>
              Terminate Intelligence View
            </Button>
          </div>
        )}
      </Modal>

      <style dangerouslySetInnerHTML={{ __html: `
        .hover-row:hover { background: var(--glass) !important; }
        .hero-gradient-text { background: linear-gradient(135deg, var(--text-main) 0%, var(--text-muted) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .premium-glass {
          background: var(--glass);
          backdrop-filter: blur(25px);
          border: 1px solid var(--glass-border);
          box-shadow: var(--shadow);
        }
        @media (min-width: 1025px) {
          .dashboard-main { margin-left: 280px; }
          .mobile-only { display: none !important; }
        }
      `}} />
    </div>
  );
}

const tableHeaderStyle = {
  padding: '1.5rem',
  textAlign: 'left',
  fontSize: '0.75rem',
  fontWeight: 900,
  color: "var(--text-muted)",
  textTransform: 'uppercase',
  letterSpacing: '0.1em'
};

const tableCellStyle = {
  padding: '1.5rem',
  fontSize: '0.9375rem',
  color: "var(--text-main)"
};

const selectStyle = {
  padding: '0 1.5rem',
  background: 'var(--glass)',
  border: '1px solid var(--glass-border)',
  borderRadius: '16px',
  color: "var(--text-main)",
  outline: 'none',
  minWidth: '200px',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer'
};
