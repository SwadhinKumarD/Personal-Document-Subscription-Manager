import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  FileText, 
  CreditCard, 
  Clock, 
  ChevronRight as ChevronRightIcon 
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const Calendar: React.FC = () => {
  const navigate = useNavigate();
  const { documents, subscriptions, reminders, currency } = useAppStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Currency symbols
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    INR: '₹',
    GBP: '£'
  };
  const sym = currencySymbols[currency] || '$';

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calendar generation helpers
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayIndex = (y: number, m: number) => new Date(y, m, 1).getDay();

  const totalDays = getDaysInMonth(year, month);
  const firstDayIdx = getFirstDayIndex(year, month);
  
  const prevMonthTotalDays = getDaysInMonth(year, month - 1);

  // Previous month padding cells
  const prevCells = [];
  for (let i = firstDayIdx - 1; i >= 0; i--) {
    const d = prevMonthTotalDays - i;
    const prevMonthDate = new Date(year, month - 1, d);
    prevCells.push({
      date: prevMonthDate,
      isCurrentMonth: false,
      dayNum: d
    });
  }

  // Current month cells
  const currentCells = [];
  for (let d = 1; d <= totalDays; d++) {
    const cellDate = new Date(year, month, d);
    currentCells.push({
      date: cellDate,
      isCurrentMonth: true,
      dayNum: d
    });
  }

  // Next month padding cells to complete grid (usually 42 cells total for 6 rows)
  const totalCellsCount = prevCells.length + currentCells.length;
  const remainingCells = 42 - totalCellsCount;
  
  const nextCells = [];
  for (let d = 1; d <= remainingCells; d++) {
    const nextMonthDate = new Date(year, month + 1, d);
    nextCells.push({
      date: nextMonthDate,
      isCurrentMonth: false,
      dayNum: d
    });
  }

  const allCells = [...prevCells, ...currentCells, ...nextCells];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  // Check what events are on a given date string (YYYY-MM-DD)
  const getEventsForDate = (dateStr: string) => {
    const dayDocs = documents.filter(d => d.expiryDate === dateStr);
    const daySubs = subscriptions.filter(s => s.status === 'active' && s.nextBillingDate === dateStr);
    const dayReminders = reminders.filter(r => r.dueDate === dateStr);

    return {
      docs: dayDocs,
      subs: daySubs,
      reminders: dayReminders,
      totalCount: dayDocs.length + daySubs.length + dayReminders.length
    };
  };

  const formatDateString = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Get active items for selected day
  const selectedDayEvents = getEventsForDate(selectedDateStr);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="anim-fade">
      
      {/* Header */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Renewal Calendar
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Visual schedule of active plan charge dates and credential expirations.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={handleToday}>
          Today
        </button>
      </div>

      {/* Main Grid: Calendar left, Selected details list on the right */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: '7fr 5fr', 
          gap: '1.5rem' 
        }}
        className="grid-2" /* responsive override */
      >
        
        {/* Left Card: Calendar grid */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.25rem' }}>
          
          {/* Calendar Controller Header */}
          <div className="flex-between">
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
              {monthNames[month]} {year}
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-icon" onClick={handlePrevMonth} aria-label="Previous month">
                <ChevronLeft size={20} />
              </button>
              <button className="btn-icon" onClick={handleNextMonth} aria-label="Next month">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)', 
              textAlign: 'center', 
              fontWeight: 600, 
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '0.5rem'
            }}
          >
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Month Cells Grid */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)', 
              gap: '2px', 
              backgroundColor: 'var(--border-color)',
              borderRadius: 'var(--radius-xs)',
              overflow: 'hidden'
            }}
          >
            {allCells.map((cell, idx) => {
              const cellDateStr = formatDateString(cell.date);
              const isSelected = cellDateStr === selectedDateStr;
              const { docs, subs, reminders: cellRems } = getEventsForDate(cellDateStr);
              
              const isToday = formatDateString(new Date()) === cellDateStr;

              return (
                <div 
                  key={idx}
                  onClick={() => setSelectedDateStr(cellDateStr)}
                  style={{ 
                    aspectRatio: '1',
                    backgroundColor: isSelected 
                      ? 'var(--brand-primary-light)' 
                      : 'var(--bg-secondary)',
                    padding: '0.4rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    border: isSelected ? '1px solid var(--brand-primary)' : 'none',
                    transition: 'all var(--transition-fast)'
                  }}
                  className="calendar-cell"
                >
                  {/* Day number */}
                  <span 
                    style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: isSelected || isToday ? 700 : 500,
                      color: !cell.isCurrentMonth 
                        ? 'var(--text-tertiary)' 
                        : isToday 
                          ? 'var(--brand-primary)' 
                          : 'var(--text-primary)',
                      alignSelf: 'flex-start'
                    }}
                  >
                    {cell.dayNum}
                  </span>

                  {/* Indicators / Event Dots */}
                  <div style={{ display: 'flex', gap: '3px', justifyContent: 'center', width: '100%', marginBottom: '2px' }}>
                    {docs.length > 0 && (
                      <div 
                        title={`${docs.length} Document Expiry`} 
                        style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--danger)' }}
                      ></div>
                    )}
                    {subs.length > 0 && (
                      <div 
                        title={`${subs.length} Subscription Renewal`} 
                        style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success)' }}
                      ></div>
                    )}
                    {cellRems.length > 0 && (
                      <div 
                        title={`${cellRems.length} Action Reminders`} 
                        style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--warning)' }}
                      ></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Card: Day Events list details */}
        <div className="card flex-column" style={{ gap: '1.25rem', minHeight: '380px' }}>
          <div>
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <CalendarIcon size={18} style={{ color: 'var(--brand-primary)' }} />
              Schedule for {selectedDateStr}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Items scheduled or renewing on this date.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1, overflowY: 'auto' }}>
            {selectedDayEvents.totalCount === 0 ? (
              <div 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%', 
                  color: 'var(--text-tertiary)',
                  padding: '2rem 1rem',
                  textAlign: 'center'
                }}
              >
                <CalendarIcon size={32} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
                <span>No expirations, renewals, or active reminders for this date.</span>
              </div>
            ) : (
              <>
                {/* Expiring Docs */}
                {selectedDayEvents.docs.map(doc => (
                  <div 
                    key={doc.id}
                    onClick={() => navigate(`/documents/${doc.id}`)}
                    style={{ 
                      padding: '0.75rem 1rem', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                    className="card-hover-element"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}>
                        <FileText size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{doc.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Doc Expiration • {doc.provider}</div>
                      </div>
                    </div>
                    <ChevronRightIcon size={16} style={{ color: 'var(--text-tertiary)' }} />
                  </div>
                ))}

                {/* Renewing Subs */}
                {selectedDayEvents.subs.map(sub => (
                  <div 
                    key={sub.id}
                    onClick={() => navigate(`/subscriptions/${sub.id}`)}
                    style={{ 
                      padding: '0.75rem 1rem', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                    className="card-hover-element"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
                        <CreditCard size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{sub.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Renew charge: {sym}{sub.amount.toFixed(2)}</div>
                      </div>
                    </div>
                    <ChevronRightIcon size={16} style={{ color: 'var(--text-tertiary)' }} />
                  </div>
                ))}

                {/* Custom/Standard Reminders */}
                {selectedDayEvents.reminders.map(rem => (
                  <div 
                    key={rem.id}
                    style={{ 
                      padding: '0.75rem 1rem', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: rem.completed ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                      opacity: rem.completed ? 0.65 : 1
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--warning-light)', color: 'var(--warning)' }}>
                        <Clock size={16} />
                      </div>
                      <div>
                        <div style={{ 
                          fontWeight: 600, 
                          fontSize: '0.85rem',
                          textDecoration: rem.completed ? 'line-through' : 'none'
                        }}>{rem.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          Reminder • {rem.completed ? 'Completed' : 'Pending'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
