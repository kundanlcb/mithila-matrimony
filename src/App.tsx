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

  // Quick-Match Form States
  const [searchGender, setSearchGender] = useState<'Male' | 'Female'>('Male');
  const [searchLook, setSearchLook] = useState<'Male' | 'Female'>('Female');
  const [searchGotra, setSearchGotra] = useState('Any');

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

  // Hero Widget: Handle Quick-Match Search
  const handleQuickMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    initMockDb();
    
    // We are looking for searchLook (gender) of searchGotra
    const allProfs = mockGetMatchingProfiles();
    const filtered = allProfs.filter(p => {
      const matchGender = p.gender === searchLook;
      const matchGotra = searchGotra === 'Any' || p.gotra.toLowerCase() === searchGotra.toLowerCase();
      return matchGender && matchGotra;
    });
    
    setMatchingProfiles(filtered);
    setActiveView('browse');
  };

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
      {/* Visual Navigation Bar (Stretches 100% full screen width) */}
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

      {/* Main Container (Removed top-level max-width limits to enable full-bleed screen blocks!) */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        {/* VIEW 1: HOME LANDING VIEW (MODERN FULL-SCREEN SECTION GRIDS) */}
        {activeView === 'home' && (
          <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            
            {/* HERO HERO SECTION */}
            <section className="full-bleed-row" style={{ padding: '6rem 0' }}>
              <div className="section-wrapper hero-grid-layout">
                <div style={styles.heroTextContent}>
                  {/* Gotra-Safe Platform Badge */}
                  <div style={{ alignSelf: 'flex-start', padding: '0.4rem 1rem', background: 'var(--primary-light)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-full)', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '700', marginBottom: '-0.5rem' }}>
                    {t('hero_tag') || '🧬 Gotra-Safe Matrimonial Platform'}
                  </div>

                  <h1 className="display" style={styles.heroTitle}>
                    {t('hero_title_prefix')}
                    <span style={{ color: 'var(--primary)' }}>{t('hero_title_accent')}</span>
                  </h1>
                  <p style={styles.heroSub}>
                    {t('hero_subtitle')}
                  </p>

                  {/* QUICK MATCH WIDGET */}
                  <form onSubmit={handleQuickMatchSubmit} className="quick-match-widget animate-fade">
                    <div className="widget-input-group">
                      <label className="widget-label">{t('widget_gender')}</label>
                      <select 
                        className="widget-select"
                        value={searchGender}
                        onChange={(e) => setSearchGender(e.target.value as 'Male' | 'Female')}
                      >
                        <option value="Male">{t('widget_male')}</option>
                        <option value="Female">{t('widget_female')}</option>
                      </select>
                    </div>

                    <div className="widget-input-group">
                      <label className="widget-label">{t('widget_look')}</label>
                      <select 
                        className="widget-select"
                        value={searchLook}
                        onChange={(e) => setSearchLook(e.target.value as 'Male' | 'Female')}
                      >
                        <option value="Female">{t('widget_female')}</option>
                        <option value="Male">{t('widget_male')}</option>
                      </select>
                    </div>

                    <div className="widget-input-group">
                      <label className="widget-label">{t('widget_gotra')}</label>
                      <select 
                        className="widget-select"
                        value={searchGotra}
                        onChange={(e) => setSearchGotra(e.target.value)}
                      >
                        <option value="Any">{t('widget_any')}</option>
                        <option value="Kashyap">Kashyap</option>
                        <option value="Shandilya">Shandilya</option>
                        <option value="Vatsa">Vatsa</option>
                        <option value="Katyayan">Katyayan</option>
                        <option value="Parashar">Parashar</option>
                        <option value="Bhardwaj">Bhardwaj</option>
                      </select>
                    </div>

                    <button type="submit" className="widget-submit-btn">
                      {t('widget_submit')}
                    </button>
                  </form>
                </div>
                
                <div style={styles.heroVisualBox}>
                  <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', width: '100%', maxWidth: '400px' }}>
                    {/* Floating Trust Badge 1 */}
                    <div 
                      className="stat-floating-pill animate-scale" 
                      style={{ top: '-15px', left: '-15px', zIndex: 30 }}
                    >
                      ⭐ {locale === 'en' ? '4.9 App Rating' : '4.9 ऐप रेटिंग'}
                    </div>

                    <div className="floating-card-deck">
                      {/* Main Portrait Candidate Card */}
                      <div className="deck-card-primary animate-scale">
                        <div className="deck-floating-badge-gotra">🧬 {locale === 'en' ? 'Kashyap' : 'कश्यप'}</div>
                        <img 
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=400" 
                          alt="Ananya Jha" 
                          className="deck-card-candidate-img" 
                        />
                        <div className="deck-card-candidate-details">
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-headers)' }}>Ananya Jha</h3>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {locale === 'en' ? '25 Yrs • Delhi NCR' : '25 वर्ष • दिल्ली एनसीआर'}
                          </p>
                        </div>
                      </div>

                      {/* Secondary Overlapping Card - 98% Compatibility Bubble */}
                      <div className="deck-card-secondary">
                        <div style={{ backgroundColor: 'var(--primary)', color: '#ffffff', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem', flexShrink: 0 }}>
                          🎯
                        </div>
                        <div>
                          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-headers)', fontWeight: 700 }}>98% {t('card_match')}</h4>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{locale === 'en' ? 'Gotra Compatible' : 'गोत्र अनुकूल'}</p>
                        </div>
                      </div>

                      {/* Tertiary Overlapping Card - Verified Partner */}
                      <div className="deck-card-tertiary">
                        <span>✨ {locale === 'en' ? 'Verified' : 'सत्यापित'}</span>
                      </div>
                    </div>

                    {/* Floating Trust Badge 2 */}
                    <div 
                      className="stat-floating-pill animate-scale" 
                      style={{ bottom: '-15px', right: '-15px', zIndex: 30 }}
                    >
                      🛡️ {locale === 'en' ? '12K+ Verified Couples' : '12K+ सत्यापित जोड़े'}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION A: WHY CHOOSE US (SPLIT EDITORIAL VIEW) */}
            <section className="full-bleed-row">
              <div className="section-wrapper">
                <div className="why-split-layout">
                  {/* Left Column: Bold Copy & Subtitles */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
                    <div style={{ alignSelf: 'flex-start', padding: '0.35rem 0.9rem', background: 'var(--primary-light)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-full)', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {locale === 'en' ? 'Cultural Heritage Safeties' : 'सांस्कृतिक विरासत और गोत्र सुरक्षा'}
                    </div>
                    <h2 className="display" style={{ fontSize: '2.5rem', lineHeight: '1.2', color: 'var(--text-headers)' }}>
                      {t('landing_why_title')}
                    </h2>
                    <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                      {t('landing_why_desc')}
                    </p>
                    <div style={{ marginTop: '0.5rem' }}>
                      <button onClick={() => setActiveView('auth')} className="widget-submit-btn" style={{ width: 'auto', padding: '0.75rem 2rem', borderRadius: 'var(--radius-md)' }}>
                        {t('btn_begin_search')}
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Visual Feature Badges */}
                  <div className="why-feature-badge-list">
                    <div className="why-feature-badge-card">
                      <div className="why-icon-container">🧬</div>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-headers)', marginBottom: '0.3rem' }}>
                          {t('landing_why_item1_title')}
                        </h4>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                          {t('landing_why_item1_desc')}
                        </p>
                      </div>
                    </div>

                    <div className="why-feature-badge-card">
                      <div className="why-icon-container">🔒</div>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-headers)', marginBottom: '0.3rem' }}>
                          {t('landing_why_item2_title')}
                        </h4>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                          {t('landing_why_item2_desc')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION B: WHAT WE OFFER (DARK CANVAS & CONVERSATIONAL PREVIEW WIDGET) */}
            <section className="full-bleed-row what-dark-canvas">
              <div className="section-wrapper">
                <div className="what-dark-layout">
                  {/* Left Column: Conversational Chat Mock Widget */}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="mock-chat-widget-landing animate-scale">
                      <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.6rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4caf50' }}></div>
                        <span style={{ fontSize: '0.75rem', color: 'hsl(var(--magenta-200))', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {locale === 'en' ? 'Live Chat Preview' : 'लाइव चैट पूर्वावलोकन'}
                        </span>
                      </div>
                      
                      {/* Bubble 1: Bot welcome */}
                      <div className="mock-chat-bubble-bot">
                        💬 {locale === 'en' ? "Welcome to Mithila Matrimony! First, what is your full name?" : "मिथिला मैट्रिमोनी में आपका स्वागत है! सबसे पहले, आपका पूरा नाम क्या है?"}
                      </div>

                      {/* Bubble 2: User reply */}
                      <div className="mock-chat-bubble-user">
                        {locale === 'en' ? "Ananya Jha" : "अनन्या झा"}
                      </div>

                      {/* Bubble 3: Bot gotra */}
                      <div className="mock-chat-bubble-bot">
                        🧬 {locale === 'en' ? "Important! What is your cultural Gotra?" : "महत्वपूर्ण! आपका सांस्कृतिक गोत्र क्या है?"}
                      </div>

                      {/* Bubble 4: User gotra */}
                      <div className="mock-chat-bubble-user">
                        {locale === 'en' ? "Kashyap" : "कश्यप"}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Editorial Text Copy */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
                    <div style={{ alignSelf: 'flex-start', padding: '0.35rem 0.9rem', background: 'rgba(216, 27, 96, 0.15)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 'var(--radius-full)', color: 'var(--primary-dark)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {locale === 'en' ? 'Interactive Onboarding' : 'संवादात्मक ऑनबोर्डिंग ऑन-द-फ्लाई'}
                    </div>
                    <h2 className="display" style={{ fontSize: '2.5rem', lineHeight: '1.2', color: '#ffffff' }}>
                      {t('landing_what_title')}
                    </h2>
                    <p style={{ fontSize: '1.05rem', color: 'hsl(var(--magenta-200))', lineHeight: '1.7' }}>
                      {t('landing_what_desc')}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginTop: '0.5rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.3rem' }}>
                          {t('landing_what_item1_title')}
                        </h4>
                        <p style={{ fontSize: '0.88rem', color: 'hsl(var(--magenta-200))', lineHeight: '1.5' }}>
                          {t('landing_what_item1_desc')}
                        </p>
                      </div>

                      <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.3rem' }}>
                          {t('landing_what_item2_title')}
                        </h4>
                        <p style={{ fontSize: '0.88rem', color: 'hsl(var(--magenta-200))', lineHeight: '1.5' }}>
                          {t('landing_what_item2_desc')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION C: WHO WE ARE (TRUSTED STATS DASHBOARD & LINEAGE GEOGRAPHY) */}
            <section className="full-bleed-row">
              <div className="section-wrapper">
                <div className="who-stats-layout">
                  {/* Left Column: Brand Story & Trust Description */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
                    <div style={{ alignSelf: 'flex-start', padding: '0.35rem 0.9rem', background: 'var(--primary-light)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-full)', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {locale === 'en' ? 'Global Maithil Alliance' : 'वैश्विक मैथिल गठबंधन'}
                    </div>
                    <h2 className="display" style={{ fontSize: '2.5rem', lineHeight: '1.2', color: 'var(--text-headers)' }}>
                      {t('landing_who_title')}
                    </h2>
                    <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                      {t('landing_who_desc')}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem', marginTop: '0.3rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-headers)', marginBottom: '0.2rem' }}>
                          📍 {t('landing_who_item1_title')}
                        </h4>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                          {t('landing_who_item1_desc')}
                        </p>
                      </div>

                      <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-headers)', marginBottom: '0.2rem' }}>
                          🤝 {t('landing_who_item2_title')}
                        </h4>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                          {t('landing_who_item2_desc')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Dynamic Statistics Dashboard */}
                  <div className="stats-grid-landing">
                    <div className="stat-dashboard-card animate-scale" style={{ borderLeft: '3px solid var(--gold-primary)' }}>
                      <span className="stat-number-large">12K+</span>
                      <span className="stat-label-desc">{locale === 'en' ? 'Verified Couples' : 'सत्यापित जोड़े'}</span>
                    </div>

                    <div className="stat-dashboard-card animate-scale" style={{ borderLeft: '3px solid var(--primary)' }}>
                      <span className="stat-number-large">99.8%</span>
                      <span className="stat-label-desc">{locale === 'en' ? 'Gotra Match Rating' : 'गोत्र अनुकूलता दर'}</span>
                    </div>

                    <div className="stat-dashboard-card animate-scale" style={{ borderLeft: '3px solid var(--primary)' }}>
                      <span className="stat-number-large">100%</span>
                      <span className="stat-label-desc">{locale === 'en' ? 'Privacy Secured' : 'पूर्ण गोपनीयता'}</span>
                    </div>

                    <div className="stat-dashboard-card animate-scale" style={{ borderLeft: '3px solid var(--gold-primary)' }}>
                      <span className="stat-number-large">50+</span>
                      <span className="stat-label-desc">{locale === 'en' ? 'Maithil Cities' : 'वैश्विक मैथिल शहर'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: OTP SIGN IN/REGISTER SKELETON (PERFECT CENTERING ALIGNMENT WRAPPERS) */}
        {activeView === 'auth' && (
          <div className="auth-layout-wrapper animate-fade">
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
          </div>
        )}

        {/* VIEW 3: MULTI-STEP CONVERSATIONAL REGISTRATION WIZARD */}
        {activeView === 'register' && (
          <div className="animate-fade" style={{ width: '100%', padding: '3rem 2rem' }}>
            <div style={{ maxWidth: '650px', margin: '0 auto' }}>
              <RegistrationChat 
                onComplete={() => {
                  setActiveUser(getStoredActiveUser());
                  setActiveBiodata(getStoredActiveBiodata());
                  setActiveView('browse');
                }}
              />
            </div>
          </div>
        )}

        {/* VIEW 4: MATRIMONIAL BROWSE GRID (HIGH QUALITY PROFILE CARDS) */}
        {activeView === 'browse' && (
          <div className="animate-fade" style={{ width: '100%', padding: '3rem 2rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
            </div>
          </div>
        )}
      </main>

      {/* Visual Premium Footer (Stretches 100% full screen width) */}
      <footer className="premium-footer">
        <div className="section-wrapper" style={{ margin: '0 auto' }}>
          <div className="footer-grid">
            {/* Column 1: Brand Info */}
            <div className="footer-col">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <span style={{ ...styles.logoSerif, color: '#ffffff' }}>{t('brand_serif')}</span>
                <span style={{ ...styles.logoSans, color: 'var(--gold-primary)' }}>{t('brand_sans')}</span>
              </div>
              <p className="footer-brand-desc">
                {locale === 'en' 
                  ? 'The premier cultural matrimonial portal tailored for global Maithil families. Designed with heritage aesthetics, secure gotra rules, and high-fidelity compatibility algorithms.' 
                  : 'वैश्विक मैथिल परिवारों के लिए विशेष रूप से तैयार किया गया प्रमुख सांस्कृतिक विवाह मंच। समृद्ध सांस्कृतिक विरासत, सुरक्षित गोत्र नियमों और उच्च-सटीकता अनुकूलता एल्गोरिदम के साथ डिज़ाइन किया गया।'}
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="footer-col">
              <h4 className="footer-col-title">{locale === 'en' ? 'Navigate' : 'नेविगेट'}</h4>
              <ul className="footer-links">
                <li className="footer-link-item" onClick={() => setActiveView(activeUser ? (activeUser.registrationStep === 'completed' ? 'browse' : 'register') : 'home')}>
                  {locale === 'en' ? 'Home' : 'मुख्य पृष्ठ'}
                </li>
                {!activeUser ? (
                  <li className="footer-link-item" onClick={() => setActiveView('auth')}>
                    {t('btn_auth')}
                  </li>
                ) : (
                  <li className="footer-link-item" onClick={() => setActiveView(activeUser.registrationStep === 'completed' ? 'browse' : 'register')}>
                    {activeUser.registrationStep === 'completed' ? (locale === 'en' ? 'Browse Matches' : 'मैच खोजें') : (locale === 'en' ? 'Complete Profile' : 'बायोडाटा पूरा करें')}
                  </li>
                )}
                <li className="footer-link-item" onClick={() => { initMockDb(); setActiveView('browse'); setMatchingProfiles(mockGetMatchingProfiles()); }}>
                  {t('btn_explore_mocks')}
                </li>
              </ul>
            </div>

            {/* Column 3: Gotras & Customs */}
            <div className="footer-col">
              <h4 className="footer-col-title">{locale === 'en' ? 'Lineages' : 'प्रमुख गोत्र'}</h4>
              <ul className="footer-links" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                <li className="footer-link-item" style={{ cursor: 'default' }}>Kashyap</li>
                <li className="footer-link-item" style={{ cursor: 'default' }}>Shandilya</li>
                <li className="footer-link-item" style={{ cursor: 'default' }}>Vatsa</li>
                <li className="footer-link-item" style={{ cursor: 'default' }}>Katyayan</li>
                <li className="footer-link-item" style={{ cursor: 'default' }}>Parashar</li>
                <li className="footer-link-item" style={{ cursor: 'default' }}>Bhardwaj</li>
              </ul>
            </div>

            {/* Column 4: Highly Optimized System Controls */}
            <div className="footer-col">
              <h4 className="footer-col-title">{locale === 'en' ? 'Settings' : 'सिस्टम विकल्प'}</h4>
              <div className="footer-controls-group">
                {/* Language Switcher Button */}
                <button 
                  className="footer-toggle-btn"
                  onClick={() => setLanguage(locale === 'en' ? 'hi' : 'en')}
                  title={locale === 'en' ? 'Switch Language to Hindi' : 'भाषा हिंदी से अंग्रेजी में बदलें'}
                >
                  🌐 {locale === 'en' ? 'हिंदी (Hindi)' : 'English (अंग्रेजी)'}
                </button>
                
                {/* Theme Selector Switcher */}
                <button 
                  className="footer-toggle-btn"
                  onClick={toggleTheme}
                  title={locale === 'en' ? 'Switch Color Theme' : 'थीम बदलें'}
                >
                  {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </button>
              </div>
            </div>
          </div>

          <hr className="footer-divider" />

          <div className="footer-bottom-row">
            <p className="footer-copyright">
              © 2026 {t('brand_serif')}{t('brand_sans')}. {locale === 'en' ? 'All Rights Reserved. Proudly protecting Maithil heritage and lineage custom safeties.' : 'सर्वाधिकार सुरक्षित। गर्व से मैथिल परंपराओं और गोत्र अनुकूलता नियमों की रक्षा करता है।'}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'hsl(var(--magenta-300))' }}>
              {locale === 'en' ? 'Developed with Pure Vanilla CSS & React 19' : 'प्योर वैनिला सीएसएस और रिएक्ट 19 द्वारा संचालित'}
            </p>
          </div>
        </div>
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
    transition: 'all 0.3s ease',
    width: '100%'
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
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
    transition: 'all 0.3s ease',
    width: '100%'
  }
};

export default App;
