# Folder structure and file roles

This page maps **directories** and **important files** to what they are for. Paths are relative to the **repository root**.

---

## Top-level tree (source and config only)

```
.
├── docs/                    # Course notes + stakeholder docs (this folder)
├── e2e/                     # Playwright end-to-end specs
├── examples/                # Extra sample component + tests (not mounted in main app)
├── src/                     # Vue application source
├── tests/                   # Vitest unit / component tests
├── index.html               # HTML shell; loads the Vue app
├── package.json             # Dependencies and npm scripts
├── package-lock.json        # Locked dependency versions
├── playwright.config.js     # Playwright: browsers, base URL, webServer, projects
├── README.md                # Quick start and script table
└── vite.config.js         # Vite build + Vitest + API mock + coverage
```

**Generated or tool output** (safe to delete; recreated when you run tools):

| Path | Produced by |
|------|-------------|
| `node_modules/` | `npm install` |
| `coverage/` | `npm run test:coverage` |
| `playwright-report/` | `npm run test:e2e` (HTML reporter) |
| `test-results/` | Playwright (artifacts, last run metadata) |

---

## `docs/` — documentation

| File / folder | Purpose |
|---------------|---------|
| `README.md` | Index of all doc modules; start here for the course. |
| `01-testing-setup/` | Tooling, Vite/Vitest/Playwright setup, exercises. |
| `02-unit-testing/` | Unit/component testing concepts and exercises. |
| `03-e2e-testing/` | Playwright E2E concepts and exercises. |
| `04-assignments/` | Practice assignments and extensions. |
| `planner-pal.md` | Describes the Planner Pal sample: paths, tests, commands. |
| `Project-Overview-For-Management.md` | High-level explanation for managers / stakeholders. |
| `Folder-Structure-And-Files.md` | This file: structure and file roles. |

---

## `src/` — application code

| File | Purpose |
|------|---------|
| `main.js` | Creates the Vue app, mounts `App.vue` into `#app`. |
| `App.vue` | Root layout: nav tabs (HelloWorld, Planner Pal, User form, etc.) and which child view is shown. |
| `components/HelloWorld.vue` | Simple demo: message, counter button, encouragement text. |
| `components/PlannerPal.vue` | Capstone-style profile UI: load/edit, validation, errors, loading state. |
| `components/UserForm.vue` | Create-user form with validation and simulated async submit. |
| `components/UserProfile.vue` | Displays a user object; props, computeds, follow action. |
| `components/DataFetcher.vue` | Fetches paginated user list; loading/error/empty states. |
| `services/plannerPalApi.js` | `fetch` helpers for planner profile API (`GET` / `PUT`). |
| `utils/validator.js` | `UserValidator` and `DateHelper` used by `UserForm` (and mocked in tests). |

---

## `tests/` — Vitest tests

| File | What it tests |
|------|----------------|
| `setup.js` | Global Vitest setup (runs before tests; e.g. matchers, env). |
| `HelloWorld.test.js` | Basic `HelloWorld` behavior. |
| `HelloWorld.enhanced.test.js` | Deeper `HelloWorld` scenarios (props, edge cases). |
| `UserForm.test.js` | `UserForm.vue` with mocked validator/date helpers and submit flows. |
| `UserProfile.test.js` | `UserProfile.vue` props, UI, and validation-related behavior. |
| `UserProfile.helpers.test.js` | Same component using shared helpers from `tests/utils/test-helpers.js`. |
| `DataFetcher.test.js` | `DataFetcher.vue` and mocked `fetch` / list behavior. |
| `PlannerPal.test.js` | `PlannerPal.vue` (states, edit/save, validation). |
| `plannerPalApi.test.js` | `src/services/plannerPalApi.js` in isolation. |
| `utils/test-helpers.js` | Reusable helpers: mount patterns, `testComputedProperty`, `testMethod`, event helpers, etc. |

---

## `e2e/` — Playwright tests

| File | Purpose |
|------|---------|
| `example.spec.js` | E2E smoke: page title, HelloWorld counter on home, small viewport checks. |
| `planner-pal.spec.js` | E2E flows for Planner Pal: view/edit, validation, API errors (via `page.route`), responsive check. |

Playwright reads **`playwright.config.js`** for `baseURL`, `webServer` (`npm run dev`), and **Chromium-only** project settings.

---

## `examples/` — optional samples

Not wired into `App.vue` by default; copy patterns from here when learning.

| Path | Purpose |
|------|---------|
| `components/Counter.vue` | Sample counter component (increment/decrement/reset). |
| `tests/Counter.test.js` | Vitest tests for that counter. |
| `e2e/counter.spec.js` | Example Playwright spec for the counter (reference). |

---

## Root config and entry files

| File | Purpose |
|------|---------|
| `index.html` | Vite entry HTML; sets page title and loads `/src/main.js`. |
| `vite.config.js` | **Vite**: Vue plugin, aliases, dev server port **3000**, optional **API mock** for planner profile. **Vitest**: `environment: jsdom`, test globs, `setupFiles`, **coverage** include/exclude. |
| `playwright.config.js` | **Playwright**: test directory `e2e/`, `baseURL`, `webServer`, **Chromium** project, reporters. |
| `package.json` | Scripts: `dev`, `build`, `test`, `test:run`, `test:coverage`, `test:e2e`, `test:e2e:install`, etc. |
| `README.md` | Install, run app, run tests, link to `docs/`. |

---

## Quick “where do I change X?”

| Goal | Primary location |
|------|------------------|
| Change UI or behavior of a screen | `src/components/*.vue`, `src/App.vue` |
| Add or change REST calls for Planner Pal | `src/services/plannerPalApi.js`, mock in `vite.config.js` |
| Add a Vitest test | `tests/*.test.js` (and optionally `tests/utils/test-helpers.js`) |
| Add an E2E scenario | `e2e/*.spec.js` |
| Change how tests run | `vite.config.js` (Vitest), `playwright.config.js` (E2E) |
| Teach / read the course | `docs/README.md` and numbered subfolders |
