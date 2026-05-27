# Feature Specification: Project Setup (Phase One)

**Feature Branch**: `001-project-setup`

**Created**: 2026-05-27

**Status**: Draft

**Input**: User description: "start working on phase one .. we will set up folder structure, dependencies and all the required tools and tech for the app" (Updated: Backend will be scaffolded in a separate standalone project).

---

## User Scenarios & Testing

### User Story 1 - Developer Scaffold Verification (Priority: P1)
As a developer, I want a standardized and error-free React/TypeScript codebase with predefined directory structures, so that I can begin building components instantly.

**Why this priority**: Absolute blocker for all frontend development. We cannot write features without a solid structural and dependency foundation.

**Independent Test**: Can be fully tested by running `npm run dev` and `npm run build` in the root workspace; compiles with zero bundler or TypeScript warnings and serves a hot-reloaded blank canvas.

**Acceptance Scenarios**:
1. **Given** a freshly cloned or initialized repository, **When** I run `npm install` followed by `npm run build`, **Then** the build completes successfully with no TypeScript errors or ESLint violations.
2. **Given** the development server is active, **When** I open `http://localhost:5173`, **Then** the browser displays the active landing skeleton and does not throw console runtime exceptions.

---

### User Story 2 - Global Magenta Styling System (Priority: P1)
As a designer/developer, I want a global stylesheet that imports modern typography and defines theme variables (Magenta palette), so that the visual appearance adheres strictly to the Magenta design constitution.

**Why this priority**: Ensures all future components are built using a cohesive, premium visual system rather than hardcoded, inconsistent values.

**Independent Test**: Serves as the visual template baseline; can be verified by opening the home canvas and checking that variables are successfully utilized.

**Acceptance Scenarios**:
1. **Given** the global styling is loaded, **When** I inspect elements in the developer console, **Then** all colors reference predefined HSL/CSS custom variables (`--color-magenta-primary`, etc.) defined in `index.css`.
2. **Given** a responsive viewport size, **When** I resize the browser window from 320px (mobile) to 1440px (desktop), **Then** the typography and grid-spacing scale smoothly without overlapping elements or horizontal scrolling.

---

### User Story 3 - Mock Infrastructure & Local State Setup (Priority: P2)
As a developer, I want a clean pattern for simulating API calls (OTP generation, profile registration, and matching logic), so that the frontend can be developed completely mock-driven.

**Why this priority**: Essential to facilitate "Mock-Driven Frontend First" development, allowing robust flow testing before standalone backend services are integrated.

**Independent Test**: Verified by checking local storage state initialization or calling mock functions programmatically to verify state transitions.

**Acceptance Scenarios**:
1. **Given** a first-time visitor, **When** the application mounts, **Then** a local database is seeded in memory/localStorage with at least 5 complete sample matrimonial profiles.
2. **Given** a mock authentication request, **When** the user sends a mock mobile number, **Then** the mock service issues a simulated OTP, validates it, and updates local registration state.

---

## Edge Cases

- **Viewport Under-run (< 320px)**: If viewed on extremely small legacy mobile devices, the app MUST enforce a fluid container wrap with a minimum width limit to prevent UI breakage.
- **LocalStorage Storage Limits**: If `localStorage` is disabled or fails due to private browsing restrictions, mock services MUST gracefully fall back to an in-memory session object.

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST establish a standardized directory layout for React:
  - `/src/components` (reusable UI pieces: Buttons, Cards, Inputs)
  - `/src/pages` (Registration, Profile Browse, Matches, Profile Setup)
  - `/src/context` (Application state: Auth context, Match context)
  - `/src/mock` (Mock API database, OTP generator, profile lists)
  - `/src/styles` (Global CSS tokens, layout systems)
- **FR-002**: System MUST inject global CSS styling under `/src/styles/index.css` defining the following variables:
  - `--color-magenta-primary`: `#D81B60`
  - `--color-magenta-dark`: `#880E4F`
  - `--color-magenta-light`: `#F48FB1`
  - `--font-primary`: `'Inter', sans-serif`
  - `--font-accent`: `'Playfair Display', serif`
  - Responsive breakpoint tokens (`--breakpoint-mobile`, `--breakpoint-tablet`)
- **FR-003**: System MUST set up basic client-side routing structure to enable screen swapping between Registration, Profile Browser, and Matches views without server page reloads.
- **FR-004**: System MUST seed a mock database (`/src/mock/mockDb.ts`) with a minimum of 5 pre-populated matrimonial profiles, including gotra, age, occupation, location, and matching indicators.
- **FR-005**: System MUST include full TypeScript types (`/src/types/index.ts`) for primary application data models: User, Profile, OTPState, and MatchCriteria.

### Key Entities

- **UserProfile**: Represents a registered user.
  - *Attributes*: userId, mobileNumber, isVerified, currentStep, biodataId
- **Biodata**: Profile specific details.
  - *Attributes*: name, age, gender, gotra, profession, salary, location, education, interests, photoUrl
- **MatchCriteria**: Matching rules.
  - *Attributes*: ageRange, preferredLocations, preferredGotras, preferredProfessions

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Front-end application loads fully in under 2 seconds during local development server boots.
- **SC-002**: 100% of defined global HSL variables are correctly applied to the initial skeletal view.
- **SC-003**: React project builds into a static production bundle with 0 errors.

---

## Assumptions

- Target users browse utilizing modern web/mobile browser capabilities supporting CSS Custom Properties and Flexbox/Grid.
- Development machine has Node.js (v18+) configured.
- Local Storage or standard memory is sufficient for high-fidelity interactive mocks.
- The Java Spring Boot backend will be developed in a completely separate standalone repository/project workspace in future phases; this project contains only the frontend client.
