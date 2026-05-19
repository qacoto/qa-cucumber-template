import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { loginPage } from "../../../support/pageObjects/LoginPage";
import { header } from "../../../support/pageObjects/Header";
import userData from "../../../fixtures/user.json";

const {
  validDni,
  validEmail,
  validUsername,
  validPassword,
  invalidDni,
  invalidEmail,
  invalidUsername,
  invalidPassword,
} = userData;

Given("Estoy en la página de login de COTO Digital", () => {
  cy.visit(`/ingresar`);
});

When("Ingreso un usuario válido", () => {
  loginPage.typeUser(validUsername);
});

When("Ingreso un email válido", () => {
  loginPage.typeUser(validEmail);
});

When("Ingreso un DNI válido", () => {
  loginPage.typeUser(validDni);
});

When("Ingreso una contraseña válida", () => {
  loginPage.typePassword(validPassword);
});

Then("Debería ver el nombre del usuario en el header", () => {
  header.clickMenuBtn();
  header.getDropdownMenuTitle().should("contain.text", `Hola ${validUsername}`);
});

When("Ingreso un usuario inválido", () => {
  loginPage.typeUser(invalidUsername);
});

When("Ingreso un email inválido", () => {
  loginPage.typeUser(invalidEmail);
});

When("Ingreso un DNI inválido", () => {
  loginPage.typeUser(invalidDni);
});

When("Ingreso una contraseña inválida", () => {
  loginPage.typePassword(invalidPassword);
});

When("Hago clic en el botón de ingresar", () => {
  loginPage.clickLoginBtn();
});

Then("Se muestra un mensaje de error", () => {
  loginPage
    .getLoginError()
    .should("be.visible")
    .and(
      "contain.text",
      "Alguno de los datos ingresados no es correcto. Verifica e intentalo nuevamente.",
    );
});
