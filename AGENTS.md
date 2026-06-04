# AGENTS.md — qa-cucumber-template

## Stack
- **Cypress v15** (e2e) + **Cucumber BDD** (`@badeball/cypress-cucumber-preprocessor`) + **Allure Reports**
- ESBuild bundler for ESM step defs; `cypress-on-fix` bridges Cucumber + Cypress
- Docker (`cypress/included:15.15.0` + Java for Allure) / Jenkins CI

## Commands

| Command | What it does |
|---|---|
| `npm run cy:open` | Interactive Cypress runner |
| `npm run cy:run` | Headless run (Electron) |
| `npm run cy:run:chrome` | Chrome, triggers `clean` first |
| `npm run cy:run:edge` | Edge, triggers `clean` first |
| `npm run cy:run:firefox` | Firefox, triggers `clean` first |
| `npm run cy:run:report` | `clean && cy:run && report:allure` |
| `npm run report:allure` | Generate Allure HTML report (single-file) |
| `npm run report:serve` | Serve Allure report via http-server on :8080 |
| `npm run allure:serve` | Allure's own dev server |
| `npm run clean` | Rimraf `screenshots/`, `videos/`, `reports/` |

## Architecture

```
cypress/
  e2e/features/<feature-name>/
    <name>.feature        # Spanish Gherkin
    <name>.js              # Step definitions (ESM imports)
  support/
    pageObjects/           # Page Object classes (ES6)
    commands/commands.js   # Custom Cypress commands (empty)
    e2e.js                 # Global setup, plugin imports, dayjs AR tz
  fixtures/                # JSON test data
```

- Step defs resolved via `@badeball/cypress-cucumber-preprocessor` `stepDefinitions` in `package.json`: `cypress/e2e/**/*.js` and `cypress/support/step_definitions/**/*.js`
- `baseUrl`: `https://testdigital3.redcoto.com.ar/sitios/cdigi` (live staging — external target)
- `specPattern`: `cypress/e2e/**/*.feature`
- `defaultCommandTimeout`: 20s
- `viewport`: 1920×1080, `chromeWebSecurity: false`
- Video recording enabled, compression 32, screenshots on failure

## Conventions

- **Spanish Gherkin** — `Dado` / `Cuando` / `Entonces` (though current features use `Given`/`When`/`Then` with Spanish text)
- Step defs co-located with `.feature` files in the same directory
- Tag scenarios with ticket ID (`@APP-1234`) and/or suite (`@Regression`)
- Fixtures are plain JSON, imported via ESM in step defs
- Allure automatically attaches screenshots/videos on failure

## Docker

```bash
docker compose build
docker compose up -d
docker compose exec app npm run cy:run        # run tests
docker compose exec app npm run report:allure # generate report
docker compose down
```

Container stays alive via `tail -f /dev/null`; tests are `exec`'d in.

## CI (Jenkins)

Pipeline in `Jenkinsfile`:
1. `docker compose build` → up → `cy:run` → `report:allure` → copy artifacts via `docker cp` → Allure Jenkins Plugin publish → archive artifacts
2. Build is **UNSTABLE** (not FAILURE) when tests fail — `currentBuild.result` set to `'UNSTABLE'`
3. Requires **Allure Jenkins Plugin** installed, named `allure` in Managed Jenkins Tools

## Logging

- `cypress-terminal-report` captures all `cy:command`, `cy:log`, `cons:log/warn/error/info` to `logs/out.txt`
- Allure results dir: `cypress/reports/allure-results/`

## Gotchas

- Requires **Java JRE 8+** for Allure report generation locally
- `npm run clean` is destructive — wipes screenshots, videos, and reports
- Step defs use **ESM `import`** (via ESBuild), not CommonJS `require`
- Tests hit an external staging site — no local mock server
- `cypress/support/commands/commands.js` is intentionally empty (extend as needed)
