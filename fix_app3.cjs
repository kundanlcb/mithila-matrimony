const fs = require('fs');
let appPath = './src/App.tsx';
let appContent = fs.readFileSync(appPath, 'utf8');

if (!appContent.includes("import { Modal }")) {
  appContent = appContent.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { Modal } from './components/ui/Modal';");
}

appContent = appContent.replace(
  /\{\/\* PROFILE MODALS \*\/\}\s*\{profileModalView \&\& \(\s*<div style=\{\{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba\(0,0,0,0\.5\)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur\(4px\)' \}\}>\s*<div className="animate-scale" style=\{\{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', background: 'var\(--bg-card\)', borderRadius: '16px', padding: '2rem', position: 'relative' \}\}>\s*<button onClick=\{\(\) => setProfileModalView\(null\)\} style=\{\{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var\(--text-muted\)' \}\}>\s*<svg xmlns="http:\/\/www.w3.org\/2000\/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"><\/line><line x1="6" y1="6" x2="18" y2="18"><\/line><\/svg>\s*<\/button>/g,
  `{/* PROFILE MODALS */}
            {profileModalView && (
              <Modal open={true} onOpenChange={(o) => !o && setProfileModalView(null)} hideCloseButton={true} contentStyle={{maxWidth: '500px', width: '100%', padding: '2rem'}}>`
);

appContent = appContent.replace(
  /\s*<\/div>\s*<\/div>\s*\)\}\s*\{\/\* FOOTER \*\/\}/g,
  `\n              </Modal>\n            )}\n\n            {/* FOOTER */}`
);

fs.writeFileSync(appPath, appContent);
console.log('App fixed');
