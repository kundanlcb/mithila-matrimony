// API Request / Response Types mapping exactly to Swagger Schema

export interface AuthUserResponse {
  id: string; // uuid
  mobileNumber: string;
  registrationStep: string;
  preferredLanguage?: string;
}

export interface VerifyOtpRequest {
  mobileNumber: string;
  otp: string;
}

export interface VerifyOtpResponse {
  status: string;
  token: string;
  user: AuthUserResponse;
}

export interface RequestOtpRequest {
  mobileNumber: string;
}

export interface RequestOtpResponse {
  status: string;
  message: string;
  expiresInSeconds: number;
}

export interface BiodataResponse {
  id: string; // uuid
  fullName?: string;
  gender?: string;
  age?: number;
  gotra?: string;
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
}

export interface UpdateBiodataRequest {
  fullName?: string;
  gender?: string;
  age?: number;
  gotra?: string;
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
