# Vue testing fundamentals

Vue 3 + Vite project focused on **Vitest** (unit/component tests) and **Playwright** (E2E). Course-style notes live under **`docs/`**.

## Quick start

```bash
npm install
npm run dev              # http://localhost:3000
npm run test:run         # Vitest once
npm run test:e2e:install # Playwright Chromium (first time only)
npm run test:e2e
```

## Project structure

```
├── docs/           # Setup, unit testing, E2E, assignments
├── src/            # App and components
├── tests/          # Vitest tests (*.test.js)
├── e2e/            # Playwright specs
├── examples/       # Additional samples
├── vite.config.js  # Vite + Vitest + coverage
└── playwright.config.js
```

## Documentation

Open **[docs/README.md](docs/README.md)** for the full index.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server (port 3000, matches Playwright `baseURL`) |
| `npm run build` | Production build |
| `npm run test` | Vitest watch mode |
| `npm run test:run` | Vitest single run |
| `npm run test:coverage` | Coverage (see `vite.config.js`) |
| `npm run test:e2e` | Playwright |
| `npm run test:e2e:ui` | Playwright UI mode |
| `npm run test:e2e:install` | Install Chromium for Playwright |

## Notes

- If your project path contains a **colon** (`:`), some shells break `PATH` for local `node_modules/.bin` scripts. This repo uses explicit `node ./node_modules/...` entries in `package.json` to avoid that.
- Vitest is configured inside **`vite.config.js`** (not a separate `vitest.config.js`).
- **Playwright:** E2E uses **Chromium** only (see `playwright.config.js`). If the environment variable **`CI=1`** is set, Playwright always starts its own dev server; ensure port **3000** is free, or run with `env -u CI npm run test:e2e` to reuse an existing `npm run dev` on 3000.

## Links

- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
