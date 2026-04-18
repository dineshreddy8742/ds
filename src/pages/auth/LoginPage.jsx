import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../../components/common/Button';
import { StarField } from '../../components/common/StarField';
import { Bot, Mail, Lock, ArrowRight, Zap, ShieldCheck, Sparkles, Building2, ChevronDown } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sector, setSector] = useState('Education');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const industries = [
    'Education',
    'Real Estate',
    'Political / Government',
    'Solar / Energy',
    'B2B Lead Generation',
    'Health & Wellness',
    'E-commerce',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      toast.success('Access Granted. Welcome back.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper" style={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      {/* Gen Z Background Layers */}
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
        <div className="logo" style={{ marginBottom: '4rem', fontSize: '1.75rem' }}>
          <div className="logo-icon" style={{ 
            width: '56px', 
            height: '56px', 
            background: sector === 'Political / Government' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : (sector === 'Real Estate' ? 'linear-gradient(135deg, #10b981, #3b82f6)' : (sector === 'Solar / Energy' ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : 'linear-gradient(135deg, var(--accent), var(--accent-secondary))')),
            boxShadow: 'var(--glow-pink)',
            transition: 'all 0.5s ease'
          }}>
            <Bot size={32} color="white" />
          </div>
          <span style={{ fontWeight: 900 }}>Dailsmart <span className="hero-gradient-text" style={{ WebkitTextFillColor: 'unset' }}>AI</span></span>
        </div>

        <h2 className="hero-gradient-text" style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1, marginBottom: '2.5rem', letterSpacing: '-0.06em' }}>
          Welcome back<br />
          to the future.
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '450px' }}>
          <div className="reveal-on-scroll visible" style={{ display: 'flex', gap: '1.5rem', animation: 'fadeInLeft 0.8s ease-out' }}>
            <div style={{ padding: '0.8rem', background: 'rgba(255, 0, 127, 0.1)', borderRadius: '16px', height: 'fit-content', border: '1px solid var(--accent)' }}>
              <ShieldCheck size={28} color="var(--accent)" />
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.4rem', fontSize: '1.2rem', fontWeight: 800 }}>Neural Security</h4>
              <p className="text-muted" style={{ fontSize: '0.95rem', fontWeight: 500 }}>Enterprise-grade encryption for your institutional operations.</p>
            </div>
          </div>
          <div className="reveal-on-scroll visible" style={{ display: 'flex', gap: '1.5rem', animation: 'fadeInLeft 1s ease-out' }}>
            <div style={{ padding: '0.8rem', background: 'rgba(0, 255, 136, 0.1)', borderRadius: '16px', height: 'fit-content', border: '1px solid #00ff88' }}>
              <Sparkles size={28} color="#00ff88" />
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.4rem', fontSize: '1.2rem', fontWeight: 800 }}>Stunning Efficiency</h4>
              <p className="text-muted" style={{ fontSize: '0.95rem', fontWeight: 500 }}>Your AI agents have been working while you were away.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', zIndex: 2 }}>
        <div className="premium-glass" style={{ width: '100%', maxWidth: '460px', padding: '4rem', borderRadius: '40px', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
          <div style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.75rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.05em' }}>Sign In</h1>
            <p className="text-muted" style={{ fontWeight: 500 }}>Access your Dailsmart Command Center.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div className="input-group">
              <label style={labelStyle}>
                <Mail size={16} /> Email Address
              </label>
              <input
                type="email"
                className="input-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="commander@dailsmart.ai"
                required
                style={inputOver}
              />
            </div>

            <div className="input-group">
              <label style={labelStyle}>
                <Building2 size={16} /> Identity Sector
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  className="input-control"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  style={{ ...inputOver, appearance: 'none', background: 'var(--panel-bg)', cursor: 'pointer', fontWeight: 600 }}
                >
                  {industries.map(ind => (
                    <option key={ind} value={ind} style={{ background: '#0f172a', color: 'white' }}>{ind}</option>
                  ))}
                </select>
                <div style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--accent)', display: 'flex', alignItems: 'center' }}>
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>
            
            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <label style={labelStyle}>
                  <Lock size={16} /> Password
                </label>
                <Link to="/forgot-password" style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 800, textDecoration: 'none' }}>
                  Recovery Mode
                </Link>
              </div>
              <input
                type="password"
                className="input-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={inputOver}
              />
            </div>

            <Button 
              type="submit" 
              className="btn-genz"
              loading={loading} 
              style={{ width: '100%', padding: '1.25rem', marginTop: '1.5rem', fontSize: '1.1rem', fontWeight: 900 }}
            >
              Verify & Enter <Zap size={20} />
            </Button>
          </form>

          <div style={{ marginTop: '3rem', textAlign: 'center', fontSize: '1rem', fontWeight: 600 }} className="text-muted">
            New to the frontier?{' '}
            <Link to="/signup" style={{ color: 'var(--accent)', fontWeight: 800, textDecoration: 'none' }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .input-control:focus {
          border-color: var(--accent);
          box-shadow: 0 0 15px var(--accent-glow);
        }
        @media (max-width: 1024px) {
          .hide-mobile { display: none !important; }
        }
        @media (max-width: 480px) {
          .premium-glass {
            padding: 2.5rem 1.5rem !important;
            border-radius: 24px !important;
          }
          h1 { font-size: 2rem !important; }
        }
      `}</style>
    </div>
  );
}

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  marginBottom: '0.75rem',
  fontSize: '0.85rem',
  fontWeight: 800,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
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
