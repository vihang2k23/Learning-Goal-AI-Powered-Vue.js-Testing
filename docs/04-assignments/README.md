# Assignments and practice projects

Use these after working through `docs/01-testing-setup` → `03-e2e-testing`. Build features in your own branch or a separate folder under `src/`, and mirror the test layout used in this repo (`tests/`, `e2e/`).

## In this repository

- **Planner Pal** — See [planner-pal.md](../planner-pal.md) for the full sample (component + unit + E2E + coverage).

## Suggested projects

### 1. Todo app

- Features: add, complete, delete, filter (all / active / completed), optional `localStorage`.
- Unit: list item, form, filter logic.
- E2E: full workflow and persistence if applicable.

### 2. Contact form

- Validation (name, email, message), submit, loading, errors, success state.
- Unit: rules and component behavior.
- E2E: happy path and validation messages.

### 3. Product page

- Product info, gallery, variants, add to cart, reviews (simplified is fine).
- Unit: isolated components and computed state.
- E2E: browse, select variant, cart action.

### 4. Authentication flows (mocked)

- Login / register forms, client-side validation, mocked API success and failure.
- Unit: validation and UI states.
- E2E: success and error paths with `page.route` or a small mock server.

### 5. Real app of your choice

- Pick a Vue app (yours or open source), document critical flows, add Vitest and Playwright where they add the most value, and aim for meaningful coverage on core modules.

## Deliverables (self-check)

- Tests run with `npm run test:run` and `npm run test:e2e`.
- Coverage report for the code you own (`npm run test:coverage` with a suitable `--coverage.include` or project defaults).
- Short `README` in your feature folder describing what you tested and how to run it.
