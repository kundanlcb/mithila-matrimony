# Mithila Matrimony Constitution

Welcome to the **Mithila Matrimony** project. This constitution establishes the architectural guidelines, design principles, development workflows, and feature requirements to ensure a premium, modern, and highly responsive user experience.

---

## Core Principles

### I. Premium & Minimal Magenta Aesthetic
The visual identity of Mithila Matrimony must feel modern, elegant, and culturally rich yet clean.
*   **Palette**: Built around curated, high-end Magenta tones (`#D81B60`, `#880E4F`, `#F48FB1`) paired with sleek dark/light surfaces, glassmorphism (`backdrop-filter`), and premium neutrals. Avoid generic colors.
*   **Typography**: Clean, modern typography (e.g., *Playfair Display* for headings to add a premium touch, and *Inter* or *Outfit* for highly readable body copy).
*   **Aesthetic Details**: Soft drop shadows, smooth hover transitions (`all 0.3s ease`), dynamic subtle micro-animations (e.g., scale adjustments on cards, gradient sweeps on buttons) to make the app feel alive and premium.

### II. Mobile-First & Web-Ready Design
The user experience must be flawless on mobile screens, as matrimonial browsing is primarily a mobile activity.
*   **Responsive Architecture**: Design mobile-first (320px to 480px) and scale gracefully up to desktop (1440px+). 
*   **Layout Standards**: Flexbox and CSS Grid for layouts. Avoid hardcoded widths/heights that break on varying device form factors.
*   **Touch-Friendly UI**: Large interactive target areas (minimum 44x44px for buttons), bottom navigation tabs or swipe drawers on mobile, and smooth scrolling.

### III. Mock-Driven Frontend First
To maintain high velocity and refine the user experience rapidly, frontend development must be fully complete and operational using mock services before any backend connection is attempted.
*   **Interface Mocks**: Define TypeScript contracts for all models (User, Biodata, OTP Session, Profile, Match).
*   **Mock Storage**: Use `localStorage` or in-memory state providers to simulate backend behavior including registration, OTP verification state, and profile filtering.
*   **Contract Alignment**: Mock endpoints and JSON responses must align exactly with the planned Spring Boot REST API schemas.

### IV. Safe & Intuitive Registration Flow
Matrimonial registration must be secure, lightweight, and highly engaging.
*   **OTP-Based Authentication**: Secure registration using simulated/mocked OTP verification flows to guarantee quick signup and verified contact numbers.
*   **Multi-Step Biodata Form**: Segment registration into distinct steps (Basic Info, Cultural/Gotra details, Professional Profile, and Preferences) with animated progress indicators to keep completion rates high.

### V. Matching & Profile Browsing
The core utility of the app is discovering relevant profiles with ease.
*   **Browsing Engine**: Highly aesthetic cards displaying key biodata summary, photo, age, gotra, profession, and location.
*   **Matching Logic**: Simple, powerful matching algorithms that recommend users based on compatible gotras, ages, locations, and user preferences.

---

## Technology Stack

### Frontend Architecture
*   **Framework**: React 19 + TypeScript + Vite.
*   **Styles**: Pure Vanilla CSS featuring a modular variable system (`:root`) for colors, transitions, spacing, and responsive breakpoints.
*   **Iconography**: High-quality SVG icons or lucide-react for crisp rendering.
*   **Router**: Client-side routing for seamless page transitions without page reloads.

### Backend Architecture (Future Phase)
*   **Language & Platform**: Java 21 / Spring Boot 3.x.
*   **Database**: PostgreSQL for transactional robustness and search efficiency.
*   **Auth**: Spring Security + JWT, with SMS/OTP service integration.

---

## Development Workflow

### Step 1: Design & Visual Identity System
- Establish a global `index.css` defining the Magenta design tokens, spacing, typography, and utility classes.
- Implement reusable layouts (Header, Bottom Nav, Sidebar).

### Step 2: Mock Authentication & Registration
- Build the simulated OTP verification modals/views.
- Create the multi-step Biodata Registration Wizard with client-side validation.

### Step 3: Profile Exploration & Matching
- Build the profile browsing grid with filter controls (Gotra, Profession, Age).
- Implement the "Matches" recommendation engine.

### Step 4: Refinement & Polish
- Inject micro-animations, glassmorphic card overlays, and transitions.
- Fully verify mobile responsive layouts across chrome simulator profiles.

---

## Governance

- **Aesthetics First**: If the UI looks generic or basic, it is considered a failure. Rich animations, tailored margins, and curated gradients are mandatory.
- **Contract Integrity**: Frontend model modifications must update mock data structures synchronously to prevent drift.
- **Accessibility & SEO**: Include descriptive `alt` tags, semantic elements (`<main>`, `<header>`, `<nav>`), and descriptive titles/meta descriptions.

**Version**: 1.0.0 | **Ratified**: 2026-05-27 | **Last Amended**: 2026-05-27
