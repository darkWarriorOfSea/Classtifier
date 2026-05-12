import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Notification } from '../types';
import { MOCK_NOTIFICATIONS } from '../constants/mockData';

export type UserRole = 'student' | 'teacher' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  college?: string;
  course?: string;
  year?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ToastMessage {
  open: boolean;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
}

interface AppState {
  user: User | null;
  isLoading: boolean;
  messages: Message[];
  notifications: Notification[];
  themeMode: 'light' | 'dark';
  toast: ToastMessage;
  
  // Actions
  setUser: (user: User | null) => void;
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  clearMessages: () => void;
  setLoading: (isLoading: boolean) => void;
  toggleThemeMode: () => void;
  showToast: (message: string, severity?: 'success' | 'info' | 'warning' | 'error') => void;
  hideToast: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'time'>) => void;
  markAllRead: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      messages: [],
      notifications: MOCK_NOTIFICATIONS,
      themeMode: 'light',
      toast: { open: false, message: '', severity: 'info' },

      setUser: (user) => set({ user }),

      addMessage: (content, role) => set((state) => ({
        messages: [...state.messages, {
          id: Math.random().toString(36).substring(7),
          role,
          content,
          timestamp: Date.now()
        }]
      })),

      clearMessages: () => set({ messages: [] }),

      setLoading: (isLoading) => set({ isLoading }),

      toggleThemeMode: () => set((state) => ({ 
        themeMode: state.themeMode === 'light' ? 'dark' : 'light' 
      })),

      showToast: (message, severity = 'info') => set({ toast: { open: true, message, severity } }),
      
      hideToast: () => set((state) => ({ toast: { ...state.toast, open: false } })),
      
      addNotification: (notification) => set((state) => ({
        notifications: [{
          ...notification,
          id: Math.random().toString(36).substring(7),
          read: false,
          time: 'Just now'
        }, ...state.notifications]
      })),

      markAllRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      }))
    }),
    {
      name: 'classtifier-storage',
    }
  )
);
