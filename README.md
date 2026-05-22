# Cloud-Integrated Health Report Analyzer Frontend

Production-grade React + Vite SaaS frontend for **MediScan AI** with role-based experiences for Patients, Doctors, and Admins.

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS design system
- Shadcn-style component architecture (`src/components/ui`)
- Framer Motion animations
- Axios API layer with JWT interceptor + global error toasts
- React Router v6 with protected and role-based routes
- Recharts for dashboards and analytics
- Sonner toast notifications

## Implemented Experiences

- Premium animated landing page with sticky nav, hero particles, feature cards, testimonials, pricing toggle, and SaaS footer
- Auth system (Login/Signup) with PATIENT/DOCTOR/ADMIN roles and route redirection
- Patient dashboard with KPI cards, trend charts, recent reports, and notifications panel
- Upload report workflow with drag-drop, progress, analyzing states, and recovery UX
- Report analysis experience with summary/details/recommendations tabs and abnormal-value highlighting
- Doctor finder with search/filters, rating, cards, and profile side-panel
- AI assistant chat UI with markdown responses and conversation sidebar
- Doctor dashboard with consultation triage, notes/prescription panel, and confirmation modal flow
- Admin panel with analytics charts, user management, doctor approvals, and system health monitoring
- User settings + file history pages
- Dark/light mode support

## Project Structure

```text
src/
  components/
    common/
    ui/
  context/
  data/
  hooks/
  layouts/
  pages/
  services/
  types/
  utils/
```

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Production build:

```bash
npm run build
```

## Environment

Use `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_ENABLE_DEMO_AUTH=true
VITE_USE_DIRECT_ANTHROPIC=false
VITE_ANTHROPIC_API_KEY=
```

## Backend Contract

Expected Spring Boot base URL: `VITE_API_BASE_URL`.
Primary endpoints currently integrated:

- `POST /auth/login`
- `POST /auth/signup`
- `GET /auth/me`
- `POST /reports/upload`
- `GET /reports/{id}/analysis`
- `GET /doctors/search`
- `POST /assistant/chat`

When backend endpoints are unavailable, demo-safe fallbacks are used for UI continuity.

If `VITE_USE_DIRECT_ANTHROPIC=true` and `VITE_ANTHROPIC_API_KEY` is set, the chat client can call Anthropic directly (`claude-sonnet-4-20250514`). For production, prefer backend proxy mode.
