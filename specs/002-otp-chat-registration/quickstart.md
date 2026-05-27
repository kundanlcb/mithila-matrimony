# Quickstart Guide: Conversational Registration & Theme Setup (Phase Two)

This guide walks through running and verifying the localized conversational onboarding wizard and Light/Dark mode themes.

---

## 1. Verifying Language Translations

1.  **Mounting check**: Open the application, the default view is the unauthenticated home page in English.
2.  **Toggle language**: Click the language switcher button (e.g. `English / हिंदी`) in the top navigation panel.
3.  **HMR Verification**: Ensure all navigation headings, hero banners, and registration labels shift instantly between English and Hindi.
4.  **Verification mid-chat**: Launch the registration chatbot, switch language, and check that the bot's logged messages and outstanding query shift text seamlessly.

---

## 2. Testing Light & Dark Theme Transitions

1.  **Toggle theme**: Click the theme toggle icon (represented by Sun ☀️ and Moon 🌙) in the navigation bar.
2.  **DOM Inspection**: Open the browser element inspector and verify the HTML root tag receives the `data-theme="dark"` attribute:
    ```html
    <html data-theme="dark">
    ```
3.  **Color consistency**: Verify text remains readable, input boxes have correct borders, and cards render with high-contrast glassmorphism backdrops on dark canvases.

---

## 3. Conversational Onboarding Dialogue flow

1.  **Verify OTP**: Submit a phone number, receive the simulated code, and submit to proceed to the registration chat screen.
2.  **Conversational Dialogue**: Follow the chatbot's prompts. Ensure validation triggers on entering empty values or letters for the age/income questions.
3.  **Card Review**: Answer all questions, verify the final "Mithila Biodata Summary Card" renders correctly, and click "Confirm" to successfully publish the profile.
