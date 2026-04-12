import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/common/Button';
import { Bot, User, Building2, Mail, Lock, CheckCircle2, TrendingUp, Sparkles, Briefcase, ChevronDown } from 'lucide-react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'COLLEGE',
    org_name: '',
    industry: 'EdTech / Education',
    full_name: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const industries = [
    'EdTech / Education',
    'Real Estate',
    'Solar / Energy',
    'B2B Lead Generation',
    'Health & Wellness',
    'E-commerce',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);

    try {
      const metadata = formData.role === 'ADMIN'
        ? { role: 'ADMIN', full_name: formData.full_name }
        : { 
            role: 'COLLEGE', 
            full_name: formData.org_name, // Important: mapped for the trigger
            industry: formData.industry 
          };

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;

      if (data?.user) {
        toast.success('Registration Initiated. Welcome to the network.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (role) => {
    setFormData({ ...formData, role });
  };

  return (
    <div className="cosmic-bg responsive-container" style={{
      minHeight: '100vh',
      color: 'var(--text-main)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>

      {/* --- Cosmic Layers --- */}
      <div className="stars-container">
        <div className="stars star-layer-1"></div>
        <div className="stars star-layer-2"></div>
        <div className="stars star-layer-3"></div>
      </div>
      <div className="nebula-glow"></div>
      
      {/* --- Subtle Orbs --- */}
      <div className="glow-orb" style={{ top: '-10%', right: '0%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)' }}></div>
      <div className="glow-orb" style={{ bottom: '0%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)', animationDelay: '-5s' }}></div>

      {/* --- Left Side: Branding & Info --- */}
      <div className="hide-mobile" style={{
        flex: 1.1,
        background: 'var(--panel-bg)',
        backdropFilter: 'blur(30px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '6rem',
        position: 'relative',
        borderRight: '1px solid var(--border)'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.75rem', fontWeight: 900, marginBottom: '4rem' }}>
            <div style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, var(--accent), #6366f1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)' }}>
              <Bot size={24} color="white" />
            </div>
            DialSmart<span style={{ color: 'var(--accent)' }}>.ai</span>
          </div>

          <h2 className="shimmer-text" style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '2.5rem', letterSpacing: '-0.04em' }}>
            The Global Engine for<br />
            Lead Conversion.
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ padding: '0.6rem', background: 'var(--accent-glow)', borderRadius: '10px' }}>
                <Sparkles size={20} color="var(--accent)" />
              </div>
              <div style={{ fontSize: '1.125rem', color: 'var(--text-muted)', fontWeight: 500 }}>Autonomous Voice Agent Orchestration</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ padding: '0.6rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px' }}>
                <CheckCircle2 size={20} color="var(--success)" />
              </div>
              <div style={{ fontSize: '1.125rem', color: 'var(--text-muted)', fontWeight: 500 }}>Global Lead Conversion Powerhouse</div>
            </div>
          </div>

          <div style={{ 
            marginTop: '5rem', 
            padding: '2rem', 
            background: 'rgba(255,255,255,0.02)', 
            borderRadius: '24px', 
            border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'center',
            maxWidth: '420px',
            backdropFilter: 'blur(5px)'
          }}>
            <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '14px' }}>
              <TrendingUp size={28} color="#3b82f6" />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.5rem', color: '#fff', letterSpacing: '-0.02em' }}>+240%</div>
              <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Multi-Sector Growth Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Right Side: Signup Form --- */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        zIndex: 2
      }}>
        <div className="premium-glass" style={{ width: '100%', maxWidth: '480px', padding: '3rem', borderRadius: '32px', overflowY: 'auto', maxHeight: '95vh' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>Create your account</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>Scale your conversion instantly.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Account Type Toggle */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <button 
                type="button" 
                onClick={() => handleRoleChange('COLLEGE')}
                style={{
                  padding: '0.875rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: formData.role === 'COLLEGE' ? 'var(--accent)' : 'transparent',
                  color: formData.role === 'COLLEGE' ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  transition: 'all 0.2s',
                  boxShadow: formData.role === 'COLLEGE' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
                }}
              >
                <Briefcase size={18} /> Business
              </button>
              <button 
                type="button" 
                onClick={() => handleRoleChange('ADMIN')}
                style={{
                  padding: '0.875rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: formData.role === 'ADMIN' ? 'var(--accent)' : 'transparent',
                  color: formData.role === 'ADMIN' ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  transition: 'all 0.2s',
                  boxShadow: formData.role === 'ADMIN' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
                }}
              >
                <User size={18} /> Provider
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {formData.role === 'COLLEGE' && (
                <>
                  <div>
                    <label style={labelStyle}>Organization / Business Name</label>
                    <input
                      value={formData.org_name}
                      onChange={(e) => setFormData({ ...formData, org_name: e.target.value })}
                      placeholder="e.g. Acme Corp"
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Select Industry</label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                      >
                        {industries.map(ind => (
                          <option key={ind} value={ind} style={{ background: '#020617', color: '#fff' }}>{ind}</option>
                        ))}
                      </select>
                      <ChevronDown size={18} style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }} />
                    </div>
                  </div>
                </>
              )}

              {formData.role === 'ADMIN' && (
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="John Doe"
                    required
                    style={inputStyle}
                  />
                </div>
              )}

              <div>
                <label style={labelStyle}>Business Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.com"
                  required
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Confirm</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    required
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" loading={loading} fullWidth style={{ padding: '1.125rem', borderRadius: '16px', marginTop: '0.5rem', fontSize: '1rem', fontWeight: 800 }}>
              Get Started
            </Button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>
            Already part of the network?{' '}
            <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 800 }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 1024px) {
          .hide-mobile { display: none !important; }
        }
        /* Custom scrollbar for form */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.3); border-radius: 10px; }
      `}} />
    </div>
  );
}

const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const inputStyle = {
  width: '100%',
  padding: '1.125rem 1.25rem',
  background: 'var(--panel-bg)',
  border: '1px solid var(--border)',
  borderRadius: '16px',
  color: 'var(--text-main)',
  outline: 'none',
  fontSize: '0.9375rem',
  transition: 'all 0.3s ease',
  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
};

