import { useEffect, useState } from 'react';
import { BiodataService } from '../api/biodata.service';
import { calculateAge } from '../utils/helpers';
import type { BiodataResponse } from '../types/api.types';
import { useLanguage } from '../context/LanguageContext';
import { ImageSlider } from './ImageSlider';

interface PublicProfileViewProps {
  userId: string;
  onLoginClick: () => void;
}

export const PublicProfileView = ({ userId, onLoginClick }: PublicProfileViewProps) => {
  const [profile, setProfile] = useState<Partial<BiodataResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { locale } = useLanguage();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
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
        <button onClick={onLoginClick} style={{ marginTop: '2rem', padding: '0.8rem 2rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}>
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade" style={{ width: '100%', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
        
        {/* Full Width Image Header */}
        <div style={{ position: 'relative', width: '100%', height: '320px' }}>
          <ImageSlider 
            images={[profile.photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400', ...(profile.additionalPhotos || [])]} 
            height="100%" 
          />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem 1.5rem 1.5rem', background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)', color: '#fff', pointerEvents: 'none' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', margin: '0 0 0.2rem 0', color: '#fff' }}>{profile.fullName}</h2>
            <p style={{ margin: 0, fontSize: '1rem', color: '#f0f0f0', opacity: 0.9 }}>
              {calculateAge(profile.dateOfBirth)} {locale === 'en' ? 'Yrs' : 'वर्ष'} • {profile.height} • {profile.location}
            </p>
          </div>
        </div>
        
        <div style={{ padding: '1.5rem' }}>
          {/* Bio & Details */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              {locale === 'en' ? 'About Me' : 'मेरे बारे में'}
            </h3>
            <p style={{ color: 'var(--text-main)', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              {profile.aboutMe || (locale === 'en' ? 'No bio provided.' : 'अभी तक कोई बायो नहीं दिया गया है।')}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
              {profile.religion && (
                <div>
                  <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{locale === 'en' ? 'Religion' : 'धर्म'}</p>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-headers)', fontWeight: 500 }}>{profile.religion}</p>
                </div>
              )}
              {profile.caste && (
                <div>
                  <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{locale === 'en' ? 'Caste' : 'जाति'}</p>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-headers)', fontWeight: 500 }}>{profile.caste}</p>
                </div>
              )}
              {profile.gotra && (
                <div>
                  <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{locale === 'en' ? 'Gotra' : 'गोत्र'}</p>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-headers)', fontWeight: 500 }}>{profile.gotra}</p>
                </div>
              )}
              {profile.education && (
                <div>
                  <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{locale === 'en' ? 'Education' : 'शिक्षा'}</p>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-headers)', fontWeight: 500 }}>{profile.education}</p>
                </div>
              )}
              {profile.profession && (
                <div>
                  <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{locale === 'en' ? 'Profession' : 'पेशा'}</p>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-headers)', fontWeight: 500 }}>{profile.profession}</p>
                </div>
              )}
              {profile.annualIncome != null && (
                <div>
                  <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{locale === 'en' ? 'Income' : 'आय'}</p>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-headers)', fontWeight: 500 }}>₹{(profile.annualIncome / 100000).toFixed(1)}L / {locale === 'en' ? 'Yr' : 'वर्ष'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Locked Section Overlay directly under details */}
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <div style={{ filter: 'blur(8px)', opacity: 0.6, pointerEvents: 'none', userSelect: 'none' }}>
              <div style={{ backgroundColor: 'var(--bg-app)', padding: '1.5rem', minHeight: '200px' }}>
                <h3 style={{ color: 'var(--text-headers)', marginBottom: '1rem', fontSize: '1.1rem' }}>Full Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><strong style={{ color: 'var(--text-muted)' }}>Contact Number:</strong> +91 9876543210</div>
                  <div><strong style={{ color: 'var(--text-muted)' }}>Email Address:</strong> hidden@example.com</div>
                  <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: 'var(--text-muted)' }}>Full Address:</strong> 123 Main St, New Delhi, India</div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--border-light)', borderRadius: '8px' }}></div>
                  <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--border-light)', borderRadius: '8px' }}></div>
                  <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--border-light)', borderRadius: '8px' }}></div>
                </div>
              </div>
            </div>
            
            {/* Lock Overlay */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔒</div>
              <h2 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1.4rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                {locale === 'en' ? 'Unlock Full Profile' : 'पूरी प्रोफ़ाइल अनलॉक करें'}
              </h2>
              <p style={{ color: '#f0f0f0', marginBottom: '1.5rem', fontSize: '0.95rem', maxWidth: '300px', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                {locale === 'en' ? 'Login or register to view contact info, family details, and connect.' : 'संपर्क जानकारी, परिवार विवरण देखने और जुड़ने के लिए लॉगिन या रजिस्टर करें।'}
              </p>
              <button 
                onClick={onLoginClick}
                style={{ 
                  padding: '0.8rem 2rem', 
                  fontSize: '1rem', 
                  fontWeight: '700',
                  borderRadius: '50px', 
                  background: 'var(--primary)', 
                  color: 'white',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(216, 27, 96, 0.4)',
                  cursor: 'pointer',
                  width: '100%',
                  maxWidth: '250px'
                }}
              >
                {locale === 'en' ? 'Login / Register Now' : 'लॉगिन / रजिस्टर करें'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
