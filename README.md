# Opportune

**Discover. Prepare. Apply. Never Miss an Opportunity.**

A student-first platform prototype that helps students discover relevant scholarships and opportunities, understand eligibility, organize documents, track deadlines, and reach the official application portal. Built for the SIH 2026 internal hackathon.

## Tech Stack

- React 18 + Vite
- React Router v6
- Tailwind CSS
- lucide-react icons
- localStorage for prototype persistence (no backend required)

## Getting Started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Student | `student@opportune.demo` | `student123` |
| Institution | `institution@opportune.demo` | `institution123` |
| Admin | `admin@opportune.demo` | `admin123` |

Demo credentials are also shown on the login screen, with a one-tap "use demo credentials" button.

## Primary Demo Flow

1. Log in as the demo **student** — the dashboard shows profile readiness, matched scholarships (HDFC Parivartan Scholarship at 91% match), and action items.
2. Open the scholarship to see the full **Eligibility Analysis** table and **"Why Opportune recommended this"** explanation.
3. Notice the Bonafide Certificate is currently rejected — open **Document Vault**, view the rejection reason, and upload a replacement.
4. Log out, log in as the demo **institution**, and go to **Document Verification** — approve or reject the newly uploaded document (rejection requires a reason).
5. Log back in as the student — the document now shows verified, and the scholarship becomes "Ready to Apply."
6. Visit **Smart Application Assistant** to see your saved profile ready to reuse, then use the **official application link** to continue on the real provider website.
7. Check **My Applications** to track status through the full pipeline (Interested → ... → Approved).
8. Log in as **Admin** to see platform-wide institution verification, document review, opportunity management, and the **Impact & Analytics** page (clearly labeled simulated data).

## Resetting Demo Data

Inside the student **Profile** page, use **Reset Demo Data** to clear all local prototype data and reseed from scratch. Data is stored entirely in your browser's `localStorage` under the `opportune:` namespace — nothing leaves your device.

## Project Structure

```
src/
  components/   Reusable UI (cards, badges, modal, tables, layout shell)
  pages/        Route-level screens, grouped by role (student/institution/admin/auth)
  data/         Seed/demo data (institutions, opportunities, documents, accounts)
  context/      AuthContext (session) and DataContext (all persisted app data)
  utils/        Eligibility engine, formatting helpers, storage helpers
```

## Notes

- Opportune helps students **discover and prepare**. Applications are always completed on the official provider's website — Opportune never submits on a student's behalf.
- Profile Match is a transparent, rule-based score (course, year, marks, income, category, location, documents) — never an unexplained AI number.
- This is a frontend-only hackathon prototype. See the in-app **Roadmap** (linked from the student Profile page) for the planned path to a real backend, verified data ingestion, and portal integrations.
