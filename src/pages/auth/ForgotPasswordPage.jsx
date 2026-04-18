import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { StarField } from '../../components/common/StarField';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      setSent(true);
      toast.success('Access Link Transmitted.');
    } catch (error) {
      toast.error(error.message || 'Transmission failed');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="login-wrapper" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="cosmic-layer">
          <StarField />
          <div className="glow-mesh" />
        </div>

        <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '3.5rem', textAlign: 'center', zIndex: 2 }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '1rem' }}>Check Your Email</h2>
          <p className="text-muted" style={{ marginBottom: '2.5rem' }}>
            We've sent a neural reset link to your inbox. Please follow the instructions to restore access to Dailsmart AI.
          </p>
          <Link to="/login">
            <Button fullWidth className="btn-primary">Back to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="login-wrapper" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <div className="cosmic-layer">
        <StarField />
        <div className="glow-mesh" />
      </div>

      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '3.5rem', zIndex: 2 }}>
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>Restore Access</h1>
          <p className="text-muted">Enter your email for a recovery link.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Input
            label="Business Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
          />

          <Button type="submit" className="btn-primary" loading={loading} fullWidth style={{ padding: '1rem', fontWeight: 800 }}>
            Send Reset Link
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.9375rem' }} className="text-muted">
          Remember your credentials?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 800 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
