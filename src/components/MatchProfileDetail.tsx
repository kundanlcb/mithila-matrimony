import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BiodataService } from '../api/biodata.service';
import type { BiodataResponse } from '../types/api.types';
import { ImageSlider } from './ImageSlider';

interface MatchProfileDetailProps {
  userId: string;
  onBack: () => void;
  onAction: (type: 'interest_sent' | 'shortlisted' | 'passed') => void;
  isShortlisted?: boolean;
  isInterestSent?: boolean;
}

const MatchProfileDetail: React.FC<MatchProfileDetailProps> = ({ 
  userId, 
  onBack, 
  onAction,
  isShortlisted,
  isInterestSent
}) => {
  const { t, locale } = useLanguage();
  const [profile, setProfile] = useState<Partial<BiodataResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await BiodataService.getPublic(userId);
        setProfile(data);
      } catch (err: any) {
        setError(err.message || 'Profile not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>;
  }

  if (error || !profile) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <h2 style={{ color: 'var(--text-headers)' }}>Profile Not Found</h2>
        <p>{error}</p>
        <button onClick={onBack} style={{ marginTop: '2rem', padding: '0.8rem 2rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}>
          Go Back
        </button>
      </div>
    );
  }

  const photos = [profile.photoUrl, ...(profile.additionalPhotos || [])].filter(Boolean) as string[];

  return (
    <div className="animate-fade" style={{ width: '100%', paddingBottom: '2rem' }}>
      <button 
        onClick={onBack} 
        style={{ 
          background: 'none', 
          border: 'none', 
          color: 'var(--text-muted)', 
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          marginBottom: '1rem',
          fontSize: '1rem',
          fontWeight: 600
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        {locale === 'en' ? 'Back to Matches' : 'मैच सूची पर वापस जाएं'}
      </button>

      <div style={{ background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
        
        {/* Full Width Image Header */}
        <div style={{ position: 'relative', width: '100%', height: '400px' }}>
          <ImageSlider 
            images={photos.length > 0 ? photos : ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400']} 
            height="100%" 
          />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '3rem 2rem 2rem', background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%)', color: '#fff', pointerEvents: 'none' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', margin: '0 0 0.2rem 0', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
              {profile.fullName}
            </h2>
            <p style={{ margin: 0, fontSize: '1.1rem', color: '#f0f0f0', opacity: 0.9, textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
              {profile.age && `${profile.age} ${locale === 'en' ? 'Yrs' : 'वर्ष'} • `}{profile.height && `${profile.height} • `}{profile.location}
            </p>
          </div>
        </div>
        
        <div style={{ padding: '2rem' }}>
          
          {/* Action Bar */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '-3.5rem', position: 'relative', zIndex: 10, marginBottom: '2rem' }}>
            <button 
              onClick={() => onAction('passed')} 
              style={{ ...styles.actionBtn, background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border-light)' }}
            >
              ✕ {t('action_pass')}
            </button>
            <button 
              onClick={() => onAction('shortlisted')} 
              style={{ ...styles.actionBtn, background: isShortlisted ? 'var(--gold-primary)' : 'var(--bg-card)', color: isShortlisted ? '#fff' : 'var(--gold-primary)', border: isShortlisted ? 'none' : '1px solid var(--gold-primary)' }}
            >
              ⭐ {isShortlisted ? (locale === 'en' ? 'Shortlisted' : 'शॉर्टलिस्ट किया गया') : t('action_shortlist')}
            </button>
            <button 
              onClick={() => onAction('interest_sent')} 
              style={{ ...styles.actionBtn, background: isInterestSent ? 'var(--neutral-100)' : 'var(--primary)', color: isInterestSent ? 'var(--text-muted)' : '#fff', border: 'none' }}
            >
              💖 {isInterestSent ? t('app_sent') : t('action_interest')}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* About Me */}
            {profile.aboutMe && (
              <div style={styles.detailCard}>
                <h3 style={styles.sectionTitle}>👤 {locale === 'en' ? 'About Me' : 'मेरे बारे में'}</h3>
                <p style={styles.text}>{profile.aboutMe}</p>
              </div>
            )}

            {/* Basic Info Grid */}
            <div style={styles.detailCard}>
               <h3 style={styles.sectionTitle}>📋 {locale === 'en' ? 'Basic Details' : 'बुनियादी विवरण'}</h3>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem' }}>
                {profile.religion && (
                  <div>
                    <p style={styles.label}>{locale === 'en' ? 'Religion' : 'धर्म'}</p>
                    <p style={styles.value}>{profile.religion}</p>
                  </div>
                )}
                {profile.caste && (
                  <div>
                    <p style={styles.label}>{locale === 'en' ? 'Caste' : 'जाति'}</p>
                    <p style={styles.value}>{profile.caste}</p>
                  </div>
                )}
                {profile.gotra && (
                  <div>
                    <p style={styles.label}>{locale === 'en' ? 'Gotra' : 'गोत्र'}</p>
                    <p style={styles.value}>{profile.gotra}</p>
                  </div>
                )}
                {profile.gender && (
                  <div>
                    <p style={styles.label}>{locale === 'en' ? 'Gender' : 'लिंग'}</p>
                    <p style={styles.value}>{profile.gender}</p>
                  </div>
                )}
               </div>
            </div>

            {/* Education & Career */}
            <div style={styles.detailCard}>
              <h3 style={styles.sectionTitle}>🎓 {locale === 'en' ? 'Education & Career' : 'शिक्षा और करियर'}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem' }}>
                {profile.education && (
                  <div>
                    <p style={styles.label}>{locale === 'en' ? 'Education' : 'शिक्षा'}</p>
                    <p style={styles.value}>{profile.education}</p>
                  </div>
                )}
                {profile.profession && (
                  <div>
                    <p style={styles.label}>{locale === 'en' ? 'Profession' : 'पेशा'}</p>
                    <p style={styles.value}>{profile.profession}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  actionBtn: {
    flex: 1,
    padding: '0.9rem 0.5rem',
    borderRadius: '16px',
    fontWeight: '700',
    fontSize: '0.95rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    boxShadow: 'var(--shadow-md)',
    whiteSpace: 'nowrap' as const,
    transition: 'all 0.2s'
  },
  detailCard: {
    background: 'var(--bg-app)',
    padding: '1.5rem',
    borderRadius: '16px',
    border: '1px solid var(--border-light)'
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: 'var(--text-headers)',
    margin: '0 0 1rem 0'
  },
  text: {
    margin: 0,
    fontSize: '1rem',
    color: 'var(--text-main)',
    lineHeight: 1.6
  },
  label: {
    margin: '0 0 0.3rem 0',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
    fontWeight: 600
  },
  value: {
    margin: 0,
    fontSize: '1.05rem',
    color: 'var(--text-headers)',
    fontWeight: 500
  }
};

export default MatchProfileDetail;
