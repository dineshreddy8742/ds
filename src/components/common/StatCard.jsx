import React from 'react';

export const StatCard = ({ title, value, color = 'var(--accent)', icon }) => {
  return (
    <div
      className="glass-card"
      style={{
        padding: '1.75rem',
        animation: 'slideUp 0.6s ease-out backwards',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ 
          color: 'var(--text-muted)', 
          fontSize: '0.8125rem', 
          fontWeight: 800, 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em' 
        }}>
          {title}
        </div>
        {icon && (
          <div style={{ 
            color, 
            opacity: 0.8,
            padding: '0.5rem',
            background: `${color}15`,
            borderRadius: '10px'
          }}>
            {icon}
          </div>
        )}
      </div>
      <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
        {value}
      </div>
      <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ width: '40%', height: '100%', background: color, borderRadius: '10px', opacity: 0.5 }}></div>
      </div>
    </div>
  );
};
