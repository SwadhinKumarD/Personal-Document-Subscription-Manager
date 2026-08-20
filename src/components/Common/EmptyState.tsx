import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionButton?: React.ReactNode;
  icon?: 'documents' | 'subscriptions' | 'reminders';
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, actionButton, icon = 'documents' }) => {
  const renderIcon = () => {
    switch (icon) {
      case 'subscriptions':
        return (
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-tertiary)' }}>
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
        );
      case 'reminders':
        return (
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-tertiary)' }}>
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M16 2v4" />
            <path d="M8 2v4" />
            <path d="M3 10h18" />
            <path d="m9 16 2 2 4-4" />
          </svg>
        );
      case 'documents':
      default:
        return (
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-tertiary)' }}>
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M10 9H8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
          </svg>
        );
    }
  };

  return (
    <div className="flex-center flex-column" style={{ padding: '3.5rem 2rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        {renderIcon()}
      </div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{title}</h3>
      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '320px', marginBottom: '1.5rem', lineHeight: '1.4' }}>{description}</p>
      {actionButton}
    </div>
  );
};
