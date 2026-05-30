import json

def update_json(file_path, updates):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    data.update(updates)
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

en_updates = {
    "auth_subtitle_login": "Login with your phone and password",
    "auth_subtitle_register": "Register with a one-time password",
    "auth_tab_login": "Login",
    "auth_tab_register": "Register",
    "auth_title_login": "Welcome Back",
    "auth_title_register": "Create Account",
    "label_password": "Password",
    "bot_set_password": "Please set a secure password for your account (min 6 chars).",
    "error_short_password": "Password must be at least 6 characters.",
    "btn_login": "Login"
}

hi_updates = {
    "auth_subtitle_login": "अपने फोन नंबर और पासवर्ड के साथ लॉग इन करें",
    "auth_subtitle_register": "वन-टाइम पासवर्ड के साथ रजिस्टर करें",
    "auth_tab_login": "लॉग इन",
    "auth_tab_register": "रजिस्टर",
    "auth_title_login": "वापसी पर स्वागत है",
    "auth_title_register": "खाता बनाएं",
    "label_password": "पासवर्ड",
    "bot_set_password": "कृपया अपने खाते के लिए एक सुरक्षित पासवर्ड सेट करें (कम से कम 6 अक्षर)।",
    "error_short_password": "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",
    "btn_login": "लॉग इन"
}

update_json('src/locales/en.json', en_updates)
update_json('src/locales/hi.json', hi_updates)
