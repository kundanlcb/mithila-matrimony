import { apiClient } from './apiClient';
import type { SendInteractionRequest, SendInteractionResponse, BiodataResponse } from '../types/api.types';

export const InteractionsService = {
  send: async (data: SendInteractionRequest): Promise<SendInteractionResponse> => {
    return apiClient.post<SendInteractionResponse>('/api/v1/interactions', data);
  },

  getReceived: async (): Promise<BiodataResponse[]> => {
    return apiClient.get<BiodataResponse[]>('/api/v1/interactions/received');
  },

  getSent: async (): Promise<BiodataResponse[]> => {
    return apiClient.get<BiodataResponse[]>('/api/v1/interactions/sent');
  },

  getMatches: async (): Promise<BiodataResponse[]> => {
    return apiClient.get<BiodataResponse[]>('/api/v1/interactions/matches');
  }
};
