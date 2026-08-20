import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  TrendingUp, 
  DollarSign, 
  Percent
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { EmptyState } from '../components/Common/EmptyState';
import { Modal } from '../components/Common/Modal';
import { SubscriptionForm } from '../components/Forms/SubscriptionForm';

export const Subscriptions: React.FC = () => {
  const navigate = useNavigate();
  const { 
    subscriptions, 
    deleteSubscription, 
    toggleSubscriptionStatus, 
    currency 
  } = useAppStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCycle, setSelectedCycle] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingSubId, setEditingSubId] = useState<string | null>(null);

  const categories = ['All', 'Entertainment', 'Utilities', 'Software', 'Health', 'Finance', 'Other'];
  const cycles = ['All', 'monthly', 'yearly'];
  const statuses = ['All', 'active', 'paused'];

  // Currency symbols
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    INR: '₹',
    GBP: '£'
  };
  const sym = currencySymbols[currency] || '$';

  // Spending calculations
  const activeSubs = subscriptions.filter(s => s.status === 'active');
  
  const monthlySpend = activeSubs.reduce((acc, sub) => {
    return acc + (sub.billingCycle === 'monthly' ? sub.amount : sub.amount / 12);
  }, 0);

  const annualSpend = monthlySpend * 12;
  const avgCost = activeSubs.length > 0 ? monthlySpend / activeSubs.length : 0;

  // Filtering
  const filteredSubs = subscriptions.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          sub.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || sub.category === selectedCategory;
    const matchesCycle = selectedCycle === 'All' || sub.billingCycle === selectedCycle;
    const matchesStatus = selectedStatus === 'All' || sub.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesCycle && matchesStatus;
  });

  const getDaysDiff = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    if (days < 0) return `${Math.abs(days)} days ago`;
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `In ${days} days`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="anim-fade">
      
      {/* Page Header */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Subscription Manager
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Monitor billing cycles, pause inactive subscriptions, and track regular expenditures.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setAddModalOpen(true)}>
          <Plus size={16} /> Add Subscription
        </button>
      </div>

      {/* Spending Analytics Banner */}
      <div className="grid-3">
        <div className="card" style={{ borderLeft: '4px solid var(--brand-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Monthly Cost</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '0.25rem' }}>{sym}{monthlySpend.toFixed(2)}</div>
            </div>
            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--brand-primary-light)', color: 'var(--brand-primary)' }}>
              <TrendingUp size={20} />
            </div>
          </div>
        </div>
        
        <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Projected Annual</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '0.25rem' }}>{sym}{annualSpend.toFixed(2)}</div>
            </div>
            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--info)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Average Cost / Plan</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '0.25rem' }}>{sym}{avgCost.toFixed(2)}</div>
            </div>
            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--info-light)', color: 'var(--info)' }}>
              <Percent size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          
          {/* Search Box */}
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input 
              type="text" 
              placeholder="Search by subscription name..." 
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

          {/* Cycle Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Cycle:</span>
            <select 
              value={selectedCycle} 
              onChange={(e) => setSelectedCycle(e.target.value)}
              className="form-control"
              style={{ width: '110px', padding: '0.5rem' }}
            >
              {cycles.map(c => <option key={c} value={c}>{c === 'All' ? 'All cycles' : c.toUpperCase()}</option>)}
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status:</span>
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="form-control"
              style={{ width: '110px', padding: '0.5rem' }}
            >
              {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All status' : s.toUpperCase()}</option>)}
            </select>
          </div>

        </div>
      </div>

      {/* Subscription Grid list */}
      {filteredSubs.length === 0 ? (
        <EmptyState 
          title="No Subscriptions Configured" 
          description="Create your recurring billing records to unlock projection trackers and renewal warnings."
          icon="subscriptions"
          actionButton={
            <button className="btn btn-primary" onClick={() => setAddModalOpen(true)}>
              <Plus size={16} /> Add Subscription
            </button>
          }
        />
      ) : (
        <div className="grid-3">
          {filteredSubs.map(sub => {
            const isPaused = sub.status === 'paused';
            return (
              <div 
                key={sub.id} 
                className="card" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1rem',
                  opacity: isPaused ? 0.75 : 1,
                  transition: 'opacity var(--transition-fast)'
                }}
              >
                {/* Card Top: Category badge & Active status toggle switch */}
                <div className="flex-between">
                  <span className="badge badge-info">{sub.category}</span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isPaused ? 'var(--text-tertiary)' : 'var(--success)' }}>
                      {isPaused ? 'PAUSED' : 'ACTIVE'}
                    </span>
                    <label className="switch" aria-label="Toggle subscription status">
                      <input 
                        type="checkbox" 
                        checked={!isPaused} 
                        onChange={() => toggleSubscriptionStatus(sub.id)} 
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>

                {/* Card Title & cost details */}
                <div onClick={() => navigate(`/subscriptions/${sub.id}`)} style={{ cursor: 'pointer', flex: 1 }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>{sub.name}</h3>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'baseline', gap: '0.15rem' }}>
                    {sym}{sub.amount.toFixed(2)}
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                      /{sub.billingCycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', minHeight: '2.4rem', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {sub.notes || 'No description comments.'}
                  </p>
                </div>

                {/* Card Footer: Due dates & quick edits */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }} className="flex-between">
                  <div>
                    {!isPaused ? (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Next Bill Date</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--brand-primary)' }}>
                          {getDaysDiff(sub.nextBillingDate)}
                        </span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                        Renewal suspended
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button 
                      className="btn-icon" 
                      onClick={() => navigate(`/subscriptions/${sub.id}`)}
                      title="View Analytics"
                      style={{ width: '2rem', height: '2rem' }}
                    >
                      <Eye size={14} />
                    </button>
                    <button 
                      className="btn-icon" 
                      onClick={() => setEditingSubId(sub.id)}
                      title="Edit"
                      style={{ width: '2rem', height: '2rem' }}
                    >
                      <Edit size={14} />
                    </button>
                    <button 
                      className="btn-icon" 
                      onClick={() => {
                        if (confirm(`Remove subscription "${sub.name}"?`)) deleteSubscription(sub.id);
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

      {/* Add Subscription Modal */}
      <Modal 
        isOpen={addModalOpen} 
        onClose={() => setAddModalOpen(false)} 
        title="Add Recurring Subscription"
      >
        <SubscriptionForm onClose={() => setAddModalOpen(false)} />
      </Modal>

      {/* Edit Subscription Modal */}
      <Modal 
        isOpen={editingSubId !== null} 
        onClose={() => setEditingSubId(null)} 
        title="Edit Subscription Details"
      >
        {editingSubId && (
          <SubscriptionForm 
            subscriptionId={editingSubId} 
            onClose={() => setEditingSubId(null)} 
          />
        )}
      </Modal>

    </div>
  );
};
