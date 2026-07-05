const fs = require('fs');

// 1. Delete CustomSelect
if (fs.existsSync('./src/components/CustomSelect.tsx')) {
  fs.unlinkSync('./src/components/CustomSelect.tsx');
}

// 2. Refactor CreateBiodata.tsx
let cbPath = './src/components/BiodataMaker/CreateBiodata.tsx';
let cbContent = fs.readFileSync(cbPath, 'utf8');

cbContent = cbContent.replace("import { CustomSelect } from '../CustomSelect';", "import { Select } from '../ui/Select';\nimport { Modal } from '../ui/Modal';");
cbContent = cbContent.replace(/<CustomSelect name="([^"]+)" value=\{formData\.[^\}]+\} onChange=\{handleInputChange\}/g, (match, name) => {
  return `<Select name="${name}" value={formData.${name}} onValueChange={(v) => handleInputChange({target: {name: '${name}', value: v}} as any)}`;
});

// CreateBiodata Modal replacement
const modalStartRegex = /<div style=\{styles\.overlay\}>\s*<div style=\{styles\.modal\}>\s*<div style=\{styles\.header\}>\s*<h2>([^<]+)<\/h2>\s*<button onClick=\{onClose\} style=\{styles\.closeButton\}>\&times;<\/button>\s*<\/div>\s*<div style=\{styles\.body\}>/;
cbContent = cbContent.replace(modalStartRegex, (match, title) => {
  return `<Modal open={true} onOpenChange={(o) => !o && onClose()} title="${title}" contentStyle={{maxWidth: '900px'}}>`;
});
const modalEndRegex = /<\/div>\s*<\/div>\s*<\/div>/;
cbContent = cbContent.replace(modalEndRegex, '</Modal>');

fs.writeFileSync(cbPath, cbContent);

// 3. Refactor PremiumPaywall.tsx
let ppPath = './src/components/PremiumPaywall.tsx';
let ppContent = fs.readFileSync(ppPath, 'utf8');
if (ppContent.includes('styles.overlay')) {
  ppContent = ppContent.replace("import React from 'react';", "import React from 'react';\nimport { Modal } from './ui/Modal';");
  ppContent = ppContent.replace(/<div className="modal-overlay animate-fade" style=\{styles\.overlay\}>\s*<div className="modal-content animate-scale" style=\{styles\.modal\}>/, `<Modal open={true} onOpenChange={(o) => !o && onClose()} hideCloseButton={true}>`);
  ppContent = ppContent.replace(/<\/div>\s*<\/div>\s*\)\s*;\s*\}\s*;\s*const styles = \{/, `</Modal>\n  );\n};\n\nconst styles = {`);
  fs.writeFileSync(ppPath, ppContent);
}

// 4. Refactor ProfileDetail.tsx Modal
let pdPath = './src/components/ProfileDetail.tsx';
let pdContent = fs.readFileSync(pdPath, 'utf8');
if (pdContent.includes('styles.overlay')) {
  pdContent = pdContent.replace("import React from 'react';", "import React from 'react';\nimport { Modal } from './ui/Modal';");
  pdContent = pdContent.replace(/<div className="modal-overlay animate-fade" style=\{styles\.overlay\}\s*onClick=\{onClose\}\s*>\s*<div className="modal-content animate-scale" style=\{styles\.modal\}\s*onClick=\{\(e\) => e\.stopPropagation\(\)\}\s*>\s*<button className="close-button" onClick=\{onClose\} style=\{styles\.closeButton\}>\s*\&times;\s*<\/button>/, `<Modal open={true} onOpenChange={(o) => !o && onClose()} contentStyle={{maxWidth: '600px', width: '90%'}}>`);
  pdContent = pdContent.replace(/<\/div>\s*<\/div>\s*\)\s*;\s*\}\s*;\s*const styles = \{/, `</Modal>\n  );\n};\n\nconst styles = {`);
  fs.writeFileSync(pdPath, pdContent);
}

console.log('updated modals');
