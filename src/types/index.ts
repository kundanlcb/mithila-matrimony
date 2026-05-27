/* 
 * Mithila Matrimony - TypeScript Interfaces
 * Defines core application data models
 */

export interface UserProfile {
  userId: string;          // UUID v4 format
  mobileNumber: string;    // E.164 formatted telephone number (e.g. +91XXXXXXXXXX)
  isVerified: boolean;     // True if OTP verification succeeded
  registrationStep: 'auth' | 'biodata' | 'completed'; // Active step in onboarding wizard
  registeredAt: string;    // ISO-8601 Timestamp
}

export interface Biodata {
  biodataId: string;       // UUID v4 format
  userId: string;          // Association key to UserProfile
  fullName: string;        // User's full name
  gender: 'Male' | 'Female';
  age: number;             // Valid range: 18 to 70
  gotra: string;           // Clan/Lineage (e.g. Kashyap, Shandilya, Vatsa, Bhardwaj)
  profession: string;      // Occupation (e.g. Software Engineer, Doctor, Teacher)
  annualIncome: number;    // In INR per annum
  location: string;        // Resident city
  education: string;       // Educational background
  interests: string[];     // Array of hobbies/interests
  photoUrl: string;        // Visual image path
  aboutMe: string;         // Personal bio/introduction
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
