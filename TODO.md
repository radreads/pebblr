# TODO.md  
A step-by-step plan for building the Contact Reminder App with a **front-end first** approach.  

---

## Phase 1: Environment & Basic Setup

- [X] **Initialize Next.js + Tailwind + Shadcn UI**  
  - [X ] Create a new Next.js app (e.g., `npx create-next-app`).  
  - [ X] Install and configure Tailwind (update `tailwind.config.js`, `globals.css`).  
  - [X ] Integrate Shadcn UI components and confirm they render correctly.  
- [X ] **Global Design & Theming**  
  - [ X] Establish color palette, typography, and spacing in Tailwind.  
  - [X ] Validate Shadcn UI is styled consistently.

---

## Phase 2: Front-End Mockups (No Real Backend)

- [ ] **Inbox Page (Mock Data)**  
  - [ X] Create `/inbox` route.  
  - [ X] Display a list of mock contacts in local or context state.  
  - [ X] Show status badges (e.g., overdue, monthly) and a “DONE” button (removes contact from list).
- [X ] **Add/Edit Contact Page (Mock)**  
  - [ X] Create `/contacts/new` with a form for name, frequency, birthday, notes.  
  - [ X] On submit, push data into local or context array.  
- [X ] **Settings Page (Mock)**  
  - [ X] Let the user pick email digest frequency (daily, weekly, never).  
  - [ X] Display a mock paid tier boolean and placeholder for “upgrade.”

---

## Phase 3: Refine Front-End Interactions

- [X ] **Form Validation & UI Flow**  
  - [ X] Add client-side validation for name, frequency, etc.  
  - [ X] Ensure all form components use Shadcn UI patterns.
- [X ] **Enhance “DONE” Button Flow**  
  - [ X] Prompt user to add a quick interaction note.  
  - [ X] Animate contact removal from the inbox (client-only for now).  
- [X ] **Styling & Micro-Animations**  
  - [ X] Use Tailwind transitions for fade/slide animations.  
  - [ X] Polish overall UI consistency.

---

## Phase 4: Connect Supabase (Auth & Minimal DB)

- [ ] **Supabase Project Setup**  
  - [X ] Create a new project in Supabase.  
  - [ X] Add necessary environment variables (`.env.local`).
- [ ] **Supabase Auth**  
  - [ ] Install and initialize `@supabase/supabase-js` in Next.js.  
  - [ ] Set up sign-up, login, logout flows.  
  - [ ] Restrict protected pages (Inbox, Contacts) to logged-in users.
- [ ] **Database Schema**  
  - [ X] Create tables (`users`, `contacts`, `interactions`, `user_settings`) via migrations.  
  - [X] Enum validation on frequency
  - [X ] Confirm alignment between front-end data and database schema.
  - [ ] Change formatting for birthdate, UI

---
## Unsorted

[ ] Log out screen, doesn't contain users

---

## Phase 5: Real Data Integration

- [ ] **Contacts API**  
  - [ ] Replace mock contacts array with real data from Supabase.  
  - [ ] Implement CRUD via Next.js API routes or server components.  
  - [ ] Ensure each record is scoped to the logged-in user.
- [ ] **Inbox with Real Data**  
  - [ ] Fetch contacts where `next_reminder_date <= NOW()` for overdue.  
  - [ ] Remove contact from view on “DONE” after database update.
- [ ] **Interaction Logging**  
  - [ ] When marking “DONE,” insert interaction record in `interactions`.  
  - [ ] Recalculate `next_reminder_date` (monthly, quarterly, etc.) in the DB.

---

## Phase 6: Notifications & Monetization

- [ ] **Email Digest**  
  - [ ] Implement a scheduled job (Supabase cron or other) to email users with overdue contacts.  
  - [ ] Respect user’s `user_settings.email_digest_frequency`.
- [ ] **Tab Notification**  
  - [ ] Display the count of overdue contacts in the browser tab title.  
- [ ] **Free Tier & Payment**  
  - [ ] Enforce max 10 contacts for free users.  
  - [ ] Integrate Stripe or similar for a one-time $20 payment.  
  - [ ] On successful payment, mark `user_settings.paid_tier = true`.

---

## Phase 7: Final UI/UX Polish & Deployment

- [ ] **UI & Animations**  
  - [ ] Refine transitions (especially for “DONE” interactions).  
  - [ ] Double-check mobile responsiveness.  
- [ ] **Accessibility & Optimization**  
  - [ ] Use semantic HTML, proper labels, color contrast checks.  
  - [ ] Optimize performance and bundle size.  
- [ ] **Deployment**  
  - [ ] Deploy to Vercel with correct environment variables set.  
  - [ ] Run final end-to-end tests to confirm sign-up, add contact, “DONE,” payments, and notifications.


## Future ideas
[ ] Photo in user settings

---