/* 
 * Mithila Matrimony - High-Fidelity Mock Database & API Client
 * Simulates Spring Boot REST controllers utilizing LocalStorage
 */

import type { UserProfile, Biodata, MatchCriteria, MatchingProfile } from '../types';

// Seed Profiles (Premium visual portraits from Unsplash)
const SEED_PROFILES: Biodata[] = [
  {
    biodataId: 'bio-seed-1',
    userId: 'user-seed-1',
    fullName: 'Aditya Mishra',
    gender: 'Male',
    age: 28,
    gotra: 'Shandilya',
    profession: 'Software Architect',
    annualIncome: 3200000,
    location: 'Bangalore',
    education: 'B.Tech CSE, IIT Kharagpur',
    interests: ['Classical Music', 'Trekking', 'Reading'],
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400',
    aboutMe: 'Software professional working in Bangalore. Proudly rooted in Mithila culture. Looking for a progressive yet traditional partner.'
  },
  {
    biodataId: 'bio-seed-2',
    userId: 'user-seed-2',
    fullName: 'Ananya Jha',
    gender: 'Female',
    age: 25,
    gotra: 'Kashyap',
    profession: 'Senior Business Analyst',
    annualIncome: 1800000,
    location: 'Delhi NCR',
    education: 'MBA, IIM Indore',
    interests: ['Madhubani Painting', 'Cooking', 'Travel'],
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=400',
    aboutMe: 'Passionate about digital transformation and business strategy. I practice Mithila Madhubani art in my free time. Seeking a supportive life companion.'
  },
  {
    biodataId: 'bio-seed-3',
    userId: 'user-seed-3',
    fullName: 'Ravi Kant Thakur',
    gender: 'Male',
    age: 31,
    gotra: 'Vatsa',
    profession: 'IAS Officer',
    annualIncome: 2400000,
    location: 'Patna',
    education: 'M.A. Public Policy, JNU Delhi',
    interests: ['Writing Poetry', 'Civic Activities', 'Chess'],
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400',
    aboutMe: 'Serving in the civil services. Strongly value education, integrity, and cultural heritage. Looking for an accomplished and grounded partner.'
  },
  {
    biodataId: 'bio-seed-4',
    userId: 'user-seed-4',
    fullName: 'Priyanka Choudhary',
    gender: 'Female',
    age: 27,
    gotra: 'Katyayan',
    profession: 'Pediatrician',
    annualIncome: 2200000,
    location: 'Darbhanga',
    education: 'MD Pediatrics, PMCH Patna',
    interests: ['Gardening', 'Social Work', 'Yoga'],
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400',
    aboutMe: 'Working as a pediatrician at a leading medical center in Darbhanga. Deeply passionate about child healthcare and family values.'
  },
  {
    biodataId: 'bio-seed-5',
    userId: 'user-seed-5',
    fullName: 'Vikram Shandilya',
    gender: 'Male',
    age: 29,
    gotra: 'Parashar',
    profession: 'Research Scientist',
    annualIncome: 2800000,
    location: 'Mumbai',
    education: 'Ph.D in Biotechnology, IISc Bangalore',
    interests: ['Photography', 'Astronomy', 'Violin'],
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400&h=400',
    aboutMe: 'Conducting biotech research in Mumbai. Enthusiastic about nature, universe, and traditional Maithili folklore.'
  },
  {
    biodataId: 'bio-seed-6',
    userId: 'user-seed-6',
    fullName: 'Neha Jha',
    gender: 'Female',
    age: 24,
    gotra: 'Bhardwaj',
    profession: 'Graphic Designer',
    annualIncome: 1200000,
    location: 'Bangalore',
    education: 'B.Des, NID Ahmedabad',
    interests: ['Digital Art', 'Baking', 'Indie Music'],
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400',
    aboutMe: 'Creative mind working in a design studio in Bangalore. Energetic, free-spirited, and family-oriented. Looking for a friendly partner.'
  }
];

// LocalStorage Keys
const KEYS = {
  USERS: 'matrimony_users',
  PROFILES: 'matrimony_profiles',
  ACTIVE_USER: 'matrimony_active_user',
  ACTIVE_BIODATA: 'matrimony_active_biodata',
  OTP_STORAGE: 'matrimony_otp_codes'
};

