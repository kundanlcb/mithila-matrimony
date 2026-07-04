import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import type { Biodata } from '../types';
import { SubscriptionService } from '../api/subscription.service';
import { ImageSlider } from './ImageSlider';

interface ProfileDetailProps {
  profile: Biodata;
  onClose: () => void;
  onAction: (type: 'interest_sent' | 'shortlisted' | 'passed') => void;
  subscriptionStatus: any;
  onShowPaywall: () => void;
  onUnlockSuccess: () => void;
}

const ProfileDetail: React.FC<ProfileDetailProps> = ({ 
  profile, 
  onClose, 
  onAction,
  subscriptionStatus,
  onShowPaywall,
  onUnlockSuccess
}) => {
  const { t, locale } = useLanguage();

  // Photo Carousel State
  const photos = [profile.photoUrl, ...(profile.additionalPhotos || [])].filter(Boolean);

  const unlocked = !!(profile.email);

  const handleReveal = async () => {
    if (!subscriptionStatus || subscriptionStatus.planType === 'free') {
      onShowPaywall();
      return;
    }

    if (subscriptionStatus.planType === 'pay_per_contact') {
      const confirmSpend = window.confirm(
        locale === 'en' 
          ? `1 credit will be used. You have ${subscriptionStatus.creditsRemaining} credits remaining. Reveal contact details?` 
          : `1 क्रेडिट का उपयोग किया जाएगा। आपके पास ${subscriptionStatus.creditsRemaining} क्रेडिट बचे हैं। संपर्क विवरण प्रकट करें?`
      );
      if (!confirmSpend) return;
    }

    try {
      const res = await SubscriptionService.reveal(profile.userId);
      if (res.unlocked) {
        onUnlockSuccess();
      }
    } catch (e: any) {
      alert(e.message || 'Failed to reveal contact details. Make sure you have mutual interest first.');
    }
  };

  return (
    <div className="modal-overlay animate-fade" style={styles.overlay}>
      <div className="modal-content animate-scale" style={styles.modal}>
        <button onClick={onClose} style={styles.closeBtn} aria-label="Close">✕</button>
        
        <div style={styles.scrollArea}>
          {/* Header Image Carousel Region */}
          <div style={styles.heroSection}>
            <ImageSlider images={photos} height="100%" />
            <div style={{ ...styles.heroGradient, pointerEvents: 'none' }} />
            <div style={{ ...styles.heroInfo, pointerEvents: 'none' }}>
              <h2 style={styles.name}>{profile.fullName}</h2>
              <p style={styles.basicMeta}>
                {profile.age} {locale === 'en' ? 'Yrs' : 'वर्ष'} • {profile.location}
              </p>
            </div>
          </div>

          <div style={styles.contentSection}>
            {/* Action Bar */}
            <div style={styles.actionBar}>
              <button 
                onClick={() => onAction('passed')} 
                style={{ ...styles.actionBtn, ...styles.btnPass }}
              >
                ✕ {t('action_pass')}
              </button>
              <button 
                onClick={() => onAction('shortlisted')} 
                style={{ ...styles.actionBtn, ...styles.btnShortlist }}
              >
                ⭐ {t('action_shortlist')}
              </button>
              <button 
                onClick={() => onAction('interest_sent')} 
                style={{ ...styles.actionBtn, ...styles.btnInterest }}
              >
                💖 {t('action_interest')}
              </button>
            </div>

            {/* Badges */}
            <div style={styles.badgeRow}>
              <span style={styles.badge}>🧬 {t('summary_gotra')}: {profile.gotra}</span>
              <span style={styles.badge}>💼 {profile.profession}</span>
              <span style={styles.badge}>💰 ₹{(profile.annualIncome / 100000).toFixed(1)} {t('summary_lakh')}</span>
            </div>

            {/* Contact Gated Block */}
            <div style={styles.detailCard}>
              <h3 style={styles.sectionTitle}>📞 {locale === 'en' ? 'Contact Details' : 'संपर्क विवरण'}</h3>
              {unlocked ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <p style={styles.text}><strong>📧 {locale === 'en' ? 'Email' : 'ईमेल'}:</strong> {profile.email || 'N/A'}</p>
                </div>
              ) : (
                <div>
                  <p style={{ ...styles.text, color: 'var(--text-muted)', marginBottom: '0.8rem', fontStyle: 'italic' }}>
                    🔒 {locale === 'en' ? 'Unlock with Premium to view email and exact addresses.' : 'ईमेल और सटीक पता देखने के लिए प्रीमियम के साथ अनलॉक करें।'}
                  </p>
                  <button 
                    type="button" 
                    onClick={handleReveal} 
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: 'var(--primary)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'background 0.2s'
                    }}
                  >
                    🔓 {locale === 'en' ? 'Reveal Contact Details' : 'संपर्क विवरण प्रकट करें'}
                  </button>
                </div>
              )}
            </div>

            {/* Current Address display */}
            {profile.addresses && profile.addresses.filter(a => a.addressType === 'current').map(addr => (
              <div key={addr.id} style={styles.detailCard}>
                <h3 style={styles.sectionTitle}>📍 {locale === 'en' ? 'Current Address' : 'वर्तमान पता'}</h3>
                <p style={styles.text}>
                  <strong>{locale === 'en' ? 'City' : 'शहर'}:</strong> {addr.city}, {addr.state}, {addr.country}
                </p>
                <p style={styles.text}>
                  <strong>{locale === 'en' ? 'Pincode' : 'पिनकोड'}:</strong> {unlocked ? (addr.pincode || 'N/A') : '🔒 Locked'}
                </p>
                <p style={styles.text}>
                  <strong>{locale === 'en' ? 'Street' : 'सड़क/सटीक पता'}:</strong> {unlocked ? (addr.streetAddress || 'N/A') : '🔒 Locked'}
                </p>
              </div>
            ))}

            {/* Native Address display */}
            {profile.addresses && profile.addresses.filter(a => a.addressType === 'native').map(addr => (
              <div key={addr.id} style={styles.detailCard}>
                <h3 style={styles.sectionTitle}>🏡 {locale === 'en' ? 'Native / Hometown Address' : 'पैतृक निवास पता'}</h3>
                <p style={styles.text}>
                  <strong>{locale === 'en' ? 'City' : 'शहर'}:</strong> {addr.city}, {addr.state}, {addr.country}
                </p>
                <p style={styles.text}>
                  <strong>{locale === 'en' ? 'Pincode' : 'पिनकोड'}:</strong> {unlocked ? (addr.pincode || 'N/A') : '🔒 Locked'}
                </p>
                <p style={styles.text}>
                  <strong>{locale === 'en' ? 'Street' : 'सड़क/सटीक पता'}:</strong> {unlocked ? (addr.streetAddress || 'N/A') : '🔒 Locked'}
                </p>
              </div>
            ))}

            {/* Sections */}
            <div style={styles.detailCard}>
              <h3 style={styles.sectionTitle}>👤 {locale === 'en' ? 'About Me' : 'मेरे बारे में'}</h3>
              <p style={styles.text}>{profile.aboutMe}</p>
            </div>

            <div style={styles.detailCard}>
              <h3 style={styles.sectionTitle}>🎓 {locale === 'en' ? 'Education & Career' : 'शिक्षा और करियर'}</h3>
              <p style={styles.text}>{profile.education}</p>
              <p style={styles.text}><strong style={{color: 'var(--text-main)'}}>{profile.profession}</strong></p>
            </div>

            <div style={styles.detailCard}>
              <h3 style={styles.sectionTitle}>🎨 {locale === 'en' ? 'Interests & Hobbies' : 'रुचियाँ और शौक'}</h3>
              <div style={styles.pillRow}>
                {profile.interests?.map((interest, i) => (
                  <span key={i} style={styles.pill}>{interest}</span>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem'
  },
  modal: {
    backgroundColor: 'var(--bg-app)',
    borderRadius: '24px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    position: 'relative' as const,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
    boxShadow: 'var(--shadow-lg)'
  },
  closeBtn: {
    position: 'absolute' as const,
    top: '1rem',
    right: '1rem',
    background: 'rgba(0,0,0,0.5)',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    color: '#fff',
    cursor: 'pointer',
    zIndex: 10
  },
  scrollArea: {
    overflowY: 'auto' as const,
    flex: 1
  },
  heroSection: {
    position: 'relative' as const,
    height: '300px',
    width: '100%'
  },
  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const
  },
  heroGradient: {
    position: 'absolute' as const,
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 40%, transparent 80%)',
    pointerEvents: 'none' as const
  },
  heroInfo: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    padding: '1.5rem',
    color: '#fff'
  },
  name: {
    fontSize: '2rem',
    fontWeight: '800',
    margin: 0,
    fontFamily: 'var(--font-serif)',
    lineHeight: 1.1,
    color: '#ffffff',
    textShadow: '0 2px 8px rgba(0,0,0,0.8)'
  },
  basicMeta: {
    margin: '0.25rem 0 0 0',
    fontSize: '1rem',
    opacity: 0.95,
    color: '#ffffff',
    textShadow: '0 1px 4px rgba(0,0,0,0.8)'
  },

  contentSection: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem'
  },
  actionBar: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center',
    marginTop: '-2.5rem',
    zIndex: 5,
    position: 'relative' as const,
    padding: '0 0.5rem'
  },
  actionBtn: {
    flex: 1,
    padding: '0.75rem 0.4rem',
    borderRadius: '14px',
    border: 'none',
    fontWeight: '700',
    fontSize: '0.85rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    boxShadow: 'var(--shadow-md)',
    whiteSpace: 'nowrap' as const
  },
  btnPass: {
    background: 'var(--bg-card)',
    color: 'var(--text-muted)',
    border: '1px solid var(--border-light)'
  },
  btnShortlist: {
    background: 'var(--bg-card)',
    color: 'var(--gold-primary)',
    border: '1px solid var(--gold-primary)'
  },
  btnInterest: {
    background: 'var(--primary)',
    color: '#fff'
  },
  badgeRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.5rem'
  },
  badge: {
    background: 'var(--bg-card)',
    padding: '0.4rem 0.8rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-main)',
    border: '1px solid var(--border-light)'
  },
  detailCard: {
    background: 'var(--bg-card)',
    padding: '1.25rem',
    borderRadius: '16px',
    border: '1px solid var(--border-light)'
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--text-headers)',
    margin: '0 0 0.75rem 0'
  },
  text: {
    margin: 0,
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
    lineHeight: 1.6
  },
  pillRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.5rem'
  },
  pill: {
    background: 'var(--primary-light)',
    color: 'var(--primary-dark)',
    padding: '0.3rem 0.75rem',
    borderRadius: '100px',
    fontSize: '0.8rem',
    fontWeight: '600'
  }
};

export default ProfileDetail;
