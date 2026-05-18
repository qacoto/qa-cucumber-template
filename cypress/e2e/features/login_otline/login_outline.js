import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { loginPage } from "../../../support/pageObjects/LoginPage";
import { header } from "../../../support/pageObjects/Header";
import userData from "../../../fixtures/user.json";

// ---------- GIVEN ----------
Given("Estoy en la página de login de COTO Digital", () => {
  cy.visit("https://testdigital3.redcoto.com.ar/sitios/cdigi/ingresar");
});

// ---------- WHEN ----------
When("Ingreso un usuario {string} válido", (usuarioKey) => {
  const usuario = userData[usuarioKey];
  loginPage.typeUser(usuario);
});

When("Ingreso una contraseña {string} válida", (passwordKey) => {
  const password = userData[passwordKey];
  loginPage.typePassword(password);
});

When("Ingreso un usuario {string} incorrecto", (usuarioKey) => {
  const usuario = userData[usuarioKey];
  loginPage.typeUser(usuario);
});

When("Ingreso una contraseña {string} incorrecta", (passwordKey) => {
  const password = userData[passwordKey];
  loginPage.typePassword(password);
});

When("Hago clic en el botón de ingresar", () => {
  loginPage.clickLoginBtn();
});

// ---------- THEN ----------
Then("Debería ver el nombre del usuario en el header", function () {
  header.clickMenuBtn();
  header
    .getDropdownMenuTitle()
    .should("contain.text", `Hola ${userData.validUsername}`);
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
