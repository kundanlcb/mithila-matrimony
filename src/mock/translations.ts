/* 
 * Maithil Match - Central Translations Database
 * Supports English (en) and Hindi (hi) localizations
 */

export interface TranslationItem {
  en: string;
  hi: string;
  ma: string;
}

export const TRANSLATIONS: Record<string, TranslationItem> = {
  // General Navigation & Brand
  brand_serif: { en: "Maithil", hi: "मैथिल", ma: "मैथिल" },
  brand_sans: { en: "Match", hi: "मैच", ma: "मैच" },
  btn_logout: { en: "Log Out", hi: "लॉग आउट", ma: "लॉग आउट" },
  btn_auth: { en: "Sign In", hi: "साइन इन", ma: "साइन इन" },
  namaste: { en: "Namaste", hi: "नमस्ते", ma: "प्रणाम" },

  // Hero / Landing view
  hero_title_prefix: { en: "Discover Soulmates Embedded in ", hi: "अपनी संस्कृति और जड़ों से जुड़े ", ma: "अपनी संस्कृति और जड़ों से जुड़े " },
  hero_title_accent: { en: "Maithil Heritage", hi: "मैथिल जीवनसाथी खोजें", ma: "मैथिल जीवनसाथी खोजें" },
  hero_subtitle: { en: "A secure and modern platform built with Maithil culture and traditions in mind. Discover fully verified (OTP Verified) profiles, secure gotra matching, and precise partner searches based on your preferences.", hi: "मैथिल संस्कृति और परंपराओं को ध्यान में रखकर बनाया गया एक सुरक्षित और आधुनिक मंच। यहाँ आपको मिलता है पूरी तरह से सत्यापित (OTP Verified) प्रोफाइल, सुरक्षित गोत्र मिलान और आपकी पसंद के अनुसार सटीक जीवनसाथी की खोज।", ma: "मैथिल संस्कृति और परंपराओं को ध्यान में रखकर बनाया गया एक सुरक्षित और आधुनिक मंच। यहाँ आपको मिलता है पूरी तरह से सत्यापित (OTP Verified) प्रोफाइल, सुरक्षित गोत्र मिलान और आपकी पसंद के अनुसार सटीक जीवनसाथी की खोज।" },
  btn_begin_search: { en: "Begin Free Search", hi: "खोज शुरू करें", ma: "खोज शुरू करें" },
  btn_explore_mocks: { en: "Explore Mock Profiles", hi: "डेमो प्रोफाइल देखें", ma: "डेमो प्रोफाइल देखें" },
  visual_card_title: { en: "Design Identity System", hi: "डिजाइन पहचान प्रणाली", ma: "डिजाइन पहचान प्रणाली" },
  visual_card_sub: { en: "Outfit Sans-Serif Body Copy", hi: "आउटफिट सेन्स-सेरिफ़ बॉडी कॉपी", ma: "आउटफिट सेन्स-सेरिफ़ बॉडी कॉपी" },
  visual_card_serif: { en: "Playfair Serif Header", hi: "प्लेफेयर सेरिफ़ हेडर", ma: "प्लेफेयर सेरिफ़ हेडर" },
  visual_card_glass: { en: "✨ Modern Glassmorphism Blur", hi: "✨ आधुनिक ग्लासमोर्फिज्म ब्लर", ma: "✨ आधुनिक ग्लासमोर्फिज्म ब्लर" },

  // Dribbble-Tier Hero Widget Translations
  hero_tag: { en: "🧬 Gotra-Safe Matrimonial Platform", hi: "🧬 गोत्र-सुरक्षित मैथिल विवाह मंच", ma: "🧬 गोत्र-सुरक्षित मैथिल विवाह मंच" },
  widget_gender: { en: "I am a", hi: "मैं हूँ", ma: "मैं हूँ" },
  widget_look: { en: "Looking for a", hi: "वर/वधू खोज", ma: "वर/वधू खोज" },
  widget_gotra: { en: "Of Gotra", hi: "गोत्र", ma: "गोत्र" },
  widget_submit: { en: "Let's Match", hi: "अनुकूल मिलान खोजें", ma: "अनुकूल मिलान खोजें" },
  widget_male: { en: "Man", hi: "पुरुष", ma: "पुरुष" },
  widget_female: { en: "Woman", hi: "महिला", ma: "महिला" },
  widget_any: { en: "Any Gotra", hi: "सभी गोत्र", ma: "सभी गोत्र" },
  trust_stat1_title: { en: "12K+ Verified Profiles", hi: "12K+ सत्यापित प्रोफाइल", ma: "12K+ सत्यापित प्रोफाइल" },
  trust_stat2_title: { en: "Gotra Compatibility Engine", hi: "गोत्र-मिलान तकनीक", ma: "गोत्र-मिलान तकनीक" },

  // Landing "Why Choose Us" Localizations
  landing_why_title: { en: "Why Maithil Match?", hi: "क्यूं Maithil Match?", ma: "क्यूं Maithil Match?" },
  landing_why_desc: { en: "Preserving legacy through verified cultural lineage, secure gotra rules, and trusted connections.", hi: "विश्वसनीय गोत्र मिलान और समृद्ध सांस्कृतिक परंपराओं के माध्यम से परिवारों को जोड़ना।", ma: "विश्वसनीय गोत्र मिलान और समृद्ध सांस्कृतिक परंपराओं के माध्यम से परिवारों को जोड़ना।" },
  landing_why_item1_title: { en: "🧬 Gotra Compatibility Safeguards", hi: "🧬 गोत्र मिलान सुरक्षा", ma: "🧬 गोत्र मिलान सुरक्षा" },
  landing_why_item1_desc: { en: "Automated filters screen matches based on traditional gotra customs to align with lineage values.", hi: "हमारी प्रणाली पारंपरिक गोत्र नियमों के अनुसार अनुकूल मिलान स्वतः और सुरक्षित रूप से खोजती है।", ma: "हमारी प्रणाली पारंपरिक गोत्र नियमों के अनुसार अनुकूल मिलान स्वतः और सुरक्षित रूप से खोजती है।" },
  landing_why_item2_title: { en: "🔒 Secure Contact Verification", hi: "🔒 सुरक्षित संपर्क सत्यापन", ma: "🔒 सुरक्षित संपर्क सत्यापन" },
  landing_why_item2_desc: { en: "Off-line simulated OTP authentication prevents unverified profiles and secures contact databases.", hi: "ओटीपी सत्यापन द्वारा सुरक्षित प्रोफाइल पंजीकरण ताकि केवल विश्वसनीय और सत्यापित लोग ही जुड़ सकें।", ma: "ओटीपी सत्यापन द्वारा सुरक्षित प्रोफाइल पंजीकरण ताकि केवल विश्वसनीय और सत्यापित लोग ही जुड़ सकें।" },

  // Landing "What We Offer" Localizations
  landing_what_title: { en: "What We Offer", hi: "क्या है हमारी सेवा?", ma: "क्या है हमारी सेवा?" },
  landing_what_desc: { en: "A modern visual experience designed to make matrimonial search delightful, interactive, and fast.", hi: "आपके जीवनसाथी की खोज को बेहद सरल, सुंदर, मनोरंजक और आधुनिक बनाने के लिए नवीन सुविधाएं।", ma: "आपके जीवनसाथी की खोज को बेहद सरल, सुंदर, मनोरंजक और आधुनिक बनाने के लिए नवीन सुविधाएं।" },
  landing_what_item1_title: { en: "🛡️ Genuine & Verified Profiles", hi: "🛡️ प्रामाणिक एवं सत्यापित प्रोफाइल", ma: "🛡️ प्रामाणिक एवं सत्यापित प्रोफाइल" },
  landing_what_item1_desc: { en: "Every candidate is vetted with simulated contact authentication to eliminate spam and ensure authentic credentials.", hi: "स्पैम को रोकने और वास्तविक पहचान सुनिश्चित करने के लिए हर उम्मीदवार को सत्यापित किया जाता है।", ma: "स्पैम को रोकने और वास्तविक पहचान सुनिश्चित करने के लिए हर उम्मीदवार को सत्यापित किया जाता है।" },
  landing_what_item2_title: { en: "⚡ Modern Matching Algorithms", hi: "⚡ आधुनिक गोत्र और फिल्टर मिलान", ma: "⚡ आधुनिक गोत्र और फिल्टर मिलान" },
  landing_what_item2_desc: { en: "Intelligent Gotra-compatibility rules matched with age, income, and lifestyle filters to guide you to the right partner.", hi: "पारंपरिक गोत्र नियमों के साथ उम्र, आय और जीवनशैली प्राथमिकताओं पर आधारित तीव्र एवं सटीक मिलान तकनीक।", ma: "पारंपरिक गोत्र नियमों के साथ उम्र, आय और जीवनशैली प्राथमिकताओं पर आधारित तीव्र एवं सटीक मिलान तकनीक।" },
  landing_what_item3_title: { en: "🌎 Large Global Maithil Community", hi: "🌎 विशाल वैश्विक मैथिल समुदाय", ma: "🌎 विशाल वैश्विक मैथिल समुदाय" },
  landing_what_item3_desc: { en: "Connecting Maithil families across Bangalore, Delhi NCR, Patna, Darbhanga, Mumbai, and worldwide.", hi: "बेंगलुरु, दिल्ली एनसीआर, मुंबई, पटना, दरभंगा सहित देश-विदेश में रहने वाले मैथिल वर-वधू का विशाल मंच।", ma: "बेंगलुरु, दिल्ली एनसीआर, मुंबई, पटना, दरभंगा सहित देश-विदेश में रहने वाले मैथिल वर-वधू का विशाल मंच।" },

  // Landing "Who We Are" Localizations
  landing_who_title: { en: "Who We Are", hi: "कौन हैं हम?", ma: "कौन हैं हम?" },
  landing_who_desc: { en: "Bridging legacy roots and progressive hearts to connect Maithil families globally.", hi: "मैथिल परिवारों को वैश्विक स्तर पर जोड़ने के लिए समर्पित एक आधुनिक और सुरक्षित साझा मंच।", ma: "मैथिल परिवारों को वैश्विक स्तर पर जोड़ने के लिए समर्पित एक आधुनिक और सुरक्षित साझा मंच।" },
  landing_who_item1_title: { en: "🌎 Global Maithil Community", hi: "🌎 वैश्विक मैथिल समुदाय", ma: "🌎 वैश्विक मैथिल समुदाय" },
  landing_who_item1_desc: { en: "Connecting candidates across Bangalore, Delhi NCR, Mumbai, Patna, Darbhanga, and globally.", hi: "दरभंगा, पटना, दिल्ली, मुंबई, बेंगलुरु से लेकर देश-विदेश में बसे मैथिल वर-वधू का विशाल मंच।", ma: "दरभंगा, पटना, दिल्ली, मुंबई, बेंगलुरु से लेकर देश-विदेश में बसे मैथिल वर-वधू का विशाल मंच।" },
  landing_who_item2_title: { en: "🤝 Core Respect & Privacy", hi: "🤝 पूर्ण गोपनीयता एवं सम्मान", ma: "🤝 पूर्ण गोपनीयता एवं सम्मान" },
  landing_who_item2_desc: { en: "Respecting your privacy, values, and traditions while providing cutting edge searching interfaces.", hi: "आपकी गोपनीयता और परंपराओं का पूरा सम्मान करते हुए आधुनिकतम खोज और सुरक्षा उपकरण।", ma: "आपकी गोपनीयता और परंपराओं का पूरा सम्मान करते हुए आधुनिकतम खोज और सुरक्षा उपकरण।" },

  // Auth / OTP screen
  auth_title: { en: "Sign In / SignUp", hi: "साइन इन / पंजीकरण", ma: "साइन इन / पंजीकरण" },
  auth_subtitle: { en: "Enter your mobile number to receive a simulated verification OTP", hi: "सत्यापन कोड (सिम्युलेटेड ओटीपी) प्राप्त करने के लिए अपना मोबाइल नंबर दर्ज करें", ma: "सत्यापन कोड (सिम्युलेटेड ओटीपी) प्राप्त करने के लिए अपना मोबाइल नंबर दर्ज करें" },
  label_phone: { en: "Mobile Number (E.164 format)", hi: "मोबाइल नंबर (E.164 प्रारूप)", ma: "मोबाइल नंबर (E.164 प्रारूप)" },
  label_otp: { en: "Enter 6-Digit OTP Code", hi: "6-अंकों का ओटीपी दर्ज करें", ma: "6-अंकों का ओटीपी दर्ज करें" },
  simulated_otp_alert: { en: "Mock Server Message", hi: "मॉड सर्वर संदेश", ma: "मॉड सर्वर संदेश" },
  btn_request_otp: { en: "Request Verification OTP", hi: "ओटीपी कोड का अनुरोध करें", ma: "ओटीपी कोड का अनुरोध करें" },
  btn_verify_otp: { en: "Verify & Authenticate", hi: "सत्यापित करें", ma: "सत्यापित करें" },
  btn_change_phone: { en: "Change Mobile Number", hi: "मोबाइल नंबर बदलें", ma: "मोबाइल नंबर बदलें" },
  error_invalid_phone: { en: "Invalid mobile number. Must be in E.164 format.", hi: "अमान्य मोबाइल नंबर। E.164 प्रारूप में होना चाहिए।", ma: "अमान्य मोबाइल नंबर। E.164 प्रारूप में होना चाहिए।" },
  error_invalid_otp: { en: "Incorrect or expired OTP verification code.", hi: "गलत या अमान्य ओटीपी सत्यापन कोड।", ma: "गलत या अमान्य ओटीपी सत्यापन कोड।" },

  // ChatBot Dialogue Sequence
  bot_welcome: { 
    en: "Namaste! Welcome to Maithil Match. Let's create your matrimonial biodata in an engaging way. First, what is your full name?", 
    hi: "नमस्ते! मैथिल मैच में स्वागत है। चलिए एक संवादात्मक बातचीत के माध्यम से आपका बायोडाटा बनाते हैं। सबसे पहले, आपका पूरा नाम क्या है?", ma: "नमस्ते! मैथिल मैच में स्वागत है। चलिए एक संवादात्मक बातचीत के माध्यम से आपका बायोडाटा बनाते हैं। सबसे पहले, आपका पूरा नाम क्या है?" 
  },
  bot_gender: { 
    en: "Pleasure to meet you, {name}! Please select your gender.", 
    hi: "आपसे मिलकर खुशी हुई, {name}! कृपया अपना लिंग चुनें।", ma: "आपसे मिलकर खुशी हुई, {name}! कृपया अपना लिंग चुनें।" 
  },
  bot_age: { 
    en: "Great. Now, how old are you? (Must be 18 to 70 years)", 
    hi: "बहुत बढ़िया। अब, आपकी उम्र क्या है? (उम्र 18 से 70 वर्ष के बीच होनी चाहिए)", ma: "बहुत बढ़िया। अब, आपकी उम्र क्या है? (उम्र 18 से 70 वर्ष के बीच होनी चाहिए)" 
  },
  bot_height: { en: "What is your height? (e.g. 5'8\")", hi: "आपकी लंबाई क्या है? (जैसे 5'8\")", ma: "आपकी लंबाई क्या है? (जैसे 5'8\")" },
  bot_marital: { en: "What is your marital status?", hi: "आपकी वैवाहिक स्थिति क्या है?", ma: "आपकी वैवाहिक स्थिति क्या है?" },
  bot_complexion: { en: "What is your complexion?", hi: "आपका रंग-रूप (complexion) क्या है?", ma: "आपका रंग-रूप (complexion) क्या है?" },
  bot_gotra: { 
    en: "Important question! What is your cultural Gotra?", 
    hi: "महत्वपूर्ण प्रश्न! आपका सांस्कृतिक गोत्र क्या है?", ma: "महत्वपूर्ण प्रश्न! आपका सांस्कृतिक गोत्र क्या है?" 
  },
  bot_diet: { en: "What are your dietary preferences?", hi: "आपका खान-पान (Diet) कैसा है?", ma: "आपका खान-पान (Diet) कैसा है?" },
  bot_city: { 
    en: "Got it. In which city do you currently reside?", 
    hi: "समझ गए। आप वर्तमान में किस शहर में रह रहे हैं?", ma: "समझ गए। आप वर्तमान में किस शहर में रह रहे हैं?" 
  },
  bot_education: { 
    en: "Excellent. What is your highest educational qualification?", 
    hi: "उत्कृष्ट। आपकी उच्चतम शैक्षणिक योग्यता क्या है?", ma: "उत्कृष्ट। आपकी उच्चतम शैक्षणिक योग्यता क्या है?" 
  },
  bot_profession: { 
    en: "What is your current occupation or profession?", 
    hi: "आपका वर्तमान पेशा या व्यवसाय क्या है?", ma: "आपका वर्तमान पेशा या व्यवसाय क्या है?" 
  },
  bot_income: { 
    en: "Thank you. What is your annual income (INR)?", 
    hi: "धन्यवाद। आपकी वार्षिक आय (INR) क्या है?", ma: "धन्यवाद। आपकी वार्षिक आय (INR) क्या है?" 
  },
  bot_interests: { 
    en: "Almost there! Select your hobbies and interests (choose at least one).", 
    hi: "बस कुछ ही कदम और! अपनी रुचियों और शौक का चयन करें (कम से कम एक चुनें)।", ma: "बस कुछ ही कदम और! अपनी रुचियों और शौक का चयन करें (कम से कम एक चुनें)।" 
  },
  bot_bio: { 
    en: "Write a brief, warm 'About Me' description.", 
    hi: "अपने बारे में संक्षेप में एक प्यारा सा परिचय लिखें।", ma: "अपने बारे में संक्षेप में एक प्यारा सा परिचय लिखें।" 
  },
  bot_photo: {
    en: "Perfect! Finally, please upload a nice profile photo so compatible matches can see your warm smile.",
    hi: "बहुत बढ़िया! अंत में, कृपया एक सुंदर प्रोफाइल फ़ोटो अपलोड करें ताकि अनुकूल मिलान आपका मुस्कुराता हुआ चेहरा देख सकें।", ma: "बहुत बढ़िया! अंत में, कृपया एक सुंदर प्रोफाइल फ़ोटो अपलोड करें ताकि अनुकूल मिलान आपका मुस्कुराता हुआ चेहरा देख सकें।"
  },
  bot_summary: { 
    en: "Excellent! I have compiled your Maithil Biodata. Please review the summary card below.", 
    hi: "अद्भुत! मैंने आपका मैथिल बायोडाटा तैयार कर लिया है। कृपया नीचे दिए गए सारांश कार्ड की समीक्षा करें।", ma: "अद्भुत! मैंने आपका मैथिल बायोडाटा तैयार कर लिया है। कृपया नीचे दिए गए सारांश कार्ड की समीक्षा करें।" 
  },

  // Chat validations & buttons
  chat_placeholder: { en: "Type your reply here...", hi: "अपना उत्तर यहाँ लिखें...", ma: "अपना उत्तर यहाँ लिखें..." },
  chat_btn_send: { en: "Send", hi: "भेजें", ma: "भेजें" },
  chat_error_empty: { en: "Please provide a valid text input.", hi: "कृपया एक वैध उत्तर दर्ज करें।", ma: "कृपया एक वैध उत्तर दर्ज करें।" },
  chat_error_age: { en: "Age must be a number between 18 and 70.", hi: "उम्र 18 और 70 के बीच एक संख्या होनी चाहिए।", ma: "उम्र 18 और 70 के बीच एक संख्या होनी चाहिए।" },
  chat_error_income: { en: "Annual income must be a valid positive number.", hi: "वार्षिक आय एक वैध सकारात्मक संख्या होनी चाहिए।", ma: "वार्षिक आय एक वैध सकारात्मक संख्या होनी चाहिए।" },

  // Summary Card Review
  summary_title: { en: "Maithil Match Biodata", hi: "मैथिल मैच बायोडाटा", ma: "मैथिल मैच बायोडाटा" },
  summary_gotra: { en: "Gotra", hi: "गोत्र", ma: "गोत्र" },
  summary_location: { en: "Location", hi: "स्थान", ma: "स्थान" },
  summary_income: { en: "Annual Income", hi: "वार्षिक आय", ma: "वार्षिक आय" },
  summary_lakh: { en: "Lakh p.a.", hi: "लाख प्रति वर्ष", ma: "लाख प्रति वर्ष" },
  summary_about: { en: "About Me", hi: "मेरे बारे में", ma: "मेरे बारे में" },
  btn_confirm_submit: { en: "Confirm & Register Profile", hi: "पुष्टि करें और प्रोफाइल दर्ज करें", ma: "पुष्टि करें और प्रोफाइल दर्ज करें" },

  // Browse Dashboard
  browse_title: { en: "Discover Compatible Matches", hi: "अनुकूल जीवनसाथी खोजें", ma: "अनुकूल जीवनसाथी खोजें" },
  browse_subtitle: { en: "Profiles are evaluated based on gotra compatibility, location filters, and age preferences.", hi: "गोत्र मिलान, स्थान और आयु प्राथमिकताओं के आधार पर प्रोफाइल का मूल्यांकन किया जाता है।", ma: "गोत्र मिलान, स्थान और आयु प्राथमिकताओं के आधार पर प्रोफाइल का मूल्यांकन किया जाता है।" },
  browse_alert: { en: "Automatically calculated opposite gender matches with compatible Gotras", hi: "गोत्र मिलान के अनुसार अनुकूल विपरीत लिंग प्रोफाइल स्वतः प्रदर्शित हैं", ma: "गोत्र मिलान के अनुसार अनुकूल विपरीत लिंग प्रोफाइल स्वतः प्रदर्शित हैं" },
  card_match: { en: "Match", hi: "मैच", ma: "मैच" },
  btn_request_connect: { en: "Request Match Connect", hi: "कनेक्ट अनुरोध भेजें", ma: "कनेक्ट अनुरोध भेजें" },
  no_matches: { en: "No compatible profiles found matching your compatibility criteria. Try modifying your preferences!", hi: "आपकी प्राथमिकताओं से मेल खाती हुई कोई प्रोफाइल नहीं मिली। कृपया अपनी प्राथमिकताओं को बदलें!", ma: "आपकी प्राथमिकताओं से मेल खाती हुई कोई प्रोफाइल नहीं मिली। कृपया अपनी प्राथमिकताओं को बदलें!" },

  // Phase 3: Profile Discovery & Freemium
  nav_browse: { en: "Browse", hi: "खोजें", ma: "खोजें" },
  nav_inbox: { en: "Inbox", hi: "इनबॉक्स", ma: "इनबॉक्स" },
  nav_profile: { en: "Profile", hi: "प्रोफ़ाइल", ma: "प्रोफ़ाइल" },
  
  filter_title: { en: "Filters", hi: "फ़िल्टर", ma: "फ़िल्टर" },
  filter_age_range: { en: "Age Range", hi: "आयु सीमा", ma: "आयु सीमा" },
  filter_location: { en: "Location", hi: "स्थान", ma: "स्थान" },
  filter_all: { en: "All", hi: "सभी", ma: "सभी" },
  filter_apply: { en: "Apply Filters", hi: "फ़िल्टर लागू करें", ma: "फ़िल्टर लागू करें" },
  
  action_interest: { en: "Send Interest", hi: "रुचि भेजें", ma: "रुचि भेजें" },
  action_shortlist: { en: "Shortlist", hi: "शॉर्टलिस्ट", ma: "शॉर्टलिस्ट" },
  action_pass: { en: "Pass", hi: "छोड़ें", ma: "छोड़ें" },
  action_chat: { en: "Chat", hi: "चैट करें", ma: "चैट करें" },
  
  premium_title: { en: "Premium Feature", hi: "प्रीमियम फ़ीचर", ma: "प्रीमियम फ़ीचर" },
  premium_desc: { en: "Upgrade your plan to view contact details.", hi: "संपर्क विवरण देखने के लिए अपना प्लान अपग्रेड करें।", ma: "संपर्क विवरण देखने के लिए अपना प्लान अपग्रेड करें।" },
  premium_btn: { en: "Upgrade Now", hi: "अभी अपग्रेड करें", ma: "अभी अपग्रेड करें" },
  
  inbox_title: { en: "Your Interactions", hi: "आपकी बातचीत", ma: "आपकी बातचीत" },
  inbox_empty: { en: "No interactions yet.", hi: "अभी तक कोई बातचीत नहीं हुई।", ma: "अभी तक कोई बातचीत नहीं हुई।" },
  inbox_received: { en: "Received Requests", hi: "प्राप्त अनुरोध", ma: "प्राप्त अनुरोध" },
  inbox_matches: { en: "Mutual Matches", hi: "पारस्परिक मिलान", ma: "पारस्परिक मिलान" },
  inbox_sent: { en: "Sent Interests", hi: "भेजी गई रुचियाँ", ma: "भेजी गई रुचियाँ" },
  
  chat_summary_title: { en: "Profile Summary", hi: "प्रोफ़ाइल सारांश", ma: "प्रोफ़ाइल सारांश" },
  chat_summary_btn: { en: "Looks Good! View Matches", hi: "ठीक है! मिलान देखें", ma: "ठीक है! मिलान देखें" }
};
