import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Folder, 
  Trash2, 
  Archive, 
  RefreshCw, 
  Eye, 
  Plus, 
  MoreVertical
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { EmptyState } from '../components/Common/EmptyState';
import { Modal } from '../components/Common/Modal';
import { DocumentForm } from '../components/Forms/DocumentForm';

export const Documents: React.FC = () => {
  const navigate = useNavigate();
  const { documents, deleteDocument, archiveDocument, restoreDocument } = useAppStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  
  // Bulk selection states
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [isBulkSelecting, setIsBulkSelecting] = useState(false);

  const categories = ['All', 'Identity', 'Insurance', 'Certificate', 'Warranty', 'Membership', 'Other'];
  const statuses = ['All', 'active', 'expiring', 'expired', 'archived'];

  // Handle filtering
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    
    // Status match
    const matchesStatus = selectedStatus === 'All' || doc.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const toggleSelectDoc = (id: string) => {
    setSelectedDocIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocIds.length === filteredDocs.length) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(filteredDocs.map(d => d.id));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete these ${selectedDocIds.length} records?`)) {
      selectedDocIds.forEach(id => deleteDocument(id));
      setSelectedDocIds([]);
      setIsBulkSelecting(false);
    }
  };

  const handleBulkArchive = () => {
    selectedDocIds.forEach(id => archiveDocument(id));
    setSelectedDocIds([]);
    setIsBulkSelecting(false);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active': return 'badge-success';
      case 'expiring': return 'badge-warning';
      case 'expired': return 'badge-danger';
      case 'archived': return 'badge-secondary';
      default: return 'badge-info';
    }
  };

  const getDocIcon = (category: string) => {
    switch (category) {
      case 'Identity':
        return <Folder style={{ color: 'var(--info)' }} size={24} />;
      case 'Insurance':
        return <Folder style={{ color: 'var(--warning)' }} size={24} />;
      case 'Certificate':
        return <Folder style={{ color: 'var(--success)' }} size={24} />;
      case 'Warranty':
        return <Folder style={{ color: 'var(--brand-primary)' }} size={24} />;
      default:
        return <Folder style={{ color: 'var(--text-tertiary)' }} size={24} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="anim-fade">
      {/* Page Header */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Documents Vault
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Keep track of warranties, insurance policies, IDs, and certificates.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {isBulkSelecting ? (
            <>
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setIsBulkSelecting(false);
                  setSelectedDocIds([]);
                }}
              >
                Cancel
              </button>
              {selectedDocIds.length > 0 && (
                <>
                  <button className="btn btn-secondary" onClick={handleBulkArchive}>
                    <Archive size={16} /> Archive Selected
                  </button>
                  <button className="btn btn-danger" onClick={handleBulkDelete}>
                    <Trash2 size={16} /> Delete Selected
                  </button>
                </>
              )}
            </>
          ) : (
            <button className="btn btn-secondary" onClick={() => setIsBulkSelecting(true)}>
              Bulk Action
            </button>
          )}
          <button className="btn btn-primary" onClick={() => setAddModalOpen(true)}>
            <Plus size={16} /> Add Document
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          
          {/* Search Box */}
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input 
              type="text" 
              placeholder="Search by title, issuer, notes..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.5rem' }} 
            />
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Category:</span>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-control"
              style={{ width: '130px', padding: '0.5rem' }}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status:</span>
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="form-control"
              style={{ width: '130px', padding: '0.5rem' }}
            >
              {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Status' : s.toUpperCase()}</option>)}
            </select>
          </div>

        </div>
      </div>

      {/* Select All Bar (when bulk selecting) */}
      {isBulkSelecting && filteredDocs.length > 0 && (
        <div className="flex-between" style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--brand-primary-light)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-color)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem' }}>
            <input 
              type="checkbox" 
              checked={selectedDocIds.length === filteredDocs.length} 
              onChange={handleSelectAll} 
            />
            <span>Select All {filteredDocs.length} items</span>
          </label>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{selectedDocIds.length} Selected</span>
        </div>
      )}

      {/* Documents Grid */}
      {filteredDocs.length === 0 ? (
        <EmptyState 
          title="No Documents Found" 
          description="Try relaxing your search terms or category filters, or add a new document to your vault."
          icon="documents"
          actionButton={
            <button className="btn btn-primary" onClick={() => setAddModalOpen(true)}>
              <Plus size={16} /> Add First Document
            </button>
          }
        />
      ) : (
        <div className="grid-3">
          {filteredDocs.map(doc => {
            const isSelected = selectedDocIds.includes(doc.id);
            return (
              <div 
                key={doc.id} 
                className="card" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1rem',
                  position: 'relative',
                  border: isSelected ? '2px solid var(--brand-primary)' : '1px solid var(--border-color)'
                }}
              >
                {/* Checkbox (Bulk mode) or Category Folder Icon */}
                <div className="flex-between">
                  {isBulkSelecting ? (
                    <input 
                      type="checkbox" 
                      checked={isSelected} 
                      onChange={() => toggleSelectDoc(doc.id)} 
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                  ) : (
                    getDocIcon(doc.category)
                  )}
                  
                  <span className={`badge ${getStatusBadgeClass(doc.status)}`}>
                    {doc.status}
                  </span>
                </div>

                <div 
                  onClick={() => !isBulkSelecting && navigate(`/documents/${doc.id}`)}
                  style={{ cursor: isBulkSelecting ? 'default' : 'pointer', flex: 1 }}
                >
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.25rem' }}>{doc.title}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    {doc.provider} {doc.policyNumber ? `• Ref: ${doc.policyNumber}` : ''}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.5rem', lineHeight: '1.4' }}>
                    {doc.notes || 'No description provided.'}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }} className="flex-between">
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    Expires: {doc.expiryDate}
                  </span>
                  
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button 
                      className="btn-icon" 
                      onClick={() => navigate(`/documents/${doc.id}`)} 
                      title="View Details"
                      style={{ width: '2rem', height: '2rem' }}
                    >
                      <Eye size={14} />
                    </button>
                    <button 
                      className="btn-icon" 
                      onClick={() => setEditingDocId(doc.id)} 
                      title="Edit"
                      style={{ width: '2rem', height: '2rem' }}
                    >
                      <MoreVertical size={14} />
                    </button>
                    {doc.status === 'archived' ? (
                      <button 
                        className="btn-icon" 
                        onClick={() => restoreDocument(doc.id)} 
                        title="Restore"
                        style={{ width: '2rem', height: '2rem' }}
                      >
                        <RefreshCw size={14} />
                      </button>
                    ) : (
                      <button 
                        className="btn-icon" 
                        onClick={() => archiveDocument(doc.id)} 
                        title="Archive"
                        style={{ width: '2rem', height: '2rem' }}
                      >
                        <Archive size={14} />
                      </button>
                    )}
                    <button 
                      className="btn-icon" 
                      onClick={() => {
                        if (confirm(`Delete document "${doc.title}"?`)) deleteDocument(doc.id);
                      }} 
                      title="Delete"
                      style={{ width: '2rem', height: '2rem', color: 'var(--danger)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Document Modal */}
      <Modal 
        isOpen={addModalOpen} 
        onClose={() => setAddModalOpen(false)} 
        title="Add Important Document"
      >
        <DocumentForm onClose={() => setAddModalOpen(false)} />
      </Modal>

      {/* Edit Document Modal */}
      <Modal 
        isOpen={editingDocId !== null} 
        onClose={() => setEditingDocId(null)} 
        title="Edit Document Info"
      >
        {editingDocId && (
          <DocumentForm 
            documentId={editingDocId} 
            onClose={() => setEditingDocId(null)} 
          />
        )}
      </Modal>
    </div>
  );
};
