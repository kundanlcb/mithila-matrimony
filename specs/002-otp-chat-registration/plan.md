# Implementation Plan: Conversational OTP Login & Registration (Phase Two)

**Branch**: `002-otp-chat-registration` | **Date**: 2026-05-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-otp-chat-registration/spec.md`

---

## Summary
The goal of this phase is to construct a highly engaging, fully localized bilingual (English/Hindi) matrimonial onboarding experience. It replaces standard multi-step inputs with a responsive, visual chatbot dialog system, and introduces a sleek Light/Dark mode theme selector across the entire platform.

---

## Technical Context

*   **Language/Version**: React 19 / TypeScript 5.x / Vanilla CSS
*   **Primary Dependencies**: React 19, TypeScript, Lucide Icons (or custom SVGs).
*   **Storage**: `localStorage` (mock sessions, profiles, translations state, theme selections).
*   **Testing**: E2E chat flows, boundary validations, build suite checks.
*   **Target Platform**: Viewports down to 320px, supporting dark/light native attribute selectors.
*   **Project Type**: Conversational Client SPA.
*   **Performance Goals**: Language translations < 50ms, theme transitions < 100ms.
*   **Constraints**: Strictly Vanilla CSS, no third-party translation/theme libraries.

---

## Constitution Check

- **Premium & Minimal Magenta Aesthetic (Gate 1)**: **PASSED**. Dark theme incorporates custom HSL visual tokens (deep slate, translucent dark glassmorphism backdrops, high-contrast borders) complementing the vibrant magenta primary brand.
- **Mobile-First & Web-Ready Design (Gate 2)**: **PASSED**. Chat viewport uses standard responsive flex columns and automatic bottom scroll alignment, ensuring easy single-hand touch inputs on mobile viewports.
- **Mock-Driven Frontend First (Gate 3)**: **PASSED**. Uses offline local storage and simulated services to drive verified auth and onboarding before Spring Boot setup.
- **Conversational Engagement (Gate 4)**: **PASSED**. Custom chatbot sequential flow breaks inputs into modular, easy-to-digest sections.

---

## Proposed Changes

### 1. Localization & Theme Core Skeletons

#### [NEW] [translations.ts](file:///Users/kundan/Documents/codebase/mithila-matrimony/src/mock/translations.ts)
- Dual English-Hindi translations dictionary covering all general UI elements, auth views, chatbot dialogue states, and error alerts.

#### [NEW] [LanguageContext.tsx](file:///Users/kundan/Documents/codebase/mithila-matrimony/src/context/LanguageContext.tsx)
- React context provider exposing the active `locale: 'en' | 'hi'`, standard translation helper `t(key, replacements)`, and switcher methods.

#### [NEW] [ThemeContext.tsx](file:///Users/kundan/Documents/codebase/mithila-matrimony/src/context/ThemeContext.tsx)
- Exposes `theme: 'light' | 'dark'`, toggles HTML `data-theme` attribute, and persists choice in localStorage.

---

### 2. Conversational Dialogue Component

#### [NEW] [RegistrationChat.tsx](file:///Users/kundan/Documents/codebase/mithila-matrimony/src/components/RegistrationChat.tsx)
- Visually premium conversational chat view. Implements bot question indexes (Welcome -> Name -> Gender -> Age -> Gotra -> Location -> Education -> Profession -> Income -> Interests -> Bio -> Summary).
- Auto-scroll mechanics, typing indicators, validation warnings, and quick choice-bubbles (chips) for gotra, gender, and hobbies.
- Integrates the gorgeous final "Mithila Biodata Summary Card" showing full user reviews.

---

### 3. Visual Styling & Page Integration

#### [MODIFY] [index.css](file:///Users/kundan/Documents/codebase/mithila-matrimony/src/styles/index.css)
- Implement `[data-theme="dark"]` custom visual variables.
- Add CSS layout properties for the conversational chat UI: bot bubbles (soft pink glassmorphism), user bubbles (vibrant magenta brand), typing animations, custom inputs, and dynamic scrollbars.

#### [MODIFY] [App.tsx](file:///Users/kundan/Documents/codebase/mithila-matrimony/src/App.tsx)
- Bootstrapping language and theme context wrappers.
- Integrating localized language switches and theme selectors (Sun/Moon icons) inside the sticky navigation header.
- Replacing the simple 3-step registration wizard with our newly created `RegistrationChat` component.
- Updating all page structures, browse grids, landing summaries, and buttons to use the localized `t(key)` text selector to achieve 100% localization.

---

## Verification Plan

### E2E Chat Verification
1. Open Auth page -> login with simulated mobile number.
2. Verify chatbot greets in English, switch to Hindi, verify translations.
3. Submit letters for age question, verify bot politely triggers validation error warning in active language.
4. Click select buttons for Gotra and Gender to verify quick choices bubbles add to chat feed.
5. Fill out all 10 inputs, verify the final "Mithila Biodata Summary Card" renders correctly, and click "Confirm" to successfully view browse matches.
6. Toggle light/dark theme to verify dark surfaces transitions with no visual overlaps.
