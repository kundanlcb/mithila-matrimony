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
  birthTime: string;
  birthPlace: string;
  height: string;
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

// --- Template 1: Classic ---
export const TemplateClassic: React.FC<TemplateProps> = ({ data, id }) => (
  <div id={id} style={{ fontFamily: 'serif', padding: '40px', backgroundColor: '#fff', color: '#333', border: '2px solid #8B0000', margin: '0 auto', maxWidth: '800px' }}>
    <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #8B0000', paddingBottom: '20px' }}>
      <h1 style={{ color: '#8B0000', fontSize: '32px', margin: '0 0 10px 0', textTransform: 'uppercase' }}>Biodata</h1>
      <h2 style={{ fontSize: '24px', margin: 0 }}>{data.fullName}</h2>
    </div>
    
    <div style={{ display: 'flex', gap: '30px' }}>
      {data.photoUrl && (
        <div style={{ width: '150px', flexShrink: 0 }}>
          <img src={data.photoUrl} alt="Profile" style={{ width: '100%', height: 'auto', border: '1px solid #ccc', borderRadius: '4px' }} crossOrigin="anonymous" />
        </div>
      )}
      <div style={{ flex: 1 }}>
        <h3 style={{ color: '#8B0000', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Personal Details</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <tbody>
            <tr><td style={tCell}><strong>Date of Birth:</strong></td><td style={tCell}>{data.dob}</td></tr>
            <tr><td style={tCell}><strong>Birth Time:</strong></td><td style={tCell}>{data.birthTime}</td></tr>
            <tr><td style={tCell}><strong>Birth Place:</strong></td><td style={tCell}>{data.birthPlace}</td></tr>
            <tr><td style={tCell}><strong>Height:</strong></td><td style={tCell}>{data.height}</td></tr>
            <tr><td style={tCell}><strong>Gotra:</strong></td><td style={tCell}>{data.gotra}</td></tr>
            <tr><td style={tCell}><strong>Mool:</strong></td><td style={tCell}>{data.mool}</td></tr>
          </tbody>
        </table>

        <h3 style={{ color: '#8B0000', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Education & Career</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <tbody>
            <tr><td style={tCell}><strong>Education:</strong></td><td style={tCell}>{data.education}</td></tr>
            <tr><td style={tCell}><strong>Profession:</strong></td><td style={tCell}>{data.profession}</td></tr>
            <tr><td style={tCell}><strong>Income:</strong></td><td style={tCell}>{data.income}</td></tr>
          </tbody>
        </table>

        <h3 style={{ color: '#8B0000', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Family Details</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr><td style={tCell}><strong>Grandparent's Name:</strong></td><td style={tCell}>{data.grandparentName}</td></tr>
            <tr><td style={tCell}><strong>Father's Name:</strong></td><td style={tCell}>{data.fatherName}</td></tr>
            <tr><td style={tCell}><strong>Mother's Name:</strong></td><td style={tCell}>{data.motherName}</td></tr>
            <tr><td style={tCell}><strong>Siblings:</strong></td><td style={tCell}>{data.siblingsDetail}</td></tr>
            <tr><td style={tCell}><strong>Native Address:</strong></td><td style={tCell}>{data.ruralAddress.streetAddress}, {data.ruralAddress.city}, {data.ruralAddress.state} - {data.ruralAddress.pincode}</td></tr>
            <tr><td style={tCell}><strong>Current Address:</strong></td><td style={tCell}>{data.urbanAddress.streetAddress}, {data.urbanAddress.city}, {data.urbanAddress.state} - {data.urbanAddress.pincode}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// --- Template 2: Modern ---
export const TemplateModern: React.FC<TemplateProps> = ({ data, id }) => (
  <div id={id} style={{ fontFamily: 'sans-serif', padding: '0', backgroundColor: '#f9f9f9', color: '#222', margin: '0 auto', maxWidth: '800px', display: 'flex', minHeight: '600px' }}>
    <div style={{ backgroundColor: '#2C3E50', color: 'white', width: '250px', padding: '30px' }}>
      {data.photoUrl && (
        <img src={data.photoUrl} alt="Profile" style={{ width: '100%', height: 'auto', borderRadius: '50%', marginBottom: '20px', border: '4px solid #fff' }} crossOrigin="anonymous" />
      )}
      <h2 style={{ margin: '0 0 20px 0', fontSize: '22px' }}>{data.fullName}</h2>
      <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
        <div><strong>DOB:</strong> {data.dob}</div>
        <div><strong>Time:</strong> {data.birthTime}</div>
        <div><strong>Place:</strong> {data.birthPlace}</div>
        <div><strong>Height:</strong> {data.height}</div>
      </div>
    </div>
    <div style={{ flex: 1, padding: '40px' }}>
      <h1 style={{ fontSize: '28px', color: '#2C3E50', margin: '0 0 30px 0' }}>Biodata</h1>
      
      <div style={mSection}>
        <h3 style={mHeading}>Religious Background</h3>
        <div style={mRow}><span style={mLabel}>Gotra:</span> <span>{data.gotra}</span></div>
        <div style={mRow}><span style={mLabel}>Mool:</span> <span>{data.mool}</span></div>
      </div>

      <div style={mSection}>
        <h3 style={mHeading}>Education & Career</h3>
        <div style={mRow}><span style={mLabel}>Education:</span> <span>{data.education}</span></div>
        <div style={mRow}><span style={mLabel}>Profession:</span> <span>{data.profession}</span></div>
        <div style={mRow}><span style={mLabel}>Income:</span> <span>{data.income}</span></div>
      </div>

      <div style={mSection}>
        <h3 style={mHeading}>Family Background</h3>
        <div style={mRow}><span style={mLabel}>Father:</span> <span>{data.fatherName}</span></div>
        <div style={mRow}><span style={mLabel}>Mother:</span> <span>{data.motherName}</span></div>
        <div style={mRow}><span style={mLabel}>Location:</span> <span>{data.familyLocation}</span></div>
      </div>
    </div>
  </div>
);

// --- Template 3: Elegant ---
export const TemplateElegant: React.FC<TemplateProps> = ({ data, id }) => (
  <div id={id} style={{ fontFamily: 'Georgia, serif', padding: '40px', backgroundColor: '#FFF5EE', color: '#4A4A4A', margin: '0 auto', maxWidth: '800px' }}>
    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
      <h1 style={{ color: '#CD5C5C', fontSize: '36px', fontStyle: 'italic', margin: '0 0 10px 0' }}>{data.fullName}</h1>
      <p style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '14px', margin: 0, color: '#888' }}>Matrimonial Biodata</p>
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
      <div>
        {data.photoUrl && (
          <img src={data.photoUrl} alt="Profile" style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} crossOrigin="anonymous" />
        )}
      </div>
      <div>
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ borderBottom: '1px solid #CD5C5C', color: '#CD5C5C', paddingBottom: '8px', marginTop: 0 }}>Personal Details</h3>
          <p style={{ margin: '5px 0' }}><strong>Born:</strong> {data.dob} at {data.birthTime} in {data.birthPlace}</p>
          <p style={{ margin: '5px 0' }}><strong>Height:</strong> {data.height}</p>
          <p style={{ margin: '5px 0' }}><strong>Gotra:</strong> {data.gotra} | <strong>Mool:</strong> {data.mool}</p>
        </div>
        
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ borderBottom: '1px solid #CD5C5C', color: '#CD5C5C', paddingBottom: '8px' }}>Professional Details</h3>
          <p style={{ margin: '5px 0' }}><strong>Education:</strong> {data.education}</p>
          <p style={{ margin: '5px 0' }}><strong>Occupation:</strong> {data.profession}</p>
          <p style={{ margin: '5px 0' }}><strong>Income:</strong> {data.income}</p>
        </div>

        <div>
          <h3 style={{ borderBottom: '1px solid #CD5C5C', color: '#CD5C5C', paddingBottom: '8px' }}>Family Details</h3>
          <p style={{ margin: '5px 0' }}><strong>Father:</strong> {data.fatherName}</p>
          <p style={{ margin: '5px 0' }}><strong>Mother:</strong> {data.motherName}</p>
          <p style={{ margin: '5px 0' }}><strong>Residence:</strong> {data.familyLocation}</p>
        </div>
      </div>
    </div>
  </div>
);

