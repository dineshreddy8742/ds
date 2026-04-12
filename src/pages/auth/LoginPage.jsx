import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../../components/common/Button';
import { Bot, ShieldCheck, Mail, Lock, ArrowRight, Zap } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

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
    <div className="cosmic-bg responsive-container" style={{
      minHeight: '100vh',
      color: 'var(--text-main)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>

      {/* --- Cosmic Layers --- */}
      <div className="stars-container">
        <div className="stars star-layer-1" />
        <div className="stars star-layer-2" />
        <div className="stars star-layer-3" />
      </div>
      <div className="nebula-glow" />

      {/* --- Cosmic Backdrops --- */}
      <div className="glow-orb" style={{ top: '10%', left: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)' }} />
      <div className="glow-orb" style={{ bottom: '10%', right: '10%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)', animationDelay: '-7s' }} />

      {/* --- Left Side: Branding & Visuals --- */}
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

          <h2 className="shimmer-text" style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '2rem', letterSpacing: '-0.04em' }}>
            Access Your<br />
            Command Center.
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '400px' }}>
            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', height: 'fit-content' }}>
                <ShieldCheck size={24} color="#3b82f6" />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.125rem', fontWeight: 700 }}>Universal Node Protocol</h4>
                <p style={{ margin: 0, color: '#64748b', lineHeight: 1.5, fontSize: '0.9375rem' }}>Secure access to your industry-specific AI lead processing nodes.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <div style={{ padding: '0.75rem', background: 'var(--accent-glow)', borderRadius: '12px', height: 'fit-content' }}>
                <Zap size={24} color="var(--accent)" />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.125rem', fontWeight: 700 }}>Real-time Intelligence</h4>
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.5, fontSize: '0.9375rem' }}>Monitor global call intent and performance across all business sectors.</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '4rem', color: '#475569', fontSize: '0.875rem', fontWeight: 500 }}>
          © {new Date().getFullYear()} DialSmart Global AI Automation.
        </div>
      </div>

      {/* --- Right Side: Login Form --- */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        zIndex: 2
      }}>
        <div className="premium-glass" style={{ width: '100%', maxWidth: '440px', padding: '3.5rem', borderRadius: '32px' }}>
          <div style={{ marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.03em' }}>Sign In</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>Enter your organization credentials.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>
                <Mail size={16} /> Business Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                style={inputStyle}
              />
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <Link to="/forgot-password" style={{ color: 'var(--accent)', fontSize: '0.8125rem', textDecoration: 'none', fontWeight: 700 }}>
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={inputStyle}
              />
            </div>

            <Button 
              type="submit" 
              loading={loading} 
              fullWidth 
              style={{ padding: '1.25rem', fontSize: '1rem', borderRadius: '16px', marginTop: '1rem', fontWeight: 800 }}
            >
              Initialize Dashboard <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
            </Button>
          </form>

          <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.9375rem', color: '#64748b', fontWeight: 500 }}>
            Don't have an account yet?{' '}
            <Link to="/signup" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 800 }}>
              Join the Network
            </Link>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 1024px) {
          .hide-mobile { display: none !important; }
        }
      `}} />
    </div>
  );
}

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '0.75rem',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--text-muted)'
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

