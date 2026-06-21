---
name: roll-any-branch
description: >-
  Rolls backend, frontend, or website branches from a shared Windows workspace
  using explicit target selection and approval gates before commit and push. Use
  when the user asks to roll, deploy, or promote backend/frontend/website to
  staging/demo or prod from any repo context.
---

# Cross-repo branch roll (`backend` / `frontend` / `website`)

This skill handles release rolls for all three repos from one place.

Supported roll targets:

- repo target: `backend`, `frontend`, `website`
- environment target branch: `staging` or `prod`
- alias: `demo` -> `staging`

Source branch is usually `master` or a feature branch provided by the user.

## Required user inputs

Never infer these silently. Confirm all three before running git commands:

1. Repo target (`backend` / `frontend` / `website`)
2. Source branch (for example `master`)
3. Environment target (`staging` / `prod` / `demo`)

Normalize `demo` to `staging` before running commands.

## Repo path mapping (mandatory)

Build workspace root from the active Windows user profile:

- workspace root: `$env:USERPROFILE\Desktop\cursor-roll-workspace`

Run git commands against the mapped repo path only:

| Repo target | Repo path |
|-------------|-----------|
| `backend` | `$env:USERPROFILE\Desktop\cursor-roll-workspace\aiplato-backend` |
| `frontend` | `$env:USERPROFILE\Desktop\cursor-roll-workspace\aiplato-frontend` |
| `website` | `$env:USERPROFILE\Desktop\cursor-roll-workspace\aiplato-website` |

If the mapped folder does not exist, stop and ask the user to run workspace setup first.

## Hard gates (must follow)

1. Do not run `git commit` until the user explicitly approves after you show the exact commit message.
2. Do not run `git push` until the user explicitly approves after you show remote, branch, and summary.

These are separate approvals. Never combine commit and push in one approval step.

## Preflight checks (required)

For the mapped repo path:

1. `git fetch origin`
2. Confirm both branches exist remotely:
   - `origin/<source>`
   - `origin/<target>` (`staging` or `prod`)
3. Check working tree state and stop if there are unrelated dirty changes.
4. Show a short preflight summary to the user:
   - repo target and repo path
   - source and target branches
   - current branch
   - remotes (`git remote -v`)

## Roll mode selection

- **Full roll mode**: Roll full working tree from `<source>` into `<target>`.
- **Targeted file-change mode**: Apply only specific user-requested file changes on `<target>`.

Default to full roll mode unless the user explicitly asks for targeted file-only changes.

## Roll procedure (full roll mode)

1. `git checkout <target>` and `git pull origin <target>`
2. `git checkout <source>` and `git pull origin <source>`
3. `git checkout <target>`
4. Bring source changes over:
   - `git checkout <source> -- .`

### Backend-only guardrails

Apply these only when repo target is `backend`:

1. **Settings restore guard**: if `src/aiplato/settings.py` changed, restore target version:
   - `git restore --staged src/aiplato/settings.py` (if staged)
   - `git restore src/aiplato/settings.py`
2. **Migration reminder**: if any changed file under `src/` ends with `models.py`, remind user to run/create Django migrations after deploy.

## Roll procedure (targeted file-change mode)

1. `git checkout <target>` and `git pull origin <target>`
2. Apply only requested file edits.
3. Do not run broad checkout from source in this mode.

## Commit message

Compute before asking approval:

1. Get latest source commit subject: `git log -1 --oneline <source>`
2. If source is `master`, use that subject line.
3. If source is not `master`, prefix with context:
   - `Roll <repo-target> <target> from <source>: <subject>`

## Approval #1 - commit

Before `git commit`:

1. Show source branch, target branch, repo path, and staged paths summary.
2. Show both previews:
   - `git diff -- <changed-files>`
   - `git diff --cached -- <changed-files>`
3. Show exact commit message verbatim.
4. Ask for explicit commit approval and wait.

## Post-commit checkpoint (required)

After a successful commit ask:

- "Any other changes to make before push?"

If yes, continue with another edit/approval cycle. If no, proceed to push approval.

## Approval #2 - push

Before `git push`:

1. Show remote, branch, and that this push triggers the roll.
2. Ask for explicit push approval and wait.
3. On approval, push:
   - `git push origin <target>`

## Notes

- If no changes remain after roll steps, report "nothing to commit" and stop.
- If conflicts or permission errors occur, stop and report clearly.
- Never force-push unless user explicitly asks and policy allows.
- For backend rolls with `models.py` changes, repeat migration reminder after successful push.
