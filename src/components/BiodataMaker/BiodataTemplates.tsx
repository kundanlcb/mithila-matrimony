import React from 'react';

export type AddressFormData = {
  streetAddress: string;
  city: string;
  state: string;
  pincode: string;
};

export type BiodataData = {
  fullName: string;
  gender: 'Male' | 'Female';
  dob: string;
  birthPlace: string;
  height: string;
  complexion: string;
  education: string;
  profession: string;
  income: string;
  gotra: string;
  mool: string;
  grandparentName: string;
  fatherName: string;
  motherName: string;
  siblingsDetail: string;
  ruralAddress: AddressFormData;
  urbanAddress: AddressFormData;
  photoUrl: string;
};

type TemplateProps = {
  data: BiodataData;
  id?: string;
};

// --- Helper: Religion Symbol ---
const getReligionSymbol = (religion?: string) => {
  if (!religion) return 'ॐ';
  const r = religion.toLowerCase();
  if (r.includes('hindu')) return 'ॐ';
  if (r.includes('muslim') || r.includes('islam')) return '☪';
  if (r.includes('sikh')) return 'ੴ';
  if (r.includes('christian')) return '✝';
  if (r.includes('jain')) return '卐';
  if (r.includes('buddhis')) return '☸';
  return 'ॐ';
};

// --- Template 1: Classic Premium ---
export const TemplateClassic: React.FC<TemplateProps> = ({ data, id }) => (
  <div id={id} style={{ boxSizing: 'border-box', width: '794px', height: '1123px', fontFamily: '"Merriweather", "Georgia", serif', padding: '50px', backgroundColor: '#FFFAFA', color: '#333', border: '12px solid #8B0000', margin: '0 auto', overflow: 'hidden', position: 'relative' }}>
    <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', bottom: '10px', border: '1px solid #8B0000', pointerEvents: 'none' }}></div>
    <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '2px solid #8B0000', paddingBottom: '25px' }}>
      <h1 style={{ color: '#8B0000', fontSize: '38px', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '4px' }}>Biodata</h1>
      <h2 style={{ fontSize: '28px', margin: 0, fontWeight: 'normal', fontStyle: 'italic', color: '#4A4A4A' }}>{data.fullName}</h2>
    </div>
    
    <div style={{ display: 'flex', gap: '40px' }}>
      {data.photoUrl && (
        <div style={{ width: '180px', flexShrink: 0 }}>
          <img src={data.photoUrl} alt="Profile" style={{ width: '100%', height: '240px', objectFit: 'cover', border: '4px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '4px' }} crossOrigin="anonymous" />
        </div>
      )}
      <div style={{ flex: 1 }}>
        <h3 style={{ color: '#8B0000', borderBottom: '1px solid #EADDDD', paddingBottom: '8px', textTransform: 'uppercase', fontSize: '16px', letterSpacing: '1px', marginTop: 0 }}>Personal Details</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '25px', fontSize: '15px' }}>
          <tbody>
            <tr><td style={tCell}><strong>Date of Birth:</strong></td><td style={tCell}>{data.dob}</td></tr>
            <tr><td style={tCell}><strong>Birth Place:</strong></td><td style={tCell}>{data.birthPlace}</td></tr>
            <tr><td style={tCell}><strong>Height:</strong></td><td style={tCell}>{data.height}</td></tr>
            <tr><td style={tCell}><strong>Complexion:</strong></td><td style={tCell}>{data.complexion}</td></tr>
            <tr><td style={tCell}><strong>Gotra:</strong></td><td style={tCell}>{data.gotra}</td></tr>
            <tr><td style={tCell}><strong>Mool:</strong></td><td style={tCell}>{data.mool}</td></tr>
          </tbody>
        </table>

        <h3 style={{ color: '#8B0000', borderBottom: '1px solid #EADDDD', paddingBottom: '8px', textTransform: 'uppercase', fontSize: '16px', letterSpacing: '1px' }}>Education & Career</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '25px', fontSize: '15px' }}>
          <tbody>
            <tr><td style={tCell}><strong>Education:</strong></td><td style={tCell}>{data.education}</td></tr>
            <tr><td style={tCell}><strong>Profession:</strong></td><td style={tCell}>{data.profession}</td></tr>
            <tr><td style={tCell}><strong>Income:</strong></td><td style={tCell}>{data.income}</td></tr>
          </tbody>
        </table>

        <h3 style={{ color: '#8B0000', borderBottom: '1px solid #EADDDD', paddingBottom: '8px', textTransform: 'uppercase', fontSize: '16px', letterSpacing: '1px' }}>Family Details</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
          <tbody>
            <tr><td style={tCell}><strong>Grandparent's Name:</strong></td><td style={tCell}>{data.grandparentName || 'Not Specified'}</td></tr>
            <tr><td style={tCell}><strong>Father's Name:</strong></td><td style={tCell}>{data.fatherName || 'Not Specified'}</td></tr>
            <tr><td style={tCell}><strong>Mother's Name:</strong></td><td style={tCell}>{data.motherName || 'Not Specified'}</td></tr>
            <tr><td style={tCell}><strong>Siblings:</strong></td><td style={tCell}>{data.siblingsDetail || 'Not Specified'}</td></tr>
            <tr><td style={tCell}><strong>Native Address:</strong></td><td style={tCell}>{data.ruralAddress?.city || 'Not Specified'}, {data.ruralAddress?.state || ''}</td></tr>
            <tr><td style={tCell}><strong>Current Address:</strong></td><td style={tCell}>{data.urbanAddress?.city || 'Not Specified'}, {data.urbanAddress?.state || ''}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// --- Template 2: Modern Premium ---
