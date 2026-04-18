import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/common/Button';
import { StarField } from '../../components/common/StarField';
import { Bot, User, Building2, Mail, Lock, CheckCircle2, TrendingUp, Sparkles, Briefcase, ChevronDown, Zap } from 'lucide-react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'COLLEGE',
    org_name: '',
    industry: 'Education',
    full_name: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const industries = [
    'EdTech / Education',
    'Real Estate',
    'Government / Political',
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
            full_name: formData.org_name, 
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
    <div className="login-wrapper" style={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      {/* Background Effects */}
      <div className="cosmic-layer">
        <StarField />
        <div className="glow-mesh"></div>
      </div>

      {/* Left Side: Branding */}
      <div className="hide-mobile" style={{
        flex: 1.2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '6rem',
        background: 'rgba(2, 6, 23, 0.4)',
        backdropFilter: 'blur(60px)',
        borderRight: '1px solid var(--border)',
        zIndex: 1
      }}>
        <div className="logo" style={{ marginBottom: '3rem', fontSize: '1.75rem' }}>
          <div className="logo-icon" style={{ 
            width: '56px', 
            height: '56px', 
            background: formData.industry === 'Political / Government' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : (formData.industry === 'Real Estate' ? 'linear-gradient(135deg, #10b981, #3b82f6)' : 'linear-gradient(135deg, var(--accent), var(--accent-secondary))'),
            boxShadow: 'var(--glow-pink)',
            transition: 'all 0.5s ease'
          }}>
            <Bot size={32} color="white" />
          </div>
          <span style={{ fontWeight: 900 }}>Dailsmart <span className="hero-gradient-text" style={{ WebkitTextFillColor: 'unset' }}>AI</span></span>
        </div>

        <h2 className="hero-gradient-text" style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1, marginBottom: '2.5rem', letterSpacing: '-0.06em' }}>
          Start your<br />
          Hyper-Growth.
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ padding: '0.8rem', background: 'rgba(255, 0, 127, 0.1)', borderRadius: '16px', border: '1px solid var(--accent)' }}>
              <Sparkles size={24} color="var(--accent)" />
            </div>
            <div style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 800 }}>Autonomous Orchestration</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ padding: '0.8rem', background: 'rgba(0, 255, 136, 0.1)', borderRadius: '16px', border: '1px solid #00ff88' }}>
              <TrendingUp size={24} color="#00ff88" />
            </div>
            <div style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 800 }}>Global Scalability</div>
          </div>
        </div>

        <div style={{ 
          marginTop: '5rem', 
          padding: '2.5rem', 
          background: 'rgba(255,255,255,0.03)', 
          borderRadius: '32px', 
          border: '1px solid var(--border)',
          display: 'flex',
          gap: '2rem',
          alignItems: 'center',
          maxWidth: '450px',
        }}>
          <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '20px' }}>
            <Zap size={36} color="#3b82f6" />
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '2rem', color: '#fff', lineHeight: 1 }}>+240%</div>
            <div className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>Revenue Impact</div>
          </div>
        </div>
      </div>

      {/* Right Side: Signup Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', zIndex: 2 }}>
        <div className="premium-glass" style={{ width: '100%', maxWidth: '540px', padding: '3.5rem', maxHeight: '95vh', overflowY: 'auto', borderRadius: '40px' }}>
          <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.75rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.05em' }}>Create Profile</h1>
            <p className="text-muted" style={{ fontWeight: 600, fontSize: '0.95rem' }}>Initializing AI Data Node.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Role Toggle */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.6rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
              <button 
                type="button" 
                onClick={() => handleRoleChange('COLLEGE')}
                style={{
                  padding: '1rem',
                  borderRadius: '16px',
                  border: 'none',
                  background: formData.role === 'COLLEGE' ? 'var(--accent)' : 'transparent',
                  color: formData.role === 'COLLEGE' ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  transition: '0.3s',
                  boxShadow: formData.role === 'COLLEGE' ? 'var(--glow-pink)' : 'none'
                }}
              >
                <Briefcase size={18} /> Business
              </button>
              <button 
                type="button" 
                onClick={() => handleRoleChange('ADMIN')}
                style={{
                  padding: '1rem',
                  borderRadius: '16px',
                  border: 'none',
                  background: formData.role === 'ADMIN' ? 'var(--accent-secondary)' : 'transparent',
                  color: formData.role === 'ADMIN' ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  transition: '0.3s',
                  boxShadow: formData.role === 'ADMIN' ? '0 0 20px rgba(112, 0, 255, 0.4)' : 'none'
                }}
              >
                <User size={18} /> Provider
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {formData.role === 'COLLEGE' ? (
                <>
                  <div className="input-group">
                    <label style={miniLabelStyle}>Organization / Institution Name</label>
                    <input
                      className="input-control"
                      value={formData.org_name}
                      onChange={(e) => setFormData({ ...formData, org_name: e.target.value })}
                      placeholder="e.g. Acme Corp"
                      required
                      style={inputOver}
                    />
                  </div>
                  <div className="input-group">
                    <label style={miniLabelStyle}>Industry Sector</label>
                    <select
                      className="input-control"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      style={{ ...inputOver, appearance: 'none', cursor: 'pointer' }}
                    >
                      {industries.map(ind => (
                        <option key={ind} value={ind} style={{ background: '#020617' }}>{ind}</option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <div className="input-group">
                  <label style={miniLabelStyle}>Commander Name</label>
                  <input
                    className="input-control"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="John Doe"
                    required
                    style={inputOver}
                  />
                </div>
              )}

              <div className="input-group">
                <label style={miniLabelStyle}>Business Email</label>
                <input
                  type="email"
                  className="input-control"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.com"
                  required
                  style={inputOver}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="input-group">
                  <label style={miniLabelStyle}>Security Key</label>
                  <input
                    type="password"
                    className="input-control"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    style={inputOver}
                  />
                </div>
                <div className="input-group">
                  <label style={miniLabelStyle}>Verify Key</label>
                  <input
                    type="password"
                    className="input-control"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    required
                    style={inputOver}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="btn-genz" loading={loading} style={{ width: '100%', padding: '1.25rem', marginTop: '1.5rem', fontSize: '1.1rem', fontWeight: 900 }}>
              Deploy Command Hub <Zap size={20} />
            </Button>
          </form>

          <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '1rem', fontWeight: 600 }} className="text-muted">
            Already verified?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 800, textDecoration: 'none' }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .input-control:focus {
          border-color: var(--accent);
          box-shadow: 0 0 15px var(--accent-glow);
        }
        @media (max-width: 1024px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}

const miniLabelStyle = {
  display: 'block',
  marginBottom: '0.6rem',
  fontSize: '0.75rem',
  fontWeight: 900,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em'
};

const inputOver = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid var(--border)',
  borderRadius: '16px',
  padding: '1.125rem',
  fontSize: '1rem',
  color: 'white',
  width: '100%',
  outline: 'none',
  transition: '0.3s'
};
