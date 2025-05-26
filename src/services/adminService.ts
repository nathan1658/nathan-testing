// src/services/adminService.ts
import { useAuthStore } from '../store/authStore';

const getAuthHeaders = async () => {
  const authStore = useAuthStore();
  const token = await authStore.getToken();
  if (!token) {
    throw new Error('User not authenticated or token not available.');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // From .env.local

export const adminService = {
  getSubmissions: async () => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/admin/submissions`, { headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `Failed to fetch submissions: ${response.status}`);
    }
    return response.json();
  },

  getStatistics: async () => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/admin/statistics`, { headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `Failed to fetch statistics: ${response.status}`);
    }
    return response.json();
  }
};
