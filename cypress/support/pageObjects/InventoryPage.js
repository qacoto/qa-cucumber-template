export class InventoryPage {
  get pageTitle() {
    return cy.get('span[data-test="title"]');
  }
  get burgerMenuBtn() {
    return cy.get('button[id="react-burger-menu-btn"]');
  }
  get shoppingCartLink() {
    return cy.get('.shopping_cart_link');
  }

  verifyPageLoaded() {
    this.pageTitle.should('contain.text', 'Products');
    this.burgerMenuBtn.should('be.visible');
    this.shoppingCartLink.should('be.visible');
  }
}

export const inventoryPage = new InventoryPage();
