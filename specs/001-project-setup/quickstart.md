# Quickstart: Project Setup (Phase One)

Welcome! This guide outlines how to execute, verify, and interact with the scaffolded frontend environment of **Mithila Matrimony**.

---

## 1. Frontend Development

### Prerequisites
- **Node.js**: Version 18 or above.
- **npm**: Version 9 or above.

### Installation
From the repository root, install the dependencies:
```bash
npm install
```

### Running the Frontend
Start the local development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser. The application loads utilizing standard hot module replacement.

### Verifying Directory Structures
The following directories are established and can be accessed for components writing:
- `/src/components/` - Create atomic, reusable UI components.
- `/src/pages/` - Assemble full user interfaces (e.g. Registration, Browsing).
- `/src/mock/` - Contains the mock database file `mockDb.ts` populated with default profiles.
- `/src/styles/` - Global styling, variable declarations, and utility classes in `index.css`.
- `/src/context/` - State management context definitions.
