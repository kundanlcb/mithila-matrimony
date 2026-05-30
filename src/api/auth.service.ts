import { apiClient } from './apiClient';
import type { RequestOtpRequest, RequestOtpResponse, VerifyOtpRequest, VerifyOtpResponse, SetupPasswordRequest, LoginRequest } from '../types/api.types';

export const AuthService = {
  requestOtp: async (data: RequestOtpRequest): Promise<RequestOtpResponse> => {
    return apiClient.post<RequestOtpResponse>('/api/v1/auth/request-otp', data);
  },

  verifyOtp: async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
    const response = await apiClient.post<VerifyOtpResponse>('/api/v1/auth/verify-otp', data);
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('active_profile', JSON.stringify(response.user));
    }
    return response;
  },

  setupPassword: async (data: SetupPasswordRequest): Promise<VerifyOtpResponse> => {
    const response = await apiClient.post<VerifyOtpResponse>('/api/v1/auth/setup-password', data);
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('active_profile', JSON.stringify(response.user));
    }
    return response;
  },

  login: async (data: LoginRequest): Promise<VerifyOtpResponse> => {
    const response = await apiClient.post<VerifyOtpResponse>('/api/v1/auth/login', data);
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('active_profile', JSON.stringify(response.user));
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('active_profile');
    window.dispatchEvent(new Event('auth_unauthorized'));
  }
};
