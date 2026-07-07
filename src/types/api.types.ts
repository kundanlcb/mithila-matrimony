// API Request / Response Types mapping exactly to Swagger Schema

export interface AuthUserResponse {
  id: string; // uuid
  registrationStep: string;
  email: string;
  preferredLanguage?: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  status: string;
  token: string;
  user: AuthUserResponse;
}

export interface SetupPasswordRequest {
  password?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword?: string;
}

export interface RequestOtpRequest {
  email: string;
}

export interface RequestOtpResponse {
  status: string;
  message: string;
  expiresInSeconds: number;
}

import type { AddressResponse } from './index';

export interface AddressRequest {
  addressType: 'current' | 'native';
  city: string;
  state: string;
  country: string;
  pincode?: string;
  streetAddress?: string;
}

export interface BiodataResponse {
  id: string; // uuid
  fullName?: string;
  gender?: string;
  age?: number;
  gotra?: string;
  mool?: string;
  dateOfBirth?: string;
  birthTime?: string;
  birthPlace?: string;
  fatherName?: string;
  motherName?: string;
  siblingsDetail?: string;
  grandparentName?: string;
  religion?: string;
  caste?: string;
  profession?: string;
  annualIncome?: number;
  location?: string;
  education?: string;
  aboutMe?: string;
  photoUrl?: string;
  height?: string;
  maritalStatus?: string;
  diet?: string;
  complexion?: string;
  interests?: string[];
  additionalPhotos?: string[];
  phoneNumber?: string;
  email?: string;
  addresses?: AddressResponse[];
  currentCity?: string;
  currentState?: string;
  pincode?: string;
  locality?: string;
  nativeDistrict?: string;
}

export interface UpdateBiodataRequest {
  fullName?: string;
  gender?: string;
  age?: number;
  gotra?: string;
  mool?: string;
  dateOfBirth?: string;
  birthTime?: string;
  birthPlace?: string;
  fatherName?: string;
  motherName?: string;
  siblingsDetail?: string;
  grandparentName?: string;
  religion?: string;
  caste?: string;
  profession?: string;
  annualIncome?: number;
  location?: string;
  education?: string;
  aboutMe?: string;
  photoUrl?: string;
  height?: string;
  maritalStatus?: string;
  diet?: string;
  complexion?: string;
  interests?: string[];
  additionalPhotos?: string[];
  email?: string;
  addresses?: AddressRequest[];
  currentCity?: string;
  currentState?: string;
  pincode?: string;
  locality?: string;
  nativeDistrict?: string;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  fileUrl: string;
}

export interface MatchProfileResponse {
  id: string; // uuid
  fullName?: string;
  age?: number;
  gotra?: string;
  compatibilityScore?: number;
  photoUrl?: string;
  profession?: string;
  annualIncome?: number;
  location?: string;
}

export interface PageMatchProfileResponse {
  totalElements: number;
  totalPages: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  size: number;
  number: number;
  empty: boolean;
  content: MatchProfileResponse[];
}

export interface CriteriaRequest {
  minAge?: number;
  maxAge?: number;
  minIncome?: number;
  maritalStatus?: string;
  diet?: string;
  allowedGotras?: string[];
  allowedLocations?: string[];
  allowedProfessions?: string[];
}

export interface CriteriaResponse extends CriteriaRequest {
  id: string;
}

export interface SendInteractionRequest {
  toUserId: string; // uuid
  type: string;
}

export interface SendInteractionResponse {
  status: string;
  isMutualMatch?: boolean;
}

export interface SubscriptionStatusResponse {
  planType: 'monthly' | 'pay_per_contact' | 'free';
  status: string;
  creditsRemaining: number;
  endDate?: string;
}

export interface PurchaseRequest {
  planType: 'monthly' | 'pay_per_contact';
  credits?: number;
  paymentRef: string;
}

export interface PurchaseResponse {
  status: string;
  message: string;
  subscriptionId: string;
}

export interface RevealResponse {
  status: string;
  message: string;
  unlocked: boolean;
}
