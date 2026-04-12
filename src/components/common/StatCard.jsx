import React from 'react';

export const StatCard = ({ title, value, color = '#60a5fa', icon }) => {
  return (
    <div
      style={{
        background: '#121214',
        border: '1px solid #27272a',
        padding: '1.5rem',
        borderRadius: '16px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        animation: 'slideUp 0.6s ease-out backwards',
      }}
      className="stat-card"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        {icon && <span style={{ fontSize: '1.5rem' }}>{icon}</span>}
        <div style={{ color: '#a1a1aa', fontSize: '0.875rem', fontWeight: 500 }}>{title}</div>
      </div>
      <div style={{ fontSize: '2.5rem', fontWeight: 700, color }}>
        {value}
      </div>
    </div>
  );
};
