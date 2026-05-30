/* 
 * Maithil Match - TypeScript Interfaces
 * Defines core application data models
 */

export interface UserProfile {
  userId: string;          // UUID v4 format
  mobileNumber: string;    // E.164 formatted telephone number (e.g. +91XXXXXXXXXX)
  isVerified: boolean;     // True if OTP verification succeeded
  registrationStep: 'auth' | 'biodata' | 'completed'; // Active step in onboarding wizard
  registeredAt: string;    // ISO-8601 Timestamp
  hidden?: boolean;
  active?: boolean;
  email?: string;
}

export interface AddressResponse {
  id: string;
  addressType: 'current' | 'native';
  city: string;
  state: string;
  country: string;
  pincode?: string;
  streetAddress?: string;
}

export interface Biodata {
  biodataId: string;       // UUID v4 format
  userId: string;          // Association key to UserProfile
  fullName: string;        // User's full name
  gender: 'Male' | 'Female';
  age: number;             // Valid range: 18 to 70
  gotra: string;           // Clan/Lineage (e.g. Kashyap, Shandilya, Vatsa, Bhardwaj)
  religion?: string;       // Religion (e.g. Hindu, Muslim, Christian)
  caste?: string;          // Caste (e.g. Brahmin, Kayastha)
  profession: string;      // Occupation (e.g. Software Engineer, Doctor, Teacher)
  annualIncome: number;    // In INR per annum
  location: string;        // Resident city
  education: string;       // Educational background
  interests: string[];     // Array of hobbies/interests
  photoUrl: string;        // Visual image path
  aboutMe: string;         // Personal bio/introduction
  height?: string;         // Height e.g. "5' 8\""
  maritalStatus?: string;  // Never Married, Divorced, etc.
  diet?: string;           // Vegetarian, Non-Vegetarian, etc.
  complexion?: string;     // Fair, Wheatish, etc.
  phoneNumber?: string;
  email?: string;
  addresses?: AddressResponse[];
  additionalPhotos?: string[];
}

export interface MatchCriteria {
  criteriaId: string;      // UUID v4 format
  userId: string;          // Reference to the searching UserProfile
  minAge: number;          // Default: 18
  maxAge: number;          // Default: 70
  allowedGotras: string[]; // List of preferred gotras (empty implies all)
  allowedLocations: string[]; // List of preferred locations (empty implies all)
  allowedProfessions: string[]; // List of preferred professions (empty implies all)
}

export interface MatchingProfile extends Biodata {
  compatibilityScore: number; // Percentage Match rating: 0 to 100
}

export type InteractionType = 'interest_sent' | 'shortlisted' | 'passed' | 'match_accepted' | 'match_declined';

export interface ProfileInteraction {
  interactionId: string;
  fromUserId: string;       // The user performing the action
  toProfileId: string;      // The profile they acted upon
  type: InteractionType;
  timestamp: string;        // ISO timestamp
}
