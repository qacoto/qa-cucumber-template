export class Header {
  elements = {
    menuBtn: () => cy.get("#dropdownMenuButton1 > .mobile"),
    dropdownMenuTitle: () => cy.get("span[class=dropdown-profile-drop]"),
  };

  getMenuBtn() {
    return this.elements.menuBtn();
  }

  getDropdownMenuTitle() {
    return this.elements.dropdownMenuTitle();
  }

  clickMenuBtn() {
    this.getMenuBtn().click();
  }
}

export const header = new Header();
