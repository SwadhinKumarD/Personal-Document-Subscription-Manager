import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

interface DocumentFormProps {
  onClose: () => void;
  documentId?: string; // If editing
}

export const DocumentForm: React.FC<DocumentFormProps> = ({ onClose, documentId }) => {
  const { documents, addDocument, updateDocument } = useAppStore();
  const editDoc = documentId ? documents.find(d => d.id === documentId) : undefined;

  const [title, setTitle] = useState(editDoc?.title || '');
  const [category, setCategory] = useState<any>(editDoc?.category || 'Identity');
  const [issueDate, setIssueDate] = useState(editDoc?.issueDate || '');
  const [expiryDate, setExpiryDate] = useState(editDoc?.expiryDate || '');
  const [provider, setProvider] = useState(editDoc?.provider || '');
  const [policyNumber, setPolicyNumber] = useState(editDoc?.policyNumber || '');
  const [notes, setNotes] = useState(editDoc?.notes || '');
  const [fileType, setFileType] = useState<'pdf' | 'image' | 'doc'>(editDoc?.fileType || 'pdf');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !issueDate || !expiryDate || !provider) {
      alert('Please fill out all required fields.');
      return;
    }

    const payload = {
      title,
      category,
      issueDate,
      expiryDate,
      provider,
      policyNumber: policyNumber || undefined,
      notes,
      fileType,
      fileName: editDoc?.fileName || `${title.toLowerCase().replace(/\s+/g, '_')}_mock.${fileType}`
    };

    if (editDoc) {
      updateDocument(editDoc.id, payload);
    } else {
      addDocument(payload);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="form-group">
        <label className="form-label">Document Title *</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          className="form-control" 
          placeholder="e.g. Health Insurance Card" 
          required 
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Category *</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            className="form-control"
          >
            <option value="Identity">Identity</option>
            <option value="Insurance">Insurance</option>
            <option value="Certificate">Certificate</option>
            <option value="Warranty">Warranty</option>
            <option value="Membership">Membership</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Mock File Type *</label>
          <select 
            value={fileType} 
            onChange={(e: any) => setFileType(e.target.value)} 
            className="form-control"
          >
            <option value="pdf">PDF Document</option>
            <option value="image">PNG/JPG Image</option>
            <option value="doc">Word Document</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Issue Date *</label>
          <input 
            type="date" 
            value={issueDate} 
            onChange={(e) => setIssueDate(e.target.value)} 
            className="form-control" 
            required 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Expiry Date *</label>
          <input 
            type="date" 
            value={expiryDate} 
            onChange={(e) => setExpiryDate(e.target.value)} 
            className="form-control" 
            required 
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Provider/Issuer *</label>
          <input 
            type="text" 
            value={provider} 
            onChange={(e) => setProvider(e.target.value)} 
            className="form-control" 
            placeholder="e.g. State Department" 
            required 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Reference/Policy Number</label>
          <input 
            type="text" 
            value={policyNumber} 
            onChange={(e) => setPolicyNumber(e.target.value)} 
            className="form-control" 
            placeholder="e.g. AB-123456" 
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Notes</label>
        <textarea 
          value={notes} 
          onChange={(e) => setNotes(e.target.value)} 
          className="form-control" 
          placeholder="Add additional remarks or contact info..."
          rows={3}
          style={{ resize: 'vertical' }}
        />
      </div>

      <div className="modal-footer" style={{ borderTop: 'none', padding: '1rem 0 0 0' }}>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {editDoc ? 'Save Changes' : 'Create Record'}
        </button>
      </div>
    </form>
  );
};
