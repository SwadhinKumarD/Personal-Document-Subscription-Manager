import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  Calendar, 
  Bell, 
  Sun, 
  Moon, 
  Settings as SettingsIcon, 
  Menu, 
  X, 
  Search, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Layers
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const { 
    theme, 
    setTheme, 
    currency, 
    setCurrency, 
    notifications, 
    markNotificationAsRead, 
    clearAllNotifications,
    documents,
    subscriptions
  } = useAppStore();
  
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close sidebars/dropdowns on path changes
  useEffect(() => {
    setMobileOpen(false);
    setNotifOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
  }, [location.pathname]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update theme class on HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    INR: '₹',
    GBP: '£'
  };
  const sym = currencySymbols[currency] || '$';

  const matchedDocs = searchQuery
    ? documents.filter(d => 
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        d.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.notes.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const matchedSubs = searchQuery
    ? subscriptions.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.notes.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle size={16} style={{ color: 'var(--warning)' }} />;
      case 'danger':
        return <X size={16} style={{ color: 'var(--danger)' }} />;
      case 'success':
        return <CheckCircle size={16} style={{ color: 'var(--success)' }} />;
      case 'info':
      default:
        return <AlertCircle size={16} style={{ color: 'var(--info)' }} />;
    }
  };

  const formatNotifTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const diffMs = Date.now() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="app-container">
      {/* Background Blobs for Glassmorphism */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>

      {/* Mobile Nav Toggle */}
      <button 
        className="mobile-nav-toggle btn-icon" 
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{ position: 'fixed', top: '15px', left: '15px', zIndex: 110, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
        aria-label="Toggle navigation menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <Layers size={24} />
          <span>KeepSafe</span>
        </div>
        <nav className="sidebar-menu">
          <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} end>
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </NavLink>
          <NavLink to="/documents" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FileText size={18} />
            <span>Documents</span>
          </NavLink>
          <NavLink to="/subscriptions" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <CreditCard size={18} />
            <span>Subscriptions</span>
          </NavLink>
          <NavLink to="/calendar" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Calendar size={18} />
            <span>Calendar</span>
          </NavLink>
          <NavLink to="/reminders" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Clock size={18} />
            <span>Reminders</span>
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <SettingsIcon size={18} />
            <span>Settings</span>
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
              JD
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>John Doe</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Premium User</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="main-content-wrapper">
        <header className="header">
          {/* Spacer for mobile menu button */}
          <div style={{ width: '40px' }} className="mobile-nav-toggle"></div>
          
          <div className="header-search" ref={searchRef}>
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search across documents and bills..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
            />
            
            {searchOpen && searchQuery && (
              <div className="search-dropdown">
                {/* Documents section */}
                {matchedDocs.length > 0 && (
                  <div>
                    <div className="search-section-header">Documents</div>
                    {matchedDocs.map(doc => (
                      <div 
                        key={doc.id} 
                        className="search-item" 
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                          navigate(`/documents/${doc.id}`);
                        }}
                      >
                        <FileText size={16} style={{ color: 'var(--brand-primary)' }} />
                        <div>
                          <div className="search-item-title">{doc.title}</div>
                          <div className="search-item-meta">{doc.category} • {doc.provider}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Subscriptions section */}
                {matchedSubs.length > 0 && (
                  <div>
                    <div className="search-section-header">Subscriptions</div>
                    {matchedSubs.map(sub => (
                      <div 
                        key={sub.id} 
                        className="search-item" 
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                          navigate(`/subscriptions/${sub.id}`);
                        }}
                      >
                        <CreditCard size={16} style={{ color: 'var(--success)' }} />
                        <div>
                          <div className="search-item-title">{sub.name}</div>
                          <div className="search-item-meta">{sub.category} • {sym}{sub.amount.toFixed(2)}/{sub.billingCycle}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {matchedDocs.length === 0 && matchedSubs.length === 0 && (
                  <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    No matches found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="header-actions">
            {/* Currency Selector */}
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="currency-select"
              aria-label="Select currency"
            >
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="INR">₹ INR</option>
              <option value="GBP">£ GBP</option>
            </select>

            {/* Theme Toggle */}
            <button className="btn-icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notification Bell */}
            <div className="notif-wrapper" ref={notifRef}>
              <button className="btn-icon" onClick={() => setNotifOpen(!notifOpen)} aria-label="Notifications">
                <Bell size={18} />
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
              </button>

              {notifOpen && (
                <div className="notif-dropdown">
                  <div className="notif-dropdown-header">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <button 
                        style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: '600' }}
                        onClick={clearAllNotifications}
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="notif-list">
                    {notifications.length === 0 ? (
                      <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        No new notifications
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          className={`notif-item ${!notif.read ? 'unread' : ''}`}
                          onClick={() => markNotificationAsRead(notif.id)}
                          style={{ cursor: 'pointer', position: 'relative' }}
                        >
                          {!notif.read && (
                            <span 
                              style={{ 
                                position: 'absolute', 
                                top: '12px', 
                                right: '12px', 
                                width: '6px', 
                                height: '6px', 
                                borderRadius: '50%', 
                                backgroundColor: 'var(--brand-primary)',
                                boxShadow: '0 0 6px var(--brand-primary)' 
                              }}
                            ></span>
                          )}
                          <div className="notif-item-icon" style={{ backgroundColor: `var(--${notif.type}-light)` }}>
                            {getNotifIcon(notif.type)}
                          </div>
                          <div className="notif-item-content" style={{ paddingRight: !notif.read ? '12px' : '0' }}>
                            <div className="notif-item-title">{notif.title}</div>
                            <div className="notif-item-text">{notif.message}</div>
                            <div className="notif-item-time">{formatNotifTime(notif.date)}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* View Pages Rendering */}
        <main className="page-container">
          {children}
        </main>
      </div>
    </div>
  );
};
