import { apiClient } from './apiClient';
import type { BiodataResponse, UpdateBiodataRequest } from '../types/api.types';

export const BiodataService = {
  getMine: async (): Promise<BiodataResponse> => {
    return apiClient.get<BiodataResponse>('/api/v1/biodata/me');
  },

  updateMine: async (data: UpdateBiodataRequest): Promise<BiodataResponse> => {
    return apiClient.patch<BiodataResponse>('/api/v1/biodata/me', data);
  },

  complete: async (): Promise<{ status: string }> => {
    return apiClient.post<{ status: string }>('/api/v1/biodata/me/complete');
  },

  getPublic: async (userId: string): Promise<Partial<BiodataResponse>> => {
    return apiClient.get<Partial<BiodataResponse>>(`/api/v1/biodata/public/${userId}`);
  }
};
