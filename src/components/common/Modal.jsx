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
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(15px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        animation: 'fadeIn 0.2s ease-out',
        padding: '2rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#0f172a',
          border: '1px solid #1e293b',
          padding: '2rem',
          borderRadius: '32px',
          width: '90%',
          maxWidth: sizes[size] || sizes.md,
          maxHeight: '90vh',
          overflow: 'auto',
          animation: 'scaleUp 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{title}</h2>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
