import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/common/Loading';

export default function DashboardPage() {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('DashboardPage state:', { user, userRole, loading });
    
    if (!loading) {
      if (!user) {
        console.log('No user, redirecting to login');
        navigate('/login');
      } else if (!userRole) {
        // User exists but role is not set
        console.error('User has no role set in metadata:', user);
        alert('Your account does not have a role assigned. Please contact admin or recreate your account with role metadata.');
        navigate('/login');
      } else if (userRole === 'ADMIN') {
        console.log('Redirecting to admin portal');
        navigate('/admin');
      } else if (userRole === 'COLLEGE') {
        console.log('Redirecting to college portal');
        navigate('/college');
      } else {
        console.error('Unknown role:', userRole);
        alert(`Unknown role: ${userRole}`);
        navigate('/login');
      }
    }
  }, [user, userRole, loading, navigate]);

  return <LoadingSpinner fullScreen />;
}
