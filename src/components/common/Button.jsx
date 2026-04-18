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
  className = '',
  style = {},
  ...props 
}) => {
  const variants = {
    primary: {
      background: 'linear-gradient(135deg, var(--accent), #6366f1)',
      color: 'white',
      boxShadow: '0 8px 16px -4px var(--accent-glow)',
    },
    success: {
      background: 'linear-gradient(135deg, var(--success), #059669)',
      color: 'white',
    },
    danger: {
      background: 'linear-gradient(135deg, var(--danger), #b91c1c)',
      color: 'white',
    },
    secondary: {
      background: 'var(--glass)',
      color: 'var(--text-main)',
      border: '1px solid var(--glass-border)',
      backdropFilter: 'blur(10px)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-muted)',
    },
  };

  const sizes = {
    sm: { padding: '0.5rem 1rem', fontSize: '0.8125rem', borderRadius: '10px' },
    md: { padding: '0.75rem 1.5rem', fontSize: '0.9375rem', borderRadius: '12px' },
    lg: { padding: '1.125rem 2rem', fontSize: '1.05rem', borderRadius: '16px' },
  };

  const baseStyles = {
    ...variants[variant],
    ...sizes[size],
    border: variants[variant].border || 'none',
    fontWeight: 700,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.6rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: 'inherit',
    ...style,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={baseStyles}
      className={`custom-btn ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <div className="btn-loader" style={{
            width: '18px',
            height: '18px',
            border: '2.5px solid rgba(255,255,255,0.3)',
            borderTopColor: 'white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          <span>Synchronizing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
