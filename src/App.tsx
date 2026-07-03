import { useState, useEffect, useRef } from 'react';
import './styles/index.css';
import { AuthService } from './api/auth.service';
import { BiodataService } from './api/biodata.service';
import { MatchesService } from './api/matches.service';
import { InteractionsService } from './api/interactions.service';
import { SubscriptionService } from './api/subscription.service';
import { UserService } from './api/user.service';
import { apiClient } from './api/apiClient';
import { UploadService } from './api/upload.service';
import type { Biodata, MatchingProfile, UserProfile, ProfileInteraction, InteractionType } from './types';
import { useLanguage } from './context/LanguageContext';
import { useTheme } from './context/ThemeContext';
import { RegistrationChat } from './components/RegistrationChat';
import FilterPanel from './components/FilterPanel';
import ProfileDetail from './components/ProfileDetail';
import MatchInbox from './components/MatchInbox';
import PremiumPaywall from './components/PremiumPaywall';
import { PublicProfileView } from './components/PublicProfileView';
import { ImageSlider } from './components/ImageSlider';

function App() {
  // Localization & Theme Hooks
  const { t, locale, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // Application State
  const [activeUser, setActiveUser] = useState<UserProfile | null>(null);
  const [activeBiodata, setActiveBiodata] = useState<Biodata | null>(null);
  const [matchingProfiles, setMatchingProfiles] = useState<MatchingProfile[]>([]);
  const [activeView, setActiveView] = useState<'home' | 'auth' | 'register' | 'browse' | 'inbox' | 'my-profile' | 'public-profile'>('home');
  const [publicProfileId, setPublicProfileId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'score' | 'age_asc' | 'age_desc' | 'income'>('score');
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  // Interactive Form States
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [simulatedOtpHint, setSimulatedOtpHint] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  // Quick-Match Form States
  // const [searchGender, setSearchGender] = useState<'Male' | 'Female'>('Male');
  // const [searchLook, setSearchLook] = useState<'Male' | 'Female'>('Female');
  // const [searchGotra, setSearchGotra] = useState('Any');



  // Phase 3 States
  const [interactions, setInteractions] = useState<ProfileInteraction[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Biodata | null>(null);
  const [showPaywall, setShowPaywall] = useState<boolean>(false);
  const [profileModalView, setProfileModalView] = useState<'edit' | 'preferences' | 'privacy' | null>(null);
  const [activeFilters, setActiveFilters] = useState<any>({});
  
  // Edit Profile Form State
  const [editForm, setEditForm] = useState<Partial<Biodata>>({});

  // Master data
  const [masterGotras, setMasterGotras] = useState<string[]>([]);
  const [masterCastes, setMasterCastes] = useState<string[]>([]);
  const [masterProfessions, setMasterProfessions] = useState<string[]>([]);
  const [masterReligions, setMasterReligions] = useState<string[]>([]);

  // Subscription status
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);

  // Blocked users
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);

  const loadInteractionsAndMatches = async (userParam?: any, bioParam?: any) => {
    const currentUser = userParam || activeUser;
    const currentBio = bioParam || activeBiodata;
    if (!currentUser || currentUser.registrationStep !== 'completed') return;
    try {
      const [receivedList, sentList, matchesList] = await Promise.all([
        InteractionsService.getReceived(),
        InteractionsService.getSent(),
        InteractionsService.getMatches()
      ]);

      const activeId = currentUser.id || currentUser.userId;
      const activeBioId = currentBio?.biodataId || '';

      const formattedProfiles: any[] = [];
      const virtualInteractions: ProfileInteraction[] = [];

      receivedList.forEach(p => {
        const mappedBio = { ...p, biodataId: p.id, userId: p.id };
        formattedProfiles.push(mappedBio);
        virtualInteractions.push({
          interactionId: p.id,
          fromUserId: p.id,
          toProfileId: activeBioId,
          type: 'interest_sent',
          timestamp: new Date().toISOString()
        });
      });

      sentList.forEach(p => {
        const mappedBio = { ...p, biodataId: p.id, userId: p.id };
        formattedProfiles.push(mappedBio);
        virtualInteractions.push({
          interactionId: p.id,
          fromUserId: activeId,
          toProfileId: p.id,
          type: 'interest_sent',
          timestamp: new Date().toISOString()
        });
      });

      matchesList.forEach(p => {
        const mappedBio = { ...p, biodataId: p.id, userId: p.id };
        formattedProfiles.push(mappedBio);
        virtualInteractions.push({
          interactionId: p.id,
          fromUserId: p.id,
          toProfileId: activeBioId,
          type: 'match_accepted',
          timestamp: new Date().toISOString()
        });
      });

      // Update matchingProfiles to ensure MatchInbox can resolve detail objects
      setMatchingProfiles(prev => {
        const existingIds = new Set(prev.map(p => p.biodataId));
        const newProfiles = formattedProfiles.filter(p => !existingIds.has(p.biodataId));
        return [...prev, ...newProfiles];
      });

      setInteractions(virtualInteractions);
    } catch (e) {
      console.error('Failed to load interactions and matches', e);
    }
  };

  useEffect(() => {
    if (activeView === 'inbox') {
      loadInteractionsAndMatches();
    }
  }, [activeView]);

  // Reset edit form when opening edit modal
  useEffect(() => {
    if (profileModalView === 'edit' && activeBiodata) {
      setEditForm(activeBiodata);
    }
  }, [profileModalView, activeBiodata]);

  // Load Initial Sessions
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('auth_token');
      const savedProfile = localStorage.getItem('active_profile');
      const path = window.location.pathname;
      const isPublicProfile = path.startsWith('/p/');
      let profileId = '';
      
      if (isPublicProfile) {
        profileId = path.replace('/p/', '').replace(/\/$/, '');
        if (profileId) {
          setPublicProfileId(profileId);
          setActiveView('public-profile');
        }
      }

      if (token && savedProfile) {
        const user = JSON.parse(savedProfile);
        setActiveUser(user);
        
        if (user.registrationStep === 'biodata') {
          if (!isPublicProfile) setActiveView('register');
        } else if (user.registrationStep === 'completed') {
          if (!isPublicProfile) setActiveView('browse');
          try {
            const [bio, matches] = await Promise.all([
              BiodataService.getMine(),
              MatchesService.findMatches(0, 20, sortBy)
            ]);
            setActiveBiodata(bio as any);
            setMatchingProfiles(matches.content as any);
            loadInteractionsAndMatches(user, bio);
          } catch (e) {
            console.error('Failed to load profile data', e);
          }
        }
      }
    };
    checkSession();
  }, []);

  // Load Master Data and Subscription Status
  useEffect(() => {
    const fetchMasterData = async () => {
      if (!activeUser) return; // Do not call master data API before login/register
      try {
        const [gotrasList, professionsList, religionsList, castesList] = await Promise.all([
          apiClient.get<any[]>('/api/v1/master-data/gotra'),
          apiClient.get<any[]>('/api/v1/master-data/profession'),
          apiClient.get<any[]>('/api/v1/master-data/religion'),
          apiClient.get<any[]>('/api/v1/master-data/caste')
        ]);
        if (gotrasList?.length) setMasterGotras(gotrasList.map(g => g.name));
        if (professionsList?.length) setMasterProfessions(professionsList.map(p => p.name));
        if (religionsList?.length) setMasterReligions(religionsList.map(r => r.name));
        if (castesList?.length) setMasterCastes(castesList.map(c => c.name));
      } catch (e) {
        console.error('Failed to fetch master data in App', e);
        // Premium localized defaults fallback
        setMasterGotras(['Kashyap', 'Shandilya', 'Vatsa', 'Bhardwaj', 'Parashar', 'Katyayan']);
        setMasterProfessions(['Software Engineer', 'Doctor', 'Teacher', 'Business']);
        setMasterReligions(['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist']);
        setMasterCastes(['Brahmin (Maithil)', 'Kayastha', 'Rajput', 'Baniya', 'Karna Kayastha', 'Yadav', 'Other']);
      }
    };

    fetchMasterData();
  }, [activeUser]);

  // Fetch subscription status whenever logged in user is available
  useEffect(() => {
    if (activeUser && activeUser.registrationStep === 'completed') {
      SubscriptionService.getStatus()
        .then(res => setSubscriptionStatus(res))
        .catch(err => console.error('Failed to fetch subscription status', err));
    }
  }, [activeUser, activeBiodata]);

  // Load blocked users whenever opening privacy modal view
  useEffect(() => {
    if (profileModalView === 'privacy' && activeUser) {
      UserService.getBlocked()
        .then(res => setBlockedUsers(res))
        .catch(err => console.error('Failed to load blocked users', err));
    }
  }, [profileModalView]);

  // Update Matching Profiles whenever user/biodata changes
  useEffect(() => {
    if (activeUser && activeUser.registrationStep === 'completed') {
      MatchesService.findMatches(0, 20, sortBy).then(res => setMatchingProfiles(res.content as any)).catch(console.error);
    }
  }, [activeUser, activeBiodata, sortBy]);

  useEffect(() => {
    if (!isAccountMenuOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isAccountMenuOpen]);

  // Photo upload for Profile Edit modal
  const handleEditPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert(locale === 'en' ? 'File size exceeds 2MB limit.' : 'फ़ाइल का आकार 2MB सीमा से अधिक है।');
        return;
      }
      
      try {
        const fileUrl = await UploadService.uploadFile(file);
        setEditForm(prev => ({
          ...prev,
          additionalPhotos: [...(prev.additionalPhotos || []), fileUrl]
        }));
      } catch (err: any) {
        alert(`Upload failed: ${err.message}`);
      }
    }
  };

  // Address edit helpers
  const getAddressValue = (type: 'current' | 'native', field: 'city' | 'state' | 'country' | 'pincode' | 'streetAddress') => {
    const addr = editForm.addresses?.find(a => a.addressType === type);
    return addr ? addr[field] : '';
  };

  const updateAddressValue = (type: 'current' | 'native', field: 'city' | 'state' | 'country' | 'pincode' | 'streetAddress', val: string) => {
    setEditForm(prev => {
      const list = [...(prev.addresses || [])];
      const idx = list.findIndex(a => a.addressType === type);
      if (idx !== -1) {
        list[idx] = { ...list[idx], [field]: val };
      } else {
        list.push({
          id: Math.random().toString(), // dummy id
          addressType: type,
          city: field === 'city' ? val : '',
          state: field === 'state' ? val : '',
          country: field === 'country' ? val : 'India',
          pincode: field === 'pincode' ? val : '',
          streetAddress: field === 'streetAddress' ? val : ''
        } as any);
      }
      return { ...prev, addresses: list };
    });
  };

  // Hero Widget: Handle Quick-Match Search
  // const handleQuickMatchSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   
  //   if (!activeUser) {
  //     setActiveView('auth');
  //     return;
  //   }
  //
  //   if (activeUser.registrationStep !== 'completed') {
  //     setActiveView('register');
  //     return;
  //   }
  //
  //   try {
  //     const res = await MatchesService.findMatches(0, 20, sortBy);
  //     setMatchingProfiles(res.content as any);
  //     setActiveView('browse');
  //   } catch(e) {
  //     console.error(e);
  //   }
  // };

  // Auth: Trigger Send OTP (Register)
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      await AuthService.requestOtp({ email });
      setOtpSent(true);
      setSimulatedOtpHint("OTP sent via API! (Check logs/SMS/Email)");
    } catch (e: any) {
      setAuthError(e.message || 'Failed to send OTP');
    }
  };

  // Auth: Trigger Verify OTP (Register)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await AuthService.verifyOtp({ email, otp: otpCode });
      if (res.user) {
        setActiveUser(res.user as any);
        setSimulatedOtpHint(null);
        setOtpSent(false);
        setOtpCode('');

        if (res.user.registrationStep === 'biodata' || res.user.registrationStep === 'auth' || res.user.registrationStep === 'password') {
          setActiveView('register');
        } else {
          const bio = await BiodataService.getMine();
          setActiveBiodata(bio as any);
          setActiveView('browse');
        }
      }
    } catch (e: any) {
      setAuthError(e.message || t('error_invalid_otp'));
    }
  };

  // Auth: Trigger Login (Phone + Password)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await AuthService.login({ email, password });
      if (res.user) {
        setActiveUser(res.user as any);
        setPassword('');
        if (res.user.registrationStep === 'completed') {
          const bio = await BiodataService.getMine();
          setActiveBiodata(bio as any);
          setActiveView('browse');
        } else {
          setActiveView('register');
        }
      }
    } catch (e: any) {
      setAuthError(e.message || 'Invalid phone number or password');
    }
  };

  // Logout handler
  const handleLogout = () => {
    AuthService.logout();
    setActiveUser(null);
    setActiveBiodata(null);
    setMatchingProfiles([]);
    setActiveView('home');
    setEmail('');
    setIsAccountMenuOpen(false);
  };

  const handleAccountNavigation = () => {
    if (!activeUser) return;
    setActiveView(activeUser.registrationStep === 'completed' ? 'my-profile' : 'register');
    setIsAccountMenuOpen(false);
  };

  const handleInteraction = async (targetProfileId: string, type: InteractionType) => {
    if (!activeUser) return;
    try {
      await InteractionsService.send({ toUserId: targetProfileId, type });
      setSelectedProfile(null);
      if (type === 'passed') {
        setMatchingProfiles(prev => prev.filter(p => p.biodataId !== targetProfileId) as any);
      }
      loadInteractionsAndMatches();
    } catch (e) {
      console.error('Failed to send interaction', e);
    }
  };

  const handleRemoveInteraction = (_targetProfileId: string, _type: InteractionType) => {
    // This would ideally hit a DELETE /api/v1/interactions endpoint
    console.warn('Remove interaction not implemented on backend yet');
  };

  const handleInboxAction = async (targetUserId: string, type: 'match_accepted' | 'match_declined') => {
    try {
      if (type === 'match_accepted') {
        await InteractionsService.send({ toUserId: targetUserId, type: 'interest_sent' });
      } else {
        await InteractionsService.send({ toUserId: targetUserId, type: 'match_declined' });
      }
      loadInteractionsAndMatches();
    } catch (e) {
      console.error('Failed to handle inbox action', e);
    }
  };

  const handleApplyFilters = async (filters: any) => {
    console.log('Applying filters:', filters);
    setActiveFilters(filters);
  };

  const profileInitial = activeBiodata?.fullName?.trim().charAt(0).toUpperCase() || 'M';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Visual Navigation Bar (Stretches 100% full screen width) */}
      <header className="header-nav" style={styles.header}>
        <div style={styles.navContainer}>
          <div
            className="logo-box"
            style={styles.logoBox} 
            onClick={() => setActiveView(activeUser ? (activeUser.registrationStep === 'completed' ? 'browse' : 'register') : 'home')}
          >
            <svg className="brand-logo-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
              <path transform="translate(-0.4, 3.5) scale(0.7)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="var(--primary)" fillOpacity="0.85"/>
              <path transform="translate(7.6, 3.5) scale(0.7)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="var(--gold-primary, #D4AF37)" fillOpacity="0.85"/>
            </svg>
            <span className="logo-serif" style={styles.logoSerif}>{t('brand_serif')}</span>
            <span className="logo-sans" style={styles.logoSans}>{t('brand_sans')}</span>
          </div>
          
          <nav style={styles.navMenu}>
            {activeUser ? (
              <div className="account-menu" ref={accountMenuRef} style={styles.accountMenuWrapper}>
                {activeUser.registrationStep === 'completed' && (
                  <button 
                    className="header-action-btn"
                    style={{ 
                      position: 'relative',
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      marginRight: '0.5rem', 
                      padding: '0.55rem 1.1rem',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-full)',
                      color: 'var(--primary-dark)',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      whiteSpace: 'nowrap',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => setActiveView('inbox')}
                    title={t('app_inbox')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    <span className="hide-on-mobile">{t('app_inbox')}</span>
                    
                    {/* Notification Badge */}
                    {interactions.length > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        minWidth: '20px',
                        height: '20px',
                        padding: '0 5px',
                        backgroundColor: 'var(--primary)',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '10px',
                        border: '2px solid var(--bg-header)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                      }}>
                        {interactions.length}
                      </span>
                    )}
                  </button>
                )}

                {activeUser.registrationStep === 'completed' && (
                  <div 
                    onClick={() => {
                      if (!subscriptionStatus || subscriptionStatus.planType === 'free') {
                        setShowPaywall(true);
                      }
                    }}
                    className="header-action-btn"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginRight: '0.75rem',
                      padding: '0.55rem 1.1rem',
                      backgroundColor: subscriptionStatus?.planType === 'monthly'
                        ? 'rgba(212, 175, 55, 0.15)'
                        : subscriptionStatus?.planType === 'pay_per_contact'
                          ? 'rgba(226, 0, 114, 0.1)'
                          : 'transparent',
                      border: subscriptionStatus?.planType === 'monthly'
                        ? '1px solid #D4AF37'
                        : subscriptionStatus?.planType === 'pay_per_contact'
                          ? '1px solid var(--primary)'
                          : '1px dashed var(--border-light)',
                      borderRadius: 'var(--radius-full)',
                      color: subscriptionStatus?.planType === 'monthly'
                        ? '#B8860B'
                        : subscriptionStatus?.planType === 'pay_per_contact'
                          ? 'var(--primary)'
                          : 'var(--text-muted)',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {subscriptionStatus?.planType === 'monthly' ? (
                      <>👑 <span className="hide-on-mobile">{locale === 'en' ? 'Premium' : 'प्रीमियम'}</span></>
                    ) : subscriptionStatus?.planType === 'pay_per_contact' ? (
                      <>⭐ <span className="hide-on-mobile">{subscriptionStatus.creditsRemaining} {locale === 'en' ? 'Credits' : 'क्रेडिट'}</span></>
                    ) : (
                      <>💎 <span className="hide-on-mobile">{locale === 'en' ? 'Go Premium' : 'प्रीमियम लें'}</span></>
                    )}
                  </div>
                )}

                <button
                  className="profile-menu-button"
                  type="button"
                  onClick={() => setIsAccountMenuOpen((isOpen) => !isOpen)}
                  style={styles.profileMenuButton}
                  aria-haspopup="menu"
                  aria-expanded={isAccountMenuOpen}
                  aria-label={t('app_open_account_menu')}
                >
                  <span style={styles.profileAvatar}>{profileInitial}</span>
                  <span className="dropdown-chevron" style={styles.dropdownChevron} aria-hidden="true" />
                </button>

                {isAccountMenuOpen && (
                  <div className="account-dropdown" style={styles.accountDropdown} role="menu">
                    <button
                      className="account-menu-item"
                      type="button"
                      onClick={handleAccountNavigation}
                      style={styles.accountMenuItem}
                      role="menuitem"
                    >
                      {t('app_account')}
                    </button>
                    <button
                      className="account-menu-item account-menu-item-danger"
                      type="button"
                      onClick={handleLogout}
                      style={{ ...styles.accountMenuItem, ...styles.logoutMenuItem }}
                      role="menuitem"
                    >
                      {t('btn_logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="btn-auth" onClick={() => { setAuthMode('login'); setActiveView('auth'); }} style={styles.authLinkBtn}>
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
            
            {/* HERO SECTION — Full-width centered, no card deck */}
            <section className="full-bleed-row hero-section-padded">
              
              {/* Background Hearts */}
              <svg className="bg-heart heart-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              <svg className="bg-heart heart-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              <svg className="bg-heart heart-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              <svg className="bg-heart heart-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              <svg className="bg-heart heart-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>

              <div className="section-wrapper">
                <div className="hero-split-layout">
                  {/* Centered Content */}
                  <div className="hero-text-content">
                    {/* Gotra-Safe Platform Badge */}
                    <div style={{ padding: '0.4rem 1rem', background: 'var(--primary-light)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-full)', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '700', display: 'inline-block' }}>
                      {t('hero_tag') || '🧬 Gotra-Safe Matrimonial Platform'}
                    </div>

                    <h1 className="display hero-title">
                      {t('hero_title_prefix')}
                      <span style={{ color: 'var(--primary)' }}>{t('hero_title_accent')}</span>
                    </h1>
                    <p className="hero-subtitle">
                      {t('hero_subtitle')}
                    </p>

                    {/* HERO CTA BUTTONS */}
                    <div className="hero-cta-group animate-fade" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <button 
                        onClick={() => { setAuthMode('register'); setActiveView('auth'); }} 
                        style={{ 
                          padding: '1rem 2rem', 
                          fontSize: '1.1rem', 
                          fontWeight: '700',
                          borderRadius: '50px', 
                          background: 'var(--primary)', 
                          color: 'white',
                          border: 'none',
                          boxShadow: '0 8px 20px rgba(216, 27, 96, 0.4)',
                          cursor: 'pointer',
                          transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        {t('app_get_started_register_free')}
                      </button>
                      <button 
                        onClick={() => { setAuthMode('login'); setActiveView('auth'); }} 
                        style={{ 
                          padding: '1rem 2rem', 
                          fontSize: '1.1rem', 
                          fontWeight: '700',
                          borderRadius: '50px', 
                          background: 'transparent', 
                          color: 'var(--primary)',
                          border: '2px solid var(--primary)',
                          cursor: 'pointer',
                          transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        {t('btn_auth')}
                      </button>
                    </div>
                  </div>

                  {/* Right Side Visual Content (Desktop Only) */}
                  <div className="hero-visual-content animate-fade" style={{ animationDelay: '0.2s' }}>
                    <div className="hero-glow-bg"></div>
                    <div className="hero-image-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg className="hero-hearts-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path transform="translate(1.5, 1.5) scale(0.75)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="var(--primary)" fillOpacity="0.85"/>
                        <path transform="translate(6, 6) scale(0.75)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="var(--gold-primary, #D4AF37)" fillOpacity="0.85"/>
                      </svg>
                      <div className="badge-top-left">
                        <div className="badge-icon-circle">✓</div>
                        <div className="badge-text-stack">
                          <span className="badge-title">{t('trust_stat1_title')}</span>
                          <span className="badge-subtitle">{t('app_authentic_community')}</span>
                        </div>
                      </div>
                      <div className="badge-bottom-right">
                        <div className="badge-icon-circle">🧬</div>
                        <div className="badge-text-stack">
                          <span className="badge-title">{t('trust_stat2_title')}</span>
                          <span className="badge-subtitle">{t('app_perfect_matches')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* NEW SECTION: HOW IT WORKS */}
            <section className="full-bleed-row how-it-works-section">
              <div className="section-wrapper">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem', textAlign: 'center', marginBottom: '4rem' }}>
                  <div style={{ padding: '0.35rem 0.9rem', background: 'var(--primary-light)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-full)', color: 'var(--primary-dark)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {t('app_simple_process')}
                  </div>
                  <h2 className="display" style={{ fontSize: '2.5rem', lineHeight: '1.2', color: 'var(--text-headers)', margin: 0 }}>
                    {t('app_how_maithil_match_works')}
                  </h2>
                  <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: '1.7', margin: 0 }}>
                    {t('app_a_very_easy_4_step_process_to_find_your_partner')}
                  </p>
                </div>
                
                <div className="hiw-card-grid">
                  
                  {/* Card 1 */}
                  <div className="hiw-glass-card animate-fade">
                    <span className="hiw-step-bg-number">01</span>
                    <div className="hiw-icon-container">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                    </div>
                    <h3 className="hiw-card-title">{t('app_create_biodata')}</h3>
                    <p className="hiw-card-desc">{t('app_create_your_biodata_completely_free_in_just_a_few_easy_steps_and_start_searching')}</p>
                  </div>

                  {/* Card 2 */}
                  <div className="hiw-glass-card animate-fade" style={{ animationDelay: '0.2s' }}>
                    <span className="hiw-step-bg-number">02</span>
                    <div className="hiw-icon-container">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
                    </div>
                    <h3 className="hiw-card-title">{t('app_search_biodata')}</h3>
                    <p className="hiw-card-desc">{t('app_you_can_easily_search_biodata_using_many_filters_including_age_profession_educational_qualification_gotra_and_more')}</p>
                  </div>

                  {/* Card 3 */}
                  <div className="hiw-glass-card animate-fade" style={{ animationDelay: '0.4s' }}>
                    <span className="hiw-step-bg-number">03</span>
                    <div className="hiw-icon-container">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </div>
                    <h3 className="hiw-card-title">{t('app_browse_match')}</h3>
                    <p className="hiw-card-desc">{locale === 'en' ? 'Once someone likes your biodata or you like someone\'s biodata, you can instantly review profiles.' : 'एक बार जब किसी को आपका बायोडाटा पसंद आ जाता है या आपको किसी का बायोडाटा पसंद आता है, तो आप तुरंत प्रोफ़ाइल की समीक्षा कर सकते हैं।'}</p>
                  </div>

                  {/* Card 4 */}
                  <div className="hiw-glass-card animate-fade" style={{ animationDelay: '0.6s' }}>
                    <span className="hiw-step-bg-number">04</span>
                    <div className="hiw-icon-container">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    </div>
                    <h3 className="hiw-card-title">{t('app_send_request')}</h3>
                    <p className="hiw-card-desc">{t('app_if_you_feel_the_connection_is_strong_contact_their_guardians_directly_and_proceed_to_get_married_according_to_traditions')}</p>
                  </div>

                </div>
              </div>
            </section>

            {/* SECTION B: WHAT WE OFFER — two-column: premium card left, editorial right */}
            <section className="full-bleed-row what-dark-canvas">
              <div className="section-wrapper">
                <div className="what-dark-layout">

                  {/* LEFT: Premium Match Result Card */}
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="premium-match-card animate-scale">
                      {/* Card top: platform badge */}
                      <div className="pmc-header">
                        <span className="pmc-badge">⚡ {t('app_smart_match')}</span>
                        <span className="pmc-live-dot"><span className="pmc-dot-pulse" />Live</span>
                      </div>

                      {/* Profile pair row */}
                      <div className="pmc-profiles-row">
                        <div className="pmc-profile">
                          <div className="pmc-avatar-ring pmc-avatar-ring--primary">
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120" alt="Ananya" className="pmc-avatar-img" />
                          </div>
                          <span className="pmc-name">Ananya Jha</span>
                          <span className="pmc-meta">{t('app_25_delhi')}</span>
                        </div>

                        {/* Score pill in center */}
                        <div className="pmc-score-center">
                          <div className="pmc-score-ring">
                            <span className="pmc-score-num">99</span>
                            <span className="pmc-score-pct">%</span>
                          </div>
                          <span className="pmc-score-label">{t('app_match')}</span>
                        </div>

                        <div className="pmc-profile">
                          <div className="pmc-avatar-ring pmc-avatar-ring--gold">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120" alt="Vikas" className="pmc-avatar-img" />
                          </div>
                          <span className="pmc-name">Vikas Jha</span>
                          <span className="pmc-meta">{t('app_28_mumbai')}</span>
                        </div>
                      </div>

                      {/* Compatibility chips */}
                      <div className="pmc-chips-row">
                        <span className="pmc-chip pmc-chip--green">🧬 {t('app_gotra_safe')}</span>
                        <span className="pmc-chip pmc-chip--blue">🛡️ {t('app_verified')}</span>
                        <span className="pmc-chip pmc-chip--gold">🌎 {t('app_maithil')}</span>
                      </div>

                      {/* CTA inside card */}
                      <div className="pmc-footer">
                        <span className="pmc-footer-text">
                          {t('app_register_to_view_your_perfect_matches')}
                        </span>
                        <div className="pmc-footer-arrow">→</div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Editorial text */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
                    <div style={{ alignSelf: 'flex-start', padding: '0.35rem 0.9rem', background: 'var(--primary-light)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-full)', color: 'var(--primary-dark)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {t('app_core_platform_services')}
                    </div>
                    <h2 className="display" style={{ fontSize: '2.5rem', lineHeight: '1.2', color: 'var(--text-headers)' }}>
                      {t('landing_what_title')}
                    </h2>
                    <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                      {t('landing_what_desc')}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem', marginTop: '0.3rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-headers)', marginBottom: '0.2rem' }}>{t('landing_what_item1_title')}</h4>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{t('landing_what_item1_desc')}</p>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-headers)', marginBottom: '0.2rem' }}>{t('landing_what_item2_title')}</h4>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{t('landing_what_item2_desc')}</p>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-headers)', marginBottom: '0.2rem' }}>{t('landing_what_item3_title')}</h4>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{t('landing_what_item3_desc')}</p>
                      </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                      <button onClick={() => { setAuthMode('register'); setActiveView('auth'); }} className="cta-button-landing">
                        {t('app_get_started_now')}
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* SECTION A: STATS ONLY DASHBOARD */}
            <section className="full-bleed-row" style={{ padding: '4rem 0' }}>
              <div className="section-wrapper">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem', textAlign: 'center', marginBottom: '4rem' }}>
                  <div style={{ padding: '0.35rem 0.9rem', background: 'var(--primary-light)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-full)', color: 'var(--primary-dark)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {t('app_our_impact')}
                  </div>
                  <h2 className="display" style={{ fontSize: '2.5rem', lineHeight: '1.2', color: 'var(--text-headers)', margin: 0 }}>
                    {t('app_trusted_by_thousands')}
                  </h2>
                  <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: '1.7', margin: 0 }}>
                    {t('app_join_the_fastest_growing_maithil_matrimonial_network')}
                  </p>
                </div>
                <div className="stats-grid animate-fade">
                  
                  <div className="animate-scale" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                    <div className="stat-circle">
                      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', margin: '0' }}>1.2K+</h3>
                      <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', margin: '0', fontWeight: '500' }}>{t('app_verified_couples')}</p>
                    </div>
                  </div>

                  <div className="animate-scale" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', animationDelay: '0.1s' }}>
                    <div className="stat-circle">
                      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', margin: '0' }}>100%</h3>
                      <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', margin: '0', fontWeight: '500' }}>{t('app_privacy_secured')}</p>
                    </div>
                  </div>

                  <div className="animate-scale" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', animationDelay: '0.2s' }}>
                    <div className="stat-circle">
                      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', margin: '0' }}>50+</h3>
                      <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', margin: '0', fontWeight: '500' }}>{t('app_maithil_cities')}</p>
                    </div>
                  </div>

                  <div className="animate-scale" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', animationDelay: '0.3s' }}>
                    <div className="stat-circle">
                      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', margin: '0' }}>94%</h3>
                      <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', margin: '0', fontWeight: '500' }}>{t('app_match_rating')}</p>
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
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
                <button 
                  onClick={() => { setAuthMode('login'); setAuthError(null); }}
                  style={{ 
                    flex: 1, 
                    padding: '0.8rem', 
                    background: authMode === 'login' ? 'var(--primary)' : 'transparent',
                    color: authMode === 'login' ? 'white' : 'var(--text-main)',
                    border: authMode === 'login' ? 'none' : '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                  data-testid="tab-login"
                >
                  {t('auth_tab_login')}
                </button>
                <button 
                  onClick={() => { setAuthMode('register'); setAuthError(null); setOtpSent(false); }}
                  style={{ 
                    flex: 1, 
                    padding: '0.8rem', 
                    background: authMode === 'register' ? 'var(--primary)' : 'transparent',
                    color: authMode === 'register' ? 'white' : 'var(--text-main)',
                    border: authMode === 'register' ? 'none' : '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                  data-testid="tab-register"
                >
                  {t('auth_tab_register')}
                </button>
              </div>

              <h2 className="display" style={styles.authTitle}>
                {authMode === 'login' ? t('auth_title_login') : t('auth_title_register')}
              </h2>
              <p style={styles.authSubtitle}>
                {authMode === 'login' ? t('auth_subtitle_login') : t('auth_subtitle_register')}
              </p>

              {authError && <div style={styles.errorBanner} data-testid="auth-error">{authError}</div>}

              {authMode === 'login' ? (
                <form onSubmit={handleLogin} style={styles.form} data-testid="login-form">
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>{t('label_email')}</label>
                    <input
                      type="email"
                      placeholder="e.g. user@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={styles.input}
                      data-testid="login-phone"
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>{t('label_password')}</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={styles.input}
                      data-testid="login-password"
                    />
                  </div>
                  <button type="submit" style={styles.primaryBtnWidth} data-testid="btn-login">
                    {t('btn_login')}
                  </button>
                </form>
              ) : (
                !otpSent ? (
                  <form onSubmit={handleSendOtp} style={styles.form} data-testid="register-form">
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>{t('label_email')}</label>
                      <input
                        type="email"
                        placeholder="e.g. user@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                        data-testid="register-phone"
                      />
                    </div>
                    <button type="submit" style={styles.primaryBtnWidth} data-testid="btn-request-otp">
                      {t('btn_request_otp')}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} style={styles.form} data-testid="verify-otp-form">
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
                        data-testid="register-otp"
                      />
                    </div>
                    {simulatedOtpHint && (
                      <div style={styles.simulatedOtpHintBox}>
                        🔔 <strong>{t('simulated_otp_alert')}:</strong> {t('simulated_otp_alert') === 'Mock Server Message' ? 'Your verification code is' : 'आपका सत्यापन कोड है'}: <code>{simulatedOtpHint}</code>
                      </div>
                    )}
                    <button type="submit" style={styles.primaryBtnWidth} data-testid="btn-verify-otp">
                      {t('btn_verify_otp')}
                    </button>
                    <button type="button" onClick={() => setOtpSent(false)} style={styles.backBtn}>
                      {t('btn_change_phone')}
                    </button>
                  </form>
                )
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: MULTI-STEP CONVERSATIONAL REGISTRATION WIZARD */}
        {activeView === 'register' && (
          <div className="animate-fade" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '800px' }}>
              <RegistrationChat 
                onComplete={() => {
                  const userStr = localStorage.getItem('active_profile');
                  if (userStr) {
                    const user = JSON.parse(userStr);
                    user.registrationStep = 'completed';
                    localStorage.setItem('active_profile', JSON.stringify(user));
                    setActiveUser(user);
                  }
                  BiodataService.getMine().then(res => setActiveBiodata(res as any)).catch(console.error);
                  setActiveView('browse');
                }}
              />
            </div>
          </div>
        )}

        {/* --- PHASE 3 LOGGED IN VIEWS --- */}
        {activeUser && activeUser.registrationStep === 'completed' && ['browse', 'inbox', 'my-profile'].includes(activeView) && (
          <div style={{ width: '100%', background: 'var(--bg-app)', flex: 1 }}>
            

            {/* BROWSE VIEW */}
            {activeView === 'browse' && (
              <div className="animate-fade" style={{ width: '100%', padding: '2rem 1rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                  
                  {/* Left Sidebar: Filter Panel */}
                  <div className={`filter-sidebar ${isMobileFilterOpen ? 'bottom-sheet-open' : ''}`} style={{ flex: '1 1 300px', maxWidth: '350px' }}>
                    <FilterPanel 
                      onApplyFilters={handleApplyFilters} 
                      onClose={() => setIsMobileFilterOpen(false)} 
                      isMobile={isMobileFilterOpen} 
                    />
                  </div>

                  {/* Right Side: Profile Grid */}
                  <div style={{ flex: '2 1 600px' }}>
                    <div style={{ ...styles.browseHeader, marginBottom: '1.5rem' }}>
                      <div style={styles.browseHeadline}>
                        <h1 className="display" style={{fontSize: '2rem'}}>{t('browse_title')}</h1>
                        <p>{t('browse_subtitle')}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', width: '100%', justifyContent: 'space-between' }}>
                        <div className="browse-alert-badge" style={{ ...styles.quickFiltersContainer, whiteSpace: 'nowrap', flexShrink: 0 }}>
                          <span className="browse-alert-icon" style={styles.quickFiltersIcon}>✦</span>
                          <span>{matchingProfiles.length} {t('app_matches_found')}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexShrink: 0, justifyContent: 'flex-end' }}>
                          <select
                            className="hide-on-mobile"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            style={{
                              flex: '1 1 auto',
                              maxWidth: '300px',
                              padding: '0.5rem 2.5rem 0.5rem 1rem',
                              borderRadius: 'var(--radius-full)',
                              border: '1px solid var(--border-light)',
                              backgroundColor: 'var(--bg-card)',
                              backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'right 1rem center',
                              backgroundSize: '1rem',
                              color: 'var(--text-main)',
                              fontSize: '0.95rem',
                              fontWeight: '600',
                              outline: 'none',
                              cursor: 'pointer',
                              boxShadow: 'var(--shadow-sm)',
                              WebkitAppearance: 'none' as const,
                              MozAppearance: 'none' as const,
                              appearance: 'none' as const
                            }}
                          >
                            <option value="score">{t('app_sort_best_match')}</option>
                            <option value="age_asc">{t('app_sort_age_low_to_high')}</option>
                            <option value="age_desc">{t('app_sort_age_high_to_low')}</option>
                            <option value="income">{t('app_sort_income_high_to_low')}</option>
                          </select>

                          {/* Mobile Sort Icon Button with Hidden Native Select */}
                          <div className="show-on-mobile" style={{ position: 'relative', width: '40px', height: '40px' }}>
                            <button className="mobile-filter-toggle" style={{ margin: 0, width: '100%', height: '100%', padding: 0 }} title={t('app_sort_best_match')}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
                            </button>
                            <select
                              value={sortBy}
                              onChange={(e) => setSortBy(e.target.value as any)}
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                opacity: 0,
                                cursor: 'pointer',
                                zIndex: 2
                              }}
                            >
                              <option value="score">{t('app_sort_best_match')}</option>
                              <option value="age_asc">{t('app_sort_age_low_to_high')}</option>
                              <option value="age_desc">{t('app_sort_age_high_to_low')}</option>
                              <option value="income">{t('app_sort_income_high_to_low')}</option>
                            </select>
                          </div>
                          <button 
                            className="mobile-filter-toggle" 
                            onClick={() => setIsMobileFilterOpen(true)}
                            style={{ margin: 0, flexShrink: 0, whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                            title={t('app_filters')}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                            <span className="hide-on-mobile" style={{ marginLeft: '0.5rem' }}>{t('app_filters')}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {(() => {
                      const filteredProfiles = matchingProfiles.filter(profile => {
                        if (activeFilters.gotra && profile.gotra !== activeFilters.gotra) return false;
                        if (activeFilters.location && profile.location !== activeFilters.location) return false;
                        if (activeFilters.profession && profile.profession !== activeFilters.profession) return false;
                        if (activeFilters.maritalStatus && profile.maritalStatus !== activeFilters.maritalStatus) return false;
                        if (activeFilters.diet && profile.diet !== activeFilters.diet) return false;
                        if (activeFilters.religion && profile.religion !== activeFilters.religion) return false;
                        if (activeFilters.caste && profile.caste !== activeFilters.caste) return false;
                        if (activeFilters.minAge && profile.age < activeFilters.minAge) return false;
                        if (activeFilters.maxAge && profile.age > activeFilters.maxAge) return false;
                        return true;
                      });

                      const sortedProfiles = [...filteredProfiles].sort((a, b) => {
                        if (sortBy === 'score') return b.compatibilityScore - a.compatibilityScore;
                        if (sortBy === 'age_asc') return a.age - b.age;
                        if (sortBy === 'age_desc') return b.age - a.age;
                        if (sortBy === 'income') return b.annualIncome - a.annualIncome;
                        return 0;
                      });

                      return sortedProfiles.length === 0 ? (
                      <div style={styles.noMatchesBox}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🔍</div>
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-headers)', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>
                          {t('app_no_profiles_found')}
                        </h3>
                        <p style={{ maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>{t('no_matches')}</p>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {sortedProfiles.map((profile) => (
                          <div key={profile.biodataId} className="animate-scale" style={styles.profileCard}>
                            <div style={{ position: 'relative', height: '300px', width: '100%', cursor: 'pointer' }} onClick={() => setSelectedProfile(profile)}>
                              <ImageSlider images={[profile.photoUrl, ...(profile.additionalPhotos || [])]} height="100%" borderRadius="16px 16px 0 0" />
                              <div style={styles.compatibilityBadge}>
                                <svg style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                                {profile.compatibilityScore}% {t('card_match')}
                              </div>
                              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem', background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)', color: '#fff' }}>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-serif)', color: '#ffffff' }}>{profile.fullName}</h3>
                                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', opacity: 0.9, color: '#f0f0f0' }}>{profile.age} Yrs • {profile.location}</p>
                              </div>
                            </div>
                            
                            <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', gap: '0.8rem' }}>
                              {(() => {
                                const isShortlisted = interactions.some(i => i.toProfileId === profile.biodataId && i.type === 'shortlisted');
                                const isInterestSent = interactions.some(i => i.toProfileId === profile.biodataId && i.type === 'interest_sent');
                                return (
                                  <>
                                    <button 
                                      onClick={() => isShortlisted ? handleRemoveInteraction(profile.biodataId, 'shortlisted') : handleInteraction(profile.biodataId, 'shortlisted')}
                                      style={{ 
                                        ...styles.actionBtnIcon, 
                                        background: isShortlisted ? 'var(--gold-primary)' : 'var(--bg-app)', 
                                        color: isShortlisted ? '#fff' : 'var(--gold-primary)', 
                                        border: isShortlisted ? '1px solid var(--gold-primary)' : '1px solid var(--border-light)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                      }}
                                      title={isShortlisted ? (locale === 'en' ? 'Shortlisted' : locale === 'hi' ? 'शॉर्टलिस्ट किया गया' : 'शॉर्टलिस्ट किया गया') : (locale === 'en' ? 'Shortlist' : locale === 'hi' ? 'शॉर्टलिस्ट करें' : 'शॉर्टलिस्ट करू')}
                                    >
                                      {isShortlisted ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                      ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                      )}
                                    </button>
                                    <button 
                                      onClick={() => isInterestSent ? handleRemoveInteraction(profile.biodataId, 'interest_sent') : handleInteraction(profile.biodataId, 'interest_sent')}
                                      style={{ 
                                        ...styles.actionBtnIcon, flex: 2, 
                                        background: isInterestSent ? 'var(--neutral-100)' : 'var(--primary)', 
                                        color: isInterestSent ? 'var(--text-muted)' : '#fff', 
                                        border: isInterestSent ? '1px solid var(--border-light)' : 'none',
                                        cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                        transition: 'all 0.2s ease'
                                      }}
                                    >
                                      {isInterestSent ? (
                                        <>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                          {t('app_sent')}
                                        </>
                                      ) : (
                                        <>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                          {t('action_interest')}
                                        </>
                                      )}
                                    </button>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* INBOX VIEW */}
            {activeView === 'inbox' && (
              <div className="animate-fade" style={{ width: '100%', padding: '2rem 1rem' }}>
                <MatchInbox 
                  interactions={interactions} 
                  profiles={matchingProfiles} 
                  activeUserId={activeUser?.id || activeUser?.userId}
                  onAccept={(id) => handleInboxAction(id, 'match_accepted')}
                  onDecline={(id) => handleInboxAction(id, 'match_declined')}
                  onViewContact={() => {
                    setShowPaywall(true);
                  }}
                />
              </div>
            )}

            {/* MY PROFILE VIEW */}
            {activeView === 'my-profile' && activeBiodata && (
              <div className="animate-fade" style={{ width: '100%', padding: '2rem 1rem' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                  <div style={{ position: 'relative', width: '100%', height: '320px' }}>
                    <ImageSlider 
                      images={[activeBiodata.photoUrl, ...(activeBiodata.additionalPhotos || [])]} 
                      height="100%" 
                    />
                    <button 
                      onClick={() => {
                        const url = `${window.location.origin}/p/${activeUser?.id || activeUser?.userId}`;
                        navigator.clipboard.writeText(url).then(() => alert(locale === 'en' ? 'Profile link copied to clipboard!' : 'प्रोफ़ाइल लिंक कॉपी हो गया!'));
                      }}
                      style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: 'var(--shadow-md)' }}
                      title={locale === 'en' ? 'Share Profile' : 'प्रोफ़ाइल शेयर करें'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                    </button>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem 1.5rem 1.5rem', background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)', color: '#fff', pointerEvents: 'none' }}>
                      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', margin: '0 0 0.2rem 0', color: '#fff' }}>{activeBiodata.fullName}</h2>
                      <p style={{ margin: 0, fontSize: '1rem', color: '#f0f0f0', opacity: 0.9 }}>{activeBiodata.age} {t('app_yrs')} • {activeBiodata.location}</p>
                    </div>
                  </div>
                  
                  <div style={{ padding: '2rem' }}>
                    {/* Bio & Details Grid */}
                    <div style={{ marginBottom: '2rem' }}>
                      <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                        {t('app_about_me')}
                      </h3>
                      <p style={{ color: 'var(--text-main)', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                        {activeBiodata.aboutMe || (locale === 'en' ? 'No bio provided yet.' : locale === 'hi' ? 'अभी तक कोई बायो नहीं दिया गया है।' : 'अभी तक कोई बायो नहीं दिया गया अछि।')}
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                        <div>
                          <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{t('app_gotra')}</p>
                          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-headers)', fontWeight: 500 }}>{activeBiodata.gotra}</p>
                        </div>
                        <div>
                          <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{t('app_education')}</p>
                          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-headers)', fontWeight: 500 }}>{activeBiodata.education || 'N/A'}</p>
                        </div>
                        <div>
                          <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{t('app_profession')}</p>
                          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-headers)', fontWeight: 500 }}>{activeBiodata.profession}</p>
                        </div>
                        <div>
                          <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{t('app_income')}</p>
                          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-headers)', fontWeight: 500 }}>
                            {activeBiodata.annualIncome ? `₹${(activeBiodata.annualIncome / 100000).toFixed(1)}L / ${t('app_yr')}` : 'N/A'}
                          </p>
                        </div>
                      </div>

                      {activeBiodata.interests && activeBiodata.interests.length > 0 && (
                        <div style={{ marginTop: '1.5rem' }}>
                          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{t('app_interests')}</p>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {activeBiodata.interests.map(interest => (
                              <span key={interest} style={{ padding: '0.3rem 0.8rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 500 }}>
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Photo Gallery */}
                    {(activeBiodata.photoUrl || (activeBiodata.additionalPhotos && activeBiodata.additionalPhotos.length > 0)) && (
                      <div style={{ marginBottom: '2.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                          {locale === 'en' ? 'Photo Gallery' : 'फ़ोटो गैलरी'}
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.8rem' }}>
                          {[activeBiodata.photoUrl, ...(activeBiodata.additionalPhotos || [])].filter(Boolean).map((p, idx) => (
                            <div key={idx} style={{ aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                              <img src={p} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      <button 
                        onClick={() => setProfileModalView('edit')} 
                        style={{ width: '100%', padding: '0.9rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        {t('app_edit_profile')}
                      </button>

                      <button 
                        onClick={() => {
                          const url = `${window.location.origin}/p/${activeUser?.id || activeUser?.userId}`;
                          navigator.clipboard.writeText(url).then(() => alert(locale === 'en' ? 'Profile link copied to clipboard!' : 'प्रोफ़ाइल लिंक कॉपी हो गया!'));
                        }} 
                        style={{ width: '100%', padding: '0.9rem', background: 'var(--primary-light)', color: 'var(--primary-dark)', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                        {locale === 'en' ? 'Share Profile' : 'प्रोफ़ाइल शेयर करें'}
                      </button>
                      
                      <div style={{ display: 'flex', gap: '0.8rem' }}>
                        <button 
                          onClick={() => setProfileModalView('preferences')} 
                          style={{ flex: 1, padding: '0.9rem', background: 'var(--bg-app)', color: 'var(--text-main)', border: '1px solid var(--border-light)', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          {t('app_preferences')}
                        </button>
                        <button 
                          onClick={() => setProfileModalView('privacy')} 
                          style={{ flex: 1, padding: '0.9rem', background: 'var(--bg-app)', color: 'var(--text-main)', border: '1px solid var(--border-light)', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          {t('app_privacy')}
                        </button>
                      </div>

                      <button 
                        onClick={handleLogout} 
                        style={{ width: '100%', padding: '0.9rem', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem', transition: 'background 0.2s' }}
                      >
                        {t('btn_logout')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PROFILE MODALS */}
            {profileModalView && (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
                <div className="animate-scale" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', background: 'var(--bg-card)', borderRadius: '16px', padding: '2rem', position: 'relative' }}>
                  <button onClick={() => setProfileModalView(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                  
                  {profileModalView === 'edit' && (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      BiodataService.updateMine(editForm as any).then(() => {
                        BiodataService.getMine().then(res => setActiveBiodata(res as any)).catch(console.error);
                      }).catch(console.error);
                      setProfileModalView(null);
                    }}>
                      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-headers)' }}>{t('app_edit_profile')}</h2>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: 600 }}>{t('app_full_name')}</label>
                          <input type="text" value={editForm.fullName || ''} onChange={(e) => setEditForm({...editForm, fullName: e.target.value})} style={styles.input} required />
                        </div>

                        <div>
                          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: 600 }}>{locale === 'en' ? 'Gotra' : 'गोत्र'}</label>
                          <select value={editForm.gotra || ''} onChange={(e) => setEditForm({...editForm, gotra: e.target.value})} style={styles.input} required>
                            <option value="">-- Select Gotra --</option>
                            {masterGotras.map(g => <option key={g} value={g}>{g}</option>)}
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: 600 }}>{locale === 'en' ? 'Religion' : 'धर्म'}</label>
                          <select value={editForm.religion || ''} onChange={(e) => setEditForm({...editForm, religion: e.target.value})} style={styles.input}>
                            <option value="">-- Select Religion --</option>
                            {masterReligions.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: 600 }}>{locale === 'en' ? 'Caste' : 'जाति'}</label>
                          <select value={editForm.caste || ''} onChange={(e) => setEditForm({...editForm, caste: e.target.value})} style={styles.input}>
                            <option value="">-- Select Caste --</option>
                            {masterCastes.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: 600 }}>{t('app_profession')}</label>
                          <select value={editForm.profession || ''} onChange={(e) => setEditForm({...editForm, profession: e.target.value})} style={styles.input} required>
                            <option value="">-- Select Profession --</option>
                            {masterProfessions.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: 600 }}>{t('app_location')}</label>
                          <input type="text" value={editForm.location || ''} onChange={(e) => setEditForm({...editForm, location: e.target.value})} style={styles.input} required />
                        </div>

                        <div>
                          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: 600 }}>{t('app_annual_income')}</label>
                          <input type="number" value={editForm.annualIncome || ''} onChange={(e) => setEditForm({...editForm, annualIncome: parseInt(e.target.value)})} style={styles.input} />
                        </div>

                        {/* Current Address Group */}
                        <div style={{ padding: '0.8rem', border: '1px solid var(--border-light)', borderRadius: '10px', background: 'var(--bg-app)' }}>
                          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-headers)' }}>📍 {locale === 'en' ? 'Current Address' : 'वर्तमान पता'}</h4>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <input type="text" placeholder="City" value={getAddressValue('current', 'city')} onChange={(e) => updateAddressValue('current', 'city', e.target.value)} style={styles.input} required />
                            <input type="text" placeholder="State" value={getAddressValue('current', 'state')} onChange={(e) => updateAddressValue('current', 'state', e.target.value)} style={styles.input} required />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <input type="text" placeholder="Country" value={getAddressValue('current', 'country')} onChange={(e) => updateAddressValue('current', 'country', e.target.value)} style={styles.input} required />
                            <input type="text" placeholder="Pincode" value={getAddressValue('current', 'pincode')} onChange={(e) => updateAddressValue('current', 'pincode', e.target.value)} style={styles.input} />
                          </div>
                          <input type="text" placeholder="Street Address" value={getAddressValue('current', 'streetAddress')} onChange={(e) => updateAddressValue('current', 'streetAddress', e.target.value)} style={{ ...styles.input, marginTop: '0.2rem' }} />
                        </div>

                        {/* Native Address Group */}
                        <div style={{ padding: '0.8rem', border: '1px solid var(--border-light)', borderRadius: '10px', background: 'var(--bg-app)' }}>
                          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-headers)' }}>🏡 {locale === 'en' ? 'Native Address' : 'पैतृक निवास पता'}</h4>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <input type="text" placeholder="City" value={getAddressValue('native', 'city')} onChange={(e) => updateAddressValue('native', 'city', e.target.value)} style={styles.input} />
                            <input type="text" placeholder="State" value={getAddressValue('native', 'state')} onChange={(e) => updateAddressValue('native', 'state', e.target.value)} style={styles.input} />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <input type="text" placeholder="Country" value={getAddressValue('native', 'country')} onChange={(e) => updateAddressValue('native', 'country', e.target.value)} style={styles.input} />
                            <input type="text" placeholder="Pincode" value={getAddressValue('native', 'pincode')} onChange={(e) => updateAddressValue('native', 'pincode', e.target.value)} style={styles.input} />
                          </div>
                          <input type="text" placeholder="Street Address" value={getAddressValue('native', 'streetAddress')} onChange={(e) => updateAddressValue('native', 'streetAddress', e.target.value)} style={{ ...styles.input, marginTop: '0.2rem' }} />
                        </div>

                        {/* Manage Photos Section */}
                        <div style={{ padding: '0.8rem', border: '1px solid var(--border-light)', borderRadius: '10px', background: 'var(--bg-app)' }}>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-headers)' }}>
                            📸 {locale === 'en' ? 'Manage Photos (Up to 10)' : 'फ़ोटो प्रबंधित करें (अधिकतम 10)'}
                          </label>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                            {editForm.photoUrl && (
                              <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '6px', overflow: 'hidden', border: '2px solid var(--primary)' }}>
                                <img src={editForm.photoUrl} alt="Primary" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'var(--primary)', color: '#fff', fontSize: '0.5rem', textAlign: 'center', fontWeight: 'bold', padding: '1px 0' }}>
                                  Primary
                                </div>
                              </div>
                            )}
                            {editForm.additionalPhotos?.map((p, idx) => (
                              <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                                <img src={p} alt={`Photo ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button
                                  type="button"
                                  onClick={() => setEditForm(prev => ({
                                    ...prev,
                                    additionalPhotos: prev.additionalPhotos?.filter((_, i) => i !== idx)
                                  }))}
                                  style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', cursor: 'pointer', padding: 0 }}
                                >
                                  ✕
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditForm(prev => {
                                    const oldPrimary = prev.photoUrl;
                                    const newAdditional = prev.additionalPhotos ? [...prev.additionalPhotos] : [];
                                    if (oldPrimary) {
                                      newAdditional[idx] = oldPrimary;
                                    } else {
                                      newAdditional.splice(idx, 1);
                                    }
                                    return {
                                      ...prev,
                                      photoUrl: p,
                                      additionalPhotos: newAdditional
                                    };
                                  })}
                                  style={{ position: 'absolute', bottom: 2, left: 2, right: 2, background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 4px', fontSize: '0.55rem', cursor: 'pointer', textAlign: 'center' }}
                                >
                                  Make Primary
                                </button>
                              </div>
                            ))}
                          </div>
                          {((editForm.additionalPhotos?.length || 0) + (editForm.photoUrl ? 1 : 0)) < 10 && (
                            <div>
                              <input type="file" accept="image/*" id="edit-photo-upload" onChange={handleEditPhotoUpload} style={{ display: 'none' }} />
                              <label htmlFor="edit-photo-upload" style={{ display: 'inline-block', padding: '0.4rem 0.8rem', background: 'var(--bg-card)', border: '1px dashed var(--primary)', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--primary)', fontWeight: 600 }}>
                                ➕ {locale === 'en' ? 'Add Photo' : 'फ़ोटो जोड़ें'}
                              </label>
                            </div>
                          )}
                        </div>

                        <div>
                          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: 600 }}>{t('app_about_me')}</label>
                          <textarea rows={4} value={editForm.aboutMe || ''} onChange={(e) => setEditForm({...editForm, aboutMe: e.target.value})} style={{...styles.input, resize: 'vertical'}}></textarea>
                        </div>
                        <button type="submit" style={{ ...styles.primaryBtnWidth, marginTop: '1rem' }}>{t('app_save_changes')}</button>
                      </div>
                    </form>
                  )}

                  {profileModalView === 'preferences' && (
                    <div>
                      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-headers)' }}>{t('app_match_preferences')}</h2>
                      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Update your desired match criteria here.</p>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Age Range</label>
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <input type="number" defaultValue="21" style={styles.input} />
                            <span>to</span>
                            <input type="number" defaultValue="35" style={styles.input} />
                          </div>
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Preferred Location</label>
                          <input type="text" defaultValue="Any" style={styles.input} />
                        </div>
                        <button onClick={() => setProfileModalView(null)} style={{ ...styles.primaryBtnWidth, marginTop: '1rem' }}>{t('app_save_preferences')}</button>
                      </div>
                    </div>
                  )}

                  {profileModalView === 'privacy' && (
                    <div>
                      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-headers)' }}>{t('app_privacy_settings')}</h2>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        {/* Toggle Profile Search (Hidden / Visible) */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <h4 style={{ margin: '0 0 0.3rem 0', color: 'var(--text-headers)' }}>
                              {locale === 'en' ? 'Hide Profile from Search' : 'खोज से प्रोफ़ाइल छुपाएं'}
                            </h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                              {locale === 'en' ? 'Temporarily hide your profile in browse matching feeds.' : 'खोज मिलान फ़ीड में अपनी प्रोफ़ाइल को अस्थायी रूप से छुपाएं।'}
                            </p>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={activeUser?.hidden || false} 
                            onChange={async () => {
                              try {
                                await UserService.toggleHidden();
                                const updatedUser = { ...activeUser, hidden: !activeUser.hidden } as any;
                                setActiveUser(updatedUser);
                                localStorage.setItem('active_profile', JSON.stringify(updatedUser));
                              } catch (e) {
                                console.error(e);
                              }
                            }}
                            style={{ width: '22px', height: '22px', accentColor: 'var(--primary)', cursor: 'pointer' }} 
                          />
                        </div>

                        {/* Deactivate Account */}
                        <div style={{ padding: '1rem', border: '1px solid var(--border-light)', borderRadius: '8px', background: 'var(--bg-app)' }}>
                          <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-headers)' }}>
                            ⚠️ {locale === 'en' ? 'Deactivate Account' : 'खाता निष्क्रिय करें'}
                          </h4>
                          <p style={{ margin: '0 0 0.8rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {locale === 'en' ? 'Instantly hide your profile. Reactivate by logging back in.' : 'अपनी प्रोफ़ाइल तुरंत छुपाएं। वापस लॉग इन करके फिर से सक्रिय करें।'}
                          </p>
                          <button 
                            type="button" 
                            onClick={async () => {
                              if (window.confirm(locale === 'en' ? 'Are you sure you want to deactivate your profile?' : 'क्या आप वाकई अपनी प्रोफ़ाइल को निष्क्रिय करना चाहते हैं?')) {
                                try {
                                  await UserService.deactivate();
                                  handleLogout();
                                } catch (e) {
                                  alert('Deactivation failed.');
                                }
                              }
                            }}
                            style={{ padding: '0.5rem 1rem', background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}
                          >
                            {locale === 'en' ? 'Deactivate' : 'निष्क्रिय करें'}
                          </button>
                        </div>

                        {/* Request Deletion */}
                        <div style={{ padding: '1rem', border: '1px solid var(--border-light)', borderRadius: '8px', background: 'var(--bg-app)' }}>
                          <h4 style={{ margin: '0 0 0.4rem 0', color: 'var(--text-headers)' }}>
                            🛑 {locale === 'en' ? 'Schedule Account Deletion' : 'खाता हटाने का अनुरोध करें'}
                          </h4>
                          <p style={{ margin: '0 0 0.8rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {locale === 'en' ? 'Schedule account deletion with a 30-day recovery cool-off.' : '30-दिवसीय रिकवरी कूल-ऑफ के साथ खाता हटाने का समय निर्धारित करें।'}
                          </p>
                          <button 
                            type="button" 
                            onClick={async () => {
                              if (window.confirm(locale === 'en' ? 'Request permanent deletion? You have 30 days to cancel.' : 'स्थायी रूप से हटाने का अनुरोध करें? आपके पास रद्द करने के लिए 30 दिन हैं।')) {
                                try {
                                  await UserService.deleteRequest();
                                  handleLogout();
                                } catch (e) {
                                  alert('Request failed.');
                                }
                              }
                            }}
                            style={{ padding: '0.5rem 1rem', background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}
                          >
                            {locale === 'en' ? 'Delete Account' : 'खाता हटाएं'}
                          </button>
                        </div>

                        {/* Block List Manager */}
                        <div style={{ padding: '1rem', border: '1px solid var(--border-light)', borderRadius: '8px', background: 'var(--bg-app)' }}>
                          <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-headers)' }}>
                            🚫 {locale === 'en' ? 'Blocked Users' : 'अवरुद्ध उपयोगकर्ता'} ({blockedUsers.length})
                          </h4>
                          {blockedUsers.length === 0 ? (
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                              {locale === 'en' ? 'You have not blocked any users.' : 'आपने किसी भी उपयोगकर्ता को अवरुद्ध नहीं किया है।'}
                            </p>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '150px', overflowY: 'auto', marginTop: '0.5rem' }}>
                              {blockedUsers.map(u => (
                                <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem', borderBottom: '1px solid var(--border-light)' }}>
                                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-headers)' }}>{u.fullName}</span>
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      try {
                                        await UserService.unblock(u.id);
                                        setBlockedUsers(prev => prev.filter(item => item.id !== u.id));
                                      } catch (e) {
                                        alert('Failed to unblock.');
                                      }
                                    }}
                                    style={{ padding: '2px 8px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-main)' }}
                                  >
                                    Unblock
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <button onClick={() => setProfileModalView(null)} style={{ ...styles.primaryBtnWidth, marginTop: '0.5rem' }}>
                          {locale === 'en' ? 'Close Settings' : 'सेटिंग्स बंद करें'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODALS */}
        {selectedProfile && (
          <ProfileDetail 
            profile={selectedProfile} 
            onClose={() => setSelectedProfile(null)} 
            onAction={(type) => handleInteraction(selectedProfile.biodataId, type)} 
            subscriptionStatus={subscriptionStatus}
            onShowPaywall={() => setShowPaywall(true)}
            onUnlockSuccess={async () => {
              try {
                // Refresh data to show revealed details
                if (activeUser) {
                  const [bio, matchesRes] = await Promise.all([
                    BiodataService.getMine(),
                    MatchesService.findMatches(0, 20, sortBy)
                  ]);
                  setActiveBiodata(bio as any);
                  setMatchingProfiles(matchesRes.content as any);
                  // Refresh subscription status too
                  const sub = await SubscriptionService.getStatus();
                  setSubscriptionStatus(sub);
                  // Close detail modal and notify user
                  setSelectedProfile(null);
                  alert(locale === 'en' ? 'Contact details successfully unlocked!' : 'संपर्क विवरण सफलतापूर्वक अनलॉक हो गया!');
                }
              } catch (e) {
                console.error('Failed to refresh data after unlock', e);
              }
            }}
          />
        )}
        
        {showPaywall && (
          <PremiumPaywall 
            onClose={() => setShowPaywall(false)}
            onUpgrade={() => {
              alert('Premium Gateway Mock: This would redirect to a payment processor.');
              setShowPaywall(false);
            }}
          />
        )}
        {/* VIEW 7: PUBLIC PROFILE */}
        {activeView === 'public-profile' && publicProfileId && (
          <div className="animate-fade" style={{ flex: 1, padding: '2rem 1rem', display: 'flex', justifyContent: 'center', width: '100%' }}>
            <PublicProfileView 
              userId={publicProfileId} 
              onLoginClick={() => {
                setAuthMode('login');
                setActiveView('auth');
              }} 
            />
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
                <svg className="footer-logo-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, marginRight: '0.2rem' }}>
                  <path transform="translate(-0.4, 3.5) scale(0.7)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#ffffff" fillOpacity="0.85"/>
                  <path transform="translate(7.6, 3.5) scale(0.7)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="var(--gold-primary, #D4AF37)" fillOpacity="0.85"/>
                </svg>
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
              <h4 className="footer-col-title">{t('app_navigate')}</h4>
              <ul className="footer-links">
                <li className="footer-link-item" onClick={() => setActiveView(activeUser ? (activeUser.registrationStep === 'completed' ? 'browse' : 'register') : 'home')}>
                  {t('app_home')}
                </li>
                {!activeUser ? (
                  <li className="footer-link-item" onClick={() => { setAuthMode('login'); setActiveView('auth'); }}>
                    {t('btn_auth')}
                  </li>
                ) : (
                  <li className="footer-link-item" onClick={() => setActiveView(activeUser.registrationStep === 'completed' ? 'browse' : 'register')}>
                    {activeUser.registrationStep === 'completed' ? (locale === 'en' ? 'Browse Matches' : locale === 'hi' ? 'मैच खोजें' : 'मैच खोजू') : (locale === 'en' ? 'Complete Profile' : locale === 'hi' ? 'बायोडाटा पूरा करें' : 'बायोडाटा पूरा करू')}
                  </li>
                )}
              </ul>
            </div>

            {/* Column 3: Gotras & Customs */}
            <div className="footer-col">
              <h4 className="footer-col-title">{t('app_lineages')}</h4>
              <ul className="footer-links" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                <li className="footer-link-item" style={{ cursor: 'default' }}>{t('app_kashyap')}</li>
                <li className="footer-link-item" style={{ cursor: 'default' }}>{t('app_shandilya')}</li>
                <li className="footer-link-item" style={{ cursor: 'default' }}>{t('app_vatsa')}</li>
                <li className="footer-link-item" style={{ cursor: 'default' }}>{t('app_katyayan')}</li>
                <li className="footer-link-item" style={{ cursor: 'default' }}>{t('app_parashar')}</li>
                <li className="footer-link-item" style={{ cursor: 'default' }}>{t('app_bhardwaj')}</li>
              </ul>
            </div>

            {/* Column 4: Highly Optimized System Controls */}
            <div className="footer-col">
              <h4 className="footer-col-title">{t('app_settings')}</h4>
              <div className="footer-controls-group">
                {/* Language Switcher Dropdown */}
                <select 
                  className="footer-toggle-btn"
                  value={locale}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  style={{ appearance: 'none', textAlign: 'center', cursor: 'pointer' }}
                >
                  <option value="ma">🌐 मैथिली (Maithili)</option>
                  <option value="hi">🌐 हिंदी (Hindi)</option>
                  <option value="en">🌐 English (अंग्रेजी)</option>
                </select>
                
                {/* Theme Selector Switcher */}
                <button 
                  className="footer-toggle-btn"
                  onClick={toggleTheme}
                  title={t('app_switch_color_theme')}
                >
                  {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </button>
              </div>
            </div>
          </div>

          <hr className="footer-divider" />

          <div className="footer-bottom-row">
            <p className="footer-copyright">
              © 2026 {t('brand_serif')}{t('brand_sans')}. {t('app_all_rights_reserved_proudly_protecting_maithil_heritage_and_lineage_custom_safeties')}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'hsl(var(--magenta-300))' }}>
              {t('app_developed_with_pure_vanilla_css_react_19')}
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
    backgroundColor: 'var(--bg-header)',
    backdropFilter: 'var(--blur-glass)',
    WebkitBackdropFilter: 'var(--blur-glass)',
    borderBottom: '1px solid var(--border-light)',
    padding: '0.75rem 2rem',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
    boxShadow: '0 10px 30px rgba(136, 14, 79, 0.06)',
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
    gap: '0.3rem',
    minHeight: '2.5rem',
    whiteSpace: 'nowrap' as const
  },
  logoSerif: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.7rem',
    fontWeight: '700',
    color: 'var(--primary)',
  },
  logoSans: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.7rem',
    fontWeight: '700',
    color: 'var(--primary)',
    marginLeft: '0',
  },
  navMenu: {
    display: 'flex',
    alignItems: 'center'
  },
  authLinkBtn: {
    padding: '0.6rem 1.4rem',
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    fontWeight: '600',
    borderRadius: 'var(--radius-full)',
    transition: 'var(--transition-fast)'
  },
  accountMenuWrapper: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center'
  },
  profileMenuButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.3rem 0.45rem 0.3rem 0.3rem',
    backgroundColor: 'var(--primary-light)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-full)',
    boxShadow: 'var(--shadow-sm)',
    color: 'var(--primary-dark)'
  },
  profileAvatar: {
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    fontSize: '0.9rem',
    fontWeight: '800',
    lineHeight: 1
  },
  dropdownChevron: {
    width: 0,
    height: 0,
    borderLeft: '4px solid transparent',
    borderRight: '4px solid transparent',
    borderTop: '5px solid currentColor'
  },
  accountDropdown: {
    position: 'absolute' as const,
    top: 'calc(100% + 0.6rem)',
    right: 0,
    minWidth: '10rem',
    padding: '0.45rem',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-sm)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 200
  },
  accountMenuItem: {
    width: '100%',
    padding: '0.65rem 0.8rem',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    color: 'var(--text-main)',
    fontSize: '0.9rem',
    fontWeight: '700',
    textAlign: 'left' as const
  },
  logoutMenuItem: {
    color: 'var(--primary)'
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
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    fontSize: '0.85rem',
    color: 'var(--primary-dark)',
    fontWeight: '700',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid hsl(var(--magenta-200))',
    boxShadow: '0 8px 22px rgba(136, 14, 79, 0.06)',
    padding: '0.55rem 1rem',
    borderRadius: 'var(--radius-full)'
  },
  quickFiltersIcon: {
    color: 'var(--gold-hover)',
    fontSize: '0.95rem',
    lineHeight: 1
  },
  noMatchesBox: {
    minHeight: '300px',
    backgroundColor: 'var(--bg-card)',
    border: '1px dashed var(--border-light)',
    borderRadius: 'var(--radius-lg)',
    color: 'var(--text-muted)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    padding: '2rem'
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
    top: '12px',
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
  authBtnText: {
    fontWeight: '700',
    fontSize: '0.9rem'
  },
  tabNavContainer: {
    width: '100%',
    background: 'var(--bg-header)',
    borderBottom: '1px solid var(--border-light)',
    position: 'sticky' as const,
    top: '72px',
    zIndex: 90,
    backdropFilter: 'var(--blur-glass)'
  },
  tabNavContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem'
  },
  tabNavItem: {
    background: 'none',
    border: 'none',
    padding: '1rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    borderBottom: '3px solid transparent',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    justifyContent: 'center'
  },
  tabNavActive: {
    color: 'var(--primary)',
    borderBottomColor: 'var(--primary)'
  },
  actionBtnIcon: {
    padding: '0.75rem',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '0.95rem',
    gap: '0.4rem',
    transition: 'transform 0.2s'
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
