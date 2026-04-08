# Planner Pal (sample project)

**Planner Pal** is a profile component used in this repo as an end-to-end example: loading state, view/edit modes, validation, API errors, unit tests, and Playwright E2E tests.

## Source

| Piece | Path |
|--------|------|
| Component | `src/components/PlannerPal.vue` |
| API helpers | `src/services/plannerPalApi.js` |
| App entry | Open the app and use the **Planner Pal** tab in `src/App.vue` |
| Dev API mock | `vite.config.js` (GET/PUT `/api/planner-profile/:id`) |

## Tests

```bash
npm run test:run -- tests/PlannerPal.test.js tests/plannerPalApi.test.js
npm run test:coverage -- tests/PlannerPal.test.js tests/plannerPalApi.test.js
npm run test:e2e:install
npm run test:e2e -- e2e/planner-pal.spec.js --project=chromium
```

E2E specs mock the profile API with `page.route` so parallel runs stay isolated.

## References

- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
