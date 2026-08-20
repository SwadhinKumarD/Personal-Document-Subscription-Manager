import React from 'react';
import { File, Image as ImageIcon, ShieldAlert, Award, FileSpreadsheet } from 'lucide-react';

interface MockPreviewProps {
  title: string;
  category: string;
  provider: string;
  policyNumber?: string;
  fileType?: 'pdf' | 'image' | 'doc';
  fileName?: string;
}

export const MockPreview: React.FC<MockPreviewProps> = ({ 
  title, 
  category, 
  provider, 
  policyNumber, 
  fileType = 'pdf', 
  fileName 
}) => {
  
  const getCategoryColor = () => {
    switch (category) {
      case 'Identity': return '#0ea5e9'; // sky
      case 'Insurance': return '#f59e0b'; // amber
      case 'Certificate': return '#10b981'; // emerald
      case 'Warranty': return '#6366f1'; // indigo
      default: return '#64748b'; // slate
    }
  };

  const getDocTypeIcon = () => {
    switch (fileType) {
      case 'image':
        return <ImageIcon size={32} style={{ color: getCategoryColor() }} />;
      case 'doc':
        return <FileSpreadsheet size={32} style={{ color: getCategoryColor() }} />;
      case 'pdf':
      default:
        return <File size={32} style={{ color: getCategoryColor() }} />;
    }
  };

  return (
    <div 
      style={{ 
        width: '100%', 
        backgroundColor: 'var(--bg-tertiary)', 
        border: '1px solid var(--border-color)', 
        borderRadius: 'var(--radius-md)', 
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
      }}
    >
      {/* File Header Tab */}
      <div 
        className="flex-between" 
        style={{ 
          width: '100%', 
          backgroundColor: 'var(--bg-secondary)', 
          padding: '0.6rem 1rem', 
          borderRadius: 'var(--radius-xs)', 
          border: '1px solid var(--border-color)',
          fontSize: '0.85rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
          {getDocTypeIcon()}
          <span style={{ color: 'var(--text-primary)', wordBreak: 'break-all' }}>
            {fileName || `${title.toLowerCase().replace(/\s+/g, '_')}_mock.${fileType}`}
          </span>
        </div>
        <span style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, fontSize: '0.75rem' }}>
          {fileType}
        </span>
      </div>

      {/* Visual Canvas Representation */}
      <div 
        style={{ 
          width: '100%', 
          aspectRatio: '8.5 / 11', // A4 ratio
          maxHeight: '380px',
          backgroundColor: '#ffffff', 
          color: '#1e293b', 
          borderRadius: 'var(--radius-sm)',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          borderTop: `6px solid ${getCategoryColor()}`
        }}
      >
        {/* Certificate/Document watermark */}
        <div 
          style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%) rotate(-30deg)', 
            fontSize: '5rem', 
            fontWeight: 800, 
            opacity: 0.04, 
            userSelect: 'none', 
            pointerEvents: 'none',
            color: getCategoryColor()
          }}
        >
          {category.toUpperCase()}
        </div>

        {/* Content Top */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center' }}>
          <div style={{ color: getCategoryColor(), opacity: 0.9 }}>
            {category === 'Certificate' ? <Award size={48} /> : <ShieldAlert size={48} />}
          </div>
          <div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Official Record
            </h4>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
              ISSUED BY: {provider.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Content Middle */}
        <div style={{ margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderBottom: '1px dashed #cbd5e1', borderTop: '1px dashed #cbd5e1', padding: '1rem 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
            <span style={{ color: '#64748b', fontWeight: 600 }}>RECORD NAME:</span>
            <span style={{ fontWeight: 700 }}>{title}</span>
          </div>
          {policyNumber && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>REFERENCE ID:</span>
              <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{policyNumber}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
            <span style={{ color: '#64748b', fontWeight: 600 }}>CATEGORY:</span>
            <span style={{ fontWeight: 700, color: getCategoryColor() }}>{category}</span>
          </div>
        </div>

        {/* Content Bottom */}
        <div className="flex-between" style={{ fontSize: '0.7rem' }}>
          <div>
            <div style={{ color: '#64748b', fontWeight: 600 }}>SIGNATURE AUTH</div>
            <div style={{ fontStyle: 'italic', fontWeight: 700, marginTop: '0.15rem' }}>{provider.split(' ')[0]} Official</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#64748b', fontWeight: 600 }}>SYSTEM VERIFIED</div>
            <div style={{ color: '#10b981', fontWeight: 700, marginTop: '0.15rem' }}>✓ SECURE</div>
          </div>
        </div>
      </div>
    </div>
  );
};
