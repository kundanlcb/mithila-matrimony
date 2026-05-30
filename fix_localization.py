import re
import json

with open('src/App.tsx', 'r') as f:
    content = f.read()

pattern = re.compile(r"\{locale === 'en' \? '([^']+)' : locale === 'hi' \? '([^']+)' : '([^']+)'\}")
matches = pattern.findall(content)

with open('src/locales/en.json', 'r') as f: en = json.load(f)
with open('src/locales/hi.json', 'r') as f: hi = json.load(f)
with open('src/locales/ma.json', 'r') as f: ma = json.load(f)

for m in matches:
    en_txt, hi_txt, ma_txt = m
    # Generate key from english text
    key = "app_" + re.sub(r'[^a-zA-Z0-9]', '_', en_txt.lower())
    key = re.sub(r'_+', '_', key).strip('_')
    
    # basic maithili corrections if ma_txt is same as hi_txt
    if ma_txt == hi_txt:
        ma_txt = ma_txt.replace('करें', 'करू').replace('खोजें', 'खोजू').replace('हैं', 'छथि').replace('है', 'अछि').replace('आपका', 'अहाँक').replace('आप', 'अहाँ').replace('अपना', 'अपन').replace('देखें', 'देखू').replace('भेजें', 'भेजू')
    
    en[key] = en_txt
    hi[key] = hi_txt
    ma[key] = ma_txt
    
    # replace in content
    original = f"{{locale === 'en' ? '{en_txt}' : locale === 'hi' ? '{hi_txt}' : '{m[2]}'}}"
    content = content.replace(original, f"{{t('{key}')}}")

with open('src/locales/en.json', 'w') as f: json.dump(en, f, indent=2, ensure_ascii=False)
with open('src/locales/hi.json', 'w') as f: json.dump(hi, f, indent=2, ensure_ascii=False)
with open('src/locales/ma.json', 'w') as f: json.dump(ma, f, indent=2, ensure_ascii=False)
with open('src/App.tsx', 'w') as f: f.write(content)

print(f"Replaced {len(matches)} localization strings.")
