# Cypress + Cucumber BDD

> Cuándo usarla: escribir o modificar archivos `.feature`, step definitions (`.js`), Page Objects, o fixtures. También al trabajar con Given/When/Then y el patrón Page Object Model.

## Convenciones generales

- **Gherkin en español**: los escenarios se escriben en español aunque las palabras clave pueden ser `Given`/`When`/`Then` (inglés) o `Dado`/`Cuando`/`Entonces` (español)
- **Co-localización**: cada `feature` tiene su step definitions en el mismo directorio:

  ```
  cypress/e2e/features/login/
    login.feature
    login.js
  ```

- **Tagging**: etiquetar escenarios con `@APP-XXXX` (ticket ID) y/o `@Regression`, `@Smoke`, etc.
- **ESM imports**: todas las step definitions usan `import`, no `require`

## Feature files (`.feature`)

```gherkin
Feature: Login en COTO Digital

  Background:
    Given Estoy en la página de login de COTO Digital

  @APP-1234 @Regression
  Scenario: Acceso exitoso con usuario y contraseña válidos
    When Ingreso un usuario válido
    And Ingreso una contraseña válida
    And Hago clic en el botón de ingresar
    Then Debería ver el nombre del usuario en el header
```

- `Background` se ejecuta antes de cada escenario del feature
- Usar `And` para pasos consecutivos del mismo tipo
- Los textos de los pasos deben ser legibles como lenguaje natural

## Step definitions (`.js`)

```js
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { loginPage } from "../../../support/pageObjects/LoginPage";
import { header } from "../../../support/pageObjects/Header";
import userData from "../../../fixtures/user.json";

Given("Estoy en la página de login de COTO Digital", () => {
  cy.visit(`/ingresar`);
});

When("Ingreso un usuario válido", () => {
  loginPage.typeUser(userData.validUsername);
});

Then("Debería ver el nombre del usuario en el header", () => {
  header.clickMenuBtn();
  header.getDropdownMenuTitle().should("contain.text", `Hola ${userData.validUsername}`);
});
```

- Los step definitions se resuelven desde `cypress/e2e/**/*.js` y `cypress/support/step_definitions/**/*.js`
- Importar Page Objects y fixtures al inicio del archivo
- Usar `cy.visit()` con rutas relativas (el `baseUrl` se configura en `cypress.config.js`)
- No hay expresión regular en los strings — se usa匹配 exacta de texto

## Page Object Model

```js
// cypress/support/pageObjects/LoginPage.js
export class LoginPage {
  elements = {
    usernameInput: () => cy.get("input[id=login]"),
    passwordInput: () => cy.get("input[id=password]"),
    loginBtn: () => cy.get("form.ng-dirty > .pt-2 > .btn"),
    loginError: () => cy.get(".ng-trigger"),
  };

  getUsernameInput() {
    return this.elements.usernameInput();
  }

  typeUser(username) {
    this.getUsernameInput().type(username);
  }

  clickLoginBtn() {
    this.getLoginBtn().click();
  }
}

export const loginPage = new LoginPage();
```

- Cada Page Object es una **ES6 class** con:
  - Propiedad `elements` con funciones flecha que retornan selectores
  - Métodos `get*()` para exponer elementos
  - Métodos de acción (`type*()`, `click*()`, etc.) que encapsulan interacciones
- Se exporta una **instancia singleton** (`export const loginPage = new LoginPage()`)
- Los selectores CSS deben ser específicos pero mantenibles. Preferir `data-*` attributes cuando estén disponibles

## Fixtures

```json
{
  "validUsername": "BOT3",
  "validPassword": "12345678",
  "invalidUsername": "usuario-incorrecto"
}
```

- Archivos JSON planos en `cypress/fixtures/`
- Se importan vía ESM directa: `import data from "../../../fixtures/user.json"`
- NO usar `cy.fixture()` — en step definitions ESM se prefiere import estático

## Logging y debug

- `cypress-terminal-report` captura automáticamente `cy:command`, `cy:log`, `console.*` a `logs/out.txt`
- Allure adjunta screenshots y videos automáticamente en caso de fallo
- Plugins adicionales disponibles: `cypress-plugin-api`, `cypress-plugin-steps`, `cypress-plugin-xhr-toggle`
- Helper `Cypress.fechaAR(offset)` disponible globalmente para fechas en timezone Argentina

## Gotchas

- Los selectores `input[id=login]` son frágiles — ante cambios en el DOM, actualizar los Page Objects
- El texto de error debe coincidir exactamente: `"Alguno de los datos ingresados no es correcto. Verifica e intentalo nuevamente."`
- Los step definitions NO soportan regex — solo coincidencia exacta del string del paso
- No mezclar `require()` con `import` en step definitions (ESBuild falla)
