import re
import sys

def main():
    file_path = 'src/components/RegistrationChat.tsx'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update BiodataForm Initial State
    initial_state_target = """  const [biodataForm, setBiodataForm] = useState<Omit<Biodata, 'biodataId' | 'userId'>>({
    fullName: '',
    gender: 'Female',
    age: 24,
    height: '5\\' 6"',
    maritalStatus: 'Never Married',
    complexion: 'Fair',
    religion: 'Hindu',
    caste: 'Brahmin (Maithil)',
    gotra: 'Kashyap',
    mool: '',
    diet: 'Vegetarian',
    profession: 'Software Engineer',
    annualIncome: 1200000,
    location: 'Darbhanga',
    education: 'B.Tech',
    interests: [],
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400',
    aboutMe: '',
    phoneNumber: ''
  });"""

    new_initial_state = """  const [biodataForm, setBiodataForm] = useState<Omit<Biodata, 'biodataId' | 'userId'>>({
    fullName: '',
    gender: 'Female',
    age: 24,
    height: '5\\' 6"',
    maritalStatus: 'Never Married',
    complexion: 'Fair',
    religion: 'Hindu',
    caste: 'Brahmin (Maithil)',
    gotra: 'Kashyap',
    mool: '',
    diet: 'Vegetarian',
    profession: 'Software Engineer',
    annualIncome: 1200000,
    location: 'Darbhanga',
    education: 'B.Tech',
    interests: [],
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400',
    aboutMe: '',
    phoneNumber: '',
    fatherName: '',
    motherName: '',
    grandparentName: '',
    siblingsDetail: '',
    birthPlace: ''
  });"""

    if initial_state_target in content:
        content = content.replace(initial_state_target, new_initial_state)
    else:
        print("Failed to find initial state")
        sys.exit(1)

    # 2. Update messages map with new mappedData
    mapped_data_target = """              fullName: biodataForm.fullName,
              gender: biodataForm.gender,
              dob: biodataForm.age ? `${new Date().getFullYear() - biodataForm.age}-01-01` : '1999-01-01',
              birthPlace: biodataForm.location || '',
              height: biodataForm.height || '',
              complexion: biodataForm.complexion || '',
              education: biodataForm.education,
              profession: biodataForm.profession,
              income: biodataForm.annualIncome ? biodataForm.annualIncome.toString() : '',
              gotra: biodataForm.gotra,
              mool: (biodataForm as any).mool || '',
              grandparentName: '',
              fatherName: '',
              motherName: '',
              siblingsDetail: '',
              ruralAddress: { streetAddress: '', city: biodataForm.location || '', state: '', pincode: '' },
              urbanAddress: { streetAddress: '', city: biodataForm.location || '', state: '', pincode: '' },
              photoUrl: biodataForm.photoUrl || ''"""

    new_mapped_data = """              fullName: biodataForm.fullName,
              gender: biodataForm.gender,
              dob: biodataForm.age ? `${new Date().getFullYear() - biodataForm.age}-01-01` : '1999-01-01',
              birthPlace: biodataForm.birthPlace || '',
              height: biodataForm.height || '',
              complexion: biodataForm.complexion || '',
              education: biodataForm.education,
              profession: biodataForm.profession,
              income: biodataForm.annualIncome ? biodataForm.annualIncome.toString() : '',
              gotra: biodataForm.gotra,
              mool: (biodataForm as any).mool || '',
              grandparentName: biodataForm.grandparentName || '',
              fatherName: biodataForm.fatherName || '',
              motherName: biodataForm.motherName || '',
              siblingsDetail: biodataForm.siblingsDetail || '',
              ruralAddress: { streetAddress: '', city: biodataForm.location || '', state: '', pincode: '' },
              urbanAddress: { streetAddress: (biodataForm as any).streetAddress || '', city: biodataForm.location || '', state: '', pincode: '' },
              photoUrl: biodataForm.photoUrl || ''"""

    if mapped_data_target in content:
        content = content.replace(mapped_data_target, new_mapped_data)
    else:
        print("Failed to find mappedData")
        sys.exit(1)


    # 3. Update the switch case logic
    switch_regex = re.compile(r'    switch \(currentStep\) \{.*?(?=  // Hobbies tags selectors handler)', re.DOTALL)
    
    new_switch_logic = """    const skippableSteps = [11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
    const isSkip = valueToProcess.toLowerCase() === 'skip';
    const finalValue = isSkip ? 'Not Specified' : valueToProcess;

    switch (currentStep) {
      case -1: // Password entered
        if (valueToProcess.length < 6) {
          setErrorMsg(t('error_short_password'));
          setCurrentStep(-1);
          setMessages(prev => prev.slice(0, -1));
          return;
        }
        AuthService.setupPassword({ password: valueToProcess }).then(() => {
          triggerBotResponse(t('bot_welcome'), 'text');
        }).catch(err => {
          setErrorMsg('Failed to set password: ' + err.message);
          setCurrentStep(-1);
          setMessages(prev => prev.slice(0, -1));
        });
        break;

      // === SECTION 1: PERSONAL DETAILS ===
      case 0: // Name entered -> Ask Phone
        setBiodataForm(prev => ({ ...prev, fullName: valueToProcess }));
        triggerBotResponse(t('bot_phone', { name: valueToProcess }), 'text');
        break;

      case 1: // Phone entered -> Ask Gender
        if (!/^\+?[0-9\s-]{10,15}$/.test(valueToProcess)) {
          setErrorMsg(locale === 'en' ? 'Please enter a valid phone number.' : 'कृपया एक वैध फ़ोन नंबर दर्ज करें।');
          setCurrentStep(1);
          setMessages(prev => prev.slice(0, -1));
          return;
        }
        setBiodataForm(prev => ({ ...prev, phoneNumber: valueToProcess }));
        const defaultPhoto = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400';
        setBiodataForm(prev => ({ ...prev, photoUrl: defaultPhoto }));
        triggerBotResponse(t('bot_gender', { name: biodataForm.fullName || valueToProcess }), 'select', ['Female', 'Male']);
        break;

      case 2: // Gender selected -> Ask Age
        setBiodataForm(prev => ({ 
          ...prev, 
          gender: valueToProcess as 'Male' | 'Female',
          photoUrl: valueToProcess === 'Female'
            ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400'
            : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400&h=400'
        }));
        triggerBotResponse(t('bot_age'), 'text');
        break;

      case 3: // Age entered -> Ask Height
        const ageNum = parseInt(valueToProcess);
        if (isNaN(ageNum) || ageNum < 18 || ageNum > 70) {
          setErrorMsg(t('chat_error_age'));
          setCurrentStep(3);
          setMessages(prev => prev.slice(0, -1));
          return;
        }
        setBiodataForm(prev => ({ ...prev, age: ageNum }));
        triggerBotResponse(t('bot_height'), 'select', ["5' 0\\"", "5' 2\\"", "5' 4\\"", "5' 6\\"", "5' 8\\"", "5' 10\\"", "6' 0\\"+"]);
        break;

      case 4: // Height entered -> Ask Marital Status
        setBiodataForm(prev => ({ ...prev, height: valueToProcess }));
        triggerBotResponse(t('bot_marital'), 'select', ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce']);
        break;

      case 5: // Marital Status entered -> Ask Complexion
        setBiodataForm(prev => ({ ...prev, maritalStatus: valueToProcess }));
        triggerBotResponse(t('bot_complexion'), 'select', ['Very Fair', 'Fair', 'Wheatish', 'Dark']);
        break;

      case 6: // Complexion entered -> Ask Religion
        setBiodataForm(prev => ({ ...prev, complexion: valueToProcess }));
        triggerBotResponse(t('bot_religion'), 'select', [...optionsReligion, 'Skip']);
        break;

      case 7: // Religion entered -> Ask Caste
        setBiodataForm(prev => ({ ...prev, religion: finalValue }));
        triggerBotResponse(t('bot_caste'), 'select', [...optionsCaste, 'Skip']);
        break;

      case 8: // Caste selected -> Ask Gotra
        setBiodataForm(prev => ({ ...prev, caste: finalValue }));
        triggerBotResponse(t('bot_gotra'), 'select', [...optionsGotra, 'Skip']);
        break;

      case 9: // Gotra selected -> Ask Mool
        setBiodataForm(prev => ({ ...prev, gotra: finalValue }));
        triggerBotResponse(locale === 'en' ? 'What is your Mool?' : 'आपका मूल क्या है?', 'text');
        break;

      case 10: // Mool entered -> Ask Diet
        setBiodataForm(prev => ({ ...prev, mool: finalValue }));
        triggerBotResponse(t('bot_diet'), 'select', ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan', 'Skip']);
        break;

      case 11: // Diet entered -> Ask Birth Place
        setBiodataForm(prev => ({ ...prev, diet: finalValue }));
        triggerBotResponse(locale === 'en' ? 'Where were you born? (Birth Place)' : 'आपका जन्म स्थान क्या है?', 'text');
        break;

      // === SECTION 2: EDUCATIONAL & PROFESSIONAL DETAILS ===
      case 12: // Birth Place entered -> Section Banner + Education
        setBiodataForm(prev => ({ ...prev, birthPlace: finalValue }));
        setMessages(prev => [...prev, {
          id: 'banner-sec2',
          sender: 'bot',
          text: locale === 'en' ? '— 🎓 Section 2 of 5: Education & Profession —' : '— 🎓 भाग 2/5: शिक्षा और पेशा —',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        triggerBotResponse(t('bot_education'), 'text');
        break;

      case 13: // Education entered -> Ask Profession
        setBiodataForm(prev => ({ ...prev, education: finalValue }));
        triggerBotResponse(t('bot_profession'), 'select', optionsProfession);
        break;

      case 14: // Profession entered -> Ask Income
        setBiodataForm(prev => ({ ...prev, profession: finalValue }));
        triggerBotResponse(t('bot_income'), 'text');
        break;

      // === SECTION 3: FAMILY DETAILS ===
      case 15: { // Income entered -> Section Banner + Father's Name
        if (!isSkip) {
          const incomeNum = parseInt(valueToProcess);
          if (isNaN(incomeNum) || incomeNum <= 0) {
            setErrorMsg(t('chat_error_income'));
            setCurrentStep(15);
            setMessages(prev => prev.slice(0, -1));
            return;
          }
          setBiodataForm(prev => ({ ...prev, annualIncome: incomeNum }));
        }
        
        setMessages(prev => [...prev, {
          id: 'banner-sec3',
          sender: 'bot',
          text: locale === 'en' ? '— 👨‍👩‍👧‍👦 Section 3 of 5: Family Details —' : '— 👨‍👩‍👧‍👦 भाग 3/5: परिवार का विवरण —',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        triggerBotResponse(locale === 'en' ? 'What is your Father\\'s Name?' : 'आपके पिता का क्या नाम है?', 'text');
        break;
      }

      case 16: // Father's Name -> Mother's Name
        setBiodataForm(prev => ({ ...prev, fatherName: finalValue }));
        triggerBotResponse(locale === 'en' ? 'What is your Mother\\'s Name?' : 'आपकी माता का क्या नाम है?', 'text');
        break;

      case 17: // Mother's Name -> Grandparent's Name
        setBiodataForm(prev => ({ ...prev, motherName: finalValue }));
        triggerBotResponse(locale === 'en' ? 'What is your Grandparent\\'s Name? (Optional)' : 'आपके दादा/दादी का क्या नाम है? (वैकल्पिक)', 'text');
        break;

      case 18: // Grandparent's Name -> Siblings Details
        setBiodataForm(prev => ({ ...prev, grandparentName: finalValue }));
        triggerBotResponse(locale === 'en' ? 'Any details about your siblings? (e.g. 1 Brother, 1 Sister)' : 'आपके भाई-बहनों के बारे में कोई विवरण? (उदा. 1 भाई, 1 बहन)', 'text');
        break;

      // === SECTION 4: ADDRESS DETAILS ===
      case 19: // Siblings Details -> Section Banner + Current City
        setBiodataForm(prev => ({ ...prev, siblingsDetail: finalValue }));
        setMessages(prev => [...prev, {
          id: 'banner-sec4',
          sender: 'bot',
          text: locale === 'en' ? '— 🏠 Section 4 of 5: Address Details —' : '— 🏠 भाग 4/5: पते का विवरण —',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        triggerBotResponse(t('bot_city'), 'select', optionsCity);
        break;

      case 20: // Current City -> Street Address
        setBiodataForm(prev => ({ ...prev, location: finalValue }));
        triggerBotResponse(locale === 'en' ? 'What is your street address or neighborhood?' : 'आपका गली का पता या मोहल्ला क्या है?', 'text');
        break;

      // === SECTION 5: ADDITIONAL INFO & CONTACT ===
      case 21: // Street Address -> Section Banner + Interests
        setBiodataForm(prev => ({ ...prev, streetAddress: finalValue } as any));
        setMessages(prev => [...prev, {
          id: 'banner-sec5',
          sender: 'bot',
          text: locale === 'en' ? '— 🌟 Section 5 of 5: Additional Info —' : '— 🌟 भाग 5/5: अतिरिक्त जानकारी —',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        triggerBotResponse(t('bot_interests'), 'tags', ['Madhubani Painting', 'Classical Music', 'Cooking', 'Reading', 'Travel', 'Gardening', 'Yoga']);
        break;

      case 22: // Hobbies selected -> Ask Bio
        setBiodataForm(prev => ({ ...prev, interests: tempInterests }));
        triggerBotResponse(t('bot_bio'), 'text');
        break;

      case 23: // Bio entered -> Ask Photo Upload
        setBiodataForm(prev => ({ ...prev, aboutMe: finalValue }));
        triggerBotResponse(t('bot_photo'), 'file');
        break;

      case 24: // Photo Uploaded -> Summary Review
        if (valueToProcess && valueToProcess !== 'skip') {
          setBiodataForm(prev => ({ ...prev, photoUrl: valueToProcess }));
        }
        triggerBotResponse(t('bot_summary'), 'summary');
        break;

      case 25: // (Was 20) Email entered in Biodata Mode
        if (!/^\S+@\S+\.\S+$/.test(valueToProcess)) {
          setErrorMsg(locale === 'en' ? 'Please enter a valid email.' : 'कृपया एक वैध ईमेल दर्ज करें।');
          setCurrentStep(25);
          setMessages(prev => prev.slice(0, -1));
          return;
        }
        setEmail(valueToProcess);
        setTyping(true);
        try {
          await AuthService.requestOtp({ email: valueToProcess });
          setTyping(false);
          triggerBotResponse(locale === 'en' ? 'OTP sent! Please enter the 6-digit code.' : 'OTP भेजा गया! कृपया 6-अंकीय कोड दर्ज करें।', 'text');
        } catch (err) {
          setTyping(false);
          setErrorMsg(locale === 'en' ? 'Failed to send OTP. Try again.' : 'OTP भेजने में विफल। पुनः प्रयास करें।');
          setCurrentStep(25);
          setMessages(prev => prev.slice(0, -1));
        }
        break;

      case 26: // (Was 21) OTP entered in Biodata Mode
        if (valueToProcess.length !== 6) {
          setErrorMsg(locale === 'en' ? 'OTP must be 6 digits.' : 'OTP 6 अंकों का होना चाहिए।');
          setCurrentStep(26);
          setMessages(prev => prev.slice(0, -1));
          return;
        }
        setTyping(true);
        try {
          await AuthService.verifyOtp({ email, otp: valueToProcess });
          setTyping(false);
          // Save the profile and trigger download/matches immediately!
          await handleFinalRegister(true); 
          if (onDownloadBiodata) {
            onDownloadBiodata(template, biodataForm);
          }
          triggerBotResponse(locale === 'en' ? 'Profile saved and Biodata downloading! Taking you to matches...' : 'प्रोफ़ाइल सहेजी गई और बायोडेटा डाउनलोड हो रहा है! आपको मैचों पर ले जा रहे हैं...', 'text');
          setTimeout(() => {
            onComplete();
          }, 1500);
        } catch (err) {
          setTyping(false);
          setErrorMsg(locale === 'en' ? 'Invalid OTP. Please try again.' : 'अमान्य OTP। कृपया पुनः प्रयास करें।');
          setCurrentStep(26);
          setMessages(prev => prev.slice(0, -1));
        }
        break;

      case 27: // Template selection action handled by buttons
        break;
    }
"""
    if switch_regex.search(content):
        content = switch_regex.sub(new_switch_logic, content)
    else:
        print("Failed to find switch logic")
        sys.exit(1)


    # 4. Update the handleConfirmSummary mapping from 19 to 25
    confirm_summary_target = """      setCurrentStep(19); // shifted from 18 to 19 because step 17 is now 18.
      triggerBotResponse(locale === 'en' ? 'Awesome! Now, choose a premium design for your Biodata.' : 'बहुत बढ़िया! अब, अपने बायोडेटा के लिए एक प्रीमियम डिज़ाइन चुनें।', 'template');"""

    new_confirm_summary = """      setCurrentStep(27); // Template Step is now 27
      triggerBotResponse(locale === 'en' ? 'Awesome! Now, choose a premium design for your Biodata.' : 'बहुत बढ़िया! अब, अपने बायोडेटा के लिए एक प्रीमियम डिज़ाइन चुनें।', 'template');"""
    
    if confirm_summary_target in content:
        content = content.replace(confirm_summary_target, new_confirm_summary)
    else:
        print("Failed to find handleConfirmSummary")
        sys.exit(1)
        
    # Update currentStep(19) mapping in Template rendering loop
    template_btn_target = """                      setCurrentStep(19);
                      triggerBotResponse(locale === 'en' ? 'Great choice! Please provide your email to save and download your Biodata.' : 'बढ़िया विकल्प! अपना बायोडेटा सहेजने और डाउनलोड करने के लिए कृपया अपना ईमेल प्रदान करें।', 'text');"""
                      
    new_template_btn = """                      setCurrentStep(25);
                      triggerBotResponse(locale === 'en' ? 'Great choice! Please provide your email to save and download your Biodata.' : 'बढ़िया विकल्प! अपना बायोडेटा सहेजने और डाउनलोड करने के लिए कृपया अपना ईमेल प्रदान करें।', 'text');"""

    if template_btn_target in content:
        content = content.replace(template_btn_target, new_template_btn)
        
    # 5. Add Skip button to UI
    # We need to find the chat-input-bar form and add the skip button
    ui_target = """        <button
          type="submit"
          disabled={typing || (messages.length > 0 && messages[messages.length - 1].sender === 'bot' && messages[messages.length - 1].inputType !== 'text')}
          style={styles.primarySendBtn}
          data-testid="chat-send"
        >
          {t('chat_btn_send')}
        </button>
      </form>"""

    new_ui = """        <button
          type="submit"
          disabled={typing || (messages.length > 0 && messages[messages.length - 1].sender === 'bot' && messages[messages.length - 1].inputType !== 'text')}
          style={styles.primarySendBtn}
          data-testid="chat-send"
        >
          {t('chat_btn_send')}
        </button>
        {/* Skip Button */}
        {(() => {
           const skippableSteps = [9, 10, 11, 13, 14, 15, 16, 17, 18, 20, 21, 23];
           if (skippableSteps.includes(currentStep) && !typing && (messages.length > 0 && messages[messages.length - 1].sender === 'bot' && messages[messages.length - 1].inputType === 'text')) {
              return (
                <button
                  type="button"
                  onClick={() => handleUserSubmit(undefined, 'Skip')}
                  style={{...styles.skipUploadBtn, padding: '0.9rem 1.2rem', marginLeft: '0.5rem', whiteSpace: 'nowrap', alignSelf: 'center', marginTop: 0 }}
                >
                  ⏭️ {locale === 'en' ? 'Skip' : 'छोड़ें'}
                </button>
              );
           }
           return null;
        })()}
      </form>"""

    if ui_target in content:
        content = content.replace(ui_target, new_ui)
    else:
        print("Failed to find UI target")
        sys.exit(1)


    # Update the handleUserSubmit check for tempInterests
    tempinterests_target = """    if (!valueToProcess && currentStep !== 16) { // Hobbies selection done via button"""
    new_tempinterests = """    if (!valueToProcess && currentStep !== 22) { // Hobbies selection done via button"""
    
    if tempinterests_target in content:
        content = content.replace(tempinterests_target, new_tempinterests)
        
    tempinterests_submit_target = """currentStep === 16 ? tempInterests.join(', ') : valueToProcess"""
    new_tempinterests_submit = """currentStep === 22 ? tempInterests.join(', ') : valueToProcess"""
    
    if tempinterests_submit_target in content:
        content = content.replace(tempinterests_submit_target, new_tempinterests_submit)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("Success")

if __name__ == '__main__':
    main()
