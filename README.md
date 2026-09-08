# Kantex — AI Receptionist & Appointment Automation (Hospital Demo)

An interactive sales demo of the **Kantex Technologies** AI Receptionist for hospitals
and clinics, built around a fictional deployment at **Uma Hospital, Trimurti Chowk, Nashik**.

It exists to make one loop obvious in under 30 seconds:

> **Patient calls → AI receptionist answers → understands the request → checks doctor
> availability → books the appointment → sends a WhatsApp confirmation → sends a
> reminder → the booking is waiting for staff in the dashboard.**

This is a **prototype with mock data**, not a production healthcare system. Nothing here
connects to a telephony provider, the WhatsApp Business API, or a hospital record system.

---

## Running it

```bash
npm install     # install dependencies
npm run dev     # start the dev server on http://localhost:5173
npm run build   # type-check (tsc -b) and produce a production build in dist/
npm run preview # serve the production build locally
```

Requires Node 20.19+ or 22.12+ (Vite 7).

Useful extras:

```bash
npm run typecheck   # type-check only, no build output
```

---

## Deploying to Cloudflare

The app is a fully static single-page build (`dist/`), so it deploys to Cloudflare with no
server-side code. `wrangler.jsonc` is already configured for **Workers static assets** with
SPA fallback routing.

### Option A — Workers (recommended, matches `wrangler.jsonc`)

```bash
npx wrangler login     # one-time browser login to your Cloudflare account
npm run deploy         # runs `npm run build` then `wrangler deploy`
```

In CI, skip the interactive login and set a scoped API token instead:

```bash
export CLOUDFLARE_API_TOKEN=...    # needs the "Edit Cloudflare Workers" template
export CLOUDFLARE_ACCOUNT_ID=...   # optional if the token maps to one account
npm run deploy
```

To preview the deployed bundle locally before shipping it: `npm run cf:preview`.

### Option B — Cloudflare Pages (Git integration)

Connect the repository in the Cloudflare dashboard and use:

| Setting | Value |
| --- | --- |
| Framework preset | None / Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `22` |

The app uses hash routing (`/#/appointments`), so deep links resolve from `index.html`
without any extra redirect rules. On Workers, `wrangler.jsonc` already sets
`not_found_handling: "single-page-application"` for direct path access.

---

## What's on each screen

| Screen | What it demonstrates |
| --- | --- |
| **Overview** | Hero, the four KPIs, and an inline 30-second "Try the AI Receptionist" call that books a real (mock) appointment and updates the dashboard live. |
| **AI Receptionist** | Full call simulation — phone UI, animated voice activity, live transcript, and seven selectable caller intents including a medical-question guardrail. |
| **Appointments** | Day selector, searchable appointment book, and a booking modal whose success state shows appointment → WhatsApp confirmation → scheduled reminder. |
| **WhatsApp** | A WhatsApp Business conversation mock the visitor can drive (pick a slot → confirmation card → day-of reminder), plus the outbound message log. |
| **Call Analytics** | Volume through the day, what patients call about, how calls resolved, and the front-desk time that adds up. Updates after every simulated call. |
| **How It Works** | The four-step rollout, the "keep your existing number" routing model, and an explicit note about what telephony routing does and does not include. |

### The interactions that matter in a demo

* Starting a call plays the conversation turn by turn, with voice activity and typing states.
* A completed booking call writes the appointment, the WhatsApp confirmation and the reminder — and the Appointments screen jumps to that day with the new row flagged.
* Booking from the modal produces the same three-step confirmation chain.
* KPI tiles and the analytics charts animate to their new values after each simulated call.
* **Reset** in the top bar returns every counter, booking and conversation to its starting state.

---

## Honest boundaries (deliberate, and stated in the UI)

* **Demo Mode** is labelled in the sidebar, the top bar, the footer ribbon and the booking modal.
* All patients, mobile numbers, appointments and call records are fictional. Mobile numbers are masked (`+91 98XXXXXX42`).
* The AI never gives medical advice. Ask it a clinical question in the simulation and it replies:
  *"I can help with appointments and hospital information. For medical advice, I'll connect you with hospital staff."*
* The WhatsApp screen is labelled a **mock integration** — real deployments need WhatsApp Business API access, approved templates and patient opt-in.
* **Telephony:** the hospital's existing number can stay the primary patient contact, but call routing and forwarding is configured with the hospital's telecom provider. The demo does not claim that unknown-number filtering is supported by every carrier — the routing rules are agreed with the provider during setup.

---

## Tech

* **React 19 + TypeScript**, built with **Vite 7**
* **Tailwind CSS v4** with a project design system defined in `src/index.css` (`@theme` tokens)
* No backend, no database, no external API calls — all state lives in one React reducer
* Hand-rolled SVG/CSS charts and icons; no charting or icon library
* Hash-based routing so the build works on any static host

### Structure

```
src/
  components/
    analytics/ charts/     hand-built chart primitives
    appointments/          booking modal
    layout/                sidebar, top bar, logo, live indicator
    overview/              hero flow strip, inline "try it" panel
    receptionist/          call panel, waveform, transcript, intent picker
    ui/                    Button, Badge, Card, Modal, Field, Stat, Toasts, Icon
    whatsapp/              phone frame, chat bubbles
  data/
    hospital.ts            hospital details, doctors, OPD hour buckets
    conversations.ts       the scripted calls, one per caller intent
    seed.ts                mock appointments, KPIs, analytics, message log
  hooks/                   call simulation, demo wiring, animated numbers, routing
  lib/                     types, date helpers, nav config
  screens/                 one file per navigation item
  store/demo.tsx           the single source of demo state
```

### Adapting it for another hospital

Most of a re-skin is three files:

1. `src/data/hospital.ts` — name, locality, phone, OPD hours, doctor list and slots
2. `src/data/conversations.ts` — the scripted calls
3. `src/data/seed.ts` — the starting appointments, KPIs and analytics

Brand colours live in the `@theme` block at the top of `src/index.css`.

---

© Kantex Technologies — demo prototype.
