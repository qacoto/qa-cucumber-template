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
}

export const loginPage = new LoginPage();
