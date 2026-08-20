import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Calendar, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Modal } from '../components/Common/Modal';
import { SubscriptionForm } from '../components/Forms/SubscriptionForm';

export const SubscriptionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    subscriptions, 
    deleteSubscription, 
    toggleSubscriptionStatus, 
    currency 
  } = useAppStore();

  const [editModalOpen, setEditModalOpen] = useState(false);

  const sub = subscriptions.find(s => s.id === id);

  if (!sub) {
    return (
      <div className="flex-center flex-column anim-fade" style={{ height: '70vh', gap: '1rem' }}>
        <AlertCircle size={48} style={{ color: 'var(--danger)' }} />
        <h2>Subscription Not Found</h2>
        <p style={{ color: 'var(--text-secondary)' }}>The subscription may have been deleted.</p>
        <Link to="/subscriptions" className="btn btn-primary">
          Back to Subscriptions
        </Link>
      </div>
    );
  }

  // Currency symbols
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    INR: '₹',
    GBP: '£'
  };
  const sym = currencySymbols[currency] || '$';

  const isPaused = sub.status === 'paused';

  // Calculate projected costs
  const calculateCostForPeriod = (months: number) => {
    if (isPaused) return 0;
    if (sub.billingCycle === 'monthly') {
      return sub.amount * months;
    } else {
      // Yearly
      return (sub.amount / 12) * months;
    }
  };

  const getDaysDiff = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    if (days < 0) return `${Math.abs(days)} days ago`;
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `In ${days} days`;
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${sub.name}"?`)) {
      deleteSubscription(sub.id);
      navigate('/subscriptions');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="anim-fade">
      
      {/* Header back & action controls */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <button 
          onClick={() => navigate('/subscriptions')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--brand-primary)' }}
        >
          <ArrowLeft size={16} /> Back to Subscriptions
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => setEditModalOpen(true)}>
            <Edit size={16} /> Edit
          </button>
          
          <button 
            className={`btn ${isPaused ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => toggleSubscriptionStatus(sub.id)}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
            {isPaused ? 'Resume Plan' : 'Pause Plan'}
          </button>

          <button className="btn btn-danger" onClick={handleDelete}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      {/* Main split grid */}
      <div className="grid-2">
        {/* Left Column: Plan Specifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Main Info Card */}
          <div className="card flex-column" style={{ gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="badge badge-info">{sub.category}</span>
                <span className={`badge ${isPaused ? 'badge-secondary' : 'badge-success'}`}>
                  {sub.status}
                </span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{sub.name}</h2>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--text-primary)' }}>
                {sym}{sub.amount.toFixed(2)}
                <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  /{sub.billingCycle}
                </span>
              </div>
            </div>

            {/* Config Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <div className="flex-between">
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Billing Frequency</span>
                <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{sub.billingCycle}</span>
              </div>
              <div className="flex-between">
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Current Status</span>
                <span style={{ fontWeight: 600, color: isPaused ? 'var(--text-tertiary)' : 'var(--success)' }}>
                  {isPaused ? 'Paused (Suspended)' : 'Active (Paying)'}
                </span>
              </div>
              <div className="flex-between">
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Next Billing Date</span>
                <span style={{ fontWeight: 500 }}>{sub.nextBillingDate}</span>
              </div>
              {!isPaused && (
                <div className="flex-between">
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Next Charge Due</span>
                  <span style={{ fontWeight: 600, color: 'var(--brand-primary)' }}>
                    {getDaysDiff(sub.nextBillingDate)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Remarks Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Notes & Billing Details</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
              {sub.notes || 'No description notes saved for this subscription plan.'}
            </p>
          </div>

        </div>

        {/* Right Column: Lifetime Spend Calculator Projections */}
        <div className="card flex-column" style={{ gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} style={{ color: 'var(--brand-primary)' }} />
              Projected Cost Projections
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Projected accumulation totals assuming subscription billing remains active.
            </p>
            
            {isPaused ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                This plan is currently paused. Resume billing to enable projections.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div className="flex-between" style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-xs)' }}>
                  <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>6 Months</span>
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>{sym}{calculateCostForPeriod(6).toFixed(2)}</span>
                </div>
                <div className="flex-between" style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-xs)' }}>
                  <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>1 Year (12 months)</span>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--brand-primary)' }}>{sym}{calculateCostForPeriod(12).toFixed(2)}</span>
                </div>
                <div className="flex-between" style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-xs)' }}>
                  <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>3 Years</span>
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>{sym}{calculateCostForPeriod(36).toFixed(2)}</span>
                </div>
                <div className="flex-between" style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-xs)' }}>
                  <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>5 Years</span>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--success)' }}>{sym}{calculateCostForPeriod(60).toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={14} />
            <span>Billing cycle resets on the same day of each interval.</span>
          </div>
        </div>

      </div>

      {/* Edit Subscription Modal */}
      <Modal 
        isOpen={editModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        title="Edit Subscription Details"
      >
        <SubscriptionForm subscriptionId={sub.id} onClose={() => setEditModalOpen(false)} />
      </Modal>

    </div>
  );
};
