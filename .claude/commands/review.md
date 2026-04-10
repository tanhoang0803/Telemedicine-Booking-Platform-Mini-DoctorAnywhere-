# /review — Code Review Command

Perform a structured code review of recent changes or a specified file/component.

## Usage

```
/review [file or component name]
/review                          # Reviews all staged/unstaged changes
```

## What This Command Does

When invoked, Claude will review code for:

1. **Security** — JWT handling, input validation, SQL/NoSQL injection risks, exposed secrets
2. **Correctness** — Logic errors, edge cases, null/undefined handling
3. **Next.js conventions** — App Router patterns, server vs client components, data fetching
4. **Bilingual completeness** — All user-facing strings present in both `vi.json` and `en.json`
5. **Tailwind usage** — No inline styles, consistent utility class usage
6. **API route safety** — Auth guards on protected routes, proper HTTP status codes
7. **Phase adherence** — No Phase 3 features introduced in Phase 1/2 scope

## Output Format

```
## Review: [file or scope]

### Issues (must fix)
- ...

### Suggestions (optional)
- ...

### Bilingual check
- [ ] vi.json entries: ...
- [ ] en.json entries: ...

### Security check
- ...
```

## Notes

- Focus on what was actually changed — do not refactor surrounding code
- Flag any hardcoded secrets or environment variable references that are missing from `.env.example`
