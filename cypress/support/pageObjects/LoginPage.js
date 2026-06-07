export class LoginPage {
  get usernameInput() { return cy.get('input[data-test="username"]'); }
  get passwordInput() { return cy.get('input[data-test="password"]'); }
  get loginBtn() { return cy.get('input[data-test="login-button"]'); }
  get loginError() { return cy.get('h3[data-test="error"]'); }

  typeUser(username) {
    this.usernameInput.type(username);
  }

  typePassword(password) {
    this.passwordInput.type(password);
  }

  clickLoginBtn() {
    this.loginBtn.click();
  }

  clearFields() {
    this.usernameInput.clear();
    this.passwordInput.clear();
  }
}

export const loginPage = new LoginPage();