import { apiClient } from './apiClient';
import type { PageMatchProfileResponse } from '../types/api.types';

export const MatchesService = {
  findMatches: async (page = 0, size = 20, sortBy = 'score'): Promise<PageMatchProfileResponse> => {
    // Construct query parameters
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy: sortBy
    });
    
    return apiClient.get<PageMatchProfileResponse>(`/api/v1/matches?${queryParams.toString()}`);
  }
};
