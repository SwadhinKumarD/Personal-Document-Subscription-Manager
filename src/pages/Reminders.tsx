import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  Trash2, 
  Plus, 
  Calendar as CalendarIcon
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { EmptyState } from '../components/Common/EmptyState';
import { Modal } from '../components/Common/Modal';

export const Reminders: React.FC = () => {
  const { reminders, addReminder, toggleReminderCompleted, deleteReminder } = useAppStore();

  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [addModalOpen, setAddModalOpen] = useState(false);

  // New reminder form state
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const filteredReminders = reminders.filter(rem => {
    if (filter === 'pending') return !rem.completed;
    if (filter === 'completed') return rem.completed;
    return true;
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) {
      alert('Please fill out all fields.');
      return;
    }

    addReminder({
      title,
      dueDate,
      type: 'custom'
    });

    // Reset Form
    setTitle('');
    setDueDate('');
    setAddModalOpen(false);
  };

  const getUrgencyColor = (dueDateStr: string, completed: boolean) => {
    if (completed) return 'var(--text-tertiary)';
    const diff = new Date(dueDateStr).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    if (days < 0) return 'var(--danger)'; // overdue
    if (days <= 3) return 'var(--warning)'; // urgent
    return 'var(--text-secondary)';
  };

  const getDaysText = (dueDateStr: string, completed: boolean) => {
    if (completed) return 'Completed';
    const diff = new Date(dueDateStr).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    if (days < 0) return `Overdue by ${Math.abs(days)} days`;
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `Due in ${days} days`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="anim-fade">
      
      {/* Page Header */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Action Reminders
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Set alerts for critical actions, updates, or physical audits.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setAddModalOpen(true)}>
          <Plus size={16} /> New Reminder
        </button>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <button 
            style={{ 
              padding: '0.5rem 0.25rem', 
              fontSize: '0.95rem',
              fontWeight: 600, 
              color: filter === 'all' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: filter === 'all' ? '2px solid var(--brand-primary)' : 'none'
            }}
            onClick={() => setFilter('all')}
          >
            All Reminders ({reminders.length})
          </button>
          <button 
            style={{ 
              padding: '0.5rem 0.25rem', 
              fontSize: '0.95rem',
              fontWeight: 600, 
              color: filter === 'pending' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: filter === 'pending' ? '2px solid var(--brand-primary)' : 'none'
            }}
            onClick={() => setFilter('pending')}
          >
            Pending ({reminders.filter(r => !r.completed).length})
          </button>
          <button 
            style={{ 
              padding: '0.5rem 0.25rem', 
              fontSize: '0.95rem',
              fontWeight: 600, 
              color: filter === 'completed' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: filter === 'completed' ? '2px solid var(--brand-primary)' : 'none'
            }}
            onClick={() => setFilter('completed')}
          >
            Completed ({reminders.filter(r => r.completed).length})
          </button>
        </div>
      </div>

      {/* Reminders List */}
      {filteredReminders.length === 0 ? (
        <EmptyState 
          title="No Reminders Found" 
          description="Create customized action prompts or set dates to study, audit, and clean items."
          icon="reminders"
          actionButton={
            <button className="btn btn-primary" onClick={() => setAddModalOpen(true)}>
              <Plus size={16} /> Create Custom Reminder
            </button>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredReminders.map(rem => (
            <div 
              key={rem.id} 
              className="card" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                opacity: rem.completed ? 0.65 : 1,
                borderColor: rem.completed ? 'var(--border-color)' : getUrgencyColor(rem.dueDate, rem.completed)
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                
                {/* Complete Checkbox */}
                <button 
                  onClick={() => toggleReminderCompleted(rem.id)} 
                  style={{ color: rem.completed ? 'var(--success)' : 'var(--text-secondary)', display: 'flex' }}
                  title={rem.completed ? "Mark incomplete" : "Mark completed"}
                >
                  {rem.completed ? <CheckSquare size={20} /> : <Square size={20} />}
                </button>

                <div>
                  <div style={{ 
                    fontWeight: 600, 
                    fontSize: '0.95rem',
                    textDecoration: rem.completed ? 'line-through' : 'none',
                    color: rem.completed ? 'var(--text-secondary)' : 'var(--text-primary)'
                  }}>
                    {rem.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    <CalendarIcon size={12} />
                    <span>Due: {rem.dueDate}</span>
                    <span>•</span>
                    <span style={{ 
                      fontWeight: 600, 
                      color: getUrgencyColor(rem.dueDate, rem.completed)
                    }}>
                      {getDaysText(rem.dueDate, rem.completed)}
                    </span>
                    <span>•</span>
                    <span style={{ textTransform: 'capitalize' }}>Type: {rem.type}</span>
                  </div>
                </div>

              </div>

              {/* Action delete */}
              <button 
                className="btn-icon" 
                onClick={() => deleteReminder(rem.id)}
                title="Delete reminder"
                style={{ color: 'var(--danger)' }}
              >
                <Trash2 size={16} />
              </button>

            </div>
          ))}
        </div>
      )}

      {/* Add Custom Reminder Modal */}
      <Modal 
        isOpen={addModalOpen} 
        onClose={() => setAddModalOpen(false)} 
        title="Add Custom Reminder"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Reminder Title *</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="form-control" 
              placeholder="e.g. Schedule passport photoshoot" 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Due Date *</label>
            <input 
              type="date" 
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)} 
              className="form-control" 
              required 
            />
          </div>

          <div className="modal-footer" style={{ borderTop: 'none', padding: '1rem 0 0 0' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Reminder
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
