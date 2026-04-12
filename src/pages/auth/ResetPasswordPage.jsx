import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);

    try {
      await updatePassword(password);
      toast.success('Password updated successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

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
          New Password
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', textAlign: 'center', fontWeight: 500 }}>
          Enter your new neural security key
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Input
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 6 characters"
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Verify security key"
            required
          />

          <Button type="submit" loading={loading} fullWidth style={{ borderRadius: '16px', padding: '1rem', fontWeight: 800 }}>
            Update Credentials
          </Button>
        </form>
      </div>
    </div>
  );
}
