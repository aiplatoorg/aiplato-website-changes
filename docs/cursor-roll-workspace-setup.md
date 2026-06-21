# Cursor Roll Workspace Setup (Backend + Frontend + Website)

This guide sets up a shared local workspace for release rolls and uses project-level skills from each repo.

## 1) Create the workspace folder

Use this path:

`C:\Users\<you>\Desktop\cursor-roll-workspace`

(`<you>` is your Windows account name. In PowerShell you can use `$env:USERPROFILE\Desktop\cursor-roll-workspace`.)

## 2) Clone all three repos into that folder

Expected final structure:

- `C:\Users\<you>\Desktop\cursor-roll-workspace\aiplato-backend`
- `C:\Users\<you>\Desktop\cursor-roll-workspace\aiplato-frontend`
- `C:\Users\<you>\Desktop\cursor-roll-workspace\aiplato-website`

Clone URLs:

- `https://github.com/aiplatoorg/aiplato-backend.git`
- `https://github.com/aiplatoorg/aiplato-frontend.git`
- `https://github.com/aiplatoorg/aiplato-website.git`

## 3) Pull latest default branch in each repo

Run `git fetch --all` and pull the default branch used by your team (usually `master`).

## 4) Open repos in Cursor

Open each repo in Cursor at least once so project-level skills are indexed:

- `aiplato-backend`
- `aiplato-frontend`
- `aiplato-website`

## 5) Project-level skills included

These skills are kept in-repo so every teammate gets the same behavior:

- `aiplato-backend/.cursor/skills/roll-any-branch/SKILL.md`
- `aiplato-frontend/.cursor/skills/roll-any-branch/SKILL.md`
- `aiplato-website/.cursor/skills/roll-any-branch/SKILL.md`
- `aiplato-backend/.cursor/skills/backend-branch-roll/SKILL.md` (legacy backend-only fallback)
- `aiplato-frontend/.cursor/skills/frontend-branch-roll/SKILL.md`
- `aiplato-website/.cursor/skills/website-branch-roll/SKILL.md`

`roll-any-branch` supports:

- rolling `backend`, `frontend`, or `website` from one skill
- workspace paths resolved via `$env:USERPROFILE\Desktop\cursor-roll-workspace\...` (portable across machines)
- explicit repo target + source branch + target branch confirmations
- explicit approvals before commit and push
- post-commit checkpoint to ask for additional changes

Repo-specific skills support:

- `demo` as alias for `staging`
- explicit approvals before commit and push
- post-commit checkpoint to ask for additional changes

Backend skill also includes:

- `models.py` migration reminder
- `settings.py` restore guard

## 6) One-shot Cursor prompt for teammates

Paste this in Cursor Agent mode to set up the workspace automatically:

```text
Set up my roll workspace on Windows using PowerShell.

1) Create folder: $env:USERPROFILE\Desktop\cursor-roll-workspace
2) Clone if missing:
   - https://github.com/aiplatoorg/aiplato-backend.git
   - https://github.com/aiplatoorg/aiplato-frontend.git
   - https://github.com/aiplatoorg/aiplato-website.git
3) Ensure final paths:
   - $env:USERPROFILE\Desktop\cursor-roll-workspace\aiplato-backend
   - $env:USERPROFILE\Desktop\cursor-roll-workspace\aiplato-frontend
   - $env:USERPROFILE\Desktop\cursor-roll-workspace\aiplato-website
4) In each repo run:
   - git fetch --all
   - git checkout master (or keep existing default branch if master is missing)
   - git pull
5) Print final repo paths and current branch for all three repos.
6) Remind me to open each repo once in Cursor so project-level skills are available.
```

## 7) Rolling from any repo context

After setup, use `roll-any-branch` from whichever repo you have open. The same skill file is copied into all three repos:

- `aiplato-backend/.cursor/skills/roll-any-branch/SKILL.md`
- `aiplato-frontend/.cursor/skills/roll-any-branch/SKILL.md`
- `aiplato-website/.cursor/skills/roll-any-branch/SKILL.md`

When invoking the roll, always provide:

- repo target: `backend` / `frontend` / `website`
- source branch: usually `master` (or feature branch)
- target branch: `staging` / `prod` (`demo` maps to `staging`)
