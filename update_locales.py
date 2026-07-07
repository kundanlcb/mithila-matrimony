import json

new_en = {
  "bot_birth_place": "Where were you born? (Birth Place)",
  "bot_mool": "What is your Mool?",
  "bot_father_name": "What is your Father's Name?",
  "bot_mother_name": "What is your Mother's Name?",
  "bot_grandparent_name": "What is your Grandparent's Name?",
  "bot_siblings": "Any details about your siblings? (e.g. 1 Brother, 1 Sister)",
  "bot_city": "Which City do you currently live in?",
  "bot_state": "Which State do you currently live in?",
  "bot_pincode": "What is your current Pincode?",
  "bot_locality": "What is your locality/colony/village?",
  "bot_native_district": "What is your Native District?",
  "bot_otp_sent": "OTP sent! Please enter the 6-digit code. (Check your spam/junk folder if not in primary inbox)",
  "bot_profile_saved": "Profile saved and Biodata downloading! Taking you to matches...",
  "bot_choose_design": "Awesome! Now, choose a premium design for your Biodata.",
  "bot_provide_email_download": "Great choice! Please provide your email to save and download your Biodata.",
  "bot_otp_resent": "OTP resent! Please check your email. (Check your spam/junk folder if not in primary inbox)",
  "bot_provide_new_email": "Please provide your new email address.",

  "error_set_password": "Failed to set password: ",
  "error_invalid_phone": "Please enter a valid phone number.",
  "error_invalid_email_bot": "Please enter a valid email.",
  "error_send_otp_failed": "Failed to send OTP. Try again.",
  "error_otp_length": "OTP must be 6 digits.",
  "error_invalid_otp_bot": "Invalid OTP. Please try again.",
  "error_file_size": "File size exceeds 2MB limit.",
  "error_upload_failed": "Upload failed: ",
  "error_registration_failed": "Failed to complete registration. Please try again.",
  "error_resend_otp_failed": "Failed to resend OTP."
}

new_hi = {
  "bot_birth_place": "आपका जन्म स्थान क्या है?",
  "bot_mool": "आपका मूल क्या है?",
  "bot_father_name": "आपके पिता का क्या नाम है?",
  "bot_mother_name": "आपकी माता का क्या नाम है?",
  "bot_grandparent_name": "आपके दादा/दादी का क्या नाम है?",
  "bot_siblings": "आपके भाई-बहनों के बारे में कोई विवरण? (उदा. 1 भाई, 1 बहन)",
  "bot_city": "आप वर्तमान में किस शहर में रहते हैं?",
  "bot_state": "आप वर्तमान में किस राज्य में रहते हैं?",
  "bot_pincode": "आपका वर्तमान पिनकोड क्या है?",
  "bot_locality": "आपका मोहल्ला/कॉलोनी/गांव क्या है?",
  "bot_native_district": "आपका मूल जिला क्या है?",
  "bot_otp_sent": "OTP भेजा गया! कृपया 6-अंकीय कोड दर्ज करें। (यदि प्राइमरी इनबॉक्स में नहीं है, तो कृपया अपना स्पैम/जंक फ़ोल्डर जांचें)",
  "bot_profile_saved": "प्रोफ़ाइल सहेजी गई और बायोडेटा डाउनलोड हो रहा है! आपको मैचों पर ले जा रहे हैं...",
  "bot_choose_design": "बहुत बढ़िया! अब, अपने बायोडेटा के लिए एक प्रीमियम डिज़ाइन चुनें।",
  "bot_provide_email_download": "बढ़िया विकल्प! अपना बायोडेटा सहेजने और डाउनलोड करने के लिए कृपया अपना ईमेल प्रदान करें।",
  "bot_otp_resent": "OTP फिर से भेज दिया गया! कृपया अपना ईमेल जांचें। (यदि प्राइमरी इनबॉक्स में नहीं है, तो कृपया अपना स्पैम/जंक फ़ोल्डर जांचें)",
  "bot_provide_new_email": "कृपया अपना नया ईमेल पता प्रदान करें।",

  "error_set_password": "पासवर्ड सेट करने में विफल: ",
  "error_invalid_phone": "कृपया एक वैध फ़ोन नंबर दर्ज करें।",
  "error_invalid_email_bot": "कृपया एक वैध ईमेल दर्ज करें।",
  "error_send_otp_failed": "OTP भेजने में विफल। पुनः प्रयास करें।",
  "error_otp_length": "OTP 6 अंकों का होना चाहिए।",
  "error_invalid_otp_bot": "अमान्य OTP। कृपया पुनः प्रयास करें।",
  "error_file_size": "फ़ाइल का आकार 2MB सीमा से अधिक है।",
  "error_upload_failed": "अपलोड विफल: ",
  "error_registration_failed": "पंजीकरण पूरा करने में विफल। कृपया पुनः प्रयास करें।",
  "error_resend_otp_failed": "OTP दोबारा भेजने में विफल।"
}

