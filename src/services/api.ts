/**
 * Classtifier API Client
 * 
 * Drop-in service for the frontend to call backend endpoints.
 * All methods return parsed JSON and throw on HTTP errors.
 * 
 * Usage:
 *   import api from '../services/api';
 *   const lectures = await api.lectures.getAll();
 *   await api.lectures.create({ title: 'Math 101', ... });
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// ─── HTTP Helper ──────────────────────────────────────────────────────────────

async function request<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`;

  // Get the Clerk session token from the browser
  let token: string | null = null;
  try {
    const clerkInstance = (window as any).Clerk;
    if (clerkInstance && clerkInstance.session) {
      token = await clerkInstance.session.getToken();
    }
  } catch (error) {
    console.error("Failed to fetch Clerk token", error);
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(errorBody.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ─── API Methods ──────────────────────────────────────────────────────────────

const api = {
  // ── Users ─────────────────────────────────────────────────────
  users: {
    sync: (data: { email: string; name: string; role: string; college?: string; course?: string; year?: string; avatar?: string }) =>
      request('/api/users/sync', { method: 'POST', body: JSON.stringify(data) }),

    getMe: () =>
      request('/api/users/me'),

    updateProfile: (data: { name?: string; college?: string; course?: string; year?: string; avatar?: string }) =>
      request('/api/users/me', { method: 'PATCH', body: JSON.stringify(data) }),
  },

  // ── Lectures ──────────────────────────────────────────────────
  lectures: {
    getAll: (params?: { section?: string; date?: string }) => {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      return request(`/api/lectures${query ? `?${query}` : ''}`);
    },

    create: (data: { title: string; subject: string; section: string; startTime: string; endTime: string; location: string; date: string; type?: string }) =>
      request('/api/lectures', { method: 'POST', body: JSON.stringify(data) }),

    edit: (id: string, data: Partial<{ title: string; subject: string; section: string; startTime: string; endTime: string; location: string; date: string }>) =>
      request(`/api/lectures/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

    delete: (id: string) =>
      request(`/api/lectures/${id}`, { method: 'DELETE' }),
  },

  // ── Labs ──────────────────────────────────────────────────────
  labs: {
    getAll: (params?: { section?: string; date?: string }) => {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      return request(`/api/labs${query ? `?${query}` : ''}`);
    },

    create: (data: { title: string; subject: string; section: string; startTime: string; endTime: string; location: string; date: string; type?: string }) =>
      request('/api/labs', { method: 'POST', body: JSON.stringify(data) }),

    edit: (id: string, data: Partial<{ title: string; subject: string; section: string; startTime: string; endTime: string; location: string; date: string }>) =>
      request(`/api/labs/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

    delete: (id: string) =>
      request(`/api/labs/${id}`, { method: 'DELETE' }),
  },

  // ── Announcements ─────────────────────────────────────────────
  announcements: {
    getAll: (targetRole?: string) => {
      const query = targetRole ? `?targetRole=${targetRole}` : '';
      return request(`/api/announcements${query}`);
    },

    create: (data: { title: string; body: string; targetRole?: string }) =>
      request('/api/announcements', { method: 'POST', body: JSON.stringify(data) }),

    delete: (id: string) =>
      request(`/api/announcements/${id}`, { method: 'DELETE' }),
  },

  // ── Notifications ─────────────────────────────────────────────
  notifications: {
    getAll: (params?: { limit?: number; unreadOnly?: boolean }) => {
      const query = new URLSearchParams(params as any).toString();
      return request(`/api/notifications${query ? `?${query}` : ''}`);
    },

    getUnreadCount: () =>
      request('/api/notifications/unread-count'),

    send: (data: { userId: string; title: string; body: string; type?: string; relatedId?: string }) =>
      request('/api/notifications', { method: 'POST', body: JSON.stringify(data) }),

    broadcast: (data: { title: string; body: string; type?: string; targetRole?: string }) =>
      request('/api/notifications/broadcast', { method: 'POST', body: JSON.stringify(data) }),

    markAsRead: (id: string) =>
      request(`/api/notifications/${id}/read`, { method: 'PATCH' }),

    markAllAsRead: () =>
      request('/api/notifications/read-all', { method: 'PATCH' }),
  },

  // ── Attendance ────────────────────────────────────────────────
  attendance: {
    getAll: (params?: { lectureId?: string; labId?: string; studentId?: string }) => {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      return request(`/api/attendance${query ? `?${query}` : ''}`);
    },

    mark: (data: { studentId: string; lectureId?: string; labId?: string; status: 'present' | 'absent' | 'late' } | Array<{ studentId: string; lectureId?: string; labId?: string; status: 'present' | 'absent' | 'late' }>) =>
      request('/api/attendance', { method: 'POST', body: JSON.stringify(data) }),
  },

  // ── Health ────────────────────────────────────────────────────
  health: () => request('/api/health'),
};

export default api;
