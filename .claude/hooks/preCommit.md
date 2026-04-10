# Hook: Pre-Commit

Validation checks that run before every commit to protect code quality and security.

## Purpose

Catch issues before they reach the repository: secrets, lint errors, missing translations, and broken builds.

## Hook Configuration

To enable as a git pre-commit hook, add to `.git/hooks/pre-commit`:

```bash
#!/bin/sh
npm run lint || exit 1
npm run build || exit 1
node scripts/check-translations.js || exit 1
node scripts/check-env-example.js || exit 1
```

Or configure via `package.json` with `husky` + `lint-staged`:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged && npm run build"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

## Checks Performed

### 1. Lint Check
- ESLint must pass with zero errors
- TypeScript must compile with no type errors

### 2. Secret Scan
- Reject commits containing patterns matching API keys, JWT secrets, or connection strings
- Patterns to flag: `MONGODB_URI=mongodb`, `JWT_SECRET=`, `re_` (Resend keys), hardcoded passwords

### 3. Translation Sync
- Both `locales/en.json` and `locales/vi.json` must have identical key sets
- Missing keys in either file → commit blocked

### 4. Environment Variables
- Any `process.env.NEW_VAR` added to code must also appear in `.env.example`
- Prevents undocumented secrets from silently failing in production

### 5. Build Check (optional, slow)
- `npm run build` must succeed before committing to `main`
- Recommended to run only on pre-push, not pre-commit (too slow for frequent commits)

## Bypass Policy

**Never bypass with `--no-verify`** unless explicitly authorized by TanQHoang for a documented emergency.

## Claude Behavior

When assisting with commits, Claude should:
1. Run `/review` before suggesting a commit
2. Verify all pre-commit checks would pass
3. Remind the user to never use `--no-verify`
