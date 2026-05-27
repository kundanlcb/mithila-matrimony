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

  // Landing "Why Choose Us" Localizations
  landing_why_title: { en: "Why Mithila Matrimony?", hi: "क्यूं Mithila Matrimony?" },
  landing_why_desc: { en: "Preserving legacy through verified cultural lineage, secure gotra rules, and trusted connections.", hi: "विश्वसनीय गोत्र मिलान और समृद्ध सांस्कृतिक परंपराओं के माध्यम से परिवारों को जोड़ना।" },
  landing_why_item1_title: { en: "🧬 Gotra Compatibility Safeguards", hi: "🧬 गोत्र मिलान सुरक्षा" },
  landing_why_item1_desc: { en: "Automated filters screen matches based on traditional gotra customs to align with lineage values.", hi: "हमारी प्रणाली पारंपरिक गोत्र नियमों के अनुसार अनुकूल मिलान स्वतः और सुरक्षित रूप से खोजती है।" },
  landing_why_item2_title: { en: "🔒 Secure Contact Verification", hi: "🔒 सुरक्षित संपर्क सत्यापन" },
  landing_why_item2_desc: { en: "Off-line simulated OTP authentication prevents unverified profiles and secures contact databases.", hi: "ओटीपी सत्यापन द्वारा सुरक्षित प्रोफाइल पंजीकरण ताकि केवल विश्वसनीय और सत्यापित लोग ही जुड़ सकें।" },

  // Landing "What We Offer" Localizations
  landing_what_title: { en: "What We Offer", hi: "क्या है हमारी सेवा?" },
  landing_what_desc: { en: "A modern visual experience designed to make matrimonial search delightful, interactive, and fast.", hi: "आपके जीवनसाथी की खोज को बेहद सरल, सुंदर, मनोरंजक और आधुनिक बनाने के लिए नवीन सुविधाएं।" },
  landing_what_item1_title: { en: "💬 Conversational Chat Onboarding", hi: "💬 संवादात्मक चैट पंजीकरण" },
  landing_what_item1_desc: { en: "Assemble your biodata through a friendly, engaging chatbot instead of tiring standard forms.", hi: "उबाऊ फॉर्म्स के बजाय एक प्यारे चैटबॉट से बात करते हुए खेल-खेल में अपना बायोडाटा बनाएं।" },
  landing_what_item2_title: { en: "🌓 Responsive Theme & i18n Toggles", hi: "🌓 डार्क थीम और द्विभाषी अनुभव" },
  landing_what_item2_desc: { en: "Switch seamlessly between English/Hindi translations and comfortable dark mode visual canvases.", hi: "अंग्रेजी और हिंदी भाषा के साथ-साथ रात में आरामदायक देखने के लिए लाइट एवं डार्क मोड का सहज अनुभव।" },

  // Landing "Who We Are" Localizations
  landing_who_title: { en: "Who We Are", hi: "कौन हैं हम?" },
  landing_who_desc: { en: "Bridging legacy roots and progressive hearts to connect Maithil families globally.", hi: "मैथिल परिवारों को वैश्विक स्तर पर जोड़ने के लिए समर्पित एक आधुनिक और सुरक्षित साझा मंच।" },
  landing_who_item1_title: { en: "🌎 Global Maithil Community", hi: "🌎 वैश्विक मैथिल समुदाय" },
  landing_who_item1_desc: { en: "Connecting candidates across Bangalore, Delhi NCR, Mumbai, Patna, Darbhanga, and globally.", hi: "दरभंगा, पटना, दिल्ली, मुंबई, बेंगलुरु से लेकर देश-विदेश में बसे मैथिल वर-वधू का विशाल मंच।" },
  landing_who_item2_title: { en: "🤝 Core Respect & Privacy", hi: "🤝 पूर्ण गोपनीयता एवं सम्मान" },
  landing_who_item2_desc: { en: "Respecting your privacy, values, and traditions while providing cutting edge searching interfaces.", hi: "आपकी गोपनीयता और परंपराओं का पूरा सम्मान करते हुए आधुनिकतम खोज और सुरक्षा उपकरण।" },

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
    hi: "नमस्ते! मिथिला मैट्रिमोनी में स्वागत है। चलिए एक संवादात्मक बातचीत के माध्यम से आपका बायोडाटा बनाते हैं। सबसे पहले, आपका पूरा नाम क्या है?" 
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
