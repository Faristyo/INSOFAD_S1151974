describe("Buy 2 items and then return 1 from them", () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear();
      win.localStorage.clear();
    });

    cy.intercept("POST", "http://localhost:8080/api/auth/login", {
      fixture: "../fixtures/3-client-buy-item/bobLogin",
    });
    cy.intercept("GET", "http://localhost:8080/api/products", {
      fixture: "../fixtures/3-client-buy-item/products",
    });
    cy.intercept("GET", "http://localhost:8080/api/orders/history", {
      fixture: "../fixtures/3-client-buy-item/history",
    });
  });

  // login
  it("Login", () => {
    cy.visit("http://localhost:4200/auth/login");
    cy.url().should("include", "login");
    cy.get('[formControlName="email"]').type("bob@bobsluxuryenterprise.com");
    cy.get('[formControlName="password"]').type("IreallyL0vePupp1es!");
    cy.get('button[type="submit"]').click();
    cy.get("Log Out").should("not.exist");
  });

  // buy products
  it("Go to products page & buy products", () => {
    cy.visit("http://localhost:4200/products");
    cy.get('[data-cy="buy-btn"]').first().click();
    cy.get('[data-cy="buy-btn"]').eq(1).click();
    cy.get('[data-cy="cart-link"]').should("contain", "Cart (2)");
  });

  // checkout
  it("Go to cart and perform checkout", () => {
    // just to reload state
    cy.visit("http://localhost:4200/auth/login");
    cy.url().should("include", "login");
    cy.get('[formControlName="email"]').type("bob@bobsluxuryenterprise.com");
    cy.get('[formControlName="password"]').type("IreallyL0vePupp1es!");
    
    cy.visit("http://localhost:4200/cart");

    cy.get('[data-cy="checkout-btn"]').click();
    // Wait for the alert to be called and close it
    cy.on("window:alert", () => {
      // Do nothing, just let the alert close
    });
  });

  it("Go to order page & return order", () => {
    // just to re-init services as route guard is used in this
    cy.visit("http://localhost:4200/auth/login");
    cy.get('[formControlName="email"]').type("bob@bobsluxuryenterprise.com");
    cy.get('[formControlName="password"]').type("IreallyL0vePupp1es!");
    cy.get('button[type="submit"]').click();

    cy.visit("http://localhost:4200/order");
    cy.get('[data-cy="return-product"]').first().click();
    cy.get('.modal-body input[type="radio"]').first().check();
    // Enter text in the input field
    cy.get('.modal-body input[type="text"]').type("Your reason for return");
    // Submit the form
    cy.get(".modal-body form").submit();
    // mockUpdated data
    cy.intercept("GET", "http://localhost:8080/api/orders/history", {
      fixture: "../fixtures/3-client-buy-item/history2",
    });
  });

});
