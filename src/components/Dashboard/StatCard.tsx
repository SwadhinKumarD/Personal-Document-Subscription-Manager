import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    text: string;
    type: 'positive' | 'negative' | 'neutral';
  };
  colorClass?: string; // success, warning, danger, brand
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, colorClass = 'brand' }) => {
  const getBorderColor = () => {
    switch (colorClass) {
      case 'success': return 'var(--success)';
      case 'warning': return 'var(--warning)';
      case 'danger': return 'var(--danger)';
      case 'brand':
      default:
        return 'var(--brand-primary)';
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    if (trend.type === 'positive') return 'var(--success)';
    if (trend.type === 'negative') return 'var(--danger)';
    return 'var(--text-tertiary)';
  };

  return (
    <div 
      className="card" 
      style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        borderLeft: `4px solid ${getBorderColor()}`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </span>
        <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {value}
        </span>
        {trend && (
          <span style={{ fontSize: '0.8rem', fontWeight: 500, color: getTrendColor() }}>
            {trend.text}
          </span>
        )}
      </div>
      <div 
        style={{ 
          padding: '0.6rem', 
          borderRadius: 'var(--radius-sm)', 
          backgroundColor: `var(--${colorClass === 'brand' ? 'brand-primary' : colorClass}-light)`,
          color: getBorderColor(),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {icon}
      </div>
    </div>
  );
};
