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
  religion?: string;
  grandparentName: string;
  fatherName: string;
  motherName: string;
  siblingsDetail: string;
  ruralAddress: AddressFormData;
  urbanAddress: AddressFormData;
  photoUrl: string;
};

export type TemplateTheme = {
  name: string;
  primary: string;
  sidebarBg: string;
  sidebarText: string;
  mainBg: string;
  mainText: string;
  photoShape: 'round' | 'offset-square';
};

export const templateThemes: TemplateTheme[] = [
  {
    name: 'Magenta Flower',
    primary: '#D81B60',
    sidebarBg: '#FDF2F8',
    sidebarText: '#334155',
    mainBg: '#FFFFFF',
    mainText: '#1E293B',
    photoShape: 'round'
  },
  {
    name: 'Orange Marigold',
    primary: '#F97316',
    sidebarBg: '#FFF7ED',
    sidebarText: '#334155',
    mainBg: '#FFFFFF',
    mainText: '#1E293B',
    photoShape: 'offset-square'
  },
  {
    name: 'Yellow Sunflower',
    primary: '#EAB308',
    sidebarBg: '#FEFCE8',
    sidebarText: '#334155',
    mainBg: '#FFFFFF',
    mainText: '#1E293B',
    photoShape: 'round'
  },
  {
    name: 'Green Jasmine',
    primary: '#22C55E',
    sidebarBg: '#F0FDF4',
    sidebarText: '#334155',
    mainBg: '#FFFFFF',
    mainText: '#1E293B',
    photoShape: 'offset-square'
  }
];

export type BiodataTemplateProps = {
  data: BiodataData;
  id?: string;
  theme?: TemplateTheme;
};

export const BiodataTemplate: React.FC<BiodataTemplateProps> = ({ data, id, theme = templateThemes[0] }) => {
  return (
    <div id={id} style={{ 
      textAlign: 'left', boxSizing: 'border-box', 
      width: '794px', minWidth: '794px', maxWidth: '794px', 
      height: '1123px', minHeight: '1123px', maxHeight: '1123px', 
      fontFamily: '"Inter", "Helvetica Neue", sans-serif', 
      padding: '70px', backgroundColor: theme.mainBg, color: theme.mainText, 
      margin: '0 auto', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative'
    }}>
      {/* Background decorative elements */}
      <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', backgroundColor: `${theme.primary}15`, borderRadius: '50%', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '250px', height: '250px', backgroundColor: `${theme.primary}10`, borderRadius: '50%', pointerEvents: 'none' }}></div>

      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px', width: '100%' }}>
        {/* Left Side: Name and Details */}
        <div style={{ flex: 1, paddingRight: '40px' }}>
          {/* Small accent square above name */}
          <div style={{ width: '24px', height: '24px', backgroundColor: theme.primary, marginBottom: '25px', borderRadius: '4px' }}></div>
          
          <h1 style={{ fontSize: '52px', fontWeight: '800', margin: '0 0 12px 0', letterSpacing: '-1.5px', lineHeight: '1', color: theme.mainText }}>
            {data.fullName}
          </h1>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: '500', color: theme.mainText, opacity: 0.8, marginBottom: '35px' }}>
            <span>{data.profession || 'Professional'}</span>
            <span style={{ color: theme.primary, fontWeight: 'bold' }}>•</span>
            <span>{data.religion || 'Hindu'}</span>
            <span style={{ color: theme.primary, fontWeight: 'bold' }}>•</span>
            <span>{data.height}</span>
            <span style={{ color: theme.primary, fontWeight: 'bold' }}>•</span>
            <span>{data.complexion}</span>
          </div>
          
          {/* Contact Block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', fontWeight: '500', color: theme.mainText, opacity: 0.9, paddingLeft: '18px', borderLeft: `4px solid ${theme.primary}` }}>
            {data.urbanAddress?.streetAddress && <div>{data.urbanAddress.streetAddress}</div>}
            <div>{data.urbanAddress?.city || 'City'}, {data.urbanAddress?.state || 'State'} {data.urbanAddress?.pincode}</div>
          </div>
        </div>

        {/* Right Side: Photo */}
        {data.photoUrl && (
          <div style={{ position: 'relative', width: '210px', height: '260px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             {theme.photoShape === 'offset-square' ? (
               <>
                 {/* Offset Background */}
                 <div style={{ position: 'absolute', top: '30px', left: '30px', width: '180px', height: '230px', backgroundColor: theme.primary, borderRadius: '8px' }}></div>
                 {/* Photo */}
                 <div style={{ position: 'absolute', top: '10px', left: '10px', width: '180px', height: '230px', overflow: 'hidden', borderRadius: '8px' }}>
                   <img src={data.photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
                 </div>
               </>
             ) : (
               <div style={{ width: '200px', height: '200px', overflow: 'hidden', borderRadius: '50%', border: `6px solid ${theme.primary}`, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                 <img src={data.photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
               </div>
             )}
          </div>
        )}
      </div>

      {/* Full Width Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '45px' }}>
        
        {/* Personal Details */}
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '1px', margin: '0 0 25px 0', color: theme.mainText, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '8px', height: '20px', backgroundColor: theme.primary, borderRadius: '4px' }}></span>
            Personal Details
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', width: '100%' }}>
            <div><span style={labelStyle}>Date of Birth</span> <strong style={valueStyle}>{data.dob}</strong></div>
            <div><span style={labelStyle}>Birth Place</span> <strong style={valueStyle}>{data.birthPlace || 'Not Specified'}</strong></div>
            <div><span style={labelStyle}>Gotra</span> <strong style={valueStyle}>{data.gotra}</strong></div>
            <div><span style={labelStyle}>Mool</span> <strong style={valueStyle}>{data.mool || 'Not Specified'}</strong></div>
          </div>
        </div>

        {/* Education & Career */}
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '1px', margin: '0 0 25px 0', color: theme.mainText, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '8px', height: '20px', backgroundColor: theme.primary, borderRadius: '4px' }}></span>
            Education & Career
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', width: '100%' }}>
             <div><span style={labelStyle}>Highest Education</span> <strong style={valueStyle}>{data.education}</strong></div>
             <div><span style={labelStyle}>Profession</span> <strong style={valueStyle}>{data.profession}</strong></div>
             <div><span style={labelStyle}>Annual Income</span> <strong style={valueStyle}>{data.income}</strong></div>
          </div>
        </div>

        {/* Family Details */}
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '1px', margin: '0 0 25px 0', color: theme.mainText, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '8px', height: '20px', backgroundColor: theme.primary, borderRadius: '4px' }}></span>
            Family Details
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', width: '100%' }}>
            <div><span style={labelStyle}>Father's Name</span> <strong style={valueStyle}>{data.fatherName || 'Not Specified'}</strong></div>
            <div><span style={labelStyle}>Mother's Name</span> <strong style={valueStyle}>{data.motherName || 'Not Specified'}</strong></div>
            <div><span style={labelStyle}>Grandparent</span> <strong style={valueStyle}>{data.grandparentName || 'Not Specified'}</strong></div>
          </div>
        </div>

      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  color: 'inherit',
  opacity: 0.6,
  fontSize: '13px',
  fontWeight: '500',
  display: 'block',
  marginBottom: '6px'
};
const valueStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: '600',
  color: 'inherit',
  opacity: 0.95
};
