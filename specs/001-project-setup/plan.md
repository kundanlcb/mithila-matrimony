# Implementation Plan: Project Setup (Phase One)

**Branch**: `001-project-setup` | **Date**: 2026-05-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-project-setup/spec.md`

---

## Summary
The goal of this phase is to establish a solid structural, tooling, and baseline styling foundation for the React frontend. This allows rapid high-fidelity mock-driven frontend iterations. The backend will be developed in a completely separate standalone project workspace in subsequent phases.

---

## Technical Context

*   **Language/Version**: React 19 / TypeScript 5.x
*   **Primary Dependencies**: React 19, TypeScript, Vite, Vanilla CSS.
*   **Storage**: `localStorage` (mock state persistence).
*   **Testing**: Build and compile checks, ESLint verification.
*   **Target Platform**: Desktop and Mobile browsers (Mobile-first viewport 320px+).
*   **Project Type**: Single Page Web Application (React SPA).
*   **Performance Goals**: Frontend cold-boot < 2s; production build bundling in < 5s.
*   **Constraints**: Strictly Vanilla CSS variables, high-fidelity state mocks, mobile responsiveness.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Premium & Minimal Magenta Aesthetic (Gate 1)**: **PASSED**. Global `index.css` establishes HSL custom properties mapping exact high-contrast magenta tones (`#D81B60`, `#880E4F`, `#F48FB1`) and sleek glassmorphic variables.
- **Mobile-First & Web-Ready Design (Gate 2)**: **PASSED**. CSS styling uses flexible fluid layout tokens and media query parameters to support displays starting from 320px.
- **Mock-Driven Frontend First (Gate 3)**: **PASSED**. Direct layout segregation of `/src/mock/` populated with realistic matrimonial user states, gotra details, and mock API endpoints.
- **Safe & Intuitive Registration Flow (Gate 4)**: **PASSED**. Simulated multi-step registration schema and OTP state validation engine handled inside in-memory mock handler.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-project-setup/
├── spec.md              # Requirement definition
├── plan.md              # This file (Implementation Plan)
├── research.md          # Technical choice evaluations
├── data-model.md        # Entity definitions & schema models
├── quickstart.md        # Developer setup instructions
└── contracts/
    └── api-contracts.md # Simulated API endpoint REST contracts
```

### Source Code Layout

The project focuses exclusively on the frontend application:
- **Root Directory**: Serves the frontend React SPA.
- **Backend Directory**: Handled in a separate independent Git repository workspace.

```text
mithila-matrimony/ (root)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/       # Reusable modular UI pieces
│   ├── pages/            # View pages (Browse, Registration, Matches)
│   ├── context/          # AppContext and AuthContext
│   ├── mock/             # Mock DB and local storage service methods
│   │   └── mockDb.ts
│   ├── styles/           # Central HSL variables and page styles
│   │   └── index.css
│   └── types/            # App typescript models
│       └── index.ts
```

**Structure Decision**: Frontend-only project repository. Decouples client asset bundling and keeps the Git history streamlined. Connects to future backend services using standard fetch/axios contracts.
