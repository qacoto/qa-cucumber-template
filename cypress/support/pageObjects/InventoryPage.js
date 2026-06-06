export class InventoryPage {
  elements = {
    pageTitle: () => cy.get('span[data-test="title"]'),
    burgerMenuBtn: () => cy.get('button[id="react-burger-menu-btn"]'),
    shoppingCartLink: () => cy.get('a[class="shopping_cart_link"]'),
  };

  getPageTitle() {
    return this.elements.pageTitle();
  }

  getBurgerMenuBtn() {
    return this.elements.burgerMenuBtn();
  }

  getShoppingCartLink() {
    return this.elements.shoppingCartLink();
  }

  verifyPageLoaded() {
    this.getPageTitle().should("contain.text", "Products");
    this.getBurgerMenuBtn().should("be.visible");
    this.getShoppingCartLink().should("be.visible");
  }
}

export const inventoryPage = new InventoryPage();
