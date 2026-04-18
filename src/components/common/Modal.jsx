import React from 'react';

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizes = {
    sm: '400px',
    md: '500px',
    lg: '800px',
    xl: '1100px',
    full: '95vw'
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(2, 6, 23, 0.9)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease-out',
        padding: '2rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--border)',
          padding: '2.5rem',
          borderRadius: '32px',
          width: '90%',
          maxWidth: sizes[size] || sizes.md,
          maxHeight: '90vh',
          overflow: 'auto',
          animation: 'scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
        className="premium-glass"
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', opacity: 0.5 }} />
        
        {title && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>{title}</h2>
          </div>
        )}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
};
