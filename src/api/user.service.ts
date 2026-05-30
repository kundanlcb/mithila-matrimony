import { apiClient } from './apiClient';
import type { BiodataResponse } from '../types/api.types';

export const UserService = {
  deactivate: async (): Promise<string> => {
    return apiClient.post<string>('/api/v1/users/deactivate');
  },

  toggleHidden: async (): Promise<string> => {
    return apiClient.post<string>('/api/v1/users/toggle-hidden');
  },

  deleteRequest: async (): Promise<string> => {
    return apiClient.post<string>('/api/v1/users/delete-request');
  },

  block: async (targetUserId: string): Promise<string> => {
    return apiClient.post<string>(`/api/v1/users/block/${targetUserId}`);
  },

  unblock: async (targetUserId: string): Promise<string> => {
    return apiClient.post<string>(`/api/v1/users/unblock/${targetUserId}`);
  },

  getBlocked: async (): Promise<BiodataResponse[]> => {
    return apiClient.get<BiodataResponse[]>('/api/v1/users/blocked');
  }
};
