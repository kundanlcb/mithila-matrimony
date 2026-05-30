import re

def hi_to_ma(text):
    mapping = {
        'हैं': 'छथि', 'है': 'अछि', 'हूँ': 'छी', 'आप': 'अहाँ', 'आपका': 'अहाँक',
        'आपकी': 'अहाँक', 'आपके': 'अहाँक', 'मैं': 'हम', 'मेरा': 'हमर', 'मेरी': 'हमर',
        'मेरे': 'हमर', 'क्या': 'की', 'क्यों': 'कियैक', 'कैसे': 'कहिना', 'यहाँ': 'एतय',
        'वहाँ': 'ओतय', 'और': 'आ', 'में': 'मे', 'से': 'सँ', 'को': 'केँ',
        'करें': 'करू', 'का': 'क', 'की': 'क', 'के': 'क', 'यह': 'ई', 'वह': 'ओ',
        'खोजें': 'खोजू', 'देखें': 'देखू', 'बनाएं': 'बनाउ', 'जुड़ें': 'जुड़ू',
        'अपना': 'अपन', 'अपनी': 'अपन', 'अपने': 'अपन', 'बहुत': 'बड्ड', 'अच्छा': 'नीक',
        'कोई': 'कोनो', 'नहीं': 'नहि', 'साथ': 'संग', 'हमारा': 'हमर', 'हमारी': 'हमर',
        'हमारे': 'हमर', 'कौन': 'के', 'हम': 'हम', 'गया': 'गेल', 'गयी': 'गेल', 'गए': 'गेल'
    }
    
    words = text.split()
    translated = []
    for w in words:
        clean_w = re.sub(r'[^\w\s]', '', w)
        if clean_w in mapping:
            w = w.replace(clean_w, mapping[clean_w])
        translated.append(w)
        
    res = " ".join(translated)
    res = res.replace('कर सकते हैं', 'कऽ सकैत छी')
    res = res.replace('जाता है', 'जाइत अछि')
    res = res.replace('होना चाहिए', 'हेबाक चाही')
    res = res.replace('होनी चाहिए', 'हेबाक चाही')
    res = res.replace('बनाएं', 'बनाउ')
    res = res.replace('खोजें', 'खोजू')
    res = res.replace('देखें', 'देखू')
    res = res.replace('भेजें', 'भेजू')
    res = res.replace('करें', 'करू')
    res = res.replace('अपनी', 'अपन')
    res = res.replace('अपना', 'अपन')
    res = res.replace('अपने', 'अपन')
    res = res.replace('क्या', 'की')
    res = res.replace('हैं', 'छथि')
    res = res.replace('है', 'अछि')
    res = res.replace('हूँ', 'छी')
    return res

with open('src/mock/translations.ts', 'r') as f:
    content = f.read()

def repl_ts(m):
    hi_text = m.group(1)
    ma_text = hi_to_ma(hi_text)
    return f'hi: "{hi_text}", ma: "{ma_text}"'

content = re.sub(r'hi:\s*"([^"\\]*(?:\\.[^"\\]*)*)",\s*ma:\s*"[^"\\]*(?:\\.[^"\\]*)*"', repl_ts, content)

with open('src/mock/translations.ts', 'w') as f:
    f.write(content)

with open('src/App.tsx', 'r') as f:
    app_content = f.read()

def repl_app(m):
    en_text = m.group(1)
    hi_text = m.group(2)
    ma_text = hi_to_ma(hi_text)
    return f"locale === 'en' ? '{en_text}' : locale === 'hi' ? '{hi_text}' : '{ma_text}'"

app_content = re.sub(r"locale === 'en' \? '([^']*)' : '([^']*)'", repl_app, app_content)

with open('src/App.tsx', 'w') as f:
    f.write(app_content)

print("Translation update complete!")
