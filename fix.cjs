const fs = require('fs');

// 1. CreateBiodata.tsx
let cbPath = './src/components/BiodataMaker/CreateBiodata.tsx';
let cbContent = fs.readFileSync(cbPath, 'utf8');

cbContent = cbContent.replace("import { CustomSelect } from '../CustomSelect';", "import { Select } from '../ui/Select';\nimport { Modal } from '../ui/Modal';");
cbContent = cbContent.replace(/<CustomSelect name="([^"]+)" value=\{formData\.[^\}]+\} onChange=\{handleInputChange\}/g, (match, name) => {
  return `<Select name="${name}" value={formData.${name}} onValueChange={(v) => handleInputChange({target: {name: '${name}', value: v}} as any)}`;
});

// Replace the modal opening
cbContent = cbContent.replace(
  /<div style=\{styles\.overlay\}>\s*<div style=\{styles\.modal\}>\s*<div style=\{styles\.header\}>\s*<h2>([^<]+)<\/h2>\s*<button onClick=\{onClose\} style=\{styles\.closeButton\}>\&times;<\/button>\s*<\/div>\s*<div style=\{styles\.body\}>/,
  (match, title) => `<Modal open={true} onOpenChange={(o) => !o && onClose()} title="${title}" contentStyle={{maxWidth: '900px'}}>`
);

// Replace the modal closing (last </div></div></div> before the return closing)
// We know it's right before `  );` and `};`
cbContent = cbContent.replace(/<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\};/g, '</Modal>\n  );\n};');
fs.writeFileSync(cbPath, cbContent);

// 2. ProfileDetail.tsx
let pdPath = './src/components/ProfileDetail.tsx';
let pdContent = fs.readFileSync(pdPath, 'utf8');
pdContent = pdContent.replace("import React from 'react';", "import React from 'react';\nimport { Modal } from './ui/Modal';");
pdContent = pdContent.replace(
  /<div className="modal-overlay animate-fade" style=\{styles\.overlay\}\s*onClick=\{onClose\}\s*>\s*<div className="modal-content animate-scale" style=\{styles\.modal\}\s*onClick=\{\(e\) => e\.stopPropagation\(\)\}\s*>\s*<button className="close-button" onClick=\{onClose\} style=\{styles\.closeButton\}>\s*\&times;\s*<\/button>/, 
  `<Modal open={true} onOpenChange={(o) => !o && onClose()} contentStyle={{maxWidth: '600px', width: '90%'}}>`
);
pdContent = pdContent.replace(/<\/div>\s*<\/div>\s*\)\s*;\s*\}\s*;\s*const styles = \{/, `</Modal>\n  );\n};\n\nconst styles = {`);
fs.writeFileSync(pdPath, pdContent);

console.log('fixed manually');
