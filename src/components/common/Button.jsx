import React from 'react';

export const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style = {},
  ...props 
}) => {
  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      color: 'white',
    },
    success: {
      background: 'linear-gradient(135deg, #10b981, #059669)',
      color: 'white',
    },
    danger: {
      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: 'white',
    },
    secondary: {
      background: '#1e293b',
      color: '#e2e8f0',
      border: '1px solid #334155',
    },
    ghost: {
      background: 'transparent',
      color: '#a1a1aa',
    },
  };

  const sizes = {
    sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    md: { padding: '0.75rem 1.25rem', fontSize: '1rem' },
    lg: { padding: '1rem 1.5rem', fontSize: '1.125rem' },
  };

  const baseStyles = {
    ...variants[variant],
    ...sizes[size],
    border: variants[variant].border || 'none',
    borderRadius: '12px',
    fontWeight: 600,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s',
    ...style,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={baseStyles}
      {...props}
    >
      {loading ? (
        <>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderTopColor: 'white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};
