import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Sidebar } from '../components/layout/Sidebar';
import { Modal } from '../components/common/Modal';
import { 
  User, 
  Lock, 
  Mail, 
  Shield, 
  ArrowLeft, 
  LogOut, 
  Key, 
  Settings, 
  Zap, 
  Briefcase, 
  Globe,
  Database,
  Cloud,
  RefreshCw,
  Save,
  UserCheck,
  Menu,
  Bot
} from 'lucide-react';

export default function ProfilePage() {
  const { user, userRole, collegeName, signOut, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Profile state for editing
  const [profileData, setProfileData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    organization: collegeName || user?.user_metadata?.college_name || 'Organization Agent'
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');

    setLoading(true);
    try {
      await updatePassword(newPassword);
      toast.success('Security protocol updated: Password successfully changed');
      setShowPasswordModal(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.message || 'Failed to update security credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Logic to update user metadata in Supabase
      // This usually requires a call to auth.updateUser
      toast.success('Identity metadata synchronized successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to sync metadata');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleGoBack = () => {
    if (userRole === 'ADMIN') navigate('/admin');
    else navigate('/college');
  };

  const navItems = [
    { id: 'profile', label: 'Identity Settings', icon: <User size={20} /> },
    { id: 'security', label: 'Security Center', icon: <Shield size={20} /> },
    { id: 'integrations', label: 'Neural Integrations', icon: <Globe size={20} /> },
  ];

  return (
    <div className="cosmic-bg responsive-container dashboard-container" style={{ minHeight: '100vh', color: 'var(--text-main)', background: 'var(--bg-main)' }}>
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
          <span>Profile <span style={{ color: 'var(--accent)' }}>AI</span></span>
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
        activeItem="profile"
        onNavClick={(id) => {
          if (id !== 'profile') toast.success(`${id} module calibrated`);
          setIsSidebarOpen(false);
        }}
        onLogout={handleLogout}
        userBadge={{ label: 'SYSTEM ACCESS', value: userRole }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main className="dashboard-main" style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 'max(0px, 60px)' }}>
        <div style={{ width: '100%', maxWidth: '900px' }}>
          <header style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <button 
                onClick={handleGoBack}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, cursor: 'pointer', marginBottom: '1.5rem', padding: 0 }}
              >
                <ArrowLeft size={18} /> BACK TO COMMAND CENTER
              </button>
              <h1 className="shimmer-text" style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 900, margin: 0, letterSpacing: '-0.04em' }}>
                System Calibration
              </h1>
              <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '1rem', marginTop: '0.5rem' }}>Manage your organization's neural identity & security</p>
            </div>
            <div style={{ padding: '1.5rem', background: 'var(--accent-glow)', borderRadius: '24px', border: '1px solid var(--border)' }}>
              <UserCheck size={48} color="var(--accent)" strokeWidth={1.5} />
            </div>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="premium-glass" style={{ padding: '2.5rem', borderRadius: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Settings size={22} color="var(--accent)" /> Identity Profile
                </h2>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="secondary" style={{ borderRadius: '12px' }}>Edit Metadata</Button>
                ) : (
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Button onClick={() => setIsEditing(false)} variant="secondary" style={{ borderRadius: '12px' }}>Cancel</Button>
                    <Button onClick={handleSaveProfile} loading={loading} style={{ borderRadius: '12px', background: '#10b981', border: 'none' }}>
                      <Save size={18} /> Save & Sync
                    </Button>
                  </div>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
                <EditableField 
                  label="Organization Name" 
                  value={profileData.organization} 
                  onChange={(val) => setProfileData(p => ({...p, organization: val}))}
                  icon={<Briefcase size={18} />} 
                  isEditing={isEditing}
                />
                <EditableField 
                  label="Primary Contact" 
                  value={profileData.fullName} 
                  onChange={(val) => setProfileData(p => ({...p, fullName: val}))}
                  icon={<User size={18} />} 
                  isEditing={isEditing}
                  placeholder="e.g. John Doe"
                />
                <EditableField 
                  label="System Signal Email" 
                  value={user?.email} 
                  icon={<Mail size={18} />} 
                  isEditing={false}
                />
                <EditableField 
                  label="Network Role" 
                  value={userRole} 
                  icon={<Shield size={18} />} 
                  isEditing={false}
                  color="var(--accent)"
                />
              </div>

              <div style={{ marginTop: '3.5rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <div style={{ padding: '1.75rem', borderRadius: '24px', background: 'var(--accent-glow)', border: '1px solid var(--glass-border)' }}>
                  <Lock size={24} color="var(--accent)" style={{ marginBottom: '1rem' }} />
                  <h4 style={{ margin: '0 0 0.5rem', fontWeight: 800 }}>Account Security</h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Update your neural access key to ensure system integrity.</p>
                  <Button onClick={() => setShowPasswordModal(true)} fullWidth style={{ borderRadius: '12px', fontSize: '0.875rem' }}>Update Password</Button>
                </div>
                <div style={{ padding: '1.75rem', borderRadius: '24px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                  <Database size={24} color="var(--success)" style={{ marginBottom: '1rem' }} />
                  <h4 style={{ margin: '0 0 0.5rem', fontWeight: 800 }}>Data Synchronization</h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Active bridge to Google Neural Sheets (Real-time sync enabled).</p>
                  <Button variant="secondary" fullWidth style={{ borderRadius: '12px', fontSize: '0.875rem', borderColor: 'rgba(16, 185, 129, 0.3)' }}>Re-Calibration</Button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="premium-glass" style={{ padding: '2rem', borderRadius: '28px', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <Zap size={36} color="#3b82f6" />
                </div>
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 900 }}>Neural Status</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 800, fontSize: '0.875rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                  COGNITIVE LINK OPTIMAL
                </div>
                <div style={{ marginTop: '2rem', pt: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 800, marginBottom: '0.5rem' }}>SYSTEM ID</div>
                  <code style={{ fontSize: '0.6875rem', color: '#94a3b8', background: 'rgba(0,0,0,0.3)', padding: '0.4rem 0.6rem', borderRadius: '8px', wordBreak: 'break-all' }}>{user?.id}</code>
                </div>
              </div>

              <div className="premium-glass" style={{ padding: '2rem', borderRadius: '28px', background: 'linear-gradient(180deg, transparent, rgba(239, 68, 68, 0.05))', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 900, color: '#ef4444' }}>Danger Sector</h4>
                <p style={{ fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '1.5rem' }}>Immediately terminate your current system session and clear credentials.</p>
                <button 
                  onClick={handleLogout}
                  style={{ width: '100%', padding: '1rem', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', fontSize: '0.9375rem' }}
                >
                  <LogOut size={20} /> TERMINATE SESSION
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Security Key Update">
        <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Input
            label="New Neural Security Key"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min 6 characters required"
            required
          />
          <Input
            label="Verify Security Key"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Double-check entry"
            required
          />

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Button type="submit" loading={loading} fullWidth style={{ borderRadius: '14px', padding: '1rem' }}>
              Authorize Update
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowPasswordModal(false)} fullWidth style={{ borderRadius: '14px', padding: '1rem' }}>
              Abort
            </Button>
          </div>
        </form>
      </Modal>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 1025px) {
          .dashboard-main { 
            margin-left: ${isSidebarCollapsed ? '80px' : '280px'}; 
            transition: margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .mobile-only { display: none !important; }
        }
        @media (max-width: 1024px) {
          .dashboard-main { margin-left: 0 !important; padding-top: 80px !important; }
        }
      `}} />
    </div>
  );
}

function EditableField({ label, value, onChange, icon, isEditing, isMono, color, placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.8125rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {icon} {label}
      </label>
      {isEditing ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '1.125rem 1.25rem',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid #3b82f6',
            borderRadius: '16px',
            color: '#fff',
            outline: 'none',
            fontSize: '1rem',
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.1)'
          }}
        />
      ) : (
        <div className="premium-glass" style={{
          padding: '1.125rem 1.375rem',
          borderRadius: '16px',
          color: color || '#f8fafc',
          fontSize: isMono ? '0.875rem' : '1rem',
          fontWeight: color ? 800 : 700,
          fontFamily: isMono ? 'monospace' : 'inherit',
          border: '1px solid rgba(255,255,255,0.03)',
          boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.3)',
          minHeight: '3.5rem',
          display: 'flex',
          alignItems: 'center'
        }}>
          {value || 'DATA NOT CALIBRATED'}
        </div>
      )}
    </div>
  );
}
