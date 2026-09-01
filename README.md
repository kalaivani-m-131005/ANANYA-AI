# ANANYA-AI

> **"Your Academic Journey, Powered by Fair AI."**

A bias-aware academic support platform for students — delivering personalised AI guidance, smart study planning, and explainable recommendations.

---

## Current Phase

**Phase 2 — Foundation Setup** ✅

The React + TypeScript + Tailwind CSS foundation has been established.
Authentication, backend, AI integration, and all feature pages are implemented in subsequent phases.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Build tool | Vite 7 |
| Language | TypeScript 5.9 (strict) |
| UI framework | React 19 |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 |
| HTTP client | Axios |
| Charts | Recharts |
| Icons | Lucide React |
| Class utilities | clsx + tailwind-merge + CVA |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ANANYA-AI

# Install dependencies
npm install
```

### Environment Setup

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your values (see .env.example for documentation)
```

### Running the Application

```bash
# Start the development server (port 5173)
npm run dev

# Type-check without compiling
npx tsc --noEmit

# Build for production
npm run build

# Preview the production build
npm run preview
```

---

## Project Structure

```
src/
├── components/
│   ├── layout/           # AppLayout, Sidebar, Topbar, MobileNav
│   └── ui/               # Button, Card, Input, Badge, Spinner, ComingSoon
├── pages/                # All route-level page components
├── features/             # Feature modules (added per phase)
├── hooks/                # Custom React hooks (added per phase)
├── services/
│   └── api.ts            # Centralised Axios API client
├── context/              # React context providers (added Phase 3+)
├── types/
│   └── index.ts          # Shared TypeScript type definitions
├── utils/
│   └── index.ts          # Utility functions (cn, formatDate, etc.)
├── App.tsx               # Root component with router configuration
├── main.tsx              # React application entry point
└── index.css             # Global design system & Tailwind v4 entry
```

---

## Available npm Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server on port 5173 |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build locally |

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `VITE_API_URL` | Backend REST API base URL | Yes (Phase 3+) |

> Backend secrets (Gemini API key, JWT secret, MongoDB URI) are configured in `server/.env` and are never exposed to the frontend. See `server/.env.example` (created in Phase 3).

---

## Development Phases

| Phase | Focus | Status |
|---|---|---|
| Phase 1 | Repository Inspection | ✅ Complete |
| Phase 2 | Foundation Setup | ✅ Complete |
| Phase 3 | Authentication | ⏳ Pending |
| Phase 4 | Core Student Features | ⏳ Pending |
| Phase 5 | AI Integration | ⏳ Pending |
| Phase 6 | Analytics & Intelligence | ⏳ Pending |
| Phase 7 | Supporting Features | ⏳ Pending |
| Phase 8 | Security, Testing & Deployment | ⏳ Pending |