// Get all registered users from storage
export const getAllUsers = (): UserProfile[] => {
  const data = localStorage.getItem(KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

// Initialize Mock database
export const initMockDb = (): void => {
  if (!localStorage.getItem(KEYS.PROFILES)) {
    localStorage.setItem(KEYS.PROFILES, JSON.stringify(SEED_PROFILES));
  }
};

// Simulated REST: POST /api/auth/otp/send
export const mockSendOtp = (mobileNumber: string): { success: boolean; message: string; otpCode: string } => {
  if (!mobileNumber.match(/^\+?[1-9]\d{1,14}$/)) {
    return { success: false, message: 'Invalid mobile number. Must be in E.164 format.', otpCode: '' };
  }
  
  // Generate random 6 digit OTP
  const simulatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store OTP temporarily associated with mobile number in localstorage
  const otps = JSON.parse(localStorage.getItem(KEYS.OTP_STORAGE) || '{}');
  otps[mobileNumber] = simulatedOtp;
  localStorage.setItem(KEYS.OTP_STORAGE, JSON.stringify(otps));

  console.log(`[Mock REST API] Issued OTP to ${mobileNumber}: Code = ${simulatedOtp}`);

  return { 
    success: true, 
    message: `OTP issued successfully.`,
    otpCode: simulatedOtp 
  };
};

// Simulated REST: POST /api/auth/otp/verify
export const mockVerifyOtp = (mobileNumber: string, submittedCode: string): { success: boolean; token?: string; registrationStep?: string; message?: string } => {
  const otps = JSON.parse(localStorage.getItem(KEYS.OTP_STORAGE) || '{}');
  const storedOtp = otps[mobileNumber];
  
  if (storedOtp && storedOtp === submittedCode) {
    // Generate UUID Mock Token
    const mockToken = 'mock-jwt-' + Math.random().toString(36).substr(2, 9);
    
    // Clear OTP
    delete otps[mobileNumber];
    localStorage.setItem(KEYS.OTP_STORAGE, JSON.stringify(otps));
    
    // Check in persistent users list
    const allUsers = getAllUsers();
    let user = allUsers.find(u => u.mobileNumber === mobileNumber);
    
    if (user) {
      const activeU = user;
      // User already exists! Set active session
      localStorage.setItem(KEYS.ACTIVE_USER, JSON.stringify(activeU));
      
      // If completed registration, restore their biodata profile
      if (activeU.registrationStep === 'completed') {
        const allProfiles = getAllProfiles();
        const bio = allProfiles.find(p => p.userId === activeU.userId);
        if (bio) {
          localStorage.setItem(KEYS.ACTIVE_BIODATA, JSON.stringify(bio));
        }
      }
    } else {
      // Create new user profile
      user = {
        userId: 'user-' + Math.random().toString(36).substr(2, 9),
        mobileNumber,
        isVerified: true,
        registrationStep: 'biodata',
        registeredAt: new Date().toISOString()
      };
      
      localStorage.setItem(KEYS.ACTIVE_USER, JSON.stringify(user));
      allUsers.push(user);
      localStorage.setItem(KEYS.USERS, JSON.stringify(allUsers));
    }
    
    return {
      success: true,
      token: mockToken,
      registrationStep: user!.registrationStep
    };
  }
  
  return {
    success: false,
    message: 'Incorrect or expired OTP verification code.'
  };
};

// Get current logged-in user profile from storage
export const getStoredActiveUser = (): UserProfile | null => {
  const data = localStorage.getItem(KEYS.ACTIVE_USER);
  return data ? JSON.parse(data) : null;
};

// Get current logged-in user's biodata from storage
export const getStoredActiveBiodata = (): Biodata | null => {
  const data = localStorage.getItem(KEYS.ACTIVE_BIODATA);
  return data ? JSON.parse(data) : null;
};

// Simulated REST: POST /api/profiles/biodata
export const mockSubmitBiodata = (biodataInput: Omit<Biodata, 'biodataId' | 'userId'>): { success: boolean; biodataId: string; registrationStep: string } => {
  const activeUser = getStoredActiveUser();
  if (!activeUser) {
    throw new Error('Unauthorized request: No active authenticated user found.');
  }

  const biodataId = getStoredActiveBiodata()?.biodataId || 'bio-' + Math.random().toString(36).substr(2, 9);
  
  const completeBiodata: Biodata = {
    ...biodataInput,
    biodataId,
    userId: activeUser.userId
  };

  // Save active user's biodata
  localStorage.setItem(KEYS.ACTIVE_BIODATA, JSON.stringify(completeBiodata));

  // Update user profile status
  const updatedUser: UserProfile = {
    ...activeUser,
    registrationStep: 'completed'
  };
  localStorage.setItem(KEYS.ACTIVE_USER, JSON.stringify(updatedUser));

  // Update in persistent registry
  const allUsers = getAllUsers();
  const indexUser = allUsers.findIndex(u => u.userId === activeUser.userId);
  if (indexUser !== -1) {
    allUsers[indexUser] = updatedUser;
  } else {
    allUsers.push(updatedUser);
  }
  localStorage.setItem(KEYS.USERS, JSON.stringify(allUsers));

  // Add the newly created biodata to the list of profiles if not already there
  const allProfiles = getAllProfiles();
  const index = allProfiles.findIndex(p => p.userId === activeUser.userId);
  if (index !== -1) {
    allProfiles[index] = completeBiodata;
  } else {
    allProfiles.push(completeBiodata);
  }
  localStorage.setItem(KEYS.PROFILES, JSON.stringify(allProfiles));

  return {
    success: true,
    biodataId,
    registrationStep: 'completed'
  };
};

// Simulated REST: GET /api/profiles (All matches except the logged-in user)
export const getAllProfiles = (): Biodata[] => {
  initMockDb();
  const data = localStorage.getItem(KEYS.PROFILES);
  return data ? JSON.parse(data) : SEED_PROFILES;
};

// Simulated REST: GET /api/matches (Matches with Compatibility Calculation)
export const mockGetMatchingProfiles = (criteria?: MatchCriteria): MatchingProfile[] => {
  const activeUser = getStoredActiveUser();
  const activeBiodata = getStoredActiveBiodata();
  const allProfiles = getAllProfiles();

  // Exclude current logged in user's profile from matched listings
  const candidateProfiles = activeUser 
    ? allProfiles.filter(p => p.userId !== activeUser.userId && p.gender !== activeBiodata?.gender)
    : allProfiles;

  const resolvedCriteria: MatchCriteria = criteria || {
    criteriaId: 'default-criteria',
    userId: activeUser?.userId || 'guest',
    minAge: activeBiodata ? (activeBiodata.gender === 'Female' ? 21 : 18) : 18,
    maxAge: activeBiodata ? (activeBiodata.gender === 'Female' ? 35 : 30) : 35,
    allowedGotras: [],
    allowedLocations: [],
    allowedProfessions: []
  };

  return candidateProfiles.map(profile => {
    let score = 0;
    
    // 1. Gotra alignment (40 pts)
    if (resolvedCriteria.allowedGotras.length > 0) {
      if (resolvedCriteria.allowedGotras.includes(profile.gotra)) {
        score += 40;
      }
    } else {
      score += 40; // Default to compatibility
    }

    // 2. Age compatibility (30 pts)
    if (profile.age >= resolvedCriteria.minAge && profile.age <= resolvedCriteria.maxAge) {
      score += 30;
    } else {
      // Partial credit for adjacent ages
      const diff = Math.min(Math.abs(profile.age - resolvedCriteria.minAge), Math.abs(profile.age - resolvedCriteria.maxAge));
      if (diff <= 3) score += 15;
    }

    // 3. Location compatibility (30 pts)
    if (resolvedCriteria.allowedLocations.length > 0) {
      if (resolvedCriteria.allowedLocations.includes(profile.location)) {
        score += 30;
      } else {
        score += 10; // Partial local alignment
      }
    } else {
      score += 30; // Default compatibility
    }

    // 4. Profession compatibility (Bonus pts)
    if (resolvedCriteria.allowedProfessions.length > 0 && resolvedCriteria.allowedProfessions.includes(profile.profession)) {
      score = Math.min(100, score + 10);
    }

    return {
      ...profile,
      compatibilityScore: score
    };
  })
  .filter(p => p.compatibilityScore >= 60) // Threshold filter
  .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
};

// Logout User Utility
export const mockLogout = (): void => {
  localStorage.removeItem(KEYS.ACTIVE_USER);
  localStorage.removeItem(KEYS.ACTIVE_BIODATA);
};
