# Mithila Matrimony 🌸

Mithila Matrimony is a modern, culturally-aware matrimonial platform custom-built for the Maithil community. It blends ultra-modern web aesthetics with deeply rooted traditional requirements—specifically highlighting **Gotra compatibility** and lineage-safe matching. 

The application is completely fully functional in a mock environment using `localStorage`, requiring no active backend to demonstrate its capabilities!

---

## ✨ Key Features

- **Bilingual Interface**: Full support for both English (EN) and Hindi (HI) to cater to the diverse Maithil demographic, smoothly toggled on the fly.
- **Gotra-Safe Matching**: Traditional gotras (Kashyap, Shandilya, Vatsa, Bhardwaj, Katyayan, Parashar) are built directly into the matchmaking engine, emphasizing safe lineage pairing.
- **Conversational Registration**: A fluid, WhatsApp-style chat interface for user onboarding instead of boring, rigid web forms.
- **Instant Interactive UI**: Real-time state management for Shortlisting and Sending Requests to profiles with satisfying micro-animations and instantaneous UI feedback.
- **Advanced Mobile UX**: Custom-built floating bottom sheets, touch-optimized filter controls, and responsive grid layouts designed heavily for a mobile-first user experience.
- **Mock DB Persistence**: All interactions, profiles, and state persist seamlessly across reloads using a sophisticated mock Database built on top of browser `localStorage`.
- **Pure Vanilla CSS**: Stunning glassmorphism UI, theme-toggling (Light/Dark mode), and micro-interactions designed completely from scratch using Vanilla CSS (no external component libraries).

---

## 🛠️ Technology Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) for robust static typing
- **Build Tool**: [Vite](https://vitejs.dev/) for lightning-fast HMR and optimized builds
- **Styling**: Pure **Vanilla CSS** (No Tailwind, no Bootstrap). Features extensive use of CSS Variables (Custom Properties) and Flexbox/Grid layouts.
- **State Management**: React Hooks (`useState`, `useEffect`) and Context API (`LanguageContext`, `ThemeContext`).

---

## 🚀 How to Run the App

Because the app relies on a mock local database and has no external backend dependencies, setting it up is incredibly easy and fast.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (version 18+ recommended) and `npm` installed.

### 1. Install Dependencies
Navigate to the project root directory and run:
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

### 3. Open the App
The terminal will display a local host URL (typically `http://localhost:5173`). Open this URL in your modern browser of choice (Chrome, Safari, Firefox). 

---

## 📱 App Walkthrough / Usage Guide

1. **Home Page & Quick Match**: Test out the quick match widget on the home page. Try clicking "Let's Match" without logging in to see the authentication routing in action!
2. **Registration (The Chat UI)**: Click on "Login / Register". Enter any 10-digit mobile number. You'll see a simulated OTP code appear on the screen—enter it to proceed! Answer the chat bot's questions to complete your profile.
3. **Browsing Matches**: Once logged in, browse through compatible profiles. The mock DB calculates Gotra compatibility automatically.
4. **Interactions**: Tap the "Shortlist" or "Send Interest" buttons on any profile card to see the instant UI change. Tap them again to cancel the interaction.
5. **My Profile**: Access your profile from the top-right menu to edit your details or configure preferences through modern modal windows!

---

## 📝 License
This project is built as a highly customized prototype. All rights reserved. 