new_ma = {
  "bot_birth_place": "अहाँक जन्म स्थान की अछि?",
  "bot_mool": "अहाँक मूल की अछि?",
  "bot_father_name": "अहाँक पिताक नाम की अछि?",
  "bot_mother_name": "अहाँक माताक नाम की अछि?",
  "bot_grandparent_name": "अहाँक बाबा/दादीक नाम की अछि?",
  "bot_siblings": "अहाँक भाइ-बहिनीक बारे में कोनो विवरण? (उदा. 1 भाइ, 1 बहिन)",
  "bot_city": "अहाँ वर्तमान में कोन शहर में रहैत छी?",
  "bot_state": "अहाँ वर्तमान में कोन राज्य में रहैत छी?",
  "bot_pincode": "अहाँक वर्तमान पिनकोड की अछि?",
  "bot_locality": "अहाँक मोहल्ला/कॉलोनी/गाँव की अछि?",
  "bot_native_district": "अहाँक मूल जिला की अछि?",
  "bot_otp_sent": "OTP पठाओल गेल! कृपया 6-अंकक कोड दर्ज करू। (जँ प्राइमरी इनबॉक्स में नइ अछि, तँ कृपया अपन स्पैम/जंक फ़ोल्डर चेक करू)",
  "bot_profile_saved": "प्रोफ़ाइल सहेजल गेल आ बायोडेटा डाउनलोड भऽ रहल अछि! अहाँकेँ मैच पर लऽ जा रहल छी...",
  "bot_choose_design": "बहुत नीक! आब, अपन बायोडेटाक लेल एकटा प्रीमियम डिज़ाइन चुनू।",
  "bot_provide_email_download": "बढ़िया विकल्प! अपन बायोडेटा सहेजब आ डाउनलोड करबाक लेल कृपया अपन ईमेल प्रदान करू।",
  "bot_otp_resent": "OTP फेर सँ पठाओल गेल! कृपया अपन ईमेल चेक करू। (जँ प्राइमरी इनबॉक्स में नइ अछि, तँ कृपया अपन स्पैम/जंक फ़ोल्डर चेक करू)",
  "bot_provide_new_email": "कृपया अपन नव ईमेल पता प्रदान करू।",

  "error_set_password": "पासवर्ड सेट करबामे विफल: ",
  "error_invalid_phone": "कृपया एकटा वैध फ़ोन नंबर दर्ज करू।",
  "error_invalid_email_bot": "कृपया एकटा वैध ईमेल दर्ज करू।",
  "error_send_otp_failed": "OTP पठाबामे विफल। पुनः प्रयास करू।",
  "error_otp_length": "OTP 6 अंकक होबाक चाही।",
  "error_invalid_otp_bot": "अमान्य OTP। कृपया पुनः प्रयास करू।",
  "error_file_size": "फ़ाइलक आकार 2MB सीमा सँ बेसी अछि।",
  "error_upload_failed": "अपलोड विफल: ",
  "error_registration_failed": "पंजीकरण पूरा करबामे विफल। कृपया पुनः प्रयास करू।",
  "error_resend_otp_failed": "OTP दोबारा पठाबामे विफल।"
}

def update_locale(path, new_keys):
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    for k, v in new_keys.items():
        data[k] = v
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

update_locale('src/locales/en.json', new_en)
update_locale('src/locales/hi.json', new_hi)
update_locale('src/locales/ma.json', new_ma)
