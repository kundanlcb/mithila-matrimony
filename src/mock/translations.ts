/* 
 * Mithila Matrimony - Central Translations Database
 * Supports English (en) and Hindi (hi) localizations
 */

export interface TranslationItem {
  en: string;
  hi: string;
}

export const TRANSLATIONS: Record<string, TranslationItem> = {
  // General Navigation & Brand
  brand_serif: { en: "Mithila", hi: "मिथिला" },
  brand_sans: { en: "Matrimony", hi: "पंजीकरण" },
  btn_logout: { en: "Log Out", hi: "लॉग आउट" },
  btn_auth: { en: "Register / Sign In", hi: "रजिस्टर / साइन इन" },
  namaste: { en: "Namaste", hi: "नमस्ते" },

  // Hero / Landing view
  hero_title_prefix: { en: "Discover Soulmates Embedded in ", hi: "अपनी संस्कृति और जड़ों से जुड़े " },
  hero_title_accent: { en: "Maithil Heritage", hi: "मैथिल जीवनसाथी खोजें" },
  hero_subtitle: { en: "An elegant, minimalist portal crafted with vibrant magenta design lines. Simulates OTP-based authentication, custom conversational biodata setup, gotra rules, and high-fidelity compatibility calculations.", hi: "जीवंत मैजेंटा डिजाइन लाइनों के साथ तैयार किया गया एक सुरुचिपूर्ण, न्यूनतम पोर्टल। यह सिम्युलेटेड ओटीपी सत्यापन, संवादात्मक चैट बायोडाटा सेटअप, गोत्र मिलान और उच्च-सटीकता संगतता गणना प्रदान करता है।" },
  btn_begin_search: { en: "Begin Free Search", hi: "खोज शुरू करें" },
  btn_explore_mocks: { en: "Explore Mock Profiles", hi: "डेमो प्रोफाइल देखें" },
  visual_card_title: { en: "Design Identity System", hi: "डिजाइन पहचान प्रणाली" },
  visual_card_sub: { en: "Outfit Sans-Serif Body Copy", hi: "आउटफिट सेन्स-सेरिफ़ बॉडी कॉपी" },
  visual_card_serif: { en: "Playfair Serif Header", hi: "प्लेफेयर सेरिफ़ हेडर" },
  visual_card_glass: { en: "✨ Modern Glassmorphism Blur", hi: "✨ आधुनिक ग्लासमोर्फिज्म ब्लर" },

  // Auth / OTP screen
  auth_title: { en: "Sign In / SignUp", hi: "साइन इन / पंजीकरण" },
  auth_subtitle: { en: "Enter your mobile number to receive a simulated verification OTP", hi: "सत्यापन कोड (सिम्युलेटेड ओटीपी) प्राप्त करने के लिए अपना मोबाइल नंबर दर्ज करें" },
  label_phone: { en: "Mobile Number (E.164 format)", hi: "मोबाइल नंबर (E.164 प्रारूप)" },
  label_otp: { en: "Enter 6-Digit OTP Code", hi: "6-अंकों का ओटीपी दर्ज करें" },
  simulated_otp_alert: { en: "Mock Server Message", hi: "मॉड सर्वर संदेश" },
  btn_request_otp: { en: "Request Verification OTP", hi: "ओटीपी कोड का अनुरोध करें" },
  btn_verify_otp: { en: "Verify & Authenticate", hi: "सत्यापित करें" },
  btn_change_phone: { en: "Change Mobile Number", hi: "मोबाइल नंबर बदलें" },
  error_invalid_phone: { en: "Invalid mobile number. Must be in E.164 format.", hi: "अमान्य मोबाइल नंबर। E.164 प्रारूप में होना चाहिए।" },
  error_invalid_otp: { en: "Incorrect or expired OTP verification code.", hi: "गलत या अमान्य ओटीपी सत्यापन कोड।" },

  // ChatBot Dialogue Sequence
  bot_welcome: { 
    en: "Namaste! Welcome to Mithila Matrimony. Let's create your matrimonial biodata in an engaging way. First, what is your full name?", 
    hi: "नमस्ते! मिथिला मैट्रिमोनी में आपका स्वागत है। चलिए एक संवादात्मक बातचीत के माध्यम से आपका बायोडाटा बनाते हैं। सबसे पहले, आपका पूरा नाम क्या है?" 
  },
  bot_gender: { 
    en: "Pleasure to meet you, {name}! Please select your gender.", 
    hi: "आपसे मिलकर खुशी हुई, {name}! कृपया अपना लिंग चुनें।" 
  },
  bot_age: { 
    en: "Great. Now, how old are you? (Must be 18 to 70 years)", 
    hi: "बहुत बढ़िया। अब, आपकी उम्र क्या है? (उम्र 18 से 70 वर्ष के बीच होनी चाहिए)" 
  },
  bot_gotra: { 
    en: "Important question! What is your cultural Gotra?", 
    hi: "महत्वपूर्ण प्रश्न! आपका सांस्कृतिक गोत्र क्या है?" 
  },
  bot_city: { 
    en: "Got it. In which city do you currently reside?", 
    hi: "समझ गए। आप वर्तमान में किस शहर में रह रहे हैं?" 
  },
  bot_education: { 
    en: "Excellent. What is your highest educational qualification?", 
    hi: "उत्कृष्ट। आपकी उच्चतम शैक्षणिक योग्यता क्या है?" 
  },
  bot_profession: { 
    en: "What is your current occupation or profession?", 
    hi: "आपका वर्तमान पेशा या व्यवसाय क्या है?" 
  },
  bot_income: { 
    en: "Thank you. What is your annual income (INR)?", 
    hi: "धन्यवाद। आपकी वार्षिक आय (INR) क्या है?" 
  },
  bot_interests: { 
    en: "Almost there! Select your hobbies and interests (choose at least one).", 
    hi: "बस कुछ ही कदम और! अपनी रुचियों और शौक का चयन करें (कम से कम एक चुनें)।" 
  },
  bot_bio: { 
    en: "Finally, write a brief, warm 'About Me' description.", 
    hi: "अंत में, अपने बारे में संक्षेप में एक प्यारा सा परिचय लिखें।" 
  },
  bot_summary: { 
    en: "Excellent! I have compiled your Mithila Biodata. Please review the summary card below.", 
    hi: "अद्भुत! मैंने आपका मिथिला बायोडाटा तैयार कर लिया है। कृपया नीचे दिए गए सारांश कार्ड की समीक्षा करें।" 
  },

  // Chat validations & buttons
  chat_placeholder: { en: "Type your reply here...", hi: "अपना उत्तर यहाँ लिखें..." },
  chat_btn_send: { en: "Send", hi: "भेजें" },
  chat_error_empty: { en: "Please provide a valid text input.", hi: "कृपया एक वैध उत्तर दर्ज करें।" },
  chat_error_age: { en: "Age must be a number between 18 and 70.", hi: "उम्र 18 और 70 के बीच एक संख्या होनी चाहिए।" },
  chat_error_income: { en: "Annual income must be a valid positive number.", hi: "वार्षिक आय एक वैध सकारात्मक संख्या होनी चाहिए।" },

  // Summary Card Review
  summary_title: { en: "Mithila Matrimony Biodata", hi: "मिथिला मैट्रिमोनी बायोडाटा" },
  summary_gotra: { en: "Gotra", hi: "गोत्र" },
  summary_location: { en: "Location", hi: "स्थान" },
  summary_income: { en: "Annual Income", hi: "वार्षिक आय" },
  summary_lakh: { en: "Lakh p.a.", hi: "लाख प्रति वर्ष" },
  summary_about: { en: "About Me", hi: "मेरे बारे में" },
  btn_confirm_submit: { en: "Confirm & Register Profile", hi: "पुष्टि करें और प्रोफाइल दर्ज करें" },

  // Browse Dashboard
  browse_title: { en: "Discover Compatible Matches", hi: "अनुकूल जीवनसाथी खोजें" },
  browse_subtitle: { en: "Profiles are evaluated based on gotra compatibility, location filters, and age preferences.", hi: "गोत्र मिलान, स्थान और आयु प्राथमिकताओं के आधार पर प्रोफाइल का मूल्यांकन किया जाता है।" },
  browse_alert: { en: "✨ Automatically calculated opposite gender matches with compatible Gotras", hi: "✨ गोत्र मिलान के अनुसार अनुकूल विपरीत लिंग प्रोफाइल स्वतः प्रदर्शित हैं" },
  card_match: { en: "Match", hi: "मैच" },
  btn_request_connect: { en: "Request Match Connect", hi: "कनेक्ट अनुरोध भेजें" },
  no_matches: { en: "No compatible profiles found matching your compatibility criteria. Try modifying your preferences!", hi: "आपकी प्राथमिकताओं से मेल खाती हुई कोई प्रोफाइल नहीं मिली। कृपया अपनी प्राथमिकताओं को बदलें!" }
};
