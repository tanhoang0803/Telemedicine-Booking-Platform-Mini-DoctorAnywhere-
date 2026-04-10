# /deploy — Deployment Checklist Command

Run the pre-deployment checklist before pushing to production on Vercel.

## Usage

```
/deploy
```

## What This Command Does

When invoked, Claude will verify the following before declaring deploy-ready:

### Pre-deploy Checks

1. **Build** — `npm run build` passes with no errors
2. **Lint** — `npm run lint` passes with no warnings
3. **Tests** — `npm run test` passes (if tests exist)
4. **Environment** — All variables in `.env.example` are documented; no secrets in code
5. **Security** — No hardcoded credentials, JWT properly configured
6. **Translations** — Both `vi.json` and `en.json` are in sync (no missing keys)
7. **Git** — No uncommitted changes, branch is up to date with `main`
8. **CODEOWNERS** — Confirms only TanQHoang is listed as owner

### Post-deploy Verification

After deploying to Vercel:

1. Home page loads correctly
2. Booking form submits (Formspree integration)
3. Doctor list renders
4. Language switcher works (vi ↔ en)
5. No console errors in browser

## Deployment Target

**Platform:** Vercel Free Tier
**Branch:** `main` → auto-deploy
**URL:** Set in `NEXT_PUBLIC_APP_URL`

## Notes

- Only TanQHoang may trigger production deployments
- Never bypass CI/CD with `--no-verify` or force push to `main`
