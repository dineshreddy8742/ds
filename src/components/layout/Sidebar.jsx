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
  onClose,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      {/* Mobile overlay - Only show when isOpen is true */}
      {isOpen && (
        <div
          style={{
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
        />
      )}
      
      <aside
        style={{
          width: isCollapsed ? '80px' : '280px',
          background: 'var(--panel-bg)',
          backdropFilter: 'blur(40px)',
          borderRight: '1px solid var(--border)',
          padding: isCollapsed ? '2.5rem 0.75rem' : '2.5rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          boxShadow: isCollapsed ? 'none' : '10px 0 30px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'none', // Hide default scrollbar for Firefox
          msOverflowStyle: 'none', // Hide default scrollbar for IE/Edge
        }}
        className="sidebar-container scroll-container"
      >
        {/* Toggle / Close Button */}
        <button 
          onClick={onToggleCollapse || onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: isCollapsed ? '50%' : '1rem',
            transform: isCollapsed ? 'translateX(50%)' : 'none',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border)',
            color: 'var(--text-main)',
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            zIndex: 51
          }}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <Menu size={16} /> : <X size={16} />}
        </button>
        {/* Decorative Top Glow */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)' }} />

        <div style={{ 
          marginBottom: '3.5rem', 
          padding: '0 0.5rem',
          opacity: isCollapsed ? 0 : 1,
          transition: 'opacity 0.3s ease',
          whiteSpace: 'nowrap'
        }}>
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
                  transition: 'all 0.3s ease',
                  flexShrink: 0
                }}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span style={{ fontSize: '0.9375rem', letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {!isCollapsed && userBadge && (
          <div style={{
            marginTop: 'auto',
            padding: '1.25rem',
            borderRadius: '20px',
            background: 'rgba(59, 130, 246, 0.05)',
            border: '1px solid rgba(59, 130, 246, 0.1)',
            marginBottom: '1rem',
            position: 'relative',
          }}>
            <strong style={{ fontSize: '0.8125rem', display: 'block', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userBadge.label}
            </strong>
             <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userBadge.value}
            </span>
          </div>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={toggleTheme}
            style={{
              padding: '1rem',
              borderRadius: '16px',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: isCollapsed ? '0' : '1rem',
              background: 'var(--glass)',
              border: '1px solid var(--border)',
              width: '100%'
            }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>Theme Toggle</span>}
          </button>

          <button
            onClick={onLogout}
            style={{
              padding: '1rem',
              borderRadius: '16px',
              color: 'var(--danger)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: isCollapsed ? '0' : '1rem',
              background: 'rgba(239, 68, 68, 0.03)',
              border: '1px solid rgba(239, 68, 68, 0.1)',
              width: '100%'
            }}
          >
            <LogOut size={16} />
            {!isCollapsed && <span>Logout</span>}
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
        .sidebar-container::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar-container::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-container::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.2);
          border-radius: 10px;
        }
        .sidebar-container::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.4);
        }
        @media (max-width: 1024px) {
          .sidebar-container { 
            width: 280px !important;
            transform: ${isOpen ? 'translateX(0)' : 'translateX(-100%)'} !important;
            box-shadow: ${isOpen ? '20px 0 50px rgba(0,0,0,0.5)' : 'none'} !important;
          }
        }
      `}} />
    </>
  );
};
