import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  CreditCard, 
  AlertTriangle, 
  TrendingUp, 
  Plus, 
  FolderOpen, 
  Clock
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { StatCard } from '../components/Dashboard/StatCard';
import { Modal } from '../components/Common/Modal';
import { DocumentForm } from '../components/Forms/DocumentForm';
import { SubscriptionForm } from '../components/Forms/SubscriptionForm';

export const Overview: React.FC = () => {
  const navigate = useNavigate();
  const { documents, subscriptions, currency } = useAppStore();
  
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [subModalOpen, setSubModalOpen] = useState(false);

  // Currency symbols
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    INR: '₹',
    GBP: '£'
  };
  const sym = currencySymbols[currency] || '$';

  // Calculations
  const activeSubs = subscriptions.filter(s => s.status === 'active');
  const monthlySpend = activeSubs.reduce((acc, sub) => {
    if (sub.billingCycle === 'monthly') return acc + sub.amount;
    return acc + (sub.amount / 12);
  }, 0);

  const expiringDocsCount = documents.filter(d => d.status === 'expiring' || d.status === 'expired').length;
  
  const expiringSoonDocs = documents
    .filter(d => d.status === 'expiring' || d.status === 'expired')
    .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
    .slice(0, 3);

  const upcomingRenewals = subscriptions
    .filter(s => s.status === 'active')
    .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime())
    .slice(0, 3);

  // Category spending breakdown
  const categorySpend: Record<string, number> = {};
  activeSubs.forEach(sub => {
    const amt = sub.billingCycle === 'monthly' ? sub.amount : sub.amount / 12;
    categorySpend[sub.category] = (categorySpend[sub.category] || 0) + amt;
  });

  const totalMonthlySpend = Object.values(categorySpend).reduce((a, b) => a + b, 0);

  const getUrgencyColor = (status: string) => {
    if (status === 'expired') return 'var(--danger)';
    if (status === 'expiring') return 'var(--warning)';
    return 'var(--text-tertiary)';
  };

  const getDaysDiff = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    if (days < 0) return `${Math.abs(days)} days ago`;
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `In ${days} days`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="anim-fade">
      {/* Welcome & Quick Action Header */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Overview Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Here is your subscription and document tracker status at a glance.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => setDocModalOpen(true)}>
            <Plus size={16} /> Add Document
          </button>
          <button className="btn btn-primary" onClick={() => setSubModalOpen(true)}>
            <Plus size={16} /> Add Subscription
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid-4">
        <StatCard 
          title="Monthly Spend" 
          value={`${sym}${monthlySpend.toFixed(2)}`} 
          icon={<TrendingUp size={20} />} 
          colorClass="brand" 
          trend={{ text: 'Based on active plans', type: 'neutral' }}
        />
        <StatCard 
          title="Active Subscriptions" 
          value={activeSubs.length} 
          icon={<CreditCard size={20} />} 
          colorClass="success"
          trend={{ text: `${subscriptions.length - activeSubs.length} paused subscriptions`, type: 'neutral' }}
        />
        <StatCard 
          title="Urgent Actions" 
          value={expiringDocsCount} 
          icon={<AlertTriangle size={20} />} 
          colorClass={expiringDocsCount > 0 ? "danger" : "success"}
          trend={{ text: 'Expirations & warnings', type: expiringDocsCount > 0 ? 'negative' : 'neutral' }}
        />
        <StatCard 
          title="Total Documents" 
          value={documents.filter(d => d.status !== 'archived').length} 
          icon={<FileText size={20} />} 
          colorClass="info"
          trend={{ text: 'Registered credentials', type: 'neutral' }}
        />
      </div>

      {/* Dashboard Columns (Split Layout) */}
      <div className="grid-2">
        {/* Expiring Documents panel */}
        <div className="card flex-column" style={{ gap: '1.25rem' }}>
          <div className="flex-between">
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <FileText size={18} style={{ color: 'var(--brand-primary)' }} />
              Expiring & Expired Documents
            </h2>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => navigate('/documents')}
              style={{ padding: '0.25rem 0.5rem' }}
            >
              View All
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {expiringSoonDocs.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                All documents are up-to-date!
              </div>
            ) : (
              expiringSoonDocs.map(doc => (
                <div 
                  key={doc.id} 
                  onClick={() => navigate(`/documents`)} // In a real app we redirect to details page, or view details
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                  className="card-hover-element"
                >
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getUrgencyColor(doc.status) }}></div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{doc.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{doc.provider}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 500, color: getUrgencyColor(doc.status) }}>
                      {getDaysDiff(doc.expiryDate)}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{doc.expiryDate}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Renewals Panel */}
        <div className="card flex-column" style={{ gap: '1.25rem' }}>
          <div className="flex-between">
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Clock size={18} style={{ color: 'var(--success)' }} />
              Upcoming Renewals
            </h2>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => navigate('/subscriptions')}
              style={{ padding: '0.25rem 0.5rem' }}
            >
              View All
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {upcomingRenewals.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                No active subscriptions.
              </div>
            ) : (
              upcomingRenewals.map(sub => (
                <div 
                  key={sub.id} 
                  onClick={() => navigate('/subscriptions')}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                  className="card-hover-element"
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{sub.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {sub.billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} • {sub.category}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {sym}{sub.amount.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 500 }}>
                      Due {getDaysDiff(sub.nextBillingDate)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Spend breakdown section */}
      <div className="card">
        <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <FolderOpen size={18} style={{ color: 'var(--info)' }} />
          Monthly Spend by Category
        </h2>
        
        {totalMonthlySpend === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            Add active subscriptions to view category distribution.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {Object.entries(categorySpend).map(([category, amount]) => {
              const percentage = totalMonthlySpend > 0 ? (amount / totalMonthlySpend) * 100 : 0;
              return (
                <div key={category} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div className="flex-between" style={{ fontSize: '0.9rem' }}>
                    <span style={{ fontWeight: 600 }}>{category}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {sym}{amount.toFixed(2)}/mo ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  {/* Progress Meter Bar */}
                  <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${percentage}%`, 
                        height: '100%', 
                        backgroundColor: 'var(--brand-primary)', 
                        borderRadius: 'var(--radius-full)',
                        transition: 'width var(--transition-slow)'
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Document Modal */}
      <Modal 
        isOpen={docModalOpen} 
        onClose={() => setDocModalOpen(false)} 
        title="Add Important Document"
      >
        <DocumentForm onClose={() => setDocModalOpen(false)} />
      </Modal>

      {/* Add Subscription Modal */}
      <Modal 
        isOpen={subModalOpen} 
        onClose={() => setSubModalOpen(false)} 
        title="Add Recurring Subscription"
      >
        <SubscriptionForm onClose={() => setSubModalOpen(false)} />
      </Modal>
    </div>
  );
};
