# /memory — Project Memory Command

Summarize and persist key context about the current state of the Telemedicine Booking Platform.

## Usage

```
/memory
```

## What This Command Does

When invoked, Claude will:

1. Review recent changes, decisions, and open tasks in the current session
2. Identify anything non-obvious or project-critical that should be remembered across sessions
3. Write or update entries in `.claude/memory/` (user, feedback, project, reference types)
4. Update `MEMORY.md` index

## When to Use

- After completing a major feature or phase milestone
- After making an architectural decision
- After a debugging session that revealed important project constraints
- When the user says "remember this" or "save this for later"

## Notes

- Do not save code patterns, file paths, or architecture that can be read from the codebase
- Do not save ephemeral task state (use Tasks instead)
- Prioritize decisions, constraints, and feedback that would otherwise be lost between sessions
