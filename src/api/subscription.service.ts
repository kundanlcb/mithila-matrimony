import { apiClient } from './apiClient';
import type { 
  SubscriptionStatusResponse, 
  PurchaseRequest, 
  PurchaseResponse, 
  RevealResponse 
} from '../types/api.types';

export const SubscriptionService = {
  purchase: async (data: PurchaseRequest): Promise<PurchaseResponse> => {
    return apiClient.post<PurchaseResponse>('/api/v1/subscriptions/purchase', data);
  },

  getStatus: async (): Promise<SubscriptionStatusResponse> => {
    return apiClient.get<SubscriptionStatusResponse>('/api/v1/subscriptions/status');
  },

  reveal: async (targetUserId: string): Promise<RevealResponse> => {
    return apiClient.post<RevealResponse>(`/api/v1/subscriptions/reveal/${targetUserId}`);
  }
};
