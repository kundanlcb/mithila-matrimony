import json
import re
import os

# 1. Update locales
locales = {
    'en': {
        "biodata_maker_hobbies": "Hobbies & Interests",
        "biodata_maker_native_district": "Native District",
        "biodata_maker_about_me": "About Me"
    },
    'hi': {
        "biodata_maker_hobbies": "शौक और रुचियां",
        "biodata_maker_native_district": "मूल जिला (Native District)",
        "biodata_maker_about_me": "मेरे बारे में"
    },
    'ma': {
        "biodata_maker_hobbies": "शौक आ रुचि",
        "biodata_maker_native_district": "मूल जिला",
        "biodata_maker_about_me": "हमर बारे मे"
    }
}

for lang, new_keys in locales.items():
    file_path = f'src/locales/{lang}.json'
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for k, v in new_keys.items():
        if k not in data:
            data[k] = v
            
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# 2. Update BiodataData interface in BiodataTemplates.tsx
template_path = 'src/components/BiodataMaker/BiodataTemplates.tsx'
with open(template_path, 'r', encoding='utf-8') as f:
    t_content = f.read()

interface_addition = """  siblingsDetail: string;
  interests?: string[];
  nativeDistrict?: string;
  aboutMe?: string;"""

t_content = re.sub(r"  siblingsDetail: string;", interface_addition, t_content)

# 3. Add to BiodataTemplate JSX
about_section = """        {/* Family Details */}
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '1px', margin: '0 0 25px 0', color: theme.mainText, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '8px', height: '20px', backgroundColor: theme.primary, borderRadius: '4px' }}></span>
            {t('biodata_maker_family')}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', width: '100%' }}>
            <div><span style={labelStyle}>{t('biodata_maker_father')}</span> <strong style={valueStyle}>{data.fatherName || t('not_specified')}</strong></div>
            <div><span style={labelStyle}>{t('biodata_maker_mother')}</span> <strong style={valueStyle}>{data.motherName || t('not_specified')}</strong></div>
            <div><span style={labelStyle}>{t('biodata_maker_grandparent')}</span> <strong style={valueStyle}>{data.grandparentName || t('not_specified')}</strong></div>
            <div><span style={labelStyle}>{t('biodata_maker_siblings')}</span> <strong style={valueStyle}>{data.siblingsDetail || t('not_specified')}</strong></div>
            <div><span style={labelStyle}>{t('biodata_maker_native_district')}</span> <strong style={valueStyle}>{data.nativeDistrict || t('not_specified')}</strong></div>
          </div>
        </div>

        {/* About & Interests */}
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '1px', margin: '0 0 25px 0', color: theme.mainText, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '8px', height: '20px', backgroundColor: theme.primary, borderRadius: '4px' }}></span>
            {t('biodata_maker_about_me')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
             {data.aboutMe && <div style={{ fontSize: '15px', lineHeight: '1.6', color: theme.mainText }}>{data.aboutMe}</div>}
             {data.interests && data.interests.length > 0 && (
               <div style={{ marginTop: '10px' }}>
                 <span style={labelStyle}>{t('biodata_maker_hobbies')}: </span>
                 <strong style={valueStyle}>{data.interests.join(', ')}</strong>
               </div>
             )}
          </div>
        </div>"""

# Replace the old Family Details block entirely
t_content = re.sub(r"\s*\{\/\* Family Details \*\/\}.*?(?=\s*<\/div>\s*<\/div>\s*\);)", "\n" + about_section, t_content, flags=re.DOTALL)

with open(template_path, 'w', encoding='utf-8') as f:
    f.write(t_content)

# 4. Update RegistrationChat.tsx mapping
chat_path = 'src/components/RegistrationChat.tsx'
with open(chat_path, 'r', encoding='utf-8') as f:
    c_content = f.read()

mapped_data_addition = """              siblingsDetail: biodataForm.siblingsDetail || '',
              interests: (biodataForm as any).interests || [],
              nativeDistrict: (biodataForm as any).nativeDistrict || '',
              aboutMe: biodataForm.aboutMe || '',"""

c_content = re.sub(r"              siblingsDetail: biodataForm\.siblingsDetail \|\| '',", mapped_data_addition, c_content)

with open(chat_path, 'w', encoding='utf-8') as f:
    f.write(c_content)

print("Files updated successfully.")
