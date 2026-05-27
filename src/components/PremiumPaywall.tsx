import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface PremiumPaywallProps {
  onClose: () => void;
  onUpgrade: () => void;
}

const PremiumPaywall: React.FC<PremiumPaywallProps> = ({ onClose, onUpgrade }) => {
  const { t } = useLanguage();

  return (
    <div className="modal-overlay animate-fade" style={styles.overlay}>
      <div className="modal-content animate-scale" style={styles.modal}>
        <button onClick={onClose} style={styles.closeBtn} aria-label="Close">✕</button>
        
        <div style={styles.iconContainer}>
          <div style={styles.iconLock}>🔒</div>
        </div>
        
        <h2 style={styles.title}>{t('premium_title')}</h2>
        <p style={styles.desc}>{t('premium_desc')}</p>
        
        <div style={styles.blurredContact}>
          <span style={styles.contactLabel}>Phone:</span>
          <span style={styles.contactValue}>+91 98*** ****</span>
        </div>
        
        <button onClick={onUpgrade} style={styles.upgradeBtn}>
          ✨ {t('premium_btn')}
        </button>
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
    backgroundColor: 'var(--bg-card)',
    borderRadius: '24px',
    padding: '2.5rem 2rem',
    maxWidth: '400px',
    width: '100%',
    position: 'relative' as const,
    textAlign: 'center' as const,
    boxShadow: 'var(--shadow-gold)',
    border: '1px solid var(--gold-primary)',
    overflow: 'hidden'
  },
  closeBtn: {
    position: 'absolute' as const,
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '0.5rem'
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem'
  },
  iconLock: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--gold-primary), hsl(45,80%,65%))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(212,175,55,0.4)'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: 'var(--text-headers)',
    marginBottom: '0.75rem',
    fontFamily: 'var(--font-serif)'
  },
  desc: {
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
    lineHeight: 1.5,
    marginBottom: '2rem'
  },
  blurredContact: {
    background: 'var(--bg-app)',
    border: '1px solid var(--border-light)',
    borderRadius: '12px',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  contactLabel: {
    fontWeight: '600',
    color: 'var(--text-main)'
  },
  contactValue: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    filter: 'blur(3px)',
    userSelect: 'none' as const
  },
  upgradeBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, var(--gold-primary), hsl(45,80%,65%))',
    color: '#000',
    border: 'none',
    padding: '1rem',
    borderRadius: '50px',
    fontSize: '1.05rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(212,175,55,0.3)',
    transition: 'transform 0.2s ease'
  }
};

export default PremiumPaywall;
