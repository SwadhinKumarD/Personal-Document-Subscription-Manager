import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

interface SubscriptionFormProps {
  onClose: () => void;
  subscriptionId?: string; // If editing
}

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ onClose, subscriptionId }) => {
  const { subscriptions, addSubscription, updateSubscription } = useAppStore();
  const editSub = subscriptionId ? subscriptions.find(s => s.id === subscriptionId) : undefined;

  const [name, setName] = useState(editSub?.name || '');
  const [category, setCategory] = useState<any>(editSub?.category || 'Entertainment');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(editSub?.billingCycle || 'monthly');
  const [amount, setAmount] = useState<string>(editSub?.amount ? String(editSub.amount) : '');
  const [nextBillingDate, setNextBillingDate] = useState(editSub?.nextBillingDate || '');
  const [status, setStatus] = useState<'active' | 'paused'>(editSub?.status || 'active');
  const [notes, setNotes] = useState(editSub?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !nextBillingDate) {
      alert('Please fill out all required fields.');
      return;
    }

    const payload = {
      name,
      category,
      billingCycle,
      amount: parseFloat(amount),
      nextBillingDate,
      status,
      notes
    };

    if (editSub) {
      updateSubscription(editSub.id, payload);
    } else {
      addSubscription(payload);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="form-group">
        <label className="form-label">Subscription Name *</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="form-control" 
          placeholder="e.g. Netflix Family" 
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
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Software">Software</option>
            <option value="Health">Health</option>
            <option value="Finance">Finance</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Billing Cycle *</label>
          <select 
            value={billingCycle} 
            onChange={(e: any) => setBillingCycle(e.target.value)} 
            className="form-control"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Amount *</label>
          <input 
            type="number" 
            step="0.01"
            min="0"
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            className="form-control" 
            placeholder="e.g. 14.99"
            required 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Next Billing Date *</label>
          <input 
            type="date" 
            value={nextBillingDate} 
            onChange={(e) => setNextBillingDate(e.target.value)} 
            className="form-control" 
            required 
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Initial Status</label>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.25rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input 
              type="radio" 
              name="status" 
              checked={status === 'active'} 
              onChange={() => setStatus('active')} 
            />
            <span>Active</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input 
              type="radio" 
              name="status" 
              checked={status === 'paused'} 
              onChange={() => setStatus('paused')} 
            />
            <span>Paused / Suspended</span>
          </label>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Notes</label>
        <textarea 
          value={notes} 
          onChange={(e) => setNotes(e.target.value)} 
          className="form-control" 
          placeholder="e.g. Auto-renew credit card ending in 4102..."
          rows={3}
          style={{ resize: 'vertical' }}
        />
      </div>

      <div className="modal-footer" style={{ borderTop: 'none', padding: '1rem 0 0 0' }}>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {editSub ? 'Save Changes' : 'Add Subscription'}
        </button>
      </div>
    </form>
  );
};
