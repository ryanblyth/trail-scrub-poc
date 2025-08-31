# Workflow: Specs + AI Codegen (Cursor, ChatGPT, etc.)

This project is **docs-driven**. Specs, RFCs, and ADRs are the source of truth.  
AI tools (Cursor, ChatGPT, etc.) build from those specs.

---

## When something is wrong

### 1. Spec Bug (spec was wrong, unclear, or incomplete)
- Update the spec file in `/specs` or `/docs`.
- Commit the change: `spec: clarify marker easing behavior`.
- Re-run codegen with Cursor against the updated spec.

> Rule: If the spec doesn’t match reality, fix the spec first.

---

### 2. Implementation Bug (code doesn’t follow the spec)
- Leave the spec alone.
- In Cursor chat:  
  “The marker doesn’t move smoothly — the spec says turf.along with easing. Please fix.”
- Regenerate/fix code.

> Rule: If the code is wrong but the spec is right, don’t change the spec.

---

### 3. Design Change (you change your mind)
- Update the spec to reflect the new decision.
- Commit: `spec: change AC4 to require camera follow`.
- Then update the code via Cursor.

> Rule: Specs drive design. Design changes = spec changes first.

---

## Daily Workflow
1. Start with or update the relevant **spec/RFC/ADR**.  
2. Open Cursor and point it to the spec path (`/specs/...`).  
3. Generate or adjust code.  
4. If something is off, decide: *Spec bug? Implementation bug? Design change?*  
5. Always keep specs current in GitHub — never let Cursor chat hold the only decision.  

---

## Commit Conventions
- `spec:` → Changes to spec docs.  
- `rfc:` / `adr:` → Architecture or decision updates.  
- `feat:` → New features in code.  
- `fix:` → Bug fixes in code.  
- `docs:` → Other documentation updates.

---

## Quick Decision Flow
- Did the spec say it?  
  - **Yes →** Fix code in Cursor.  
  - **No →** Fix the spec first.
