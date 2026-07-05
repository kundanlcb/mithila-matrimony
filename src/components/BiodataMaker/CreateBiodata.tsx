import React, { useState, useRef } from 'react';

import { UploadService } from '../../api/upload.service';
import { AuthService } from '../../api/auth.service';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { MatchesService } from '../../api/matches.service';
import { BiodataService } from '../../api/biodata.service';
import type { MatchProfileResponse } from '../../types/api.types';
import { useLanguage } from '../../context/LanguageContext';
import { 
  type BiodataData, 
  TemplateClassic, 
  TemplateModern, 
  TemplateElegant, 
  TemplateMinimal, 
  TemplateTraditional 
} from './BiodataTemplates';

type Step = 1 | 2 | 3 | 4 | 5;

export const CreateBiodata: React.FC<{
  onClose: () => void;
  onSuccess: (email: string) => void;
}> = ({ onClose, onSuccess }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>(1); 
  // 1: Form, 2: Template Select, 3: Preview, 4: OTP Verification, 5: Downloading/Success
  
  const [formData, setFormData] = useState<BiodataData>({
    fullName: '', gender: 'Male', dob: '', birthTime: '', birthPlace: '',
    height: '', complexion: '', education: '', profession: '', income: '', gotra: '',
    mool: '', grandparentName: '', fatherName: '', motherName: '', siblingsDetail: '',
    ruralAddress: { streetAddress: '', city: '', state: '', pincode: '' },
    urbanAddress: { streetAddress: '', city: '', state: '', pincode: '' },
    photoUrl: ''
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1);
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [matches, setMatches] = useState<MatchProfileResponse[]>([]);
  const [passwordPromptVisible, setPasswordPromptVisible] = useState(false);
  const [password, setPassword] = useState('');
  
  const printRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (type: 'ruralAddress' | 'urbanAddress', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await UploadService.uploadFile(file);
      setFormData(prev => ({ ...prev, photoUrl: url }));
    } catch (err) {
      console.error('Upload failed', err);
      // Fallback for development if S3 isn't configured
      setFormData(prev => ({ ...prev, photoUrl: URL.createObjectURL(file) }));
    } finally {
      setIsUploading(false);
    }
  };

  const downloadPDF = async () => {
    if (!printRef.current) return;
    setIsLoading(true);
    try {
      const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${formData.fullName.replace(/\s+/g, '_')}_Biodata.pdf`);
      
      setStep(5);
      setTimeout(() => {
        onSuccess(email);
      }, 3000);
    } catch (err) {
      console.error('PDF Generation Error', err);
      setErrorMsg('Failed to generate PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const requestOTP = async () => {
    if (!email) {
      setErrorMsg('Please enter a valid email.');
      return;
    }
    setIsLoading(true);
    try {
      await AuthService.requestOtp({ email });
      setStep(4);
      setErrorMsg('');
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTPAndDownload = async () => {
    setIsLoading(true);
    try {
      await AuthService.verifyOtp({ email, otp: otpCode });
      
      // Save the biodata form data to the newly created user profile
      try {
        await BiodataService.updateMine({
          fullName: formData.fullName,
          gender: formData.gender,
          dateOfBirth: formData.dob,
          birthTime: formData.birthTime,
          birthPlace: formData.birthPlace,
          height: formData.height,
          complexion: formData.complexion,
          education: formData.education,
          profession: formData.profession,
          annualIncome: formData.income ? parseInt(formData.income) : undefined,
          gotra: formData.gotra,
          mool: formData.mool,
          fatherName: formData.fatherName,
          motherName: formData.motherName,
          grandparentName: formData.grandparentName,
          siblingsDetail: formData.siblingsDetail,
          addresses: [
            {
              addressType: 'native',
              streetAddress: formData.ruralAddress.streetAddress,
              city: formData.ruralAddress.city,
              state: formData.ruralAddress.state,
              country: 'India',
              pincode: formData.ruralAddress.pincode
            },
            {
              addressType: 'current',
              streetAddress: formData.urbanAddress.streetAddress,
              city: formData.urbanAddress.city,
              state: formData.urbanAddress.state,
              country: 'India',
              pincode: formData.urbanAddress.pincode
            }
          ],
          photoUrl: formData.photoUrl || undefined
        });
      } catch (err) {
        console.error('Failed to save biodata to profile', err);
      }
      
      // Fetch matches in the background for step 5
      try {
        const matchesResponse = await MatchesService.findMatches(0, 5);
        setMatches(matchesResponse.content || []);
      } catch (err) {
        console.error('Failed to fetch matches', err);
      }
      
      await downloadPDF();
    } catch (err) {
      console.error(err);
      setErrorMsg('Invalid OTP.');
      setIsLoading(false);
    }
  };

  const completeRegistration = async () => {
    setIsLoading(true);
    try {
      await AuthService.setupPassword({ password });
      onSuccess(email); // Close modal and refresh app state
    } catch (err) {
      setErrorMsg('Failed to set password.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderTemplate = (isThumbnail = false, id?: string) => {
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

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={{ margin: 0, color: 'var(--primary-dark)' }}>
            {step === 1 ? t('biodata_maker_title_step1') : step === 2 ? t('biodata_maker_title_step2') : step === 3 ? t('biodata_maker_title_step3') : step === 4 ? t('biodata_maker_title_step4') : t('biodata_maker_title_step5')}
          </h2>
          <button onClick={onClose} style={styles.closeButton}>&times;</button>
        </div>

        <div style={styles.body}>
          {errorMsg && <div style={{ padding: '10px', backgroundColor: '#ffebee', color: '#c62828', marginBottom: '15px', borderRadius: '4px' }}>{errorMsg}</div>}
          
          {step === 1 && (
            <div style={styles.formContainer}>
              <div style={styles.sectionTitle}>{t('biodata_maker_personal_details')}</div>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}><label>{t('biodata_maker_full_name')}</label><input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.inputGroup}><label>{t('biodata_maker_gender')}</label><select name="gender" value={formData.gender} onChange={handleInputChange} style={styles.input}><option value="Male">{t('biodata_maker_male')}</option><option value="Female">{t('biodata_maker_female')}</option></select></div>
                <div style={styles.inputGroup}><label>{t('biodata_maker_dob')}</label><input type="date" name="dob" value={formData.dob} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.inputGroup}><label>{t('biodata_maker_tob')}</label><input type="time" name="birthTime" value={formData.birthTime} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.inputGroup}><label>{t('biodata_maker_pob')}</label><input type="text" name="birthPlace" value={formData.birthPlace} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.inputGroup}><label>{t('biodata_maker_height')}</label><input type="text" name="height" placeholder="e.g. 5'8&quot;" value={formData.height} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.inputGroup}><label>{t('biodata_maker_complexion')}</label><input type="text" name="complexion" placeholder="e.g. Fair, Wheatish" value={formData.complexion} onChange={handleInputChange} style={styles.input} /></div>
              </div>

              <div style={styles.sectionTitle}>{t('biodata_maker_maithil_specifics')}</div>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}><label>{t('biodata_maker_gotra')}</label><input type="text" name="gotra" value={formData.gotra} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.inputGroup}><label>{t('biodata_maker_mool')}</label><input type="text" name="mool" value={formData.mool} onChange={handleInputChange} style={styles.input} /></div>
              </div>

              <div style={styles.sectionTitle}>{t('biodata_maker_edu_prof')}</div>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}><label>{t('biodata_maker_education')}</label><input type="text" name="education" value={formData.education} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.inputGroup}><label>{t('biodata_maker_profession')}</label><input type="text" name="profession" value={formData.profession} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.inputGroup}><label>{t('biodata_maker_income')}</label><input type="text" name="income" value={formData.income} onChange={handleInputChange} style={styles.input} /></div>
              </div>

              <div style={styles.sectionTitle}>{t('biodata_maker_family')}</div>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}><label>{t('biodata_maker_grandparent')}</label><input type="text" name="grandparentName" value={formData.grandparentName} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.inputGroup}><label>{t('biodata_maker_father')}</label><input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.inputGroup}><label>{t('biodata_maker_mother')}</label><input type="text" name="motherName" value={formData.motherName} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.inputGroup}><label>{t('biodata_maker_siblings')}</label><input type="text" name="siblingsDetail" value={formData.siblingsDetail} onChange={handleInputChange} style={styles.input} placeholder="e.g. 1 Brother, 1 Sister" /></div>
              </div>

              <div style={styles.sectionTitle}>{t('biodata_maker_rural_address')}</div>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}><label>{t('biodata_maker_street')}</label><input type="text" value={formData.ruralAddress.streetAddress} onChange={e => handleAddressChange('ruralAddress', 'streetAddress', e.target.value)} style={styles.input} /></div>
                <div style={styles.inputGroup}><label>{t('biodata_maker_city')}</label><input type="text" value={formData.ruralAddress.city} onChange={e => handleAddressChange('ruralAddress', 'city', e.target.value)} style={styles.input} /></div>
                <div style={styles.inputGroup}><label>{t('biodata_maker_state')}</label><input type="text" value={formData.ruralAddress.state} onChange={e => handleAddressChange('ruralAddress', 'state', e.target.value)} style={styles.input} /></div>
                <div style={styles.inputGroup}><label>{t('biodata_maker_pincode')}</label><input type="text" required value={formData.ruralAddress.pincode} onChange={e => handleAddressChange('ruralAddress', 'pincode', e.target.value)} style={{ ...styles.input, borderColor: !formData.ruralAddress.pincode ? 'red' : '#ccc' }} /></div>
              </div>

              <div style={styles.sectionTitle}>{t('biodata_maker_urban_address')}</div>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}><label>{t('biodata_maker_street')}</label><input type="text" value={formData.urbanAddress.streetAddress} onChange={e => handleAddressChange('urbanAddress', 'streetAddress', e.target.value)} style={styles.input} /></div>
                <div style={styles.inputGroup}><label>{t('biodata_maker_city')}</label><input type="text" value={formData.urbanAddress.city} onChange={e => handleAddressChange('urbanAddress', 'city', e.target.value)} style={styles.input} /></div>
                <div style={styles.inputGroup}><label>{t('biodata_maker_state')}</label><input type="text" value={formData.urbanAddress.state} onChange={e => handleAddressChange('urbanAddress', 'state', e.target.value)} style={styles.input} /></div>
                <div style={styles.inputGroup}><label>{t('biodata_maker_pincode')}</label><input type="text" required value={formData.urbanAddress.pincode} onChange={e => handleAddressChange('urbanAddress', 'pincode', e.target.value)} style={{ ...styles.input, borderColor: !formData.urbanAddress.pincode ? 'red' : '#ccc' }} /></div>
              </div>

              <div style={styles.sectionTitle}>{t('biodata_maker_profile_photo')}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} />
                {isUploading && <span style={{ color: 'var(--primary)' }}>Uploading...</span>}
                {formData.photoUrl && <img src={formData.photoUrl} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%' }} />}
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              {[1, 2, 3, 4, 5].map((num) => (
                <div 
                  key={num} 
                  onClick={() => setSelectedTemplate(num)}
                  style={{
                    border: selectedTemplate === num ? '3px solid var(--primary)' : '1px solid #ddd',
                    borderRadius: '8px',
                    height: '280px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                    boxShadow: selectedTemplate === num ? '0 4px 15px rgba(216,27,96,0.3)' : 'none'
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    {/* Hack to render thumbnail quickly */}
                    {(() => {
                        let thumb;
                        if(num === 1) thumb = <TemplateClassic data={formData} />;
                        if(num === 2) thumb = <TemplateModern data={formData} />;
                        if(num === 3) thumb = <TemplateElegant data={formData} />;
                        if(num === 4) thumb = <TemplateMinimal data={formData} />;
                        if(num === 5) thumb = <TemplateTraditional data={formData} />;
                        return <div style={{ transform: 'scale(0.25)', transformOrigin: 'top left', width: '400%' }}>{thumb}</div>;
                    })()}
                  </div>
                  {selectedTemplate === num && <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--primary)', color: 'white', padding: '4px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>Selected</div>}
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', maxWidth: '800px', backgroundColor: '#e0e0e0', padding: '20px', borderRadius: '8px', overflowX: 'auto' }}>
                <div ref={printRef} style={{ width: '800px', margin: '0 auto', backgroundColor: 'white' }}>
                  {renderTemplate()}
                </div>
              </div>
              
              <div style={{ marginTop: '20px', width: '100%', maxWidth: '400px' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>Verify to Download</h3>
                <div style={styles.inputGroup}>
                  <label>Email Address</label>
                  <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <h3>Enter OTP</h3>
              <p style={{ color: '#666', marginBottom: '20px' }}>We sent a 4-digit code to <strong>{email}</strong></p>
              <input 
                type="text" 
                maxLength={4} 
                value={otpCode} 
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))} 
                style={{ ...styles.input, width: '120px', fontSize: '24px', textAlign: 'center', letterSpacing: '8px' }} 
              />
            </div>
          )}

          {step === 5 && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎉</div>
              <h2 style={{ color: 'var(--primary-dark)', margin: '0 0 10px 0' }}>Your Biodata is Downloaded!</h2>
              <p style={{ color: '#666', fontSize: '1rem', marginBottom: '20px' }}>
                While you were waiting, we found perfect matches for you!
              </p>
              
              {matches.length > 0 ? (
                <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', padding: '10px' }}>
                  {matches.slice(0, 3).map((match, idx) => (
                    <div key={idx} style={{ minWidth: '200px', border: '1px solid #eee', borderRadius: '12px', padding: '15px', backgroundColor: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                      <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#eee', margin: '0 auto 15px auto', backgroundImage: `url(${match.photoUrl || 'https://via.placeholder.com/80'})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                      <h4 style={{ margin: '0 0 5px 0' }}>{match.fullName}</h4>
                      <p style={{ margin: '0 0 5px 0', fontSize: '0.85rem', color: '#666' }}>{match.age} yrs • {match.location}</p>
                      <button 
                        onClick={() => setPasswordPromptVisible(true)}
                        style={{ width: '100%', padding: '8px', marginTop: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        View Profile
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Generating matches...</p>
              )}
            </div>
          )}
        </div>

        {passwordPromptVisible && (
          <div style={{ ...styles.overlay, zIndex: 10001 }}>
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '400px', textAlign: 'center' }}>
              <h3 style={{ marginTop: 0 }}>Almost there!</h3>
              <p style={{ color: '#666', marginBottom: '20px' }}>Set a password to complete your account and view this profile.</p>
              <input 
                type="password" 
                placeholder="New Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                style={{ ...styles.input, width: '100%', boxSizing: 'border-box', marginBottom: '20px' }} 
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setPasswordPromptVisible(false)} style={{ ...styles.secondaryButton, flex: 1 }}>Cancel</button>
                <button onClick={completeRegistration} disabled={isLoading || password.length < 6} style={{ ...styles.primaryButton, flex: 1 }}>
                  {isLoading ? 'Saving...' : 'Complete & View'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={styles.footer}>
          {step > 1 && step < 5 && <button onClick={() => setStep(step - 1 as Step)} style={styles.secondaryButton}>{t('biodata_maker_btn_back')}</button>}
          {step === 1 && <button onClick={() => setStep(2)} disabled={!formData.ruralAddress.pincode || !formData.urbanAddress.pincode} style={{ ...styles.primaryButton, opacity: (!formData.ruralAddress.pincode || !formData.urbanAddress.pincode) ? 0.5 : 1 }}>{t('biodata_maker_btn_choose_template')}</button>}
          {step === 2 && <button onClick={() => setStep(3)} style={styles.primaryButton}>{t('biodata_maker_btn_preview')}</button>}
          {step === 3 && <button onClick={requestOTP} disabled={isLoading || !email} style={styles.primaryButton}>{isLoading ? 'Sending...' : t('biodata_maker_btn_send_otp')}</button>}
          {step === 4 && <button onClick={verifyOTPAndDownload} disabled={isLoading || otpCode.length !== 4} style={styles.primaryButton}>{isLoading ? 'Generating PDF...' : t('biodata_maker_btn_verify_dl')}</button>}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '16px',
    width: '95%',
    maxWidth: '900px',
    height: '90vh',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  header: {
    padding: 'clamp(1rem, 3vw, 1.5rem) clamp(1rem, 4vw, 2rem)',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '2rem',
    cursor: 'pointer',
    color: '#999',
    lineHeight: 1,
  },
  body: {
    padding: 'clamp(1rem, 4vw, 2rem)',
    overflowY: 'auto' as const,
    flex: 1,
    backgroundColor: '#fafafa',
  },
  footer: {
    padding: 'clamp(1rem, 3vw, 1.5rem) clamp(1rem, 4vw, 2rem)',
    borderTop: '1px solid #f0f0f0',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    backgroundColor: '#fff',
  },
  formContainer: {
    maxWidth: '700px',
    margin: '0 auto',
    backgroundColor: '#fff',
    padding: 'clamp(15px, 4vw, 30px)',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: 'var(--primary)',
    borderBottom: '2px solid var(--primary-light)',
    paddingBottom: '8px',
    marginBottom: '15px',
    marginTop: 'clamp(20px, 4vw, 30px)',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  input: {
    padding: '0.8rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    backgroundColor: '#f9f9f9',
    transition: 'border-color 0.2s',
  },
  primaryButton: {
    padding: '0.8rem 2rem',
    backgroundColor: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    boxShadow: '0 4px 15px rgba(216, 27, 96, 0.3)',
  },
  secondaryButton: {
    padding: '0.8rem 2rem',
    backgroundColor: '#f1f1f1',
    color: '#333',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1.1rem',
  }
};
