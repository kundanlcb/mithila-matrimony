# Feature Specification: Conversational OTP Login & Registration

**Feature Branch**: `002-otp-chat-registration`

**Created**: 2026-05-27

**Status**: Draft

**Input**: User description: "Complete login and registration using phone and OTP, featuring a highly engaging conversational chat-like UI for biodata input, full English and Hindi localization support, and a responsive light and dark theme mode toggle."

---

## User Scenarios & Testing

### User Story 1 - Secure OTP-Based Login/Register (Priority: P1)
As a user, I want to securely log in or sign up using my phone number and a one-time verification code, so that I can access the app quickly without remembering passwords.

**Why this priority**: Core security and entrance gateway. Absolute prerequisite for accessing personalized match discoverability.

**Independent Test**: Can be fully tested by attempting entry with a valid E.164 phone number, verifying receipt of the simulated OTP code, submitting it, and checking for successful session initialization.

**Acceptance Scenarios**:
1. **Given** an unauthenticated visitor on the Auth Page, **When** they submit a valid phone number, **Then** the system sends a simulated 6-digit OTP code and reveals a verification input screen.
2. **Given** the verification screen is active, **When** they submit the correct code, **Then** they are successfully authenticated, a session token is saved in localStorage, and they are navigated to the registration or search dashboard.

---

### User Story 2 - Engaging Chat-Like Biodata Questionnaire (Priority: P1)
As a user registering my matrimony profile, I want a conversational, step-by-step chat interface rather than a boring traditional form, so that I don't feel fatigued or bored during onboarding.

**Why this priority**: Crucial UX innovation to maximize profile completion rates and decrease drop-offs on lengthy forms.

**Independent Test**: Verified by walking through the entire chatbot dialogue, checking that the bot asks questions sequentially, accepts user responses, handles button choices (gotra, gender), and successfully populates the `localStorage` biodata record at the end.

**Acceptance Scenarios**:
1. **Given** a newly authenticated user entering the registration wizard, **When** the chat mounts, **Then** the bot displays a warm welcome prompt in the active language and initiates Section 1 (Name).
2. **Given** a choice-based question (e.g. gotra or gender), **When** the bot asks the question, **Then** it renders interactive choice bubbles (buttons) inside the chat stream to minimize manual typing.
3. **Given** an invalid input (e.g. text entered for age), **When** the user submits the response, **Then** the bot politely explains the error in the active language and re-prompts for that specific field.

---

### User Story 3 - Final Review & Biodata Summary (Priority: P1)
As a user completing the conversational onboarding, I want to see a beautiful visual summary card of all my captured biodata, with an option to confirm and submit, so that I can verify my information is 100% accurate.

**Why this priority**: Protects data integrity and ensures users have full visibility before their profile is published to the matrimonial candidate list.

**Independent Test**: Verified by completing the chat, checking that the summary card accurately displays all inputs (Gotra, profession, salary, age, hobbies), and confirming that clicking "Register" writes the profile to the matching pool.

**Acceptance Scenarios**:
1. **Given** the final question of the chat is answered, **When** the bot processes the reply, **Then** it outputs a visual glassmorphic "Mithila Biodata Summary Card" showing a clear overview of all data points.
2. **Given** the summary card, **When** I click "Confirm & Submit", **Then** my registration status upgrades to "completed" in localStorage and the app redirects me to the match browsing dashboard.

---

### User Story 4 - English & Hindi Language Switcher (Priority: P2)
As a bilingual or vernacular user, I want to switch the application language between English and Hindi at any moment, so that I can understand and fill out the details comfortably.

**Why this priority**: Crucial for target users in Mithila/Bihar regions where Hindi is the primary formal and conversational language.

**Independent Test**: Checked by clicking the language toggle at various stages (auth, mid-chat, browse) and verifying that all text, buttons, labels, and active chatbot conversations translate dynamically in under 100ms.

**Acceptance Scenarios**:
1. **Given** a user mid-way through the chatbot registration, **When** they click the "Hindi (हिंदी)" language button, **Then** the entire UI, the chatbot log history, and the current active question translate instantly into Hindi without resetting the chat sequence.

