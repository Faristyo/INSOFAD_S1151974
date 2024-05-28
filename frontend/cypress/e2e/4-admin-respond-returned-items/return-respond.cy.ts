describe("Buy 2 items and then return 1 from them", () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear();
      win.localStorage.clear();
    });

    cy.intercept("POST", "http://localhost:8080/api/auth/login", {
      fixture: "../fixtures/4-admin-respond-returned-items/adminLogin",
    });
    cy.intercept("GET", "http://localhost:8080/api/orders/allhistory", {
      fixture: "../fixtures/4-admin-respond-returned-items/allOrder",
    });
    cy.intercept("GET", "http://localhost:8080/api/orders/approve", {
      fixture: "../fixtures/4-admin-respond-returned-items/approved",
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

  it("Search Orders", () => {
    cy.visit("http://localhost:4200/auth/login");
    cy.get('[formControlName="email"]').type("bob@bobsluxuryenterprise.com");
    cy.get('[formControlName="password"]').type("IreallyL0vePupp1es!");
    cy.get('button[type="submit"]').click();

    cy.visit("http://localhost:4200/admin");

    cy.get('[data-cy="search-order"]').type("1");
    cy.wait(1000);
  });

  // buy products
  it("Approve Order", () => {
    cy.visit("http://localhost:4200/auth/login");
    cy.get('[formControlName="email"]').type("bob@bobsluxuryenterprise.com");
    cy.get('[formControlName="password"]').type("IreallyL0vePupp1es!");
    cy.get('button[type="submit"]').click();

    cy.visit("http://localhost:4200/admin");
    cy.get('[data-cy="good-condition-btn"]').first().click();
    cy.wait(500);
  });
});
