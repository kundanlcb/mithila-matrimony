import re

with open('src/components/RegistrationChat.tsx', 'r') as f:
    content = f.read()

# 1. Update line 209 and 218
content = re.sub(r'currentStep !== 22\)', 'currentStep !== 25)', content)
content = re.sub(r'currentStep === 22 \? tempInterests', 'currentStep === 25 ? tempInterests', content)

# 2. Update line 674 (OTP check)
content = re.sub(r'currentStep === 26 && msg.id === messages', 'currentStep === 29 && msg.id === messages', content)

# 3. Update line 1022 (skippable steps)
content = re.sub(
    r'const skippableSteps = \[.*?\];',
    'const skippableSteps = [4, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 26];',
    content
)

# 4. Replace the entire switch block
switch_start = content.find('switch (currentStep) {')
switch_end = content.find('      case 27: // Template selection action handled by buttons')

if switch_start != -1 and switch_end != -1:
    # Need to find the end of case 27 (or just replace up to case 27)
    # Actually it's case 27 in the old code. We will replace up to the end of case 27.
    # The old case 27 is:
    # case 27: // Template selection action handled by buttons
    #   break;
    # }
    
    end_index = content.find('}', switch_end) + 1
    
    new_switch = """switch (currentStep) {
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

      case 2: // Gender selected -> Ask DOB
        setBiodataForm(prev => ({ 
          ...prev, 
          gender: valueToProcess as 'Male' | 'Female',
          photoUrl: valueToProcess === 'Female'
            ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400'
            : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400&h=400'
        }));
        triggerBotResponse(t('bot_age'), 'text');
        break;

      case 3: // DOB entered -> Ask Birth Place
        if (!valueToProcess || valueToProcess.trim() === '') {
          setErrorMsg(t('chat_error_age'));
          setCurrentStep(3);
          setMessages(prev => prev.slice(0, -1));
          return;
        }
        setBiodataForm(prev => ({ ...prev, dateOfBirth: valueToProcess.trim() }));
        triggerBotResponse(locale === 'en' ? 'Where were you born? (Birth Place)' : 'आपका जन्म स्थान क्या है?', 'text');
        break;

      case 4: // Birth Place -> Ask Height
        setBiodataForm(prev => ({ ...prev, birthPlace: finalValue }));
        triggerBotResponse(t('bot_height'), 'select', ["5' 0\"", "5' 2\"", "5' 4\"", "5' 6\"", "5' 8\"", "5' 10\"", "6' 0\"+"]);
        break;

      case 5: // Height entered -> Ask Marital Status
        setBiodataForm(prev => ({ ...prev, height: valueToProcess }));
        triggerBotResponse(t('bot_marital'), 'select', ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce']);
        break;

      case 6: // Marital Status entered -> Ask Complexion
        setBiodataForm(prev => ({ ...prev, maritalStatus: valueToProcess }));
        triggerBotResponse(t('bot_complexion'), 'select', ['Very Fair', 'Fair', 'Wheatish', 'Dark']);
        break;

      case 7: // Complexion entered -> Ask Religion
        setBiodataForm(prev => ({ ...prev, complexion: valueToProcess }));
        triggerBotResponse(t('bot_religion'), 'select', [...optionsReligion]);
        break;

      case 8: // Religion entered -> Ask Caste
        setBiodataForm(prev => ({ ...prev, religion: finalValue }));
        triggerBotResponse(t('bot_caste'), 'select', [...optionsCaste]);
        break;

      case 9: // Caste selected -> Ask Gotra
        setBiodataForm(prev => ({ ...prev, caste: finalValue }));
        triggerBotResponse(t('bot_gotra'), 'select', [...optionsGotra]);
        break;

      case 10: // Gotra selected -> Ask Mool
        setBiodataForm(prev => ({ ...prev, gotra: finalValue }));
        triggerBotResponse(locale === 'en' ? 'What is your Mool?' : 'आपका मूल क्या है?', 'text');
        break;

      case 11: // Mool entered -> Ask Diet
        setBiodataForm(prev => ({ ...prev, mool: finalValue }));
        triggerBotResponse(t('bot_diet'), 'select', ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan']);
        break;

      case 12: // Diet entered -> Section Banner + Education
        setBiodataForm(prev => ({ ...prev, diet: finalValue }));
        setMessages(prev => [...prev, {
          id: 'banner-sec2',
          sender: 'bot',
          text: locale === 'en' ? '— 🎓 Section 2 of 5: Education & Profession —' : '— 🎓 भाग 2/5: शिक्षा और पेशा —',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        triggerBotResponse(t('bot_education'), 'text');
        break;

      // === SECTION 2: EDUCATIONAL & PROFESSIONAL DETAILS ===
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
        triggerBotResponse(locale === 'en' ? 'What is your Grandparent\\'s Name?' : 'आपके दादा/दादी का क्या नाम है?', 'text');
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
        triggerBotResponse(locale === 'en' ? 'Which City do you currently live in?' : 'आप वर्तमान में किस शहर में रहते हैं?', 'text');
        break;

      case 20: // Current City -> Current State
        setBiodataForm(prev => ({ ...prev, currentCity: finalValue, location: finalValue }));
        triggerBotResponse(locale === 'en' ? 'Which State do you currently live in?' : 'आप वर्तमान में किस राज्य में रहते हैं?', 'text');
        break;

      case 21: // Current State -> Pincode
        setBiodataForm(prev => ({ ...prev, currentState: finalValue }));
        triggerBotResponse(locale === 'en' ? 'What is your current Pincode?' : 'आपका वर्तमान पिनकोड क्या है?', 'text');
        break;
        
      case 22: // Pincode -> Locality
        setBiodataForm(prev => ({ ...prev, pincode: finalValue }));
        triggerBotResponse(locale === 'en' ? 'What is your locality/colony/village?' : 'आपका मोहल्ला/कॉलोनी/गांव क्या है?', 'text');
        break;

      case 23: // Locality -> Native District
        setBiodataForm(prev => ({ ...prev, locality: finalValue }));
        triggerBotResponse(locale === 'en' ? 'What is your Native District?' : 'आपका मूल जिला क्या है?', 'text');
        break;

      // === SECTION 5: ADDITIONAL INFO & CONTACT ===
      case 24: // Native District -> Section Banner + Interests
        setBiodataForm(prev => ({ ...prev, nativeDistrict: finalValue }));
        setMessages(prev => [...prev, {
          id: 'banner-sec5',
          sender: 'bot',
          text: locale === 'en' ? '— 🌟 Section 5 of 5: Additional Info —' : '— 🌟 भाग 5/5: अतिरिक्त जानकारी —',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        triggerBotResponse(t('bot_interests'), 'tags', ['Madhubani Painting', 'Classical Music', 'Cooking', 'Reading', 'Travel', 'Gardening', 'Yoga']);
        break;

      case 25: // Hobbies selected -> Ask Bio
        setBiodataForm(prev => ({ ...prev, interests: tempInterests }));
        triggerBotResponse(t('bot_bio'), 'text');
        break;

      case 26: // Bio entered -> Ask Photo Upload
        setBiodataForm(prev => ({ ...prev, aboutMe: finalValue }));
        triggerBotResponse(t('bot_photo'), 'file');
        break;

      case 27: // Photo Uploaded -> Summary Review
        if (valueToProcess && valueToProcess !== 'skip') {
          setBiodataForm(prev => ({ ...prev, photoUrl: valueToProcess }));
        }
        triggerBotResponse(t('bot_summary'), 'summary');
        break;

      case 28: // Email entered in Biodata Mode
        if (!/^\S+@\S+\.\S+$/.test(valueToProcess)) {
          setErrorMsg(locale === 'en' ? 'Please enter a valid email.' : 'कृपया एक वैध ईमेल दर्ज करें।');
          setCurrentStep(28);
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
          setCurrentStep(28);
          setMessages(prev => prev.slice(0, -1));
        }
        break;

      case 29: // OTP entered in Biodata Mode
        if (valueToProcess.length !== 6) {
          setErrorMsg(locale === 'en' ? 'OTP must be 6 digits.' : 'OTP 6 अंकों का होना चाहिए।');
          setCurrentStep(29);
          setMessages(prev => prev.slice(0, -1));
          return;
        }
        setTyping(true);
        try {
          await AuthService.verifyOtp({ email, otp: valueToProcess });
          setTyping(false);
        } catch (err) {
          setTyping(false);
          setErrorMsg(locale === 'en' ? 'Invalid OTP. Please try again.' : 'अमान्य OTP। कृपया पुनः प्रयास करें।');
          setCurrentStep(29);
          setMessages(prev => prev.slice(0, -1));
          return; // Stop here if OTP fails
        }

        // OTP succeeded, now save profile
        setTyping(true);
        try {
          // Save the profile and trigger download/matches immediately!
          await handleFinalRegister(true); 
          setTyping(false);
          if (onDownloadBiodata) {
            onDownloadBiodata(template, biodataForm);
          }
          triggerBotResponse(locale === 'en' ? 'Profile saved and Biodata downloading! Taking you to matches...' : 'प्रोफ़ाइल सहेजी गई और बायोडेटा डाउनलोड हो रहा है! आपको मैचों पर ले जा रहे हैं...', 'text');
          setTimeout(() => {
            onComplete();
          }, 1500);
        } catch (err: any) {
          setTyping(false);
          setCurrentStep(29);
          setMessages(prev => prev.slice(0, -1));
        }
        break;
      case 30: // Template selection action handled by buttons
        break;
    }"""
    
    content = content[:switch_start] + new_switch + content[end_index:]

    with open('src/components/RegistrationChat.tsx', 'w') as f:
        f.write(content)
    print("Done")
else:
    print("Failed to find switch block limits")
