const fs = require('fs');

const keys = {
  "biodata_maker_title_step1": { en: "Enter Details", hi: "विवरण दर्ज करें", ma: "विवरण दर्ज करू" },
  "biodata_maker_title_step2": { en: "Select Template", hi: "टेम्पलेट चुनें", ma: "टेम्पलेट चुनू" },
  "biodata_maker_title_step3": { en: "Preview Biodata", hi: "बायोडाटा पूर्वावलोकन", ma: "बायोडाटा पूर्वावलोकन" },
  "biodata_maker_title_step4": { en: "Verify to Download", hi: "डाउनलोड के लिए सत्यापित करें", ma: "डाउनलोड के लेल सत्यापित करू" },
  "biodata_maker_title_step5": { en: "Success!", hi: "सफलता!", ma: "सफलता!" },
  "biodata_maker_personal_details": { en: "Personal Details", hi: "व्यक्तिगत विवरण", ma: "व्यक्तिगत विवरण" },
  "biodata_maker_maithil_specifics": { en: "Maithil Specifics", hi: "मैथिल विशिष्ट विवरण", ma: "मैथिल विशिष्ट विवरण" },
  "biodata_maker_edu_prof": { en: "Education & Profession", hi: "शिक्षा और पेशा", ma: "शिक्षा आ पेशा" },
  "biodata_maker_family": { en: "Family Details", hi: "परिवार का विवरण", ma: "परिवारक विवरण" },
  "biodata_maker_rural_address": { en: "Native (Rural) Address", hi: "मूल (ग्रामीण) पता", ma: "मूल (ग्रामीण) पता" },
  "biodata_maker_urban_address": { en: "Current (Urban) Address", hi: "वर्तमान (शहरी) पता", ma: "वर्तमान (शहरी) पता" },
  "biodata_maker_profile_photo": { en: "Profile Photo", hi: "प्रोफाइल फोटो", ma: "प्रोफाइल फोटो" },
  "biodata_maker_full_name": { en: "Full Name", hi: "पूरा नाम", ma: "पूरा नाम" },
  "biodata_maker_gender": { en: "Gender", hi: "लिंग", ma: "लिंग" },
  "biodata_maker_male": { en: "Male", hi: "पुरुष", ma: "पुरुष" },
  "biodata_maker_female": { en: "Female", hi: "महिला", ma: "महिला" },
  "biodata_maker_dob": { en: "Date of Birth", hi: "जन्म तिथि", ma: "जन्म तिथि" },
  "biodata_maker_tob": { en: "Time of Birth", hi: "जन्म समय", ma: "जन्म समय" },
  "biodata_maker_pob": { en: "Place of Birth", hi: "जन्म स्थान", ma: "जन्म स्थान" },
  "biodata_maker_height": { en: "Height", hi: "ऊंचाई", ma: "ऊंचाई" },
  "biodata_maker_complexion": { en: "Complexion / Color", hi: "रंग", ma: "रंग" },
  "biodata_maker_gotra": { en: "Gotra", hi: "गोत्र", ma: "गोत्र" },
  "biodata_maker_mool": { en: "Mool", hi: "मूल", ma: "मूल" },
  "biodata_maker_education": { en: "Highest Education", hi: "उच्चतम शिक्षा", ma: "उच्चतम शिक्षा" },
  "biodata_maker_profession": { en: "Profession/Job", hi: "पेशा/नौकरी", ma: "पेशा/नौकरी" },
  "biodata_maker_income": { en: "Annual Income", hi: "वार्षिक आय", ma: "वार्षिक आय" },
  "biodata_maker_grandparent": { en: "Grandparent's Name", hi: "दादा/दादी का नाम", ma: "दादा/दादी के नाम" },
  "biodata_maker_father": { en: "Father's Name", hi: "पिता का नाम", ma: "पिताजी के नाम" },
  "biodata_maker_mother": { en: "Mother's Name", hi: "माता का नाम", ma: "माताजी के नाम" },
  "biodata_maker_siblings": { en: "Siblings Detail", hi: "भाई-बहन का विवरण", ma: "भाई-बहिन के विवरण" },
  "biodata_maker_street": { en: "Street / Village", hi: "सड़क / गांव", ma: "सड़क / गाम" },
  "biodata_maker_city": { en: "City / District", hi: "शहर / जिला", ma: "शहर / जिला" },
  "biodata_maker_state": { en: "State", hi: "राज्य", ma: "राज्य" },
  "biodata_maker_pincode": { en: "Pincode *", hi: "पिनकोड *", ma: "पिनकोड *" },
  "biodata_maker_btn_choose_template": { en: "Choose Template", hi: "टेम्पलेट चुनें", ma: "टेम्पलेट चुनू" },
  "biodata_maker_btn_preview": { en: "Preview", hi: "पूर्वावलोकन", ma: "पूर्वावलोकन" },
  "biodata_maker_btn_send_otp": { en: "Send OTP & Download", hi: "OTP भेजें और डाउनलोड करें", ma: "OTP पठाऊ आ डाउनलोड करू" },
  "biodata_maker_btn_verify_dl": { en: "Verify & Download", hi: "सत्यापित करें और डाउनलोड करें", ma: "सत्यापित करू आ डाउनलोड करू" },
  "biodata_maker_btn_back": { en: "Back", hi: "पीछे", ma: "पाछाँ" }
};

['en', 'hi', 'ma'].forEach(lang => {
  const path = `./src/locales/${lang}.json`;
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  for (const [key, trans] of Object.entries(keys)) {
    data[key] = trans[lang];
  }
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
});
console.log('updated locales');
