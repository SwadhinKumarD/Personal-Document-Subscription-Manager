import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Overview } from './pages/Overview';
import { Documents } from './pages/Documents';
import { DocumentDetails } from './pages/DocumentDetails';
import { Subscriptions } from './pages/Subscriptions';
import { SubscriptionDetails } from './pages/SubscriptionDetails';
import { Calendar } from './pages/Calendar';
import { Reminders } from './pages/Reminders';
import { Settings } from './pages/Settings';
import './App.css'; // Just in case, keeping standard imports

export const App: React.FC = () => {
  const navigate = useNavigate();

  // Global Keyboard Shortcuts handler
  useEffect(() => {
    const handleShortcuts = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in input fields
      const activeTag = document.activeElement?.tagName;
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') {
        return;
      }

      if (e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 'o':
            e.preventDefault();
            navigate('/');
            break;
          case 'd':
            e.preventDefault();
            navigate('/documents');
            break;
          case 's':
            e.preventDefault();
            navigate('/subscriptions');
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleShortcuts);
    return () => window.removeEventListener('keydown', handleShortcuts);
  }, [navigate]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/documents/:id" element={<DocumentDetails />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/subscriptions/:id" element={<SubscriptionDetails />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/settings" element={<Settings />} />
        {/* Fallback route */}
        <Route path="*" element={<Overview />} />
      </Routes>
    </Layout>
  );
};

export default App;
