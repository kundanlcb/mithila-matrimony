import re

path = 'src/components/RegistrationChat.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    # bot responses
    (r"triggerBotResponse\(locale === 'en' \? 'Where were you born\? \(Birth Place\)' : 'आपका जन्म स्थान क्या है\?', 'text'\);",
     r"triggerBotResponse(t('bot_birth_place'), 'text');"),
    (r"triggerBotResponse\(locale === 'en' \? 'What is your Mool\?' : 'आपका मूल क्या है\?', 'text'\);",
     r"triggerBotResponse(t('bot_mool'), 'text');"),
    (r"triggerBotResponse\(locale === 'en' \? 'What is your Father\\\'s Name\?' : 'आपके पिता का क्या नाम है\?', 'text'\);",
     r"triggerBotResponse(t('bot_father_name'), 'text');"),
    (r"triggerBotResponse\(locale === 'en' \? 'What is your Mother\\\'s Name\?' : 'आपकी माता का क्या नाम है\?', 'text'\);",
     r"triggerBotResponse(t('bot_mother_name'), 'text');"),
    (r"triggerBotResponse\(locale === 'en' \? 'What is your Grandparent\\\'s Name\?' : 'आपके दादा/दादी का क्या नाम है\?', 'text'\);",
     r"triggerBotResponse(t('bot_grandparent_name'), 'text');"),
    (r"triggerBotResponse\(locale === 'en' \? 'Any details about your siblings\? \(e\.g\. 1 Brother, 1 Sister\)' : 'आपके भाई-बहनों के बारे में कोई विवरण\? \(उदा\. 1 भाई, 1 बहन\)', 'text'\);",
     r"triggerBotResponse(t('bot_siblings'), 'text');"),
    (r"triggerBotResponse\(locale === 'en' \? 'Which City do you currently live in\?' : 'आप वर्तमान में किस शहर में रहते हैं\?', 'text'\);",
     r"triggerBotResponse(t('bot_city'), 'text');"),
    (r"triggerBotResponse\(locale === 'en' \? 'Which State do you currently live in\?' : 'आप वर्तमान में किस राज्य में रहते हैं\?', 'text'\);",
     r"triggerBotResponse(t('bot_state'), 'text');"),
    (r"triggerBotResponse\(locale === 'en' \? 'What is your current Pincode\?' : 'आपका वर्तमान पिनकोड क्या है\?', 'text'\);",
     r"triggerBotResponse(t('bot_pincode'), 'text');"),
    (r"triggerBotResponse\(locale === 'en' \? 'What is your locality/colony/village\?' : 'आपका मोहल्ला/कॉलोनी/गांव क्या है\?', 'text'\);",
     r"triggerBotResponse(t('bot_locality'), 'text');"),
    (r"triggerBotResponse\(locale === 'en' \? 'What is your Native District\?' : 'आपका मूल जिला क्या है\?', 'text'\);",
     r"triggerBotResponse(t('bot_native_district'), 'text');"),
    (r"triggerBotResponse\(locale === 'en' \? 'OTP sent! Please enter the 6-digit code\. \(Check your spam/junk folder if not in primary inbox\)' : 'OTP भेजा गया! कृपया 6-अंकीय कोड दर्ज करें। \(यदि प्राइमरी इनबॉक्स में नहीं है, तो कृपया अपना स्पैम/जंक फ़ोल्डर जांचें\)', 'text'\);",
     r"triggerBotResponse(t('bot_otp_sent'), 'text');"),
    (r"triggerBotResponse\(locale === 'en' \? 'Profile saved and Biodata downloading! Taking you to matches\.\.\.' : 'प्रोफ़ाइल सहेजी गई और बायोडेटा डाउनलोड हो रहा है! आपको मैचों पर ले जा रहे हैं\.\.\.', 'text'\);",
     r"triggerBotResponse(t('bot_profile_saved'), 'text');"),
    (r"triggerBotResponse\(locale === 'en' \? 'Awesome! Now, choose a premium design for your Biodata\.' : 'बहुत बढ़िया! अब, अपने बायोडेटा के लिए एक प्रीमियम डिज़ाइन चुनें।', 'template'\);",
     r"triggerBotResponse(t('bot_choose_design'), 'template');"),
    (r"triggerBotResponse\(locale === 'en' \? 'Great choice! Please provide your email to save and download your Biodata\.' : 'बढ़िया विकल्प! अपना बायोडेटा सहेजने और डाउनलोड करने के लिए कृपया अपना ईमेल प्रदान करें।', 'text'\);",
     r"triggerBotResponse(t('bot_provide_email_download'), 'text');"),
    (r"triggerBotResponse\(locale === 'en' \? 'OTP resent! Please check your email\. \(Check your spam/junk folder if not in primary inbox\)' : 'OTP फिर से भेज दिया गया! कृपया अपना ईमेल जांचें। \(यदि प्राइमरी इनबॉक्स में नहीं है, तो कृपया अपना स्पैम/जंक फ़ोल्डर जांचें\)', 'text'\);",
     r"triggerBotResponse(t('bot_otp_resent'), 'text');"),
    (r"triggerBotResponse\(locale === 'en' \? 'Please provide your new email address\.' : 'कृपया अपना नया ईमेल पता प्रदान करें।', 'text'\);",
     r"triggerBotResponse(t('bot_provide_new_email'), 'text');"),

    # error messages
    (r"setErrorMsg\('Failed to set password: ' \+ err\.message\);",
     r"setErrorMsg(t('error_set_password') + err.message);"),
    (r"setErrorMsg\(locale === 'en' \? 'Please enter a valid phone number\.' : 'कृपया एक वैध फ़ोन नंबर दर्ज करें।'\);",
     r"setErrorMsg(t('error_invalid_phone'));"),
    (r"setErrorMsg\(locale === 'en' \? 'Please enter a valid email\.' : 'कृपया एक वैध ईमेल दर्ज करें।'\);",
     r"setErrorMsg(t('error_invalid_email_bot'));"),
    (r"setErrorMsg\(locale === 'en' \? 'Failed to send OTP\. Try again\.' : 'OTP भेजने में विफल। पुनः प्रयास करें।'\);",
     r"setErrorMsg(t('error_send_otp_failed'));"),
    (r"setErrorMsg\(locale === 'en' \? 'OTP must be 6 digits\.' : 'OTP 6 अंकों का होना चाहिए।'\);",
     r"setErrorMsg(t('error_otp_length'));"),
    (r"setErrorMsg\(locale === 'en' \? 'Invalid OTP\. Please try again\.' : 'अमान्य OTP। कृपया पुनः प्रयास करें।'\);",
     r"setErrorMsg(t('error_invalid_otp_bot'));"),
    (r"setErrorMsg\(locale === 'en' \? 'File size exceeds 2MB limit\.' : 'फ़ाइल का आकार 2MB सीमा से अधिक है।'\);",
     r"setErrorMsg(t('error_file_size'));"),
    (r"setErrorMsg\(`Upload failed: \$\{err\.message\}`\);",
     r"setErrorMsg(`${t('error_upload_failed')}${err.message}`);"),
    (r"setErrorMsg\('Failed to complete registration\. Please try again\.'\);",
     r"setErrorMsg(t('error_registration_failed'));"),
    (r"setErrorMsg\(locale === 'en' \? 'Failed to resend OTP\.' : 'OTP दोबारा भेजने में विफल।'\);",
     r"setErrorMsg(t('error_resend_otp_failed'));"),
]

for target, replacement in replacements:
    content = re.sub(target, replacement, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("RegistrationChat.tsx updated successfully.")
