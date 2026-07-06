import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const languages = [
  { code: 'ma', label: 'मैथिली (Maithili)' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'en', label: 'English (अंग्रेजी)' }
];

export const LanguageSwitcher: React.FC = () => {
  const { locale, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%' }} ref={containerRef}>
      <button 
        className="footer-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}
      >
        <span>🌐 {currentLang.label}</span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: 0,
          right: 0,
          marginBottom: '0.5rem',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          zIndex: 100,
          animation: 'fade-in 0.2s ease-out'
        }}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code as any);
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                textAlign: 'left',
                background: locale === lang.code ? 'var(--primary-light)' : 'transparent',
                color: locale === lang.code ? 'var(--primary-dark)' : 'var(--text-main)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.95rem',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => {
                if (locale !== lang.code) e.currentTarget.style.background = 'var(--bg-hover)';
              }}
              onMouseLeave={(e) => {
                if (locale !== lang.code) e.currentTarget.style.background = 'transparent';
              }}
            >
              <span>🌐</span>
              <span style={{ fontWeight: locale === lang.code ? '600' : '400' }}>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
