import React from 'react';

export const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: { width: '16px', height: '16px', borderWidth: '2px' },
    md: { width: '24px', height: '24px', borderWidth: '3px' },
    lg: { width: '40px', height: '40px', borderWidth: '4px' },
  };

  const sizeConfig = sizes[size] || sizes.md;
  console.log('LoadingSpinner: size=', size, 'config=', sizeConfig);
  
  const spinnerStyle = {
    ...sizeConfig,
    border: `${sizeConfig?.borderWidth || '3px'} solid rgba(255,255,255,0.1)`,
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  if (fullScreen) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050505',
      }}>
        <div style={spinnerStyle} />
      </div>
    );
  }

  return <div style={spinnerStyle} />;
};

export const LoadingSkeleton = ({ lines = 3 }) => {
  return (
    <div style={{ padding: '1rem' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          style={{
            height: '16px',
            background: 'linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: '8px',
            marginBottom: '0.75rem',
          }}
        />
      ))}
    </div>
  );
};
