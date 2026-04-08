# Documentation

Hands-on notes for **Vue 3** testing with **Vitest**, **Vue Test Utils**, and **Playwright**.

## Contents

| Section | Description |
|---------|-------------|
| [01 — Testing setup](01-testing-setup/README.md) | Dependencies, `vite.config.js`, Playwright, project layout |
| [02 — Unit testing](02-unit-testing/README.md) | Components, props, events, mocks |
| [03 — E2E testing](03-e2e-testing/README.md) | Playwright flows, selectors, dev server |
| [04 — Assignments](04-assignments/README.md) | Practice ideas and extension projects |
| [Planner Pal sample](planner-pal.md) | In-repo profile component, tests, and commands |

## Repository layout

```
├── docs/                 # This documentation
├── src/                  # Application source
├── tests/                # Vitest unit / component tests
├── e2e/                  # Playwright specs
├── examples/             # Extra sample components and tests
├── vite.config.js        # Vite + Vitest + coverage
├── playwright.config.js
└── package.json
```

Start with **01-testing-setup**, then **02** and **03**, and use **04** when you want structured practice.
