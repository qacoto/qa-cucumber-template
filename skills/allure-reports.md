# Allure Reports

> Cuándo usarla: generar reportes Allure, servir reportes localmente, debuggear resultados de tests, configurar Allure en CI, o entender la estructura de resultados.

## Comandos

| Comando | Descripción |
|---|---|
| `npm run report:allure` | Genera reporte HTML single-file desde `allure-results` |
| `npm run report:serve` | Sirve el reporte via `http-server` en puerto 8080 |
| `npm run allure:serve` | Sirve el reporte via Allure dev server (hot-reload) |
| `npm run cy:run:report` | clean → ejecutar tests → generate report |

## Configuración

### En `cypress.config.js`

```js
const { allureCypress } = require("allure-cypress/reporter");

module.exports = defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      allureCypress(on, config, {
        resultsDir: "cypress/reports/allure-results",
        links: [],
      });
      // ...
    },
  },
});
```

### En `cypress/support/e2e.js`

```js
import "allure-cypress";
```

## Estructura de resultados

```
cypress/reports/
  allure-results/     # Resultados XML/JSON crudos (generados por test run)
  allure-report/      # Reporte HTML single-file (generado por report:allure)
```

- `allure-results/` se genera automáticamente al ejecutar tests
- `allure-report/` se genera explícitamente con `npm run report:allure`

## Ciclo típico

```bash
# 1. Ejecutar tests
npm run cy:run

# 2. Generar reporte
npm run report:allure

# 3. Visualizar
npm run report:serve    # http://localhost:8080
# o
npm run allure:serve    # http://localhost:xxxx
```

## Reporte en CI (Jenkins)

```groovy
stage('Generate Allure report') {
  steps {
    sh 'docker compose exec app npm run report:allure || true'
  }
}

stage('Publish Allure report') {
  steps {
    allure([
      includeProperties: false,
      jdk: '',
      properties: [],
      reportBuildPolicy: 'ALWAYS',
      results: [[path: 'cypress/reports/allure-results']],
      commandline: 'allure'
    ])
  }
}
```

Requisito: Allure Jenkins Plugin instalado y configurado como herramienta `allure` en Managed Jenkins Tools.

## Attachments automáticos

- **Screenshots**: se adjuntan automáticamente al fallar un test (Cypress `screenshotOnRunFailure: true`)
- **Videos**: se adjuntan automáticamente al fallar un test (Cypress `video: true`)

## Requisito local

Java JRE 8+ debe estar instalado y accesible para que `allure-commandline` funcione.

## Gotchas

- `npm run report:allure` limpia el reporte anterior (`--clean` + `--single-file`)
- Los links en `allureCypress()` config están vacíos por defecto — se pueden agregar templates para vincular a Jira u otros sistemas
- Si el reporte no se genera, verificar que `allure-results/` contenga archivos después del test run
- En Docker, asegurarse de que Java esté instalado en la imagen (el `Dockerfile` ya incluye `default-jre`)
