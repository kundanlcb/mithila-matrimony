# Technical Research: Project Setup (Phase One)

This research document resolves the design and technical setup details for the initial bootstrapping of the **Mithila Matrimony** application.

---

## Technical Decisions & Rationale

### 1. Frontend Directory Structure
*   **Decision**: Adopt a feature-and-modular layout under `/src`:
    *   `/components`: Atomic, reusable components (Button, Input, Card, Modal, Navigation).
    *   `/pages`: Screen-level layout components matching the primary user views:
        *   `LandingPage` / `AuthPage`: OTP entry and basic landing.
        *   `RegisterPage`: Multi-step biodata form wizard.
        *   `BrowsePage`: Profile searching, sorting, and filtering.
        *   `MatchesPage`: Compatibility score-based matching recommendations.
    *   `/context`: Global React contexts for state propagation (e.g., `AppContext.tsx` or `AuthContext.tsx` representing the active user biodata and simulated verification status).
    *   `/mock`: Simulated backend data models, local storage adapters, and sample data lists.
    *   `/styles`: Modular Vanilla CSS files loaded via `/src/styles/index.css`.
*   **Rationale**: Modular files are highly testable, isolate concerns, and scale cleanly when migrating mock systems to standard API endpoints.

### 2. Global Styling System (Vanilla CSS HSL Tokens)
*   **Decision**: Design a centralized token file (`/src/styles/index.css`) establishing modern typography scales and CSS variables using highly curated HSL values.
    *   *Primary Tones*: Sleek HSL Magenta tokens (ranging from deep `#880E4F` to vibrant `#D81B60` and soft accent pinks `#F48FB1`).
    *   *Surfaces*: Premium neutral cards utilizing `backdrop-filter: blur(12px)` and rgba colors to construct glassmorphism layouts.
    *   *Responsive Layouts*: Set CSS variables for mobile-first media queries (`--breakpoint-mobile: 480px`, `--breakpoint-tablet: 768px`).
*   **Rationale**: Vanilla CSS variable tokens provide direct native browser performance, clean overrides, avoid build tool overhead, and enforce visual consistency across all pages.

### 3. Mock Service & Database Architecture
*   **Decision**: Construct a mock datastore (`/src/mock/mockDb.ts`) exposing TypeScript types and utility functions.
    *   *Mock In-Memory DB*: Load 5+ highly descriptive default profiles representing a realistic variety of age, occupations, gotras, and locations.
    *   *State Engine*: Utility functions to simulate network requests (e.g., `mockVerifyOtp(mobile, code)` and `mockRegisterUser(biodata)`).
    *   *Storage Adapter*: Synchronize mock states to browser `localStorage` so registrations and matches persist across browser reloads.
*   **Rationale**: Facilitates full user scenarios offline with rich, high-fidelity interactivity before any real server-side infrastructure is written.

### 4. Standing Standalone Backend Segregation
*   **Decision**: The backend will be developed as a completely separate standalone project workspace (separate Git repository/folder).
*   **Rationale**: Decouples dependencies and development paths, enabling absolute isolation. The frontend in this project will interact purely with the local high-fidelity mock engine, aligning exactly with the API contracts in `contracts/api-contracts.md` to ensure zero-effort future integration.

---

## Alternatives Considered

| Technical Option | Chosen Alternative | Rejected Alternative | Reason for Rejection |
| :--- | :--- | :--- | :--- |
| **Styling** | Vanilla CSS with custom HSL variable tokens | TailwindCSS or CSS-in-JS | CSS-in-JS creates runtime overhead; Tailwind requires complex configurations. Vanilla CSS is cleaner, fits the browser native approach, and follows exact user styling specifications. |
| **API Mocking** | In-memory functions synchronized to `localStorage` | MSW (Mock Service Worker) or JSON Server | MSW/JSON-Server require additional running server environments or service worker registrations that complicate simple static hosting or initial phase-one setups. |
| **Backend Layout** | Standalone separate backend project | Monorepo layout with `/backend` folder | A standalone separate backend project isolates configurations, separates deployment models, and avoids commit history blending between client and server. |
