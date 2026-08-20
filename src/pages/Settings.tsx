import React, { useRef } from 'react';
import { 
  Sun, 
  Moon, 
  Download, 
  Upload, 
  RefreshCw, 
  Keyboard, 
  HelpCircle,
  Settings as SettingsIcon,
  Globe
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const Settings: React.FC = () => {
  const { 
    theme, 
    setTheme, 
    currency, 
    setCurrency, 
    documents, 
    subscriptions, 
    reminders, 
    importData, 
    resetToDefault 
  } = useAppStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle data export
  const handleExport = () => {
    const dataStr = JSON.stringify({ documents, subscriptions, reminders }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `keepsafe_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle data import
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.documents && parsed.subscriptions && parsed.reminders) {
          importData({
            documents: parsed.documents,
            subscriptions: parsed.subscriptions,
            reminders: parsed.reminders
          });
          alert('Data imported successfully! The dashboard has been updated.');
        } else {
          alert('Invalid backup structure. The file must contain documents, subscriptions, and reminders.');
        }
      } catch (err) {
        alert('Failed to parse file. Ensure it is a valid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Restore system default mock data? All your custom records will be overwritten.')) {
      resetToDefault();
      alert('Mock database restored to system defaults.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="anim-fade">
      
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
          Application Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Customize interface settings, export local backups, or restore default values.
        </p>
      </div>

      <div className="grid-2">
        
        {/* Left Column: Preference Configuration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Card: Theme & Language */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={18} style={{ color: 'var(--brand-primary)' }} />
              User Preferences
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Theme Toggles */}
              <div className="flex-between">
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Appearance Theme</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Toggle between light and dark modes.</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', padding: '2px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-xs)' }}>
                  <button 
                    onClick={() => setTheme('light')}
                    className="btn btn-sm"
                    style={{ 
                      padding: '0.4rem 0.6rem', 
                      backgroundColor: theme === 'light' ? 'var(--bg-secondary)' : 'transparent',
                      color: theme === 'light' ? 'var(--text-primary)' : 'var(--text-secondary)',
                      boxShadow: theme === 'light' ? 'var(--shadow-sm)' : 'none'
                    }}
                  >
                    <Sun size={14} /> <span style={{ marginLeft: '4px', fontSize: '0.8rem' }}>Light</span>
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className="btn btn-sm"
                    style={{ 
                      padding: '0.4rem 0.6rem', 
                      backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : 'transparent',
                      color: theme === 'dark' ? 'var(--text-primary)' : 'var(--text-secondary)',
                      boxShadow: theme === 'dark' ? 'var(--shadow-sm)' : 'none'
                    }}
                  >
                    <Moon size={14} /> <span style={{ marginLeft: '4px', fontSize: '0.8rem' }}>Dark</span>
                  </button>
                </div>
              </div>

              {/* Currency Selector */}
              <div className="flex-between" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Billing Currency</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Modify display symbol for spend analytics.</div>
                </div>
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)}
                  className="form-control"
                  style={{ width: '120px', padding: '0.4rem' }}
                >
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                  <option value="INR">₹ INR</option>
                  <option value="GBP">£ GBP</option>
                </select>
              </div>

            </div>
          </div>

          {/* Card: System Shortcuts (Bonus requirement) */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Keyboard size={18} style={{ color: 'var(--info)' }} />
              Keyboard Shortcuts Guide
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Go to Overview Dashboard</span>
                <span style={{ fontFamily: 'monospace', padding: '0.15rem 0.4rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-color)' }}>Shift + O</span>
              </div>
              <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Go to Documents Vault</span>
                <span style={{ fontFamily: 'monospace', padding: '0.15rem 0.4rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-color)' }}>Shift + D</span>
              </div>
              <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Go to Subscriptions</span>
                <span style={{ fontFamily: 'monospace', padding: '0.15rem 0.4rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-color)' }}>Shift + S</span>
              </div>
              <div className="flex-between">
                <span style={{ color: 'var(--text-secondary)' }}>Close open Modals / Dialogs</span>
                <span style={{ fontFamily: 'monospace', padding: '0.15rem 0.4rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-color)' }}>Esc</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Database backup & portability */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card flex-column" style={{ gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <SettingsIcon size={18} style={{ color: 'var(--warning)' }} />
              Database Management
            </h3>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              KeepSafe saves data locally inside your browser cache. You can backup your registered records or restore a mock sandbox environment.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.5rem' }}>
              {/* Export Button */}
              <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={handleExport}>
                <Download size={16} /> Export Backup (JSON)
              </button>

              {/* Import Button */}
              <button 
                className="btn btn-secondary" 
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={16} /> Import Backup (JSON)
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImport} 
                accept=".json" 
                style={{ display: 'none' }} 
              />

              {/* Reset System Database */}
              <button 
                className="btn btn-secondary" 
                style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--danger)' }}
                onClick={handleReset}
              >
                <RefreshCw size={16} /> Reset Default Mock Data
              </button>
            </div>
          </div>

          {/* Help & Support Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={18} style={{ color: 'var(--success)' }} />
              Sandbox Environment Info
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              This application is configured as a standalone frontend demo. LocalStorage persistence is active, ensuring your entries, paused/active flags, and alerts are retained when you restart the browser.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
