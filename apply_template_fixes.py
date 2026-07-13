import re

path = 'src/components/BiodataMaker/BiodataTemplates.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add ReligionIcon component at the top
religion_icon_code = """
const ReligionIcon = ({ religion, color }: { religion: string, color: string }) => {
  const norm = religion?.toLowerCase() || 'hindu';
  const style = { fontSize: '32px', color: color, marginBottom: '20px', lineHeight: 1, fontWeight: 'bold' as const };
  
  if (norm === 'hindu') return <div style={style}>ॐ</div>;
  if (norm === 'muslim') return <div style={style}>☪</div>;
  if (norm === 'sikh') return <div style={style}>☬</div>;
  if (norm === 'christian') return <div style={style}>✝</div>;
  if (norm === 'jain') return <div style={style}>卐</div>;
  if (norm === 'buddhist') return <div style={style}>☸</div>;
  
  return <div style={{ width: '24px', height: '24px', backgroundColor: color, marginBottom: '25px', borderRadius: '4px' }}></div>;
};
"""

# Insert ReligionIcon before BiodataTemplate component
content = re.sub(
    r"(export const BiodataTemplate: React.FC)",
    religion_icon_code + r"\n\1",
    content
)

# 2. Replace the square box with ReligionIcon
content = re.sub(
    r"<div style={{ width: '24px', height: '24px', backgroundColor: theme\.primary, marginBottom: '25px', borderRadius: '4px' }}></div>",
    r"<ReligionIcon religion={data.religion || ''} color={theme.primary} />",
    content
)

# 3. Extract the "About & Interests" section
about_match = re.search(r"(\s*\{\/\* About & Interests \*\/\}.*?)(?=\s*<\/div>\s*<\/div>\s*\);)", content, re.DOTALL)
if about_match:
    about_section = about_match.group(1)
    
    # Remove it from the bottom
    content = content.replace(about_section, '')
    
    # Insert it right after {/* Full Width Sections */} \n <div style={{ display: 'flex', flexDirection: 'column', gap: '45px' }}>
    content = re.sub(
        r"(\{\/\* Full Width Sections \*\/\}\s*<div style=\{\{ display: 'flex', flexDirection: 'column', gap: '45px' \}\}>)",
        r"\1\n" + about_section,
        content
    )

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updates applied.")
