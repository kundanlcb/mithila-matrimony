import json

# 1. Update JSON files
def update_json(filepath, key, en_text, hi_text, ma_text, is_en=False, is_hi=False, is_ma=False):
    with open(filepath, 'r') as f:
        data = json.load(f)
    
    if is_en: data[key] = en_text
    if is_hi: data[key] = hi_text
    if is_ma: data[key] = ma_text
    
    # Also update trust_stat1_title
    if 'trust_stat1_title' in data:
        data['trust_stat1_title'] = data['trust_stat1_title'].replace('12K+', '1.2K+')
        
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

update_json('src/locales/en.json', 'app_footer_brand_desc', 'The premier cultural matrimonial portal tailored for global Maithil families. Designed with heritage aesthetics, secure gotra rules, and high-fidelity compatibility algorithms.', '', '', is_en=True)
update_json('src/locales/hi.json', 'app_footer_brand_desc', '', 'वैश्विक मैथिल परिवारों के लिए विशेष रूप से तैयार किया गया प्रमुख सांस्कृतिक विवाह मंच। समृद्ध सांस्कृतिक विरासत, सुरक्षित गोत्र नियमों और उच्च-सटीकता अनुकूलता एल्गोरिदम के साथ डिज़ाइन किया गया।', '', is_hi=True)
update_json('src/locales/ma.json', 'app_footer_brand_desc', '', '', 'वैश्विक मैथिल परिवारक लेल विशेष रूप सँ तैयार कएल गेल प्रमुख सांस्कृतिक विवाह मंच। समृद्ध सांस्कृतिक विरासत, सुरक्षित गोत्र नियम आ उच्च-सटीकता अनुकूलता एल्गोरिदमक संग डिजाइन कएल गेल।', is_ma=True)

# 2. Update App.tsx
with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace footer ternary with t('app_footer_brand_desc')
import re
footer_regex = re.compile(r"\{locale === 'en'\s*\?\s*'The premier cultural matrimonial portal[^']+'\s*:\s*locale === 'hi'\s*\?\s*'वैश्विक मैथिल परिवारों[^']+'\s*:\s*'वैश्विक मैथिल परिवारों[^']+'\}", re.DOTALL)
content = footer_regex.sub("{t('app_footer_brand_desc')}", content)

# Replace 12K+ with 1.2K+
content = content.replace(">12K+</h3>", ">1.2K+</h3>")
# Replace 99.8% with 94%
content = content.replace(">99.8%</h3>", ">94%</h3>")

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Updates applied successfully.")
