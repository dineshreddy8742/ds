import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Key,
  Lock,
  Menu,
  Globe,
  Database,
  ArrowLeft,
  RefreshCw,
  Zap,
  Trash2,
  Settings,
  Shield,
  Search,
  TrendingUp,
  Users,
  LayoutDashboard,
  CheckCircle2,
  Clock,
  Phone,
  Bot,
  Filter,
  PhoneCall
} from 'lucide-react';
import { leadsAPI, collegesAPI } from '../../services/api';
import { Sidebar } from '../../components/layout/Sidebar';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

export default function CollegeManagementPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [college, setCollege] = useState(null);
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ total: 0, interested: 0, pending: 0, reached: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Settings modal state
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [saving, setSaving] = useState(false);
  
  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // Lead inline edit state
  const [editingLeadId, setEditingLeadId] = useState(null);
  const [editedStatus, setEditedStatus] = useState('');
  const [editedIntent, setEditedIntent] = useState('');
  const [updatingLead, setUpdatingLead] = useState(false);

  // Password reset state
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [statusFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { college_id: id, limit: 1000 };
      if (statusFilter) {
        params.status = statusFilter;
      }

      const [collegeData, leadsData, statsData] = await Promise.all([
        collegesAPI.getById(id),
        leadsAPI.getAll(params),
        leadsAPI.getStats(id)
      ]);
      setCollege(collegeData);
      setLeads(leadsData.data || []);

      // Calculate specific stats for this node
      const statusCounts = statsData.by_status || {};
      
      // Calculate total reached (anyone who has had a response/attempt)
      const nonReachedStatuses = ['New', 'Not Received', 'Unknown'];
      const totalCount = statsData.total || leadsData.total || 0;
      const reachedCount = Object.entries(statusCounts).reduce((acc, [status, count]) => {
        return !nonReachedStatuses.includes(status) ? acc + count : acc;
      }, 0);

      setStats({
        total: totalCount,
        interested: statusCounts['Interested'] || statusCounts['interested'] || 0,
        pending: statusCounts['New'] || 0,
        reached: reachedCount,
        accuracy: leadsData.data?.length > 0 
          ? (leadsData.data.reduce((acc, l) => acc + (Number(l.ai_score) || 0), 0) / leadsData.data.length).toFixed(1) + '%'
          : '0%'
      });
      
      // Populate edit form fields
      setEditName(collegeData.name || '');
      setEditEmail(collegeData.email || '');
    } catch (error) {
      toast.error('Failed to calibrate node data');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleOpenSettings = () => {
    setEditName(college?.name || '');
    setEditEmail(college?.email || '');
    setShowSettingsModal(true);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error('Organization name is required');
      return;
    }
    
    setSaving(true);
    try {
      await collegesAPI.update(id, {
        name: editName.trim(),
        email: editEmail.trim()
      });
      toast.success('Organization settings updated successfully');
      setShowSettingsModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOrganization = async () => {
    setDeleting(true);
    try {
      await collegesAPI.delete(id);
      toast.success('Organization and all associated data deleted permanently');
      setShowDeleteModal(false);
      navigate('/admin');
    } catch (error) {
      toast.error(error.message || 'Failed to delete organization');
    } finally {
      setDeleting(false);
    }
  };

  const handleStartEdit = (lead) => {
    setEditingLeadId(lead.id);
    setEditedStatus(lead.status || 'New');
    setEditedIntent(lead.intent || 'Pending');
  };

  const handleCancelEdit = () => {
    setEditingLeadId(null);
    setEditedStatus('');
    setEditedIntent('');
  };

  const handleSaveLead = async (leadId) => {
    setUpdatingLead(true);
    try {
      await leadsAPI.update(leadId, {
        status: editedStatus,
        intent: editedIntent
      });
      toast.success('Lead verification updated');
      setEditingLeadId(null);
      fetchData(); // Refresh stats and list
    } catch (error) {
      toast.error('Failed to update lead verification');
    } finally {
      setUpdatingLead(false);
    }
  };

  const handleManualPasswordReset = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setResetting(true);
    try {
      await collegesAPI.resetPassword(id, newPassword);
      toast.success('Organization credentials recalibrated successfully');
      setNewPassword('');
      setShowPasswordReset(false);
    } catch (error) {
      toast.error(error.message || 'Failed to recalibrate credentials');
    } finally {
      setResetting(false);
    }
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'Interested': '#10b981',
      'Not Interested': '#ef4444',
      'New': '#3b82f6',
      'Contacted': '#8b5cf6',
      'Enrolled': '#059669',
      'Not Received': '#64748b'
    };
    return statusMap[status] || '#71717a';
  };

  const navItems = [
    { id: 'back', label: 'Admin Center', icon: <ArrowLeft size={20} />, onClick: () => navigate('/admin') },
    { id: 'details', label: 'Node Details', icon: <Database size={20} /> }
  ];

  if (loading) return <div className="cosmic-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={48} className="animate-pulse" color="#3b82f6" /></div>;

  return (
    <div className="cosmic-bg responsive-container" style={{ minHeight: '100vh', color: 'var(--text-main)', display: 'flex' }}>
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
          <Globe size={20} color="var(--accent)" />
          <span>Node<span style={{ color: 'var(--accent)' }}>.Manager</span></span>
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
            <Globe size={20} color="white" />
          </div>
          Node Manager
        </div>}
        navItems={navItems}
        activeItem="details"
        onNavClick={(id) => {
          if (id === 'back') navigate('/admin');
          setIsSidebarOpen(false);
        }}
        onLogout={handleLogout}
        userBadge={{ label: 'SYSTEM ADMIN', value: user?.email }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="dashboard-main" style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', marginTop: 'max(0px, 60px)' }}>
        <header style={{ marginBottom: '3rem' }}>
          <button 
            onClick={() => navigate('/admin')}
            style={{ background: 'transparent', border: 'none', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, cursor: 'pointer', marginBottom: '1.5rem', padding: 0 }}
          >
            <ArrowLeft size={18} /> BACK TO GLOBAL NETWORK
          </button>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <h1 className="shimmer-text" style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 900, margin: '0 0 0.5rem', letterSpacing: '-0.04em' }}>
                {college?.name}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Neural Node ID: <span style={{ color: 'var(--accent)' }}>{id.substring(0, 8)}...</span> | Sector: Global Education</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Button variant="secondary" onClick={fetchData} style={{ borderRadius: '14px' }}>
                Refresh Signal
              </Button>
              <Button 
                onClick={handleOpenSettings} 
                style={{ borderRadius: '14px', background: 'var(--accent)' }}
              >
                <Settings size={16} /> Node Settings
              </Button>
              <Button 
                variant="danger" 
                onClick={() => setShowDeleteModal(true)} 
                style={{ borderRadius: '14px' }}
              >
                <Trash2 size={16} /> Delete Organization
              </Button>
            </div>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <StatCard label="Total Leads" value={stats.total} icon={<Database size={20} color="var(--accent)" />} />
          <StatCard label="Total Reached" value={stats.reached} icon={<PhoneCall size={20} color="#8b5cf6" />} />
          <StatCard label="Success Events" value={stats.interested} icon={<TrendingUp size={20} color="var(--success)" />} />
          <StatCard label="Pending Signal" value={stats.pending} icon={<Filter size={20} color="#f59e0b" />} />
          <StatCard label="Lead Quality" value={stats.accuracy} icon={<ShieldCheck size={20} color="#8b5cf6" />} />
        </div>

        <div className="premium-glass" style={{ borderRadius: '32px', overflow: 'hidden' }}>
          <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.25rem' }}>Active Lead Pipeline</h3>
            <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '300px', flexWrap: 'wrap' }}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '0.75rem 1.25rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  minWidth: '200px'
                }}
              >
                <option value="" style={{ background: '#020617' }}>All Statuses</option>
                <option value="Interested" style={{ background: '#020617' }}>✓ Interested</option>
                <option value="Not Interested" style={{ background: '#020617' }}>✗ Not Interested</option>
                <option value="New" style={{ background: '#020617' }}>🆕 New</option>
                <option value="Contacted" style={{ background: '#020617' }}>📞 Contacted</option>
                <option value="Enrolled" style={{ background: '#020617' }}>✅ Enrolled</option>
                <option value="Not Received" style={{ background: '#020617' }}>❌ Not Received</option>
              </select>
              <Input
                placeholder="Search node leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginBottom: 0, flex: 1 }}
              />
            </div>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1200px' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <th style={tableHeaderStyle}>Name</th>
                  <th style={tableHeaderStyle}>Phone</th>
                  <th style={tableHeaderStyle}>Conversation</th>
                  <th style={tableHeaderStyle}>Duration</th>
                  <th style={tableHeaderStyle}>Score</th>
                  <th style={tableHeaderStyle}>Call Start Time</th>
                  <th style={tableHeaderStyle}>Status</th>
                  <th style={tableHeaderStyle}>Verify</th>
                </tr>
              </thead>
              <tbody>
                {leads.length > 0 ? leads.map((lead) => (
                  <tr key={lead.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }} className="hover-row">
                    <td style={tableCellStyle}>
                      <div style={{ fontWeight: 700 }}>{lead.student_name}</div>
                      {lead.email && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{lead.email}</div>}
                    </td>
                    <td style={tableCellStyle}>
                      <div style={{ fontFamily: 'monospace' }}>{lead.phone}</div>
                    </td>
                    <td style={{ ...tableCellStyle, maxWidth: '250px' }}>
                      <div style={{ 
                        fontSize: '0.8125rem', 
                        color: '#94a3b8',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }} title={lead.conversation || ''}>
                        {lead.conversation || '-'}
                      </div>
                    </td>
                    <td style={tableCellStyle}>
                      <div style={{ fontFamily: 'monospace', color: '#cbd5e1' }}>{lead.duration || '-'}</div>
                    </td>
                    <td style={tableCellStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '50px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                          <div style={{ 
                            width: `${lead.ai_score || 0}%`, 
                            height: '100%', 
                            background: (lead.ai_score || 0) > 70 ? '#10b981' : (lead.ai_score || 0) > 40 ? '#f59e0b' : '#ef4444',
                            borderRadius: '10px'
                          }} />
                        </div>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{lead.ai_score || 0}</span>
                      </div>
                    </td>
                    <td style={tableCellStyle}>
                      <div style={{ fontSize: '0.8125rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                        {lead.call_start_time || '-'}
                      </div>
                    </td>
                    <td style={tableCellStyle}>
                      {editingLeadId === lead.id ? (
                        <select
                          value={editedStatus}
                          onChange={(e) => setEditedStatus(e.target.value)}
                          style={{
                            padding: '0.4rem',
                            background: '#0f172a',
                            border: '1px solid rgba(59, 130, 246, 0.5)',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '0.75rem',
                            outline: 'none',
                            fontWeight: 800
                          }}
                        >
                          <option value="New">New</option>
                          <option value="Interested">Interested</option>
                          <option value="Not Interested">Not Interested</option>
                          <option value="Enrolled">Enrolled</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Not Received">Not Received</option>
                        </select>
                      ) : (
                        <span style={{
                          padding: '0.4rem 0.75rem',
                          borderRadius: '10px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          background: getStatusColor(lead.status) + '15',
                          color: getStatusColor(lead.status),
                          border: `1px solid ${getStatusColor(lead.status)}30`,
                          display: 'inline-block',
                          whiteSpace: 'nowrap'
                        }}>
                          {lead.status || 'New'}
                        </span>
                      )}
                    </td>
                    <td style={tableCellStyle}>
                      {editingLeadId === lead.id ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => handleSaveLead(lead.id)}
                            disabled={updatingLead}
                            style={{ background: 'rgba(16, 185, 129, 0.1)', border: 'none', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer', color: '#10b981' }}
                            title="Confirm Verification"
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            onClick={handleCancelEdit}
                            disabled={updatingLead}
                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer', color: '#ef4444' }}
                            title="Cancel"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleStartEdit(lead)}
                          style={{ background: 'rgba(59, 130, 246, 0.1)', border: 'none', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer', color: '#3b82f6' }}
                          title="Verify Lead Manually"
                        >
                          <Edit2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="8" style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
                      No leads found{statusFilter ? ` with status "${statusFilter}"` : ''}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Node Settings Modal */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Node Settings"
      >
        <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ padding: '1.25rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.1)', marginBottom: '0.5rem' }}>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Modify the organization's identity credentials. Changes will be reflected across all dashboards.
            </p>
          </div>

          <Input
            label="Organization Legal Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="e.g. Stanford Medical"
            required
          />
          <Input
            label="Administrative Email Signal"
            type="email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            placeholder="admin@organization.com"
            required
          />

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <Button type="submit" loading={saving} fullWidth style={{ borderRadius: '14px', padding: '1rem' }}>
              Save Changes
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowSettingsModal(false)} fullWidth style={{ borderRadius: '14px', padding: '1rem' }}>
              Cancel
            </Button>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => setShowPasswordReset(!showPasswordReset)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Key size={18} color="#f59e0b" />
                <span style={{ fontWeight: 800, fontSize: '0.875rem' }}>Master Key Override</span>
              </div>
              <Button type="button" variant="secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem', borderRadius: '8px' }}>
                {showPasswordReset ? 'Hide' : 'Show Reset Controls'}
              </Button>
            </div>

            {showPasswordReset && (
              <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Lock size={16} color="#f59e0b" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#f59e0b', textTransform: 'uppercase' }}>Emergency Credential Injection</span>
                </div>
                <Input
                  label="New Manual Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter at least 6 characters..."
                  style={{ marginBottom: '1rem' }}
                />
                <Button 
                  type="button" 
                  onClick={handleManualPasswordReset} 
                  loading={resetting}
                  fullWidth 
                  style={{ background: '#f59e0b', color: '#000', fontWeight: 900, borderRadius: '12px' }}
                >
                  Confirm Manual Override
                </Button>
              </div>
            )}
          </div>
        </form>
      </Modal>

      {/* Delete Organization Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Organization Permanently"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ padding: '1.25rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <Trash2 size={20} color="#ef4444" />
              <p style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 800, color: '#ef4444' }}>
                WARNING: IRREVERSIBLE ACTION
              </p>
            </div>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: '#94a3b8', lineHeight: 1.5 }}>
              This will permanently delete <strong style={{ color: '#f8fafc' }}>{college?.name}</strong> and all associated data including:
            </p>
            <ul style={{ margin: '0.75rem 0 0', paddingLeft: '1.25rem', fontSize: '0.8125rem', color: '#94a3b8', lineHeight: 1.6 }}>
              <li>{stats.total} lead records</li>
              <li>AI calling history and transcripts</li>
              <li>Analytics and performance metrics</li>
              <li>Authentication credentials</li>
            </ul>
            <p style={{ margin: '0.75rem 0 0', fontSize: '0.75rem', color: '#ef4444', fontWeight: 700 }}>
              This action cannot be undone. All data will be lost forever.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button
              variant="danger"
              onClick={handleDeleteOrganization}
              loading={deleting}
              disabled={deleting}
              fullWidth
              style={{ borderRadius: '14px', padding: '1rem' }}
            >
              {deleting ? 'Deleting...' : 'Confirm Deletion'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleting}
              fullWidth
              style={{ borderRadius: '14px', padding: '1rem' }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 1025px) {
          .dashboard-main { margin-left: 280px; }
          .mobile-only { display: none !important; }
        }
      `}} />
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="premium-glass" style={{ padding: '1.75rem', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
        <div style={{ padding: '0.5rem', background: 'var(--accent-glow)', borderRadius: '10px' }}>{icon}</div>
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)' }}>{value}</div>
    </div>
  );
}

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
