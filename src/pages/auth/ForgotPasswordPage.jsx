import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

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
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="cosmic-bg responsive-container" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-main)',
        padding: '2rem',
      }}>
        <div className="stars-container">
          <div className="stars star-layer-1" />
          <div className="stars star-layer-2" />
        </div>
        <div className="nebula-glow" />
        
        <div className="premium-glass" style={{
          padding: '3.5rem',
          borderRadius: '32px',
          width: '100%',
          maxWidth: '440px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10
        }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.03em' }}>Check Your Email</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontWeight: 500 }}>
            We've sent you a password reset link. Please check your inbox for the DialSmart signal.
          </p>
          <Link to="/login">
            <Button fullWidth style={{ borderRadius: '16px', padding: '1rem' }}>Back to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cosmic-bg responsive-container" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-main)',
      padding: '2rem',
    }}>
      <div className="stars-container">
        <div className="stars star-layer-1" />
        <div className="stars star-layer-2" />
      </div>
      <div className="nebula-glow" />

      <div className="premium-glass" style={{
        padding: '3.5rem',
        borderRadius: '32px',
        width: '100%',
        maxWidth: '440px',
        position: 'relative',
        zIndex: 10
      }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem', textAlign: 'center', letterSpacing: '-0.03em' }}>
          Reset Password
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', textAlign: 'center', fontWeight: 500 }}>
          Enter your email to receive a reset link
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Input
            label="Business Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
          />

          <Button type="submit" loading={loading} fullWidth style={{ borderRadius: '16px', padding: '1rem', fontWeight: 800 }}>
            Send Reset Link
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--text-muted)', fontSize: '0.9375rem', fontWeight: 500 }}>
          Remember your password?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 800 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
