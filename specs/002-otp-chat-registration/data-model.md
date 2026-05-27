# Data & State Models: Conversational Registration (Phase Two)

This document outlines the state models, localized dictionary keys, and styling parameters for the conversational onboarding system.

---

## 1. Chat Message Schema

Represents a single bubble inside the conversational onboarding chat interface.

```typescript
interface ChatMessage {
  id: string;              // UUID v4 format
  sender: 'bot' | 'user';  // Message origin
  text: string;            // Text text
  timestamp: string;       // ISO-8601 Timestamp
  inputType?: 'text' | 'select' | 'tags' | 'summary'; // Prompt input control type
  options?: string[];      // Dropdown/Quick-choice items
}
```

---

## 2. Localization Keys (Translations Database)

Unified schema for our bilingual English-Hindi translation dictionary:

```typescript
interface TranslationItem {
  en: string;
  hi: string;
}

const TRANSLATIONS: Record<string, TranslationItem> = {
  // Navigation & General
  brand_title: { en: "Mithila Matrimony", hi: "मिथिला मैट्रिमोनी" },
  logout: { en: "Log Out", hi: "लॉग आउट" },
  signin: { en: "Register / Sign In", hi: "रजिस्टर / साइन इन" },
  
  // OTP Verification view
  auth_title: { en: "Sign In / SignUp", hi: "साइन इन / पंजीकरण" },
  auth_subtitle: { en: "Enter your mobile number to receive a simulated verification OTP", hi: "सिम्युलेटेड सत्यापन ओटीपी प्राप्त करने के लिए अपना मोबाइल नंबर दर्ज करें" },
  label_phone: { en: "Mobile Number (E.164 format)", hi: "मोबाइल नंबर" },
  label_otp: { en: "Enter 6-Digit OTP Code", hi: "6-अंकों का ओटीपी दर्ज करें" },
  btn_request_otp: { en: "Request Verification OTP", hi: "ओटीपी का अनुरोध करें" },
  btn_verify_otp: { en: "Verify & Authenticate", hi: "सत्यापित करें" },
  
  // Chat Bot Conversations
  bot_welcome: { en: "Welcome to Mithila Matrimony! Namaste. Let's build your biodata. First, what is your full name?", hi: "मिथिला मैट्रिमोनी में आपका स्वागत है! नमस्ते। चलिए आपका बायोडाटा बनाते हैं। सबसे पहले, आपका पूरा नाम क्या है?" },
  bot_gender: { en: "Pleasure to meet you, {name}! Please select your gender.", hi: "आपसे मिलकर खुशी हुई, {name}! कृपया अपना लिंग चुनें।" },
  bot_age: { en: "Thank you. Now, what is your age?", hi: "धन्यवाद। अब, आपकी उम्र क्या है?" },
  bot_gotra: { en: "Great! Select your cultural Gotra.", hi: "बहुत बढ़िया! अपने गोत्र का चयन करें।" },
  bot_city: { en: "Which city are you currently residing in?", hi: "आप वर्तमान में किस शहर में रह रहे हैं?" },
  bot_education: { en: "Excellent. What is your highest educational degree?", hi: "उत्कृष्ट। आपकी उच्चतम शैक्षणिक डिग्री क्या है?" },
  bot_profession: { en: "What is your current occupation/profession?", hi: "आपका वर्तमान पेशा / व्यवसाय क्या है?" },
  bot_income: { en: "Got it. What is your annual income (INR)?", hi: "समझ गए। आपकी वार्षिक आय (INR) क्या है?" },
  bot_interests: { en: "Almost done! Select some of your interests and hobbies.", hi: "बस खत्म होने वाला है! अपनी रुचियों और शौक का चयन करें।" },
  bot_bio: { en: "Lastly, write a brief 'About Me' statement to describe yourself.", hi: "अंत में, अपने बारे में संक्षेप में कुछ लिखें।" },
  bot_summary: { en: "Fantastic! I have compiled your complete Mithila Biodata. Please review the summary card below.", hi: "शानदार! मैंने आपका पूरा मिथिला बायोडाटा संकलित कर लिया है। कृपया नीचे दिए गए सारांश कार्ड की समीक्षा करें।" },
  
  // Summary & Confirm buttons
  btn_confirm: { en: "Confirm & Register Profile", hi: "पुष्टि करें और प्रोफाइल दर्ज करें" }
};
```

---

## 3. CSS Dark Mode Token Mappings

CSS variables overridden under the `[data-theme="dark"]` selector block inside `/src/styles/index.css`:

```css
[data-theme="dark"] {
  /* Surface Overrides */
  --bg-app: hsl(224 71% 4%);       /* Premium Deep Dark Slate */
  --bg-card: hsl(220 16% 12%);      /* Charcoal surface */
  --bg-glass: rgba(18, 18, 24, 0.7); /* Translucent dark mode glass */
  --border-glass: rgba(255, 255, 255, 0.08);
  --border-light: hsl(220 16% 20%);
  
  /* Text Overrides */
  --neutral-50: 224 71% 4%;
  --neutral-100: 220 16% 15%;
  --neutral-200: 220 16% 22%;
  --neutral-300: 220 12% 35%;
  --neutral-400: 220 10% 55%;
  --neutral-500: 220 8% 65%;
  --neutral-600: 220 8% 75%;
  --neutral-700: 220 8% 90%;       /* Off-white body text */
  
  /* Brand Adjustments (Vibrant high contrast) */
  --primary-light: rgba(216, 27, 96, 0.15);
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
}
```
