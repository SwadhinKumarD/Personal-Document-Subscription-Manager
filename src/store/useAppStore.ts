import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Document {
  id: string;
  title: string;
  category: 'Identity' | 'Insurance' | 'Certificate' | 'Warranty' | 'Membership' | 'Other';
  issueDate: string;
  expiryDate: string;
  notes: string;
  status: 'active' | 'expiring' | 'expired' | 'archived';
  provider: string;
  policyNumber?: string;
  fileType?: 'pdf' | 'image' | 'doc';
  fileName?: string;
}

export interface Subscription {
  id: string;
  name: string;
  category: 'Entertainment' | 'Utilities' | 'Software' | 'Health' | 'Finance' | 'Other';
  billingCycle: 'monthly' | 'yearly';
  amount: number;
  nextBillingDate: string;
  status: 'active' | 'paused';
  notes: string;
}

export interface Reminder {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  type: 'document' | 'subscription' | 'custom';
  relatedId?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'danger' | 'success';
}

interface AppState {
  documents: Document[];
  subscriptions: Subscription[];
  reminders: Reminder[];
  notifications: AppNotification[];
  theme: 'light' | 'dark';
  currency: string;
  selectedDate: string; // YYYY-MM-DD
  
  // Actions
  addDocument: (doc: Omit<Document, 'id' | 'status'>) => void;
  updateDocument: (id: string, doc: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  archiveDocument: (id: string) => void;
  restoreDocument: (id: string) => void;
  
  addSubscription: (sub: Omit<Subscription, 'id'>) => void;
  updateSubscription: (id: string, sub: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  toggleSubscriptionStatus: (id: string) => void;
  
  addReminder: (reminder: Omit<Reminder, 'id' | 'completed'>) => void;
  toggleReminderCompleted: (id: string) => void;
  deleteReminder: (id: string) => void;
  
  addNotification: (notification: Omit<AppNotification, 'id' | 'date' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  setTheme: (theme: 'light' | 'dark') => void;
  setCurrency: (currency: string) => void;
  setSelectedDate: (date: string) => void;
  
  importData: (data: { documents: Document[]; subscriptions: Subscription[]; reminders: Reminder[] }) => void;
  resetToDefault: () => void;
}

const getInitialDate = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

const defaultDocuments: Document[] = [
  {
    id: 'doc-1',
    title: 'International Passport',
    category: 'Identity',
    issueDate: getInitialDate(-1800),
    expiryDate: getInitialDate(1800),
    notes: 'Primary international travel document. Keep physically secure.',
    status: 'active',
    provider: 'Government Department',
    policyNumber: 'Z-8891002',
    fileType: 'pdf',
    fileName: 'passport_scan_hd.pdf'
  },
  {
    id: 'doc-2',
    title: 'Car Insurance (Comprehensive)',
    category: 'Insurance',
    issueDate: getInitialDate(-355),
    expiryDate: getInitialDate(10), // Expiring in 10 days
    notes: 'Premium auto policy. Roadside assistance contact: 1-800-555-0199.',
    status: 'expiring',
    provider: 'SafeDrive Insurance',
    policyNumber: 'SD-99827-C',
    fileType: 'pdf',
    fileName: 'safedrive_auto_policy.pdf'
  },
  {
    id: 'doc-3',
    title: 'AWS Certified Cloud Practitioner',
    category: 'Certificate',
    issueDate: getInitialDate(-735),
    expiryDate: getInitialDate(-5), // Expired 5 days ago
    notes: 'Needs renewal study plan. Check AWS certification portal.',
    status: 'expired',
    provider: 'Amazon Web Services',
    policyNumber: 'AWS-CCP-92810',
    fileType: 'image',
    fileName: 'aws_ccp_certificate.png'
  },
  {
    id: 'doc-4',
    title: 'Refrigerator Smart Cooling warranty',
    category: 'Warranty',
    issueDate: getInitialDate(-200),
    expiryDate: getInitialDate(90), // Expiring in 3 months
    notes: 'Extended warranty covers compressor and digital display parts.',
    status: 'active',
    provider: 'ElectroGlobal Corp',
    policyNumber: 'WARR-EG-7716',
    fileType: 'doc',
    fileName: 'fridge_warranty_terms.docx'
  },
  {
    id: 'doc-5',
    title: 'City Fitness Gym Contract',
    category: 'Membership',
    issueDate: getInitialDate(-120),
    expiryDate: getInitialDate(245),
    notes: 'Corporate discount rate. Entitles usage of all domestic branches.',
    status: 'active',
    provider: 'City Fitness Gyms',
    policyNumber: 'MEMB-CF-88201',
    fileType: 'pdf',
    fileName: 'gym_membership_details.pdf'
  }
];

const defaultSubscriptions: Subscription[] = [
  {
    id: 'sub-1',
    name: 'Netflix Premium 4K',
    category: 'Entertainment',
    billingCycle: 'monthly',
    amount: 15.49,
    nextBillingDate: getInitialDate(4),
    status: 'active',
    notes: 'Shared family subscription. Configured on TV and Tablets.'
  },
  {
    id: 'sub-2',
    name: 'AWS Cloud Console Services',
    category: 'Software',
    billingCycle: 'monthly',
    amount: 34.20,
    nextBillingDate: getInitialDate(12),
    status: 'active',
    notes: 'Personal sandbox billing. Ensure dev databases are shut down at night.'
  },
  {
    id: 'sub-3',
    name: 'City Fitness Gym Fee',
    category: 'Health',
    billingCycle: 'monthly',
    amount: 50.00,
    nextBillingDate: getInitialDate(8),
    status: 'active',
    notes: 'Tied to City Fitness Contract. Automatic debit setup.'
  },
  {
    id: 'sub-4',
    name: 'Adobe Creative Cloud Suit',
    category: 'Software',
    billingCycle: 'yearly',
    amount: 239.88,
    nextBillingDate: getInitialDate(45),
    status: 'active',
    notes: 'Full Suite containing Photoshop, Illustrator, Premiere Pro.'
  },
  {
    id: 'sub-5',
    name: 'Mobile High-Speed Unlimited',
    category: 'Utilities',
    billingCycle: 'monthly',
    amount: 45.00,
    nextBillingDate: getInitialDate(2),
    status: 'active',
    notes: '5G mobile data + unlimited local calls.'
  },
  {
    id: 'sub-6',
    name: 'Bloomberg Professional Terminal',
    category: 'Finance',
    billingCycle: 'monthly',
    amount: 2000.00,
    nextBillingDate: getInitialDate(20),
    status: 'paused',
    notes: 'Temporarily suspended during training periods.'
  }
];

const defaultReminders: Reminder[] = [
  {
    id: 'rem-1',
    title: 'Renew Car Insurance (SD-99827-C)',
    dueDate: getInitialDate(5),
    completed: false,
    type: 'document',
    relatedId: 'doc-2'
  },
  {
    id: 'rem-2',
    title: 'Review AWS certification materials',
    dueDate: getInitialDate(-2),
    completed: true,
    type: 'document',
    relatedId: 'doc-3'
  },
  {
    id: 'rem-3',
    title: 'Prepare budget for Adobe renewal',
    dueDate: getInitialDate(35),
    completed: false,
    type: 'subscription',
    relatedId: 'sub-4'
  },
  {
    id: 'rem-4',
    title: 'Clean air filters in the house',
    dueDate: getInitialDate(1),
    completed: false,
    type: 'custom'
  }
];

const defaultNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Document Expiring Soon',
    message: 'Your Car Insurance (Comprehensive) expires in 10 days.',
    date: new Date().toISOString(),
    read: false,
    type: 'warning'
  },
  {
    id: 'notif-2',
    title: 'Document Expired',
    message: 'AWS Certified Cloud Practitioner certification expired 5 days ago.',
    date: new Date(Date.now() - 24 * 3600 * 1000 * 3).toISOString(),
    read: false,
    type: 'danger'
  }
];

const calculateStatus = (expiryDate: string): 'active' | 'expiring' | 'expired' => {
  const expiry = new Date(expiryDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  if (expiry < now) return 'expired';
  
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 30) return 'expiring';
  return 'active';
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      documents: defaultDocuments,
      subscriptions: defaultSubscriptions,
      reminders: defaultReminders,
      notifications: defaultNotifications,
      theme: 'dark',
      currency: 'USD',
      selectedDate: new Date().toISOString().split('T')[0],
      
      addDocument: (doc) => set((state) => {
        const id = `doc-${Date.now()}`;
        const status = calculateStatus(doc.expiryDate);
        const newDoc: Document = { ...doc, id, status };
        
        // Auto-generate notification if expiring/expired
        const newNotifications = [...state.notifications];
        if (status === 'expiring') {
          newNotifications.unshift({
            id: `notif-${Date.now()}`,
            title: 'Document Expiring Soon',
            message: `Your document "${newDoc.title}" expires on ${newDoc.expiryDate}.`,
            date: new Date().toISOString(),
            read: false,
            type: 'warning'
          });
        } else if (status === 'expired') {
          newNotifications.unshift({
            id: `notif-${Date.now()}`,
            title: 'Document Expired',
            message: `Your document "${newDoc.title}" expired on ${newDoc.expiryDate}.`,
            date: new Date().toISOString(),
            read: false,
            type: 'danger'
          });
        }

        // Auto-generate a reminder for the expiry date
        const newReminders = [...state.reminders];
        newReminders.push({
          id: `rem-${Date.now()}`,
          title: `Renew ${newDoc.title}`,
          dueDate: newDoc.expiryDate,
          completed: false,
          type: 'document',
          relatedId: id
        });
        
        return { 
          documents: [newDoc, ...state.documents],
          notifications: newNotifications,
          reminders: newReminders
        };
      }),
      
      updateDocument: (id, updatedFields) => set((state) => {
        const documents = state.documents.map((doc) => {
          if (doc.id === id) {
            const merged = { ...doc, ...updatedFields };
            if (updatedFields.expiryDate) {
              merged.status = calculateStatus(updatedFields.expiryDate);
            }
            return merged;
          }
          return doc;
        });
        
        return { documents };
      }),
      
      deleteDocument: (id) => set((state) => ({
        documents: state.documents.filter((doc) => doc.id !== id),
        reminders: state.reminders.filter((rem) => !(rem.type === 'document' && rem.relatedId === id))
      })),
      
      archiveDocument: (id) => set((state) => ({
        documents: state.documents.map((doc) => 
          doc.id === id ? { ...doc, status: 'archived' as const } : doc
        )
      })),
      
      restoreDocument: (id) => set((state) => ({
        documents: state.documents.map((doc) => {
          if (doc.id === id) {
            return { ...doc, status: calculateStatus(doc.expiryDate) };
          }
          return doc;
        })
      })),
      
      addSubscription: (sub) => set((state) => {
        const id = `sub-${Date.now()}`;
        const newSub = { ...sub, id };
        
        // Auto-generate reminder for the next billing date
        const newReminders = [...state.reminders];
        newReminders.push({
          id: `rem-${Date.now()}`,
          title: `Billing for ${newSub.name}`,
          dueDate: newSub.nextBillingDate,
          completed: false,
          type: 'subscription',
          relatedId: id
        });
        
        return { 
          subscriptions: [newSub, ...state.subscriptions],
          reminders: newReminders
        };
      }),
      
      updateSubscription: (id, updatedFields) => set((state) => ({
        subscriptions: state.subscriptions.map((sub) => 
          sub.id === id ? { ...sub, ...updatedFields } : sub
        )
      })),
      
      deleteSubscription: (id) => set((state) => ({
        subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
        reminders: state.reminders.filter((rem) => !(rem.type === 'subscription' && rem.relatedId === id))
      })),
      
      toggleSubscriptionStatus: (id) => set((state) => ({
        subscriptions: state.subscriptions.map((sub) => 
          sub.id === id 
            ? { ...sub, status: sub.status === 'active' ? 'paused' as const : 'active' as const } 
            : sub
        )
      })),
      
      addReminder: (reminder) => set((state) => ({
        reminders: [
          ...state.reminders, 
          { ...reminder, id: `rem-${Date.now()}`, completed: false }
        ]
      })),
      
      toggleReminderCompleted: (id) => set((state) => ({
        reminders: state.reminders.map((rem) => 
          rem.id === id ? { ...rem, completed: !rem.completed } : rem
        )
      })),
      
      deleteReminder: (id) => set((state) => ({
        reminders: state.reminders.filter((rem) => rem.id !== id)
      })),
      
      addNotification: (notification) => set((state) => ({
        notifications: [
          {
            ...notification,
            id: `notif-${Date.now()}`,
            date: new Date().toISOString(),
            read: false
          },
          ...state.notifications
        ]
      })),
      
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) => 
          n.id === id ? { ...n, read: true } : n
        )
      })),
      
      clearAllNotifications: () => set({ notifications: [] }),
      
      setTheme: (theme) => set({ theme }),
      setCurrency: (currency) => set({ currency }),
      setSelectedDate: (selectedDate) => set({ selectedDate }),
      
      importData: (data) => set({
        documents: data.documents,
        subscriptions: data.subscriptions,
        reminders: data.reminders
      }),
      
      resetToDefault: () => set({
        documents: defaultDocuments,
        subscriptions: defaultSubscriptions,
        reminders: defaultReminders,
        notifications: defaultNotifications
      })
    }),
    {
      name: 'personal-manager-storage',
      partialize: (state) => ({ 
        documents: state.documents, 
        subscriptions: state.subscriptions, 
        reminders: state.reminders, 
        notifications: state.notifications, 
        theme: state.theme, 
        currency: state.currency 
      }),
    }
  )
);
