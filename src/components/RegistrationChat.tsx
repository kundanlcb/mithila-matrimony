import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BiodataService } from '../api/biodata.service';
import { AuthService } from '../api/auth.service';
import { apiClient } from '../api/apiClient';
import { UploadService } from '../api/upload.service';
import type { Biodata } from '../types';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  inputType?: 'text' | 'select' | 'tags' | 'file' | 'summary';
  options?: string[];
}

interface RegistrationChatProps {
  onComplete: () => void;
}

export const RegistrationChat = ({ onComplete }: RegistrationChatProps) => {
  const { t, locale } = useLanguage();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const welcomeTriggered = useRef(false);

  // Core Chat States
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [typing, setTyping] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Master Data Options
  const [optionsGotra, setOptionsGotra] = useState<string[]>(['Kashyap', 'Shandilya', 'Vatsa', 'Bhardwaj', 'Parashar', 'Katyayan']);
  const [optionsCity, setOptionsCity] = useState<string[]>(['Darbhanga', 'Madhubani', 'Patna', 'Saharsa']);
  const [optionsProfession, setOptionsProfession] = useState<string[]>(['Software Engineer', 'Doctor', 'Teacher', 'Business']);
  const [optionsReligion, setOptionsReligion] = useState<string[]>(['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist']);
  const [optionsCaste, setOptionsCaste] = useState<string[]>(['Brahmin (Maithil)', 'Kayastha', 'Rajput', 'Baniya', 'Karna Kayastha', 'Yadav', 'Other']);

  // Biodata Form Accumulator State
  const [biodataForm, setBiodataForm] = useState<Omit<Biodata, 'biodataId' | 'userId'>>({
    fullName: '',
    gender: 'Female',
    age: 24,
    height: '5\' 6"',
    maritalStatus: 'Never Married',
    complexion: 'Fair',
    religion: 'Hindu',
    caste: 'Brahmin (Maithil)',
    gotra: 'Kashyap',
    diet: 'Vegetarian',
    profession: 'Software Engineer',
    annualIncome: 1200000,
    location: 'Darbhanga',
    education: 'B.Tech',
    interests: [],
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400',
    aboutMe: ''
  });

  // Hobbies temporary accumulator (Step 8)
  const [tempInterests, setTempInterests] = useState<string[]>([]);

  // Photo upload list
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  // Auto Scroll to Bottom on message updates
  useEffect(() => {
    if (chatEndRef.current) {
      const scroller = chatEndRef.current.parentElement;
      if (scroller) {
        scroller.scrollTop = scroller.scrollHeight;
      }
    }
  }, [messages, typing]);

  // Fetch Master Data
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [gotras, cities, professions, religions, castes] = await Promise.all([
          apiClient.get<any[]>('/api/v1/master-data/gotra'),
          apiClient.get<any[]>('/api/v1/master-data/city'),
          apiClient.get<any[]>('/api/v1/master-data/profession'),
          apiClient.get<any[]>('/api/v1/master-data/religion'),
          apiClient.get<any[]>('/api/v1/master-data/caste')
        ]);
        if (gotras?.length) setOptionsGotra(gotras.map(g => g.name));
        if (cities?.length) setOptionsCity(cities.map(c => c.name));
        if (professions?.length) setOptionsProfession(professions.map(p => p.name));
        if (religions?.length) setOptionsReligion(religions.map(r => r.name));
        if (castes?.length) setOptionsCaste(castes.map(c => c.name));
      } catch (e) {
        console.error('Failed to fetch master data', e);
      }
    };
    fetchMasterData();
  }, []);

  // Initial welcome message from bot
  useEffect(() => {
    if (welcomeTriggered.current) return;
    welcomeTriggered.current = true;
    
    const user = JSON.parse(localStorage.getItem('active_profile') || '{}');
    if (user.registrationStep === 'password') {
      setCurrentStep(-1);
      triggerBotResponse(t('bot_set_password'), 'text');
    } else {
      triggerBotResponse(t('bot_welcome'), 'text');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update Bot messages translations dynamically if language toggles mid-conversation!
  useEffect(() => {
    if (messages.length === 0) return;
    
    // Map existing bot dialogues to new localized values based on step index
    const translatedMessages = messages.map(msg => {
      if (msg.sender === 'user') return msg;
      
      let text = msg.text;
      if (msg.text.includes(t('bot_welcome').substring(0, 10)) || msg.id === 'welcome') {
        text = t('bot_welcome');
      } else if (msg.text.includes(t('bot_gender').substring(0, 10)) || (msg.inputType === 'select' && msg.options && (msg.options.includes('Female') || msg.options.includes('Male')))) {
        text = t('bot_gender', { name: biodataForm.fullName });
      } else if (msg.text.includes(t('bot_age').substring(0, 10))) {
        text = t('bot_age');
      } else if (msg.text.includes(t('bot_religion').substring(0, 8))) {
        text = t('bot_religion');
      } else if (msg.text.includes(t('bot_caste').substring(0, 8))) {
        text = t('bot_caste');
      } else if (msg.text.includes(t('bot_gotra').substring(0, 10))) {
        text = t('bot_gotra');
      } else if (msg.text.includes(t('bot_city').substring(0, 10))) {
        text = t('bot_city');
      } else if (msg.text.includes(t('bot_education').substring(0, 10))) {
        text = t('bot_education');
      } else if (msg.text.includes(t('bot_profession').substring(0, 10))) {
        text = t('bot_profession');
      } else if (msg.text.includes(t('bot_income').substring(0, 10))) {
        text = t('bot_income');
      } else if (msg.text.includes(t('bot_interests').substring(0, 10)) || msg.inputType === 'tags') {
        text = t('bot_interests');
      } else if (msg.text.includes(t('bot_bio').substring(0, 10))) {
        text = t('bot_bio');
      } else if (msg.text.includes(t('bot_photo').substring(0, 10)) || msg.inputType === 'file') {
        text = t('bot_photo');
      } else if (msg.text.includes(t('bot_summary').substring(0, 10)) || msg.inputType === 'summary') {
        text = t('bot_summary');
      }
      
      return { ...msg, text };
    });
    
    setMessages(translatedMessages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  // Bot Trigger with simulated Typing Pulse
  const triggerBotResponse = (text: string, type: ChatMessage['inputType'], options?: string[]) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, {
        id: prev.length === 0 ? 'welcome' : 'bot-' + Math.random().toString(36).substr(2, 9),
        sender: 'bot',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        inputType: type,
        options
      }]);
    }, 650); // Simulated conversational latency
  };

  // Submit User Message & trigger next bot flow state
  const handleUserSubmit = (e?: React.FormEvent, directValue?: string) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    
    const valueToProcess = directValue !== undefined ? directValue : inputValue.trim();
    if (!valueToProcess && currentStep !== 14) { // Hobbies selection done via button
      setErrorMsg(t('chat_error_empty'));
      return;
    }

    // 1. Add user reply to conversation log
    setMessages(prev => [...prev, {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text: currentStep === 14 ? tempInterests.join(', ') : valueToProcess,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    setInputValue('');

    // 2. State Machine Dialog Processor
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);

    // Bot Response Logic based on Next Step
    switch (currentStep) {
      case -1: // Password entered
        if (valueToProcess.length < 6) {
          setErrorMsg(t('error_short_password'));
          setCurrentStep(-1);
          setMessages(prev => prev.slice(0, -1));
          return;
        }
        AuthService.setupPassword({ password: valueToProcess }).then(() => {
          triggerBotResponse(t('bot_welcome'), 'text');
        }).catch(err => {
          setErrorMsg('Failed to set password: ' + err.message);
          setCurrentStep(-1);
          setMessages(prev => prev.slice(0, -1));
        });
        break;

      case 0: // Name entered -> Ask Gender
        setBiodataForm(prev => ({ ...prev, fullName: valueToProcess }));
        const defaultPhoto = valueToProcess.toLowerCase() === 'female' 
          ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400'
          : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400&h=400';
        setBiodataForm(prev => ({ ...prev, photoUrl: defaultPhoto }));
        
        triggerBotResponse(t('bot_gender', { name: valueToProcess }), 'select', ['Female', 'Male']);
        break;

      case 1: // Gender selected -> Ask Age
        setBiodataForm(prev => ({ 
          ...prev, 
          gender: valueToProcess as 'Male' | 'Female',
          photoUrl: valueToProcess === 'Female'
            ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400'
            : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400&h=400'
        }));
        triggerBotResponse(t('bot_age'), 'text');
        break;

      case 2: { // Age entered -> Ask Height
        const ageNum = parseInt(valueToProcess);
        if (isNaN(ageNum) || ageNum < 18 || ageNum > 70) {
          setErrorMsg(t('chat_error_age'));
          setCurrentStep(2);
          setMessages(prev => prev.slice(0, -1));
          return;
        }
        setBiodataForm(prev => ({ ...prev, age: ageNum }));
        triggerBotResponse(t('bot_height'), 'select', ["5' 0\"", "5' 2\"", "5' 4\"", "5' 6\"", "5' 8\"", "5' 10\"", "6' 0\"+"]);
        break;
      }

      case 3: // Height entered -> Ask Marital Status
        setBiodataForm(prev => ({ ...prev, height: valueToProcess }));
        triggerBotResponse(t('bot_marital'), 'select', ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce']);
        break;

      case 4: // Marital Status entered -> Ask Complexion
        setBiodataForm(prev => ({ ...prev, maritalStatus: valueToProcess }));
        triggerBotResponse(t('bot_complexion'), 'select', ['Very Fair', 'Fair', 'Wheatish', 'Dark']);
        break;

      case 5: // Complexion entered -> Ask Religion
        setBiodataForm(prev => ({ ...prev, complexion: valueToProcess }));
        triggerBotResponse(t('bot_religion'), 'select', optionsReligion);
        break;

      case 6: // Religion entered -> Ask Caste
        setBiodataForm(prev => ({ ...prev, religion: valueToProcess }));
        triggerBotResponse(t('bot_caste'), 'select', optionsCaste);
        break;

      case 7: // Caste selected -> Ask Gotra
        setBiodataForm(prev => ({ ...prev, caste: valueToProcess }));
        triggerBotResponse(t('bot_gotra'), 'select', optionsGotra);
        break;

      case 8: // Gotra selected -> Ask Diet
        setBiodataForm(prev => ({ ...prev, gotra: valueToProcess }));
        triggerBotResponse(t('bot_diet'), 'select', ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan']);
        break;

      case 9: // Diet entered -> Ask City
        setBiodataForm(prev => ({ ...prev, diet: valueToProcess }));
        triggerBotResponse(t('bot_city'), 'select', optionsCity);
        break;

      case 10: // City entered -> Ask Education
        setBiodataForm(prev => ({ ...prev, location: valueToProcess }));
        triggerBotResponse(t('bot_education'), 'text');
        break;

      case 11: // Education entered -> Ask Profession
        setBiodataForm(prev => ({ ...prev, education: valueToProcess }));
        triggerBotResponse(t('bot_profession'), 'select', optionsProfession);
        break;

      case 12: // Profession entered -> Ask Income
        setBiodataForm(prev => ({ ...prev, profession: valueToProcess }));
        triggerBotResponse(t('bot_income'), 'text');
        break;

      case 13: { // Income entered -> Ask Hobbies
        const incomeNum = parseInt(valueToProcess);
        if (isNaN(incomeNum) || incomeNum <= 0) {
          setErrorMsg(t('chat_error_income'));
          setCurrentStep(13);
          setMessages(prev => prev.slice(0, -1));
          return;
        }
        setBiodataForm(prev => ({ ...prev, annualIncome: incomeNum }));
        triggerBotResponse(t('bot_interests'), 'tags', ['Madhubani Painting', 'Classical Music', 'Cooking', 'Reading', 'Travel', 'Gardening', 'Yoga']);
        break;
      }

      case 14: // Hobbies selected -> Ask Bio
        setBiodataForm(prev => ({ ...prev, interests: tempInterests }));
        triggerBotResponse(t('bot_bio'), 'text');
        break;

      case 15: // Bio entered -> Ask Photo Upload
        setBiodataForm(prev => ({ ...prev, aboutMe: valueToProcess }));
        triggerBotResponse(t('bot_photo'), 'file');
        break;

      case 16: // Photo Uploaded -> Summary Review
        if (valueToProcess && valueToProcess !== 'skip') {
          setBiodataForm(prev => ({ ...prev, photoUrl: valueToProcess }));
        }
        triggerBotResponse(t('bot_summary'), 'summary');
        break;

      default:
        break;
    }
  };

  // Hobbies tags selectors handler
  const handleTagToggle = (tag: string) => {
    setTempInterests(prev => {
      const idx = prev.indexOf(tag);
      if (idx !== -1) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  // Photo Upload Handler for Signed URL upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg(locale === 'en' ? 'File size exceeds 2MB limit.' : 'फ़ाइल का आकार 2MB सीमा से अधिक है।');
        return;
      }
      
      try {
        const fileUrl = await UploadService.uploadFile(file);
        setUploadedPhotos(prev => [...prev, fileUrl]);
      } catch (err: any) {
        setErrorMsg(`Upload failed: ${err.message}`);
      }
    }
  };

  // Save profile and trigger complete redirection callback
  const handleFinalRegister = async () => {
    try {
      const primary = uploadedPhotos[0] || biodataForm.photoUrl;
      const additional = uploadedPhotos.slice(1);
      const payload = {
        ...biodataForm,
        photoUrl: primary,
        additionalPhotos: additional
      };
      await BiodataService.updateMine(payload as any);
      await BiodataService.complete();
      onComplete();
    } catch (e) {
      setErrorMsg('Failed to complete registration. Please try again.');
    }
  };

  return (
    <div className="chat-container">
      {/* Bot Chat stream scroller */}
      <div className="chat-scroller">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={msg.sender === 'bot' ? 'chat-bubble-bot' : 'chat-bubble-user'}
            style={{ position: 'relative' }}
          >
            {/* Visual Chat Content rendering */}
            {msg.inputType === 'summary' ? (
              <div style={styles.summaryWrapper}>
                <p style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '0.8rem' }}>{msg.text}</p>
                
                {/* Mithila Summary Card Visual layout */}
                <div style={styles.cardVisual} className="animate-scale">
                  <div style={styles.cardHeader}>
                    <img src={biodataForm.photoUrl} alt="Portrait" style={styles.cardPortrait} />
                    <div style={styles.headerDetails}>
                      <h4 style={styles.cardName}>{biodataForm.fullName}</h4>
                      <p style={styles.cardSubText}>{biodataForm.age} Yrs • {biodataForm.gender}</p>
                    </div>
                  </div>
                  
                  <div style={styles.detailsGrid}>
                          <div style={styles.detailBox}>
                            <span style={styles.detailLabel}>{locale === 'en' ? 'Age & Height' : 'उम्र और लंबाई'}</span>
                            <span style={styles.detailVal}>{biodataForm.age} {locale === 'en' ? 'Yrs' : 'वर्ष'} • {biodataForm.height}</span>
                          </div>
                          
                          <div style={styles.detailBox}>
                            <span style={styles.detailLabel}>{locale === 'en' ? 'Marital & Diet' : 'वैवाहिक स्थिति और आहार'}</span>
                            <span style={styles.detailVal}>{biodataForm.maritalStatus} • {biodataForm.diet}</span>
                          </div>
                          
                          <div style={styles.detailBox}>
                            <span style={styles.detailLabel}>{t('summary_gotra')}</span>
                            <span style={styles.detailVal}>{biodataForm.gotra}</span>
                          </div>

                          <div style={styles.detailBox}>
                            <span style={styles.detailLabel}>{t('summary_religion')} & {t('summary_caste')}</span>
                            <span style={styles.detailVal}>{biodataForm.religion} • {biodataForm.caste}</span>
                          </div>
                    <div style={{ ...styles.detailBox, gridColumn: 'span 2' }}>
                      <span style={styles.detailLabel}>{t('summary_income')}</span>
                      <strong style={styles.detailVal}>₹{(biodataForm.annualIncome / 100000).toFixed(1)} {t('summary_lakh')}</strong>
                    </div>
                    <div style={{ ...styles.detailBox, gridColumn: 'span 2' }}>
                      <span style={styles.detailLabel}>💼 {biodataForm.profession}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({biodataForm.education})</span>
                    </div>
                  </div>

                  <div style={styles.aboutWrapper}>
                    <span style={styles.detailLabel}>{t('summary_about')}</span>
                    <p style={styles.aboutVal}>{biodataForm.aboutMe}</p>
                  </div>

                  <div style={styles.cardTags}>
                    {biodataForm.interests.map(t => (
                      <span key={t} style={styles.miniTag}>{t}</span>
                    ))}
                  </div>
                  
                  <button onClick={handleFinalRegister} style={styles.cardSubmitBtn}>
                    {t('btn_confirm_submit')}
                  </button>
                </div>
              </div>
            ) : (msg.text.startsWith('data:image/') || msg.text.startsWith('http')) && msg.sender === 'user' && currentStep > 14 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>📷 {locale === 'en' ? 'Uploaded Profile Photo:' : 'प्रोफ़ाइल फ़ोटो अपलोड की गई:'}</span>
                <img 
                  src={msg.text} 
                  alt="Uploaded Portrait" 
                  style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '2px solid #ffffff', boxShadow: 'var(--shadow-md)' }} 
                />
              </div>
            ) : msg.text === 'skip' ? (
              <span>⏩ {locale === 'en' ? 'Skipped Photo Upload' : 'फ़ोटो अपलोड छोड़ दिया गया'}</span>
            ) : (
              <span>{msg.text}</span>
            )}
            
            <span style={{
              display: 'block',
              fontSize: '0.65rem',
              marginTop: '0.4rem',
              textAlign: msg.sender === 'user' ? 'right' : 'left',
              opacity: 0.6,
              color: msg.sender === 'user' ? '#ffe0e6' : 'inherit'
            }}>
              {msg.timestamp}
            </span>
          </div>
        ))}

        {/* Simulated Bot Typing State indicator */}
        {typing && (
          <div className="chat-bubble-bot">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>

      {/* Validation warning banner */}
      {errorMsg && (
        <div style={styles.warningAlert} className="animate-fade">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Choices panel (Genders & Gotra chips bubbles) */}
      {!typing && messages.length > 0 && messages[messages.length - 1].sender === 'bot' && (
        <>
          {/* Gotras / Genders choices panel */}
          {messages[messages.length - 1].inputType === 'select' && messages[messages.length - 1].options && (
            <div className="chat-choices-panel animate-fade">
              {messages[messages.length - 1].options?.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleUserSubmit(undefined, opt)}
                  style={styles.choiceChip}
                  data-testid={`chat-option-${opt.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Hobbies / Interests multi-select tags panel */}
          {messages[messages.length - 1].inputType === 'tags' && messages[messages.length - 1].options && (
            <div className="chat-choices-panel animate-fade" style={{ flexDirection: 'column', gap: '0.8rem' }}>
              <div style={styles.tagsContainer}>
                {messages[messages.length - 1].options?.map((tag) => {
                  const active = tempInterests.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      style={{
                        ...styles.choiceChip,
                        backgroundColor: active ? 'var(--primary)' : 'var(--bg-app)',
                        color: active ? '#ffffff' : 'var(--text-main)',
                        borderColor: active ? 'var(--primary)' : 'var(--border-light)'
                      }}
                      data-testid={`chat-tag-${tag.replace(/\s+/g, '-').toLowerCase()}`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
              <button
                disabled={tempInterests.length === 0}
                onClick={() => handleUserSubmit(undefined, tempInterests.join(', '))}
                style={{
                  ...styles.primarySendBtn,
                  opacity: tempInterests.length === 0 ? 0.5 : 1,
                  alignSelf: 'flex-end',
                  padding: '0.4rem 1.4rem',
                  fontSize: '0.85rem'
                }}
                data-testid="chat-tags-submit"
              >
                Done Selecting ({tempInterests.length})
              </button>
            </div>
          )}

          {/* File Upload / Image drag-and-drop panel */}
          {messages[messages.length - 1].inputType === 'file' && (
            <div className="chat-choices-panel animate-fade" style={{ flexDirection: 'column', gap: '0.8rem', alignItems: 'stretch', padding: '1.2rem 1.5rem' }}>
              {/* Thumbnails of already uploaded photos */}
              {uploadedPhotos.length > 0 && (
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  {uploadedPhotos.map((photo, index) => (
                    <div key={index} style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden', border: '2px solid var(--primary)' }}>
                      <img src={photo} alt={`Upload ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        type="button" 
                        onClick={() => setUploadedPhotos(prev => prev.filter((_, i) => i !== index))}
                        style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontSize: '0.7rem', cursor: 'pointer', padding: 0 }}
                      >
                        ✕
                      </button>
                      {index === 0 && (
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'var(--primary)', color: '#fff', fontSize: '0.55rem', textAlign: 'center', fontWeight: 'bold', padding: '1px 0' }}>
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {uploadedPhotos.length < 10 && (
                <div style={styles.uploadArea}>
                  <input
                    type="file"
                    accept="image/*"
                    id="chat-portrait-upload"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="chat-portrait-upload" style={styles.uploadLabel}>
                    <div style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>📷</div>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-headers)' }}>
                      {locale === 'en' ? `Click to Upload Photo (${uploadedPhotos.length}/10)` : `फ़ोटो अपलोड करने के लिए क्लिक करें (${uploadedPhotos.length}/10)`}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      PNG, JPG or WEBP (Max 2MB)
                    </span>
                  </label>
                </div>
              )}

              {uploadedPhotos.length > 0 && (
                <button
                  onClick={() => handleUserSubmit(undefined, uploadedPhotos[0])}
                  style={{
                    ...styles.primarySendBtn,
                    alignSelf: 'stretch',
                    marginTop: '0.5rem',
                    backgroundColor: 'var(--primary)',
                    color: '#fff'
                  }}
                >
                  🚀 {locale === 'en' ? `Proceed with ${uploadedPhotos.length} Photo(s)` : `${uploadedPhotos.length} फ़ोटो के साथ आगे बढ़ें`}
                </button>
              )}
              
              <button
                onClick={() => handleUserSubmit(undefined, 'skip')}
                style={styles.skipUploadBtn}
                data-testid="chat-skip-upload"
              >
                ⏩ {locale === 'en' ? 'Skip & Keep Default Avatar' : 'छोड़ें और डिफ़ॉल्ट अवतार रखें'}
              </button>
            </div>
          )}
        </>
      )}

      {/* Chat bottom input text prompt panel */}
      <form onSubmit={handleUserSubmit} className="chat-input-bar">
        <input
          type={currentStep === -1 ? 'password' : (currentStep === 2 || currentStep === 13 ? 'number' : 'text')}
          placeholder={
            typing
              ? (locale === 'en' ? 'Mithila Assistant is typing...' : 'मैथिल सहायक टाइप कर रहा है...')
              : messages.length > 0 && messages[messages.length - 1].sender === 'bot' && messages[messages.length - 1].inputType !== 'text'
                ? (locale === 'en' ? 'Please choose an option above...' : 'कृपया ऊपर एक विकल्प चुनें...')
                : currentStep === -1 ? '••••••••' : t('chat_placeholder')
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={typing || (messages.length > 0 && messages[messages.length - 1].sender === 'bot' && messages[messages.length - 1].inputType !== 'text')}
          style={styles.inputBox}
          data-testid="chat-input"
        />
        <button
          type="submit"
          disabled={typing || (messages.length > 0 && messages[messages.length - 1].sender === 'bot' && messages[messages.length - 1].inputType !== 'text')}
          style={styles.primarySendBtn}
          data-testid="chat-send"
        >
          {t('chat_btn_send')}
        </button>
      </form>
    </div>
  );
};

