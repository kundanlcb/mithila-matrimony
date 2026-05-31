import { useEffect, useState } from 'react';
import { BiodataService } from '../api/biodata.service';
import type { BiodataResponse } from '../types/api.types';
import { useLanguage } from '../context/LanguageContext';

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
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem', width: '100%' }}>
      {/* Public Banner */}
      <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', textAlign: 'center', marginBottom: '2rem' }}>
        <img 
          src={profile.photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400'} 
          alt="Profile" 
          style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary)', marginBottom: '1rem' }} 
        />
        <h1 style={{ fontSize: '2rem', color: 'var(--text-headers)', marginBottom: '0.5rem' }}>{profile.fullName}</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {profile.age} {locale === 'en' ? 'Yrs' : 'वर्ष'} • {profile.height} • {profile.location}
        </p>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: 'var(--bg-app)', 
          padding: '1.5rem', 
          borderRadius: 'var(--radius-md)', 
          marginBottom: '1.5rem' 
        }}>
          {profile.religion && <div style={styles.detailRow}><span style={styles.detailRowLabel}>{locale === 'en' ? 'Religion' : 'धर्म'}</span><span style={styles.detailRowValue}>{profile.religion}</span></div>}
          {profile.caste && <div style={styles.detailRow}><span style={styles.detailRowLabel}>{locale === 'en' ? 'Caste' : 'जाति'}</span><span style={styles.detailRowValue}>{profile.caste}</span></div>}
          {profile.gotra && <div style={styles.detailRow}><span style={styles.detailRowLabel}>{locale === 'en' ? 'Gotra' : 'गोत्र'}</span><span style={styles.detailRowValue}>{profile.gotra}</span></div>}
          {profile.education && <div style={styles.detailRow}><span style={styles.detailRowLabel}>{locale === 'en' ? 'Education' : 'शिक्षा'}</span><span style={styles.detailRowValue}>{profile.education}</span></div>}
          {profile.profession && <div style={styles.detailRow}><span style={styles.detailRowLabel}>{locale === 'en' ? 'Profession' : 'पेशा'}</span><span style={styles.detailRowValue}>{profile.profession}</span></div>}
          {profile.annualIncome != null && <div style={styles.detailRow}><span style={styles.detailRowLabel}>{locale === 'en' ? 'Income' : 'आय'}</span><span style={styles.detailRowValue}>₹{(profile.annualIncome / 100000).toFixed(1)} LPA</span></div>}
        </div>

        {profile.aboutMe && (
          <div style={{ textAlign: 'left', backgroundColor: 'var(--bg-app)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ color: 'var(--text-headers)', marginBottom: '0.5rem' }}>{locale === 'en' ? 'About' : 'के बारे में'}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{profile.aboutMe}</p>
          </div>
        )}
      </div>

      {/* Locked Section */}
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ filter: 'blur(8px)', opacity: 0.6, pointerEvents: 'none', userSelect: 'none' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', marginBottom: '1rem', minHeight: '200px' }}>
            <h3 style={{ color: 'var(--text-headers)', marginBottom: '1rem' }}>Full Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div><strong style={{ color: 'var(--text-muted)' }}>Annual Income:</strong> ₹12,00,000</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Contact Number:</strong> +91 9876543210</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Email Address:</strong> hidden@example.com</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Full Address:</strong> 123 Main St, New Delhi</div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <div style={{ width: '100px', height: '100px', backgroundColor: 'var(--border-light)', borderRadius: '8px' }}></div>
              <div style={{ width: '100px', height: '100px', backgroundColor: 'var(--border-light)', borderRadius: '8px' }}></div>
              <div style={{ width: '100px', height: '100px', backgroundColor: 'var(--border-light)', borderRadius: '8px' }}></div>
            </div>
          </div>
        </div>
        
        {/* Lock Overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{ color: 'white', marginBottom: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            {locale === 'en' ? 'Unlock Full Profile' : 'पूरी प्रोफ़ाइल अनलॉक करें'}
          </h2>
          <p style={{ color: '#f0f0f0', marginBottom: '2rem', maxWidth: '400px', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            {locale === 'en' ? 'Login or register to view full biodata, income details, additional photos, and to contact this person.' : 'पूरा बायोडाटा, आय विवरण, अतिरिक्त फ़ोटो देखने और संपर्क करने के लिए लॉगिन या रजिस्टर करें।'}
          </p>
          <button 
            onClick={onLoginClick}
            style={{ 
              padding: '1rem 2.5rem', 
              fontSize: '1.1rem', 
              fontWeight: '700',
              borderRadius: '50px', 
              background: 'var(--primary)', 
              color: 'white',
              border: 'none',
              boxShadow: '0 8px 20px rgba(216, 27, 96, 0.4)',
              cursor: 'pointer'
            }}
          >
            {locale === 'en' ? 'Login / Register Now' : 'लॉगिन / रजिस्टर करें'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  detailRow: {
    display: 'flex',
    padding: '0.8rem 0',
    borderBottom: '1px solid var(--border-light)',
    alignItems: 'center'
  },
  detailRowLabel: {
    width: '140px',
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    fontWeight: '600'
  },
  detailRowValue: {
    flex: 1,
    fontSize: '1rem',
    color: 'var(--text-main)',
    fontWeight: '500'
  }
};