export const TemplateModern: React.FC<TemplateProps> = ({ data, id }) => (
  <div id={id} style={{ boxSizing: 'border-box', width: '794px', height: '1123px', fontFamily: '"Inter", "Helvetica Neue", sans-serif', padding: '0', backgroundColor: '#F4F7F6', color: '#1A202C', margin: '0 auto', display: 'flex', overflow: 'hidden' }}>
    <div style={{ backgroundColor: '#1A202C', color: '#FFFFFF', width: '280px', padding: '40px 30px', display: 'flex', flexDirection: 'column' }}>
      {data.photoUrl && (
        <div style={{ alignSelf: 'center', marginBottom: '30px' }}>
          <img src={data.photoUrl} alt="Profile" style={{ width: '160px', height: '160px', objectFit: 'cover', borderRadius: '50%', border: '6px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }} crossOrigin="anonymous" />
        </div>
      )}
      <h2 style={{ margin: '0 0 5px 0', fontSize: '26px', textAlign: 'center', fontWeight: '700', letterSpacing: '-0.5px' }}>{data.fullName}</h2>
      <div style={{ height: '2px', width: '40px', backgroundColor: '#3182CE', margin: '15px auto 30px auto' }}></div>
      
      <div style={{ fontSize: '15px', lineHeight: '2.2', color: '#E2E8F0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px', marginBottom: '8px' }}><span style={{ color: '#A0AEC0' }}>DOB</span> <span style={{ fontWeight: '500' }}>{data.dob}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px', marginBottom: '8px' }}><span style={{ color: '#A0AEC0' }}>Place</span> <span style={{ fontWeight: '500' }}>{data.birthPlace}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px', marginBottom: '8px' }}><span style={{ color: '#A0AEC0' }}>Height</span> <span style={{ fontWeight: '500' }}>{data.height}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px', marginBottom: '8px' }}><span style={{ color: '#A0AEC0' }}>Complexion</span> <span style={{ fontWeight: '500' }}>{data.complexion}</span></div>
      </div>
    </div>
    
    <div style={{ flex: 1, padding: '50px 60px', display: 'flex', flexDirection: 'column', gap: '35px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #E2E8F0', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '32px', color: '#1A202C', margin: 0, fontWeight: '800', letterSpacing: '-1px' }}>Biodata</h1>
        <div style={{ padding: '8px 16px', backgroundColor: '#EDF2F7', borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: '#4A5568', textTransform: 'uppercase', letterSpacing: '1px' }}>Profile Document</div>
      </div>
      
      <div style={{ backgroundColor: '#FFFFFF', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
        <h3 style={{ color: '#3182CE', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#3182CE', borderRadius: '50%' }}></span> Religious Background</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '15px' }}>
          <div><span style={{ color: '#718096', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Gotra</span> <strong style={{ color: '#2D3748' }}>{data.gotra}</strong></div>
          <div><span style={{ color: '#718096', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Mool</span> <strong style={{ color: '#2D3748' }}>{data.mool || 'Not Specified'}</strong></div>
        </div>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
        <h3 style={{ color: '#3182CE', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#3182CE', borderRadius: '50%' }}></span> Education & Career</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '15px' }}>
          <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#718096', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Education</span> <strong style={{ color: '#2D3748' }}>{data.education}</strong></div>
          <div><span style={{ color: '#718096', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Profession</span> <strong style={{ color: '#2D3748' }}>{data.profession}</strong></div>
          <div><span style={{ color: '#718096', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Income</span> <strong style={{ color: '#2D3748' }}>{data.income}</strong></div>
        </div>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
        <h3 style={{ color: '#3182CE', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#3182CE', borderRadius: '50%' }}></span> Family Background</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '15px' }}>
          <div><span style={{ color: '#718096', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Father's Name</span> <strong style={{ color: '#2D3748' }}>{data.fatherName || 'Not Specified'}</strong></div>
          <div><span style={{ color: '#718096', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Mother's Name</span> <strong style={{ color: '#2D3748' }}>{data.motherName || 'Not Specified'}</strong></div>
          <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#718096', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Current Location</span> <strong style={{ color: '#2D3748' }}>{data.urbanAddress?.city || 'Not Specified'}, {data.urbanAddress?.state || ''}</strong></div>
        </div>
      </div>
    </div>
  </div>
);

// --- Template 3: Elegant Premium ---
export const TemplateElegant: React.FC<TemplateProps> = ({ data, id }) => (
  <div id={id} style={{ boxSizing: 'border-box', width: '794px', height: '1123px', fontFamily: '"Playfair Display", "Georgia", serif', padding: '60px 50px', backgroundColor: '#FDFBF7', color: '#4A4A4A', margin: '0 auto', overflow: 'hidden', position: 'relative' }}>
    {/* Decorative corner borders */}
    <div style={{ position: 'absolute', top: '30px', left: '30px', width: '40px', height: '40px', borderTop: '2px solid #D4AF37', borderLeft: '2px solid #D4AF37' }}></div>
    <div style={{ position: 'absolute', top: '30px', right: '30px', width: '40px', height: '40px', borderTop: '2px solid #D4AF37', borderRight: '2px solid #D4AF37' }}></div>
    <div style={{ position: 'absolute', bottom: '30px', left: '30px', width: '40px', height: '40px', borderBottom: '2px solid #D4AF37', borderLeft: '2px solid #D4AF37' }}></div>
    <div style={{ position: 'absolute', bottom: '30px', right: '30px', width: '40px', height: '40px', borderBottom: '2px solid #D4AF37', borderRight: '2px solid #D4AF37' }}></div>

    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
      <h1 style={{ color: '#CD5C5C', fontSize: '42px', fontStyle: 'italic', margin: '0 0 10px 0', letterSpacing: '2px' }}>{data.fullName}</h1>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
        <div style={{ height: '1px', width: '60px', backgroundColor: '#D4AF37' }}></div>
        <p style={{ letterSpacing: '3px', textTransform: 'uppercase', fontSize: '12px', margin: 0, color: '#888' }}>Matrimonial Biodata</p>
        <div style={{ height: '1px', width: '60px', backgroundColor: '#D4AF37' }}></div>
      </div>
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '50px' }}>
      <div>
        {data.photoUrl && (
          <div style={{ padding: '8px', border: '1px solid #D4AF37', borderRadius: '4px' }}>
            <img src={data.photoUrl} alt="Profile" style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: '2px' }} crossOrigin="anonymous" />
          </div>
        )}
      </div>
      <div>
        <div style={{ marginBottom: '35px' }}>
          <h3 style={{ color: '#CD5C5C', fontSize: '20px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>✧</span> Personal Details
          </h3>
          <table style={{ width: '100%', fontSize: '15px', lineHeight: '1.8' }}>
            <tbody>
              <tr><td style={{ width: '140px', color: '#888' }}>Date of Birth</td><td style={{ fontWeight: 'bold' }}>{data.dob}</td></tr>
              <tr><td style={{ color: '#888' }}>Birth Place</td><td style={{ fontWeight: 'bold' }}>{data.birthPlace}</td></tr>
              <tr><td style={{ color: '#888' }}>Height & Color</td><td style={{ fontWeight: 'bold' }}>{data.height} | {data.complexion}</td></tr>
              <tr><td style={{ color: '#888' }}>Gotra & Mool</td><td style={{ fontWeight: 'bold' }}>{data.gotra} | {data.mool || 'Not Specified'}</td></tr>
            </tbody>
          </table>
        </div>
        
        <div style={{ marginBottom: '35px' }}>
          <h3 style={{ color: '#CD5C5C', fontSize: '20px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>✧</span> Professional Details
          </h3>
          <table style={{ width: '100%', fontSize: '15px', lineHeight: '1.8' }}>
            <tbody>
              <tr><td style={{ width: '140px', color: '#888' }}>Education</td><td style={{ fontWeight: 'bold' }}>{data.education}</td></tr>
              <tr><td style={{ color: '#888' }}>Occupation</td><td style={{ fontWeight: 'bold' }}>{data.profession}</td></tr>
              <tr><td style={{ color: '#888' }}>Income</td><td style={{ fontWeight: 'bold' }}>{data.income}</td></tr>
            </tbody>
          </table>
        </div>

        <div>
          <h3 style={{ color: '#CD5C5C', fontSize: '20px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>✧</span> Family Details
          </h3>
          <table style={{ width: '100%', fontSize: '15px', lineHeight: '1.8' }}>
            <tbody>
              <tr><td style={{ width: '140px', color: '#888' }}>Father</td><td style={{ fontWeight: 'bold' }}>{data.fatherName || 'Not Specified'}</td></tr>
              <tr><td style={{ color: '#888' }}>Mother</td><td style={{ fontWeight: 'bold' }}>{data.motherName || 'Not Specified'}</td></tr>
              <tr><td style={{ color: '#888' }}>Residence</td><td style={{ fontWeight: 'bold' }}>{data.urbanAddress?.city || 'Not Specified'}, {data.urbanAddress?.state || ''}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

// --- Template 4: Minimalist Premium ---
export const TemplateMinimal: React.FC<TemplateProps> = ({ data, id }) => (
  <div id={id} style={{ boxSizing: 'border-box', width: '794px', height: '1123px', fontFamily: '"Inter", "Helvetica Neue", sans-serif', padding: '80px', backgroundColor: '#FFFFFF', color: '#111111', margin: '0 auto', overflow: 'hidden' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: '48px', fontWeight: '800', margin: '0 0 10px 0', letterSpacing: '-2px', lineHeight: '1' }}>{data.fullName}</h1>
        <p style={{ margin: 0, fontSize: '18px', color: '#666666', letterSpacing: '-0.5px' }}>{data.profession}</p>
      </div>
      {data.photoUrl && (
        <div style={{ width: '140px', height: '180px', overflow: 'hidden', flexShrink: 0, border: '1px solid #E5E5E5' }}>
          <img src={data.photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(15%)' }} crossOrigin="anonymous" />
        </div>
      )}
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '45px' }}>
        <div>
          <h4 style={{ textTransform: 'uppercase', color: '#999999', fontSize: '11px', letterSpacing: '2px', margin: '0 0 20px 0', borderBottom: '1px solid #EEEEEE', paddingBottom: '10px' }}>Profile</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666666' }}>Born</span> <span>{data.dob}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666666' }}>Location</span> <span>{data.birthPlace}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666666' }}>Height</span> <span>{data.height}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666666' }}>Color</span> <span>{data.complexion}</span></div>
          </div>
        </div>

        <div>
          <h4 style={{ textTransform: 'uppercase', color: '#999999', fontSize: '11px', letterSpacing: '2px', margin: '0 0 20px 0', borderBottom: '1px solid #EEEEEE', paddingBottom: '10px' }}>Background</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666666' }}>Gotra</span> <span>{data.gotra}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666666' }}>Mool</span> <span>{data.mool || 'Not Specified'}</span></div>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '45px' }}>
        <div>
          <h4 style={{ textTransform: 'uppercase', color: '#999999', fontSize: '11px', letterSpacing: '2px', margin: '0 0 20px 0', borderBottom: '1px solid #EEEEEE', paddingBottom: '10px' }}>Career</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666666' }}>Education</span> <span style={{ textAlign: 'right', maxWidth: '60%' }}>{data.education}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666666' }}>Profession</span> <span style={{ textAlign: 'right', maxWidth: '60%' }}>{data.profession}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666666' }}>Income</span> <span>{data.income}</span></div>
          </div>
        </div>

        <div>
          <h4 style={{ textTransform: 'uppercase', color: '#999999', fontSize: '11px', letterSpacing: '2px', margin: '0 0 20px 0', borderBottom: '1px solid #EEEEEE', paddingBottom: '10px' }}>Family</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666666' }}>Father</span> <span>{data.fatherName || 'Not Specified'}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666666' }}>Mother</span> <span>{data.motherName || 'Not Specified'}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666666' }}>Residence</span> <span style={{ textAlign: 'right', maxWidth: '60%' }}>{data.urbanAddress?.city || 'Not Specified'}, {data.urbanAddress?.state || ''}</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- Template 5: Traditional Premium ---
export const TemplateTraditional: React.FC<TemplateProps> = ({ data, id }) => (
  <div id={id} style={{ boxSizing: 'border-box', width: '794px', height: '1123px', fontFamily: '"Palatino Linotype", "Book Antiqua", Palatino, serif', padding: '50px', backgroundColor: '#FFFDF5', color: '#5A0000', margin: '0 auto', border: '16px solid transparent', borderImage: 'repeating-linear-gradient(45deg, #D4AF37, #D4AF37 10px, #FFFDF5 10px, #FFFDF5 20px) 16', overflow: 'hidden', position: 'relative' }}>
    <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', bottom: '10px', border: '2px solid #D4AF37', pointerEvents: 'none' }}></div>
    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
      <div style={{ fontSize: '48px', color: '#D4AF37', marginBottom: '5px', textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>{getReligionSymbol(data.religion)}</div>
      <h1 style={{ fontSize: '36px', margin: '0 0 10px 0', color: '#8B0000', letterSpacing: '1px' }}>{data.fullName}</h1>
      <div style={{ height: '3px', width: '100px', backgroundColor: '#D4AF37', margin: '0 auto' }}></div>
    </div>
    
    <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
      <div style={{ flex: 1, padding: '25px', backgroundColor: '#FFFFFF', border: '1px solid #EADDCD', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
        <h3 style={{ textAlign: 'center', color: '#8B0000', borderBottom: '2px solid #D4AF37', paddingBottom: '12px', marginTop: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Janam Kundali</h3>
        <table style={{ width: '100%', fontSize: '15px', lineHeight: '2' }}>
          <tbody>
            <tr><td style={{ color: '#666', width: '120px' }}>Date of Birth</td><td><strong>{data.dob}</strong></td></tr>
            <tr><td style={{ color: '#666' }}>Place of Birth</td><td><strong>{data.birthPlace}</strong></td></tr>
            <tr><td style={{ color: '#666' }}>Gotra</td><td><strong>{data.gotra}</strong></td></tr>
            <tr><td style={{ color: '#666' }}>Mool</td><td><strong>{data.mool || 'Not Specified'}</strong></td></tr>
            <tr><td style={{ color: '#666' }}>Height</td><td><strong>{data.height}</strong></td></tr>
            <tr><td style={{ color: '#666' }}>Varna</td><td><strong>{data.complexion}</strong></td></tr>
          </tbody>
        </table>
      </div>

      {data.photoUrl && (
        <div style={{ width: '220px', padding: '10px', backgroundColor: '#FFFFFF', border: '1px solid #EADDCD', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
          <img src={data.photoUrl} alt="Profile" style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '4px' }} crossOrigin="anonymous" />
        </div>
      )}
    </div>

    <div style={{ marginTop: '35px', padding: '25px', backgroundColor: '#FFFFFF', border: '1px solid #EADDCD', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
      <h3 style={{ color: '#8B0000', borderBottom: '2px solid #D4AF37', paddingBottom: '12px', marginTop: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Shiksha & Vyavsay</h3>
      <table style={{ width: '100%', fontSize: '15px', lineHeight: '2' }}>
        <tbody>
          <tr><td style={{ color: '#666', width: '140px' }}>Education</td><td><strong>{data.education}</strong></td></tr>
          <tr><td style={{ color: '#666' }}>Profession</td><td><strong>{data.profession}</strong></td></tr>
          <tr><td style={{ color: '#666' }}>Income</td><td><strong>{data.income}</strong></td></tr>
        </tbody>
      </table>
    </div>

    <div style={{ marginTop: '35px', padding: '25px', backgroundColor: '#FFFFFF', border: '1px solid #EADDCD', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
      <h3 style={{ color: '#8B0000', borderBottom: '2px solid #D4AF37', paddingBottom: '12px', marginTop: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Parivar Details</h3>
      <table style={{ width: '100%', fontSize: '15px', lineHeight: '2' }}>
        <tbody>
          <tr><td style={{ color: '#666', width: '140px' }}>Pita Ji</td><td><strong>{data.fatherName || 'Not Specified'}</strong></td></tr>
          <tr><td style={{ color: '#666' }}>Mata Ji</td><td><strong>{data.motherName || 'Not Specified'}</strong></td></tr>
          <tr><td style={{ color: '#666' }}>Niwas</td><td><strong>{data.urbanAddress?.city || 'Not Specified'}, {data.urbanAddress?.state || ''}</strong></td></tr>
        </tbody>
      </table>
    </div>
  </div>
);

// --- Shared Styles ---
const tCell = { padding: '8px 0', borderBottom: '1px solid #f0f0f0' };
