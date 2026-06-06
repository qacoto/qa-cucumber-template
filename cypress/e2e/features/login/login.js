import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { loginPage } from "../../../support/pageObjects/LoginPage";
import { inventoryPage } from "../../../support/pageObjects/InventoryPage";

Given("Estoy en la página de login de SauceDemo", () => {
  cy.visit("/");
});

When("Ingreso el usuario {string}", (username) => {
  loginPage.typeUser(username);
});

When("Ingreso la contraseña {string}", (password) => {
  loginPage.typePassword(password);
});

When("Hago clic en el botón de login", () => {
  loginPage.clickLoginBtn();
});

Then("Debería ver la página de inventario", () => {
  inventoryPage.verifyPageLoaded();
});

Then("Se muestra un mensaje de error", () => {
  loginPage.getLoginError().should("be.visible");
});

Then("Se muestra el mensaje {string}", (expectedMessage) => {
  loginPage.getLoginError().should("be.visible").and("have.text", expectedMessage);
});