---

### User Story 5 - Dark & Light Theme Controller (Priority: P2)
As a user browsing profiles, I want to toggle between Light and Dark mode themes, so that I can navigate comfortably during day or night without visual fatigue.

**Why this priority**: Essential modern web practice ensuring premium accessibility and visual delight.

**Independent Test**: Verified by clicking the theme toggle and ensuring all CSS variable colors transition smoothly to deep, high-contrast dark tones with no layouts breaking.

**Acceptance Scenarios**:
1. **Given** the default Light Mode active, **When** I click the theme toggle, **Then** the document root receives a `data-theme="dark"` attribute, shifting background surfaces to deep burgundy-greys (`#0b0d10`, `#1a1618`) and maintaining vibrant magenta buttons.

---

## Edge Cases

- **Language Toggle Mid-Dialogue**: If a language toggle is executed while the bot is waiting for a specific question (e.g. gotra), the bot's outstanding question prompt must dynamically update its translation to keep the user's progress intact.
- **LocalStorage Full or Private Browser**: If writing to local storage fails, the system must maintain the active conversational memory in a React state context so registration can still be completed inside the session.

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST provide a secure OTP input modal or page validating 6-digit numeric verification inputs.
- **FR-002**: System MUST implement a Conversational Chat interface (`/src/components/RegistrationChat.tsx`) maintaining a message list:
  ```typescript
  interface ChatMessage {
    id: string;
    sender: 'bot' | 'user';
    text: string;
    timestamp: string;
    inputType?: 'text' | 'select' | 'tags' | 'summary';
    options?: string[];
  }
  ```
- **FR-003**: Chatbot MUST break inputs into 4 logical conversational segments:
  - *Section 1: General Details* (Full Name, Gender, Age)
  - *Section 2: Cultural Background* (Gotra, Current City)
  - *Section 3: Professional Portfolio* (Education, Occupation, Annual Income)
  - *Section 4: Personal Statement* (Hobbies/Interests, Brief Bio)
- **FR-004**: System MUST render interactive option chips/buttons inside the chat feed for choice questions (Gender: Male/Female, Gotra: Kashyap/Shandilya/etc.) to enable single-click responses.
- **FR-005**: System MUST render a visually premium "Mithila Biodata Summary Card" inside the chat feed when all questions are answered, containing a "Confirm & Register" action button.
- **FR-006**: System MUST implement a centralized Localization dictionary (`/src/mock/translations.ts`) and React context (`/src/context/LanguageContext.tsx`) supporting full English and Hindi copy for:
  - Welcome, placeholders, labels, error messages.
  - Chatbot dialogue prompts (e.g., bot questions, validation prompts).
- **FR-007**: System MUST configure a CSS Theme Controller Context (`/src/context/ThemeContext.tsx`) toggling the `data-theme` attribute on the `<html>` or `<body>` element.
- **FR-008**: System MUST configure dark mode visual styles under `/src/styles/index.css` matching these parameters:
  - `--bg-app` (Dark): HSL `224 71% 4%` (Deep sleek grey-black)
  - `--bg-card` (Dark): HSL `220 16% 12%` (Card dark charcoal)
  - `--border-light` (Dark): HSL `220 16% 20%`
  - `--bg-glass` (Dark): `rgba(20, 20, 25, 0.7)`

### Key Entities

- **ChatMessage**: Represents a conversational dialogue bubble.
- **TranslationKeys**: Map of all localizable text variables in English and Hindi.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: 100% of UI copy and interactive prompts translate within 80ms of clicking the language toggle.
- **SC-002**: Core visual elements adapt to theme change (Light/Dark transitions) in under 100ms.
- **SC-003**: The chat layout scrolls smoothly to the newest message automatically.
- **SC-004**: Chatbot validations prevent submitting empty names, string ages, or negative income.

---

## Assumptions

- Users have modern browsers supporting CSS transitions, CSS custom property re-evaluations, and basic local storage capacities.
- Input of mobile number and OTP is simulated offline using the verified mock engine.
