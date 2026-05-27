import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { mockSubmitBiodata } from '../mock/mockDb';
import type { Biodata } from '../types';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  inputType?: 'text' | 'select' | 'tags' | 'summary';
  options?: string[];
}

interface RegistrationChatProps {
  onComplete: () => void;
}

export const RegistrationChat = ({ onComplete }: RegistrationChatProps) => {
  const { t, locale } = useLanguage();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Core Chat States
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [typing, setTyping] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Biodata Form Accumulator State
  const [biodataForm, setBiodataForm] = useState<Omit<Biodata, 'biodataId' | 'userId'>>({
    fullName: '',
    gender: 'Female',
    age: 24,
    gotra: 'Kashyap',
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

  // Auto Scroll to Bottom on message updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // Initial welcome message from bot
  useEffect(() => {
    triggerBotResponse(t('bot_welcome'), 'text');
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
      } else if (msg.text.includes(t('bot_gender').substring(0, 10)) || msg.inputType === 'select') {
        text = t('bot_gender', { name: biodataForm.fullName });
      } else if (msg.text.includes(t('bot_age').substring(0, 10))) {
        text = t('bot_age');
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
    if (!valueToProcess && currentStep !== 8) { // Hobbies selection done via button
      setErrorMsg(t('chat_error_empty'));
      return;
    }

    // 1. Add user reply to conversation log
    setMessages(prev => [...prev, {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text: currentStep === 8 ? tempInterests.join(', ') : valueToProcess,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    setInputValue('');

    // 2. State Machine Dialog Processor
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);

    // Bot Response Logic based on Next Step
    switch (currentStep) {
      case 0: // Name entered -> Ask Gender
        setBiodataForm(prev => ({ ...prev, fullName: valueToProcess }));
        // Photo changes dynamically based on gender
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

      case 2: // Age entered -> Validation check -> Ask Gotra
        const ageNum = parseInt(valueToProcess);
        if (isNaN(ageNum) || ageNum < 18 || ageNum > 70) {
          setErrorMsg(t('chat_error_age'));
          // Rollback step
          setCurrentStep(2);
          setMessages(prev => prev.slice(0, -1)); // Remove the incorrect message from log
          return;
        }
        setBiodataForm(prev => ({ ...prev, age: ageNum }));
        triggerBotResponse(t('bot_gotra'), 'select', ['Kashyap', 'Shandilya', 'Vatsa', 'Bhardwaj', 'Parashar', 'Katyayan']);
        break;

      case 3: // Gotra selected -> Ask City
        setBiodataForm(prev => ({ ...prev, gotra: valueToProcess }));
        triggerBotResponse(t('bot_city'), 'text');
        break;

      case 4: // City entered -> Ask Education
        setBiodataForm(prev => ({ ...prev, location: valueToProcess }));
        triggerBotResponse(t('bot_education'), 'text');
        break;

      case 5: // Education entered -> Ask Profession
        setBiodataForm(prev => ({ ...prev, education: valueToProcess }));
        triggerBotResponse(t('bot_profession'), 'text');
        break;

      case 6: // Profession entered -> Ask Income
        setBiodataForm(prev => ({ ...prev, profession: valueToProcess }));
        triggerBotResponse(t('bot_income'), 'text');
        break;

      case 7: // Income entered -> Validation check -> Ask Hobbies
        const incomeNum = parseInt(valueToProcess);
        if (isNaN(incomeNum) || incomeNum <= 0) {
          setErrorMsg(t('chat_error_income'));
          setCurrentStep(7);
          setMessages(prev => prev.slice(0, -1));
          return;
        }
        setBiodataForm(prev => ({ ...prev, annualIncome: incomeNum }));
        triggerBotResponse(t('bot_interests'), 'tags', ['Madhubani Painting', 'Classical Music', 'Cooking', 'Reading', 'Travel', 'Gardening', 'Yoga']);
        break;

      case 8: // Hobbies selected -> Ask Bio
        setBiodataForm(prev => ({ ...prev, interests: tempInterests }));
        triggerBotResponse(t('bot_bio'), 'text');
        break;

      case 9: // Bio entered -> Generate Final Summary Review Card!
        setBiodataForm(prev => ({ ...prev, aboutMe: valueToProcess }));
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

  // Save profile and trigger complete redirection callback
  const handleFinalRegister = () => {
    const res = mockSubmitBiodata(biodataForm);
    if (res.success) {
      onComplete();
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
                      <span style={styles.detailLabel}>{t('summary_gotra')}</span>
                      <strong style={styles.detailVal}>{biodataForm.gotra}</strong>
                    </div>
                    <div style={styles.detailBox}>
                      <span style={styles.detailLabel}>{t('summary_location')}</span>
                      <strong style={styles.detailVal}>{biodataForm.location}</strong>
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
              >
                Done Selecting ({tempInterests.length})
              </button>
            </div>
          )}
        </>
      )}

      {/* Chat bottom input text prompt panel */}
      {currentStep !== 10 && currentStep !== 8 && currentStep !== 1 && currentStep !== 3 && (
        <form onSubmit={handleUserSubmit} className="chat-input-bar">
          <input
            type={currentStep === 2 || currentStep === 7 ? 'number' : 'text'}
            placeholder={t('chat_placeholder')}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={typing}
            style={styles.inputBox}
          />
          <button type="submit" disabled={typing} style={styles.primarySendBtn}>
            {t('chat_btn_send')}
          </button>
        </form>
      )}
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
  }
};
