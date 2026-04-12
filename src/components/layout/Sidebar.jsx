import { LogOut, Zap, Sun, Moon, X, Menu } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const Sidebar = ({ 
  title, 
  navItems, 
  activeItem, 
  onNavClick, 
  onLogout,
  userBadge = null,
  isOpen = false,
  onClose 
}) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      {/* Mobile overlay */}
      <div
        style={{
          display: isOpen ? 'block' : 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 49,
          backdropFilter: 'blur(4px)'
        }}
        onClick={onClose}
        className="sidebar-overlay"
      />
      
      <aside
        style={{
          width: '280px',
          background: 'var(--panel-bg)',
          backdropFilter: 'blur(40px)',
          borderRight: '1px solid var(--border)',
          padding: '2.5rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          boxShadow: '10px 0 30px rgba(0, 0, 0, 0.2)',
          transform: 'translateX(0)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className="sidebar-container"
      >
        {/* Mobile close button */}
        <button 
          onClick={onClose}
          className="mobile-only"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(255,255,255,0.05)',
            border: 'none',
            color: 'var(--text-main)',
            padding: '0.5rem',
            borderRadius: '10px',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>
        {/* Decorative Top Glow */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)' }} />

        <div style={{ marginBottom: '3.5rem', padding: '0 0.5rem' }}>
          {title}
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {navItems.map((item, index) => {
            const isActive = activeItem === (item.id || item.label);
            return (
              <div
                key={index}
                onClick={() => onNavClick(item.id || item.label)}
                style={{
                  padding: '0.875rem 1.25rem',
                  borderRadius: '16px',
                  color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                  fontWeight: isActive ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  background: isActive 
                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(99, 102, 241, 0.15))' 
                    : 'transparent',
                  border: isActive
                    ? '1px solid rgba(59, 130, 246, 0.4)'
                    : '1px solid transparent',
                  boxShadow: isActive ? '0 4px 20px rgba(59, 130, 246, 0.15)' : 'none',
                  transform: isActive ? 'translateX(4px)' : 'none',
                }}
                className="nav-item-vibrant"
              >
                <span style={{ 
                  color: isActive ? '#3b82f6' : 'inherit',
                  filter: isActive ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))' : 'none',
                  transition: 'all 0.3s ease'
                }}>
                  {item.icon}
                </span>
                <span style={{ fontSize: '0.9375rem', letterSpacing: '0.01em' }}>{item.label}</span>
                {isActive && (
                  <div style={{ marginLeft: 'auto', width: '4px', height: '4px', borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 10px #3b82f6' }} />
                )}
              </div>
            );
          })}
        </nav>

        {userBadge && (
          <div style={{
            marginTop: 'auto',
            padding: '1.25rem',
            borderRadius: '20px',
            background: 'rgba(59, 130, 246, 0.05)',
            border: '1px solid rgba(59, 130, 246, 0.1)',
            marginBottom: '1rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '2px', height: '100%', background: '#3b82f6' }} />
            <span style={{ fontSize: '0.6875rem', color: '#93c5fd', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
               <Zap size={10} fill="#93c5fd" /> {userBadge.label}
            </span>
            <strong style={{ fontSize: '0.8125rem', display: 'block', color: 'var(--text-main)', marginTop: '0.4rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userBadge.value}
            </strong>
          </div>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={toggleTheme}
            style={{
              padding: '1rem 1.25rem',
              borderRadius: '16px',
              color: 'var(--text-main)',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              background: 'var(--glass)',
              border: '1px solid var(--border)',
              fontSize: '0.9375rem',
              width: '100%',
              textAlign: 'left'
            }}
          >
            <div style={{ padding: '0.4rem', background: 'var(--accent-glow)', borderRadius: '8px' }}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </div> 
            <span>{theme === 'dark' ? 'Stellar Light' : 'Void Dark'}</span>
          </button>

          <button
            onClick={onLogout}
            style={{
              padding: '1rem 1.25rem',
              borderRadius: '16px',
              color: 'var(--danger)',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              background: 'rgba(239, 68, 68, 0.03)',
              border: '1px solid rgba(239, 68, 68, 0.1)',
              fontSize: '0.9375rem',
              width: '100%',
              textAlign: 'left'
            }}
          >
            <div style={{ padding: '0.4rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
              <LogOut size={16} />
            </div> 
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      <style dangerouslySetInnerHTML={{ __html: `
        .sidebar-overlay { transition: opacity 0.3s ease; }
        .nav-item-vibrant:hover { 
          background: var(--glass) !important; 
          color: var(--text-main) !important; 
          transform: translateX(6px);
          border-color: var(--border);
        }
        .nav-item-vibrant:hover span { color: var(--accent) !important; }
        .nav-item-logout-vibrant:hover { 
          background: rgba(239, 68, 68, 0.1) !important; 
          transform: scale(0.98);
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.1);
        }
        .mobile-only { display: none; }
        @media (max-width: 1024px) {
          .mobile-only { display: block; }
          .sidebar-container { 
            transform: ${isOpen ? 'translateX(0)' : 'translateX(-100%)'} !important;
            box-shadow: ${isOpen ? '20px 0 50px rgba(0,0,0,0.5)' : 'none'} !important;
          }
          .sidebar-overlay { display: block !important; }
        }
      `}} />
    </>
  );
};
