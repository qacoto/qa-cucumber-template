# QA Cucumber Template — Skills

Índice de habilidades disponibles para agentes que trabajen sobre este proyecto.

## Stack principal

- **Cypress v15** (e2e) + **Cucumber BDD** (`@badeball/cypress-cucumber-preprocessor`) + **Allure Reports**
- ESBuild bundler, ESM step definitions, `cypress-on-fix`
- Docker (`cypress/included:15.15.0` + Java) / Jenkins CI

## Habilidades

| Skill | Archivo | Cuándo usarla |
|---|---|---|
| **Project Setup** | [`project-setup.md`](project-setup.md) | Setup inicial, entender estructura del proyecto, comandos npm, dependencias |
| **Cypress + Cucumber BDD** | [`cypress-cucumber.md`](cypress-cucumber.md) | Escribir o modificar archivos `.feature`, step definitions (`.js`), Page Objects, fixtures |
| **Allure Reports** | [`allure-reports.md`](allure-reports.md) | Generar reportes Allure, servirlos localmente, debug de resultados de tests |
| **Docker Operations** | [`docker-operations.md`](docker-operations.md) | Build de imágenes, ejecutar tests en contenedores, manage del lifecycle Docker |
| **Jenkins CI** | [`jenkins-ci.md`](jenkins-ci.md) | Pipeline CI/CD, configurar stages, publicar reportes Allure en Jenkins |

## Cómo usar estas skills

Cada archivo contiene instrucciones autónomas y específicas del dominio. Un agente debería cargar la skill correspondiente cuando el usuario mencione o trabaje con archivos/tecnologías relacionados.
