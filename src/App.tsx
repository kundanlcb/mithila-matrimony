import { useState, useEffect } from 'react';
import './styles/index.css';
import {
  initMockDb,
  mockSendOtp,
  mockVerifyOtp,
  mockSubmitBiodata,
  mockGetMatchingProfiles,
  getStoredActiveUser,
  getStoredActiveBiodata,
  mockLogout
} from './mock/mockDb';
import type { Biodata, MatchingProfile, UserProfile } from './types';

function App() {
  // Application State
  const [activeUser, setActiveUser] = useState<UserProfile | null>(null);
  const [activeBiodata, setActiveBiodata] = useState<Biodata | null>(null);
  const [matchingProfiles, setMatchingProfiles] = useState<MatchingProfile[]>([]);
  const [activeView, setActiveView] = useState<'home' | 'auth' | 'register' | 'browse'>('home');

  // Interactive Form States
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [simulatedOtpHint, setSimulatedOtpHint] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  // Multi-step Registration Wizard State
  const [registerStep, setRegisterStep] = useState(1);
  const [biodataForm, setBiodataForm] = useState<Omit<Biodata, 'biodataId' | 'userId'>>({
    fullName: '',
    gender: 'Female',
    age: 24,
    gotra: 'Kashyap',
    profession: 'Software Engineer',
    annualIncome: 1200000,
    location: 'Darbhanga',
    education: 'B.Tech CSE',
    interests: ['Reading', 'Madhubani Painting'],
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400',
    aboutMe: 'Looking for a compatible, grounded soul who values family, culture, and progress.'
  });

  // Load Initial Sessions
  useEffect(() => {
    initMockDb();
    const user = getStoredActiveUser();
    const bio = getStoredActiveBiodata();
    setActiveUser(user);
    setActiveBiodata(bio);

    if (user) {
      if (user.registrationStep === 'biodata') {
        setActiveView('register');
      } else if (user.registrationStep === 'completed') {
        setActiveView('browse');
        setMatchingProfiles(mockGetMatchingProfiles());
      }
    }
  }, []);

  // Update Matching Profiles whenever user/biodata changes
  useEffect(() => {
    if (activeUser && activeUser.registrationStep === 'completed') {
      setMatchingProfiles(mockGetMatchingProfiles());
    }
  }, [activeUser, activeBiodata]);

  // Auth: Trigger Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const res = mockSendOtp(mobileNumber);
    if (res.success) {
      setOtpSent(true);
      setSimulatedOtpHint(res.otpCode);
    } else {
      setAuthError(res.message);
    }
  };

  // Auth: Trigger Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const res = mockVerifyOtp(mobileNumber, otpCode);
    if (res.success && res.registrationStep) {
      const user = getStoredActiveUser();
      setActiveUser(user);
      setSimulatedOtpHint(null);
      setOtpSent(false);
      setOtpCode('');

      if (res.registrationStep === 'biodata') {
        setActiveView('register');
        setRegisterStep(1);
      } else {
        setActiveBiodata(getStoredActiveBiodata());
        setActiveView('browse');
      }
    } else {
      setAuthError(res.message || 'OTP verification failed.');
    }
  };

  // Onboarding Wizard Submit handler
  const handleBiodataSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = mockSubmitBiodata(biodataForm);
    if (res.success) {
      const user = getStoredActiveUser();
      const bio = getStoredActiveBiodata();
      setActiveUser(user);
      setActiveBiodata(bio);
      setActiveView('browse');
    }
  };

  // Logout handler
  const handleLogout = () => {
    mockLogout();
    setActiveUser(null);
    setActiveBiodata(null);
    setMatchingProfiles([]);
    setActiveView('home');
    setMobileNumber('');
  };

  // Helper to append/remove interests
  const toggleInterest = (interest: string) => {
    const list = [...biodataForm.interests];
    const index = list.indexOf(interest);
    if (index !== -1) {
      list.splice(index, 1);
    } else {
      list.push(interest);
    }
    setBiodataForm({ ...biodataForm, interests: list });
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Visual Navigation Bar */}
      <header className="header-nav" style={styles.header}>
        <div style={styles.navContainer}>
          <div style={styles.logoBox} onClick={() => setActiveView(activeUser ? (activeUser.registrationStep === 'completed' ? 'browse' : 'register') : 'home')}>
            <span style={styles.logoSerif}>Mithila</span>
            <span style={styles.logoSans}>Matrimony</span>
          </div>
          <nav style={styles.navMenu}>
            {activeUser ? (
              <div style={styles.loggedInRow}>
                {activeUser.registrationStep === 'completed' && activeBiodata && (
                  <span style={styles.welcomeText}>
                    Namaste, <strong>{activeBiodata.fullName}</strong> ({activeBiodata.gotra})
                  </span>
                )}
                <button className="btn-logout" onClick={handleLogout} style={styles.logoutBtn}>
                  Log Out
                </button>
              </div>
            ) : (
              <button className="btn-auth" onClick={() => setActiveView('auth')} style={styles.authLinkBtn}>
                Register / Sign In
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main style={styles.mainContainer}>
        {/* VIEW 1: HOME LANDING SKELETON */}
        {activeView === 'home' && (
          <section className="animate-fade" style={styles.heroSection}>
            <div style={styles.heroLayout}>
              <div style={styles.heroTextContent}>
                <h1 className="display" style={styles.heroTitle}>
                  Discover Soulmates Embedded in <span style={{ color: 'var(--primary)' }}>Maithil Heritage</span>
                </h1>
                <p style={styles.heroSub}>
                  An elegant, minimalist portal crafted with vibrant magenta design lines. Simulates OTP-based authentication, custom biodata setup, gotra rules, and high-fidelity compatibility calculations.
                </p>
                <div style={styles.heroBtnRow}>
                  <button onClick={() => setActiveView('auth')} style={styles.primaryBtn}>
                    Begin Free Search
                  </button>
                  <button onClick={() => {
                    // Seed local storage with default profiles automatically
                    initMockDb();
                    setActiveView('browse');
                    setMatchingProfiles(mockGetMatchingProfiles());
                  }} style={styles.secondaryBtn}>
                    Explore Mock Profiles
                  </button>
                </div>
              </div>
              <div style={styles.heroVisualBox}>
                {/* Visual Identity Palette demo */}
                <div style={styles.visualAestheticCard} className="animate-scale">
                  <h3 style={styles.visualCardTitle}>Design Identity System</h3>
                  <div style={styles.paletteGrid}>
                    <div style={{ ...styles.paletteBox, backgroundColor: 'hsl(var(--magenta-800))' }}>#880E4F</div>
                    <div style={{ ...styles.paletteBox, backgroundColor: 'hsl(var(--magenta-600))' }}>#B71C1C</div>
                    <div style={{ ...styles.paletteBox, backgroundColor: 'hsl(var(--magenta-500))' }}>#D81B60</div>
                    <div style={{ ...styles.paletteBox, backgroundColor: 'hsl(var(--magenta-300))' }}>#F48FB1</div>
                  </div>
                  <div style={styles.typographySample}>
                    <h2 className="display" style={{ fontSize: '1.4rem' }}>Playfair Serif Header</h2>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem' }}>Outfit Sans-Serif Body Copy</p>
                  </div>
                  <div style={styles.glassBadge} className="flex-center">
                    <span>✨ Modern Glassmorphism Blur</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* VIEW 2: OTP SIGN IN/REGISTER SKELETON */}
        {activeView === 'auth' && (
          <section className="flex-center animate-fade" style={{ minHeight: '60vh' }}>
            <div style={styles.authCard}>
              <h2 className="display" style={styles.authTitle}>Sign In / SignUp</h2>
              <p style={styles.authSubtitle}>Enter your mobile number to receive a simulated verification OTP</p>

              {authError && <div style={styles.errorBanner}>{authError}</div>}

              {!otpSent ? (
                <form onSubmit={handleSendOtp} style={styles.form}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Mobile Number (E.164 format)</label>
                    <input
                      type="tel"
                      placeholder="e.g. +919876543210"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      required
                      style={styles.input}
                    />
                  </div>
                  <button type="submit" style={styles.primaryBtnWidth}>
                    Request Verification OTP
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} style={styles.form}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Enter 6-Digit OTP Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      required
                      style={styles.input}
                    />
                  </div>
                  {simulatedOtpHint && (
                    <div style={styles.simulatedOtpHintBox}>
                      🔔 <strong>Mock Server Message:</strong> Your verification code is: <code>{simulatedOtpHint}</code>
                    </div>
                  )}
                  <button type="submit" style={styles.primaryBtnWidth}>
                    Verify & Authenticate
                  </button>
                  <button type="button" onClick={() => setOtpSent(false)} style={styles.backBtn}>
                    Change Mobile Number
                  </button>
                </form>
              )}
            </div>
          </section>
        )}

        {/* VIEW 3: MULTI-STEP BIODATA REGISTRATION WIZARD */}
        {activeView === 'register' && (
          <section className="animate-fade" style={styles.registerSection}>
            <div style={styles.registerContainer}>
              <div style={styles.wizardHeader}>
                <h2 className="display">Complete Your Matrimonial Biodata</h2>
                <p>Provide details to find highly compatible matches in the community.</p>
                {/* Visual Step Indicator */}
                <div style={styles.stepIndicatorRow}>
                  <div style={{ ...styles.stepDot, backgroundColor: registerStep >= 1 ? 'var(--primary)' : '#ddd' }}>1</div>
                  <div style={{ ...styles.stepLine, backgroundColor: registerStep >= 2 ? 'var(--primary)' : '#ddd' }}></div>
                  <div style={{ ...styles.stepDot, backgroundColor: registerStep >= 2 ? 'var(--primary)' : '#ddd' }}>2</div>
                  <div style={{ ...styles.stepLine, backgroundColor: registerStep >= 3 ? 'var(--primary)' : '#ddd' }}></div>
                  <div style={{ ...styles.stepDot, backgroundColor: registerStep >= 3 ? 'var(--primary)' : '#ddd' }}>3</div>
                </div>
              </div>

              <form onSubmit={handleBiodataSubmit} style={styles.formContainer}>
                {registerStep === 1 && (
                  <div className="animate-fade">
                    <h3 style={styles.stepTitle}>Step 1: General Details</h3>
                    <div style={styles.formGrid}>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input
                          type="text"
                          required
                          value={biodataForm.fullName}
                          onChange={(e) => setBiodataForm({ ...biodataForm, fullName: e.target.value })}
                          style={styles.input}
                          placeholder="e.g. Priyadarshani Thakur"
                        />
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Gender</label>
                        <select
                          value={biodataForm.gender}
                          onChange={(e) => setBiodataForm({ ...biodataForm, gender: e.target.value as 'Male' | 'Female' })}
                          style={styles.input}
                        >
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                        </select>
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Age (Must be 18 to 70)</label>
                        <input
                          type="number"
                          min={18}
                          max={70}
                          required
                          value={biodataForm.age}
                          onChange={(e) => setBiodataForm({ ...biodataForm, age: parseInt(e.target.value) || 18 })}
                          style={styles.input}
                        />
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Highest Education</label>
                        <input
                          type="text"
                          required
                          value={biodataForm.education}
                          onChange={(e) => setBiodataForm({ ...biodataForm, education: e.target.value })}
                          style={styles.input}
                          placeholder="e.g. B.Tech / MBA / Ph.D"
                        />
                      </div>
                    </div>
                    <button type="button" onClick={() => setRegisterStep(2)} style={styles.stepBtn}>
                      Continue to Step 2
                    </button>
                  </div>
                )}

                {registerStep === 2 && (
                  <div className="animate-fade">
                    <h3 style={styles.stepTitle}>Step 2: Lineage & Occupation</h3>
                    <div style={styles.formGrid}>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Gotra</label>
                        <select
                          value={biodataForm.gotra}
                          onChange={(e) => setBiodataForm({ ...biodataForm, gotra: e.target.value })}
                          style={styles.input}
                        >
                          <option value="Kashyap">Kashyap</option>
                          <option value="Shandilya">Shandilya</option>
                          <option value="Vatsa">Vatsa</option>
                          <option value="Bhardwaj">Bhardwaj</option>
                          <option value="Parashar">Parashar</option>
                          <option value="Katyayan">Katyayan</option>
                        </select>
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Profession</label>
                        <input
                          type="text"
                          required
                          value={biodataForm.profession}
                          onChange={(e) => setBiodataForm({ ...biodataForm, profession: e.target.value })}
                          style={styles.input}
                          placeholder="e.g. Software Engineer"
                        />
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Annual Income (INR)</label>
                        <input
                          type="number"
                          required
                          value={biodataForm.annualIncome}
                          onChange={(e) => setBiodataForm({ ...biodataForm, annualIncome: parseInt(e.target.value) || 0 })}
                          style={styles.input}
                        />
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Current City Location</label>
                        <input
                          type="text"
                          required
                          value={biodataForm.location}
                          onChange={(e) => setBiodataForm({ ...biodataForm, location: e.target.value })}
                          style={styles.input}
                          placeholder="e.g. Darbhanga / Bangalore"
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                      <button type="button" onClick={() => setRegisterStep(1)} style={styles.secondaryBtn}>
                        Back
                      </button>
                      <button type="button" onClick={() => setRegisterStep(3)} style={styles.stepBtn}>
                        Continue to Step 3
                      </button>
                    </div>
                  </div>
                )}

                {registerStep === 3 && (
                  <div className="animate-fade">
                    <h3 style={styles.stepTitle}>Step 3: Background & Preferences</h3>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>About Me</label>
                      <textarea
                        rows={3}
                        required
                        value={biodataForm.aboutMe}
                        onChange={(e) => setBiodataForm({ ...biodataForm, aboutMe: e.target.value })}
                        style={{ ...styles.input, resize: 'none' }}
                        placeholder="Write a brief intro..."
                      />
                    </div>
                    <div style={{ ...styles.inputGroup, marginTop: '1rem' }}>
                      <label style={styles.label}>Interests & Hobbies</label>
                      <div style={styles.tagWrapper}>
                        {['Madhubani Painting', 'Classical Music', 'Cooking', 'Reading', 'Travel', 'Gardening', 'Yoga'].map(item => (
                          <div
                            key={item}
                            onClick={() => toggleInterest(item)}
                            style={{
                              ...styles.tagItem,
                              backgroundColor: biodataForm.interests.includes(item) ? 'var(--primary)' : '#e0e0e0',
                              color: biodataForm.interests.includes(item) ? '#fff' : '#444'
                            }}
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                      <button type="button" onClick={() => setRegisterStep(2)} style={styles.secondaryBtn}>
                        Back
                      </button>
                      <button type="submit" style={styles.submitBtn}>
                        Submit & Complete Profile
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </section>
        )}

        {/* VIEW 4: MATRIMONIAL BROWSE GRID (HIGH QUALITY PROFILE CARDS) */}
        {activeView === 'browse' && (
          <section className="animate-fade" style={styles.browseSection}>
            <div style={styles.browseHeader}>
              <div style={styles.browseHeadline}>
                <h1 className="display">Discover Compatibilities</h1>
                <p>Calculating scores based on gotra matching, ages, and target preferences.</p>
              </div>
              {/* Optional filters preview */}
              <div style={styles.quickFiltersContainer}>
                <span>✨ Auto-filtered by Gotra Compatibility rules & opposites gender configurations</span>
              </div>
            </div>

            {matchingProfiles.length === 0 ? (
              <div style={styles.noMatchesBox} className="flex-center">
                <p>No compatible profiles matching your compatibility score threshold found. Try editing preferences!</p>
              </div>
            ) : (
              <div style={styles.profileGrid} className="grid-responsive">
                {matchingProfiles.map((profile) => (
                  <div key={profile.biodataId} className="animate-scale" style={styles.profileCard}>
                    <div style={styles.profileImgContainer}>
                      <img src={profile.photoUrl} alt={profile.fullName} style={styles.profileImg} />
                      <div style={styles.compatibilityBadge}>
                        🎯 {profile.compatibilityScore}% Match
                      </div>
                    </div>
                    <div style={styles.profileDetails}>
                      <div style={styles.detailsRow}>
                        <h3 style={styles.profileName}>{profile.fullName}</h3>
                        <span style={styles.ageGender}>{profile.age} Yrs • {profile.gender}</span>
                      </div>
                      <div style={styles.metaBadgeRow}>
                        <span style={styles.metaBadge}>🧬 Gotra: {profile.gotra}</span>
                        <span style={styles.metaBadge}>📍 {profile.location}</span>
                      </div>
                      <div style={styles.professionalDetail}>
                        💼 <strong>{profile.profession}</strong> ({profile.education})
                      </div>
                      <div style={styles.salaryText}>
                        💰 Annual Income: <strong>₹{(profile.annualIncome / 100000).toFixed(1)} Lakh</strong>
                      </div>
                      <p style={styles.aboutSnippet}>{profile.aboutMe}</p>
                      
                      <div style={styles.interestsRow}>
                        {profile.interests.slice(0, 3).map((interest, i) => (
                          <span key={i} style={styles.interestMiniBadge}>{interest}</span>
                        ))}
                      </div>
                      
                      <button onClick={() => alert(`Connect request simulated successfully to ${profile.fullName}!`)} style={styles.connectBtn}>
                        Request Match Connect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Visual Footer */}
      <footer style={styles.footer}>
        <p>© 2026 Mithila Matrimony. Styled beautifully with pure Vanilla CSS Magenta System guidelines.</p>
      </footer>
    </div>
  );
}

// In-file stylesheet mapping so it compiles seamlessly in standalone environments 
// while drawing all color styling variables from our newly configured index.css global variables!
const styles = {
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid var(--border-light)',
    padding: '1rem 2rem',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
    boxShadow: 'var(--shadow-sm)'
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logoBox: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem'
  },
  logoSerif: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.6rem',
    fontWeight: '700',
    color: 'var(--primary)',
    fontStyle: 'italic' as const
  },
  logoSans: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1.5rem',
    fontWeight: '800',
    color: 'var(--primary-dark)',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px'
  },
  navMenu: {
    display: 'flex',
    alignItems: 'center'
  },
  authLinkBtn: {
    padding: '0.6rem 1.4rem',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
    fontWeight: '600',
    borderRadius: 'var(--radius-full)',
    transition: 'var(--transition-fast)'
  },
  loggedInRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  welcomeText: {
    fontSize: '0.9rem',
    color: 'hsl(var(--neutral-600))'
  },
  logoutBtn: {
    padding: '0.5rem 1.2rem',
    backgroundColor: 'hsl(var(--neutral-200))',
    color: 'hsl(var(--neutral-700))',
    fontWeight: '600',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.85rem'
  },
  mainContainer: {
    flex: 1,
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    padding: '2rem'
  },
  heroSection: {
    padding: '4rem 0'
  },
  heroLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '3rem',
    alignItems: 'center'
  },
  heroTextContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem'
  },
  heroTitle: {
    fontSize: '3rem',
    lineHeight: '1.15'
  },
  heroSub: {
    fontSize: '1.15rem',
    color: 'hsl(var(--neutral-500))'
  },
  heroBtnRow: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
    flexWrap: 'wrap' as const
  },
  primaryBtn: {
    padding: '0.8rem 2rem',
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '1rem',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-md)'
  },
  secondaryBtn: {
    padding: '0.8rem 2rem',
    backgroundColor: '#ffffff',
    color: 'var(--primary-dark)',
    border: '1px solid var(--border-light)',
    fontWeight: '600',
    fontSize: '1rem',
    borderRadius: 'var(--radius-md)'
  },
  heroVisualBox: {
    display: 'flex',
    justifyContent: 'center'
  },
  visualAestheticCard: {
    width: '100%',
    maxWidth: '380px',
    backgroundColor: 'var(--bg-glass)',
    border: '1px solid var(--border-glass)',
    backdropFilter: 'var(--blur-glass)',
    padding: '2rem',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-glass)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
    position: 'relative' as const
  },
  visualCardTitle: {
    fontSize: '1.25rem',
    color: 'var(--primary-dark)'
  },
  paletteGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '0.5rem'
  },
  paletteBox: {
    height: '45px',
    borderRadius: 'var(--radius-sm)',
    color: '#ffffff',
    fontSize: '0.65rem',
    display: 'flex',
    alignItems: 'flex-end',
    padding: '0.25rem',
    fontWeight: '700'
  },
  typographySample: {
    borderTop: '1px solid var(--border-light)',
    paddingTop: '1rem'
  },
  glassBadge: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(216, 27, 96, 0.1)',
    borderRadius: 'var(--radius-full)',
    color: 'var(--primary)',
    fontWeight: '600',
    fontSize: '0.8rem',
    textAlign: 'center' as const
  },
  authCard: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: '#ffffff',
    border: '1px solid var(--border-light)',
    padding: '2.5rem',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem'
  },
  authTitle: {
    fontSize: '2rem',
    textAlign: 'center' as const
  },
  authSubtitle: {
    fontSize: '0.9rem',
    textAlign: 'center' as const,
    color: 'hsl(var(--neutral-500))'
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.2rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.4rem'
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'hsl(var(--neutral-600))'
  },
  input: {
    padding: '0.8rem 1rem',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-light)',
    fontSize: '0.95rem',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    width: '100%'
  },
  primaryBtnWidth: {
    padding: '0.8rem',
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '1rem',
    borderRadius: 'var(--radius-sm)',
    width: '100%',
    boxShadow: 'var(--shadow-md)'
  },
  simulatedOtpHintBox: {
    backgroundColor: '#fff3e0',
    border: '1px solid #ffe0b2',
    color: '#e65100',
    padding: '0.8rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.85rem',
    lineHeight: '1.4'
  },
  errorBanner: {
    backgroundColor: '#ffebee',
    border: '1px solid #ffcdd2',
    color: '#c62828',
    padding: '0.8rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.85rem',
    textAlign: 'center' as const
  },
  backBtn: {
    backgroundColor: 'transparent',
    color: 'hsl(var(--neutral-500))',
    fontSize: '0.85rem',
    textAlign: 'center' as const,
    marginTop: '0.5rem',
    textDecoration: 'underline'
  },
  registerSection: {
    padding: '2rem 0'
  },
  registerContainer: {
    maxWidth: '650px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    border: '1px solid var(--border-light)',
    padding: '3rem',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)'
  },
  wizardHeader: {
    textAlign: 'center' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.6rem',
    marginBottom: '2.5rem'
  },
  stepIndicatorRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '1rem'
  },
  stepDot: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '0.85rem'
  },
  stepLine: {
    height: '2px',
    width: '50px'
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column' as const
  },
  stepTitle: {
    fontSize: '1.25rem',
    color: 'var(--primary-dark)',
    marginBottom: '1.2rem',
    borderBottom: '2px solid var(--primary-light)',
    paddingBottom: '0.4rem'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.2rem'
  },
  stepBtn: {
    padding: '0.8rem 2rem',
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    fontWeight: '600',
    borderRadius: 'var(--radius-sm)',
    marginTop: '1.5rem',
    float: 'right' as const
  },
  submitBtn: {
    padding: '0.8rem 2rem',
    backgroundColor: 'var(--primary-dark)',
    color: '#ffffff',
    fontWeight: '700',
    borderRadius: 'var(--radius-sm)',
    boxShadow: 'var(--shadow-md)'
  },
  tagWrapper: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
    marginTop: '0.5rem'
  },
  tagItem: {
    padding: '0.4rem 1rem',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'var(--transition-fast)'
  },
  browseSection: {
    padding: '1rem 0'
  },
  browseHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottom: '1px solid var(--border-light)',
    paddingBottom: '1.5rem',
    marginBottom: '2rem',
    flexWrap: 'wrap' as const,
    gap: '1.5rem'
  },
  browseHeadline: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.4rem'
  },
  quickFiltersContainer: {
    fontSize: '0.85rem',
    color: 'var(--primary)',
    fontWeight: '600',
    backgroundColor: 'var(--primary-light)',
    padding: '0.5rem 1rem',
    borderRadius: 'var(--radius-md)'
  },
  noMatchesBox: {
    height: '200px',
    backgroundColor: '#ffffff',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-md)',
    color: 'hsl(var(--neutral-500))'
  },
  profileGrid: {
    width: '100%'
  },
  profileCard: {
    backgroundColor: '#ffffff',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-sm)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
    transition: 'var(--transition-normal)'
  },
  profileImgContainer: {
    height: '240px',
    position: 'relative' as const,
    overflow: 'hidden'
  },
  profileImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    transition: 'var(--transition-normal)'
  },
  compatibilityBadge: {
    position: 'absolute' as const,
    bottom: '12px',
    left: '12px',
    backgroundColor: 'rgba(136, 14, 79, 0.95)',
    color: '#ffffff',
    padding: '0.4rem 0.8rem',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.8rem',
    fontWeight: '700',
    boxShadow: 'var(--shadow-sm)'
  },
  profileDetails: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.8rem',
    flex: 1
  },
  detailsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: '0.5rem'
  },
  profileName: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: 'var(--primary-dark)'
  },
  ageGender: {
    fontSize: '0.85rem',
    color: 'hsl(var(--neutral-500))',
    fontWeight: '600',
    flexShrink: 0
  },
  metaBadgeRow: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap' as const
  },
  metaBadge: {
    padding: '0.3rem 0.7rem',
    backgroundColor: 'hsl(var(--neutral-100))',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'hsl(var(--neutral-600))'
  },
  professionalDetail: {
    fontSize: '0.9rem',
    color: 'hsl(var(--neutral-600))'
  },
  salaryText: {
    fontSize: '0.9rem',
    color: 'hsl(var(--neutral-500))'
  },
  aboutSnippet: {
    fontSize: '0.85rem',
    lineHeight: '1.5',
    color: 'hsl(var(--neutral-500))',
    borderTop: '1px solid var(--border-light)',
    paddingTop: '0.8rem',
    marginTop: '0.2rem'
  },
  interestsRow: {
    display: 'flex',
    gap: '0.35rem',
    flexWrap: 'wrap' as const,
    marginTop: '0.2rem'
  },
  interestMiniBadge: {
    padding: '0.2rem 0.5rem',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
    fontSize: '0.7rem',
    borderRadius: 'var(--radius-sm)',
    fontWeight: '600'
  },
  connectBtn: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '0.9rem',
    borderRadius: 'var(--radius-sm)',
    marginTop: '0.8rem',
    transition: 'var(--transition-fast)'
  },
  footer: {
    backgroundColor: 'var(--primary-dark)',
    color: 'hsl(var(--magenta-200))',
    textAlign: 'center' as const,
    padding: '1.5rem',
    fontSize: '0.85rem',
    borderTop: '1px solid var(--primary)'
  }
};

export default App;
