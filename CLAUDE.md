# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This is the **aiPlato marketing site + login/signup/auth host**. After a user logs in here, the session cookies are read by [../aiplato-frontend/](../aiplato-frontend/) (the actual SPA app), which is served from a different origin (`APP_URL`). For the cross-repo picture see [../CLAUDE.md](../CLAUDE.md).

## Stack

React 16 · react-router-dom v5 · react-scripts 3.4.3 (CRA, **no react-app-rewired**) · Bootstrap 4 (`react-bootstrap@1.4`) · MUI 4 + MUI 5 · `node-sass@4` · axios `0.20` · `universal-cookie` · `@react-oauth/google` (Google sign-in) · `react-calendly` · LogRocket · `xlsx` / `react-papaparse` (CSV/XLSX in admin/dashboard flows).

Do not casually upgrade React, react-scripts, or `node-sass@4` — same constraint as the frontend app.

## Common commands

```powershell
npm install
npm start            # dev server, port 3000 by default (CRA)
npm run build        # production build (default react-scripts)
npm test             # jest in watch mode
```

There are no e2e tests, no husky/lint-staged, and no custom `config-overrides.js` — this is a stock Create React App.

## Environments

- `env`, `env.staging`, `env.production` — env files at repo root. These map to the build environment used; React's `.env*` resolution rules apply. The active env file is selected at build time.
- [src/common/config.json](src/common/config.json) holds `API_ENDPOINT`, `APP_URL`, `WEBSITE_URL`, `AWS_PATH`. **This file is intentionally excluded from release rolls** — the [../aiplato-backend/.cursor/skills/roll-any-branch/SKILL.md](../aiplato-backend/.cursor/skills/roll-any-branch/SKILL.md) workflow restores the target branch's `config.json` after copying `src/` from the source branch.

## App shape

Single-page React app rooted at [src/App.js](src/App.js). All routes are defined inline in `App.js` via `<Switch>` + `<Route>` — there's no role-based gating here (unlike `aiplato-frontend`). LogRocket is initialized in `App.js` `useEffect` with a `ClientJS` fingerprint as the user id.

Key routes:

| Path | Component | Purpose |
|---|---|---|
| `/` | `Home` | Marketing home |
| `/student`, `/educator` | `Student`, `Teacher` | Audience landing pages |
| `/team`, `/careers`, `/contact`, `/resources` | About / hiring / contact / blog |
| `/login` | `Login` | **Auth entry point** — sets session cookies the SPA reads |
| `/signup/:userplan?/:useruniqueid?` | `SignUp` | Self-serve signup; `/payment-success` also routes here |
| `/signUpPlans/:useruniqueid?` | `SignUpPlans` | Plan picker |
| `/verify-email` | `MagicLinkVerify` | Magic-link email verification |
| `/createclass` | `CreateClass` | New-class flow |
| `/upload` | `CameraCapture` | Photo upload |
| `/question` | `SubmitQuestion` | Question intake form |
| `/feedback` | `Feedback` | Feedback form |
| `/earlyaccesspriorityinfo/:earlyaccessid?` | `UserInfo` | Early-access intake |
| `/requestDemo` | `RequestDemo` | Demo-request form |
| `/ptdashboard` | `dashboard` | PT teacher dashboard |
| `/GSVsummitSpecial` | `Flyer` | Event landing |
| `/termsandcondition`, `/privacypolicy` | Legal pages (PDF in `public/`) |
| `*` | `Redirect` → `/PageNotFound` | 404 |

`?embed=1` in the URL hides the `Navbar` and `Footer` so a route can be embedded as an iframe.

### Folders (under `src/`)

| Folder | Purpose |
|---|---|
| `components/` | All routes and reusable components (Home, Navbar, Footer, Login, SignUp, Student, Teacher, etc.) — there is **no separate `container/` layer** like the frontend repo has |
| `common/` | `API.js` (axios + helpers), `Functions.js` (cookie/session helpers), `config.json` |
| `assets/` | Marketing images |

## Auth — what this repo owns

- **Login** lives in `src/components/Login/Login.js` and writes session cookies (`isValid`, `role`, `name`, `userId`, `email`, etc.). The SPA at `APP_URL` then reads those cookies via its own `src/common/Functions.js`. If the SPA finds them missing, it redirects back here to `WEBSITE_URL`.
- **Signup / payment / plans / magic links** also live here (`SignUp`, `SignUpPlans`, `MagicLinkVerify`, `/payment-success`).
- Cookies are scoped so both origins share the session (set in production via shared parent domain; in local dev `localhost:3000` ↔ `localhost:3001` need matching cookie settings).

## Release rolls

This repo participates in the same `roll-any-branch` workflow as the other two; the canonical SKILL.md is in the backend repo at [../aiplato-backend/.cursor/skills/roll-any-branch/SKILL.md](../aiplato-backend/.cursor/skills/roll-any-branch/SKILL.md). Rolls operate from `$env:USERPROFILE\Desktop\cursor-roll-workspace\aiplato-website`, copy **`src/` only**, and restore `src/common/config.json` from the target branch.
