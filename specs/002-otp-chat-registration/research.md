# Technical Research: Conversational OTP Login & Registration (Phase Two)

This research document resolves the design and technical execution details for **Phase Two: Conversational Login & Registration**.

---

## Technical Decisions & Rationale

### 1. Translation System (Localization)
*   **Decision**: Establish a native React context (`/src/context/LanguageContext.tsx`) managing a `locale` state (`'en' | 'hi'`) and serving a centralized key-value translation database (`/src/mock/translations.ts`).
    *   *Translations Schema*: Map all UI copy, error warnings, placeholder text, and chatbot dialogue states.
    *   *Implementation*: A simple custom hook `useLanguage()` returns `t(key)` returning the active locale text and `setLanguage(locale)`.
*   **Rationale**: Avoids bulky external libraries (like `i18next` or `react-intl`) that increase bundle sizes, keeps client-side rendering extremely fast, and maintains 100% type-safety for translation keys.

### 2. Styling Themes (Light & Dark Mode)
*   **Decision**: Build a centralized Theme Context (`/src/context/ThemeContext.tsx`) toggling the document-level attribute `data-theme`.
    *   *Trigger*: `document.documentElement.setAttribute('data-theme', theme)`
    *   *Styling integration*: Define `[data-theme="dark"]` overrides in `src/styles/index.css` re-declaring background surfaces and high-contrast parameters.
*   **Rationale**: Native CSS attributes offer hardware-accelerated animations, zero-flash transitions, and perfect synchronization across all components with zero visual lag.

### 3. Conversational Dialogue State Machine
*   **Decision**: Implement a step-based state machine in our chat UI controller:
    *   *Dialogue States*: A list of 11 questions mapping the biodata schema fields:
        1. Welcome + Name
        2. Gender (Chip choices)
        3. Age (Validation: 18-70)
        4. Gotra (Dropdown choices)
        5. Current City
        6. Education
        7. Occupation
        8. Annual Income (Validation: positive numeric)
        9. Hobbies/Interests (Multi-select tag bubbles)
        10. About Me / Personal bio
        11. Summary Review Card (Form validation & final confirm button)
    *   *Validation Layer*: Validates input on each "Send" click before moving to the next bot query.
*   **Rationale**: Prevents users from getting bored by simulating a friendly conversation, while still enforcing 100% data integrity.

---

## Alternatives Considered

| Technical Option | Chosen Alternative | Rejected Alternative | Reason for Rejection |
| :--- | :--- | :--- | :--- |
| **Localization** | Native React Context + Key-Value database | `react-i18next` or `react-intl` | Standard libraries introduce complex hook configurations and external configs unnecessary for our high-fidelity, high-speed static frontend. |
| **Theme Controller** | CSS variable overriding via `[data-theme="dark"]` attribute | React state class injection per-component | Manual inline-state theme styling creates rendering bottlenecks, breaks styling isolation, and increases file complexity. CSS attributes handle color shifting natively at browser level. |
| **Chat Logic** | Simple index-driven dialog machine | Complex NLP or third-party conversational bot APIs | Third-party bot engines introduce external dependencies, billing API keys, latency, and do not align with our mock-driven standalone model. |
