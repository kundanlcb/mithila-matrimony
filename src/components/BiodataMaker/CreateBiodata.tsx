import React, { useState, useRef } from 'react';
import { RegistrationChat } from '../RegistrationChat';

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

import { 
  type BiodataData, 
  TemplateClassic, 
  TemplateModern, 
  TemplateElegant, 
  TemplateMinimal, 
  TemplateTraditional 
} from './BiodataTemplates';


export const CreateBiodata: React.FC<{
  onClose: () => void;
  onSuccess: (email: string) => void;
}> = ({ onSuccess }) => {



  const [formData, setFormData] = useState<BiodataData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1);

  const [errorMsg, setErrorMsg] = useState('');
  const printRef = useRef<HTMLDivElement>(null);

  const downloadPDFFromChat = async (_templateName: string, data: any) => {
    // We already have selectedTemplate from the initial screen, so we ignore templateName from chat.
    
    // Map Chat data to BiodataData format required by Templates
    const mappedData: BiodataData = {
      fullName: data.fullName,
      gender: data.gender,
      dob: data.age ? `${2026 - data.age}-01-01` : '1999-01-01', // Approx DOB based on age
      birthPlace: data.location,
      height: data.height,
      complexion: data.complexion,
      education: data.education,
      profession: data.profession,
      income: data.annualIncome ? data.annualIncome.toString() : '',
      gotra: data.gotra,
      mool: data.mool || '',
      grandparentName: '',
      fatherName: '',
      motherName: '',
      siblingsDetail: '',
      ruralAddress: { streetAddress: '', city: data.location, state: '', pincode: '' },
      urbanAddress: { streetAddress: '', city: data.location, state: '', pincode: '' },
      photoUrl: data.photoUrl
    };
    setFormData(mappedData);

    // Give React a tick to render the hidden template with new data before capturing
    setTimeout(async () => {
      if (!printRef.current) return;
      try {
        const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${mappedData.fullName.replace(/\s+/g, '_')}_Biodata.pdf`);
      } catch (err) {
        console.error('PDF Generation Error', err);
        setErrorMsg('Failed to generate PDF. Please try again.');
      }
    }, 500);
  };
  


  const renderTemplate = (isThumbnail = false, id?: string) => {
    if (!formData) return null;
    const props = { data: formData, id };
    const content = (() => {
      switch (selectedTemplate) {
        case 1: return <TemplateClassic {...props} />;
        case 2: return <TemplateModern {...props} />;
        case 3: return <TemplateElegant {...props} />;
        case 4: return <TemplateMinimal {...props} />;
        case 5: return <TemplateTraditional {...props} />;
        default: return <TemplateClassic {...props} />;
      }
    })();
    
    if (isThumbnail) {
      return <div style={{ transform: 'scale(0.3)', transformOrigin: 'top left', width: '330%', pointerEvents: 'none' }}>{content}</div>;
    }
    return content;
  };

  const [hasSelectedTemplate, setHasSelectedTemplate] = useState<boolean>(false);

  if (!hasSelectedTemplate) {
    return (
      <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', padding: '3rem 1rem' }} className="animate-fade">
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: 'var(--text-headers)', fontFamily: 'var(--font-serif)', fontSize: '2.5rem' }}>Select a Biodata Template</h2>
        <p style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--text-muted)' }}>Choose a premium design for your Mithila Biodata before providing your details.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {['TemplateClassic', 'TemplateModern', 'TemplateElegant'].map(tpl => {
            const templateMap: Record<string, number> = {
              'TemplateClassic': 1,
              'TemplateModern': 2,
              'TemplateElegant': 3
            };
            const tplIndex = templateMap[tpl];
            
            return (
              <button
                key={tpl}
                onClick={() => {
                  setSelectedTemplate(tplIndex);
                  setHasSelectedTemplate(true);
                }}
                style={{
                  padding: '2rem',
                  border: '2px solid transparent',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-card)',
                  cursor: 'pointer',
                  fontWeight: '700',
                  color: 'var(--text-main)',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                  outline: 'none'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
              >
                <div style={{ fontSize: '4rem' }}>📄</div>
                <div style={{ fontSize: '1.2rem', color: 'var(--text-headers)' }}>{tpl.replace('Template', '')} Design</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ padding: 0, height: '100%', overflow: 'hidden' }}>
        {errorMsg && <div style={{ padding: '10px', backgroundColor: '#ffebee', color: '#c62828', marginBottom: '15px', borderRadius: '4px' }}>{errorMsg}</div>}
        
        <RegistrationChat 
          mode="biodata" 
          onComplete={() => onSuccess('')} 
          onDownloadBiodata={downloadPDFFromChat}
        />

        {/* Hidden area for rendering the template to PDF */}
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0 }}>
          <div ref={printRef} style={{ width: '794px', backgroundColor: 'white' }}>
            {formData && renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
};



