import { useState, useEffect } from 'react';
import './styles/index.css';
import {
  initMockDb,
  mockSendOtp,
  mockVerifyOtp,
  mockGetMatchingProfiles,
  getStoredActiveUser,
  getStoredActiveBiodata,
  mockLogout
} from './mock/mockDb';
import type { Biodata, MatchingProfile, UserProfile } from './types';
import { useLanguage } from './context/LanguageContext';
import { useTheme } from './context/ThemeContext';
import { RegistrationChat } from './components/RegistrationChat';

function App() {
  // Localization & Theme Hooks
  const { t, locale, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

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
      setAuthError(t(res.message) || res.message);
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
      } else {
        setActiveBiodata(getStoredActiveBiodata());
        setActiveView('browse');
      }
    } else {
      setAuthError(t('error_invalid_otp'));
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

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Visual Navigation Bar */}
      <header className="header-nav" style={styles.header}>
        <div style={styles.navContainer}>
          <div 
            style={styles.logoBox} 
            onClick={() => setActiveView(activeUser ? (activeUser.registrationStep === 'completed' ? 'browse' : 'register') : 'home')}
          >
            <span style={styles.logoSerif}>{t('brand_serif')}</span>
            <span style={styles.logoSans}>{t('brand_sans')}</span>
          </div>
          
          <nav style={styles.navMenu}>
            {/* Switchers Row (Localization & Theme controls) */}
            <div className="theme-lang-row" style={{ marginRight: '1.5rem' }}>
              {/* Language Selector Toggle */}
              <button 
                className="btn-toggle-switch"
                onClick={() => setLanguage(locale === 'en' ? 'hi' : 'en')}
              >
                🌐 {locale === 'en' ? 'हिंदी' : 'English'}
              </button>
              
              {/* Theme Selector Toggle */}
              <button 
                className="btn-toggle-switch"
                onClick={toggleTheme}
              >
                {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
              </button>
            </div>

            {activeUser ? (
              <div style={styles.loggedInRow}>
                {activeUser.registrationStep === 'completed' && activeBiodata && (
                  <span style={styles.welcomeText}>
                    {t('namaste')}, <strong>{activeBiodata.fullName}</strong>
                  </span>
                )}
                <button className="btn-logout" onClick={handleLogout} style={styles.logoutBtn}>
                  {t('btn_logout')}
                </button>
              </div>
            ) : (
              <button className="btn-auth" onClick={() => setActiveView('auth')} style={styles.authLinkBtn}>
                {t('btn_auth')}
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
                  {t('hero_title_prefix')}
                  <span style={{ color: 'var(--primary)' }}>{t('hero_title_accent')}</span>
                </h1>
                <p style={styles.heroSub}>
                  {t('hero_subtitle')}
                </p>
                <div style={styles.heroBtnRow}>
                  <button onClick={() => setActiveView('auth')} style={styles.primaryBtn}>
                    {t('btn_begin_search')}
                  </button>
                  <button 
                    onClick={() => {
                      initMockDb();
                      setActiveView('browse');
                      setMatchingProfiles(mockGetMatchingProfiles());
                    }} 
                    style={styles.secondaryBtn}
                  >
                    {t('btn_explore_mocks')}
                  </button>
                </div>
              </div>
              
              <div style={styles.heroVisualBox}>
                {/* Visual Identity Palette demo */}
                <div style={styles.visualAestheticCard} className="animate-scale">
                  <h3 style={styles.visualCardTitle}>{t('visual_card_title')}</h3>
                  <div style={styles.paletteGrid}>
                    <div style={{ ...styles.paletteBox, backgroundColor: 'hsl(var(--magenta-800))' }}>#880E4F</div>
                    <div style={{ ...styles.paletteBox, backgroundColor: 'hsl(var(--magenta-600))' }}>#B71C1C</div>
                    <div style={{ ...styles.paletteBox, backgroundColor: 'hsl(var(--magenta-500))' }}>#D81B60</div>
                    <div style={{ ...styles.paletteBox, backgroundColor: 'hsl(var(--magenta-300))' }}>#F48FB1</div>
                  </div>
                  <div style={styles.typographySample}>
                    <h2 className="display" style={{ fontSize: '1.4rem', color: 'var(--text-headers)' }}>{t('visual_card_serif')}</h2>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem' }}>{t('visual_card_sub')}</p>
                  </div>
                  <div style={styles.glassBadge} className="flex-center">
                    <span>{t('visual_card_glass')}</span>
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
              <h2 className="display" style={styles.authTitle}>{t('auth_title')}</h2>
              <p style={styles.authSubtitle}>{t('auth_subtitle')}</p>

              {authError && <div style={styles.errorBanner}>{authError}</div>}

              {!otpSent ? (
                <form onSubmit={handleSendOtp} style={styles.form}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>{t('label_phone')}</label>
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
                    {t('btn_request_otp')}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} style={styles.form}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>{t('label_otp')}</label>
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
                      🔔 <strong>{t('simulated_otp_alert')}:</strong> {t('simulated_otp_alert') === 'Mock Server Message' ? 'Your verification code is' : 'आपका सत्यापन कोड है'}: <code>{simulatedOtpHint}</code>
                    </div>
                  )}
                  <button type="submit" style={styles.primaryBtnWidth}>
                    {t('btn_verify_otp')}
                  </button>
                  <button type="button" onClick={() => setOtpSent(false)} style={styles.backBtn}>
                    {t('btn_change_phone')}
                  </button>
                </form>
              )}
            </div>
          </section>
        )}

        {/* VIEW 3: MULTI-STEP CONVERSATIONAL REGISTRATION WIZARD */}
        {activeView === 'register' && (
          <section className="animate-fade" style={styles.registerSection}>
            <div style={{ maxWidth: '650px', margin: '0 auto' }}>
              <RegistrationChat 
                onComplete={() => {
                  setActiveUser(getStoredActiveUser());
                  setActiveBiodata(getStoredActiveBiodata());
                  setActiveView('browse');
                }}
              />
            </div>
          </section>
        )}

        {/* VIEW 4: MATRIMONIAL BROWSE GRID (HIGH QUALITY PROFILE CARDS) */}
        {activeView === 'browse' && (
          <section className="animate-fade" style={styles.browseSection}>
            <div style={styles.browseHeader}>
              <div style={styles.browseHeadline}>
                <h1 className="display">{t('browse_title')}</h1>
                <p>{t('browse_subtitle')}</p>
              </div>
              {/* Optional filters preview */}
              <div style={styles.quickFiltersContainer}>
                <span>{t('browse_alert')}</span>
              </div>
            </div>

            {matchingProfiles.length === 0 ? (
              <div style={styles.noMatchesBox} className="flex-center">
                <p>{t('no_matches')}</p>
              </div>
            ) : (
              <div style={styles.profileGrid} className="grid-responsive">
                {matchingProfiles.map((profile) => (
                  <div key={profile.biodataId} className="animate-scale" style={styles.profileCard}>
                    <div style={styles.profileImgContainer}>
                      <img src={profile.photoUrl} alt={profile.fullName} style={styles.profileImg} />
                      <div style={styles.compatibilityBadge}>
                        🎯 {profile.compatibilityScore}% {t('card_match')}
                      </div>
                    </div>
                    
                    <div style={styles.profileDetails}>
                      <div style={styles.detailsRow}>
                        <h3 style={styles.profileName}>{profile.fullName}</h3>
                        <span style={styles.ageGender}>
                          {profile.age} {locale === 'en' ? 'Yrs' : 'वर्ष'} • {profile.gender === 'Female' ? (locale === 'en' ? 'Female' : 'महिला') : (locale === 'en' ? 'Male' : 'पुरुष')}
                        </span>
                      </div>
                      
                      <div style={styles.metaBadgeRow}>
                        <span style={styles.metaBadge}>🧬 {t('summary_gotra')}: {profile.gotra}</span>
                        <span style={styles.metaBadge}>📍 {profile.location}</span>
                      </div>
                      
                      <div style={styles.professionalDetail}>
                        💼 <strong>{profile.profession}</strong> ({profile.education})
                      </div>
                      
                      <div style={styles.salaryText}>
                        💰 {t('summary_income')}: <strong>₹{(profile.annualIncome / 100000).toFixed(1)} {t('summary_lakh')}</strong>
                      </div>
                      
                      <p style={styles.aboutSnippet}>{profile.aboutMe}</p>
                      
                      <div style={styles.interestsRow}>
                        {profile.interests.slice(0, 3).map((interest, i) => (
                          <span key={i} style={styles.interestMiniBadge}>{interest}</span>
                        ))}
                      </div>
                      
                      <button 
                        onClick={() => alert(locale === 'en' ? `Connect request simulated successfully to ${profile.fullName}!` : `${profile.fullName} को कनेक्ट अनुरोध सफलतापूर्वक भेजा गया!`)} 
                        style={styles.connectBtn}
                      >
                        {t('btn_request_connect')}
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
        <p>© 2026 {t('brand_title')}. {locale === 'en' ? 'Styled beautifully with pure Vanilla CSS Magenta System guidelines.' : 'प्योर वैनिला सीएसएस मैजेंटा सिस्टम के साथ खूबसूरती से तैयार किया गया।'}</p>
      </footer>
    </div>
  );
}

// Visual style definitions
const styles = {
  header: {
    backgroundColor: 'var(--bg-card)',
    borderBottom: '1px solid var(--border-light)',
    padding: '1rem 2rem',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
    boxShadow: 'var(--shadow-sm)',
    transition: 'all 0.3s ease'
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
    color: 'var(--text-muted)'
  },
  logoutBtn: {
    padding: '0.5rem 1.2rem',
    backgroundColor: 'var(--border-light)',
    color: 'var(--text-main)',
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
    color: 'var(--text-muted)'
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
    backgroundColor: 'var(--bg-card)',
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
    backgroundColor: 'var(--bg-card)',
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
    color: 'var(--text-muted)'
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
    color: 'var(--text-muted)'
  },
  input: {
    padding: '0.8rem 1rem',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-light)',
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-main)',
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
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    textAlign: 'center' as const,
    marginTop: '0.5rem',
    textDecoration: 'underline'
  },
  registerSection: {
    padding: '1rem 0'
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
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-muted)'
  },
  profileGrid: {
    width: '100%'
  },
  profileCard: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-sm)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
    transition: 'all 0.3s ease'
  },
  profileImgContainer: {
    height: '240px',
    position: 'relative' as const,
    overflow: 'hidden'
  },
  profileImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const
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
    color: 'var(--text-muted)',
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
    backgroundColor: 'var(--neutral-100)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--text-muted)'
  },
  professionalDetail: {
    fontSize: '0.9rem',
    color: 'var(--text-main)'
  },
  salaryText: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)'
  },
  aboutSnippet: {
    fontSize: '0.85rem',
    lineHeight: '1.5',
    color: 'var(--text-muted)',
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
    borderTop: '1px solid var(--primary)',
    transition: 'all 0.3s ease'
  }
};

export default App;