// --- Template 4: Minimalist ---
export const TemplateMinimal: React.FC<TemplateProps> = ({ data, id }) => (
  <div id={id} style={{ fontFamily: 'Helvetica, Arial, sans-serif', padding: '50px', backgroundColor: '#FFFFFF', color: '#333', margin: '0 auto', maxWidth: '800px', border: '1px solid #eee' }}>
    <h1 style={{ fontSize: '40px', fontWeight: 'bold', margin: '0 0 50px 0', letterSpacing: '-1px' }}>{data.fullName}</h1>
    
    <div style={{ display: 'flex', gap: '50px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: '40px' }}>
          <h4 style={{ textTransform: 'uppercase', color: '#999', fontSize: '12px', letterSpacing: '1px', marginBottom: '15px' }}>Profile</h4>
          <div style={minRow}><span>DOB</span> <span>{data.dob}</span></div>
          <div style={minRow}><span>Time</span> <span>{data.birthTime}</span></div>
          <div style={minRow}><span>Place</span> <span>{data.birthPlace}</span></div>
          <div style={minRow}><span>Height</span> <span>{data.height}</span></div>
          <div style={minRow}><span>Gotra</span> <span>{data.gotra}</span></div>
          <div style={minRow}><span>Mool</span> <span>{data.mool}</span></div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h4 style={{ textTransform: 'uppercase', color: '#999', fontSize: '12px', letterSpacing: '1px', marginBottom: '15px' }}>Career</h4>
          <div style={minRow}><span>Education</span> <span>{data.education}</span></div>
          <div style={minRow}><span>Profession</span> <span>{data.profession}</span></div>
        </div>

        <div>
          <h4 style={{ textTransform: 'uppercase', color: '#999', fontSize: '12px', letterSpacing: '1px', marginBottom: '15px' }}>Family</h4>
          <div style={minRow}><span>Father</span> <span>{data.fatherName}</span></div>
          <div style={minRow}><span>Mother</span> <span>{data.motherName}</span></div>
          <div style={minRow}><span>Location</span> <span>{data.familyLocation}</span></div>
        </div>
      </div>
      
      {data.photoUrl && (
        <div style={{ width: '250px' }}>
          <img src={data.photoUrl} alt="Profile" style={{ width: '100%', filter: 'grayscale(20%)' }} crossOrigin="anonymous" />
        </div>
      )}
    </div>
  </div>
);

// --- Template 5: Traditional ---
export const TemplateTraditional: React.FC<TemplateProps> = ({ data, id }) => (
  <div id={id} style={{ fontFamily: 'Palatino, serif', padding: '40px', backgroundColor: '#FFFDF0', color: '#5A0000', margin: '0 auto', maxWidth: '800px', border: '10px solid #D4AF37', borderRadius: '15px' }}>
    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
      <div style={{ fontSize: '40px', color: '#D4AF37', marginBottom: '10px' }}>ॐ</div>
      <h1 style={{ fontSize: '32px', margin: '0 0 5px 0' }}>{data.fullName}</h1>
    </div>
    
    <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
      <div style={{ flex: 1, padding: '20px', border: '1px dashed #D4AF37' }}>
        <h3 style={{ textAlign: 'center', borderBottom: '2px solid #D4AF37', paddingBottom: '10px', marginTop: 0 }}>Janam Kundali Details</h3>
        <p><strong>Date of Birth:</strong> {data.dob}</p>
        <p><strong>Time of Birth:</strong> {data.birthTime}</p>
        <p><strong>Place of Birth:</strong> {data.birthPlace}</p>
        <p><strong>Gotra:</strong> {data.gotra}</p>
        <p><strong>Mool:</strong> {data.mool}</p>
        <p><strong>Height:</strong> {data.height}</p>
      </div>

      {data.photoUrl && (
        <div style={{ width: '200px', border: '4px solid #D4AF37', padding: '5px', backgroundColor: '#fff' }}>
          <img src={data.photoUrl} alt="Profile" style={{ width: '100%' }} crossOrigin="anonymous" />
        </div>
      )}
    </div>

    <div style={{ marginTop: '30px', padding: '20px', border: '1px dashed #D4AF37' }}>
      <h3 style={{ borderBottom: '2px solid #D4AF37', paddingBottom: '10px', marginTop: 0 }}>Shiksha & Vyavsay</h3>
      <p><strong>Education:</strong> {data.education}</p>
      <p><strong>Profession:</strong> {data.profession}</p>
      <p><strong>Income:</strong> {data.income}</p>
    </div>

    <div style={{ marginTop: '30px', padding: '20px', border: '1px dashed #D4AF37' }}>
      <h3 style={{ borderBottom: '2px solid #D4AF37', paddingBottom: '10px', marginTop: 0 }}>Parivar Details</h3>
      <p><strong>Pita Ji:</strong> {data.fatherName}</p>
      <p><strong>Mata Ji:</strong> {data.motherName}</p>
      <p><strong>Niwas:</strong> {data.familyLocation}</p>
    </div>
  </div>
);

// --- Shared Styles ---
const tCell = { padding: '8px 0', borderBottom: '1px solid #f0f0f0' };
const mSection = { marginBottom: '25px' };
const mHeading = { color: '#2C3E50', fontSize: '18px', borderBottom: '2px solid #3498DB', paddingBottom: '5px', display: 'inline-block', marginBottom: '15px' };
const mRow = { display: 'flex', marginBottom: '10px' };
const mLabel = { width: '120px', fontWeight: 'bold', color: '#555' };
const minRow = { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' };