const styles = {
  warningAlert: {
    backgroundColor: '#fff3e0',
    borderTop: '1px solid #ffe0b2',
    color: '#e65100',
    padding: '0.6rem 1.5rem',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  choiceChip: {
    padding: '0.5rem 1.2rem',
    border: '1px solid var(--border-light)',
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-main)',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: 'var(--shadow-sm)'
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.5rem'
  },
  inputBox: {
    flex: 1,
    padding: '0.75rem 1rem',
    border: '1px solid var(--border-light)',
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-main)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.95rem',
    outline: 'none'
  },
  primarySendBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    fontWeight: '700',
    borderRadius: 'var(--radius-sm)'
  },
  summaryWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    width: '100%',
    minWidth: '280px'
  },
  cardVisual: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-light)',
    padding: '1.5rem',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-lg)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    color: 'var(--text-main)'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    borderBottom: '1px solid var(--border-light)',
    paddingBottom: '0.8rem'
  },
  cardPortrait: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    objectFit: 'cover' as const
  },
  headerDetails: {
    display: 'flex',
    flexDirection: 'column' as const
  },
  cardName: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: 'var(--primary-dark)'
  },
  cardSubText: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    fontWeight: '600'
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.8rem',
    fontSize: '0.85rem'
  },
  detailBox: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.2rem'
  },
  detailLabel: {
    fontSize: '0.7rem',
    textTransform: 'uppercase' as const,
    color: 'var(--text-muted)',
    fontWeight: '600'
  },
  detailVal: {
    color: 'var(--text-headers)',
    fontSize: '0.9rem'
  },
  aboutWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.2rem',
    borderTop: '1px solid var(--border-light)',
    paddingTop: '0.6rem'
  },
  aboutVal: {
    fontSize: '0.8rem',
    lineHeight: '1.4',
    color: 'var(--text-muted)'
  },
  cardTags: {
    display: 'flex',
    gap: '0.35rem',
    flexWrap: 'wrap' as const,
    marginTop: '0.2rem'
  },
  miniTag: {
    padding: '0.2rem 0.6rem',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
    fontSize: '0.7rem',
    borderRadius: 'var(--radius-sm)',
    fontWeight: '600'
  },
  cardSubmitBtn: {
    padding: '0.75rem',
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '0.9rem',
    borderRadius: 'var(--radius-sm)',
    width: '100%',
    marginTop: '0.5rem',
    boxShadow: 'var(--shadow-md)'
  },
  chatHeader: {
    padding: '1.2rem 1.6rem',
    backgroundColor: 'var(--primary-dark)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    color: '#ffffff'
  },
  botAvatarIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.3rem',
    border: '1px solid rgba(255, 255, 255, 0.15)'
  },
  activePulseIndicator: {
    position: 'absolute' as const,
    bottom: '2px',
    right: '2px',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#4caf50',
    border: '2px solid var(--primary-dark)',
    boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.4)',
    animation: 'pulseDot 2s infinite ease-in-out'
  },
  chatHeaderTitle: {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: '1.2'
  },
  chatHeaderSubtitle: {
    fontSize: '0.75rem',
    color: 'hsl(var(--magenta-200))',
    fontWeight: '500'
  },
  uploadArea: {
    border: '2px dashed var(--border-light)',
    borderRadius: 'var(--radius-md)',
    padding: '2rem',
    textAlign: 'center' as const,
    backgroundColor: 'var(--bg-app)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '0.4rem',
    width: '100%',
    boxSizing: 'border-box' as const
  },
  uploadLabel: {
    cursor: 'pointer',
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center'
  },
  skipUploadBtn: {
    padding: '0.65rem 1.2rem',
    backgroundColor: 'transparent',
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    fontWeight: '600',
    textAlign: 'center' as const,
    border: '1px dashed var(--border-light)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: '100%'
  }
};
