import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Archive, 
  RotateCcw, 
  Download, 
  Printer, 
  AlertCircle 
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { MockPreview } from '../components/MockPreview/MockPreview';
import { Modal } from '../components/Common/Modal';
import { DocumentForm } from '../components/Forms/DocumentForm';

export const DocumentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { documents, deleteDocument, archiveDocument, restoreDocument } = useAppStore();

  const [editModalOpen, setEditModalOpen] = useState(false);

  const doc = documents.find(d => d.id === id);

  if (!doc) {
    return (
      <div className="flex-center flex-column anim-fade" style={{ height: '70vh', gap: '1rem' }}>
        <AlertCircle size={48} style={{ color: 'var(--danger)' }} />
        <h2>Document Not Found</h2>
        <p style={{ color: 'var(--text-secondary)' }}>The document record may have been deleted.</p>
        <Link to="/documents" className="btn btn-primary">
          Back to Vault
        </Link>
      </div>
    );
  }

  // Calculate Expiry Progress Tracker
  const issue = new Date(doc.issueDate).getTime();
  const expiry = new Date(doc.expiryDate).getTime();
  const now = new Date().getTime();
  
  const totalDuration = expiry - issue;
  const elapsed = now - issue;
  
  let percentElapsed = 0;
  if (totalDuration > 0) {
    percentElapsed = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
  }

  const daysRemaining = Math.ceil((expiry - now) / (1000 * 3600 * 24));

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${doc.title}"?`)) {
      deleteDocument(doc.id);
      navigate('/documents');
    }
  };

  const handleArchive = () => {
    archiveDocument(doc.id);
  };

  const handleRestore = () => {
    restoreDocument(doc.id);
  };

  const handleDownload = () => {
    alert(`Downloading mock file: "${doc.fileName || `${doc.title.toLowerCase()}_mock.${doc.fileType || 'pdf'}`}"`);
  };

  const handlePrint = () => {
    alert(`Initializing print layout for: "${doc.title}"`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="anim-fade">
      {/* Back navigation & Actions Header */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <button 
          onClick={() => navigate('/documents')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--brand-primary)' }}
        >
          <ArrowLeft size={16} /> Back to Vault
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => setEditModalOpen(true)}>
            <Edit size={16} /> Edit
          </button>
          
          {doc.status === 'archived' ? (
            <button className="btn btn-secondary" onClick={handleRestore}>
              <RotateCcw size={16} /> Restore
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={handleArchive}>
              <Archive size={16} /> Archive
            </button>
          )}

          <button className="btn btn-danger" onClick={handleDelete}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid-2">
        {/* Left Column: Details panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Card Info */}
          <div className="card flex-column" style={{ gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="badge badge-info">{doc.category}</span>
                <span className={`badge ${
                  doc.status === 'active' ? 'badge-success' : 
                  doc.status === 'expiring' ? 'badge-warning' : 
                  doc.status === 'expired' ? 'badge-danger' : 
                  'badge-secondary'
                }`}>{doc.status}</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{doc.title}</h2>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Issued by {doc.provider}
              </div>
            </div>

            {/* Details Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              {doc.policyNumber && (
                <div className="flex-between">
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Policy / Reference #</span>
                  <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{doc.policyNumber}</span>
                </div>
              )}
              <div className="flex-between">
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Issue Date</span>
                <span style={{ fontWeight: 500 }}>{doc.issueDate}</span>
              </div>
              <div className="flex-between">
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Expiry Date</span>
                <span style={{ fontWeight: 500 }}>{doc.expiryDate}</span>
              </div>
              <div className="flex-between">
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Remaining Validity</span>
                <span style={{ 
                  fontWeight: 600, 
                  color: daysRemaining <= 0 ? 'var(--danger)' : daysRemaining <= 30 ? 'var(--warning)' : 'var(--success)'
                }}>
                  {daysRemaining <= 0 ? 'Expired' : `${daysRemaining} days`}
                </span>
              </div>
            </div>

            {/* Validity Timeline tracker */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <div className="flex-between" style={{ fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Validity Tracker</span>
                <span style={{ fontWeight: 600 }}>{percentElapsed.toFixed(0)}% elapsed</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${percentElapsed}%`, 
                    height: '100%', 
                    backgroundColor: percentElapsed >= 90 ? 'var(--danger)' : percentElapsed >= 75 ? 'var(--warning)' : 'var(--success)',
                    borderRadius: 'var(--radius-full)'
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Notes Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Description & Remarks</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
              {doc.notes || 'No description notes provided for this record.'}
            </p>
          </div>

        </div>

        {/* Right Column: Mock File Previewer */}
        <div className="card flex-column" style={{ gap: '1.5rem', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Document Preview</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Simulated sandbox visualization of your registered credential.
            </p>
            <MockPreview 
              title={doc.title} 
              category={doc.category} 
              provider={doc.provider} 
              policyNumber={doc.policyNumber}
              fileType={doc.fileType}
              fileName={doc.fileName}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleDownload}>
              <Download size={16} /> Download
            </button>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handlePrint}>
              <Printer size={16} /> Print
            </button>
          </div>
        </div>
      </div>

      {/* Edit Document Modal */}
      <Modal 
        isOpen={editModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        title="Edit Document Info"
      >
        <DocumentForm documentId={doc.id} onClose={() => setEditModalOpen(false)} />
      </Modal>
    </div>
  );
};
