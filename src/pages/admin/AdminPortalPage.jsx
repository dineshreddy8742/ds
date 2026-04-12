import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { collegesAPI, uploadAPI, auditAPI, leadsAPI, inquiriesAPI, messagesAPI } from '../../services/api';
import { supabase } from '../../lib/supabase';
import { Input, Select } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Sidebar } from '../../components/layout/Sidebar';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/Loading';
import { 
  Zap,
  Menu,
  Sun,
  Moon,
  LayoutDashboard,
  Globe,
  Database,
  Search,
  MessageSquare,
  Mail,
  Shield,
  User,
  Settings,
  Briefcase,
  Lock,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Sparkles,
  Bot,
  Plus,
  RefreshCw,
  Trash2,
  Download,
  Upload,
  Phone,
  MessageCircle,
  AlertCircle,
  UploadCloud,
  Building2,
  Activity,
  History,
  Users,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AdminPortalPage() {
  const { user, signOut, userRole } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [auditLogs, setAuditLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCollege, setNewCollege] = useState({ name: '', email: '', password: '' });
  const [filterCollege, setFilterCollege] = useState('all');
  const [filterLoading, setFilterLoading] = useState(false);
  const [globalStats, setGlobalStats] = useState({ total: 0, by_status: {}, by_intent: {}, trends: [] });
  const [inquiries, setInquiries] = useState([]);

  // Global Search
  const [globalSearchLeads, setGlobalSearchLeads] = useState([]);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [globalSearchDate, setGlobalSearchDate] = useState('');

  // Upload state
  const [file, setFile] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState('');
  const [uploading, setUploading] = useState(false);

  // Management State (Purge/Replace)
  const [purgeDate, setPurgeDate] = useState('today');
  const [purgeCollege, setPurgeCollege] = useState('');
  const [purging, setPurging] = useState(false);
  const [replacing, setReplacing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChatCollege, setSelectedChatCollege] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [intel, setIntel] = useState({ leaderboard: [], recentLeads: [] });
  const [intelLoading, setIntelLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState('');

  // Manual Lead Entry State
  const [manualLead, setManualLead] = useState({
    student_name: '',
    phone: '',
    email: '',
    intent: 'Medium',
    college_id: '',
    status: 'New'
  });

  useEffect(() => {
    if (userRole !== 'ADMIN') {
      navigate('/dashboard');
      return;
    }
    fetchInitialData();
  }, [userRole, navigate]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [collegesData] = await Promise.all([
        collegesAPI.getAll(),
      ]);
      setColleges(collegesData);
      
      // Fetch stats for 'all' by default
      fetchDashboardStats('all', dateFilter);

      if (collegesData.length > 0) {
        setSelectedCollege(collegesData[0].id);
        setPurgeCollege(collegesData[0].id);
        setManualLead(prev => ({ ...prev, college_id: collegesData[0].id }));
      }
    } catch (error) {
      toast.error('Failed to initialize admin data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async (collegeId, currentFilter = dateFilter) => {
    setFilterLoading(true);
    try {
      let statsData;
      if (collegeId === 'all') {
        statsData = await leadsAPI.getGlobalStats(currentFilter);
      } else {
        statsData = await leadsAPI.getStats(collegeId, currentFilter);
      }
      setGlobalStats(statsData);
    } catch (error) {
      toast.error('Failed to fetch dashboard statistics');
    } finally {
      setFilterLoading(false);
    }
  };

  const fetchIntel = async () => {
    setIntelLoading(true);
    try {
      const data = await leadsAPI.getGlobalIntelligence();
      setIntel(data);
    } catch (error) {
      console.error('Intel failure');
    } finally {
      setIntelLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'overview' && colleges.length > 0) {
      fetchDashboardStats(filterCollege);
    }
  }, [filterCollege]);

  useEffect(() => {
    if (activeTab === 'audit') {
      fetchAuditLogs();
    }
    if (activeTab === 'inquiries') {
      fetchInquiries();
    }
    if (activeTab === 'profile') {
      navigate('/profile');
    }
    if (activeTab === 'overview') {
      fetchIntel();
    }
  }, [activeTab]);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const data = await inquiriesAPI.getAll();
      setInquiries(data.data || []);
    } catch (error) {
      toast.error('Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInquiryStatus = async (id, status) => {
    try {
      await inquiriesAPI.updateStatus(id, status);
      toast.success('Inquiry status updated');
      fetchInquiries();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleInjectSampleInquiries = async () => {
    setLoading(true);
    try {
      const samples = [
        { name: 'Dr. Sarah Chen', email: 'sarah@meditech.io', phone: '+1-555-0102', industry: 'Healthcare AI', message: 'Interested in clinical lead qualification.' },
        { name: 'Marcus Rodriguez', email: 'marcus@globalfin.com', phone: '+44-20-7946-0958', industry: 'Financial Services', message: 'Looking for insurance claim automation.' },
        { name: 'Ananya Gupta', email: 'ananya@edutech.in', phone: '+91-98765-43210', industry: 'Education', message: 'Need bulk admission counselors for 2026.' }
      ];

      for (const sample of samples) {
        await inquiriesAPI.submit(sample);
      }
      
      toast.success('Neural simulation complete: 3 signals arriving!', { icon: '🛰️' });
      fetchInquiries();
    } catch (error) {
      toast.error('Simulation drift detected: Manual SQL setup required first.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const data = await auditAPI.getLogs();
      setAuditLogs(data.data || []);
    } catch (error) {
      toast.error('Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  const handleGlobalSearch = async () => {
    if (!globalSearchQuery) return;
    setLoading(true);
    try {
      const data = await leadsAPI.searchGlobal(globalSearchQuery, globalSearchDate);
      setGlobalSearchLeads(data || []);
      if (!data || data.length === 0) {
        toast('No signal detected for this query', { icon: '📡' });
      }
    } catch (error) {
      toast.error('Global search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollege = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await collegesAPI.create(newCollege);
      toast.success('Organization created successfully!');
      setNewCollege({ name: '', email: '', password: '' });
      setShowModal(false);
      fetchInitialData();
    } catch (error) {
      toast.error(error.message || 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !selectedCollege) return toast.error('Please select file and business');
    setUploading(true);
    try {
      await uploadAPI.uploadLeads(file, selectedCollege);
      toast.success('Leads imported successfully!');
      setFile(null);
      fetchInitialData(); // Refresh stats
    } catch (error) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handlePurge = async (silent = false) => {
    if (!silent && !confirm(`Are you absolutely sure you want to PERMANENTLY DELETE all leads for ${purgeDate === 'today' ? 'Today' : 'Tomorrow'}? This cannot be undone.`)) {
      return false;
    }

    setPurging(true);
    try {
      const result = await leadsAPI.purge({ 
        date: purgeDate, 
        college_id: purgeCollege === 'all' ? null : purgeCollege 
      });
      if (!silent) toast.success(result.message || `Purged ${result.count} leads.`);
      fetchInitialData(); // Refresh stats
      return true;
    } catch (error) {
      toast.error(error.message || 'Purge failed');
      return false;
    } finally {
      setPurging(false);
    }
  };

  const fetchChat = async (college_id) => {
    setChatLoading(true);
    try {
      const data = await messagesAPI.getChat(college_id);
      setMessages(data || []);
    } catch (error) {
      console.error('Chat fetch failed');
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'support' && selectedChatCollege) {
      fetchChat(selectedChatCollege.id);
    }
  }, [activeTab, selectedChatCollege]);

  useEffect(() => {
    const channel = supabase
      .channel('admin_support_messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'support_messages'
      }, payload => {
        if (selectedChatCollege && payload.new.college_id === selectedChatCollege.id) {
          setMessages(prev => [...prev, payload.new]);
        }
        if (payload.new.sender_role === 'COLLEGE') {
           toast(`New Support Signal: ${payload.new.college_id.slice(0, 8)}`, { icon: '💬' });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChatCollege]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChatCollege) return;

    try {
      await messagesAPI.send({
        college_id: selectedChatCollege.id,
        message: newMessage,
        is_issue: false
      });
      setNewMessage('');
    } catch (error) {
      toast.error('Message delivery failed');
    }
  };

  const handleStartCall = async () => {
    if (!selectedChatCollege) return;
    setIsCalling(true);
    try {
      await messagesAPI.send({
        college_id: selectedChatCollege.id,
        message: '__CALL_SIGNAL__: Administrator is initializing a Neural Audio Bridge.',
        is_issue: false
      });
    } catch (error) {
      console.error('Call signal ghosted');
    }
  };

  const handleResolveIssue = async (messageId) => {
    try {
      await messagesAPI.resolveIssue(messageId, 'Solved');
      toast.success('Issue marked as Solved', { icon: '✅' });
      fetchChat(selectedChatCollege.id);
    } catch (error) {
      toast.error('Resolution failed');
    }
  };

  const handleReplaceInitiate = async () => {
    if (!purgeCollege || purgeCollege === 'all') {
      return toast.error('Please select a specific organization node for replacement.');
    }
    
    if (!confirm('REPLACE MODE: This will PERMANENTLY DELETE today\'s data for this node and ask for a new file. Proceed?')) {
      return;
    }

    const purged = await handlePurge(true);
    if (purged) {
      // Trigger file input for replacement
      document.getElementById('replace-upload').click();
    }
  };

  const handleReplaceFinalize = async (e) => {
    const replaceFile = e.target.files[0];
    if (!replaceFile) return;

    setReplacing(true);
    try {
      await uploadAPI.uploadLeads(replaceFile, purgeCollege);
      toast.success('Hot Swap Complete: Data replaced successfully!', { icon: '🔄' });
      fetchInitialData();
    } catch (error) {
      toast.error('Replacement upload failed. Node is currently empty.');
    } finally {
      setReplacing(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { id: 'overview', label: 'Command Center', icon: <LayoutDashboard size={20} /> },
    { id: 'upload', label: 'Ingestion Engine', icon: <UploadCloud size={20} /> },
    { id: 'colleges', label: 'Global Network', icon: <Building2 size={20} /> },
    { id: 'maintenance', label: 'Data Maintenance', icon: <History size={20} /> },
    { id: 'search', label: 'Global Search', icon: <Search size={20} /> },
    { id: 'support', label: 'Support Hub', icon: <MessageSquare size={20} /> },
    { id: 'inquiries', label: 'Inbound Inquiries', icon: <Mail size={20} /> },
    { id: 'audit', label: 'Security Logs', icon: <Shield size={20} /> },
    { id: 'profile', label: 'Admin Profile', icon: <User size={20} /> },
  ];

  const pieData = Object.entries(globalStats.by_status || {}).map(([name, value]) => ({ name, value }));

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
          <Shield size={20} color="var(--accent)" />
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
        title={<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 900, fontSize: '1.25rem' }}>
          <div style={{ padding: '0.4rem', background: 'linear-gradient(135deg, var(--accent), #6366f1)', borderRadius: '8px' }}>
            <Shield size={20} color="white" />
          </div>
          DialSmart<span style={{ color: 'var(--accent)' }}>.ai</span>
        </div>}
        navItems={navItems}
        activeItem={activeTab}
        onNavClick={(id) => {
          setActiveTab(id);
          setIsSidebarOpen(false);
        }}
        onLogout={handleLogout}
        userBadge={{ label: 'SYSTEM ADMIN', value: user?.email }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', zIndex: 1, marginTop: 'max(0px, 60px)' }} className="dashboard-main">
        <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h1 className="shimmer-text" style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 900, margin: '0 0 0.5rem', letterSpacing: '-0.04em' }}>
              Admin Command Center
            </h1>
            <p style={{ color: 'var(--text-muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={16} color="var(--accent)" /> Global monitoring and neural network orchestration
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Temporal Node</span>
              <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(255,255,255,0.03)', padding: '0.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {[
                    { id: '', label: 'ALL' },
                    { id: 'today', label: 'TODAY' },
                    { id: 'last7days', label: 'WK' },
                    { id: 'last30days', label: 'MO' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setDateFilter(f.id)}
                      style={{
                        padding: '0.4rem 0.6rem',
                        borderRadius: '8px',
                        fontSize: '0.65rem',
                        fontWeight: 900,
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
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      outline: 'none',
                      padding: '0 0.5rem',
                      width: '100px'
                    }}
                  />
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Neural Focus</span>
              <select
                value={filterCollege}
                onChange={(e) => setFilterCollege(e.target.value)}
                className="premium-glass"
                style={{ 
                   padding: '0.5rem 1rem', 
                   borderRadius: '12px', 
                   border: '1px solid var(--glass-border)', 
                   background: 'var(--panel-bg)',
                   color: 'var(--text-main)',
                   fontSize: '0.8125rem',
                   fontWeight: 700,
                   outline: 'none',
                   cursor: 'pointer'
                }}
              >
                <option value="all">Global Network (All Nodes)</option>
                {colleges.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="premium-glass" style={{ padding: '0.75rem 1.25rem', borderRadius: '14px', border: '1px solid var(--glass-border)', fontWeight: 700, fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-end' }}>
              <Activity size={16} color={filterLoading ? 'var(--text-muted)' : 'var(--accent)'} className={filterLoading ? 'animate-spin' : ''} /> {filterLoading ? 'Syncing...' : 'Optimal'}
            </div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div className="premium-glass" style={{ padding: '2rem', borderRadius: '24px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                <div style={statLabelStyle}>{filterCollege === 'all' ? 'Combined Enterprise Leads' : 'Total Node Leads'}</div>
                <div style={statValueStyle}>{globalStats.total || 0}</div>
                <div style={{ marginTop: '1rem', color: '#3b82f6', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Activity size={12} /> {filterCollege === 'all' ? 'GLOBAL NETWORK' : 'NODE ACTIVE'}
                </div>
              </div>

              <div className="premium-glass" style={{ padding: '2rem', borderRadius: '24px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                <div style={statLabelStyle}>{filterCollege === 'all' ? 'Global High Intent' : 'Node High Intent'}</div>
                <div style={statValueStyle}>{globalStats.interested || 0}</div>
                <div style={{ marginTop: '1rem', color: '#10b981', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={12} /> SUCCESS SIGNAL
                </div>
              </div>

              <div className="premium-glass" style={{ padding: '2rem', borderRadius: '24px' }}>
                <div style={statLabelStyle}>Network Nodes</div>
                <div style={statValueStyle}>{colleges.length}</div>
                <div style={{ marginTop: '1rem', color: '#3b82f6', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Users size={12} /> ACTIVE PARTNERS
                </div>
              </div>

              <div className="premium-glass" style={{ padding: '2rem', borderRadius: '24px' }}>
                <div style={statLabelStyle}>Pending Inquiries</div>
                <div style={statValueStyle}>{inquiries.filter(i => i.status === 'New').length}</div>
                <div style={{ marginTop: '1rem', color: '#f59e0b', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Zap size={12} /> NEXT ACTIONS
                </div>
              </div>
            </div>

            {/* Middle Grid: Trends & Leaderboard */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 2fr 1fr))', gap: '1.5rem' }} className="responsive-grid-2-1">
              <div className="premium-glass" style={{ padding: '2rem', borderRadius: '24px', gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: '#94a3b8' }}>Network Ingress Trends</h3>
                    <div style={{ padding: '0.4rem 0.8rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800 }}>LIVE SYNC</div>
                </div>
                <div style={{ height: '300px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%" minWidth={300}>
                    <AreaChart data={globalStats.trends}>
                      <defs>
                        <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ color: '#3b82f6' }}
                      />
                      <Area type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="premium-glass" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: '#94a3b8' }}>Neural Leaderboard</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {intel.leaderboard && intel.leaderboard.length > 0 ? (
                          intel.leaderboard.map((node, idx) => (
                            <div key={node.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '14px' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: idx === 0 ? '#f59e0b' : 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900 }}>
                                    {idx + 1}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{node.name}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{node.total} leads ingested</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981' }}>{node.total > 0 ? Math.round((node.high_intent / node.total) * 100) : 0}%</div>
                                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8' }}>SUCCESS</div>
                                </div>
                            </div>
                          ))
                        ) : (
                          <div style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', padding: '2rem' }}>Recalibrating node rankings...</div>
                        )}
                    </div>
              </div>
            </div>

            {/* Bottom Grid: AI Perf & Live Stream */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr 2fr))', gap: '1.5rem' }} className="responsive-grid-1-2">
                <div className="premium-glass" style={{ padding: '2rem', borderRadius: '24px' }}>
                    <h3 style={{ margin: '0 0 1.5rem', fontWeight: 800, fontSize: '1rem', color: '#94a3b8' }}>AI Performance</h3>
                    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 900, color: '#3b82f6', textShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}>
                           {globalStats.total > 0 ? Math.round((globalStats.interested / globalStats.total) * 100) : 0}%
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.1em', marginTop: '0.5rem' }}>SYSTEM CONVERSION ACCURACY</div>
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginTop: '2rem', overflow: 'hidden' }}>
                            <div style={{ width: `${globalStats.total > 0 ? (globalStats.interested / globalStats.total) * 100 : 0}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #10b981)', borderRadius: '10px' }}></div>
                        </div>
                    </div>
                </div>

                <div className="premium-glass" style={{ padding: '2rem', borderRadius: '24px' }}>
                    <h3 style={{ margin: '0 0 1.5rem', fontWeight: 800, fontSize: '1rem', color: '#94a3b8' }}>Live Neural Ingress Stream</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'left' }}>
                                    <th style={{ padding: '0.75rem 0', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>LEAD UNIT</th>
                                    <th style={{ padding: '0.75rem 0', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>SOURCE NODE</th>
                                    <th style={{ padding: '0.75rem 0', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>INTENT CODE</th>
                                    <th style={{ padding: '0.75rem 0', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>INGEST DATE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {intel.recentLeads && intel.recentLeads.length > 0 ? (
                                  intel.recentLeads.map(lead => (
                                    <tr key={lead.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                        <td style={{ padding: '1rem 0', fontWeight: 700, fontSize: '0.875rem' }}>{lead.student_name}</td>
                                        <td style={{ padding: '1rem 0', fontSize: '0.8125rem', color: '#94a3b8' }}>{lead.colleges?.name}</td>
                                        <td style={{ padding: '1rem 0' }}>
                                            <span style={{ 
                                                padding: '0.2rem 0.6rem', 
                                                borderRadius: '6px', 
                                                background: (lead.intent || '').toLowerCase().includes('high') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)',
                                                color: (lead.intent || '').toLowerCase().includes('high') ? '#10b981' : '#94a3b8',
                                                fontSize: '0.65rem',
                                                fontWeight: 800
                                            }}>{lead.intent || 'PENDING'}</span>
                                        </td>
                                        <td style={{ padding: '1rem 0', fontSize: '0.75rem', color: '#64748b' }}>{new Date(lead.created_at).toLocaleDateString()}</td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Awaiting network traffic...</td>
                                  </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'upload' && (
          <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="premium-glass" style={{ padding: '3rem', borderRadius: '32px' }}>
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{ width: '80px', height: '80px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <UploadCloud size={40} color="#3b82f6" />
                </div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>Lead Ingestion Engine</h2>
                <p style={{ color: '#94a3b8' }}>Import high-volume lead data directly into the neural network.</p>
              </div>

              <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <label style={labelStyle}>Target Organization / Node</label>
                  <select
                    value={selectedCollege}
                    onChange={(e) => setSelectedCollege(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="" disabled style={{ background: '#020617' }}>Select destination node...</option>
                    {colleges.map(c => (
                      <option key={c.id} value={c.id} style={{ background: '#020617' }}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div 
                  style={{ 
                    border: '2px dashed rgba(255,255,255,0.1)', 
                    borderRadius: '20px', 
                    padding: '3rem', 
                    textAlign: 'center',
                    background: file ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.01)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <input
                    type="file"
                    id="file-upload"
                    onChange={(e) => setFile(e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                    {file ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <CheckCircle2 size={48} color="#10b981" />
                        <div>
                          <p style={{ margin: 0, fontWeight: 800 }}>{file.name}</p>
                          <p style={{ margin: 0, fontSize: '0.8125rem', color: '#64748b' }}>{(file.size / 1024).toFixed(2)} KB Ready</p>
                        </div>
                      </div>
                    ) : (
                      <div style={{ color: '#64748b' }}>
                        <Plus size={32} style={{ margin: '0 auto 1rem' }} />
                        <p style={{ fontWeight: 700 }}>Choose CSV/Excel File</p>
                        <p style={{ fontSize: '0.8125rem' }}>or drag and drop here</p>
                      </div>
                    )}
                  </label>
                </div>

                <Button type="submit" loading={uploading} fullWidth style={{ padding: '1.25rem', borderRadius: '16px', fontWeight: 900 }}>
                  Initialize Ingestion Sequence
                </Button>
              </form>
            </div>
          </div>
        )}


        {activeTab === 'audit' && (
          <div className="premium-glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
            <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem' }}>Security Logs</h2>
                <p style={{ color: '#94a3b8', margin: 0 }}>Full history of administrative actions and system events</p>
              </div>
              <Button variant="secondary" onClick={fetchAuditLogs} disabled={loading}>
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              </Button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <th style={tableHeaderStyle}>Timestamp</th>
                    <th style={tableHeaderStyle}>Protocol</th>
                    <th style={tableHeaderStyle}>Resource</th>
                    <th style={tableHeaderStyle}>Detail Trace</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.length > 0 ? auditLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }} className="hover-row">
                      <td style={tableCellStyle}>{new Date(log.created_at).toLocaleString()}</td>
                      <td style={tableCellStyle}>
                        <span style={{ 
                          padding: '0.25rem 0.6rem', 
                          borderRadius: '8px', 
                          fontSize: '0.75rem', 
                          fontWeight: 800,
                          background: log.action.includes('Delete') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                          color: log.action.includes('Delete') ? '#ef4444' : '#3b82f6'
                        }}>
                          {log.action}
                        </span>
                      </td>
                      <td style={tableCellStyle}>{log.table_name || 'SYSTEM'}</td>
                      <td style={{ ...tableCellStyle, color: '#64748b', fontSize: '0.8125rem' }}>{JSON.stringify(log.details || {})}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
                        No security logs detected. System is silent.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'colleges' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Global Business Network</h2>
              <Button onClick={() => setShowModal(true)} style={{ borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={18} /> Add New Organization
              </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {colleges.map((college) => (
                <div key={college.id} className="premium-glass" style={{ padding: '2rem', borderRadius: '24px', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
                      <Globe size={24} color="#3b82f6" />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontWeight: 800 }}>{college.name}</h4>
                      <p style={{ margin: 0, fontSize: '0.8125rem', color: '#64748b' }}>{college.email}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800 }}>NODE ACTIVE</div>
                    <Button variant="secondary" onClick={() => navigate(`/admin/colleges/${college.id}`)}>
                      Manage Node <ChevronRight size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="premium-glass" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <Input
                  placeholder="Search across the entire global lead network (Name, Phone, Email)..."
                  value={globalSearchQuery}
                  onChange={(e) => setGlobalSearchQuery(e.target.value)}
                  style={{ marginBottom: 0 }}
                />
              </div>
              <div style={{ width: '200px' }}>
                <select
                  value={globalSearchDate}
                  onChange={(e) => setGlobalSearchDate(e.target.value)}
                  className="premium-glass"
                  style={{ 
                    width: '100%',
                    padding: '0.75rem 1rem', 
                    borderRadius: '12px', 
                    border: '1px solid rgba(59, 130, 246, 0.3)', 
                    background: 'rgba(15, 23, 42, 0.6)',
                    color: '#fff',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">All Time Signals</option>
                  <option value="today">Today's Pulses</option>
                  <option value="yesterday">Yesterday's History</option>
                  <option value="last7days">Last 7 Days</option>
                </select>
              </div>
              <Button onClick={handleGlobalSearch} loading={loading} style={{ borderRadius: '14px', minWidth: '160px', height: '48px' }}>
                Search Signal
              </Button>
            </div>

            {globalSearchLeads.length > 0 && (
              <div className="premium-glass" style={{ borderRadius: '24px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <th style={tableHeaderStyle}>Subject</th>
                      <th style={tableHeaderStyle}>Phone / Signal</th>
                      <th style={tableHeaderStyle}>Email</th>
                      <th style={tableHeaderStyle}>Source Node</th>
                      <th style={tableHeaderStyle}>Intel</th>
                      <th style={tableHeaderStyle}>Intent Trace</th>
                      <th style={tableHeaderStyle}>Duration</th>
                      <th style={tableHeaderStyle}>Ingestion Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {globalSearchLeads.map((lead) => (
                      <tr key={lead.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                        <td style={tableCellStyle}>
                          <div style={{ fontWeight: 800 }}>{lead.student_name}</div>
                        </td>
                        <td style={tableCellStyle}>{lead.phone || 'No Signal'}</td>
                        <td style={tableCellStyle}>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{lead.email || '-'}</div>
                        </td>
                        <td style={tableCellStyle}>
                          <span 
                            style={{ fontSize: '0.75rem', fontWeight: 800, color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline' }} 
                            onClick={() => navigate(`/admin/colleges/${lead.college_id}`)}
                          >
                            {lead.colleges?.name}
                          </span>
                        </td>
                        <td style={tableCellStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <div style={{ width: '4px', height: '12px', borderRadius: '2px', background: (lead.ai_score || 0) > 70 ? '#10b981' : '#3b82f6' }}></div>
                            <span style={{ fontWeight: 800, color: (lead.ai_score || 0) > 70 ? '#10b981' : '#fff' }}>{lead.ai_score || 0}%</span>
                          </div>
                        </td>
                        <td style={tableCellStyle}>
                          <span style={{ 
                            padding: '0.25rem 0.6rem', 
                            borderRadius: '8px', 
                            fontSize: '0.75rem', 
                            fontWeight: 800,
                            background: lead.intent?.toLowerCase().includes('high') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                            color: lead.intent?.toLowerCase().includes('high') ? '#10b981' : '#94a3b8'
                          }}>
                            {lead.intent}
                          </span>
                        </td>
                        <td style={tableCellStyle}>
                          <div style={{ fontSize: '0.75rem' }}>{lead.duration || '00s'}</div>
                        </td>
                        <td style={tableCellStyle}>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(lead.created_at).toLocaleDateString()}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
            <div className="premium-glass" style={{ padding: '3rem', borderRadius: '32px', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Trash2 size={40} color="#ef4444" />
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>Data Purge Protocol</h2>
              <p style={{ color: '#94a3b8', marginBottom: '2.5rem' }}>Permanently remove leads based on ingestion date milestones.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
                <div>
                  <label style={labelStyle}>Target Data Node</label>
                  <select
                    value={purgeCollege}
                    onChange={(e) => setPurgeCollege(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="all" style={{ background: '#020617' }}>Global Network (All Nodes)</option>
                    {colleges.map(c => (
                      <option key={c.id} value={c.id} style={{ background: '#020617' }}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <Button 
                    variant={purgeDate === 'today' ? 'primary' : 'secondary'} 
                    onClick={() => setPurgeDate('today')}
                    style={{ borderRadius: '14px' }}
                  >
                    Purge Today's Data
                  </Button>
                  <Button 
                    variant={purgeDate === 'tomorrow' ? 'primary' : 'secondary'} 
                    onClick={() => setPurgeDate('tomorrow')}
                    style={{ borderRadius: '14px' }}
                  >
                    Purge Projected Data
                  </Button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                  <Button 
                    onClick={() => handlePurge()} 
                    loading={purging} 
                    style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1rem', borderRadius: '16px', fontWeight: 900 }}
                  >
                    PURGE ONLY
                  </Button>
                  <Button 
                    onClick={handleReplaceInitiate} 
                    loading={replacing} 
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', padding: '1rem', borderRadius: '16px', fontWeight: 900 }}
                  >
                    PURGE & REPLACE
                  </Button>
                </div>

                <input 
                  type="file" 
                  id="replace-upload" 
                  onChange={handleReplaceFinalize} 
                  style={{ display: 'none' }} 
                />
                
                <p style={{ fontSize: '0.75rem', color: '#ef4444', textAlign: 'center', fontWeight: 700 }}>⚠️ WARNING: PURGE ACTIONS ARE IRREVERSIBLE</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 250px)' }}>
            {/* College Selector Sidebar */}
            <div className="premium-glass" style={{ width: '300px', borderRadius: '24px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#3b82f6', letterSpacing: '0.1em', marginBottom: '1rem' }}>ACTIVE NODES</div>
              {colleges.map(college => (
                <div 
                  key={college.id} 
                  onClick={() => setSelectedChatCollege(college)}
                  className="hover-row"
                  style={{ 
                    padding: '1rem', 
                    borderRadius: '16px', 
                    cursor: 'pointer',
                    background: selectedChatCollege?.id === college.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    border: selectedChatCollege?.id === college.id ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid transparent'
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '0.9375rem' }}>{college.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{college.sector || 'Global Education'}</div>
                </div>
              ))}
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {!selectedChatCollege ? (
                    <div className="premium-glass" style={{ flex: 1, borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ padding: '2rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '50%' }}>
                            <MessageSquare size={48} color="#3b82f6" />
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>Select a Node to begin Neural Link</div>
                    </div>
                ) : (
                    <>
                        <div className="premium-glass" style={{ flex: 1, borderRadius: '24px 24px 0 0', padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.5rem' }}>{selectedChatCollege.name}</h3>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>Secure support channel established</p>
                                </div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <div 
                                      onClick={handleStartCall}
                                      style={{ 
                                        padding: '0.6rem', 
                                        background: 'rgba(59, 130, 246, 0.1)', 
                                        borderRadius: '10px', 
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        color: '#3b82f6',
                                        border: '1px solid rgba(59, 130, 246, 0.2)'
                                      }}
                                    >
                                        <Phone size={14} /> Neural Audio Bridge
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Activity size={12} /> SIGNAL ACTIVE
                                    </div>
                                </div>
                            </div>

                            {chatLoading ? (
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LoadingSpinner size="lg" /></div>
                            ) : (
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {[...messages].sort((a,b) => new Date(a.created_at) - new Date(b.created_at)).map((msg) => (
                                        <div key={msg.id} style={{ 
                                            alignSelf: msg.sender_role === 'ADMIN' ? 'flex-end' : 'flex-start',
                                            maxWidth: '70%',
                                            background: msg.sender_role === 'ADMIN' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.05)',
                                            padding: '1.25rem',
                                            borderRadius: msg.sender_role === 'ADMIN' ? '20px 20px 0 20px' : '20px 20px 20px 0',
                                            border: msg.sender_role === 'ADMIN' ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(255,255,255,0.05)'
                                        }}>
                                            <div style={{ fontSize: '0.7rem', fontWeight: 900, color: msg.sender_role === 'ADMIN' ? '#3b82f6' : '#94a3b8', marginBottom: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
                                                <span>{msg.sender_role === 'ADMIN' ? 'YOU (SYTEM ADMIN)' : 'NODE ANALYST'}</span>
                                                {msg.is_issue && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span style={{ 
                                                            padding: '0.2rem 0.5rem', 
                                                            borderRadius: '6px', 
                                                            background: msg.issue_status === 'Solved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                            color: msg.issue_status === 'Solved' ? '#10b981' : '#ef4444'
                                                        }}>
                                                            ISSUE: {msg.issue_status}
                                                        </span>
                                                        {msg.issue_status === 'Open' && (
                                                            <Button onClick={() => handleResolveIssue(msg.id)} style={{ padding: '0.2rem 0.5rem', fontSize: '0.6rem', border: 'none' }}>RESOLVE</Button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ fontSize: '1rem', lineHeight: 1.6 }}>{msg.message}</div>
                                            <div style={{ fontSize: '0.65rem', color: '#475569', marginTop: '0.6rem', textAlign: 'right', fontWeight: 600 }}>
                                                {new Date(msg.created_at).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSendMessage} className="premium-glass" style={{ borderRadius: '0 0 24px 24px', padding: '1.5rem', borderTop: 'none', background: 'rgba(15, 23, 42, 0.9)' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <Input
                                        placeholder={`Message ${selectedChatCollege.name}...`}
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        style={{ marginBottom: 0 }}
                                    />
                                </div>
                                <Button type="submit" style={{ borderRadius: '14px', minWidth: '100px' }}>Transmit</Button>
                            </div>
                        </form>
                    </>
                )}
            </div>
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className="premium-glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
            <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem' }}>Platform Inquiries</h2>
                <p style={{ color: '#94a3b8', margin: 0 }}>Incoming business signals from the Landing Page neural gateway</p>
              </div>
              <Button onClick={handleInjectSampleInquiries} loading={loading} variant="secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '12px' }}>
                <Zap size={16} /> Simulate Signal Arrival
              </Button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <th style={tableHeaderStyle}>Organization</th>
                    <th style={tableHeaderStyle}>Sector</th>
                    <th style={tableHeaderStyle}>Contact Signal</th>
                    <th style={tableHeaderStyle}>Status</th>
                    <th style={tableHeaderStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.length > 0 ? inquiries.map((inquiry) => (
                    <tr key={inquiry.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <td style={tableCellStyle}>
                        <div style={{ fontWeight: 800 }}>{inquiry.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{inquiry.email}</div>
                      </td>
                      <td style={tableCellStyle}>
                        <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                          {inquiry.industry || 'General'}
                        </span>
                      </td>
                      <td style={tableCellStyle}>{inquiry.phone}</td>
                      <td style={tableCellStyle}>
                        <span style={{ 
                          padding: '0.25rem 0.6rem', 
                          borderRadius: '8px', 
                          fontSize: '0.75rem', 
                          fontWeight: 800,
                          background: inquiry.status === 'New' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                          color: inquiry.status === 'New' ? '#f59e0b' : '#10b981'
                        }}>
                          {inquiry.status}
                        </span>
                      </td>
                      <td style={tableCellStyle}>
                        <select
                          value={inquiry.status}
                          onChange={(e) => handleUpdateInquiryStatus(inquiry.id, e.target.value)}
                          style={{ ...inputStyle, padding: '0.5rem', width: 'auto', fontSize: '0.75rem' }}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Qualified">Qualified</option>
                        </select>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
                        No inbound inquiries detected yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Initialize New Network Node"
      >
        <form onSubmit={handleCreateCollege} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ padding: '1.25rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.1)', marginBottom: '0.5rem' }}>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Enter the organization's identity credentials to deploy a new data node. This entity will receive its own isolated sub-command center.
            </p>
          </div>
          
          <Input
            label="Organization Legal Name"
            value={newCollege.name}
            onChange={(e) => setNewCollege({ ...newCollege, name: e.target.value })}
            placeholder="e.g. Stanford Medical"
            required
          />
          <Input
            label="Administrative Email Signal"
            type="email"
            value={newCollege.email}
            onChange={(e) => setNewCollege({ ...newCollege, email: e.target.value })}
            placeholder="admin@organization.com"
            required
          />
          <Input
            label="Temporary Access Password"
            type="password"
            value={newCollege.password}
            onChange={(e) => setNewCollege({ ...newCollege, password: e.target.value })}
            placeholder="••••••••"
            required
          />

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <Button type="submit" loading={loading} fullWidth style={{ borderRadius: '14px', padding: '1rem' }}>
              Mobilize Organization
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)} fullWidth style={{ borderRadius: '14px', padding: '1rem' }}>
              Abort
            </Button>
          </div>
        </form>
      </Modal>

      {/* Neural Audio Bridge Modal */}
      <Modal
        isOpen={isCalling}
        onClose={() => setIsCalling(false)}
        title={`Neural Audio Bridge: ${selectedChatCollege?.name}`}
        size="full"
      >
        <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.1)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: '#3b82f6', borderRadius: '50%' }}>
                <Activity size={20} color="white" />
            </div>
            <div>
                <div style={{ fontWeight: 900, fontSize: '0.875rem' }}>Secure Frequency Established</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>All neural data streams are encrypted p2p.</div>
            </div>
        </div>

        <div style={{ width: '100%', height: '75vh', borderRadius: '32px', overflow: 'hidden', background: '#000', border: '1px solid var(--border)' }}>
            {isCalling && (
              <iframe
                src={`https://meet.jit.si/dialsmart-support-${selectedChatCollege?.id}`}
                allow="camera; microphone; fullscreen; display-capture; autoplay"
                style={{ width: '100%', height: '100%', border: 'none' }}
              ></iframe>
            )}
        </div>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Button onClick={() => setIsCalling(false)} variant="secondary" style={{ borderRadius: '14px', padding: '0.75rem 2rem' }}>
                Terminate Frequency
            </Button>
        </div>
      </Modal>

      <style dangerouslySetInnerHTML={{ __html: `
        .dashboard-layout { display: flex; height: 100vh; overflow: hidden; }
        .hover-row:hover { background: rgba(255,255,255,0.02); }
        .hero-gradient-text { background: linear-gradient(135deg, #fff 0%, #94a3b8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        @media (min-width: 1025px) {
          .dashboard-main { margin-left: 280px; }
          .mobile-only { display: none !important; }
        }
      `}} />
      </main>
    </div>
  );
}

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '0.75rem',
  fontSize: '0.8125rem',
  fontWeight: 800,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const inputStyle = {
  width: '100%',
  padding: '1.125rem 1.25rem',
  background: 'rgba(0, 0, 0, 0.4)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  color: '#fff',
  outline: 'none',
  fontSize: '0.9375rem',
  transition: 'all 0.3s ease',
  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
};

const statLabelStyle = {
  color: '#94a3b8',
  fontSize: '0.75rem',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: '0.75rem'
};


const statValueStyle = {
  fontSize: '2.5rem',
  fontWeight: 900,
  letterSpacing: '-0.04em',
  color: '#fff'
};

const sectionTitleStyle = {
  fontSize: '1.125rem',
  fontWeight: 800,
  margin: 0,
  color: '#f1f5f9'
};

const tableHeaderStyle = {
  padding: '1.25rem 1.5rem',
  textAlign: 'left',
  fontSize: '0.75rem',
  fontWeight: 800,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const tableCellStyle = {
  padding: '1.25rem 1.5rem',
  fontSize: '0.875rem',
  color: '#f1f5f9',
  fontWeight: 500
};
