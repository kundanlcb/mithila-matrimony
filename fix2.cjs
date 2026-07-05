const fs = require('fs');

// CreateBiodata.tsx
let cbPath = './src/components/BiodataMaker/CreateBiodata.tsx';
let cbContent = fs.readFileSync(cbPath, 'utf8');

cbContent = cbContent.replace("import { CustomSelect } from '../CustomSelect';", "import { Select } from '../ui/Select';\nimport { Modal } from '../ui/Modal';");
cbContent = cbContent.replace(/<CustomSelect name="([^"]+)" value=\{formData\.[^\}]+\} onChange=\{handleInputChange\}/g, (match, name) => {
  return `<Select name="${name}" value={formData.${name}} onValueChange={(v) => handleInputChange({target: {name: '${name}', value: v}} as any)}`;
});

cbContent = cbContent.replace(/<div style=\{styles\.overlay\}>\s*<div style=\{styles\.modal\}>\s*<div style=\{styles\.header\}>\s*<h2 style=\{\{ margin: 0, color: 'var\(--primary-dark\)' \}\}>\s*\{step === 1 \? t\('biodata_maker_title_step1'\) : step === 2 \? t\('biodata_maker_title_step2'\) : step === 3 \? t\('biodata_maker_title_step3'\) : step === 4 \? t\('biodata_maker_title_step4'\) : t\('biodata_maker_title_step5'\)\}\s*<\/h2>\s*<button onClick=\{onClose\} style=\{styles\.closeButton\}>\&times;<\/button>\s*<\/div>\s*<div style=\{styles\.body\}>/g, 
  `<Modal open={true} onOpenChange={(o) => !o && onClose()} hideCloseButton={true} contentStyle={{maxWidth: '900px', padding: 0}}>
      <div style={{...styles.header, borderBottom: '1px solid #eee'}}>
        <h2 style={{ margin: 0, color: 'var(--primary-dark)' }}>
          {step === 1 ? t('biodata_maker_title_step1') : step === 2 ? t('biodata_maker_title_step2') : step === 3 ? t('biodata_maker_title_step3') : step === 4 ? t('biodata_maker_title_step4') : t('biodata_maker_title_step5')}
        </h2>
        <button onClick={onClose} style={styles.closeButton}>&times;</button>
      </div>
      <div style={styles.body}>`);

cbContent = cbContent.replace(/<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\};/g, '      </div>\n    </Modal>\n  );\n};');
fs.writeFileSync(cbPath, cbContent);

// App.tsx
let appPath = './src/App.tsx';
let appContent = fs.readFileSync(appPath, 'utf8');

if (!appContent.includes('import { Modal }')) {
  appContent = appContent.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { Modal } from './components/ui/Modal';");
}

// Edit Modal
appContent = appContent.replace(/<div className="modal-overlay animate-fade" style=\{styles\.overlay\}>\s*<div className="modal-content animate-scale" style=\{styles\.modal\}>\s*<button onClick=\{\(\) => setProfileModalView\(null\)\} style=\{\{\s*position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var\(--text-muted\)'\s*\}\}>\s*\&times;\s*<\/button>\s*<div style=\{\{ padding: '2rem' \}\}>\s*<h2 style=\{\{ margin: '0 0 1\.5rem 0', color: 'var\(--text-dark\)' \}\}>\{t\('app_edit_profile'\)\}<\/h2>/,
  `<Modal open={true} onOpenChange={(o) => !o && setProfileModalView(null)} contentStyle={{maxWidth: '600px', width: '90%', padding: '2rem'}}>
                <h2 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-dark)' }}>{t('app_edit_profile')}</h2>`);

// Pref Modal
appContent = appContent.replace(/<div className="modal-overlay animate-fade" style=\{styles\.overlay\}>\s*<div className="modal-content animate-scale" style=\{styles\.modal\}>\s*<button onClick=\{\(\) => setProfileModalView\(null\)\} style=\{\{\s*position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var\(--text-muted\)'\s*\}\}>\s*\&times;\s*<\/button>\s*<div style=\{\{ padding: '2rem' \}\}>\s*<h2 style=\{\{ margin: '0 0 1\.5rem 0', color: 'var\(--text-dark\)' \}\}>\{t\('app_preferences'\)\}<\/h2>/,
  `<Modal open={true} onOpenChange={(o) => !o && setProfileModalView(null)} contentStyle={{maxWidth: '600px', width: '90%', padding: '2rem'}}>
                <h2 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-dark)' }}>{t('app_preferences')}</h2>`);

// Privacy Modal
appContent = appContent.replace(/<div className="modal-overlay animate-fade" style=\{styles\.overlay\}>\s*<div className="modal-content animate-scale" style=\{styles\.modal\}>\s*<button onClick=\{\(\) => setProfileModalView\(null\)\} style=\{\{\s*position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var\(--text-muted\)'\s*\}\}>\s*\&times;\s*<\/button>\s*<div style=\{\{ padding: '2rem' \}\}>\s*<h2 style=\{\{ margin: '0 0 1\.5rem 0', color: 'var\(--text-dark\)' \}\}>\{t\('app_privacy_settings'\)\}<\/h2>/,
  `<Modal open={true} onOpenChange={(o) => !o && setProfileModalView(null)} contentStyle={{maxWidth: '600px', width: '90%', padding: '2rem'}}>
                <h2 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-dark)' }}>{t('app_privacy_settings')}</h2>`);

// Close tags for all 3 Modals
appContent = appContent.replace(/<\/div>\s*<\/div>\s*<\/div>\s*\)\s*\}/g, '</Modal>\n            )}');

fs.writeFileSync(appPath, appContent);
console.log('done fixing correctly');
