import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BiodataService } from '../api/biodata.service';
import { AuthService } from '../api/auth.service';
import { apiClient } from '../api/apiClient';
import { UploadService } from '../api/upload.service';
import type { Biodata } from '../types';
import { 
  type BiodataData, 
  BiodataTemplate,
  templateThemes
} from './BiodataMaker/BiodataTemplates';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  inputType?: 'text' | 'select' | 'tags' | 'file' | 'summary' | 'template';
  options?: string[];
}

interface RegistrationChatProps {
  mode?: 'registration' | 'biodata';
  onComplete: () => void;
  onDownloadBiodata?: (template: string, data: any) => void;
}

export const RegistrationChat = ({ mode = 'registration', onComplete, onDownloadBiodata }: RegistrationChatProps) => {
  const { t, locale } = useLanguage();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const welcomeTriggered = useRef(false);

  // Core Chat States
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [typing, setTyping] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Biodata Mode specific states
  const [email, setEmail] = useState('');
  const [template, setTemplate] = useState('TemplateClassic');

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
    dateOfBirth: '1999-01-01',
    height: '5\' 6"',
    maritalStatus: 'Never Married',
    complexion: 'Fair',
    religion: 'Hindu',
    caste: 'Brahmin (Maithil)',
    gotra: 'Kashyap',
    mool: '',
    diet: 'Vegetarian',
    profession: 'Software Engineer',
    annualIncome: 1200000,
    location: 'Darbhanga',
    education: 'B.Tech',
    interests: [],
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400',
    aboutMe: '',
    phoneNumber: '',
    fatherName: '',
    motherName: '',
    grandparentName: '',
    siblingsDetail: '',
    birthPlace: ''
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
      } else if (msg.text.includes(t('bot_phone').substring(0, 10))) {
        text = t('bot_phone', { name: biodataForm.fullName });
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
  const handleUserSubmit = async (e?: React.FormEvent, directValue?: string) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    
    const valueToProcess = directValue !== undefined ? directValue : inputValue.trim();
    if (!valueToProcess && currentStep !== 22) { // Hobbies selection done via button
      setErrorMsg(t('chat_error_empty'));
      return;
    }

    // 1. Add user reply to conversation log
    setMessages(prev => [...prev, {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text: currentStep === 22 ? tempInterests.join(', ') : valueToProcess,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    setInputValue('');

    // 2. State Machine Dialog Processor
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);

    // Bot Response Logic based on Next Step
    const isSkip = valueToProcess.toLowerCase() === 'skip';
    const finalValue = isSkip ? 'Not Specified' : valueToProcess;

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

      // === SECTION 1: PERSONAL DETAILS ===
      case 0: // Name entered -> Ask Phone
        setBiodataForm(prev => ({ ...prev, fullName: valueToProcess }));
        triggerBotResponse(t('bot_phone', { name: valueToProcess }), 'text');
        break;

      case 1: // Phone entered -> Ask Gender
        if (!/^\+?[0-9\s-]{10,15}$/.test(valueToProcess)) {
          setErrorMsg(locale === 'en' ? 'Please enter a valid phone number.' : 'कृपया एक वैध फ़ोन नंबर दर्ज करें।');
          setCurrentStep(1);
          setMessages(prev => prev.slice(0, -1));
          return;
        }
        setBiodataForm(prev => ({ ...prev, phoneNumber: valueToProcess }));
        const defaultPhoto = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400';
        setBiodataForm(prev => ({ ...prev, photoUrl: defaultPhoto }));
        triggerBotResponse(t('bot_gender', { name: biodataForm.fullName || valueToProcess }), 'select', ['Female', 'Male']);
        break;

      case 2: // Gender selected -> Ask DOB
        setBiodataForm(prev => ({ 
          ...prev, 
          gender: valueToProcess as 'Male' | 'Female',
          photoUrl: valueToProcess === 'Female'
            ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400'
            : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400&h=400'
        }));
        triggerBotResponse(t('bot_age'), 'text');
        break;

      case 3: // DOB entered -> Ask Height
        if (!valueToProcess || valueToProcess.trim() === '') {
          setErrorMsg(t('chat_error_age'));
          setCurrentStep(3);
          setMessages(prev => prev.slice(0, -1));
          return;
        }
        setBiodataForm(prev => ({ ...prev, dateOfBirth: valueToProcess.trim() }));
        triggerBotResponse(t('bot_height'), 'select', ["5' 0\"", "5' 2\"", "5' 4\"", "5' 6\"", "5' 8\"", "5' 10\"", "6' 0\"+"]);
        break;

      case 4: // Height entered -> Ask Marital Status
        setBiodataForm(prev => ({ ...prev, height: valueToProcess }));
        triggerBotResponse(t('bot_marital'), 'select', ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce']);
        break;

      case 5: // Marital Status entered -> Ask Complexion
        setBiodataForm(prev => ({ ...prev, maritalStatus: valueToProcess }));
        triggerBotResponse(t('bot_complexion'), 'select', ['Very Fair', 'Fair', 'Wheatish', 'Dark']);
        break;

      case 6: // Complexion entered -> Ask Religion
        setBiodataForm(prev => ({ ...prev, complexion: valueToProcess }));
        triggerBotResponse(t('bot_religion'), 'select', [...optionsReligion]);
        break;

      case 7: // Religion entered -> Ask Caste
        setBiodataForm(prev => ({ ...prev, religion: finalValue }));
        triggerBotResponse(t('bot_caste'), 'select', [...optionsCaste]);
        break;

      case 8: // Caste selected -> Ask Gotra
        setBiodataForm(prev => ({ ...prev, caste: finalValue }));
        triggerBotResponse(t('bot_gotra'), 'select', [...optionsGotra]);
        break;

      case 9: // Gotra selected -> Ask Mool
        setBiodataForm(prev => ({ ...prev, gotra: finalValue }));
        triggerBotResponse(locale === 'en' ? 'What is your Mool?' : 'आपका मूल क्या है?', 'text');
        break;

      case 10: // Mool entered -> Ask Diet
        setBiodataForm(prev => ({ ...prev, mool: finalValue }));
        triggerBotResponse(t('bot_diet'), 'select', ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan']);
        break;

      case 11: // Diet entered -> Ask Birth Place
        setBiodataForm(prev => ({ ...prev, diet: finalValue }));
        triggerBotResponse(locale === 'en' ? 'Where were you born? (Birth Place)' : 'आपका जन्म स्थान क्या है?', 'text');
        break;

      // === SECTION 2: EDUCATIONAL & PROFESSIONAL DETAILS ===
      case 12: // Birth Place entered -> Section Banner + Education
        setBiodataForm(prev => ({ ...prev, birthPlace: finalValue }));
        setMessages(prev => [...prev, {
          id: 'banner-sec2',
          sender: 'bot',
          text: locale === 'en' ? '— 🎓 Section 2 of 5: Education & Profession —' : '— 🎓 भाग 2/5: शिक्षा और पेशा —',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        triggerBotResponse(t('bot_education'), 'text');
        break;

      case 13: // Education entered -> Ask Profession
        setBiodataForm(prev => ({ ...prev, education: finalValue }));
        triggerBotResponse(t('bot_profession'), 'select', optionsProfession);
        break;

      case 14: // Profession entered -> Ask Income
        setBiodataForm(prev => ({ ...prev, profession: finalValue }));
        triggerBotResponse(t('bot_income'), 'text');
        break;

      // === SECTION 3: FAMILY DETAILS ===
      case 15: { // Income entered -> Section Banner + Father's Name
        if (!isSkip) {
          const incomeNum = parseInt(valueToProcess);
          if (isNaN(incomeNum) || incomeNum <= 0) {
            setErrorMsg(t('chat_error_income'));
            setCurrentStep(15);
            setMessages(prev => prev.slice(0, -1));
            return;
          }
          setBiodataForm(prev => ({ ...prev, annualIncome: incomeNum }));
        }
        
        setMessages(prev => [...prev, {
          id: 'banner-sec3',
          sender: 'bot',
          text: locale === 'en' ? '— 👨‍👩‍👧‍👦 Section 3 of 5: Family Details —' : '— 👨‍👩‍👧‍👦 भाग 3/5: परिवार का विवरण —',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        triggerBotResponse(locale === 'en' ? 'What is your Father\'s Name?' : 'आपके पिता का क्या नाम है?', 'text');
        break;
      }

      case 16: // Father's Name -> Mother's Name
        setBiodataForm(prev => ({ ...prev, fatherName: finalValue }));
        triggerBotResponse(locale === 'en' ? 'What is your Mother\'s Name?' : 'आपकी माता का क्या नाम है?', 'text');
        break;

      case 17: // Mother's Name -> Grandparent's Name
        setBiodataForm(prev => ({ ...prev, motherName: finalValue }));
        triggerBotResponse(locale === 'en' ? 'What is your Grandparent\'s Name?' : 'आपके दादा/दादी का क्या नाम है?', 'text');
        break;

      case 18: // Grandparent's Name -> Siblings Details
        setBiodataForm(prev => ({ ...prev, grandparentName: finalValue }));
        triggerBotResponse(locale === 'en' ? 'Any details about your siblings? (e.g. 1 Brother, 1 Sister)' : 'आपके भाई-बहनों के बारे में कोई विवरण? (उदा. 1 भाई, 1 बहन)', 'text');
        break;

      // === SECTION 4: ADDRESS DETAILS ===
      case 19: // Siblings Details -> Section Banner + Current City
        setBiodataForm(prev => ({ ...prev, siblingsDetail: finalValue }));
        setMessages(prev => [...prev, {
          id: 'banner-sec4',
          sender: 'bot',
          text: locale === 'en' ? '— 🏠 Section 4 of 5: Address Details —' : '— 🏠 भाग 4/5: पते का विवरण —',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        triggerBotResponse(t('bot_city'), 'select', optionsCity);
        break;

      case 20: // Current City -> Street Address
        setBiodataForm(prev => ({ ...prev, location: finalValue }));
        triggerBotResponse(locale === 'en' ? 'What is your street address or neighborhood?' : 'आपका गली का पता या मोहल्ला क्या है?', 'text');
        break;

      // === SECTION 5: ADDITIONAL INFO & CONTACT ===
      case 21: // Street Address -> Section Banner + Interests
        setBiodataForm(prev => ({ ...prev, streetAddress: finalValue } as any));
        setMessages(prev => [...prev, {
          id: 'banner-sec5',
          sender: 'bot',
          text: locale === 'en' ? '— 🌟 Section 5 of 5: Additional Info —' : '— 🌟 भाग 5/5: अतिरिक्त जानकारी —',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        triggerBotResponse(t('bot_interests'), 'tags', ['Madhubani Painting', 'Classical Music', 'Cooking', 'Reading', 'Travel', 'Gardening', 'Yoga']);
        break;

      case 22: // Hobbies selected -> Ask Bio
        setBiodataForm(prev => ({ ...prev, interests: tempInterests }));
        triggerBotResponse(t('bot_bio'), 'text');
        break;

      case 23: // Bio entered -> Ask Photo Upload
        setBiodataForm(prev => ({ ...prev, aboutMe: finalValue }));
        triggerBotResponse(t('bot_photo'), 'file');
        break;

      case 24: // Photo Uploaded -> Summary Review
        if (valueToProcess && valueToProcess !== 'skip') {
          setBiodataForm(prev => ({ ...prev, photoUrl: valueToProcess }));
        }
        triggerBotResponse(t('bot_summary'), 'summary');
        break;

      case 25: // (Was 20) Email entered in Biodata Mode
        if (!/^\S+@\S+\.\S+$/.test(valueToProcess)) {
          setErrorMsg(locale === 'en' ? 'Please enter a valid email.' : 'कृपया एक वैध ईमेल दर्ज करें।');
          setCurrentStep(25);
          setMessages(prev => prev.slice(0, -1));
          return;
        }
        setEmail(valueToProcess);
        setTyping(true);
        try {
          setEmail(valueToProcess);
          await AuthService.requestOtp({ email: valueToProcess });
          setTyping(false);
          triggerBotResponse(locale === 'en' ? 'OTP sent! Please enter the 6-digit code.' : 'OTP भेजा गया! कृपया 6-अंकीय कोड दर्ज करें।', 'text');
        } catch (err) {
          setTyping(false);
          setErrorMsg(locale === 'en' ? 'Failed to send OTP. Try again.' : 'OTP भेजने में विफल। पुनः प्रयास करें।');
          setCurrentStep(25);
          setMessages(prev => prev.slice(0, -1));
        }
        break;

      case 26: // (Was 21) OTP entered in Biodata Mode
        if (valueToProcess.length !== 6) {
          setErrorMsg(locale === 'en' ? 'OTP must be 6 digits.' : 'OTP 6 अंकों का होना चाहिए।');
          setCurrentStep(26);
          setMessages(prev => prev.slice(0, -1));
          return;
        }
        setTyping(true);
        try {
          await AuthService.verifyOtp({ email, otp: valueToProcess });
          setTyping(false);
        } catch (err) {
          setTyping(false);
          setErrorMsg(locale === 'en' ? 'Invalid OTP. Please try again.' : 'अमान्य OTP। कृपया पुनः प्रयास करें।');
          setCurrentStep(26);
          setMessages(prev => prev.slice(0, -1));
          return; // Stop here if OTP fails
        }

        // OTP succeeded, now save profile
        setTyping(true);
        try {
          // Save the profile and trigger download/matches immediately!
          await handleFinalRegister(true); 
          setTyping(false);
          if (onDownloadBiodata) {
            onDownloadBiodata(template, biodataForm);
          }
          triggerBotResponse(locale === 'en' ? 'Profile saved and Biodata downloading! Taking you to matches...' : 'प्रोफ़ाइल सहेजी गई और बायोडेटा डाउनलोड हो रहा है! आपको मैचों पर ले जा रहे हैं...', 'text');
          setTimeout(() => {
            onComplete();
          }, 1500);
        } catch (err) {
          setTyping(false);
          // handleFinalRegister already sets its own error message, but we need to stay on this step
          setCurrentStep(26);
          setMessages(prev => prev.slice(0, -1));
        }
        break;
      case 27: // Template selection action handled by buttons
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

  const handleConfirmSummary = () => {
    if (mode === 'biodata') {
      setCurrentStep(27); // Template selection step is now 27
      triggerBotResponse(locale === 'en' ? 'Awesome! Now, choose a premium design for your Biodata.' : 'बहुत बढ़िया! अब, अपने बायोडेटा के लिए एक प्रीमियम डिज़ाइन चुनें।', 'template');
    } else {
      handleFinalRegister();
    }
  };

  // Save profile and trigger complete redirection callback
  const handleFinalRegister = async (isBiodataBackgroundSave = false) => {
    try {
      const primary = uploadedPhotos[0] || biodataForm.photoUrl;
      const additional = uploadedPhotos.slice(1);
      
      let calculatedAge = undefined;
      if (biodataForm.dateOfBirth) {
        const dobDate = new Date(biodataForm.dateOfBirth);
        if (!isNaN(dobDate.getTime())) {
          const ageDiffMs = Date.now() - dobDate.getTime();
          const ageDate = new Date(ageDiffMs);
          calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
        }
      }

      const payload = {
        ...biodataForm,
        age: calculatedAge,
        photoUrl: primary,
        additionalPhotos: additional,
        addresses: [{ 
          addressType: 'CURRENT', 
          city: biodataForm.location, 
          state: 'N/A', 
          country: 'India',
          streetAddress: (biodataForm as any).streetAddress || ''
        }]
      };
      await BiodataService.updateMine(payload as any);
      await BiodataService.complete();
      if (!isBiodataBackgroundSave) {
        onComplete();
      }
    } catch (e) {
      setErrorMsg('Failed to complete registration. Please try again.');
      throw e; // Throw so that step 19 catch block catches it!
    }
  };

  return (
    <div className="chat-container">
      {/* Bot Chat stream scroller */}
      <div className="chat-scroller">
        {messages.map((msg) => {
          if (msg.inputType === 'template') {
            const mappedData: BiodataData = {
              fullName: biodataForm.fullName,
              gender: biodataForm.gender,
              dob: biodataForm.dateOfBirth || '1999-01-01',
              birthPlace: biodataForm.birthPlace || '',
              height: biodataForm.height || '',
              complexion: biodataForm.complexion || '',
              education: biodataForm.education,
              profession: biodataForm.profession,
              income: biodataForm.annualIncome ? biodataForm.annualIncome.toString() : '',
              gotra: biodataForm.gotra,
              mool: (biodataForm as any).mool || '',
              grandparentName: biodataForm.grandparentName || '',
              fatherName: biodataForm.fatherName || '',
              motherName: biodataForm.motherName || '',
              siblingsDetail: biodataForm.siblingsDetail || '',
              ruralAddress: { streetAddress: '', city: biodataForm.location || '', state: '', pincode: '' },
              urbanAddress: { streetAddress: (biodataForm as any).streetAddress || '', city: biodataForm.location || '', state: '', pincode: '' },
              photoUrl: biodataForm.photoUrl || ''
            };

            return (
              <div key={msg.id} style={{ width: '100%', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '1.2rem', marginBottom: '1.5rem', textAlign: 'center' }}>{msg.text}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', width: '100%', maxWidth: '1000px' }}>
                  {templateThemes.map(theme => (
                    <button
                      key={theme.name}
                      onClick={() => setTemplate(theme.name)}
                      style={{
                        padding: '0.75rem',
                        border: template === theme.name ? '3px solid var(--primary)' : '3px solid transparent',
                        borderRadius: '12px',
                        backgroundColor: 'var(--bg-card)',
                        cursor: 'pointer',
                        fontWeight: '700',
                        color: template === theme.name ? 'var(--primary)' : 'var(--text-main)',
                        boxShadow: template === theme.name ? '0 10px 25px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.08)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem',
                        transform: template === theme.name ? 'translateY(-4px)' : 'none'
                      }}
                    >
                      <div style={{ width: '226px', height: '319px', overflow: 'hidden', position: 'relative', borderRadius: '6px', backgroundColor: '#fff', border: '1px solid var(--border-light)', margin: '0 auto' }}>
                        <div style={{ transform: 'scale(0.284)', transformOrigin: 'top left', width: '794px', height: '1123px', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                          <BiodataTemplate data={mappedData} theme={theme} />
                        </div>
                      </div>
                      <span style={{ fontSize: '1rem' }}>{theme.name}</span>
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', marginTop: '2rem', width: '100%', maxWidth: '400px' }}>
                  <button
                    onClick={() => {
                      setCurrentStep(25);
                      triggerBotResponse(locale === 'en' ? 'Great choice! Please provide your email to save and download your Biodata.' : 'बढ़िया विकल्प! अपना बायोडेटा सहेजने और डाउनलोड करने के लिए कृपया अपना ईमेल प्रदान करें।', 'text');
                    }}
                    style={{
                      flex: 1,
                      padding: '1.2rem',
                      backgroundColor: 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: '700',
                      fontSize: '1.1rem',
                      cursor: 'pointer',
                      boxShadow: '0 8px 20px rgba(226, 62, 87, 0.3)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(226, 62, 87, 0.4)' }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(226, 62, 87, 0.3)' }}
                  >
                    {locale === 'en' ? 'Confirm Template & Proceed' : 'टेम्पलेट की पुष्टि करें और आगे बढ़ें'}
                  </button>
                </div>
              </div>
            );
          }

          if (currentStep === 26 && msg.id === messages[messages.length - 1].id) {
            return (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <div className={msg.sender === 'bot' ? 'chat-bubble-bot' : 'chat-bubble-user'} style={{ position: 'relative' }}>
                  {msg.text}
                </div>
                <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem', alignSelf: 'flex-start', flexWrap: 'wrap' }}>
                  <button
                    onClick={async () => {
                      setTyping(true);
                      try {
                        await AuthService.requestOtp({ email });
                        setTyping(false);
                        triggerBotResponse(locale === 'en' ? 'OTP resent! Please check your email.' : 'OTP फिर से भेज दिया गया! कृपया अपना ईमेल जांचें।', 'text');
                      } catch (e) {
                        setTyping(false);
                        setErrorMsg(locale === 'en' ? 'Failed to resend OTP.' : 'OTP दोबारा भेजने में विफल।');
                      }
                    }}
                    style={{
                      ...styles.choiceChip,
                      backgroundColor: 'transparent',
                      color: 'var(--primary)',
                      border: '1px solid var(--primary)',
                    }}
                  >
                    {locale === 'en' ? 'Resend OTP' : 'OTP पुनः भेजें'}
                  </button>
                  <button
                    onClick={() => {
                      setCurrentStep(25);
                      triggerBotResponse(locale === 'en' ? 'Please provide your new email address.' : 'कृपया अपना नया ईमेल पता प्रदान करें।', 'text');
                    }}
                    style={{
                      ...styles.choiceChip,
                      backgroundColor: 'transparent',
                      color: 'var(--text-main)',
                    }}
                  >
                    {locale === 'en' ? 'Change Email' : 'ईमेल बदलें'}
                  </button>
                </div>
              </div>
            );
          }

          return (
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
                      <p style={styles.cardSubText}>{biodataForm.dateOfBirth ? Math.floor((Date.now() - new Date(biodataForm.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25)) : 24} Yrs • {biodataForm.gender}</p>
                    </div>
                  </div>
                  
                  <div style={styles.detailsGrid}>
                          <div style={styles.detailBox}>
                            <span style={styles.detailLabel}>{locale === 'en' ? 'Age & Height' : 'उम्र और लंबाई'}</span>
                            <span style={styles.detailVal}>{biodataForm.dateOfBirth ? Math.floor((Date.now() - new Date(biodataForm.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25)) : 24} {locale === 'en' ? 'Yrs' : 'वर्ष'} • {biodataForm.height}</span>
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
                  
                  <button onClick={handleConfirmSummary} style={styles.cardSubmitBtn}>
                    {t('btn_confirm_submit')}
                  </button>
                </div>
              </div>
            ) : (msg.text.startsWith('data:image/') || msg.text.startsWith('http')) && msg.sender === 'user' && currentStep > 16 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>📷 {locale === 'en' ? 'Uploaded Profile Photo:' : 'प्रोफ़ाइल फ़ोटो अपलोड की गई:'}</span>
                <img 
                  src={msg.text} 
                  alt="Uploaded Portrait" 
                  style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '2px solid #ffffff', boxShadow: 'var(--shadow-md)' }} 
                />
              </div>
            ) : msg.text === 'skip' || msg.text.toLowerCase() === 'skip' ? (
              <span>⏩ {locale === 'en' ? 'Skipped' : 'छोड़ दिया गया'}</span>
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
        );
      })}

        {/* Simulated Bot Typing State indicator */}
        {typing && (
          <div className="chat-bubble-bot">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        )}
        

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
            <div className="chat-choices-panel animate-fade" style={{ flexDirection: 'column', gap: '0.8rem', alignItems: 'stretch' }}>
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

        <div ref={chatEndRef} />
      </div>

      {/* Chat bottom input text prompt panel */}
      <form onSubmit={handleUserSubmit} className="chat-input-bar">
        {(() => {
          const type = currentStep === -1 ? 'password' : (currentStep === 15 ? 'number' : currentStep === 1 ? 'tel' : currentStep === 3 ? 'date' : 'text');
          const placeholderText = typing
            ? (locale === 'en' ? 'Maithil Assistant typing...' : 'मैथिल सहायक टाइप कर रहा है...')
            : messages.length > 0 && messages[messages.length - 1].sender === 'bot' && messages[messages.length - 1].inputType !== 'text'
              ? (locale === 'en' ? 'Select an option...' : 'कृपया ऊपर एक विकल्प चुनें...')
              : currentStep === -1 ? '••••••••' : t('chat_placeholder');
          const isDisabled = typing || (messages.length > 0 && messages[messages.length - 1].sender === 'bot' && messages[messages.length - 1].inputType !== 'text');
          
          if (type === 'text') {
            return (
              <textarea
                rows={1}
                placeholder={placeholderText}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!isDisabled) {
                      handleUserSubmit(e as any);
                    }
                  }
                }}
                disabled={isDisabled}
                style={{ ...styles.inputBox, minWidth: 0, resize: 'none', overflowY: 'auto', maxHeight: '120px' }}
                data-testid="chat-input"
              />
            );
          } else {
            return (
              <input
                type={type}
                placeholder={placeholderText}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isDisabled}
                style={{ ...styles.inputBox, minWidth: 0, textOverflow: 'ellipsis' }}
                data-testid="chat-input"
              />
            );
          }
        })()}
        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end', width: '100%', alignItems: 'center' }}>
          {/* Skip Button */}
          {(() => {
             const skippableSteps = [9, 10, 11, 13, 14, 15, 16, 17, 18, 20, 21, 23];
             if (skippableSteps.includes(currentStep) && !typing && (messages.length > 0 && messages[messages.length - 1].sender === 'bot' && messages[messages.length - 1].inputType === 'text')) {
                return (
                  <button
                    type="button"
                    onClick={() => handleUserSubmit(undefined, 'Skip')}
                    style={{
                      backgroundColor: 'var(--bg-app)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.55rem 1.4rem', 
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap', 
                      alignSelf: 'center',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {locale === 'en' ? 'Skip Step' : 'छोड़ें'}
                  </button>
                );
             }
             return null;
          })()}
          <button
            type="submit"
            disabled={typing || (messages.length > 0 && messages[messages.length - 1].sender === 'bot' && messages[messages.length - 1].inputType !== 'text')}
            style={styles.primarySendBtn}
            data-testid="chat-send"
          >
            {t('chat_btn_send')}
          </button>
        </div>
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
    padding: '0.4rem 0.6rem',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--text-main)',
    fontSize: '1.05rem',
    outline: 'none',
    boxShadow: 'none',
    transition: 'var(--transition-fast)',
    width: '100%'
  },
  primarySendBtn: {
    padding: '0.55rem 1.6rem',
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    fontWeight: '700',
    borderRadius: 'var(--radius-full)',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(216, 27, 96, 0.25)',
    transition: 'transform 0.2s, box-shadow 0.2s'
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
    marginBottom: '2.5rem',
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
