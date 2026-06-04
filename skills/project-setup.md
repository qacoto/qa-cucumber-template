# Project Setup

> Cuándo usarla: setup inicial del proyecto, entender la estructura de directorios, instalar dependencias, ejecutar comandos npm por primera vez, o configurar herramientas locales.

## Stack

- **Cypress v15** (`cypress: 15.15.0`) — test runner e2e
- **Cucumber BDD** (`@badeball/cypress-cucumber-preprocessor: 24.x`) — BDD con Gherkin
- **Allure Reports** (`allure-cypress: 3.x`, `allure-commandline: 2.x`) — reportes visuales
- **ESBuild** (`@bahmutov/cypress-esbuild-preprocessor`) — bundler para step definitions ESM
- **Docker** (imagen base `cypress/included:15.15.0`) — contenedor para CI
- **Jenkins** — pipeline CI/CD

## Requisitos locales

- **Node.js** 18+ (compatible con Cypress 15)
- **Java JRE 8+** (necesario para Allure commandline local)
- **Docker Desktop** (opcional, para ejecutar tests en contenedor)

## Comandos npm

| Comando | Descripción |
|---|---|
| `npm run cy:open` | Abrir Cypress Runner interactivo |
| `npm run cy:run` | Ejecución headless (Electron) |
| `npm run cy:run:chrome` | Ejecución en Chrome (limpia reports previo) |
| `npm run cy:run:edge` | Ejecución en Edge (limpia reports previo) |
| `npm run cy:run:firefox` | Ejecución en Firefox (limpia reports previo) |
| `npm run cy:run:report` | clean → cy:run → report:allure |
| `npm run report:allure` | Generar reporte Allure single-file |
| `npm run report:serve` | Servir reporte Allure en puerto 8080 |
| `npm run allure:serve` | Servir reporte Allure via Allure dev server |
| `npm run clean` | Borrar `screenshots/`, `videos/`, `reports/` |

## Estructura de directorios

```
cypress/
  e2e/features/<feature-name>/
    <name>.feature        # Gherkin en español
    <name>.js              # Step definitions (ESM imports)
  support/
    pageObjects/           # Page Object classes (ES6 classes)
    commands/commands.js   # Custom Cypress commands
    e2e.js                 # Global setup, imports, dayjs AR tz
  fixtures/                # JSON test data (importados vía ESM)
```

## Configuración clave

- `baseUrl`: `https://testdigital3.redcoto.com.ar/sitios/cdigi`
- `specPattern`: `cypress/e2e/**/*.feature`
- `defaultCommandTimeout`: 20000ms
- `viewport`: 1920×1080
- `chromeWebSecurity`: false
- `stepDefinitions`: `cypress/e2e/**/*.js` y `cypress/support/step_definitions/**/*.js`

## Gotchas

- `npm run clean` es destructivo — elimina screenshots, videos y reports sin recuperación
- Las step definitions usan **ESM `import`**, NO CommonJS `require`
- No hay servidor mock local — los tests apuntan a un staging externo
- Se requiere Java JRE 8+ para Allure local
- `cypress/support/commands/commands.js` está intencionalmente vacío
