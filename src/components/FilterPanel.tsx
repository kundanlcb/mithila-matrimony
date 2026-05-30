import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { apiClient } from '../api/apiClient';

interface FilterPanelProps {
  onApplyFilters: (filters: { gotra?: string; minAge?: number; maxAge?: number; location?: string; minIncome?: number; profession?: string; maritalStatus?: string; diet?: string; religion?: string; caste?: string; }) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onApplyFilters, onClose, isMobile }) => {
  const { t, locale } = useLanguage();
  
  const [gotra, setGotra] = useState<string>('');
  const [ageRange, setAgeRange] = useState<{ min: number; max: number }>({ min: 18, max: 40 });
  const [location, setLocation] = useState<string>('');
  const [profession, setProfession] = useState<string>('');
  const [maritalStatus, setMaritalStatus] = useState<string>('');
  const [diet, setDiet] = useState<string>('');
  const [religion, setReligion] = useState<string>('');
  const [caste, setCaste] = useState<string>('');

  // Master Data Options States
  const [gotras, setGotras] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [professions, setProfessions] = useState<string[]>([]);
  const [religions, setReligions] = useState<string[]>([]);
  const [castes, setCastes] = useState<string[]>([]);

  const maritalStatuses = ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'];
  const diets = ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan'];

  // Fetch all options dynamically on mount
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [gotrasList, citiesList, professionsList, religionsList, castesList] = await Promise.all([
          apiClient.get<any[]>('/api/v1/admin/master-data/gotra'),
          apiClient.get<any[]>('/api/v1/admin/master-data/city'),
          apiClient.get<any[]>('/api/v1/admin/master-data/profession'),
          apiClient.get<any[]>('/api/v1/admin/master-data/religion'),
          apiClient.get<any[]>('/api/v1/admin/master-data/caste')
        ]);
        if (gotrasList?.length) setGotras(gotrasList.map(g => g.name));
        if (citiesList?.length) setLocations(citiesList.map(c => c.name));
        if (professionsList?.length) setProfessions(professionsList.map(p => p.name));
        if (religionsList?.length) setReligions(religionsList.map(r => r.name));
        if (castesList?.length) setCastes(castesList.map(c => c.name));
      } catch (e) {
        console.error('Failed to fetch master data in FilterPanel', e);
      }
    };
    fetchMasterData();
  }, []);

  const handleApply = () => {
    onApplyFilters({
      gotra: gotra || undefined,
      minAge: ageRange.min,
      maxAge: ageRange.max,
      location: location || undefined,
      profession: profession || undefined,
      maritalStatus: maritalStatus || undefined,
      diet: diet || undefined,
      religion: religion || undefined,
      caste: caste || undefined
    });
    if (onClose) onClose();
  };

  const handleReset = () => {
    setGotra('');
    setAgeRange({ min: 18, max: 70 });
    setLocation('');
    setProfession('');
    setMaritalStatus('');
    setDiet('');
    setReligion('');
    setCaste('');
    onApplyFilters({});
    if (onClose) onClose();
  };

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h3 style={styles.title}>⚙️ {t('filter_title')}</h3>
        {isMobile && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
            ✕
          </button>
        )}
      </div>
      
      <div style={styles.filterGroup}>
        <label style={styles.label}>{t('filter_age_range')}</label>
        <div style={styles.ageInputs}>
          <input 
            type="number" 
            value={ageRange.min} 
            onChange={e => setAgeRange(prev => ({ ...prev, min: Number(e.target.value) }))}
            style={styles.input}
            min={18}
            max={70}
          />
          <span style={{ color: 'var(--text-muted)' }}>-</span>
          <input 
            type="number" 
            value={ageRange.max} 
            onChange={e => setAgeRange(prev => ({ ...prev, max: Number(e.target.value) }))}
            style={styles.input}
            min={18}
            max={70}
          />
        </div>
      </div>

      <div style={styles.filterGroup}>
        <label style={styles.label}>{locale === 'en' ? 'Gotra' : 'गोत्र'}</label>
        <select 
          value={gotra} 
          onChange={e => setGotra(e.target.value)}
          style={styles.select}
        >
          <option value="">{t('filter_all')}</option>
          {gotras.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      <div style={styles.filterGroup}>
        <label style={styles.label}>{locale === 'en' ? 'Religion' : locale === 'hi' ? 'धर्म' : 'धर्म'}</label>
        <select 
          value={religion} 
          onChange={e => setReligion(e.target.value)}
          style={styles.select}
        >
          <option value="">{t('filter_all')}</option>
          {religions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div style={styles.filterGroup}>
        <label style={styles.label}>{locale === 'en' ? 'Caste' : locale === 'hi' ? 'जाति' : 'जाति'}</label>
        <select 
          value={caste} 
          onChange={e => setCaste(e.target.value)}
          style={styles.select}
        >
          <option value="">{t('filter_all')}</option>
          {castes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div style={styles.filterGroup}>
        <label style={styles.label}>{t('filter_location')}</label>
        <select 
          value={location} 
          onChange={e => setLocation(e.target.value)}
          style={styles.select}
        >
          <option value="">{t('filter_all')}</option>
          {locations.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div style={styles.filterGroup}>
        <label style={styles.label}>{locale === 'en' ? 'Profession' : 'पेशा'}</label>
        <select 
          value={profession} 
          onChange={e => setProfession(e.target.value)}
          style={styles.select}
        >
          <option value="">{t('filter_all')}</option>
          {professions.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div style={styles.filterGroup}>
        <label style={styles.label}>{locale === 'en' ? 'Marital Status' : 'वैवाहिक स्थिति'}</label>
        <select 
          value={maritalStatus} 
          onChange={e => setMaritalStatus(e.target.value)}
          style={styles.select}
        >
          <option value="">{t('filter_all')}</option>
          {maritalStatuses.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div style={styles.filterGroup}>
        <label style={styles.label}>{locale === 'en' ? 'Diet' : 'आहार'}</label>
        <select 
          value={diet} 
          onChange={e => setDiet(e.target.value)}
          style={styles.select}
        >
          <option value="">{t('filter_all')}</option>
          {diets.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
        <button onClick={handleReset} style={{ ...styles.applyBtn, background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-light)', flex: 1 }}>
          {locale === 'en' ? 'Reset' : 'रीसेट करें'}
        </button>
        <button onClick={handleApply} style={{ ...styles.applyBtn, flex: 2 }}>
          {t('filter_apply')}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-light)',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.25rem'
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--text-headers)',
    margin: 0
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem'
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  },
  ageInputs: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  input: {
    width: '100%',
    padding: '0.6rem',
    border: '1px solid var(--border-light)',
    borderRadius: '8px',
    background: 'var(--bg-app)',
    color: 'var(--text-main)',
    fontFamily: 'inherit',
    fontSize: '1rem'
  },
  select: {
    width: '100%',
    padding: '0.6rem 2.5rem 0.6rem 0.8rem',
    border: '1px solid var(--border-light)',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-app)',
    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.8rem center',
    backgroundSize: '1rem',
    color: 'var(--text-main)',
    fontFamily: 'inherit',
    fontSize: '1rem',
    cursor: 'pointer',
    WebkitAppearance: 'none' as const,
    MozAppearance: 'none' as const,
    appearance: 'none' as const
  },
  applyBtn: {
    width: '100%',
    padding: '0.75rem',
    background: 'var(--primary)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '0.5rem'
  }
};

export default FilterPanel;

