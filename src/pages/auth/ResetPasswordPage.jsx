import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { StarField } from '../../components/common/StarField';

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
      toast.success('Security protocol updated successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Failed to update credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <div className="cosmic-layer">
        <StarField />
        <div className="glow-mesh" />
      </div>

      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '3.5rem', zIndex: 2 }}>
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>Update Security</h1>
          <p className="text-muted">Enter your new neural security key.</p>
        </div>

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

          <Button type="submit" className="btn-primary" loading={loading} fullWidth style={{ padding: '1rem', fontWeight: 800 }}>
            Calibrate Identity
          </Button>
        </form>
      </div>
    </div>
  );
}
