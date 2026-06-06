export class LoginPage {
  elements = {
    usernameInput: () => cy.get('input[data-test="username"]'),
    passwordInput: () => cy.get('input[data-test="password"]'),
    loginBtn: () => cy.get('input[data-test="login-button"]'),
    loginError: () => cy.get('h3[data-test="error"]'),
  };

  getUsernameInput() {
    return this.elements.usernameInput();
  }

  getPasswordInput() {
    return this.elements.passwordInput();
  }

  getLoginBtn() {
    return this.elements.loginBtn();
  }

  getLoginError() {
    return this.elements.loginError();
  }

  typeUser(username) {
    this.getUsernameInput().type(username);
  }

  typePassword(password) {
    this.getPasswordInput().type(password);
  }

  clickLoginBtn() {
    this.getLoginBtn().click();
  }

  clearFields() {
    this.getUsernameInput().clear();
    this.getPasswordInput().clear();
  }
}

export const loginPage = new LoginPage();
