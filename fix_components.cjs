const fs = require('fs');

// CreateBiodata.tsx
let cbPath = './src/components/BiodataMaker/CreateBiodata.tsx';
let cbContent = fs.readFileSync(cbPath, 'utf8');

cbContent = cbContent.replace("import { CustomSelect } from '../CustomSelect';", "import { Select } from '../ui/Select';\nimport { Modal } from '../ui/Modal';");
cbContent = cbContent.replace(/<CustomSelect name="([^"]+)" value=\{formData\.[^\}]+\} onChange=\{handleInputChange\}/g, (match, name) => {
  return `<Select name="${name}" value={formData.${name}} onValueChange={(v) => handleInputChange({target: {name: '${name}', value: v}} as any)}`;
});

cbContent = cbContent.replace(
  `    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={{ margin: 0, color: 'var(--primary-dark)' }}>
            {step === 1 ? t('biodata_maker_title_step1') : step === 2 ? t('biodata_maker_title_step2') : step === 3 ? t('biodata_maker_title_step3') : step === 4 ? t('biodata_maker_title_step4') : t('biodata_maker_title_step5')}
          </h2>
          <button onClick={onClose} style={styles.closeButton}>&times;</button>
        </div>
        <div style={styles.body}>`,
  `    <Modal 
      open={true} 
      onOpenChange={(o) => !o && onClose()} 
      hideCloseButton={true} 
      contentStyle={{maxWidth: '900px', padding: 0}}
    >
      <div style={{...styles.header, borderBottom: '1px solid #eee'}}>
        <h2 style={{ margin: 0, color: 'var(--primary-dark)' }}>
          {step === 1 ? t('biodata_maker_title_step1') : step === 2 ? t('biodata_maker_title_step2') : step === 3 ? t('biodata_maker_title_step3') : step === 4 ? t('biodata_maker_title_step4') : t('biodata_maker_title_step5')}
        </h2>
        <button onClick={onClose} style={styles.closeButton}>&times;</button>
      </div>
      <div style={styles.body}>`
);

cbContent = cbContent.replace(
  `        </div>
      </div>
    </div>
  );
};`,
  `        </div>
      </div>
    </Modal>
  );
};`
);
fs.writeFileSync(cbPath, cbContent);

// ProfileDetail.tsx
let pdPath = './src/components/ProfileDetail.tsx';
let pdContent = fs.readFileSync(pdPath, 'utf8');

pdContent = pdContent.replace("import React from 'react';", "import React from 'react';\nimport { Modal } from './ui/Modal';");

pdContent = pdContent.replace(
  `    <div className="modal-overlay animate-fade" style={styles.overlay}>
      <div className="modal-content animate-scale" style={styles.modal}>
        <button onClick={onClose} style={styles.closeBtn} aria-label="Close">✕</button>`,
  `    <Modal open={true} onOpenChange={(o) => !o && onClose()} contentStyle={{maxWidth: '600px', width: '90%', padding: 0}} hideCloseButton={true}>`
);

pdContent = pdContent.replace(
  `      </div>
    </div>
  );
};`,
  `    </Modal>
  );
};`
);
fs.writeFileSync(pdPath, pdContent);

console.log('Fixed CreateBiodata and ProfileDetail');
