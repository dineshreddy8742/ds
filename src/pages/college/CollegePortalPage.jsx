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
  BrainCircuit,
  Globe,
  ShieldCheck
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

const STATUS_OPTIONS = [
  { value: 'New', label: 'New', color: '#3b82f6' },
  { value: 'Contacted', label: 'Contacted', color: '#8b5cf6' },
  { value: 'Interested', label: 'Interested', color: '#10b981' },
  { value: 'Not Interested', label: 'Not Interested', color: '#ef4444' },
  { value: 'Enrolled', label: 'Enrolled', color: '#059669' }
];

export default function CollegePortalPage() {
  const { user, signOut, userRole, collegeName, industry, credits } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
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

      XLSX.writeFile(workbook, `dailsmart-intelligence-${new Date().toISOString().split('T')[0]}.xlsx`);
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

      XLSX.writeFile(workbook, `DAILSMART-HIGH-INTENT-${new Date().toISOString().split('T')[0]}.xlsx`);
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

  const isPolitical = (industry || '').toLowerCase().includes('govern') || (industry || '').toLowerCase().includes('polit');
  const isRealEstate = (industry || '').toLowerCase().includes('estate') || (industry || '').toLowerCase().includes('real');

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    isPolitical && { id: 'civic', label: 'Civic Pulse', icon: <Globe size={20} /> },
    { 
      id: 'leads', 
      label: isPolitical ? 'Constituent Hub' : (isRealEstate ? 'Property Interest' : 'Lead Pipeline'), 
      icon: <Filter size={20} /> 
    },
    { id: 'support', label: isPolitical ? 'Grievance Pulse' : 'Neural Link Hub', icon: <MessageSquare size={20} /> },
    { id: 'followups', label: 'Follow-ups', icon: <Calendar size={20} /> },
    { id: 'profile', label: 'Settings', icon: <User size={20} /> },
  ].filter(Boolean);

  return (
    <div className="responsive-container dashboard-container" style={{ minHeight: '100vh', color: 'var(--text-main)', background: 'var(--bg-main)' }}>
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
          <Bot size={20} color="var(--accent)" />
          <span>Dailsmart <span style={{ color: 'var(--accent)' }}>AI</span></span>
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
            <Bot size={20} color="white" />
          </div>
          Dailsmart <span style={{ color: 'var(--accent)' }}>AI</span>
        </div>}
        navItems={navItems}
        activeItem={activeTab}
        onNavClick={(id) => {
          if (id === 'profile') navigate('/profile');
          else setActiveTab(id);
          setIsSidebarOpen(false);
        }}
        onLogout={handleLogout}
        userBadge={{ 
          label: isPolitical ? 'POLITICAL ENTITY' : (isRealEstate ? 'ESTATE NODE' : 'ORGANIZATION'), 
          value: collegeName || 'General Client' 
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main className="dashboard-main" style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', zIndex: 1, marginTop: 'max(0px, 60px)' }}>
        <header className="stellar-header">
          <div>
            <h1 className="shimmer-text" style={{ fontWeight: 900, margin: '0 0 0.5rem', letterSpacing: '-0.04em' }}>
              Welcome Back, Counselor
            </h1>
            <p style={{ color: 'var(--text-muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <Clock size={16} color="var(--accent)" /> Neural sync active • {new Date().toLocaleTimeString()}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button 
              onClick={exportInterestedLeads} 
              disabled={isExporting}
              className="btn-genz"
              style={{ background: 'linear-gradient(135deg, var(--success), #059669)', border: 'none', color: 'white' }}
            >
              {isExporting ? <RefreshCw size={18} className="animate-spin" /> : <Zap size={18} />}
              {isExporting ? 'Processing...' : 'Export Interested'}
            </Button>
            <Button 
              onClick={exportToExcel} 
              variant="secondary" 
              disabled={isExporting}
              style={{ borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', fontWeight: 800 }}
            >
              {isExporting ? <RefreshCw size={18} className="animate-spin" /> : <Download size={18} />}
              {isExporting ? 'Processing...' : 'All Records'}
            </Button>
          </div>
        </header>

        {activeTab === 'civic' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <h1 className="hero-gradient-text" style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Civic Pulse Hub</h1>
              <p className="text-muted" style={{ fontSize: '1.2rem', fontWeight: 600 }}>Constituent sentiment & grievance density across the region.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
              {/* Regional Support Distribution */}
              <div className="premium-glass" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                <h4 style={{ margin: '0 0 2rem', fontSize: '1.25rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Globe size={24} color="var(--accent)" /> Regional Grievance Density
                </h4>
                <div style={{ width: '100%', height: '400px' }}>
                  {isMounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={Object.entries(stats.by_district || { 'Chittoor': 140, 'Tirupati': 85, 'Madanapalle': 45 }).map(([name, value]) => ({ name, value }))}>
                        <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} fontWeight={700} />
                        <YAxis stroke="var(--text-muted)" fontSize={12} fontWeight={700} />
                        <Tooltip 
                          contentStyle={{ background: 'var(--panel-bg)', border: '1px solid var(--border)', borderRadius: '16px' }}
                        />
                        <Bar dataKey="value" fill="url(#civicUserGradient)" radius={[6, 6, 0, 0]} />
                        <defs>
                          <linearGradient id="civicUserGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--accent)" />
                            <stop offset="100%" stopColor="var(--accent-secondary)" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Citizen Mood Spectrum */}
              <div className="premium-glass" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                <h4 style={{ margin: '0 0 2rem', fontSize: '1.25rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <BrainCircuit size={24} color="#8b5cf6" /> Live Sentiment Pulse
                </h4>
                <div style={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center' }}>
                  {isMounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Satisfied', value: stats.interested || 10 },
                            { name: 'Neutral', value: Math.max(stats.total - stats.interested - stats.notInterested, 5) },
                            { name: 'Issues', value: stats.notInterested || 2 }
                          ]}
                          innerRadius={80}
                          outerRadius={120}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {[0,1,2].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#10b981', '#6366f1', '#ef4444'][index]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: 'var(--panel-bg)', borderRadius: '16px', border: '1px solid var(--border)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)' }}></div>
                      <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Supportive</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)' }}></div>
                      <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Evaluating</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 10px rgba(239, 68, 68, 0.4)' }}></div>
                      <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Anti / Gripes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="premium-glass" style={{ padding: '2.5rem', borderRadius: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '1.5rem' }}>District Problem Breakdown</h3>
                <div className="scroll-container">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--glass)', borderBottom: '1px solid var(--glass-border)' }}>
                                <th style={tableHeaderStyle}>Region / Node</th>
                                <th style={tableHeaderStyle}>Signal Strength</th>
                                <th style={tableHeaderStyle}>Primary Grievance</th>
                                <th style={tableHeaderStyle}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {['District 1', 'District 2', 'District 3'].map(d => (
                                <tr key={d} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                    <td style={tableCellStyle}>{d}</td>
                                    <td style={tableCellStyle}>{(Math.random()*100).toFixed(0)}%</td>
                                    <td style={tableCellStyle}>Infrastructure / Water</td>
                                    <td style={tableCellStyle}>
                                        <span style={{ padding: '0.2rem 0.6rem', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent)', fontSize: '0.7rem', fontWeight: 800 }}>ANALYZING</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <>
            {/* Call Analytics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              {/* TOTAL EXECUTION */}
              <div 
                className="premium-glass" 
                onClick={() => { setActiveTab('leads'); setStatusFilter(''); }}
                style={{ padding: '1.75rem', borderRadius: '24px', cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
              >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ padding: '0.6rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '14px' }}>
                      <Activity size={24} color="var(--accent)" />
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.1em' }}>
                      TOTAL EXECUTION
                    </div>
                  </div>
                <div style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.25rem' }}>{stats.total || 0}</div>
                <div style={{ fontSize: '0.875rem', color: "var(--text-muted)", fontWeight: 600 }}>
                    {isPolitical ? 'Network Engagements' : 'Total Voice Sessions'}
                </div>
              </div>

              {/* SUCCESS SIGNAL / INTERESTED */}
              <div 
                className="premium-glass" 
                onClick={() => { setActiveTab('leads'); setStatusFilter('Interested'); }}
                style={{ padding: '1.75rem', borderRadius: '24px', overflow: 'hidden', cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--success)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
              >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div style={{ padding: '0.6rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '14px' }}>
                      <ThumbsUp size={24} color="var(--success)" />
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--success)', letterSpacing: '0.05em' }}>
                      SUCCESS SIGNAL
                    </div>
                  </div>
                <div style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>{stats.interested || 0}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${Math.min(Math.round((stats.interested / Math.max(stats.total, 1)) * 100), 100)}%`, 
                      height: '100%', 
                      background: 'var(--success)',
                      boxShadow: '0 0 10px var(--success)'
                    }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--success)' }}>
                    {Math.round((stats.interested / Math.max(stats.total, 1)) * 100)}%
                  </span>
                </div>
              </div>

              {/* NO INTEREST */}
              <div 
                className="premium-glass" 
                onClick={() => { setActiveTab('leads'); setStatusFilter('Not Interested'); }}
                style={{ padding: '1.75rem', borderRadius: '24px', overflow: 'hidden', cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--danger)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
              >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div style={{ padding: '0.6rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '14px' }}>
                      <ThumbsDown size={24} color="var(--danger)" />
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--danger)', letterSpacing: '0.05em' }}>
                      NO INTEREST
                    </div>
                  </div>
                <div style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>{stats.notInterested || 0}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${Math.min(Math.round((stats.notInterested / Math.max(stats.total, 1)) * 100), 100)}%`, 
                      height: '100%', 
                      background: 'var(--danger)',
                      boxShadow: '0 0 10px var(--danger)'
                    }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--danger)' }}>
                    {Math.round((stats.notInterested / Math.max(stats.total, 1)) * 100)}%
                  </span>
                </div>
              </div>

              {/* CONVERSION INDEX */}
              <div 
                className="premium-glass" 
                onClick={() => { setActiveTab('leads'); setStatusFilter(''); setDateFilter('today'); }}
                style={{ padding: '1.75rem', borderRadius: '24px', cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#8b5cf6'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
              >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div style={{ padding: '0.6rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '14px' }}>
                      <Target size={24} color="#8b5cf6" />
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8b5cf6', letterSpacing: '0.05em' }}>
                      CONVERSION INDEX
                    </div>
                  </div>
                <div style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                  {Math.round((stats.interested / Math.max(stats.total, 1)) * 100)}%
                </div>
                <div style={{ width: '100%', height: '30px' }}>
                  {isMounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[{v: 0}, {v: 40}, {v: 30}, {v: 80}, {v: 60}, {v: 100}]}>
                        <Area type="monotone" dataKey="v" stroke="#8b5cf6" fill="rgba(139, 92, 246, 0.2)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Visual Analytics Hub */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
              <div className="premium-glass" style={{ padding: '2rem', borderRadius: '24px' }}>
                <h4 style={{ margin: '0 0 2rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Activity size={20} color="var(--accent)" /> Daily Intelligence Flux
                </h4>
                <div style={{ width: '100%', height: '300px' }}>
                  {isMounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[{n: 'M', v: 45}, {n: 'T', v: 75}, {n: 'W', v: 35}, {n: 'T', v: 95}, {n: 'F', v: 120}]}>
                        <XAxis dataKey="n" hide />
                        <Tooltip contentStyle={{ background: 'var(--panel-bg)', border: 'none', borderRadius: '12px' }} />
                        <Bar dataKey="v" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                        <defs>
                          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--accent)" />
                            <stop offset="100%" stopColor="var(--accent-secondary)" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="premium-glass" style={{ padding: '2rem', borderRadius: '24px' }}>
                <h4 style={{ margin: '0 0 2rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <ShieldCheck size={20} color="var(--success)" /> Status Composition
                </h4>
                <div style={{ width: '100%', height: '300px' }}>
                  {isMounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Success', value: stats.interested || 45 },
                            { name: 'No Interest', value: stats.notInterested || 104 },
                            { name: 'Pending', value: 151 }
                          ]}
                          innerRadius={70}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="var(--success)" />
                          <Cell fill="var(--danger)" />
                          <Cell fill="var(--accent)" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Civic & Political Intelligence Overlay (Dynamic) */}
            {(industry === 'Government / Political' || stats.by_district && Object.keys(stats.by_district).length > 0) && (
              <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '3rem' }}>
                <h3 className="hero-gradient-text" style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Globe size={28} color="var(--accent)" /> Regional Civic Intelligence
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                  {/* District & Village Comparative Analysis */}
                  <div className="premium-glass" style={{ padding: '2rem', borderRadius: '24px' }}>
                    <h4 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Activity size={20} color="var(--accent)" /> Detailed {isPolitical ? 'Problem' : 'Interest'} Heatmap (By Area)
                    </h4>
                    <div style={{ width: '100%', height: '350px' }}>
                      {isMounted && (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={Object.entries(stats.geographical || { 'Chittoor': 45, 'Tirupati': 65, 'Srikalahasthi': 30, 'Pileru': 80, 'Nagari': 55 }).map(([name, value]) => ({ 
                            name, 
                            interested: value,
                            notInterested: Math.floor(value * 0.4)
                          }))}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} fontWeight={700} axisLine={false} tickLine={false} />
                            <YAxis stroke="var(--text-muted)" fontSize={11} fontWeight={700} axisLine={false} tickLine={false} />
                            <Tooltip 
                              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                              contentStyle={{ background: 'var(--panel-bg)', border: '1px solid var(--border)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                              itemStyle={{ fontWeight: 800 }}
                            />
                            <Bar dataKey="interested" name={isPolitical ? 'Supporters' : 'Interested'} fill="var(--success)" radius={[6, 6, 0, 0]} barSize={20} />
                            <Bar dataKey="notInterested" name={isPolitical ? 'Grievances' : 'Not Interested'} fill="var(--danger)" radius={[6, 6, 0, 0]} barSize={20} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
                            <span style={{ color: 'var(--success)', fontWeight: 900 }}>GREEN:</span> {isPolitical ? 'High Vote Probability' : 'High Admission Intent'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
                            <span style={{ color: 'var(--danger)', fontWeight: 900 }}>RED:</span> {isPolitical ? 'Problem Sector / Low Trust' : 'Cold Lead / No Interest'}
                        </div>
                    </div>
                  </div>

                  {/* Sentiment Mood Spectrum */}
                  <div className="premium-glass" style={{ padding: '2rem', borderRadius: '24px' }}>
                    <h4 style={{ margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <BrainCircuit size={18} color="#8b5cf6" /> Resident Sentiment Spectrum
                    </h4>
                    <div style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center' }}>
                      {isMounted && (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Positive', value: stats.by_sentiment?.positive || 0, color: '#10b981' },
                                { name: 'Neutral', value: stats.by_sentiment?.neutral || 1, color: '#6366f1' },
                                { name: 'Negative', value: stats.by_sentiment?.negative || 0, color: '#ef4444' }
                              ]}
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {[0,1,2].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={['#10b981', '#6366f1', '#ef4444'][index]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ background: 'var(--panel-bg)', border: '1px solid var(--border)', borderRadius: '12px' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                      <div style={{ paddingLeft: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                           <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#10b981' }}></div>
                           <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Positive</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                           <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#6366f1' }}></div>
                           <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Neutral</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                           <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#ef4444' }}></div>
                           <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Negative</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
              <div className="scroll-container">
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
                src={`https://meet.jit.si/dailsmart-support-${collegeId}`}
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
          .dashboard-main { 
            margin-left: ${isSidebarCollapsed ? '80px' : '280px'}; 
            transition: margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .mobile-only { display: none !important; }
        }
        @media (max-width: 1024px) {
          .dashboard-main { margin-left: 0 !important; padding-top: 80px !important; }
          .hero-gradient-text { font-size: 2rem !important; }
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
